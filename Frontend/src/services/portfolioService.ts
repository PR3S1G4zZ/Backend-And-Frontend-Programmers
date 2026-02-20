import { apiRequest } from './apiClient';

export interface PortfolioProject {
    id: number;
    user_id: number;
    title: string;
    description: string;
    image_url?: string;
    project_url?: string;
    github_url?: string;
    technologies?: string[] | string; // API might return string if not cast properly, but we set cast in model.
    completion_date?: string;
    client?: string;
    featured: boolean;
    views: number;
    likes: number;
    created_at?: string;
    updated_at?: string;
}

export const portfolioService = {
    async getAll(): Promise<PortfolioProject[]> {
        const response = await apiRequest<{ success: boolean; data: { data: PortfolioProject[]; meta?: any } }>('/portfolio-projects');
        return response.data.data;
    },

    async getById(id: number): Promise<PortfolioProject> {
        const response = await apiRequest<{ success: boolean; data: PortfolioProject }>(`/portfolio-projects/${id}`);
        return response.data;
    },

    async create(data: FormData): Promise<PortfolioProject> {
        const response = await apiRequest<{ success: boolean; data: PortfolioProject; message: string }>('/portfolio-projects', {
            method: 'POST',
            body: data,
        });
        return response.data;
    },

    async update(id: number, data: FormData): Promise<PortfolioProject> {
        // Laravel requires _method: PUT for FormData updates to work with file uploads if using POST?
        // Actually standard PUT with FormData/Multipart is often tricky in PHP/Laravel.
        // Ideally use POST with _method=PUT.
        data.append('_method', 'PUT');
        const response = await apiRequest<{ success: boolean; data: PortfolioProject; message: string }>(`/portfolio-projects/${id}`, {
            method: 'POST',
            body: data,
        });
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await apiRequest(`/portfolio-projects/${id}`, {
            method: 'DELETE',
        });
    }
};
