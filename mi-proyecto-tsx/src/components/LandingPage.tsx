import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Search, 
  UserCheck, 
  DollarSign, 
  Code, 
  Star,
  CheckCircle,
  ArrowRight,
  Users,
  Briefcase
} from "lucide-react";

interface LandingPageProps {
  onNavigate?: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Conecta con el
              <span className="text-[#00FF85] glow-text"> Mejor Talento</span>
              <br />
              en Desarrollo
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              La plataforma que une a programadores excepcionales con empresas innovadoras. 
              Más que un empleo, construye una red de código que transformará tu carrera.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => handleNavClick('register')}
                className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] px-8 py-3 text-lg hover-neon"
              >
                Empezar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => handleNavClick('for-companies')}
                className="border-[#00FF85] text-[#00FF85] hover:bg-[#00FF85] hover:text-[#0D0D0D] px-8 py-3 text-lg"
              >
                Soy una Empresa
                <Briefcase className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex justify-center items-center space-x-8 text-gray-400 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00FF85]">2,500+</div>
                <div>Programadores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00FF85]">850+</div>
                <div>Empresas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00FF85]">5,200+</div>
                <div>Proyectos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">¿Cómo Funciona?</h2>
            <p className="text-xl text-gray-300">Tres simples pasos para conectar talento con oportunidades</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8 text-center">
                <div className="bg-[#00FF85] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="h-8 w-8 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">1. Crea tu Perfil</h3>
                <p className="text-gray-300">
                  Registra tu perfil como programador o empresa. Destaca tus habilidades 
                  técnicas y proyectos realizados.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8 text-center">
                <div className="bg-[#00FF85] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">2. Explora Oportunidades</h3>
                <p className="text-gray-300">
                  Descubre proyectos que coincidan con tu stack tecnológico o 
                  encuentra el programador perfecto para tu empresa.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-8 text-center">
                <div className="bg-[#00FF85] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="h-8 w-8 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">3. Conecta y Colabora</h3>
                <p className="text-gray-300">
                  Inicia conversaciones, negocia términos y comienza a trabajar 
                  en proyectos que impulsen tu carrera.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* For Programmers */}
            <div>
              <div className="flex items-center mb-6">
                <Code className="h-8 w-8 text-[#00FF85] mr-3" />
                <h2 className="text-3xl font-bold text-white">Para Programadores</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-[#00FF85] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Proyectos de Calidad</h3>
                    <p className="text-gray-300">Accede a proyectos desafiantes de empresas verificadas que valoran el talento técnico.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-[#00FF85] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Pagos Seguros</h3>
                    <p className="text-gray-300">Sistema de pagos protegido con garantía de cobro por proyectos completados.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-[#00FF85] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Crecimiento Profesional</h3>
                    <p className="text-gray-300">Construye tu reputación y expande tu red de contactos en la industria tech.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Companies */}
            <div>
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-[#00FF85] mr-3" />
                <h2 className="text-3xl font-bold text-white">Para Empresas</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-[#00FF85] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Talento Verificado</h3>
                    <p className="text-gray-300">Programadores con perfiles verificados y portafolios validados por la comunidad.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-[#00FF85] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Contratación Ágil</h3>
                    <p className="text-gray-300">Encuentra y contrata desarrolladores en tiempo récord con nuestro sistema de matching.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-[#00FF85] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Escalabilidad</h3>
                    <p className="text-gray-300">Desde freelancers para proyectos puntuales hasta equipos completos de desarrollo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Lo que Dicen Nuestros Usuarios</h2>
            <p className="text-xl text-gray-300">Historias reales de éxito en nuestra plataforma</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-[#00FF85] fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  "Encontré proyectos increíbles que me han permitido crecer como desarrollador. 
                  La calidad de las empresas en Programmers es excepcional."
                </p>
                <div className="flex items-center">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
                    alt="Ana García"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="text-white font-semibold">Ana García</div>
                    <div className="text-gray-400">Full Stack Developer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-[#00FF85] fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  "Como startup, necesitábamos movernos rápido. En Programmers encontramos 
                  desarrolladores senior en menos de una semana."
                </p>
                <div className="flex items-center">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
                    alt="Carlos Ruiz"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="text-white font-semibold">Carlos Ruiz</div>
                    <div className="text-gray-400">CTO, InnovateTech</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0D0D0D] border-[#333333] hover-neon">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-[#00FF85] fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  "La plataforma me ha conectado con clientes internacionales. 
                  Ahora trabajo en proyectos que realmente me apasionan."
                </p>
                <div className="flex items-center">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=faces"
                    alt="María López"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="text-white font-semibold">María López</div>
                    <div className="text-gray-400">Frontend Specialist</div>
                  </div>
                </div>
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
                ¿Listo para Transformar tu Carrera?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Únete a miles de programadores y empresas que ya están construyendo 
                el futuro del desarrollo de software.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => handleNavClick('register')}
                  className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] px-8 py-3 text-lg hover-neon"
                >
                  Crear Cuenta Gratis
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