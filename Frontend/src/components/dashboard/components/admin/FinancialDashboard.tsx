import { KPICard } from "../KPICard";
import { RevenueChart } from "../RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { generateTimeSeriesData } from "../../utils/mockDataGenerator";
import type { TimeSeriesData } from "../../utils/mockDataGenerator";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Receipt 
} from "lucide-react";

interface FinancialDashboardProps {
  selectedPeriod: string;
}

// Revenue sources data - remains relatively stable
const revenueSourcesData = [
  { name: "Comisión por Proyecto", value: 65, amount: 59800, color: "var(--color-neon-green)" },
  { name: "Suscripciones Premium", value: 25, amount: 23000, color: "var(--color-emerald-green)" },
  { name: "Publicidad", value: 7, amount: 6440, color: "var(--color-chart-3)" },
  { name: "Servicios Adicionales", value: 3, amount: 2760, color: "var(--color-chart-4)" }
];

const recentTransactions = [
  {
    id: "TXN001",
    type: "Comisión",
    description: "Proyecto E-commerce Platform",
    amount: 250,
    client: "TechCorp Inc.",
    date: "2024-01-08",
    status: "Completado"
  },
  {
    id: "TXN002",
    type: "Suscripción",
    description: "Plan Premium - StartupXYZ",
    amount: 99,
    client: "StartupXYZ",
    date: "2024-01-08",
    status: "Completado"
  },
  {
    id: "TXN003",
    type: "Comisión",
    description: "Mobile App iOS",
    amount: 160,
    client: "AppMakers Ltd",
    date: "2024-01-07",
    status: "Pendiente"
  },
  {
    id: "TXN004",
    type: "Publicidad",
    description: "Banner Homepage - Q1",
    amount: 500,
    client: "AdTech Solutions",
    date: "2024-01-07",
    status: "Completado"
  },
  {
    id: "TXN005",
    type: "Comisión",
    description: "Landing Page Design",
    amount: 75,
    client: "Marketing Pro",
    date: "2024-01-06",
    status: "Completado"
  }
];

const getTransactionBadge = (status: string) => {
  switch (status) {
    case "Completado":
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completado</Badge>;
    case "Pendiente":
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendiente</Badge>;
    case "Fallido":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Fallido</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Comisión":
      return <DollarSign className="w-4 h-4 text-primary" />;
    case "Suscripción":
      return <CreditCard className="w-4 h-4 text-emerald-400" />;
    case "Publicidad":
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    default:
      return <Receipt className="w-4 h-4 text-gray-400" />;
  }
};

function generateFinancialKPIs(period: string) {
  const multipliers = {
    day: { revenue: 0.03, transactions: 0.05, gmv: 0.03 },
    week: { revenue: 0.25, transactions: 0.2, gmv: 0.25 },
    month: { revenue: 1, transactions: 1, gmv: 1 },
    year: { revenue: 12, transactions: 12, gmv: 12 }
  };

  const mult = multipliers[period as keyof typeof multipliers] || multipliers.month;
  
  const revenue = Math.floor(92000 * mult.revenue);
  const transactions = Math.floor(1847 * mult.transactions);
  const gmv = Math.floor(1200000 * mult.gmv);
  const avgTicket = Math.floor(650 * (mult.revenue / mult.transactions));

  return [
    {
      title: "Ingresos Netos",
      value: `$${revenue.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      change: { value: 18.4 + (Math.random() - 0.5) * 15, isPositive: true, period: getPeriodLabel(period) },
      description: `Ingresos este ${period === 'day' ? 'día' : period === 'week' ? 'semana' : period === 'year' ? 'año' : 'mes'}`
    },
    {
      title: "GMV Total",
      value: gmv >= 1000000 ? `$${(gmv / 1000000).toFixed(1)}M` : `$${(gmv / 1000).toFixed(0)}K`,
      icon: <TrendingUp className="w-5 h-5" />,
      change: { value: 22.1 + (Math.random() - 0.5) * 18, isPositive: true, period: getPeriodLabel(period) },
      description: "Valor bruto de mercancías"
    },
    {
      title: "Transacciones",
      value: transactions.toLocaleString(),
      icon: <Receipt className="w-5 h-5" />,
      change: { value: 15.7 + (Math.random() - 0.5) * 12, isPositive: true, period: getPeriodLabel(period) },
      description: `Total este ${period === 'day' ? 'día' : period === 'week' ? 'semana' : period === 'year' ? 'año' : 'mes'}`
    },
    {
      title: "Ticket Promedio",
      value: `$${avgTicket.toLocaleString()}`,
      icon: <CreditCard className="w-5 h-5" />,
      change: { value: 8.3 + (Math.random() - 0.5) * 10, isPositive: true, period: getPeriodLabel(period) },
      description: "Por transacción"
    }
  ];
}

function getPeriodLabel(period: string): string {
  switch (period) {
    case 'day': return 'día anterior';
    case 'week': return 'semana anterior';
    case 'month': return 'mes anterior';
    case 'year': return 'año anterior';
    default: return 'período anterior';
  }
}

export function FinancialDashboard({ selectedPeriod }: FinancialDashboardProps) {
  const timeSeriesData = generateTimeSeriesData(selectedPeriod);
  const kpiData = generateFinancialKPIs(selectedPeriod);
  
  // Transform time series data for revenue chart
  const revenueData = timeSeriesData.map((item: TimeSeriesData) => ({
    month: item.period,
    revenue: item.revenue || 0
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            change={kpi.change}
            description={kpi.description}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenueChart 
          data={revenueData}
          title="Evolución de Ingresos"
          description={`Ingresos por ${selectedPeriod === 'day' ? 'horas' : selectedPeriod === 'week' ? 'días' : selectedPeriod === 'year' ? 'años' : 'meses'}`}
        />

        {/* Revenue Sources Pie Chart */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Fuentes de Ingresos</CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribución de ingresos por tipo
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueSourcesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)', 
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-foreground)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => {
                    const numericValue = typeof value === "number" ? value : Number(value ?? 0);
                    const source = revenueSourcesData.find((item) => item.name === name);
                    const amountLabel = source ? `$${source.amount.toLocaleString()}` : "$0";
                    return [`${numericValue}% (${amountLabel})`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Transacciones Recientes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Últimas transacciones procesadas
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(transaction.type)}
                      <span>{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.client}</TableCell>
                  <TableCell className="font-medium text-primary">
                    ${transaction.amount}
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{getTransactionBadge(transaction.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
