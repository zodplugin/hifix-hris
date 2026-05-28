<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'department_id',
        'employee_code',
        'first_name',
        'last_name',
        'job_title',
        'employment_status',
        'join_date',
        'basic_salary',
        'identity_number',
        'latest_education',
        'university_name',
        'graduation_year',
        'birth_date',
        'emergency_contact_name',
        'emergency_contact_phone',
        'avatar_path',
        'ktp_file_path',
        'salary_type',
        'contract_end_date',
        'contract_document_path',
        'signature_path',
        'contract_signed_at',
        'contract_start_date',
        'is_contract_extendable',
        'nda_document_path',
        'nda_signature_path',
        'nda_signed_at',
        'ptkp_status',
    ];

    protected $casts = [
        'join_date' => 'date',
        'contract_start_date' => 'date',
        'contract_end_date' => 'date',
        'contract_signed_at' => 'datetime',
        'nda_signed_at' => 'datetime',
        'basic_salary' => 'decimal:2',
        'is_contract_extendable' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }

    public function reviews()
    {
        return $this->hasMany(PerformanceReview::class, 'employee_id');
    }

    public function given_reviews()
    {
        return $this->hasMany(PerformanceReview::class, 'reviewer_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function onboardingTasks()
    {
        return $this->hasMany(OnboardingTask::class);
    }

    public function shifts()
    {
        return $this->hasMany(EmployeeShift::class);
    }

    public function timeOffRequests()
    {
        return $this->hasMany(TimeOffRequest::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'employee_courses')
                    ->withPivot('progress')
                    ->withTimestamps();
    }
}
