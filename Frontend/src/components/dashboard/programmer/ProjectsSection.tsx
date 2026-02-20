import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Users,
  Star,
  Eye,
  Heart,
  MessageSquare,
  Briefcase,
  Award,
  Zap,
  Code,
  Database,
  Smartphone,
  Palette,
  Shield,
  Brain,
  ExternalLink,
  BookmarkPlus
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { fetchProjects, type ProjectResponse } from '../../../services/projectService';
import { toggleFavorite as toggleFavoriteApi } from '../../../services/favoriteService';

interface Project {
  id: string;
  title: string;
  description: string;
  company: {
    name: string;
    logo?: string;
    verified: boolean;
    rating: number;
    reviewsCount: number;
  };
  budget: {
    min: number;
    max: number;
    type: 'fixed' | 'hourly';
  };
  duration: {
    value: number;
    unit: 'days' | 'weeks' | 'months';
  };
  location: string;
  remote: boolean;
  skills: string[];
  category: string;
  level: 'junior' | 'mid' | 'senior' | 'lead';
  applicants: number;
  maxApplicants: number;
  postedDate: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  featured: boolean;
  status: 'open' | 'in-review' | 'closed';
  tags: string[];
  hasApplied: boolean;
}

const mapProject = (project: ProjectResponse): Project => {
  const category = project.categories?.[0]?.name ?? 'Sin categoría';
  const skills = project.skills?.map((skill) => skill.name) ?? [];
  const budgetMin = project.budget_min ?? 0;
  const budgetMax = project.budget_max ?? budgetMin;

  return {
    id: String(project.id),
    title: project.title,
    description: project.description,
    company: {
      name: project.company?.name ?? 'Empresa',
      verified: Boolean(project.company?.email_verified_at),
      rating: 0,
      reviewsCount: 0,
    },
    budget: {
      min: budgetMin,
      max: budgetMax,
      type: project.budget_type ?? 'fixed',
    },
    duration: {
      value: project.duration_value ?? 0,
      unit: project.duration_unit ?? 'weeks',
    },
    location: project.location ?? 'Remoto',
    remote: project.remote ?? false,
    skills,
    category,
    level: project.level ?? 'mid',
    applicants: project.applications_count ?? 0,
    maxApplicants: project.max_applicants ?? 0,
    postedDate: project.created_at,
    deadline: project.deadline ?? '',
    priority: project.priority ?? 'medium',
    featured: project.featured ?? false,
    status: (project.status as Project['status']) ?? 'open',
    tags: project.tags ?? [],
    hasApplied: project.has_applied ?? false,
  };
};

