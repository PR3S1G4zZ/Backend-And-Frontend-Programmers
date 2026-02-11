import { motion } from 'framer-motion';
import { User, Palette, Shield, Database, Activity } from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { useAuth } from '../../../../../contexts/AuthContext';

interface SettingsLayoutProps {
    children: React.ReactNode;
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export function SettingsLayout({ children, activeSection, onSectionChange }: SettingsLayoutProps) {
    const { user } = useAuth();
    const isAdmin = user?.user_type === 'admin';

    const menuItems = [
        { id: 'profile', label: 'Mi Perfil', icon: User, allowed: true },
        { id: 'appearance', label: 'Apariencia', icon: Palette, allowed: true },
        { id: 'security', label: 'Seguridad', icon: Shield, allowed: true },
        { id: 'marketplace', label: 'Marketplace', icon: Database, allowed: isAdmin },
        { id: 'system', label: 'Sistema y Auditoría', icon: Activity, allowed: isAdmin },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        if (!item.allowed) return null;
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onSectionChange(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-[#00FF85]/10 text-[#00FF85] border border-[#00FF85]/20"
                                        : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-[#00FF85]" : "text-gray-500")} />
                                {item.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 w-1 h-8 bg-[#00FF85] rounded-r-lg"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 shadow-xl"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
