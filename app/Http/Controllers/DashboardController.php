<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Department;
use App\Models\EmployeeShift;
use App\Models\TimeOffRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'employee') {
            $employee = Employee::where('user_id', $user->id)->first();
            $today = Carbon::today()->format('Y-m-d');
            
            // Employee specific stats
            $myAttendances = \App\Models\Attendance::where('employee_id', $employee->id)
                ->latest('date')
                ->take(5)
                ->get();
                
            $myPendingLeave = TimeOffRequest::where('employee_id', $employee->id)->where('status', 'Pending')->count();
            $myApprovedLeave = TimeOffRequest::where('employee_id', $employee->id)->where('status', 'Approved')->count();
            
            $myTodayShift = EmployeeShift::where('employee_id', $employee->id)->where('date', $today)->first();

            return Inertia::render('Dashboard', [
                'isEmployee' => true,
                'myAttendances' => $myAttendances,
                'myPendingLeave' => $myPendingLeave,
                'myApprovedLeave' => $myApprovedLeave,
                'myTodayShift' => $myTodayShift
            ]);
        }

        if ($user->role === 'manager') {
            $employee = Employee::where('user_id', $user->id)->first();
            $departmentId = $employee ? $employee->department_id : null;
            $today = Carbon::today()->format('Y-m-d');
            
            // Manager's own stats
            $myAttendances = \App\Models\Attendance::where('employee_id', $employee->id)
                ->latest('date')
                ->take(5)
                ->get();
            $myPendingLeave = TimeOffRequest::where('employee_id', $employee->id)->where('status', 'Pending')->count();
            $myApprovedLeave = TimeOffRequest::where('employee_id', $employee->id)->where('status', 'Approved')->count();
            $myTodayShift = EmployeeShift::where('employee_id', $employee->id)->where('date', $today)->first();

            // Team stats
            $teamEmployeesIds = Employee::where('department_id', $departmentId)->pluck('id');
            $teamPendingLeave = TimeOffRequest::whereIn('employee_id', $teamEmployeesIds)->where('status', 'Pending')->count();
            $teamPresentToday = EmployeeShift::whereIn('employee_id', $teamEmployeesIds)
                ->where('date', $today)
                ->where('shift_type', '!=', 'Off')
                ->count();
            
            $latestTeamRequests = TimeOffRequest::with('employee')
                ->whereIn('employee_id', $teamEmployeesIds)
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($req) {
                    return [
                        'id' => $req->id,
                        'employee_name' => $req->employee ? $req->employee->first_name . ' ' . $req->employee->last_name : 'Unknown',
                        'type' => $req->type,
                        'duration' => $req->duration,
                        'status' => $req->status,
                        'initials' => $req->employee ? strtoupper(substr($req->employee->first_name, 0, 1) . substr($req->employee->last_name, 0, 1)) : '?'
                    ];
                });

            return Inertia::render('Dashboard', [
                'isEmployee' => true,
                'isManager' => true,
                'myAttendances' => $myAttendances,
                'myPendingLeave' => $myPendingLeave,
                'myApprovedLeave' => $myApprovedLeave,
                'myTodayShift' => $myTodayShift,
                'teamPendingLeave' => $teamPendingLeave,
                'teamPresentToday' => $teamPresentToday,
                'latestTeamRequests' => $latestTeamRequests
            ]);
        }

        // Admin logic
        $totalEmployees = Employee::count();
        $departments = Department::withCount('employees')->get();
        
        $departmentStats = $departments->map(function ($dept) {
            return [
                'name' => $dept->name,
                'count' => $dept->employees_count,
            ];
        });

        $today = Carbon::today()->format('Y-m-d');

        // Hadir Hari Ini = total shifts for today that are not "Off"
        $totalPresentToday = EmployeeShift::where('date', $today)
            ->where('shift_type', '!=', 'Off')
            ->count();

        // Cuti / Izin (Pending) = total pending time off requests
        $totalPendingLeave = TimeOffRequest::where('status', 'Pending')->count();

        // Latest TimeOff requests to show on dashboard
        $latestRequests = TimeOffRequest::with('employee')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($req) {
                return [
                    'id' => $req->id,
                    'employee_name' => $req->employee ? $req->employee->first_name . ' ' . $req->employee->last_name : 'Unknown',
                    'type' => $req->type,
                    'duration' => $req->duration,
                    'status' => $req->status,
                    'initials' => $req->employee ? strtoupper(substr($req->employee->first_name, 0, 1) . substr($req->employee->last_name, 0, 1)) : '?'
                ];
            });

        return Inertia::render('Dashboard', [
            'isEmployee' => false,
            'totalEmployees' => $totalEmployees,
            'departmentStats' => $departmentStats,
            'totalPresentToday' => $totalPresentToday,
            'totalPendingLeave' => $totalPendingLeave,
            'latestRequests' => $latestRequests,
        ]);
    }
}
