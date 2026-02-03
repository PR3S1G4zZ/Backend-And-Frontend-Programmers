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
};

export async function fetchProjects(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/projects?${query}` : '/projects';
  return apiRequest<{ data: ProjectResponse[] }>(url);
}

export async function fetchCompanyProjects() {
  return apiRequest<ProjectResponse[]>('/company/projects');
}

export async function createProject(payload: Record<string, unknown>) {
  return apiRequest<ProjectResponse>('/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
