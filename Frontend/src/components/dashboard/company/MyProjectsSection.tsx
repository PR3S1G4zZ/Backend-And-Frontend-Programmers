import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Clock,
  Users,
  CheckCircle,
  Star,
  Eye,
  MessageSquare,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchCompanyProjects, deleteProject, updateProject, type ProjectResponse } from '../../../services/projectService';
import { useSweetAlert } from '../../ui/sweet-alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

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
  originalData: ProjectResponse;
}

interface MyProjectsSectionProps {
  onSectionChange: (section: string, data?: any) => void;
}

const mapProject = (project: ProjectResponse): Project => {
  const statusMap: Record<string, Project['status']> = {
    open: 'published',
    in_progress: 'in-progress',
    completed: 'completed',
    cancelled: 'cancelled',
    draft: 'draft',
  };

  const status = statusMap[project.status] ?? 'published';
  const budget = project.budget_max ?? project.budget_min ?? 0;
  const budgetType = project.budget_type ?? 'fixed';
  const category = project.categories?.[0]?.name ?? 'Sin categoría';
  const skills = project.skills?.map((skill) => skill.name) ?? [];
  const acceptedApplication = project.applications?.find((application) => application.developer);

  let progress = 0;
  if (status === 'completed') {
    progress = 100;
  } else if (project.milestones_count && project.milestones_count > 0) {
    progress = Math.round((project.completed_milestones_count || 0) / project.milestones_count * 100);
  } else if (status === 'in-progress') {
    // Fallback if no milestones but in progress (e.g. just started or legacy)
    progress = 0;
  }

  return {
    id: String(project.id),
    title: project.title,
    description: project.description,
    status,
    budget,
    budgetType,
    progress,
    startDate: project.created_at ?? '',
    deadline: project.deadline ?? '',
    developer: acceptedApplication?.developer
      ? {
        name: acceptedApplication.developer.name,
        rating: 0,
      }
      : undefined,
    applicants: project.applications_count ?? 0,
    category,
    skills,
    priority: project.priority ?? 'medium',
    lastUpdate: project.updated_at ?? '',
    messages: 0,
    originalData: project
  };
};