export function ProjectsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [appliedProjects, setAppliedProjects] = useState<string[]>([]);
  const [showAnimations, setShowAnimations] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryIconMap: Record<string, typeof Briefcase> = {
    'Desarrollo Web': Code,
    'Desarrollo Mobile': Smartphone,
    'UI/UX Design': Palette,
    'DevOps': Shield,
    'Data Science': Database,
    'AI/ML': Brain,
    'Blockchain': Award,
  };

  const categories = [
    { id: 'all', name: 'Todos los Proyectos', icon: Briefcase, count: projects.length },
    ...Array.from(new Set(projects.map((project) => project.category))).map((category) => ({
      id: category,
      name: category,
      icon: categoryIconMap[category] ?? Briefcase,
      count: projects.filter((project) => project.category === category).length,
    }))
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.company.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || project.level === selectedLevel;
    const matchesLocation = selectedLocation === 'all' ||
      project.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      (selectedLocation === 'remoto' && project.remote);

    return matchesSearch && matchesCategory && matchesLevel && matchesLocation && project.status === 'open';
  });

  // Apply sorting to filtered projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      case 'oldest':
        return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
      case 'budget-high':
        return b.budget.max - a.budget.max;
      case 'budget-low':
        return a.budget.max - b.budget.max;
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      default:
        return 0;
    }
  });

  const toggleFavorite = async (projectId: string) => {
    try {
      // Call backend to toggle favorite
      await toggleFavoriteApi(parseInt(projectId));
      // Update local state
      setFavorites(prev =>
        prev.includes(projectId)
          ? prev.filter(id => id !== projectId)
          : [...prev, projectId]
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Still update local state for better UX even if backend fails
      setFavorites(prev =>
        prev.includes(projectId)
          ? prev.filter(id => id !== projectId)
          : [...prev, projectId]
      );
    }
  };

  const applyToProject = async (projectId: string) => {
    try {
      await import('../../../services/projectService').then(m => m.applyToProject(projectId));
      setAppliedProjects(prev => [...prev, projectId]);
      // Optional: Add success toast/alert here
    } catch (error) {
      console.error("Error applying to project:", error);
      // Optional: Add error toast
      setError('Error al postularse al proyecto.');
    }
  };

  const getBudgetText = (budget: Project['budget']) => {
    if (budget.type === 'fixed') {
      return `€${budget.min.toLocaleString()}-€${budget.max.toLocaleString()}`;
    }
    return `€${budget.min}-€${budget.max}/h`;
  };

  const getDurationText = (duration: Project['duration']) => {
    const unit = duration.unit === 'weeks' ? 'sem' :
      duration.unit === 'months' ? 'mes' : 'días';
    return `${duration.value} ${unit}`;
  };

  const getLevelColor = (level: Project['level']) => {
    switch (level) {
      case 'junior': return 'bg-primary';
      case 'mid': return 'bg-blue-600';
      case 'senior': return 'bg-purple-600';
      case 'lead': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getLevelText = (level: Project['level']) => {
    switch (level) {
      case 'junior': return 'Junior';
      case 'mid': return 'Mid-Level';
      case 'senior': return 'Senior';
      case 'lead': return 'Tech Lead';
      default: return level;
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}sem`;
  };

  useEffect(() => {
    // Animaciones de entrada
    const timer = setTimeout(() => setShowAnimations(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchProjects();
        if (!isMounted) return;
        const items = response.data || [];
        const mappedProjects = items.map(mapProject);
        setProjects(mappedProjects);
        setAppliedProjects(mappedProjects.filter(p => p.hasApplied).map(p => p.id));
      } catch (error) {
        console.error('Error cargando proyectos', error);
        if (isMounted) {
          setError('No se pudieron cargar los proyectos.');
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header con animación */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 glow-text">
              Proyectos Publicados
            </h1>
            <p className="text-muted-foreground">
              Descubre oportunidades perfectas para tu perfil profesional
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{sortedProjects.length}</div>
                <div className="text-xs text-muted-foreground">Proyectos activos</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

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

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="bg-card border-border hover-neon">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Buscar proyectos por tecnología, empresa o descripción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-background border-border text-foreground h-12 hover-neon"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="text-popover-foreground hover:bg-accent">
                        <div className="flex items-center space-x-2">
                          <category.icon className="h-4 w-4" />
                          <span>{category.name} ({category.count})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Nivel" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all" className="text-popover-foreground">Todos los niveles</SelectItem>
                    <SelectItem value="junior" className="text-popover-foreground">Junior</SelectItem>
                    <SelectItem value="mid" className="text-popover-foreground">Mid-Level</SelectItem>
                    <SelectItem value="senior" className="text-popover-foreground">Senior</SelectItem>
                    <SelectItem value="lead" className="text-popover-foreground">Tech Lead</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Ubicación" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all" className="text-popover-foreground">Todas las ubicaciones</SelectItem>
                    <SelectItem value="remoto" className="text-popover-foreground">Remoto</SelectItem>
                    <SelectItem value="madrid" className="text-popover-foreground">Madrid</SelectItem>
                    <SelectItem value="barcelona" className="text-popover-foreground">Barcelona</SelectItem>
                    <SelectItem value="valencia" className="text-popover-foreground">Valencia</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="newest" className="text-popover-foreground">Más reciente</SelectItem>
                    <SelectItem value="budget-high" className="text-popover-foreground">Mayor presupuesto</SelectItem>
                    <SelectItem value="budget-low" className="text-popover-foreground">Menor presupuesto</SelectItem>
                    <SelectItem value="deadline" className="text-popover-foreground">Próximo deadline</SelectItem>
                    <SelectItem value="applicants" className="text-popover-foreground">Menos competencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Categories Quick Filter */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex overflow-x-auto space-x-4 pb-2"
      >
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 whitespace-nowrap ${selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border-[#333333] text-white hover:bg-[#333333]'
                  }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{category.name}</span>
                <Badge variant="secondary" className="bg-[#333333] text-white ml-1">
                  {category.count}
                </Badge>
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AnimatePresence>
          {sortedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{
                delay: showAnimations ? 0.1 * index : 0,
                duration: 0.5,
                layout: { duration: 0.3 }
              }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <Card className={`bg-card border-border hover-neon overflow-hidden transition-all duration-300 ${project.featured ? 'ring-2 ring-primary/30' : ''
                }`}>
                {/* Featured Badge */}
                {project.featured && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4 z-10"
                  >
                    <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground pulse-neon">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Destacado
                    </Badge>
                  </motion.div>
                )}

                {/* Priority Badge */}
                {project.priority === 'urgent' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-4 left-4 z-10"
                  >
                    <Badge className="bg-red-600 text-white animate-pulse">
                      <Zap className="h-3 w-3 mr-1" />
                      Urgente
                    </Badge>
                  </motion.div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={project.company.logo} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {project.company.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-foreground font-medium">{project.company.name}</span>
                              {project.company.verified && (
                                <Award className="h-3 w-3 text-blue-400" />
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-muted-foreground">
                                {project.company.rating} ({project.company.reviewsCount})
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 ml-auto text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {getTimeAgo(project.postedDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Project Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="text-foreground font-medium">{getBudgetText(project.budget)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span className="text-foreground">{getDurationText(project.duration)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-orange-400" />
                        <span className="text-foreground">{project.remote ? 'Remoto' : project.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        <span className="text-foreground">{project.applicants}/{project.maxApplicants} candidatos</span>
                      </div>
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div className="flex items-center justify-between">
                    <Badge className={`${getLevelColor(project.level)} text-white`}>
                      {getLevelText(project.level)}
                    </Badge>

                    <div className="text-xs text-muted-foreground">
                      Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Sin fecha'}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {project.skills.slice(0, 4).map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * skillIndex }}
                      >
                        <Badge variant="secondary" className="bg-secondary text-primary text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                    {project.skills.length > 4 && (
                      <Badge variant="secondary" className="bg-secondary text-muted-foreground text-xs">
                        +{project.skills.length - 4}
                      </Badge>
                    )}
                  </div>

                  {/* Tags */}
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-border text-muted-foreground text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          disabled={appliedProjects.includes(project.id)}
                          onClick={() => applyToProject(project.id)}
                          className={`${appliedProjects.includes(project.id)
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                            } transition-all duration-200`}
                        >
                          {appliedProjects.includes(project.id) ? (
                            <>
                              <Award className="h-4 w-4 mr-2" />
                              Aplicado
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Aplicar
                            </>
                          )}
                        </Button>
                      </motion.div>

                      <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-accent">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleFavorite(project.id)}
                          className={`p-2 ${favorites.includes(project.id)
                            ? 'text-red-400 hover:text-red-300'
                            : 'text-gray-400 hover:text-red-400'
                            }`}
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(project.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </motion.div>

                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                        <MessageSquare className="h-4 w-4" />
                      </Button>

                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                        <BookmarkPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {
        filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card border-border p-12">
              <div className="text-center">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="bg-accent p-8 rounded-full mb-4 mx-auto w-24 h-24 flex items-center justify-center"
                >
                  <Search className="h-12 w-12 text-muted-foreground" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No se encontraron proyectos</h3>
                <p className="text-muted-foreground mb-4">
                  Ajusta tus filtros o términos de búsqueda para encontrar más oportunidades
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                    setSelectedLocation('all');
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 btn-glow"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </Card>
          </motion.div>
        )
      }
    </div >
  );
}
