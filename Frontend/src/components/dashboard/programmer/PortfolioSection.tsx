import { Card, CardContent, CardHeader } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { 
  Plus, 
  ExternalLink, 
  Github, 
  Calendar,
  Eye,
  Heart,
  Edit,
  Trash2
} from "lucide-react";

export function PortfolioSection() {
  const portfolioProjects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Plataforma completa de comercio electrónico con React, Node.js y PostgreSQL. Incluye sistema de pagos, gestión de inventario y panel admin.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
      completedDate: "Dic 2023",
      client: "RetailMax",
      projectUrl: "https://retailmax-demo.com",
      githubUrl: "https://github.com/carlos/ecommerce-platform",
      views: 234,
      likes: 18,
      featured: true
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Aplicación de gestión de tareas con funciones colaborativas, notificaciones en tiempo real y sincronización cross-platform.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
      technologies: ["React Native", "Firebase", "Redux", "TypeScript"],
      completedDate: "Nov 2023",
      client: "ProductiveCorp",
      projectUrl: "https://taskapp-demo.com",
      githubUrl: "https://github.com/carlos/task-management",
      views: 189,
      likes: 24,
      featured: false
    },
    {
      id: 3,
      title: "Analytics Dashboard",
      description: "Dashboard interactivo para análisis de datos empresariales con visualizaciones en tiempo real y reportes automatizados.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      technologies: ["Vue.js", "D3.js", "Python", "FastAPI", "MongoDB"],
      completedDate: "Oct 2023",
      client: "DataInsights",
      projectUrl: "https://analytics-demo.com",
      githubUrl: "https://github.com/carlos/analytics-dashboard",
      views: 156,
      likes: 31,
      featured: true
    },
    {
      id: 4,
      title: "Real Estate Platform",
      description: "Plataforma inmobiliaria con búsqueda avanzada, tours virtuales 360° y sistema de gestión para agentes inmobiliarios.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      technologies: ["Next.js", "Three.js", "Prisma", "Vercel", "Cloudinary"],
      completedDate: "Sep 2023",
      client: "PropTech Solutions",
      projectUrl: "https://realestate-demo.com",
      githubUrl: "https://github.com/carlos/realestate-platform",
      views: 298,
      likes: 42,
      featured: false
    },
    {
      id: 5,
      title: "Fintech Mobile App",
      description: "Aplicación móvil de servicios financieros con transferencias P2P, gestión de presupuestos y análisis de gastos inteligente.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop",
      technologies: ["Flutter", "Dart", "Firebase", "Plaid API", "Biometrics"],
      completedDate: "Ago 2023",
      client: "FinanceFlow",
      projectUrl: "https://financeflow-demo.com",
      githubUrl: "https://github.com/carlos/fintech-app",
      views: 445,
      likes: 67,
      featured: true
    },
    {
      id: 6,
      title: "Learning Management System",
      description: "Sistema de gestión de aprendizaje con cursos interactivos, evaluaciones automatizadas y tracking de progreso estudiantil.",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=250&fit=crop",
      technologies: ["Angular", "NestJS", "PostgreSQL", "WebRTC", "Docker"],
      completedDate: "Jul 2023",
      client: "EduTech",
      projectUrl: "https://lms-demo.com",
      githubUrl: "https://github.com/carlos/lms-platform",
      views: 178,
      likes: 29,
      featured: false
    }
  ];

  const featuredProjects = portfolioProjects.filter(project => project.featured);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mi Portafolio</h1>
          <p className="text-gray-300">
            Showcases de mis mejores proyectos y trabajos realizados
          </p>
        </div>
        <Button className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]">
          <Plus className="h-5 w-5 mr-2" />
          Agregar Proyecto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-white">{portfolioProjects.length}</div>
            <div className="text-gray-400 text-sm">Proyectos Totales</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-white">{featuredProjects.length}</div>
            <div className="text-gray-400 text-sm">Proyectos Destacados</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-white">
              {portfolioProjects.reduce((sum, project) => sum + project.views, 0)}
            </div>
            <div className="text-gray-400 text-sm">Visualizaciones</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-white">
              {portfolioProjects.reduce((sum, project) => sum + project.likes, 0)}
            </div>
            <div className="text-gray-400 text-sm">Likes Totales</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Projects */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Proyectos Destacados</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {featuredProjects.slice(0, 2).map((project) => (
            <Card key={project.id} className="bg-[#1A1A1A] border-[#333333] hover-neon overflow-hidden">
              <div className="relative">
                <ImageWithFallback 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-[#00FF85] text-[#0D0D0D]">Destacado</Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white">{project.title}</h3>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="secondary"
                      className="bg-[#0D0D0D] text-[#00C46A] text-xs"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 4 && (
                    <Badge 
                      variant="secondary"
                      className="bg-[#0D0D0D] text-gray-400 text-xs"
                    >
                      +{project.technologies.length - 4}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {project.completedDate}
                  </span>
                  <span>Cliente: {project.client}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {project.views}
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {project.likes}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-[#333333] text-white hover:bg-[#333333]">
                      <Github className="h-4 w-4 mr-1" />
                      Código
                    </Button>
                    <Button size="sm" className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ver Demo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Projects */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Todos los Proyectos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioProjects.map((project) => (
            <Card key={project.id} className="bg-[#1A1A1A] border-[#333333] hover-neon overflow-hidden">
              <div className="relative">
                <ImageWithFallback 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-40 object-cover"
                />
                {project.featured && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-[#00FF85] text-[#0D0D0D] text-xs">★</Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-white">{project.title}</h3>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-400 p-1">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="secondary"
                      className="bg-[#0D0D0D] text-[#00C46A] text-xs"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge 
                      variant="secondary"
                      className="bg-[#0D0D0D] text-gray-400 text-xs"
                    >
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span>{project.completedDate}</span>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {project.views}
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {project.likes}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1 border-[#333333] text-white hover:bg-[#333333] text-xs">
                    <Github className="h-3 w-3 mr-1" />
                    Código
                  </Button>
                  <Button size="sm" className="flex-1 bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}