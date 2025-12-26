import React, { useEffect } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';

const iconStyles = {
    success: { icon: <FiCheck className="w-5 h-5 text-green-600" />, bg: 'bg-green-100' },
    error: { icon: <FiX className="w-5 h-5 text-red-600" />, bg: 'bg-red-100' },
    warning: { icon: <FiAlertCircle className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100' },
    info: { icon: <FiInfo className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' }
};

const Toast = ({ id, type, message, onClose }) => {
    const style = iconStyles[type] || iconStyles.info;

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 3000);
        return () => clearTimeout(timer);
    }, [id, onClose]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="pointer-events-auto flex items-center gap-4 p-3 min-w-[320px] max-w-md bg-white rounded-xl shadow-md border border-gray-100"
        >
            <div className={`p-2 rounded-full ${style.bg} flex-shrink-0`}>
                {style.icon}
            </div>
            <p className="text-gray-600 text-sm font-medium flex-1">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
                <FiX className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

export default Toast;
