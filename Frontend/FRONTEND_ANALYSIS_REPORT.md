# 📱 Informe de Análisis Frontend - Plataforma Freelancers
> Actualizado: 24 de Febrero de 2026

---

## 🔴 PROBLEMA CRÍTICO #1: KanbanBoard - Scroll Bloqueado y Acceso Imposible

### Causa Raíz Identificada

El problema **NO es del KanbanBoard en sí**, sino en la cadena de contenedores que lo envuelven.

#### Problema A: `overflow-hidden` en Workspace.tsx (BLOQUEANTE)

**Archivo:** [`Workspace.tsx`](Frontend/src/components/dashboard/shared/Workspace.tsx:83)

```tsx
// ❌ LÍNEA 83 - overflow-hidden bloquea COMPLETAMENTE el scroll
<div className="flex-1 mt-4 min-h-0 overflow-hidden">
    <KanbanBoard ... />
</div>
```

Este `overflow-hidden` hace que cualquier contenido del KanbanBoard que exceda la altura disponible quede **cortado e inaccesible**. El usuario no puede ni scrollear dentro del kanban ni ver las columnas que salen del viewport.

#### Problema B: KanbanBoard sin scroll horizontal

**Archivo:** [`KanbanBoard.tsx`](Frontend/src/components/dashboard/shared/KanbanBoard.tsx:335)

```tsx
// ❌ LÍNEA 335 - Sin overflow-x-auto para las 4 columnas
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-4 h-full relative">
```

Con 4 columnas de 280px mínimo cada una (`min-w-[280px]` en línea 198), en pantallas medianas (md:grid-cols-2) las columnas 3 y 4 quedan ocultas sin scroll horizontal posible.

#### Problema C: Altura calculada incorrectamente en `ColumnWithPagination`

```tsx
// ❌ LÍNEA 204 - maxHeight con calc(100vh - 300px) dentro de overflow-hidden no funciona
<div className="flex-1 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
```

**La cadena completa de errores:**
```
ProgrammerDashboard → <div className="flex-1 overflow-auto">     ← scroll aquí
  Workspace → <div className="h-full flex flex-col">             ← ocupa toda la altura
    → <div className="flex-1 flex flex-col min-h-0">
      → <div className="flex-1 mt-4 min-h-0 overflow-hidden">   ← ❌ CORTA EL CONTENIDO
        → KanbanBoard (contenido invisible e inaccesible)
```

### ✅ Correcciones Requeridas

**1. En Workspace.tsx - Cambiar overflow-hidden a overflow-auto:**

```tsx
// ANTES (línea 83):
<div className="flex-1 mt-4 min-h-0 overflow-hidden">

// DESPUÉS:
<div className="flex-1 mt-4 min-h-0 overflow-auto">
```

**2. En KanbanBoard.tsx - Agregar overflow-x-auto al grid:**

```tsx
// ANTES (línea 335):
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-4 h-full relative">

// DESPUÉS:
<div className="overflow-x-auto">
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-4 min-h-full min-w-max xl:min-w-0">
```

**3. En Workspace.tsx - El Workspace completo también necesita overflow visible:**

```tsx
// ANTES (línea 52):
<div className="h-full flex flex-col p-4 sm:p-6 space-y-4">

// DESPUÉS:
<div className="flex flex-col p-4 sm:p-6 space-y-4">
```
> Nota: Quitar `h-full` para que el scroll del contenedor padre (el dashboard) funcione correctamente.

---

## 🔴 PROBLEMA CRÍTICO #2: Botón de Configuración Duplicado en Sidebar

**Archivo:** [`Sidebar.tsx`](Frontend/src/components/Sidebar.tsx:162)

El sidebar tiene un botón de **"Configuración" hardcodeado** en la sección inferior (líneas 162-168) que NO hace nada funcional:

```tsx
// ❌ LÍNEAS 162-168 - Botón inactivo duplicado (NO tiene onClick)
<Button
    variant="ghost"
    className="w-full justify-start text-sidebar-foreground/70 ..."
>
    <Settings className="h-5 w-5 mr-3" />
    Configuración   {/* ← No tiene onClick, no navega a ningún lado */}
</Button>
```

Esto además ya existe como item en las listas de secciones navegables (línea 44 para programmer, 54 para company, 63 para admin). El botón del fondo del sidebar está ahí pero es **completamente inoperante**.

