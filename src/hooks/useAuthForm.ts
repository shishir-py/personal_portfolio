'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function useAuthForm() {
  const { login, error: authError, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Email and password are required');
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        // Redirect handled in the component using this hook
        return true;
      } else {
        // Auth context already sets error messages
        return false;
      }
    } catch (err) {
      setFormError('An unexpected error occurred');
      return false;
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    loading,
    error: formError || authError,
  };
}