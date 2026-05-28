<?php

namespace Database\Factories;

use App\Models\Attendance;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['present', 'present', 'present', 'late', 'absent', 'leave']);
        
        $clockIn = null;
        $clockOut = null;
        $workHours = null;

        if ($status === 'present' || $status === 'late') {
            $baseHour = $status === 'present' ? fake()->numberBetween(7, 8) : fake()->numberBetween(9, 11);
            $clockIn = sprintf('%02d:%02d:00', $baseHour, fake()->numberBetween(0, 59));
            
            $outHour = fake()->numberBetween(17, 20);
            $clockOut = sprintf('%02d:%02d:00', $outHour, fake()->numberBetween(0, 59));
            
            $workHours = round(($outHour - $baseHour) + (fake()->numberBetween(0, 59) / 60), 2);
        }

        return [
            'date' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'clock_in' => $clockIn,
            'clock_out' => $clockOut,
            'status' => $status,
            'work_hours' => $workHours,
        ];
    }
}
