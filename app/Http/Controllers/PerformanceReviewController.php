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
        $currentUser = \Illuminate\Support\Facades\Auth::user();
        $currentEmployee = Employee::where('user_id', $currentUser->id)->first();

        // Get reviews received by the logged-in employee
        $feedbacksReceived = collect([]);
        $competencyAverages = [
            'leadership' => 0,
            'communication' => 0,
            'initiative' => 0,
            'teamwork' => 0,
            'technical' => 0,
            'culture' => 0,
        ];
        $overallAverage = 0;

        if ($currentEmployee) {
            $feedbacksReceived = \App\Models\PeerFeedback::with('reviewer')
                ->where('employee_id', $currentEmployee->id)
                ->where('period', $period)
                ->latest()
                ->get();

            if ($feedbacksReceived->count() > 0) {
                $competencyAverages['leadership'] = round($feedbacksReceived->avg('leadership'), 1);
                $competencyAverages['communication'] = round($feedbacksReceived->avg('communication'), 1);
                $competencyAverages['initiative'] = round($feedbacksReceived->avg('initiative'), 1);
                $competencyAverages['teamwork'] = round($feedbacksReceived->avg('teamwork'), 1);
                $competencyAverages['technical'] = round($feedbacksReceived->avg('technical'), 1);
                $competencyAverages['culture'] = round($feedbacksReceived->avg('culture'), 1);

                $overallAverage = round(array_sum($competencyAverages) / 6, 1);
            }
        }

        // Colleagues they can write feedback for (everyone except themselves)
        $colleagues = Employee::where('id', '!=', $currentEmployee ? $currentEmployee->id : 0)
            ->get()
            ->map(function ($emp) {
                return [
                    'id' => $emp->id,
                    'name' => $emp->first_name . ' ' . $emp->last_name,
                ];
            });

        return Inertia::render('TalentPerformance/Feedback', [
            'reviews' => $feedbacksReceived->map(function ($f) {
                return [
                    'id' => $f->id,
                    'reviewer_name' => $f->reviewer ? $f->reviewer->first_name . ' ' . $f->reviewer->last_name : 'Rekan Kerja (Anonim)',
                    'comments' => $f->comments,
                    'created_at' => $f->created_at->format('d M Y'),
                    'score' => round(($f->leadership + $f->communication + $f->initiative + $f->teamwork + $f->technical + $f->culture) / 6 * 20), // score out of 100
                ];
            }),
            'competencyAverages' => $competencyAverages,
            'overallAverage' => $overallAverage,
            'colleagues' => $colleagues,
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

    public function storeFeedback(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'period' => 'required|string|max:20',
            'leadership' => 'required|integer|min:1|max:5',
            'communication' => 'required|integer|min:1|max:5',
            'initiative' => 'required|integer|min:1|max:5',
            'teamwork' => 'required|integer|min:1|max:5',
            'technical' => 'required|integer|min:1|max:5',
            'culture' => 'required|integer|min:1|max:5',
            'comments' => 'nullable|string',
        ]);

        $currentUser = \Illuminate\Support\Facades\Auth::user();
        $reviewer = Employee::where('user_id', $currentUser->id)->first();

        if (!$reviewer) {
            return redirect()->back()->withErrors(['error' => 'Reviewer profile not found.']);
        }

        if ($reviewer->id == $request->employee_id) {
            return redirect()->back()->withErrors(['error' => 'You cannot review yourself.']);
        }

        // Save the Peer Feedback
        \App\Models\PeerFeedback::updateOrCreate(
            [
                'employee_id' => $request->employee_id,
                'reviewer_id' => $reviewer->id,
                'period' => $request->period,
            ],
            [
                'leadership' => $request->leadership,
                'communication' => $request->communication,
                'initiative' => $request->initiative,
                'teamwork' => $request->teamwork,
                'technical' => $request->technical,
                'culture' => $request->culture,
                'comments' => $request->comments,
            ]
        );

        // Auto-recalculate the KPI score for the employee
        $feedbacks = \App\Models\PeerFeedback::where('employee_id', $request->employee_id)
            ->where('period', $request->period)
            ->get();

        if ($feedbacks->count() > 0) {
            $totalAvg = 0;
            foreach ($feedbacks as $f) {
                $totalAvg += ($f->leadership + $f->communication + $f->initiative + $f->teamwork + $f->technical + $f->culture) / 6;
            }
            $overallAvgRating = $totalAvg / $feedbacks->count();
            // Convert rating out of 5 to KPI score out of 100
            $kpiScore = round($overallAvgRating * 20);

            // Update or create main PerformanceReview
            PerformanceReview::updateOrCreate(
                [
                    'employee_id' => $request->employee_id,
                    'period' => $request->period,
                ],
                [
                    'reviewer_id' => $reviewer->id, // last reviewer
                    'score' => $kpiScore,
                    'feedback' => 'Dihitung secara otomatis berdasarkan rata-rata evaluasi 360-Degree Feedback rekan kerja.',
                    'status' => 'completed',
                ]
            );
        }

        return redirect()->back()->with('success', 'Ulasan 360 derajat berhasil disimpan!');
    }
}
