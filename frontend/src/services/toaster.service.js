import { create } from "zustand";

export const useToaster = create((set) => {

    const setToaster = (type, message, timeout) => {
        set({
            toaster: {
                show: true, message, type
            }
        });

        onHide(timeout);
    }

    const onHide = (timeout) => {
        setTimeout(() => {
            set({ toaster: { show: false } });
        }, timeout || 3000);
    };

    return {
        toaster: { show: false },
        toast: {
            onSuccess: (message, timeout) => setToaster('success', message, timeout),
            onError: (error, timeout) => setToaster('error', error?.response?.data?.message || error?.response?.statusText || error.message, timeout),
            onInfo: (message, timeout) => setToaster('info', message, timeout),
        },
    }
});