import { useState, useEffect } from 'react';

import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { ArrowLeft, Layout, Clock } from 'lucide-react';
import { MilestoneTimeline } from './MilestoneTimeline';
import { KanbanBoard } from './KanbanBoard';
import apiClient from '../../../services/apiClient';

interface Project {
    id: number;
    title: string;
    description: string;
    company: {
        name: string;
    };
    // other fields...
}

interface WorkspaceProps {
    projectId: number;
    userType: 'programmer' | 'company';
    onBack: () => void;
}

export function Workspace({ projectId, userType, onBack }: WorkspaceProps) {
    const [project, setProject] = useState<Project | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await apiClient.get<Project>(`/projects/${projectId}`);
                // API usually returns wrapped resource, check structure
                // Adjust if necessary based on API response
                // Assuming standard response for now
                // @ts-ignore
                const data = response.data || response;
                setProject(data);
            } catch (error) {
                console.error("Error loading project", error);
            }
        };
        fetchProject();
    }, [projectId]);

    const handleUpdate = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{project?.title || 'Cargando...'}</h1>
                    <p className="text-muted-foreground text-sm">Espacio de Trabajo {userType === 'company' ? 'Empresarial' : 'del Desarrollador'}</p>
                </div>
            </div>

            {/* Timeline (Always Visible at top, collapsible potentially) */}
            <Card className="p-4 bg-card/50">
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Línea de Tiempo del Proyecto
                </div>
                <MilestoneTimeline projectId={projectId} refreshTrigger={refreshTrigger} userType={userType} />
            </Card>

            {/* Main Content Areas */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between border-b px-4 py-2">
                    <div className="flex items-center gap-2 text-primary">
                        <Layout className="h-5 w-5" />
                        <span className="font-semibold">Tablero Kanban</span>
                    </div>
                </div>

                <div className="flex-1 mt-4 min-h-0 overflow-hidden">
                    <KanbanBoard projectId={projectId} onUpdate={handleUpdate} userType={userType} />
                </div>
            </div>
        </div>
    );
}
