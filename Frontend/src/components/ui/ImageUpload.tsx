import { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { toast } from 'sonner';

interface ImageUploadProps {
    currentImage?: string;
    name: string;
    onImageChange: (file: File) => void;
    className?: string;
}

export function ImageUpload({ currentImage, name, onImageChange, className }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor, selecciona un archivo de imagen válido');
            return;
        }

        // Validate size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('La imagen no debe superar los 2MB');
            return;
        }

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onImageChange(file); // Pass file to parent
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                    <AvatarImage src={preview || ''} className="object-cover" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                        {getInitials(name)}
                    </AvatarFallback>
                </Avatar>

                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={handleButtonClick}>
                    <Camera className="text-white h-8 w-8" />
                </div>

                <Button
                    type="button"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full shadow-lg"
                    onClick={handleButtonClick}
                >
                    <Camera className="h-4 w-4" />
                </Button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg, image/webp"
            />

            <p className="text-sm text-muted-foreground">
                Click para cambiar. Máx 2MB.
            </p>
        </div>
    );
}
