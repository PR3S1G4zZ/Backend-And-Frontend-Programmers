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
import { USER_TYPES, INITIAL_FORM_DATA, DEMO_ACCOUNTS, EMAIL_SINGLE_DOT_REGEX } from "./auth/constants";
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
  const [emailError, setEmailError] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [companyNameError, setCompanyNameError] = useState<string>("");
  const [positionError, setPositionError] = useState<string>("");
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [termsTouched, setTermsTouched] = useState<boolean>(false);

  const NAME_REGEX = /^(?!\s)[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+(?<!\s)$/;
  const PASSWORD_NO_SPACE_REGEX = /^\S+$/;
  
  const { register } = useAuth();
  const { showAlert, Alert } = useSweetAlert();

  const showValidationErrors = (errors: Record<string, string[]>) => {
    console.log('showValidationErrors llamado con:', errors);
    console.log('Tipo de errors:', typeof errors);
    console.log('Es un objeto?', errors instanceof Object);
    console.log('Keys:', Object.keys(errors));
    
    // Mapear los errores del backend a mensajes más amigables
    const errorMessages: string[] = [];
    const requirements: string[] = [];

    Object.entries(errors).forEach(([field, messages]) => {
      console.log(`Procesando campo: ${field}, mensajes:`, messages);
      console.log(`Tipo de mensajes: ${typeof messages}, es array: ${Array.isArray(messages)}`);
      
      // Asegurarse de que messages es un array
      const messageArray = Array.isArray(messages) ? messages : [messages];
      
      messageArray.forEach((message) => {
        const errorMsg = typeof message === 'string' ? message : String(message);
        console.log(`Agregando error: ${errorMsg}`);
        errorMessages.push(errorMsg);
        
        // Agregar requisitos según el campo
        if (field === 'email') {
          if (!requirements.includes('El correo debe contener "@" y exactamente un punto en el dominio (ej: usuario@dominio.tld)')) {
            requirements.push('El correo debe contener "@" y exactamente un punto en el dominio (ej: usuario@dominio.tld)');
          }
        } else if (field === 'password') {
          if (message.includes('mínimo') || message.includes('min')) {
            if (!requirements.includes('La contraseña debe tener al menos 8 caracteres')) {
              requirements.push('La contraseña debe tener al menos 8 caracteres');
            }
          }
          if (message.includes('máximo') || message.includes('max')) {
            if (!requirements.includes('La contraseña no puede tener más de 15 caracteres')) {
              requirements.push('La contraseña no puede tener más de 15 caracteres');
            }
          }
          if (message.includes('mayúscula') || message.includes('mayuscula') || message.includes('uppercase')) {
            if (!requirements.includes('La contraseña debe tener al menos una mayúscula')) {
              requirements.push('La contraseña debe tener al menos una mayúscula');
            }
          }
          if (message.includes('minúscula') || message.includes('minuscula') || message.includes('lowercase')) {
            if (!requirements.includes('La contraseña debe tener al menos una minúscula')) {
              requirements.push('La contraseña debe tener al menos una minúscula');
            }
          }
          if (message.includes('número') || message.includes('numero') || message.includes('number') || message.includes('digit')) {
            if (!requirements.includes('La contraseña debe tener al menos un número')) {
              requirements.push('La contraseña debe tener al menos un número');
            }
          }
          if (message.includes('carácter especial') || message.includes('caracter especial') || message.includes('special')) {
            if (!requirements.includes('La contraseña debe tener al menos un carácter especial (@$!%*?&#)')) {
              requirements.push('La contraseña debe tener al menos un carácter especial (@$!%*?&#)');
            }
          }
          if (message.includes('confirmado') || message.includes('confirmed')) {
            if (!requirements.includes('Las contraseñas deben coincidir')) {
              requirements.push('Las contraseñas deben coincidir');
            }
          }
          // Si no hay requisitos específicos de password, agregar todos los requisitos generales
          if (requirements.filter(r => r.includes('contraseña')).length === 0) {
            requirements.push('La contraseña debe tener entre 8 y 15 caracteres');
            requirements.push('La contraseña debe tener al menos una mayúscula');
            requirements.push('La contraseña debe tener al menos una minúscula');
            requirements.push('La contraseña debe tener al menos un número');
            requirements.push('La contraseña debe tener al menos un carácter especial (@$!%*?&#)');
          }
        } else if (field === 'name' || field === 'lastname') {
          if (!requirements.includes('El nombre y apellido solo pueden contener letras y espacios')) {
            requirements.push('El nombre y apellido solo pueden contener letras y espacios');
          }
        }
      });
    });

    // Eliminar duplicados
    const uniqueRequirements = [...new Set(requirements)];
    const uniqueErrors = [...new Set(errorMessages)];

    console.log('Errores únicos:', uniqueErrors);
    console.log('Requisitos únicos:', uniqueRequirements);
    console.log('Número de errores:', uniqueErrors.length);
    console.log('Número de requisitos:', uniqueRequirements.length);

    // Si no hay requisitos pero sí errores, agregar requisitos generales
    if (uniqueRequirements.length === 0 && uniqueErrors.length > 0) {
      uniqueRequirements.push('Revisa los errores arriba y corrige los campos correspondientes');
    }

    // Crear el contenido HTML del modal
    const errorList = uniqueErrors.map((err, idx) => `<div class="error-item">${idx + 1}. ${err}</div>`).join('');
    const requirementsList = uniqueRequirements.length > 0 
      ? uniqueRequirements.map((req) => `<div class="requirement-item">✓ ${req}</div>`).join('')
      : '<div class="requirement-item">Todos los campos deben cumplir con los requisitos establecidos</div>';

    console.log('Error list HTML:', errorList);
    console.log('Requirements list HTML:', requirementsList);
    console.log('Llamando a showAlert...');
    console.log('uniqueErrors completo:', uniqueErrors);
    console.log('uniqueRequirements completo:', uniqueRequirements);

    // Verificar que hay contenido para mostrar
    if (uniqueErrors.length === 0) {
      console.warn('No hay errores para mostrar!');
      return;
    }

    const alertId = showAlert({
      title: 'Error de Validación',
      html: (
        <div className="w-full">
          <style>{`
            .error-item {
              padding: 10px 14px;
              background: rgba(239, 68, 68, 0.1);
              border-left: 3px solid #ef4444;
              border-radius: 6px;
              margin-bottom: 10px;
              color: #fca5a5;
            }
            .requirement-item {
              padding: 10px 14px;
              background: rgba(34, 197, 94, 0.1);
              border-left: 3px solid #22c55e;
              border-radius: 6px;
              margin-bottom: 10px;
              color: #86efac;
            }
          `}</style>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
              <span className="text-2xl">❌</span> Errores encontrados:
            </h3>
            <div 
              className="space-y-2 text-sm"
              dangerouslySetInnerHTML={{ __html: errorList }}
            />
          </div>
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <span className="text-2xl">✓</span> Requisitos que debe cumplir:
            </h3>
            <div 
              className="space-y-2 text-sm"
              dangerouslySetInnerHTML={{ __html: requirementsList }}
            />
          </div>
        </div>
      ),
      type: 'error',
      theme: 'code'
    });
    
    console.log('Alert ID:', alertId);
    console.log('Modal debería estar visible ahora');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
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

    // Validación de email con un solo punto después del "@" (sin alerta)
    if (!EMAIL_SINGLE_DOT_REGEX.test(formData.email)) {
      return;
    }

    // Validación de contraseña sin espacios (sin alerta)
    if (!PASSWORD_NO_SPACE_REGEX.test(formData.password)) {
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
          text: `Tu cuenta ha sido creada. Ahora puedes iniciar sesión con tus credenciales.`,
          type: 'success',
          timer: 2000
        });

        if (onNavigate) {
          setTimeout(() => onNavigate('login'), 2000);
        }
      } else {
        // Si hay errores de validación, mostrarlos en el modal detallado
        console.log('Response recibida:', response);
        console.log('Errores:', response.errors);
        console.log('Tipo de errors:', typeof response.errors);
        console.log('Keys de errors:', response.errors ? Object.keys(response.errors) : 'No hay errors');
        
        if (response.errors && Object.keys(response.errors).length > 0) {
          console.log('Mostrando errores de validación');
          console.log('Contenido completo de errors:', JSON.stringify(response.errors, null, 2));
          showValidationErrors(response.errors);
        } else {
          console.log('No hay errores específicos, mostrando mensaje general');
          showAlert({
            title: 'Error en el registro',
            text: response.message || 'No se pudo crear la cuenta',
            type: 'error'
          });
        }
      }
    } catch (error: any) {
      // Capturar errores de validación que puedan venir en el error
      console.error('Error en registro:', error);
      
      // Si el error tiene errores de validación, mostrarlos
      if (error?.errors && Object.keys(error.errors).length > 0) {
        showValidationErrors(error.errors);
      } else if (error?.response?.data?.errors && Object.keys(error.response.data.errors).length > 0) {
        showValidationErrors(error.response.data.errors);
      } else {
        showAlert({
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor. Verifica tu conexión.',
          type: 'error'
        });
      }
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
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, firstName: value });
                          if (!value) {
                            setFirstNameError("");
                          } else if (!NAME_REGEX.test(value)) {
                            setFirstNameError('Solo letras y espacios, sin espacios al inicio/fin.');
                          } else {
                            setFirstNameError("");
                          }
                        }}
                        required
                        aria-invalid={!!firstNameError}
                        className={`bg-[#0D0D0D] ${firstNameError ? 'border-red-500 focus:border-red-500' : 'border-[#333333] focus:border-[#00FF85]'} text-white placeholder-gray-400`}
                      />
                      {firstNameError && (
                        <p className="mt-2 text-xs text-red-400">{firstNameError}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-white mb-2">Apellido</label>
                      <Input 
                        type="text"
                        placeholder="Mendoza"
                        value={formData.lastName}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, lastName: value });
                          if (!value) {
                            setLastNameError("");
                          } else if (!NAME_REGEX.test(value)) {
                            setLastNameError('Solo letras y espacios, sin espacios al inicio/fin.');
                          } else {
                            setLastNameError("");
                          }
                        }}
                        required
                        aria-invalid={!!lastNameError}
                        className={`bg-[#0D0D0D] ${lastNameError ? 'border-red-500 focus:border-red-500' : 'border-[#333333] focus:border-[#00FF85]'} text-white placeholder-gray-400`}
                      />
                      {lastNameError && (
                        <p className="mt-2 text-xs text-red-400">{lastNameError}</p>
                      )}
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
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, companyName: value });
                          if (!value) {
                            setCompanyNameError("");
                          } else if (!NAME_REGEX.test(value)) {
                            setCompanyNameError('Solo letras y espacios, sin espacios al inicio/fin.');
                          } else {
                            setCompanyNameError("");
                          }
                        }}
                        required
                        aria-invalid={!!companyNameError}
                        className={`bg-[#0D0D0D] ${companyNameError ? 'border-red-500 focus:border-red-500 bg-gradient-to-r from-red-500/10 to-red-500/5' : 'border-[#333333] focus:border-[#00FF85]'} text-white placeholder-gray-400`}
                      />
                      {companyNameError && (
                        <p className="mt-2 text-xs text-red-400">{companyNameError}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white mb-2">Tu Nombre</label>
                        <Input 
                          type="text"
                          placeholder="Ana"
                          value={formData.firstName}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({ ...formData, firstName: value });
                            if (!value) {
                              setFirstNameError("");
                            } else if (!NAME_REGEX.test(value)) {
                              setFirstNameError('Solo letras y espacios, sin espacios al inicio/fin.');
                            } else {
                              setFirstNameError("");
                            }
                          }}
                          required
                          aria-invalid={!!firstNameError}
                          className={`bg-[#0D0D0D] ${firstNameError ? 'border-red-500 focus:border-red-500' : 'border-[#333333] focus:border-[#00FF85]'} text-white placeholder-gray-400`}
                        />
                        {firstNameError && (
                          <p className="mt-2 text-xs text-red-400">{firstNameError}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-white mb-2">Cargo</label>
                        <Input 
                          type="text"
                          placeholder="CTO"
                          value={formData.position}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({ ...formData, position: value });
                            if (!value) {
                              setPositionError("");
                            } else if (!NAME_REGEX.test(value)) {
                              setPositionError('Solo letras y espacios, sin espacios al inicio/fin.');
                            } else {
                              setPositionError("");
                            }
                          }}
                          required
                          aria-invalid={!!positionError}
                          className={`bg-[#0D0D0D] ${positionError ? 'border-red-500 focus:border-red-500 bg-gradient-to-r from-red-500/10 to-red-500/5' : 'border-[#333333] focus:border-[#00FF85]'} text-white placeholder-gray-400`}
                        />
                        {positionError && (
                          <p className="mt-2 text-xs text-red-400">{positionError}</p>
                        )}
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
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (/\s/.test(raw)) {
                          const noSpaces = raw.replace(/\s+/g, '');
                          setFormData({ ...formData, email: noSpaces });
                          setEmailError('El correo no debe contener espacios.');
                          return;
                        }
                        const value = raw;
                        setFormData({ ...formData, email: value });
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
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, password: value });
                        if (!value) {
                          setPasswordError("");
                        } else if (!PASSWORD_NO_SPACE_REGEX.test(value)) {
                          setPasswordError('La contraseña no debe contener espacios.');
                        } else {
                          setPasswordError("");
                        }
                      }}
                      required
                      minLength={8}
                      maxLength={15}
                      aria-invalid={!!passwordError}
                      className={`pl-10 pr-10 bg-[#0D0D0D] ${passwordError ? 'border-red-500 focus:border-red-500 bg-gradient-to-r from-red-500/10 to-red-500/5' : 'border-[#333333] focus:border-[#00FF85]'} text-white placeholder-gray-400`}
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
                {passwordError && (
                  <p className="mt-2 text-xs text-red-400">{passwordError}</p>
                )}

                <div>
                  <label className="block text-white mb-2">Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, confirmPassword: value });
                        if (!value) {
                          setConfirmPasswordError("");
                        } else if (!PASSWORD_NO_SPACE_REGEX.test(value)) {
                          setConfirmPasswordError('La confirmación no debe contener espacios.');
                        } else if (value !== formData.password) {
                          setConfirmPasswordError('Las contraseñas deben coincidir.');
                        } else {
                          setConfirmPasswordError("");
                        }
                      }}
                      required
                      maxLength={15}
                      aria-invalid={!!confirmPasswordError}
                      className={`pl-10 pr-10 bg-[#0D0D0D] ${confirmPasswordError ? 'border-red-500 focus:border-red-500 bg-gradient-to-r from-red-500/10 to-red-500/5' : 'border-[#333333] focus:border-[#00FF85]'} text-white placeholder-gray-400`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p className="mt-2 text-xs text-red-400">{confirmPasswordError}</p>
                  )}
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    required
                    checked={acceptedTerms}
                    onChange={(e) => { setAcceptedTerms(e.target.checked); setTermsTouched(true); }}
                    onBlur={() => setTermsTouched(true)}
                    aria-invalid={!acceptedTerms && termsTouched}
                    className={`mt-1 rounded bg-[#0D0D0D] text-[#00FF85] focus:ring-[#00FF85] ${(!acceptedTerms && termsTouched) ? 'border-red-500 focus:border-red-500 ring-red-500/30' : 'border-[#333333] focus:border-[#00FF85]'}`}
                  />
                  <label className={`text-sm ${(!acceptedTerms && termsTouched) ? 'text-red-300' : 'text-gray-300'}`}
                  >
                    Acepto los <a href="#" className="text-[#00FF85] hover:text-[#00C46A]">términos y condiciones</a> y la <a href="#" className="text-[#00FF85] hover:text-[#00C46A]">política de privacidad</a>
                  </label>
                </div>
                {(!acceptedTerms && termsTouched) && (
                  <p className="mt-1 text-xs text-red-400">Debes aceptar los términos y la política para continuar.</p>
                )}

                <Button 
                  type="submit"
                  disabled={
                    isLoading ||
                    !!emailError ||
                    !!firstNameError ||
                    !!lastNameError ||
                    !!passwordError ||
                    !!confirmPasswordError ||
                    (formData.password !== formData.confirmPassword) ||
                    !EMAIL_SINGLE_DOT_REGEX.test(formData.email) ||
                    !PASSWORD_NO_SPACE_REGEX.test(formData.password) ||
                    !NAME_REGEX.test(formData.firstName) ||
                    (userType === USER_TYPES.PROGRAMMER && !NAME_REGEX.test(formData.lastName)) ||
                    (userType === USER_TYPES.COMPANY && (!NAME_REGEX.test(formData.companyName) || !NAME_REGEX.test(formData.position))) ||
                    (userType === USER_TYPES.COMPANY && (!!companyNameError || !!positionError)) ||
                    !acceptedTerms
                  }
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
