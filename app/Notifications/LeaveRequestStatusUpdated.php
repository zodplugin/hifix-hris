<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LeaveRequestStatusUpdated extends Notification
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
        $displayType = $this->requestData->leaveType ? $this->requestData->leaveType->name : $this->requestData->type;
        $statusEng = strtolower($this->requestData->status); // approved or rejected
        
        return [
            'request_id' => $this->requestData->id,
            'title' => 'Request Status Updated',
            'message' => "Your {$displayType} request has been {$statusEng}.",
            'type' => 'status_updated',
            'status' => $this->requestData->status,
        ];
    }
}
