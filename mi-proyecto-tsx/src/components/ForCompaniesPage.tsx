import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Building2, 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Search,
  FileText,
  MessageSquare,
  Handshake
} from "lucide-react";

interface ForCompaniesPageProps {
  onNavigate?: (page: string) => void;
}

export function ForCompaniesPage({ onNavigate }: ForCompaniesPageProps) {
  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const featuredProgrammers = [
    {
      id: 1,
      name: "Carlos Mendoza",
      title: "Senior Full Stack Developer",
      location: "Madrid, España",
      rating: 4.9,
      reviews: 87,
      hourlyRate: "$80-120/hr",
      availability: "Disponible",
      technologies: ["React", "Node.js", "Python", "AWS", "Docker"],
      experience: "8 años",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
      specialties: ["E-commerce", "Fintech", "SaaS"]
    },
    {
      id: 2,
      name: "Ana Silva",
      title: "UI/UX Designer & Frontend Dev",
      location: "Barcelona, España",
      rating: 5.0,
      reviews: 124,
      hourlyRate: "$70-100/hr",
      availability: "Disponible",
      technologies: ["React", "Vue.js", "Figma", "TypeScript", "Tailwind"],
      experience: "6 años",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=faces",
      specialties: ["Mobile Apps", "Web Design", "Design Systems"]
    },
    {
      id: 3,
      name: "Miguel Rodriguez",
      title: "DevOps & Cloud Architect",
      location: "Ciudad de México, México",
      rating: 4.8,
      reviews: 156,
      hourlyRate: "$90-130/hr",
      availability: "Disponible en 2 semanas",
      technologies: ["AWS", "Kubernetes", "Terraform", "Jenkins", "Python"],
      experience: "10 años",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
      specialties: ["Cloud Migration", "CI/CD", "Infrastructure"]
    },
    {
      id: 4,
      name: "Sofia Chen",
      title: "Mobile App Developer",
      location: "Buenos Aires, Argentina",
      rating: 4.9,
      reviews: 93,
      hourlyRate: "$75-105/hr",
      availability: "Disponible",
      technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
      experience: "7 años",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
      specialties: ["iOS", "Android", "Cross-platform"]
    },
    {
      id: 5,
      name: "David López",
      title: "Data Engineer & ML Specialist",
      location: "Lima, Perú",
      rating: 4.9,
      reviews: 67,
      hourlyRate: "$85-115/hr",
      availability: "Disponible",
      technologies: ["Python", "TensorFlow", "Spark", "SQL", "GCP"],
      experience: "9 años",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
      specialties: ["Machine Learning", "Big Data", "Analytics"]
    },
    {
      id: 6,
      name: "Isabella Torres",
      title: "Backend Developer",
      location: "Santiago, Chile",
      rating: 4.8,
      reviews: 78,
      hourlyRate: "$70-95/hr",
      availability: "Disponible",
      technologies: ["Java", "Spring", "PostgreSQL", "Redis", "Microservices"],
      experience: "5 años",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=faces",
      specialties: ["API Development", "Microservices", "Database Design"]
    }
  ];

  const publishingSteps = [
    {
      step: 1,
      title: "Describe tu Proyecto",
      description: "Define alcance, tecnologías requeridas y presupuesto estimado",
      icon: FileText
    },
    {
      step: 2,
      title: "Encuentra Candidatos",
      description: "Recibe propuestas de programadores calificados en 24-48h",
      icon: Search
    },
    {
      step: 3,
      title: "Entrevista y Selecciona",
      description: "Evalúa candidatos a través de nuestro sistema de chat y videollamadas",
      icon: MessageSquare
    },
    {
      step: 4,
      title: "Comienza a Trabajar",
      description: "Inicia el proyecto con hitos claros y pagos protegidos",
      icon: Handshake
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 code-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                Contrata el
                <span className="text-[#00FF85] glow-text"> Mejor Talento</span>
                <br />
                Tech del Mundo
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Accede a una red curada de programadores senior, equipos de desarrollo 
                y especialistas técnicos. Desde MVPs hasta productos enterprise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => handleNavClick('register')}
                  className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] px-8 py-3 text-lg hover-neon"
                >
                  Publicar Proyecto
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-[#00FF85] text-[#00FF85] hover:bg-[#00FF85] hover:text-[#0D0D0D] px-8 py-3 text-lg"
                >
                  Explorar Talento
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-[#00FF85] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">2,500+</div>
                    <div className="text-gray-400">Desarrolladores</div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-[#00FF85] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">48h</div>
                    <div className="text-gray-400">Primera propuesta</div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4 mt-8">
                <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-[#00FF85] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">96%</div>
                    <div className="text-gray-400">Tasa de éxito</div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
                  <CardContent className="p-6 text-center">
                    <Building2 className="h-8 w-8 text-[#00FF85] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">850+</div>
                    <div className="text-gray-400">Empresas activas</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publishing Process Section */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Proceso de Publicación</h2>
            <p className="text-xl text-gray-300">Cuatro simples pasos para encontrar tu desarrollador ideal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {publishingSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className="bg-[#0D0D0D] border-[#333333] hover-neon h-full">
                  <CardContent className="p-8 text-center">
                    <div className="bg-[#00FF85] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <step.icon className="h-8 w-8 text-[#0D0D0D]" />
                    </div>
                    <div className="bg-[#00FF85] text-[#0D0D0D] rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 font-bold">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </CardContent>
                </Card>
                
                {/* Connector Line */}
                {index < publishingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#00FF85] transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programmers Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Desarrolladores Destacados</h2>
            <p className="text-xl text-gray-300">Algunos de nuestros programadores top-rated disponibles ahora</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProgrammers.map((programmer) => (
              <Card key={programmer.id} className="bg-[#1A1A1A] border-[#333333] hover-neon">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <ImageWithFallback 
                      src={programmer.image}
                      alt={programmer.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{programmer.name}</h3>
                      <p className="text-[#00FF85] mb-1">{programmer.title}</p>
                      <div className="flex items-center text-gray-400 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{programmer.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-[#00FF85] mr-1" />
                      <span className="text-white font-semibold">{programmer.rating}</span>
                      <span className="text-gray-400 text-sm ml-1">({programmer.reviews} reviews)</span>
                    </div>
                    <Badge 
                      variant={programmer.availability === "Disponible" ? "default" : "secondary"}
                      className={programmer.availability === "Disponible" 
                        ? "bg-green-600 text-white" 
                        : "bg-orange-600 text-white"}
                    >
                      {programmer.availability}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Experiencia:</span>
                      <span className="text-white">{programmer.experience}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tarifa:</span>
                      <span className="text-white">{programmer.hourlyRate}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Especialidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {programmer.specialties.map((specialty) => (
                        <Badge 
                          key={specialty} 
                          variant="outline"
                          className="text-xs border-[#00FF85] text-[#00FF85]"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-400 text-sm mb-2">Stack técnico:</p>
                    <div className="flex flex-wrap gap-1">
                      {programmer.technologies.slice(0, 4).map((tech) => (
                        <Badge 
                          key={tech} 
                          variant="secondary"
                          className="bg-[#0D0D0D] text-[#00C46A] text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {programmer.technologies.length > 4 && (
                        <Badge 
                          variant="secondary"
                          className="bg-[#0D0D0D] text-gray-400 text-xs"
                        >
                          +{programmer.technologies.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]"
                    >
                      Contratar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 border-[#00FF85] text-[#00FF85] hover:bg-[#00FF85] hover:text-[#0D0D0D]"
                    >
                      Ver Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              variant="outline"
              className="border-[#00FF85] text-[#00FF85] hover:bg-[#00FF85] hover:text-[#0D0D0D] px-8 py-3 text-lg"
            >
              Ver Todos los Desarrolladores
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">¿Por qué Elegir Programmers?</h2>
            <p className="text-xl text-gray-300">Ventajas exclusivas para empresas ambiciosas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8">
                <div className="bg-[#00FF85] w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle className="h-6 w-6 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Talento Pre-Validado</h3>
                <p className="text-gray-300">
                  Todos los programadores pasan por un riguroso proceso de validación técnica 
                  y verificación de experiencia.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8">
                <div className="bg-[#00FF85] w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Contratación Rápida</h3>
                <p className="text-gray-300">
                  Recibe las primeras propuestas en 24-48 horas. Comienza tu proyecto 
                  sin delays burocráticos.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8">
                <div className="bg-[#00FF85] w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Equipos Completos</h3>
                <p className="text-gray-300">
                  Desde freelancers especializados hasta equipos completos de desarrollo 
                  para proyectos enterprise.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8">
                <div className="bg-[#00FF85] w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">ROI Medible</h3>
                <p className="text-gray-300">
                  Tracking completo de progreso, milestones y métricas de rendimiento 
                  del equipo de desarrollo.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8">
                <div className="bg-[#00FF85] w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle className="h-6 w-6 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Pagos Protegidos</h3>
                <p className="text-gray-300">
                  Sistema de escrow que protege tu inversión. Solo pagas cuando se 
                  completan los hitos acordados.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8">
                <div className="bg-[#00FF85] w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <MessageSquare className="h-6 w-6 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Soporte 24/7</h3>
                <p className="text-gray-300">
                  Equipo de éxito del cliente disponible para resolver cualquier 
                  inconveniente durante el proyecto.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 binary-pattern opacity-5"></div>
            <div className="relative bg-[#1A1A1A] rounded-2xl p-12 border border-[#333333] hover-neon">
              <h2 className="text-4xl font-bold text-white mb-6">
                ¿Listo para Acelerar tu Desarrollo?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Únete a más de 850 empresas que confían en Programmers para sus proyectos tech.
                Desde startups hasta Fortune 500.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => handleNavClick('register')}
                  className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] px-8 py-3 text-lg hover-neon"
                >
                  Publicar Proyecto Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => handleNavClick('contact')}
                  className="border-[#00FF85] text-[#00FF85] hover:bg-[#00FF85] hover:text-[#0D0D0D] px-8 py-3 text-lg"
                >
                  Hablar con Ventas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}