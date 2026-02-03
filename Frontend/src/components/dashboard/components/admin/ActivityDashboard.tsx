import { KPICard } from "../KPICard";
import { ActivityHeatmap } from "../ActivityHeatmap";
import { CircularGauge } from "../CircularGauge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { ActivityMetrics, TimeSeriesPoint } from "../../../../services/adminMetricsService";
import { 
  MessageSquare, 
  FileText, 
  Clock, 
  Activity,
  Users,
  Zap,
  TrendingUp
} from "lucide-react";

interface ActivityDashboardProps {
  selectedPeriod: string;
  metrics?: ActivityMetrics;
  isLoading?: boolean;
}

// Activity heatmap data - relatively static
const activityData = [
  { day: "Lun", hours: [2, 1, 0, 0, 1, 3, 8, 15, 22, 28, 32, 35, 38, 42, 39, 35, 28, 22, 18, 12, 8, 5, 3, 2] },
  { day: "Mar", hours: [1, 0, 0, 0, 2, 4, 9, 18, 25, 31, 35, 38, 41, 45, 42, 38, 32, 25, 20, 14, 9, 6, 4, 2] },
  { day: "Mié", hours: [2, 1, 0, 0, 1, 3, 8, 16, 24, 30, 34, 37, 40, 44, 41, 37, 30, 24, 19, 13, 8, 5, 3, 2] },
  { day: "Jue", hours: [1, 0, 0, 0, 2, 4, 9, 17, 26, 32, 36, 39, 42, 46, 43, 39, 33, 26, 21, 15, 10, 7, 4, 2] },
  { day: "Vie", hours: [2, 1, 0, 0, 1, 3, 7, 14, 21, 27, 31, 34, 37, 40, 37, 34, 28, 21, 17, 11, 7, 4, 3, 2] },
  { day: "Sáb", hours: [3, 2, 1, 0, 1, 2, 4, 8, 12, 16, 20, 23, 26, 28, 26, 23, 20, 16, 13, 9, 6, 4, 3, 2] },
  { day: "Dom", hours: [2, 1, 1, 0, 1, 2, 3, 6, 10, 14, 18, 21, 24, 26, 24, 21, 18, 14, 11, 8, 5, 3, 2, 1] }
];

const peakHours = [
  { hour: "09:00-10:00", activity: 42, users: 120 },
  { hour: "10:00-11:00", activity: 46, users: 135 },
  { hour: "11:00-12:00", activity: 38, users: 110 },
  { hour: "14:00-15:00", activity: 45, users: 128 },
  { hour: "15:00-16:00", activity: 40, users: 115 }
];

const userEngagement = [
  { type: "Nuevos usuarios", percentage: 25, color: "var(--color-chart-1)" },
  { type: "Usuarios activos", percentage: 45, color: "var(--color-chart-2)" },
  { type: "Usuarios recurrentes", percentage: 30, color: "var(--color-chart-3)" }
];

const activityTrends = [
  { metric: "Tiempo en plataforma", current: "24 min", previous: "22 min", trend: "up" },
  { metric: "Páginas por sesión", current: "4.2", previous: "3.8", trend: "up" },
  { metric: "Tasa de rebote", current: "32%", previous: "35%", trend: "down" },
  { metric: "Interacciones por sesión", current: "8.5", previous: "7.2", trend: "up" }
];

const kpiIcons: Record<string, JSX.Element> = {
  "Sesiones Promedio": <Clock className="w-5 h-5" />,
  "Mensajes Enviados": <MessageSquare className="w-5 h-5" />,
  "Archivos Compartidos": <FileText className="w-5 h-5" />,
  "Tiempo Promedio Sesión": <Activity className="w-5 h-5" />
};

export function ActivityDashboard({ selectedPeriod, metrics, isLoading = false }: ActivityDashboardProps) {
  const timeSeriesData = metrics?.timeSeries ?? [];
  const kpiData = metrics?.kpis ?? [];
  
  // Transform time series data for project activity
  const projectActivityData = timeSeriesData.map((item: TimeSeriesPoint) => ({
    month: item.period,
    published: item.projects,
    proposals: item.applications
  }));

  // Calculate engagement score based on period
  const baseEngagement = 78;
  const periodAdjustment = {
    day: -5,
    week: 0,
    month: 0,
    year: 3
  };
  const engagementValue = metrics?.engagementScore ?? Math.max(0, Math.min(100, baseEngagement + (periodAdjustment[selectedPeriod as keyof typeof periodAdjustment] || 0)));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading && kpiData.length === 0 ? (
          <div className="text-sm text-muted-foreground">Cargando métricas...</div>
        ) : kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpiIcons[kpi.title]}
            change={kpi.change}
            description={kpi.description}
          />
        ))}
      </div>

      {/* Activity Heatmap */}
      <ActivityHeatmap
        title="Heatmap de Actividad"
        description="Actividad por hora y día de la semana"
        data={activityData}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Project Activity Chart */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Actividad de Proyectos</CardTitle>
            <p className="text-sm text-muted-foreground">
              Proyectos publicados vs propuestas enviadas por {selectedPeriod === 'day' ? 'horas' : selectedPeriod === 'week' ? 'días' : selectedPeriod === 'year' ? 'años' : 'meses'}
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)', 
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-foreground)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="published" 
                  fill="var(--color-neon-green)"
                  name="Proyectos Publicados"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="proposals" 
                  fill="var(--color-emerald-green)"
                  name="Propuestas Enviadas"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Gauge */}
        <CircularGauge
          title="Engagement Global"
          value={Math.round(engagementValue)}
          maxValue={100}
          unit="%"
          description="Puntuación general de engagement"
          color="var(--color-primary)"
        />
      </div>

      {/* Additional Content Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Peak Hours */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Horas Pico
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Momentos de mayor actividad
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {peakHours.map((hour) => (
                <div key={hour.hour} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-sm">{hour.hour}</p>
                    <p className="text-xs text-muted-foreground">{hour.users} usuarios activos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{hour.activity}%</p>
                    <p className="text-xs text-muted-foreground">actividad</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Engagement Types */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="w-5 h-5" />
              Tipos de Usuarios
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribución de engagement
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userEngagement.map((type) => (
                <div key={type.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{type.type}</span>
                    <span className="text-sm text-primary">{type.percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${type.percentage}%`,
                        backgroundColor: type.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Trends */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tendencias
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Comparación con período anterior
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityTrends.map((trend) => (
                <div key={trend.metric} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-sm">{trend.metric}</p>
                    <p className="text-xs text-muted-foreground">Anterior: {trend.previous}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">{trend.current}</span>
                    {trend.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
