import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Clock, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { type ProjectResponse } from '../../../services/projectService';
import apiClient from '../../../services/apiClient';

interface MyActiveProjectsSectionProps {
    onWorkspaceSelect: (project: ProjectResponse) => void;
}

export function MyActiveProjectsSection({ onWorkspaceSelect }: MyActiveProjectsSectionProps) {
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadMyProjects();
    }, []);

    const loadMyProjects = async () => {
        try {
            // Updated to use the new filter parameter in ProjectController
            const response = await apiClient.get<any>('/projects?my_projects=true');
            // @ts-ignore
            const data = response.data || response;
            setProjects(data);
        } catch (error) {
            console.error(error);
            setError('No se pudieron cargar los proyectos. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'in_progress': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">En Progreso</Badge>;
            case 'completed': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">Completado</Badge>;
            case 'review': return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20">En Revisión</Badge>;
            default: return <Badge variant="outline" className="text-gray-400 border-gray-700">{status}</Badge>;
        }
    };

    // Helper function to calculate progress (extracted to avoid repetition)
    const calculateProgress = (project: ProjectResponse): number => {
        if (!project.milestones_count || project.milestones_count === 0) return 0;
        return Math.round((project.completed_milestones_count || 0) / project.milestones_count * 100);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-red-500/30 rounded-2xl bg-red-500/5">
                    <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <Clock className="h-10 w-10 text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Error al cargar proyectos</h3>
                    <p className="text-gray-400 max-w-md text-center mb-6">
                        {error}
                    </p>
                    <Button
                        onClick={() => {
                            setError(null);
                            setLoading(true);
                            loadMyProjects();
                        }}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-1 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Mis Proyectos Activos
                </h1>
                <p className="text-muted-foreground text-sm">
                    Gestiona el avance y entregables de tus desarrollos en curso.
                </p>
            </div>

            {projects.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-2xl bg-card/50"
                >
                    <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mb-4 border border-primary/20">
                        <Clock className="h-10 w-10 text-primary/50" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Sin proyectos activos</h3>
                    <p className="text-muted-foreground max-w-md text-center mb-6">
                        Aún no tienes proyectos en curso. Explora las oportunidades disponibles y postúlate para comenzar un nuevo reto.
                    </p>
                    <Button
                        variant="outline"
                        className="border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() => {/* navegar a proyectos publicados - el padre lo maneja */ }}
                    >
                        <Play className="h-4 w-4 mr-2" />
                        Explorar proyectos
                    </Button>
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {projects.map((project) => (
                        <motion.div key={project.id} variants={item}>
                            <Card className="group bg-card border-border hover:border-primary/50 transition-all duration-300 h-full flex flex-col overflow-hidden hover:shadow-lg hover:shadow-primary/5">
                                <CardHeader className="relative pb-2">
                                    <div className="absolute top-0 right-0 p-3">
                                        {getStatusBadge(project.status)}
                                    </div>
                                    <div className="space-y-1">
                                        <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-accent mb-2">
                                            {project.company?.name || 'Empresa Confidencial'}
                                        </Badge>
                                        <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                            {project.title}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col gap-3">
                                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Progress Bar for Active Projects */}
                                    {project.status === 'in_progress' && (
                                        <div className="space-y-2 mt-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs font-medium text-gray-400">
                                                    Hitos: {project.completed_milestones_count ?? 0}/{project.milestones_count ?? 0}
                                                </span>
                                                <span className="text-sm font-bold text-primary">
                                                    {calculateProgress(project)}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${calculateProgress(project)}%`
                                                    }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={`h-full rounded-full ${calculateProgress(project) === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                                                        calculateProgress(project) > 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                                                            'bg-gradient-to-r from-yellow-500 to-orange-400'
                                                        }`}
                                                />
                                            </div>
                                            {project.milestones_count === 0 && (
                                                <p className="text-[10px] text-gray-600 italic">Sin hitos definidos aún</p>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-auto pt-3 space-y-3">
                                        <div className="flex items-center text-sm text-muted-foreground gap-2 bg-muted/50 p-2 rounded-lg">
                                            <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                                            <span className="text-xs text-foreground/70 font-medium">Entrega:</span>
                                            <span className="text-xs">
                                                {project.deadline
                                                    ? new Date(project.deadline).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                                                    : 'Sin fecha definida'}
                                            </span>
                                        </div>

                                        <Button
                                            className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold h-11 transition-all duration-300 group-hover:translate-y-[-2px]"
                                            onClick={() => onWorkspaceSelect(project)}
                                        >
                                            <Play className="h-4 w-4 mr-2 fill-current" />
                                            Ir al Espacio de Trabajo
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )
            }
        </div >
    );
}
