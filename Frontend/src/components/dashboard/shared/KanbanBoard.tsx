import { useState, useEffect } from 'react';

import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { motion } from 'framer-motion';
import { Play, Check, RotateCcw } from 'lucide-react';
import apiClient from '../../../services/apiClient';
import { useSweetAlert } from '../../ui/sweet-alert';

interface Milestone {
    id: number;
    title: string;
    description: string;
    amount: string;
    status: 'pending' | 'funded' | 'released' | 'blocked';
    progress_status: 'todo' | 'in_progress' | 'review' | 'completed';
}

interface KanbanBoardProps {
    projectId: number;
    onUpdate?: () => void;
    userType: 'programmer' | 'company';
}

export function KanbanBoard({ projectId, onUpdate, userType }: KanbanBoardProps) {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const { showAlert } = useSweetAlert();

    const fetchMilestones = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<Milestone[]>(`/projects/${projectId}/milestones`);
            setMilestones(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) fetchMilestones();
    }, [projectId]);

    const updateStatus = async (milestone: Milestone, newStatus: string) => {
        try {
            await apiClient.put(`/projects/${projectId}/milestones/${milestone.id}`, {
                progress_status: newStatus
            });
            fetchMilestones();
            onUpdate?.();
            showAlert({
                title: 'Actualizado',
                text: `El estado ha cambiado a ${newStatus}`,
                type: 'success',
                timer: 1000
            });
        } catch (error) {
            showAlert({
                title: 'Error',
                text: 'No se pudo actualizar el estado',
                type: 'error'
            });
        }
    };

    const columns = [
        { id: 'todo', label: 'Por Hacer', color: 'bg-gray-500/10 border-gray-500/20' },
        { id: 'in_progress', label: 'En Progreso', color: 'bg-blue-500/10 border-blue-500/20' },
        { id: 'review', label: 'En Revisión (Gatekeeping)', color: 'bg-yellow-500/10 border-yellow-500/20' },
        { id: 'completed', label: 'Completado', color: 'bg-green-500/10 border-green-500/20' },
    ];

    if (loading) return <div>Cargando tablero...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto pb-4 h-full">
            {columns.map((column) => {
                const items = milestones.filter(m => m.progress_status === column.id);

                return (
                    <div key={column.id} className={`flex flex-col h-full min-w-[280px] rounded-lg border ${column.color} p-3`}>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h3 className="font-semibold text-sm">{column.label}</h3>
                            <Badge variant="secondary" className="text-xs">{items.length}</Badge>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto">
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layoutId={`card-${item.id}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-card border border-border p-3 rounded-md shadow-sm hover:border-primary/50 transition-colors group"
                                >
                                    <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.description}</p>

                                    <div className="flex items-center justify-between mt-2">
                                        <Badge variant="outline" className="text-[10px] h-5">
                                            ${Number(item.amount).toLocaleString()}
                                        </Badge>

                                        {/* Actions based on role and status */}
                                        <div className="flex gap-1 mt-2 justify-end border-t border-gray-700/50 pt-2 w-full">
                                            {/* PROGRAMMER ACTIONS */}
                                            {userType === 'programmer' && (
                                                <>
                                                    {column.id === 'todo' && (
                                                        <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-primary/20 hover:text-primary" onClick={() => updateStatus(item, 'in_progress')} title="Iniciar">
                                                            <Play className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    {column.id === 'in_progress' && (
                                                        <>
                                                            <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-yellow-500/20 hover:text-yellow-500" onClick={() => updateStatus(item, 'todo')} title="Pausar / Devolver a Pendiente">
                                                                <RotateCcw className="h-3 w-3" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-green-500/20 hover:text-green-500" onClick={() => updateStatus(item, 'review')} title="Enviar a Revisión">
                                                                <Check className="h-3 w-3" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    {column.id === 'review' && (
                                                        <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-yellow-500/20 hover:text-yellow-500" onClick={() => updateStatus(item, 'in_progress')} title="Retirar de Revisión">
                                                            <RotateCcw className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                </>
                                            )}

                                            {/* COMPANY ACTIONS */}
                                            {userType === 'company' && (
                                                <>
                                                    {column.id === 'todo' && (
                                                        <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-primary/20 hover:text-primary" onClick={() => updateStatus(item, 'in_progress')} title="Forzar Inicio">
                                                            <Play className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    {column.id === 'in_progress' && (
                                                        <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-yellow-500/20 hover:text-yellow-500" onClick={() => updateStatus(item, 'todo')} title="Pausar / Devolver a Pendiente">
                                                            <RotateCcw className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    {column.id === 'review' && (
                                                        <>
                                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 hover:bg-red-500/20 hover:text-red-300" onClick={() => updateStatus(item, 'in_progress')} title="Rechazar">
                                                                <RotateCcw className="h-3 w-3" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-green-400 hover:bg-green-500/20 hover:text-green-300" onClick={() => updateStatus(item, 'completed')} title="Aprobar y Liberar Fondos">
                                                                <Check className="h-3 w-3" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {items.length === 0 && (
                                <div className="text-center py-8 opacity-30 text-xs border-2 border-dashed border-gray-700 rounded-md">
                                    Vacío
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