**Corrección:** Eliminar el botón de Configuración del área inferior del sidebar (líneas 161-168).

---

## 🔴 PROBLEMA CRÍTICO #3: Programmer sin acceso a Wallet desde Sidebar

**Archivo:** [`Sidebar.tsx`](Frontend/src/components/Sidebar.tsx:37)

El `programmerSections` NO incluye la sección `wallet`:

```tsx
const programmerSections = [
    { id: 'welcome', label: 'Mi Espacio', icon: Home },
    { id: 'projects-active', label: 'Proyectos Activos', icon: Code },
    { id: 'portfolio', label: 'Mi Portafolio', icon: FolderOpen },
    { id: 'projects', label: 'Proyectos Publicados', icon: Search },
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'settings', label: 'Configuración', icon: Settings }
    // ❌ FALTA: { id: 'wallet', label: 'Billetera & Cobros', icon: Wallet }
];
```

Sin embargo, [`ProgrammerDashboard.tsx`](Frontend/src/components/ProgrammerDashboard.tsx:78) sí tiene el case `wallet`:

```tsx
case 'wallet':
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Billetera & Cobros</h2>
            <WalletPaymentMethods userType="programmer" />
        </div>
    );
```

El case existe pero **no hay forma de navegar a él desde el sidebar**. Solo se puede acceder si el WelcomeSection tiene un botón que lo invoque.

**Corrección:** Agregar en `programmerSections`:
```tsx
{ id: 'wallet', label: 'Billetera & Cobros', icon: Wallet }
```

---

## 🔴 PROBLEMA CRÍTICO #4: Sin Protección de Rutas (Seguridad)

**Archivo:** [`App.tsx`](Frontend/src/App.tsx:113)

```tsx
// ❌ LÍNEAS 115-125 - Cualquier usuario puede navegar a cualquier dashboard
const handleNavigate = (page: string) => {
    if (page === 'programmer-dashboard' || ...) {
        const userTypeMap = {
            'programmer-dashboard': 'programmer',  // ← Solo cambia el tipo de UI
            'company-dashboard': 'company',
        };
        setUserType(userTypeMap[page] || 'guest');
        setCurrentPage(page as PageType);
    }
};
```

Problemas:
1. **No verifica si el usuario está autenticado** antes de navegar a un dashboard
2. **No verifica el rol del usuario**: Una empresa podría ver el dashboard de programmer
3. **El tipo de usuario se establece por la URL**, no por el JWT del servidor

**Corrección Requerida:**

```tsx
const handleNavigate = (page: string) => {
    const protectedPages = ['programmer-dashboard', 'company-dashboard', 'admin-dashboard'];
    
    if (protectedPages.includes(page)) {
        if (!user) {
            setCurrentPage('login');
            return;
        }
        
        // Verificar que el usuario puede acceder a ese dashboard
        const allowedDashboard = dashboardByRole[user.user_type as Exclude<UserType, 'guest'>];
        if (page !== allowedDashboard) {
            setCurrentPage(allowedDashboard);  // Redirigir al dashboard correcto
            return;
        }
    }
    // ... resto de la lógica
};
```

---

## 🔴 PROBLEMA CRÍTICO #5: CompanyDashboard sin WalletProvider para Workspace

**Archivo:** [`CompanyDashboard.tsx`](Frontend/src/components/CompanyDashboard.tsx:190)

El `CompanyDashboard` tiene `WalletProvider` en el nivel raíz, pero cuando navega al `Workspace`, los componentes dentro del Workspace usan `apiClient` directamente. Sin embargo, si alguno de los componentes del Workspace o MilestoneTimeline intenta usar el `WalletContext`, fallará porque el contexto solo está disponible dentro del `CompanyDashboard` (el workspace es un hijo, así que SÍ tiene acceso, esto no es crítico en sí).

El **verdadero problema** es que el `ProgrammerDashboard` **NO tiene WalletProvider**:

```tsx
// ProgrammerDashboard.tsx línea 111
return (
    <div className="flex h-screen bg-background text-foreground">  {/* ← Sin WalletProvider */}
        <Sidebar ... />
        <div className="flex-1 overflow-auto">
            {renderSection()}  {/* ← WalletPaymentMethods se renderiza aquí */}
        </div>
    </div>
);
```

