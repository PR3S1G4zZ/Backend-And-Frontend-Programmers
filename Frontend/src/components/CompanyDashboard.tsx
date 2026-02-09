import { WalletBalance } from './dashboard/wallet/WalletBalance';
import { TransactionHistory } from './dashboard/wallet/TransactionHistory';
import { RechargeButton } from './dashboard/wallet/RechargeButton';

// ... (existing imports)
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { WelcomeSection } from './dashboard/company/WelcomeSection';
import { PublishProjectSection } from './dashboard/company/PublishProjectSection';
import { SearchProgrammersSection } from './dashboard/company/SearchProgrammersSection';
import { MyProjectsSection } from './dashboard/company/MyProjectsSection';
import { ChatSection } from './dashboard/ChatSection';
import { ProjectCandidatesSection } from './dashboard/company/ProjectCandidatesSection';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import type { ProjectResponse } from '../services/projectService';
import { PaymentMethodsSettings } from './dashboard/settings/PaymentMethodsSettings';

interface CompanyDashboardProps {
  onLogout?: () => void;
}

export function CompanyDashboard({ onLogout }: CompanyDashboardProps) {
  const [currentSection, setCurrentSection] = useState(() => {
    return localStorage.getItem('company_dashboard_section') || 'overview';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);
  const [viewingCandidates, setViewingCandidates] = useState<ProjectResponse | null>(null);
  const { user } = useAuth();

  // Persist storage and handle missing data on refresh
  useEffect(() => {
    localStorage.setItem('company_dashboard_section', currentSection);

    // Fallback logic: If on a section that needs data but data is null (refresh), go back to relevant list
    if ((currentSection === 'edit-project' && !editingProject) ||
      (currentSection === 'view-candidates' && !viewingCandidates)) {
      setCurrentSection('my-projects');
    }
  }, [currentSection, editingProject, viewingCandidates]);

  const sectionLabels: Record<string, string> = {
    overview: 'Dashboard',
    'my-projects': 'Mis Proyectos',
    'publish-project': 'Publicar Proyecto',
    'edit-project': 'Editar Proyecto',
    'search-programmers': 'Buscar Programadores',
    chat: 'Chat',
    'view-candidates': 'Candidatos del Proyecto',
    messages: 'Mensajes',
    notifications: 'Notificaciones',
    settings: 'Configuración',
    wallet: 'Billetera & Pagos',
  };

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleSectionChange = (section: string, data?: any) => {
    setCurrentSection(section);
    if (section === 'edit-project' && data) {
      setEditingProject(data);
      setViewingCandidates(null);
    } else if (section === 'view-candidates' && data) {
      setViewingCandidates(data);
      setEditingProject(null);
    } else {
      setEditingProject(null);
      setViewingCandidates(null);
    }
  };

  // ... (existing code)

  const renderSection = () => {
    switch (currentSection) {
      case 'overview':
        return <WelcomeSection onSectionChange={handleSectionChange} />;
      case 'my-projects':
        return <MyProjectsSection onSectionChange={handleSectionChange} />;
      case 'publish-project':
        return <PublishProjectSection onSectionChange={handleSectionChange} />;
      case 'edit-project':
        return (
          <PublishProjectSection
            onSectionChange={handleSectionChange}
            initialData={editingProject || undefined}
            isEditing={true}
          />
        );
      case 'view-candidates':
        return viewingCandidates ? (
          <ProjectCandidatesSection
            project={viewingCandidates}
            onBack={() => handleSectionChange('my-projects')}
            onSectionChange={handleSectionChange}
          />
        ) : <MyProjectsSection onSectionChange={handleSectionChange} />;
      case 'search-programmers':
        return <SearchProgrammersSection />;
      case 'chat':
      case 'messages':
        return <ChatSection userType="company" />;
      case 'wallet':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Billetera & Pagos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <WalletBalance />
                <div className="mt-4">
                  <RechargeButton onRecharge={() => window.location.reload()} />
                  {/* Reload is a quick hack to refresh balance, ideal would be a context or callback refetch */}
                </div>
              </div>
              <div>
                <TransactionHistory />
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return <div className="text-white p-8">Notificaciones (Próximamente)</div>;
      case 'settings':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Configuración</h2>
            <div className="max-w-4xl">
              <PaymentMethodsSettings userType="company" />
            </div>
          </div>
        );
      default:
        return <WelcomeSection onSectionChange={handleSectionChange} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0D0D0D]">
      <Sidebar
        userType="company"
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
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
            <p className="text-sm text-gray-400">Panel de empresa</p>
            <p className="text-base font-semibold text-white">{sectionLabels[currentSection] || 'Dashboard'}</p>
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
