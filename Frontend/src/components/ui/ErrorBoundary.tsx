import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    sectionName?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary - Captura errores en el árbol de componentes hijo
 * Evita pantallas en negro cuando un componente lanza una excepción en render.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('[ErrorBoundary] Error capturado:', error, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        Algo salió mal
                    </h2>
                    <p className="text-muted-foreground text-sm mb-2 max-w-md">
                        {this.props.sectionName
                            ? `La sección "${this.props.sectionName}" tuvo un error inesperado.`
                            : 'Esta sección tuvo un error inesperado.'}
                    </p>
                    {this.state.error && (
                        <p className="text-xs text-red-400/70 mb-6 font-mono max-w-md break-all">
                            {this.state.error.message}
                        </p>
                    )}
                    <Button
                        variant="outline"
                        onClick={this.handleReset}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reintentar
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
