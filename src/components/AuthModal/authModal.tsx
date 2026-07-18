import React, { useEffect, useState } from 'react';
import { RegisterForm, LoginForm } from '@/components/AuthModal/registerModal';
import OTPVerification from './otpVerification';
import Snackbar from '@/components/SnackBar/snackBar';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { TSnackbarProps } from '@/components/SnackBar/types';
import { BookingForm } from './bookingFormModel';

interface ServiceItem {
  id: number;
  name: string;
  quantity: string;
  price: number;
  selected?: boolean;
}
type AuthModalProps = {
  mt: number;
  isOpen: boolean;
  onClose: () => void;
  isOpenBooking?: boolean;  // optional now
  items?: any[];
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, items, isOpenBooking, onClose, mt }) => {

  const [authMode, setAuthMode] = useState<'booking' | 'login' | 'register'>('register');
  const [showOTPVerification, setShowOTPVerification] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    show: boolean;
    text: string;
    variant: any;
  }>({
    show: false,
    text: '',
    variant: 'info'
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    if (isOpenBooking) {
      setAuthMode("booking");
    }
  }, [isOpenBooking]);


  const handleSwitchMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  const handleOTPVerificationSuccess = () => {
    setShowOTPVerification(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{ marginTop: mt ? `${mt}px` : "0" }}  // ✅ Apply margin dynamically

      className={mt != 0 ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 px-4 py-8 overflow-y-auto" : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto"}
      onClick={onClose}
    >
      {/* Snackbar Positioning */}
      <div className="fixed top-4 right-4 z-[100]">
        {snackbar.show && (
          <Snackbar
            text={snackbar.text}
            variant={snackbar.variant ?? "success"}
            icon={snackbar.variant ?? "success" === "success" ? <CheckCircle /> : <AlertCircle />}  // JSX elements
            handleClose={handleCloseSnackbar}
          />
        )}
      </div>

      <div
        className="relative w-full max-w-md md:max-w-lg lg:max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 lg:p-10">
          {showOTPVerification ? (
            <OTPVerification
              email={userData?.email}
              onVerificationSuccess={handleOTPVerificationSuccess}
              onClose={onClose}
            />
          ) : authMode === 'login' ? (
            <LoginForm
              onSwitchMode={handleSwitchMode}
              onClose={onClose}
            />
          ) : authMode === "booking" ? (
            <BookingForm
              id={0}
            // items={items || []}
            // email={userData?.email}
            // onVerificationSuccess={handleOTPVerificationSuccess}
            // onClose={onClose}
            />
          ) : (
            <RegisterForm
              onClose={() => { }}  // ✅ Empty function
              onSwitchMode={handleSwitchMode}
              setShowOTPVerification={() => setShowOTPVerification(true)}
            />

          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;