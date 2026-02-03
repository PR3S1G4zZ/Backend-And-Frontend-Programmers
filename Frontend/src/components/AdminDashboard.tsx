import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { useSweetAlert } from './ui/sweet-alert';
import { ActivityDashboard } from './dashboard/components/admin/ActivityDashboard';
import { FinancialDashboard } from './dashboard/components/admin/FinancialDashboard';
import { GrowthDashboard } from './dashboard/components/admin/GrowthDashboard';
import { ProjectsDashboard } from './dashboard/components/admin/ProjectsDashboard';
import { SatisfactionDashboard } from './dashboard/components/admin/SatisfactionDashboard';
import { UserManagement } from './dashboard/components/UserManagement';
import { Card, CardContent, CardHeader, CardTitle } from './dashboard/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './dashboard/components/ui/tabs';
import { BarChart3, DollarSign, TrendingUp, Users, Star, Shield } from 'lucide-react';
import { fetchAdminMetrics, type AdminMetrics } from '../services/adminMetricsService';

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const { showAlert, Alert } = useSweetAlert();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadMetrics = async () => {
      setMetricsLoading(true);
      setMetricsError(null);
      const response = await fetchAdminMetrics(selectedPeriod);
      if (!isMounted) return;
      if (response.success && response.data) {
        setMetrics(response.data);
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

  const periodOptions = [
    { value: 'day', label: 'Día' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' }
  ];

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-[#00FF85] glow-text flex items-center gap-3">
                    <Shield className="w-8 h-8" />
                    Dashboard Administrativo
                  </h1>
                  <p className="text-gray-300 mt-2">Panel de control completo del sistema</p>
                </div>

                {/* Period Selector */}
                <Card className="bg-[#1A1A1A] border-[#333333]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300">Período:</span>
                      <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
                        className="bg-[#2A2A2A] border border-[#333333] rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-[#00FF85]"
                      >
                        {periodOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Dashboard Tabs */}
              <Tabs defaultValue="activity" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-[#1A1A1A] border border-[#333333]">
                  <TabsTrigger
                    value="activity"
                    className="flex items-center gap-2 data-[state=active]:bg-[#00FF85] data-[state=active]:text-[#0D0D0D]"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Actividad
                  </TabsTrigger>
                  <TabsTrigger
                    value="financial"
                    className="flex items-center gap-2 data-[state=active]:bg-[#00FF85] data-[state=active]:text-[#0D0D0D]"
                  >
                    <DollarSign className="w-4 h-4" />
                    Financiero
                  </TabsTrigger>
                  <TabsTrigger
                    value="growth"
                    className="flex items-center gap-2 data-[state=active]:bg-[#00FF85] data-[state=active]:text-[#0D0D0D]"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Crecimiento
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="flex items-center gap-2 data-[state=active]:bg-[#00FF85] data-[state=active]:text-[#0D0D0D]"
                  >
                    <Users className="w-4 h-4" />
                    Proyectos
                  </TabsTrigger>
                  <TabsTrigger
                    value="satisfaction"
                    className="flex items-center gap-2 data-[state=active]:bg-[#00FF85] data-[state=active]:text-[#0D0D0D]"
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
        return (
          <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-[#00FF85] glow-text mb-6">Todos los Proyectos</h1>
              <Card className="bg-[#1A1A1A] border-[#333333]">
                <CardHeader>
                  <CardTitle className="text-[#00FF85]">Panel de Proyectos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Panel completo para gestionar todos los proyectos del sistema.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-[#00FF85] glow-text mb-6">Analíticas del Sistema</h1>
              <Card className="bg-[#1A1A1A] border-[#333333]">
                <CardHeader>
                  <CardTitle className="text-[#00FF85]">Estadísticas Avanzadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Estadísticas y métricas avanzadas del sistema.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-[#00FF85] glow-text mb-6">Configuración del Sistema</h1>
              <Card className="bg-[#1A1A1A] border-[#333333]">
                <CardHeader>
                  <CardTitle className="text-[#00FF85]">Configuraciones Avanzadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Configuraciones avanzadas y mantenimiento del sistema.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-[#00FF85] glow-text">Dashboard Administrativo</h1>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex">
      <Sidebar
        userType="admin"
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
