import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "../../../contexts/ThemeContext";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type RevenueChartProps<TData extends Record<string, unknown>> = {
  data: TData[];
  title: string;
  description?: string;
  dataKey?: string;
  color?: string;
  formatter?: (value: number) => string;
};

export function RevenueChart<TData extends Record<string, unknown>>({
  data,
  title,
  description,
  dataKey = "revenue",
  color,
  formatter = (value) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value),
}: RevenueChartProps<TData>) {
  const { accentColor } = useTheme();
  const activeColor = color || accentColor;

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={activeColor}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={activeColor}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.4}
            />
            <XAxis
              dataKey="month"
              stroke="var(--muted-foreground)"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
              }}
              formatter={(value) => formatter(Number(value))}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={activeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenue)"
              name="Ingresos"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


