import { useState, useEffect } from 'react';

import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { ArrowLeft, Layout, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { MilestoneTimeline } from './MilestoneTimeline';
import { KanbanBoard } from './KanbanBoard';
import { ReviewDialog } from './ReviewDialog';

import apiClient from '../../../services/apiClient';
import { completeProject, type ProjectResponse } from '../../../services/projectService';

interface Project extends ProjectResponse { }

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
            const response = await apiClient.get<Project>(`/projects/${projectId}`);
            // @ts-ignore
            const data = response.data || response;
            setProject(data);
            setProjectCompleted(data.status === 'completed');

            if (userType === 'company' && selectedDeveloperId === null && data.applications) {
                const acceptedApps = data.applications.filter((app: any) => app.status === 'accepted');
                if (acceptedApps.length > 0) {
                    const firstDevId = Number(acceptedApps[0].developer_id);
                    if (!isNaN(firstDevId)) {
                        setSelectedDeveloperId(firstDevId);
                    }
                }
            }
        } catch (error) {
            console.error("Error loading project", error);
        }
    };

    useEffect(() => {
        fetchProject();

        // Auto-refresh cada 30 segundos
        const intervalId = setInterval(fetchProject, 30000);
        return () => clearInterval(intervalId);
    }, [projectId]); // Remove dependencies that cause looping, just keep projectId

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

            {/* Progress Bar */}
            {project && (
                <Card className="p-4 bg-card/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progreso del Proyecto</span>
                        <span className="text-sm font-bold text-primary">
                            {project.progress_percentage || 0}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress_percentage || 0}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {project.completed_milestones_count || 0} de {project.milestones_count || 0} milestones completadas
                    </p>
                </Card>
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
                                setSelectedDeveloperId(Number(e.target.value));
                                handleUpdate();
                            }}
                        >
                            <option value="" disabled>Seleccionar Desarrollador</option>
                            {project.applications
                                .filter((app: any) => app.status === 'accepted')
                                .map((app: any) => (
                                    <option key={app.developer_id} value={app.developer_id}>
                                        {app.developer?.name || `Desarrollador #${app.developer_id}`}
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
                    <span className="ml-4 text-[10px] font-normal opacity-50">Debug: pId:{projectId} devId:{selectedDeveloperId} MT:{typeof MilestoneTimeline} KB:{typeof KanbanBoard}</span>
                </div>
                {/* Only render if we have a developer selected (for company) or if it's a programmer */}
                {Boolean(userType === 'programmer' || userType === 'company') && (
                    <MilestoneTimeline
                        projectId={projectId}
                        refreshTrigger={refreshTrigger}
                        onUpdate={handleUpdate}
                        userType={userType}
                        developerId={selectedDeveloperId}
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
                    {Boolean(userType === 'programmer' || selectedDeveloperId) && (
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
