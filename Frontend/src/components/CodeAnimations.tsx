import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface TypingLine {
  id: number;
  text: string;
  type: 'comment' | 'function' | 'variable' | 'keyword' | 'string';
  delay: number;
  duration: number;
}

export function CodeAnimations() {
  const [currentLines, setCurrentLines] = useState<TypingLine[]>([]);
  const [showEffects, setShowEffects] = useState(true);

  // Código realista que representa la esencia de la plataforma
  const codeSequences = [
    {
      lines: [
        { text: "// Conectando talento con oportunidades", type: "comment" as const },
        { text: "const programmers = new TalentPool();", type: "variable" as const },
        { text: "function matchSkills(developer, project) {", type: "function" as const },
        { text: "  return developer.skills.includes(project.requirements);", type: "keyword" as const },
        { text: "}", type: "function" as const },
        { text: "", type: "keyword" as const },
        { text: "// Construyendo el futuro del trabajo", type: "comment" as const },
        { text: "export default class Innovation {", type: "function" as const },
        { text: "  async connect() {", type: "function" as const },
        { text: '    return "Más que un empleo, Una Red de Código";', type: "string" as const },
        { text: "  }", type: "function" as const },
        { text: "}", type: "function" as const }
      ]
    },
    {
      lines: [
        { text: "// Sistema de matching inteligente", type: "comment" as const },
        { text: "import { talent } from './developers';", type: "keyword" as const },
        { text: "import { opportunities } from './companies';", type: "keyword" as const },
        { text: "", type: "keyword" as const },
        { text: "const findPerfectMatch = async () => {", type: "function" as const },
        { text: "  const projects = await opportunities.getActive();", type: "variable" as const },
        { text: "  const developers = await talent.getAvailable();", type: "variable" as const },
        { text: "  ", type: "keyword" as const },
        { text: "  return projects.map(project => ({", type: "function" as const },
        { text: "    ...project,", type: "keyword" as const },
        { text: "    bestMatch: developers.find(dev => ", type: "variable" as const },
        { text: "      dev.expertise.matches(project.stack)", type: "function" as const },
        { text: "    )", type: "function" as const },
        { text: "  }));", type: "function" as const },
        { text: "};", type: "function" as const }
      ]
    },
    {
      lines: [
        { text: "// Red global de desarrolladores", type: "comment" as const },
        { text: "class DeveloperNetwork {", type: "function" as const },
        { text: "  constructor() {", type: "function" as const },
        { text: "    this.members = new Map();", type: "variable" as const },
        { text: "    this.projects = [];", type: "variable" as const },
        { text: "  }", type: "function" as const },
        { text: "", type: "keyword" as const },
        { text: "  addDeveloper(profile) {", type: "function" as const },
        { text: "    this.members.set(profile.id, {", type: "function" as const },
        { text: "      ...profile,", type: "keyword" as const },
        { text: "      joinedAt: new Date(),", type: "variable" as const },
        { text: "      status: 'active'", type: "string" as const },
        { text: "    });", type: "function" as const },
        { text: "  }", type: "function" as const },
        { text: "}", type: "function" as const }
      ]
    }
  ];

  const getColorForType = (type: string) => {
    switch (type) {
      case 'comment': return 'text-gray-500';
      case 'function': return 'text-[#00FF85]';
      case 'variable': return 'text-[#00C46A]';
      case 'keyword': return 'text-blue-400';
      case 'string': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  useEffect(() => {
    if (!showEffects) return;

    let sequenceIndex = 0;
    let isActive = true;

    const typeNextSequence = () => {
      if (!isActive) return;

      const currentSequence = codeSequences[sequenceIndex];
      const lines: TypingLine[] = [];

      // Preparar todas las líneas de la secuencia actual
      currentSequence.lines.forEach((line, index) => {
        lines.push({
          id: Date.now() + index,
          text: line.text,
          type: line.type,
          delay: index * 0.8, // Delay entre líneas
          duration: line.text.length * 0.05 + 0.5 // Duración basada en longitud
        });
      });

      setCurrentLines(lines);

      // Calcular duración total de la secuencia
      const totalDuration = lines.reduce((acc, line) => 
        Math.max(acc, line.delay + line.duration), 0
      );

      // Limpiar y pasar a la siguiente secuencia
      setTimeout(() => {
        if (!isActive) return;
        setCurrentLines([]);
        
        setTimeout(() => {
          if (!isActive) return;
          sequenceIndex = (sequenceIndex + 1) % codeSequences.length;
          typeNextSequence();
        }, 2000); // Pausa entre secuencias
      }, totalDuration * 1000 + 3000); // Mostrar resultado completo por 3 segundos
    };

    typeNextSequence();

    return () => {
      isActive = false;
    };
  }, [showEffects]);

  if (!showEffects) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Área principal de escritura de código */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-8">
        <motion.div
          className="bg-[#0D0D0D]/80 border border-[#333333]/50 rounded-lg p-6 font-mono text-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header del editor de código */}
          <div className="flex items-center space-x-2 border-b border-[#333333]/50 pb-3 mb-4">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500/60 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500/60 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500/60 rounded-full"></div>
            </div>
            <span className="text-gray-400 text-xs ml-4">programmers-network.js</span>
            <div className="flex-1"></div>
            <motion.div
              className="text-[#00FF85] text-xs"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ● Live Coding
            </motion.div>
          </div>

          {/* Líneas de código que se escriben */}
          <div className="space-y-1 min-h-[300px]">
            <AnimatePresence>
              {currentLines.map((line, index) => (
                <motion.div
                  key={line.id}
                  className="flex items-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: line.delay }}
                >
                  {/* Número de línea */}
                  <span className="text-gray-600 text-xs w-8 text-right mr-4 select-none">
                    {index + 1}
                  </span>
                  
                  {/* Contenido de la línea con efecto typing */}
                  <div className="flex-1 relative">
                    <motion.div
                      className={`overflow-hidden whitespace-nowrap ${getColorForType(line.type)}`}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{
                        duration: line.duration,
                        delay: line.delay + 0.2,
                        ease: 'linear'
                      }}
                    >
                      {line.text || ' '}
                      
                      {/* Cursor parpadeante al final de cada línea */}
                      <motion.span
                        className="inline-block w-0.5 h-4 bg-[#00FF85] ml-0.5"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: line.delay + line.duration + 0.2
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Cursor principal cuando no hay líneas activas */}
            {currentLines.length === 0 && (
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-gray-600 text-xs w-8 text-right mr-4">1</span>
                <motion.div
                  className="w-0.5 h-4 bg-[#00FF85]"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            )}
          </div>

          {/* Footer del editor */}
          <div className="flex items-center justify-between mt-6 pt-3 border-t border-[#333333]/50 text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>JavaScript</span>
              <span>UTF-8</span>
              <span>LF</span>
            </div>
            <div className="flex items-center space-x-4">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Connecting developers...
              </motion.span>
              <span>Ln 1, Col 1</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Efectos sutiles de fondo */}
      <div className="absolute inset-0 opacity-5">
        {/* Grid de código minimalista */}
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20px 20px, #00FF85 1px, transparent 1px),
              radial-gradient(circle at 60px 60px, #00C46A 0.5px, transparent 0.5px)
            `,
            backgroundSize: '40px 40px, 80px 80px'
          }}
        />
      </div>

      {/* Algunos símbolos flotantes muy sutiles */}
      <div className="absolute inset-0">
        {['{', '}', '<', '>', '/', '*'].map((symbol, i) => (
          <motion.div
            key={`symbol-${i}`}
            className="absolute font-mono text-[#00FF85] opacity-10 pointer-events-none"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + Math.sin(i) * 30}%`,
              fontSize: '12px'
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'easeInOut'
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      {/* Control minimalista */}
      <motion.button
        className="fixed bottom-4 right-4 z-50 bg-[#1A1A1A]/90 border border-[#333333] text-[#00FF85] p-3 rounded font-mono text-xs hover:bg-[#333333]/50 transition-colors pointer-events-auto"
        onClick={() => setShowEffects(!showEffects)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title={showEffects ? 'Disable code animation' : 'Enable code animation'}
      >
        <motion.div
          animate={{ rotate: showEffects ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-2"
        >
          <span>{showEffects ? '⌨️' : '💤'}</span>
          <span className="hidden sm:inline">{showEffects ? 'Coding' : 'Paused'}</span>
        </motion.div>
      </motion.button>
    </div>
  );
}

// Componente simple para efectos de código en secciones específicas
export function SimpleCodeEffect({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      
      {/* Solo algunos símbolos muy sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['<>', '{}', '//'].map((symbol, i) => (
          <motion.div
            key={`simple-${i}`}
            className="absolute font-mono text-[#00FF85]/10 text-xs"
            style={{
              left: `${30 + i * 20}%`,
              top: `${40 + i * 15}%`,
            }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 2,
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>
    </div>
  );
}