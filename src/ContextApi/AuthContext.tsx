import { log } from 'console';
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of the authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication on initial load
  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("accessToken");

      // More robust token validation
      const isValidToken = token && token !== 'undefined';

      setIsAuthenticated(!!isValidToken);
      setIsLoading(false);
    };

    // Initial check
    checkAuthentication();

    // Listen for storage changes across tabs
    window.addEventListener('storage', checkAuthentication);

    return () => {
      window.removeEventListener('storage', checkAuthentication);
    };
  }, []);

  // Login method
  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    setIsAuthenticated(true);

    // Sync authentication across tabs
    window.dispatchEvent(new Event('storage'));
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);

    // Sync authentication across tabs
    window.dispatchEvent(new Event('storage'));
  };

  // Context value
  const contextValue = {
    isAuthenticated,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log("check data context"), context;

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};