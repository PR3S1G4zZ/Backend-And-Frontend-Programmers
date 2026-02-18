import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { ScrollArea } from '../../ui/scroll-area';
import { MapPin, Clock, Star, Briefcase, Code, Award, X } from 'lucide-react';
import type { DeveloperProfile } from '../../../services/developerService'; // Reuse type
import { Skeleton } from '../../ui/skeleton';

interface DeveloperProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    developer: DeveloperProfile | null;
    isLoading: boolean;
}

export function DeveloperProfileModal({ isOpen, onClose, developer, isLoading }: DeveloperProfileModalProps) {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl w-full sm:max-w-[90vw] lg:max-w-7xl h-[90vh] bg-[#111] border-[#333333] p-0 overflow-hidden text-white sm:rounded-xl flex flex-col">
                <DialogHeader className="sr-only">
                    <DialogTitle>Perfil de Desarrollador: {developer?.name ?? 'Cargando...'}</DialogTitle>
                    <DialogDescription>
                        Detalles completos, experiencia y portafolio del desarrollador seleccionado.
                    </DialogDescription>
                </DialogHeader>
                {isLoading || !developer ? (
                    <div className="p-6 space-y-6">
                        <div className="flex items-start space-x-4">
                            <Skeleton className="h-24 w-24 rounded-full bg-[#333333]" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-6 w-1/3 bg-[#333333]" />
                                <Skeleton className="h-4 w-1/4 bg-[#333333]" />
                                <Skeleton className="h-4 w-full bg-[#333333]" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Skeleton className="h-20 bg-[#333333]" />
                            <Skeleton className="h-20 bg-[#333333]" />
                            <Skeleton className="h-20 bg-[#333333]" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4 bg-[#333333]" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-16 bg-[#333333]" />
                                <Skeleton className="h-8 w-16 bg-[#333333]" />
                                <Skeleton className="h-8 w-16 bg-[#333333]" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col max-h-[90vh] bg-[#111]">
                        {/* Hero Section / Banner */}
                        <div className="relative h-40 bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Code className="h-64 w-64 text-white transform rotate-12" />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 z-20 text-white/70 hover:text-white hover:bg-black/20 rounded-full"
                                onClick={onClose}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="px-8 pb-8 flex-1 overflow-hidden flex flex-col">
                            {/* Profile Header (Overlapping Banner) */}
                            <div className="flex flex-col md:flex-row gap-6 -mt-16 relative z-10 mb-8">
                                <Avatar className="h-32 w-32 border-4 border-[#111] shadow-2xl ring-4 ring-primary/10">
                                    <AvatarImage src={developer.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-700 text-3xl font-bold text-white">
                                        {developer.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 pt-16 md:pt-20 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                                {developer.name}
                                                {developer.isVerified && (
                                                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 p-1 rounded-full">
                                                        <Award className="h-4 w-4" />
                                                    </span>
                                                )}
                                            </h2>
                                            <p className="text-xl text-primary font-medium">{developer.title}</p>
                                        </div>
                                        <div className="text-right hidden md:block">
                                            <p className="text-3xl font-bold text-white">€{developer.hourlyRate}<span className="text-sm text-gray-500 font-normal">/h</span></p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                                        <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                                            <MapPin className="h-4 w-4" /> {developer.location}
                                        </span>
                                        <span className={`flex items-center gap-1.5 font-medium ${developer.availability === 'available' ? 'text-green-400' : 'text-gray-400'
                                            }`}>
                                            <Clock className="h-4 w-4" />
                                            {developer.availability === 'available' ? 'Disponible ahora' : 'Consultar disponibilidad'}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-yellow-400">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="text-white font-bold">{developer.rating}</span>
                                            <span className="text-gray-500">({developer.reviewsCount} reseñas)</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 pr-6 -mr-6">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
                                    {/* Left Content (Bio/Skills/Portfolio) - Takes 8 columns */}
                                    <div className="lg:col-span-8 space-y-8">
                                        {/* Bio */}
                                        <section className="bg-[#1A1A1A] p-8 rounded-xl border border-[#333]">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                                <div className="bg-primary/20 p-2.5 rounded-lg text-primary">
                                                    <Briefcase className="h-6 w-6" />
                                                </div>
                                                Sobre mí
                                            </h3>
                                            <p className="text-gray-300 leading-8 text-lg">
                                                {developer.bio}
                                            </p>
                                        </section>

                                        {/* Skills */}
                                        <section className="bg-[#1A1A1A] p-8 rounded-xl border border-[#333]">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                                <div className="bg-primary/20 p-2.5 rounded-lg text-primary">
                                                    <Code className="h-6 w-6" />
                                                </div>
                                                Tecnologías & Herramientas
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                {developer.skills.map(skill => (
                                                    <Badge key={skill} variant="secondary" className="px-4 py-2 bg-[#111] text-gray-200 border border-[#333] hover:border-primary/50 transition-colors text-sm">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Portfolio */}
                                        <section>
                                            <h3 className="text-xl font-bold text-white mb-6">Portafolio Destacado</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {[1, 2].map((i) => (
                                                    <div key={i} className="group bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#333] hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                                                        <div className="h-48 bg-[#151515] flex items-center justify-center relative overflow-hidden">
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                                                            <span className="text-gray-600 font-medium z-10 group-hover:text-primary transition-colors">Proyecto Demo {i}</span>
                                                        </div>
                                                        <div className="p-6">
                                                            <h4 className="font-bold text-white text-xl group-hover:text-primary transition-colors">E-commerce Platform</h4>
                                                            <p className="text-sm text-gray-400 mt-2 mb-4 leading-relaxed">Plataforma completa de ventas con panel administrativo, gestión de inventario y pagos en tiempo real.</p>
                                                            <div className="flex gap-2">
                                                                <Badge variant="outline" className="text-xs border-[#333] text-gray-400">React</Badge>
                                                                <Badge variant="outline" className="text-xs border-[#333] text-gray-400">Node.js</Badge>
                                                                <Badge variant="outline" className="text-xs border-[#333] text-gray-400">Stripe</Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right Sidebar (Stats/Contact) - Takes 4 columns */}
                                    <div className="lg:col-span-4 space-y-6">
                                        <div className="bg-[#1A1A1A] rounded-xl p-8 border border-[#333] space-y-8 shadow-xl sticky top-0">
                                            <div className="space-y-4">
                                                <Button className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
                                                    Contactar Ahora
                                                </Button>
                                                <Button variant="outline" className="w-full h-12 border-[#333] text-gray-300 hover:text-white hover:bg-[#222]">
                                                    Descargar CV
                                                </Button>
                                            </div>

                                            <div className="pt-8 border-t border-[#333] space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400">Tarifa Hora</span>
                                                    <span className="text-white font-bold text-xl">€{developer.hourlyRate}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400">Experiencia</span>
                                                    <span className="text-white font-bold text-xl">{developer.experience} años</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400">Proyectos</span>
                                                    <span className="text-white font-bold text-xl">{developer.completedProjects}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400">Respuesta</span>
                                                    <span className="text-green-400 font-bold text-lg">Inmediata</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-[#1A1A1A] rounded-xl p-8 border border-[#333]">
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Certificaciones</h4>
                                            <div className="space-y-5">
                                                <div className="flex gap-4">
                                                    <div className="bg-yellow-500/10 p-2.5 rounded-lg h-fit">
                                                        <Award className="h-6 w-6 text-yellow-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold">AWS Certified Solutions Architect</p>
                                                        <p className="text-sm text-gray-500 mt-1">Amazon Web Services • 2025</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="bg-blue-500/10 p-2.5 rounded-lg h-fit">
                                                        <Award className="h-6 w-6 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold">Meta Frontend Developer</p>
                                                        <p className="text-sm text-gray-500 mt-1">Coursera Professional • 2024</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
