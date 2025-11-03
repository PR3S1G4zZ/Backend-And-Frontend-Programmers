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
  Search
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

interface WelcomeSectionProps {
  onSectionChange: (section: string) => void;
}

export function WelcomeSection({ onSectionChange }: WelcomeSectionProps) {
  const { user } = useAuth();
  const recentActivity = [
    {
      type: 'project_completed',
      title: 'E-commerce Platform completado',
      description: 'Proyecto para RetailMax finalizado exitosamente',
      time: 'Hace 2 días',
      amount: '€5,200'
    },
    {
      type: 'new_message',
      title: 'Nuevo mensaje de TechStart',
      description: 'Interesados en tus servicios de React Native',
      time: 'Hace 5 horas',
      unread: true
    },
    {
      type: 'profile_view',
      title: 'Tu perfil fue visto 12 veces',
      description: 'Empresas han revisado tu portafolio',
      time: 'Hoy',
      views: 12
    }
  ];

  const activeProjects = [
    {
      title: 'SaaS Dashboard',
      client: 'FinanceApp Inc',
      progress: 75,
      deadline: '15 Feb 2024',
      value: '€8,500'
    },
    {
      title: 'Mobile App MVP',
      client: 'StartupXYZ',
      progress: 40,
      deadline: '28 Feb 2024',
      value: '€12,000'
    }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Hola, {user?.name || 'Usuario'} 👋
        </h1>
        <p className="text-gray-300">
          Aquí está tu espacio de desarrollo. Tienes 2 proyectos activos y 5 nuevas oportunidades.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ganado este mes</p>
                <p className="text-2xl font-bold text-white">€15,400</p>
                <p className="text-[#00FF85] text-sm flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +23% vs mes anterior
                </p>
              </div>
              <div className="bg-[#00FF85] p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-[#0D0D0D]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Proyectos activos</p>
                <p className="text-2xl font-bold text-white">2</p>
                <p className="text-[#00C46A] text-sm">En progreso</p>
              </div>
              <div className="bg-[#00C46A] p-3 rounded-full">
                <Clock className="h-6 w-6 text-[#0D0D0D]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rating promedio</p>
                <p className="text-2xl font-bold text-white">4.9</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-[#00FF85] fill-current" />
                  <span className="text-gray-400 text-sm ml-1">127 reviews</span>
                </div>
              </div>
              <div className="bg-[#00FF85] p-3 rounded-full">
                <Star className="h-6 w-6 text-[#0D0D0D]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Mensajes sin leer</p>
                <p className="text-2xl font-bold text-white">3</p>
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
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Proyectos Activos</CardTitle>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => onSectionChange('projects')}
                className="border-[#00FF85] text-[#00FF85] hover:bg-[#00FF85] hover:text-[#0D0D0D]"
              >
                Ver todos
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProjects.map((project, index) => (
                <div key={index} className="border border-[#333333] rounded-lg p-4 hover:border-[#00FF85] transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{project.title}</h3>
                      <p className="text-gray-400 text-sm">{project.client}</p>
                    </div>
                    <Badge variant="secondary" className="bg-[#00FF85] text-[#0D0D0D]">
                      {project.value}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progreso</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-[#333333] rounded-full h-2">
                      <div 
                        className="bg-[#00FF85] h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Deadline: {project.deadline}</span>
                    <Button size="sm" variant="ghost" className="text-[#00FF85] hover:bg-[#333333]">
                      Ver detalles <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
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
                    {activity.type === 'project_completed' && (
                      <div className="bg-green-600 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {activity.type === 'new_message' && (
                      <div className="bg-blue-600 p-2 rounded-full">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {activity.type === 'profile_view' && (
                      <div className="bg-purple-600 p-2 rounded-full">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{activity.title}</p>
                    <p className="text-gray-400 text-xs mt-1">{activity.description}</p>
                    <p className="text-gray-500 text-xs mt-2">{activity.time}</p>
                  </div>

                  {activity.unread && (
                    <div className="w-2 h-2 bg-[#00FF85] rounded-full"></div>
                  )}
                </div>
              ))}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-[#00FF85] hover:bg-[#333333]"
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
              onClick={() => onSectionChange('profile')}
              className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] p-6 h-auto flex-col space-y-2"
            >
              <User className="h-6 w-6" />
              <span>Actualizar Perfil</span>
            </Button>
            
            <Button 
              onClick={() => onSectionChange('portfolio')}
              variant="outline"
              className="border-[#333333] text-white hover:bg-[#333333] p-6 h-auto flex-col space-y-2"
            >
              <FolderOpen className="h-6 w-6" />
              <span>Gestionar Portafolio</span>
            </Button>
            
            <Button 
              onClick={() => onSectionChange('projects')}
              variant="outline"
              className="border-[#333333] text-white hover:bg-[#333333] p-6 h-auto flex-col space-y-2"
            >
              <Search className="h-6 w-6" />
              <span>Buscar Proyectos</span>
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
    </div>
  );
}