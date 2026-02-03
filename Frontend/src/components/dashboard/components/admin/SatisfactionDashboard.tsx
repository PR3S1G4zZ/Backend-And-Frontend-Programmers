import { KPICard } from "../KPICard";
import { CircularGauge } from "../CircularGauge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import type { SatisfactionMetrics } from "../../../../services/adminMetricsService";
import { 
  Star, 
  Clock, 
  ThumbsUp, 
  MessageSquare,
  TrendingUp,
  Award
} from "lucide-react";

interface SatisfactionDashboardProps {
  selectedPeriod: string;
  metrics?: SatisfactionMetrics;
  isLoading?: boolean;
}

const renderStars = (rating: number) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
};


export function SatisfactionDashboard({ selectedPeriod, metrics, isLoading = false }: SatisfactionDashboardProps) {
  const kpiData = metrics?.kpis ?? [];
  const ratingData = metrics?.ratingData ?? [];
  const feedback = metrics?.recentFeedback ?? [];
  const quality = metrics?.qualityMetrics ?? [];
  const topProjects = metrics?.topRatedProjects ?? [];
  const maxRatingCount = Math.max(1, ...ratingData.map((rating) => rating.count));
  const npsValue = metrics?.nps ?? 0;
  const csatValue = metrics?.csat ?? 0;

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
            icon={
              kpi.title === "Rating Promedio"
                ? <Star className="w-5 h-5" />
                : kpi.title === "Proyectos a Tiempo"
                ? <Clock className="w-5 h-5" />
                : kpi.title === "Satisfacción Cliente"
                ? <ThumbsUp className="w-5 h-5" />
                : <MessageSquare className="w-5 h-5" />
            }
            change={kpi.change}
            description={kpi.description}
          />
        ))}
      </div>

      {/* Gauges and Rating Distribution Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <CircularGauge
          title="Net Promoter Score"
          value={Math.round(npsValue)}
          maxValue={100}
          description="Puntuación NPS general"
          color="var(--color-primary)"
        />
        
        <CircularGauge
          title="Customer Satisfaction"
          value={Math.round(csatValue)}
          maxValue={100}
          unit="%"
          description="CSAT promedio"
          color="var(--color-emerald-green)"
        />

        {/* Rating Distribution - Simplified */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Distribución de Calificaciones</CardTitle>
            <p className="text-sm text-muted-foreground">
              Reviews por rating este {selectedPeriod === 'day' ? 'día' : selectedPeriod === 'week' ? 'semana' : selectedPeriod === 'year' ? 'año' : 'mes'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingData.map((item) => (
                <div key={item.rating} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium w-12">{item.rating}</span>
                    <div className="flex-1 bg-secondary rounded-full h-3 mx-2">
                      <div 
                        className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" 
                        style={{ width: `${Math.min(100, (item.count / maxRatingCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-primary w-12 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Content Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Quality Metrics */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Award className="w-5 h-5" />
              Métricas de Calidad
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Puntuaciones por categoría
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quality.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin datos disponibles.</p>
              ) : quality.map((metric) => (
                <div key={metric.metric} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{metric.icon}</span>
                      <span className="text-sm font-medium">{metric.metric}</span>
                    </div>
                    <span className="text-sm font-medium text-primary">{metric.score}%</span>
                  </div>
                  <Progress value={metric.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Rated Projects */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Proyectos Mejor Valorados
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Top 5 proyectos por calificación
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin datos disponibles.</p>
              ) : topProjects.map((project, index) => (
                <div key={project.project} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{project.project}</p>
                      <p className="text-xs text-muted-foreground">{project.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{project.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{project.reviews} reviews</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Table */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Feedback Reciente</CardTitle>
          <p className="text-sm text-muted-foreground">
            Comentarios y calificaciones más recientes
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Freelancer</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comentario</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedback.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    Sin feedback registrado.
                  </TableCell>
                </TableRow>
              ) : feedback.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={feedback.avatar ?? undefined} />
                        <AvatarFallback>{feedback.client.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{feedback.client}</span>
                    </div>
                  </TableCell>
                  <TableCell>{feedback.freelancer}</TableCell>
                  <TableCell>{feedback.project}</TableCell>
                  <TableCell>{renderStars(feedback.rating)}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground truncate">
                      {feedback.comment}
                    </p>
                  </TableCell>
                  <TableCell>{feedback.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
