import { type ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<NonNullable<BaseModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
};

const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function BaseModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  closeOnOutsideClick = true,
  closeOnEsc = true,
  size = 'md',
}: BaseModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const node = containerRef.current;
    const focusables = node?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    const firstFocusable = focusables?.[0];
    (firstFocusable ?? node)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !node) return;

      const focusableElements = node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeOnEsc, isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
      onMouseDown={() => {
        if (closeOnOutsideClick) onClose();
      }}
    >
      <div className="grid h-[100svh] w-full place-items-center overflow-y-auto p-3 sm:p-4">
        <div
          aria-describedby={description ? 'base-modal-description' : undefined}
          aria-labelledby="base-modal-title"
          aria-modal="true"
          className={`w-full ${sizeClasses[size]} rounded-xl border border-[#333333] bg-[#1A1A1A] shadow-2xl`}
          onMouseDown={(event) => event.stopPropagation()}
          ref={containerRef}
          role="dialog"
          tabIndex={-1}
        >
          <div className="max-h-[calc(100svh-1.5rem)] sm:max-h-[calc(100svh-2rem)] overflow-hidden">
            <header className="border-b border-[#333333] px-4 py-4 sm:px-6">
              <h2 className="text-lg font-semibold text-white sm:text-xl" id="base-modal-title">
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-sm text-gray-300" id="base-modal-description">
                  {description}
                </p>
              ) : null}
            </header>

            <section className="max-h-[calc(100svh-12rem)] overflow-y-auto px-4 py-4 sm:px-6">{children}</section>

            {footer ? (
              <footer className="sticky bottom-0 border-t border-[#333333] bg-[#1A1A1A] px-4 py-4 sm:px-6">
                {footer}
              </footer>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
