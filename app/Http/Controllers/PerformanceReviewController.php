<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PerformanceReview;
use App\Models\Employee;

class PerformanceReviewController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->query('period', 'Q1-2026');
        
        $reviews = PerformanceReview::with(['employee', 'employee.department', 'reviewer'])
            ->where('period', $period)
            ->latest()
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'employee_id' => $review->employee_id,
                    'period' => $review->period,
                    'employee_name' => $review->employee->first_name . ' ' . $review->employee->last_name,
                    'department' => $review->employee->department ? $review->employee->department->name : '-',
                    'job_title' => $review->employee->job_title,
                    'reviewer_name' => $review->reviewer ? $review->reviewer->first_name . ' ' . $review->reviewer->last_name : 'System/Admin',
                    'score' => $review->score,
                    'feedback' => $review->feedback,
                    'status' => ucfirst($review->status),
                ];
            });

        // Basic stats
        $totalScores = $reviews->sum('score');
        $count = $reviews->count();
        $averageScore = $count > 0 ? round($totalScores / $count, 1) : 0;
        
        $topPerformers = $reviews->sortByDesc('score')->take(3)->values();
        
        $employees = Employee::all()->map(function($emp) {
            return [
                'id' => $emp->id,
                'name' => $emp->first_name . ' ' . $emp->last_name,
            ];
        });
        
        return Inertia::render('TalentPerformance/KPI', [
            'reviews' => $reviews,
            'currentPeriod' => $period,
            'employees' => $employees,
            'stats' => [
                'average_score' => $averageScore,
                'completed_reviews' => $reviews->where('status', 'Completed')->count(),
                'total_reviews' => $count,
                'top_performers' => $topPerformers
            ]
        ]);
    }

    public function feedback(Request $request)
    {
        $period = $request->query('period', 'Q1-2026');
        
        $reviews = PerformanceReview::with(['employee', 'reviewer'])
            ->where('period', $period)
            ->whereNotNull('feedback')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'employee_name' => $review->employee->first_name . ' ' . $review->employee->last_name,
                    'reviewer_name' => $review->reviewer ? $review->reviewer->first_name . ' ' . $review->reviewer->last_name : 'System/Admin',
                    'score' => $review->score,
                    'feedback' => $review->feedback,
                    'status' => ucfirst($review->status),
                ];
            });

        return Inertia::render('TalentPerformance/Feedback', [
            'reviews' => $reviews,
            'currentPeriod' => $period
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'period' => 'required|string|max:20',
            'score' => 'required|integer|min:0|max:100',
            'feedback' => 'nullable|string',
            'status' => 'required|in:pending,completed'
        ]);

        $reviewer = Employee::where('user_id', \Illuminate\Support\Facades\Auth::id())->first();

        PerformanceReview::create([
            'employee_id' => $request->employee_id,
            'reviewer_id' => $reviewer ? $reviewer->id : null,
            'period' => $request->period,
            'score' => $request->score,
            'feedback' => $request->feedback,
            'status' => $request->status,
        ]);

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $review = PerformanceReview::findOrFail($id);

        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'period' => 'required|string|max:20',
            'score' => 'required|integer|min:0|max:100',
            'feedback' => 'nullable|string',
            'status' => 'required|in:pending,completed'
        ]);

        $review->update([
            'employee_id' => $request->employee_id,
            'period' => $request->period,
            'score' => $request->score,
            'feedback' => $request->feedback,
            'status' => $request->status,
        ]);

        return redirect()->back();
    }

    public function destroy($id)
    {
        $review = PerformanceReview::findOrFail($id);
        $review->delete();

        return redirect()->back();
    }
}
