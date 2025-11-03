import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { ForProgrammersPage } from './components/ForProgrammersPage';
import { ForCompaniesPage } from './components/ForCompaniesPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ProgrammerDashboard } from './components/ProgrammerDashboard';
import { CompanyDashboard } from './components/CompanyDashboard';
import { PageTransition, usePageTransition, LoadingIndicator } from './components/PageTransition';
import { CodeAnimations } from './components/CodeAnimations';
import { AuthProvider } from './contexts/AuthContext';


type PageType = 
  | 'home' 
  | 'for-programmers' 
  | 'for-companies' 
  | 'contact' 
  | 'login' 
  | 'register'
  | 'programmer-dashboard'
  | 'company-dashboard';

type UserType = 'guest' | 'programmer' | 'company';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [userType, setUserType] = useState<UserType>('guest');
  const { isLoading, navigateWithLoading } = usePageTransition();

  const handleNavigate = (page: string) => {
    try {
      // Para dashboards, navegación inmediata sin animación de código
      if (page === 'programmer-dashboard' || page === 'company-dashboard') {
        setUserType(page.includes('programmer') ? 'programmer' : 'company');
        setCurrentPage(page as PageType);
        return;
      }

      // Para otras páginas, usar transición suave
      navigateWithLoading(page, () => {
        if (page === 'home' && userType !== 'guest') {
          setUserType('guest');
        }
        setCurrentPage(page as PageType);
      });
    } catch (error) {
      console.error('Error during navigation:', error);
      setCurrentPage(page as PageType);
    }
  };

  const handleLogout = () => {
    try {
      navigateWithLoading('home', () => {
        setUserType('guest');
        setCurrentPage('home');
      });
    } catch (error) {
      console.error('Error during logout:', error);
      setUserType('guest');
      setCurrentPage('home');
    }
  };

  const renderPage = () => {
    try {
      switch (currentPage) {
        case 'home':
          return <LandingPage onNavigate={handleNavigate} />;
        case 'for-programmers':
          return <ForProgrammersPage onNavigate={handleNavigate} />;
        case 'for-companies':
          return <ForCompaniesPage onNavigate={handleNavigate} />;
        case 'contact':
          return <ContactPage onNavigate={handleNavigate} />;
        case 'login':
          return <LoginPage onNavigate={handleNavigate} />;
        case 'register':
          return <RegisterPage onNavigate={handleNavigate} />;
        case 'programmer-dashboard':
          return <ProgrammerDashboard onLogout={handleLogout} />;
        case 'company-dashboard':
          return <CompanyDashboard onLogout={handleLogout} />;
        default:
          return <LandingPage onNavigate={handleNavigate} />;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return (
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity 
              }}
              className="text-6xl mb-4"
            >
              ⚠️
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-4">Error de Aplicación</h1>
            <p className="text-gray-300 mb-4">Ha ocurrido un error inesperado.</p>
            <motion.button 
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#00FF85] text-[#0D0D0D] px-6 py-3 rounded-lg hover:bg-[#00C46A] transition-colors font-medium"
            >
              🔄 Recargar Página
            </motion.button>
          </div>
        </div>
      );
    }
  };

  const shouldShowNavbarAndFooter = !['programmer-dashboard', 'company-dashboard'].includes(currentPage);
  const isDashboard = ['programmer-dashboard', 'company-dashboard'].includes(currentPage);

  return (
    <AuthProvider>
      <div className="dark min-h-screen bg-[#0D0D0D] flex flex-col relative">
      
      {/* Animación de escritura de código - Solo para páginas no-dashboard */}
      {!isDashboard && <CodeAnimations />}
      
      {/* Loading indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <LoadingIndicator />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Navbar */}
      <AnimatePresence>
        {shouldShowNavbarAndFooter && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut"
            }}
          >
            <Navbar 
              userType={userType} 
              currentPage={currentPage} 
              onNavigate={handleNavigate} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido principal */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {isDashboard ? (
            // Dashboards con entrada simple
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ 
                duration: 0.3, 
                ease: "easeOut"
              }}
            >
              {renderPage()}
            </motion.div>
          ) : (
            // Páginas regulares
            <PageTransition pageKey={currentPage} isLoading={isLoading}>
              {renderPage()}
            </PageTransition>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <AnimatePresence>
        {shouldShowNavbarAndFooter && !['login', 'register'].includes(currentPage) && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut"
            }}
          >
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </AuthProvider>
  );
}