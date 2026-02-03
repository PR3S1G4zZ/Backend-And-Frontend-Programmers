import { apiRequest } from './apiClient';

export type ConversationSummary = {
  id: number;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: string | null;
  unreadCount: number;
  isOnline: boolean;
  conversationId: number;
};

export type ChatMessage = {
  id: number;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
};

export async function fetchConversations() {
  return apiRequest<{ success: boolean; data: ConversationSummary[] }>('/conversations');
}

export async function fetchConversationMessages(conversationId: number) {
  return apiRequest<{ success: boolean; data: ChatMessage[] }>(`/conversations/${conversationId}/messages`);
}

export async function sendConversationMessage(conversationId: number, content: string) {
  return apiRequest<{ success: boolean; data: ChatMessage }>(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}
