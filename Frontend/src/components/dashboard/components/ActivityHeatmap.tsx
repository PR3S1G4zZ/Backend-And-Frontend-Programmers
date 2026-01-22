import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type HeatmapRow = {
  day: string;
  hours: number[];
};

type ActivityHeatmapProps = {
  title: string;
  description?: string;
  data: HeatmapRow[];
};

const HOURS = Array.from({ length: 24 }, (_, index) => index);

export function ActivityHeatmap({
  title,
  description,
  data,
}: ActivityHeatmapProps) {
  const values = data.flatMap((row) => row.hours ?? []);
  const max = values.length ? Math.max(...values) : 0;

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4 overflow-x-auto">
        <div className="min-w-[640px] space-y-2">
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
          <div className="space-y-3">
            {data.map((row) => (
              <div key={row.day} className="flex items-center gap-2 text-xs">
                <span className="w-10 text-right font-medium">{row.day}</span>
                <div className="flex flex-1 gap-1">
                  {HOURS.map((hourIndex) => {
                    const intensity = row.hours[hourIndex] ?? 0;
                    const alpha = max ? intensity / max : 0;
                    return (
                      <div
                        key={`${row.day}-${hourIndex}`}
                        className="h-6 w-full rounded-sm transition-colors"
                        style={{
                          backgroundColor: `rgba(16, 185, 129, ${alpha * 0.9})`,
                        }}
                        title={`${row.day} ${hourIndex}:00 - ${intensity} eventos`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

