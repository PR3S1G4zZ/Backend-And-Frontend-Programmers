import { useState } from 'react';
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
import { ImageWithFallback } from '../../figma/ImageWithFallback';
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

interface Developer {
  id: string;
  name: string;
  title: string;
  location: string;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  completedProjects: number;
  availability: 'available' | 'busy' | 'unavailable';
  avatar?: string;
  skills: string[];
  experience: number;
  languages: string[];
  bio: string;
  portfolio: {
    project: string;
    image: string;
    tech: string[];
  }[];
  lastActive: string;
  responseTime: string;
  isVerified: boolean;
  isFavorite: boolean;
}

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

  // Datos ficticios de desarrolladores
  const developers: Developer[] = [
    {
      id: '1',
      name: 'Carlos Mendoza',
      title: 'Full Stack Developer',
      location: 'Madrid, España',
      hourlyRate: 75,
      rating: 4.9,
      reviewsCount: 127,
      completedProjects: 89,
      availability: 'available',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
      experience: 6,
      languages: ['Español', 'Inglés'],
      bio: 'Desarrollador Full Stack con 6 años de experiencia especializado en React y Node.js. Apasionado por crear soluciones escalables y eficientes.',
      portfolio: [
        { project: 'E-commerce Platform', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop', tech: ['React', 'Node.js'] },
        { project: 'SaaS Dashboard', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop', tech: ['Vue.js', 'Python'] }
      ],
      lastActive: '2 horas',
      responseTime: '1 hora',
      isVerified: true,
      isFavorite: false
    },
    {
      id: '2',
      name: 'Elena Rodríguez',
      title: 'Frontend Developer & UI/UX Designer',
      location: 'Barcelona, España',
      hourlyRate: 65,
      rating: 4.8,
      reviewsCount: 94,
      completedProjects: 67,
      availability: 'available',
      skills: ['Vue.js', 'React', 'Figma', 'TypeScript', 'SCSS'],
      experience: 5,
      languages: ['Español', 'Inglés', 'Francés'],
      bio: 'Frontend Developer con fuerte background en diseño UX/UI. Experta en crear interfaces intuitivas y experiencias de usuario excepcionales.',
      portfolio: [
        { project: 'Mobile Banking App', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop', tech: ['React Native', 'Figma'] },
        { project: 'E-learning Platform', image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=200&fit=crop', tech: ['Vue.js', 'SCSS'] }
      ],
      lastActive: '30 min',
      responseTime: '30 min',
      isVerified: true,
      isFavorite: true
    },
    {
      id: '3',
      name: 'Miguel Torres',
      title: 'Backend Developer',
      location: 'Valencia, España',
      hourlyRate: 70,
      rating: 4.7,
      reviewsCount: 156,
      completedProjects: 112,
      availability: 'busy',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
      experience: 8,
      languages: ['Español', 'Inglés'],
      bio: 'Backend Developer especializado en Python y arquitecturas escalables. Experiencia en sistemas de alto rendimiento y DevOps.',
      portfolio: [
        { project: 'API Gateway System', image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop', tech: ['Python', 'Docker'] },
        { project: 'Data Analytics Platform', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop', tech: ['Django', 'PostgreSQL'] }
      ],
      lastActive: '1 día',
      responseTime: '2 horas',
      isVerified: true,
      isFavorite: false
    },
    {
      id: '4',
      name: 'Sofia Chen',
      title: 'Mobile Developer',
      location: 'Bilbao, España',
      hourlyRate: 80,
      rating: 5.0,
      reviewsCount: 73,
      completedProjects: 45,
      availability: 'available',
      skills: ['React Native', 'Flutter', 'Dart', 'Firebase', 'iOS'],
      experience: 4,
      languages: ['Español', 'Inglés', 'Chino'],
      bio: 'Mobile Developer especializada en apps nativas y multiplataforma. Experta en React Native y Flutter con enfoque en UX móvil.',
      portfolio: [
        { project: 'Fintech Mobile App', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop', tech: ['Flutter', 'Firebase'] },
        { project: 'Social Media App', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop', tech: ['React Native', 'Node.js'] }
      ],
      lastActive: '15 min',
      responseTime: '15 min',
      isVerified: true,
      isFavorite: false
    },
    {
      id: '5',
      name: 'David López',
      title: 'DevOps Engineer',
      location: 'Sevilla, España',
      hourlyRate: 85,
      rating: 4.6,
      reviewsCount: 88,
      completedProjects: 78,
      availability: 'available',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins'],
      experience: 7,
      languages: ['Español', 'Inglés'],
      bio: 'DevOps Engineer con experiencia en automatización, CI/CD y infraestructura cloud. Especialista en AWS y contenedores.',
      portfolio: [
        { project: 'CI/CD Pipeline', image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop', tech: ['Jenkins', 'Docker'] },
        { project: 'Cloud Infrastructure', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop', tech: ['AWS', 'Terraform'] }
      ],
      lastActive: '3 horas',
      responseTime: '1 hora',
      isVerified: true,
      isFavorite: false
    }
  ];

  const allSkills = Array.from(new Set(developers.flatMap(d => d.skills))).sort();

  const filteredDevelopers = developers.filter(dev => {
    const matchesSearch = searchQuery === '' || 
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkills = filters.skills.length === 0 || 
      filters.skills.some(skill => dev.skills.includes(skill));

    const matchesExperience = dev.experience >= filters.experience[0] && 
      dev.experience <= filters.experience[1];

    const matchesRate = dev.hourlyRate >= filters.hourlyRate[0] && 
      dev.hourlyRate <= filters.hourlyRate[1];

    const matchesAvailability = !filters.availability || filters.availability === 'any' || 
      dev.availability === filters.availability;

    const matchesRating = dev.rating >= filters.rating;

    const matchesVerified = !filters.verified || dev.isVerified;

    return matchesSearch && matchesSkills && matchesExperience && 
           matchesRate && matchesAvailability && matchesRating && matchesVerified;
  });

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
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Buscar Desarrolladores</h1>
        <p className="text-gray-300">
          Encuentra el talento perfecto para tu proyecto en nuestra red de {developers.length}+ desarrolladores verificados
        </p>
      </div>

      {/* Search and Filters Bar */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex space-x-4">
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
                className="border-[#333333] text-white hover:bg-[#333333] h-12 px-6"
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
                          €{developer.hourlyRate}/h
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
                      <div className="grid grid-cols-2 gap-2">
                        {developer.portfolio.slice(0, 2).map((project, index) => (
                          <div key={index} className="relative group">
                            <ImageWithFallback
                              src={project.image}
                              alt={project.project}
                              className="w-full h-20 object-cover rounded border border-[#333333] group-hover:border-[#00FF85] transition-colors"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                              <p className="text-white text-xs font-medium text-center px-2">
                                {project.project}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center border-t border-[#333333] pt-4">
                      <div>
                        <p className="text-lg font-semibold text-white">{developer.completedProjects}</p>
                        <p className="text-xs text-gray-400">Proyectos</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">{developer.experience}</p>
                        <p className="text-xs text-gray-400">Años exp.</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">{developer.responseTime}</p>
                        <p className="text-xs text-gray-400">Respuesta</p>
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
                        className={`border-[#333333] hover:bg-[#333333] ${
                          developer.isFavorite ? 'text-red-400' : 'text-white'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${developer.isFavorite ? 'fill-current' : ''}`} />
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