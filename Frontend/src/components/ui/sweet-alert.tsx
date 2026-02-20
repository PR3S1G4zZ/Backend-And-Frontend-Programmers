import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle, Info, Loader2, HelpCircle } from 'lucide-react';

export interface SweetAlertOptions {
  title: string;
  text?: string;
  html?: React.ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info' | 'question' | 'loading';
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  timer?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
  customIcon?: React.ReactNode;
  theme?: 'default' | 'code' | 'terminal' | 'cyber' | 'sunset' | 'ocean';
  showProgressBar?: boolean;
  customClass?: string;
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


const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function SweetAlertModal({
  title,
  text,
  html,
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
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const node = modalRef.current;
    const focusables = node?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    (focusables?.[0] ?? node)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !node) return;

      const elements = node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
      if (elements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

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
        return <HelpCircle className="h-16 w-16 text-blue-400" />;
      case 'loading':
        return <Loader2 className="h-16 w-16 text-blue-400 animate-spin" />;
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
      case 'sunset':
        return 'bg-gradient-to-br from-[#1A0A0A] to-[#2D1B1B] border-[#FF6B6B]';
      case 'ocean':
        return 'bg-gradient-to-br from-[#0A1A2D] to-[#0D2D4D] border-[#4ECDC4]';
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
        case 'sunset':
          return 'bg-[#FF6B6B] text-white hover:bg-[#FF5252] border-[#FF6B6B]';
        case 'ocean':
          return 'bg-[#4ECDC4] text-[#0A1A2D] hover:bg-[#45B7AF] border-[#4ECDC4]';
        default:
          return 'bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]';
      }
    } else {
      switch (theme) {
        case 'terminal':
          return 'bg-transparent text-green-400 hover:bg-green-900/30 border-green-500 font-mono';
        case 'sunset':
          return 'bg-transparent text-[#FF6B6B] hover:bg-[#FF6B6B]/20 border-[#FF6B6B]';
        case 'ocean':
          return 'bg-transparent text-[#4ECDC4] hover:bg-[#4ECDC4]/20 border-[#4ECDC4]';
        default:
          return 'bg-transparent text-gray-300 hover:bg-[#333333] border-[#333333]';
      }
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
            {'[OK]}'}
          </div>
        </div>
      );
    }

    if (theme === 'sunset') {
      return (
        <div className="absolute inset-0 overflow-hidden rounded-lg opacity-15">
          <div className="absolute top-4 right-4 text-[#FF6B6B] font-mono text-xs">
            {'☀ sunset'}
          </div>
          <div className="absolute bottom-4 left-4 text-[#FF6B6B] font-mono text-xs">
            {'warm mode'}
          </div>
        </div>
      );
    }

    if (theme === 'ocean') {
      return (
        <div className="absolute inset-0 overflow-hidden rounded-lg opacity-15">
          <div className="absolute top-4 right-4 text-[#4ECDC4] font-mono text-xs">
            {'🌊 ocean'}
          </div>
          <div className="absolute bottom-4 left-4 text-[#4ECDC4] font-mono text-xs">
            {'deep sea'}
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
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
      onMouseDown={() => onClose()}
    >
      <div className="grid h-[100svh] w-full place-items-center overflow-y-auto p-3 sm:p-4">
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
          aria-modal="true"
          className={`relative ${html ? 'max-w-2xl' : 'max-w-md'} w-full max-h-[100svh] overflow-hidden border-2 rounded-lg shadow-2xl ${getThemeStyles()}`}
          onMouseDown={(e) => e.stopPropagation()}
          ref={modalRef}
          role="dialog"
          tabIndex={-1}
        >
          {renderThemeElements()}

          <div className={`relative z-10 ${html ? '' : 'text-center'} max-h-[calc(100svh-2rem)] overflow-y-auto p-5 sm:p-8 space-y-6`}>
            {/* Icono con animación sutil - solo si no hay HTML personalizado */}
            {!html && (
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
                  } : type === 'loading' ? {
                    rotate: [0, 360],
                  } : {
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{
                    duration: type === 'success' ? 1.5 : type === 'error' ? 0.4 : type === 'loading' ? 1 : 1.5,
                    repeat: type === 'error' ? 0 : type === 'loading' ? Infinity : Infinity,
                    repeatType: type === 'success' ? 'reverse' : 'mirror',
                    ease: type === 'loading' ? 'linear' : 'easeInOut'
                  }}
                >
                  {customIcon || getIcon()}
                </motion.div>
              </motion.div>
            )}

            {/* Icono por defecto si hay HTML pero no customIcon */}
            {html && !customIcon && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  damping: 15,
                  stiffness: 200
                }}
                className="flex justify-center mb-4"
              >
                <motion.div
                  animate={type === 'error' ? {
                    x: [-2, 2, -2, 2, 0],
                  } : {}}
                  transition={{
                    duration: type === 'error' ? 0.4 : 0,
                    repeat: 0
                  }}
                >
                  {getIcon()}
                </motion.div>
              </motion.div>
            )}

            {/* Icono personalizado si hay HTML */}
            {html && customIcon && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  damping: 15,
                  stiffness: 200
                }}
                className="flex justify-center mb-4"
              >
                {customIcon}
              </motion.div>
            )}

            {/* Título */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-2xl font-bold text-white ${theme === 'code' || theme === 'cyber' ? 'text-shadow-sm' : ''}`}
            >
              {title}
            </motion.h2>

            {/* Texto o HTML personalizado */}
            {html ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-left"
              >
                {html}
              </motion.div>
            ) : text && (
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
              className={`sticky bottom-0 flex ${showCancelButton ? 'justify-center gap-3 flex-col-reverse sm:flex-row' : 'justify-center'} border-t border-white/10 bg-[#1A1A1A]/95 pt-4`}
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
          {(theme === 'sunset') && (
            <>
              <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-[#FF6B6B]/50" />
              <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-[#FF6B6B]/50" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-[#FF6B6B]/50" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-[#FF6B6B]/50" />
            </>
          )}
          {(theme === 'ocean') && (
            <>
              <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-[#4ECDC4]/50" />
              <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-[#4ECDC4]/50" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-[#4ECDC4]/50" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-[#4ECDC4]/50" />
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
