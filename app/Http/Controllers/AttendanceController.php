<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index()
    {
        // For simulation, if we are logged in as admin, let's grab the first employee to act as our self for clocking in/out
        // In a real app, Auth::user()->employee would be used
        $employee = Employee::where('user_id', Auth::id())->first();
        
        $today = Carbon::today()->format('Y-m-d');
        
        // My Attendance today
        $myAttendanceToday = null;
        if ($employee) {
            $myAttendanceToday = Attendance::where('employee_id', $employee->id)
                ->where('date', $today)
                ->first();
        }

        // All Attendances today
        $user = Auth::user();
        
        $query = Attendance::with(['employee', 'employee.department'])
            ->where('date', $today);

        if ($user->role === 'employee') {
            // Employees don't need to see everyone's attendance list
            $query->where('employee_id', -1); // returns empty
        } elseif ($user->role === 'manager' && $employee) {
            // Managers only see their department
            $query->whereHas('employee', function($q) use ($employee) {
                $q->where('department_id', $employee->department_id);
            });
        }

        $allAttendancesToday = $query->latest()
            ->get()
            ->map(function ($att) {
                return [
                    'id' => $att->id,
                    'employee_name' => $att->employee->first_name . ' ' . $att->employee->last_name,
                    'department' => $att->employee->department ? $att->employee->department->name : '-',
                    'clock_in' => $att->clock_in,
                    'clock_out' => $att->clock_out,
                    'status' => ucfirst($att->status),
                    'work_hours' => $att->work_hours ? $att->work_hours . ' hrs' : '-',
                    'photo_in' => $att->photo_in ? asset('storage/' . $att->photo_in) : null,
                    'photo_out' => $att->photo_out ? asset('storage/' . $att->photo_out) : null,
                    'lat_in' => $att->lat_in,
                    'lng_in' => $att->lng_in,
                    'lat_out' => $att->lat_out,
                    'lng_out' => $att->lng_out,
                ];
            });

        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();

        $stats = null;
        if ($user->role !== 'employee') {
            $stats = [
                'present' => $query->clone()->where('status', 'present')->count(),
                'late' => $query->clone()->where('status', 'late')->count(),
                'absent' => $query->clone()->where('status', 'absent')->count(),
            ];
        }

        return Inertia::render('TimeAttendance/LiveAttendance', [
            'isEmployee' => $user->role === 'employee',
            'myAttendanceToday' => $myAttendanceToday,
            'allAttendancesToday' => $allAttendancesToday,
            'settings' => $settings,
            'stats' => $stats
        ]);
    }

    public function clockIn(Request $request)
    {
        $employee = Employee::where('user_id', Auth::id())->first();
        if (!$employee) {
            return redirect()->back()->withErrors('You are not an employee.');
        }

        $today = Carbon::today()->format('Y-m-d');
        
        $attendance = Attendance::where('employee_id', $employee->id)->where('date', $today)->first();
        
        if ($attendance) {
            return redirect()->back()->withErrors('Already clocked in today.');
        }

        // Determine if late (assuming 09:00:00 is limit)
        $now = Carbon::now();
        $status = $now->format('H:i:s') > '09:00:00' ? 'late' : 'present';

        $request->validate([
            'photo' => 'required|string',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        $photoData = $request->input('photo');
        $photoData = str_replace('data:image/jpeg;base64,', '', $photoData);
        $photoData = str_replace(' ', '+', $photoData);
        $photoData = base64_decode($photoData);

        $photoFileName = 'attendances/in_' . $employee->id . '_' . time() . '.jpg';
        \Illuminate\Support\Facades\Storage::disk('public')->put($photoFileName, $photoData);

        Attendance::create([
            'employee_id' => $employee->id,
            'date' => $today,
            'clock_in' => $now->format('H:i:s'),
            'status' => $status,
            'photo_in' => $photoFileName,
            'lat_in' => $request->input('lat'),
            'lng_in' => $request->input('lng'),
        ]);

        return redirect()->back();
    }

    public function clockOut(Request $request)
    {
        $employee = Employee::where('user_id', Auth::id())->first();
        if (!$employee) {
            return redirect()->back()->withErrors('You are not an employee.');
        }

        $today = Carbon::today()->format('Y-m-d');
        
        $attendance = Attendance::where('employee_id', $employee->id)->where('date', $today)->first();
        
        if (!$attendance || !$attendance->clock_in) {
            return redirect()->back()->withErrors('You must clock in first.');
        }

        $now = Carbon::now();
        
        // Calculate work hours
        $clockIn = Carbon::parse($today . ' ' . $attendance->clock_in);
        $workHours = round($clockIn->diffInMinutes($now) / 60, 2);

        $request->validate([
            'photo' => 'required|string',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        $photoData = $request->input('photo');
        $photoData = str_replace('data:image/jpeg;base64,', '', $photoData);
        $photoData = str_replace(' ', '+', $photoData);
        $photoData = base64_decode($photoData);

        $photoFileName = 'attendances/out_' . $employee->id . '_' . time() . '.jpg';
        \Illuminate\Support\Facades\Storage::disk('public')->put($photoFileName, $photoData);

        $attendance->update([
            'clock_out' => $now->format('H:i:s'),
            'work_hours' => $workHours,
            'photo_out' => $photoFileName,
            'lat_out' => $request->input('lat'),
            'lng_out' => $request->input('lng'),
        ]);

        return redirect()->back();
    }

    public function exportCsv(Request $request)
    {
        $date = $request->query('date', \Carbon\Carbon::today()->format('Y-m-d'));
        
        $attendances = \App\Models\Attendance::with(['employee', 'employee.department'])
            ->where('date', $date)
            ->get();

        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=attendance_$date.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        $columns = array('ID', 'Employee Code', 'Name', 'Department', 'Date', 'Clock In', 'Clock Out', 'Work Hours');

        $callback = function() use($attendances, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($attendances as $att) {
                $row['ID']  = $att->id;
                $row['Employee Code']    = $att->employee->employee_code ?? '-';
                $row['Name']    = ($att->employee->first_name ?? '') . ' ' . ($att->employee->last_name ?? '');
                $row['Department']  = $att->employee->department ? $att->employee->department->name : '-';
                $row['Date']  = $att->date;
                $row['Clock In']  = $att->clock_in ?? '-';
                $row['Clock Out']  = $att->clock_out ?? '-';
                $row['Work Hours']  = $att->work_hours ?? 0;

                fputcsv($file, array($row['ID'], $row['Employee Code'], $row['Name'], $row['Department'], $row['Date'], $row['Clock In'], $row['Clock Out'], $row['Work Hours']));
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
