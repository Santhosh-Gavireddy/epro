
export const TOAST_EVENT = 'toast-notification';

const dispatchToast = (type, message) => {
    if (typeof window !== 'undefined') {
        const event = new CustomEvent(TOAST_EVENT, {
            detail: { type, message }
        });
        window.dispatchEvent(event);
    }
};

export const toast = {
    success: (message) => dispatchToast('success', message),
    error: (message) => dispatchToast('error', message),
    warning: (message) => dispatchToast('warning', message),
    info: (message) => dispatchToast('info', message)
};

export default toast;
