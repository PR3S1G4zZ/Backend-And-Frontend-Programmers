import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { fetchPaymentMethods } from '../../../services/paymentMethodService';

interface PaymentMethodBannerProps {
    userType: 'company' | 'programmer';
    onSetupClick: () => void;
}

export function PaymentMethodBanner({ userType, onSetupClick }: PaymentMethodBannerProps) {
    const [hasMethods, setHasMethods] = useState<boolean | null>(null);

    useEffect(() => {
        checkMethods();
    }, []);

    const checkMethods = async () => {
        try {
            const methods = await fetchPaymentMethods();
            setHasMethods(methods.length > 0);
        } catch (error) {
            console.error(error);
        }
    };

    if (hasMethods === false) {
        return (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6 flex items-start justify-between">
                <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-yellow-500 font-medium">
                            {userType === 'company' ? 'Método de pago no configuado' : 'Datos de cobro no configurados'}
                        </h4>
                        <p className="text-yellow-200/80 text-sm mt-1">
                            {userType === 'company'
                                ? 'Para contratar programadores, necesitas registrar una tarjeta o cuenta de PayPal.'
                                : 'Para recibir pagos por tus proyectos, necesitas configurar tu cuenta bancaria o billetera.'}
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    variant="outline"
                    className="border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                    onClick={onSetupClick}
                >
                    Configurar
                </Button>
            </div>
        );
    }

    return null;
}
