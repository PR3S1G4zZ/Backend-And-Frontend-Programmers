import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface AlertOptions {
    title: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    timer?: number;
}

interface ConfirmOptions extends AlertOptions {
    onConfirm?: () => void;
    onCancel?: () => void;
}

export function useAdminAlerts() {
    // Toast de éxito
    const success = (options: AlertOptions) => {
        return MySwal.fire({
            icon: 'success',
            title: options.title,
            text: options.text,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: options.timer || 3000,
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            confirmButtonColor: 'hsl(var(--primary))'
        });
    };

    // Toast de error
    const error = (options: AlertOptions) => {
        return MySwal.fire({
            icon: 'error',
            title: options.title,
            text: options.text,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: options.timer || 4000,
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            confirmButtonColor: 'hsl(var(--destructive))'
        });
    };

    // Toast de advertencia
    const warning = (options: AlertOptions) => {
        return MySwal.fire({
            icon: 'warning',
            title: options.title,
            text: options.text,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: options.timer || 4000,
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            confirmButtonColor: 'hsl(var(--warning))'
        });
    };

    // Toast informativo
    const info = (options: AlertOptions) => {
        return MySwal.fire({
            icon: 'info',
            title: options.title,
            text: options.text,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: options.timer || 3000,
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            confirmButtonColor: 'hsl(var(--primary))'
        });
    };

    // Modal de confirmación
    const confirm = async (options: ConfirmOptions) => {
        const result = await MySwal.fire({
            title: options.title,
            text: options.text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: 'hsl(var(--primary))',
            cancelButtonColor: 'hsl(var(--muted))',
            confirmButtonText: options.confirmButtonText || 'Confirmar',
            cancelButtonText: options.cancelButtonText || 'Cancelar',
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))'
        });

        if (result.isConfirmed) {
            options.onConfirm?.();
            return true;
        } else {
            options.onCancel?.();
            return false;
        }
    };

    // Modal de alerta (solo aceptar)
    const alert = async (options: AlertOptions) => {
        return MySwal.fire({
            title: options.title,
            text: options.text,
            icon: 'info',
            confirmButtonColor: 'hsl(var(--primary))',
            confirmButtonText: options.confirmButtonText || 'Aceptar',
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))'
        });
    };

    // Cargar desde la API
    const loading = (title: string = 'Cargando...') => {
        MySwal.fire({
            title,
            allowOutsideClick: false,
            didOpen: () => {
                MySwal.showLoading();
            },
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))'
        });
    };

    // Cerrar modal de carga
    const closeLoading = () => {
        MySwal.close();
    };

    return {
        success,
        error,
        warning,
        info,
        confirm,
        alert,
        loading,
        closeLoading
    };
}
