import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  TrendingUp,
  DollarSign,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  Eye,
  ArrowRight,
  User,
  FolderOpen,
  Search,
  Loader2
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { PaymentMethodBanner } from "../settings/PaymentMethodBanner";
import { dashboardService } from "../../../services/dashboardService";
import type { DashboardData } from "../../../services/dashboardService";
import { toast } from "sonner";

interface WelcomeSectionProps {
  onSectionChange: (section: string) => void;
}

export function WelcomeSection({ onSectionChange }: WelcomeSectionProps) {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboardData = await dashboardService.getProgrammerDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        toast.error("Error al cargar datos del tablero");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="p-8 flex justify-center text-white"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }

  // Fallback defaults if API fails or returns null
  const stats = data?.stats || {
    earnings_month: 0,
    earnings_growth: 0,
    active_projects: 0,
    rating: 0,
    reviews_count: 0,
    unread_messages: 0
  };

  const activeProjects = data?.active_projects || [];
  const recentActivity = data?.recent_activity || [];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Hola, {user?.name || 'Usuario'} 👋
        </h1>
        <p className="text-muted-foreground">
          Aquí está tu espacio de desarrollo. Tienes {stats.active_projects} proyectos activos y nuevas oportunidades.
        </p>
      </div>

      <PaymentMethodBanner
        userType="programmer"
        onSetupClick={() => onSectionChange('wallet')}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border hover-neon">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Ganado este mes</p>
                <p className="text-2xl font-bold text-foreground">€{stats.earnings_month.toLocaleString()}</p>
                <p className={`text-sm flex items-center mt-1 ${stats.earnings_growth >= 0 ? 'text-primary' : 'text-red-500'}`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${stats.earnings_growth < 0 ? 'rotate-180' : ''}`} />
                  {stats.earnings_growth >= 0 ? '+' : ''}{stats.earnings_growth}% vs mes anterior
                </p>
              </div>
              <div className="bg-primary p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover-neon">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Proyectos activos</p>
                <p className="text-2xl font-bold text-foreground">{stats.active_projects}</p>
                <p className="text-green-500 text-sm">En progreso</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-full">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover-neon">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Rating promedio</p>
                <p className="text-2xl font-bold text-foreground">{stats.rating}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-primary fill-current" />
                  <span className="text-muted-foreground text-sm ml-1">{stats.reviews_count} reviews</span>
                </div>
              </div>
              <div className="bg-primary p-3 rounded-full">
                <Star className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover-neon">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Mensajes sin leer</p>
                <p className="text-2xl font-bold text-foreground">{stats.unread_messages}</p>
                <p className="text-orange-400 text-sm">Requieren atención</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Proyectos Activos</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSectionChange('projects')}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Ver todos
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProjects.length === 0 ? (
                <p className="text-muted-foreground">No tienes proyectos activos.</p>
              ) : (
                activeProjects.map((project, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-foreground font-semibold">{project.title}</h3>
                        <p className="text-muted-foreground text-sm">{project.client}</p>
                      </div>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        {project.value}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="text-foreground">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Deadline: {project.deadline}</span>
                      <Button size="sm" variant="ghost" className="text-primary hover:bg-secondary">
                        Ver detalles <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground">No hay actividad reciente.</p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="flex-shrink-0">
                      {activity.type === 'project_completed' && (
                        <div className="bg-primary p-2 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      {activity.type === 'new_message' && (
                        <div className="bg-blue-600 p-2 rounded-full">
                          <MessageSquare className="h-4 w-4 text-white" />
                        </div>
                      )}
                      {(activity.type === 'profile_view' || activity.type === 'application') && (
                        <div className="bg-purple-600 p-2 rounded-full">
                          <Eye className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm font-medium">{activity.title}</p>
                      <p className="text-muted-foreground text-xs mt-1">{activity.description}</p>
                      <p className="text-muted-foreground text-xs mt-2">{activity.time}</p>
                    </div>

                    {activity.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                ))
              )}

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-primary hover:bg-secondary"
              >
                Ver toda la actividad
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              onClick={() => onSectionChange('profile')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 p-6 h-auto flex-col space-y-2"
            >
              <User className="h-6 w-6" />
              <span>Actualizar Perfil</span>
            </Button>

            <Button
              onClick={() => onSectionChange('portfolio')}
              variant="outline"
              className="border-border text-foreground hover:bg-secondary p-6 h-auto flex-col space-y-2"
            >
              <FolderOpen className="h-6 w-6" />
              <span>Gestionar Portafolio</span>
            </Button>

            <Button
              onClick={() => onSectionChange('projects')}
              variant="outline"
              className="border-border text-foreground hover:bg-secondary p-6 h-auto flex-col space-y-2"
            >
              <Search className="h-6 w-6" />
              <span>Buscar Proyectos</span>
            </Button>

            <Button
              onClick={() => onSectionChange('chat')}
              variant="outline"
              className="border-border text-foreground hover:bg-secondary p-6 h-auto flex-col space-y-2"
            >
              <MessageSquare className="h-6 w-6" />
              <span>Revisar Mensajes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
