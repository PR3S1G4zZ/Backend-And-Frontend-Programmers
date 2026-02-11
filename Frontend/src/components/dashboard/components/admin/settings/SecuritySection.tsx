import { useState } from 'react';
import { Shield, Smartphone, Key, LogOut, Monitor } from 'lucide-react';
import { apiRequest } from '../../../../../services/apiClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export function SecuritySection() {
    const [passwords, setPasswords] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.new_password !== passwords.new_password_confirmation) {
            MySwal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden.', background: '#1A1A1A', color: '#fff' });
            return;
        }

        setLoading(true);
        try {
            await apiRequest('/auth/change-password', {
                method: 'POST',
                body: JSON.stringify(passwords)
            });
            MySwal.fire({ icon: 'success', title: 'Actualizado', text: 'Contraseña cambiada correctamente.', background: '#1A1A1A', color: '#fff', confirmButtonColor: '#00FF85' });
            setPasswords({ current_password: '', new_password: '', new_password_confirmation: '' });
        } catch (error: any) {
            MySwal.fire({ icon: 'error', title: 'Error', text: error.message || 'Error al cambiar contraseña', background: '#1A1A1A', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Seguridad</h2>
                <p className="text-gray-400 text-sm">Gestiona tus credenciales y sesiones activas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Change Password */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[#00FF85] flex items-center gap-2">
                        <Key className="w-4 h-4" /> Cambio de Contraseña
                    </h3>
                    <form onSubmit={handlePasswordChange} className="space-y-3 p-5 bg-[#0D0D0D] rounded-xl border border-[#333333]">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Contraseña Actual</label>
                            <input
                                type="password"
                                value={passwords.current_password}
                                onChange={e => setPasswords({ ...passwords, current_password: e.target.value })}
                                className="w-full bg-[#1A1A1A] border border-[#333333] rounded p-2 text-sm text-white focus:border-[#00FF85] outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Nueva Contraseña</label>
                            <input
                                type="password"
                                value={passwords.new_password}
                                onChange={e => setPasswords({ ...passwords, new_password: e.target.value })}
                                className="w-full bg-[#1A1A1A] border border-[#333333] rounded p-2 text-sm text-white focus:border-[#00FF85] outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Confirmar</label>
                            <input
                                type="password"
                                value={passwords.new_password_confirmation}
                                onChange={e => setPasswords({ ...passwords, new_password_confirmation: e.target.value })}
                                className="w-full bg-[#1A1A1A] border border-[#333333] rounded p-2 text-sm text-white focus:border-[#00FF85] outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2A2A2A] hover:bg-[#333333] text-white py-2 rounded text-sm transition-colors border border-[#333333] hover:border-[#00FF85]"
                        >
                            {loading ? 'Actualizando...' : 'Actualizar Credenciales'}
                        </button>
                    </form>
                </div>

                {/* 2FA & Sessions */}
                <div className="space-y-6">
                    {/* 2FA Marketing */}
                    <div className="p-5 rounded-xl border border-[#333333] bg-gradient-to-br from-[#0D0D0D] to-[#00FF85]/5 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-[#00FF85]" />
                                Autenticación en 2 Pasos (2FA)
                            </h3>
                            <p className="text-xs text-gray-400 mb-4">
                                Añade una capa extra de seguridad usando Google Authenticator.
                            </p>
                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" disabled />
                                    <div className="w-11 h-6 bg-gray-700 bg-opacity-50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00FF85]"></div>
                                </label>
                                <span className="text-xs text-gray-500">Próximamente</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                            <Smartphone className="w-4 h-4" /> Sesiones Activas
                        </h3>
                        <div className="bg-[#0D0D0D] rounded-lg border border-[#333333] p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-[#1A1A1A] flex items-center justify-center text-[#00FF85]">
                                    <Monitor className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm text-white font-medium">Windows PC - Chrome</p>
                                    <p className="text-xs text-green-500">Sesión Actual • Lima, PE</p>
                                </div>
                            </div>
                        </div>
                        <button className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                            <LogOut className="w-3 h-3" /> Cerrar todas las demás sesiones
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


