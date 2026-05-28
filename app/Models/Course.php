<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['title', 'category', 'img_url', 'xp_reward', 'video_url', 'description'];

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_courses')
                    ->withPivot('progress')
                    ->withTimestamps();
    }
}
