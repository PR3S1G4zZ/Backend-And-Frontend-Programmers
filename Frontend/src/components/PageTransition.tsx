import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string;
  isLoading?: boolean;
}

export function PageTransition({ children, pageKey, isLoading: _isLoading = false }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function usePageTransition() {
  const [isLoading, setIsLoading] = useState(false);

  const navigateWithLoading = useCallback((_page: string, onComplete: () => void) => {
    setIsLoading(true);

    // Tiempo mínimo para la transición
    setTimeout(() => {
      onComplete();
      setTimeout(() => {
        setIsLoading(false);
      }, 150);
    }, 250);
  }, []);

  return { isLoading, navigateWithLoading };
}

export function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Editor de código minimalista simulado */}
      <motion.div
        className="bg-card border border-border rounded-lg p-4 font-mono text-sm w-80"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header del editor */}
        <div className="flex items-center space-x-2 border-b border-border pb-2 mb-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-muted-foreground text-xs">loading.js</span>
        </div>

        {/* Líneas de código que aparecen */}
        <div className="space-y-1">
          <motion.div
            className="text-muted-foreground"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            // Connecting to network...
          </motion.div>

          <motion.div
            className="text-primary"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: 0.6 }}
            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            const connection = await connect();
          </motion.div>

          <motion.div
            className="text-primary/80"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, delay: 1.2 }}
            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            return connection.ready();
          </motion.div>

          {/* Cursor parpadeante */}
          <motion.div
            className="flex items-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <motion.div
              className="w-0.5 h-4 bg-primary"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Mensaje de estado */}
      <motion.p
        className="text-primary text-sm font-mono"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      >
        Establishing connection<motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        >...</motion.span>
      </motion.p>
    </div>
  );
}

// Componente de entrada suave para páginas
export function SmoothPageEntrance({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

// Animación de entrada escalonada para elementos
export function StaggerChildren({
  children,
  delay = 0.1
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// Elemento individual con animación escalonada
export function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4,
            ease: "easeOut"
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// Efecto de cursor parpadeante para texto
export function TypingCursor() {
  return (
    <motion.span
      className="inline-block w-0.5 h-4 bg-primary ml-1"
      animate={{ opacity: [1, 0, 1] }}
      transition={{
        duration: 1,
        repeat: Infinity
      }}
    />
  );
}

// Simulación de terminal
export function TerminalEffect({ commands }: { commands: string[] }) {
  return (
    <div className="bg-card/90 rounded border border-border p-4 font-mono text-sm max-w-md">
      <div className="flex items-center space-x-2 border-b border-muted pb-2 mb-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-muted-foreground text-xs">terminal</span>
      </div>

      <div className="space-y-2">
        {commands.map((command, index) => (
          <motion.div
            key={index}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: index * 0.3,
              ease: "easeOut"
            }}
            className="overflow-hidden whitespace-nowrap text-primary"
          >
            <span className="text-primary/70">$ </span>
            {command}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: commands.length * 0.3 + 0.5 }}
          className="flex items-center"
        >
          <span className="text-primary/70">$ </span>
          <TypingCursor />
        </motion.div>
      </div>
    </div>
  );
}