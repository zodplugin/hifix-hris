<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobPosting;
use App\Models\Candidate;
use App\Models\Department;
use Inertia\Inertia;

class RecruitmentController extends Controller
{
    // Public Careers Page
    public function publicIndex()
    {
        $jobs = JobPosting::with('department')->where('status', 'active')->get();
        return Inertia::render('Careers', [
            'jobs' => $jobs
        ]);
    }

    // Public Application Submit
    public function apply(Request $request)
    {
        $validated = $request->validate([
            'job_posting_id' => 'required|exists:job_postings,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'resume_file' => 'required|file|mimes:pdf|max:5120',
        ]);

        $path = $request->file('resume_file')->store('resumes', 'public');

        Candidate::create([
            'job_posting_id' => $validated['job_posting_id'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'resume_path' => $path,
            'status' => 'applied',
            'rating' => 0
        ]);

        return redirect()->back()->with('success', 'Lamaran Anda berhasil dikirim! Tim kami akan segera menghubungi Anda.');
    }

    // Employee ATS Dashboard
    public function dashboard()
    {
        $candidates = Candidate::with('jobPosting.department')->get();
        $departments = Department::select('id', 'name')->get();
        $jobPostings = JobPosting::with('department')->withCount('candidates')->orderBy('created_at', 'desc')->get();

        return Inertia::render('EmployeeLifecycle/Recruitment', [
            'candidatesData' => $candidates,
            'departments' => $departments,
            'jobPostings' => $jobPostings
        ]);
    }

    // Update Kanban Status
    public function updateStatus(Request $request, $id)
    {
        $candidate = Candidate::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:applied,screening,interview,offered',
        ]);

        $candidate->update([
            'status' => $validated['status']
        ]);

        return redirect()->back()->with('success', 'Status pelamar diperbarui.');
    }

    // Store New Job Posting
    public function storeJob(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'description' => 'nullable|string',
        ]);

        JobPosting::create([
            'title' => $validated['title'],
            'department_id' => $validated['department_id'],
            'description' => $validated['description'],
            'status' => 'active'
        ]);

        return redirect()->back()->with('success', 'Lowongan kerja baru berhasil dibuka!');
    }
}