Y el componente `WalletPaymentMethods` para programmer importa desde `contexts/WalletContext`:

```tsx
// ❌ WalletBalance podría necesitar WalletContext
import { WalletProvider } from '../contexts/WalletContext';
```

Si `WalletPaymentMethods` o `WalletBalance` consumen el `WalletContext`, el Programmer no tiene ese contexto disponible.

---

## 🟡 PROBLEMA MEDIO #6: MilestoneTimeline - Tipo de usuario incorrecto para `useMilestoneActions`

**Archivo:** [`useMilestoneActions.ts`](Frontend/src/hooks/useMilestoneActions.ts:19)

```tsx
// El hook acepta userType pero no lo usa
export function useMilestoneActions({ projectId, onUpdate }: UseMilestoneActionsProps) {
// ❌ userType se destruye en la firma pero no se usa en ninguna función del hook
```

La interfaz `UseMilestoneActionsProps` declara `userType: 'programmer' | 'company'` pero el hook no lo destructura ni usa (línea 19):
```tsx
export function useMilestoneActions({ projectId, onUpdate }: UseMilestoneActionsProps) {
//                                   ❌ userType no aparece aquí
```

Esto significa que las acciones del hook no diferencian comportamiento por rol.

---

## 🟡 PROBLEMA MEDIO #7: MilestoneTimeline - Solo muestra botón "Entregar" para estados incorrectos

**Archivo:** [`MilestoneTimeline.tsx`](Frontend/src/components/dashboard/shared/MilestoneTimeline.tsx:270)

```tsx
// ❌ Lógica incorrecta: solo oculta para 'completed' y 'review', pero debería mostrar
// solo para estado 'todo' o 'in_progress' para que el programador inicie el hito primero
{userType === 'programmer' && milestone.progress_status !== 'completed' && milestone.progress_status !== 'review' && (
    <Button onClick={() => openSubmitDialog(milestone)}>
        <Upload className="h-3 w-3 mr-2" />
        Entregar
    </Button>
)}
```

Permite al programmer "entregar" un hito que está en `todo` (pendiente) sin haberlo iniciado primero. Debería requerir que esté `in_progress`.

**Corrección:**
```tsx
{userType === 'programmer' && milestone.progress_status === 'in_progress' && (
```

---

## 🟡 PROBLEMA MEDIO #8: ChatSection - Memory Leak con Polling

**Archivo:** [`ChatSection.tsx`](Frontend/src/components/dashboard/ChatSection.tsx)

El componente usa polling con `setInterval` sin cleanup adecuado. Si el intervalo no se limpia correctamente al desmontar el componente, puede causar memory leaks y llamadas API innecesarias después de navegar a otra sección.

```tsx
// ❌ Polling sin cleanup robusto
useEffect(() => {
    const intervalId = setInterval(loadMessages, 3000);
    return () => clearInterval(intervalId);  // ← Puede no ejecutarse si hay re-renders
}, [selectedContact]);
```

---

## 🟡 PROBLEMA MEDIO #9: ProjectsSection - Filtrado sin useMemo

**Archivo:** [`ProjectsSection.tsx`](Frontend/src/components/dashboard/programmer/ProjectsSection.tsx)

El filtrado de proyectos se recalcula en cada render sin memoización, causando degradación de rendimiento con datasets grandes.

```tsx
// ❌ Se ejecuta en CADA render
const filteredProjects = projects.filter(project => { ... });

// ✅ Corrección con useMemo
const filteredProjects = useMemo(() => projects.filter(project => { ... }), 
    [projects, searchQuery, ...filters]
);
```

---

## 🟡 PROBLEMA MEDIO #10: SearchProgrammersSection - Sin paginación en resultados

**Archivo:** [`SearchProgrammersSection.tsx`](Frontend/src/components/dashboard/company/SearchProgrammersSection.tsx)

Renderiza todos los desarrolladores sin paginación. Con muchos resultados, el DOM se llena y la UI se vuelve lenta.

---

## 🟡 PROBLEMA MEDIO #11: AdminDashboard - Dashboard sin verificación de rol Admin

**Archivo:** [`AdminDashboard.tsx`](Frontend/src/components/AdminDashboard.tsx)

El `AdminDashboard` no verifica en ningún momento que el usuario autenticado sea realmente un admin. Cualquiera que llegue a esta página (por manipulación del state) verá el dashboard.

