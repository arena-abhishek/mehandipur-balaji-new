import React, { createContext, useState, useContext, useCallback } from 'react';

// Snackbar type definition
export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

// Snackbar message interface
interface SnackbarMessage {
  id: number;
  message: string;
  type: SnackbarType;
  duration?: number;
}

// Context type
interface SnackbarContextType {
  messages: SnackbarMessage[];
  showSnackbar: (message: string, type?: SnackbarType, duration?: number) => void;
  closeSnackbar: (id: number) => void;
}

// Create context
const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

// Snackbar Provider Component
export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const showSnackbar = useCallback((
    message: string, 
    type: SnackbarType = 'info', 
    duration = 3000
  ) => {
    const id = Date.now();
    const newMessage: SnackbarMessage = { id, message, type, duration };
    
    setMessages(prev => [...prev, newMessage]);

    // Auto-remove message after duration
    setTimeout(() => {
      closeSnackbar(id);
    }, duration);
  }, []);

  const closeSnackbar = useCallback((id: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  return (
    <SnackbarContext.Provider value={{ messages, showSnackbar, closeSnackbar }}>
      {children}
      <SnackbarContainer messages={messages} onClose={closeSnackbar} />
    </SnackbarContext.Provider>
  );
};

// Snackbar Container Component
const SnackbarContainer: React.FC<{ 
  messages: SnackbarMessage[], 
  onClose: (id: number) => void 
}> = ({ messages, onClose }) => {
  if (messages.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map(msg => (
        <div 
          key={msg.id}
          className={`
            p-4 rounded-lg shadow-lg text-white 
            transition-all duration-300 ease-in-out
            ${
              msg.type === 'success' ? 'bg-green-500' :
              msg.type === 'error' ? 'bg-red-500' :
              msg.type === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            }
          `}
        >
          {msg.message}
          <button 
            onClick={() => onClose(msg.id)}
            className="ml-2 text-white hover:opacity-75"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// Custom hook for using Snackbar
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};