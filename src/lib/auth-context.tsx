'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Use Supabase Edge Function if available, otherwise Express API
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydycncbqobpljrtknpqd.supabase.co';
    const EXPRESS_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const USE_SUPABASE = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    const API_BASE_URL = USE_SUPABASE 
      ? `${SUPABASE_URL}/functions/v1/admin-auth`
      : `${EXPRESS_API_URL}/auth/login`;
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add Supabase API key for Edge Functions
      // Supabase Edge Functions require both apikey and Authorization headers
      if (USE_SUPABASE) {
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        if (supabaseAnonKey) {
          headers['apikey'] = supabaseAnonKey;
          // Also send as Authorization Bearer token (required by Supabase Edge Functions)
          headers['Authorization'] = `Bearer ${supabaseAnonKey}`;
        }
      }
      
      // Try backend authentication first
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json().catch(() => ({ error: 'Failed to parse response' }));
      
      if (response.ok && responseData.success && responseData.data) {
        const { user, tokens } = responseData.data;
        
        // Verify tokens exist
        if (!tokens || !tokens.accessToken) {
          console.error('Login response missing tokens:', responseData);
          throw new Error('Login failed: No access token received');
        }
        
        // Store token and user info
        try {
          localStorage.setItem('authToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken || '');
          localStorage.setItem('user', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.first_name || user.email,
          }));
          
          // Verify token was stored
          const storedToken = localStorage.getItem('authToken');
          if (!storedToken) {
            console.error('Failed to store token in localStorage');
            throw new Error('Failed to store authentication token');
          }
          
          setUser({
            id: user.id,
            email: user.email,
            name: user.first_name || user.email,
          });
          return;
        } catch (storageError) {
          console.error('localStorage error:', storageError);
          throw new Error('Failed to save authentication data. Please check browser settings.');
        }
      }
      
      // If backend returns error, throw it
      throw new Error(responseData.error || responseData.message || 'Invalid credentials');
    } catch (error) {
      // Check if it's a network error (backend not running)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Make sure the backend is running.`);
      }
      
      // Re-throw other errors
      throw error instanceof Error ? error : new Error('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
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
