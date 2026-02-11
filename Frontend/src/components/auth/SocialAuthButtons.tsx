import { Button } from "../ui/button";
import { Github, Chrome } from "lucide-react";

interface SocialAuthButtonsProps {
  onSocialAuth: (provider: string) => void;
  isRegister?: boolean;
}

export function SocialAuthButtons({ onSocialAuth, isRegister = false }: SocialAuthButtonsProps) {
  const actionText = isRegister ? "Registrarse" : "Continuar";

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={() => onSocialAuth('Google')}
      >
        <Chrome className="h-5 w-5 mr-3" />
        {actionText} con Google
      </Button>
      <Button
        variant="outline"
        className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={() => onSocialAuth('GitHub')}
      >
        <Github className="h-5 w-5 mr-3" />
        {actionText} con GitHub
      </Button>
    </div>
  );
}