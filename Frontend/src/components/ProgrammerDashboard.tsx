import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { WelcomeSection } from './dashboard/programmer/WelcomeSection';
import { PortfolioSection } from './dashboard/programmer/PortfolioSection';
import { ProjectsSection } from './dashboard/programmer/ProjectsSection';
import { ProfileSection } from './dashboard/programmer/ProfileSection';
import { ChatSection } from './dashboard/ChatSection';
import { useSweetAlert } from './ui/sweet-alert';
import { useAuth } from '../contexts/AuthContext';

interface ProgrammerDashboardProps {
  onLogout?: () => void;
}

export function ProgrammerDashboard({ onLogout }: ProgrammerDashboardProps) {
  const [currentSection, setCurrentSection] = useState('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { showAlert, Alert } = useSweetAlert();
  const { user } = useAuth();

  const sectionLabels: Record<string, string> = {
    welcome: 'Mi Espacio',
    portfolio: 'Mi Portafolio',
    projects: 'Proyectos Publicados',
    profile: 'Mi Perfil',
    chat: 'Chat',
  };

  const handleLogout = () => {
    showAlert({
      title: '¿Cerrar Sesión?',
      text: '¿Estás seguro de que quieres cerrar tu sesión?',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      onConfirm: () => {
        if (onLogout) {
          onLogout();
        }
      }
    });
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'welcome':
        return <WelcomeSection onSectionChange={setCurrentSection} />;
      case 'portfolio':
        return <PortfolioSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'profile':
        return <ProfileSection />;
      case 'chat':
        return <ChatSection userType="programmer" />;
      default:
        return <WelcomeSection onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0D0D0D]">
      <Sidebar 
        userType="programmer"
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
      />
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#333333] bg-[#0D0D0D] px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-md border border-[#333333] p-2 text-white hover:bg-[#1A1A1A]"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-sm text-gray-400">Panel de desarrollador</p>
            <p className="text-base font-semibold text-white">{sectionLabels[currentSection] || 'Mi Espacio'}</p>
          </div>
        </div>
        {renderSection()}
      </div>
      <Alert />
    </div>
  );
}
