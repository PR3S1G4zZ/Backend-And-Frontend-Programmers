import { useState, useEffect } from 'react';
import { apiRequest } from '../../../../../services/apiClient';
import { categoryService, type Category } from '../../../../../services/categoryService';
import { Save, Plus, Trash2, Edit2, Percent, ShieldCheck, X } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { cn } from '../../../../../components/ui/utils';

const MySwal = withReactContent(Swal);

export function MarketplaceSection() {
    const [settings, setSettings] = useState({
        commission_rate: '10',
        manual_approval: 'false',
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingSettings, setSavingSettings] = useState(false);

    // Category Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryForm, setCategoryForm] = useState({ name: '', description: '', color: '#00FF85', icon: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [settingsRes, categoriesRes] = await Promise.all([
                apiRequest<any>('/admin/system/settings'),
                categoryService.getAll()
            ]);

            if (settingsRes.success) {
                // Transform grouped settings to flat object
                const flatSettings: any = {};
                Object.values(settingsRes.settings).flat().forEach((s: any) => {
                    flatSettings[s.key] = s.value;
                });
                setSettings(prev => ({ ...prev, ...flatSettings }));
            }

            const catRes = categoriesRes as any;
            if (catRes.success) {
                setCategories(catRes.data);
            }
        } catch (error) {
            console.error('Error fetching marketplace data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSavingSettings(true);
        try {
            await apiRequest('/admin/system/settings', {
                method: 'PUT',
                body: JSON.stringify({
                    settings: [
                        { key: 'commission_rate', value: settings.commission_rate },
                        { key: 'manual_approval', value: settings.manual_approval }
                    ]
                })
            });

            MySwal.fire({
                icon: 'success',
                title: 'Configuración guardada',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#1A1A1A',
                color: '#fff'
            });
        } catch (error) {
            console.error('Error saving settings:', error);
            MySwal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: 'No se pudo actualizar la configuración.',
                background: '#1A1A1A',
                color: '#fff'
            });
        } finally {
            setSavingSettings(false);
        }
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await categoryService.update(editingCategory.id, categoryForm);
            } else {
                await categoryService.create(categoryForm);
            }

            setIsModalOpen(false);
            setEditingCategory(null);
            setCategoryForm({ name: '', description: '', color: '#00FF85', icon: '' });
            fetchData(); // Refresh list

            MySwal.fire({
                icon: 'success',
                title: editingCategory ? 'Categoría actualizada' : 'Categoría creada',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#1A1A1A',
                color: '#fff'
            });
        } catch (error) {
            console.error('Error saving category:', error);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo guardar la categoría.',
                background: '#1A1A1A',
                color: '#fff'
            });
        }
    };

    const handleDeleteCategory = async (id: number) => {
        const result = await MySwal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1A1A1A',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await categoryService.delete(id);
                fetchData();
                MySwal.fire({
                    title: 'Eliminado!',
                    text: 'La categoría ha sido eliminada.',
                    icon: 'success',
                    background: '#1A1A1A',
                    color: '#fff'
                });
            } catch (error) {
                console.error('Error deleting category:', error);
                MySwal.fire({
                    title: 'Error!',
                    text: 'No se pudo eliminar la categoría.',
                    icon: 'error',
                    background: '#1A1A1A',
                    color: '#fff'
                });
            }
        }
    };

    const openModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setCategoryForm({
                name: category.name,
                description: category.description || '',
                color: category.color || '#00FF85',
                icon: category.icon || ''
            });
        } else {
            setEditingCategory(null);
            setCategoryForm({ name: '', description: '', color: '#00FF85', icon: '' });
        }
        setIsModalOpen(true);
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Cargando configuración...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Gestión del Marketplace</h2>
                <p className="text-gray-400 text-sm">Configura comisiones y categorías de proyectos.</p>
            </div>

            {/* General Settings */}
            <div className="bg-[#0D0D0D] p-6 rounded-xl border border-[#333333] space-y-6">
                <h3 className="text-lg font-semibold text-[#00FF85] flex items-center gap-2">
                    <Percent className="w-5 h-5" />
                    Comisiones y Reglas
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Comisión de la Plataforma (%)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={settings.commission_rate}
                                onChange={(e) => setSettings({ ...settings, commission_rate: e.target.value })}
                                className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] outline-none pl-10"
                                min="0"
                                max="100"
                            />
                            <Percent className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Porcentaje retenido por cada proyecto completado.</p>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Aprobación Manual de Proyectos</label>
                        <button
                            onClick={() => setSettings({ ...settings, manual_approval: settings.manual_approval === 'true' ? 'false' : 'true' })}
                            className={cn(
                                "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                                settings.manual_approval === 'true'
                                    ? "bg-[#00FF85]/10 border-[#00FF85] text-[#00FF85]"
                                    : "bg-[#1A1A1A] border-[#333333] text-gray-400 hover:border-gray-500"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                {settings.manual_approval === 'true' ? 'Activado' : 'Desactivado'}
                            </span>
                            <div className={cn(
                                "w-10 h-6 rounded-full p-1 transition-colors relative",
                                settings.manual_approval === 'true' ? "bg-[#00FF85]" : "bg-gray-600"
                            )}>
                                <div className={cn(
                                    "w-4 h-4 bg-white rounded-full transition-transform",
                                    settings.manual_approval === 'true' ? "translate-x-4" : "translate-x-0"
                                )} />
                            </div>
                        </button>
                        <p className="text-xs text-gray-500 mt-1">Si está activo, un administrador debe aprobar cada proyecto antes de ser publicado.</p>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleSaveSettings}
                        disabled={savingSettings}
                        className="flex items-center gap-2 bg-[#00FF85] text-[#0D0D0D] px-6 py-2.5 rounded-lg font-bold hover:bg-[#00CC6A] transition-all disabled:opacity-50"
                    >
                        {savingSettings ? 'Guardando...' : (
                            <>
                                <Save className="w-4 h-4" />
                                Guardar Configuración
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Categories Management */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Categorías de Proyectos</h3>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 text-sm bg-[#1A1A1A] text-[#00FF85] px-4 py-2 rounded-lg border border-[#00FF85]/20 hover:bg-[#00FF85]/10 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Categoría
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-[#0D0D0D] p-4 rounded-xl border border-[#333333] group hover:border-gray-500 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-lg"
                                        style={{ backgroundColor: category.color || '#333', color: '#000' }}
                                    >
                                        {category.name.charAt(0)}
                                    </div>
                                    <h4 className="font-semibold text-white">{category.name}</h4>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openModal(category)}
                                        className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2">{category.description || 'Sin descripción'}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-6">
                            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                        </h3>

                        <form onSubmit={handleSaveCategory} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Descripción</label>
                                <textarea
                                    value={categoryForm.description}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                    className="w-full bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] outline-none h-24 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Color (Hex)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={categoryForm.color}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                                        className="h-10 w-10 rounded cursor-pointer bg-transparent border-none p-0"
                                    />
                                    <input
                                        type="text"
                                        value={categoryForm.color}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                                        className="flex-1 bg-[#0D0D0D] border border-[#333333] rounded-lg p-3 text-white focus:border-[#00FF85] outline-none"
                                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                                        placeholder="#00FF85"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#00FF85] text-[#0D0D0D] px-6 py-2 rounded-lg font-bold hover:bg-[#00CC6A] transition-all"
                                >
                                    {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
