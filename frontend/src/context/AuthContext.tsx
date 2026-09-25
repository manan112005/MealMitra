import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';
import { AuthService, AuthUserResponse } from '../services/auth.service';
import { api } from '../services/api';

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

export const getSavedAvatarForUser = (identifier?: string): string => {
  if (!identifier) return '';
  try {
    const clean = identifier.trim().toLowerCase();
    const key1 = 'mealmitra_avatar_' + clean;
    const fromKey1 = localStorage.getItem(key1);
    if (fromKey1) return fromKey1;

    const norm = normalizePhone(identifier);
    if (norm) {
      const fromNorm = localStorage.getItem('mealmitra_avatar_' + norm);
      if (fromNorm) return fromNorm;
    }

    // Check mealmitra_registered_users
    const savedUsersStr = localStorage.getItem('mealmitra_registered_users');
    if (savedUsersStr) {
      const list = JSON.parse(savedUsersStr) as AuthUser[];
      const found = list.find(
        (u) =>
          (u.email && u.email.toLowerCase() === clean) ||
          (u.id && u.id.toLowerCase() === clean) ||
          (norm && u.phone && normalizePhone(u.phone) === norm)
      );
      if (found && found.avatar) return found.avatar;
    }

    // Check mealmitra_currentUser
    const currentSaved = localStorage.getItem('mealmitra_currentUser');
    if (currentSaved) {
      const u = JSON.parse(currentSaved) as AuthUser;
      if (
        (u.email && u.email.toLowerCase() === clean) ||
        (u.id && u.id.toLowerCase() === clean) ||
        (norm && u.phone && normalizePhone(u.phone) === norm)
      ) {
        if (u.avatar) return u.avatar;
      }
    }
  } catch {}
  return '';
};

export const saveAvatarForUser = (identifier: string, avatar: string) => {
  if (!identifier || !avatar) return;
  try {
    const cleanId = identifier.trim().toLowerCase();
    localStorage.setItem('mealmitra_avatar_' + cleanId, avatar);
    const norm = normalizePhone(identifier);
    if (norm) {
      localStorage.setItem('mealmitra_avatar_' + norm, avatar);
    }

    // Also update any saved registered users in localStorage so it stays 100% in sync
    const savedUsersStr = localStorage.getItem('mealmitra_registered_users');
    if (savedUsersStr) {
      const list = JSON.parse(savedUsersStr) as AuthUser[];
      const updated = list.map((u) => {
        const matches =
          (u.email && u.email.toLowerCase() === cleanId) ||
          (u.id && u.id.toLowerCase() === cleanId) ||
          (norm && u.phone && normalizePhone(u.phone) === norm);
        return matches ? { ...u, avatar } : u;
      });
      localStorage.setItem('mealmitra_registered_users', JSON.stringify(updated));
    }

    // Also update saved currentUser if active
    const savedCurrent = localStorage.getItem('mealmitra_currentUser');
    if (savedCurrent) {
      const u = JSON.parse(savedCurrent) as AuthUser;
      const matches =
        (u.email && u.email.toLowerCase() === cleanId) ||
        (u.id && u.id.toLowerCase() === cleanId) ||
        (norm && u.phone && normalizePhone(u.phone) === norm);
      if (matches) {
        localStorage.setItem('mealmitra_currentUser', JSON.stringify({ ...u, avatar }));
      }
    }
  } catch (e) {
    console.error('Failed to save avatar to localStorage', e);
  }
};

export const getDeterministicAvatar = (name: string): string => {
  const initial = name ? name.trim().charAt(0).toUpperCase() : 'U';
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="100%" height="100%" fill="%23ffdcc5"/><text x="50%" y="54%" font-size="44" font-weight="bold" fill="%23944a00" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif">${initial}</text></svg>`;
};

export const getFreshSeedUsers = (): AuthUser[] => [
  {
    id: 'usr-manan-1',
    name: 'MANAN PATEL',
    email: 'patelmanan4057@gmail.com',
    phone: '9825123456',
    role: 'customer',
    status: 'approved',
    avatar: getSavedAvatarForUser('patelmanan4057@gmail.com') || getDeterministicAvatar('MANAN PATEL'),
    applicationDetails: {
      address: 'A-402, Shivalik Residency, Navrangpura',
      city: 'Ahmedabad',
      dietaryPreference: 'Vegetarian',
    },
  },
];

export const DEFAULT_SEED_USERS: AuthUser[] = getFreshSeedUsers();

