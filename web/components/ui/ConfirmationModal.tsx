'use client';

import { Fragment, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X, HelpCircle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    icon?: 'alert' | 'help';
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    isDestructive = false,
    icon = 'alert'
}: ConfirmationModalProps) {

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Portal to document.body to ensure it sits on top of everything
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] relative overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className={`p-3 rounded-full mb-4 ${isDestructive ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#001F3F]'}`}>
                            {icon === 'alert' && <AlertCircle className="w-8 h-8" />}
                            {icon === 'help' && <HelpCircle className="w-8 h-8 text-[#D4AF37]" />}
                        </div>

                        <h3 className="text-xl font-bold text-[#001F3F] mb-2">{title}</h3>

                        <p className="text-gray-500 mb-8 text-sm leading-relaxed px-4">
                            {message}
                        </p>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={onClose}
                                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 px-5 py-2.5 rounded-xl text-white font-bold shadow-lg transition-transform active:scale-95 text-sm ${isDestructive
                                        ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                                        : 'bg-[#D4AF37] hover:bg-[#C5A028] shadow-[#D4AF37]/20'
                                    }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
