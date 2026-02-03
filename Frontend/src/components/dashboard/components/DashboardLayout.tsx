import { type ReactNode } from "react";
import {
  Activity,
  BarChart3,
  Briefcase,
  Gauge,
  LayoutDashboard,
  PiggyBank,
  Smile,
  Users,
} from "lucide-react";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { cn } from "./ui/utils";

export type DashboardPage =
  | "executive"
  | "growth"
  | "activity"
  | "projects"
  | "financial"
  | "satisfaction";

const NAV_ITEMS: Array<{
  id: DashboardPage;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
}> = [
  {
    id: "executive",
    label: "Ejecutivo",
    description: "Resumen general",
    icon: LayoutDashboard,
  },
  {
    id: "growth",
    label: "Crecimiento",
    description: "Nuevos usuarios",
    icon: Users,
  },
  {
    id: "activity",
    label: "Actividad",
    description: "Engagement",
    icon: Activity,
  },
  {
    id: "projects",
    label: "Proyectos",
    description: "Estados y embudos",
    icon: Briefcase,
  },
  {
    id: "financial",
    label: "Finanzas",
    description: "Ingresos y GMV",
    icon: PiggyBank,
  },
  {
    id: "satisfaction",
    label: "Satisfacción",
    description: "NPS y calidad",
    icon: Smile,
  },
];

const PERIODS = [
  { id: "day", label: "Día" },
  { id: "week", label: "Semana" },
  { id: "month", label: "Mes" },
  { id: "year", label: "Año" },
];

type DashboardLayoutProps = {
  currentPage: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
  title: string;
  subtitle: string;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  children: ReactNode;
};

export function DashboardLayout({
  currentPage,
  onPageChange,
  title,
  subtitle,
  selectedPeriod,
  onPeriodChange,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Gauge className="text-primary size-4" />
              Panel de control integral
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  {title}
                </h1>
                <p className="text-muted-foreground text-sm">{subtitle}</p>
              </div>
              <ToggleGroup
                type="single"
                value={selectedPeriod}
                onValueChange={(value) => value && onPeriodChange(value)}
                variant="outline"
                size="sm"
                className="bg-muted/40 text-foreground"
              >
                {PERIODS.map((period) => (
                  <ToggleGroupItem
                    key={period.id}
                    value={period.id}
                    aria-label={`Cambiar a ${period.label}`}
                  >
                    {period.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <nav className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === currentPage;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "border-border/60 flex w-full items-center justify-between rounded-xl border p-4 text-left shadow-sm transition",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-card hover:bg-card/80",
                  )}
                  onClick={() => onPageChange(item.id)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full border bg-background/70",
                        isActive
                          ? "border-white/30 text-primary-foreground"
                          : "border-border text-primary",
                      )}
                    >
                      <item.icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-tight">
                        {item.label}
                      </p>
                      <p
                        className={cn(
                          "text-muted-foreground text-xs",
                          isActive && "text-white/80",
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {isActive ? (
                    <BarChart3 className="size-4 text-primary-foreground/70" />
                  ) : (
                    <Activity className="size-4 text-muted-foreground" />
                  )}
                </Button>
              );
            })}
          </nav>
        </header>

        <Card className="bg-transparent border-none shadow-none">
          <div className="space-y-6">{children}</div>
        </Card>
      </div>
    </div>
  );
}

