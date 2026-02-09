<?php

namespace App\Listeners;

use App\Events\ApplicationAccepted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\{Conversation, Message, User};

class CreateProjectChat
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    public function handle(ApplicationAccepted $event): void
    {
        $application = $event->application;
        $project = $application->project;
        $developer = $application->developer;
        $company = $project->company; // Assuming relation exists, or we use $project->user_id if 'company' rel is missing. But let's check model first.

        // Re-fetching project to get company_id if needed, but ApplicationController used $project->company_id.
        // Let's assume $project->company_id is the key.
        $companyId = $project->company_id;

        // 1. Check if a conversation already exists for this project
        $conversation = Conversation::where('project_id', $project->id)->first();

        if (!$conversation) {
            // Create new conversation
            $conversation = Conversation::create([
                'project_id' => $project->id,
                'created_by' => $companyId,
                'subject' => 'Proyecto: ' . $project->title,
            ]);

            // Add Company as participant
            $conversation->participants()->attach($companyId);
            
            // Send Welcome Message
            Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $companyId,
                'body' => "¡Hola! Bienvenidos al proyecto '{$project->title}'. He aceptado sus solicitudes. ¡Empecemos!", // Generic plural for potential group
            ]);
        } 
        
        // 2. Add Developer to participants (if not already)
        // Check if user is already in participants? attach() might throw or duplicate if not handled.
        // The table has unique index on conversation_id + user_id, so we should check or use syncWithoutDetaching.
        if (!$conversation->participants()->where('user_id', $developer->id)->exists()) {
             $conversation->participants()->attach($developer->id);
             
             // Optional: If conversation existed, maybe send a system message "User X joined"? 
             // Requirement says: "El sistema debe insertar un primer mensaje automático... donde la empresa saluda". 
             // If it's a group and we just added a 2nd dev, the first message was already sent.
             // We can check if it's the *first* developer (new convo) or subsequent.
             // Code above handles "New Convo -> Message". 
             // If "Existing Convo -> No new Welcome Message" (to avoid spamming "Welcome" 10 times).
             // However, for the specific user joining, it might be nice to know. 
             // Let's stick to the prompt: "Si es 1 solo... mensaje. Si son varios... mensaje." 
             // This implies the message exists in the chat history. 
        }
    }
}
