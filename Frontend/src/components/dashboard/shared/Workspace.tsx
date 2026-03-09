import { useState, useEffect } from 'react';

import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { ArrowLeft, Layout, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { MilestoneTimeline } from './MilestoneTimeline';
import { KanbanBoard } from './KanbanBoard';
import { ReviewDialog } from './ReviewDialog';

import apiClient from '../../../services/apiClient';
import { completeProject, type ProjectResponse } from '../../../services/projectService';

interface Project extends ProjectResponse {
    developer_progress?: number;
}

interface WorkspaceProps {
    projectId: number;
    userType: 'programmer' | 'company';
    onBack: () => void;
}

export function Workspace({ projectId, userType, onBack }: WorkspaceProps) {
    const [project, setProject] = useState<Project | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [projectCompleted, setProjectCompleted] = useState(false);
    const [selectedDeveloperId, setSelectedDeveloperId] = useState<number | null>(null);

    const fetchProject = async () => {
        try {
            const url = selectedDeveloperId
                ? `/projects/${projectId}?developer_id=${selectedDeveloperId}`
                : `/projects/${projectId}`;
            const response = await apiClient.get<Project>(url);
            // @ts-ignore
            const data = response.data || response;
            setProject(data);
            setProjectCompleted(data.status === 'completed');
        } catch (error) {
            console.error("Error loading project", error);
        }
    };

    useEffect(() => {
        fetchProject();

        // Auto-refresh cada 30 segundos
        const intervalId = setInterval(fetchProject, 30000);
        return () => clearInterval(intervalId);
    }, [projectId, selectedDeveloperId]); // Refresh when developer changes or ID changes

    const handleGlobalRefresh = () => {
        fetchProject();
        setRefreshTrigger(prev => prev + 1);
    };

    const handleUpdate = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleCompleteProject = async () => {
        if (!project) return;

        setIsCompleting(true);
        try {
            const response = await completeProject(project.id);
            if (response.project) {
                setProject(response.project);
                setProjectCompleted(true);
                // Show review dialog after completing
                setShowReviewDialog(true);
            }
        } catch (error: any) {
            console.error("Error completing project", error);
            alert(error.response?.data?.message || 'Error al completar el proyecto');
        } finally {
            setIsCompleting(false);
        }
    };

    return (
        <div className="flex flex-col p-4 sm:p-6 space-y-4">
            {/* Review Dialog for project rating */}
            {showReviewDialog && project && (
                <ReviewDialog
                    project={project}
                    open={showReviewDialog}
                    onOpenChange={setShowReviewDialog}
                />
            )}

            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{project?.title || 'Cargando...'}</h1>
                    <p className="text-muted-foreground text-sm">
                        {userType === 'company' ? 'Espacio de Trabajo Empresarial' : 'Espacio de Trabajo del Desarrollador'}
                        {project?.status === 'completed' && (
                            <span className="ml-2 inline-flex items-center text-green-500">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Completado
                            </span>
                        )}
                    </p>
                </div>
                {/* Global Refresh Button */}
                <Button variant="outline" size="sm" onClick={handleGlobalRefresh} className="border-border text-muted-foreground hover:text-foreground">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar Todo
                </Button>
                {/* Complete Project Button - Only for company when all milestones completed */}
                {userType === 'company' &&
                    project &&
                    project.status === 'in_progress' &&
                    project.all_milestones_completed &&
                    !projectCompleted && (
                        <Button
                            onClick={handleCompleteProject}
                            disabled={isCompleting}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {isCompleting ? 'Completando...' : 'Finalizar Proyecto'}
                        </Button>
                    )}
            </div>

            {/* Progress Bars */}
            {project && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-background/50 backdrop-blur-sm border-border">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Progreso del Proyecto</span>
                            <span className="text-sm font-bold text-primary">{project.progress_percentage || 0}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${project.progress_percentage || 0}%` }}
                            />
                        </div>
                    </Card>

                    <Card className="p-4 bg-background/50 backdrop-blur-sm border-border">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-muted-foreground">
                                {userType === 'company' ? 'Progreso del Desarrollador' : 'Mi Progreso'}
                            </span>
                            <span className="text-sm font-bold text-green-500">{project.developer_progress || 0}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${project.developer_progress || 0}%` }}
                            />
                        </div>
                    </Card>
                </div>
            )}

            {/* Developer Selector for Company */}
            {userType === 'company' && project?.applications && (
                <Card className="p-4 bg-card/50">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Ver progreso de:</span>
                        <select
                            className="bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                            value={selectedDeveloperId || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedDeveloperId(val ? Number(val) : null);
                                handleUpdate();
                            }}
                        >
                            <option value="">Seleccionar desarrollador...</option>
                            {project.applications
                                .filter((app: any) => app.status === 'accepted')
                                .map((app: any) => (
                                    <option key={app.developer?.id} value={app.developer?.id}>
                                        {app.developer?.name || `Desarrollador #${app.developer?.id}`}
                                    </option>
                                ))}
                        </select>
                    </div>
                </Card>
            )}

            {/* Timeline (Always Visible at top, collapsible potentially) */}
            <Card className="p-4 bg-card/50">
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Línea de Tiempo del Proyecto
                </div>
                {Boolean(userType === 'programmer' || userType === 'company') && (
                    <MilestoneTimeline
                        projectId={projectId}
                        refreshTrigger={refreshTrigger}
                        onUpdate={handleUpdate}
                        userType={userType}
                        developerId={selectedDeveloperId}
                        acceptedDevelopers={project?.applications?.map((app: any) => app.developer).filter(Boolean)}
                    />
                )}
            </Card>

            {/* Main Content Areas */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between border-b px-4 py-2">
                    <div className="flex items-center gap-2 text-primary">
                        <Layout className="h-5 w-5" />
                        <span className="font-semibold">Tablero Kanban</span>
                    </div>
                </div>

                <div className="flex-1 mt-4 min-h-0 overflow-x-auto">
                    {Boolean(userType === 'programmer' || true) && (
                        <KanbanBoard
                            projectId={projectId}
                            refreshTrigger={refreshTrigger}
                            onUpdate={handleUpdate}
                            userType={userType}
                            developerId={selectedDeveloperId}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
