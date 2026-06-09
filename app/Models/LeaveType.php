<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    protected $fillable = [
        'name',
        'code',
        'default_quota',
    ];

    public function balances()
    {
        return $this->hasMany(LeaveBalance::class);
    }

    public function timeOffRequests()
    {
        return $this->hasMany(TimeOffRequest::class);
    }
}
