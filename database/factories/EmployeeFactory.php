<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Department;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'department_id' => Department::factory(),
            'employee_code' => fake()->unique()->bothify('EMP-####'),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'job_title' => fake()->jobTitle(),
            'employment_status' => fake()->randomElement(['full_time', 'contract', 'freelance', 'probation']),
            'join_date' => fake()->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            'basic_salary' => fake()->randomFloat(2, 5000000, 25000000),
            'identity_number' => fake()->numerify('1################'),
            'latest_education' => fake()->randomElement(['S1 Teknik Informatika', 'S1 Sistem Informasi', 'D3 Akuntansi', 'S2 Manajemen', 'SMA/SMK']),
            'university_name' => fake()->randomElement(['Universitas Indonesia', 'Institut Teknologi Bandung', 'Universitas Gadjah Mada', 'Bina Nusantara', 'Telkom University', 'Universitas Padjadjaran']),
            'graduation_year' => fake()->numberBetween(2010, 2024),
            'birth_date' => fake()->dateTimeBetween('-40 years', '-20 years')->format('Y-m-d'),
            'emergency_contact_name' => fake()->name(),
            'emergency_contact_phone' => fake()->phoneNumber(),
            'avatar_path' => null,
        ];
    }
}
