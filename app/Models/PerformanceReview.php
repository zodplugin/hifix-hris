<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerformanceReview extends Model
{
    /** @use HasFactory<\Database\Factories\PerformanceReviewFactory> */
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'reviewer_id',
        'period',
        'score',
        'feedback',
        'status',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(Employee::class, 'reviewer_id');
    }
}
