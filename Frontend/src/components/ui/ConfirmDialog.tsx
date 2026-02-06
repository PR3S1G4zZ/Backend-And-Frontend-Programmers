import { BaseModal } from './BaseModal';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'default';
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  const confirmButtonClass =
    variant === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-[#00FF85] text-[#0D0D0D] hover:bg-[#00C46A]';

  return (
    <BaseModal
      closeOnEsc
      closeOnOutsideClick
      description={description}
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      title={title}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="rounded-lg border border-[#333333] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A2A2A]"
            onClick={onCancel}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${confirmButtonClass}`}
            disabled={isLoading}
            onClick={onConfirm}
            type="button"
          >
            {isLoading ? 'Procesando...' : confirmText}
          </button>
        </div>
      }
    >
      <p className="text-sm leading-relaxed text-gray-300">{description}</p>
    </BaseModal>
  );
}
