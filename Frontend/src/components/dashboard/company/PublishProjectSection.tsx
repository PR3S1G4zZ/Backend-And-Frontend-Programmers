import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import {
  Plus,
  X,
  DollarSign,
  Eye,
  Save,
  Send
} from 'lucide-react';
import { useSweetAlert } from '../../ui/sweet-alert';
import { motion } from 'motion/react';
import { createProject, updateProject, fundProject, type ProjectResponse } from '../../../services/projectService';
import { fetchCategories, fetchSkills, type TaxonomyItem } from '../../../services/taxonomyService';

interface Skill {
  id: string;
  name: string;
  required: boolean;
}

interface PublishProjectSectionProps {
  onSectionChange?: (section: string) => void;
  initialData?: ProjectResponse | null;
  isEditing?: boolean;
}

export function PublishProjectSection({ onSectionChange, initialData, isEditing = false }: PublishProjectSectionProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    budgetType: 'fixed', // 'fixed' | 'hourly'
    duration: '',
    durationType: 'weeks', // 'days' | 'weeks' | 'months'
    experienceLevel: '',
    teamSize: '1',
    startDate: '',
    priority: 'medium'
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [deliverables, setDeliverables] = useState(['']);
  const [requirements, setRequirements] = useState(['']);
  const [currentStep, setCurrentStep] = useState(1);
  const [, setIsDraft] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<TaxonomyItem[]>([]);
  const [skillOptions, setSkillOptions] = useState<TaxonomyItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const popularSkills = skillOptions.map((skill) => skill.name);

  // Load initial data if editing
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.categories?.[0]?.id?.toString() || '',
        budget: initialData.budget_type === 'fixed'
          ? `${initialData.budget_min || ''}-${initialData.budget_max || ''}`
          : initialData.budget_max?.toString() || '',
        budgetType: initialData.budget_type || 'fixed',
        duration: initialData.duration_value?.toString() || '',
        durationType: initialData.duration_unit || 'weeks',
        experienceLevel: initialData.level || '',
        teamSize: String(initialData.max_applicants || '1'),
        startDate: '', // Start date needed from API if available
        priority: initialData.priority || 'medium'
      });

      if (initialData.skills) {
        setSkills(initialData.skills.map(s => ({
          id: s.id.toString(),
          name: s.name,
          required: false // API might not have required flag for skills yet, defaulting to false
        })));
      }

      if (initialData.tags) {
        setDeliverables(initialData.tags.length > 0 ? initialData.tags : ['']);
      }
    }
  }, [isEditing, initialData]);

  useEffect(() => {
    let isMounted = true;

    const loadTaxonomies = async () => {
      try {
        const [categoriesResponse, skillsResponse] = await Promise.all([
          fetchCategories(),
          fetchSkills(),
        ]);
        if (!isMounted) return;
        setCategoryOptions(categoriesResponse.data || []);
        setSkillOptions(skillsResponse.data || []);
      } catch (error) {
        console.error('Error cargando taxonomías', error);
      }
    };

    loadTaxonomies();

    return () => {
      isMounted = false;
    };
  }, []);

  const addSkill = (skillName: string, required: boolean = false) => {
    if (skillName && !skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      const match = skillOptions.find(
        (option) => option.name.toLowerCase() === skillName.toLowerCase()
      );
      setSkills([...skills, {
        id: match ? String(match.id) : Date.now().toString(),
        name: skillName,
        required
      }]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillId: string) => {
    setSkills(skills.filter(s => s.id !== skillId));
  };

  const toggleSkillRequired = (skillId: string) => {
    setSkills(skills.map(s =>
      s.id === skillId ? { ...s, required: !s.required } : s
    ));
  };

  const addDeliverable = () => {
    setDeliverables([...deliverables, '']);
  };

  const updateDeliverable = (index: number, value: string) => {
    const updated = [...deliverables];
    updated[index] = value;
    setDeliverables(updated);
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const { showAlert, Alert } = useSweetAlert();

  const handleSubmit = async (asDraft: boolean = false) => {
    setIsDraft(asDraft);
    setIsSubmitting(true);
    setSubmitMessage(null);

    // Validate required fields
    if (!formData.title || !formData.description || !formData.category || !formData.budget) {
      showAlert({
        title: 'Campos Incompletos',
        text: 'Por favor, completa todos los campos obligatorios (Título, Categoría, Descripción, Presupuesto) antes de publicar.',
        type: 'warning'
      });
      setIsSubmitting(false);
      return;
    }

    // Simple single value parsing for budget to make 50% calc easier for now
    // If user enters range "5000-8000", we take the first part? Or force single value for simplicity as per request "X.XX (50%)"
    // Let's assume single value for this "Escrow" flow or take the min.

    // ... (keep existing BudgetMin/Max logic if compatible, or simplify)
    const budgetParts = formData.budget.split('-').map((value) => Number(value.trim()));
    const budgetMin = Number.isFinite(budgetParts[0]) ? budgetParts[0] : null;
    const budgetMax = Number.isFinite(budgetParts[1]) ? budgetParts[1] : budgetMin;


    // Parse team size range to max applicants number
    let maxApplicants = 1;
    switch (formData.teamSize) {
      case '1': maxApplicants = 1; break;
      case '2-3': maxApplicants = 3; break;
      case '4-5': maxApplicants = 5; break;
      case '6+': maxApplicants = 10; break;
      default: maxApplicants = Number(formData.teamSize) || 1;
    }

    const skillIds = skills
      .map((skill) => {
        const id = Number(skill.id);
        return Number.isFinite(id) ? id : null;
      })
      .filter((id): id is number => id !== null);

    const payload = {
      title: formData.title,
      description: formData.description,
      budget_min: budgetMin,
      budget_max: budgetMax,
      budget_type: formData.budgetType,
      duration_value: formData.duration ? Number(formData.duration) : null,
      duration_unit: formData.durationType,
      level: formData.experienceLevel || null,
      priority: formData.priority,
      max_applicants: maxApplicants,
      tags: deliverables.filter(Boolean),
      category_ids: formData.category ? [Number(formData.category)] : [],
      skill_ids: skillIds,
      status: asDraft ? 'draft' : 'pending_payment', // Default to pending_payment if not draft
    };

    try {
      if (isEditing && initialData?.id) {
        await updateProject(String(initialData.id), payload);
        // If editing and standard flow, just show success
        showAlert({
          title: '¡Proyecto Actualizado!',
          text: 'Los cambios han sido guardados exitosamente.',
          type: 'success'
        });
      } else {
        const response = await createProject(payload);
        const projectId = response.data.id;

        if (asDraft) {
          showAlert({
            title: 'Borrador Guardado',
            text: 'Tu proyecto se ha guardado como borrador.',
            type: 'success'
          });
        } else {
          // Funding Flow
          if (projectId && budgetMin) {
            try {
              setSubmitMessage('Procesando depósito del 50%...');
              await fundProject(projectId);
              showAlert({
                title: '¡Proyecto Publicado y Financiado!',
                text: `Se ha depositado el 50% ($${(budgetMin * 0.5).toFixed(2)}) y el proyecto está activo.`,
                type: 'success'
              });
            } catch (fundError) {
              console.error("Fund error", fundError);
              showAlert({
                title: 'Proyecto Creado pero Pago Fallido',
                text: 'El proyecto se creó pero no se pudo procesar el depósito. Por favor verifica tu saldo en la Billetera.',
                type: 'warning'
              });
              // Could redirect to wallet or show retry
            }
          } else {
            showAlert({
              title: '¡Proyecto Publicado!',
              text: 'Tu proyecto ha sido enviado.',
              type: 'success'
            });
          }
        }
      }

      if (onSectionChange) {
        setTimeout(() => {
          onSectionChange('my-projects');
        }, 1500);
      }
    } catch (error) {
      console.error('Error procesando proyecto', error);
      showAlert({
        title: 'Error',
        text: 'Hubo un problema al guardar el proyecto. Por favor intenta de nuevo.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Información Básica', description: 'Título, descripción y categoría' },
    { id: 2, title: 'Presupuesto y Tiempo', description: 'Presupuesto, duración y fechas' },
    { id: 3, title: 'Habilidades y Requisitos', description: 'Skills necesarios y experiencia' },
    { id: 4, title: 'Entregables y Extras', description: 'Deliverables y información adicional' }
  ];
  const selectedCategoryName = categoryOptions.find((category) => String(category.id) === formData.category)?.name;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-white">Título del Proyecto *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Desarrollo de SaaS Dashboard para Analytics"
                className="mt-2 bg-[#0D0D0D] border-[#333333] text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                Sé específico y descriptivo para atraer los mejores candidatos
              </p>
            </div>

            <div>
              <Label htmlFor="category" className="text-white">Categoría *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="mt-2 bg-[#0D0D0D] border-[#333333] text-white">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)} className="text-white hover:bg-[#333333]">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Descripción del Proyecto *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe detalladamente el proyecto, objetivos, tecnologías preferidas..."
                className="mt-2 bg-[#0D0D0D] border-[#333333] text-white min-h-[120px]"
              />
              <p className="text-xs text-gray-400 mt-1">
                Incluye contexto del negocio, objetivos técnicos y cualquier información relevante
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white">Tipo de Presupuesto *</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fixed"
                      checked={formData.budgetType === 'fixed'}
                      onCheckedChange={() => setFormData({ ...formData, budgetType: 'fixed' })}
                    />
                    <Label htmlFor="fixed" className="text-white">Precio Fijo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hourly"
                      checked={formData.budgetType === 'hourly'}
                      onCheckedChange={() => setFormData({ ...formData, budgetType: 'hourly' })}
                    />
                    <Label htmlFor="hourly" className="text-white">Por Hora</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="budget" className="text-white">
                  Presupuesto Total ({formData.budgetType === 'fixed' ? 'Total' : 'Por Hora'}) *
                </Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder={formData.budgetType === 'fixed' ? '5000' : '50'} // Simplified placeholder
                    className="pl-10 bg-[#0D0D0D] border-[#333333] text-white"
                  />
                </div>
                {formData.budget && !isNaN(Number(formData.budget)) && (
                  <div className="mt-2 text-sm text-primary bg-primary/10 p-2 rounded">
                    <p>Depósito requerido hoy (50%): <strong>${(Number(formData.budget) * 0.5).toFixed(2)}</strong></p>
                    <p className="text-xs opacity-80">El 50% restante se paga al finalizar el proyecto.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="duration" className="text-white">Duración Estimada *</Label>
                <div className="flex mt-2 space-x-2">
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="4-6"
                    className="bg-[#0D0D0D] border-[#333333] text-white"
                  />
                  <Select value={formData.durationType} onValueChange={(value) => setFormData({ ...formData, durationType: value })}>
                    <SelectTrigger className="w-32 bg-[#0D0D0D] border-[#333333] text-white">
                      <SelectValue placeholder="Semanas" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                      <SelectItem value="days" className="text-white">Días</SelectItem>
                      <SelectItem value="weeks" className="text-white">Semanas</SelectItem>
                      <SelectItem value="months" className="text-white">Meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="startDate" className="text-white">Fecha de Inicio Preferida</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-2 bg-[#0D0D0D] border-[#333333] text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white">Tamaño del Equipo</Label>
                <Select value={formData.teamSize} onValueChange={(value) => setFormData({ ...formData, teamSize: value })}>
                  <SelectTrigger className="mt-2 bg-[#0D0D0D] border-[#333333] text-white">
                    <SelectValue placeholder="1 desarrollador" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                    <SelectItem value="1" className="text-white">1 desarrollador</SelectItem>
                    <SelectItem value="2-3" className="text-white">2-3 desarrolladores</SelectItem>
                    <SelectItem value="4-5" className="text-white">4-5 desarrolladores</SelectItem>
                    <SelectItem value="6+" className="text-white">6+ desarrolladores</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Prioridad del Proyecto</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger className="mt-2 bg-[#0D0D0D] border-[#333333] text-white">
                    <SelectValue placeholder="Media" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                    <SelectItem value="low" className="text-white">Baja</SelectItem>
                    <SelectItem value="medium" className="text-white">Media</SelectItem>
                    <SelectItem value="high" className="text-white">Alta</SelectItem>
                    <SelectItem value="urgent" className="text-white">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-white">Habilidades Requeridas *</Label>
              <div className="mt-2 space-y-4">
                {/* Agregar nueva habilidad */}
                <div className="flex space-x-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Escribe una habilidad..."
                    className="bg-[#0D0D0D] border-[#333333] text-white"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkill)}
                  />
                  <Button
                    onClick={() => addSkill(newSkill)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Habilidades populares */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Habilidades populares:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularSkills.map((skill) => (
                      <Button
                        key={skill}
                        variant="outline"
                        size="sm"
                        onClick={() => addSkill(skill)}
                        className="border-[#333333] text-gray-300 hover:bg-[#333333] text-xs"
                        disabled={skills.some(s => s.name === skill)}
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Habilidades seleccionadas */}
                {skills.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Habilidades seleccionadas:</p>
                    <div className="space-y-2">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between bg-[#0D0D0D] p-3 rounded-lg border border-[#333333]">
                          <div className="flex items-center space-x-3">
                            <Badge variant={skill.required ? "default" : "secondary"} className={
                              skill.required ? "bg-primary text-primary-foreground" : "bg-[#333333] text-white"
                            }>
                              {skill.name}
                            </Badge>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`required-${skill.id}`}
                                checked={skill.required}
                                onCheckedChange={() => toggleSkillRequired(skill.id)}
                              />
                              <Label htmlFor={`required-${skill.id}`} className="text-sm text-gray-300">
                                Obligatorio
                              </Label>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSkill(skill.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="text-white">Nivel de Experiencia Requerido *</Label>
              <Select value={formData.experienceLevel} onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}>
                <SelectTrigger className="mt-2 bg-[#0D0D0D] border-[#333333] text-white">
                  <SelectValue placeholder="Selecciona el nivel" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                  <SelectItem value="junior" className="text-white">Junior (0-2 años)</SelectItem>
                  <SelectItem value="mid" className="text-white">Mid-level (3-5 años)</SelectItem>
                  <SelectItem value="senior" className="text-white">Senior (5+ años)</SelectItem>
                  <SelectItem value="lead" className="text-white">Tech Lead (8+ años)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-white">Entregables del Proyecto</Label>
              <p className="text-sm text-gray-400 mb-3">
                Define qué se debe entregar al finalizar el proyecto
              </p>
              <div className="space-y-2">
                {deliverables.map((deliverable, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={deliverable}
                      onChange={(e) => updateDeliverable(index, e.target.value)}
                      placeholder="Ej: Código fuente completo, documentación técnica..."
                      className="bg-[#0D0D0D] border-[#333333] text-white"
                    />
                    {deliverables.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDeliverable(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addDeliverable}
                  className="border-[#333333] text-white hover:bg-[#333333]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Entregable
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-white">Requisitos Adicionales</Label>
              <p className="text-sm text-gray-400 mb-3">
                Cualquier otro requisito o consideración especial
              </p>
              <div className="space-y-2">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={requirement}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder="Ej: Disponibilidad en horario específico, metodología ágil..."
                      className="bg-[#0D0D0D] border-[#333333] text-white"
                    />
                    {requirements.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRequirement}
                  className="border-[#333333] text-white hover:bg-[#333333]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Requisito
                </Button>
              </div>
            </div>

            <Card className="bg-[#0D0D0D] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Vista Previa del Proyecto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{formData.title || 'Título del proyecto'}</h3>
                  <p className="text-sm text-gray-400">{selectedCategoryName || 'Categoría'}</p>
                </div>

                <p className="text-gray-300 text-sm">
                  {formData.description || 'Descripción del proyecto...'}
                </p>

                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 5).map((skill) => (
                    <Badge key={skill.id} variant={skill.required ? "default" : "secondary"} className={
                      skill.required ? "bg-primary text-primary-foreground" : "bg-[#333333] text-white"
                    }>
                      {skill.name}
                    </Badge>
                  ))}
                  {skills.length > 5 && (
                    <Badge variant="secondary" className="bg-[#333333] text-white">
                      +{skills.length - 5} más
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Presupuesto:</span>
                    <p className="text-white">€{formData.budget || '0'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Duración:</span>
                    <p className="text-white">{formData.duration} {formData.durationType}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Experiencia:</span>
                    <p className="text-white">{formData.experienceLevel || 'No especificado'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {isEditing ? 'Editar Proyecto' : 'Publicar Nuevo Proyecto'}
        </h1>
        <p className="text-gray-300">
          {isEditing
            ? 'Actualiza la información de tu proyecto'
            : 'Encuentra el talento perfecto para tu proyecto en nuestra red de desarrolladores'}
        </p>
      </div>

      {/* Progress Steps */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : currentStep > step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-[#333333] text-gray-400'
                  }`}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
                {step.id < steps.length && (
                  <div className={`hidden md:block w-12 h-px ${currentStep > step.id ? 'bg-primary' : 'bg-[#333333]'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardHeader>
          <CardTitle className="text-white">
            {steps.find(s => s.id === currentStep)?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </CardContent>
      </Card>

      {submitMessage ? (
        <div className="rounded-lg border border-[#333333] bg-[#0D0D0D] p-3 text-sm text-gray-200">
          {submitMessage}
        </div>
      ) : null}

      {/* Navigation Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1 || isSubmitting}
          className="border-[#333333] text-white hover:bg-[#333333]"
        >
          Anterior
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="border-[#333333] text-white hover:bg-[#333333]"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Guardando...' : 'Guardar Borrador'}
            </Button>
          )}

          {currentStep < steps.length ? (
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Procesando...' : (isEditing ? 'Actualizar Proyecto' : 'Pagar 50% y Publicar')}
            </Button>
          )}
        </div>
      </div>
      <Alert />
    </div>
  );
}
