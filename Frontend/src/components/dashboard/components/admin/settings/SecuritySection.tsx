import { useState } from 'react';
import { Shield, Key, Lock, Smartphone, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../../../../services/apiClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export function SecuritySettings() {
    // Legacy export name handling
    return <SecuritySection />;
}

export function SecuritySection() {
    const [passwords, setPasswords] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.new_password !== passwords.new_password_confirmation) {
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las nuevas contraseñas no coinciden.',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))'
            });
            return;
        }

        setLoading(true);

        try {
            const response = await apiRequest<{ success: boolean; message: string }>('/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({
                    current_password: passwords.current_password,
                    new_password: passwords.new_password,
                    new_password_confirmation: passwords.new_password_confirmation
                })
            });

            if (response.success) {
                MySwal.fire({
                    icon: 'success',
                    title: 'Contraseña Actualizada',
                    text: 'Tu contraseña ha sido cambiada exitosamente.',
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    confirmButtonColor: 'hsl(var(--primary))'
                });
                setPasswords({
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: ''
                });
            }
        } catch (error: any) {
            console.error('Error changing password:', error);
            const msg = error.message || 'No se pudo cambiar la contraseña.';
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: msg,
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Seguridad</h2>
                <p className="text-muted-foreground text-sm">Gestiona tu contraseña y la seguridad de tu cuenta.</p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2 mb-4">
                    <Key className="w-5 h-5" />
                    Cambiar Contraseña
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-muted-foreground mb-1">Contraseña Actual</label>
                        <input
                            type="password"
                            value={passwords.current_password}
                            onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">Nueva Contraseña</label>
                            <input
                                type="password"
                                value={passwords.new_password}
                                onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                                className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary outline-none"
                                required
                                minLength={8}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                value={passwords.new_password_confirmation}
                                onChange={(e) => setPasswords({ ...passwords, new_password_confirmation: e.target.value })}
                                className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:border-primary outline-none"
                                required
                                minLength={8}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold hover:bg-primary/80 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Actualizando...' : (
                                <>
                                    <Shield className="w-4 h-4" />
                                    Actualizar Contraseña
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* 2FA Placeholder - Diseño mejorado */}
            <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                Autenticación de Dos Factores (2FA)
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                Añade una capa adicional de seguridad a tu cuenta requiriendo un código de verificación además de tu contraseña.
                            </p>
                        </div>
                    </div>
                    <div className="bg-amber-500/10 text-amber-500 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Próximamente
                    </div>
                </div>

                {/* Características futuras */}
                <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground mb-3">Próximas características:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Smartphone className="w-4 h-4 text-primary" />
                            <span>Códigos por aplicación autenticadora</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span>Verificación por SMS</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Key className="w-4 h-4 text-primary" />
                            <span>Llaves de seguridad físicas</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <AlertCircle className="w-4 h-4 text-primary" />
                            <span>Notificaciones de inicio de sesión</span>
                        </div>
                    </div>
                </div>

                {/* Banner informativo */}
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground">Nota:</strong> La autenticación de dos factores estará disponible en futuras actualizaciones.
                        Mantén tu contraseña segura y no la compartas con nadie.
                    </p>
                </div>
            </div>
        </div>
    );
}
