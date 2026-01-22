import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type FunnelStep = {
  label: string;
  value: number;
  percentage: number;
  color: string;
};

type FunnelChartProps = {
  title: string;
  description?: string;
  steps: FunnelStep[];
};

export function FunnelChart({ title, description, steps }: FunnelChartProps) {
  const maxValue = Math.max(...steps.map((step) => step.value));

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{step.label}</span>
              <span className="text-muted-foreground">
                {step.value.toLocaleString()} · {step.percentage}%
              </span>
            </div>
            <div className="bg-secondary/30 h-10 rounded-lg">
              <div
                className="h-10 rounded-lg transition-all"
                style={{
                  width: `${(step.value / maxValue) * 100}%`,
                  backgroundColor: step.color,
                }}
              />
            </div>
            {index !== steps.length - 1 ? (
              <div className="text-muted-foreground text-xs">
                Conversión vs etapa anterior:{" "}
                {(() => {
                  const previous = steps[index === 0 ? 0 : index - 1].value || 1;
                  return ((step.value / previous) * 100).toFixed(1);
                })()}
                %
              </div>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

