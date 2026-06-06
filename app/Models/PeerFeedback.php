<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeerFeedback extends Model
{
    use HasFactory;

    protected $table = 'peer_feedbacks';

    protected $fillable = [
        'employee_id',
        'reviewer_id',
        'period',
        'leadership',
        'communication',
        'initiative',
        'teamwork',
        'technical',
        'culture',
        'comments',
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
