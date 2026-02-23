import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  TrendingUp,
  Users,
  FolderOpen,
  MessageSquare,
  DollarSign,
  CheckCircle,
  Plus,
  ArrowRight,
  Search,
  Loader2
} from 'lucide-react';
import { useAuth } from "../../../contexts/AuthContext";
import { PaymentMethodBanner } from "../settings/PaymentMethodBanner";
import { fetchCompanyProjects, type ProjectResponse } from '../../../services/projectService';
import { fetchDevelopers, type DeveloperProfile } from '../../../services/developerService';
import { useWallet } from '../../../contexts/WalletContext';
import { useState, useEffect } from 'react';

interface WelcomeSectionProps {
  onSectionChange: (section: string) => void;
}

export function WelcomeSection({ onSectionChange }: WelcomeSectionProps) {
  const { user } = useAuth();
  const { wallet } = useWallet();
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [developers, setDevelopers] = useState<DeveloperProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch projects and developers in parallel
        const [projectsResponse, developersResponse] = await Promise.all([
          fetchCompanyProjects(),
          fetchDevelopers()
        ]);

        setProjects(projectsResponse.data || []);
        setDevelopers(developersResponse.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics from real data
  const activeProjects = projects.filter(p =>
    p.status === 'active' || p.status === 'in_progress' || p.status === 'funded'
  );
  const activeProjectsCount = activeProjects.length;
  const totalApplications = projects.reduce((sum, p) => sum + (p.applications_count || 0), 0);



  // Calculate completion rate
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalWithCompletion = projects.filter(p => p.status === 'completed' || p.status === 'active' || p.status === 'in_progress' || p.status === 'funded');
  const completionRate = totalWithCompletion.length > 0
    ? Math.round((completedProjects / totalWithCompletion.length) * 100)
    : 0;

  const metrics = [
    {
      title: 'Proyectos Activos',
      value: activeProjectsCount.toString(),
      change: totalApplications > 0 ? `${totalApplications} nuevas aplicaciones` : 'Sin aplicaciones nuevas',
      icon: FolderOpen,
      color: 'bg-blue-600'
    },
    {
      title: 'Desarrolladores Contratados',
      value: developers.filter(d => d.availability === 'available' || d.availability === 'busy').length.toString(),
      change: `${developers.length} perfiles disponibles`,
      icon: Users,
      color: 'bg-primary'
    },
    {
      title: 'Balance de Billetera',
      value: wallet ? `$${parseFloat(wallet.balance).toLocaleString()}` : '$0',
      change: wallet && parseFloat(wallet.balance) > 0 ? 'Fondos disponibles' : 'Sin fondos',
      icon: DollarSign,
      color: 'bg-primary'
    },
    {
      title: 'Tasa de Finalización',
      value: `${completionRate}%`,
      change: `${completedProjects} proyectos completados`,
      icon: CheckCircle,
      color: 'bg-purple-600'
    }
  ];

  const recentActivity = [
    {
      type: 'new_application',
      title: `${totalApplications} nuevas aplicaciones`,
      description: totalApplications > 0 ? 'Revisa las aplicaciones pendientes' : 'No hay aplicaciones nuevas',
      time: 'Ahora',
      count: totalApplications
    },
    {
      type: 'project_completed',
      title: `${completedProjects} proyectos completados`,
      description: 'Proyectos finalizados exitosamente',
      time: 'Total',
      status: 'completed'
    },
    {
      type: 'active_projects',
      title: `${activeProjectsCount} proyectos activos`,
      description: 'Proyectos en desarrollo',
      time: 'Actualmente',
      active: true
    }
  ];

  // Get active projects for display (max 3)
  const displayProjects = activeProjects.slice(0, 3).map(project => {
    const progress = project.completed_milestones_count && project.milestones_count
      ? Math.round((project.completed_milestones_count / project.milestones_count) * 100)
      : 0;

    return {
      title: project.title,
      developer: project.applications?.find(a => a.developer)?.developer.name || 'Sin asignar',
      progress,
      deadline: project.deadline ? new Date(project.deadline).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Sin deadline',
      budget: project.budget_min && project.budget_max
        ? `$${project.budget_min.toLocaleString()} - $${project.budget_max.toLocaleString()}`
        : project.budget_max
          ? `$${project.budget_max.toLocaleString()}`
          : 'A negociar',
      status: project.status === 'active' ? 'Activo' : project.status === 'in_progress' ? 'En progreso' : project.status === 'funded' ? 'Funded' : project.status
    };
  });

  // Get recommended developers (top 3)
  const recommendedDevelopers = developers.slice(0, 3).map(dev => ({
    name: dev.name,
    specialty: dev.title || 'Desarrollador',
    rating: dev.rating,
    price: dev.hourlyRate ? `$${dev.hourlyRate}/hr` : 'N/A'
  }));

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bienvenido, {user?.name || 'Empresa'} 🏢
        </h1>
        <p className="text-muted-foreground">
          Encuentra tu equipo ideal. Tienes {activeProjectsCount} proyectos activos y {totalApplications} nuevas aplicaciones por revisar.
        </p>
      </div>

      <PaymentMethodBanner
        userType="company"
        onSetupClick={() => onSectionChange('wallet')}
      />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="bg-card border-border hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-primary text-sm flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {metric.change}
                    </p>
                  </div>
                  <div className={`${metric.color} p-3 rounded-full`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
                onClick={() => onSectionChange('my-projects')}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Ver todos
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay proyectos activos</p>
                  <Button
                    onClick={() => onSectionChange('publish-project')}
                    className="mt-4 bg-primary text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Publicar Proyecto
                  </Button>
                </div>
              ) : (
                displayProjects.map((project, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-foreground font-semibold">{project.title}</h3>
                        <p className="text-muted-foreground text-sm">Desarrollador: {project.developer}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-primary text-primary-foreground mb-1">
                          {project.budget}
                        </Badge>
                        <div className="text-xs text-muted-foreground">{project.status}</div>
                      </div>
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
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-primary hover:bg-accent"
                          onClick={() => onSectionChange('my-projects')}
                        >
                          Detalles <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:bg-accent"
                          onClick={() => onSectionChange('chat')}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
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
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex-shrink-0">
                    {activity.type === 'new_application' && (
                      <div className="bg-blue-600 p-2 rounded-full">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {activity.type === 'project_completed' && (
                      <div className="bg-primary p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {activity.type === 'active_projects' && (
                      <div className="bg-orange-600 p-2 rounded-full">
                        <FolderOpen className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium">{activity.title}</p>
                    <p className="text-muted-foreground text-xs mt-1">{activity.description}</p>
                    <p className="text-muted-foreground text-xs mt-2">{activity.time}</p>
                  </div>

                  {activity.count !== undefined && activity.count > 0 && (
                    <Badge className="bg-blue-600 text-white text-xs">{activity.count}</Badge>
                  )}
                </div>
              ))}

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-primary hover:bg-accent"
                onClick={() => onSectionChange('my-projects')}
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
              onClick={() => onSectionChange('publish-project')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 p-6 h-auto flex-col space-y-2"
            >
              <Plus className="h-6 w-6" />
              <span>Publicar Proyecto</span>
            </Button>

            <Button
              onClick={() => onSectionChange('search-programmers')}
              variant="outline"
              className="border-border text-foreground hover:bg-accent p-6 h-auto flex-col space-y-2"
            >
              <Search className="h-6 w-6" />
              <span>Buscar Desarrolladores</span>
            </Button>

            <Button
              onClick={() => onSectionChange('my-projects')}
              variant="outline"
              className="border-border text-foreground hover:bg-accent p-6 h-auto flex-col space-y-2"
            >
              <FolderOpen className="h-6 w-6" />
              <span>Gestionar Proyectos</span>
            </Button>

            <Button
              onClick={() => onSectionChange('chat')}
              variant="outline"
              className="border-border text-foreground hover:bg-accent p-6 h-auto flex-col space-y-2"
            >
              <MessageSquare className="h-6 w-6" />
              <span>Revisar Mensajes</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Desarrolladores Recomendados</CardTitle>
        </CardHeader>
        <CardContent>
          {recommendedDevelopers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay desarrolladores disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedDevelopers.map((dev, index) => (
                <div key={index} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
                  <h3 className="text-foreground font-semibold">{dev.name}</h3>
                  <p className="text-muted-foreground text-sm">{dev.specialty}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-primary text-sm">★ {dev.rating}</span>
                    <span className="text-foreground text-sm">{dev.price}</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => onSectionChange('search-programmers')}
                  >
                    Ver Perfil
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
