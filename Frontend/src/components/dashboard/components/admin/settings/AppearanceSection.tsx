import { useState } from 'react';
import { Check, Moon, Sun, Monitor, Palette } from 'lucide-react';
import { apiRequest } from '../../../../../services/apiClient';
import { cn } from '../../../../../components/ui/utils';

export function AppearanceSection() {
    // Local state for immediate UI feedback, syncing with backend in background
    const [theme, setTheme] = useState('dark');
    const [accent, setAccent] = useState('#00FF85');
    const [language, setLanguage] = useState('es');

    // In a real app, you might lift this state or use a ThemeContext
    // to apply styles globally. For now we simulate the preference update.

    const themes = [
        { id: 'dark', name: 'Dark Mode', icon: Moon, bg: 'bg-[#0D0D0D]', border: 'border-gray-700' },
        { id: 'light', name: 'Light Mode', icon: Sun, bg: 'bg-white', border: 'border-gray-200' },
        { id: 'terminal', name: 'Terminal', icon: Monitor, bg: 'bg-black', border: 'border-green-900' },
    ];

    const accents = [
        '#00FF85', // Neon Green
        '#3B82F6', // Blue
        '#8B5CF6', // Purple
        '#F43F5E', // Rose
        '#F59E0B', // Amber
    ];

    const handleSave = async (updates: any) => {
        try {
            await apiRequest('/preferences', {
                method: 'PUT',
                body: JSON.stringify(updates)
            });
            // Update local state is handled by onClick handlers for immediate feedback
        } catch (error) {
            console.error('Failed to save preferences', error);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Apariencia y UX</h2>
                <p className="text-gray-400 text-sm">Personaliza tu experiencia visual en la plataforma.</p>
            </div>

            {/* Theme Selector */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-300">Tema del Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {themes.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => {
                                setTheme(t.id);
                                handleSave({ theme: t.id });
                            }}
                            className={cn(
                                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300",
                                theme === t.id
                                    ? "border-[#00FF85] bg-[#00FF85]/5"
                                    : "border-[#333333] hover:border-gray-500 bg-[#0D0D0D]"
                            )}
                        >
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", t.bg, t.border, "border")}>
                                <t.icon className={cn("w-5 h-5", theme === t.id ? "text-[#00FF85]" : "text-gray-400")} />
                            </div>
                            <div className="text-left">
                                <p className={cn("font-medium", theme === t.id ? "text-[#00FF85]" : "text-gray-300")}>{t.name}</p>
                                <p className="text-xs text-gray-500">Defecto del sistema</p>
                            </div>
                            {theme === t.id && <Check className="ml-auto w-5 h-5 text-[#00FF85]" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-300">Color de Acento</h3>
                <div className="flex flex-wrap gap-4">
                    {accents.map((color) => (
                        <button
                            key={color}
                            onClick={() => {
                                setAccent(color);
                                handleSave({ accent_color: color });
                            }}
                            className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 border-2",
                                accent === color ? "border-white" : "border-transparent"
                            )}
                            style={{ backgroundColor: color }}
                        >
                            {accent === color && <Check className="w-6 h-6 text-black mix-blend-overlay" />}
                        </button>
                    ))}
                    <div className="w-12 h-12 rounded-full border border-dashed border-gray-500 flex items-center justify-center text-gray-500 cursor-pointer hover:border-white hover:text-white transition-colors">
                        <Palette className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Language */}
            <div className="space-y-4 pt-4 border-t border-[#333333]">
                <h3 className="text-sm font-semibold text-gray-300">Idioma</h3>
                <div className="flex gap-4">
                    {['es', 'en'].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => {
                                setLanguage(lang);
                                handleSave({ language: lang });
                            }}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm border transition-all",
                                language === lang
                                    ? "bg-[#00FF85] text-[#0D0D0D] border-[#00FF85] font-bold"
                                    : "bg-transparent text-gray-400 border-[#333333] hover:border-gray-500"
                            )}
                        >
                            {lang === 'es' ? 'Español' : 'English'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
