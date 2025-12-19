import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../../services/auth';

interface User {
  id: string;
  email: string;
  background_profile?: {
    software_level: string;
    hardware_background: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, software_level: string, hardware_background: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (software_level: string, hardware_background: string) => Promise<void>;
  getPersonalizationContext: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on initial load - in a real implementation you'd check stored token
  useEffect(() => {
    const checkStoredSession = () => {
      // Check if we have a stored token
      const token = localStorage.getItem('auth_token');
      if (token) {
        // In a real implementation, we would validate the token with the backend
        // For now, we'll just check if it exists and assume it's valid
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } catch (error) {
            console.error('Error parsing stored user data:', error);
          }
        }
      }
      setLoading(false);
    };

    checkStoredSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.signIn(email, password);

      if (response) {
        const userData: User = {
          id: response.user_id,
          email: email,
          background_profile: response.background_profile
        };

        // Store token and user data
        localStorage.setItem('auth_token', response.session_token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, software_level: string, hardware_background: string) => {
    try {
      const response = await authService.signUp(email, password, software_level, hardware_background);

      if (response) {
        const userData: User = {
          id: response.user_id,
          email: email,
          background_profile: {
            software_level,
            hardware_background
          }
        };

        // Store token and user data
        localStorage.setItem('auth_token', response.session_token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      // Clear stored data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (software_level: string, hardware_background: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const updatedProfile = await authService.updateUserProfile(token, {
        software_level,
        hardware_background
      });

      // Update the user state with the new profile
      if (user) {
        const updatedUser = {
          ...user,
          background_profile: {
            software_level: updatedProfile.software_level,
            hardware_background: updatedProfile.hardware_background
          }
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const getPersonalizationContext = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      return await authService.getPersonalizationContext(token);
    } catch (error) {
      console.error('Get personalization context error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    getPersonalizationContext
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};