```tsx
// ❌ Sin verificación de rol
export function AdminDashboard({ onLogout }: AdminDashboardProps) {
    const { user } = useAuth();
    // No hay: if (user?.user_type !== 'admin') return <Redirect to="/login" />;
```

---

## 🟡 PROBLEMA MEDIO #12: MyProjectsSection - Estado stale en setProjects

**Archivo:** [`MyProjectsSection.tsx`](Frontend/src/components/dashboard/company/MyProjectsSection.tsx)

```tsx
// ❌ Usa variable externa en setter (estado stale)
setProjects(projects.filter(p => p.id !== projectId));

// ✅ Corrección con functional update
setProjects(prev => prev.filter(p => p.id !== projectId));
```

---

## 🟡 PROBLEMA MEDIO #13: UserManagement - Estado stale en actualización de usuarios

**Archivo:** [`UserManagement.tsx`](Frontend/src/components/dashboard/components/UserManagement.tsx)

```tsx
// ❌ Usa variable externa en setter
setUsers(users.map(user => user.id === selectedUser.id ? response.user : user));

// ✅ Corrección
setUsers(prevUsers => prevUsers.map(user =>
    user.id === selectedUser.id ? response.user : user
));
```

---

## 🟡 PROBLEMA MEDIO #14: ProfileSection - calculateProfileCompletion llamado múltiples veces

**Archivo:** [`ProfileSection.tsx`](Frontend/src/components/dashboard/programmer/ProfileSection.tsx)

La función `calculateProfileCompletion()` se llama 3+ veces en el render en lugar de calcularse una vez con `useMemo`.

---

## 🟡 PROBLEMA MEDIO #15: ProjectsManagement - Sin debounce en búsqueda

**Archivo:** [`ProjectsManagement.tsx`](Frontend/src/components/dashboard/components/admin/ProjectsManagement.tsx)

`handleSearch` lanza una llamada API en cada keystroke sin debounce de 300-500ms, causando múltiples requests innecesarios.

---

## 🟡 PROBLEMA MEDIO #16: Workspace - MilestoneTimeline NO acepta userType Admin

**Archivos:**
- [`MilestoneTimeline.tsx`](Frontend/src/components/dashboard/shared/MilestoneTimeline.tsx:38) - `userType: 'programmer' | 'company'`
- [`KanbanBoard.tsx`](Frontend/src/components/dashboard/shared/KanbanBoard.tsx:23) - `userType: 'programmer' | 'company'`

Si en el futuro un Admin necesita ver el workspace de un proyecto, los tipos TypeScript causarán un error de compilación.

---

## 🟠 PROBLEMA BAJO #17: Sidebar - Admin usa ícono incorrecto en Analytics

**Archivo:** [`Sidebar.tsx`](Frontend/src/components/Sidebar.tsx:61)

```tsx
{ id: 'analytics', label: 'Analíticas', icon: Search },
// ❌ El ícono Search no representa "Analíticas", debería ser BarChart3 o TrendingUp
```

---

## 🟠 PROBLEMA BAJO #18: CompanyDashboard - 'notifications' es placeholder

**Archivo:** [`CompanyDashboard.tsx`](Frontend/src/components/CompanyDashboard.tsx:149)

```tsx
case 'notifications':
    return <div className="text-white p-8">Notificaciones (Próximamente)</div>;
```

Está en el router pero no está implementado. Si el sidebar no lo muestra, bien, pero si hay un link que navega aquí, el usuario verá una página vacía.

---

## 🟠 PROBLEMA BAJO #19: ProgrammerDashboard - WelcomeSection importada pero no tiene wallet link directo

