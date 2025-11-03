import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { WelcomeSection } from './dashboard/programmer/WelcomeSection';
import { PortfolioSection } from './dashboard/programmer/PortfolioSection';
import { ProjectsSection } from './dashboard/programmer/ProjectsSection';
import { ProfileSection } from './dashboard/programmer/ProfileSection';
import { ChatSection } from './dashboard/ChatSection';
import { useSweetAlert } from './ui/sweet-alert';

interface ProgrammerDashboardProps {
  onLogout?: () => void;
}

export function ProgrammerDashboard({ onLogout }: ProgrammerDashboardProps) {
  const [currentSection, setCurrentSection] = useState('welcome');
  const { showAlert, Alert } = useSweetAlert();

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
      />
      <div className="flex-1 overflow-auto">
        {renderSection()}
      </div>
      <Alert />
    </div>
  );
}