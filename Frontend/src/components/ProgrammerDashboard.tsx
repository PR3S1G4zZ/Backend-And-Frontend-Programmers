import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { WelcomeSection } from './dashboard/programmer/WelcomeSection';
import { PortfolioSection } from './dashboard/programmer/PortfolioSection';
import { ProjectsSection } from './dashboard/programmer/ProjectsSection';
import { ProfileSection } from './dashboard/programmer/ProfileSection';
import { ChatSection } from './dashboard/ChatSection';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import { WalletPaymentMethods } from './dashboard/wallet/WalletPaymentMethods';
import { MyActiveProjectsSection } from './dashboard/programmer/MyActiveProjectsSection';
import { Workspace } from './dashboard/shared/Workspace';
import type { ProjectResponse } from '../services/projectService';

interface ProgrammerDashboardProps {
  onLogout?: () => void;
}

export function ProgrammerDashboard({ onLogout }: ProgrammerDashboardProps) {
  const [currentSection, setCurrentSection] = useState('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [viewingWorkspace, setViewingWorkspace] = useState<ProjectResponse | null>(null);
  const { user } = useAuth();

  const sectionLabels: Record<string, string> = {
    welcome: 'Mi Espacio',
    portfolio: 'Mi Portafolio',
    projects: 'Proyectos Publicados',
    profile: 'Mi Perfil',
    chat: 'Chat',
    wallet: 'Billetera & Cobros',
    settings: 'Configuración',
  };

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
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
      case 'settings':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Configuración</h2>
            <div className="max-w-4xl">
              <p className="text-gray-400">La configuración de cobros se ha movido a la sección de Billetera.</p>
            </div>
          </div>
        );
      case 'wallet':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Billetera & Cobros</h2>
            <div className="max-w-6xl space-y-8">
              <WalletPaymentMethods userType="programmer" />
            </div>
          </div>
        );
      case 'projects-active':
        return <MyActiveProjectsSection onWorkspaceSelect={(p) => {
          setViewingWorkspace(p);
          setCurrentSection('workspace');
        }} />;
      case 'workspace':
        return viewingWorkspace ? (
          <Workspace
            projectId={Number(viewingWorkspace.id)}
            userType="programmer"
            onBack={() => {
              setViewingWorkspace(null);
              setCurrentSection('projects-active');
            }}
          />
        ) : <MyActiveProjectsSection onWorkspaceSelect={(p) => {
          setViewingWorkspace(p);
          setCurrentSection('workspace');
        }} />;
      default:
        return <WelcomeSection onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
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
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background px-4 py-3 md:hidden">
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
      <ConfirmDialog
        cancelText="Cancelar"
        confirmText="Sí, cerrar sesión"
        description="¿Estás seguro de que quieres cerrar tu sesión?"
        isOpen={isLogoutDialogOpen}
        onCancel={() => setIsLogoutDialogOpen(false)}
        onConfirm={() => {
          setIsLogoutDialogOpen(false);
          onLogout?.();
        }}
        title="¿Cerrar Sesión?"
      />
    </div>
  );
}
