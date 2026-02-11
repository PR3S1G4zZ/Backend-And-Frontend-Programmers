import { useState } from "react";
import { Button } from "./ui/button";
import { Code, Menu, User, Building2, X } from "lucide-react";

interface NavbarProps {
  userType?: "guest" | "programmer" | "company" | "admin";
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function Navbar({
  userType = "guest",
  currentPage = "home",
  onNavigate,
  onLogout,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page: string) => {
    onNavigate?.(page);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    // Si hay handler real de logout, úsalo.
    // Si no, vuelve a home como fallback.
    if (onLogout) {
      onLogout();
      setIsMobileMenuOpen(false);
      return;
    }
    handleNavClick("home");
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center space-x-2 cursor-pointer hover-neon"
            onClick={() => handleNavClick("home")}
          >
            <span className="bg-primary p-2 rounded-lg">
              <Code className="h-6 w-6 text-primary-foreground" />
            </span>
            <span className="text-2xl font-bold text-primary glow-text">
              Programmers
            </span>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {userType === "guest" && (
              <>
                <button
                  onClick={() => handleNavClick("home")}
                  className={`text-foreground hover:text-primary transition-colors ${currentPage === "home" ? "text-primary" : ""
                    }`}
                >
                  Inicio
                </button>
                <button
                  onClick={() => handleNavClick("for-programmers")}
                  className={`text-foreground hover:text-primary transition-colors ${currentPage === "for-programmers" ? "text-primary" : ""
                    }`}
                >
                  Para Programadores
                </button>
                <button
                  onClick={() => handleNavClick("for-companies")}
                  className={`text-foreground hover:text-primary transition-colors ${currentPage === "for-companies" ? "text-primary" : ""
                    }`}
                >
                  Para Empresas
                </button>
                <button
                  onClick={() => handleNavClick("contact")}
                  className={`text-foreground hover:text-primary transition-colors ${currentPage === "contact" ? "text-primary" : ""
                    }`}
                >
                  Contacto
                </button>
              </>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center space-x-4">
            {userType === "guest" ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => handleNavClick("login")}
                  className="text-foreground hover:text-primary hover:bg-accent"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => handleNavClick("register")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Registrarse
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-foreground">
                  {userType === "programmer" ? (
                    <>
                      <User className="h-5 w-5 text-primary" />
                      <span>Carlos Mendoza</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="h-5 w-5 text-primary" />
                      <span>TechCorp SA</span>
                    </>
                  )}
                </div>

                <Button
                  variant="ghost"
                  onClick={handleLogoutClick}
                  className="text-foreground hover:text-primary hover:bg-accent"
                >
                  Cerrar Sesión
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="rounded-md border border-border p-2 text-foreground hover:bg-accent"
                aria-label="Abrir menú"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"
          } border-t border-border bg-card`}
      >
        <div className="px-4 py-4 space-y-3">
          {userType === "guest" ? (
            <>
              <button
                type="button"
                onClick={() => handleNavClick("home")}
                className={`w-full text-left text-foreground ${currentPage === "home" ? "text-primary" : ""
                  }`}
              >
                Inicio
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("for-programmers")}
                className={`w-full text-left text-foreground ${currentPage === "for-programmers" ? "text-primary" : ""
                  }`}
              >
                Para Programadores
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("for-companies")}
                className={`w-full text-left text-foreground ${currentPage === "for-companies" ? "text-primary" : ""
                  }`}
              >
                Para Empresas
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("contact")}
                className={`w-full text-left text-foreground ${currentPage === "contact" ? "text-primary" : ""
                  }`}
              >
                Contacto
              </button>

              <div className="pt-3 border-t border-border space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => handleNavClick("login")}
                  className="w-full justify-start text-foreground hover:text-primary hover:bg-accent"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => handleNavClick("register")}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Registrarse
                </Button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleNavClick("home")}
                className="w-full text-left text-foreground"
              >
                Inicio
              </button>

              <Button
                variant="ghost"
                onClick={handleLogoutClick}
                className="w-full justify-start text-foreground hover:text-primary hover:bg-accent"
              >
                Cerrar Sesión
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
