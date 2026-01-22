import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "./ui/utils";

type CountryStat = {
  country: string;
  users: number;
  percentage: number;
  flag?: string;
};

type GeographicMapProps = {
  title: string;
  description?: string;
  data: CountryStat[];
  className?: string;
};

export function GeographicMap({
  title,
  description,
  data,
  className,
}: GeographicMapProps) {
  const maxUsers = Math.max(1, ...data.map((item) => item.users));

  return (
    <Card className={cn("bg-card border-border/50", className)}>
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => (
          <div key={item.country} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 font-medium">
                <span className="text-lg">{item.flag}</span>
                {item.country}
              </div>
              <div className="text-muted-foreground text-xs">
                {item.users.toLocaleString()} usuarios · {item.percentage}%
              </div>
            </div>
            <div className="bg-secondary/40 h-2 rounded-full">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(item.users / maxUsers) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

