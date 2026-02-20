import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { useSweetAlert } from '../../ui/sweet-alert';
import { rechargeWallet } from '../../../services/walletService';
import { Wallet, CreditCard, DollarSign } from 'lucide-react';
import { useWallet } from '../../../contexts/WalletContext';

interface WalletRechargeProps {
    onRechargeSuccess?: () => void;
}

export function WalletRecharge({ onRechargeSuccess }: WalletRechargeProps) {
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { showAlert } = useSweetAlert();
    const { refreshWallet } = useWallet();

    const quickAmounts = [10, 50, 100, 500];

    const handleRecharge = async () => {
        const value = parseFloat(amount);
        if (!value || value <= 0) {
            showAlert({ title: 'Error', text: 'Ingresa un monto válido.', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            await rechargeWallet(value);
            showAlert({ title: 'Recarga Exitosa', text: `Se han añadido ${value.toFixed(2)} a tu saldo.`, type: 'success' });
            setAmount('');
            // Refresh wallet data and optionally call onRechargeSuccess
            await refreshWallet();
            if (onRechargeSuccess) onRechargeSuccess();
        } catch (error) {
            console.error(error);
            showAlert({ title: 'Error', text: 'No se pudo procesar la recarga.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0D0D0D] border border-[#333333] rounded-2xl p-6 shadow-xl relative overflow-hidden"
        >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF85] opacity-5 rounded-full blur-3xl pointer-events-none -mt-10 -mr-10"></div>

            <div className="flex items-center gap-2 mb-6 text-white">
                <div className="p-2 bg-[#1A1A1A] rounded-lg border border-[#333333]">
                    <Wallet className="h-5 w-5 text-[#00FF85]" />
                </div>
                <h3 className="font-bold text-lg">Recargar Saldo</h3>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-gray-400 text-xs uppercase tracking-wider">Monto a Recargar</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input
                            type="number"
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="bg-[#1A1A1A] border-[#333333] text-white pl-12 h-14 text-xl font-mono focus:border-[#00FF85]/50 focus:ring-[#00FF85]/20"
                        />
                    </div>
                </div>



                <div className="flex gap-2 flex-wrap mb-4">
                    {quickAmounts.map((amt) => (
                        <button
                            key={amt}
                            onClick={() => setAmount(amt.toString())}
                            className="px-4 py-2 rounded-full bg-[#1A1A1A] border border-[#333333] text-sm text-gray-300 hover:bg-[#00FF85]/10 hover:text-[#00FF85] hover:border-[#00FF85]/30 transition-all"
                        >
                            +${amt}
                        </button>
                    ))}
                </div>

                <Button
                    onClick={handleRecharge}
                    disabled={isLoading || !amount}
                    className="w-full h-12 bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] font-bold text-base shadow-[0_0_15px_rgba(0,255,133,0.3)] hover:shadow-[0_0_20px_rgba(0,255,133,0.5)] transition-all"
                >
                    {isLoading ? 'Procesando...' : 'Recargar Ahora'}
                    {!isLoading && <CreditCard className="ml-2 h-4 w-4" />}
                </Button>
            </div>
        </motion.div >
    );
}
