import { apiRequest } from './apiClient';

export type DeveloperProfile = {
  id: string;
  name: string;
  title: string;
  location: string;
  hourlyRate: number | null;
  rating: number;
  reviewsCount: number;
  completedProjects: number;
  availability: 'available' | 'busy' | 'unavailable';
  skills: string[];
  experience: number | null;
  languages: string[];
  bio: string;
  lastActive: string | undefined;
  isVerified: boolean;
};

export async function fetchDevelopers(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiRequest<{ success: boolean; data: DeveloperProfile[] }>(`/developers${query}`);
}
