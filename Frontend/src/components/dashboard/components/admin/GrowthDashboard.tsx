import { KPICard } from "../KPICard";
import { TrendChart } from "../TrendChart";
import { GeographicMap } from "../GeographicMap";
import { FunnelChart } from "../FunnelChart";
import type { GrowthMetrics, TimeSeriesPoint } from "../../../../services/adminMetricsService";
import { 
  Users, 
  UserPlus, 
  Target, 
  Repeat 
} from "lucide-react";

interface GrowthDashboardProps {
  selectedPeriod: string;
  metrics?: GrowthMetrics;
  isLoading?: boolean;
}

// Geographic data remains static as it doesn't change much by time period
const geographicData = [
  { country: "Estados Unidos", users: 1250, percentage: 34.2, flag: "🇺🇸" },
  { country: "México", users: 890, percentage: 24.4, flag: "🇲🇽" },
  { country: "España", users: 456, percentage: 12.5, flag: "🇪🇸" },
  { country: "Argentina", users: 378, percentage: 10.3, flag: "🇦🇷" },
  { country: "Colombia", users: 312, percentage: 8.5, flag: "🇨🇴" },
  { country: "Otros", users: 364, percentage: 10.1, flag: "🌍" }
];

export function GrowthDashboard({ selectedPeriod, metrics, isLoading = false }: GrowthDashboardProps) {
  const timeSeriesData = metrics?.timeSeries ?? [];
  const kpiData = metrics?.kpis ?? [];
  const conversionFunnelData = metrics?.funnel ?? [];
  const funnelColors = ["#00ff88", "#50c878", "#4ade80", "#22c55e"];
  const funnelMax = Math.max(1, ...conversionFunnelData.map((item) => item.value));
  const funnelSteps = conversionFunnelData.map((step, index) => ({
    label: step.label,
    value: step.value,
    percentage: Math.round((step.value / funnelMax) * 100),
    color: funnelColors[index % funnelColors.length],
  }));

  // Transform time series data for new registrations chart
  const newRegistrationsData = timeSeriesData.map((item: TimeSeriesPoint) => ({
    month: item.period,
    freelancers: item.programmers,
    clients: item.companies
  }));

  const kpiCards = kpiData.map((kpi) => ({
    ...kpi,
    icon:
      kpi.title === "Nuevos Freelancers"
        ? <UserPlus className="w-5 h-5" />
        : kpi.title === "Nuevos Clientes"
        ? <Users className="w-5 h-5" />
        : kpi.title === "Tasa de Conversión"
        ? <Target className="w-5 h-5" />
        : <Repeat className="w-5 h-5" />,
    description:
      kpi.title === "Tasa de Conversión"
        ? "Visitante a contratación"
        : kpi.title === "Retención 30 días"
        ? "Usuarios activos después de 30 días"
        : `Registros este ${selectedPeriod === 'day' ? 'día' : selectedPeriod === 'week' ? 'semana' : selectedPeriod === 'year' ? 'año' : 'mes'}`,
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading && kpiCards.length === 0 ? (
          <div className="text-sm text-muted-foreground">Cargando métricas...</div>
        ) : kpiCards.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            change={kpi.change}
            description={kpi.description}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TrendChart 
          data={newRegistrationsData.map(item => ({
            month: item.month,
            users: item.freelancers,
            projects: item.clients
          }))}
          title="Nuevos Registros por Tipo"
          description={`Freelancers vs Clientes por ${selectedPeriod === 'day' ? 'horas' : selectedPeriod === 'week' ? 'días' : selectedPeriod === 'year' ? 'años' : 'meses'}`}
          lines={[
            { dataKey: "users", name: "Freelancers", color: "var(--color-neon-green)" },
            { dataKey: "projects", name: "Clientes", color: "var(--color-emerald-green)" }
          ]}
        />
        <GeographicMap
          title="Distribución Geográfica"
          description="Usuarios por país"
          data={geographicData}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <FunnelChart
          title="Embudo de Conversión"
          description="Del visitante al primer proyecto contratado"
          steps={funnelSteps}
        />
        
        {/* Retention Cohorts Table - Simplified */}
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tabla de Retención por Cohortes</h3>
          <div className="space-y-3">
            {getRetentionData(selectedPeriod).map((cohort) => (
              <div key={cohort.period} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <span className="text-sm font-medium">{cohort.period}</span>
                <div className="flex space-x-2">
                  {cohort.retention.map((retention, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs text-muted-foreground">
                        {selectedPeriod === 'day' ? `H${i + 1}` : selectedPeriod === 'week' ? `D${i + 1}` : selectedPeriod === 'year' ? `T${i + 1}` : `S${i + 1}`}
                      </div>
                      <div className="text-sm font-bold text-primary">{retention}%</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getRetentionData(period: string) {
  switch (period) {
    case 'day':
      return [
        { period: "Hoy", retention: [100, 85, 72, 58] },
        { period: "Ayer", retention: [100, 68, 45, 32] },
        { period: "Anteayer", retention: [100, 75, 52, 38] }
      ];
    case 'week':
      return [
        { period: "Esta Semana", retention: [100, 78, 55, 42] },
        { period: "Semana Pasada", retention: [100, 68, 45, 32] },
        { period: "Hace 2 Semanas", retention: [100, 72, 48, 35] }
      ];
    case 'year':
      return [
        { period: "2024", retention: [100, 68, 45, 32] },
        { period: "2023", retention: [100, 65, 42, 28] },
        { period: "2022", retention: [100, 62, 38, 25] }
      ];
    default: // month
      return [
        { period: "Diciembre 2024", retention: [100, 68, 45, 32] },
        { period: "Noviembre 2024", retention: [100, 65, 42, 28] },
        { period: "Octubre 2024", retention: [100, 72, 48, 35] }
      ];
  }
}
