import { apiRequest } from './apiClient';

export type ReviewResponse = {
    id: number;
    project_id: number;
    company_id: number;
    developer_id: number;
    rating: number;
    comment: string | null;
    // Métricas de evaluación
    clean_code_rating: number;
    communication_rating: number;
    compliance_rating: number;
    creativity_rating: number;
    post_delivery_support_rating: number;
    // Promedio general
    average_rating: number;
    created_at: string;
    updated_at: string;
    project?: {
        id: number;
        title: string;
    };
    company?: {
        id: number;
        name: string;
        lastname: string;
    };
    developer?: {
        id: number;
        name: string;
        lastname: string;
    };
};

export type CreateReviewPayload = {
    project_id: number;
    developer_id: number;
    rating: number;
    comment?: string;
    clean_code_rating: number;
    communication_rating: number;
    compliance_rating: number;
    creativity_rating: number;
    post_delivery_support_rating: number;
};

/**
 * Obtener todas las reseñas del desarrollador autenticado
 */
export async function fetchMyReviews() {
    return apiRequest<{ success: boolean; data: ReviewResponse[] }>('/reviews');
}

/**
 * Obtener reseñas de un proyecto específico
 */
export async function fetchProjectReviews(projectId: number) {
    return apiRequest<{ success: boolean; data: ReviewResponse[] }>(`/projects/${projectId}/reviews`);
}

/**
 * Crear una nueva reseña
 */
export async function createReview(payload: CreateReviewPayload) {
    return apiRequest<{ success: boolean; message: string; data: ReviewResponse }>('/reviews', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

/**
 * Obtener una reseña específica
 */
export async function fetchReview(id: number) {
    return apiRequest<{ success: boolean; data: ReviewResponse }>(`/reviews/${id}`);
}
