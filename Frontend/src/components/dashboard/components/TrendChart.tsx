import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type LineDefinition = {
  dataKey: string;
  name?: string;
  color?: string;
  strokeWidth?: number;
};

type TrendChartProps<TData extends Record<string, unknown>> = {
  data: TData[];
  title: string;
  description?: string;
  lines?: LineDefinition[];
  valueFormatter?: (value: number) => string;
};

export function TrendChart<TData extends Record<string, unknown>>({
  data,
  title,
  description,
  lines,
  valueFormatter = (value) => value.toLocaleString(),
}: TrendChartProps<TData>) {
  const trendLines =
    lines && lines.length
      ? lines
      : [
          {
            dataKey: "users",
            name: "Usuarios",
            color: "var(--neon-green)",
          },
          {
            dataKey: "projects",
            name: "Proyectos",
            color: "var(--emerald-green)",
          },
        ];

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
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.4}
            />
            <XAxis
              dataKey="month"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
              }}
              formatter={(value) => valueFormatter(Number(value))}
            />
            <Legend />
            {trendLines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color || "var(--primary)"}
                strokeWidth={line.strokeWidth ?? 2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


