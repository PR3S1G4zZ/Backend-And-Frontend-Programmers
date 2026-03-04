import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../ui/dialog";
import { Button } from '../../ui/button';
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Star } from 'lucide-react';
import apiClient from '../../../services/apiClient';
import type { ProjectResponse } from '../../../services/projectService';

interface ReviewDialogProps {
    project: ProjectResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface ReviewMetrics {
    rating: number;
    clean_code_rating: number;
    communication_rating: number;
    compliance_rating: number;
    creativity_rating: number;
    post_delivery_support_rating: number;
}

// Metric labels in Spanish
const METRIC_LABELS: Record<keyof Omit<ReviewMetrics, 'rating'>, string> = {
    clean_code_rating: 'Código Limpio',
    communication_rating: 'Comunicación',
    compliance_rating: 'Cumplimiento',
    creativity_rating: 'Creatividad',
    post_delivery_support_rating: 'Soporte Post-Entrega',
};

export function ReviewDialog({ project, open, onOpenChange }: ReviewDialogProps) {
    const [metrics, setMetrics] = useState<ReviewMetrics>({
        rating: 5,
        clean_code_rating: 5,
        communication_rating: 5,
        compliance_rating: 5,
        creativity_rating: 5,
        post_delivery_support_rating: 5,
    });
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get developer ID from project applications with validation
    const developerId = project.applications?.find(
        (app: any) => app.developer?.id
    )?.developer?.id;

    const handleMetricChange = (metric: keyof ReviewMetrics, value: number) => {
        setMetrics(prev => ({ ...prev, [metric]: value }));
    };

    const handleSubmit = async () => {
        if (!developerId) {
            setError('No se encontró el desarrollador asignado');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await apiClient.post('/reviews', {
                project_id: project.id,
                developer_id: developerId,
                rating: metrics.rating,
                comment: comment,
                clean_code_rating: metrics.clean_code_rating,
                communication_rating: metrics.communication_rating,
                compliance_rating: metrics.compliance_rating,
                creativity_rating: metrics.creativity_rating,
                post_delivery_support_rating: metrics.post_delivery_support_rating,
            });

            // Close dialog on success
            onOpenChange(false);
            // Reset form
            setMetrics({
                rating: 5,
                clean_code_rating: 5,
                communication_rating: 5,
                compliance_rating: 5,
                creativity_rating: 5,
                post_delivery_support_rating: 5,
            });
            setComment('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al enviar la reseña');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStarRating = (
        metric: keyof ReviewMetrics,
        label: string,
        showLabel: boolean = true
    ) => (
        <div className="space-y-2">
            {showLabel && (
                <Label className="text-sm font-medium">{label}</Label>
            )}
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleMetricChange(metric, star)}
                        className="p-1 hover:scale-110 transition-transform"
                    >
                        <Star
                            className={`h-6 w-6 ${star <= metrics[metric]
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                                }`}
                        />
                    </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                    {metrics[metric]}/5
                </span>
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Reseña del Proyecto</DialogTitle>
                    <DialogDescription>
                        Evalúa el trabajo del desarrollador en "{project.title}"
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Overall Rating */}
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">Calificación General</Label>
                        {renderStarRating('rating', '', false)}
                    </div>

                    {/* Detailed Metrics */}
                    <div className="space-y-4 border-t pt-4">
                        <Label className="text-base font-semibold">Métricas de Evaluación</Label>

                        {renderStarRating('clean_code_rating', METRIC_LABELS.clean_code_rating)}
                        {renderStarRating('communication_rating', METRIC_LABELS.communication_rating)}
                        {renderStarRating('compliance_rating', METRIC_LABELS.compliance_rating)}
                        {renderStarRating('creativity_rating', METRIC_LABELS.creativity_rating)}
                        {renderStarRating('post_delivery_support_rating', METRIC_LABELS.post_delivery_support_rating)}
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">Comentario (opcional)</Label>
                        <Textarea
                            id="comment"
                            placeholder="Comparte tu experiencia trabajando con este desarrollador..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !developerId}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
