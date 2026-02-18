import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, type User, type LoginData, type RegisterData, type AuthResponse } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        // Intentar obtener datos del usuario desde el servidor
        const response = await authService.getCurrentUser();
        if (response.success && response.user) {
          setUser(response.user);
          authService.setStoredUser(response.user);
        } else {
          // Si falla, usar datos almacenados localmente
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // Si no hay datos almacenados, limpiar autenticación
            authService.clearToken();
          }
        }
      } else {
        // Si no hay token, intentar cargar usuario almacenado
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      // En caso de error, usar datos almacenados
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<AuthResponse> => {
    // setIsLoading(true); // Don't trigger global loading to prevent App navigation reset
    try {
      const response = await authService.login(data);
      if (response.success && response.user) {
        setUser(response.user);
        authService.setStoredUser(response.user);
      }
      return response;
    } finally {
      // setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    // setIsLoading(true);
    try {
      const response = await authService.register(data);
      if (response.success && response.user) {
        setUser(response.user);
        authService.setStoredUser(response.user);
      }
      return response;
    } finally {
      // setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      authService.clearStoredUser();
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
        authService.setStoredUser(response.user);
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
