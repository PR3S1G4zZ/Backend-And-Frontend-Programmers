import { useEffect, useRef, useState } from 'react';
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
import { AdminDashboard } from './components/AdminDashboard';
import { PageTransition, usePageTransition, LoadingIndicator } from './components/PageTransition';
import { CodeAnimations } from './components/CodeAnimations';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { authService } from './services/authService';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { AuthCallbackPage } from './components/AuthCallbackPage';

type PageType =
  | 'home'
  | 'for-programmers'
  | 'for-companies'
  | 'contact'
  | 'login'
  | 'register'
  | 'programmer-dashboard'
  | 'company-dashboard'
  | 'admin-dashboard'
  | 'forgot-password'
  | 'reset-password'
  | 'auth-callback';

type UserType = 'guest' | 'programmer' | 'company' | 'admin';

import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [userType, setUserType] = useState<UserType>('guest');
  const { isLoading: isPageLoading, navigateWithLoading } = usePageTransition();
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const hasInitialized = useRef(false);

  const dashboardByRole: Record<Exclude<UserType, 'guest'>, PageType> = {
    programmer: 'programmer-dashboard',
    company: 'company-dashboard',
    admin: 'admin-dashboard',
  };

  // 🔥 Detectar entrada directa desde rutas con path real (sin router)
  useEffect(() => {
    const path = window.location.pathname;

    if (path === "/reset-password") {
      setCurrentPage("reset-password");
      hasInitialized.current = true;
    }

    if (path === "/forgot-password") {
      setCurrentPage("forgot-password");
      hasInitialized.current = true;
    }

    if (path === "/auth/callback") {
      setCurrentPage("auth-callback");
      hasInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (isAuthLoading || hasInitialized.current) return;

    const savedPage = localStorage.getItem('last_page') as PageType | null;
    const publicPages: PageType[] = [
      'home',
      'for-programmers',
      'for-companies',
      'contact',
      'login',
      'register',
      'forgot-password',
      'reset-password',
    ];

    if (user) {
      const role = user.user_type as Exclude<UserType, 'guest'>;
      const dashboardPage = dashboardByRole[role];
      const targetPage =
        savedPage && savedPage.includes('dashboard') ? savedPage : dashboardPage;

      setUserType(role);
      setCurrentPage(targetPage);
    } else {
      setUserType('guest');
      setCurrentPage(publicPages.includes(savedPage as PageType) ? savedPage! : 'home');
    }

    hasInitialized.current = true;
  }, [isAuthLoading, user]);

  const handleNavigate = (page: string) => {
    try {
      const dashboardPages = ['programmer-dashboard', 'company-dashboard', 'admin-dashboard'];

      if (dashboardPages.includes(page)) {
        // Usar user del contexto, o fallback síncrono de localStorage
        // (resuelve race condition: setUser es async, pero setStoredUser es sync)
        const currentUser = user ?? authService.getStoredUser();

        // Si no hay usuario autenticado, redirigir al login
        if (!currentUser) {
          setCurrentPage('login');
          localStorage.setItem('last_page', 'login');
          return;
        }

        // Verificar que el rol del usuario coincide con el dashboard solicitado
        const allowedDashboard = dashboardByRole[currentUser.user_type as Exclude<UserType, 'guest'>];
        const targetPage = allowedDashboard || 'home';

        setUserType(currentUser.user_type as Exclude<UserType, 'guest'>);
        setCurrentPage(targetPage as PageType);
        localStorage.setItem('last_page', targetPage);
        return;
      }

      navigateWithLoading(page, () => {
        setCurrentPage(page as PageType);
        localStorage.setItem('last_page', page);
      });
    } catch (error) {
      console.error('Error during navigation:', error);
      setCurrentPage(page as PageType);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigateWithLoading('home', () => {
        setUserType('guest');
        setCurrentPage('home');
        localStorage.setItem('last_page', 'home');
      });
    } catch (error) {
      console.error('Error during logout:', error);
      setUserType('guest');
      setCurrentPage('home');
      localStorage.setItem('last_page', 'home');
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
        case 'admin-dashboard':
          return <AdminDashboard onLogout={handleLogout} />;
        case 'forgot-password':
          return <ForgotPasswordPage onNavigate={handleNavigate} />;
        case 'reset-password':
          return <ResetPasswordPage onNavigate={handleNavigate} />;
        case 'auth-callback':
          return <AuthCallbackPage onNavigate={handleNavigate} />;
        default:
          return <LandingPage onNavigate={handleNavigate} />;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
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
            <h1 className="text-2xl font-bold text-foreground mb-4">Error de Aplicación</h1>
            <p className="text-muted-foreground mb-4">Ha ocurrido un error inesperado.</p>
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              🔄 Recargar Página
            </motion.button>
          </div>
        </div>
      );
    }
  };

  const shouldShowNavbarAndFooter =
    !['programmer-dashboard', 'company-dashboard', 'admin-dashboard'].includes(currentPage);

  const isDashboard =
    ['programmer-dashboard', 'company-dashboard', 'admin-dashboard'].includes(currentPage);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">

      {!isDashboard && <CodeAnimations />}

      <AnimatePresence>
        {isPageLoading && (
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
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Navbar
              userType={userType}
              currentPage={currentPage}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {isDashboard ? (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderPage()}
            </motion.div>
          ) : (
            <PageTransition pageKey={currentPage} isLoading={isPageLoading}>
              {renderPage()}
            </PageTransition>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <AnimatePresence>
        {shouldShowNavbarAndFooter &&
          !['login', 'register', 'forgot-password', 'reset-password']
            .includes(currentPage) && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Footer />
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
