import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { fetchWallet } from '../../../services/walletService';
import type { TransactionResponse } from '../../../services/walletService';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export function TransactionHistory() {
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const data = await fetchWallet();
                setTransactions(data.transactions || []);
            } catch (error) {
                console.error('Error loading transactions', error);
            } finally {
                setLoading(false);
            }
        };
        loadTransactions();
    }, []);

    if (loading) return <div className="text-gray-400">Cargando movimientos...</div>;

    return (
        <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
                <CardTitle className="text-white">Movimientos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {transactions.length === 0 ? (
                        <p className="text-gray-400 text-sm">No hay movimientos registrados.</p>
                    ) : (
                        transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between border-b border-[#333333] pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-full ${tx.type === 'deposit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {tx.type === 'deposit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white capitalize">{tx.type === 'deposit' ? 'Depósito' : tx.type === 'payment' ? 'Pago' : 'Retiro'}</p>
                                        <p className="text-xs text-gray-400">{tx.description}</p>
                                    </div>
                                </div>
                                <div className={`text-sm font-bold ${tx.type === 'deposit' ? 'text-green-400' : 'text-white'}`}>
                                    {tx.type === 'deposit' ? '+' : '-'}${Math.abs(parseFloat(tx.amount)).toFixed(2)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
