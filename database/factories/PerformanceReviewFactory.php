<?php

namespace Database\Factories;

use App\Models\PerformanceReview;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PerformanceReview>
 */
class PerformanceReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'period' => fake()->randomElement(['Q1-2026', 'Q2-2026', 'Q3-2026']),
            'score' => fake()->numberBetween(60, 100),
            'feedback' => fake()->paragraph(),
            'status' => fake()->randomElement(['pending', 'completed', 'completed']),
        ];
    }
}
