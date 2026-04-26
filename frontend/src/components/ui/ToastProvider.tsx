import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider: React.FC = () => (
    <Toaster
        position="top-right"
        gutter={12}
        containerStyle={{ top: 72 }}
        toastOptions={{
            duration: 4000,
            style: {
                background: '#1a1a2e',
                color: '#e2e8f0',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: '500',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            success: {
                iconTheme: { primary: '#10b981', secondary: '#1a1a2e' },
                style: { borderColor: 'rgba(16,185,129,0.3)' },
            },
            error: {
                iconTheme: { primary: '#ef4444', secondary: '#1a1a2e' },
                style: { borderColor: 'rgba(239,68,68,0.3)' },
            },
        }}
    />
);

export default ToastProvider;
