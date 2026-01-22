# Dashboard Administrativo - Programmers

## 📁 Estructura Reorganizada

```
src/components/dashboard/
├── components/
│   ├── admin/                    # Dashboards específicos del admin
│   │   ├── ActivityDashboard.tsx     # Dashboard de actividad
│   │   ├── FinancialDashboard.tsx    # Dashboard financiero
│   │   ├── GrowthDashboard.tsx       # Dashboard de crecimiento
│   │   ├── ProjectsDashboard.tsx     # Dashboard de proyectos
│   │   └── SatisfactionDashboard.tsx # Dashboard de satisfacción
│   ├── ui/                      # Componentes UI reutilizables
│   ├── ActivityHeatmap.tsx      # Mapa de calor de actividad
│   ├── AlertsPanel.tsx          # Panel de alertas
│   ├── CircularGauge.tsx        # Medidores circulares
│   ├── DashboardLayout.tsx      # Layout base del dashboard
│   ├── FunnelChart.tsx          # Gráficos de embudo
│   ├── GeographicMap.tsx        # Mapas geográficos
│   ├── KPICard.tsx             # Tarjetas KPI
│   ├── RevenueChart.tsx        # Gráficos de ingresos
│   └── TrendChart.tsx          # Gráficos de tendencias
├── utils/
│   └── mockDataGenerator.ts    # Generador de datos de prueba
├── company/                    # Componentes específicos de empresa
├── programmer/                 # Componentes específicos de programador
├── figma/                      # Recursos de diseño
└── ChatSection.tsx            # Sección de chat
```

## 🎨 Características

- **Tema Oscuro**: Diseño consistente con colores Programmers (#0D0D0D, #00FF85)
- **Animaciones**: Efectos glow-text y transiciones suaves
- **Componentes Reutilizables**: UI components en `/components/ui/`
- **Dashboards Modulares**: Cada sección del admin es un componente independiente
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla

## 🚀 Funcionalidades

### Dashboard Principal
- **Actividad**: Mapas de calor, métricas de engagement, tendencias
- **Financiero**: Ingresos, gastos, proyecciones
- **Crecimiento**: KPIs de crecimiento, análisis de tendencias
- **Proyectos**: Gestión y métricas de proyectos
- **Satisfacción**: Métricas de usuario, feedback

### Navegación
- Sidebar con secciones: Dashboard, Usuarios, Proyectos, Analíticas, Configuración
- Sistema de pestañas para diferentes vistas del dashboard
- Selector de período (Día, Semana, Mes, Año)

## 🛠️ Tecnologías

- **React + TypeScript**: Componentes tipados
- **Tailwind CSS**: Estilos utilitarios
- **Recharts**: Gráficos y visualizaciones
- **Lucide Icons**: Iconografía consistente
- **shadcn/ui**: Componentes UI de calidad

## 📦 Componentes Clave

### AdminDashboard.tsx
Componente principal que orquesta toda la interfaz del admin:
- Manejo de estado de navegación
- Renderizado condicional de secciones
- Integración con sidebar y alertas

### Dashboards Especializados
Cada dashboard tiene su propia lógica y componentes:
- **ActivityDashboard**: Métricas de usuario y engagement
- **FinancialDashboard**: Análisis financiero y proyecciones
- **GrowthDashboard**: KPIs de crecimiento
- **ProjectsDashboard**: Gestión de proyectos
- **SatisfactionDashboard**: Métricas de satisfacción

## 🎯 Beneficios de la Reorganización

1. **Eliminación de código duplicado**
2. **Estructura modular y mantenible**
3. **Componentes reutilizables**
4. **Separación clara de responsabilidades**
5. **Fácil escalabilidad para nuevas funcionalidades**

## 🔧 Mantenimiento

- Los estilos globales están en `src/styles/Styles/global.css`
- Variables CSS personalizadas para colores y animaciones
- Componentes UI centralizados en `/components/ui/`
- Utilidades en `/utils/` para datos y helpers