export function MyProjectsSection({ onSectionChange }: MyProjectsSectionProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert, Alert } = useSweetAlert();

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      showAlert({
        title: 'Proyecto eliminado',
        text: 'El proyecto ha sido movido a la papelera.',
        type: 'success'
      });
    } catch (error: any) {
      console.error('Error deleting project', error);
      // Backend returns 403 if project has accepted developers
      const message = error.response?.data?.message || 'No se pudo eliminar el proyecto.';
      showAlert({
        title: 'Error',
        text: message,
        type: 'error'
      });
    }
    /* ... handleDelete ... */
  };

  const handleEdit = (project: Project) => {
    // Navigate to edit page
    onSectionChange('edit-project', project.originalData);
  };

  const handleComplete = (project: Project) => {
    showAlert({
      title: '¿Marcar como completado?',
      text: 'El proyecto se marcará como terminado. Esta acción no se puede deshacer.',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, completar',
      cancelButtonText: 'Cancelar',
      onConfirm: async () => {
        try {
          await updateProject(String(project.id), { ...project.originalData, status: 'completed' });
          setProjects(projects.map(p => p.id === String(project.id) ? { ...p, status: 'completed' } : p));
          showAlert({
            title: '¡Proyecto Completado!',
            text: 'El proyecto ha sido marcado como finalizado.',
            type: 'success'
          });
        } catch (error) {
          console.error('Error completing project', error);
          showAlert({
            title: 'Error',
            text: 'No se pudo actualizar el estado del proyecto.',
            type: 'error'
          });
        }
      }
    });
  };

  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchCompanyProjects();
        if (!isMounted) return;
        // Check if response has data property (API Resource wrapper)
        const projectsData = 'data' in response ? response.data : response;
        if (Array.isArray(projectsData)) {
          setProjects(projectsData.map(mapProject));
        } else {
          console.error('Projects data is not an array', response);
          setProjects([]);
        }
      } catch (error) {
        console.error('Error cargando proyectos de la empresa', error);
        if (isMounted) {
          setError('No se pudieron cargar tus proyectos.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-600';
      case 'published': return 'bg-blue-600';
      case 'in-progress': return 'bg-yellow-600';
      case 'completed': return 'bg-primary';
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
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      case 'oldest':
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      case 'budget-high':
        return b.budget - a.budget;
      case 'budget-low':
        return a.budget - b.budget;
      case 'progress-high':
        return b.progress - a.progress;
      case 'progress-low':
        return a.progress - b.progress;
      default:
        return 0;
    }
  });

  const stats = {
    total: projects.length,
    active: projects.filter(p => ['published', 'in-progress'].includes(p.status)).length,
    completed: projects.filter(p => p.status === 'completed').length,
    drafts: projects.filter(p => p.status === 'draft').length
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mis Proyectos</h1>
          <p className="text-gray-300">
            Gestiona todos tus proyectos activos, completados y en borrador
          </p>
        </div>
        <Button
          onClick={() => onSectionChange('publish-project')}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      {isLoading ? (
        <div className="rounded-lg border border-[#333333] bg-[#1A1A1A] p-4 text-sm text-gray-300">
          Cargando proyectos...
        </div>
      ) : null}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
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
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Todos ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Activos ({stats.active})
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Completados ({stats.completed})
                </TabsTrigger>
                <TabsTrigger value="drafts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
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

                      <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none" onClick={(e) => e.stopPropagation()}>
                          <div className="h-8 w-8 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer relative z-20">
                            <MoreVertical className="h-4 w-4" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#1A1A1A] border-[#333333] z-[9999]">
                          <DropdownMenuItem
                            className="text-white hover:bg-[#333333] cursor-pointer"
                            onSelect={() => handleEdit(project)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          {project.status !== 'completed' && (
                            <DropdownMenuItem
                              className="text-blue-400 hover:bg-blue-900/20 hover:text-blue-300 cursor-pointer"
                              onSelect={() => handleComplete(project)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              <span>Marcar Finalizado</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-400 hover:bg-red-900/20 hover:text-red-300 cursor-pointer"
                            onSelect={(e) => {
                              e.preventDefault(); // Prevent menu from closing immediately if needed, though usually usually fine
                              console.log('Delete clicked for project:', project.id);
                              showAlert({
                                title: '¿Eliminar proyecto?',
                                text: 'Esta acción no se puede deshacer. El proyecto será movido a la papelera.',
                                type: 'question',
                                showCancelButton: true,
                                confirmButtonText: 'Sí, eliminar',
                                cancelButtonText: 'Cancelar',
                                onConfirm: () => handleDelete(project.id)
                              });
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Project Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mt-4">
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-white truncate">
                          €{project.budget.toLocaleString()}{project.budgetType === 'hourly' ? '/h' : ''}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 overflow-hidden">
                        <Users className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        <span className="text-white truncate">{project.applicants} candidatos</span>
                      </div>

                      {project.deadline && (
                        <div className="flex items-center space-x-2 overflow-hidden">
                          <Calendar className="h-4 w-4 text-orange-400 flex-shrink-0" />
                          <span className="text-white truncate">{new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 overflow-hidden">
                        <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-white truncate">
                          Act. {project.lastUpdate ? new Date(project.lastUpdate).toLocaleDateString() : 'Sin act.'}
                        </span>
                      </div>
                    </div>

                    {/* Progress and Developer */}
                    {project.status === 'in-progress' && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-medium text-gray-400">Progreso del proyecto</span>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-bold text-primary">{project.progress}%</span>
                            </div>
                          </div>
                          <div className="h-2.5 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${project.progress === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                                project.progress > 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                                  'bg-gradient-to-r from-yellow-500 to-orange-400'
                                }`}
                            />
                          </div>
                        </div>

                        {project.developer && (
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={project.developer.avatar} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
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
                      <Button
                        size="sm"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => onSectionChange('view-candidates', project.originalData)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Ver Candidatos
                      </Button>
                    )}

                    {project.status === 'in-progress' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => onSectionChange('workspace', project.originalData)}
                        >
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
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
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
                      <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
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

      {
        filteredProjects.length === 0 && (
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
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Proyecto
              </Button>
            </div>
          </Card>
        )
      }
      <Alert />
    </div >
  );
}
