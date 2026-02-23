import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Slider } from '../../ui/slider';
import { ScrollArea } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Eye,
  Heart,
  MessageSquare,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { fetchDevelopers, type DeveloperProfile } from '../../../services/developerService';
import { DeveloperProfileModal } from './DeveloperProfileModal';
import { fetchFavorites, toggleFavorite as toggleFavoriteApi } from '../../../services/favoriteService';
import { createConversation } from '../../../services/conversationService';
import { useSweetAlert } from '../../ui/sweet-alert';

interface SearchProgrammersSectionProps {
  onSectionChange?: (section: string, data?: any) => void;
}

export function SearchProgrammersSection({ onSectionChange }: SearchProgrammersSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    skills: [] as string[],
    experience: [0, 10],
    hourlyRate: [0, 200],
    availability: 'any',
    location: '',
    rating: 0,
    verified: false
  });
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [developers, setDevelopers] = useState<DeveloperProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState<DeveloperProfile | null>(null);
  const { showAlert } = useSweetAlert();

  const allSkills = useMemo(() => Array.from(new Set(developers.flatMap(d => d.skills))).sort(), [developers]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [devsResponse, favsResponse] = await Promise.all([
          fetchDevelopers(),
          fetchFavorites()
        ]);
        if (!isMounted) return;
        setDevelopers(devsResponse.data || []);
        // Assuming fetchFavorites returns array of IDs
        setFavorites(favsResponse || []);
      } catch (error) {
        console.error('Error cargando datos', error);
        if (isMounted) {
          setError('No se pudieron cargar los datos.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDevelopers = developers.filter(dev => {
    const matchesSearch = searchQuery === '' ||
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkills = filters.skills.length === 0 ||
      filters.skills.some(skill => dev.skills.includes(skill));

    const experience = dev.experience ?? 0;
    const hourlyRate = dev.hourlyRate ?? 0;

    const matchesExperience = experience >= filters.experience[0] &&
      experience <= filters.experience[1];

    const matchesRate = hourlyRate >= filters.hourlyRate[0] &&
      hourlyRate <= filters.hourlyRate[1];

    const matchesAvailability = !filters.availability || filters.availability === 'any' ||
      dev.availability === filters.availability;

    const matchesRating = dev.rating >= filters.rating;

    const matchesVerified = !filters.verified || dev.isVerified;

    return matchesSearch && matchesSkills && matchesExperience &&
      matchesRate && matchesAvailability && matchesRating && matchesVerified;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      case 'rate-high':
        return (b.hourlyRate ?? 0) - (a.hourlyRate ?? 0);
      case 'rate-low':
        return (a.hourlyRate ?? 0) - (b.hourlyRate ?? 0);
      case 'experience-high':
        return (b.experience ?? 0) - (a.experience ?? 0);
      case 'experience-low':
        return (a.experience ?? 0) - (b.experience ?? 0);
      default:
        return 0;
    }
  });

  const toggleFavorite = async (developerId: string) => {
    const id = Number(developerId);
    // Optimistic Update
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
    );

    try {
      const response = await toggleFavoriteApi(id);
      // Show toast
      showAlert({
        title: response.status === 'added' ? 'Añadido a Favoritos' : 'Eliminado de Favoritos',
        text: response.message,
        type: 'success',
        timer: 1500
      });
    } catch (error) {
      console.error("Error toggling favorite", error);
      // Revert on error
      setFavorites((prev) =>
        prev.includes(id)
          ? prev.filter((pid) => pid !== id)
          : [...prev, id]
      );
    }
  };

  const handleContact = async (developerId: string) => {
    try {
      const response = await createConversation({
        participant_id: Number(developerId),
        type: 'direct'
      });

      if (response.conversation_id || response.conversation?.id) {
        const chatId = response.conversation_id || response.conversation.id;
        showAlert({
          title: 'Conversación Iniciada',
          text: 'Redirigiendo al chat...',
          type: 'success',
          timer: 1500
        });

        if (onSectionChange) {
          setTimeout(() => onSectionChange('messages', { chatId }), 1000);
        }
      }
    } catch (error) {
      console.error("Error creating conversation", error);
      showAlert({
        title: 'Error',
        text: 'No se pudo iniciar la conversación.',
        type: 'error'
      });
    }
  };

  const toggleSkillFilter = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const clearFilters = () => {
    setFilters({
      skills: [],
      experience: [0, 10],
      hourlyRate: [0, 200],
      availability: 'any',
      location: '',
      rating: 0,
      verified: false
    });
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-400';
      case 'busy': return 'text-yellow-400';
      case 'unavailable': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Disponible';
      case 'busy': return 'Ocupado';
      case 'unavailable': return 'No disponible';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Buscar Desarrolladores</h1>
        <p className="text-gray-300">
          Encuentra el talento perfecto para tu proyecto en nuestra red de {developers.length}+ desarrolladores verificados
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      {isLoading ? (
        <div className="rounded-lg border border-[#333333] bg-[#1A1A1A] p-4 text-sm text-gray-300">
          Cargando desarrolladores...
        </div>
      ) : null}

      {/* Search and Filters Bar */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-primary" />
                <Input
                  placeholder="Buscar por nombre, habilidades, o especialización..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-[#0D0D0D] border-[#333333] text-white h-12 transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`border-[#333333] text-white hover:bg-[#333333] h-12 px-6 md:self-stretch transition-all ${showFilters ? 'bg-[#333333] border-primary/30' : ''}`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
            </div>

            {/* Active Filters */}
            {(filters.skills.length > 0 || (filters.availability && filters.availability !== 'any')) && (
              <div className="flex flex-wrap gap-2">
                {filters.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="bg-primary text-primary-foreground pr-1">
                    {skill}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSkillFilter(skill)}
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {filters.availability && filters.availability !== 'any' && (
                  <Badge variant="secondary" className="bg-blue-600 text-white pr-1">
                    {getAvailabilityText(filters.availability)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, availability: 'any' }))}
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white hover:bg-[#333333] h-6"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:col-span-1"
            >
              <Card className="bg-[#1A1A1A] border-[#333333] sticky top-4">
                <CardHeader>
                  <CardTitle className="text-white">Filtros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Skills Filter */}
                  <div>
                    <label className="text-white font-medium mb-3 block">Habilidades</label>
                    <ScrollArea className="h-40">
                      <div className="space-y-2">
                        {allSkills.map(skill => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              id={`skill-${skill}`}
                              checked={filters.skills.includes(skill)}
                              onCheckedChange={() => toggleSkillFilter(skill)}
                            />
                            <label htmlFor={`skill-${skill}`} className="text-sm text-gray-300 cursor-pointer">
                              {skill}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <Separator className="bg-[#333333]" />

                  {/* Experience Filter */}
                  <div>
                    <label className="text-white font-medium mb-3 block">
                      Experiencia: {filters.experience[0]}-{filters.experience[1]} años
                    </label>
                    <Slider
                      value={filters.experience}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}
                      max={15}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <Separator className="bg-[#333333]" />

                  {/* Hourly Rate Filter */}
                  <div>
                    <label className="text-white font-medium mb-3 block">
                      Tarifa por hora: €{filters.hourlyRate[0]}-€{filters.hourlyRate[1]}
                    </label>
                    <Slider
                      value={filters.hourlyRate}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, hourlyRate: value }))}
                      max={200}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <Separator className="bg-[#333333]" />

                  {/* Availability Filter */}
                  <div>
                    <label className="text-white font-medium mb-3 block">Disponibilidad</label>
                    <Select onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}>
                      <SelectTrigger className="bg-[#0D0D0D] border-[#333333] text-white">
                        <SelectValue placeholder="Cualquiera" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                        <SelectItem value="any" className="text-white">Cualquiera</SelectItem>
                        <SelectItem value="available" className="text-white">Disponible</SelectItem>
                        <SelectItem value="busy" className="text-white">Ocupado</SelectItem>
                        <SelectItem value="unavailable" className="text-white">No disponible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-[#333333]" />

                  {/* Rating Filter */}
                  <div>
                    <label className="text-white font-medium mb-3 block">
                      Rating mínimo: {filters.rating} estrellas
                    </label>
                    <Slider
                      value={[filters.rating]}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value[0] }))}
                      max={5}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                  </div>

                  <Separator className="bg-[#333333]" />

                  {/* Verified Filter */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={filters.verified}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verified: checked as boolean }))}
                    />
                    <label htmlFor="verified" className="text-white font-medium cursor-pointer">
                      Solo verificados
                    </label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white">
                <span className="font-semibold">{filteredDevelopers.length}</span> desarrolladores encontrados
              </p>
              {searchQuery && (
                <p className="text-sm text-gray-400">
                  Resultados para "<span className="text-primary">{searchQuery}</span>"
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-[#1A1A1A] border-[#333333] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                  <SelectItem value="relevance" className="text-white">Más relevante</SelectItem>
                  <SelectItem value="rating" className="text-white">Mejor calificado</SelectItem>
                  <SelectItem value="rate-low" className="text-white">Precio: menor a mayor</SelectItem>
                  <SelectItem value="rate-high" className="text-white">Precio: mayor a menor</SelectItem>
                  <SelectItem value="experience" className="text-white">Más experiencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Developers Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredDevelopers.map(developer => (
              <motion.div
                key={developer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[#1A1A1A] border-[#333333] hover:border-primary/50 transition-all duration-300 group overflow-hidden h-full flex flex-col relative">
                  {/* Premium details */}
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Code className="h-24 w-24 text-primary transform rotate-12 translate-x-8 -translate-y-8" />
                  </div>

                  <CardHeader className="pb-4 z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16 border-2 border-transparent group-hover:border-primary transition-colors duration-300 ring-2 ring-[#0D0D0D]">
                            <AvatarImage src={developer.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-purple-600/80 text-white text-lg font-bold">
                              {developer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {developer.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 shadow-lg ring-2 ring-[#1A1A1A]">
                              <Award className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{developer.name}</h3>
                          <p className="text-sm text-gray-400 font-medium">{developer.title}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {developer.location}
                            </span>
                            <span className={`flex items-center font-medium ${getAvailabilityColor(developer.availability)}`}>
                              <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${developer.availability === 'available' ? 'bg-green-400 animate-pulse' : 'bg-current'}`} />
                              {getAvailabilityText(developer.availability)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right z-10">
                        <div className="flex items-center justify-end space-x-1 mb-1 bg-[#0D0D0D] px-2 py-1 rounded-full border border-[#333]">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                          <span className="text-white font-bold text-sm">{developer.rating}</span>
                          <span className="text-[10px] text-gray-500">({developer.reviewsCount})</span>
                        </div>
                        <p className="text-xl font-bold text-primary mt-2">
                          €{developer.hourlyRate}<span className="text-xs text-gray-500 font-normal">/h</span>
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5 flex-1 flex flex-col z-10">
                    <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                      {developer.bio}
                    </p>

                    {/* Skills */}
                    <div>
                      <div className="flex flex-wrap gap-1.5">
                        {developer.skills.slice(0, 4).map(skill => (
                          <Badge key={skill} variant="secondary" className="bg-[#0D0D0D] hover:bg-[#222] text-[#00C46A] border border-[#333333] text-xs px-2.5 py-0.5 transition-colors rounded-md">
                            {skill}
                          </Badge>
                        ))}
                        {developer.skills.length > 4 && (
                          <Badge variant="secondary" className="bg-[#0D0D0D] text-gray-500 border border-[#333333] text-xs px-2 rounded-md">
                            +{developer.skills.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-[#333333]" />

                    {/* Stats Compact */}
                    <div className="grid grid-cols-3 gap-2 py-1">
                      <div className="text-center">
                        <p className="text-white font-bold">{developer.completedProjects}</p>
                        <p className="text-[10px] uppercase text-gray-500 tracking-wider">Proyectos</p>
                      </div>
                      <div className="text-center border-l border-[#333333]">
                        <p className="text-white font-bold">{developer.experience ?? 0}+</p>
                        <p className="text-[10px] uppercase text-gray-500 tracking-wider">Años</p>
                      </div>
                      <div className="text-center border-l border-[#333333]">
                        <p className="text-green-400 font-bold">100%</p>
                        <p className="text-[10px] uppercase text-gray-500 tracking-wider">Éxito</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-2 flex space-x-2">
                      <Button
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-lg shadow-primary/20"
                        onClick={() => handleContact(developer.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contactar
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#333333] bg-[#0D0D0D] text-white hover:bg-[#1A1A1A] hover:border-gray-500 transition-all"
                        onClick={() => setSelectedDeveloper(developer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toggleFavorite(developer.id)}
                        className={`border-[#333333] bg-[#0D0D0D] hover:bg-[#1A1A1A] transition-all ${favorites.includes(Number(developer.id))
                          ? 'text-red-500 border-red-500/30 bg-red-500/10'
                          : 'text-gray-400 hover:text-red-400 hover:border-red-500/30'
                          }`}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(Number(developer.id)) ? 'fill-current animate-pulse-once' : ''}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredDevelopers.length === 0 && (
            <Card className="bg-[#1A1A1A] border-[#333333] p-12">
              <div className="text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No se encontraron desarrolladores</h3>
                <p className="text-gray-400 mb-4">
                  Intenta ajustar tus filtros o términos de búsqueda
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Limpiar filtros
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
      {/* Developer Profile Modal */}
      <DeveloperProfileModal
        isOpen={!!selectedDeveloper}
        onClose={() => setSelectedDeveloper(null)}
        developer={selectedDeveloper}
        isLoading={false} // Data is already loaded in list for now, or fetch detail if needed
      />
    </div >
  );
}

