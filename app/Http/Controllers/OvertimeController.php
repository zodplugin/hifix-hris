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

        $requestsQuery = $baseQuery->with(['employee', 'leaveType'])->where('status', $statusFilter)->orderBy('created_at', 'desc')->get();

        $requests = $requestsQuery->map(function ($req) {
            $dateFormatted = $req->end_date 
                ? $req->start_date->format('d M') . ' - ' . $req->end_date->format('d M Y')
                : $req->start_date->format('d M Y');

            $displayType = $req->leaveType ? $req->leaveType->name : $req->type;

            return [
                'id' => 'REQ-' . str_pad($req->id, 3, '0', STR_PAD_LEFT),
                'raw_id' => $req->id,
                'name' => $req->employee->first_name . ' ' . $req->employee->last_name,
                'type' => $displayType,
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

        // Fetch leave balances for this employee
        $leaveBalances = [];
        if ($employee) {
            $leaveBalances = \App\Models\LeaveBalance::with('leaveType')
                ->where('employee_id', $employee->id)
                ->get()
                ->map(function ($bal) {
                    return [
                        'leave_type_id' => $bal->leave_type_id,
                        'name' => $bal->leaveType->name,
                        'code' => $bal->leaveType->code,
                        'quota' => $bal->quota,
                        'used' => $bal->used,
                        'remaining' => max(0, $bal->quota - $bal->used),
                    ];
                });
        }

        // Fetch all active leave types
        $leaveTypes = \App\Models\LeaveType::all()->map(function ($lt) {
            return [
                'id' => $lt->id,
                'name' => $lt->name,
                'code' => $lt->code,
            ];
        });

        // Fetch approved leave requests for the calendar view
        $approvedLeaves = TimeOffRequest::with('employee')
            ->where('status', 'Approved')
            ->whereNotNull('leave_type_id')
            ->get()
            ->map(function ($req) {
                return [
                    'id' => $req->id,
                    'name' => $req->employee->first_name . ' ' . $req->employee->last_name,
                    'start_date' => $req->start_date->format('Y-m-d'),
                    'end_date' => $req->end_date ? $req->end_date->format('Y-m-d') : $req->start_date->format('Y-m-d'),
                    'type' => $req->leaveType ? $req->leaveType->name : $req->type,
                ];
            });

        return Inertia::render('TimeAttendance/Overtime', [
            'isEmployee' => $user->role === 'employee',
            'requests' => $requests,
            'counts' => $counts,
            'currentFilter' => $statusFilter,
            'allEmployees' => $allEmployees,
            'leaveBalances' => $leaveBalances,
            'leaveTypes' => $leaveTypes,
            'approvedLeaves' => $approvedLeaves,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'type' => 'required|string',
            'leave_type_id' => 'nullable|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'duration' => 'required|string|max:50',
            'reason' => 'required|string'
        ]);

        if ($request->leave_type_id) {
            $balance = \App\Models\LeaveBalance::where('employee_id', $request->employee_id)
                ->where('leave_type_id', $request->leave_type_id)
                ->first();

            $days = 1;
            if ($request->end_date) {
                $start = Carbon::parse($request->start_date);
                $end = Carbon::parse($request->end_date);
                $days = max(1, $start->diffInDays($end) + 1);
            } else {
                if (preg_match('/(\d+)\s*Hari/i', $request->duration, $matches)) {
                    $days = (int) $matches[1];
                }
            }

            if ($balance && ($balance->quota - $balance->used) < $days) {
                return redirect()->back()->withErrors(['error' => 'Insufficient leave quota. Remaining: ' . ($balance->quota - $balance->used) . ' days.']);
            }
        }

        $req = TimeOffRequest::create([
            'employee_id' => $request->employee_id,
            'type' => $request->type,
            'leave_type_id' => $request->leave_type_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'duration' => $request->duration,
            'reason' => $request->reason,
            'status' => 'Pending'
        ]);

        // Trigger Notification to Manager and Admin/HR
        try {
            $req->load(['employee', 'leaveType']);
            $recipients = \App\Models\User::whereIn('role', ['admin', 'hr'])->get();
            
            $employee = $req->employee;
            if ($employee && $employee->department_id) {
                $dept = \App\Models\Department::find($employee->department_id);
                if ($dept && $dept->manager_id) {
                    $managerUser = \App\Models\User::find($dept->manager_id);
                    if ($managerUser) {
                        $recipients = $recipients->push($managerUser);
                    }
                }
            }
            
            $recipients = $recipients->unique('id')->filter(fn($u) => $u->id !== auth()->id());
            
            if ($recipients->isNotEmpty()) {
                \Illuminate\Support\Facades\Notification::send($recipients, new \App\Notifications\LeaveRequestSubmitted($req));
            }
        } catch (\Exception $e) {
            \Log::error('Notification Error: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Request submitted successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Approved,Rejected'
        ]);

        $req = TimeOffRequest::findOrFail($id);
        $oldStatus = $req->status;
        $req->update(['status' => $request->status]);

        // If status changed to Approved and it is a leave request, deduct quota
        if ($request->status === 'Approved' && $oldStatus !== 'Approved' && $req->leave_type_id) {
            $balance = \App\Models\LeaveBalance::where('employee_id', $req->employee_id)
                ->where('leave_type_id', $req->leave_type_id)
                ->first();

            if ($balance) {
                $days = 1;
                if ($req->end_date) {
                    $days = max(1, Carbon::parse($req->start_date)->diffInDays(Carbon::parse($req->end_date)) + 1);
                } else {
                    if (preg_match('/(\d+)\s*Hari/i', $req->duration, $matches)) {
                        $days = (int) $matches[1];
                    }
                }
                $balance->increment('used', $days);
            }
        }

        // If status changed to Approved and it is weekend Overtime (Lembur), grant Off-in-Lieu leave quota
        if ($request->status === 'Approved' && $oldStatus !== 'Approved' && $req->type === 'Lembur') {
            $dayOfWeek = Carbon::parse($req->start_date)->dayOfWeek;
            if ($dayOfWeek === Carbon::SATURDAY || $dayOfWeek === Carbon::SUNDAY) {
                $offInLieuType = \App\Models\LeaveType::where('code', 'off-in-lieu')->first();
                if ($offInLieuType) {
                    $balance = \App\Models\LeaveBalance::firstOrCreate([
                        'employee_id' => $req->employee_id,
                        'leave_type_id' => $offInLieuType->id,
                    ], [
                        'quota' => 0,
                        'used' => 0,
                    ]);
                    $balance->increment('quota', 1);
                }
            }
        }

        // If status was Approved and now it is Rejected, refund quota
        if ($request->status === 'Rejected' && $oldStatus === 'Approved') {
            if ($req->leave_type_id) {
                $balance = \App\Models\LeaveBalance::where('employee_id', $req->employee_id)
                    ->where('leave_type_id', $req->leave_type_id)
                    ->first();

                if ($balance) {
                    $days = 1;
                    if ($req->end_date) {
                        $days = max(1, Carbon::parse($req->start_date)->diffInDays(Carbon::parse($req->end_date)) + 1);
                    } else {
                        if (preg_match('/(\d+)\s*Hari/i', $req->duration, $matches)) {
                            $days = (int) $matches[1];
                        }
                    }
                    $balance->decrement('used', $days);
                }
            }

            // Deduct Off-in-Lieu if weekend Overtime is rejected after being approved
            if ($req->type === 'Lembur') {
                $dayOfWeek = Carbon::parse($req->start_date)->dayOfWeek;
                if ($dayOfWeek === Carbon::SATURDAY || $dayOfWeek === Carbon::SUNDAY) {
                    $offInLieuType = \App\Models\LeaveType::where('code', 'off-in-lieu')->first();
                    if ($offInLieuType) {
                        $balance = \App\Models\LeaveBalance::where('employee_id', $req->employee_id)
                            ->where('leave_type_id', $offInLieuType->id)
                            ->first();
                        if ($balance && $balance->quota > 0) {
                            $balance->decrement('quota', 1);
                        }
                    }
                }
            }
        }

        // Trigger Status Notification to employee
        try {
            $req->load(['employee', 'leaveType']);
            $employee = $req->employee;
            if ($employee && $employee->user_id) {
                $employeeUser = \App\Models\User::find($employee->user_id);
                if ($employeeUser) {
                    $employeeUser->notify(new \App\Notifications\LeaveRequestStatusUpdated($req));
                }
            }
        } catch (\Exception $e) {
            \Log::error('Notification Error: ' . $e->getMessage());
        }

        return redirect()->back();
    }
}
