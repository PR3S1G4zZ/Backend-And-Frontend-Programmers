import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Separator } from '../../ui/separator';
import { 
  Plus, 
  X, 
  DollarSign, 
  Calendar, 
  Users, 
  Clock,
  Star,
  FileText,
  Upload,
  Eye,
  Save,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';

interface Skill {
  id: string;
  name: string;
  required: boolean;
}

export function PublishProjectSection() {
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
  const [isDraft, setIsDraft] = useState(false);

  const popularSkills = [
    'React', 'Node.js', 'TypeScript', 'Python', 'Vue.js', 'Angular',
    'React Native', 'Flutter', 'Django', 'Laravel', 'PostgreSQL', 'MongoDB',
    'AWS', 'Docker', 'GraphQL', 'REST API', 'UI/UX Design', 'Figma'
  ];

  const categories = [
    'Desarrollo Web Frontend',
    'Desarrollo Web Backend', 
    'Desarrollo Full Stack',
    'Desarrollo Mobile',
    'UI/UX Design',
    'DevOps e Infraestructura',
    'Data Science & Analytics',
    'Machine Learning/AI',
    'Blockchain',
    'Testing & QA'
  ];

  const addSkill = (skillName: string, required: boolean = false) => {
    if (skillName && !skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      setSkills([...skills, { 
        id: Date.now().toString(), 
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

  const handleSubmit = (asDraft: boolean = false) => {
    setIsDraft(asDraft);
    // Aquí iría la lógica para enviar el proyecto
    console.log('Publicando proyecto:', { formData, skills, deliverables, requirements, isDraft: asDraft });
  };

  const steps = [
    { id: 1, title: 'Información Básica', description: 'Título, descripción y categoría' },
    { id: 2, title: 'Presupuesto y Tiempo', description: 'Presupuesto, duración y fechas' },
    { id: 3, title: 'Habilidades y Requisitos', description: 'Skills necesarios y experiencia' },
    { id: 4, title: 'Entregables y Extras', description: 'Deliverables y información adicional' }
  ];

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
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ej: Desarrollo de SaaS Dashboard para Analytics"
                className="mt-2 bg-[#0D0D0D] border-[#333333] text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                Sé específico y descriptivo para atraer los mejores candidatos
              </p>
            </div>

            <div>
              <Label htmlFor="category" className="text-white">Categoría *</Label>
              <Select onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="mt-2 bg-[#0D0D0D] border-[#333333] text-white">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-[#333333]">
                      {category}
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
                onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                      onCheckedChange={() => setFormData({...formData, budgetType: 'fixed'})}
                    />
                    <Label htmlFor="fixed" className="text-white">Precio Fijo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hourly"
                      checked={formData.budgetType === 'hourly'}
                      onCheckedChange={() => setFormData({...formData, budgetType: 'hourly'})}
                    />
                    <Label htmlFor="hourly" className="text-white">Por Hora</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="budget" className="text-white">
                  Presupuesto ({formData.budgetType === 'fixed' ? 'Total' : 'Por Hora'}) *
                </Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder={formData.budgetType === 'fixed' ? '5000-8000' : '50-80'}
                    className="pl-10 bg-[#0D0D0D] border-[#333333] text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="duration" className="text-white">Duración Estimada *</Label>
                <div className="flex mt-2 space-x-2">
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="4-6"
                    className="bg-[#0D0D0D] border-[#333333] text-white"
                  />
                  <Select onValueChange={(value) => setFormData({...formData, durationType: value})}>
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
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="mt-2 bg-[#0D0D0D] border-[#333333] text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white">Tamaño del Equipo</Label>
                <Select onValueChange={(value) => setFormData({...formData, teamSize: value})}>
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
                <Select onValueChange={(value) => setFormData({...formData, priority: value})}>
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
                    className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]"
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
                              skill.required ? "bg-[#00FF85] text-[#0D0D0D]" : "bg-[#333333] text-white"
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
              <Select onValueChange={(value) => setFormData({...formData, experienceLevel: value})}>
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
                  <p className="text-sm text-gray-400">{formData.category || 'Categoría'}</p>
                </div>
                
                <p className="text-gray-300 text-sm">
                  {formData.description || 'Descripción del proyecto...'}
                </p>

                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 5).map((skill) => (
                    <Badge key={skill.id} variant={skill.required ? "default" : "secondary"} className={
                      skill.required ? "bg-[#00FF85] text-[#0D0D0D]" : "bg-[#333333] text-white"
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
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Publicar Nuevo Proyecto</h1>
        <p className="text-gray-300">
          Encuentra el talento perfecto para tu proyecto en nuestra red de desarrolladores
        </p>
      </div>

      {/* Progress Steps */}
      <Card className="bg-[#1A1A1A] border-[#333333]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step.id 
                    ? 'bg-[#00FF85] text-[#0D0D0D]'
                    : currentStep > step.id
                    ? 'bg-green-600 text-white'
                    : 'bg-[#333333] text-gray-400'
                }`}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
                {step.id < steps.length && (
                  <div className={`hidden md:block w-12 h-px ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-[#333333]'
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

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="border-[#333333] text-white hover:bg-[#333333]"
        >
          Anterior
        </Button>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            className="border-[#333333] text-white hover:bg-[#333333]"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Borrador
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={() => handleSubmit(false)}
              className="bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]"
            >
              <Send className="h-4 w-4 mr-2" />
              Publicar Proyecto
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}