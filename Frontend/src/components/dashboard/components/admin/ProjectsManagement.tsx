import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Trash2, Eye,
    RefreshCcw, CheckCircle, XCircle, Clock, FolderOpen
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

import {
    fetchAdminProjects,
    deleteAdminProject,
    restoreAdminProject,
    type AdminProjectParams
} from '../../../../services/adminProjectService';
import type { ProjectResponse } from '../../../../services/projectService';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

const MySwal = withReactContent(Swal);

export function ProjectsManagement() {
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<AdminProjectParams>({
        page: 1,
        per_page: 10,
        status: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        loadProjects();
    }, [filters]);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const response = await fetchAdminProjects(filters);
            if (response.success) {
                setProjects(response.projects);
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los proyectos',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                confirmButtonColor: 'hsl(var(--primary))'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev: AdminProjectParams) => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleStatusFilter = (status: string) => {
        setFilters((prev: AdminProjectParams) => ({ ...prev, status, page: 1 }));
    };

    const handleDelete = async (project: ProjectResponse) => {
        const result = await MySwal.fire({
            title: '¿Estás seguro?',
            text: "El proyecto se moverá a la papelera (Soft Delete)",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))'
        });

        if (result.isConfirmed) {
            try {
                const response = await deleteAdminProject(project.id);
                if (response.success) {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'El proyecto ha sido eliminado correctamente',
                        background: 'hsl(var(--card))',
                        color: 'hsl(var(--foreground))',
                        confirmButtonColor: 'hsl(var(--primary))'
                    });
                    loadProjects();
                }
            } catch (error) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar el proyecto',
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))'
                });
            }
        }
    };

    const handleRestore = async (project: ProjectResponse) => {
        const result = await MySwal.fire({
            title: '¿Restaurar proyecto?',
            text: "El proyecto volverá a estar activo",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#00FF85',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, restaurar',
            cancelButtonText: 'Cancelar',
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))'
        });

        if (result.isConfirmed) {
            try {
                const response = await restoreAdminProject(project.id);
                if (response.success) {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Restaurado',
                        text: 'El proyecto ha sido restaurado correctamente',
                        background: 'hsl(var(--card))',
                        color: 'hsl(var(--foreground))',
                        confirmButtonColor: 'hsl(var(--primary))'
                    });
                    loadProjects();
                }
            } catch (error) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo restaurar el proyecto',
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))'
                });
            }
        }
    };

    const getStatusBadge = (status: string, deletedAt?: string) => {
        if (deletedAt) {
            return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500 border border-red-500/40 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" />
                    Eliminado
                </span>
            );
        }

        switch (status) {
            case 'open':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/40">Abierto</span>;
            case 'in_progress':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500 border border-blue-500/40">En Progreso</span>;
            case 'completed':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-500 border border-purple-500/40">Completado</span>;
            case 'cancelled':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/40">Cancelado</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/40">{status}</span>;
        }
    };

    return (
        <div className="space-y-6 p-6 min-h-screen bg-background text-foreground">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary glow-text flex items-center gap-3">
                        <RefreshCcw className="w-8 h-8" />
                        Gestión de Proyectos
                    </h1>
                    <p className="text-muted-foreground mt-1">Administra, edita y recupera proyectos de la plataforma.</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar proyectos..."
                            className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary w-64 transition-all"
                            value={filters.search}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                            className="pl-9 pr-8 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary appearance-none cursor-pointer"
                            value={filters.status}
                            onChange={(e) => handleStatusFilter(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="open">Abiertos</option>
                            <option value="in_progress">En Progreso</option>
                            <option value="completed">Completados</option>
                            <option value="cancelled">Cancelados</option>
                            <option value="deleted">Eliminados</option>
                        </select>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 gap-4"
                    >
                        {/* Skeleton Loaders para proyectos */}
                        {[...Array(4)].map((_, index) => (
                            <Card key={index} className="bg-card border-border">
                                <CardContent className="p-5">
                                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Skeleton className="h-6 w-48" />
                                                <Skeleton className="h-5 w-20 rounded-full" />
                                            </div>
                                            <Skeleton className="h-4 w-full mb-2" />
                                            <Skeleton className="h-4 w-2/3 mb-3" />
                                            <div className="flex flex-wrap gap-4">
                                                <Skeleton className="h-3 w-24" />
                                                <Skeleton className="h-3 w-32" />
                                                <Skeleton className="h-3 w-28" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-8 w-8 rounded" />
                                            <Skeleton className="h-8 w-8 rounded" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>
                ) : projects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Estado vacío decorativo */}
                        <Card className="bg-card border-border border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <FolderOpen className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">No hay proyectos</h3>
                                <p className="text-muted-foreground text-center mb-6 max-w-md">
                                    No se encontraron proyectos que coincidan con los filtros seleccionados.
                                    ¡Publica el primer proyecto para comenzar!
                                </p>
                                <Button
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    onClick={() => {
                                        setFilters((prev: AdminProjectParams) => ({ ...prev, search: '', status: '' }));
                                    }}
                                >
                                    <RefreshCcw className="w-4 h-4 mr-2" />
                                    Ver Todos los Proyectos
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 gap-4"
                    >
                        {projects.map((project) => (
                            <Card key={project.id} className={`bg-card border-border hover:border-primary/30 transition-all duration-300 ${project.deleted_at ? 'opacity-75 border-red-900/30' : ''}`}>
                                <CardContent className="p-5">
                                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {project.title}
                                                </h3>
                                                {getStatusBadge(project.status, project.deleted_at || undefined)}
                                            </div>

                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>

                                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3 text-[#00FF85]" />
                                                    ID: {project.id}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Creado: {new Date(project.created_at).toLocaleDateString()}
                                                </span>
                                                {project.company && (
                                                    <span className="flex items-center gap-1 text-blue-400">
                                                        @ {project.company.name}
                                                    </span>
                                                )}
                                                {project.deleted_at && (
                                                    <span className="flex items-center gap-1 text-red-400 font-semibold bg-red-900/20 px-2 py-0.5 rounded">
                                                        <Trash2 className="w-3 h-3" />
                                                        Borrado {formatDistanceToNow(new Date(project.deleted_at), { addSuffix: true, locale: es })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end md:self-center">
                                            {project.deleted_at ? (
                                                <button
                                                    onClick={() => handleRestore(project)}
                                                    className="bg-green-600/20 hover:bg-green-600/40 text-green-500 text-sm px-3 py-1.5 rounded-md flex items-center gap-2 transition-all"
                                                >
                                                    <RefreshCcw className="w-4 h-4" />
                                                    Restaurar
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProject(project);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="bg-accent hover:bg-muted text-muted-foreground hover:text-foreground p-2 rounded-md transition-all"
                                                        title="Ver Detalles"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(project)}
                                                        className="bg-red-500/10 hover:bg-red-500/30 text-red-500 p-2 rounded-md transition-all"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
                <button
                    onClick={() => setFilters((prev: AdminProjectParams) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                    disabled={pagination.current_page === 1}
                    className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground disabled:opacity-50 hover:bg-accent transition-all"
                >
                    Anterior
                </button>
                <span className="px-4 py-2 text-muted-foreground text-sm flex items-center">
                    Página {pagination.current_page} de {pagination.last_page}
                </span>
                <button
                    onClick={() => setFilters((prev: AdminProjectParams) => ({ ...prev, page: (prev.page || 1) + 1 }))}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground disabled:opacity-50 hover:bg-accent transition-all"
                >
                    Siguiente
                </button>
            </div>

            {isEditModalOpen && selectedProject !== null && (
                <ProjectDetailsModal
                    project={selectedProject as ProjectResponse}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </div>
    );
}

function ProjectDetailsModal({ project, onClose }: { project: ProjectResponse, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border rounded-xl w-full max-w-lg p-6 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-foreground">Detalles del Proyecto</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-muted-foreground mb-1">Título</label>
                        <div className="w-full bg-background border border-border rounded p-2 text-foreground">
                            {project.title}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-muted-foreground mb-1">Descripción</label>
                        <div className="w-full bg-background border border-border rounded p-2 text-foreground h-24 overflow-y-auto">
                            {project.description}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">Presupuesto Min</label>
                            <div className="w-full bg-background border border-border rounded p-2 text-foreground">
                                ${project.budget_min}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">Presupuesto Max</label>
                            <div className="w-full bg-background border border-border rounded p-2 text-foreground">
                                ${project.budget_max}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-muted-foreground mb-1">Estado</label>
                        <div className="w-full bg-background border border-border rounded p-2 text-foreground capitalize">
                            {project.status === 'in_progress' ? 'En Progreso' :
                                project.status === 'completed' ? 'Completado' :
                                    project.status === 'cancelled' ? 'Cancelado' :
                                        project.status === 'open' ? 'Abierto' : project.status}
                        </div>
                    </div>

                    {project.deleted_at && (
                        <div>
                            <label className="block text-sm text-red-400 mb-1">Información de Eliminación</label>
                            <div className="w-full bg-red-900/10 border border-red-900/30 rounded p-2 text-red-300">
                                Eliminado {formatDistanceToNow(new Date(project.deleted_at), { addSuffix: true, locale: es })}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-card border border-border hover:bg-accent text-foreground rounded-lg transition-all"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
