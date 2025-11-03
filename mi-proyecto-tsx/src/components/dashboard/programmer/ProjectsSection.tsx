import { useState, useEffect } from 'react';
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
  priority: 'normal' | 'urgent';
  featured: boolean;
  status: 'open' | 'in-review' | 'closed';
  tags: string[];
}

export function ProjectsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [appliedProjects, setAppliedProjects] = useState<string[]>([]);
  const [showAnimations, setShowAnimations] = useState(true);

  // Datos ficticios de proyectos
  const projects: Project[] = [
    {
      id: '1',
      title: 'E-commerce Platform con React y Node.js',
      description: 'Desarrollar una plataforma completa de comercio electrónico con funcionalidades avanzadas como carrito de compras, pagos integrados, gestión de inventario y panel de administración. Incluye integración con pasarelas de pago, optimización SEO y diseño responsive.',
      company: {
        name: 'TechCommerce SA',
        verified: true,
        rating: 4.9,
        reviewsCount: 127
      },
      budget: { min: 8000, max: 12000, type: 'fixed' },
      duration: { value: 8, unit: 'weeks' },
      location: 'Madrid, España',
      remote: true,
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Stripe API', 'AWS'],
      category: 'Desarrollo Web',
      level: 'senior',
      applicants: 15,
      maxApplicants: 25,
      postedDate: '2024-08-01',
      deadline: '2024-08-15',
      priority: 'urgent',
      featured: true,
      status: 'open',
      tags: ['Full Stack', 'E-commerce', 'Remoto', 'Alto presupuesto']
    },
    {
      id: '2',
      title: 'App Móvil para Fintech - React Native',
      description: 'Crear una aplicación móvil innovadora para servicios financieros digitales. Incluye autenticación biométrica, transferencias P2P, visualización de gastos, notificaciones push y integración con APIs bancarias. Diseño centrado en UX/UI moderna.',
      company: {
        name: 'FinTech Innovations',
        verified: true,
        rating: 4.7,
        reviewsCount: 89
      },
      budget: { min: 15000, max: 20000, type: 'fixed' },
      duration: { value: 12, unit: 'weeks' },
      location: 'Barcelona, España',
      remote: false,
      skills: ['React Native', 'TypeScript', 'Firebase', 'Biometric Auth', 'REST API'],
      category: 'Desarrollo Mobile',
      level: 'senior',
      applicants: 22,
      maxApplicants: 30,
      postedDate: '2024-08-03',
      deadline: '2024-08-20',
      priority: 'normal',
      featured: true,
      status: 'open',
      tags: ['Mobile', 'Fintech', 'Presencial', 'Innovation']
    },
    {
      id: '3',
      title: 'Dashboard de Analytics con Vue.js',
      description: 'Desarrollar un dashboard interactivo para análisis de datos empresariales con gráficos dinámicos, filtros avanzados, reportes exportables y visualizaciones en tiempo real. Integración con múltiples fuentes de datos y APIs.',
      company: {
        name: 'DataInsights Pro',
        verified: true,
        rating: 4.6,
        reviewsCount: 156
      },
      budget: { min: 5000, max: 8000, type: 'fixed' },
      duration: { value: 6, unit: 'weeks' },
      location: 'Valencia, España',
      remote: true,
      skills: ['Vue.js', 'D3.js', 'Python', 'Django', 'PostgreSQL', 'Chart.js'],
      category: 'Data Science',
      level: 'mid',
      applicants: 8,
      maxApplicants: 15,
      postedDate: '2024-08-05',
      deadline: '2024-08-25',
      priority: 'normal',
      featured: false,
      status: 'open',
      tags: ['Data Viz', 'Analytics', 'Remoto', 'Vue']
    },
    {
      id: '4',
      title: 'Sistema DevOps con Docker y Kubernetes',
      description: 'Implementar infraestructura completa de CI/CD usando Docker, Kubernetes, Jenkins y AWS. Incluye monitoreo, logging, automated testing, deployment pipelines y configuración de ambientes de desarrollo, staging y producción.',
      company: {
        name: 'CloudTech Solutions',
        verified: true,
        rating: 4.8,
        reviewsCount: 94
      },
      budget: { min: 120, max: 150, type: 'hourly' },
      duration: { value: 10, unit: 'weeks' },
      location: 'Sevilla, España',
      remote: true,
      skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform', 'Monitoring'],
      category: 'DevOps',
      level: 'senior',
      applicants: 12,
      maxApplicants: 20,
      postedDate: '2024-08-06',
      deadline: '2024-09-01',
      priority: 'urgent',
      featured: false,
      status: 'open',
      tags: ['DevOps', 'Cloud', 'Remoto', 'Senior']
    },
    {
      id: '5',
      title: 'Chatbot IA con Natural Language Processing',
      description: 'Desarrollar un chatbot inteligente con capacidades de procesamiento de lenguaje natural para atención al cliente automatizada. Integración con OpenAI, training con datos específicos de la empresa y deployment en web y móvil.',
      company: {
        name: 'AI Customer Care',
        verified: false,
        rating: 4.4,
        reviewsCount: 34
      },
      budget: { min: 6000, max: 9000, type: 'fixed' },
      duration: { value: 8, unit: 'weeks' },
      location: 'Bilbao, España',
      remote: true,
      skills: ['Python', 'OpenAI API', 'NLP', 'FastAPI', 'React', 'Machine Learning'],
      category: 'AI/ML',
      level: 'mid',
      applicants: 18,
      maxApplicants: 25,
      postedDate: '2024-08-07',
      deadline: '2024-08-30',
      priority: 'normal',
      featured: false,
      status: 'open',
      tags: ['AI', 'Chatbot', 'Remoto', 'NLP']
    },
    {
      id: '6',
      title: 'Rediseño UX/UI para SaaS Platform',
      description: 'Redesign completo de la experiencia de usuario y interfaz para una plataforma SaaS existente. Incluye research de usuarios, wireframes, prototipos interactivos, design system y implementación en React con animaciones modernas.',
      company: {
        name: 'SaaS Design Studio',
        verified: true,
        rating: 4.9,
        reviewsCount: 76
      },
      budget: { min: 4000, max: 6500, type: 'fixed' },
      duration: { value: 5, unit: 'weeks' },
      location: 'Remoto',
      remote: true,
      skills: ['Figma', 'React', 'TypeScript', 'Framer Motion', 'UX Research', 'Design Systems'],
      category: 'UI/UX Design',
      level: 'mid',
      applicants: 25,
      maxApplicants: 35,
      postedDate: '2024-08-08',
      deadline: '2024-08-22',
      priority: 'normal',
      featured: true,
      status: 'open',
      tags: ['UX/UI', 'SaaS', 'Remoto', 'Design']
    },
    {
      id: '7',
      title: 'Blockchain DApp con Smart Contracts',
      description: 'Desarrollar una aplicación descentralizada (DApp) en Ethereum con smart contracts para un marketplace de NFTs. Incluye wallet integration, smart contract development, testing, frontend con Web3.js y deployment en testnet/mainnet.',
      company: {
        name: 'CryptoTech Ventures',
        verified: true,
        rating: 4.3,
        reviewsCount: 45
      },
      budget: { min: 10000, max: 15000, type: 'fixed' },
      duration: { value: 10, unit: 'weeks' },
      location: 'Zaragoza, España',
      remote: true,
      skills: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'Smart Contracts', 'MetaMask'],
      category: 'Blockchain',
      level: 'senior',
      applicants: 7,
      maxApplicants: 15,
      postedDate: '2024-08-09',
      deadline: '2024-09-05',
      priority: 'normal',
      featured: false,
      status: 'open',
      tags: ['Blockchain', 'NFT', 'Remoto', 'Web3']
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos los Proyectos', icon: Briefcase, count: projects.length },
    { id: 'Desarrollo Web', name: 'Desarrollo Web', icon: Code, count: projects.filter(p => p.category === 'Desarrollo Web').length },
    { id: 'Desarrollo Mobile', name: 'Mobile', icon: Smartphone, count: projects.filter(p => p.category === 'Desarrollo Mobile').length },
    { id: 'UI/UX Design', name: 'UI/UX Design', icon: Palette, count: projects.filter(p => p.category === 'UI/UX Design').length },
    { id: 'DevOps', name: 'DevOps', icon: Shield, count: projects.filter(p => p.category === 'DevOps').length },
    { id: 'Data Science', name: 'Data Science', icon: Database, count: projects.filter(p => p.category === 'Data Science').length },
    { id: 'AI/ML', name: 'AI/ML', icon: Brain, count: projects.filter(p => p.category === 'AI/ML').length },
    { id: 'Blockchain', name: 'Blockchain', icon: Award, count: projects.filter(p => p.category === 'Blockchain').length }
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

  const toggleFavorite = (projectId: string) => {
    setFavorites(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const applyToProject = (projectId: string) => {
    setAppliedProjects(prev => [...prev, projectId]);
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
      case 'junior': return 'bg-green-600';
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

  return (
    <div className="p-8 space-y-8">
      {/* Header con animación */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 glow-text">
              Proyectos Publicados
            </h1>
            <p className="text-gray-300">
              Descubre oportunidades perfectas para tu perfil profesional
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-4"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00FF85]">{filteredProjects.length}</div>
                <div className="text-xs text-gray-400">Proyectos activos</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Buscar proyectos por tecnología, empresa o descripción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-[#0D0D0D] border-[#333333] text-white h-12 hover-neon"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-[#0D0D0D] border-[#333333] text-white">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="text-white hover:bg-[#333333]">
                        <div className="flex items-center space-x-2">
                          <category.icon className="h-4 w-4" />
                          <span>{category.name} ({category.count})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="bg-[#0D0D0D] border-[#333333] text-white">
                    <SelectValue placeholder="Nivel" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                    <SelectItem value="all" className="text-white">Todos los niveles</SelectItem>
                    <SelectItem value="junior" className="text-white">Junior</SelectItem>
                    <SelectItem value="mid" className="text-white">Mid-Level</SelectItem>
                    <SelectItem value="senior" className="text-white">Senior</SelectItem>
                    <SelectItem value="lead" className="text-white">Tech Lead</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="bg-[#0D0D0D] border-[#333333] text-white">
                    <SelectValue placeholder="Ubicación" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                    <SelectItem value="all" className="text-white">Todas las ubicaciones</SelectItem>
                    <SelectItem value="remoto" className="text-white">Remoto</SelectItem>
                    <SelectItem value="madrid" className="text-white">Madrid</SelectItem>
                    <SelectItem value="barcelona" className="text-white">Barcelona</SelectItem>
                    <SelectItem value="valencia" className="text-white">Valencia</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-[#0D0D0D] border-[#333333] text-white">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                    <SelectItem value="newest" className="text-white">Más reciente</SelectItem>
                    <SelectItem value="budget-high" className="text-white">Mayor presupuesto</SelectItem>
                    <SelectItem value="budget-low" className="text-white">Menor presupuesto</SelectItem>
                    <SelectItem value="deadline" className="text-white">Próximo deadline</SelectItem>
                    <SelectItem value="applicants" className="text-white">Menos competencia</SelectItem>
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
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  selectedCategory === category.id 
                    ? 'bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]' 
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
          {filteredProjects.map((project, index) => (
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
              <Card className={`bg-[#1A1A1A] border-[#333333] hover-neon overflow-hidden transition-all duration-300 ${
                project.featured ? 'ring-2 ring-[#00FF85]/30' : ''
              }`}>
                {/* Featured Badge */}
                {project.featured && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4 z-10"
                  >
                    <Badge className="bg-gradient-to-r from-[#00FF85] to-[#00C46A] text-[#0D0D0D] pulse-neon">
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
                        <h3 className="text-lg font-semibold text-white group-hover:text-[#00FF85] transition-colors">
                          {project.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={project.company.logo} />
                            <AvatarFallback className="bg-[#00FF85] text-[#0D0D0D] text-sm">
                              {project.company.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-white font-medium">{project.company.name}</span>
                              {project.company.verified && (
                                <Award className="h-3 w-3 text-blue-400" />
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-400">
                                {project.company.rating} ({project.company.reviewsCount})
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 ml-auto text-xs text-gray-400">
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
                        <DollarSign className="h-4 w-4 text-[#00FF85]" />
                        <span className="text-white font-medium">{getBudgetText(project.budget)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{getDurationText(project.duration)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-orange-400" />
                        <span className="text-white">{project.remote ? 'Remoto' : project.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        <span className="text-white">{project.applicants}/{project.maxApplicants} candidatos</span>
                      </div>
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div className="flex items-center justify-between">
                    <Badge className={`${getLevelColor(project.level)} text-white`}>
                      {getLevelText(project.level)}
                    </Badge>
                    
                    <div className="text-xs text-gray-400">
                      Deadline: {new Date(project.deadline).toLocaleDateString()}
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
                        <Badge variant="secondary" className="bg-[#0D0D0D] text-[#00C46A] text-xs hover:bg-[#00C46A] hover:text-[#0D0D0D] transition-colors">
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                    {project.skills.length > 4 && (
                      <Badge variant="secondary" className="bg-[#0D0D0D] text-gray-400 text-xs">
                        +{project.skills.length - 4}
                      </Badge>
                    )}
                  </div>

                  {/* Tags */}
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-[#333333]">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-[#333333] text-gray-400 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#333333]">
                    <div className="flex space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          disabled={appliedProjects.includes(project.id)}
                          onClick={() => applyToProject(project.id)}
                          className={`${
                            appliedProjects.includes(project.id)
                              ? 'bg-green-600 text-white cursor-not-allowed'
                              : 'bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]'
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
                      
                      <Button size="sm" variant="outline" className="border-[#333333] text-white hover:bg-[#333333]">
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
                          className={`p-2 ${
                            favorites.includes(project.id) 
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
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[#1A1A1A] border-[#333333] p-12">
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
                className="bg-[#333333] p-8 rounded-full mb-4 mx-auto w-24 h-24 flex items-center justify-center"
              >
                <Search className="h-12 w-12 text-gray-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">No se encontraron proyectos</h3>
              <p className="text-gray-400 mb-4">
                Ajusta tus filtros o términos de búsqueda para encontrar más oportunidades
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setSelectedLocation('all');
                }}
                className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] btn-glow"
              >
                Limpiar Filtros
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}