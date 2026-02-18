import { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Plus,
  ExternalLink,
  Github,
  Calendar,
  Eye,
  Heart,
  Edit,
  Trash2,
  Upload,
  X,
  Loader2
} from "lucide-react";
import { portfolioService } from "../../../services/portfolioService";
import type { PortfolioProject } from "../../../services/portfolioService";
import { toast } from "sonner";

export function PortfolioSection() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_url: '',
    github_url: '',
    client: '',
    completion_date: '',
    technologies: '',
    featured: false
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getAll();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Error al cargar los proyectos");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      if (formData.project_url) data.append('project_url', formData.project_url);
      if (formData.github_url) data.append('github_url', formData.github_url);
      if (formData.client) data.append('client', formData.client);
      if (formData.completion_date) data.append('completion_date', formData.completion_date);

      // Convert technologies string to array if needed by backend, 
      // but backend validation says 'nullable|array'. 
      // If we send comma separated string, Laravel might not automatically cast to array.
      // Better to send as array from here.
      const techs = formData.technologies.split(',').map(t => t.trim()).filter(Boolean);
      techs.forEach((t, i) => data.append(`technologies[${i}]`, t));

      data.append('featured', formData.featured ? '1' : '0');

      if (selectedImage) {
        data.append('image', selectedImage);
      }

      await portfolioService.create(data);
      toast.success("Proyecto agregado correctamente");
      setIsModalOpen(false);
      resetForm();
      loadProjects();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Error al crear el proyecto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;
    try {
      await portfolioService.delete(id);
      toast.success("Proyecto eliminado");
      loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Error al eliminar el proyecto");
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      project_url: '',
      github_url: '',
      client: '',
      completion_date: '',
      technologies: '',
      featured: false
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const featuredProjects = projects.filter(project => project.featured);

  // Helper to safely get technologies array
  const getTechArray = (techs: string[] | string | undefined): string[] => {
    if (Array.isArray(techs)) return techs;
    if (typeof techs === 'string') return JSON.parse(techs); // Or split if comma separated
    return [];
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Cargando portafolio...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mi Portafolio</h1>
          <p className="text-gray-300">
            Showcases de mis mejores proyectos y trabajos realizados
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-5 w-5 mr-2" />
              Agregar Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-[#1A1A1A] border-[#333333] text-white">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Proyecto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title" name="title"
                    value={formData.title} onChange={handleInputChange}
                    required className="bg-[#0D0D0D] border-[#333333]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Input
                    id="client" name="client"
                    value={formData.client} onChange={handleInputChange}
                    className="bg-[#0D0D0D] border-[#333333]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description" name="description"
                  value={formData.description} onChange={handleInputChange}
                  required className="bg-[#0D0D0D] border-[#333333]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_url">URL del Proyecto</Label>
                  <Input
                    id="project_url" name="project_url"
                    value={formData.project_url} onChange={handleInputChange}
                    className="bg-[#0D0D0D] border-[#333333]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_url">URL de GitHub</Label>
                  <Input
                    id="github_url" name="github_url"
                    value={formData.github_url} onChange={handleInputChange}
                    className="bg-[#0D0D0D] border-[#333333]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="completion_date">Fecha Completado</Label>
                  <Input
                    id="completion_date" name="completion_date"
                    placeholder="Ej: Dic 2023"
                    value={formData.completion_date} onChange={handleInputChange}
                    className="bg-[#0D0D0D] border-[#333333]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technologies">Tecnologías (separadas por coma)</Label>
                  <Input
                    id="technologies" name="technologies"
                    placeholder="React, Node.js, AWS"
                    value={formData.technologies} onChange={handleInputChange}
                    className="bg-[#0D0D0D] border-[#333333]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagen del Proyecto</Label>
                <div className="border-2 border-dashed border-[#333333] rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <div className="relative h-40 w-full">
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4 text-gray-400">
                      <Upload className="h-8 w-8 mb-2" />
                      <p>Click o arrastra una imagen aquí</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-[#333333] bg-[#0D0D0D]"
                />
                <Label htmlFor="featured">Destacar Proyecto</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Guardar Proyecto
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-white">{projects.length}</div>
            <div className="text-gray-400 text-sm">Proyectos Totales</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-white">{featuredProjects.length}</div>
            <div className="text-gray-400 text-sm">Proyectos Destacados</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-white">
              {projects.reduce((sum, project) => sum + project.views, 0)}
            </div>
            <div className="text-gray-400 text-sm">Visualizaciones</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-white">
              {projects.reduce((sum, project) => sum + project.likes, 0)}
            </div>
            <div className="text-gray-400 text-sm">Likes Totales</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Proyectos Destacados</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {featuredProjects.slice(0, 2).map((project) => (
              <Card key={project.id} className="bg-[#1A1A1A] border-[#333333] hover-neon overflow-hidden">
                <div className="relative">
                  <ImageWithFallback
                    src={project.image_url || "/placeholder-project.jpg"}
                    alt={project.title}
                    fallbackSrc="/placeholder-project.jpg"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">Destacado</Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-400" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {getTechArray(project.technologies).slice(0, 4).map((tech, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-[#0D0D0D] text-[#00C46A] text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {project.completion_date}
                    </span>
                    <span>Cliente: {project.client}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {project.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {project.likes}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      {project.github_url && (
                        <Button size="sm" variant="outline" className="border-[#333333] text-white hover:bg-[#333333]" onClick={() => window.open(project.github_url, '_blank')}>
                          <Github className="h-4 w-4 mr-1" />
                          Código
                        </Button>
                      )}
                      {project.project_url && (
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => window.open(project.project_url, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Ver Demo
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Projects */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Todos los Proyectos</h2>
        {projects.length === 0 ? (
          <p className="text-gray-400">No hay proyectos aún. ¡Agrega el primero!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="bg-[#1A1A1A] border-[#333333] hover-neon overflow-hidden">
                <div className="relative">
                  <ImageWithFallback
                    src={project.image_url || "/placeholder-project.jpg"}
                    alt={project.title}
                    fallbackSrc="/placeholder-project.jpg"
                    className="w-full h-40 object-cover"
                  />
                  {project.featured && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-primary-foreground text-xs">★</Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold text-white">{project.title}</h3>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-400 p-1" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {getTechArray(project.technologies).slice(0, 3).map((tech, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-[#0D0D0D] text-[#00C46A] text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {getTechArray(project.technologies).length > 3 && (
                      <Badge
                        variant="secondary"
                        className="bg-[#0D0D0D] text-gray-400 text-xs"
                      >
                        +{getTechArray(project.technologies).length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>{project.completion_date}</span>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {project.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {project.likes}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {project.github_url && (
                      <Button size="sm" variant="outline" className="flex-1 border-[#333333] text-white hover:bg-[#333333] text-xs" onClick={() => window.open(project.github_url, '_blank')}>
                        <Github className="h-3 w-3 mr-1" />
                        Código
                      </Button>
                    )}
                    {project.project_url && (
                      <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs" onClick={() => window.open(project.project_url, '_blank')}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Demo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}