import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { useSweetAlert } from '../../ui/sweet-alert';
import { fetchProjectApplications, acceptApplication, rejectApplication, fetchDeveloperProfile, type ProjectResponse } from '../../../services/projectService';
import { ArrowLeft, CheckCircle, XCircle, User, Star, MapPin, Briefcase, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { DeveloperProfileModal } from './DeveloperProfileModal';

interface ProjectCandidatesSectionProps {
    project: ProjectResponse;
    onBack: () => void;
    onSectionChange?: (section: string, data?: any) => void;
}

export function ProjectCandidatesSection({ project, onBack, onSectionChange }: ProjectCandidatesSectionProps) {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showAlert, Alert } = useSweetAlert();
    const [selectedDeveloper, setSelectedDeveloper] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        loadCandidates();
    }, [project.id]);

    const loadCandidates = async () => {
        try {
            const response = await fetchProjectApplications(String(project.id));
            setCandidates(response.data);
        } catch (error) {
            console.error('Error loading candidates', error);
            showAlert({
                title: 'Error',
                text: 'No se pudieron cargar los candidatos.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleViewProfile = async (developerId: number) => {
        setModalLoading(true);
        try {
            const response = await fetchDeveloperProfile(String(developerId));
            setSelectedDeveloper(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching profile', error);
            showAlert({
                title: 'Error',
                text: 'No se pudo cargar el perfil del desarrollador.',
                type: 'error'
            });
        } finally {
            setModalLoading(false);
        }
    };

    const handleAccept = (candidate: any) => {
        showAlert({
            title: '¿Aceptar candidato?',
            text: `Al aceptar a ${candidate.developer.name}, se iniciará un chat y el proyecto pasará a "En Progreso". Puedes aceptar a múltiples candidatos.`,
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, aceptar',
            cancelButtonText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await acceptApplication(String(candidate.id));
                    setCandidates(candidates.map(c => c.id === candidate.id ? { ...c, status: 'accepted' } : c));

                    showAlert({
                        title: '¡Candidato aceptado!',
                        text: 'Has aceptado la propuesta. Puedes iniciar el chat desde la sección de Mensajes.',
                        type: 'success',
                        timer: 3000
                    });

                    // We no longer redirect automatically to allow accepting multiple candidates
                    // But we might want to offer the option? For now, just stay on the list.
                } catch (error) {
                    console.error('Error accepting candidate', error);
                    showAlert({
                        title: 'Error',
                        text: 'Hubo un problema al aceptar al candidato.',
                        type: 'error'
                    });
                }
            }
        });
    };

    const handleReject = (candidate: any) => {
        showAlert({
            title: '¿Rechazar candidato?',
            text: 'Esta acción notificará al candidato que su propuesta ha sido rechazada.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, rechazar',
            cancelButtonText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await rejectApplication(String(candidate.id));
                    setCandidates(candidates.map(c => c.id === candidate.id ? { ...c, status: 'rejected' } : c));
                    showAlert({
                        title: 'Candidato rechazado',
                        text: 'La propuesta ha sido rechazada.',
                        type: 'success'
                    });
                } catch (error) {
                    console.error('Error rejecting candidate', error);
                    showAlert({
                        title: 'Error',
                        text: 'Hubo un problema al rechazar al candidato.',
                        type: 'error'
                    });
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-white">Candidatos para {project.title}</h1>
                    <p className="text-gray-400">Revisa y selecciona al mejor talento para tu proyecto</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-400 py-12">Cargando candidatos...</div>
            ) : candidates.length === 0 ? (
                <div className="text-center py-12 bg-[#1A1A1A] rounded-lg border border-[#333333]">
                    <div className="bg-[#333333] p-6 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
                        <User className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Aún no hay candidatos</h3>
                    <p className="text-gray-400">Tu proyecto está visible, ¡pronto recibirás propuestas!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {candidates.map((candidate) => (
                        <motion.div
                            key={candidate.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="bg-[#1A1A1A] border-[#333333]">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                                        {/* Developer Info */}
                                        <div className="flex-shrink-0 cursor-pointer" onClick={() => handleViewProfile(candidate.developer.id)}>
                                            <Avatar className="h-16 w-16 border-2 border-[#333333] hover:border-primary transition-colors">
                                                <AvatarImage src={candidate.developer.avatar} />
                                                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                                    {candidate.developer.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white flex items-center cursor-pointer hover:text-primary transition-colors"
                                                        onClick={() => handleViewProfile(candidate.developer.id)}>
                                                        {candidate.developer.name} {candidate.developer.lastname}
                                                        <div className="flex items-center ml-3 text-yellow-400 text-sm">
                                                            <Star className="h-4 w-4 fill-current mr-1" />
                                                            {candidate.developer.rating || 'N/A'}
                                                        </div>
                                                    </h3>
                                                    <div className="flex items-center text-gray-400 text-sm mt-1 space-x-4">
                                                        <span className="flex items-center">
                                                            <Briefcase className="h-4 w-4 mr-1" />
                                                            Desarrollador Full Stack
                                                        </span>
                                                        <span className="flex items-center">
                                                            <MapPin className="h-4 w-4 mr-1" />
                                                            Remoto
                                                        </span>
                                                    </div>
                                                </div>
                                                <Badge variant={
                                                    candidate.status === 'accepted' ? 'default' :
                                                        candidate.status === 'rejected' ? 'destructive' : 'secondary'
                                                } className={
                                                    candidate.status === 'accepted' ? 'bg-primary/20 text-primary' :
                                                        candidate.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                            'bg-blue-500/20 text-blue-400'
                                                }>
                                                    {candidate.status === 'accepted' ? 'Aceptado' :
                                                        candidate.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                                                </Badge>
                                            </div>

                                            <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#333333]">
                                                <h4 className="text-sm font-medium text-gray-300 mb-2">Propuesta / Carta de Presentación</h4>
                                                <p className="text-gray-400 text-sm whitespace-pre-line">
                                                    {candidate.cover_letter || 'Sin carta de presentación.'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-row md:flex-col gap-2 pt-2 md:pt-0">
                                            <Button
                                                variant="outline"
                                                className="border-[#444] text-gray-300 hover:bg-[#333] w-full md:w-auto"
                                                onClick={() => handleViewProfile(candidate.developer.id)}
                                                disabled={modalLoading}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Ver Perfil
                                            </Button>

                                            {candidate.status === 'pending' && (
                                                <>
                                                    <Button
                                                        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto"
                                                        onClick={() => handleAccept(candidate)}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Aceptar
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="border-red-500/50 text-red-400 hover:bg-red-950 hover:text-red-300 w-full md:w-auto"
                                                        onClick={() => handleReject(candidate)}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Rechazar
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <DeveloperProfileModal
                developer={selectedDeveloper}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isLoading={modalLoading}
            />

            <Alert />
        </div>
    );
}
