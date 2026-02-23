import { useState, useEffect } from 'react';
import { Save, Circle } from 'lucide-react';
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
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [initialData, setInitialData] = useState({
        name: '',
        lastname: '',
        email: '',
        bio: '',
        github_url: '',
        linkedin_url: ''
    });

    useEffect(() => {
        if (user) {
            const newFormData = {
                name: user.name || '',
                lastname: user.lastname || '',
                email: user.email || '',
                bio: user.profile?.bio || '',
                github_url: user.profile?.github_url || '',
                linkedin_url: user.profile?.linkedin_url || ''
            };
            setFormData(newFormData);
            setInitialData(newFormData);
            setHasUnsavedChanges(false);
        }
    }, [user]);

    // Detectar cambios no guardados
    useEffect(() => {
        const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);
        setHasUnsavedChanges(hasChanges);
    }, [formData, initialData]);

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
                background: 'var(--card)',
                color: 'var(--foreground)'
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el perfil.',
                background: 'var(--card)',
                color: 'var(--foreground)'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Información Personal</h2>
                <p className="text-muted-foreground text-sm">Actualiza tu información pública y privada.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-muted-foreground mb-1">Nombre</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-card border border-border rounded-lg p-3 text-foreground focus:border-primary outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-muted-foreground mb-1">Apellido</label>
                        <input
                            type="text"
                            value={formData.lastname}
                            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                            className="w-full bg-card border border-border rounded-lg p-3 text-foreground focus:border-primary outline-none"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-muted-foreground mb-1">Correo Electrónico</label>
                    <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full bg-muted/50 border border-border rounded-lg p-3 text-muted-foreground cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-sm text-muted-foreground mb-1">Biografía</label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full bg-card border border-border rounded-lg p-3 text-foreground focus:border-primary outline-none h-24 resize-none"
                        placeholder="Cuéntanos sobre ti..."
                    />
                </div>

                <div className="flex justify-between items-center pt-4">
                    {hasUnsavedChanges && (
                        <div className="flex items-center gap-2 text-amber-500">
                            <Circle className="w-2 h-2 fill-amber-500" />
                            <span className="text-sm">Tienes cambios sin guardar</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        {!hasUnsavedChanges && <span className="text-sm text-muted-foreground mr-2">Todos los cambios guardados</span>}
                        <button
                            type="submit"
                            disabled={loading || !hasUnsavedChanges}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${hasUnsavedChanges
                                    ? 'bg-amber-500 hover:bg-amber-600 text-black'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/80'
                                } disabled:opacity-50`}
                        >
                            {loading ? 'Guardando...' : (
                                <>
                                    {hasUnsavedChanges && <Circle className="w-3 h-3 fill-black" />}
                                    <Save className="w-4 h-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
