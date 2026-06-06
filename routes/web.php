<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/careers', [App\Http\Controllers\RecruitmentController::class, 'publicIndex'])->name('careers');
Route::post('/careers/apply', [App\Http\Controllers\RecruitmentController::class, 'apply'])->name('careers.apply');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Employee Lifecycle
    Route::get('/employee/core-hr', [EmployeeController::class, 'index'])->name('core-hr');
    Route::get('/employee/core-hr/export', [EmployeeController::class, 'exportCsv'])->name('core-hr.export');
    Route::post('/employee/core-hr', [EmployeeController::class, 'store'])->name('core-hr.store');
    Route::put('/employee/core-hr/{id}', [EmployeeController::class, 'update'])->name('core-hr.update');
    Route::put('/employee/core-hr/department/{id}', [EmployeeController::class, 'updateDepartmentManager'])->name('core-hr.department.update');
    Route::get('/employee/core-hr/{id}/contract/preview', [EmployeeController::class, 'previewContract'])->name('core-hr.contract.preview');
    Route::post('/employee/core-hr/{id}/contract', [EmployeeController::class, 'generateContract'])->name('core-hr.contract');
    Route::get('/employee/core-hr/{id}/nda/preview', [EmployeeController::class, 'previewNda'])->name('core-hr.nda.preview');
    Route::post('/employee/core-hr/{id}/nda', [EmployeeController::class, 'generateNda'])->name('core-hr.nda');
    Route::delete('/employee/core-hr/{id}', [EmployeeController::class, 'destroy'])->name('core-hr.destroy');
    Route::get('/employee/recruitment', [App\Http\Controllers\RecruitmentController::class, 'dashboard'])->name('recruitment');
    Route::post('/employee/recruitment/job', [App\Http\Controllers\RecruitmentController::class, 'storeJob'])->name('recruitment.job.store');
    Route::put('/employee/recruitment/candidate/{id}/status', [App\Http\Controllers\RecruitmentController::class, 'updateStatus'])->name('recruitment.status.update');
    Route::get('/employee/onboarding', [\App\Http\Controllers\OnboardingController::class, 'index'])->name('onboarding');
    Route::post('/employee/onboarding', [\App\Http\Controllers\OnboardingController::class, 'store'])->name('onboarding.store');
    Route::patch('/employee/onboarding/{id}/toggle', [\App\Http\Controllers\OnboardingController::class, 'toggle'])->name('onboarding.toggle');

    // Time & Attendance
    Route::get('/time-attendance/live', [\App\Http\Controllers\AttendanceController::class, 'index'])->name('live-attendance');
    Route::post('/time-attendance/clock-in', [\App\Http\Controllers\AttendanceController::class, 'clockIn'])->name('clock-in');
    Route::post('/time-attendance/clock-out', [\App\Http\Controllers\AttendanceController::class, 'clockOut'])->name('clock-out');
    Route::get('/time-attendance/export', [\App\Http\Controllers\AttendanceController::class, 'exportCsv'])->name('live-attendance.export');

    Route::get('/attendance/rostering', [\App\Http\Controllers\RosteringController::class, 'index'])->name('rostering');
    Route::post('/attendance/rostering/update', [\App\Http\Controllers\RosteringController::class, 'updateShift'])->name('rostering.update');
    Route::post('/attendance/rostering/copy', [\App\Http\Controllers\RosteringController::class, 'copyPreviousWeek'])->name('rostering.copy');
    
    Route::get('/attendance/overtime', [\App\Http\Controllers\OvertimeController::class, 'index'])->name('overtime');
    Route::post('/attendance/overtime', [\App\Http\Controllers\OvertimeController::class, 'store'])->name('overtime.store');
    Route::patch('/attendance/overtime/{id}/status', [\App\Http\Controllers\OvertimeController::class, 'updateStatus'])->name('overtime.status');

    // Payroll & Tax
    Route::get('/payroll/run', [\App\Http\Controllers\PayrollController::class, 'index'])->name('run-payroll');
    Route::post('/payroll/run', [\App\Http\Controllers\PayrollController::class, 'runPayroll'])->name('run-payroll.process');
    Route::patch('/payroll/{id}/pay', [\App\Http\Controllers\PayrollController::class, 'markAsPaid'])->name('run-payroll.mark-paid');
    Route::get('/payroll/export', [\App\Http\Controllers\PayrollController::class, 'exportCsv'])->name('run-payroll.export');
    Route::get('/payroll/payslip', [\App\Http\Controllers\PayrollController::class, 'payslip'])->name('payslip');
    Route::get('/payroll/my-payslips', [\App\Http\Controllers\PayrollController::class, 'myPayslips'])->name('my-payslips');
    Route::post('/payroll/{id}/sign', [\App\Http\Controllers\PayrollController::class, 'signPayslip'])->name('payslip.sign');
    Route::get('/payroll/tax', [\App\Http\Controllers\TaxController::class, 'index'])->name('tax');
    
    // Settings
    Route::get('/settings', [\App\Http\Controllers\SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [\App\Http\Controllers\SettingsController::class, 'update'])->name('settings.update');

    // Talent & Performance
    Route::get('/talent/kpi', [\App\Http\Controllers\PerformanceReviewController::class, 'index'])->name('kpi');
    Route::post('/talent/kpi', [\App\Http\Controllers\PerformanceReviewController::class, 'store'])->name('kpi.store');
    Route::put('/talent/kpi/{id}', [\App\Http\Controllers\PerformanceReviewController::class, 'update'])->name('kpi.update');
    
    Route::get('/talent/learning', [\App\Http\Controllers\LearningController::class, 'index'])->name('learning');
    Route::get('/talent/learning/{id}', [\App\Http\Controllers\LearningController::class, 'show'])->name('learning.show');
    Route::post('/talent/learning/progress', [\App\Http\Controllers\LearningController::class, 'updateProgress'])->name('learning.progress');
    Route::delete('/talent/kpi/{id}', [\App\Http\Controllers\PerformanceReviewController::class, 'destroy'])->name('kpi.destroy');
    Route::get('/talent/feedback', [\App\Http\Controllers\PerformanceReviewController::class, 'feedback'])->name('feedback');
    Route::post('/talent/feedback', [\App\Http\Controllers\PerformanceReviewController::class, 'storeFeedback'])->name('feedback.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
