import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAuth } from '../../../../contexts/AuthContext';
import { apiRequest } from '../../../../services/apiClient';

const MySwal = withReactContent(Swal);

export function AdminSettings() {
    const { user, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#00FF85] glow-text mb-2">Configuración</h1>
                    <p className="text-gray-400">Administra tu perfil y la seguridad de tu cuenta.</p>
                </div>

                <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-[#1A1A1A] border border-[#333333] mb-6">
                        <TabsTrigger
                            value="profile"
                            className="flex items-center gap-2 data-[state=active]:bg-[#00FF85] data-[state=active]:text-[#0D0D0D] transition-all"
                        >
                            <User className="w-4 h-4" />
                            Perfil
                        </TabsTrigger>
                        <TabsTrigger
                            value="security"
                            className="flex items-center gap-2 data-[state=active]:bg-[#00FF85] data-[state=active]:text-[#0D0D0D] transition-all"
                        >
                            <Lock className="w-4 h-4" />
                            Seguridad
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <ProfileSettings user={user} onUpdate={refreshUser} />
                    </TabsContent>

                    <TabsContent value="security">
                        <SecuritySettings />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function ProfileSettings({ user, onUpdate }: { user: any, onUpdate: () => Promise<void> }) {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                lastname: user.lastname || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiRequest('/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    name: formData.name,
                    lastname: formData.lastname
                })
            });

            await onUpdate(); // Refresh user context

            MySwal.fire({
                icon: 'success',
                title: 'Perfil Actualizado',
                text: 'Tus datos han sido guardados correctamente.',
                background: '#1A1A1A',
                color: '#fff',
                confirmButtonColor: '#00FF85'
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el perfil.',
                background: '#1A1A1A',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="bg-[#1A1A1A] border-[#333333]">
                <CardHeader>
                    <CardTitle className="text-[#00FF85] flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Información Personal
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Apellido</label>
                                <input
                                    type="text"
                                    value={formData.lastname}
                                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                    className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full bg-[#0D0D0D]/50 border border-[#333333] rounded-lg p-3 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                El correo electrónico no se puede modificar.
                            </p>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-[#00FF85] text-[#0D0D0D] px-6 py-2.5 rounded-lg font-bold hover:bg-[#00CC6A] transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    'Guardando...'
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function SecuritySettings() {
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
                background: '#1A1A1A',
                color: '#fff'
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
                    background: '#1A1A1A',
                    color: '#fff',
                    confirmButtonColor: '#00FF85'
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
                background: '#1A1A1A',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="bg-[#1A1A1A] border-[#333333]">
                <CardHeader>
                    <CardTitle className="text-[#00FF85] flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Cambiar Contraseña
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Contraseña Actual</label>
                            <input
                                type="password"
                                value={passwords.current_password}
                                onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                                className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={passwords.new_password}
                                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                                    className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] outline-none transition-all"
                                    required
                                    minLength={8}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Confirmar Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={passwords.new_password_confirmation}
                                    onChange={(e) => setPasswords({ ...passwords, new_password_confirmation: e.target.value })}
                                    className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] outline-none transition-all"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-[#00FF85] text-[#0D0D0D] px-6 py-2.5 rounded-lg font-bold hover:bg-[#00CC6A] transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    'Actualizando...'
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Actualizar Contraseña
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}
