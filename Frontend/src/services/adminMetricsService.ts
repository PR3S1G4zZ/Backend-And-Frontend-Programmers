export type KPIChange = {
  value: number;
  isPositive: boolean;
  period: string;
};

export type KPI = {
  title: string;
  value: string | number;
  change?: KPIChange;
  description?: string;
};

export type TimeSeriesPoint = {
  period: string;
  users: number;
  programmers: number;
  companies: number;
  projects: number;
  applications: number;
  revenue: number;
};

export type ActivityMetrics = {
  kpis: KPI[];
  timeSeries: TimeSeriesPoint[];
  engagementScore: number;
  activityHeatmap?: Array<{ day: string; hours: number[] }>;
  peakHours?: Array<{ hour: string; activity: number; users: number }>;
  userEngagement?: Array<{ type: string; percentage: number; color: string }>;
  activityTrends?: Array<{ metric: string; current: string; previous: string; trend: 'up' | 'down' }>;
};

export type FinancialMetrics = {
  kpis: KPI[];
  timeSeries: TimeSeriesPoint[];
  revenueSources: Array<{ name: string; value: number; amount: number; color?: string }>;
  recentTransactions: Array<{
    id: string;
    type: string;
    description: string;
    amount: number;
    client: string;
    date: string;
    status: string;
  }>;
};

export type GrowthMetrics = {
  kpis: KPI[];
  timeSeries: TimeSeriesPoint[];
  funnel: Array<{ label: string; value: number }>;
  geographicData?: Array<{ country: string; users: number; percentage: number; flag?: string }>;
  retention?: Array<{ period: string; retention: number[] }>;
};

export type ProjectsMetrics = {
  kpis: KPI[];
  categories: Array<{ category: string; projects: number; percentage: number }>;
  funnel: Array<{ label: string; value: number }>;
};

export type SatisfactionMetrics = {
  kpis: KPI[];
  ratingData: Array<{ rating: string; count: number; percentage: number }>;
  recentFeedback: Array<{
    id: number;
    client: string;
    freelancer: string;
    project: string;
    rating: number;
    comment: string;
    date: string;
    avatar?: string | null;
  }>;
  qualityMetrics: Array<{ metric: string; score: number; icon: string }>;
  topRatedProjects: Array<{ project: string; rating: number; reviews: number; category: string }>;
  nps: number;
  csat: number;
};

export type AdminMetrics = {
  activity: ActivityMetrics;
  financial: FinancialMetrics;
  growth: GrowthMetrics;
  projects: ProjectsMetrics;
  satisfaction: SatisfactionMetrics;
};

export type AdminMetricsResponse = {
  success: boolean;
  data?: AdminMetrics;
  message?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export async function fetchAdminMetrics(period: string): Promise<AdminMetricsResponse> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/admin/metrics?period=${period}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message || 'No se pudieron cargar las métricas.',
    };
  }

  return data as AdminMetricsResponse;
}
