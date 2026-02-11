import { Palette, Moon, Sun, Monitor, Check } from 'lucide-react';
import { cn } from '../../../components/ui/utils';
import { useTheme } from '../../../contexts/ThemeContext';

export function AppearanceSection() {
    const { theme, accentColor, setTheme, setAccentColor } = useTheme();

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
        '#EC4899', // Pink
        '#14B8A6', // Teal
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Apariencia</h2>
                <p className="text-muted-foreground text-sm">Personaliza cómo se ve la aplicación.</p>
            </div>

            {/* Theme Selector */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">Tema</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {themes.map((t) => {
                        const Icon = t.icon;
                        const isActive = theme === t.id;
                        // For terminal theme we might want a different look, but standard selection is fine
                        return (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id as any)}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-xl border transition-all",
                                    isActive
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-card border-border text-muted-foreground hover:border-muted-foreground/50"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{t.label}</span>
                                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-primary" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">Color de Acento</label>
                <div className="flex flex-wrap gap-4">
                    {colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => setAccentColor(color)}
                            className={cn(
                                "relative w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 ring-offset-background",
                                accentColor === color ? "ring-foreground" : "ring-transparent"
                            )}
                            style={{ backgroundColor: color }}
                        >
                            {accentColor === color && (
                                <Check className="w-5 h-5 text-black" /> // Black check works well on bright colors
                            )}
                        </button>
                    ))}
                    <div className="relative group">
                        <input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-10 h-10 rounded-full overflow-hidden opacity-0 absolute inset-0 cursor-pointer"
                        />
                        <div className={cn(
                            "w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground group-hover:border-foreground transition-colors",
                            !colors.includes(accentColor) && "border-foreground"
                        )}>
                            <Palette className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Language (Placeholder for now, implementation not requested in prompt but was in original file) */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">Idioma</label>
                <div className="flex gap-4">
                    <button className={cn("px-4 py-2 rounded-lg border text-sm font-medium transition-all bg-primary/10 border-primary text-primary")}>
                        Español
                    </button>
                    <button className={cn("px-4 py-2 rounded-lg border text-sm font-medium transition-all bg-card border-border text-muted-foreground hover:border-muted-foreground/50")}>
                        English
                    </button>
                </div>
            </div>
        </div>
    );
}
