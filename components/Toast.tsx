import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('show-toast', { detail: { message, type } });
    window.dispatchEvent(event);
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type: 'success' | 'error' | 'info' }>;
      const { message, type } = customEvent.detail;
      
      const newToast: ToastMessage = {
        id: Math.random().toString(36).substring(2, 9),
        message,
        type,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };

    window.addEventListener('show-toast', handleToastEvent);
    return () => {
      window.removeEventListener('show-toast', handleToastEvent);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-60 space-y-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-sky-500 shrink-0" />;
        let borderColor = 'border-sky-500/20';
        let glowColor = 'shadow-sky-500/5';
        
        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
          borderColor = 'border-emerald-500/30';
          glowColor = 'shadow-emerald-500/10';
        } else if (toast.type === 'error') {
          icon = <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />;
          borderColor = 'border-rose-500/30';
          glowColor = 'shadow-rose-500/10';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-card/90 dark:bg-zinc-950/90 backdrop-blur-md border ${borderColor} rounded-2xl p-4 shadow-lg ${glowColor} flex items-start gap-3 transition-all duration-300 animate-fade-in`}
            role="alert"
          >
            {icon}
            <div className="flex-1 text-xs font-semibold text-emerald-950 dark:text-emerald-50 leading-relaxed pr-2">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-emerald-500/10 transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
