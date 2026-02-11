import { useState } from 'react';
import { SettingsLayout } from './settings/SettingsLayout';
import { ProfileSection } from './settings/ProfileSection';
import { AppearanceSection } from '../../settings/AppearanceSection';
import { SecuritySection } from './settings/SecuritySection';
import { MarketplaceSection } from './settings/MarketplaceSection';
import { SystemSection } from './settings/SystemSection';

export function AdminSettings() {
    const [activeSection, setActiveSection] = useState('profile');

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return <ProfileSection />;
            case 'appearance':
                return <AppearanceSection />;
            case 'security':
                return <SecuritySection />;
            case 'marketplace':
                return <MarketplaceSection />;
            case 'system':
                return <SystemSection />;
            default:
                return <ProfileSection />;
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 transition-colors duration-300">
            <div className="max-w-6xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-primary glow-text mb-2">Configuración</h1>
                <p className="text-muted-foreground">Administra tu cuenta y las preferencias de la plataforma.</p>
            </div>

            <SettingsLayout activeSection={activeSection} onSectionChange={setActiveSection}>
                {renderContent()}
            </SettingsLayout>
        </div>
    );
}
