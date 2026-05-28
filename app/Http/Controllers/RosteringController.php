<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Employee;
use App\Models\EmployeeShift;
use Carbon\Carbon;

class RosteringController extends Controller
{
    public function index(Request $request)
    {
        // Get start date from request, default to this week's Monday
        $startDate = $request->query('start_date');
        $start = $startDate ? Carbon::parse($startDate)->startOfDay() : Carbon::now()->startOfWeek();
        
        $dates = [];
        $dateStrings = [];
        for ($i = 0; $i < 7; $i++) {
            $current = $start->copy()->addDays($i);
            $dates[] = $current->format('Y-m-d');
            
            // Format to 'Sen, 10'
            $dayName = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][$current->dayOfWeek];
            $dateStrings[] = $dayName . ', ' . $current->format('d M');
        }

        $employees = Employee::with(['shifts' => function ($query) use ($dates) {
            $query->whereIn('date', $dates);
        }])->get()->map(function ($emp) use ($dates) {
            
            // Map shifts to array of 7 elements corresponding to dates
            $shiftsArr = [];
            $shiftTypes = [];
            
            foreach ($dates as $d) {
                $shift = $emp->shifts->first(function($s) use ($d) {
                    return $s->date->format('Y-m-d') === $d;
                });
                $shiftType = $shift ? $shift->shift_type : 'Off'; // Default to Off if not set
                
                $shiftsArr[] = [
                    'date' => $d,
                    'type' => $shiftType
                ];
                $shiftTypes[] = $shiftType;
            }

            return [
                'id' => $emp->id,
                'name' => $emp->first_name . ' ' . $emp->last_name,
                'role' => $emp->job_title,
                'shifts' => $shiftTypes, // Just strings for easy frontend rendering
                'shift_details' => $shiftsArr
            ];
        });

        return Inertia::render('TimeAttendance/Rostering', [
            'employeesData' => $employees,
            'dates' => $dateStrings,
            'rawDates' => $dates,
            'currentStartDate' => $start->format('Y-m-d'),
            'displayDateRange' => $start->format('d M') . ' - ' . $start->copy()->addDays(6)->format('d M Y')
        ]);
    }

    public function updateShift(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'shift_type' => 'required|string|in:Pagi,Siang,Malam,Split,Off',
        ]);

        EmployeeShift::updateOrCreate(
            ['employee_id' => $request->employee_id, 'date' => $request->date],
            ['shift_type' => $request->shift_type]
        );

        return redirect()->back();
    }

    public function copyPreviousWeek(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date', // Target start date
        ]);

        $targetStart = Carbon::parse($request->start_date)->startOfDay();
        $sourceStart = $targetStart->copy()->subDays(7);
        
        $sourceDates = [];
        $targetDates = [];
        for ($i = 0; $i < 7; $i++) {
            $sourceDates[] = $sourceStart->copy()->addDays($i)->format('Y-m-d');
            $targetDates[] = $targetStart->copy()->addDays($i)->format('Y-m-d');
        }

        // Get all shifts from previous week
        $previousShifts = EmployeeShift::whereIn('date', $sourceDates)->get();

        foreach ($previousShifts as $shift) {
            // Find corresponding target date (same day of week)
            $diffDays = Carbon::parse($shift->date)->diffInDays($sourceStart);
            $newDate = $targetStart->copy()->addDays($diffDays)->format('Y-m-d');

            EmployeeShift::updateOrCreate(
                ['employee_id' => $shift->employee_id, 'date' => $newDate],
                ['shift_type' => $shift->shift_type]
            );
        }

        return redirect()->back()->with('success', 'Jadwal berhasil disalin');
    }
}
