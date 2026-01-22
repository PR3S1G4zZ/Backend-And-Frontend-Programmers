import { type ReactNode } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "./ui/utils";

type KPIChange = {
  value: number;
  isPositive: boolean;
  period: string;
};

type KPICardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  change?: KPIChange;
  trendLabel?: string;
  className?: string;
};

export function KPICard({
  title,
  value,
  description,
  icon,
  change,
  trendLabel,
  className,
}: KPICardProps) {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;
  const trend =
    change &&
    `${change.isPositive ? "+" : "-"}${Math.abs(change.value).toFixed(1)}%`;

  return (
    <Card className={cn("bg-card border-border/50", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        {icon ? (
          <div className="text-primary flex size-9 items-center justify-center rounded-full bg-primary/10">
            {icon}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {formattedValue}
          </p>
          {description ? (
            <p className="text-muted-foreground text-xs">{description}</p>
          ) : null}
        </div>
        {change ? (
          <div className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "flex items-center gap-1 font-medium",
                change.isPositive ? "text-emerald-500" : "text-red-500",
              )}
            >
              {change.isPositive ? (
                <ArrowUpIcon className="size-3.5" />
              ) : (
                <ArrowDownIcon className="size-3.5" />
              )}
              {trend}
            </span>
            <span className="text-muted-foreground text-xs">
              vs {change.period}
              {trendLabel ? ` (${trendLabel})` : ""}
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

