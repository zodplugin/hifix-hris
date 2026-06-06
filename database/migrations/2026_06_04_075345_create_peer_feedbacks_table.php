<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('peer_feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('employees')->onDelete('cascade');
            $table->string('period', 20); // e.g. "Q1-2026"
            $table->integer('leadership');
            $table->integer('communication');
            $table->integer('initiative');
            $table->integer('teamwork');
            $table->integer('technical');
            $table->integer('culture');
            $table->text('comments')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peer_feedbacks');
    }
};
