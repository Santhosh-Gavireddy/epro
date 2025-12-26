import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';
import { toast as toastUtils, TOAST_EVENT } from '../utils/notification';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message) => {
        // De-duplication: Check if an identical toast already exists
        setToasts((prev) => {
            const isDuplicate = prev.some(t => t.message === message && t.type === type);
            if (isDuplicate) return prev;

            const id = Date.now().toString();
            return [...prev, { id, type, message }];
        });
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    // Listen for events from the utility
    useEffect(() => {
        const handleToastEvent = (e) => {
            const { type, message } = e.detail;
            addToast(type, message);
        };

        window.addEventListener(TOAST_EVENT, handleToastEvent);
        return () => {
            window.removeEventListener(TOAST_EVENT, handleToastEvent);
        };
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none items-center">
                <AnimatePresence mode='popLayout'>
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            id={toast.id}
                            type={toast.type}
                            message={toast.message}
                            onClose={removeToast}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
