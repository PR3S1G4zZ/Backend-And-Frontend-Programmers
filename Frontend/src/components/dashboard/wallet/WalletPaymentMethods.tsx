import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CreditCard, Trash2, Pencil, Wallet, Building2, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useSweetAlert } from '../../ui/sweet-alert';
import { fetchPaymentMethods, addPaymentMethod, deletePaymentMethod, updatePaymentMethod, type PaymentMethod } from '../../../services/paymentMethodService';

interface WalletPaymentMethodsProps {
    userType: 'company' | 'programmer';
}

export function WalletPaymentMethods({ userType }: WalletPaymentMethodsProps) {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const { showAlert, Alert } = useSweetAlert();

    // Form State
    const [type, setType] = useState<string>(userType === 'company' ? 'credit_card' : 'bank_transfer');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [email, setEmail] = useState('');
    const [iban, setIban] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

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

    const handleSave = async () => {
        setIsLoading(true);
        try {
            let detailsJson = '';
            // Basic validation
            if (type === 'credit_card' && (!cardNumber || cardNumber.length < 12)) throw new Error("Número de tarjeta inválido");
            if (type === 'credit_card') {
                detailsJson = JSON.stringify({ last4: cardNumber.slice(-4) || '****', brand: 'Visa', expiry });
            } else if (type === 'paypal') {
                if (!email.includes('@')) throw new Error("Email inválido");
                detailsJson = JSON.stringify({ email });
            } else if (type === 'bank_transfer') {
                if (iban.length < 5) throw new Error("IBAN muy corto");
                detailsJson = JSON.stringify({ iban });
            } else if (type === 'crypto_wallet') {
                if (walletAddress.length < 10) throw new Error("Dirección inválida");
                detailsJson = JSON.stringify({ address: walletAddress });
            }

            if (editingId) {
                await updatePaymentMethod(editingId, { type, details: detailsJson });
                showAlert({ title: 'Actualizado', text: 'Método actualizado correctamente.', type: 'success' });
            } else {
                await addPaymentMethod({ type, details: detailsJson, is_default: methods.length === 0 });
                showAlert({ title: 'Éxito', text: 'Método agregado correctamente.', type: 'success' });
            }

            await loadMethods();
            setIsAdding(false);
            setEditingId(null);
            resetForm();
        } catch (error: any) {
            console.error(error);
            showAlert({ title: 'Error', text: error.message || 'No se pudo guardar el método.', type: 'error' });
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

    const handleEdit = (method: PaymentMethod) => {
        setEditingId(method.id);
        setType(method.type);
        try {
            const det = JSON.parse(method.details);
            if (method.type === 'credit_card') {
                setCardNumber(''); // Security: don't show full number
                setExpiry(det.expiry || '');
            } else if (method.type === 'paypal') {
                setEmail(det.email);
            } else if (method.type === 'bank_transfer') {
                setIban(det.iban);
            } else if (method.type === 'crypto_wallet') {
                setWalletAddress(det.address);
            }
        } catch (e) {
            console.error('Error parsing details', e);
        }
        setIsAdding(true);
    };

    const resetForm = () => {
        setCardNumber(''); setExpiry(''); setCvc(''); setEmail(''); setIban(''); setWalletAddress('');
    };

    const getMethodDetails = (method: PaymentMethod) => {
        try {
            return JSON.parse(method.details);
        } catch {
            return {};
        }
    };

    const getGradient = (type: string) => {
        switch (type) {
            case 'credit_card': return 'from-[#059669] via-[#10B981] to-[#34D399] shadow-[0_0_20px_rgba(16,185,129,0.3)] border-t border-white/20';
            case 'paypal': return 'from-[#2563EB] to-[#0EA5E9] shadow-[0_0_20px_rgba(37,99,235,0.3)] border-t border-white/20';
            case 'bank_transfer': return 'from-[#4F46E5] to-[#818CF8] shadow-[0_0_20px_rgba(79,70,229,0.3)] border-t border-white/20';
            case 'crypto_wallet': return 'from-[#F59E0B] via-[#D97706] to-[#B45309] shadow-[0_0_20px_rgba(245,158,11,0.3)] border-t border-white/20';
            default: return 'from-gray-600 to-gray-800';
        }
    };

    // Live Card Preview Component
    const LiveCardPreview = () => (
        <motion.div
            layout
            className={`relative h-56 w-full max-w-sm mx-auto rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl bg-gradient-to-br ${getGradient(type)}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-black opacity-20 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex justify-between items-start">
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg border border-white/10 shadow-lg">
                    {type === 'credit_card' ? <CreditCard className="text-[#00FF85] h-8 w-8" /> :
                        type === 'paypal' ? <span className="text-white font-bold text-xl px-1">Pay</span> :
                            type === 'bank_transfer' ? <Building2 className="text-white h-8 w-8" /> :
                                <Wallet className="text-white h-8 w-8" />}
                </div>
                <div className="text-white/60 font-mono text-xs uppercase tracking-widest border border-white/20 rounded-full px-3 py-1 bg-black/10">
                    {type.replace('_', ' ')}
                </div>
            </div>

            <div className="relative z-10 mt-8 space-y-4">
                <div className="space-y-1">
                    <p className="text-white/60 text-xs uppercase tracking-wider">Detalles</p>
                    <p className="text-white text-xl font-bold tracking-widest font-mono truncate shadow-black drop-shadow-md">
                        {type === 'credit_card' ? (cardNumber ? (cardNumber.length > 4 ? `•••• •••• •••• ${cardNumber.slice(-4)}` : cardNumber) : '•••• •••• •••• ••••') :
                            type === 'paypal' ? (email || 'usuario@email.com') :
                                type === 'bank_transfer' ? (iban || 'ES00 0000 0000 0000') :
                                    (walletAddress ? `${walletAddress.slice(0, 10)}...` : '0x...')}
                    </p>
                </div>
                {type === 'credit_card' && (
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-white/60 text-[10px] uppercase">EXP</p>
                            <p className="text-white font-mono text-sm">{expiry || 'MM/YY'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-white/60 text-[10px] uppercase">CVC</p>
                            <p className="text-white font-mono text-sm">•••</p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-[#00FF85]" />
                    Métodos de Pago
                </h3>
            </div>

            <AnimatePresence mode="wait">
                {isAdding ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-[#333333] rounded-2xl p-8 relative overflow-hidden shadow-2xl"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Form Section */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-2xl font-bold text-white">
                                        {editingId ? 'Editar Método' : 'Agregar Nuevo Método'}
                                    </h4>
                                    <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                                        <X className="h-6 w-6" />
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-300">Tipo de Método</Label>
                                        <Select value={type} onValueChange={(v) => { setType(v); resetForm(); }}>
                                            <SelectTrigger className="bg-[#0D0D0D] border-[#333333] text-white h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#1A1A1A] border-[#333333] text-white">
                                                {userType === 'company' ? (
                                                    <>
                                                        <SelectItem value="credit_card">Tarjeta de Crédito / Débito</SelectItem>
                                                        <SelectItem value="paypal">PayPal</SelectItem>
                                                    </>
                                                ) : (
                                                    <>
                                                        <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                                                        <SelectItem value="crypto_wallet">Billetera Crypto (USDT/BTC)</SelectItem>
                                                        <SelectItem value="paypal">PayPal</SelectItem>
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {type === 'credit_card' && (
                                            <motion.div key="cc" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-gray-300">Número de Tarjeta</Label>
                                                    <Input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" className="bg-[#0D0D0D] border-[#333333] text-white h-12" maxLength={19} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-gray-300">Expiración</Label>
                                                        <Input
                                                            value={expiry}
                                                            onChange={e => {
                                                                let v = e.target.value.replace(/\D/g, '');
                                                                if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                                                                setExpiry(v);
                                                            }}
                                                            placeholder="MM/YY"
                                                            className="bg-[#0D0D0D] border-[#333333] text-white h-12"
                                                            maxLength={5}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-gray-300">CVC</Label>
                                                        <Input
                                                            value={cvc}
                                                            onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                            placeholder="123"
                                                            className="bg-[#0D0D0D] border-[#333333] text-white h-12"
                                                            maxLength={4}
                                                            type="password"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {type === 'paypal' && (
                                            <motion.div key="pp" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-gray-300">Email de PayPal</Label>
                                                    <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" className="bg-[#0D0D0D] border-[#333333] text-white h-12" />
                                                </div>
                                            </motion.div>
                                        )}

                                        {type === 'bank_transfer' && (
                                            <motion.div key="bank" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-gray-300">IBAN / Número de Cuenta</Label>
                                                    <Input value={iban} onChange={e => setIban(e.target.value)} placeholder="ES00 0000 ..." className="bg-[#0D0D0D] border-[#333333] text-white h-12" />
                                                </div>
                                            </motion.div>
                                        )}

                                        {type === 'crypto_wallet' && (
                                            <motion.div key="crypto" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-gray-300">Dirección de Billetera</Label>
                                                    <Input value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder="0x..." className="bg-[#0D0D0D] border-[#333333] text-white h-12" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex gap-4 pt-6">
                                        <Button onClick={handleSave} disabled={isLoading} className="flex-1 bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] h-12 text-lg font-semibold">
                                            {isLoading ? 'Procesando...' : (editingId ? 'Actualizar Método' : 'Guardar y Usar')}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Section */}
                            <div className="flex flex-col items-center justify-center p-8 bg-[#0D0D0D]/50 rounded-xl border border-[#333333]/50">
                                <h5 className="text-gray-400 text-sm uppercase tracking-widest mb-8">Vista Previa</h5>
                                <LiveCardPreview />
                                <p className="mt-8 text-center text-gray-500 text-sm max-w-xs">
                                    Tus datos están protegidos con encriptación de grado bancario.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        {/* Add New Card Button */}
                        <motion.button
                            layout
                            whileHover={{ scale: 1.02, borderColor: '#00FF85' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}
                            className="h-48 rounded-2xl border-2 border-dashed border-[#333333] bg-[#0D0D0D]/30 flex flex-col items-center justify-center gap-4 group transition-colors hover:bg-[#1A1A1A]"
                        >
                            <div className="p-4 rounded-full bg-[#1A1A1A] group-hover:bg-[#00FF85]/10 group-hover:text-[#00FF85] transition-colors border border-[#333333]">
                                <Plus className="h-6 w-6 text-gray-400 group-hover:text-[#00FF85]" />
                            </div>
                            <span className="text-gray-400 font-medium group-hover:text-white transition-colors">Agregar Nuevo Método</span>
                        </motion.button>

                        <AnimatePresence>
                            {methods.map((method) => {
                                const details = getMethodDetails(method);
                                return (
                                    <motion.div
                                        key={method.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        layout
                                        className={`relative h-48 rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-lg bg-gradient-to-br ${getGradient(method.type)} group`}
                                    >
                                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>

                                        <div className="relative z-10 flex justify-between items-start">
                                            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                                                {method.type === 'credit_card' && <CreditCard className="text-white h-6 w-6" />}
                                                {method.type === 'paypal' && <span className="text-white font-bold">Pay</span>}
                                                {method.type === 'bank_transfer' && <Building2 className="text-white h-6 w-6" />}
                                                {method.type === 'crypto_wallet' && <Wallet className="text-white h-6 w-6" />}
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(method)} className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(method.id)} className="p-2 bg-red-500/40 hover:bg-red-500/60 rounded-full text-white transition-all">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-white/80 text-xs font-semibold tracking-wider mb-1 capitalize">
                                                        {method.type.replace('_', ' ')}
                                                    </p>
                                                    <p className="text-white text-lg font-bold tracking-widest truncate max-w-[200px]">
                                                        {method.type === 'credit_card' && `•••• ${details.last4 || '0000'}`}
                                                        {method.type === 'paypal' && (details.email || 'Email')}
                                                        {method.type === 'bank_transfer' && (details.iban ? `•••• ${details.iban.slice(-4)}` : 'IBAN')}
                                                        {method.type === 'crypto_wallet' && (details.address ? `...${details.address.slice(-6)}` : 'Address')}
                                                    </p>
                                                </div>
                                                {method.id === editingId && (
                                                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
            <Alert />
        </div>
    );
}
