import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Star,
  Circle,
  ArrowLeft,
  ImageIcon,
  FileText,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isTyping?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  fileName?: string;
  fileSize?: string;
  isRead: boolean;
}

interface ChatSectionProps {
  userType: 'programmer' | 'company';
}

export function ChatSection({ userType }: ChatSectionProps) {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Datos ficticios de contactos (diferentes según tipo de usuario)
  const contacts: Contact[] = userType === 'programmer' ? [
    {
      id: '1',
      name: 'TechCorp SA',
      role: 'Empresa • Proyecto SaaS Dashboard',
      avatar: undefined,
      lastMessage: '¿Podrías enviarnos el update del progreso?',
      timestamp: '10:30 AM',
      unreadCount: 2,
      isOnline: true,
      isTyping: false
    },
    {
      id: '2',
      name: 'StartupXYZ',
      role: 'Empresa • Mobile App MVP',
      avatar: undefined,
      lastMessage: 'Perfecto, nos vemos mañana para la reunión',
      timestamp: 'Ayer',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      name: 'DataInsights Inc',
      role: 'Empresa • Analytics Dashboard',
      avatar: undefined,
      lastMessage: 'El cliente está muy contento con el progreso',
      timestamp: '2 días',
      unreadCount: 1,
      isOnline: true
    },
    {
      id: '4',
      name: 'PropTech Solutions',
      role: 'Empresa • Real Estate Platform',
      avatar: undefined,
      lastMessage: 'Hemos recibido tu propuesta, la revisaremos',
      timestamp: '3 días',
      unreadCount: 0,
      isOnline: false
    }
  ] : [
    {
      id: '1',
      name: 'Carlos Mendoza',
      role: 'Full Stack Developer • React/Node.js',
      avatar: undefined,
      lastMessage: 'He terminado la integración de pagos',
      timestamp: '15 min',
      unreadCount: 1,
      isOnline: true,
      isTyping: true
    },
    {
      id: '2',
      name: 'Elena Rodríguez',
      role: 'Frontend Developer • Vue.js',
      avatar: undefined,
      lastMessage: 'Los mockups están listos para revisión',
      timestamp: '1 hora',
      unreadCount: 0,
      isOnline: true
    },
    {
      id: '3',
      name: 'Miguel Torres',
      role: 'Backend Developer • Python',
      avatar: undefined,
      lastMessage: 'API documentada y desplegada en staging',
      timestamp: 'Ayer',
      unreadCount: 3,
      isOnline: false
    },
    {
      id: '4',
      name: 'Sofia Chen',
      role: 'Mobile Developer • React Native',
      avatar: undefined,
      lastMessage: '¿Cuándo podemos hacer la demo?',
      timestamp: '2 días',
      unreadCount: 0,
      isOnline: true
    }
  ];

  // Mensajes ficticios para la conversación seleccionada
  const messages: Message[] = selectedContact ? [
    {
      id: '1',
      senderId: userType === 'programmer' ? selectedContact : 'me',
      content: userType === 'programmer' 
        ? '¡Hola! Hemos revisado tu perfil y nos gustaría discutir una oportunidad de proyecto contigo.'
        : 'Hola, he visto tu proyecto y me parece muy interesante. ¿Podríamos hablar sobre los detalles?',
      timestamp: '09:00 AM',
      type: 'text',
      isRead: true
    },
    {
      id: '2',
      senderId: 'me',
      content: userType === 'programmer'
        ? 'Genial! Me encantaría conocer más detalles. ¿De qué tipo de proyecto se trata?'
        : 'Por supuesto! ¿Qué información necesitas? Puedo compartir mi portafolio completo.',
      timestamp: '09:15 AM',
      type: 'text',
      isRead: true
    },
    {
      id: '3',
      senderId: userType === 'programmer' ? selectedContact : 'me',
      content: userType === 'programmer'
        ? 'Necesitamos desarrollar un SaaS Dashboard con React y Node.js. El presupuesto está entre €8,000-€12,000.'
        : 'Aquí tienes el documento con los requerimientos técnicos del proyecto.',
      timestamp: '09:30 AM',
      type: userType === 'programmer' ? 'text' : 'file',
      fileName: userType === 'programmer' ? undefined : 'Project_Requirements.pdf',
      fileSize: userType === 'programmer' ? undefined : '2.4 MB',
      isRead: true
    },
    {
      id: '4',
      senderId: 'me',
      content: userType === 'programmer'
        ? 'Excelente, tengo experiencia en ambas tecnologías. ¿Cuál sería el timeline esperado?'
        : 'Perfecto, el proyecto se ve muy viable. ¿Cuándo podríamos hacer una video llamada?',
      timestamp: '10:00 AM',
      type: 'text',
      isRead: true
    },
    {
      id: '5',
      senderId: userType === 'programmer' ? selectedContact : 'me',
      content: contacts.find(c => c.id === selectedContact)?.lastMessage || 'Último mensaje',
      timestamp: '10:30 AM',
      type: 'text',
      isRead: false
    }
  ] : [];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedContactData = contacts.find(c => c.id === selectedContact);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      // Simular envío de mensaje
      setNewMessage('');
      
      // Simular indicador de escritura
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Chat</h1>
        <p className="text-gray-300">
          {userType === 'programmer' 
            ? 'Comunicación directa con empresas y clientes'
            : 'Conversaciones con desarrolladores y tu equipo'
          }
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Lista de Contactos */}
        <div className={`lg:col-span-1 ${selectedContact && isMobileView ? 'hidden lg:block' : ''}`}>
          <Card className="bg-[#1A1A1A] border-[#333333] h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Conversaciones</CardTitle>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar conversaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400"
                />
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-1 px-4 pb-4">
                  {filteredContacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full p-4 h-auto justify-start ${
                          selectedContact === contact.id 
                            ? 'bg-[#00FF85]/10 border border-[#00FF85]' 
                            : 'hover:bg-[#333333]'
                        }`}
                        onClick={() => {
                          setSelectedContact(contact.id);
                          setIsMobileView(true);
                        }}
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={contact.avatar} />
                              <AvatarFallback className="bg-[#00FF85] text-[#0D0D0D]">
                                {contact.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {contact.isOnline && (
                              <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center justify-between">
                              <p className="text-white font-medium truncate">{contact.name}</p>
                              <span className="text-xs text-gray-400">{contact.timestamp}</span>
                            </div>
                            <p className="text-xs text-gray-400 truncate">{contact.role}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-gray-300 truncate">
                                {contact.isTyping ? (
                                  <span className="text-[#00FF85] italic">Escribiendo...</span>
                                ) : (
                                  contact.lastMessage
                                )}
                              </p>
                              {contact.unreadCount > 0 && (
                                <Badge className="bg-[#00FF85] text-[#0D0D0D] text-xs h-5 w-5 p-0 flex items-center justify-center">
                                  {contact.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Área de Chat */}
        <div className={`lg:col-span-2 ${!selectedContact ? 'hidden lg:block' : ''}`}>
          {selectedContact ? (
            <Card className="bg-[#1A1A1A] border-[#333333] h-full flex flex-col">
              {/* Header del Chat */}
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden text-gray-400 hover:text-white p-2"
                      onClick={() => {
                        setSelectedContact(null);
                        setIsMobileView(false);
                      }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedContactData?.avatar} />
                        <AvatarFallback className="bg-[#00FF85] text-[#0D0D0D]">
                          {selectedContactData?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {selectedContactData?.isOnline && (
                        <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-white font-semibold">{selectedContactData?.name}</h3>
                      <p className="text-xs text-gray-400">{selectedContactData?.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <Separator className="bg-[#333333]" />

              {/* Mensajes */}
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${message.senderId === 'me' ? 'order-2' : 'order-1'}`}>
                            <div className={`p-3 rounded-lg ${
                              message.senderId === 'me'
                                ? 'bg-[#00FF85] text-[#0D0D0D]'
                                : 'bg-[#333333] text-white'
                            }`}>
                              {message.type === 'text' ? (
                                <p className="text-sm">{message.content}</p>
                              ) : message.type === 'file' ? (
                                <div className="flex items-center space-x-3">
                                  <div className="bg-blue-600 p-2 rounded">
                                    <FileText className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{message.fileName}</p>
                                    <p className="text-xs opacity-70">{message.fileSize}</p>
                                  </div>
                                  <Button size="sm" variant="ghost" className="p-1">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="bg-gray-700 rounded p-2 flex items-center justify-center h-32">
                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                  </div>
                                  <p className="text-sm">{message.content}</p>
                                </div>
                              )}
                            </div>
                            <div className={`flex items-center mt-1 space-x-2 ${
                              message.senderId === 'me' ? 'justify-end' : 'justify-start'
                            }`}>
                              <span className="text-xs text-gray-400">{message.timestamp}</span>
                              {message.senderId === 'me' && (
                                <span className="text-xs text-gray-400">
                                  {message.isRead ? '✓✓' : '✓'}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Indicador de escritura */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-[#333333] p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <motion.div
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                            />
                            <motion.div
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                            />
                            <motion.div
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Input de mensaje */}
              <div className="p-4 border-t border-[#333333]">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-[#0D0D0D] border-[#333333] text-white placeholder-gray-400 pr-12"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A] disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-[#1A1A1A] border-[#333333] h-full flex items-center justify-center">
              <div className="text-center">
                <div className="bg-[#333333] p-8 rounded-full mb-4 mx-auto w-24 h-24 flex items-center justify-center">
                  <Send className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Selecciona una conversación</h3>
                <p className="text-gray-400">
                  Elige un contacto de la lista para comenzar a chatear
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}