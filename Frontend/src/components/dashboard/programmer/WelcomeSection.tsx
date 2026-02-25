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
    return <div className="p-6 flex justify-center text-foreground"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
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
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
          Hola, {user?.name || 'Usuario'} 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          {stats.active_projects > 0
            ? `Tienes ${stats.active_projects} proyecto${stats.active_projects !== 1 ? 's' : ''} activo${stats.active_projects !== 1 ? 's' : ''} en progreso.`
            : 'Explora oportunidades disponibles y comienza tu próximo proyecto.'}
        </p>
      </div>

      <PaymentMethodBanner
        userType="programmer"
        onSetupClick={() => onSectionChange('wallet')}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-card border-border hover-neon">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Ganado este mes</p>
                <p className="text-xl font-bold text-foreground">€{stats.earnings_month.toLocaleString()}</p>
                <p className={`text-xs flex items-center mt-1 ${stats.earnings_growth >= 0 ? 'text-primary' : 'text-red-500'}`}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${stats.earnings_growth < 0 ? 'rotate-180' : ''}`} />
                  {stats.earnings_growth >= 0 ? '+' : ''}{stats.earnings_growth}%
                </p>
              </div>
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover-neon">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Proyectos activos</p>
                <p className="text-xl font-bold text-foreground">{stats.active_projects}</p>
                <p className="text-green-500 text-xs">En progreso</p>
              </div>
              <div className="bg-green-500/10 p-2.5 rounded-xl">
                <Clock className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover-neon">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Rating promedio</p>
                <p className="text-xl font-bold text-foreground">{stats.rating || '—'}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-primary fill-current" />
                  <span className="text-muted-foreground text-xs ml-1">{stats.reviews_count} reviews</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <Star className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover-neon">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Mensajes sin leer</p>
                <p className="text-xl font-bold text-foreground">{stats.unread_messages}</p>
                <p className="text-orange-400 text-xs">
                  {stats.unread_messages > 0 ? 'Sin responder' : 'Al día'}
                </p>
              </div>
              <div className="bg-orange-500/10 p-2.5 rounded-xl">
                <MessageSquare className="h-5 w-5 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-foreground text-base">Proyectos Activos</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSectionChange('projects-active')}
                className="text-primary hover:bg-primary/10 text-xs"
              >
                Ver todos <ArrowRight className="h-3 w-3 ml-1" />
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
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground text-base">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground">No hay actividad reciente.</p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="flex-shrink-0">
                      {activity.type === 'project_completed' && (
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      {activity.type === 'new_message' && (
                        <div className="bg-blue-600/20 p-2 rounded-lg">
                          <MessageSquare className="h-4 w-4 text-blue-400" />
                        </div>
                      )}
                      {(activity.type === 'profile_view' || activity.type === 'application') && (
                        <div className="bg-purple-600/20 p-2 rounded-lg">
                          <Eye className="h-4 w-4 text-purple-400" />
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
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-base">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => onSectionChange('profile')}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 h-auto flex-col gap-2 py-4"
              variant="ghost"
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Mi Perfil</span>
            </Button>

            <Button
              onClick={() => onSectionChange('portfolio')}
              variant="ghost"
              className="border border-border text-foreground hover:bg-accent h-auto flex-col gap-2 py-4"
            >
              <FolderOpen className="h-5 w-5" />
              <span className="text-xs font-medium">Portafolio</span>
            </Button>

            <Button
              onClick={() => onSectionChange('projects')}
              variant="ghost"
              className="border border-border text-foreground hover:bg-accent h-auto flex-col gap-2 py-4"
            >
              <Search className="h-5 w-5" />
              <span className="text-xs font-medium">Explorar Proyectos</span>
            </Button>

            <Button
              onClick={() => onSectionChange('chat')}
              variant="ghost"
              className="border border-border text-foreground hover:bg-accent h-auto flex-col gap-2 py-4"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs font-medium">Mensajes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
