import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  password?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  applicationDetails?: any;
}

export const normalizePhone = (phone: string): string => {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
};

export const MOCK_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
];

export const DEFAULT_SEED_USERS: AuthUser[] = [
  {
    id: 'usr-cook-1',
    name: 'Nirmala Devi',
    email: 'nirmala.kitchen@example.com',
    phone: '9876543210',
    role: 'cook',
    status: 'approved',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    applicationDetails: {
      kitchenAddress: 'B-12 Krishna Kunj, Sector 14, Navrangpura',
      city: 'Ahmedabad',
      foodCategory: 'Vegetarian Only',
      kitchenName: "Nirmala Devi's Kitchen",
    },
  },
  {
    id: 'usr-delivery-1',
    name: 'Ramesh Patel',
    email: 'ramesh.delivery@example.com',
    phone: '9898011223',
    role: 'delivery',
    status: 'approved',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    applicationDetails: {
      residentialAddress: 'C-104, Shanti Nagar, SG Highway',
      city: 'Ahmedabad',
      vehicleType: 'Motorcycle',
    },
  },
  {
    id: 'usr-cust-1',
    name: 'Jay Shah',
    email: 'jay.shah@example.com',
    phone: '9825123456',
    role: 'customer',
    status: 'approved',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    applicationDetails: {
      address: 'A-402, Shivalik Residency, Navrangpura',
      city: 'Ahmedabad',
      dietaryPreference: 'Vegetarian',
    },
  },
  {
    id: 'usr-admin-1',
    name: 'Admin Manager',
    email: 'admin@mealmitra.com',
    phone: '9999999999',
    role: 'admin',
    status: 'approved',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    applicationDetails: {},
  },
];

