import { apiRequest } from './apiClient';

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
    user: {
      id: number;
      name: string;
      lastname: string;
      email: string;
      user_type: 'programmer' | 'company' | 'admin';
    };
    profile: Profile;
  };
};

export async function fetchProfile() {
  return apiRequest<ProfileResponse>('/profile');
}

export async function updateProfile(payload: Record<string, unknown>) {
  return apiRequest<{ success: boolean; message: string }>('/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
