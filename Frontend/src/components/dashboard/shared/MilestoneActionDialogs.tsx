import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../ui/dialog";
import { Button } from '../../ui/button';
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

// I'll keep it simple and just export the specific dialogs or a wrapper
export function SubmitMilestoneDialog({
    open,
    onOpenChange,
    onSubmit,
    isSubmitting,
    milestoneTitle
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (link: string) => void;
    isSubmitting: boolean;
    milestoneTitle?: string;
}) {
    const [link, setLink] = useState('');

    const handleSubmit = () => {
        onSubmit(link);
        setLink('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Entregar Hito: {milestoneTitle}</DialogTitle>
                    <DialogDescription>
                        Proporciona un enlace a los entregables (GitHub, Drive, Figma, etc.).
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">Link</Label>
                        <Input
                            id="link"
                            placeholder="https://..."
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-end">
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={!link.trim() || isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Enviar a Revisión'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
