import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './Sidebar';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { ActivityDashboard } from './dashboard/components/admin/ActivityDashboard';
import { FinancialDashboard } from './dashboard/components/admin/FinancialDashboard';
import { GrowthDashboard } from './dashboard/components/admin/GrowthDashboard';
import { ProjectsDashboard } from './dashboard/components/admin/ProjectsDashboard';
import { ProjectsManagement } from './dashboard/components/admin/ProjectsManagement';
import { SatisfactionDashboard } from './dashboard/components/admin/SatisfactionDashboard';
import { UserManagement } from './dashboard/components/UserManagement';
import { AdminSettings } from './dashboard/components/admin/AdminSettings';
import { Card, CardContent, CardHeader, CardTitle } from './dashboard/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './dashboard/components/ui/tabs';
import { BarChart3, DollarSign, TrendingUp, Users, Star, Shield, Menu } from 'lucide-react';
import { fetchAdminMetrics, type AdminMetrics, type KPI } from '../services/adminMetricsService';
import { useAuth } from '../contexts/AuthContext';

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  const { user } = useAuth();

  const periodOptions = useMemo(
    () => [
      { value: 'day', label: 'Día' },
      { value: 'week', label: 'Semana' },
      { value: 'month', label: 'Mes' },
      { value: 'year', label: 'Año' },
    ],
    []
  );

  const sectionLabels: Record<string, string> = useMemo(
    () => ({
      dashboard: 'Dashboard Admin',
      users: 'Gestión de Usuarios',
      projects: 'Todos los Proyectos',
      analytics: 'Analíticas',
      settings: 'Configuración',
    }),
    []
  );

  const getKpiValue = (kpis: KPI[] | undefined, title: string) =>
    kpis?.find((kpi) => kpi.title === title)?.value ?? 0;

  // ✅ Cierra sidebar al cambiar sección (especialmente mobile)
  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      setMetricsLoading(true);
      setMetricsError(null);

      const response = await fetchAdminMetrics(selectedPeriod);

      if (!isMounted) return;

      if (response.success && response.data) {
        setMetrics(response.data);
        setMetricsError(null);
      } else {
        setMetrics(null);
        setMetricsError(response.message || 'No se pudieron cargar las métricas.');
      }

      setMetricsLoading(false);
    };

    loadMetrics();

    return () => {
      isMounted = false;
    };
  }, [selectedPeriod]);

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <div className="min-h-screen bg-background text-foreground p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-primary glow-text flex items-center gap-3">
                    <Shield className="w-8 h-8" />
                    Dashboard Administrativo
                  </h1>
                  <p className="text-muted-foreground mt-2">Panel de control completo del sistema</p>
                </div>

                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">Período:</span>
                      <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
                        className="bg-background border border-border rounded px-3 py-1 text-foreground text-sm focus:outline-none focus:border-primary"
                      >
                        {periodOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="activity" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-card border border-border">
                  <TabsTrigger
                    value="activity"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Actividad
                  </TabsTrigger>

                  <TabsTrigger
                    value="financial"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <DollarSign className="w-4 h-4" />
                    Financiero
                  </TabsTrigger>

                  <TabsTrigger
                    value="growth"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Crecimiento
                  </TabsTrigger>

                  <TabsTrigger
                    value="projects"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Users className="w-4 h-4" />
                    Proyectos
                  </TabsTrigger>

                  <TabsTrigger
                    value="satisfaction"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Star className="w-4 h-4" />
                    Satisfacción
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="mt-6">
                  <ActivityDashboard selectedPeriod={selectedPeriod} metrics={metrics?.activity} isLoading={metricsLoading} />
                </TabsContent>

                <TabsContent value="financial" className="mt-6">
                  <FinancialDashboard selectedPeriod={selectedPeriod} metrics={metrics?.financial} isLoading={metricsLoading} />
                </TabsContent>

                <TabsContent value="growth" className="mt-6">
                  <GrowthDashboard selectedPeriod={selectedPeriod} metrics={metrics?.growth} isLoading={metricsLoading} />
                </TabsContent>

                <TabsContent value="projects" className="mt-6">
                  <ProjectsDashboard selectedPeriod={selectedPeriod} metrics={metrics?.projects} isLoading={metricsLoading} />
                </TabsContent>

                <TabsContent value="satisfaction" className="mt-6">
                  <SatisfactionDashboard selectedPeriod={selectedPeriod} metrics={metrics?.satisfaction} isLoading={metricsLoading} />
                </TabsContent>
              </Tabs>

              {metricsError ? (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                  {metricsError}
                </div>
              ) : null}
            </div>
          </div>
        );

      case 'users':
        return <UserManagement />;

      case 'projects':
        return <ProjectsManagement />;

      case 'analytics':
        return (
          <div className="min-h-screen bg-background text-foreground p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-primary glow-text mb-6">Analíticas del Sistema</h1>
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-primary">Estadísticas Avanzadas</CardTitle>
                </CardHeader>
                <CardContent>
                  {metricsLoading ? (
                    <p className="text-muted-foreground">Cargando métricas...</p>
                  ) : metricsError ? (
                    <p className="text-red-500">{metricsError}</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-lg border border-border bg-card p-4">
                        <p className="text-muted-foreground text-sm">Usuarios activos</p>
                        <p className="text-2xl font-bold text-foreground">{getKpiValue(metrics?.activity?.kpis, 'Sesiones Promedio')}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-4">
                        <p className="text-muted-foreground text-sm">Proyectos activos</p>
                        <p className="text-2xl font-bold text-foreground">{getKpiValue(metrics?.projects?.kpis, 'Proyectos Activos')}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-4">
                        <p className="text-muted-foreground text-sm">Ingresos estimados</p>
                        <p className="text-2xl font-bold text-foreground">{getKpiValue(metrics?.financial?.kpis, 'Ingresos Netos')}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'settings':
        return <AdminSettings />;

      default:
        return (
          <div className="min-h-screen bg-background text-foreground p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-primary glow-text">Dashboard Administrativo</h1>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar
        userType="admin"
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
      />

      <div className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-md border border-border p-2 text-foreground hover:bg-accent"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-sm text-muted-foreground">Panel administrativo</p>
            <p className="text-base font-semibold text-foreground">{sectionLabels[currentSection] || 'Dashboard Admin'}</p>
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
