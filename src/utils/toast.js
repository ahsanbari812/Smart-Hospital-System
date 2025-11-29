import toast from 'react-hot-toast';

// Success toast
export const showSuccess = (message) => {
    toast.success(message, {
        duration: 3000,
    });
};

// Error toast
export const showError = (message) => {
    toast.error(message || 'Something went wrong. Please try again.', {
        duration: 5000,
    });
};

// Info toast
export const showInfo = (message) => {
    toast(message, {
        icon: 'ℹ️',
        duration: 4000,
    });
};

// Loading toast
export const showLoading = (message = 'Loading...') => {
    return toast.loading(message);
};

// Dismiss toast
export const dismissToast = (toastId) => {
    toast.dismiss(toastId);
};

// Promise toast (for async operations)
export const showPromise = (promise, messages) => {
    return toast.promise(promise, {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Error occurred',
    });
};

export default {
    success: showSuccess,
    error: showError,
    info: showInfo,
    loading: showLoading,
    dismiss: dismissToast,
    promise: showPromise,
};
