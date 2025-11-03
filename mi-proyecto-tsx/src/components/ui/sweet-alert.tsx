import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

export interface SweetAlertOptions {
  title: string;
  text?: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'question';
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  timer?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
  customIcon?: React.ReactNode;
  theme?: 'default' | 'code' | 'terminal' | 'cyber';
}

interface AlertState extends SweetAlertOptions {
  isVisible: boolean;
  id: string;
}

export function useSweetAlert() {
  const [alerts, setAlerts] = useState<AlertState[]>([]);

  const showAlert = useCallback((options: SweetAlertOptions) => {
    const id = Date.now().toString();
    const alertState: AlertState = {
      ...options,
      isVisible: true,
      id
    };

    setAlerts(prev => [...prev, alertState]);

    // Auto close si tiene timer
    if (options.timer) {
      setTimeout(() => {
        hideAlert(id);
      }, options.timer);
    }

    return id;
  }, []);

  const hideAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const hideAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const Alert = () => {
    if (typeof document === 'undefined') return null;

    return createPortal(
      <AnimatePresence>
        {alerts.map((alert) => (
          <SweetAlertModal
            key={alert.id}
            {...alert}
            onClose={() => hideAlert(alert.id)}
          />
        ))}
      </AnimatePresence>,
      document.body
    );
  };

  return { showAlert, hideAlert, hideAllAlerts, Alert };
}

function SweetAlertModal({
  title,
  text,
  type = 'info',
  showCancelButton = false,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  onConfirm,
  onCancel,
  onClose,
  customIcon,
  theme = 'default'
}: AlertState & { onClose: () => void }) {
  
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const getIcon = () => {
    if (customIcon) return customIcon;
    
    switch (type) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-400" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-red-400" />;
      case 'warning':
        return <AlertCircle className="h-16 w-16 text-yellow-400" />;
      case 'question':
        return <Info className="h-16 w-16 text-blue-400" />;
      default:
        return <Info className="h-16 w-16 text-blue-400" />;
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'code':
        return 'bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border-[#00FF85]';
      case 'terminal':
        return 'bg-black border-green-500 font-mono';
      case 'cyber':
        return 'bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-[#00C46A]';
      default:
        return 'bg-[#1A1A1A] border-[#333333]';
    }
  };

  const getButtonStyles = (variant: 'confirm' | 'cancel') => {
    if (variant === 'confirm') {
      switch (theme) {
        case 'code':
        case 'cyber':
          return 'bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] border-[#00FF85]';
        case 'terminal':
          return 'bg-green-600 text-white hover:bg-green-700 border-green-500 font-mono';
        default:
          return 'bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]';
      }
    } else {
      return 'bg-transparent text-gray-300 hover:bg-[#333333] border-[#333333]';
    }
  };

  const renderThemeElements = () => {
    if (theme === 'code' || theme === 'cyber') {
      return (
        <div className="absolute inset-0 overflow-hidden rounded-lg opacity-10">
          {/* Solo algunas partículas muy sutiles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-[#00FF85] font-mono text-xs"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['{}', '<>', '/>', '=>'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>
      );
    }

    if (theme === 'terminal') {
      return (
        <div className="absolute inset-0 overflow-hidden rounded-lg opacity-20">
          <div className="absolute top-2 left-2 text-green-400 font-mono text-xs">
            {'> success_alert.exe'}
          </div>
          <div className="absolute bottom-2 right-2 text-green-400 font-mono text-xs">
            {'[OK]'}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ 
          type: "spring", 
          damping: 20, 
          stiffness: 300,
          duration: 0.4 
        }}
        className={`relative max-w-md w-full border-2 rounded-lg p-8 shadow-2xl overflow-hidden ${getThemeStyles()}`}
      >
        {renderThemeElements()}
        
        <div className="relative z-10 text-center space-y-6">
          {/* Icono con animación sutil */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: 0.2, 
              type: "spring", 
              damping: 15, 
              stiffness: 200 
            }}
            className="flex justify-center"
          >
            <motion.div
              animate={type === 'success' ? {
                scale: [1, 1.1, 1],
              } : type === 'error' ? {
                x: [-2, 2, -2, 2, 0],
              } : {
                opacity: [1, 0.8, 1]
              }}
              transition={{
                duration: type === 'success' ? 1.5 : type === 'error' ? 0.4 : 1.5,
                repeat: type === 'error' ? 0 : Infinity,
                repeatType: type === 'success' ? 'reverse' : 'mirror'
              }}
            >
              {getIcon()}
            </motion.div>
          </motion.div>

          {/* Título */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-2xl font-bold text-white ${theme === 'code' || theme === 'cyber' ? 'text-shadow-sm' : ''}`}
          >
            {title}
          </motion.h2>

          {/* Texto */}
          {text && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-gray-300 ${theme === 'terminal' ? 'font-mono' : ''}`}
            >
              {text}
            </motion.p>
          )}

          {/* Botones */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`flex ${showCancelButton ? 'justify-center space-x-4' : 'justify-center'} pt-4`}
          >
            {showCancelButton && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${getButtonStyles('cancel')}`}
              >
                {cancelButtonText}
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirm}
              className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium relative overflow-hidden ${getButtonStyles('confirm')}`}
            >
              <span className="relative z-10">{confirmButtonText}</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Bordes decorativos para temas especiales */}
        {(theme === 'code' || theme === 'cyber') && (
          <>
            <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-[#00FF85]/50" />
            <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-[#00FF85]/50" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-[#00FF85]/50" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-[#00FF85]/50" />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}