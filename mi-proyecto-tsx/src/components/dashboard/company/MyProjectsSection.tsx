import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  MessageSquare,
  Eye,
  Edit,
  Archive,
  Star
} from 'lucide-react';
import { motion } from 'motion/react';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'in-progress' | 'completed' | 'paused' | 'cancelled';
  budget: number;
  budgetType: 'fixed' | 'hourly';
  progress: number;
  startDate: string;
  deadline: string;
  developer?: {
    name: string;
    avatar?: string;
    rating: number;
  };
  applicants: number;
  category: string;
  skills: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  lastUpdate: string;
  messages: number;
}

interface MyProjectsSectionProps {
  onSectionChange: (section: string) => void;
}

export function MyProjectsSection({ onSectionChange }: MyProjectsSectionProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('all');

  // Datos ficticios de proyectos
  const projects: Project[] = [
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'Desarrollo completo de plataforma de comercio electrónico con React, Node.js y PostgreSQL',
      status: 'in-progress',
      budget: 15000,
      budgetType: 'fixed',
      progress: 75,
      startDate: '2024-01-15',
      deadline: '2024-03-15',
      developer: {
        name: 'Elena Rodríguez',
        rating: 4.9
      },
      applicants: 12,
      category: 'Desarrollo Web',
      skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      priority: 'high',
      lastUpdate: '2 horas',
      messages: 3
    },
    {
      id: '2',
      title: 'Mobile Banking App',
      description: 'Aplicación móvil para servicios bancarios con React Native y integración de APIs',
      status: 'completed',
      budget: 25000,
      budgetType: 'fixed',
      progress: 100,
      startDate: '2023-10-01',
      deadline: '2024-01-15',
      developer: {
        name: 'Sofia Chen',
        rating: 5.0
      },
      applicants: 8,
      category: 'Desarrollo Mobile',
      skills: ['React Native', 'TypeScript', 'Firebase'],
      priority: 'medium',
      lastUpdate: '1 semana',
      messages: 0
    },
    {
      id: '3',
      title: 'Data Analytics Dashboard',
      description: 'Dashboard interactivo para análisis de datos empresariales con visualizaciones en tiempo real',
      status: 'published',
      budget: 12000,
      budgetType: 'fixed',
      progress: 0,
      startDate: '',
      deadline: '2024-04-30',
      applicants: 15,
      category: 'Data Science',
      skills: ['Python', 'Django', 'D3.js', 'PostgreSQL'],
      priority: 'medium',
      lastUpdate: '3 días',
      messages: 0
    },
    {
      id: '4',
      title: 'DevOps Infrastructure',
      description: 'Configuración de infraestructura cloud con Docker, Kubernetes y CI/CD',
      status: 'in-progress',
      budget: 80,
      budgetType: 'hourly',
      progress: 40,
      startDate: '2024-02-01',
      deadline: '2024-03-30',
      developer: {
        name: 'David López',
        rating: 4.7
      },
      applicants: 6,
      category: 'DevOps',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'],
      priority: 'urgent',
      lastUpdate: '1 día',
      messages: 2
    },
    {
      id: '5',
      title: 'AI Chatbot Integration',
      description: 'Integración de chatbot con IA para atención al cliente automatizada',
      status: 'draft',
      budget: 8000,
      budgetType: 'fixed',
      progress: 0,
      startDate: '',
      deadline: '',
      applicants: 0,
      category: 'AI/ML',
      skills: ['Python', 'OpenAI API', 'NLP', 'FastAPI'],
      priority: 'low',
      lastUpdate: '5 días',
      messages: 0
    }
  ];

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-600';
      case 'published': return 'bg-blue-600';
      case 'in-progress': return 'bg-yellow-600';
      case 'completed': return 'bg-green-600';
      case 'paused': return 'bg-orange-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'published': return 'Publicado';
      case 'in-progress': return 'En Progreso';
      case 'completed': return 'Completado';
      case 'paused': return 'Pausado';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'low': return 'text-gray-400';
      case 'medium': return 'text-blue-400';
      case 'high': return 'text-orange-400';
      case 'urgent': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['published', 'in-progress'].includes(project.status);
    if (activeTab === 'completed') return project.status === 'completed';
    if (activeTab === 'drafts') return project.status === 'draft';
    return true;
  }).filter(project => {
    if (filterStatus === 'all') return true;
    return project.status === filterStatus;
  });

  const stats = {
    total: projects.length,
    active: projects.filter(p => ['published', 'in-progress'].includes(p.status)).length,
    completed: projects.filter(p => p.status === 'completed').length,
    drafts: projects.filter(p => p.status === 'draft').length
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mis Proyectos</h1>
          <p className="text-gray-300">
            Gestiona todos tus proyectos activos, completados y en borrador
          </p>
        </div>
        <Button 
          onClick={() => onSectionChange('publish-project')}
          className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-gray-400 text-sm">Total</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.active}</div>
            <div className="text-gray-400 text-sm">Activos</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
            <div className="text-gray-400 text-sm">Completados</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-400">{stats.drafts}</div>
            <div className="text-gray-400 text-sm">Borradores</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
              <TabsList className="bg-[#0D0D0D] border border-[#333333]">
                <TabsTrigger value="all" className="data-[state=active]:bg-[#00FF85] data-[state=active]:text-[#0D0D0D]">
                  Todos ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-[#00FF85] data-[state=active]:text-[#0D0D0D]">
                  Activos ({stats.active})
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-[#00FF85] data-[state=active]:text-[#0D0D0D]">
                  Completados ({stats.completed})
                </TabsTrigger>
                <TabsTrigger value="drafts" className="data-[state=active]:bg-[#00FF85] data-[state=active]:text-[#0D0D0D]">
                  Borradores ({stats.drafts})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-[#0D0D0D] border-[#333333] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                  <SelectItem value="newest" className="text-white">Más reciente</SelectItem>
                  <SelectItem value="oldest" className="text-white">Más antiguo</SelectItem>
                  <SelectItem value="budget-high" className="text-white">Mayor presupuesto</SelectItem>
                  <SelectItem value="budget-low" className="text-white">Menor presupuesto</SelectItem>
                  <SelectItem value="progress" className="text-white">Por progreso</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-[#333333] text-white hover:bg-[#333333]">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                          <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
                            {getStatusText(project.status)}
                          </Badge>
                          <Badge variant="outline" className={`border-current ${getPriorityColor(project.priority)} text-xs`}>
                            {project.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{project.description}</p>
                        
                        {/* Skills */}
                        <div className="flex flex-wrap gap-1">
                          {project.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="bg-[#0D0D0D] text-[#00C46A] text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Project Info */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-[#00FF85]" />
                        <span className="text-white">
                          €{project.budget.toLocaleString()}{project.budgetType === 'hourly' ? '/h' : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{project.applicants} candidatos</span>
                      </div>
                      
                      {project.deadline && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-orange-400" />
                          <span className="text-white">{new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-white">Act. {project.lastUpdate}</span>
                      </div>
                    </div>

                    {/* Progress and Developer */}
                    {project.status === 'in-progress' && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">Progreso del proyecto</span>
                            <span className="text-sm text-white">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                        
                        {project.developer && (
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={project.developer.avatar} />
                              <AvatarFallback className="bg-[#00FF85] text-[#0D0D0D] text-sm">
                                {project.developer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white text-sm font-medium">{project.developer.name}</p>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-400">{project.developer.rating}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="ml-6 flex flex-col space-y-2">
                    {project.status === 'published' && (
                      <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                        <Users className="h-4 w-4 mr-2" />
                        Ver Candidatos
                      </Button>
                    )}
                    
                    {project.status === 'in-progress' && (
                      <>
                        <Button size="sm" className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Progreso
                        </Button>
                        {project.messages > 0 && (
                          <Button size="sm" variant="outline" className="border-[#333333] text-white hover:bg-[#333333] relative">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                            {project.messages > 0 && (
                              <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs h-5 w-5 p-0 flex items-center justify-center">
                                {project.messages}
                              </Badge>
                            )}
                          </Button>
                        )}
                      </>
                    )}
                    
                    {project.status === 'draft' && (
                      <>
                        <Button size="sm" className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]">
                          <Edit className="h-4 w-4 mr-2" />
                          Continuar
                        </Button>
                        <Button size="sm" variant="outline" className="border-[#333333] text-white hover:bg-[#333333]">
                          <Play className="h-4 w-4 mr-2" />
                          Publicar
                        </Button>
                      </>
                    )}
                    
                    {project.status === 'completed' && (
                      <Button size="sm" variant="outline" className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completado
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="bg-[#1A1A1A] border-[#333333] p-12">
          <div className="text-center">
            <div className="bg-[#333333] p-8 rounded-full mb-4 mx-auto w-24 h-24 flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No hay proyectos</h3>
            <p className="text-gray-400 mb-4">
              No tienes proyectos en esta categoría. ¡Empieza creando tu primer proyecto!
            </p>
            <Button 
              onClick={() => onSectionChange('publish-project')}
              className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Proyecto
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}