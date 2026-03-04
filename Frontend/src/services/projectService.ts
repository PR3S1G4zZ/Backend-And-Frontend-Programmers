import { apiRequest } from './apiClient';

export type ProjectResponse = {
  id: number;
  title: string;
  description: string;
  budget_min: number | null;
  budget_max: number | null;
  budget_type: 'fixed' | 'hourly' | null;
  duration_value: number | null;
  duration_unit: 'days' | 'weeks' | 'months' | null;
  location: string | null;
  remote: boolean;
  level: 'junior' | 'mid' | 'senior' | 'lead' | null;
  priority: 'low' | 'medium' | 'high' | 'urgent' | null;
  featured: boolean;
  deadline: string | null;
  max_applicants: number | null;
  tags: string[] | null;
  status: string;
  created_at: string;
  updated_at?: string;
  company?: { id: number; name: string; email_verified_at?: string | null };
  categories: Array<{ id: number; name: string }>;
  skills: Array<{ id: number; name: string }>;
  applications_count?: number;
  applications?: Array<{ developer: { id: number; name: string } }>;
  has_applied?: boolean;
  milestones_count?: number;
  completed_milestones_count?: number;
  // Campos de progreso del proyecto
  progress_percentage?: number;
  all_milestones_completed?: boolean;
  deleted_at?: string | null;
};

export type ApplicationResponse = {
  id: number;
  project: ProjectResponse;
  developer: {
    id: number;
    name: string;
    lastname: string;
    email: string;
    avatar: string;
    rating: number;
  };
  cover_letter: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
};

export async function fetchProjects(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/projects?${query}` : '/projects';
  return apiRequest<{ data: ProjectResponse[] }>(url);
}

export async function fetchCompanyProjects() {
  return apiRequest<{ data: ProjectResponse[] }>('/company/projects');
}

export async function createProject(payload: Record<string, unknown>) {
  return apiRequest<{ data: ProjectResponse }>('/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteProject(id: string) {
  return apiRequest<void>(`/projects/${id}`, {
    method: 'DELETE',
  });
}

export async function updateProject(id: string, payload: Record<string, unknown>) {
  return apiRequest<{ data: ProjectResponse }>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function fetchProjectApplications(projectId: string) {
  return apiRequest<{ data: ApplicationResponse[] }>(`/projects/${projectId}/applications`);
}

export async function applyToProject(projectId: string, coverLetter?: string) {
  return apiRequest<{ data: ApplicationResponse }>(`/projects/${projectId}/apply`, {
    method: 'POST',
    body: JSON.stringify({ cover_letter: coverLetter }),
  });
}

export async function acceptApplication(applicationId: string) {
  return apiRequest<{ message: string }>(`/applications/${applicationId}/accept`, {
    method: 'POST',
  });
}


export async function rejectApplication(applicationId: string) {
  return apiRequest<{ message: string }>(`/applications/${applicationId}/reject`, {
    method: 'POST',
  });
}

export async function fundProject(id: number) {
  return apiRequest<{ message: string; project: ProjectResponse }>(`/projects/${id}/fund`, {
    method: 'POST',
  });
}

/**
 * Iniciar proyecto - Cambia el estado a in_progress y crea un grupo chat
 * Solo se puede llamar si el proyecto tiene al menos un desarrollador aceptado
 */
export async function startProject(id: number) {
  return apiRequest<{ message: string; project: ProjectResponse }>(`/projects/${id}/start`, {
    method: 'POST',
  });
}

export async function getDeveloperProgress(projectId: number) {
  return apiRequest<{ data: any[] }>(`/projects/${projectId}/developer-progress`);
}

export async function updateDeveloperProgress(projectId: number, developerId: number, data: any) {
  return apiRequest<{ data: any }>(`/projects/${projectId}/developer-progress/${developerId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Completar proyecto - Cobra el 50% restante y paga al freelancer
 * Solo se puede llamar cuando todas las milestones están completadas
 */
export async function completeProject(id: number) {
  return apiRequest<{ message: string; project: ProjectResponse }>(`/projects/${id}/complete`, {
    method: 'POST',
  });
}

export async function fetchDeveloperProfile(id: string) {
  return apiRequest<{ data: any }>(`/developers/${id}`);
}

