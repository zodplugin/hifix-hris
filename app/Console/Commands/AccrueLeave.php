<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveType;

class AccrueLeave extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'leave:accrue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Accrue monthly leaves (+1 day of Annual Leave)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $annualLeave = LeaveType::where('code', 'annual')->first();
        if ($annualLeave) {
            $balances = LeaveBalance::where('leave_type_id', $annualLeave->id)->get();
            foreach ($balances as $bal) {
                $bal->increment('quota', 1);
            }
            $this->info("Accrued +1 day of Annual Leave for " . $balances->count() . " employees.");
        } else {
            $this->error("Annual Leave type not found.");
        }
    }
}
