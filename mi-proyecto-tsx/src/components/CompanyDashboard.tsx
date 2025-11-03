import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { WelcomeSection } from './dashboard/company/WelcomeSection';
import { PublishProjectSection } from './dashboard/company/PublishProjectSection';
import { SearchProgrammersSection } from './dashboard/company/SearchProgrammersSection';
import { MyProjectsSection } from './dashboard/company/MyProjectsSection';
import { ChatSection } from './dashboard/ChatSection';
import { useSweetAlert } from './ui/sweet-alert';

interface CompanyDashboardProps {
  onLogout?: () => void;
}

export function CompanyDashboard({ onLogout }: CompanyDashboardProps) {
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
      case 'my-projects':
        return <MyProjectsSection onSectionChange={setCurrentSection} />;
      case 'publish-project':
        return <PublishProjectSection />;
      case 'search-programmers':
        return <SearchProgrammersSection />;
      case 'chat':
        return <ChatSection userType="company" />;
      default:
        return <WelcomeSection onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0D0D0D]">
      <Sidebar 
        userType="company"
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