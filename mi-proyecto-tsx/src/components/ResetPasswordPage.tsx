import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Lock } from "lucide-react";
import { useSweetAlert } from "./ui/sweet-alert";

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
      const res = await fetch("http://localhost/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: password2,
        }),
      });

      const data = await res.json();

      if (res.ok) {
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
      } else {
        showAlert({
          title: "Error",
          text: data.message || "No se pudo restablecer la contraseña",
          type: "error",
        });
      }

    } catch {
      showAlert({
        title: "Error de conexión",
        text: "No se pudo contactar al servidor.",
        type: "error",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-6">
      <Card className="bg-[#1A1A1A] border-[#333333] w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-white text-xl text-center">
            Restablecer contraseña
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-white mb-2 block">Nueva contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  className="pl-10 text-white bg-[#0D0D0D] border-[#333333]"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-white mb-2 block">Repetir contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  className="pl-10 text-white bg-[#0D0D0D] border-[#333333]"
                  placeholder="********"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Restablecer contraseña"}
            </Button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate("login")}
              className="text-[#00FF85] hover:text-[#00C46A] block mx-auto mt-4"
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
