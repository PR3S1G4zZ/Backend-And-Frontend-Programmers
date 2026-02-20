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
  Search
} from 'lucide-react';
import { useAuth } from "../../../contexts/AuthContext";
import { PaymentMethodBanner } from "../settings/PaymentMethodBanner";

interface WelcomeSectionProps {
  onSectionChange: (section: string) => void;
}

export function WelcomeSection({ onSectionChange }: WelcomeSectionProps) {
  const { user } = useAuth();
  const recentActivity = [
    {
      type: 'new_application',
      title: '3 nuevas aplicaciones',
      description: 'Para el proyecto "SaaS Dashboard"',
      time: 'Hace 2 horas',
      count: 3
    },
    {
      type: 'project_completed',
      title: 'Proyecto completado',
      description: 'Mobile App MVP finalizado exitosamente',
      time: 'Hace 1 día',
      status: 'completed'
    },
    {
      type: 'new_message',
      title: 'Nuevo mensaje de Carlos M.',
      description: 'Consulta sobre requerimientos adicionales',
      time: 'Hace 3 horas',
      unread: true
    }
  ];

  const activeProjects = [
    {
      title: 'E-commerce Platform',
      developer: 'Elena Rodríguez',
      progress: 85,
      deadline: '20 Feb 2024',
      budget: '€15,000',
      status: 'En progreso'
    },
    {
      title: 'Data Analytics Tool',
      developer: 'Miguel Torres',
      progress: 60,
      deadline: '05 Mar 2024',
      budget: '€22,000',
      status: 'En desarrollo'
    },
    {
      title: 'Mobile Banking App',
      developer: 'Sofia Chen',
      progress: 30,
      deadline: '15 Mar 2024',
      budget: '€35,000',
      status: 'Iniciado'
    }
  ];

  const metrics = [
    {
      title: 'Proyectos Activos',
      value: '3',
      change: '+1 este mes',
      icon: FolderOpen,
      color: 'bg-blue-600'
    },
    {
      title: 'Desarrolladores Trabajando',
      value: '5',
      change: '+2 vs mes anterior',
      icon: Users,
      color: 'bg-primary'
    },
    {
      title: 'Presupuesto Invertido',
      value: '€72,000',
      change: '+€18K este mes',
      icon: DollarSign,
      color: 'bg-primary'
    },
    {
      title: 'Tasa de Finalización',
      value: '96%',
      change: '+4% vs promedio',
      icon: CheckCircle,
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Bienvenido, {user?.name || 'Empresa'} 🏢
        </h1>
        <p className="text-gray-300">
          Encuentra tu equipo ideal. Tienes 3 proyectos activos y 12 nuevas aplicaciones por revisar.
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
            <Card key={index} className="bg-[#1A1A1A] border-[#333333] hover-neon">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{metric.title}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
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
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Proyectos Activos</CardTitle>
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
              {activeProjects.map((project, index) => (
                <div key={index} className="border border-[#333333] rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{project.title}</h3>
                      <p className="text-gray-400 text-sm">Desarrollador: {project.developer}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-primary text-primary-foreground mb-1">
                        {project.budget}
                      </Badge>
                      <div className="text-xs text-gray-400">{project.status}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progreso</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-[#333333] rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Deadline: {project.deadline}</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-primary hover:bg-[#333333]">
                        Detalles <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-[#333333]">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#0D0D0D] transition-colors">
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
                    {activity.type === 'new_message' && (
                      <div className="bg-orange-600 p-2 rounded-full">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{activity.title}</p>
                    <p className="text-gray-400 text-xs mt-1">{activity.description}</p>
                    <p className="text-gray-500 text-xs mt-2">{activity.time}</p>
                  </div>

                  {activity.unread && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                  {activity.count && (
                    <Badge className="bg-blue-600 text-white text-xs">{activity.count}</Badge>
                  )}
                </div>
              ))}

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-primary hover:bg-[#333333]"
              >
                Ver toda la actividad
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardHeader>
          <CardTitle className="text-white">Acciones Rápidas</CardTitle>
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
              className="border-[#333333] text-white hover:bg-[#333333] p-6 h-auto flex-col space-y-2"
            >
              <Search className="h-6 w-6" />
              <span>Buscar Desarrolladores</span>
            </Button>

            <Button
              onClick={() => onSectionChange('my-projects')}
              variant="outline"
              className="border-[#333333] text-white hover:bg-[#333333] p-6 h-auto flex-col space-y-2"
            >
              <FolderOpen className="h-6 w-6" />
              <span>Gestionar Proyectos</span>
            </Button>

            <Button
              onClick={() => onSectionChange('chat')}
              variant="outline"
              className="border-[#333333] text-white hover:bg-[#333333] p-6 h-auto flex-col space-y-2"
            >
              <MessageSquare className="h-6 w-6" />
              <span>Revisar Mensajes</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardHeader>
          <CardTitle className="text-white">Desarrolladores Recomendados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Ana Silva', specialty: 'Frontend React', rating: 4.9, price: '€75/hr' },
              { name: 'David López', specialty: 'Backend Node.js', rating: 4.8, price: '€80/hr' },
              { name: 'Laura Martín', specialty: 'Full Stack', rating: 5.0, price: '€90/hr' }
            ].map((dev, index) => (
              <div key={index} className="border border-[#333333] rounded-lg p-4 hover:border-primary transition-colors">
                <h3 className="text-white font-semibold">{dev.name}</h3>
                <p className="text-gray-400 text-sm">{dev.specialty}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-primary text-sm">★ {dev.rating}</span>
                  <span className="text-white text-sm">{dev.price}</span>
                </div>
                <Button size="sm" className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  Ver Perfil
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}