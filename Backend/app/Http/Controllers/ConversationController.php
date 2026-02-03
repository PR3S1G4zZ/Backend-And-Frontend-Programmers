<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversations = Conversation::with([
                'participants:id,name,lastname,user_type',
                'project:id,title',
                'latestMessage',
            ])
            ->withCount([
                'messages as unread_count' => function ($query) use ($user) {
                    $query->whereNull('read_at')->where('sender_id', '!=', $user->id);
                },
            ])
            ->whereHas('participants', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->latest('updated_at')
            ->get();

        $data = $conversations->map(function ($conversation) use ($user) {
            $otherParticipant = $conversation->participants->firstWhere('id', '!=', $user->id);
            $latestMessage = $conversation->latestMessage;

            return [
                'id' => $conversation->id,
                'name' => $otherParticipant
                    ? $otherParticipant->name . ' ' . $otherParticipant->lastname
                    : 'Participante',
                'role' => $conversation->project
                    ? 'Proyecto • ' . $conversation->project->title
                    : ($otherParticipant?->user_type === 'company' ? 'Empresa' : 'Desarrollador'),
                'lastMessage' => $latestMessage?->body ?? '',
                'timestamp' => $latestMessage?->created_at?->toDateTimeString(),
                'unreadCount' => $conversation->unread_count,
                'isOnline' => false,
                'conversationId' => $conversation->id,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function messages(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        abort_unless($conversation->participants()->where('users.id', $user->id)->exists(), 403);

        $messages = $conversation->messages()->with('sender:id,name,lastname')->orderBy('created_at')->get();

        $conversation->messages()
            ->whereNull('read_at')
            ->where('sender_id', '!=', $user->id)
            ->update(['read_at' => now()]);

        $data = $messages->map(function ($message) {
            return [
                'id' => $message->id,
                'senderId' => (string) $message->sender_id,
                'senderName' => $message->sender
                    ? $message->sender->name . ' ' . $message->sender->lastname
                    : 'Usuario',
                'content' => $message->body,
                'timestamp' => $message->created_at?->toDateTimeString(),
                'type' => 'text',
                'isRead' => $message->read_at !== null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function storeMessage(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        abort_unless($conversation->participants()->where('users.id', $user->id)->exists(), 403);

        $data = $request->validate([
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'body' => $data['content'],
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $message->id,
                'senderId' => (string) $message->sender_id,
                'content' => $message->body,
                'timestamp' => $message->created_at?->toDateTimeString(),
                'type' => 'text',
                'isRead' => false,
            ],
        ], 201);
    }
}
