// Utility functions to generate mock data based on time period

export interface TimeSeriesData {
  period: string;
  users: number;
  projects: number;
  revenue?: number;
  [key: string]: any;
}

export interface KPIData {
  title: string;
  value: string;
  change: { value: number; isPositive: boolean; period: string };
  [key: string]: any;
}

export interface CategoryData {
  category: string;
  projects: number;
  percentage: number;
}

export interface RatingData {
  rating: string;
  count: number;
  percentage: number;
}

// Base multipliers for different periods
const periodMultipliers = {
  day: { users: 0.1, projects: 0.08, revenue: 0.03 },
  week: { users: 0.7, projects: 0.6, revenue: 0.25 },
  month: { users: 1, projects: 1, revenue: 1 },
  year: { users: 12, projects: 12, revenue: 12 }
};

// Generate time series data based on period
export function generateTimeSeriesData(period: string): TimeSeriesData[] {
  const multiplier = periodMultipliers[period as keyof typeof periodMultipliers] || periodMultipliers.month;
  
  switch (period) {
    case 'day':
      return Array.from({ length: 24 }, (_, i) => ({
        period: `${i}:00`,
        users: Math.floor((120 + Math.random() * 80) * multiplier.users),
        projects: Math.floor((8 + Math.random() * 6) * multiplier.projects),
        revenue: Math.floor((3500 + Math.random() * 2000) * multiplier.revenue)
      }));
      
    case 'week': {
      const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      return days.map(day => ({
        period: day,
        users: Math.floor((180 + Math.random() * 120) * multiplier.users),
        projects: Math.floor((12 + Math.random() * 8) * multiplier.projects),
        revenue: Math.floor((5000 + Math.random() * 3000) * multiplier.revenue)
      }));
    }
      
    case 'year': {
      const years = ['2020', '2021', '2022', '2023', '2024'];
      return years.map((year, index) => ({
        period: year,
        users: Math.floor((1200 + index * 800 + Math.random() * 500) * multiplier.users),
        projects: Math.floor((85 + index * 60 + Math.random() * 30) * multiplier.projects),
        revenue: Math.floor((45000 + index * 25000 + Math.random() * 10000) * multiplier.revenue)
      }));
    }
      
    default: {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return months.map((month, index) => ({
        period: month,
        users: Math.floor((1200 + index * 200 + Math.random() * 300) * multiplier.users),
        projects: Math.floor((85 + index * 15 + Math.random() * 20) * multiplier.projects),
        revenue: Math.floor((45000 + index * 4000 + Math.random() * 8000) * multiplier.revenue)
      }));
    }
  }
}

// Generate KPI data based on period
export function generateKPIData(period: string) {
  const multiplier = periodMultipliers[period as keyof typeof periodMultipliers] || periodMultipliers.month;
  const baseData = {
    activeUsers: Math.floor(3650 * multiplier.users),
    newRegistrations: Math.floor(284 * multiplier.users),
    activeProjects: Math.floor(260 * multiplier.projects),
    completedProjects: Math.floor(1847 * multiplier.projects),
    revenue: Math.floor(92000 * multiplier.revenue),
    conversionRate: 24.8
  };

  return {
    executive: [
      {
        title: "Usuarios Activos",
        value: baseData.activeUsers.toLocaleString(),
        change: { value: 12.5 + (Math.random() - 0.5) * 10, isPositive: true, period: getPeriodLabel(period) }
      },
      {
        title: "Nuevos Registros", 
        value: baseData.newRegistrations.toLocaleString(),
        change: { value: 8.2 + (Math.random() - 0.5) * 8, isPositive: true, period: getPeriodLabel(period) }
      },
      {
        title: "Proyectos en Curso",
        value: baseData.activeProjects.toLocaleString(),
        change: { value: 15.3 + (Math.random() - 0.5) * 12, isPositive: true, period: getPeriodLabel(period) }
      },
      {
        title: "Proyectos Completados", 
        value: baseData.completedProjects.toLocaleString(),
        change: { value: 5.7 + (Math.random() - 0.5) * 6, isPositive: true, period: getPeriodLabel(period) }
      },
      {
        title: "Ingresos Netos",
        value: `$${baseData.revenue.toLocaleString()}`,
        change: { value: 18.4 + (Math.random() - 0.5) * 15, isPositive: true, period: getPeriodLabel(period) }
      },
      {
        title: "Tasa de Conversión",
        value: `${baseData.conversionRate.toFixed(1)}%`,
        change: { value: 2.1 + (Math.random() - 0.5) * 4, isPositive: Math.random() > 0.3, period: getPeriodLabel(period) }
      }
    ],
    growth: [
      {
        title: "Nuevos Freelancers",
        value: Math.floor(baseData.newRegistrations * 0.6).toString(),
        change: { value: 15.3 + (Math.random() - 0.5) * 10, isPositive: true, period: getPeriodLabel(period) }
      },
      {
        title: "Nuevos Clientes",
        value: Math.floor(baseData.newRegistrations * 0.4).toString(),
        change: { value: 8.7 + (Math.random() - 0.5) * 8, isPositive: true, period: getPeriodLabel(period) }
      },
      {
        title: "Tasa de Conversión",
        value: `${(baseData.conversionRate * 0.13).toFixed(1)}%`,
        change: { value: 0.5 + (Math.random() - 0.5) * 1, isPositive: true, period: getPeriodLabel(period) }
      },
      {
        title: "Retención 30 días",
        value: "68.4%",
        change: { value: 2.1 + (Math.random() - 0.5) * 4, isPositive: Math.random() > 0.4, period: getPeriodLabel(period) }
      }
    ],
    projects: [
      {
        title: "Proyectos Activos",
        value: Math.floor(baseData.activeProjects * 0.55).toString(),
        change: { value: 12.3 + (Math.random() - 0.5) * 10, isPositive: true, period: getPeriodLabel(period) }
      },
      {
        title: "Proyectos Completados",
        value: Math.floor(baseData.activeProjects * 0.38).toString(),
        change: { value: 18.5 + (Math.random() - 0.5) * 15, isPositive: true, period: getPeriodLabel(period) }
      },
      {
        title: "Tiempo Promedio",
        value: `${Math.floor(12 + Math.random() * 8)} días`,
        change: { value: 2.1 + (Math.random() - 0.5) * 4, isPositive: Math.random() > 0.6, period: getPeriodLabel(period) }
      },
      {
        title: "Tasa de Éxito",
        value: `${(68.4 + (Math.random() - 0.5) * 10).toFixed(1)}%`,
        change: { value: 5.2 + (Math.random() - 0.5) * 8, isPositive: true, period: getPeriodLabel(period) }
      }
    ]
  };
}

