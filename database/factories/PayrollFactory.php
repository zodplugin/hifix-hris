<?php

namespace Database\Factories;

use App\Models\Payroll;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payroll>
 */
class PayrollFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $basicSalary = fake()->numberBetween(5, 30) * 1000000;
        $allowances = fake()->numberBetween(5, 20) * 100000;
        // Simplified fixed percentage deduction simulation (5% BPJS + 5% PPh21)
        $deductions = $basicSalary * 0.10;
        
        return [
            'period' => fake()->randomElement(['2026-03', '2026-04', '2026-05']),
            'basic_salary' => $basicSalary,
            'allowances' => $allowances,
            'deductions' => $deductions,
            'net_salary' => $basicSalary + $allowances - $deductions,
            'status' => fake()->randomElement(['draft', 'paid', 'paid']),
        ];
    }
}
