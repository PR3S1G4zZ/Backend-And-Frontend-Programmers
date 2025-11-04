import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { 
  Code, 
  Mail, 
  Lock, 
  Github, 
  Chrome,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { EMAIL_SINGLE_DOT_REGEX } from "./auth/constants";
import { useSweetAlert } from "./ui/sweet-alert";

interface LoginPageProps {
  onNavigate?: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const PASSWORD_NO_SPACE_REGEX = /^\S+$/;
  
  const { login } = useAuth();
  const { showAlert, Alert } = useSweetAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showAlert({
        title: 'Campos requeridos',
        text: 'Por favor, completa todos los campos',
        type: 'warning'
      });
      return;
    }

    if (!EMAIL_SINGLE_DOT_REGEX.test(email)) {
      return;
    }

    if (!PASSWORD_NO_SPACE_REGEX.test(password)) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await login({ email, password });
      
      if (response.success) {
        showAlert({
          title: '¡Bienvenido!',
          text: `Hola ${response.user?.name}, has iniciado sesión exitosamente`,
          type: 'success',
          timer: 2000
        });
        
        // Redirigir según el tipo de usuario
        if (onNavigate) {
          if (response.user?.user_type === 'programmer') {
            onNavigate('programmer-dashboard');
          } else {
            onNavigate('company-dashboard');
          }
        }
      } else {
        showAlert({
          title: 'Error de autenticación',
          text: response.message || 'Credenciales incorrectas',
          type: 'error'
        });
      }
    } catch (error) {
      showAlert({
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Verifica tu conexión.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Simulación de login social
    alert(`Iniciando sesión con ${provider}...`);
    if (onNavigate) {
      onNavigate('programmer-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 code-pattern opacity-5"></div>
      
      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#00FF85] p-3 rounded-xl">
              <Code className="h-8 w-8 text-[#0D0D0D]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
          <p className="text-gray-300">Inicia sesión en tu cuenta de Programmers</p>
        </div>

        {/* Login Form */}
        <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
          <CardHeader>
            <CardTitle className="text-xl text-white text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button 
                variant="outline"
                className="w-full border-[#333333] text-white hover:bg-[#333333] hover:text-white"
                onClick={() => handleSocialLogin('Google')}
              >
                <Chrome className="h-5 w-5 mr-3" />
                Continuar con Google
              </Button>
              <Button 
                variant="outline"
                className="w-full border-[#333333] text-white hover:bg-[#333333] hover:text-white"
                onClick={() => handleSocialLogin('GitHub')}
              >
                <Github className="h-5 w-5 mr-3" />
                Continuar con GitHub
              </Button>
            </div>

            <div className="relative">
              <Separator className="bg-[#333333]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-[#1A1A1A] px-3 text-gray-400 text-sm">o</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (/\s/.test(raw)) {
                        const noSpaces = raw.replace(/\s+/g, '');
                        setEmail(noSpaces);
                        setEmailError('El correo no debe contener espacios.');
                        return;
                      }
                      const value = raw;
                      setEmail(value);
                      if (!value) {
                        setEmailError("");
                      } else if (!EMAIL_SINGLE_DOT_REGEX.test(value)) {
                        setEmailError('Formato: usuario@dominio.tld (un solo punto tras "@")');
                      } else {
                        setEmailError("");
                      }
                    }}
                    onKeyDown={(e) => { if (e.key === ' ') { e.preventDefault(); } }}
                    required
                    aria-invalid={!!emailError}
                    className={`pl-10 bg-[#0D0D0D] ${emailError ? 'border-red-500 focus:border-red-500 bg-gradient-to-r from-red-500/10 to-red-500/5' : 'border-[#333333] focus:border-[#00FF85]'} text-white placeholder-gray-400`}
                  />
                </div>
                {emailError && (
                  <p className="mt-2 text-xs text-red-400">{emailError}</p>
                )}
              </div>

              <div>
                <label className="block text-white mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassword(value);
                      if (!value) {
                        setPasswordError("");
                      } else if (!PASSWORD_NO_SPACE_REGEX.test(value)) {
                        setPasswordError('La contraseña no debe contener espacios.');
                      } else {
                        setPasswordError("");
                      }
                    }}
                    required
                    aria-invalid={!!passwordError}
                    className={`pl-10 pr-10 bg-[#0D0D0D] ${passwordError ? 'border-red-500 focus:border-red-500 bg-gradient-to-r from-red-500/10 to-red-500/5' : 'border-[#333333] focus:border-[#00FF85]'} text-white placeholder-gray-400`}
                  />
                  {passwordError && (
                    <p className="mt-2 text-xs text-red-400">{passwordError}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2 rounded border-[#333333] bg-[#0D0D0D] text-[#00FF85] focus:ring-[#00FF85]" 
                  />
                  <span className="text-sm text-gray-300">Recordarme</span>
                </label>
                <button 
                  type="button"
                  className="text-sm text-[#00FF85] hover:text-[#00C46A] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Button 
                type="submit"
                disabled={isLoading || !!emailError || !!passwordError || !EMAIL_SINGLE_DOT_REGEX.test(email) || !PASSWORD_NO_SPACE_REGEX.test(password)}
                className="w-full bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] hover-neon disabled:opacity-50"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-300">
            ¿No tienes cuenta?{" "}
            <button 
              onClick={() => onNavigate && onNavigate('register')}
              className="text-[#00FF85] hover:text-[#00C46A] font-semibold transition-colors"
            >
              Regístrate gratis
            </button>
          </p>
        </div>

        {/* Demo Accounts */}
        <Card className="bg-[#1A1A1A] border-[#333333] border-dashed">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3 text-center">Cuentas Demo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Programador:</span>
                <code className="text-[#00FF85] bg-[#0D0D0D] px-2 py-1 rounded">demo@dev.com</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Empresa:</span>
                <code className="text-[#00FF85] bg-[#0D0D0D] px-2 py-1 rounded">demo@company.com</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Contraseña:</span>
                <code className="text-[#00FF85] bg-[#0D0D0D] px-2 py-1 rounded">demo123</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Alert />
    </div>
  );
}