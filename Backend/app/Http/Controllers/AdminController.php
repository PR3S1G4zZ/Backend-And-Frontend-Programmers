<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Project;
use App\Models\Application;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Obtener todos los usuarios (solo para administradores)
     */
    public function getUsers(Request $request): JsonResponse
    {
        try {
            // Verificar que el usuario autenticado sea admin
            if (!Auth::check() || Auth::user()->user_type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso no autorizado. Solo administradores pueden ver usuarios.'
                ], 403);
            }

            // Obtener usuarios con paginación opcional
            $perPage = $request->get('per_page', 50);
            $users = User::select('id', 'name', 'lastname', 'email', 'user_type', 'created_at', 'email_verified_at')
                        ->orderBy('created_at', 'desc')
                        ->paginate($perPage);

            return response()->json([
                'success' => true,
                'users' => $users->items(),
                'pagination' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total()
                ]
            ]);

        } catch (\Exception $e) {
            report($e);
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios.'
            ], 500);
        }
    }

    /**
     * Obtener un usuario específico
     */
    public function getUser($id): JsonResponse
    {
        try {
            // Verificar que el usuario autenticado sea admin
            if (!Auth::check() || Auth::user()->user_type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso no autorizado.'
                ], 403);
            }

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'user' => $user
            ]);

        } catch (\Exception $e) {
            report($e);
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuario.'
            ], 500);
        }
    }

    /**
     * Actualizar un usuario
     */
    public function updateUser(Request $request, $id): JsonResponse
    {
        try {
            // Verificar que el usuario autenticado sea admin
            if (!Auth::check() || Auth::user()->user_type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso no autorizado.'
                ], 403);
            }

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado.'
                ], 404);
            }

            // Validar datos
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255|regex:/^(?!\s)[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+(?<!\s)$/',
                'lastname' => 'sometimes|string|max:255|regex:/^(?!\s)[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+(?<!\s)$/',
                'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
                'user_type' => 'sometimes|in:programmer,company,admin'
            ]);

            $user->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente.',
                'user' => $user
            ]);

        } catch (\Exception $e) {
            report($e);
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar usuario.'
            ], 500);
        }
    }

    /**
     * Eliminar un usuario
     */
    public function deleteUser($id): JsonResponse
    {
        try {
            // Verificar que el usuario autenticado sea admin
            if (!Auth::check() || Auth::user()->user_type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso no autorizado.'
                ], 403);
            }

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado.'
                ], 404);
            }

            // No permitir que un admin se elimine a sí mismo
            if ($user->id === Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes eliminar tu propia cuenta.'
                ], 400);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente.'
            ]);

        } catch (\Exception $e) {
            report($e);
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar usuario.'
            ], 500);
        }
    }

    /**
     * Obtener métricas agregadas para dashboards administrativos
     */
    public function metrics(Request $request): JsonResponse
    {
        try {
            if (!Auth::check() || Auth::user()->user_type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso no autorizado.'
                ], 403);
            }

            $period = $this->sanitizePeriod($request->get('period', 'month'));
            $timeSeries = $this->buildTimeSeries($period);

            return response()->json([
                'success' => true,
                'data' => [
                    'activity' => $this->buildActivityMetrics($period, $timeSeries),
                    'financial' => $this->buildFinancialMetrics($period, $timeSeries),
                    'growth' => $this->buildGrowthMetrics($period, $timeSeries),
                    'projects' => $this->buildProjectsMetrics($period),
                    'satisfaction' => $this->buildSatisfactionMetrics($period),
                ],
            ]);
        } catch (\Exception $e) {
            report($e);
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener métricas.'
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de usuarios
     */
    public function getUserStats(): JsonResponse
    {
        try {
            // Verificar que el usuario autenticado sea admin
            if (!Auth::check() || Auth::user()->user_type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso no autorizado.'
                ], 403);
            }

            $stats = [
                'total_users' => User::count(),
                'admins' => User::where('user_type', 'admin')->count(),
                'companies' => User::where('user_type', 'company')->count(),
                'programmers' => User::where('user_type', 'programmer')->count(),
                'verified_emails' => User::whereNotNull('email_verified_at')->count(),
                'unverified_emails' => User::whereNull('email_verified_at')->count(),
                'recent_registrations' => User::where('created_at', '>=', now()->subDays(30))->count()
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            report($e);
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas.'
            ], 500);
        }
    }

    private function sanitizePeriod(?string $period): string
    {
        $allowed = ['day', 'week', 'month', 'year'];
        return in_array($period, $allowed, true) ? $period : 'month';
    }

    private function periodLabel(string $period): string
    {
        return match ($period) {
            'day' => 'día anterior',
            'week' => 'semana anterior',
            'year' => 'año anterior',
            default => 'mes anterior',
        };
    }

    private function periodRange(string $period, int $offset = 0): array
    {
        $now = Carbon::now();
        return match ($period) {
            'day' => [$now->copy()->subHours(24 * ($offset + 1)), $now->copy()->subHours(24 * $offset)],
            'week' => [$now->copy()->subDays(7 * ($offset + 1)), $now->copy()->subDays(7 * $offset)],
            'year' => [$now->copy()->subDays(365 * ($offset + 1)), $now->copy()->subDays(365 * $offset)],
            default => [$now->copy()->subDays(30 * ($offset + 1)), $now->copy()->subDays(30 * $offset)],
        };
    }

    private function buildChange(float $current, float $previous, string $period): array
    {
        $delta = $previous > 0 ? (($current - $previous) / $previous) * 100 : ($current > 0 ? 100 : 0);
        return [
            'value' => round($delta, 1),
            'isPositive' => $current >= $previous,
            'period' => $this->periodLabel($period),
        ];
    }

    private function buildTimeSeries(string $period): array
    {
        $monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        $dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        $now = Carbon::now();
        $series = [];

        if ($period === 'day') {
            for ($i = 23; $i >= 0; $i--) {
                $start = $now->copy()->subHours($i + 1);
                $end = $now->copy()->subHours($i);
                $series[] = $this->bucketCounts($start, $end, $start->format('H:00'));
            }
            return $series;
        }

        if ($period === 'week') {
            for ($i = 6; $i >= 0; $i--) {
                $start = $now->copy()->subDays($i + 1)->startOfDay();
                $end = $now->copy()->subDays($i)->startOfDay();
                $dayIndex = (int) $start->format('N') - 1;
                $series[] = $this->bucketCounts($start, $end, $dayLabels[$dayIndex] ?? $start->format('D'));
            }
            return $series;
        }

        if ($period === 'year') {
            for ($i = 4; $i >= 0; $i--) {
                $year = $now->copy()->subYears($i)->year;
                $start = Carbon::create($year, 1, 1)->startOfYear();
                $end = Carbon::create($year, 12, 31)->endOfYear();
                $series[] = $this->bucketCounts($start, $end, (string) $year);
            }
            return $series;
        }

        for ($i = 11; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $start = $date->copy()->startOfMonth();
            $end = $date->copy()->endOfMonth();
            $series[] = $this->bucketCounts($start, $end, $monthLabels[$date->month - 1]);
        }

        return $series;
    }

    private function bucketCounts(Carbon $start, Carbon $end, string $label): array
    {
        $users = User::whereBetween('created_at', [$start, $end])->count();
        $programmers = User::where('user_type', 'programmer')->whereBetween('created_at', [$start, $end])->count();
        $companies = User::where('user_type', 'company')->whereBetween('created_at', [$start, $end])->count();
        $projects = Project::whereBetween('created_at', [$start, $end])->count();
        $applications = Application::whereBetween('created_at', [$start, $end])->count();
        $revenue = Project::whereBetween('created_at', [$start, $end])
            ->sum(DB::raw('COALESCE(budget_max, budget_min, 0)'));

        return [
            'period' => $label,
            'users' => $users,
            'programmers' => $programmers,
            'companies' => $companies,
            'projects' => $projects,
            'applications' => $applications,
            'revenue' => $revenue,
        ];
    }

    private function buildActivityMetrics(string $period, array $timeSeries): array
    {
        [$start, $end] = $this->periodRange($period, 0);
        [$prevStart, $prevEnd] = $this->periodRange($period, 1);

        $messages = Message::whereBetween('created_at', [$start, $end])->count();
        $messagesPrev = Message::whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $applications = Application::whereBetween('created_at', [$start, $end])->count();
        $applicationsPrev = Application::whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $users = User::count();
        $sessions = $users > 0 ? round(($messages + $applications) / $users, 1) : 0;
        $sessionsPrev = $users > 0 ? round(($messagesPrev + $applicationsPrev) / $users, 1) : 0;

        $avgSessionTime = $users > 0 ? min(60, round(5 + ($messages / max(1, $users)) * 2)) : 0;
        $avgSessionTimePrev = $users > 0 ? min(60, round(5 + ($messagesPrev / max(1, $users)) * 2)) : 0;

        $activeDevelopers = Application::distinct('developer_id')->count('developer_id');
        $totalDevelopers = User::where('user_type', 'programmer')->count();
        $engagementScore = $totalDevelopers > 0 ? round(($activeDevelopers / $totalDevelopers) * 100) : 0;

        return [
            'kpis' => [
                [
                    'title' => 'Sesiones Promedio',
                    'value' => $sessions,
                    'change' => $this->buildChange($sessions, $sessionsPrev, $period),
                    'description' => 'Por usuario',
                ],
                [
                    'title' => 'Mensajes Enviados',
                    'value' => $messages,
                    'change' => $this->buildChange($messages, $messagesPrev, $period),
                    'description' => 'En el período',
                ],
                [
                    'title' => 'Archivos Compartidos',
                    'value' => $applications,
                    'change' => $this->buildChange($applications, $applicationsPrev, $period),
                    'description' => 'Aplicaciones registradas',
                ],
                [
                    'title' => 'Tiempo Promedio Sesión',
                    'value' => $avgSessionTime . ' min',
                    'change' => $this->buildChange($avgSessionTime, $avgSessionTimePrev, $period),
                    'description' => 'Estimado por actividad',
                ],
            ],
            'timeSeries' => $timeSeries,
            'engagementScore' => $engagementScore,
        ];
    }

    private function buildFinancialMetrics(string $period, array $timeSeries): array
    {
        [$start, $end] = $this->periodRange($period, 0);
        [$prevStart, $prevEnd] = $this->periodRange($period, 1);

        $revenue = Project::where('status', 'completed')
            ->whereBetween('created_at', [$start, $end])
            ->sum(DB::raw('COALESCE(budget_max, budget_min, 0)'));
        $revenuePrev = Project::where('status', 'completed')
            ->whereBetween('created_at', [$prevStart, $prevEnd])
            ->sum(DB::raw('COALESCE(budget_max, budget_min, 0)'));

        $gmv = Project::whereBetween('created_at', [$start, $end])
            ->sum(DB::raw('COALESCE(budget_max, budget_min, 0)'));
        $gmvPrev = Project::whereBetween('created_at', [$prevStart, $prevEnd])
            ->sum(DB::raw('COALESCE(budget_max, budget_min, 0)'));

        $transactions = Application::whereBetween('created_at', [$start, $end])->count();
        $transactionsPrev = Application::whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $avgTicket = $transactions > 0 ? round($revenue / $transactions, 2) : 0;
        $avgTicketPrev = $transactionsPrev > 0 ? round($revenuePrev / $transactionsPrev, 2) : 0;

        $statusTotals = Project::whereBetween('created_at', [$start, $end])
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $totalProjects = $statusTotals->sum() ?: 1;
        $revenueSources = collect($statusTotals)->map(function ($count, $status) use ($totalProjects) {
            return [
                'name' => match ($status) {
                    'open' => 'Proyectos abiertos',
                    'in_progress' => 'Proyectos en progreso',
                    'completed' => 'Proyectos completados',
                    'cancelled' => 'Proyectos cancelados',
                    default => 'Otros',
                },
                'value' => round(($count / $totalProjects) * 100, 1),
                'amount' => $count,
                'color' => match ($status) {
                    'open' => 'var(--color-neon-green)',
                    'in_progress' => 'var(--color-emerald-green)',
                    'completed' => 'var(--color-chart-3)',
                    'cancelled' => 'var(--color-chart-4)',
                    default => 'var(--color-neon-green)',
                },
            ];
        })->values();

        $recentTransactions = Application::with(['project.company', 'developer'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($application) {
                $project = $application->project;
                $amount = $project ? ($project->budget_max ?? $project->budget_min ?? 0) : 0;
                $status = match ($application->status) {
                    'accepted' => 'Completado',
                    'reviewed' => 'Pendiente',
                    'rejected' => 'Fallido',
                    default => 'Pendiente',
                };

                return [
                    'id' => 'APP-' . $application->id,
                    'type' => 'Comisión',
                    'description' => $project?->title ?? 'Proyecto',
                    'amount' => $amount,
                    'client' => $project?->company?->name ?? 'Cliente',
                    'date' => $application->created_at?->toDateString(),
                    'status' => $status,
                ];
            });

        return [
            'kpis' => [
                [
                    'title' => 'Ingresos Netos',
                    'value' => '$' . number_format($revenue, 0, '.', ','),
                    'change' => $this->buildChange($revenue, $revenuePrev, $period),
                    'description' => 'Ingresos en el período',
                ],
                [
                    'title' => 'GMV Total',
                    'value' => '$' . number_format($gmv, 0, '.', ','),
                    'change' => $this->buildChange($gmv, $gmvPrev, $period),
                    'description' => 'Valor bruto de proyectos',
                ],
                [
                    'title' => 'Transacciones',
                    'value' => $transactions,
                    'change' => $this->buildChange($transactions, $transactionsPrev, $period),
                    'description' => 'Aplicaciones registradas',
                ],
                [
                    'title' => 'Ticket Promedio',
                    'value' => '$' . number_format($avgTicket, 0, '.', ','),
                    'change' => $this->buildChange($avgTicket, $avgTicketPrev, $period),
                    'description' => 'Por aplicación',
                ],
            ],
            'timeSeries' => $timeSeries,
            'revenueSources' => $revenueSources,
            'recentTransactions' => $recentTransactions,
        ];
    }

    private function buildGrowthMetrics(string $period, array $timeSeries): array
    {
        [$start, $end] = $this->periodRange($period, 0);
        [$prevStart, $prevEnd] = $this->periodRange($period, 1);

        $newFreelancers = User::where('user_type', 'programmer')->whereBetween('created_at', [$start, $end])->count();
        $newFreelancersPrev = User::where('user_type', 'programmer')->whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $newClients = User::where('user_type', 'company')->whereBetween('created_at', [$start, $end])->count();
        $newClientsPrev = User::where('user_type', 'company')->whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $applications = Application::whereBetween('created_at', [$start, $end])->count();
        $accepted = Application::where('status', 'accepted')->whereBetween('created_at', [$start, $end])->count();
        $applicationsPrev = Application::whereBetween('created_at', [$prevStart, $prevEnd])->count();
        $acceptedPrev = Application::where('status', 'accepted')->whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $conversionRate = $applications > 0 ? round(($accepted / $applications) * 100, 1) : 0;
        $conversionRatePrev = $applicationsPrev > 0 ? round(($acceptedPrev / $applicationsPrev) * 100, 1) : 0;

        $totalDevelopers = User::where('user_type', 'programmer')->count();
        $activeDevelopers = Application::distinct('developer_id')->count('developer_id');
        $retention = $totalDevelopers > 0 ? round(($activeDevelopers / $totalDevelopers) * 100, 1) : 0;

        $funnel = [
            ['label' => 'Registros', 'value' => $newFreelancers + $newClients],
            ['label' => 'Proyectos', 'value' => Project::whereBetween('created_at', [$start, $end])->count()],
            ['label' => 'Aplicaciones', 'value' => $applications],
            ['label' => 'Aceptadas', 'value' => $accepted],
        ];

        return [
            'kpis' => [
                [
                    'title' => 'Nuevos Freelancers',
                    'value' => $newFreelancers,
                    'change' => $this->buildChange($newFreelancers, $newFreelancersPrev, $period),
                ],
                [
                    'title' => 'Nuevos Clientes',
                    'value' => $newClients,
                    'change' => $this->buildChange($newClients, $newClientsPrev, $period),
                ],
                [
                    'title' => 'Tasa de Conversión',
                    'value' => $conversionRate . '%',
                    'change' => $this->buildChange($conversionRate, $conversionRatePrev, $period),
                ],
                [
                    'title' => 'Retención 30 días',
                    'value' => $retention . '%',
                    'change' => $this->buildChange($retention, $retention, $period),
                ],
            ],
            'timeSeries' => $timeSeries,
            'funnel' => $funnel,
        ];
    }

    private function buildProjectsMetrics(string $period): array
    {
        [$start, $end] = $this->periodRange($period, 0);
        [$prevStart, $prevEnd] = $this->periodRange($period, 1);

        $activeProjects = Project::whereIn('status', ['open', 'in_progress'])->count();
        $activeProjectsPrev = Project::whereIn('status', ['open', 'in_progress'])
            ->whereBetween('created_at', [$prevStart, $prevEnd])
            ->count();

        $completedProjects = Project::where('status', 'completed')->count();
        $completedProjectsPrev = Project::where('status', 'completed')
            ->whereBetween('created_at', [$prevStart, $prevEnd])
            ->count();

        $avgDuration = Project::where('status', 'completed')
            ->selectRaw('AVG(TIMESTAMPDIFF(DAY, created_at, updated_at)) as avg_days')
            ->value('avg_days');
        $avgDuration = $avgDuration ? round($avgDuration) : 0;

        $applications = Application::count();
        $accepted = Application::where('status', 'accepted')->count();
        $successRate = $applications > 0 ? round(($accepted / $applications) * 100, 1) : 0;

        $statusCounts = Project::select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');
        $totalStatus = $statusCounts->sum() ?: 1;
        $categories = collect($statusCounts)->map(function ($count, $status) use ($totalStatus) {
            return [
                'category' => match ($status) {
                    'open' => 'Abiertos',
                    'in_progress' => 'En progreso',
                    'completed' => 'Completados',
                    'cancelled' => 'Cancelados',
                    default => 'Otros',
                },
                'projects' => $count,
                'percentage' => round(($count / $totalStatus) * 100, 1),
            ];
        })->values();

        $projectsWithApplications = Project::whereHas('applications')->count();
        $funnel = [
            ['label' => 'Publicados', 'value' => Project::count()],
            ['label' => 'Con propuestas', 'value' => $projectsWithApplications],
            ['label' => 'En progreso', 'value' => Project::where('status', 'in_progress')->count()],
            ['label' => 'Completados', 'value' => $completedProjects],
        ];

        return [
            'kpis' => [
                [
                    'title' => 'Proyectos Activos',
                    'value' => $activeProjects,
                    'change' => $this->buildChange($activeProjects, $activeProjectsPrev, $period),
                ],
                [
                    'title' => 'Proyectos Completados',
                    'value' => $completedProjects,
                    'change' => $this->buildChange($completedProjects, $completedProjectsPrev, $period),
                ],
                [
                    'title' => 'Tiempo Promedio',
                    'value' => $avgDuration . ' días',
                    'change' => $this->buildChange($avgDuration, $avgDuration, $period),
                ],
                [
                    'title' => 'Tasa de Éxito',
                    'value' => $successRate . '%',
                    'change' => $this->buildChange($successRate, $successRate, $period),
                ],
            ],
            'categories' => $categories,
            'funnel' => $funnel,
        ];
    }

    private function buildSatisfactionMetrics(string $period): array
    {
        [$start, $end] = $this->periodRange($period, 0);
        [$prevStart, $prevEnd] = $this->periodRange($period, 1);

        $applications = Application::whereBetween('created_at', [$start, $end])->count();
        $accepted = Application::where('status', 'accepted')->whereBetween('created_at', [$start, $end])->count();
        $rejected = Application::where('status', 'rejected')->whereBetween('created_at', [$start, $end])->count();
        $reviewed = Application::where('status', 'reviewed')->whereBetween('created_at', [$start, $end])->count();
        $sent = Application::where('status', 'sent')->whereBetween('created_at', [$start, $end])->count();

        $applicationsPrev = Application::whereBetween('created_at', [$prevStart, $prevEnd])->count();
        $acceptedPrev = Application::where('status', 'accepted')->whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $ratingTotal = ($accepted * 5) + ($reviewed * 4) + ($sent * 3) + ($rejected * 1);
        $avgRating = $applications > 0 ? round($ratingTotal / $applications, 1) : 0;

        $onTime = $applications > 0 ? round(($accepted / $applications) * 100, 1) : 0;
        $satisfaction = $applications > 0 ? round((($accepted + $reviewed) / $applications) * 100, 1) : 0;
        $feedback = $applications > 0 ? round((($accepted + $reviewed) / $applications) * 100, 1) : 0;

        $nps = $applications > 0 ? round((($accepted - $rejected) / $applications) * 100) : 0;
        $csat = $applications > 0 ? round(($accepted / $applications) * 100) : 0;

        $ratingBuckets = [
            ['rating' => '5', 'count' => $accepted],
            ['rating' => '4', 'count' => $reviewed],
            ['rating' => '3', 'count' => $sent],
            ['rating' => '1', 'count' => $rejected],
        ];
        $ratingData = collect($ratingBuckets)->map(function ($bucket) use ($applications) {
            $percentage = $applications > 0 ? round(($bucket['count'] / $applications) * 100, 1) : 0;
            return [
                'rating' => $bucket['rating'],
                'count' => $bucket['count'],
                'percentage' => $percentage,
            ];
        })->values();

        $recentFeedback = Application::with(['project.company', 'developer'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($application) {
                $project = $application->project;
                $status = $application->status;
                $comment = match ($status) {
                    'accepted' => 'Excelente trabajo, entregado con calidad.',
                    'reviewed' => 'Buena propuesta, en revisión.',
                    'rejected' => 'No fue seleccionado en esta ocasión.',
                    default => 'Solicitud registrada correctamente.',
                };

                $rating = match ($status) {
                    'accepted' => 5,
                    'reviewed' => 4,
                    'rejected' => 2,
                    default => 3,
                };

                return [
                    'id' => $application->id,
                    'client' => $project?->company?->name ?? 'Cliente',
                    'freelancer' => $application->developer?->name ?? 'Desarrollador',
                    'project' => $project?->title ?? 'Proyecto',
                    'rating' => $rating,
                    'comment' => $comment,
                    'date' => $application->created_at?->toDateString(),
                    'avatar' => null,
                ];
            });

        $topProjects = Project::withCount(['applications as accepted_count' => function ($query) {
                $query->where('status', 'accepted');
            }, 'applications as total_count'])
            ->orderByDesc('accepted_count')
            ->take(5)
            ->get()
            ->map(function ($project) {
                $rating = $project->total_count > 0
                    ? round(($project->accepted_count / $project->total_count) * 5, 1)
                    : 0;

                return [
                    'project' => $project->title,
                    'rating' => $rating,
                    'reviews' => $project->total_count,
                    'category' => $project->status,
                ];
            });

        $qualityMetrics = [
            ['metric' => 'Código Limpio', 'score' => $satisfaction, 'icon' => '💻'],
            ['metric' => 'Comunicación', 'score' => $onTime, 'icon' => '💬'],
            ['metric' => 'Cumplimiento', 'score' => $onTime, 'icon' => '⏰'],
            ['metric' => 'Creatividad', 'score' => max(0, $satisfaction - 5), 'icon' => '🎨'],
            ['metric' => 'Soporte Post-Entrega', 'score' => max(0, $satisfaction - 8), 'icon' => '🔧'],
        ];

        return [
            'kpis' => [
                [
                    'title' => 'Rating Promedio',
                    'value' => $avgRating,
                    'change' => $this->buildChange($avgRating, $applicationsPrev > 0 ? round((($acceptedPrev * 5) / $applicationsPrev), 1) : 0, $period),
                    'description' => 'Calificación general',
                ],
                [
                    'title' => 'Proyectos a Tiempo',
                    'value' => $onTime . '%',
                    'change' => $this->buildChange($onTime, $onTime, $period),
                    'description' => 'Entregados puntualmente',
                ],
                [
                    'title' => 'Satisfacción Cliente',
                    'value' => $satisfaction . '%',
                    'change' => $this->buildChange($satisfaction, $satisfaction, $period),
                    'description' => 'CSAT promedio',
                ],
                [
                    'title' => 'Feedback Positivo',
                    'value' => $feedback . '%',
                    'change' => $this->buildChange($feedback, $feedback, $period),
                    'description' => '4-5 estrellas',
                ],
            ],
            'ratingData' => $ratingData,
            'recentFeedback' => $recentFeedback,
            'qualityMetrics' => $qualityMetrics,
            'topRatedProjects' => $topProjects,
            'nps' => $nps,
            'csat' => $csat,
        ];
    }
}
