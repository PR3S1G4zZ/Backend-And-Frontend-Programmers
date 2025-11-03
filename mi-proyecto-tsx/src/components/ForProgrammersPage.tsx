import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Code, 
  Star, 
  DollarSign, 
  Clock, 
  Shield, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface ForProgrammersPageProps {
  onNavigate?: (page: string) => void;
}

export function ForProgrammersPage({ onNavigate }: ForProgrammersPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProfiles = [
    {
      id: 1,
      name: "Elena Rodríguez",
      specialty: "Full Stack Developer",
      rating: 4.9,
      projects: 127,
      hourlyRate: "$85/hr",
      technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=faces",
      description: "Especialista en aplicaciones web escalables con 8 años de experiencia."
    },
    {
      id: 2,
      name: "Diego Martínez",
      specialty: "Mobile Developer",
      rating: 4.8,
      projects: 89,
      hourlyRate: "$75/hr",
      technologies: ["React Native", "Flutter", "iOS", "Android"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
      description: "Creador de apps móviles con más de 2M de descargas en App Store."
    },
    {
      id: 3,
      name: "Sofia Chen",
      specialty: "DevOps Engineer",
      rating: 5.0,
      projects: 156,
      hourlyRate: "$95/hr",
      technologies: ["Docker", "Kubernetes", "AWS", "Terraform"],
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
      description: "Experta en automatización e infraestructura cloud para startups y enterprise."
    },
    {
      id: 4,
      name: "Miguel Torres",
      specialty: "Data Scientist",
      rating: 4.9,
      projects: 73,
      hourlyRate: "$90/hr",
      technologies: ["Python", "TensorFlow", "Azure", "R"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
      description: "Científico de datos con PhD enfocado en machine learning y AI."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProfiles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProfiles.length) % featuredProfiles.length);
  };

  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 code-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                Tu Carrera de
                <span className="text-[#00FF85] glow-text"> Programador</span>
                <br />
                Sin Límites
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Accede a proyectos premium, construye tu reputación y conecta con las mejores 
                empresas tech del mundo. Tu código merece las mejores oportunidades.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => handleNavClick('register')}
                  className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] px-8 py-3 text-lg hover-neon"
                >
                  Crear Perfil Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-[#00FF85] text-[#00FF85] hover:bg-[#00FF85] hover:text-[#0D0D0D] px-8 py-3 text-lg"
                >
                  Ver Proyectos
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-8 w-8 text-[#00FF85] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">$85K</div>
                    <div className="text-gray-400">Promedio anual</div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-[#00FF85] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">Remote</div>
                    <div className="text-gray-400">100% flexibilidad</div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4 mt-8">
                <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-[#00FF85] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">+40%</div>
                    <div className="text-gray-400">Crecimiento salarial</div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-8 w-8 text-[#00FF85] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-gray-400">Pagos seguros</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">¿Por qué Elegir Programmers?</h2>
            <p className="text-xl text-gray-300">Ventajas exclusivas para programadores ambiciosos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8">
                <div className="bg-[#00FF85] w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <Star className="h-6 w-6 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Proyectos Premium</h3>
                <p className="text-gray-300">
                  Accede a proyectos de alta calidad de empresas verificadas. Solo trabajas con 
                  clientes serios que valoran tu talento.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8">
                <div className="bg-[#00FF85] w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <DollarSign className="h-6 w-6 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Tarifas Competitivas</h3>
                <p className="text-gray-300">
                  Establece tus propias tarifas y recibe el 95% de lo que cobras. Sin comisiones 
                  ocultas ni sorpresas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8">
                <div className="bg-[#00FF85] w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Pagos Garantizados</h3>
                <p className="text-gray-300">
                  Sistema de escrow que protege tus pagos. Recibe tu dinero automáticamente 
                  al completar los hitos del proyecto.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8">
                <div className="bg-[#00FF85] w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Crecimiento Profesional</h3>
                <p className="text-gray-300">
                  Construye tu reputación con nuestro sistema de ratings y reviews. 
                  Mejores proyectos = mejores tarifas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8">
                <div className="bg-[#00FF85] w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <Code className="h-6 w-6 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Tecnologías Modernas</h3>
                <p className="text-gray-300">
                  Proyectos con las últimas tecnologías. Mantente actualizado y expande 
                  tu stack técnico constantemente.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8">
                <div className="bg-[#00FF85] w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Flexibilidad Total</h3>
                <p className="text-gray-300">
                  Trabaja cuando quieras, desde donde quieras. Full-time, part-time o por 
                  proyectos específicos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Profiles Carousel */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Programadores Destacados</h2>
            <p className="text-xl text-gray-300">Conoce a algunos de nuestros top performers</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredProfiles.map((profile) => (
                  <div key={profile.id} className="w-full flex-shrink-0 px-4">
                    <Card className="bg-[#1A1A1A] border-[#333333] hover-neon max-w-2xl mx-auto">
                      <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                          <ImageWithFallback 
                            src={profile.image}
                            alt={profile.name}
                            className="w-24 h-24 rounded-full"
                          />
                          
                          <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2">{profile.name}</h3>
                            <p className="text-[#00FF85] mb-3">{profile.specialty}</p>
                            <p className="text-gray-300 mb-4">{profile.description}</p>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                              {profile.technologies.map((tech) => (
                                <Badge 
                                  key={tech} 
                                  variant="secondary"
                                  className="bg-[#0D0D0D] text-[#00FF85] border-[#00FF85]"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start text-sm text-gray-300">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-[#00FF85] mr-1" />
                                <span>{profile.rating} rating</span>
                              </div>
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-[#00FF85] mr-1" />
                                <span>{profile.projects} proyectos</span>
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-[#00FF85] mr-1" />
                                <span>{profile.hourlyRate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#1A1A1A] border border-[#333333] rounded-full p-3 text-white hover:bg-[#333333] transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#1A1A1A] border border-[#333333] rounded-full p-3 text-white hover:bg-[#333333] transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {featuredProfiles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-[#00FF85]' : 'bg-[#333333]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 binary-pattern opacity-5"></div>
            <div className="relative bg-[#0D0D0D] rounded-2xl p-12 border border-[#333333] hover-neon">
              <h2 className="text-4xl font-bold text-white mb-6">
                ¿Listo para Llevar tu Carrera al Siguiente Nivel?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Únete a más de 2,500 programadores que ya están construyendo su futuro en Programmers.
                Tu próximo gran proyecto te está esperando.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => handleNavClick('register')}
                  className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] px-8 py-3 text-lg hover-neon"
                >
                  Crear Perfil Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-[#00FF85] text-[#00FF85] hover:bg-[#00FF85] hover:text-[#0D0D0D] px-8 py-3 text-lg"
                >
                  Explorar Proyectos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}