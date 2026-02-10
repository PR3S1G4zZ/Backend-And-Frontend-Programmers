import { apiRequest } from './apiClient';
import type { ProjectResponse } from './projectService';

export interface AdminProjectParams {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
}

export interface AdminProjectsResponse {
    success: boolean;
    projects: ProjectResponse[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export async function fetchAdminProjects(params: AdminProjectParams = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.per_page) query.append('per_page', params.per_page.toString());
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    return apiRequest<AdminProjectsResponse>(`/admin/projects?${query.toString()}`);
}

export async function updateAdminProject(id: number | string, data: Partial<ProjectResponse>) {
    return apiRequest<{ success: boolean; message: string; project: ProjectResponse }>(
        `/admin/projects/${id}`,
        {
            method: 'PUT',
            body: JSON.stringify(data),
        }
    );
}

export async function deleteAdminProject(id: number | string) {
    return apiRequest<{ success: boolean; message: string; deleted_at: string }>(
        `/admin/projects/${id}`,
        {
            method: 'DELETE',
        }
    );
}

export async function restoreAdminProject(id: number | string) {
    return apiRequest<{ success: boolean; message: string; project: ProjectResponse }>(
        `/admin/projects/${id}/restore`,
        {
            method: 'POST',
        }
    );
}
