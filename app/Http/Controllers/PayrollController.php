<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payroll;
use App\Models\Employee;

class PayrollController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->query('period', date('Y-m'));
        
        $payrolls = Payroll::with(['employee', 'employee.department'])
            ->where('period', $period)
            ->latest()
            ->get()
            ->map(function ($payroll) {
                return [
                    'id' => $payroll->id,
                    'employee_id' => $payroll->employee_id,
                    'employee_code' => $payroll->employee->employee_code,
                    'employee_name' => $payroll->employee->first_name . ' ' . $payroll->employee->last_name,
                    'department' => $payroll->employee->department ? $payroll->employee->department->name : '-',
                    'basic_salary' => $payroll->basic_salary,
                    'allowances' => $payroll->allowances,
                    'deductions' => $payroll->deductions,
                    'net_salary' => $payroll->net_salary,
                    'status' => ucfirst($payroll->status),
                ];
            });

        return Inertia::render('PayrollTax/RunPayroll', [
            'payrolls' => $payrolls,
            'currentPeriod' => $period,
            'stats' => [
                'total_gross' => $payrolls->sum(function ($p) { return $p['basic_salary'] + $p['allowances']; }),
                'total_deductions' => $payrolls->sum('deductions'),
                'total_net' => $payrolls->sum('net_salary'),
                'paid_count' => $payrolls->where('status', 'Paid')->count(),
                'total_count' => $payrolls->count(),
            ]
        ]);
    }

    private function getTerRate($category, $salary)
    {
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

        $brackets = $terBrackets[$category] ?? $terBrackets['A'];
        $rate = 0;
        foreach ($brackets as $b) {
            if ($salary >= $b['min'] && $salary <= $b['max']) {
                $rate = $b['rate'];
                break;
            }
        }
        return $rate;
    }

    public function runPayroll(Request $request)
    {
        $period = date('Y-m');

        // Prevent double run for the same period
        if (Payroll::where('period', $period)->exists()) {
            return redirect()->back()->withErrors('Payroll untuk periode ini sudah dijalankan.');
        }

        $employees = Employee::where('employment_status', '!=', 'off')->get();

        foreach ($employees as $emp) {
            $basicSalary = $emp->basic_salary ?? 0;
            $allowances = 0; // default for MVP
            
            $grossSalary = $basicSalary + $allowances;

            // BPJS Calculations
            $bpjsKes = $basicSalary * 0.01; // 1% employee share
            $bpjsTkJht = $basicSalary * 0.02; // 2% JHT
            $bpjsTkJp = $basicSalary * 0.01; // 1% JP
            $totalBpjsTk = $bpjsTkJht + $bpjsTkJp;

            // Tax Calculation (TER)
            $ptkpStatus = $emp->ptkp_status ?? 'TK/0';
            $category = 'A'; // Default
            if (in_array($ptkpStatus, ['TK/0', 'TK/1', 'K/0'])) {
                $category = 'A';
            } elseif (in_array($ptkpStatus, ['TK/2', 'TK/3', 'K/1', 'K/2'])) {
                $category = 'B';
            } elseif ($ptkpStatus === 'K/3') {
                $category = 'C';
            }

            $taxRate = $this->getTerRate($category, $grossSalary);
            $pph21 = $grossSalary * ($taxRate / 100);

            $deductions = $bpjsKes + $totalBpjsTk + $pph21;
            $netSalary = $grossSalary - $deductions;

            Payroll::create([
                'employee_id' => $emp->id,
                'period' => $period,
                'basic_salary' => $basicSalary,
                'allowances' => $allowances,
                'deductions' => $deductions,
                'net_salary' => $netSalary,
                'status' => 'draft'
            ]);
        }

        return redirect()->back()->with('success', 'Payroll berhasil dijalankan dan dihitung!');
    }

    public function markAsPaid($id)
    {
        $payroll = Payroll::findOrFail($id);
        $payroll->update(['status' => 'paid']);
        return redirect()->back()->with('success', 'Status gaji karyawan berhasil diperbarui menjadi Dibayar (Paid).');
    }

    public function payslip(Request $request)
    {
        // For simulation, pick a random payroll to view, or specific ID
        $payrollId = $request->query('id');
        
        $query = Payroll::with(['employee', 'employee.department']);
        
        if ($payrollId) {
            $payroll = $query->findOrFail($payrollId);
        } else {
            $payroll = $query->latest()->first();
        }

        if (!$payroll) {
            return redirect()->back()->withErrors('No payroll data found.');
        }

        // Calculate breakdown dynamically from basic_salary to display in payslip
        $basicSalary = $payroll->basic_salary;
        
        $bpjsKes = $basicSalary * 0.01;
        $bpjsTk = $basicSalary * 0.03;
        
        // PPh 21 is deductions minus BPJS
        $pph21 = $payroll->deductions - ($bpjsKes + $bpjsTk);

        $payslipData = [
            'id' => $payroll->id,
            'company_name' => 'PT HiFix Indonesia',
            'period' => $payroll->period,
            'employee_name' => $payroll->employee->first_name . ' ' . $payroll->employee->last_name,
            'employee_code' => $payroll->employee->employee_code,
            'job_title' => $payroll->employee->job_title,
            'department' => $payroll->employee->department ? $payroll->employee->department->name : '-',
            'join_date' => $payroll->employee->join_date ? $payroll->employee->join_date->format('d M Y') : '-',
            'ptkp_status' => $payroll->employee->ptkp_status ?? 'TK/0',
            'basic_salary' => $basicSalary,
            'allowances' => [
                ['name' => 'Tunjangan Transport', 'amount' => $payroll->allowances],
            ],
            'deductions' => [
                ['name' => 'PPh 21', 'amount' => $pph21 > 0 ? $pph21 : 0],
                ['name' => 'BPJS Kesehatan (1%)', 'amount' => $bpjsKes],
                ['name' => 'BPJS Ketenagakerjaan (3%)', 'amount' => $bpjsTk],
            ],
            'total_allowances' => $payroll->allowances,
            'total_deductions' => $payroll->deductions,
            'net_salary' => $payroll->net_salary,
            'payment_method' => 'Bank Transfer - BCA',
            'status' => ucfirst($payroll->status)
        ];

        return Inertia::render('PayrollTax/Payslip', [
            'payslip' => $payslipData
        ]);
    }

    public function myPayslips(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'employee') {
            return redirect()->route('dashboard');
        }

        $employee = Employee::where('user_id', $user->id)->first();
        if (!$employee) {
            return redirect()->route('dashboard');
        }

        $payrolls = Payroll::where('employee_id', $employee->id)
            ->latest('period')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'period' => $p->period,
                    'net_salary' => $p->net_salary,
                    'status' => ucfirst($p->status)
                ];
            });

        return Inertia::render('PayrollTax/MyPayslips', [
            'payrolls' => $payrolls
        ]);
    }

    public function exportCsv(Request $request)
    {
        $period = $request->query('period', date('Y-m'));
        $payrolls = Payroll::with(['employee', 'employee.department'])
            ->where('period', $period)
            ->get();

        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=payroll_$period.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        $columns = array('ID', 'Employee Code', 'Name', 'Department', 'Period', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Status');

        $callback = function() use($payrolls, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($payrolls as $p) {
                $row['ID']  = $p->id;
                $row['Employee Code']    = $p->employee->employee_code;
                $row['Name']    = $p->employee->first_name . ' ' . $p->employee->last_name;
                $row['Department']  = $p->employee->department ? $p->employee->department->name : '-';
                $row['Period']  = $p->period;
                $row['Basic Salary']  = $p->basic_salary;
                $row['Allowances']  = $p->allowances;
                $row['Deductions']  = $p->deductions;
                $row['Net Salary']  = $p->net_salary;
                $row['Status']  = ucfirst($p->status);

                fputcsv($file, array($row['ID'], $row['Employee Code'], $row['Name'], $row['Department'], $row['Period'], $row['Basic Salary'], $row['Allowances'], $row['Deductions'], $row['Net Salary'], $row['Status']));
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
