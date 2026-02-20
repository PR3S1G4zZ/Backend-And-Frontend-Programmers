import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { fetchWalletWithTransactions } from '../services/walletService';
import type { WalletResponse, TransactionResponse } from '../services/walletService';

interface WalletContextType {
    wallet: WalletResponse | null;
    transactions: TransactionResponse[];
    loading: boolean;
    refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [wallet, setWallet] = useState<WalletResponse | null>(null);
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshWallet = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchWalletWithTransactions();
            setWallet(data.wallet);
            setTransactions(data.transactions || []);
        } catch (error) {
            console.error('Error refreshing wallet:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        refreshWallet();
    }, [refreshWallet]);

    return (
        <WalletContext.Provider value={{ wallet, transactions, loading, refreshWallet }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
