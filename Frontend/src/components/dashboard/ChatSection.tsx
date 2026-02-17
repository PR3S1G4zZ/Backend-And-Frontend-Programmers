import { useEffect, useRef, useState } from 'react';
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
  ArrowLeft,
  ImageIcon,
  MessageSquare
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
  initialChatId?: string;
}

export function ChatSection({ userType, initialChatId }: ChatSectionProps) {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<string | null>(initialChatId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null); // New state for reply

  const currentUserId = user ? String(user.id) : 'me';

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true }); // Shorter timestamp
  };

  // ... (Load Conversations & Messages effects remain similar, keep them or re-implement if needed for context)
  // Re-implementing effects to ensure context is available in this replacement block
  useEffect(() => {
    let isMounted = true;
    const loadConversations = async () => {
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
        if (mapped.length > 0 && !selectedContact) {
          setSelectedContact(mapped[0].id);
        }
      } catch (error) {
        console.error('Error cargando conversaciones', error);
        if (isMounted) {
          // Silently fail or show minimal error to avoid UI clutter
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
  }, [messages, replyingTo]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const content = newMessage.trim();
    setNewMessage('');
    setReplyingTo(null);

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

  // Dummy actions
  const handleClearChat = () => setMessages([]);
  const handleBlockUser = () => alert("Usuario bloqueado (Simulación)");
  const handleDeleteMessage = (id: string) => setMessages(prev => prev.filter(m => m.id !== id));
  const handleCopyMessage = (content: string) => navigator.clipboard.writeText(content);


  return (
    <div className="h-screen flex flex-col bg-[#050505] overflow-hidden font-sans selection:bg-primary/20">
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar - Contact List */}
        <div className={`w-full lg:w-96 flex flex-col border-r border-[#222] bg-[#0A0A0A] ${selectedContact && isMobileView ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-5 border-b border-[#222]">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Mensajes</h1>
            <p className="text-xs text-gray-400 font-medium">
              {userType === 'programmer' ? 'Chats con Empresas' : 'Equipo & Devs'}
            </p>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-[#151515] border-transparent focus:bg-[#1A1A1A] focus:border-primary/20 transition-all rounded-lg h-10 text-sm"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-10 opacity-40">
                  <p className="text-sm">Sin resultados</p>
                </div>
              ) : filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact.id);
                    setIsMobileView(true);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center gap-4 transition-all duration-200 group relative overflow-hidden ${selectedContact === contact.id
                    ? 'bg-gradient-to-r from-primary/10 to-transparent'
                    : 'hover:bg-[#151515]'
                    }`}
                >
                  {selectedContact === contact.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full"
                    />
                  )}

                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 border-2 border-[#151515] shadow-sm">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className={`font-bold text-xs ${selectedContact === contact.id ? 'bg-primary text-primary-foreground' : 'bg-[#222] text-gray-400'
                        }`}>
                        {contact.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-[#0A0A0A] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
                    )}
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className={`font-semibold text-sm truncate ${selectedContact === contact.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                        }`}>
                        {contact.name}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">{contact.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500 truncate max-w-[160px] group-hover:text-gray-400 transition-colors">
                        {contact.isTyping ? <span className="text-primary animate-pulse">Escribiendo...</span> : contact.lastMessage}
                      </p>
                      {contact.unreadCount > 0 && (
                        <Badge className="h-5 min-w-[20px] bg-primary text-primary-foreground text-[10px] px-0 flex items-center justify-center rounded-full">
                          {contact.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col bg-[#050505] relative ${!selectedContact ? 'hidden lg:flex' : 'flex'} ${selectedContact && isMobileView ? 'fixed inset-0 z-50 lg:static' : ''}`}>
          {!selectedContact ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 rounded-full bg-[#111] flex items-center justify-center mb-6 animate-pulse">
                <MessageSquare className="h-10 w-10 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-200">Selecciona un chat</h2>
              <p className="text-gray-500 mt-2 max-w-sm">Elige una conversación del panel izquierdo para comenzar a colaborar.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-[73px] border-b border-[#222] bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="lg:hidden -ml-2 text-gray-400" onClick={() => setIsMobileView(false)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  <Avatar className="h-10 w-10 border border-[#222]">
                    <AvatarImage src={selectedContactData?.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {selectedContactData?.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-bold text-white leading-none mb-1">{selectedContactData?.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${selectedContactData?.isOnline ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-gray-500'}`}></span>
                      <span className="text-xs text-gray-400 font-medium">{selectedContactData?.isOnline ? 'En línea' : 'Desconectado'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-full hidden sm:flex">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-full hidden sm:flex">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-2 bg-[#222] hidden sm:block" />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-full">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#111] border-[#222] text-gray-200">
                      <DropdownMenuLabel>Opciones del Chat</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-[#222]" />
                      <DropdownMenuItem className="hover:bg-[#222] cursor-pointer">
                        <Search className="h-4 w-4 mr-2" /> Buscar en chat
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-[#222] cursor-pointer" onClick={handleClearChat}>
                        <div className="flex items-center text-orange-500">
                          <MessageSquare className="h-4 w-4 mr-2" /> Limpiar historial
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#222]" />
                      <DropdownMenuItem className="hover:bg-[#222] cursor-pointer text-red-500 focus:text-red-500" onClick={handleBlockUser}>
                        Bloquear usuario
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-hidden relative bg-[#050505]">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <ScrollArea className="h-full px-4 py-6">
                  <div className="space-y-6 pb-4 max-w-4xl mx-auto">
                    <AnimatePresence initial={false}>
                      {messages.map((message) => {
                        const isMe = message.senderId === currentUserId;
                        return (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex group ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex flex-col max-w-[80%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                              <div className={`relative px-5 py-3 shadow-sm text-sm leading-relaxed ${isMe
                                ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                                : 'bg-[#1E1E1E] text-gray-100 rounded-2xl rounded-tl-sm border border-[#2A2A2A]'
                                }`}>
                                {message.type === 'image' && (
                                  <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                                    <div className="bg-black/20 h-48 w-64 flex items-center justify-center">
                                      <ImageIcon className="h-8 w-8 opacity-50" />
                                    </div>
                                  </div>
                                )}

                                <p className="whitespace-pre-wrap">{message.content}</p>

                                {/* Message Meta & Actions */}
                                <div className={`absolute -bottom-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isMe ? 'right-0' : 'left-0'}`}>
                                  <span className="text-[10px] text-gray-500 font-mono">{message.timestamp}</span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-4 w-4 text-gray-500 hover:text-white">
                                        <MoreVertical className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-[#111] border-[#222]">
                                      <DropdownMenuItem onClick={() => handleCopyMessage(message.content)}>Copiar</DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => setReplyingTo(message)}>Responder</DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteMessage(message.id)}>Eliminar</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>

                              {isMe && (
                                <span className="text-[10px] text-gray-600 mt-1 mr-1 flex items-center gap-0.5">
                                  {message.isRead && <span className="text-primary">✓✓</span>}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[#0A0A0A] border-t border-[#222]">
                <div className="max-w-4xl mx-auto">
                  {replyingTo && (
                    <div className="flex items-center justify-between bg-[#151515] p-2 rounded-t-lg border-x border-t border-[#222] mb-0 ml-4 mr-4 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-8 bg-primary rounded-full"></div>
                        <div>
                          <span className="font-bold text-primary">Respondiendo a mensaje:</span>
                          <p className="line-clamp-1 opacity-70">{replyingTo.content}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReplyingTo(null)}>
                        <span className="sr-only">Cancelar</span>
                        ×
                      </Button>
                    </div>
                  )}

                  <div className="flex items-end gap-2 bg-[#121212] p-2 rounded-2xl border border-[#222] focus-within:border-primary/50 focus-within:bg-[#151515] transition-all shadow-lg">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-xl h-10 w-10 shrink-0">
                      <Paperclip className="h-5 w-5" />
                    </Button>

                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Escribe un mensaje..."
                      className="border-0 bg-transparent p-2 h-auto text-sm focus-visible:ring-0 placeholder-gray-500 text-white min-h-[40px] max-h-32 resize-none"
                    />

                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-xl h-10 w-10 shrink-0">
                      <Smile className="h-5 w-5" />
                    </Button>

                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={`h-10 w-10 rounded-xl shrink-0 transition-all duration-200 ${newMessage.trim()
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                        : 'bg-[#222] text-gray-600'
                        }`}
                    >
                      <Send className="h-5 w-5 ml-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
