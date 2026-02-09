import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { CreditCard, Trash2, Plus, Wallet, Building2, Lock } from 'lucide-react';
import { useSweetAlert } from '../../ui/sweet-alert';
import { fetchPaymentMethods, addPaymentMethod, deletePaymentMethod, type PaymentMethod } from '../../../services/paymentMethodService';

interface PaymentMethodsSettingsProps {
    userType: 'company' | 'programmer';
}

export function PaymentMethodsSettings({ userType }: PaymentMethodsSettingsProps) {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const { showAlert, Alert } = useSweetAlert();

    // Form State
    const [type, setType] = useState<string>(userType === 'company' ? 'credit_card' : 'bank_transfer');
    // const [details, setDetails] = useState(''); // Removed unused
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [email, setEmail] = useState(''); // PayPal
    const [iban, setIban] = useState(''); // Bank
    const [walletAddress, setWalletAddress] = useState(''); // Crypto

    useEffect(() => {
        loadMethods();
    }, []);

    const loadMethods = async () => {
        setIsLoading(true);
        try {
            const data = await fetchPaymentMethods();
            setMethods(data);
        } catch (error) {
            console.error('Error loading payment methods', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async () => {
        setIsLoading(true);
        try {
            let detailsJson = '';
            if (type === 'credit_card') {
                detailsJson = JSON.stringify({ last4: cardNumber.slice(-4), brand: 'Visa' }); // Fake
            } else if (type === 'paypal') {
                detailsJson = JSON.stringify({ email });
            } else if (type === 'bank_transfer') {
                detailsJson = JSON.stringify({ iban });
            } else if (type === 'crypto_wallet') {
                detailsJson = JSON.stringify({ address: walletAddress });
            }

            await addPaymentMethod({ type, details: detailsJson, is_default: methods.length === 0 });
            await loadMethods();

            setIsAdding(false);
            resetForm();
            showAlert({ title: 'Éxito', text: 'Método agregado correctamente.', type: 'success' });
        } catch (error) {
            console.error(error);
            showAlert({ title: 'Error', text: 'No se pudo agregar el método.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deletePaymentMethod(id);
            setMethods(methods.filter(m => m.id !== id));
            showAlert({ title: 'Eliminado', text: 'Método de pago eliminado.', type: 'success' });
        } catch (error) {
            console.error(error);
            showAlert({ title: 'Error', text: 'No se pudo eliminar.', type: 'error' });
        }
    };

    const resetForm = () => {
        setCardNumber(''); setExpiry(''); setCvc(''); setEmail(''); setIban(''); setWalletAddress('');
    };

    const getMethodIcon = (type: string) => {
        switch (type) {
            case 'credit_card': return <CreditCard className="h-6 w-6 text-blue-400" />;
            case 'paypal': return <span className="text-blue-600 font-bold text-lg">P</span>;
            case 'bank_transfer': return <Building2 className="h-6 w-6 text-gray-400" />;
            case 'crypto_wallet': return <Wallet className="h-6 w-6 text-orange-400" />;
            default: return <CreditCard className="h-6 w-6" />;
        }
    };

    const getMethodLabel = (method: PaymentMethod) => {
        try {
            const det = JSON.parse(method.details);
            if (method.type === 'credit_card') return `**** **** **** ${det.last4}`;
            if (method.type === 'paypal') return det.email;
            if (method.type === 'bank_transfer') return `IBAN: ${det.iban}`;
            if (method.type === 'crypto_wallet') return `${det.address.slice(0, 6)}...${det.address.slice(-4)}`;
            return method.type;
        } catch (e) {
            return method.details;
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#333333]">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-white">
                                {userType === 'company' ? 'Métodos de Pago' : 'Datos de Cobro'}
                            </CardTitle>
                            <CardDescription className="text-gray-400 mt-1">
                                {userType === 'company'
                                    ? 'Gestiona tus tarjetas y cuentas para pagar proyectos.'
                                    : 'Configura dónde quieres recibir tus pagos.'}
                            </CardDescription>
                        </div>
                        {!isAdding && (
                            <Button onClick={() => setIsAdding(true)} className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]">
                                <Plus className="h-4 w-4 mr-2" /> Agregar
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {/* List */}
                    {!isAdding && (
                        <div className="space-y-4">
                            {methods.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No tienes métodos registrados.</p>
                            ) : (
                                methods.map(method => (
                                    <div key={method.id} className="flex justify-between items-center p-4 rounded-lg bg-[#0D0D0D] border border-[#333333]">
                                        <div className="flex items-center space-x-4">
                                            {getMethodIcon(method.type)}
                                            <div>
                                                <p className="text-white font-medium">{getMethodLabel(method)}</p>
                                                <p className="text-xs text-gray-500 capitalize">{method.type.replace('_', ' ')}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(method.id)} className="text-red-400 hover:text-red-300">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Add Form */}
                    {isAdding && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300">Tipo</Label>
                                <Select value={type} onValueChange={(v) => { setType(v); resetForm(); }}>
                                    <SelectTrigger className="bg-[#0D0D0D] border-[#333333] text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A1A1A] border-[#333333] text-white">
                                        {userType === 'company' ? (
                                            <>
                                                <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                                                <SelectItem value="paypal">PayPal</SelectItem>
                                            </>
                                        ) : (
                                            <>
                                                <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                                                <SelectItem value="crypto_wallet">Billetera Crypto</SelectItem>
                                                <SelectItem value="paypal">PayPal</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {type === 'credit_card' && (
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Número de Tarjeta</Label>
                                    <Input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" className="bg-[#0D0D0D] border-[#333333] text-white" />
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-gray-300">Expiración</Label>
                                            <Input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" className="bg-[#0D0D0D] border-[#333333] text-white" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-gray-300">CVC</Label>
                                            <div className="relative">
                                                <Input value={cvc} onChange={e => setCvc(e.target.value)} placeholder="123" className="bg-[#0D0D0D] border-[#333333] text-white" />
                                                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {type === 'paypal' && (
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Email de PayPal</Label>
                                    <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" className="bg-[#0D0D0D] border-[#333333] text-white" />
                                </div>
                            )}

                            {type === 'bank_transfer' && (
                                <div className="space-y-2">
                                    <Label className="text-gray-300">IBAN / Cuenta Bancaria</Label>
                                    <Input value={iban} onChange={e => setIban(e.target.value)} placeholder="ES00 0000 ..." className="bg-[#0D0D0D] border-[#333333] text-white" />
                                </div>
                            )}

                            {type === 'crypto_wallet' && (
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Dirección de Billetera (USDT/BTC)</Label>
                                    <Input value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder="0x..." className="bg-[#0D0D0D] border-[#333333] text-white" />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-4">
                                <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-white hover:bg-[#333333]">Cancelar</Button>
                                <Button onClick={handleAdd} disabled={isLoading} className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]">
                                    {isLoading ? 'Guardando...' : 'Guardar Método'}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Alert />
        </div>
    );
}
