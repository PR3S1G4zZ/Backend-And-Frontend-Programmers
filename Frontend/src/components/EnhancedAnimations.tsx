import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export function EnhancedAnimations() {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [showEffects, setShowEffects] = useState(true);

  useEffect(() => {
    // Generar elementos flotantes elegantes y nítidos
    const elements: FloatingElement[] = [];
    for (let i = 0; i < 6; i++) { // Reducido aún más
      elements.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.5, // Más pequeños
        opacity: Math.random() * 0.2 + 0.1, // Más sutiles
        duration: Math.random() * 6 + 8, // Más lentos
        delay: Math.random() * 4
      });
    }
    setFloatingElements(elements);
  }, []);

  if (!showEffects) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Elementos flotantes sin blur */}
      <AnimatePresence>
        {floatingElements.map((element) => (
          <motion.div
            key={`floating-${element.id}`}
            className="absolute rounded-full"
            style={{
              left: element.x,
              top: element.y,
              width: element.size + 'px',
              height: element.size + 'px',
              background: `radial-gradient(circle, #00FF85 0%, #00FF85 30%, transparent 70%)`,
              opacity: element.opacity,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [element.opacity * 0.5, element.opacity, element.opacity * 0.5],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: element.delay,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Líneas de conexión limpias */}
      <svg className="absolute inset-0 w-full h-full opacity-8">
        <defs>
          <linearGradient id="clean-connection-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FF85" stopOpacity="0" />
            <stop offset="50%" stopColor="#00FF85" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00FF85" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Líneas elegantes sin efectos pesados */}
        <motion.path
          d="M0,40% Q30%,20% 60%,40% T100%,40%"
          stroke="url(#clean-connection-gradient)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M40%,0 Q60%,30% 40%,60% T40%,100%"
          stroke="url(#clean-connection-gradient)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </svg>

      {/* Ondas concéntricas limpias */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(1)].map((_, i) => ( // Solo 1 onda
          <motion.div
            key={`wave-${i}`}
            className="absolute rounded-full border border-[#00FF85]/[0.08]"
            animate={{
              width: [0, 400, 600],
              height: [0, 400, 600],
              opacity: [0.15, 0.08, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              delay: i * 6,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>

      {/* Control minimalista sin backdrop-blur */}
      <motion.button
        className="fixed bottom-4 left-4 z-50 bg-[#1A1A1A]/90 border border-[#333333]/70 text-white p-2 rounded-lg hover:bg-[#333333]/90 transition-all duration-300 pointer-events-auto text-xs opacity-60 hover:opacity-100"
        onClick={() => setShowEffects(!showEffects)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={showEffects ? 'Ocultar efectos' : 'Mostrar efectos'}
      >
        <motion.div
          animate={{ rotate: showEffects ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          className="w-4 h-4 flex items-center justify-center"
        >
          {showEffects ? '✨' : '🌑'}
        </motion.div>
      </motion.button>
    </div>
  );
}

// Componente de carga limpio
export function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`loading-dot-${i}`}
          className="w-2 h-2 bg-[#00FF85] rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
}

// Hook para animaciones escalonadas limpias
export function useStaggerAnimation() {
  return {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      }
    },
    item: {
      hidden: { opacity: 0, y: 10 },
      show: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: "tween",
          duration: 0.3,
          ease: "easeOut"
        }
      }
    }
  };
}

// Componente de notificación limpia
export function AnimatedNotification({ 
  message, 
  type = 'info', 
  onClose 
}: { 
  message: string; 
  type?: 'success' | 'error' | 'info' | 'warning'; 
  onClose: () => void; 
}) {
  const colors = {
    success: 'bg-green-600/95 border-green-500/60',
    error: 'bg-red-600/95 border-red-500/60',
    info: 'bg-blue-600/95 border-blue-500/60',
    warning: 'bg-yellow-600/95 border-yellow-500/60'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border text-white ${colors[type]} shadow-xl max-w-sm`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-white/80 hover:text-white transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>
      
      {/* Barra de progreso nítida */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-white/50 rounded-full"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
      />
    </motion.div>
  );
}

// Efecto de entrada para cards
export function CardEntranceEffect({ 
  children, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  delay?: number; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

// Efecto hover para botones
export function ButtonHoverEffect({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}