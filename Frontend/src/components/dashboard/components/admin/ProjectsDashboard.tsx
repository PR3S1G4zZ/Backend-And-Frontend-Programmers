import { KPICard } from "../KPICard";
import { FunnelChart } from "../FunnelChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import type { ProjectsMetrics } from "../../../../services/adminMetricsService";
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Calendar,
  DollarSign,
  Users
} from "lucide-react";

interface ProjectsDashboardProps {
  selectedPeriod: string;
  metrics?: ProjectsMetrics;
  isLoading?: boolean;
}

const recentProjects = [
  {
    id: "P001",
    title: "E-commerce Platform",
    client: "TechCorp Inc.",
    freelancer: "Ana García",
    status: "En Progreso",
    deadline: "2024-01-15",
    budget: "$5,000",
    progress: 75
  },
  {
    id: "P002",
    title: "Mobile App iOS",
    client: "StartupXYZ",
    freelancer: "Carlos Ruiz",
    status: "Completado",
    deadline: "2024-01-10",
    budget: "$3,200",
    progress: 100
  },
  {
    id: "P003",
    title: "Landing Page Design",
    client: "Marketing Pro",
    freelancer: "Laura Sánchez",
    status: "Revisión",
    deadline: "2024-01-20",
    budget: "$1,500",
    progress: 90
  },
  {
    id: "P004",
    title: "API Development",
    client: "DataFlow Ltd",
    freelancer: "Miguel Torres",
    status: "En Progreso",
    deadline: "2024-01-25",
    budget: "$4,800",
    progress: 60
  },
  {
    id: "P005",
    title: "WordPress Plugin",
    client: "BlogMaster",
    freelancer: "Sofia López",
    status: "Pendiente",
    deadline: "2024-01-30",
    budget: "$2,100",
    progress: 10
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Completado":
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completado</Badge>;
    case "En Progreso":
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">En Progreso</Badge>;
    case "Revisión":
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Revisión</Badge>;
    case "Pendiente":
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Pendiente</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const topFreelancers = [
  { name: "Ana García", projects: 12, rating: 4.9, earnings: "$15,400" },
  { name: "Carlos Ruiz", projects: 10, rating: 4.8, earnings: "$12,800" },
  { name: "Laura Sánchez", projects: 9, rating: 4.9, earnings: "$11,250" },
  { name: "Miguel Torres", projects: 8, rating: 4.7, earnings: "$10,600" },
  { name: "Sofia López", projects: 7, rating: 4.8, earnings: "$9,300" }
];

const projectTimeline = [
  { phase: "Definición", duration: 2, color: "#00ff88" },
  { phase: "Desarrollo", duration: 12, color: "#50c878" },
  { phase: "Testing", duration: 3, color: "#4ade80" },
  { phase: "Entrega", duration: 1, color: "#22c55e" }
];

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
              {categoryData.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
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

      {/* Additional Content Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top Freelancers */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Freelancers
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Mejores performers del mes
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topFreelancers.map((freelancer, index) => (
                <div key={freelancer.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{freelancer.name}</p>
                      <p className="text-xs text-muted-foreground">{freelancer.projects} proyectos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{freelancer.earnings}</p>
                    <p className="text-xs text-muted-foreground">★ {freelancer.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Timeline */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Timeline Promedio
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Duración por fase del proyecto
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectTimeline.map((phase) => (
                <div key={phase.phase} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{phase.phase}</span>
                    <span className="text-sm text-muted-foreground">{phase.duration} días</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(phase.duration / 18) * 100}%`,
                        backgroundColor: phase.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Distribution */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Distribución de Presupuestos
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Rangos de presupuesto más comunes
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { range: "$500-$1K", percentage: 25, color: "#00ff88" },
                { range: "$1K-$3K", percentage: 35, color: "#50c878" },
                { range: "$3K-$5K", percentage: 25, color: "#4ade80" },
                { range: "$5K+", percentage: 15, color: "#22c55e" }
              ].map((budget) => (
                <div key={budget.range} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium w-16">{budget.range}</span>
                    <div className="flex-1 bg-secondary rounded-full h-2 mx-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${budget.percentage}%`,
                          backgroundColor: budget.color 
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-primary w-12 text-right">{budget.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects Table - Enhanced */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Proyectos Recientes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Estado actual y progreso de proyectos
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Freelancer</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Presupuesto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.id}</TableCell>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>{project.freelancer}</TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress} className="w-16" />
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{project.deadline}</TableCell>
                  <TableCell className="font-medium text-primary">{project.budget}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
