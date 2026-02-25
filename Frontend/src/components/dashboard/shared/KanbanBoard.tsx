import { useState, useEffect, useMemo, useCallback, memo } from 'react';

import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Play, Check, RotateCcw, ChevronDown } from 'lucide-react';
import apiClient from '../../../services/apiClient';
import { useMilestoneActions } from '../../../hooks/useMilestoneActions';
import { SubmitMilestoneDialog } from './MilestoneActionDialogs';

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
    refreshTrigger?: number;
    userType: 'programmer' | 'company';
}

// Configuración de paginación
const ITEMS_PER_PAGE = 10;

interface MilestoneCardProps {
    item: Milestone;
    userType: 'programmer' | 'company';
    columnId: string;
    onStatusChange: (milestone: Milestone, newStatus: string) => void;
}

// Componente memoizado para cada card - evita re-renderizados innecesarios
const MilestoneCard = memo(function MilestoneCard({
    item,
    userType,
    columnId,
    onStatusChange
}: MilestoneCardProps) {
    return (
        <div
            className="bg-card border border-border p-3 rounded-md shadow-sm hover:border-primary/50 transition-colors group"
        >
            <h4 className="font-medium text-sm mb-1">{item.title}</h4>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.description}</p>

            <div className="flex items-center justify-between mt-2">
                <div className="flex gap-1 mt-2 justify-end border-t border-gray-700/50 pt-2 w-full">
                    {/* PROGRAMMER ACTIONS */}
                    {userType === 'programmer' && (
                        <>
                            {columnId === 'todo' && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 hover:bg-primary/20 hover:text-primary"
                                    onClick={() => onStatusChange(item, 'in_progress')}
                                    title="Iniciar"
                                    aria-label="Iniciar milestone"
                                >
                                    <Play className="h-3 w-3" />
                                </Button>
                            )}
                            {columnId === 'in_progress' && (
                                <>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 hover:bg-yellow-500/20 hover:text-yellow-500"
                                        onClick={() => onStatusChange(item, 'todo')}
                                        title="Pausar / Devolver a Pendiente"
                                        aria-label="Devolver a pendientes"
                                    >
                                        <RotateCcw className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 hover:bg-green-500/20 hover:text-green-500"
                                        onClick={() => onStatusChange(item, 'review')}
                                        title="Enviar a Revisión"
                                        aria-label="Enviar a revisión"
                                    >
                                        <Check className="h-3 w-3" />
                                    </Button>
                                </>
                            )}
                            {columnId === 'review' && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 hover:bg-yellow-500/20 hover:text-yellow-500"
                                    onClick={() => onStatusChange(item, 'in_progress')}
                                    title="Retirar de Revisión"
                                    aria-label="Retirar de revisión"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                </Button>
                            )}
                        </>
                    )}

                    {/* COMPANY ACTIONS */}
                    {userType === 'company' && (
                        <>
                            {columnId === 'todo' && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 hover:bg-primary/20 hover:text-primary"
                                    onClick={() => onStatusChange(item, 'in_progress')}
                                    title="Forzar Inicio"
                                    aria-label="Forzar inicio"
                                >
                                    <Play className="h-3 w-3" />
                                </Button>
                            )}
                            {columnId === 'in_progress' && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 hover:bg-yellow-500/20 hover:text-yellow-500"
                                    onClick={() => onStatusChange(item, 'todo')}
                                    title="Pausar / Devolver a Pendiente"
                                    aria-label="Pausar milestone"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                </Button>
                            )}
                            {columnId === 'review' && (
                                <>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                        onClick={() => onStatusChange(item, 'in_progress')}
                                        title="Rechazar"
                                        aria-label="Rechazar milestone"
                                    >
                                        <RotateCcw className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 text-green-400 hover:bg-green-500/20 hover:text-green-300"
                                        onClick={() => onStatusChange(item, 'completed')}
                                        title="Aprobar y Liberar Fondos"
                                        aria-label="Aprobar y liberar fondos"
                                    >
                                        <Check className="h-3 w-3" />
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

// Componente para mostrar items paginados
interface ColumnWithPaginationProps {
    columnId: string;
    columnLabel: string;
    columnColor: string;
    items: Milestone[];
    userType: 'programmer' | 'company';
    onStatusChange: (milestone: Milestone, newStatus: string) => void;
}

function ColumnWithPagination({
    columnId,
    columnLabel,
    columnColor,
    items,
    userType,
    onStatusChange
}: ColumnWithPaginationProps) {
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const visibleItems = useMemo(() =>
        items.slice(0, visibleCount),
        [items, visibleCount]
    );

    const hasMore = visibleCount < items.length;
    const totalCount = items.length;

    const loadMore = useCallback(() => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    }, []);

    return (
        <div className={`flex flex-col min-w-[280px] rounded-lg border ${columnColor} p-3`}>
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-semibold text-sm">{columnLabel}</h3>
                <Badge variant="secondary" className="text-xs">{totalCount}</Badge>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                {visibleItems.map((item) => (
                    <MilestoneCard
                        key={item.id}
                        item={item}
                        userType={userType}
                        columnId={columnId}
                        onStatusChange={onStatusChange}
                    />
                ))}

                {items.length === 0 && (
                    <div className="text-center py-8 opacity-30 text-xs border-2 border-dashed border-gray-700 rounded-md">
                        Vacío
                    </div>
                )}

                {/* Botón de carga progresiva */}
                {hasMore && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-muted-foreground hover:text-primary"
                        onClick={loadMore}
                    >
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Ver más ({totalCount - visibleCount} restantes)
                    </Button>
                )}
            </div>
        </div>
    );
}

