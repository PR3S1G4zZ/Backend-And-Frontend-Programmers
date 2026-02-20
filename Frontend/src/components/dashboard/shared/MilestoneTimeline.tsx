import { useEffect, useState } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { CheckCircle2, Circle, Clock, AlertCircle, Upload, ThumbsUp, ThumbsDown, Plus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../../../services/apiClient';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import Swal from 'sweetalert2';
import { useMilestoneActions } from '../../../hooks/useMilestoneActions';
import { SubmitMilestoneDialog } from './MilestoneActionDialogs';

interface Milestone {
    id: number;
    title: string;
    description: string;
    amount: string;
    status: 'pending' | 'funded' | 'released' | 'blocked';
    progress_status: 'todo' | 'in_progress' | 'review' | 'completed';
    due_date: string;
    order: number;
    deliverables?: string[];
}

interface MilestoneTimelineProps {
    projectId: number;
    refreshTrigger?: number;
    onUpdate?: () => void;
    userType: 'programmer' | 'company';
}

export function MilestoneTimeline({ projectId, refreshTrigger, onUpdate, userType }: MilestoneTimelineProps) {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);

    const {
        openSubmitDialog,
        handleApprove,
        handleReject,
        isSubmitDialogOpen,
        setIsSubmitDialogOpen,
        handleSubmit: hookHandleSubmit,
        isSubmitting: hookIsSubmitting,
        selectedMilestone
    } = useMilestoneActions({
        projectId,
        onUpdate: () => {
            fetchMilestones();
            onUpdate?.();
        },
        userType
    });

    // Create Milestone State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
    const [newMilestone, setNewMilestone] = useState({
        title: '',
        description: '',
        amount: '',
        due_date: ''
    });


    const fetchMilestones = async () => {
        if (!projectId) return;
        // Only show full loader if we have no data yet
        if (milestones.length === 0) setLoading(true);
        try {
            const response = await apiClient.get<Milestone[]>(`/projects/${projectId}/milestones`);
            const data = Array.isArray(response) ? response : (response as any).data || [];
            setMilestones(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMilestone = async () => {
        if (!newMilestone.title) {
            Swal.fire({
                background: '#1f2937',
                color: '#f3f4f6',
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'El título es obligatorio.'
            });
            return;
        }

        setIsCreateSubmitting(true);
        try {
            await apiClient.post(`/projects/${projectId}/milestones`, {
                ...newMilestone,
                amount: 0,
                due_date: newMilestone.due_date || null,
                project_id: projectId
            });
            Swal.fire({
                background: '#1f2937', color: '#f3f4f6', confirmButtonColor: '#10b981',
                icon: 'success', title: 'Creado', text: 'Hito creado exitosamente', timer: 1500, showConfirmButton: false
            });
            setIsCreateDialogOpen(false);
            setNewMilestone({ title: '', description: '', amount: '', due_date: '' });
            fetchMilestones();
            onUpdate?.();
        } catch (error: any) {
            console.error(error);
            Swal.fire({
                background: '#1f2937', color: '#f3f4f6',
                icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo crear el hito'
            });
        } finally {
            setIsCreateSubmitting(false);
        }
    };

    useEffect(() => {
        fetchMilestones();
    }, [projectId, refreshTrigger]);


    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="h-6 w-6 text-green-500" />;
            case 'review': return <AlertCircle className="h-6 w-6 text-yellow-500 animate-pulse" />;
            case 'in_progress': return <Clock className="h-6 w-6 text-blue-500" />;
            default: return <Circle className="h-6 w-6 text-gray-400" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Completado';
            case 'review': return 'En Revisión';
            case 'in_progress': return 'En Progreso';
            default: return 'Pendiente';
        }
    };

    if (loading) return <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">Cargando línea de tiempo...</div>;

    return (
        <div className="relative py-4 px-2">
            {/* Header / Create Button */}
            {userType === 'company' && (
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-semibold text-gray-200">Hitos del Proyecto</h3>
                    <Button size="sm" onClick={() => setIsCreateDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-white shadow-md transition-all hover:scale-105">
                        <Plus className="h-4 w-4 mr-2" /> Nuevo Hito
                    </Button>
                </div>
            )}

            {/* Dialog for Creating Milestone */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Hito</DialogTitle>
                        <DialogDescription>Defina los detalles del entregable.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Título *</Label>
                            <Input
                                id="title"
                                value={newMilestone.title}
                                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                className="col-span-3"
                                placeholder="Ej: Diseño de Base de Datos"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">Fecha Límite</Label>
                            <Input
                                id="date"
                                type="date"
                                value={newMilestone.due_date}
                                onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                                min={new Date().toISOString().split('T')[0]} // Validate future dates
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="desc" className="text-right">Descripción</Label>
                            <Textarea
                                id="desc"
                                value={newMilestone.description}
                                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                                className="col-span-3"
                                placeholder="Detalles de lo que se espera..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCreateMilestone} disabled={isCreateSubmitting}>
                            {isCreateSubmitting ? 'Creando...' : 'Crear Hito'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Shared Submit Dialog */}
            <SubmitMilestoneDialog
                open={isSubmitDialogOpen}
                onOpenChange={setIsSubmitDialogOpen}
                onSubmit={hookHandleSubmit}
                isSubmitting={hookIsSubmitting}
                milestoneTitle={selectedMilestone?.title}
            />

            {/* Timeline View - Using a connected list for better structure */}
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
                {milestones.length === 0 ? (
                    <div className="relative z-10 w-full text-center py-12 text-muted-foreground border border-dashed border-gray-700/50 rounded-xl bg-gray-900/20 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2">
                            <Circle className="h-12 w-12 text-gray-700 mb-2" />
                            <p className="font-medium">No hay hitos definidos aún</p>
                            <p className="text-sm opacity-70">Los hitos ayudan a organizar el progreso del proyecto.</p>
                        </div>
                    </div>
                ) : (
                    milestones.map((milestone, index) => (
                        <motion.div
                            key={milestone.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                        >
                            {/* Icon / Dot */}
                            <div className="absolute left-0 top-0 mt-1 ml-2.5 h-5 w-5 -translate-x-1/2 rounded-full border border-background bg-background md:left-1/2 md:translate-x-0 md:ml-0 md:-translate-x-1/2 flex items-center justify-center z-10 shadow-lg shadow-black/50">
                                {getStatusIcon(milestone.progress_status)}
                            </div>

                            {/* Content Card */}
                            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-gray-800 bg-gray-900/60 hover:bg-gray-900/80 transition-all shadow-sm hover:border-gray-700">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 h-5 border-none bg-opacity-10 ${milestone.progress_status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                            milestone.progress_status === 'review' ? 'bg-yellow-500/10 text-yellow-400' :
                                                milestone.progress_status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
                                                    'bg-gray-500/10 text-gray-400'
                                            }`}>
                                            {getStatusText(milestone.progress_status)}
                                        </Badge>
                                        <span className="text-[10px] text-muted-foreground">
                                            {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : 'Sin fecha'}
                                        </span>
                                    </div>

                                    <h4 className="font-semibold text-base text-gray-100">{milestone.title}</h4>
                                    <p className="text-sm text-gray-400 line-clamp-2">{milestone.description}</p>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
                                        {/* Developer Actions */}
                                        {userType === 'programmer' && milestone.progress_status !== 'completed' && milestone.progress_status !== 'review' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 text-xs border-dashed text-gray-300 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-colors w-full"
                                                onClick={() => openSubmitDialog(milestone)}
                                            >
                                                <Upload className="h-3 w-3 mr-2" />
                                                Entregar
                                            </Button>
                                        )}

                                        {/* Company Actions */}
                                        {userType === 'company' && milestone.progress_status === 'review' && (
                                            <div className="flex gap-2 w-full">
                                                <Button
                                                    size="sm"
                                                    className="h-7 text-xs flex-1 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white border border-green-600/50"
                                                    onClick={() => handleApprove(milestone)}
                                                >
                                                    <ThumbsUp className="h-3 w-3 mr-1" /> Aprobar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 text-xs flex-1 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                                    onClick={() => handleReject(milestone)}
                                                >
                                                    <ThumbsDown className="h-3 w-3 mr-1" /> Rechazar
                                                </Button>
                                            </div>
                                        )}

                                        {milestone.deliverables && milestone.deliverables.length > 0 && (
                                            <a
                                                href={milestone.deliverables[0]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-auto text-xs flex items-center text-blue-400 hover:text-blue-300 hover:underline"
                                            >
                                                Ver <ChevronRight className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

