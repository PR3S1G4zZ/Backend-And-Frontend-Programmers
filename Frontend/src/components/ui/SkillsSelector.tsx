import { useState, useMemo } from 'react';
import { ChevronsUpDown, X, Plus } from 'lucide-react';
import { cn } from './utils';
import { Button } from './button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './popover';
import { Badge } from './badge';

interface Skill {
    id?: number;
    name: string;
    level: number; // 1: Básico, 2: Intermedio, 3: Avanzado, 4: Experto
    years: number;
}

interface SkillsSelectorProps {
    skills: Skill[];
    onSkillsChange: (skills: Skill[]) => void;
    isEditing: boolean;
}

const PREDEFINED_SKILLS = [
    "React", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js",
    "Node.js", "Express", "NestJS", "Laravel", "Django", "Flask",
    "Python", "PHP", "Java", "C#", "Go", "Rust",
    "PostgreSQL", "MySQL", "MongoDB", "Redis",
    "Docker", "Kubernetes", "AWS", "Google Cloud", "Azure",
    "Git", "CI/CD", "TypeScript", "JavaScript", "HTML/CSS"
];

const SKILL_LEVELS = [
    { value: 1, label: 'Básico', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { value: 2, label: 'Intermedio', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    { value: 3, label: 'Avanzado', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    { value: 4, label: 'Experto', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
];

export function SkillsSelector({ skills, onSkillsChange, isEditing }: SkillsSelectorProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Filtrar habilidades que ya están seleccionadas
    const availableSkills = useMemo(() => {
        const selectedNames = new Set(skills.map(s => s.name.toLowerCase()));
        return PREDEFINED_SKILLS.filter(skill => !selectedNames.has(skill.toLowerCase()));
    }, [skills]);

    const handleAddSkill = (skillName: string) => {
        onSkillsChange([...skills, { name: skillName, level: 2, years: 1 }]);
        setOpen(false);
        setInputValue("");
    };

    const handleRemoveSkill = (index: number) => {
        const newSkills = [...skills];
        newSkills.splice(index, 1);
        onSkillsChange(newSkills);
    };

    const handleLevelChange = (index: number, level: number) => {
        const newSkills = [...skills];
        newSkills[index].level = level;
        onSkillsChange(newSkills);
    };

    const handleYearsChange = (index: number, years: number) => {
        const newSkills = [...skills];
        newSkills[index].years = years;
        onSkillsChange(newSkills);
    };

    return (
        <div className="space-y-6">
            {isEditing && (
                <div className="flex flex-col space-y-2">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between bg-card hover:bg-muted/50 border-dashed"
                            >
                                <span className="flex items-center text-muted-foreground">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Agregar habilidad técnica...
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                                <CommandInput
                                    placeholder="Buscar tecnología..."
                                    value={inputValue}
                                    onValueChange={setInputValue}
                                />
                                <CommandList>
                                    <CommandEmpty>No se encontró la tecnología.</CommandEmpty>
                                    <CommandGroup heading="Sugerencias">
                                        {availableSkills.map((skill) => (
                                            <CommandItem
                                                key={skill}
                                                value={skill}
                                                onSelect={() => {
                                                    handleAddSkill(skill);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                {skill}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                    <div
                        key={`${skill.name}-${index}`}
                        className="group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-base font-medium px-3 py-1">
                                    {skill.name}
                                </Badge>
                            </div>
                            {isEditing && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive -mt-1 -mr-1"
                                    onClick={() => handleRemoveSkill(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-1">
                            {/* Selector de Nivel */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Nivel</label>
                                {isEditing ? (
                                    <div className="flex flex-wrap gap-1">
                                        {SKILL_LEVELS.map((lvl) => (
                                            <button
                                                key={lvl.value}
                                                onClick={() => handleLevelChange(index, lvl.value)}
                                                className={cn(
                                                    "h-1.5 flex-1 rounded-full transition-all",
                                                    skill.level >= lvl.value
                                                        ? lvl.color.split(' ')[1].replace('text-', 'bg-')
                                                        : "bg-muted"
                                                )}
                                                title={lvl.label}
                                            />
                                        ))}
                                        <div className="w-full text-xs text-right font-medium mt-1">
                                            {SKILL_LEVELS[skill.level - 1]?.label}
                                        </div>
                                    </div>
                                ) : (
                                    <Badge variant="secondary" className={cn("w-fit", SKILL_LEVELS[skill.level - 1]?.color)}>
                                        {SKILL_LEVELS[skill.level - 1]?.label}
                                    </Badge>
                                )}
                            </div>

                            {/* Selector de Años */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Experiencia</label>
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleYearsChange(index, Math.max(0, skill.years - 1))}
                                        >
                                            -
                                        </Button>
                                        <span className="text-sm font-medium w-12 text-center">
                                            {skill.years} {skill.years === 1 ? 'año' : 'años'}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleYearsChange(index, skill.years + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-sm font-medium">
                                        {skill.years} {skill.years === 1 ? 'año' : 'años'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {skills.length === 0 && (
                    <div className="col-span-full py-8 text-center text-muted-foreground border border-dashed rounded-lg">
                        <p>No has agregado habilidades técnicas aún.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
