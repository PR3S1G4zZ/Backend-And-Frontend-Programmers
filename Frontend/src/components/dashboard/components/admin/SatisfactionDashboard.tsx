import { KPICard } from "../KPICard";
import { CircularGauge } from "../CircularGauge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { generateRatingData } from "../../utils/mockDataGenerator";
import type { RatingData } from "../../utils/mockDataGenerator";
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
}

// Static data for feedback - doesn't change much by period
const recentFeedback = [
  {
    id: 1,
    client: "TechCorp Inc.",
    freelancer: "Ana García",
    project: "E-commerce Platform",
    rating: 5,
    comment: "Excelente trabajo, entregado a tiempo y con calidad excepcional.",
    date: "2024-01-08",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 2,
    client: "StartupXYZ",
    freelancer: "Carlos Ruiz",
    project: "Mobile App iOS",
    rating: 4,
    comment: "Muy buen desarrollo, solo algunos ajustes menores en el diseño.",
    date: "2024-01-07",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 3,
    client: "Marketing Pro",
    freelancer: "Laura Sánchez",
    project: "Landing Page",
    rating: 5,
    comment: "Diseño increíble y muy profesional. Superó mis expectativas.",
    date: "2024-01-06",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 4,
    client: "DataFlow Ltd",
    freelancer: "Miguel Torres",
    project: "API Development",
    rating: 4,
    comment: "Buen trabajo técnico, documentación clara y código limpio.",
    date: "2024-01-05",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 5,
    client: "BlogMaster",
    freelancer: "Sofia López",
    project: "WordPress Plugin",
    rating: 5,
    comment: "Plugin funciona perfectamente, soporte excelente post-entrega.",
    date: "2024-01-04",
    avatar: "/api/placeholder/32/32"
  }
];

const qualityMetrics = [
  { metric: "Código Limpio", score: 94, icon: "💻" },
  { metric: "Comunicación", score: 87, icon: "💬" },
  { metric: "Cumplimiento", score: 91, icon: "⏰" },
  { metric: "Creatividad", score: 88, icon: "🎨" },
  { metric: "Soporte Post-Entrega", score: 85, icon: "🔧" }
];

const topRatedProjects = [
  { project: "E-commerce Platform", rating: 4.9, reviews: 23, category: "Web Development" },
  { project: "Mobile Banking App", rating: 4.8, reviews: 18, category: "Mobile Dev" },
  { project: "Dashboard Analytics", rating: 4.9, reviews: 15, category: "UI/UX" },
  { project: "API Gateway", rating: 4.7, reviews: 12, category: "Backend" },
  { project: "Marketing Website", rating: 4.8, reviews: 20, category: "Web Design" }
];

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

function generateSatisfactionKPIs(period: string) {
  const baseRating = 4.8;
  const baseOnTime = 87.3;
  const baseSatisfaction = 94.2;
  const baseFeedback = 89.0;

  // Small variations based on period
  const periodVariation = {
    day: { rating: -0.1, onTime: -2, satisfaction: -1, feedback: -1.5 },
    week: { rating: 0, onTime: 0, satisfaction: 0, feedback: 0 },
    month: { rating: 0, onTime: 0, satisfaction: 0, feedback: 0 },
    year: { rating: 0.1, onTime: 2, satisfaction: 1, feedback: 1.5 }
  };

  const variation = periodVariation[period as keyof typeof periodVariation] || periodVariation.month;

  return [
    {
      title: "Rating Promedio",
      value: (baseRating + variation.rating + (Math.random() - 0.5) * 0.2).toFixed(1),
      icon: <Star className="w-5 h-5" />,
      change: { value: 0.2 + (Math.random() - 0.5) * 0.4, isPositive: true, period: getPeriodLabel(period) },
      description: "Calificación general"
    },
    {
      title: "Proyectos a Tiempo",
      value: `${(baseOnTime + variation.onTime + (Math.random() - 0.5) * 4).toFixed(1)}%`,
      icon: <Clock className="w-5 h-5" />,
      change: { value: 3.1 + (Math.random() - 0.5) * 4, isPositive: true, period: getPeriodLabel(period) },
      description: "Entregados puntualmente"
    },
    {
      title: "Satisfacción Cliente",
      value: `${(baseSatisfaction + variation.satisfaction + (Math.random() - 0.5) * 2).toFixed(1)}%`,
      icon: <ThumbsUp className="w-5 h-5" />,
      change: { value: 1.8 + (Math.random() - 0.5) * 3, isPositive: true, period: getPeriodLabel(period) },
      description: "CSAT promedio"
    },
    {
      title: "Feedback Positivo",
      value: `${(baseFeedback + variation.feedback + (Math.random() - 0.5) * 3).toFixed(1)}%`,
      icon: <MessageSquare className="w-5 h-5" />,
      change: { value: 2.5 + (Math.random() - 0.5) * 4, isPositive: true, period: getPeriodLabel(period) },
      description: "4-5 estrellas"
    }
  ];
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

export function SatisfactionDashboard({ selectedPeriod }: SatisfactionDashboardProps) {
  const kpiData = generateSatisfactionKPIs(selectedPeriod);
  const ratingData = generateRatingData(selectedPeriod);

  // Generate dynamic values for gauges based on period
  const npsValue = Math.max(0, Math.min(100, 68 + (Math.random() - 0.5) * 20));
  const csatValue = Math.max(0, Math.min(100, 94 + (Math.random() - 0.5) * 10));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
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
              {ratingData.map((item: RatingData) => (
                <div key={item.rating} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium w-12">{item.rating}</span>
                    <div className="flex-1 bg-secondary rounded-full h-3 mx-2">
                      <div 
                        className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" 
                        style={{ width: `${Math.min(100, (item.count / Math.max(...ratingData.map(r => r.count))) * 100)}%` }}
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
              {qualityMetrics.map((metric) => (
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
              {topRatedProjects.map((project, index) => (
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
              {recentFeedback.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={feedback.avatar} />
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
