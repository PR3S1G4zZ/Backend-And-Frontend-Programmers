import { Dialog, DialogContent } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { ScrollArea } from '../../ui/scroll-area';
import { MapPin, Clock, Star, ExternalLink, Briefcase, Code, Award, X } from 'lucide-react';
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
            <DialogContent className="max-w-4xl bg-[#1A1A1A] border-[#333333] p-0 overflow-hidden text-white sm:rounded-xl">
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
                    <div className="flex flex-col max-h-[90vh]">
                        {/* Header / Cover */}
                        <div className="bg-gradient-to-r from-primary/20 to-purple-500/10 p-6 pb-0 pt-8 relative">
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </Button>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <Avatar className="h-24 w-24 border-4 border-[#1A1A1A] shadow-xl">
                                    <AvatarImage src={developer.avatar} />
                                    <AvatarFallback className="bg-primary text-2xl">{developer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1 mt-2">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        {developer.name}
                                        {developer.isVerified && <Award className="h-5 w-5 text-blue-400" />}
                                    </h2>
                                    <p className="text-lg text-gray-300">{developer.title}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 pt-1">
                                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {developer.location}</span>
                                        <span className="flex items-center gap-1 text-green-400"><Clock className="h-3 w-3" /> Disponible</span>
                                        <span className="flex items-center gap-1 text-yellow-400"><Star className="h-3 w-3 fill-current" /> {developer.rating} ({developer.reviewsCount} reseñas)</span>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 text-right">
                                    <div className="text-2xl font-bold text-primary">€{developer.hourlyRate}<span className="text-sm text-gray-400 font-normal">/h</span></div>
                                    <Button className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">Contactar Ahora</Button>
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left Column: Bio & Skills */}
                                <div className="md:col-span-2 space-y-8">
                                    <section>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                                            <Briefcase className="h-5 w-5 text-primary" />
                                            Sobre mí
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            {developer.bio}
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                                            <Code className="h-5 w-5 text-primary" />
                                            Skills & Tecnologías
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {developer.skills.map(skill => (
                                                <Badge key={skill} variant="secondary" className="bg-[#2A2A2A] text-gray-200 border border-[#444]">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-lg font-semibold mb-3 text-white">Portafolio Reciente</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Placeholder Portfolio Items */}
                                            <div className="bg-[#262626] rounded-lg p-4 border border-[#333] hover:border-primary/50 transition-colors group cursor-pointer">
                                                <div className="h-32 bg-[#333] rounded mb-3 flex items-center justify-center text-gray-500">
                                                    Preview
                                                </div>
                                                <h4 className="font-medium text-white group-hover:text-primary transition-colors">E-commerce Dashboard</h4>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">React, Tailwind, Node.js</p>
                                            </div>
                                            <div className="bg-[#262626] rounded-lg p-4 border border-[#333] hover:border-primary/50 transition-colors group cursor-pointer">
                                                <div className="h-32 bg-[#333] rounded mb-3 flex items-center justify-center text-gray-500">
                                                    Preview
                                                </div>
                                                <h4 className="font-medium text-white group-hover:text-primary transition-colors">SaaS Landing Page</h4>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">Next.js, Framer Motion</p>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column: Stats & Info */}
                                <div className="space-y-6">
                                    <div className="bg-[#262626] rounded-xl p-5 border border-[#333]">
                                        <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Estadísticas</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Proyectos Completados</span>
                                                <span className="text-white font-bold">{developer.completedProjects}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Años de Experiencia</span>
                                                <span className="text-white font-bold">{developer.experience}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Tasa de Éxito</span>
                                                <span className="text-green-400 font-bold">100%</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Tiempo Respuesta</span>
                                                <span className="text-white font-bold">&lt; 2 hrs</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#262626] rounded-xl p-5 border border-[#333]">
                                        <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Certificaciones</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-2">
                                                <Award className="h-4 w-4 text-yellow-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-white font-medium">AWS Certified Developer</p>
                                                    <p className="text-xs text-gray-500">Amazon Web Services</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Award className="h-4 w-4 text-blue-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-white font-medium">Meta Frontend Dev</p>
                                                    <p className="text-xs text-gray-500">Coursera</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
