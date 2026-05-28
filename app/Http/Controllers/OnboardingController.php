<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Employee;
use App\Models\OnboardingTask;

class OnboardingController extends Controller
{
    public function index()
    {
        $employees = Employee::with('onboardingTasks')->get()->map(function ($emp) {
            $totalTasks = $emp->onboardingTasks->count();
            $completedTasks = $emp->onboardingTasks->where('is_completed', true)->count();
            $progress = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

            return [
                'id' => $emp->id,
                'name' => $emp->first_name . ' ' . $emp->last_name,
                'role' => $emp->job_title,
                'progress' => $progress,
                'tasks' => $emp->onboardingTasks->map(function ($task) {
                    return [
                        'id' => $task->id,
                        'desc' => $task->description,
                        'done' => $task->is_completed,
                    ];
                })
            ];
        });

        // Filter out employees without tasks if we want, or keep them all. Let's keep those who have tasks or are recently joined (in realistic scenario). For now, keep all, or maybe only those who have tasks. Let's return all so we can add tasks to anyone.
        
        $activeOnboardings = $employees->filter(fn($e) => $e['progress'] < 100 && count($e['tasks']) > 0)->count();
        $completedOnboardings = $employees->filter(fn($e) => $e['progress'] == 100 && count($e['tasks']) > 0)->count();

        // Also we need raw employees list for dropdown
        $allEmployees = Employee::all()->map(function ($emp) {
            return [
                'id' => $emp->id,
                'name' => $emp->first_name . ' ' . $emp->last_name,
            ];
        });

        return Inertia::render('EmployeeLifecycle/Onboarding', [
            'onboardingTasks' => $employees->filter(fn($e) => count($e['tasks']) > 0)->values(), // Only show employees with tasks on the cards
            'allEmployees' => $allEmployees,
            'stats' => [
                'active' => $activeOnboardings,
                'completed' => $completedOnboardings,
                'delayed' => 0 // Dummy for now
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'description' => 'required|string|max:255',
        ]);

        OnboardingTask::create([
            'employee_id' => $request->employee_id,
            'description' => $request->description,
            'is_completed' => false,
        ]);

        return redirect()->back();
    }

    public function toggle(Request $request, $id)
    {
        $task = OnboardingTask::findOrFail($id);
        $task->update([
            'is_completed' => $request->is_completed
        ]);

        return redirect()->back();
    }
}
