import { useState, useEffect } from 'react';
import { KPICard } from "../KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import {
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    Building,
    User,
    Briefcase,
    TrendingUp
} from 'lucide-react';
import { fetchCommissionStats, fetchCommissions, type CommissionStats, type CommissionRecord } from '../../../../services/adminMetricsService';
import { useTheme } from "../../../../contexts/ThemeContext";

export function CommissionsDashboard() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [stats, setStats] = useState<CommissionStats | null>(null);
    const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsData, commissionsData] = await Promise.all([
                fetchCommissionStats(),
                fetchCommissions(1)
            ]);

            if (statsData.success) {
                setStats(statsData.data);
            }

            if (commissionsData.success) {
                setCommissions(commissionsData.data.data);
            }
        } catch (error) {
            console.error('Error loading commission data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'released':
                return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30"><CheckCircle className="h-3 w-3 mr-1" /> Liberada</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"><Clock className="h-3 w-3 mr-1" /> Pendiente</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30"><AlertCircle className="h-3 w-3 mr-1" /> Cancelada</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Cargando datos de comisiones...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Comisiones Totales"
                    value={formatCurrency(stats?.total_commission || 0)}
                    icon={<DollarSign className="h-5 w-5 text-green-500" />}
                    description="Comisiones cobradas"
                />
                <KPICard
                    title="Fondos Retenidos"
                    value={formatCurrency(stats?.total_held || 0)}
                    icon={<Clock className="h-5 w-5 text-yellow-500" />}
                    description="50% retenido de proyectos"
                />
                <KPICard
                    title="Proyectos Activos"
                    value={stats?.pending_count || 0}
                    icon={<Briefcase className="h-5 w-5 text-blue-500" />}
                    description="Con retención pendiente"
                />
                <KPICard
                    title="Proyectos Completados"
                    value={stats?.released_count || 0}
                    icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
                    description="Comisiones liberadas"
                />
            </div>

            {/* Detalles de Comisiones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resumen */}
                <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
                    <CardHeader>
                        <CardTitle className={isDark ? "text-gray-100" : "text-gray-900"}>
                            Resumen de Comisiones
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Total de Proyectos</span>
                                <span className={`font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                                    {stats?.total_projects || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Comisión Promedio</span>
                                <span className={`font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                                    {formatCurrency(stats?.average_commission || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Tasa menor a $500</span>
                                <span className={`font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>20%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Tasa $500 o más</span>
                                <span className={`font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>15%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Estado de Fondos */}
                <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
                    <CardHeader>
                        <CardTitle className={isDark ? "text-gray-100" : "text-gray-900"}>
                            Estado de Fondos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <span className={isDark ? "text-gray-400" : "text-gray-600"}>Pendiente</span>
                                </div>
                                <span className={`font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                                    {stats?.pending_count || 0} proyectos
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className={isDark ? "text-gray-400" : "text-gray-600"}>Liberado</span>
                                </div>
                                <span className={`font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                                    {stats?.released_count || 0} proyectos
                                </span>
                            </div>
                            <div className="pt-4 border-t border-gray-700">
                                <div className="flex justify-between items-center text-lg">
                                    <span className={isDark ? "text-gray-300" : "text-gray-700"}>Total</span>
                                    <span className="font-bold text-primary">
                                        {formatCurrency((stats?.total_commission || 0) + (stats?.total_held || 0))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabla de Comisiones */}
            <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
                <CardHeader>
                    <CardTitle className={isDark ? "text-gray-100" : "text-gray-900"}>
                        Historial de Comisiones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className={isDark ? "border-gray-700" : ""}>
                                <TableHead className={isDark ? "text-gray-400" : ""}>Proyecto</TableHead>
                                <TableHead className={isDark ? "text-gray-400" : ""}>Empresa</TableHead>
                                <TableHead className={isDark ? "text-gray-400" : ""}>Desarrollador</TableHead>
                                <TableHead className={isDark ? "text-gray-400" : ""}>Monto Total</TableHead>
                                <TableHead className={isDark ? "text-gray-400" : ""}>Retenido (50%)</TableHead>
                                <TableHead className={isDark ? "text-gray-400" : ""}>Comisión</TableHead>
                                <TableHead className={isDark ? "text-gray-400" : ""}>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {commissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No hay comisiones registradas
                                    </TableCell>
                                </TableRow>
                            ) : (
                                commissions.map((commission) => (
                                    <TableRow key={commission.id} className={isDark ? "border-gray-700" : ""}>
                                        <TableCell className={isDark ? "text-gray-300" : ""}>
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{commission.project?.title || `Proyecto #${commission.project_id}`}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className={isDark ? "text-gray-300" : ""}>
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4 text-muted-foreground" />
                                                {commission.company?.name || `Empresa #${commission.company_id}`}
                                            </div>
                                        </TableCell>
                                        <TableCell className={isDark ? "text-gray-300" : ""}>
                                            {commission.developer ? (
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    {commission.developer.name}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">Sin asignar</span>
                                            )}
                                        </TableCell>
                                        <TableCell className={isDark ? "text-gray-300" : ""}>
                                            {formatCurrency(commission.total_amount)}
                                        </TableCell>
                                        <TableCell className={isDark ? "text-yellow-400" : "text-yellow-600"}>
                                            {formatCurrency(commission.held_amount)}
                                        </TableCell>
                                        <TableCell className={isDark ? "text-green-400" : "text-green-600"}>
                                            {formatCurrency(commission.commission_amount)} ({commission.commission_rate * 100}%)
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(commission.status)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
