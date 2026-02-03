import { BellRingIcon, ShieldCheckIcon, TriangleAlertIcon } from "lucide-react";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

const alerts = [
  {
    id: 1,
    title: "Proyectos en riesgo",
    description: "Hay 3 proyectos con entregas demoradas más de 5 días.",
    severity: "alto",
    icon: TriangleAlertIcon,
  },
  {
    id: 2,
    title: "Pagos pendientes",
    description: "12 transacciones requieren aprobación manual.",
    severity: "medio",
    icon: BellRingIcon,
  },
  {
    id: 3,
    title: "Certificaciones",
    description: "5 freelancers completaron la validación KYC hoy.",
    severity: "bajo",
    icon: ShieldCheckIcon,
  },
];

const severityClass: Record<string, string> = {
  alto: "text-red-500 bg-red-500/10",
  medio: "text-amber-500 bg-amber-500/10",
  bajo: "text-emerald-500 bg-emerald-500/10",
};

export function AlertsPanel() {
  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BellRingIcon className="text-primary size-4" />
            Alertas
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Eventos que requieren atención
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {alerts.length} activos
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert, index) => (
          <div key={alert.id} className="space-y-3">
            <div className="flex items-start gap-3">
              <span
                className={`rounded-lg p-2 ${severityClass[alert.severity]}`}
              >
                <alert.icon className="size-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {alert.title}
                </p>
                <p className="text-muted-foreground text-xs">
                  {alert.description}
                </p>
              </div>
            </div>
            {index !== alerts.length - 1 ? <Separator /> : null}
          </div>
        ))}
        <Button variant="outline" className="w-full">
          Ver historial
        </Button>
      </CardContent>
    </Card>
  );
}


