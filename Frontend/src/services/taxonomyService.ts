import { apiRequest } from './apiClient';

export type TaxonomyItem = { id: number; name: string };

export async function fetchSkills() {
  return apiRequest<{ success: boolean; data: TaxonomyItem[] }>('/taxonomies/skills');
}

export async function fetchCategories() {
  return apiRequest<{ success: boolean; data: TaxonomyItem[] }>('/taxonomies/categories');
}
