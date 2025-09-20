import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, LoginCredentials, SignupData, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('laureate_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('laureate_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get users from localStorage or use default
      const savedUsers = localStorage.getItem('laureate_users');
      const users: AuthUser[] = savedUsers ? JSON.parse(savedUsers) : [];

      // Find user by email
      const foundUser = users.find(u => u.email === credentials.email);

      if (!foundUser) {
        setError('User not found. Please check your email or sign up.');
        setIsLoading(false);
        return false;
      }

      if (foundUser.password !== credentials.password) {
        setError('Invalid password. Please try again.');
        setIsLoading(false);
        return false;
      }

      // Login successful
      setUser(foundUser);
      localStorage.setItem('laureate_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      setError('Login failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return false;
      }

      // Check if user already exists
      const savedUsers = localStorage.getItem('laureate_users');
      const users: AuthUser[] = savedUsers ? JSON.parse(savedUsers) : [];

      if (users.find(u => u.email === data.email)) {
        setError('User with this email already exists.');
        setIsLoading(false);
        return false;
      }

      // Create new user
      const newUser: AuthUser = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        targetUniversity: data.targetUniversity,
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'], // Default subjects
        currentLevel: data.currentLevel,
        studyGoal: data.studyGoal,
        createdAt: new Date(),
        isVerified: false
      };

      // Save user to localStorage
      users.push(newUser);
      localStorage.setItem('laureate_users', JSON.stringify(users));

      // Auto-login after signup
      setUser(newUser);
      localStorage.setItem('laureate_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      setError('Signup failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('laureate_user');
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
