import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Building2,
  Globe
} from "lucide-react";

interface ContactPageProps {
  onNavigate?: (page: string) => void;
}

export function ContactPage({ onNavigate: _onNavigate }: ContactPageProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de envío de formulario
    alert("¡Mensaje enviado! Nos pondremos en contacto contigo pronto.");
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 code-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Hablemos de tu
            <span className="text-[#00FF85] glow-text"> Próximo Proyecto</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            ¿Tienes una idea innovadora? ¿Necesitas escalar tu equipo de desarrollo? 
            Estamos aquí para ayudarte a hacer realidad tus proyectos tech.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center">
                    <MessageSquare className="h-6 w-6 text-[#00FF85] mr-3" />
                    Envíanos un Mensaje
                  </CardTitle>
                  <p className="text-gray-300">
                    Completa el formulario y nuestro equipo se pondrá en contacto contigo 
                    en menos de 24 horas.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white mb-2">Nombre Completo *</label>
                        <Input 
                          type="text"
                          placeholder="Tu nombre"
                          required
                          className="bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85]"
                        />
                      </div>
                      <div>
                        <label className="block text-white mb-2">Email *</label>
                        <Input 
                          type="email"
                          placeholder="tu@email.com"
                          required
                          className="bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85]"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white mb-2">Empresa</label>
                        <Input 
                          type="text"
                          placeholder="Nombre de tu empresa"
                          className="bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85]"
                        />
                      </div>
                      <div>
                        <label className="block text-white mb-2">Teléfono</label>
                        <Input 
                          type="tel"
                          placeholder="+34 600 123 456"
                          className="bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white mb-2">Tipo de Proyecto</label>
                      <select className="w-full p-3 bg-[#0D0D0D] border border-[#333333] rounded-lg text-white focus:border-[#00FF85] focus:outline-none">
                        <option value="">Selecciona el tipo de proyecto</option>
                        <option value="web-app">Aplicación Web</option>
                        <option value="mobile-app">Aplicación Móvil</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="saas">SaaS Platform</option>
                        <option value="api">API Development</option>
                        <option value="consulting">Consultoría Técnica</option>
                        <option value="team-augmentation">Aumento de Equipo</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white mb-2">Presupuesto Estimado</label>
                      <select className="w-full p-3 bg-[#0D0D0D] border border-[#333333] rounded-lg text-white focus:border-[#00FF85] focus:outline-none">
                        <option value="">Selecciona tu rango de presupuesto</option>
                        <option value="5k-15k">€5,000 - €15,000</option>
                        <option value="15k-50k">€15,000 - €50,000</option>
                        <option value="50k-100k">€50,000 - €100,000</option>
                        <option value="100k+">€100,000+</option>
                        <option value="discuss">Prefiero discutirlo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white mb-2">Mensaje *</label>
                      <Textarea 
                        placeholder="Cuéntanos sobre tu proyecto, objetivos, tecnologías requeridas y cualquier detalle relevante..."
                        required
                        rows={6}
                        className="bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85] resize-none"
                      />
                    </div>

                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] hover-neon"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Enviar Mensaje
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Contact Details */}
              <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#00FF85] p-2 rounded-lg flex-shrink-0">
                      <Mail className="h-5 w-5 text-[#0D0D0D]" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Email</h4>
                      <p className="text-gray-300">hola@programmers.dev</p>
                      <p className="text-gray-400 text-sm">Respuesta en 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#00FF85] p-2 rounded-lg flex-shrink-0">
                      <Phone className="h-5 w-5 text-[#0D0D0D]" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Teléfono</h4>
                      <p className="text-gray-300">+34 900 123 456</p>
                      <p className="text-gray-400 text-sm">Lun-Vie 9:00-18:00 CET</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#00FF85] p-2 rounded-lg flex-shrink-0">
                      <MapPin className="h-5 w-5 text-[#0D0D0D]" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Oficina Principal</h4>
                      <p className="text-gray-300">Calle de la Innovación 42</p>
                      <p className="text-gray-300">28001 Madrid, España</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#00FF85] p-2 rounded-lg flex-shrink-0">
                      <Globe className="h-5 w-5 text-[#0D0D0D]" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Cobertura Global</h4>
                      <p className="text-gray-300">España, LATAM, Europa</p>
                      <p className="text-gray-400 text-sm">Equipos distribuidos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Clock className="h-5 w-5 text-[#00FF85] mr-2" />
                    Horarios de Atención
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Lunes - Viernes</span>
                    <span className="text-white">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sábados</span>
                    <span className="text-white">10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Domingos</span>
                    <span className="text-gray-400">Cerrado</span>
                  </div>
                  <div className="mt-4 p-3 bg-[#0D0D0D] rounded-lg">
                    <p className="text-[#00C46A] text-sm">
                      ⚡ Chat 24/7 disponible para clientes activos
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sales Contact */}
              <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Building2 className="h-5 w-5 text-[#00FF85] mr-2" />
                    Ventas Empresariales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    ¿Proyecto enterprise? ¿Necesitas un equipo completo? 
                    Habla directamente con nuestro equipo de ventas.
                  </p>
                  <Button 
                    className="w-full bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]"
                  >
                    Contactar Ventas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Illustrated) */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Nuestra Ubicación</h2>
            <p className="text-xl text-gray-300">Encuéntranos en el corazón de Madrid Tech</p>
          </div>

          <Card className="bg-[#0D0D0D] border-[#333333] overflow-hidden">
            <CardContent className="p-0">
              {/* Illustrated Map */}
              <div className="relative h-96 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center">
                <div className="absolute inset-0 binary-pattern opacity-5"></div>
                
                {/* Map Illustration */}
                <div className="relative z-10 text-center">
                  <div className="bg-[#00FF85] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <MapPin className="h-10 w-10 text-[#0D0D0D]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Programmers HQ</h3>
                  <p className="text-[#00FF85] mb-4">Calle de la Innovación 42, Madrid</p>
                  
                  {/* Simplified map grid */}
                  <div className="grid grid-cols-3 gap-2 mx-auto w-40 h-40 opacity-30">
                    {[...Array(9)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`border border-[#333333] ${i === 4 ? 'bg-[#00FF85]' : 'bg-[#1A1A1A]'}`}
                      ></div>
                    ))}
                  </div>
                  
                  <p className="text-gray-400 text-sm mt-4">
                    Metro: Sol (Líneas 1, 2, 3) • Parking disponible
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-[#00FF85] rounded-full animate-ping"></div>
                <div className="absolute bottom-8 right-8 w-3 h-3 bg-[#00C46A] rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-[#00FF85] rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
            <p className="text-xl text-gray-300">Respuestas a las dudas más comunes</p>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-3">¿Cuánto tiempo toma encontrar desarrolladores?</h3>
                <p className="text-gray-300">
                  Típicamente recibes las primeras propuestas en 24-48 horas. Para proyectos más específicos 
                  o equipos grandes, puede tomar hasta una semana.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-3">¿Cómo garantizan la calidad de los programadores?</h3>
                <p className="text-gray-300">
                  Todos los desarrolladores pasan por un proceso de verificación técnica, revisión de portafolio 
                  y validación de referencias. Solo el 3% de los aplicantes son aceptados.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-3">¿Qué pasa si el proyecto no sale como esperaba?</h3>
                <p className="text-gray-300">
                  Nuestro sistema de pagos por hitos protege tu inversión. Además, ofrecemos mediación gratuita 
                  y garantía de satisfacción en todos los proyectos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}