// Generate category data for projects dashboard - FIXED
export function generateCategoryData(period: string): CategoryData[] {
  const multiplier = periodMultipliers[period as keyof typeof periodMultipliers] || periodMultipliers.month;
  const baseCategories = [
    { category: "Desarrollo Web", projects: 95 },
    { category: "Desarrollo Mobile", projects: 72 },
    { category: "Diseño UI/UX", projects: 58 },
    { category: "Backend/APIs", projects: 45 },
    { category: "DevOps", projects: 32 },
    { category: "Otros", projects: 56 }
  ];

  // Calculate projects for each category
  const categoriesWithProjects = baseCategories.map(cat => {
    const projects = Math.max(1, Math.floor(cat.projects * multiplier.projects * (0.8 + Math.random() * 0.4)));
    return {
      category: cat.category,
      projects: projects
    };
  });

  // Calculate total for percentage
  const total = categoriesWithProjects.reduce((sum, cat) => sum + cat.projects, 0);

  // Return final data with percentages
  return categoriesWithProjects.map(cat => ({
    ...cat,
    percentage: parseFloat(((cat.projects / total) * 100).toFixed(1))
  }));
}

// Generate rating data for satisfaction dashboard - FIXED
export function generateRatingData(period: string): RatingData[] {
  const multipliers = {
    day: 0.05,
    week: 0.3,
    month: 1,
    year: 12
  };

  const mult = multipliers[period as keyof typeof multipliers] || multipliers.month;
  
  const baseData = [
    { rating: "5 ⭐", count: 456, percentage: 62.1 },
    { rating: "4 ⭐", count: 198, percentage: 26.9 },
    { rating: "3 ⭐", count: 52, percentage: 7.1 },
    { rating: "2 ⭐", count: 19, percentage: 2.6 },
    { rating: "1 ⭐", count: 10, percentage: 1.4 }
  ];

  return baseData.map(item => ({
    rating: item.rating,
    count: Math.max(1, Math.floor(item.count * mult * (0.8 + Math.random() * 0.4))),
    percentage: item.percentage
  }));
}

// Generate funnel data
export function generateFunnelData(period: string, type: 'projects' | 'conversion') {
  const multiplier = periodMultipliers[period as keyof typeof periodMultipliers] || periodMultipliers.month;
  
  if (type === 'projects') {
    const base = Math.floor(358 * multiplier.projects);
    return [
      { label: "Proyectos Publicados", value: base, percentage: 100, color: "var(--color-chart-1)" },
      { label: "Con Propuestas", value: Math.floor(base * 0.8), percentage: 80.2, color: "var(--color-chart-2)" },
      { label: "En Negociación", value: Math.floor(base * 0.545), percentage: 54.5, color: "var(--color-chart-3)" },
      { label: "Contratados", value: Math.floor(base * 0.397), percentage: 39.7, color: "var(--color-chart-4)" },
      { label: "Completados", value: Math.floor(base * 0.274), percentage: 27.4, color: "var(--color-chart-5)" }
    ];
  } else {
    const base = Math.floor(25420 * multiplier.users);
    return [
      { label: "Visitantes Únicos", value: base, percentage: 100, color: "var(--color-chart-1)" },
      { label: "Registros Iniciados", value: Math.floor(base * 0.2), percentage: 20, color: "var(--color-chart-2)" },
      { label: "Registros Completados", value: Math.floor(base * 0.13), percentage: 13, color: "var(--color-chart-3)" },
      { label: "Primer Proyecto Creado", value: Math.floor(base * 0.065), percentage: 6.5, color: "var(--color-chart-4)" },
      { label: "Proyecto Contratado", value: Math.floor(base * 0.032), percentage: 3.2, color: "var(--color-chart-5)" }
    ];
  }
}

function getPeriodLabel(period: string): string {
  switch (period) {
    case 'day': return 'día anterior';
    case 'week': return 'semana anterior';
    case 'month': return 'mes anterior';
    case 'year': return 'año anterior';
    default: return 'período anterior';
  }
}