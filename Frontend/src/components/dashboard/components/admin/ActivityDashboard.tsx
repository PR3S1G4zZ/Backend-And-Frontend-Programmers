import React from 'react';
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

const kpiIcons: Record<string, React.ReactNode> = {
  "Sesiones Promedio": <Clock className="w-5 h-5" />,
  "Mensajes Enviados": <MessageSquare className="w-5 h-5" />,
  "Archivos Compartidos": <FileText className="w-5 h-5" />,
  "Tiempo Promedio Sesión": <Activity className="w-5 h-5" />
};

export function ActivityDashboard({ selectedPeriod, metrics, isLoading = false }: ActivityDashboardProps) {
  const timeSeriesData = metrics?.timeSeries ?? [];
  const kpiData = metrics?.kpis ?? [];
  const activityData = metrics?.activityHeatmap ?? [];
  const peakHours = metrics?.peakHours ?? [];
  const userEngagement = metrics?.userEngagement ?? [];
  const activityTrends = metrics?.activityTrends ?? [];

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
              {peakHours.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin datos disponibles.</p>
              ) : peakHours.map((hour) => (
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
              {userEngagement.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin datos disponibles.</p>
              ) : userEngagement.map((type) => (
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
              {activityTrends.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin datos disponibles.</p>
              ) : activityTrends.map((trend) => (
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
