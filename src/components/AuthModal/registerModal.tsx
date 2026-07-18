

import React, { useEffect, useState } from 'react';
import AuthService, { RegisterData, LoginData } from '@/ApiServices/AuthService';
import { setItemInLocalStorage } from '@/utils/localStorage';
import { useAuth } from '@/ContextApi/AuthContext';
import { toast } from "react-hot-toast";
import { useSnackbar } from '@/ContextApi/SnackBarContext';




interface AuthFormProps {
  onSwitchMode: () => void;
  setShowOTPVerification?: () => void;
  onClose: () => void;
}

// Enum for validation error types
enum ValidationErrorType {
  REQUIRED = 'required',
  INVALID = 'invalid',
  TOO_SHORT = 'too_short'
}

// Improved error handling interface
interface FormValidationError {
  field: keyof RegisterData | keyof LoginData;
  type: ValidationErrorType;
  message: string;
}

export const RegisterForm: React.FC<AuthFormProps> = ({
  onSwitchMode,
  setShowOTPVerification,
}) => {
  const [userData, setUserData] = useState<RegisterData>({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<FormValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error on user input
    setFormErrors(prev => prev.filter(error => error.field !== name));
  };

  const validateForm = (): FormValidationError[] => {
    const errors: FormValidationError[] = [];

    // Name validation
    if (!userData.name.trim()) {
      errors.push({
        field: 'name',
        type: ValidationErrorType.REQUIRED,
        message: "Full name is required"
      });
    }

    // Email validation
    if (!userData.email.trim()) {
      errors.push({
        field: 'email',
        type: ValidationErrorType.REQUIRED,
        message: "Email address is required"
      });
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.push({
        field: 'email',
        type: ValidationErrorType.INVALID,
        message: "Please enter a valid email address"
      });
    }

    // Phone validation
    if (!userData.phone.trim()) {
      errors.push({
        field: 'phone',
        type: ValidationErrorType.REQUIRED,
        message: "Phone number is required"
      });
    } else if (!/^\d{10}$/.test(userData.phone.replace(/\D/g, ''))) {
      errors.push({
        field: 'phone',
        type: ValidationErrorType.INVALID,
        message: "Phone number must be 10 digits"
      });
    }

    // Password validation
    if (!userData.password.trim()) {
      errors.push({
        field: 'password',
        type: ValidationErrorType.REQUIRED,
        message: "Password is required"
      });
    } else if (userData.password.length < 6) {
      errors.push({
        field: 'password',
        type: ValidationErrorType.TOO_SHORT,
        message: "Password must be at least 6 characters long"
      });
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setFormErrors(validationErrors);

      toast.error(validationErrors[0].message)
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await AuthService.register(userData);



      if (response.success) {
        // Store email for potential later use
        setItemInLocalStorage('email', userData.email);
        // setItemInLocalStorage('id', userData.id);


        // Show success message
        toast.success(response?.message)

        // Trigger OTP verification if needed
        if (setShowOTPVerification) {
          console.log('Trigger OTP verification if needed');
          setShowOTPVerification();
        }


      } else {


        toast.error(response?.message)
      }
    } catch (error: any) {
      console.log(' response.message ', error?.message)
      toast.error(error?.message)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render method remains largely the same, with minor modifications to error display
  return (
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-orange-600">Create Account</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Input fields with enhanced error handling */}
          {['name', 'email', 'phone', 'password'].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                {field === 'email' ? 'Email' : field === 'phone' ? 'Phone Number' :
                  field === 'password' ? 'Create Password' :
                    'Full Name'}
              </label>
              <input
                type={field === 'password' ? 'password' :
                  field === 'email' ? 'email' :
                    field === 'phone' ? 'tel' : 'text'}
                id={field}
                name={field}
                value={userData[field as keyof RegisterData]}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 rounded-lg focus:outline-none focus:ring-2 
                  ${formErrors.some(err => err.field === field) ? 'border-red-300' : ''}`}
                placeholder={
                  field === 'name' ? 'Enter your full name' :
                    field === 'email' ? 'you@example.com' :
                      field === 'phone' ? 'Enter your 10-digit phone number' :
                        'Create a secure password'
                }
              />
              {formErrors
                .filter(err => err.field === field)
                .map((error, index) => (
                  <p key={index} className="mt-1 text-sm text-red-600">
                    {error.message}
                  </p>
                ))}
            </div>
          ))}
        </div>

        {/* Submit button with improved loading state */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Register & Complete Booking"
          )}
        </button>
      </form>

      {/* Login switch option */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchMode}
            className="text-orange-600 font-medium hover:text-orange-700"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

// LoginForm follows similar improvements
export const LoginForm: React.FC<AuthFormProps> = ({
  onSwitchMode,
  onClose,
}) => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const { showSnackbar } = useSnackbar();
  const { login, isLoading } = useAuth();
  const [loginErrors, setLoginErrors] = useState<FormValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error on user input
    setLoginErrors(prev => prev.filter(error => error.field !== name));
  };

  const validateLoginForm = (): FormValidationError[] => {
    const errors: FormValidationError[] = [];

    // Email validation
    if (!loginData.email.trim()) {
      errors.push({
        field: 'email',
        type: ValidationErrorType.REQUIRED,
        message: "Email address is required"
      });
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.push({
        field: 'email',
        type: ValidationErrorType.INVALID,
        message: "Please enter a valid email address"
      });
    }

    // Password validation
    if (!loginData.password.trim()) {
      errors.push({
        field: 'password',
        type: ValidationErrorType.REQUIRED,
        message: "Password is required"
      });
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateLoginForm();
    if (validationErrors.length > 0) {
      setLoginErrors(validationErrors);

      toast.error(validationErrors[0].message)
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await AuthService.login(loginData);



      if (response.success) {
        // Store token and email
        login(response.token ?? "")
        setItemInLocalStorage('email', loginData.email);
        // setItemInLocalStorage('name', response[]);
        // setItemInLocalStorage('email', loginData.email);

        // setItemInLocalStorage('id', loginData.id);


        toast.success(response.message);
        onClose();
      }
    } catch (error: any) {

      // Network or unexpected error
      toast.error(error?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render method is similar to RegisterForm with login-specific modifications
  return (
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-orange-600">Login to Your Account</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="login-email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 rounded-lg focus:outline-none focus:ring-2 ${loginErrors.some((err) => err.field === 'email') ? 'border-red-300' : ''
                }`} placeholder="you@example.com"
            />
            {loginErrors
              .filter(error => error.field === 'email')
              .map((error, index) => (
                <p key={index} className="mt-1 text-sm text-red-600">{error.message}</p>
              ))}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="login-password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 rounded-lg focus:outline-none focus:ring-2 ${loginErrors.some((err) => err.field === 'password') ? 'border-red-300' : ''
                }`}
              // className={`w-full px-4 py-3 border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 rounded-lg focus:outline-none focus:ring-2 ${loginErrors.password ? 'border-red-300' : ''}`}
              placeholder="Enter your password"
            />
            {/* {loginErrors.password && (
              <p className="mt-1 text-sm text-red-600">{loginErrors.password}</p>
            )} */}
            {loginErrors
              .filter(error => error.field === 'password')
              .map((error, index) => (
                <p key={index} className="mt-1 text-sm text-red-600">{error.message}</p>
              ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Login & Complete Booking"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchMode}
            className="text-orange-600 font-medium hover:text-orange-700"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};