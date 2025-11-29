import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                // Default options
                duration: 4000,
                style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.75rem',
                    padding: '16px',
                    fontSize: '14px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                },
                // Success
                success: {
                    duration: 3000,
                    iconTheme: {
                        primary: 'hsl(var(--success))',
                        secondary: 'hsl(var(--success-foreground))',
                    },
                    style: {
                        borderLeft: '4px solid hsl(var(--success))',
                    },
                },
                // Error
                error: {
                    duration: 5000,
                    iconTheme: {
                        primary: 'hsl(var(--destructive))',
                        secondary: 'hsl(var(--destructive-foreground))',
                    },
                    style: {
                        borderLeft: '4px solid hsl(var(--destructive))',
                    },
                },
                // Loading
                loading: {
                    iconTheme: {
                        primary: 'hsl(var(--primary))',
                        secondary: 'hsl(var(--primary-foreground))',
                    },
                    style: {
                        borderLeft: '4px solid hsl(var(--primary))',
                    },
                },
            }}
        />
    );
};

export default ToastProvider;
