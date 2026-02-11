import { useState, useEffect } from 'react';
import { Palette, Moon, Sun, Monitor, Check } from 'lucide-react';
import { apiRequest } from '../../../../../services/apiClient';
import { useAuth } from '../../../../../contexts/AuthContext';
import { cn } from '../../../../../components/ui/utils';

export function AppearanceSection() {
    const { user } = useAuth();
    const [preferences, setPreferences] = useState({
        theme: 'dark',
        accent_color: '#00FF85',
        language: 'es'
    });

    useEffect(() => {
        if (user && user.preferences) {
            setPreferences({
                theme: user.preferences.theme || 'dark',
                accent_color: user.preferences.accent_color || '#00FF85',
                language: user.preferences.language || 'es'
            });
        }
    }, [user]);

    const handleUpdate = async (updates: any) => {
        // Immediate UI update
        const newPreferences = { ...preferences, ...updates };
        setPreferences(newPreferences);

        try {
            await apiRequest('/preferences', {
                method: 'PUT',
                body: JSON.stringify(updates)
            });
            // Ideally we refresh user here or just assume success for UX
        } catch (error) {
            console.error('Failed to update preferences', error);
        }
    };

    const themes = [
        { id: 'dark', label: 'Oscuro', icon: Moon },
        { id: 'light', label: 'Claro', icon: Sun },
        { id: 'terminal', label: 'Terminal', icon: Monitor }
    ];

    const colors = [
        '#00FF85', // Neon Green
        '#3B82F6', // Blue
        '#8B5CF6', // Purple
        '#F43F5E', // Rose
        '#F59E0B', // Amber
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Apariencia</h2>
                <p className="text-gray-400 text-sm">Personaliza cómo se ve la aplicación.</p>
            </div>

            {/* Theme Selector */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Tema</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {themes.map((theme) => {
                        const Icon = theme.icon;
                        const isActive = preferences.theme === theme.id;
                        return (
                            <button
                                key={theme.id}
                                onClick={() => handleUpdate({ theme: theme.id })}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-xl border transition-all",
                                    isActive
                                        ? "bg-[#00FF85]/10 border-[#00FF85] text-[#00FF85]"
                                        : "bg-[#0D0D0D] border-[#333333] text-gray-400 hover:border-gray-500"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{theme.label}</span>
                                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-[#00FF85]" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Color de Acento</label>
                <div className="flex flex-wrap gap-4">
                    {colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => handleUpdate({ accent_color: color })}
                            className="relative w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
                            style={{ backgroundColor: color }}
                        >
                            {preferences.accent_color === color && (
                                <Check className="w-5 h-5 text-black" />
                            )}
                        </button>
                    ))}
                    <div className="relative group">
                        <input
                            type="color"
                            value={preferences.accent_color}
                            onChange={(e) => handleUpdate({ accent_color: e.target.value })}
                            className="w-10 h-10 rounded-full overflow-hidden opacity-0 absolute inset-0 cursor-pointer"
                        />
                        <div className="w-10 h-10 rounded-full border border-[#333333] bg-[#0D0D0D] flex items-center justify-center text-gray-400 group-hover:border-white transition-colors">
                            <Palette className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Language */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Idioma</label>
                <div className="flex gap-4">
                    <button
                        onClick={() => handleUpdate({ language: 'es' })}
                        className={cn(
                            "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                            preferences.language === 'es'
                                ? "bg-[#00FF85]/10 border-[#00FF85] text-[#00FF85]"
                                : "bg-[#0D0D0D] border-[#333333] text-gray-400 hover:border-gray-500"
                        )}
                    >
                        Español
                    </button>
                    <button
                        onClick={() => handleUpdate({ language: 'en' })}
                        className={cn(
                            "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                            preferences.language === 'en'
                                ? "bg-[#00FF85]/10 border-[#00FF85] text-[#00FF85]"
                                : "bg-[#0D0D0D] border-[#333333] text-gray-400 hover:border-gray-500"
                        )}
                    >
                        English
                    </button>
                </div>
            </div>
        </div>
    );
}
