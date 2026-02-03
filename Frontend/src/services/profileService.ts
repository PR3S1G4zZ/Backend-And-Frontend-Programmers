import { apiRequest } from './apiClient';

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
    profile: Record<string, unknown>;
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
