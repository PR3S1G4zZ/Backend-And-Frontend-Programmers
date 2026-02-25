import { Button } from "./ui/button";
import {
  Code,
  User,
  FolderOpen,
  Search,
  MessageSquare,
  Plus,
  Building2,
  Settings,
  LogOut,
  Home,
  X,
  Wallet,
  BarChart3
} from "lucide-react";
import type { User as AuthUser } from "../services/authService";

interface SidebarProps {
  userType: 'programmer' | 'company' | 'admin';
  currentSection: string;
  onSectionChange: (section: string) => void;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  user?: AuthUser | null;
}

export function Sidebar({
  userType,
  currentSection,
  onSectionChange,
  onLogout,
  isOpen = false,
  onClose,
  user,
}: SidebarProps) {
  const programmerSections = [
    { id: 'welcome', label: 'Mi Espacio', icon: Home },
    { id: 'projects-active', label: 'Proyectos Activos', icon: Code },
    { id: 'portfolio', label: 'Mi Portafolio', icon: FolderOpen },
    { id: 'projects', label: 'Proyectos Publicados', icon: Search },
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'wallet', label: 'Billetera & Cobros', icon: Wallet },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const companySections = [
    { id: 'welcome', label: 'Dashboard', icon: Home },
    { id: 'my-projects', label: 'Mis Proyectos', icon: FolderOpen },
    { id: 'publish-project', label: 'Publicar Proyecto', icon: Plus },
    { id: 'search-programmers', label: 'Buscar Programadores', icon: Search },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'wallet', label: 'Billetera & Pagos', icon: Wallet },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const adminSections = [
    { id: 'dashboard', label: 'Dashboard Admin', icon: Home },
    { id: 'users', label: 'Gestión de Usuarios', icon: User },
    { id: 'projects', label: 'Todos los Proyectos', icon: FolderOpen },
    { id: 'analytics', label: 'Analíticas', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const sections = userType === 'programmer' ? programmerSections : userType === 'admin' ? adminSections : companySections;
  const displayName = user ? `${user.name} ${user.lastname}`.trim() : 'Usuario';
  const displaySubtitle =
    userType === 'admin'
      ? 'Administrador'
      : userType === 'company'
        ? 'Cuenta Empresa'
        : 'Desarrollador';

  const handleSectionChange = (sectionId: string) => {
    onSectionChange(sectionId);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar sidebar"
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 md:static md:h-screen md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-sidebar-primary p-2 rounded-lg">
                <Code className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-sidebar-primary glow-text">Programmers</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white md:hidden"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            {userType === 'programmer' ? (
              <>
                <User className="h-8 w-8 text-sidebar-primary" />
                <div>
                  <div className="text-sidebar-foreground font-semibold">{displayName}</div>
                  <div className="text-sidebar-foreground/70 text-sm">{displaySubtitle}</div>
                </div>
              </>
            ) : (
              <>
                <Building2 className="h-8 w-8 text-sidebar-primary" />
                <div>
                  <div className="text-sidebar-foreground font-semibold">{displayName}</div>
                  <div className="text-sidebar-foreground/70 text-sm">{displaySubtitle}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={currentSection === section.id ? "default" : "ghost"}
                  className={`w-full justify-start ${currentSection === section.id
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                  onClick={() => handleSectionChange(section.id)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {section.label}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => {
              if (onClose) onClose();
              if (onLogout) onLogout();
            }}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </>
  );
}
