import api from './apiClient';

export type ConversationType = 'direct' | 'project';

export interface CreateConversationPayload {
    participant_id: number;
    type: ConversationType;
    project_id?: number;
}

export interface ConversationResponse {
    message: string;
    conversation_id?: number;
    conversation?: any;
}

export const createConversation = async (payload: CreateConversationPayload) => {
    return await api.post<ConversationResponse>('/conversations', payload);
};

export const fetchConversations = async () => {
    return await api.get('/conversations');
};
