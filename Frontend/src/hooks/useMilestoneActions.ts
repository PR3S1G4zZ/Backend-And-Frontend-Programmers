import { useState } from 'react';
import apiClient from '../services/apiClient';
import Swal from 'sweetalert2';

// Define interface locally if not available globally yet
interface Milestone {
    id: number;
    title: string;
    progress_status: string;
    amount: string;
}

interface UseMilestoneActionsProps {
    projectId: number;
    onUpdate?: () => void;
    userType: 'programmer' | 'company';
}

export function useMilestoneActions({ projectId, onUpdate }: UseMilestoneActionsProps) {
    const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handlers
    const openSubmitDialog = (milestone: Milestone) => {
        setSelectedMilestone(milestone);
        setIsSubmitDialogOpen(true);
    };

    // Helper for dark mode swal
    const showSwal = (options: any) => {
        return Swal.fire({
            background: '#1f2937', // dark-800
            color: '#f3f4f6', // gray-100
            confirmButtonColor: '#10b981', // green-500
            cancelButtonColor: '#ef4444', // red-500
            ...options
        });
    };

    const handleSubmit = async (deliverableLink: string) => {
        if (!selectedMilestone) return;
        setIsSubmitting(true);
        try {
            await apiClient.post(`/projects/${projectId}/milestones/${selectedMilestone.id}/submit`, {
                deliverables: [deliverableLink]
            });
            showSwal({ icon: 'success', title: 'Entregado', text: 'El hito ha sido enviado a revisión', timer: 1500, showConfirmButton: false });
            setIsSubmitDialogOpen(false);
            onUpdate?.();
        } catch (error: any) {
            showSwal({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo enviar la entrega.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApprove = async (milestone: Milestone) => {
        const result = await showSwal({
            title: '¿Aprobar Hito?',
            text: "Se marcará como completado y aprobado explícitamente.", // Updated text since funds released at end
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, aprobar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await apiClient.post(`/projects/${projectId}/milestones/${milestone.id}/approve`, {});
                showSwal({ icon: 'success', title: 'Aprobado', text: 'El hito ha sido aprobado.' });
                onUpdate?.();
            } catch (error: any) {
                showSwal({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo aprobar el hito' });
            }
        }
    };

    const handleReject = async (milestone: Milestone) => {
        const result = await showSwal({
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
                showSwal({ icon: 'info', title: 'Rechazado', text: 'El hito ha sido devuelto al desarrollador.' });
                onUpdate?.();
            } catch (error: any) {
                showSwal({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo rechazar el hito' });
            }
        }
    };

    const updateStatusSimple = async (milestone: Milestone, newStatus: string) => {
        // For simple status changes (Todo <-> In Progress)
        try {
            await apiClient.put(`/projects/${projectId}/milestones/${milestone.id}`, {
                progress_status: newStatus
            });
            onUpdate?.();
        } catch (error: any) {
            showSwal({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo actualizar el estado' });
        }
    };

    return {
        selectedMilestone,
        isSubmitDialogOpen,
        setIsSubmitDialogOpen,
        isSubmitting,
        openSubmitDialog,
        handleSubmit,
        handleApprove,
        handleReject,
        updateStatusSimple
    };
}
