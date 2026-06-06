<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\Payroll;
use App\Models\PerformanceReview;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 0. Setup App Settings
        \App\Models\Setting::create(['key' => 'office_lat', 'value' => '-6.200000']);
        \App\Models\Setting::create(['key' => 'office_lng', 'value' => '106.816666']);
        \App\Models\Setting::create(['key' => 'office_radius', 'value' => '100']);

        // 1. Create Departments
        $departments = collect([
            ['name' => 'Engineering', 'code' => 'ENG'],
            ['name' => 'Marketing', 'code' => 'MKT'],
            ['name' => 'Human Resources', 'code' => 'HR'],
            ['name' => 'Finance', 'code' => 'FIN'],
        ])->map(function ($data) {
            return Department::create($data);
        });

        // 2. Create Test Accounts (Admin, Manager, Employee)
        $adminUser = User::create([
            'name' => 'Admin HRIS',
            'email' => 'admin@hifix.id',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);
        
        $adminEmp = Employee::create([
            'user_id' => $adminUser->id,
            'department_id' => $departments->where('code', 'HR')->first()->id,
            'employee_code' => 'EMP-0001',
            'first_name' => 'Admin',
            'last_name' => 'HRIS',
            'job_title' => 'System Administrator',
            'employment_status' => 'full_time',
            'join_date' => now(),
            'basic_salary' => 25000000,
            'salary_type' => 'monthly',
        ]);

        $managerUser = User::create([
            'name' => 'Manager HRIS',
            'email' => 'manager@hifix.id',
            'password' => bcrypt('password'),
            'role' => 'manager',
            'status' => 'active',
        ]);
        
        $managerEmp = Employee::create([
            'user_id' => $managerUser->id,
            'department_id' => $departments->where('code', 'ENG')->first()->id,
            'employee_code' => 'EMP-0002',
            'first_name' => 'Manager',
            'last_name' => 'Engineering',
            'job_title' => 'Engineering Manager',
            'employment_status' => 'full_time',
            'join_date' => now(),
            'basic_salary' => 20000000,
            'salary_type' => 'monthly',
        ]);
        
        // Update ENG department manager
        $departments->where('code', 'ENG')->first()->update(['manager_id' => $managerUser->id]);

        $employeeUser = User::create([
            'name' => 'Pegawai Biasa',
            'email' => 'employee@hifix.id',
            'password' => bcrypt('password'),
            'role' => 'employee',
            'status' => 'active',
        ]);
        
        $employeeEmp = Employee::create([
            'user_id' => $employeeUser->id,
            'department_id' => $departments->where('code', 'ENG')->first()->id,
            'employee_code' => 'EMP-0003',
            'first_name' => 'Pegawai',
            'last_name' => 'Biasa',
            'job_title' => 'Software Engineer',
            'employment_status' => 'full_time',
            'join_date' => now(),
            'basic_salary' => 10000000,
            'salary_type' => 'monthly',
        ]);

        // 3. Create Employees with Users attached
        foreach ($departments as $department) {
            // Create a manager for each department
            $managerUser = User::factory()->create(['role' => 'manager']);
            $manager = Employee::factory()->create([
                'user_id' => $managerUser->id,
                'department_id' => $department->id,
                'first_name' => explode(' ', $managerUser->name)[0],
                'last_name' => explode(' ', $managerUser->name)[1] ?? '',
            ]);

            // Update department manager
            $department->update(['manager_id' => $managerUser->id]);

            // Create 5-10 regular employees for this department
            $numEmployees = rand(5, 10);
            for ($i = 0; $i < $numEmployees; $i++) {
                $user = User::factory()->create(['role' => 'employee']);
                $employee = Employee::factory()->create([
                    'user_id' => $user->id,
                    'department_id' => $department->id,
                    'first_name' => explode(' ', $user->name)[0],
                    'last_name' => explode(' ', $user->name)[1] ?? '',
                ]);

                // Seed 20 days of attendance per employee
                Attendance::factory()->count(20)->create([
                    'employee_id' => $employee->id,
                ]);

                // Seed 3 months of payroll per employee
                Payroll::factory()->count(3)->create([
                    'employee_id' => $employee->id,
                ]);

                // Seed 2 performance reviews
                PerformanceReview::factory()->count(2)->create([
                    'employee_id' => $employee->id,
                ]);
            }
        }
    }
}
