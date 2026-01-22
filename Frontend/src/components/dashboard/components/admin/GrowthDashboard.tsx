import { KPICard } from "../KPICard";
import { TrendChart } from "../TrendChart";
import { GeographicMap } from "../GeographicMap";
import { FunnelChart } from "../FunnelChart";
import { generateTimeSeriesData, generateKPIData, generateFunnelData } from "../../utils/mockDataGenerator";
import type { TimeSeriesData } from "../../utils/mockDataGenerator";
import { 
  Users, 
  UserPlus, 
  Target, 
  Repeat 
} from "lucide-react";

interface GrowthDashboardProps {
  selectedPeriod: string;
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

export function GrowthDashboard({ selectedPeriod }: GrowthDashboardProps) {
  const timeSeriesData = generateTimeSeriesData(selectedPeriod);
  const kpiData = generateKPIData(selectedPeriod).growth;
  const conversionFunnelData = generateFunnelData(selectedPeriod, 'conversion');

  // Transform time series data for new registrations chart
  const newRegistrationsData = timeSeriesData.map((item: TimeSeriesData) => ({
    month: item.period,
    freelancers: Math.floor(item.users * 0.6), // 60% freelancers
    clients: Math.floor(item.users * 0.4)      // 40% clients
  }));

  const kpiCards = [
    {
      title: kpiData[0].title,
      value: kpiData[0].value,
      icon: <UserPlus className="w-5 h-5" />,
      change: kpiData[0].change,
      description: `Registros este ${selectedPeriod === 'day' ? 'día' : selectedPeriod === 'week' ? 'semana' : selectedPeriod === 'year' ? 'año' : 'mes'}`
    },
    {
      title: kpiData[1].title,
      value: kpiData[1].value,
      icon: <Users className="w-5 h-5" />,
      change: kpiData[1].change,
      description: `Registros este ${selectedPeriod === 'day' ? 'día' : selectedPeriod === 'week' ? 'semana' : selectedPeriod === 'year' ? 'año' : 'mes'}`
    },
    {
      title: kpiData[2].title,
      value: kpiData[2].value,
      icon: <Target className="w-5 h-5" />,
      change: kpiData[2].change,
      description: "Visitante a contratación"
    },
    {
      title: kpiData[3].title,
      value: kpiData[3].value,
      icon: <Repeat className="w-5 h-5" />,
      change: kpiData[3].change,
      description: "Usuarios activos después de 30 días"
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
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
          steps={conversionFunnelData}
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
