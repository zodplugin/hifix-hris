<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class EmployeeController extends Controller
{
    public function index()
    {
        // Get employees with their department and user relationships
        $employees = Employee::with(['department', 'user'])->latest()->get()->map(function ($employee) {
            return [
                'id' => $employee->id,
                'employee_code' => $employee->employee_code,
                'name' => $employee->first_name . ' ' . $employee->last_name,
                'email' => $employee->user ? $employee->user->email : '-',
                'department' => $employee->department ? $employee->department->name : 'N/A',
                'role' => $employee->job_title,
                'status' => ucfirst(str_replace('_', ' ', $employee->employment_status)),
                'join_date' => $employee->join_date ? $employee->join_date->format('Y-m-d') : '-',
                'identity_number' => $employee->identity_number ?? '-',
                'latest_education' => $employee->latest_education ?? '-',
                'university_name' => $employee->university_name ?? '-',
                'graduation_year' => $employee->graduation_year ?? '-',
                'birth_date' => $employee->birth_date ? \Carbon\Carbon::parse($employee->birth_date)->format('Y-m-d') : '-',
                'emergency_contact_name' => $employee->emergency_contact_name ?? '-',
                'emergency_contact_phone' => $employee->emergency_contact_phone ?? '-',
                'avatar' => $employee->avatar_path ? asset('storage/' . $employee->avatar_path) : 'https://i.pravatar.cc/150?u=' . $employee->id,
                // Raw fields for editing
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
                'department_id' => $employee->department_id,
                'basic_salary' => $employee->basic_salary,
                'salary_type' => $employee->salary_type,
                'employment_status_raw' => $employee->employment_status,
                'ptkp_status' => $employee->ptkp_status ?? 'TK/0',
                'email_raw' => $employee->user ? $employee->user->email : '',
                'identity_number_raw' => $employee->identity_number,
                'latest_education_raw' => $employee->latest_education,
                'university_name_raw' => $employee->university_name,
                'graduation_year_raw' => $employee->graduation_year,
                'birth_date_raw' => $employee->birth_date ? \Carbon\Carbon::parse($employee->birth_date)->format('Y-m-d') : '',
                'join_date_raw' => $employee->join_date ? \Carbon\Carbon::parse($employee->join_date)->format('Y-m-d') : '',
                'emergency_contact_name_raw' => $employee->emergency_contact_name,
                'emergency_contact_phone_raw' => $employee->emergency_contact_phone,
                'ktp_file_path' => $employee->ktp_file_path ? asset('storage/' . $employee->ktp_file_path) : null,
                'contract_end_date_raw' => $employee->contract_end_date ? \Carbon\Carbon::parse($employee->contract_end_date)->format('Y-m-d') : '',
                'contract_start_date_raw' => $employee->contract_start_date ? \Carbon\Carbon::parse($employee->contract_start_date)->format('Y-m-d') : '',
                'is_contract_extendable' => (bool) $employee->is_contract_extendable,
                'contract_document_path' => $employee->contract_document_path ? asset('storage/' . $employee->contract_document_path) : null,
                'nda_document_path' => $employee->nda_document_path ? asset('storage/' . $employee->nda_document_path) : null,
            ];
        });

        $departments = Department::select('id', 'name', 'manager_id')->get();

        return Inertia::render('EmployeeLifecycle/CoreHR', [
            'employeesData' => $employees,
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email',
            'department_id' => 'required|exists:departments,id',
            'job_title' => 'required|string|max:255',
            'basic_salary' => 'required|numeric|min:0',
            'employment_status' => 'required|in:full_time,contract,freelance,probation',
            'join_date' => 'required|date',
            'identity_number' => 'nullable|string|max:20',
            'latest_education' => 'nullable|string|max:255',
            'university_name' => 'nullable|string|max:255',
            'graduation_year' => 'nullable|integer|min:1950|max:' . (date('Y') + 5),
            'birth_date' => 'nullable|date',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'ktp_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'avatar_file' => 'nullable|file|image|max:2048',
            'contract_start_date' => 'nullable|date',
            'contract_end_date' => 'nullable|date|after_or_equal:contract_start_date',
            'is_contract_extendable' => 'nullable|boolean',
            'ptkp_status' => 'required|in:TK/0,TK/1,TK/2,TK/3,K/0,K/1,K/2,K/3',
        ]);

        // Create User account first
        $user = User::create([
            'name' => $validated['first_name'] . ' ' . ($validated['last_name'] ?? ''),
            'email' => $validated['email'],
            'password' => bcrypt('password'), // default password
            'role' => 'employee',
            'status' => 'active',
        ]);

        // Generate unique employee code
        $employeeCode = 'EMP-' . str_pad(Employee::max('id') + 1, 4, '0', STR_PAD_LEFT);

        // Create Employee record
        $employee = Employee::create([
            'user_id' => $user->id,
            'department_id' => $validated['department_id'],
            'employee_code' => $employeeCode,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'job_title' => $validated['job_title'],
            'basic_salary' => $validated['basic_salary'],
            'employment_status' => $validated['employment_status'],
            'join_date' => $validated['join_date'],
            'identity_number' => $validated['identity_number'] ?? null,
            'latest_education' => $validated['latest_education'] ?? null,
            'university_name' => $validated['university_name'] ?? null,
            'graduation_year' => $validated['graduation_year'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
            'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? null,
            'contract_start_date' => $validated['contract_start_date'] ?? null,
            'contract_end_date' => $validated['contract_end_date'] ?? null,
            'is_contract_extendable' => $validated['is_contract_extendable'] ?? false,
            'ptkp_status' => $validated['ptkp_status'],
        ]);

        if ($request->hasFile('ktp_file')) {
            $path = $request->file('ktp_file')->store('ktp_files', 'public');
            $employee->update(['ktp_file_path' => $path]);
        }

        if ($request->hasFile('avatar_file')) {
            $path = $request->file('avatar_file')->store('avatars', 'public');
            $employee->update(['avatar_path' => $path]);
        }

        return redirect()->back()->with('success', 'Data karyawan baru berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);
        
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email,' . $employee->user_id,
            'department_id' => 'required|exists:departments,id',
            'job_title' => 'required|string|max:255',
            'basic_salary' => 'required|numeric|min:0',
            'salary_type' => 'required|in:gross,net',
            'employment_status' => 'required|in:full_time,contract,freelance,probation',
            'join_date' => 'required|date',
            'identity_number' => 'nullable|string|max:20',
            'latest_education' => 'nullable|string|max:255',
            'university_name' => 'nullable|string|max:255',
            'graduation_year' => 'nullable|integer|min:1950|max:' . (date('Y') + 5),
            'birth_date' => 'nullable|date',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'ktp_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'avatar_file' => 'nullable|file|image|max:2048',
            'contract_start_date' => 'nullable|date',
            'contract_end_date' => 'nullable|date|after_or_equal:contract_start_date',
            'is_contract_extendable' => 'nullable|boolean',
            'ptkp_status' => 'required|in:TK/0,TK/1,TK/2,TK/3,K/0,K/1,K/2,K/3',
        ]);

        // Update User account
        if ($employee->user) {
            $employee->user->update([
                'name' => $validated['first_name'] . ' ' . ($validated['last_name'] ?? ''),
                'email' => $validated['email'],
            ]);
        }

        // Update Employee record
        $employee->update([
            'department_id' => $validated['department_id'],
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'job_title' => $validated['job_title'],
            'basic_salary' => $validated['basic_salary'],
            'salary_type' => $validated['salary_type'],
            'employment_status' => $validated['employment_status'],
            'join_date' => $validated['join_date'],
            'identity_number' => $validated['identity_number'] ?? null,
            'latest_education' => $validated['latest_education'] ?? null,
            'university_name' => $validated['university_name'] ?? null,
            'graduation_year' => $validated['graduation_year'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
            'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? null,
            'contract_start_date' => $validated['contract_start_date'] ?? null,
            'contract_end_date' => $validated['contract_end_date'] ?? null,
            'is_contract_extendable' => $validated['is_contract_extendable'] ?? false,
            'ptkp_status' => $validated['ptkp_status'],
        ]);

        if ($request->hasFile('ktp_file')) {
            $path = $request->file('ktp_file')->store('ktp_files', 'public');
            $employee->update(['ktp_file_path' => $path]);
        }

        if ($request->hasFile('avatar_file')) {
            $path = $request->file('avatar_file')->store('avatars', 'public');
            $employee->update(['avatar_path' => $path]);
        }

        return redirect()->back()->with('success', 'Data karyawan berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        
        // Delete associated user
        if ($employee->user) {
            $employee->user->delete();
        }
        
        $employee->delete();
        
        return redirect()->back()->with('success', 'Data karyawan berhasil dihapus.');
    }

    public function generateContract(Request $request, $id)
    {
        $employee = Employee::with(['department', 'user'])->findOrFail($id);

        $request->validate([
            'signature_base64' => 'required|string',
        ]);

        // Decode signature image
        $signatureData = $request->signature_base64;
        list($type, $signatureData) = explode(';', $signatureData);
        list(, $signatureData)      = explode(',', $signatureData);
        $signatureData = base64_decode($signatureData);

        $signatureFileName = 'signatures/' . uniqid('sig_') . '.png';
        Storage::disk('public')->put($signatureFileName, $signatureData);

        $employee->update([
            'signature_path' => $signatureFileName,
            'contract_signed_at' => now(),
        ]);

        // Generate PDF
        $pdf = Pdf::loadView('pdf.employee_contract', compact('employee'));
        
        $pdfFileName = 'contracts/PKWT_' . str_pad($employee->id, 3, '0', STR_PAD_LEFT) . '_' . date('Ymd') . '.pdf';
        Storage::disk('public')->put($pdfFileName, $pdf->output());

        $employee->update([
            'contract_document_path' => $pdfFileName,
        ]);

        return redirect()->back()->with('success', 'Kontrak berhasil ditandatangani dan di-generate!');
    }

    public function previewContract($id)
    {
        $employee = Employee::findOrFail($id);
        
        // Render PDF directly without saving
        $pdf = Pdf::loadView('pdf.employee_contract', compact('employee'));
        
        return $pdf->stream('preview_kontrak_' . $employee->employee_code . '.pdf');
    }

    public function generateNda(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);
        
        $request->validate([
            'signature' => 'required|string', // base64 image
        ]);

        // Save Signature Image
        $signatureData = $request->input('signature');
        // Remove data uri scheme
        $signatureData = str_replace('data:image/png;base64,', '', $signatureData);
        $signatureData = str_replace(' ', '+', $signatureData);
        $signatureData = base64_decode($signatureData);

        $signatureFileName = 'signatures/' . uniqid('nda_sig_') . '.png';
        Storage::disk('public')->put($signatureFileName, $signatureData);

        $employee->update([
            'nda_signature_path' => $signatureFileName,
            'nda_signed_at' => now(),
        ]);

        // Generate PDF
        $pdf = Pdf::loadView('pdf.employee_nda', compact('employee'));
        
        $pdfFileName = 'contracts/NDA_' . str_pad($employee->id, 3, '0', STR_PAD_LEFT) . '_' . date('Ymd') . '.pdf';
        Storage::disk('public')->put($pdfFileName, $pdf->output());

        $employee->update([
            'nda_document_path' => $pdfFileName,
        ]);

        return redirect()->back()->with('success', 'NDA berhasil ditandatangani dan di-generate!');
    }

    public function previewNda($id)
    {
        $employee = Employee::findOrFail($id);
        
        $pdf = Pdf::loadView('pdf.employee_nda', compact('employee'));
        
        return $pdf->stream('preview_nda_' . $employee->employee_code . '.pdf');
    }

    public function exportCsv()
    {
        $employees = Employee::with('department')->get();
        $filename = "laporan_karyawan_" . date('Ymd_His') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['ID', 'Nama', 'Email', 'No HP', 'Departemen', 'Posisi', 'Status', 'Tipe Gaji', 'Gaji Pokok', 'Tanggal Bergabung'];

        $callback = function() use($employees, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($employees as $emp) {
                $row['ID']  = $emp->employee_code;
                $row['Nama']    = $emp->first_name . ' ' . $emp->last_name;
                $row['Email']    = $emp->user ? $emp->user->email : '-';
                $row['No HP']  = $emp->emergency_contact_phone ?? '-';
                $row['Departemen']  = $emp->department ? $emp->department->name : 'N/A';
                $row['Posisi']  = $emp->job_title;
                $row['Status']  = $emp->employment_status;
                $row['Tipe Gaji'] = $emp->salary_type;
                $row['Gaji Pokok']  = $emp->basic_salary;
                $row['Tanggal Bergabung']  = $emp->join_date;

                fputcsv($file, array($row['ID'], $row['Nama'], $row['Email'], $row['No HP'], $row['Departemen'], $row['Posisi'], $row['Status'], $row['Tipe Gaji'], $row['Gaji Pokok'], $row['Tanggal Bergabung']));
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function updateDepartmentManager(Request $request, $id)
    {
        $department = Department::findOrFail($id);
        
        $validated = $request->validate([
            'manager_id' => 'nullable|exists:employees,id',
        ]);
        
        $department->update([
            'manager_id' => $validated['manager_id']
        ]);
        
        return redirect()->back()->with('success', 'Kepala Departemen berhasil diperbarui!');
    }
}
