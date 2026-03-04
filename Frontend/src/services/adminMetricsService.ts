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

import {
  generateTimeSeriesData,
  generateKPIData,
  generateCategoryData,
  generateRatingData,
  generateFunnelData
} from '../components/dashboard/utils/mockDataGenerator';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export async function fetchAdminMetrics(period: string): Promise<AdminMetricsResponse> {
  try {
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
  } catch (error) {
    console.warn('Error fetching admin metrics, using mock data:', error);
    return generateMockAdminMetrics(period);
  }
}

function generateMockAdminMetrics(period: string): AdminMetricsResponse {
  const timeSeriesData = generateTimeSeriesData(period);
  const kpiData = generateKPIData(period);
  const categoryData = generateCategoryData(period);
  const ratingData = generateRatingData(period);
  const projectFunnelData = generateFunnelData(period, 'projects');
  const conversionFunnelData = generateFunnelData(period, 'conversion');

  return {
    success: true,
    data: {
      activity: {
        kpis: kpiData.activity,
        timeSeries: timeSeriesData,
        engagementScore: 78,
        activityHeatmap: [],
        peakHours: [],
        userEngagement: [],
        activityTrends: []
      },
      financial: {
        kpis: kpiData.financial,
        timeSeries: timeSeriesData,
        revenueSources: [
          { name: "Comisiones", value: 65, amount: 65000, color: "var(--color-chart-1)" },
          { name: "Suscripciones", value: 25, amount: 25000, color: "var(--color-chart-2)" },
          { name: "Publicidad", value: 10, amount: 10000, color: "var(--color-chart-3)" }
        ],
        recentTransactions: [
          { id: "TXN-12345", type: "Comisión", description: "Proyecto Web App", amount: 1500, client: "Tech Corp", date: "2024-01-15", status: "Completado" },
          { id: "TXN-12346", type: "Suscripción", description: "Plan Premium", amount: 99, client: "Startup Inc", date: "2024-01-14", status: "Pendiente" },
          { id: "TXN-12347", type: "Publicidad", description: "Banner Ad", amount: 500, client: "Marketing Co", date: "2024-01-13", status: "Completado" }
        ]
      },
      growth: {
        kpis: kpiData.growth,
        timeSeries: timeSeriesData,
        funnel: conversionFunnelData,
        geographicData: [
          { country: "Colombia", users: 4500, percentage: 45, flag: "🇨🇴" },
          { country: "México", users: 3000, percentage: 30, flag: "🇲🇽" },
          { country: "Argentina", users: 1500, percentage: 15, flag: "🇦🇷" },
          { country: "Chile", users: 1000, percentage: 10, flag: "🇨🇱" }
        ],
        retention: []
      },
      projects: {
        kpis: kpiData.projects,
        categories: categoryData,
        funnel: projectFunnelData
      },
      satisfaction: {
        kpis: kpiData.satisfaction,
        ratingData: ratingData,
        recentFeedback: [
          { id: 1, client: "Juan Pérez", freelancer: "Maria Lopez", project: "E-commerce App", rating: 5, comment: "Excelente trabajo!", date: "2024-01-15" },
          { id: 2, client: "Ana García", freelancer: "Carlos Rodríguez", project: "Dashboard Admin", rating: 4, comment: "Muy profesional", date: "2024-01-14" }
        ],
        qualityMetrics: [
          { metric: "Calidad de Código", score: 92, icon: "👨‍💻" },
          { metric: "Comunicación", score: 88, icon: "💬" },
          { metric: "Cumplimiento", score: 95, icon: "✅" }
        ],
        topRatedProjects: [
          { project: "E-commerce App", rating: 5.0, reviews: 12, category: "Desarrollo Web" },
          { project: "Mobile App", rating: 4.8, reviews: 8, category: "Desarrollo Mobile" }
        ],
        nps: 75,
        csat: 88
      }
    }
  };
}

// Types para Comisiones
export type CommissionRecord = {
  id: number;
  project_id: number;
  company_id: number;
  developer_id: number | null;
  total_amount: number;
  held_amount: number;
  commission_rate: number;
  commission_amount: number;
  net_amount: number;
  status: 'pending' | 'released' | 'cancelled';
  created_at: string;
  updated_at: string;
  project?: {
    id: number;
    title: string;
  };
  company?: {
    id: number;
    name: string;
  };
  developer?: {
    id: number;
    name: string;
  };
};

export type CommissionStats = {
  total_commission: number;
  total_held: number;
  pending_count: number;
  released_count: number;
  total_projects: number;
  average_commission: number;
};

export type CommissionResponse = {
  success: boolean;
  data: {
    data: CommissionRecord[];
    meta?: any;
  };
};

export type CommissionStatsResponse = {
  success: boolean;
  data: CommissionStats;
};

// Obtener estadísticas de comisiones
export async function fetchCommissionStats(): Promise<CommissionStatsResponse> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/admin/commissions/stats`, {
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
      data: {
        total_commission: 0,
        total_held: 0,
        pending_count: 0,
        released_count: 0,
        total_projects: 0,
        average_commission: 0,
      },
    };
  }

  return data as CommissionStatsResponse;
}

// Obtener lista de comisiones
export async function fetchCommissions(page: number = 1): Promise<CommissionResponse> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/admin/commissions?page=${page}`, {
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
      data: { data: [] },
    };
  }

  return data as CommissionResponse;
}
