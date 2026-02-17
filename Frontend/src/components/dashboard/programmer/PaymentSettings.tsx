import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { CreditCard, Trash2, Plus, Landmark, Wallet, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSweetAlert } from '../../ui/sweet-alert';
import apiClient from '../../../services/apiClient';

interface PaymentMethod {
    id: number;
    type: 'credit_card' | 'paypal' | 'bank_transfer' | 'crypto_wallet';
    details: string;
    is_default: boolean;
}

export function PaymentSettings() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const { showAlert } = useSweetAlert();

    const [newMethod, setNewMethod] = useState({
        type: 'paypal',
        details: '',
    });

    const fetchMethods = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<PaymentMethod[]>('/payment-methods');
            // @ts-ignore
            setMethods(response.data || response);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMethods();
    }, []);

    const handleAddMethod = async () => {
        if (!newMethod.details) {
            showAlert({
                title: 'Error',
                text: 'Por favor completa los detalles de la cuenta',
                type: 'error',
            });
            return;
        }

        try {
            await apiClient.post('/payment-methods', {
                type: newMethod.type,
                details: newMethod.details,
                is_default: methods.length === 0 // Make default if it's the first one
            });

            showAlert({
                title: 'Éxito',
                text: 'Método de pago agregado correctamente',
                type: 'success',
            });

            setIsAdding(false);
            setNewMethod({ type: 'paypal', details: '' });
            fetchMethods();
        } catch (error) {
            console.error(error);
            showAlert({
                title: 'Error',
                text: 'No se pudo agregar el método de pago',
                type: 'error',
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await apiClient.delete(`/payment-methods/${id}`);
            setMethods(methods.filter(m => m.id !== id));
            showAlert({
                title: 'Eliminado',
                text: 'Método de pago eliminado',
                type: 'success',
                timer: 1500
            });
        } catch (error) {
            showAlert({
                title: 'Error',
                text: 'No se pudo eliminar',
                type: 'error',
            });
        }
    };

    const setDefault = async (method: PaymentMethod) => {
        if (method.is_default) return;

        try {
            await apiClient.put(`/payment-methods/${method.id}`, {
                ...method,
                is_default: true
            });
            fetchMethods(); // Refresh to update others
        } catch (error) {
            console.error(error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'paypal': return <Wallet className="h-5 w-5" />;
            case 'bank_transfer': return <Landmark className="h-5 w-5" />;
            case 'credit_card': return <CreditCard className="h-5 w-5" />;
            default: return <Wallet className="h-5 w-5" />;
        }
    };

    const getLabel = (type: string) => {
        switch (type) {
            case 'paypal': return 'PayPal';
            case 'bank_transfer': return 'Transferencia Bancaria';
            case 'credit_card': return 'Tarjeta de Crédito/Débito';
            case 'crypto_wallet': return 'Billetera Crypto';
            default: return type;
        }
    };

    return (
        <Card className="bg-card border-border hover:border-primary/20 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-foreground flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Métodos de Pago
                    </CardTitle>
                    <CardDescription>
                        Configura dónde recibirás tus fondos automáticamente.
                    </CardDescription>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {loading && <p className="text-sm text-muted-foreground">Cargando...</p>}

                <div className="space-y-3">
                    {methods.map((method) => (
                        <motion.div
                            key={method.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center justify-between p-4 rounded-lg border ${method.is_default ? 'border-primary/50 bg-primary/5' : 'border-border bg-background'}`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${method.is_default ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    {getIcon(method.type)}
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground flex items-center gap-2">
                                        {getLabel(method.type)}
                                        {method.is_default && <Badge className="text-xs bg-primary/20 text-primary hover:bg-primary/30 border-none">Principal</Badge>}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{method.details}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {!method.is_default && (
                                    <Button variant="ghost" size="sm" onClick={() => setDefault(method)} title="Marcar como principal">
                                        <CheckCircle2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(method.id)} className="text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}

                    {methods.length === 0 && !loading && !isAdding && (
                        <div className="text-center py-6 text-muted-foreground">
                            No tienes métodos de pago configurados.
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-border pt-4 mt-4"
                        >
                            <h4 className="text-sm font-semibold mb-3">Agregar nuevo método</h4>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Tipo</Label>
                                        <Select
                                            value={newMethod.type}
                                            onValueChange={(val) => setNewMethod({ ...newMethod, type: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="paypal">PayPal</SelectItem>
                                                <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                                                {/* <SelectItem value="crypto_wallet">Crypto Wallet</SelectItem> */}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Detalles (Email o IBAN)</Label>
                                        <Input
                                            value={newMethod.details}
                                            onChange={(e) => setNewMethod({ ...newMethod, details: e.target.value })}
                                            placeholder={newMethod.type === 'paypal' ? 'ejemplo@paypal.com' : 'ES12 3456...'}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsAdding(false)}>Cancelar</Button>
                                    <Button onClick={handleAddMethod}>Guardar</Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
