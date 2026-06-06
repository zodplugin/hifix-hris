<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    /** @use HasFactory<\Database\Factories\PayrollFactory> */
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'period',
        'basic_salary',
        'allowances',
        'deductions',
        'net_salary',
        'status',
        'employee_signature_path',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
