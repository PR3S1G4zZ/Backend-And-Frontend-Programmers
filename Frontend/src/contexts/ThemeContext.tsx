import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { apiRequest } from '../services/apiClient';

type Theme = 'dark' | 'light' | 'terminal';

interface ThemeContextType {
    theme: Theme;
    accentColor: string;
    setTheme: (theme: Theme) => void;
    setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    // Default to dark mode and neon green if no user preferences
    const [theme, setThemeState] = useState<Theme>('dark');
    const [accentColor, setAccentColorState] = useState<string>('#00FF85');
    const [mounted, setMounted] = useState(false);

    // Initialize from localStorage or User preferences
    useEffect(() => {
        if (user?.preferences) {
            setThemeState((user.preferences.theme as Theme) || 'dark');
            setAccentColorState(user.preferences.accent_color || '#00FF85');
        } else {
            const savedTheme = localStorage.getItem('theme') as Theme;
            const savedColor = localStorage.getItem('accent_color');
            if (savedTheme) setThemeState(savedTheme);
            if (savedColor) setAccentColorState(savedColor);
        }
        setMounted(true);
    }, [user]);

    // Apply Theme Class to HTML element
    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;
        root.classList.remove('light', 'dark', 'terminal');
        root.classList.add(theme);

        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    // Apply Accent Color as CSS Variable
    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;
        // Convert Hex to RGB for tailwind alpha opacity support if needed, 
        // but for now we'll just set the main hex value.
        // A robust solution usually involves setting individual R, G, B channels or H, S, L.
        // For simplicity in this step, we'll assume the variable is used directly or we try to set it.

        root.style.setProperty('--primary-color', accentColor);

        // We can also generate a faint version
        // This is a naive hex-to-rgba implementation or we just use opacity in CSS
        root.style.setProperty('--primary-color-dim', `${accentColor}20`); // 20 hex = ~12% opacity

        localStorage.setItem('accent_color', accentColor);
    }, [accentColor, mounted]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        // Persist to backend if logged in
        if (user) {
            updateBackend({ theme: newTheme });
        }
    };

    const setAccentColor = (newColor: string) => {
        setAccentColorState(newColor);
        // Persist to backend if logged in
        if (user) {
            updateBackend({ accent_color: newColor });
        }
    };

    const updateBackend = async (data: any) => {
        try {
            // We use a debounce or just fire and forget for better UX, 
            // but for safety we'll just fire it. 
            // In a real app, you might want to debounce this.
            await apiRequest('/preferences', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Failed to save preference:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
