import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type CircularGaugeProps = {
  value: number;
  maxValue: number;
  unit?: string;
  title: string;
  description?: string;
  color?: string;
};

export function CircularGauge({
  value,
  maxValue,
  unit,
  title,
  description,
  color = "var(--neon-green)",
}: CircularGaugeProps) {
  const safeMax = maxValue === 0 ? 1 : maxValue;
  const percentage = Math.min(100, Math.max(0, (value / safeMax) * 100));
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative h-64 w-64">
          <svg className="h-full w-full" viewBox="0 0 300 300">
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="var(--border)"
              strokeWidth="16"
              fill="none"
              opacity={0.4}
            />
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke={color}
              strokeWidth="20"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 150 150)"
            />
            <text
              x="150"
              y="150"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="48"
              fontWeight="600"
              fill="var(--foreground)"
              opacity="0"
            >
            </text>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="text-muted-foreground text-xs">Progreso</span>
            <span className="text-3xl font-semibold text-foreground">
              {Math.round(percentage)}%
            </span>
            <span className="text-muted-foreground text-xs">
              {value} de {safeMax}{unit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

