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

  // contador de intentos fallidos
  const [failedAttempts, setFailedAttempts] = useState(0);

  const { login } = useAuth();
  const { showAlert, Alert } = useSweetAlert();

  // función centralizada para manejar cualquier fallo de login
  const handleLoginFailure = () => {
    setFailedAttempts(prev => {
      const next = prev + 1;

      if (next < 3) {
        // intento 1 y 2
        showAlert({
          title: "Error de autenticación",
          text: "Contraseña incorrecta, inténtalo nuevamente.",
          type: "error"
        });
      } else {
        // intento 3 o más
        showAlert({
          title: "¿Deseas recuperar tu contraseña?",
          text: "Has realizado 3 intentos fallidos. Puedes recuperar tu contraseña desde el enlace en la pantalla.",
          type: "warning"
        });
      }

      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showAlert({
        title: "Campos requeridos",
        text: "Por favor, completa todos los campos",
        type: "warning"
      });
      return;
    }

    if (!EMAIL_SINGLE_DOT_REGEX.test(email)) return;
    if (!PASSWORD_NO_SPACE_REGEX.test(password)) return;

    setIsLoading(true);

    try {
      const response = await login({ email, password });

      if (response.success) {
        // si loguea bien, reiniciamos intentos
        setFailedAttempts(0);

        showAlert({
          title: "¡Bienvenido!",
          text: `Hola ${response.user?.name}, has iniciado sesión exitosamente`,
          type: "success",
          timer: 2000
        });

        if (onNavigate) {
          if (response.user?.user_type === "programmer") {
            onNavigate("programmer-dashboard");
          } else if (response.user?.user_type === "admin") {
            onNavigate("admin-dashboard");
          } else {
            onNavigate("company-dashboard");
          }
        }
      } else {
        // fallo de credenciales (401, etc.)
        handleLoginFailure();
      }
    } catch (error) {
      // error de red / servidor, pero desde el punto de vista del usuario también es un fallo
      handleLoginFailure();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`Iniciando sesión con ${provider}...`);
    if (onNavigate) {
      onNavigate("programmer-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 code-pattern opacity-5"></div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary p-3 rounded-xl">
              <Code className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenido de vuelta</h1>
          <p className="text-muted-foreground">Inicia sesión en tu cuenta de Programmers</p>
        </div>

        {/* Login Form */}
        <Card className="bg-card border-border hover-neon">
          <CardHeader>
            <CardTitle className="text-xl text-foreground text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSocialLogin("Google")}
              >
                <Chrome className="h-5 w-5 mr-3" />
                Continuar con Google
              </Button>
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSocialLogin("GitHub")}
              >
                <Github className="h-5 w-5 mr-3" />
                Continuar con GitHub
              </Button>
            </div>

            <div className="relative">
              <Separator className="bg-border" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-card px-3 text-muted-foreground text-sm">o</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (/\s/.test(raw)) {
                        const noSpaces = raw.replace(/\s+/g, "");
                        setEmail(noSpaces);
                        setEmailError("El correo no debe contener espacios.");
                        return;
                      }
                      const value = raw;
                      setEmail(value);
                      if (!value) {
                        setEmailError("");
                      } else if (!EMAIL_SINGLE_DOT_REGEX.test(value)) {
                        setEmailError(
                          "Formato: usuario@dominio.tld (un solo punto tras \"@\")"
                        );
                      } else {
                        setEmailError("");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault();
                      }
                    }}
                    required
                    aria-invalid={!!emailError}
                    className={`pl-10 bg-background ${emailError
                      ? "border-destructive focus:border-destructive bg-gradient-to-r from-destructive/10 to-destructive/5"
                      : "border-border focus:border-primary"
                      } text-foreground placeholder:text-muted-foreground`}
                  />
                </div>
                {emailError && (
                  <p className="mt-2 text-xs text-destructive">{emailError}</p>
                )}
              </div>

              <div>
                <label className="block text-foreground mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                        setPasswordError(
                          "La contraseña no debe contener espacios."
                        );
                      } else {
                        setPasswordError("");
                      }
                    }}
                    required
                    aria-invalid={!!passwordError}
                    className={`pl-10 pr-10 bg-background ${passwordError
                      ? "border-destructive focus:border-destructive bg-gradient-to-r from-destructive/10 to-destructive/5"
                      : "border-border focus:border-primary"
                      } text-foreground placeholder:text-muted-foreground`}
                  />
                  {passwordError && (
                    <p className="mt-2 text-xs text-destructive">{passwordError}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-border bg-background text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">Recordarme</span>
                </label>

                {/* solo se muestra después de 3 intentos fallidos */}
                {failedAttempts >= 3 && (
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary/90 transition-colors animate-pulse"
                    onClick={() => onNavigate && onNavigate("forgot-password")}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>

              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !!emailError ||
                  !!passwordError ||
                  !EMAIL_SINGLE_DOT_REGEX.test(email) ||
                  !PASSWORD_NO_SPACE_REGEX.test(password)
                }
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover-neon disabled:opacity-50"
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => onNavigate && onNavigate("register")}
              className="text-primary hover:text-primary/90 font-semibold transition-colors"
            >
              Regístrate gratis
            </button>
          </p>
        </div>

        {/* Demo Accounts */}
        <Card className="bg-card border-border border-dashed">
          <CardContent className="p-4">
            <h3 className="text-foreground font-semibold mb-3 text-center">
              Cuentas Demo
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Programador:</span>
                <code className="text-primary bg-background px-2 py-1 rounded">
                  demo@dev.com
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Empresa:</span>
                <code className="text-primary bg-background px-2 py-1 rounded">
                  demo@company.com
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Contraseña:</span>
                <code className="text-primary bg-background px-2 py-1 rounded">
                  demo123
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert />
    </div>
  );
}