import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Separator } from '../../ui/separator';
import { Progress } from '../../ui/progress';
import {
  User as UserIcon,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Save,
  Plus,
  X,
  Award,
  DollarSign,
  Clock,
  Settings,
  Shield,
  Bell,
  Briefcase,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useSweetAlert } from '../../ui/sweet-alert';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchProfile, updateProfile } from '../../../services/profileService';
import apiClient from '../../../services/apiClient';
import { AppearanceSection } from '../settings/AppearanceSection';
import { PaymentSettings } from './PaymentSettings';
import { ImageUpload } from '../../ui/ImageUpload';
import { SkillsSelector } from '../../ui/SkillsSelector';

export function ProfileSection() {
  const [activeTab, setActiveTab] = useState('profile-tab');
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user ? `${user.name} ${user.lastname}` : '',
    email: user?.email || '',
    phone: '',
    location: '',
    title: '',
    bio: '',
    hourlyRate: 0,
    availability: 'available', // available, busy, unavailable
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    profile_picture: '',
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const [skills, setSkills] = useState<{ id?: number; name: string; level: number; years: number }[]>([]);

  const [languages, setLanguages] = useState<{ id: number; name: string; level: string }[]>([]);

  const [experience] = useState<{ id: number; company: string; position: string; period: string; description: string }[]>([]);

  const [settings, setSettings] = useState({
    profileVisibility: true,
    emailNotifications: true,
    projectAlerts: true,
    marketingEmails: false,
    twoFactorAuth: false,
    profileCompletion: 0
  });

  const { showAlert } = useSweetAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handler for privacy and notification toggles
  const handleSettingsToggle = async (key: string, value: boolean) => {
    const previousValue = settings[key as keyof typeof settings];
    // Optimistic update
    setSettings(prev => ({ ...prev, [key]: value }));

    try {
      await apiClient.put('/preferences', { [key]: value });
    } catch (error) {
      console.error('Error updating preference:', error);
      // Revert on error
      setSettings(prev => ({ ...prev, [key]: previousValue }));
      showAlert({
        title: 'Error',
        text: 'No se pudo guardar la configuración. Inténtalo de nuevo.',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchProfile();
        if (!isMounted) return;
        const profile = response.data.profile;
        const userInfo = response.data.user;
        setProfileData((prev) => ({
          ...prev,
          name: `${userInfo.name} ${userInfo.lastname}`.trim(),
          email: userInfo.email,
          location: profile.location || '',
          title: profile.headline || '',
          bio: profile.bio || '',
          hourlyRate: profile.hourly_rate || 0,
          availability: profile.availability || 'available',
          website: profile.links?.website || '',
          github: profile.links?.github || '',
          linkedin: profile.links?.linkedin || '',
          twitter: profile.links?.twitter || '',
          profile_picture: userInfo.profile_picture ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${userInfo.profile_picture}` : '',
        }));

        const skillNames = Array.isArray(profile.skills) ? profile.skills : [];
        setSkills(skillNames.map((name: string, index: number) => ({
          id: index + 1,
          name,
          level: 0,
          years: 0,
        })));

        const languageList = Array.isArray(profile.languages) ? profile.languages : [];
        setLanguages(languageList.map((name: string, index: number) => ({
          id: index + 1,
          name,
          level: 'Sin nivel',
        })));
      } catch (error) {
        console.error('Error cargando perfil', error);
        if (isMounted) {
          setError('No se pudo cargar el perfil.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    const [firstName, ...lastParts] = profileData.name.trim().split(' ');
    const lastName = lastParts.join(' ');

    try {
      // Create formData if there is an image, otherwise use JSON object (or update service to handle both)
      // Since updateProfile implementation likely expects an object, we need to verify if it handles FormData or key/value pairs.
      // Assuming updateProfile service needs to be updated or we send data differently.
      // Let's check `profileService.ts` first. For now I'll assume I need to construct data.

      const formData = new FormData();
      formData.append('name', firstName || user?.name || '');
      formData.append('lastname', lastName || user?.lastname || '');
      formData.append('headline', profileData.title);
      formData.append('bio', profileData.bio);
      formData.append('location', profileData.location);
      formData.append('hourly_rate', String(profileData.hourlyRate));
      formData.append('availability', profileData.availability);

      skills.forEach((skill, index) => {
        formData.append(`skills[${index}]`, skill.name);
      });

      // Links (as array or individual fields depending on backend expectation, Controller accepts 'links' array)
      // Laravel validation: 'links' => 'nullable|array'
      formData.append('links[website]', profileData.website);
      formData.append('links[github]', profileData.github);
      formData.append('links[linkedin]', profileData.linkedin);
      formData.append('links[twitter]', profileData.twitter);

      languages.forEach((lang, index) => {
        formData.append(`languages[${index}]`, lang.name);
      });

      if (profileImageFile) {
        formData.append('profile_picture', profileImageFile);
      }

      // We might need to update the service to accept FormData. 
      // For now, let's keep the object structure but add a way to send the file.
      // Actually, standardizing on FormData for everything with file uploads is best.
      // But let's check if we can just pass the object and handling the file separately? No, must be one request.

      // Save the profile with all data including the image
      const response = await updateProfile(formData);

      showAlert({
        title: '¡Perfil Actualizado!',
        text: 'Tu información ha sido guardada exitosamente',
        type: 'success',
        timer: 2000,
        theme: 'code'
      });

      if (response.user && response.user.profile_picture) {
        const updatedUser = response.user;
        setProfileData(prev => ({
          ...prev,
          profile_picture: `${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${updatedUser.profile_picture}`
        }));
        // Update global auth user if needed
        // updateUser(updatedUser); 
      }

      setIsEditing(false);
      setProfileImageFile(null); // Clear the file input
    } catch (error) {
      console.error('Error actualizando perfil', error);
      showAlert({
        title: 'Error',
        text: 'No se pudo actualizar el perfil.',
        type: 'error',
        timer: 2000,
        theme: 'code'
      });
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400';
      case 'busy': return 'text-yellow-400';
      case 'unavailable': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'busy': return 'Ocupado';
      case 'unavailable': return 'No disponible';
      default: return 'Desconocido';
    }
  };

  // Calculate profile completion percentage dynamically
  const calculateProfileCompletion = () => {
    let filledFields = 0;
    const totalFields = 12; // Total de campos a evaluar

    // Basic info fields
    if (profileData.name && profileData.name.trim() !== '') filledFields++;
    if (profileData.email && profileData.email.trim() !== '') filledFields++;
    if (profileData.phone && profileData.phone.trim() !== '') filledFields++;
    if (profileData.location && profileData.location.trim() !== '') filledFields++;
    if (profileData.title && profileData.title.trim() !== '') filledFields++;
    if (profileData.bio && profileData.bio.trim() !== '') filledFields++;
    if (profileData.hourlyRate && profileData.hourlyRate > 0) filledFields++;

    // Profile picture
    if (profileData.profile_picture && profileData.profile_picture.trim() !== '') filledFields++;

    // Social links (at least one)
    if ((profileData.website && profileData.website.trim() !== '') ||
      (profileData.github && profileData.github.trim() !== '') ||
      (profileData.linkedin && profileData.linkedin.trim() !== '') ||
      (profileData.twitter && profileData.twitter.trim() !== '')) filledFields++;

    // Skills (at least one)
    if (skills && skills.length > 0) filledFields++;

    // Languages (at least one)
    if (languages && languages.length > 0) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <Button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className={`${isEditing
              ? 'bg-primary hover:bg-primary/90'
              : 'bg-primary hover:bg-primary/90'
              } text-primary-foreground`}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
          {error}
        </div>
      ) : null}
      {isLoading ? (
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          Cargando perfil...
        </div>
      ) : null}

      {/* Profile Completion */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="bg-card border-border hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Completitud del Perfil</h3>
                <p className="text-sm text-muted-foreground">Completa tu perfil para atraer más oportunidades</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{calculateProfileCompletion()}%</div>
                <div className="text-xs text-muted-foreground">Completado</div>
              </div>
            </div>
            <Progress value={calculateProfileCompletion()} className="h-3" />

            {calculateProfileCompletion() < 100 && (
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Para completar tu perfil:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {!profileData.title && <li>Añade un título profesional</li>}
                  {!profileData.bio && <li>Escribe una biografía profesional</li>}
                  {!profileData.profile_picture && <li>Sube una foto de perfil profesional</li>}
                  {skills.length === 0 && <li>Añade habilidades técnicas</li>}
                  {languages.length === 0 && <li>Agrega tus idiomas</li>}
                  {!profileData.website && !profileData.github && !profileData.linkedin && <li>Agrega enlaces a tus redes profesionales</li>}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card border border-border p-1">
          <TabsTrigger value="profile-tab" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <UserIcon className="h-4 w-4 mr-2" />
            Información Personal
          </TabsTrigger>
          <TabsTrigger value="skills-tab" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Award className="h-4 w-4 mr-2" />
            Habilidades
          </TabsTrigger>
          <TabsTrigger value="settings-tab" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent key="profile-content" value="profile-tab" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Basic Info */}
              <Card className="bg-card border-border hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <UserIcon className="h-5 w-5 mr-2" />
                    Información Básica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      {isEditing ? (
                        <ImageUpload
                          currentImage={profileData.profile_picture}
                          name={profileData.name}
                          onImageChange={setProfileImageFile}
                        />
                      ) : (
                        <div className="relative">
                          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                            <AvatarImage src={profileData.profile_picture} object-cover />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                              {profileData.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {!profileData.profile_picture && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                              <UserIcon className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{profileData.name}</h3>
                        <Badge className="bg-primary text-primary-foreground">
                          <Award className="h-3 w-3 mr-1" />
                          Verificado
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-1">{profileData.title}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`flex items-center ${getAvailabilityColor(profileData.availability)}`}>
                          <Clock className="h-3 w-3 mr-1" />
                          {getAvailabilityText(profileData.availability)}
                        </span>
                        <span className="flex items-center text-primary">
                          <DollarSign className="h-3 w-3 mr-1" />
                          €{profileData.hourlyRate}/hora
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-foreground">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 bg-background border-border text-foreground disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <Label htmlFor="title" className="text-foreground">Título Profesional</Label>
                      <Input
                        id="title"
                        value={profileData.title}
                        onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 bg-background border-border text-foreground disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 bg-background border-border text-foreground disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-foreground">Teléfono</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 bg-background border-border text-foreground disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-foreground">Ubicación</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 bg-background border-border text-foreground disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hourlyRate" className="text-foreground">Tarifa por Hora (€)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={profileData.hourlyRate}
                        onChange={(e) => setProfileData({ ...profileData, hourlyRate: Number(e.target.value) || 0 })}
                        disabled={!isEditing}
                        className="mt-2 bg-background border-border text-foreground disabled:opacity-70"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="availability" className="text-foreground">Estado de Disponibilidad</Label>
                    <Select
                      value={profileData.availability}
                      onValueChange={(value) => setProfileData({ ...profileData, availability: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="mt-2 bg-background border-border text-foreground disabled:opacity-70">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="available" className="text-foreground">Disponible</SelectItem>
                        <SelectItem value="busy" className="text-foreground">Ocupado</SelectItem>
                        <SelectItem value="unavailable" className="text-foreground">No disponible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-foreground">Biografía Profesional</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                      className="mt-2 bg-background border-border text-foreground min-h-[100px] disabled:opacity-70"
                      placeholder="Cuéntanos sobre tu experiencia, especialidades y objetivos profesionales..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="bg-card border-border hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Enlaces Sociales y Web
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-foreground flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Sitio Web
                      </Label>
                      <Input
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 bg-background border-border text-foreground disabled:opacity-70"
                        placeholder="https://tu-sitio.com"
                      />
                    </div>

                    <div>
                      <Label className="text-foreground flex items-center">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Label>
                      <Input
                        value={profileData.github}
                        onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 bg-background border-border text-foreground disabled:opacity-70"
                        placeholder="usuario-github"
                      />
                    </div>

                    <div>
                      <Label className="text-foreground flex items-center">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Label>
                      <Input
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 bg-background border-border text-foreground disabled:opacity-70"
                        placeholder="usuario-linkedin"
                      />
                    </div>

                    <div>
                      <Label className="text-foreground flex items-center">
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Label>
                      <Input
                        value={profileData.twitter}
                        onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 bg-background border-border text-foreground disabled:opacity-70"
                        placeholder="@usuario-twitter"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="bg-card border-border hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Experiencia Profesional
                    </div>
                    {isEditing && (
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experience.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin experiencia registrada.</p>
                  ) : experience.map((exp) => (
                    <motion.div
                      key={`exp-${exp.id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * exp.id }}
                      className="border-l-2 border-primary pl-4 pb-4 last:pb-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{exp.position}</h4>
                          <p className="text-primary text-sm">{exp.company}</p>
                          <p className="text-muted-foreground text-sm mb-2">{exp.period}</p>
                          <p className="text-muted-foreground text-sm">{exp.description}</p>
                        </div>
                        {isEditing && (
                          <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive">
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Languages */}
              <Card className="bg-card border-border hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Idiomas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {languages.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Sin idiomas registrados.</p>
                    ) : languages.map((lang) => (
                      <motion.div
                        key={`lang-${lang.id}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * lang.id }}
                        className="text-center p-4 bg-background rounded-lg border border-border"
                      >
                        <h4 className="font-semibold text-foreground">{lang.name}</h4>
                        <p className="text-sm text-muted-foreground">{lang.level}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>


          <TabsContent key="skills-content" value="skills-tab" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card border-border hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Habilidades Técnicas
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SkillsSelector
                    skills={skills}
                    onSkillsChange={setSkills}
                    isEditing={isEditing}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>


          <TabsContent key="settings-content" value="settings-tab" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="bg-card border-border hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Apariencia y UX
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AppearanceSection />
                </CardContent>
              </Card>

              {/* Payment Settings */}
              <PaymentSettings />

              {/* Privacy Settings */}
              <Card className="bg-card border-border hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Privacidad y Visibilidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">Perfil Público</p>
                      <p className="text-sm text-muted-foreground">Permite que las empresas vean tu perfil</p>
                    </div>
                    <Switch
                      checked={settings.profileVisibility}
                      onCheckedChange={(checked) => handleSettingsToggle('profileVisibility', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="bg-card border-border hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">Notificaciones por Email</p>
                      <p className="text-sm text-muted-foreground">Recibe emails sobre mensajes y actualizaciones</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingsToggle('emailNotifications', checked)}
                    />
                  </div>

                  <Separator className="bg-border" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">Alertas de Proyectos</p>
                      <p className="text-sm text-muted-foreground">Notificaciones sobre nuevos proyectos que coincidan con tu perfil</p>
                    </div>
                    <Switch
                      checked={settings.projectAlerts}
                      onCheckedChange={(checked) => handleSettingsToggle('projectAlerts', checked)}
                    />
                  </div>

                  <Separator className="bg-border" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">Emails de Marketing</p>
                      <p className="text-sm text-muted-foreground">Recibe newsletters y promociones</p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => handleSettingsToggle('marketingEmails', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="bg-card border-border hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-medium">Autenticación de Dos Factores (2FA)</p>
                      <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad a tu cuenta</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingsToggle('twoFactorAuth', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

        </AnimatePresence>
      </Tabs>
    </div>
  );
}
