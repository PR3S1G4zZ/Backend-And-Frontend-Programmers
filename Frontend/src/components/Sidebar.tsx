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
  Home
} from "lucide-react";

interface SidebarProps {
  userType: 'programmer' | 'company';
  currentSection: string;
  onSectionChange: (section: string) => void;
  onLogout?: () => void;
}

export function Sidebar({ userType, currentSection, onSectionChange, onLogout }: SidebarProps) {
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

  const sections = userType === 'programmer' ? programmerSections : companySections;

  return (
    <div className="w-64 bg-[#1A1A1A] border-r border-[#333333] h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#333333]">
        <div className="flex items-center space-x-2">
          <div className="bg-[#00FF85] p-2 rounded-lg">
            <Code className="h-5 w-5 text-[#0D0D0D]" />
          </div>
          <span className="text-lg font-bold text-[#00FF85] glow-text">Programmers</span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-[#333333]">
        <div className="flex items-center space-x-3">
          {userType === 'programmer' ? (
            <>
              <User className="h-8 w-8 text-[#00FF85]" />
              <div>
                <div className="text-white font-semibold">Carlos Mendoza</div>
                <div className="text-gray-400 text-sm">Full Stack Developer</div>
              </div>
            </>
          ) : (
            <>
              <Building2 className="h-8 w-8 text-[#00FF85]" />
              <div>
                <div className="text-white font-semibold">TechCorp SA</div>
                <div className="text-gray-400 text-sm">Empresa Tecnológica</div>
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
                onClick={() => onSectionChange(section.id)}
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
  );
}