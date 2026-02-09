import { apiRequest } from './apiClient';

export type TransactionResponse = {
    id: number;
    wallet_id: number;
    amount: string; // Decimal comes as string often
    type: string;
    description: string | null;
    reference_type: string | null;
    reference_id: number | null;
    created_at: string;
    updated_at: string;
};

export type WalletResponse = {
    id: number;
    user_id: number;
    balance: string;
    created_at: string;
    updated_at: string;
    transactions?: TransactionResponse[];
};

export async function fetchWallet() {
    return apiRequest<WalletResponse>('/wallet');
}

export async function rechargeWallet(amount: number) {
    return apiRequest<{ message: string; wallet: WalletResponse }>('/wallet/recharge', {
        method: 'POST',
        body: JSON.stringify({ amount }),
    });
}
