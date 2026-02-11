import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { apiRequest } from '../../../../../services/apiClient';
import { useAuth } from '../../../../../contexts/AuthContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export function ProfileSection() {
    const { user, refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        bio: '', // Added bio support
        github_url: '',
        linkedin_url: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                lastname: user.lastname || '',
                email: user.email || '',
                bio: user.profile?.bio || '',
                github_url: user.profile?.github_url || '',
                linkedin_url: user.profile?.linkedin_url || ''
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
                    lastname: formData.lastname,
                    profile: {
                        bio: formData.bio,
                        github_url: formData.github_url,
                        linkedin_url: formData.linkedin_url
                    }
                })
            });

            await refreshUser();

            MySwal.fire({
                icon: 'success',
                title: 'Perfil Actualizado',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#1A1A1A',
                color: '#fff'
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
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Información Personal</h2>
                <p className="text-gray-400 text-sm">Actualiza tu información pública y privada.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Apellido</label>
                        <input
                            type="text"
                            value={formData.lastname}
                            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                            className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] outline-none"
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
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Biografía</label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] outline-none h-24 resize-none"
                        placeholder="Cuéntanos sobre ti..."
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#00FF85] text-[#0D0D0D] px-6 py-2.5 rounded-lg font-bold hover:bg-[#00CC6A] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : (
                            <>
                                <Save className="w-4 h-4" />
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
