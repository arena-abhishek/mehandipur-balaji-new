// context/DashboardContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardContextType {
    isDashboard: boolean;
    setIsDashboard: (val: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [isDashboard, setIsDashboard] = useState(false);

    return (
        <DashboardContext.Provider value={{ isDashboard, setIsDashboard }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) throw new Error('useDashboard must be used within DashboardProvider');
    return context;
};
