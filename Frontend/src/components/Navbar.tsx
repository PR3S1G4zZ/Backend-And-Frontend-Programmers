import { Button } from "./ui/button";
import { Code, Menu, User, Building2 } from "lucide-react";

interface NavbarProps {
  userType?: 'guest' | 'programmer' | 'company' | 'admin';
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Navbar({ userType = 'guest', currentPage = 'home', onNavigate }: NavbarProps) {
  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <nav className="bg-[#1A1A1A] border-b border-[#333333] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover-neon"
            onClick={() => handleNavClick('home')}
          >
            <div className="bg-[#00FF85] p-2 rounded-lg">
              <Code className="h-6 w-6 text-[#0D0D0D]" />
            </div>
            <span className="text-2xl font-bold text-[#00FF85] glow-text">Programmers</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {userType === 'guest' && (
              <>
                <button 
                  onClick={() => handleNavClick('home')}
                  className={`text-white hover:text-[#00FF85] transition-colors ${currentPage === 'home' ? 'text-[#00FF85]' : ''}`}
                >
                  Inicio
                </button>
                <button 
                  onClick={() => handleNavClick('for-programmers')}
                  className={`text-white hover:text-[#00FF85] transition-colors ${currentPage === 'for-programmers' ? 'text-[#00FF85]' : ''}`}
                >
                  Para Programadores
                </button>
                <button 
                  onClick={() => handleNavClick('for-companies')}
                  className={`text-white hover:text-[#00FF85] transition-colors ${currentPage === 'for-companies' ? 'text-[#00FF85]' : ''}`}
                >
                  Para Empresas
                </button>
                <button 
                  onClick={() => handleNavClick('contact')}
                  className={`text-white hover:text-[#00FF85] transition-colors ${currentPage === 'contact' ? 'text-[#00FF85]' : ''}`}
                >
                  Contacto
                </button>
              </>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center space-x-4">
            {userType === 'guest' ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => handleNavClick('login')}
                  className="text-white hover:text-[#00FF85] hover:bg-[#1A1A1A]"
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  onClick={() => handleNavClick('register')}
                  className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]"
                >
                  Registrarse
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-white">
                  {userType === 'programmer' ? (
                    <>
                      <User className="h-5 w-5 text-[#00FF85]" />
                      <span>Carlos Mendoza</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="h-5 w-5 text-[#00FF85]" />
                      <span>TechCorp SA</span>
                    </>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => handleNavClick('home')}
                  className="text-white hover:text-[#00FF85] hover:bg-[#1A1A1A]"
                >
                  Cerrar Sesión
                </Button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Menu className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}