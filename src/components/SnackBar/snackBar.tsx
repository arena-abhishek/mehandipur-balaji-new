import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; // Using Lucide for the icon as an example

// Types
type TSnackbarVariant = 'success' | 'error' | 'warning' | 'info';

type TSnackbarProps = {
  text: string;
  // icon?: React.ComponentType<{ className?: string }> | JSX.Element;
  icon?: any;
  // React.ComponentType<{ className?: string }> | JSX.Element;

  // icon?: React.ComponentType<{ className?: string }> | JSX.Element;  // Accept both
  variant?: TSnackbarVariant;
  duration?: number;
  handleClose?: () => void;   // ✅ Add handleClose prop

};

export default function Snackbar({
  text,
  icon: Icon,
  variant = 'info',
  duration = 3000
}: TSnackbarProps) {
  const [isVisible, setIsVisible] = useState(true);

  const variants = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500"
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="absolute right-4 top-4">
      <div
        className={`${variants[variant]} flex min-w-[320px] items-center truncate whitespace-nowrap rounded-lg py-3 px-3.5 text-xs text-white shadow-md`}
      >
        {Icon && (
          <span className="mr-4 text-base" aria-hidden="true">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <span>{text}</span>
        <button
          className="ml-auto bg-transparent !p-0 text-current underline"
          onClick={() => setIsVisible(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Example usage component
export function SnackbarDemo() {
  const [showSnackbar, setShowSnackbar] = useState(false);

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setShowSnackbar(true)}
      >
        Show Snackbar
      </button>

      {showSnackbar && (
        <Snackbar
          text="This is an informative message!"
          icon={X}
          variant="info"
          duration={3000}
        />
      )}
    </div>
  );
}