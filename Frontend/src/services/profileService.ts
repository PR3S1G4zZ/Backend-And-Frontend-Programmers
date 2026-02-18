import { apiRequest } from './apiClient';
import type { User } from './authService';

export interface Profile {
  location?: string;
  headline?: string;
  bio?: string;
  hourly_rate?: number;
  availability?: 'available' | 'busy' | 'unavailable';
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  skills?: string[];
  languages?: string[];
  links?: {
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export type ProfileResponse = {
  success: boolean;
  data: {
    user: User;
    profile: Profile;
  };
};

export async function fetchProfile() {
  return apiRequest<ProfileResponse>('/profile');
}

export const updateProfile = async (data: any): Promise<{ success: boolean; message: string; user?: User }> => {
  const response = await apiRequest<{ success: boolean; message: string; user?: User }>('/profile', {
    method: 'POST',
    body: data,
    headers: {
      // Content-Type is handled automatically for FormData by browser to include boundary
    },
  });
  return response;
};
