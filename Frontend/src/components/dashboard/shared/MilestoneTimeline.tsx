import { useEffect, useState } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { CheckCircle2, Circle, Clock, AlertCircle, FileText, Upload, ThumbsUp, ThumbsDown } from 'lucide-react';
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
import Swal from 'sweetalert2';

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
    userType: 'programmer' | 'company';
}

export function MilestoneTimeline({ projectId, refreshTrigger, userType }: MilestoneTimelineProps) {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
    const [deliverableLink, setDeliverableLink] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchMilestones = async () => {
        if (!projectId) return;
        setLoading(true);
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

    useEffect(() => {
        fetchMilestones();
    }, [projectId, refreshTrigger]);

    const handleOpenSubmitDialog = (milestone: Milestone) => {
        setSelectedMilestone(milestone);
        setDeliverableLink('');
        setIsDialogOpen(true);
    };

    const handleSubmitDeliverable = async () => {
        if (!selectedMilestone || !deliverableLink.trim()) return;

        setIsSubmitting(true);
        try {
            // Send as array of strings
            await apiClient.post(`/projects/${projectId}/milestones/${selectedMilestone.id}/submit`, {
                deliverables: [deliverableLink]
            });

            Swal.fire({ icon: 'success', title: 'Entregado', text: 'El hito ha sido enviado a revisión', timer: 1500, showConfirmButton: false });
            setIsDialogOpen(false);
            fetchMilestones();
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo enviar la entrega.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApprove = async (milestone: Milestone) => {
        const result = await Swal.fire({
            title: '¿Aprobar Hito?',
            text: "Se liberarán los fondos al desarrollador. Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, aprobar y liberar fondos',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await apiClient.post(`/projects/${projectId}/milestones/${milestone.id}/approve`, {});
                Swal.fire({ icon: 'success', title: 'Aprobado', text: 'Los fondos han sido liberados.' });
                fetchMilestones();
            } catch (error: any) {
                Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo aprobar el hito' });
            }
        }
    };

    const handleReject = async (milestone: Milestone) => {
        const result = await Swal.fire({
            title: 'Rechazar Entrega',
            text: "El hito volverá a estado 'En Progreso'.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Rechazar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await apiClient.post(`/projects/${projectId}/milestones/${milestone.id}/reject`, {});
                Swal.fire({ icon: 'info', title: 'Rechazado', text: 'El hito ha sido devuelto al desarrollador.' });
                fetchMilestones();
            } catch (error: any) {
                Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo rechazar el hito' });
            }
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'review': return <AlertCircle className="h-5 w-5 text-yellow-500 animate-pulse" />;
            case 'in_progress': return <Clock className="h-5 w-5 text-blue-500" />;
            default: return <Circle className="h-5 w-5 text-gray-500" />;
        }
    };

    if (loading) return <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">Cargando línea de tiempo...</div>;
    if (milestones.length === 0) return <div className="p-4 text-center text-sm text-muted-foreground">No hay hitos definidos.</div>;

    return (
        <div className="relative py-2">
            {/* Dialog for Submission */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Entregar Hito: {selectedMilestone?.title}</DialogTitle>
                        <DialogDescription>
                            Proporciona un enlace a los entregables (GitHub, Drive, Figma, etc.) o una descripción del trabajo realizado.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">Link</Label>
                            <Input
                                id="link"
                                placeholder="https://..."
                                value={deliverableLink}
                                onChange={(e) => setDeliverableLink(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="button" onClick={handleSubmitDeliverable} disabled={!deliverableLink.trim() || isSubmitting}>
                            {isSubmitting ? 'Enviando...' : 'Enviar a Revisión'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border sm:left-0 sm:relative sm:w-full sm:h-1 sm:flex sm:items-center sm:bg-border/30 rounded">
                {/* Horizontal line container for desktop */}
                <div className="hidden sm:block absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10" />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-8 sm:gap-4 overflow-x-auto pb-4">
                {milestones.map((milestone, index) => (
                    <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-10 sm:pl-0 sm:flex-1 sm:flex sm:flex-col sm:items-center text-left sm:text-center group min-w-[200px]"
                    >
                        {/* Timeline Dot */}
                        <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-0 sm:-top-3 bg-background border-2 border-border p-1 rounded-full z-10 group-hover:border-primary transition-colors shadow-sm">
                            {getStatusIcon(milestone.progress_status)}
                        </div>

                        <div className="mt-1 sm:mt-6 w-full px-2">
                            <div className="flex flex-col sm:items-center mb-2">
                                <h4 className="font-semibold text-sm truncate w-full sm:text-center" title={milestone.title}>{milestone.title}</h4>
                                <Badge variant="secondary" className="text-[10px] mt-1 h-5 w-fit">
                                    ${Number(milestone.amount).toLocaleString()}
                                </Badge>
                            </div>

                            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 h-8 text-left sm:text-center">
                                {milestone.description}
                            </p>

                            {/* Actions Area */}
                            <div className="flex flex-col gap-2">
                                {/* Developer Actions */}
                                {userType === 'programmer' && milestone.progress_status !== 'completed' && milestone.progress_status !== 'review' && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full text-xs h-8 border-dashed hover:border-solid hover:bg-primary/5 hover:text-primary"
                                        onClick={() => handleOpenSubmitDialog(milestone)}
                                    >
                                        <Upload className="h-3 w-3 mr-1.5" />
                                        Entregar
                                    </Button>
                                )}

                                {/* Company Actions */}
                                {userType === 'company' && milestone.progress_status === 'review' && (
                                    <div className="flex gap-1 justify-center">
                                        <Button
                                            size="sm"
                                            className="h-8 text-xs flex-1 bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleApprove(milestone)}
                                        >
                                            <ThumbsUp className="h-3 w-3 mr-1" /> Aprobar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="h-8 text-xs flex-1"
                                            onClick={() => handleReject(milestone)}
                                        >
                                            <ThumbsDown className="h-3 w-3 mr-1" /> Rechazar
                                        </Button>
                                    </div>
                                )}

                                {/* Status Badges */}
                                {milestone.progress_status === 'review' && userType === 'programmer' && (
                                    <Badge variant="outline" className="w-full justify-center bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                        En Revisión
                                    </Badge>
                                )}
                                {milestone.progress_status === 'completed' && (
                                    <Badge variant="outline" className="w-full justify-center bg-green-500/10 text-green-500 border-green-500/20">
                                        Completado
                                    </Badge>
                                )}

                                {/* Deliverables Link (if available and needed to show) */}
                                {milestone.deliverables && milestone.deliverables.length > 0 && (
                                    <a
                                        href={milestone.deliverables[0]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-blue-400 hover:underline flex items-center justify-center gap-1 mt-1"
                                    >
                                        <FileText className="h-3 w-3" /> Ver Entregable
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
