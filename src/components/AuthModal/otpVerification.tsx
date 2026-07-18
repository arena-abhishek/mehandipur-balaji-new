import React, { useState, useEffect, useCallback } from 'react';
import AuthService from '@/ApiServices/AuthService';
import { getItemFromLocalStorage } from '@/utils/localStorage';
import { useAuth } from '@/ContextApi/AuthContext';
import { toast } from 'react-hot-toast';


interface OTPVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onClose: () => void;
}



const OTPVerification: React.FC<OTPVerificationProps> = ({
  onVerificationSuccess,
  onClose,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [email, setEmail] = useState<any>()
  const { login, isLoading } = useAuth();


  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setTimeout(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    const email = getItemFromLocalStorage<string>("email");
    setEmail(email)
  }, []);

  const handleOtpChange = (index: number, value: string): void => {
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (otpError) {
      setOtpError('');
    }

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');

    if (/^\d+$/.test(pastedData) && pastedData.length <= 6) {
      const digits = pastedData.split('').slice(0, 6);
      const newOtp = [...otp];

      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });

      setOtp(newOtp);

      const nextEmptyIndex = newOtp.findIndex(val => !val);
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      const nextInput = document.getElementById(`otp-${focusIndex}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const validateOtp = (): boolean => {
    if (otp.some(digit => digit === '')) {
      setOtpError('Please enter all 6 digits of the OTP');
      return false;
    }
    return true;
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOtp()) return;

    setIsSubmitting(true);
    const otpCode = otp.join('');

    try {
      const response = await AuthService.verifyOTP(email, otpCode);

      if (response.success) {

        toast.success(response.message)
        login(response.token ?? "")
        onVerificationSuccess();
      } else {

        toast.error(response.message)
      }
      onClose()

    } catch (error: any) {

      toast.error(error?.message)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setResendTimer(30);

    try {
      const response = await AuthService.resendOTP(email);

      if (response.success) {

        toast.success(response.message)
      } else {

        toast.error(response.message)
      }
    } catch (error: any) {

      toast.error(error?.message)


    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 sm:p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-orange-600">Verify Your Phone</h3>
        </div>

        <div className="text-center mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-600">
            We've sent a 6-digit code to <span className="font-semibold">{email}</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Enter the code below to verify your phone number
          </p>
        </div>

        <form onSubmit={handleOtpSubmit}>
          <div className="grid grid-cols-6 gap-1 xs:gap-2 sm:gap-3 mb-4 sm:mb-6 px-1 sm:px-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={index === 0 ? handleOtpPaste : undefined}
                className="w-full aspect-square text-center text-base sm:text-xl font-semibold border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-2"
                required
              />
            ))}
          </div>

          {otpError && (
            <p className="text-xs sm:text-sm text-red-600 text-center mb-3 sm:mb-4">{otpError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-white text-sm sm:text-base bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            {isSubmitting ? 'Verifying...' : 'Verify & Complete Booking'}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button
              className={`text-orange-600 font-medium hover:text-orange-700 ${!canResend ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleResendOTP}
              disabled={!canResend}
            >
              Resend
            </button>
          </p>

          {resendTimer > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              You can request a new code in <span className="font-medium">00:{resendTimer.toString().padStart(2, '0')}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;