// Helper to map backend role string to frontend portal role
function mapBackendRoleToFrontend(role: string): UserRole {
  switch (role?.toUpperCase()) {
    case 'CHEF':
      return 'cook';
    case 'DELIVERY':
      return 'delivery';
    case 'ADMIN':
      return 'admin';
    case 'CUSTOMER':
    default:
      return 'customer';
  }
}

// Helper to map backend user object to frontend AuthUser
function mapBackendUserToAuthUser(user: AuthUserResponse, existing?: AuthUser | null): AuthUser {
  let savedAvatar =
    getSavedAvatarForUser(user.email) ||
    getSavedAvatarForUser(user.id) ||
    (user.phone ? getSavedAvatarForUser(user.phone) : '') ||
    user.chefProfile?.profileImage ||
    user.customerProfile?.profileImage ||
    user.deliveryProfile?.profileImage;

  if (!savedAvatar && existing?.avatar) {
    savedAvatar = existing.avatar;
  }

  if (!savedAvatar) {
    try {
      const savedUsersStr = localStorage.getItem('mealmitra_registered_users');
      if (savedUsersStr) {
        const savedUsers = JSON.parse(savedUsersStr) as AuthUser[];
        const match = savedUsers.find(
          (u) =>
            u.id === user.id ||
            (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()) ||
            (u.phone && user.phone && normalizePhone(u.phone) === normalizePhone(user.phone))
        );
        if (match && match.avatar) {
          savedAvatar = match.avatar;
        }
      }
    } catch {}
  }

  if (!savedAvatar) {
    savedAvatar = getDeterministicAvatar(user.fullName || 'User');
  }

  return {
    id: user.id,
    name: user.fullName || existing?.name || 'User',
    email: user.email || existing?.email || '',
    phone: user.phone || existing?.phone || '',
    role: mapBackendRoleToFrontend(user.role),
    status: user.isActive ? 'approved' : 'suspended',
    avatar: savedAvatar,
    applicationDetails: {
      ...(existing?.applicationDetails || {}),
      ...(user.customerProfile || {}),
      ...(user.chefProfile || {}),
      ...(user.deliveryProfile || {}),
    },
  };
}



