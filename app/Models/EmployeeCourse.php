<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeCourse extends Model
{
    protected $fillable = ['employee_id', 'course_id', 'progress'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
