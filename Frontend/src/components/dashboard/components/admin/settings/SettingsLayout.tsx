import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Palette, Shield, Database, Activity, Menu, X } from 'lucide-react';
import { cn } from '../../ui/utils';
import { useAuth } from '../../../../../contexts/AuthContext';

interface SettingsLayoutProps {
    children: React.ReactNode;
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export function SettingsLayout({ children, activeSection, onSectionChange }: SettingsLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();

    // Define items based on role
    const isAdmin = user?.user_type === 'admin';

    const menuItems = [
        { id: 'profile', label: 'Mi Perfil', icon: User, allowed: true },
        { id: 'appearance', label: 'Apariencia', icon: Palette, allowed: true },
        { id: 'security', label: 'Seguridad', icon: Shield, allowed: true },
        { id: 'marketplace', label: 'Marketplace', icon: Database, allowed: isAdmin },
        { id: 'system', label: 'Sistema y Auditoría', icon: Activity, allowed: isAdmin },
    ];

    const handleNavClick = (id: string) => {
        onSectionChange(id);
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[600px] gap-6">
            {/* Mobile Toggle */}
            <div className="md:hidden mb-4 flex justify-between items-center bg-[#1A1A1A] p-3 rounded-lg border border-[#333333]">
                <span className="text-[#00FF85] font-semibold">
                    {menuItems.find(i => i.id === activeSection)?.label}
                </span>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <AnimatePresence>
                {(isSidebarOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className={cn(
                            "w-full md:w-64 flex-shrink-0 space-y-1 bg-[#1A1A1A] p-4 rounded-xl border border-[#333333] h-fit md:block",
                            !isSidebarOpen && "hidden"
                        )}
                    >
                        <h3 className="text-gray-500 text-xs uppercase font-bold mb-4 px-2">Configuración</h3>
                        {menuItems.filter(item => item.allowed).map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                                    activeSection === item.id
                                        ? "bg-[#00FF85]/10 text-[#00FF85] border border-[#00FF85]/20"
                                        : "text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-4 h-4 transition-colors",
                                    activeSection === item.id ? "text-[#00FF85]" : "text-gray-500 group-hover:text-white"
                                )} />
                                {item.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 bg-[#1A1A1A] rounded-xl border border-[#333333] p-6 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF85]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
                {children}
            </motion.div>
        </div>
    );
}
