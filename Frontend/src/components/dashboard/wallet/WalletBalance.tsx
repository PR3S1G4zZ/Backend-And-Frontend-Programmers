import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { fetchWallet } from '../../../services/walletService';
import type { WalletResponse } from '../../../services/walletService';
import { Wallet, RefreshCw } from 'lucide-react';
import { Button } from '../../ui/button';
import { useWallet } from '../../../contexts/WalletContext';

export function WalletBalance() {
    const { wallet, loading, refreshWallet } = useWallet();

    const handleRefresh = async () => {
        await refreshWallet();
    };

    if (loading) return <div className="text-gray-400">Cargando saldo...</div>;

    return (
        <Card className="bg-[#1A1A1A] border-[#333333] mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Saldo Disponible</CardTitle>
                <Wallet className="h-4 w-4 text-[#00FF85]" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white flex items-center justify-between">
                    <span>${parseFloat(wallet?.balance || '0').toFixed(2)}</span>
                    <Button variant="ghost" size="sm" onClick={handleRefresh} className="ml-2">
                        <RefreshCw className="h-4 w-4 text-gray-400" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
