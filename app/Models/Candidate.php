<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = ['job_posting_id', 'name', 'email', 'phone', 'resume_path', 'status', 'rating'];

    public function jobPosting()
    {
        return $this->belongsTo(JobPosting::class);
    }
}
