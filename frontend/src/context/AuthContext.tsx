import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  password?: string; // Mock password field
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  applicationDetails?: any; // Generic object to hold application fields
}

interface AuthContextType {
  currentUser: AuthUser | null;
  users: AuthUser[];
  signup: (userData: Omit<AuthUser, 'id' | 'avatar' | 'status'>) => { success: boolean; error?: string };
  loginWithEmail: (email: string, password: string) => { user?: AuthUser; error?: string };
  loginWithOTP: (phone: string, otp: string) => { user?: AuthUser; error?: string };
  loginWithGoogle: () => void;
  updateUserStatus: (userId: string, newStatus: AuthUser['status']) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('mealmitra_currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState<AuthUser[]>(() => {
    const savedUsers = localStorage.getItem('mealmitra_users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mealmitra_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mealmitra_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mealmitra_users', JSON.stringify(users));
  }, [users]);

  const signup = (userData: Omit<AuthUser, 'id' | 'avatar' | 'status'>) => {
    
    const newUser: AuthUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      avatar: MOCK_AVATARS[Math.floor(Math.random() * MOCK_AVATARS.length)],
      status: 'approved', // Auto-approve for testing
    };
    
    setUsers(prev => [...prev, newUser]);
    // Do NOT set currentUser for new signups since they are pending approval
    return { success: true };
  };

  const loginWithEmail = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      if (user.status === 'rejected') return { error: 'Your application has been rejected.' };
      if (user.status === 'suspended') return { error: 'Your account is suspended.' };
      
      setCurrentUser(user);
      return { user };
    }
    return { error: 'Invalid email or password.' };
  };

  const loginWithOTP = (phone: string, otp: string) => {
    // In a mock environment, we'll accept any 4 digit OTP for demo purposes, 
    // but the phone number must be registered for this role.
    const user = users.find(u => u.phone === phone);
    if (user && otp.length >= 4) {
      if (user.status === 'rejected') return { error: 'Your application has been rejected.' };
      if (user.status === 'suspended') return { error: 'Your account is suspended.' };

      setCurrentUser(user);
      return { user };
    }

    // Auto-create customer account if one doesn't exist
    if (!user && otp.length >= 4) {
      const newCustomer: AuthUser = {
        id: `usr-${Date.now()}`,
        name: 'New Customer',
        email: `customer${Date.now()}@example.com`,
        phone: phone,
        role: 'customer',
        status: 'approved',
        avatar: MOCK_AVATARS[0]
      };
      setUsers(prev => [...prev, newCustomer]);
      setCurrentUser(newCustomer);
      return { user: newCustomer };
    }

    return { error: 'Invalid phone or OTP. Ensure you are registered.' };
  };

  const loginWithGoogle = () => {
    // Mock Google Login instantly creates and logs in an approved test customer
    const googleUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: 'Google User',
      email: `googleuser_${Date.now()}@gmail.com`,
      phone: '9999999999',
      role: 'customer',
      status: 'approved',
      avatar: MOCK_AVATARS[0]
    };
    setUsers(prev => [...prev, googleUser]);
    setCurrentUser(googleUser);
  };

  const updateUserStatus = (userId: string, newStatus: AuthUser['status']) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, signup, loginWithEmail, loginWithOTP, loginWithGoogle, updateUserStatus, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
