import axios from 'axios';
import { useSnackbar } from '@/ContextApi/SnackBarContext';
import toast from 'react-hot-toast';
// Define interfaces for API payloads
export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

class AuthService {
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`/api/register`, userData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  }

  async login(loginData: LoginData): Promise<AuthResponse> {
    // try {
    const response = await fetch(`/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    // const response = await axios.post(`/api/login`, loginData);
    const data = await response.json();


    if (response.ok && data.message != "Invalid email or password") {
      return {
        success: true,
        message: data.message || "Login successful!",
        token: data.token,
      };
      // return response;
    } else {
      toast.error(data.message || "Login failed. Please try again.");
      return {
        success: false,
        message: data.message,
        token: "",
      };
    }
  }
  // catch (error: any) {

  //   // console.log('error ayay ismain', error?.message)
  //   // return {
  //   //   success: false,
  //   //   message: error?.message || 'Login failed'
  //   // };
  // }
  // }

  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`/api/verify`, { email, otp });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed'
      };
    }
  }

  async resendOTP(email: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`/api/resend-otp`, { email });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Resend OTP failed'
      };
    }
  }
}

export default new AuthService();