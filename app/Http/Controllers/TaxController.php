<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Employee;

class TaxController extends Controller
{
    public function index()
    {
        $employees = Employee::all()->map(function ($emp) {
            return [
                'id' => $emp->id,
                'name' => $emp->first_name . ' ' . $emp->last_name,
                'ptkp_status' => $emp->ptkp_status ?? 'TK/0',
                'basic_salary' => $emp->basic_salary ?? 0,
            ];
        });

        // Dummy TER brackets for categories A, B, C (Subset of PP 58/2023)
        $terBrackets = [
            'A' => [
                ['min' => 0, 'max' => 5400000, 'rate' => 0],
                ['min' => 5400000, 'max' => 5650000, 'rate' => 0.25],
                ['min' => 5650000, 'max' => 5950000, 'rate' => 0.5],
                ['min' => 5950000, 'max' => 6300000, 'rate' => 0.75],
                ['min' => 6300000, 'max' => 6750000, 'rate' => 1],
                ['min' => 6750000, 'max' => 7500000, 'rate' => 1.25],
                ['min' => 7500000, 'max' => 8550000, 'rate' => 1.5],
                ['min' => 8550000, 'max' => 9650000, 'rate' => 1.75],
                ['min' => 9650000, 'max' => 10050000, 'rate' => 2],
                ['min' => 10050000, 'max' => 10350000, 'rate' => 2.25],
                ['min' => 10350000, 'max' => 10700000, 'rate' => 2.5],
                ['min' => 10700000, 'max' => 11050000, 'rate' => 3],
                ['min' => 11050000, 'max' => 11600000, 'rate' => 4],
                ['min' => 11600000, 'max' => 14050000, 'rate' => 5],
                ['min' => 14050000, 'max' => 15400000, 'rate' => 6],
                ['min' => 15400000, 'max' => 16950000, 'rate' => 7],
                ['min' => 16950000, 'max' => 20750000, 'rate' => 8],
                ['min' => 20750000, 'max' => 24300000, 'rate' => 9],
                ['min' => 24300000, 'max' => 27800000, 'rate' => 10],
                ['min' => 27800000, 'max' => 31400000, 'rate' => 11],
                ['min' => 31400000, 'max' => 39800000, 'rate' => 12],
                ['min' => 39800000, 'max' => 46300000, 'rate' => 13],
                ['min' => 46300000, 'max' => 51100000, 'rate' => 14],
                ['min' => 51100000, 'max' => 999999999, 'rate' => 15],
            ],
            'B' => [
                ['min' => 0, 'max' => 6200000, 'rate' => 0],
                ['min' => 6200000, 'max' => 6500000, 'rate' => 0.25],
                ['min' => 6500000, 'max' => 6850000, 'rate' => 0.5],
                ['min' => 6850000, 'max' => 7300000, 'rate' => 0.75],
                ['min' => 7300000, 'max' => 9200000, 'rate' => 1],
                ['min' => 9200000, 'max' => 10750000, 'rate' => 1.5],
                ['min' => 10750000, 'max' => 11250000, 'rate' => 2],
                ['min' => 11250000, 'max' => 11600000, 'rate' => 2.5],
                ['min' => 11600000, 'max' => 12600000, 'rate' => 3],
                ['min' => 12600000, 'max' => 13600000, 'rate' => 4],
                ['min' => 13600000, 'max' => 14950000, 'rate' => 5],
                ['min' => 14950000, 'max' => 16400000, 'rate' => 6],
                ['min' => 16400000, 'max' => 18450000, 'rate' => 7],
                ['min' => 18450000, 'max' => 22700000, 'rate' => 8],
                ['min' => 22700000, 'max' => 26600000, 'rate' => 9],
                ['min' => 26600000, 'max' => 30400000, 'rate' => 10],
                ['min' => 30400000, 'max' => 34400000, 'rate' => 11],
                ['min' => 34400000, 'max' => 43600000, 'rate' => 12],
                ['min' => 43600000, 'max' => 50700000, 'rate' => 13],
                ['min' => 50700000, 'max' => 56000000, 'rate' => 14],
                ['min' => 56000000, 'max' => 999999999, 'rate' => 15],
            ],
            'C' => [
                ['min' => 0, 'max' => 6600000, 'rate' => 0],
                ['min' => 6600000, 'max' => 6950000, 'rate' => 0.25],
                ['min' => 6950000, 'max' => 7350000, 'rate' => 0.5],
                ['min' => 7350000, 'max' => 7800000, 'rate' => 0.75],
                ['min' => 7800000, 'max' => 8850000, 'rate' => 1],
                ['min' => 8850000, 'max' => 9800000, 'rate' => 1.25],
                ['min' => 9800000, 'max' => 10950000, 'rate' => 1.5],
                ['min' => 10950000, 'max' => 11200000, 'rate' => 2],
                ['min' => 11200000, 'max' => 12050000, 'rate' => 3],
                ['min' => 12050000, 'max' => 12950000, 'rate' => 4],
                ['min' => 12950000, 'max' => 14150000, 'rate' => 5],
                ['min' => 14150000, 'max' => 15550000, 'rate' => 6],
                ['min' => 15550000, 'max' => 17050000, 'rate' => 7],
                ['min' => 17050000, 'max' => 21100000, 'rate' => 8],
                ['min' => 21100000, 'max' => 24600000, 'rate' => 9],
                ['min' => 24600000, 'max' => 28400000, 'rate' => 10],
                ['min' => 28400000, 'max' => 32200000, 'rate' => 11],
                ['min' => 32200000, 'max' => 40700000, 'rate' => 12],
                ['min' => 40700000, 'max' => 47400000, 'rate' => 13],
                ['min' => 47400000, 'max' => 52300000, 'rate' => 14],
                ['min' => 52300000, 'max' => 999999999, 'rate' => 15],
            ],
        ];

        return Inertia::render('PayrollTax/Tax', [
            'employees' => $employees,
            'terBrackets' => $terBrackets
        ]);
    }
}
