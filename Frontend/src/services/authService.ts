// Tipos para la autenticación
export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  user_type: 'programmer' | 'company';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  errors?: Record<string, string[]>;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: 'programmer' | 'company';
}

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

class AuthService {
  private token: string | null = null;

  constructor() {
    // Cargar token del localStorage al inicializar
    this.token = localStorage.getItem('auth_token');
  }

  // Método para hacer peticiones HTTP
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<AuthResponse> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Agregar token de autorización si existe
    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Si el token es inválido/expirado, limpiar sesión y salir
      if (response.status === 401) {
        this.clearToken();
        return {
          success: false,
          message: 'No autorizado. Inicia sesión nuevamente.',
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Error en la petición',
          errors: data.errors,
        };
      }

      return data;
    } catch (error) {
      console.error('Error en la petición:', error);
      return {
        success: false,
        message: 'Error de conexión. Verifica que el servidor esté ejecutándose.',
      };
    }
  }

  // Registrar usuario
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // Iniciar sesión
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // Cerrar sesión
  async logout(): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/logout', {
      method: 'POST',
    });

    if (response.success) {
      this.clearToken();
    }

    return response;
  }

  // Obtener información del usuario autenticado
  async getCurrentUser(): Promise<AuthResponse> {
    return await this.makeRequest('/auth/me');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Obtener el token actual
  getToken(): string | null {
    return this.token;
  }

  // Establecer token
  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Limpiar token
  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Obtener usuario del localStorage (para uso inmediato)
  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('user_data');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  // Guardar usuario en localStorage
  setStoredUser(user: User): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  // Limpiar datos del usuario
  clearStoredUser(): void {
    localStorage.removeItem('user_data');
  }
}

// Instancia singleton del servicio
export const authService = new AuthService();
