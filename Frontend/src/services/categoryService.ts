import { apiRequest } from './apiClient';

export interface Category {
    id: number;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
}

export const categoryService = {
    getAll: async () => {
        return await apiRequest('/taxonomies/categories');
    },

    create: async (data: Partial<Category>) => {
        return await apiRequest('/admin/categories', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    update: async (id: number, data: Partial<Category>) => {
        return await apiRequest(`/admin/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete: async (id: number) => {
        return await apiRequest(`/admin/categories/${id}`, {
            method: 'DELETE'
        });
    }
};
