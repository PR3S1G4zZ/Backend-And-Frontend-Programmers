import { useState, useEffect } from 'react';
import { apiRequest } from '../../../../../services/apiClient';
import { Activity, Power, Search, Filter, FileText } from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Log {
    id: number;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    action: string;
    details: string;
    ip_address: string;
    user_agent?: string;
    created_at: string;
}

export function SystemSection() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchData();
    }, [page, debouncedSearch]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const searchParams = new URLSearchParams({
                page: page.toString()
            });
            if (debouncedSearch) {
                searchParams.append('search', debouncedSearch);
            }

            const [logsRes, settingsRes] = await Promise.all([
                apiRequest<any>(`/admin/system/logs?${searchParams.toString()}`),
                apiRequest<any>('/admin/system/settings')
            ]);

            if (logsRes.success) {
                setLogs(logsRes.logs.data);
                setTotalPages(logsRes.logs.last_page);
            }

            if (settingsRes.success) {
                const flatSettings: any = {};
                Object.values(settingsRes.settings).flat().forEach((s: any) => {
                    flatSettings[s.key] = s.value;
                });
                setMaintenanceMode(flatSettings.maintenance_mode === 'true');
            }
        } catch (error) {
            console.error('Error fetching system data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleMaintenance = async () => {
        const newValue = !maintenanceMode;

        const result = await MySwal.fire({
            title: newValue ? '¿Activar Modo Mantenimiento?' : '¿Desactivar Modo Mantenimiento?',
            text: newValue
                ? "La plataforma dejará de estar accesible para los usuarios."
                : "La plataforma volverá a estar accesible para todos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: newValue ? 'hsl(var(--destructive))' : 'hsl(var(--primary))',
            cancelButtonColor: 'hsl(var(--primary))',
            confirmButtonText: newValue ? 'Sí, activar' : 'Sí, desactivar',
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))'
        });

        if (result.isConfirmed) {
            setSaving(true);
            try {
                await apiRequest('/admin/system/settings', {
                    method: 'PUT',
                    body: JSON.stringify({
                        settings: [
                            { key: 'maintenance_mode', value: String(newValue) }
                        ]
                    })
                });
                setMaintenanceMode(newValue);
                MySwal.fire({
                    title: 'Configuración actualizada',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))'
                });
            } catch (error) {
                console.error('Error updating maintenance mode:', error);
            } finally {
                setSaving(false);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Sistema y Auditoría</h2>
                <p className="text-muted-foreground text-sm">Monitorea la actividad y gestiona el estado del sistema.</p>
            </div>

            {/* Maintenance Mode */}
            <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                            maintenanceMode ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                        )}>
                            <Power className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Modo Mantenimiento</h3>
                            <p className="text-sm text-muted-foreground">
                                {maintenanceMode
                                    ? "El sitio está actualmente inaccesible para los usuarios."
                                    : "El sitio está funcionando normalmente."}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleToggleMaintenance}
                        disabled={saving}
                        className={cn(
                            "px-6 py-2.5 rounded-lg font-bold transition-all disabled:opacity-50 border",
                            maintenanceMode
                                ? "bg-transparent border-red-500 text-red-500 hover:bg-red-500/10"
                                : "bg-red-500 text-white border-red-500 hover:bg-red-600"
                        )}
                    >
                        {maintenanceMode ? 'Desactivar Mantenimiento' : 'Activar Mantenimiento'}
                    </button>
                </div>
            </div>

            {/* Activity Logs */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Registro de Actividad
                    </h3>
                    {/* Placeholder for filters */}
                    <div className="flex gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar en logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm text-foreground w-64 focus:border-primary outline-none"
                            />
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2" />
                        </div>
                        <button className="p-1.5 bg-background border border-border rounded-lg text-muted-foreground hover:text-foreground">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted text-muted-foreground font-medium">
                                <tr>
                                    <th className="px-4 py-3">Usuario</th>
                                    <th className="px-4 py-3">Acción</th>
                                    <th className="px-4 py-3">Detalles</th>
                                    <th className="px-4 py-3">IP / Agente</th>
                                    <th className="px-4 py-3">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <>
                                        {/* Skeleton Loaders para la tabla de logs */}
                                        {[...Array(5)].map((_, index) => (
                                            <tr key={index} className="hover:bg-muted/50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                                                        <div>
                                                            <div className="h-4 w-32 bg-muted rounded animate-pulse mb-1" />
                                                            <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="h-3 w-32 bg-muted rounded animate-pulse mb-1" />
                                                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            No hay actividad registrada.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-4 py-3">
                                                {log.user ? (
                                                    <div>
                                                        <p className="font-medium text-foreground">{log.user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{log.user.email}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 italic">Sistema / Anónimo</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-primary font-mono text-xs">
                                                {log.action}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground max-w-xs truncate" title={log.details}>
                                                {log.details || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground text-xs">
                                                <p>{log.ip_address}</p>
                                                <p className="truncate w-32" title={log.user_agent}>
                                                    {log.user_agent || '-'}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Estado vacío decorativo cuando no hay logs */}
                {!loading && logs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Sin actividad registrada</h3>
                        <p className="text-muted-foreground text-center mb-6 max-w-md">
                            No hay registros de actividad en el sistema todavía.
                            Las acciones de los usuarios aparecerán aquí.
                        </p>
                        <button
                            onClick={fetchData}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent text-foreground text-sm font-medium transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            Actualizar
                        </button>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <p>Página {page} de {totalPages}</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 bg-card border border-border rounded hover:bg-accent disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 bg-card border border-border rounded hover:bg-accent disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
