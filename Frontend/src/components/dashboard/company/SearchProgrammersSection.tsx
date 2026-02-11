import { useEffect, useState } from 'react';
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
  Clock, 
  Eye,
  Heart,
  MessageSquare,
  Award,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { fetchDevelopers, type DeveloperProfile } from '../../../services/developerService';

export function SearchProgrammersSection() {
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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [developers, setDevelopers] = useState<DeveloperProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allSkills = Array.from(new Set(developers.flatMap(d => d.skills))).sort();

  useEffect(() => {
    let isMounted = true;
    const loadDevelopers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchDevelopers();
        if (!isMounted) return;
        setDevelopers(response.data || []);
      } catch (error) {
        console.error('Error cargando desarrolladores', error);
        if (isMounted) {
          setError('No se pudieron cargar los desarrolladores.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDevelopers();

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
  });

  const toggleFavorite = (developerId: string) => {
    setFavorites((prev) =>
      prev.includes(developerId)
        ? prev.filter((id) => id !== developerId)
        : [...prev, developerId]
    );
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
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Buscar por nombre, habilidades, o especialización..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-[#0D0D0D] border-[#333333] text-white h-12"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-[#333333] text-white hover:bg-[#333333] h-12 px-6 md:self-stretch"
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
                  <Badge key={skill} variant="secondary" className="bg-[#00FF85] text-[#0D0D0D] pr-1">
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
                  Resultados para "<span className="text-[#00FF85]">{searchQuery}</span>"
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
                <Card className="bg-[#1A1A1A] border-[#333333] hover-neon overflow-hidden h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={developer.avatar} />
                            <AvatarFallback className="bg-[#00FF85] text-[#0D0D0D] text-lg">
                              {developer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {developer.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                              <Award className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{developer.name}</h3>
                          <p className="text-sm text-gray-400">{developer.title}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {developer.location}
                            </span>
                            <span className={`flex items-center ${getAvailabilityColor(developer.availability)}`}>
                              <Clock className="h-3 w-3 mr-1" />
                              {getAvailabilityText(developer.availability)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white font-medium">{developer.rating}</span>
                          <span className="text-xs text-gray-400">({developer.reviewsCount})</span>
                        </div>
                        <p className="text-lg font-semibold text-[#00FF85]">
                          {developer.hourlyRate ? `€${developer.hourlyRate}/h` : 'Sin tarifa'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {developer.bio}
                    </p>

                    {/* Skills */}
                    <div>
                      <div className="flex flex-wrap gap-1">
                        {developer.skills.slice(0, 4).map(skill => (
                          <Badge key={skill} variant="secondary" className="bg-[#0D0D0D] text-[#00C46A] text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {developer.skills.length > 4 && (
                          <Badge variant="secondary" className="bg-[#0D0D0D] text-gray-400 text-xs">
                            +{developer.skills.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Portfolio Preview */}
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Proyectos recientes:</p>
                      <div className="rounded border border-[#333333] bg-[#0D0D0D] p-3 text-xs text-gray-400">
                        Sin portafolio disponible.
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center border-t border-[#333333] pt-4">
                      <div>
                        <p className="text-lg font-semibold text-white">{developer.completedProjects}</p>
                        <p className="text-xs text-gray-400">Proyectos</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">{developer.experience ?? 0}</p>
                        <p className="text-xs text-gray-400">Años exp.</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">{developer.lastActive || 'Sin datos'}</p>
                        <p className="text-xs text-gray-400">Últ. actividad</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-4">
                      <Button size="sm" className="flex-1 bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contactar
                      </Button>
                      <Button size="sm" variant="outline" className="border-[#333333] text-white hover:bg-[#333333]">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => toggleFavorite(developer.id)}
                        className={`border-[#333333] hover:bg-[#333333] ${
                          favorites.includes(developer.id) ? 'text-red-400' : 'text-white'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(developer.id) ? 'fill-current' : ''}`} />
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
                  className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]"
                >
                  Limpiar filtros
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
