import { useState } from 'react';
import { Button } from '../../ui/button';
import { rechargeWallet } from '../../../services/walletService';
import { useSweetAlert } from '../../ui/sweet-alert';
import { Plus } from 'lucide-react';

export function RechargeButton({ onRecharge }: { onRecharge?: () => void }) {
    const { showAlert } = useSweetAlert();
    const [loading, setLoading] = useState(false);

    const handleRecharge = async () => {
        setLoading(true);
        try {
            await rechargeWallet(1000); // Fixed amount for demo
            showAlert({
                title: '¡Recarga Exitosa!',
                text: 'Se han añadido $1,000.00 a tu saldo de prueba.',
                type: 'success',
            });
            if (onRecharge) onRecharge();
        } catch (error) {
            console.error('Error recharging', error);
            showAlert({
                title: 'Error',
                text: 'No se pudo realizar la recarga.',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleRecharge}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
        >
            <Plus className="h-4 w-4 mr-2" />
            Recargar $1,000 (Test)
        </Button>
    );
}
