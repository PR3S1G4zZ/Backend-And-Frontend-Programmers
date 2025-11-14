import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail } from "lucide-react";
import { useSweetAlert } from "./ui/sweet-alert";

interface ForgotPasswordProps {
  onNavigate?: (page: string) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { showAlert, Alert } = useSweetAlert();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const res = await fetch("http://localhost/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        showAlert({
          title: "Correo enviado",
          text: "Te enviamos un correo con el enlace para restablecer tu contraseña.",
          type: "success",
        });
      } else {
        showAlert({
          title: "Ups...",
          text: data.message || "No pudimos enviar el correo",
          type: "error",
        });
      }

    } catch {
      showAlert({
        title: "Error",
        text: "No pudimos contactar al servidor.",
        type: "error",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] p-6">
      <Card className="bg-[#1A1A1A] border-[#333333] max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-white text-xl text-center">
            Recuperar contraseña
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSend} className="space-y-4">
            
            <div>
              <label className="text-white mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  className="pl-10 text-white bg-[#0D0D0D] border-[#333333]"
                  placeholder="correo@ejemplo.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSending}
              className="w-full bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]"
            >
              {isSending ? "Enviando..." : "Enviar enlace"}
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
