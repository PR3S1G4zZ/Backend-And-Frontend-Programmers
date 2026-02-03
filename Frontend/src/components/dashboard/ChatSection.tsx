import { useEffect, useRef, useState } from 'react';
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
import { fetchConversationMessages, fetchConversations, sendConversationMessage } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';

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
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUserId = user ? String(user.id) : 'me';

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  useEffect(() => {
    let isMounted = true;
    const loadConversations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchConversations();
        if (!isMounted) return;
        const data = response.data || [];
        const mapped = data.map((contact) => ({
          id: String(contact.id),
          name: contact.name,
          role: contact.role,
          avatar: undefined,
          lastMessage: contact.lastMessage,
          timestamp: contact.timestamp ? formatTimestamp(contact.timestamp) : '',
          unreadCount: contact.unreadCount,
          isOnline: contact.isOnline,
          isTyping: false,
        }));
        setContacts(mapped);
        if (mapped.length > 0) {
          setSelectedContact((prev) => prev ?? mapped[0].id);
        }
      } catch (error) {
        console.error('Error cargando conversaciones', error);
        if (isMounted) {
          setError('No se pudieron cargar las conversaciones.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadMessages = async () => {
      if (!selectedContact) {
        setMessages([]);
        return;
      }
      try {
        const response = await fetchConversationMessages(Number(selectedContact));
        if (!isMounted) return;
        const data = response.data || [];
        setMessages(
          data.map((message) => ({
            id: String(message.id),
            senderId: message.senderId,
            content: message.content,
            timestamp: formatTimestamp(message.timestamp),
            type: message.type,
            fileName: message.fileName,
            fileSize: message.fileSize,
            isRead: message.isRead,
          }))
        );
      } catch (error) {
        console.error('Error cargando mensajes', error);
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [selectedContact]);

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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) {
      return;
    }

    const content = newMessage.trim();
    setNewMessage('');

    try {
      const response = await sendConversationMessage(Number(selectedContact), content);
      const sentMessage = response.data;
      setMessages((prev) => [
        ...prev,
        {
          id: String(sentMessage.id),
          senderId: sentMessage.senderId,
          content: sentMessage.content,
          timestamp: formatTimestamp(sentMessage.timestamp),
          type: sentMessage.type,
          isRead: sentMessage.isRead,
        },
      ]);
    } catch (error) {
      console.error('Error enviando mensaje', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Chat</h1>
        <p className="text-gray-300">
          {userType === 'programmer' 
            ? 'Comunicación directa con empresas y clientes'
            : 'Conversaciones con desarrolladores y tu equipo'
          }
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200 mb-4">
          {error}
        </div>
      ) : null}
      {isLoading ? (
        <div className="rounded-lg border border-[#333333] bg-[#1A1A1A] p-4 text-sm text-gray-300 mb-4">
          Cargando conversaciones...
        </div>
      ) : null}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 min-h-0">
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
                  {filteredContacts.length === 0 ? (
                    <p className="text-sm text-gray-400 p-4">No hay conversaciones disponibles.</p>
                  ) : filteredContacts.map((contact) => (
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
                          className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${message.senderId === currentUserId ? 'order-2' : 'order-1'}`}>
                            <div className={`p-3 rounded-lg ${
                              message.senderId === currentUserId
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
                              message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                            }`}>
                              <span className="text-xs text-gray-400">{message.timestamp}</span>
                              {message.senderId === currentUserId && (
                                <span className="text-xs text-gray-400">
                                  {message.isRead ? '✓✓' : '✓'}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    
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
