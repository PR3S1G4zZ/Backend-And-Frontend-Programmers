import { KPICard } from "../KPICard";
import { FunnelChart } from "../FunnelChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { ProjectsMetrics } from "../../../../services/adminMetricsService";
import {
  Briefcase,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";

interface ProjectsDashboardProps {
  selectedPeriod: string;
  metrics?: ProjectsMetrics;
  isLoading?: boolean;
}



export function ProjectsDashboard({ selectedPeriod, metrics, isLoading = false }: ProjectsDashboardProps) {
  const kpiData = metrics?.kpis ?? [];
  const categoryData = metrics?.categories ?? [];
  const projectFunnelData = metrics?.funnel ?? [];
  const maxCategoryValue = Math.max(1, ...categoryData.map((category) => category.projects));
  const funnelColors = ["#00ff88", "#50c878", "#4ade80", "#22c55e"];
  const funnelMax = Math.max(1, ...projectFunnelData.map((step) => step.value));
  const funnelSteps = projectFunnelData.map((step, index) => ({
    label: step.label,
    value: step.value,
    percentage: Math.round((step.value / funnelMax) * 100),
    color: funnelColors[index % funnelColors.length],
  }));

  const kpiCards = kpiData.map((kpi) => ({
    ...kpi,
    icon:
      kpi.title === "Proyectos Activos"
        ? <Briefcase className="w-5 h-5" />
        : kpi.title === "Proyectos Completados"
          ? <CheckCircle className="w-5 h-5" />
          : kpi.title === "Tiempo Promedio"
            ? <Clock className="w-5 h-5" />
            : <TrendingUp className="w-5 h-5" />,
    description:
      kpi.title === "Proyectos Activos"
        ? "En desarrollo actualmente"
        : kpi.title === "Proyectos Completados"
          ? `Este ${selectedPeriod === 'day' ? 'día' : selectedPeriod === 'week' ? 'semana' : selectedPeriod === 'year' ? 'año' : 'mes'}`
          : kpi.title === "Tiempo Promedio"
            ? "Hasta contratación"
            : "Proyectos completados exitosamente",
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
        <FunnelChart
          title="Embudo de Proyectos"
          description="Desde publicación hasta completado"
          steps={funnelSteps}
        />

        {/* Categories Chart - Simple horizontal bar chart */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Categorías Más Demandadas</CardTitle>
            <p className="text-sm text-muted-foreground">
              Proyectos por categoría este {selectedPeriod === 'day' ? 'día' : selectedPeriod === 'week' ? 'semana' : selectedPeriod === 'year' ? 'año' : 'mes'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryData.map((item, index) => (
                <div key={`${item.category}-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium w-24 text-left">{item.category}</span>
                    <div className="flex-1 bg-secondary rounded-full h-3 mx-2">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${Math.min(100, (item.projects / maxCategoryValue) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-primary w-12 text-right">{item.projects}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
