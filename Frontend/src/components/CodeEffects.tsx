import { motion } from "framer-motion";
import { useEffect, useState } from 'react';

// Componente de lluvia de código Matrix-style
export function CodeRain({ density = 20, speed = 2 }: { density?: number; speed?: number }) {
  const [columns, setColumns] = useState<Array<{ id: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const newColumns = Array.from({ length: density }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + speed
    }));
    setColumns(newColumns);
  }, [density, speed]);

  const codeChars = ['0', '1', '{', '}', '[', ']', '<', '>', '/', '\\', '(', ')', ';', ':', '=', '+', '-', '*', '%'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
      {columns.map((column) => (
        <motion.div
          key={column.id}
          className="absolute text-[#00FF85] text-xs font-mono"
          style={{
            left: `${(column.id * 100) / density}%`,
            top: '-10%',
          }}
          animate={{
            y: ['0vh', '110vh'],
          }}
          transition={{
            duration: column.duration,
            repeat: Infinity,
            delay: column.delay,
            ease: 'linear',
          }}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="mb-2">
              {codeChars[Math.floor(Math.random() * codeChars.length)]}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

// Componente de partículas de código flotante
export function FloatingCodeParticles({ count = 15 }: { count?: number }) {
  const codeSymbols = ['<>', '{}', '[]', '/>', '/*', '*/', '&&', '||', '=>', '===', '!==', '?:', '...', '++', '--'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-[#00FF85] text-xs font-mono opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 360],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        >
          {codeSymbols[Math.floor(Math.random() * codeSymbols.length)]}
        </motion.div>
      ))}
    </div>
  );
}

// Componente de texto con efecto de escritura
export function TypewriterText({ 
  text, 
  speed = 50, 
  className = "",
  onComplete
}: { 
  text: string; 
  speed?: number; 
  className?: string;
  onComplete?: () => void;
}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
      // Parpadeo del cursor al terminar
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      return () => clearInterval(cursorInterval);
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayText}
      <span className={`text-[#00FF85] ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
        |
      </span>
    </span>
  );
}

// Componente de terminal simulado
export function TerminalWindow({ 
  title = "terminal", 
  children,
  className = ""
}: { 
  title?: string; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[#1A1A1A] border border-[#333333] rounded-lg overflow-hidden ${className}`}>
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0D0D0D] border-b border-[#333333]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-gray-400 text-sm font-mono">{title}</div>
        <div className="w-12"></div>
      </div>
      
      {/* Terminal content */}
      <div className="p-4 font-mono text-sm">
        {children}
      </div>
    </div>
  );
}

// Componente de barra de progreso con estilo de carga
export function CodeLoadingBar({ 
  progress, 
  label = "Loading...",
  showPercentage = true
}: { 
  progress: number; 
  label?: string;
  showPercentage?: boolean;
}) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm font-mono">{label}</span>
        {showPercentage && (
          <span className="text-[#00FF85] text-sm font-mono">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-[#333333] rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-r from-[#00C46A] to-[#00FF85] h-full relative"
        >
          <motion.div
            animate={{
              x: [-20, 100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-y-0 w-5 bg-white/30 blur-sm"
          />
        </motion.div>
      </div>
    </div>
  );
}

// Componente de background con patrón de circuitos
export function CircuitPattern({ opacity = 0.1 }: { opacity?: number }) {
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(0,255,133,${opacity}) 1px, transparent 1px),
          linear-gradient(rgba(0,255,133,${opacity}) 1px, transparent 1px),
          radial-gradient(circle at 20px 20px, rgba(0,255,133,${opacity * 2}) 2px, transparent 2px)
        `,
        backgroundSize: '40px 40px, 40px 40px, 40px 40px',
        animation: 'circuit-flow 20s linear infinite'
      }}
    />
  );
}

// Animación de "compilando" código
export function CompilingAnimation() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-3 text-[#00FF85] font-mono">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-5 h-5 border-2 border-[#00FF85] border-t-transparent rounded-full"
      />
      <span>Compiling{dots}</span>
    </div>
  );
}