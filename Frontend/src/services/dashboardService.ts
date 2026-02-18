import { apiRequest } from './apiClient';

export interface DashboardStats {
    earnings_month: number;
    earnings_growth: number;
    active_projects: number;
    rating: number;
    reviews_count: number;
    unread_messages: number;
}

export interface ActiveProjectSummary {
    id: number;
    title: string;
    client: string;
    progress: number;
    deadline: string;
    value: string;
}

export interface ActivityItem {
    type: string;
    title: string;
    description: string;
    time: string;
    unread?: boolean;
}

export interface DashboardData {
    stats: DashboardStats;
    active_projects: ActiveProjectSummary[];
    recent_activity: ActivityItem[];
}

export const dashboardService = {
    async getProgrammerDashboard(): Promise<DashboardData> {
        return await apiRequest<DashboardData>('/dashboard/programmer');
    }
};
