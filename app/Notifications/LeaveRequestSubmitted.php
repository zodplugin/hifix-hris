<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LeaveRequestSubmitted extends Notification
{
    use Queueable;

    protected $requestData;

    public function __construct($requestData)
    {
        $this->requestData = $requestData;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $requesterName = $this->requestData->employee->first_name . ' ' . $this->requestData->employee->last_name;
        $displayType = $this->requestData->leaveType ? $this->requestData->leaveType->name : $this->requestData->type;
        
        return [
            'request_id' => $this->requestData->id,
            'title' => 'New Request: ' . $displayType,
            'message' => "{$requesterName} submitted a request for {$displayType} ({$this->requestData->duration}).",
            'type' => 'request_submitted',
        ];
    }
}
