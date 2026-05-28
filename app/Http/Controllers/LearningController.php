<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Employee;
use App\Models\EmployeeCourse;
use Illuminate\Support\Facades\DB;

class LearningController extends Controller
{
    public function index()
    {
        // Simulate Employee 1 as the current logged in user
        $currentEmployeeId = 1;
        $currentEmployee = Employee::find($currentEmployeeId);
        
        if (!$currentEmployee) {
            // Seed a dummy employee if empty just to prevent crash
            $currentEmployee = Employee::create([
                'first_name' => 'Kevin',
                'last_name' => 'Pratama',
                'employee_code' => 'EMP-001',
                'job_title' => 'Software Engineer'
            ]);
            $currentEmployeeId = $currentEmployee->id;
        }

        // Seed some courses if empty
        if (Course::count() === 0) {
            $c1 = Course::create(['title' => 'Pemahaman Keamanan Siber Dasar', 'category' => 'Compliance', 'img_url' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400&h=200', 'xp_reward' => 500, 'video_url' => 'https://www.youtube.com/embed/bTeb2k_Oa_Q?si=fLgK20o_E6v2oD95', 'description' => 'Pelajari dasar-dasar keamanan siber untuk melindungi data perusahaan dan mencegah ancaman siber seperti phishing dan malware.']);
            $c2 = Course::create(['title' => 'Komunikasi Efektif di Tempat Kerja', 'category' => 'Soft Skill', 'img_url' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400&h=200', 'xp_reward' => 750, 'video_url' => 'https://www.youtube.com/embed/5T_IIVT2dUU?si=KofX2mY0KqXW_W00', 'description' => 'Pahami cara berkomunikasi secara profesional dan efektif dengan rekan kerja, atasan, maupun bawahan untuk mencapai tujuan tim.']);
            $c3 = Course::create(['title' => 'Pengenalan OKR Perusahaan', 'category' => 'Management', 'img_url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400&h=200', 'xp_reward' => 1000, 'video_url' => 'https://www.youtube.com/embed/3nLz_AetBf4?si=1Wv4R0B9e4_n7F01', 'description' => 'Mengenal framework OKR (Objectives and Key Results) yang digunakan perusahaan untuk menyelaraskan tujuan dan mengukur kesuksesan.']);

            // Assign to Employee 1
            EmployeeCourse::create(['employee_id' => $currentEmployeeId, 'course_id' => $c1->id, 'progress' => 50]);
            EmployeeCourse::create(['employee_id' => $currentEmployeeId, 'course_id' => $c2->id, 'progress' => 0]);
            EmployeeCourse::create(['employee_id' => $currentEmployeeId, 'course_id' => $c3->id, 'progress' => 0]);
        }

        // Fetch My Courses
        $myCourses = $currentEmployee->courses()->get()->map(function($course) {
            return [
                'id' => $course->id,
                'title' => $course->title,
                'category' => $course->category,
                'img' => $course->img_url,
                'progress' => $course->pivot->progress,
                'xp' => $course->xp_reward
            ];
        });

        // Calculate Leaderboard
        // We need to sum xp_reward for courses where progress = 100 for each employee
        $leaderboardRaw = Employee::with(['courses' => function($q) {
            $q->wherePivot('progress', 100);
        }])->get();

        $leaderboard = $leaderboardRaw->map(function($emp) {
            $xp = $emp->courses->sum('xp_reward');
            return [
                'id' => $emp->id,
                'name' => $emp->first_name . ' ' . substr($emp->last_name, 0, 1) . '.',
                'avatar' => $emp->avatar_path ? asset('storage/' . $emp->avatar_path) : 'https://ui-avatars.com/api/?name=' . urlencode($emp->first_name . ' ' . $emp->last_name) . '&background=random',
                'xp' => $xp
            ];
        })->sortByDesc('xp')->values()->take(5); // Top 5

        // Find my rank and XP
        $myRankIndex = $leaderboard->search(function($l) use ($currentEmployeeId) {
            return $l['id'] === $currentEmployeeId;
        });
        
        $myTotalXp = $leaderboardRaw->firstWhere('id', $currentEmployeeId)?->courses->sum('xp_reward') ?? 0;

        return Inertia::render('TalentPerformance/Learning', [
            'myCourses' => $myCourses,
            'leaderboard' => $leaderboard,
            'myEmployeeId' => $currentEmployeeId,
            'myTotalXp' => $myTotalXp,
            'myRank' => $myRankIndex !== false ? $myRankIndex + 1 : '-'
        ]);
    }

    public function show($id)
    {
        $currentEmployeeId = 1;
        $course = Course::findOrFail($id);
        
        $pivot = EmployeeCourse::firstOrCreate(
            ['employee_id' => $currentEmployeeId, 'course_id' => $id],
            ['progress' => 0]
        );

        return Inertia::render('TalentPerformance/LearningDetail', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'category' => $course->category,
                'video_url' => $course->video_url,
                'description' => $course->description,
                'xp_reward' => $course->xp_reward,
                'progress' => $pivot->progress
            ]
        ]);
    }

    public function updateProgress(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id'
        ]);

        $currentEmployeeId = 1;
        $pivot = EmployeeCourse::where('employee_id', $currentEmployeeId)
            ->where('course_id', $request->course_id)
            ->first();
            
        if ($pivot) {
            $pivot->update(['progress' => 100]);
        }

        return redirect()->route('learning')->with('success', 'Kelas berhasil diselesaikan! XP telah ditambahkan.');
    }
}
