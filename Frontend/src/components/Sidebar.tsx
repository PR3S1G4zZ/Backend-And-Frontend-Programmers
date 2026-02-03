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
  X
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
    { id: 'portfolio', label: 'Mi Portafolio', icon: FolderOpen },
    { id: 'projects', label: 'Proyectos Publicados', icon: Search },
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'chat', label: 'Chat', icon: MessageSquare }
  ];

  const companySections = [
    { id: 'welcome', label: 'Dashboard', icon: Home },
    { id: 'my-projects', label: 'Mis Proyectos', icon: FolderOpen },
    { id: 'publish-project', label: 'Publicar Proyecto', icon: Plus },
    { id: 'search-programmers', label: 'Buscar Programadores', icon: Search },
    { id: 'chat', label: 'Chat', icon: MessageSquare }
  ];

  const adminSections = [
    { id: 'dashboard', label: 'Dashboard Admin', icon: Home },
    { id: 'users', label: 'Gestión de Usuarios', icon: User },
    { id: 'projects', label: 'Todos los Proyectos', icon: FolderOpen },
    { id: 'analytics', label: 'Analíticas', icon: Search },
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
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col border-r border-[#333333] bg-[#1A1A1A] transition-transform duration-200 md:static md:h-screen md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
      {/* Logo */}
      <div className="p-6 border-b border-[#333333]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
          <div className="bg-[#00FF85] p-2 rounded-lg">
            <Code className="h-5 w-5 text-[#0D0D0D]" />
          </div>
          <span className="text-lg font-bold text-[#00FF85] glow-text">Programmers</span>
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
      <div className="p-6 border-b border-[#333333]">
        <div className="flex items-center space-x-3">
          {userType === 'programmer' ? (
            <>
              <User className="h-8 w-8 text-[#00FF85]" />
              <div>
                <div className="text-white font-semibold">{displayName}</div>
                <div className="text-gray-400 text-sm">{displaySubtitle}</div>
              </div>
            </>
          ) : (
            <>
              <Building2 className="h-8 w-8 text-[#00FF85]" />
              <div>
                <div className="text-white font-semibold">{displayName}</div>
                <div className="text-gray-400 text-sm">{displaySubtitle}</div>
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
                className={`w-full justify-start ${
                  currentSection === section.id
                    ? 'bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]'
                    : 'text-white hover:bg-[#333333] hover:text-white'
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
      <div className="p-4 border-t border-[#333333] space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:bg-[#333333] hover:text-white"
        >
          <Settings className="h-5 w-5 mr-3" />
          Configuración
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:bg-[#333333] hover:text-white"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
    </>
  );
}
