import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Lock } from "lucide-react";
import { useSweetAlert } from "./ui/sweet-alert";
import apiClient from "../services/apiClient";

interface ResetPasswordProps {
  onNavigate?: (page: string) => void;
}

export function ResetPasswordPage({ onNavigate }: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const { showAlert, Alert } = useSweetAlert();

  // Cargar token + email desde la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
    setEmail(params.get("email") || "");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== password2) {
      showAlert({
        title: "Las contraseñas no coinciden",
        text: "Ambas deben ser iguales.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      await apiClient.post<{ message: string }>("/auth/reset-password", {
        token,
        email,
        password,
        password_confirmation: password2,
      });

      showAlert({
        title: "Contraseña actualizada",
        text: "Tu contraseña fue restablecida exitosamente.",
        type: "success",
      });

      setTimeout(() => {
        if (onNavigate) {
          onNavigate("login");
        }
      }, 2000);

    } catch (error: any) {
      showAlert({
        title: "Error de conexión",
        text: error.message || "No se pudo contactar al servidor.",
        type: "error",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="bg-card border-border w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-foreground text-xl text-center">
            Restablecer contraseña
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-foreground mb-2 block">Nueva contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  className="pl-10 text-foreground bg-background border-border"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-foreground mb-2 block">Repetir contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  className="pl-10 text-foreground bg-background border-border"
                  placeholder="********"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Restablecer contraseña"}
            </Button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate("login")}
              className="text-primary hover:text-primary/90 block mx-auto mt-4"
            >
              ← Volver al inicio de sesión
            </button>
          </form>
        </CardContent>
      </Card>

      <Alert />
    </div>
  );
}
