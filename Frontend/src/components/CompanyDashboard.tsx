import { WalletBalance } from './dashboard/wallet/WalletBalance';
import { TransactionHistory } from './dashboard/wallet/TransactionHistory';
import { WalletRecharge } from './dashboard/wallet/WalletRecharge';
import { WalletProvider } from '../contexts/WalletContext';

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
import { WalletPaymentMethods } from './dashboard/wallet/WalletPaymentMethods';
import { Workspace } from './dashboard/shared/Workspace';
import { AppearanceSection } from './dashboard/settings/AppearanceSection';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

interface CompanyDashboardProps {
  onLogout?: () => void;
}

export function CompanyDashboard({ onLogout }: CompanyDashboardProps) {
  const [currentSection, setCurrentSection] = useState(() => {
    return localStorage.getItem('company_dashboard_section') || 'overview';
  });
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);
  const [viewingCandidates, setViewingCandidates] = useState<ProjectResponse | null>(null);
  const [viewingWorkspace, setViewingWorkspace] = useState<ProjectResponse | null>(null);
  const [viewingChatId, setViewingChatId] = useState<string | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Persist storage and handle missing data on refresh
  useEffect(() => {
    localStorage.setItem('company_dashboard_section', currentSection);

    // Fallback logic
    if ((currentSection === 'edit-project' && !editingProject) ||
      (currentSection === 'view-candidates' && !viewingCandidates) ||
      (currentSection === 'workspace' && !viewingWorkspace)) {
      setCurrentSection('my-projects');
    }
  }, [currentSection, editingProject, viewingCandidates, viewingWorkspace]);

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
    workspace: 'Espacio de Trabajo',
  };

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleSectionChange = (section: string, data?: any) => {
    setCurrentSection(section);
    if (section === 'edit-project' && data) {
      setEditingProject(data);
      setViewingCandidates(null);
      setViewingWorkspace(null);
    } else if (section === 'view-candidates' && data) {
      setViewingCandidates(data);
      setEditingProject(null);
      setViewingWorkspace(null);
    } else if (section === 'workspace' && data) {
      setViewingWorkspace(data);
      setEditingProject(null);
      setViewingCandidates(null);
      setViewingChatId(undefined);
    } else if ((section === 'chat' || section === 'messages') && data?.chatId) {
      setViewingChatId(String(data.chatId));
      setEditingProject(null);
      setViewingCandidates(null);
      setViewingWorkspace(null);
    } else {
      setEditingProject(null);
      setViewingCandidates(null);
      setViewingWorkspace(null);
      setViewingChatId(undefined);
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
        return <SearchProgrammersSection onSectionChange={handleSectionChange} />;
      case 'chat':
      case 'messages':
        return <ChatSection userType="company" initialChatId={viewingChatId} />;
      case 'wallet':
        return (
          <WalletProvider>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Billetera & Pagos</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                  <WalletBalance />
                  <WalletRecharge />
                </div>
                <div className="lg:col-span-2">
                  <TransactionHistory />
                </div>
                <div className="lg:col-span-3 mt-4">
                  <WalletPaymentMethods userType="company" />
                </div>
              </div>
            </div>
          </WalletProvider>
        );
      case 'notifications':
        return <div className="text-white p-8">Notificaciones (Próximamente)</div>;
      case 'settings':
        return (
          <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">Configuración</h2>
            <div className="max-w-4xl space-y-6">
              {/* Sección de Apariencia */}
              <Card className="bg-card border-border hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <SettingsIcon className="h-5 w-5 mr-2" />
                    Apariencia y UX
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AppearanceSection />
                </CardContent>
              </Card>

              {/* Nota sobre métodos de pago */}
              <p className="text-gray-400">La configuración de métodos de pago se ha movido a la sección de Billetera.</p>
            </div>
          </div>
        );
      case 'workspace':
        return viewingWorkspace ? (
          <Workspace
            projectId={Number(viewingWorkspace.id)}
            userType="company"
            onBack={() => {
              setViewingWorkspace(null);
              setCurrentSection('my-projects');
            }}
          />
        ) : <MyProjectsSection onSectionChange={handleSectionChange} />;
      default:
        return <WelcomeSection onSectionChange={handleSectionChange} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
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
