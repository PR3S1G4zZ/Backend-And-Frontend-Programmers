import api from './apiClient';

export interface FavoriteItem {
    developer_id: number;
}

export const fetchFavorites = async () => {
    return await api.get<number[]>('/favorites');
};

export const toggleFavorite = async (developerId: number) => {
    return await api.post<{ status: 'added' | 'removed'; message: string }>('/favorites', {
        developer_id: developerId,
    });
};