export function KanbanBoard({ projectId, onUpdate, refreshTrigger, userType }: KanbanBoardProps) {
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
        selectedMilestone,
        updateStatusSimple
    } = useMilestoneActions({
        projectId,
        onUpdate: () => {
            fetchMilestones();
            onUpdate?.();
        },
        userType
    });

    const fetchMilestones = async () => {
        // Solo mostrar loader completo si no hay datos aún
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

    useEffect(() => {
        if (projectId) fetchMilestones();
    }, [projectId, refreshTrigger]);

    // Memoizar el handler de cambio de estado
    const handleStatusChange = useCallback((milestone: Milestone, newStatus: string) => {
        // Transiciones Críticas
        if (newStatus === 'review' && userType === 'programmer') {
            openSubmitDialog(milestone);
            return;
        }

        if (newStatus === 'completed' && userType === 'company') {
            handleApprove(milestone);
            return;
        }

        if (newStatus === 'in_progress' && userType === 'company' && milestone.progress_status === 'review') {
            handleReject(milestone);
            return;
        }

        // Transiciones Simples
        updateStatusSimple(milestone, newStatus);
    }, [userType, openSubmitDialog, handleApprove, handleReject, updateStatusSimple]);

    const columns = useMemo(() => [
        { id: 'todo', label: 'Por Hacer', color: 'bg-gray-500/10 border-gray-500/20' },
        { id: 'in_progress', label: 'En Progreso', color: 'bg-blue-500/10 border-blue-500/20' },
        { id: 'review', label: 'En Revisión (Gatekeeping)', color: 'bg-yellow-500/10 border-yellow-500/20' },
        { id: 'completed', label: 'Completado', color: 'bg-green-500/10 border-green-500/20' },
    ], []);

    // Memoizar el filtrado de milestones por columna
    const milestonesByColumn = useMemo(() => {
        const grouped: Record<string, Milestone[]> = {
            todo: [],
            in_progress: [],
            review: [],
            completed: []
        };

        milestones.forEach(milestone => {
            if (grouped[milestone.progress_status]) {
                grouped[milestone.progress_status].push(milestone);
            }
        });

        return grouped;
    }, [milestones]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Cargando tablero...</div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto pb-2">
            <SubmitMilestoneDialog
                open={isSubmitDialogOpen}
                onOpenChange={setIsSubmitDialogOpen}
                onSubmit={hookHandleSubmit}
                isSubmitting={hookIsSubmitting}
                milestoneTitle={selectedMilestone?.title}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-4 relative"
                style={{ minWidth: '900px' }}>
                {columns.map((column) => (
                    <ColumnWithPagination
                        key={column.id}
                        columnId={column.id}
                        columnLabel={column.label}
                        columnColor={column.color}
                        items={milestonesByColumn[column.id] || []}
                        userType={userType}
                        onStatusChange={handleStatusChange}
                    />
                ))}
            </div>
        </div>
    );
}
