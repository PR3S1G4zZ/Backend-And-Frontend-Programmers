import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useSweetAlert } from './ui/sweet-alert';
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
  RefreshCw
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  user_type: 'programmer' | 'company' | 'admin';
  created_at: string;
  email_verified_at?: string;
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
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
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
      const data = await apiRequest<UsersResponse>('/admin/users');
      setUsers(data.users || []);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastname.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || user.user_type === filterType;

    return matchesSearch && matchesFilter;
  });

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
      setUsers(users.filter(u => u.id !== userToDelete.id));
      showAlert({
        title: 'Usuario eliminado',
        text: 'El usuario ha sido eliminado exitosamente',
        type: 'success'
      });
    } catch (error) {
      showAlert({
        title: 'Error',
        text: 'No se pudo eliminar el usuario',
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

    try {
      setIsSaving(true);
      const response = await apiRequest<UserResponse>('/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          name: createForm.name,
          lastname: createForm.lastname,
          email: createForm.email,
          user_type: createForm.user_type,
          password: createForm.password
        })
      });
      setUsers([response.user, ...users]);
      setShowCreateDialog(false);
      showAlert({
        title: 'Usuario creado',
        text: 'El usuario se creó correctamente.',
        type: 'success'
      });
    } catch (error) {
      showAlert({
        title: 'Error',
        text: 'No se pudo crear el usuario.',
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
        text: 'No se pudo actualizar el usuario.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Estadísticas de usuarios
  const userStats = {
    total: users.length,
    admins: users.filter(u => u.user_type === 'admin').length,
    companies: users.filter(u => u.user_type === 'company').length,
    programmers: users.filter(u => u.user_type === 'programmer').length
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#00FF85] glow-text flex items-center gap-3">
              <Users className="w-8 h-8" />
              Gestión de Usuarios
            </h1>
            <p className="text-gray-300 mt-2">Administra todos los usuarios del sistema</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={fetchUsers}
              variant="outline"
              className="bg-[#1A1A1A] border-[#333333] hover:bg-[#2A2A2A] text-white"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>

            <Button
              className="bg-[#00FF85] hover:bg-[#00C46A] text-[#0D0D0D] font-semibold"
              onClick={handleOpenCreateDialog}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#00FF85] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Total Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{userStats.total}</div>
              <p className="text-gray-400 text-sm">Registrados en el sistema</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Administradores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{userStats.admins}</div>
              <p className="text-gray-400 text-sm">Usuarios con permisos admin</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Empresas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{userStats.companies}</div>
              <p className="text-gray-400 text-sm">Cuentas de empresa</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-400 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Programadores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{userStats.programmers}</div>
              <p className="text-gray-400 text-sm">Desarrolladores registrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y búsqueda */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, apellido o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#2A2A2A] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40 bg-[#2A2A2A] border-[#333333] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#333333]">
                    <SelectItem value="all" className="text-white hover:bg-[#333333]">Todos</SelectItem>
                    <SelectItem value="admin" className="text-white hover:bg-[#333333]">Administradores</SelectItem>
                    <SelectItem value="company" className="text-white hover:bg-[#333333]">Empresas</SelectItem>
                    <SelectItem value="programmer" className="text-white hover:bg-[#333333]">Programadores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de usuarios */}
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#00FF85]">Lista de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-[#00FF85]" />
                <span className="ml-3 text-gray-300">Cargando usuarios...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
                      <TableHead className="text-[#00FF85]">Usuario</TableHead>
                      <TableHead className="text-[#00FF85]">Email</TableHead>
                      <TableHead className="text-[#00FF85]">Tipo</TableHead>
                      <TableHead className="text-[#00FF85]">Registro</TableHead>
                      <TableHead className="text-[#00FF85]">Estado</TableHead>
                      <TableHead className="text-[#00FF85]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-[#333333] hover:bg-[#2A2A2A]">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#00FF85] rounded-full flex items-center justify-center text-[#0D0D0D] font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white font-semibold">{user.name} {user.lastname}</div>
                              <div className="text-gray-400 text-sm">ID: {user.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{user.email}</span>
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
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{formatDate(user.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${
                            user.email_verified_at
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          } border`}>
                            {user.email_verified_at ? 'Verificado' : 'Pendiente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewUser(user)}
                              className="bg-[#2A2A2A] border-[#333333] hover:bg-[#333333] text-white"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                              className="bg-[#2A2A2A] border-[#333333] hover:bg-[#333333] text-white"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user)}
                              className="bg-[#2A2A2A] border-[#333333] hover:bg-red-500/20 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No se encontraron usuarios</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog crear usuario */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-[#1A1A1A] border-[#333333] text-white max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-[#00FF85] flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Crear Usuario
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300">Nombre</label>
                  <Input
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="bg-[#2A2A2A] border-[#333333] text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Apellido</label>
                  <Input
                    value={createForm.lastname}
                    onChange={(e) => setCreateForm({ ...createForm, lastname: e.target.value })}
                    className="bg-[#2A2A2A] border-[#333333] text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-300">Email</label>
                <Input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="bg-[#2A2A2A] border-[#333333] text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Tipo de usuario</label>
                <Select
                  value={createForm.user_type}
                  onValueChange={(value) => setCreateForm({ ...createForm, user_type: value })}
                >
                  <SelectTrigger className="bg-[#2A2A2A] border-[#333333] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#333333]">
                    <SelectItem value="programmer" className="text-white hover:bg-[#333333]">Programador</SelectItem>
                    <SelectItem value="company" className="text-white hover:bg-[#333333]">Empresa</SelectItem>
                    <SelectItem value="admin" className="text-white hover:bg-[#333333]">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300">Contraseña</label>
                  <Input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="bg-[#2A2A2A] border-[#333333] text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Confirmar contraseña</label>
                  <Input
                    type="password"
                    value={createForm.confirmPassword}
                    onChange={(e) => setCreateForm({ ...createForm, confirmPassword: e.target.value })}
                    className="bg-[#2A2A2A] border-[#333333] text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  className="border-[#333333] text-white"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]"
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
          <DialogContent className="bg-[#1A1A1A] border-[#333333] text-white max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-[#00FF85] flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Editar Usuario
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300">Nombre</label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="bg-[#2A2A2A] border-[#333333] text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Apellido</label>
                  <Input
                    value={editForm.lastname}
                    onChange={(e) => setEditForm({ ...editForm, lastname: e.target.value })}
                    className="bg-[#2A2A2A] border-[#333333] text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-300">Email</label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="bg-[#2A2A2A] border-[#333333] text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Tipo de usuario</label>
                <Select
                  value={editForm.user_type}
                  onValueChange={(value) => setEditForm({ ...editForm, user_type: value })}
                >
                  <SelectTrigger className="bg-[#2A2A2A] border-[#333333] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#333333]">
                    <SelectItem value="programmer" className="text-white hover:bg-[#333333]">Programador</SelectItem>
                    <SelectItem value="company" className="text-white hover:bg-[#333333]">Empresa</SelectItem>
                    <SelectItem value="admin" className="text-white hover:bg-[#333333]">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  className="border-[#333333] text-white"
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]"
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
          <DialogContent className="bg-[#1A1A1A] border-[#333333] text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#00FF85] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Detalles del Usuario
              </DialogTitle>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#00FF85] rounded-full flex items-center justify-center text-[#0D0D0D] font-bold text-xl">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedUser.name} {selectedUser.lastname}</h3>
                    <Badge className={`${getUserTypeColor(selectedUser.user_type)} border flex items-center gap-1 w-fit mt-1`}>
                      {getUserTypeIcon(selectedUser.user_type)}
                      {selectedUser.user_type.charAt(0).toUpperCase() + selectedUser.user_type.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Email</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{selectedUser.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-400">Tipo de Usuario</label>
                      <div className="mt-1">
                        <Badge className={`${getUserTypeColor(selectedUser.user_type)} border`}>
                          {selectedUser.user_type.charAt(0).toUpperCase() + selectedUser.user_type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Fecha de Registro</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{formatDate(selectedUser.created_at)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-400">Estado de Verificación</label>
                      <div className="mt-1">
                        <Badge className={`${
                          selectedUser.email_verified_at
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        } border`}>
                          {selectedUser.email_verified_at ? 'Email Verificado' : 'Email Pendiente'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

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
    </div>
  );
}
