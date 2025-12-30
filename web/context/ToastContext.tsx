'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all transform animate-in slide-in-from-right-full duration-300
                            ${toast.type === 'success' ? 'bg-white border-green-100 text-[#001F3F]' : ''}
                            ${toast.type === 'error' ? 'bg-white border-red-100 text-[#001F3F]' : ''}
                            ${toast.type === 'info' ? 'bg-white border-blue-100 text-[#001F3F]' : ''}
                        `}
                    >
                        <div className={`
                            p-2 rounded-full 
                            ${toast.type === 'success' ? 'bg-green-50' : ''}
                            ${toast.type === 'error' ? 'bg-red-50' : ''}
                            ${toast.type === 'info' ? 'bg-blue-50' : ''}
                        `}>
                            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
                        </div>

                        <p className="text-sm font-semibold pr-2">{toast.message}</p>

                        <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600 ml-2">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
