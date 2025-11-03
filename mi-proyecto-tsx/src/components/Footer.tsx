import { Code, Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#333333] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Slogan */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-[#00FF85] p-2 rounded-lg">
                <Code className="h-6 w-6 text-[#0D0D0D]" />
              </div>
              <span className="text-2xl font-bold text-[#00FF85] glow-text">Programmers</span>
            </div>
            <p className="text-[#00C46A] text-lg mb-4 glow-text">
              "Más que un empleo, Una Red de Código"
            </p>
            <p className="text-gray-400 max-w-md">
              Conectamos a los mejores programadores con empresas que buscan talento excepcional. 
              Construyamos el futuro del desarrollo de software juntos.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00FF85] transition-colors">
                  Para Programadores
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00FF85] transition-colors">
                  Para Empresas
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00FF85] transition-colors">
                  Proyectos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00FF85] transition-colors">
                  Soporte
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white mb-4">Contacto</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>hola@programmers.dev</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-[#00FF85] transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00FF85] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00FF85] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#333333] mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Programmers. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}