El programmer puede acceder a su wallet pero solo si el WelcomeSection tiene un shortcut. El sidebar no lo muestra (ver Problema #3).

---

## 🟠 PROBLEMA BAJO #20: Workspace - Proyecto se carga con `@ts-ignore`

**Archivo:** [`Workspace.tsx`](Frontend/src/components/dashboard/shared/Workspace.tsx:37)

```tsx
// @ts-ignore
const data = response.data || response;
```

El `@ts-ignore` suprime un error de TypeScript que indica un problema real de tipado en la respuesta de la API.

---

## 📊 RESUMEN DE PROBLEMAS

| Prioridad | # | Descripción | Archivo | Corrección |
|-----------|---|-------------|---------|-----------|
| 🔴 CRÍTICO | 1 | Kanban no scrollable - `overflow-hidden` | `Workspace.tsx:83` | Cambiar a `overflow-auto` |
| 🔴 CRÍTICO | 1b | Kanban sin scroll horizontal | `KanbanBoard.tsx:335` | Agregar `overflow-x-auto` |
| 🔴 CRÍTICO | 2 | Botón Configuración duplicado e inactivo | `Sidebar.tsx:162` | Eliminar botón del footer |
| 🔴 CRÍTICO | 3 | Programmer sin Wallet en Sidebar | `Sidebar.tsx:37` | Agregar `wallet` a `programmerSections` |
| 🔴 CRÍTICO | 4 | Sin protección de rutas por rol | `App.tsx:113` | Verificar `user.user_type` antes de navegar |
| 🔴 CRÍTICO | 5 | ProgrammerDashboard sin WalletProvider | `ProgrammerDashboard.tsx:111` | Envolver con `WalletProvider` |
| 🟡 MEDIO | 6 | `useMilestoneActions` no usa `userType` | `useMilestoneActions.ts:19` | Destructurar y usar el prop |
| 🟡 MEDIO | 7 | "Entregar" disponible en estado `todo` | `MilestoneTimeline.tsx:270` | Limitar a `in_progress` solo |
| 🟡 MEDIO | 8 | ChatSection polling sin cleanup robusto | `ChatSection.tsx` | Agregar `isMounted` guard |
| 🟡 MEDIO | 9 | Filtrado sin useMemo en ProjectsSection | `ProjectsSection.tsx` | Agregar `useMemo` |
| 🟡 MEDIO | 10 | Sin paginación en SearchProgrammersSection | `SearchProgrammersSection.tsx` | Agregar paginación virtual |
| 🟡 MEDIO | 11 | AdminDashboard sin verificación de rol | `AdminDashboard.tsx` | Verificar `user.user_type === 'admin'` |
| 🟡 MEDIO | 12 | Estado stale en MyProjectsSection | `MyProjectsSection.tsx` | Usar functional update |
| 🟡 MEDIO | 13 | Estado stale en UserManagement | `UserManagement.tsx` | Usar functional update |
| 🟡 MEDIO | 14 | calculateProfileCompletion repetido | `ProfileSection.tsx` | Usar `useMemo` |
| 🟡 MEDIO | 15 | Sin debounce en búsqueda de admin | `ProjectsManagement.tsx` | Agregar debounce 300ms |
| 🟡 MEDIO | 16 | Tipos incompatibles con Admin en Workspace | `MilestoneTimeline.tsx`, `KanbanBoard.tsx` | Ampliar tipos |
| 🟠 BAJO | 17 | Ícono incorrecto en Admin Analytics | `Sidebar.tsx:61` | Cambiar a `BarChart3` |
| 🟠 BAJO | 18 | 'notifications' es placeholder | `CompanyDashboard.tsx:149` | Implementar o remover |
| 🟠 BAJO | 19 | WelcomeSection sin link directo a wallet para programmer | `ProgrammerDashboard.tsx` | Confirmar acceso desde welcome |
| 🟠 BAJO | 20 | `@ts-ignore` en Workspace | `Workspace.tsx:37` | Tipar respuesta correctamente |

---

## 🏗️ PLAN DE CORRECCIÓN PRIORIZADO

### FASE 1 - CORRECCIONES INMEDIATAS (Hoy)

#### 1. Arreglar el KanbanBoard (Workspace.tsx + KanbanBoard.tsx)

**Archivo: `Workspace.tsx`** - 2 cambios:

```tsx
// CAMBIO 1: Quitar h-full del contenedor raíz (línea 52)
// ANTES:
<div className="h-full flex flex-col p-4 sm:p-6 space-y-4">
// DESPUÉS:
<div className="flex flex-col p-4 sm:p-6 space-y-4">

// CAMBIO 2: Cambiar overflow-hidden a overflow-auto (línea 83)
// ANTES:
<div className="flex-1 mt-4 min-h-0 overflow-hidden">
// DESPUÉS:
<div className="flex-1 mt-4 overflow-x-auto">
```

**Archivo: `KanbanBoard.tsx`** - 1 cambio en el return:

```tsx
// ANTES (línea 334-335):
return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-4 h-full relative">

// DESPUÉS:
return (
    <div className="overflow-x-auto pb-2">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-4 relative" 
         style={{ minWidth: 'max-content' }}>
```

#### 2. Arreglar el Sidebar

**Archivo: `Sidebar.tsx`** - 2 cambios:

```tsx
// CAMBIO 1: Agregar Wallet a programmerSections (después de portfolio)
{ id: 'wallet', label: 'Billetera & Cobros', icon: Wallet },

// CAMBIO 2: Eliminar botón duplicado de Configuración del footer (líneas 161-168)
// Borrar completamente:
<Button
    variant="ghost"
    className="w-full justify-start text-sidebar-foreground/70 ..."
>
    <Settings className="h-5 w-5 mr-3" />
    Configuración
</Button>
```

#### 3. Agregar WalletProvider al ProgrammerDashboard

**Archivo: `ProgrammerDashboard.tsx`** - Agregar import y wrapper:

```tsx
import { WalletProvider } from '../contexts/WalletContext';

// En el return:
return (
    <WalletProvider>
        <div className="flex h-screen bg-background text-foreground">
            ...
        </div>
    </WalletProvider>
);
```

### FASE 2 - CORRECCIONES A CORTO PLAZO (Esta semana)

4. **Agregar protección de rutas en App.tsx** - verificar `user.user_type` al navegar
5. **Corregir lógica de "Entregar" en MilestoneTimeline** - solo en estado `in_progress`
6. **Corregir estado stale** en MyProjectsSection y UserManagement
7. **Agregar useMemo** a filtros en ProjectsSection y SearchProgrammersSection

### FASE 3 - CORRECCIONES A MEDIANO PLAZO (Próximas semanas)

8. **Implementar debounce** en búsquedas de admin
9. **Reparar tipos TypeScript** (eliminar `@ts-ignore`, tipar respuestas API)
10. **Corregir `useMilestoneActions`** para usar `userType` correctamente
11. **Implementar notificaciones** para Company o remover del router

---

## 📁 Archivos Auditados

### Dashboards Principales
- [`ProgrammerDashboard.tsx`](Frontend/src/components/ProgrammerDashboard.tsx)
- [`CompanyDashboard.tsx`](Frontend/src/components/CompanyDashboard.tsx)
- [`AdminDashboard.tsx`](Frontend/src/components/AdminDashboard.tsx)
- [`App.tsx`](Frontend/src/App.tsx)
- [`Sidebar.tsx`](Frontend/src/components/Sidebar.tsx)

### Contextos y Hooks
- [`AuthContext.tsx`](Frontend/src/contexts/AuthContext.tsx)
- [`WalletContext.tsx`](Frontend/src/contexts/WalletContext.tsx)
- [`useMilestoneActions.ts`](Frontend/src/hooks/useMilestoneActions.ts)

### Programmer
- [`MyActiveProjectsSection.tsx`](Frontend/src/components/dashboard/programmer/MyActiveProjectsSection.tsx)
- [`ProjectsSection.tsx`](Frontend/src/components/dashboard/programmer/ProjectsSection.tsx)
- [`ProfileSection.tsx`](Frontend/src/components/dashboard/programmer/ProfileSection.tsx)

### Company
- [`MyProjectsSection.tsx`](Frontend/src/components/dashboard/company/MyProjectsSection.tsx)
- [`SearchProgrammersSection.tsx`](Frontend/src/components/dashboard/company/SearchProgrammersSection.tsx)

### Admin
- [`UserManagement.tsx`](Frontend/src/components/dashboard/components/UserManagement.tsx)
- [`ProjectsManagement.tsx`](Frontend/src/components/dashboard/components/admin/ProjectsManagement.tsx)

### Compartidos
- [`ChatSection.tsx`](Frontend/src/components/dashboard/ChatSection.tsx)
- [`MilestoneTimeline.tsx`](Frontend/src/components/dashboard/shared/MilestoneTimeline.tsx)
- [`KanbanBoard.tsx`](Frontend/src/components/dashboard/shared/KanbanBoard.tsx)
- [`Workspace.tsx`](Frontend/src/components/dashboard/shared/Workspace.tsx)
- [`WalletPaymentMethods.tsx`](Frontend/src/components/dashboard/wallet/WalletPaymentMethods.tsx)

### Servicios
