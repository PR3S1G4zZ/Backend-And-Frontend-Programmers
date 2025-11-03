import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { 
  Code, 
  Mail, 
  Lock, 
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";
import { UserTypeSelector } from "./auth/UserTypeSelector";
import { SocialAuthButtons } from "./auth/SocialAuthButtons";
import type { UserType, RegisterFormData } from "./auth/constants";
import { USER_TYPES, INITIAL_FORM_DATA, DEMO_ACCOUNTS } from "./auth/constants";
import { useAuth } from "../contexts/AuthContext";
import { useSweetAlert } from "./ui/sweet-alert";

interface RegisterPageProps {
  onNavigate?: (page: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { showAlert, Alert } = useSweetAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showAlert({
        title: 'Error de validación',
        text: 'Las contraseñas no coinciden',
        type: 'error'
      });
      return;
    }

    if (!userType) {
      showAlert({
        title: 'Tipo de usuario requerido',
        text: 'Por favor selecciona si eres programador o empresa',
        type: 'warning'
      });
      return;
    }

    // Validación específica según el tipo de usuario
    if (userType === USER_TYPES.PROGRAMMER) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        showAlert({
          title: 'Campos requeridos',
          text: 'Por favor, completa todos los campos',
          type: 'warning'
        });
        return;
      }
    } else if (userType === USER_TYPES.COMPANY) {
      if (!formData.firstName || !formData.companyName || !formData.position || !formData.email || !formData.password) {
        showAlert({
          title: 'Campos requeridos',
          text: 'Por favor, completa todos los campos',
          type: 'warning'
        });
        return;
      }
    }

    setIsLoading(true);
    
    try {
      const response = await register({
        name: formData.firstName,
        lastname: userType === USER_TYPES.PROGRAMMER ? formData.lastName : formData.firstName, // Para empresas usamos el mismo nombre
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        user_type: userType
      });
      
      if (response.success) {
        showAlert({
          title: '¡Registro exitoso!',
          text: `Bienvenido ${response.user?.name}, tu cuenta ha sido creada exitosamente`,
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
          title: 'Error en el registro',
          text: response.message || 'No se pudo crear la cuenta',
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

  const handleSocialRegister = (provider: string) => {
    if (!userType) {
      alert("Por favor selecciona si eres programador o empresa primero");
      return;
    }
    
    alert(`Registrándose con ${provider} como ${userType}...`);
    if (onNavigate) {
      const dashboardPage = userType === USER_TYPES.PROGRAMMER ? 'programmer-dashboard' : 'company-dashboard';
      onNavigate(dashboardPage);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 code-pattern opacity-5"></div>
      
      <div className="relative max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#00FF85] p-3 rounded-xl">
              <Code className="h-8 w-8 text-[#0D0D0D]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Únete a Programmers</h1>
          <p className="text-gray-300">Crea tu cuenta y empieza a construir tu futuro</p>
        </div>

        {/* User Type Selection */}
        <UserTypeSelector userType={userType} onUserTypeSelect={setUserType} />

        {/* Registration Form */}
        {userType && (
          <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
            <CardHeader>
              <CardTitle className="text-xl text-white text-center">
                Crear Cuenta {userType === USER_TYPES.PROGRAMMER ? 'de Programador' : 'de Empresa'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SocialAuthButtons onSocialAuth={handleSocialRegister} isRegister />

              <div className="relative">
                <Separator className="bg-[#333333]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-[#1A1A1A] px-3 text-gray-400 text-sm">o</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {userType === USER_TYPES.PROGRAMMER ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2">Nombre</label>
                      <Input 
                        type="text"
                        placeholder="Carlos"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                        className="bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85]"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Apellido</label>
                      <Input 
                        type="text"
                        placeholder="Mendoza"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                        className="bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85]"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-white mb-2">Nombre de la Empresa</label>
                      <Input 
                        type="text"
                        placeholder="TechCorp SA"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        required
                        className="bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white mb-2">Tu Nombre</label>
                        <Input 
                          type="text"
                          placeholder="Ana"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                          className="bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85]"
                        />
                      </div>
                      <div>
                        <label className="block text-white mb-2">Cargo</label>
                        <Input 
                          type="text"
                          placeholder="CTO"
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          required
                          className="bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85]"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-white mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="pl-10 bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      minLength={8}
                      className="pl-10 pr-10 bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                      className="pl-10 pr-10 bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 focus:border-[#00FF85]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 rounded border-[#333333] bg-[#0D0D0D] text-[#00FF85] focus:ring-[#00FF85]"
                  />
                  <label className="text-sm text-gray-300">
                    Acepto los <a href="#" className="text-[#00FF85] hover:text-[#00C46A]">términos y condiciones</a> y la <a href="#" className="text-[#00FF85] hover:text-[#00C46A]">política de privacidad</a>
                  </label>
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] hover-neon disabled:opacity-50"
                >
                  {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-300">
            ¿Ya tienes cuenta?{" "}
            <button 
              onClick={() => onNavigate && onNavigate('login')}
              className="text-[#00FF85] hover:text-[#00C46A] font-semibold transition-colors"
            >
              Inicia sesión
            </button>
          </p>
        </div>

        {/* Demo Accounts Info */}
        <Card className="bg-[#1A1A1A] border-[#333333] border-dashed">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3 text-center">Cuentas Demo</h3>
            <div className="space-y-2 text-sm">
              {DEMO_ACCOUNTS.map((account, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300">{account.label}:</span>
                  <code className="text-[#00FF85] bg-[#0D0D0D] px-2 py-1 rounded">
                    {account.email || account.password}
                  </code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Alert />
    </div>
  );
}