interface AuthContextType {
  currentUser: AuthUser | null;
  users: AuthUser[];
  findUserByPhone: (phone: string) => AuthUser | undefined;
  checkPhoneRegistered: (phone: string) => Promise<{ exists: boolean; user?: AuthUser }>;
  loginWithOTP: (phone: string, otp: string) => Promise<{ user?: AuthUser; error?: string }>;
  registerUser: (userData: {
    phone: string;
    role: 'customer' | 'cook' | 'delivery';
    name: string;
    email?: string;
    password?: string;
    applicationDetails?: any;
  }) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  signup: (userData: Omit<AuthUser, 'id' | 'avatar' | 'status'>) => { success: boolean; error?: string };
  loginWithEmail: (email: string, password: string) => { user?: AuthUser; error?: string };
  loginWithGoogle: (role?: UserRole) => void;
  updateUserStatus: (userId: string, newStatus: AuthUser['status']) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('mealmitra_currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [users, setUsers] = useState<AuthUser[]>(() => {
    try {
      const savedUsers = localStorage.getItem('mealmitra_users');
      const parsed: AuthUser[] = savedUsers ? JSON.parse(savedUsers) : [];
      // Merge with default seed users so known demo accounts are always available
      const merged = [...parsed];
      for (const def of DEFAULT_SEED_USERS) {
        const defPhoneNorm = normalizePhone(def.phone);
        const exists = merged.some((u) => normalizePhone(u.phone) === defPhoneNorm);
        if (!exists) {
          merged.push(def);
        }
      }
      return merged;
    } catch (e) {
      return DEFAULT_SEED_USERS;
    }
  });

  // Sync users with backend DB on initial mount
  useEffect(() => {
    const fetchBackendUsers = async () => {
      try {
        const res = await fetch('/api/auth/users');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.users)) {
            setUsers((prev) => {
              const combined = [...prev];
              for (const bu of data.users) {
                const buNorm = normalizePhone(bu.phone);
                const idx = combined.findIndex((u) => normalizePhone(u.phone) === buNorm);
                if (idx === -1) {
                  combined.push({
                    id: bu.id,
                    name: bu.name,
                    email: bu.email,
                    phone: bu.phone,
                    role: bu.role,
                    status: bu.status || 'approved',
                    avatar: bu.avatar,
                    applicationDetails: bu.details || {},
                  });
                }
              }
              return combined;
            });
          }
        }
      } catch (err) {
        // Backend might be offline or using local fallback
      }
    };
    fetchBackendUsers();
  }, []);

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

  const findUserByPhone = (phone: string): AuthUser | undefined => {
    const norm = normalizePhone(phone);
    if (!norm) return undefined;
    return users.find((u) => normalizePhone(u.phone) === norm);
  };

  const checkPhoneRegistered = async (phone: string): Promise<{ exists: boolean; user?: AuthUser }> => {
    const norm = normalizePhone(phone);
    if (!norm) return { exists: false };

    // Check local memory first
    const localUser = users.find((u) => normalizePhone(u.phone) === norm);
    if (localUser) {
      return { exists: true, user: localUser };
    }

    // Check backend API
    try {
      const res = await fetch('/api/auth/check-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: norm }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.exists && data.user) {
          const backendUser: AuthUser = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            role: data.user.role,
            status: data.user.status || 'approved',
            avatar: data.user.avatar,
            applicationDetails: data.user.details || {},
          };
          setUsers((prev) => [...prev, backendUser]);
          return { exists: true, user: backendUser };
        }
      }
    } catch (e) {
      // Backend request failed, rely on local state
    }

    return { exists: false };
  };

  const loginWithOTP = async (phone: string, otp: string): Promise<{ user?: AuthUser; error?: string }> => {
    const norm = normalizePhone(phone);
    if (!norm || norm.length < 10) {
      return { error: 'Please enter a valid 10-digit phone number.' };
    }

    if (!otp || otp.length < 4) {
      return { error: 'Please enter a valid 4-digit verification code.' };
    }

    // Check if phone exists locally
    let user = users.find((u) => normalizePhone(u.phone) === norm);

    // If not found in local memory, check backend
    if (!user) {
      try {
        const res = await fetch('/api/auth/login-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: norm, otp }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.user) {
          user = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            role: data.user.role,
            status: data.user.status || 'approved',
            avatar: data.user.avatar,
            applicationDetails: data.user.details || {},
          };
          setUsers((prev) => [...prev, user!]);
        } else if (res.status === 404) {
          return { error: 'No account found with this phone number. Please register first.' };
        }
      } catch (e) {
        // Fallback below
      }
    }

    if (!user) {
      return { error: 'No account found with this phone number. Please register first.' };
    }

    if (user.status === 'rejected') {
      return { error: 'Your account has been rejected. Please contact support.' };
    }
    if (user.status === 'suspended') {
      return { error: 'Your account is suspended. Please contact support.' };
    }

    // Success: user is verified, retrieve their stored role and log them in
    setCurrentUser(user);
    return { user };
  };

  const registerUser = async (userData: {
    phone: string;
    role: 'customer' | 'cook' | 'delivery';
    name: string;
    email?: string;
    password?: string;
    applicationDetails?: any;
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    const norm = normalizePhone(userData.phone);
    if (!norm || norm.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit phone number.' };
    }

    // Check if user already exists
    const existing = users.find((u) => normalizePhone(u.phone) === norm);
    if (existing) {
      return {
        success: false,
        error: 'This phone number is already registered. Please log in instead.',
      };
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: userData.name.trim() || 'User',
      email: userData.email?.trim() || `${userData.role}_${Date.now()}@mealmitra.com`,
      phone: norm,
      role: userData.role,
      password: userData.password,
      status: 'approved', // Auto-approved for frictionless dashboard access
      avatar: MOCK_AVATARS[Math.floor(Math.random() * MOCK_AVATARS.length)],
      applicationDetails: userData.applicationDetails || {},
    };

    // Save in local state and localStorage
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    // Persist to backend SQLite DB
    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          avatar: newUser.avatar,
          status: newUser.status,
          details: newUser.applicationDetails,
        }),
      });
    } catch (e) {
      // Backend call failed, but local registration succeeded
    }

    return { success: true, user: newUser };
  };

  // Backwards compatible signup method
  const signup = (userData: Omit<AuthUser, 'id' | 'avatar' | 'status'>) => {
    const norm = normalizePhone(userData.phone);
    const existing = users.find((u) => normalizePhone(u.phone) === norm);
    if (existing) {
      return { success: false, error: 'This phone number is already registered. Please log in instead.' };
    }

    const newUser: AuthUser = {
      ...userData,
      phone: norm,
      id: `usr-${Date.now()}`,
      avatar: MOCK_AVATARS[Math.floor(Math.random() * MOCK_AVATARS.length)],
      status: 'approved',
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const loginWithEmail = (email: string, password: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      if (user.status === 'rejected') return { error: 'Your application has been rejected.' };
      if (user.status === 'suspended') return { error: 'Your account is suspended.' };

      setCurrentUser(user);
      return { user };
    }
    return { error: 'Invalid email or password.' };
  };

  const loginWithGoogle = (targetRole: UserRole = 'customer') => {
    // If a default user exists for this role, log in as them, or create a demo user
    const existing = users.find((u) => u.role === targetRole);
    if (existing) {
      setCurrentUser(existing);
      return;
    }

    const googleUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: 'Google User',
      email: `googleuser_${Date.now()}@gmail.com`,
      phone: '9999900000',
      role: targetRole,
      status: 'approved',
      avatar: MOCK_AVATARS[0],
    };
    setUsers((prev) => [...prev, googleUser]);
    setCurrentUser(googleUser);
  };

  const updateUserStatus = (userId: string, newStatus: AuthUser['status']) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mealmitra_currentUser');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        findUserByPhone,
        checkPhoneRegistered,
        loginWithOTP,
        registerUser,
        signup,
        loginWithEmail,
        loginWithGoogle,
        updateUserStatus,
        logout,
      }}
    >
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
