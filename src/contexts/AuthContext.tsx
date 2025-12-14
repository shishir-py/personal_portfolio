'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check for existing authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return false;
      }

      // Store token in localStorage for persistence
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Set user data
      setUser(data.user);
      return true;
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Clear user state
      setUser(null);
      
      // Redirect to login
      router.push('/admin/login');
      
      return true;
    } catch (err) {
      console.error('Logout error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status
  const checkAuth = async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Try to get current user info from API
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Clear any stale user data if authentication fails
        setUser(null);
        localStorage.removeItem('token');
        return false;
      }

      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}