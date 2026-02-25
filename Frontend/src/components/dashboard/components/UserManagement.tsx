import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Skeleton } from '../../ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { useSweetAlert } from '../../ui/sweet-alert';
import { apiRequest } from '../../../services/apiClient';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Calendar,
  Shield,
  Users,
  Filter,
  RefreshCw,
  MoreVertical,
  Ban
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  user_type: 'programmer' | 'company' | 'admin';
  created_at: string;
  email_verified_at?: string;
  banned_at: string | null;
}

interface UsersStats {
  total_users: number;
  admins: number;
  companies: number;
  programmers: number;
  verified_emails: number;
  unverified_emails: number;
  recent_registrations: number;
}

interface UsersResponse {
  success: boolean;
  users: User[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface UserResponse {
  success: boolean;
  message?: string;
  user: User;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats, setStats] = useState({
    admins: 0,
    companies: 0,
    programmers: 0,
    recent_registrations: 0
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users when page or search changes
  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, filterType]);
  const [editForm, setEditForm] = useState({
    name: '',
    lastname: '',
    email: '',
    user_type: 'programmer'
  });
  const [createForm, setCreateForm] = useState({
    name: '',
    lastname: '',
    email: '',
    user_type: 'programmer',
    password: '',
    confirmPassword: ''
  });
  const { showAlert, Alert } = useSweetAlert();

  // Obtener usuarios de la API
  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Build query params
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (filterType !== 'all') params.append('user_type', filterType);

      const [usersRes, statsRes] = await Promise.all([
        apiRequest<UsersResponse>(`/admin/users?${params.toString()}`),
        apiRequest<{ success: boolean; stats: UsersStats }>('/admin/users/stats')
      ]);

      if (usersRes.success) {
        setUsers(usersRes.users || []);
        if (usersRes.pagination) {
          setTotalPages(usersRes.pagination.last_page);
          setTotalUsers(usersRes.pagination.total);
        }
      }

      if (statsRes.success && statsRes.stats) {
        setStats({
          admins: statsRes.stats.admins || 0,
          companies: statsRes.stats.companies || 0,
          programmers: statsRes.stats.programmers || 0,
          recent_registrations: statsRes.stats.recent_registrations || 0
        });
        setTotalUsers(statsRes.stats.total_users || 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showAlert({
        title: 'Error',
        text: 'No se pudieron cargar los usuarios',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuarios
  const filteredUsers = users;

  // Obtener color del badge según el tipo de usuario
  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'company':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'programmer':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Obtener icono según el tipo de usuario
  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin':
        return <Shield className="w-3 h-3" />;
      case 'company':
        return <Users className="w-3 h-3" />;
      case 'programmer':
        return <UserPlus className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Manejar acciones de usuario
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      user_type: user.user_type
    });
    setShowEditDialog(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await apiRequest(`/admin/users/${userToDelete.id}`, { method: 'DELETE' });
      showAlert({
        title: 'Usuario eliminado',
        text: 'El usuario ha sido eliminado exitosamente',
        type: 'success'
      });
      fetchUsers();
    } catch (error) {
      showAlert({
        title: 'Error',
        text: error instanceof Error ? error.message : 'No se pudo eliminar el usuario.',
        type: 'error'
      });
    } finally {
      setUserToDelete(null);
    }
  };

  const handleOpenCreateDialog = () => {
    setCreateForm({
      name: '',
      lastname: '',
      email: '',
      user_type: 'programmer',
      password: '',
      confirmPassword: ''
    });
    setShowCreateDialog(true);
  };

  const handleCreateUser = async () => {
    if (!createForm.name || !createForm.lastname || !createForm.email || !createForm.password) {
      showAlert({
        title: 'Campos requeridos',
        text: 'Completa todos los campos obligatorios.',
        type: 'warning'
      });
      return;
    }
    if (createForm.password !== createForm.confirmPassword) {
      showAlert({
        title: 'Contraseñas no coinciden',
        text: 'Verifica la confirmación de contraseña.',
        type: 'warning'
      });
      return;
    }

    // Validar contraseña: 8-15 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/;
    if (!passwordRegex.test(createForm.password)) {
      showAlert({
        title: 'Error de validación',
        text: 'La contraseña debe tener entre 8-15 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&#).',
        type: 'error'
      });
      return;
    }

    try {
      setIsSaving(true);
      await apiRequest<UserResponse>('/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          name: createForm.name,
          lastname: createForm.lastname,
          email: createForm.email,
          user_type: createForm.user_type,
          password: createForm.password
        })
      });
      setShowCreateDialog(false);
      showAlert({
        title: 'Usuario creado',
        text: 'El usuario se creó correctamente.',
        type: 'success'
      });
      fetchUsers();
    } catch (error) {
      showAlert({
        title: 'Error',
        text: error instanceof Error ? error.message : 'No se pudo crear el usuario.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    if (!editForm.name || !editForm.lastname || !editForm.email) {
      showAlert({
        title: 'Campos requeridos',
        text: 'Completa todos los campos obligatorios.',
        type: 'warning'
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await apiRequest<UserResponse>(`/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editForm.name,
          lastname: editForm.lastname,
          email: editForm.email,
          user_type: editForm.user_type
        })
      });
      setUsers(users.map(user => user.id === selectedUser.id ? response.user : user));
      setShowEditDialog(false);
      showAlert({
        title: 'Usuario actualizado',
        text: 'Los cambios se guardaron correctamente.',
        type: 'success'
      });
    } catch (error) {
      showAlert({
        title: 'Error',
        text: error instanceof Error ? error.message : 'No se pudo actualizar el usuario.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Manejar ban/unban de usuario
  const handleBanUser = async (userId: number) => {
    try {
      const response = await apiRequest<{ success: boolean; banned: boolean; message: string }>(`/admin/users/${userId}/ban`, {
        method: 'POST'
      });
      showAlert({
        title: response.banned ? 'Usuario Baneado' : 'Usuario Desbaneado',
        text: response.message,
        type: 'success'
      });
      fetchUsers();
    } catch (error) {
      showAlert({
        title: 'Error',
        text: error instanceof Error ? error.message : 'No se pudo cambiar el estado del usuario.',
        type: 'error'
      });
    }
  };

  // Estadísticas de usuarios
  const userStats = {
    total: totalUsers,
    admins: stats.admins,
    companies: stats.companies,
    programmers: stats.programmers
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary glow-text flex items-center gap-3">
              <Users className="w-8 h-8" />
              Gestión de Usuarios
            </h1>
            <p className="text-muted-foreground mt-2">Administra todos los usuarios del sistema</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={fetchUsers}
              variant="outline"
              className="bg-card border-border hover:bg-accent text-foreground"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>

            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={handleOpenCreateDialog}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-primary flex items-center gap-2">
                <Users className="w-5 h-5" />
                Total Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{userStats.total}</div>
              <p className="text-muted-foreground text-sm">Registrados en el sistema</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Administradores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{userStats.admins}</div>
              <p className="text-muted-foreground text-sm">Usuarios con permisos admin</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Empresas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{userStats.companies}</div>
              <p className="text-muted-foreground text-sm">Cuentas de empresa</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-400 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Programadores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{userStats.programmers}</div>
              <p className="text-muted-foreground text-sm">Desarrolladores registrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y búsqueda */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, apellido o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40 bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all" className="text-popover-foreground hover:bg-accent">Todos</SelectItem>
                    <SelectItem value="admin" className="text-popover-foreground hover:bg-accent">Administradores</SelectItem>
                    <SelectItem value="company" className="text-popover-foreground hover:bg-accent">Empresas</SelectItem>
                    <SelectItem value="programmer" className="text-popover-foreground hover:bg-accent">Programadores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de usuarios */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary">Lista de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                {/* Skeleton Loaders para la tabla */}
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-accent/50">
                      <TableHead className="text-primary">Usuario</TableHead>
                      <TableHead className="text-primary">Email</TableHead>
                      <TableHead className="text-primary">Tipo</TableHead>
                      <TableHead className="text-primary">Registro</TableHead>
                      <TableHead className="text-primary">Estado</TableHead>
                      <TableHead className="text-primary sticky right-0 bg-card">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, index) => (
                      <TableRow key={index} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-48" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-28" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </TableCell>
                        <TableCell className="sticky right-0 bg-card border-l border-border">
                          <div className="flex items-center gap-2 justify-end">
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-8 w-8 rounded" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No se encontraron usuarios</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-accent/50">
                    <TableHead className="text-primary">Usuario</TableHead>
                    <TableHead className="text-primary">Email</TableHead>
                    <TableHead className="text-primary">Tipo</TableHead>
                    <TableHead className="text-primary">Registro</TableHead>
                    <TableHead className="text-primary">Estado</TableHead>
                    <TableHead className="text-primary sticky right-0 bg-card">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-border hover:bg-accent/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-foreground font-semibold">{user.name} {user.lastname}</div>
                            <div className="text-muted-foreground text-sm">ID: {user.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getUserTypeColor(user.user_type)} border flex items-center gap-1 w-fit`}>
                          {getUserTypeIcon(user.user_type)}
                          {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{formatDate(user.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge className={`${user.email_verified_at
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            } border`}>
                            {user.email_verified_at ? 'Verificado' : 'Pendiente'}
                          </Badge>
                          {user.banned_at && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border text-xs">
                              <Ban className="w-3 h-3 mr-1" />
                              Baneado
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="sticky right-0 bg-card border-l border-border">
                        <div className="flex items-center justify-end gap-2">
                          {/* Botones para pantallas medianas y grandes */}
                          <div className="hidden sm:flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewUser(user)}
                              className="bg-secondary border-border hover:bg-accent text-foreground h-8 w-8 p-0"
                              title="Ver usuario"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                              className="bg-secondary border-border hover:bg-accent text-foreground h-8 w-8 p-0"
                              title="Editar usuario"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {user.user_type !== 'admin' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBanUser(user.id)}
                                className={`bg-secondary border-border hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300 h-8 w-8 p-0 ${user.banned_at ? 'border-yellow-500/50' : ''}`}
                                title={user.banned_at ? 'Desbanear usuario' : 'Banear usuario'}
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user)}
                              className="bg-secondary border-border hover:bg-red-500/20 text-red-400 hover:text-red-300 h-8 w-8 p-0"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Menú desplegable para pantallas pequeñas */}
                          <div className="sm:hidden">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-secondary border-border hover:bg-accent text-foreground h-8 w-8 p-0"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-40 bg-popover border-border p-0">
                                <div className="flex flex-col gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleViewUser(user)}
                                    className="w-full justify-start text-foreground hover:bg-accent text-left"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditUser(user)}
                                    className="w-full justify-start text-foreground hover:bg-accent text-left"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                  </Button>
                                  {user.user_type !== 'admin' && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleBanUser(user.id)}
                                      className={`w-full justify-start text-yellow-400 hover:bg-yellow-500/20 text-left ${user.banned_at ? 'text-orange-400 hover:bg-orange-500/20' : ''}`}
                                    >
                                      <Ban className="w-4 h-4 mr-2" />
                                      {user.banned_at ? 'Desbanear' : 'Banear'}
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteUser(user)}
                                    className="w-full justify-start text-red-400 hover:bg-red-500/20 text-left"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>



        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>Mostrando {users.length} de {totalUsers} usuarios</p>
            <div className="flex gap-2">
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
                className="bg-card border-border hover:bg-accent text-foreground"
              >
                Anterior
              </Button>
              <span className="flex items-center px-3">
                Página {page} de {totalPages}
              </span>
              <Button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                variant="outline"
                className="bg-card border-border hover:bg-accent text-foreground"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog crear usuario */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-card border-border text-foreground max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Crear Usuario
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">Nombre</label>
                <Input
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="bg-background border-border text-foreground text-sm focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Apellido</label>
                <Input
                  value={createForm.lastname}
                  onChange={(e) => setCreateForm({ ...createForm, lastname: e.target.value })}
                  className="bg-background border-border text-foreground text-sm focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <Input
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="bg-background border-border text-foreground text-sm focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tipo de usuario</label>
              <Select
                value={createForm.user_type}
                onValueChange={(value) => setCreateForm({ ...createForm, user_type: value })}
              >
                <SelectTrigger className="bg-background border-border text-foreground text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="programmer" className="text-popover-foreground hover:bg-accent">Programador</SelectItem>
                  <SelectItem value="company" className="text-popover-foreground hover:bg-accent">Empresa</SelectItem>
                  <SelectItem value="admin" className="text-popover-foreground hover:bg-accent">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">Contraseña</label>
                <Input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="bg-background border-border text-foreground text-sm focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Confirmar contraseña</label>
                <Input
                  type="password"
                  value={createForm.confirmPassword}
                  onChange={(e) => setCreateForm({ ...createForm, confirmPassword: e.target.value })}
                  className="bg-background border-border text-foreground text-sm focus:border-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="border-border text-foreground text-sm hover:bg-accent"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                onClick={handleCreateUser}
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Crear'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog editar usuario */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-border text-foreground max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar Usuario
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">Nombre</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="bg-background border-border text-foreground text-sm focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Apellido</label>
                <Input
                  value={editForm.lastname}
                  onChange={(e) => setEditForm({ ...editForm, lastname: e.target.value })}
                  className="bg-background border-border text-foreground text-sm focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="bg-background border-border text-foreground text-sm focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tipo de usuario</label>
              <Select
                value={editForm.user_type}
                onValueChange={(value) => setEditForm({ ...editForm, user_type: value })}
              >
                <SelectTrigger className="bg-background border-border text-foreground text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="programmer" className="text-popover-foreground hover:bg-accent">Programador</SelectItem>
                  <SelectItem value="company" className="text-popover-foreground hover:bg-accent">Empresa</SelectItem>
                  <SelectItem value="admin" className="text-popover-foreground hover:bg-accent">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="border-border text-foreground text-sm hover:bg-accent"
                onClick={() => setShowEditDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                onClick={handleUpdateUser}
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de detalles del usuario */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-1 text-base">
              <Users className="w-4 h-4" />
              Detalles
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground truncate">{selectedUser.name} {selectedUser.lastname}</h3>
                  <Badge className={`${getUserTypeColor(selectedUser.user_type)} border flex items-center gap-1 w-fit mt-0 text-xs py-0 px-1.5`}>
                    {getUserTypeIcon(selectedUser.user_type)}
                    {selectedUser.user_type.charAt(0).toUpperCase() + selectedUser.user_type.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground break-all">{selectedUser.email}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Fecha de Registro</label>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{formatDate(selectedUser.created_at)}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Estado</label>
                  <div className="mt-0.5 flex flex-col gap-1">
                    <Badge className={`${selectedUser.email_verified_at
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      } border text-xs py-0 px-1.5 w-fit`}>
                      {selectedUser.email_verified_at ? 'Verificado' : 'Pendiente'}
                    </Badge>
                    {selectedUser.banned_at && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border text-xs py-0 px-1.5 w-fit">
                        <Ban className="w-3 h-3 mr-1" />
                        Baneado
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Alert />

      <ConfirmDialog
        cancelText="Cancelar"
        confirmText="Sí, eliminar"
        description={
          userToDelete
            ? `¿Estás seguro de que quieres eliminar al usuario ${userToDelete.name} ${userToDelete.lastname}?`
            : '¿Estás seguro de que quieres eliminar este usuario?'
        }
        isOpen={Boolean(userToDelete)}
        onCancel={() => setUserToDelete(null)}
        onConfirm={confirmDeleteUser}
        title="¿Eliminar usuario?"
        variant="danger"
      />
    </div >
  );
}
