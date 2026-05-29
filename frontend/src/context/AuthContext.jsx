import React, { createContext, useState, useEffect } from 'react';
import { loginApi, signupApi, getMeApi } from '../api/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Load user data on startup if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await getMeApi();
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            // Invalid data format
            logout();
          }
        } catch (err) {
          console.error('Failed to authenticate token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        // Fetch user info
        const meData = await getMeApi();
        if (meData.success) {
          setUser(meData.user);
        }
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid credentials or server error',
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await signupApi(name, email, password);
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        // Fetch user info
        const meData = await getMeApi();
        if (meData.success) {
          setUser(meData.user);
        }
        return { success: true };
      }
      return { success: false, message: data.message || 'Signup failed' };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.response?.data?.message || 'User creation failed or server error',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
