import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <UIContext.Provider value={{
            sidebarOpen,
            toggleSidebar: () => setSidebarOpen(p => !p),
            closeSidebar: () => setSidebarOpen(false),
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const ctx = useContext(UIContext);
    if (!ctx) throw new Error('useUI must be used within UIProvider');
    return ctx;
};
