<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TimeOffRequest;
use App\Models\Employee;
use Carbon\Carbon;

class OvertimeController extends Controller
{
    public function index(Request $request)
    {
        $statusFilter = $request->query('status', 'Pending'); // Pending, Approved, Rejected

        $user = \Illuminate\Support\Facades\Auth::user();
        $employee = Employee::where('user_id', $user->id)->first();
        
        $baseQuery = TimeOffRequest::query();
        
        if ($user->role === 'employee' && $employee) {
            $baseQuery->where('employee_id', $employee->id);
        } elseif ($user->role === 'manager' && $employee) {
            $baseQuery->whereHas('employee', function($q) use ($employee) {
                $q->where('department_id', $employee->department_id);
            });
        }

        // Counts for sidebar
        $counts = [
            'Pending' => $baseQuery->clone()->where('status', 'Pending')->count(),
            'Approved' => $baseQuery->clone()->where('status', 'Approved')->count(),
            'Rejected' => $baseQuery->clone()->where('status', 'Rejected')->count(),
        ];

        $requestsQuery = $baseQuery->with('employee')->where('status', $statusFilter)->orderBy('created_at', 'desc')->get();

        $requests = $requestsQuery->map(function ($req) {
            $dateFormatted = $req->end_date 
                ? $req->start_date->format('d M') . ' - ' . $req->end_date->format('d M Y')
                : $req->start_date->format('d M Y');

            return [
                'id' => 'REQ-' . str_pad($req->id, 3, '0', STR_PAD_LEFT),
                'raw_id' => $req->id,
                'name' => $req->employee->first_name . ' ' . $req->employee->last_name,
                'type' => $req->type,
                'date' => $dateFormatted,
                'time' => $req->duration,
                'reason' => $req->reason,
                'status' => $req->status,
                'img' => $req->employee->avatar_path ? asset('storage/' . $req->employee->avatar_path) : 'https://ui-avatars.com/api/?name=' . urlencode($req->employee->first_name . ' ' . $req->employee->last_name) . '&background=random'
            ];
        });

        // Fetch employees for manual request form
        $empQuery = Employee::query();
        if ($user->role === 'employee' && $employee) {
            $empQuery->where('id', $employee->id);
        } elseif ($user->role === 'manager' && $employee) {
            $empQuery->where('department_id', $employee->department_id);
        }
        
        $allEmployees = $empQuery->get()->map(function ($emp) {
            return [
                'id' => $emp->id,
                'name' => $emp->first_name . ' ' . $emp->last_name,
            ];
        });

        return Inertia::render('TimeAttendance/Overtime', [
            'isEmployee' => $user->role === 'employee',
            'requests' => $requests,
            'counts' => $counts,
            'currentFilter' => $statusFilter,
            'allEmployees' => $allEmployees
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'duration' => 'required|string|max:50',
            'reason' => 'required|string'
        ]);

        TimeOffRequest::create([
            'employee_id' => $request->employee_id,
            'type' => $request->type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'duration' => $request->duration,
            'reason' => $request->reason,
            'status' => 'Pending'
        ]);

        return redirect()->back()->with('success', 'Pengajuan berhasil dibuat.');
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Approved,Rejected'
        ]);

        $req = TimeOffRequest::findOrFail($id);
        $req->update(['status' => $request->status]);

        return redirect()->back();
    }
}
