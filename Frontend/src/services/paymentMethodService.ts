import { apiRequest } from './apiClient';

export interface PaymentMethod {
    id: number;
    type: 'credit_card' | 'paypal' | 'bank_transfer' | 'crypto_wallet';
    details: string; // JSON string in backend, but we might parse it here or keep as string
    is_default: boolean;
    created_at: string;
}

export async function fetchPaymentMethods() {
    return apiRequest<PaymentMethod[]>('/payment-methods');
}

export async function addPaymentMethod(payload: { type: string; details: string; is_default?: boolean }) {
    return apiRequest<{ data: PaymentMethod; message: string }>('/payment-methods', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function updatePaymentMethod(id: number, payload: { type?: string; details?: string; is_default?: boolean }) {
    return apiRequest<{ data: PaymentMethod; message: string }>(`/payment-methods/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
}

export async function deletePaymentMethod(id: number) {
    return apiRequest<void>(`/payment-methods/${id}`, {
        method: 'DELETE',
    });
}