export interface GoogleAccountProfile {
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
}

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
  signup: (userData: Omit<AuthUser, 'id' | 'avatar' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, password: string) => Promise<{ user?: AuthUser; error?: string }>;
  loginWithGoogle: (account?: GoogleAccountProfile | UserRole) => Promise<{ success: boolean; user?: AuthUser }>;
  updateUserStatus: (userId: string, newStatus: AuthUser['status']) => void;
  updateUserProfile: (updated: Partial<AuthUser>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('mealmitra_currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<AuthUser[]>(() => {
    try {
      const savedUsers = localStorage.getItem('mealmitra_registered_users');
      const fakeEmails = [
        'ramesh.delivery@example.com',
        'jay.shah@example.com',
        'admin@mealmitra.com',
        'manan.work@gmail.com',
        'nirmala@mealmitra.com',
        'manan.personal@gmail.com',
        'hardik.delivery@gmail.com',
        'kiranben.rasoi@gmail.com',
      ];
      const fakeIds = ['usr-delivery-1', 'usr-cust-1', 'usr-admin-1', 'usr-cook-1', 'usr-manan-2', 'usr-app-hardik', 'usr-app-kiranben'];
      const fakeNames = ['Ramesh Patel', 'Jay Shah', 'Admin Manager', 'Nirmala Devi', 'MealMitra User', 'Manan (Personal)', 'Hardik Joshi', 'Kiranben Shah'];

      let parsed: AuthUser[] = [];
      if (savedUsers) {
        parsed = JSON.parse(savedUsers) as AuthUser[];
      }

      const filteredParsed = parsed.filter(
        (u) =>
          !fakeEmails.includes(u.email?.toLowerCase()) &&
          !fakeIds.includes(u.id) &&
          !fakeNames.includes(u.name)
      );

      // Start with seed users map, and override with saved users and persistent avatars
      const userMap = new Map<string, AuthUser>();
      
      DEFAULT_SEED_USERS.forEach((seed) => {
        const customAvatar = getSavedAvatarForUser(seed.email) || seed.avatar;
        userMap.set(seed.email.toLowerCase(), { ...seed, avatar: customAvatar });
      });

      filteredParsed.forEach((saved) => {
        const key = (saved.email || saved.id).toLowerCase();
        const existingSeed = userMap.get(key);
        const customAvatar = getSavedAvatarForUser(saved.email) || getSavedAvatarForUser(saved.id) || saved.avatar;
        userMap.set(key, {
          ...(existingSeed || {}),
          ...saved,
          avatar: customAvatar || saved.avatar,
        });
      });

      const combined = Array.from(userMap.values());
      localStorage.setItem('mealmitra_registered_users', JSON.stringify(combined));
      return combined;
    } catch (e) {
      console.error('Failed to load registered users from storage', e);
    }
    return DEFAULT_SEED_USERS;
  });



  // Save registered users list whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('mealmitra_registered_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save registered users to storage', e);
    }
  }, [users]);

  // Validate session against backend JWT on initial load
  useEffect(() => {
    const verifyBackendSession = async () => {
      const token = api.getAccessToken();
      if (!token) return;

      try {
        const res = await AuthService.getMe();
        if (res.success && res.data) {
          let currentSaved: AuthUser | null = currentUser;
          if (!currentSaved) {
            try {
              const savedStr = localStorage.getItem('mealmitra_currentUser');
              if (savedStr) currentSaved = JSON.parse(savedStr);
            } catch {}
          }
          const authUser = mapBackendUserToAuthUser(res.data, currentSaved);
          setCurrentUser(authUser);
          localStorage.setItem('mealmitra_currentUser', JSON.stringify(authUser));
        }
      } catch {
        // Backend offline or token difference - preserve local user session from localStorage
        console.warn('Backend getMe check skipped, preserving local session.');
      }
    };

    verifyBackendSession();
  }, []);


  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mealmitra_currentUser', JSON.stringify(currentUser));
      localStorage.setItem('mealmitra_role', currentUser.role);
    }
  }, [currentUser]);

  const findUserByPhone = (phone: string): AuthUser | undefined => {
    const norm = normalizePhone(phone);
    if (!norm) return undefined;
    return users.find((u) => normalizePhone(u.phone) === norm);
  };

  const checkPhoneRegistered = async (phone: string): Promise<{ exists: boolean; user?: AuthUser }> => {
    const norm = normalizePhone(phone);
    if (!norm) return { exists: false };

    // 1. Check local state (loaded from localStorage and seed accounts)
    const localUser = users.find((u) => normalizePhone(u.phone) === norm);
    if (localUser) {
      return { exists: true, user: localUser };
    }

    // 2. Query backend to check if phone exists in DB
    try {
      const res = await AuthService.checkPhone(norm);
      if (res.success && res.data?.exists && res.data?.user) {
        const authUser = mapBackendUserToAuthUser(res.data.user);
        setUsers((prev) => {
          if (!prev.some((u) => normalizePhone(u.phone) === norm)) {
            return [...prev, authUser];
          }
          return prev;
        });
        return { exists: true, user: authUser };
      }
    } catch {
      // Backend not reachable or error
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

    // Attempt backend login with phone and default/provided password if exists
    try {
      const res = await AuthService.login({ phone: norm, password: 'Password123!' });
      if (res.success && res.data?.user) {
        const authUser = mapBackendUserToAuthUser(res.data.user);
        const persistedAvatar =
          getSavedAvatarForUser(authUser.email) ||
          getSavedAvatarForUser(authUser.phone) ||
          getSavedAvatarForUser(authUser.id) ||
          authUser.avatar;
        const mergedAuthUser = { ...authUser, avatar: persistedAvatar };
        setCurrentUser(mergedAuthUser);
        localStorage.setItem('mealmitra_currentUser', JSON.stringify(mergedAuthUser));
        setUsers((prev) => {
          if (!prev.some((u) => normalizePhone(u.phone) === norm)) {
            return [...prev, mergedAuthUser];
          }
          return prev.map((u) => (normalizePhone(u.phone) === norm ? mergedAuthUser : u));
        });
        return { user: mergedAuthUser };
      }
    } catch {
      // Local fallback
    }

    let user = users.find((u) => normalizePhone(u.phone) === norm);
    if (!user) {
      try {
        const savedUsers = localStorage.getItem('mealmitra_registered_users');
        if (savedUsers) {
          const parsed = JSON.parse(savedUsers) as AuthUser[];
          user = parsed.find((u) => normalizePhone(u.phone) === norm);
        }
      } catch {}
    }

    if (!user) {
      return { error: 'No account found with this phone number. Please register first.' };
    }

    const persistedAvatar =
      getSavedAvatarForUser(user.email) ||
      getSavedAvatarForUser(user.phone) ||
      getSavedAvatarForUser(user.id) ||
      user.avatar;
    const mergedUser = { ...user, avatar: persistedAvatar };
    setCurrentUser(mergedUser);
    localStorage.setItem('mealmitra_currentUser', JSON.stringify(mergedUser));
    return { user: mergedUser };
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

    const backendRole =
      userData.role === 'cook' ? 'CHEF' : userData.role === 'delivery' ? 'DELIVERY' : 'CUSTOMER';

    const generatedEmail =
      userData.email?.trim() || `${userData.role}_${norm}_${Date.now()}@mealmitra.com`;
    const password = userData.password || 'Password123!';

    try {
      const res = await AuthService.register({
        fullName: userData.name.trim() || 'User',
        email: generatedEmail,
        phone: norm,
        password,
        role: backendRole,
        kitchenName: userData.applicationDetails?.kitchenName,
        cuisine: userData.applicationDetails?.foodCategory,
        vehicleType: userData.applicationDetails?.vehicleType,
        address: userData.applicationDetails?.kitchenAddress || userData.applicationDetails?.address,
        city: userData.applicationDetails?.city,
      });

      if (res.success && res.data?.user) {
        const authUser = mapBackendUserToAuthUser(res.data.user, {
          name: userData.name.trim() || 'User',
          avatar: getDeterministicAvatar(userData.name.trim() || 'User'),
        } as any);
        setCurrentUser(authUser);
        setUsers((prev) => {
          const filtered = prev.filter((u) => normalizePhone(u.phone) !== norm);
          return [...filtered, authUser];
        });
        return { success: true, user: authUser };
      }
    } catch (err: any) {
      // If user already exists in DB, attempt login or seamless sign-in
      if (err.message && err.message.toLowerCase().includes('already exists')) {
        try {
          const loginRes = await AuthService.login({ phone: norm, password });
          if (loginRes.success && loginRes.data?.user) {
            const authUser = mapBackendUserToAuthUser(loginRes.data.user);
            setCurrentUser(authUser);
            setUsers((prev) => [...prev, authUser]);
            return { success: true, user: authUser };
          }
        } catch {
          // If login fails, surface message
        }
        return { success: false, error: err.message };
      }
    }

    // Local fallback with persistent storage
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: userData.name.trim() || 'User',
      email: generatedEmail,
      phone: norm,
      role: userData.role,
      password,
      status: 'approved',
      avatar: getDeterministicAvatar(userData.name.trim() || 'User'),
      applicationDetails: userData.applicationDetails || {},
    };

    setUsers((prev) => {
      const filtered = prev.filter((u) => normalizePhone(u.phone) !== norm);
      return [...filtered, newUser];
    });
    setCurrentUser(newUser);
    localStorage.setItem('mealmitra_currentUser', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const signup = async (userData: Omit<AuthUser, 'id' | 'avatar' | 'status'>) => {
    return registerUser({
      phone: userData.phone,
      role: userData.role === 'admin' || userData.role === 'entry' ? 'customer' : userData.role,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      applicationDetails: userData.applicationDetails,
    });
  };

  const loginWithEmail = async (email: string, password: string): Promise<{ user?: AuthUser; error?: string }> => {
    try {
      const res = await AuthService.login({ email, password });
      if (res.success && res.data?.user) {
        const authUser = mapBackendUserToAuthUser(res.data.user);
        const persistedAvatar =
          getSavedAvatarForUser(authUser.email) ||
          getSavedAvatarForUser(authUser.phone) ||
          getSavedAvatarForUser(authUser.id) ||
          authUser.avatar;
        const mergedAuthUser = { ...authUser, avatar: persistedAvatar };
        setCurrentUser(mergedAuthUser);
        localStorage.setItem('mealmitra_currentUser', JSON.stringify(mergedAuthUser));
        return { user: mergedAuthUser };
      }
    } catch (err: any) {
      // Local fallback
    }

    // Local fallback for seed demo accounts
    const localUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || !u.password)
    );
    if (localUser) {
      const persistedAvatar =
        getSavedAvatarForUser(localUser.email) ||
        getSavedAvatarForUser(localUser.phone) ||
        getSavedAvatarForUser(localUser.id) ||
        localUser.avatar;
      const mergedLocal = { ...localUser, avatar: persistedAvatar };
      setCurrentUser(mergedLocal);
      localStorage.setItem('mealmitra_currentUser', JSON.stringify(mergedLocal));
      return { user: mergedLocal };
    }

    return { error: 'Invalid email or password.' };
  };

  const loginWithGoogle = async (
    account?: GoogleAccountProfile | UserRole
  ): Promise<{ success: boolean; user?: AuthUser }> => {
    let targetProfile: GoogleAccountProfile;

    if (typeof account === 'string') {
      const existing = users.find((u) => u.role === account);
      if (existing) {
        const persistedAvatar =
          getSavedAvatarForUser(existing.email) ||
          getSavedAvatarForUser(existing.id) ||
          existing.avatar;
        const merged = { ...existing, avatar: persistedAvatar };
        setCurrentUser(merged);
        localStorage.setItem('mealmitra_currentUser', JSON.stringify(merged));
        return { success: true, user: merged };
      }
      targetProfile = {
        name: account === 'admin' ? 'Admin Manager' : 'Google User',
        email: account === 'admin' ? 'admin@mealmitra.com' : `googleuser_${Date.now()}@gmail.com`,
        role: account as UserRole,
        avatar: MOCK_AVATARS[0],
      };
    } else if (account && typeof account === 'object') {
      targetProfile = account;
    } else {
      targetProfile = {
        name: 'Google User',
        email: `googleuser_${Date.now()}@gmail.com`,
        role: 'customer',
        avatar: MOCK_AVATARS[0],
      };
    }

    const emailLower = targetProfile.email.toLowerCase();

    // Check if account already exists in state or storage
    const existing = users.find(
      (u) => u.email.toLowerCase() === emailLower
    );

    const persistedAvatar =
      getSavedAvatarForUser(targetProfile.email) ||
      (existing ? getSavedAvatarForUser(existing.id) : '') ||
      (existing ? getSavedAvatarForUser(existing.phone) : '') ||
      (existing ? existing.avatar : '') ||
      targetProfile.avatar ||
      getDeterministicAvatar(targetProfile.name);

    if (existing) {
      const updatedExisting: AuthUser = {
        ...existing,
        avatar: persistedAvatar,
      };
      if (persistedAvatar && updatedExisting.email) {
        saveAvatarForUser(updatedExisting.email, persistedAvatar);
      }
      setCurrentUser(updatedExisting);
      localStorage.setItem('mealmitra_currentUser', JSON.stringify(updatedExisting));
      return { success: true, user: updatedExisting };
    }

    // Create a new user corresponding to the selected Google account
    const newUser: AuthUser = {
      id: `usr-g-${Date.now()}`,
      name: targetProfile.name,
      email: targetProfile.email,
      phone: '',
      role: targetProfile.role || 'customer',
      status: 'approved',
      avatar: persistedAvatar,
      applicationDetails: {},
    };

    if (newUser.avatar && newUser.email) {
      saveAvatarForUser(newUser.email, newUser.avatar);
    }

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem('mealmitra_currentUser', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const updateUserStatus = (userId: string, newStatus: AuthUser['status']) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const updateUserProfile = async (updated: Partial<AuthUser>) => {
    if (!currentUser) return;
    const mergedUser: AuthUser = {
      ...currentUser,
      ...updated,
      applicationDetails: {
        ...(currentUser.applicationDetails || {}),
        ...(updated.applicationDetails || {}),
      },
    };

    if (mergedUser.avatar) {
      if (mergedUser.email) saveAvatarForUser(mergedUser.email, mergedUser.avatar);
      if (mergedUser.id) saveAvatarForUser(mergedUser.id, mergedUser.avatar);
      if (mergedUser.phone) saveAvatarForUser(mergedUser.phone, mergedUser.avatar);
    }

    setCurrentUser(mergedUser);
    localStorage.setItem('mealmitra_currentUser', JSON.stringify(mergedUser));

    setUsers((prev) => {
      const updatedList = prev.map((u) =>
        u.id === mergedUser.id ||
        (mergedUser.email && u.email && u.email.toLowerCase() === mergedUser.email.toLowerCase()) ||
        (mergedUser.phone && u.phone && normalizePhone(u.phone) === normalizePhone(mergedUser.phone))
          ? mergedUser
          : u
      );
      if (!updatedList.some((u) => u.id === mergedUser.id)) {
        updatedList.push(mergedUser);
      }
      localStorage.setItem('mealmitra_registered_users', JSON.stringify(updatedList));
      return updatedList;
    });

    // Try backend sync if available
    try {
      await api.patch('/users/me', {
        fullName: mergedUser.name,
        phone: mergedUser.phone,
        avatar: mergedUser.avatar,
        ...mergedUser.applicationDetails,
      });
    } catch (e) {
      console.warn('Backend user profile update note:', e);
    }
  };



  const logout = async () => {
    try {
      await AuthService.logout();
    } catch {
      // Ignore network errors on logout
    }
    setCurrentUser(null);
    localStorage.removeItem('mealmitra_currentUser');
    localStorage.setItem('mealmitra_role', 'entry');
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
        updateUserProfile,
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
