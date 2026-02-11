import { useState, useEffect } from 'react';
import { User, Github, Linkedin, Globe, Save } from 'lucide-react';
import { apiRequest } from '../../../../../services/apiClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAuth } from '../../../../../contexts/AuthContext';

const MySwal = withReactContent(Swal);

export function ProfileSection() {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        bio: '',
        github: '',
        linkedin: '',
        portfolio: '',
        skills: [] as string[]
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                lastname: user.lastname || '',
                bio: user.profile?.bio || '', // Assuming relationship loaded or part of user object
                github: user.profile?.links?.github || '',
                linkedin: user.profile?.links?.linkedin || '',
                portfolio: user.profile?.links?.portfolio || '',
                skills: user.profile?.skills || [] // Assuming array of strings
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
                    bio: formData.bio,
                    links: {
                        github: formData.github,
                        linkedin: formData.linkedin,
                        portfolio: formData.portfolio
                    },
                    skills: formData.skills
                })
            });

            await refreshUser();

            MySwal.fire({
                icon: 'success',
                title: 'Perfil Actualizado',
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
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Mi Perfil</h2>
                <p className="text-gray-400 text-sm">Gestiona tu información personal y profesional.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Section (Placeholder for now) */}
                <div className="flex flex-col items-center gap-3">
                    <div className="w-32 h-32 rounded-full bg-[#2A2A2A] border-2 border-[#333333] flex items-center justify-center relative overflow-hidden group cursor-pointer">
                        <User className="w-12 h-12 text-gray-500" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-white  bg-[#00FF85]/20 border border-[#00FF85] px-2 py-1 rounded">Cambiar</span>
                        </div>
                    </div>
                    <span className="text-xs text-gray-500">JPG, PNG max 2MB</span>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] focus:ring-1 focus:ring-[#00FF85] outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Apellido</label>
                            <input
                                type="text"
                                value={formData.lastname}
                                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] focus:ring-1 focus:ring-[#00FF85] outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Bio Profesional</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={3}
                            className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] focus:ring-1 focus:ring-[#00FF85] outline-none transition-all resize-none"
                            placeholder="Cuéntanos un poco sobre ti..."
                        />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-300">Redes Sociales</h3>
                        <div className="relative">
                            <Github className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="GitHub URL"
                                value={formData.github}
                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:border-[#00FF85] outline-none"
                            />
                        </div>
                        <div className="relative">
                            <Linkedin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="LinkedIn URL"
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:border-[#00FF85] outline-none"
                            />
                        </div>
                        <div className="relative">
                            <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Portfolio Website"
                                value={formData.portfolio}
                                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                                className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:border-[#00FF85] outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-[#333333]">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-[#00FF85] text-[#0D0D0D] px-6 py-2 rounded-lg font-bold hover:bg-[#00CC6A] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : <><Save className="w-4 h-4" /> Guardar Cambios</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
