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

    useEffect(() => {
        const loadMyProjects = async () => {
            try {
                // Updated to use the new filter parameter in ProjectController
                const response = await apiClient.get<any>('/projects?my_projects=true');
                // @ts-ignore
                const data = response.data || response;
                setProjects(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadMyProjects();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'in_progress': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">En Progreso</Badge>;
            case 'completed': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">Completado</Badge>;
            case 'review': return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20">En Revisión</Badge>;
            default: return <Badge variant="outline" className="text-gray-400 border-gray-700">{status}</Badge>;
        }
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

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Mis Proyectos Activos
                </h1>
                <p className="text-gray-400 text-lg">
                    Gestiona el avance y entregables de tus desarrollos en curso.
                </p>
            </div>

            {projects.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center p-12 border border-dashed border-[#333333] rounded-2xl bg-[#1A1A1A]/50"
                >
                    <div className="h-20 w-20 bg-[#333333]/50 rounded-full flex items-center justify-center mb-4">
                        <Clock className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Sin proyectos activos</h3>
                    <p className="text-gray-400 max-w-md text-center">
                        Aún no tienes proyectos en curso. Explora las oportunidades disponibles y postúlate para comenzar un nuevo reto.
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {projects.map((project) => (
                        <motion.div key={project.id} variants={item}>
                            <Card className="group bg-[#151515] border-[#333333] hover:border-primary/50 transition-all duration-300 h-full flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-primary/5">
                                <CardHeader className="relative pb-2">
                                    <div className="absolute top-0 right-0 p-4">
                                        {getStatusBadge(project.status)}
                                    </div>
                                    <div className="space-y-1">
                                        <Badge variant="secondary" className="bg-[#2A2A2A] text-gray-300 hover:bg-[#333333] mb-2">
                                            {project.company?.name || 'Empresa Confidencial'}
                                        </Badge>
                                        <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                                            {project.title}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col gap-4">
                                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                                        {project.description}
                                    </p>

                                    <div className="mt-auto pt-4 space-y-4">
                                        <div className="flex items-center text-sm text-gray-500 gap-2 bg-[#1A1A1A] p-2 rounded-lg">
                                            <Clock className="h-4 w-4 text-primary" />
                                            <span className="font-medium text-gray-300">Entrega estimada:</span>
                                            <span>
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
            )}
        </div>
    );
}
