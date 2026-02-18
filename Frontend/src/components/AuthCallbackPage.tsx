import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoadingIndicator } from "./PageTransition";

interface AuthCallbackPageProps {
    onNavigate: (page: string) => void;
}

export function AuthCallbackPage({ onNavigate }: AuthCallbackPageProps) {
    const { refreshUser } = useAuth();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const userType = params.get("user_type");
        const name = params.get("name");

        if (token && userType && name) {
            // Store token locally
            // Note: We use the service's private method if possible, or just set it manually via public method if exposes one?
            // authService.setToken is private in the code view I saw earlier? 
            // Wait, let me check authService.ts content again.
            // Line 174: private setToken(token: string)
            // Ah, it is private. I cannot call it directly.
            // However, `login` calls it.

            // I should probably expose a public method `handleExternalLogin(token, user)` or similar in AuthService.
            // OR, since this is JavaScript/Typescript, I can just use localStorage directly and force a reload or use refreshUser.

            localStorage.setItem('auth_token', token);

            // Also set temp user data
            const tempData = {
                id: 0,
                name,
                email: "",
                lastname: "",
                user_type: userType as any
            };
            localStorage.setItem('user_data', JSON.stringify(tempData));

            // Refresh via context to pick up the new token
            refreshUser().then(() => {
                // Navigate based on role
                if (userType === 'programmer') {
                    onNavigate('programmer-dashboard');
                } else if (userType === 'admin') {
                    onNavigate('admin-dashboard');
                } else {
                    onNavigate('company-dashboard');
                }
            }).catch(err => {
                console.error("Error refreshing user:", err);
                onNavigate('login');
            });

        } else {
            console.error("Missing tokens in callback URL");
            onNavigate("login");
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <LoadingIndicator />
                <p className="mt-4 text-muted-foreground">Autenticando con Google...</p>
            </div>
        </div>
    );
}
