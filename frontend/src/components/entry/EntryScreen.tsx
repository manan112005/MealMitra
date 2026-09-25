import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth, normalizePhone, getSavedAvatarForUser } from '../../context/AuthContext';
import { UserRole } from '../../types';

import {
  ChefHat,
  Bike,
  User,
  ArrowRight,
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  HeartHandshake,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  MapPin,
  UtensilsCrossed,
  X,
  Plus,
  Loader2,
} from 'lucide-react';

export const EntryScreen: React.FC = () => {
  const { setRole, setCustomerTab, setCookTab, setDeliveryTab, setAdminTab, addCook, setActiveCookId } = useApp();
  const {
    loginWithOTP,
    loginWithEmail,
    loginWithGoogle,
    registerUser,
    checkPhoneRegistered,
    users,
  } = useAuth();

  // Top Toggle: true = Login, false = Register
  const [isLogin, setIsLogin] = useState(true);

  // ---------------- LOGIN FLOW STATES ----------------
  const [loginMethod, setLoginMethod] = useState<'otp' | 'email'>('otp');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginOtp, setLoginOtp] = useState('');
  const [loginStep, setLoginStep] = useState<'phone' | 'otp'>('phone');
  const [loginError, setLoginError] = useState('');
  const [isUnregisteredError, setIsUnregisteredError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ---------------- GOOGLE ACCOUNT CHOOSER STATES ----------------
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<string | null>(null);
  const [showAddCustomGoogle, setShowAddCustomGoogle] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleError, setCustomGoogleError] = useState('');

  // ---------------- REGISTER FLOW STATES ----------------
  // Steps: 1 = Role, 2 = Phone, 3 = OTP, 4 = Details
  const [regStep, setRegStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<'customer' | 'cook' | 'delivery'>('customer');
  const [regPhone, setRegPhone] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [isPhoneAlreadyRegistered, setIsPhoneAlreadyRegistered] = useState(false);
  const [regError, setRegError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Registration Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Ahmedabad');
  const [kitchenName, setKitchenName] = useState('');
  const [foodCategory, setFoodCategory] = useState('Vegetarian Only');
  const [vehicleType, setVehicleType] = useState('Motorcycle');
  const [dietaryPref, setDietaryPref] = useState('Vegetarian');
  const [fssaiLicense, setFssaiLicense] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');

  // Clear errors on tab or step change
  useEffect(() => {
    setLoginError('');
    setIsUnregisteredError(false);
    setRegError('');
    setIsPhoneAlreadyRegistered(false);
  }, [isLogin, loginStep, regStep]);

  const navigateToRole = (userRole: UserRole) => {
    if (userRole === 'customer') {
      setCustomerTab('dashboard');
    } else if (userRole === 'cook') {
      setCookTab('dashboard');
    } else if (userRole === 'delivery') {
      setDeliveryTab('dashboard');
    } else if (userRole === 'admin') {
      setAdminTab('dashboard');
    }
    setRole(userRole);
  };

  // ---------------- LOGIN HANDLERS ----------------
  const handleSendLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsUnregisteredError(false);

    const norm = normalizePhone(loginPhone);
    if (!norm || norm.length < 10) {
      setLoginError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const { exists } = await checkPhoneRegistered(norm);
      if (!exists) {
        setIsUnregisteredError(true);
        setLoginError('No account found with this phone number. Please register first.');
        setIsLoggingIn(false);
        return;
      }

      // Phone is registered, advance to OTP step
      setLoginStep('otp');
      setLoginOtp('');
    } catch (err) {
      setLoginError('Unable to verify phone number. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginOtp || loginOtp.length < 4) {
      setLoginError('Please enter the 4-digit OTP (demo: 1234).');
      return;
    }

    setIsLoggingIn(true);
    try {
      const { user, error } = await loginWithOTP(loginPhone, loginOtp);
      if (user) {
        // Automatically route to stored user role dashboard
        navigateToRole(user.role);
      } else {
        setLoginError(error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    const { user, error } = loginWithEmail(loginEmail, loginPassword);
    if (user) {
      navigateToRole(user.role);
    } else {
      setLoginError(error || 'Invalid credentials.');
    }
  };

  // Switch to Register flow with phone pre-filled
  const handleSwitchToRegisterFromLogin = () => {
    setRegPhone(loginPhone);
    setIsLogin(false);
    setRegStep(1);
    setLoginError('');
    setIsUnregisteredError(false);
  };

  // Switch to Login flow with phone pre-filled
  const handleSwitchToLoginFromRegister = () => {
    setLoginPhone(regPhone);
    setIsLogin(true);
    setLoginStep('phone');
    setRegError('');
    setIsPhoneAlreadyRegistered(false);
  };

  // Quick filler for demo testing
  const handleQuickFillLogin = (phoneNum: string) => {
    setLoginPhone(phoneNum);
    setLoginStep('phone');
    setLoginError('');
    setIsUnregisteredError(false);
  };

  // ---------------- REGISTER HANDLERS ----------------
  // Step 1 -> Step 2
  const handleRoleSelected = () => {
    setRegStep(2);
  };

  // Step 2: Validate phone and send OTP
  const handleSendRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setIsPhoneAlreadyRegistered(false);

    const norm = normalizePhone(regPhone);
    if (!norm || norm.length < 10) {
      setRegError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsRegistering(true);
    try {
      const { exists } = await checkPhoneRegistered(norm);
      if (exists) {
        setIsPhoneAlreadyRegistered(true);
        setRegError('This phone number is already registered. Please log in instead.');
        setIsRegistering(false);
        return;
      }

      // Phone is available! Advance to Step 3 (Verify OTP)
      setRegStep(3);
      setRegOtp('');
    } catch (err) {
      setRegError('Failed to verify phone. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Step 3: Verify OTP
  const handleVerifyRegisterOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regOtp || regOtp.length < 4) {
      setRegError('Please enter a valid 4-digit verification code.');
      return;
    }

    // OTP verified, advance to Step 4 (Complete Details)
    setRegStep(4);
  };

  // Step 4: Submit role-specific registration
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!name.trim()) {
      setRegError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setRegError('Please enter a valid email address.');
      return;
    }
    if (!address.trim()) {
      setRegError(
        selectedRole === 'cook'
          ? 'Please enter your kitchen address.'
          : selectedRole === 'delivery'
          ? 'Please enter your residential address.'
          : 'Please enter your delivery address.'
      );
      return;
    }
    if (!city.trim()) {
      setRegError('Please enter your city.');
      return;
    }
    if (selectedRole === 'cook' && !kitchenName.trim()) {
      setRegError('Please enter your kitchen or business name.');
      return;
    }

    setIsRegistering(true);
    try {
      const applicationDetails: any = {
        address: address.trim(),
        city: city.trim(),
      };

      if (selectedRole === 'customer') {
        applicationDetails.dietaryPreference = dietaryPref;
      } else if (selectedRole === 'cook') {
        applicationDetails.kitchenName = kitchenName.trim();
        applicationDetails.kitchenAddress = address.trim();
        applicationDetails.foodCategory = foodCategory;
        if (fssaiLicense) applicationDetails.fssaiLicense = fssaiLicense.trim();
      } else if (selectedRole === 'delivery') {
        applicationDetails.residentialAddress = address.trim();
        applicationDetails.vehicleType = vehicleType;
        if (drivingLicense) applicationDetails.drivingLicense = drivingLicense.trim();
      }

      const { success, user, error } = await registerUser({
        phone: regPhone,
        role: selectedRole,
        name: name.trim(),
        email: email.trim(),
        applicationDetails,
      });

      if (success && user) {
        if (selectedRole === 'cook') {
          const cuisineCategory = foodCategory || 'Vegetarian Only';
          const cuisines = cuisineCategory.includes('Non')
            ? ['Non-Vegetarian', 'Homemade']
            : ['Gujarati', 'North Indian', 'Vegetarian'];
          const kitchenLoc = address.trim() ? `${address.trim()}, ${city.trim()}` : city.trim();

          const createdCook = addCook({
            name: kitchenName.trim() || name.trim(),
            chefName: name.trim(),
            cuisine: cuisines,
            location: kitchenLoc,
            phone: regPhone,
            bio: `Fresh, hygienic and authentic homemade meals cooked daily with care by ${name.trim()}. Pure home spices and wholesome recipes.`,
            specialties: ['Special Daily Thali', 'Phulka Roti', 'Dal Tadka', 'Jeera Rice'],
            experienceYears: 5,
            lunchAvailableQty: 25,
            lunchTotalQty: 25,
            dinnerAvailableQty: 20,
            dinnerTotalQty: 20,
            rating: 5.0,
            reviewsCount: 1,
            mealsDelivered: 0,
            kitchenOpen: true,
          });
          setActiveCookId(createdCook.id);
        }

        // Redirect directly to the correct role dashboard
        navigateToRole(user.role);
      } else {
        setRegError(error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setRegError('Registration encountered an error. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Build dynamic Google accounts list from registered users + defaults
  const googleAccountsList = React.useMemo(() => {
    const list: Array<{ name: string; email: string; avatar?: string; initialColor?: string; role?: UserRole }> = [];
    const seenEmails = new Set<string>();
    const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600', 'bg-rose-600', 'bg-indigo-600'];

    const fakeEmails = [
      'ramesh.delivery@example.com',
      'jay.shah@example.com',
      'admin@mealmitra.com',
      'manan.work@gmail.com',
      'nirmala@mealmitra.com',
    ];

    // 1. Add all registered users from database / storage
    (users || []).forEach((u, idx) => {
      const emailLower = u.email?.trim().toLowerCase();
      if (emailLower && !fakeEmails.includes(emailLower) && !seenEmails.has(emailLower)) {
        seenEmails.add(emailLower);
        const persistentAvatar = getSavedAvatarForUser(u.email) || getSavedAvatarForUser(u.id) || u.avatar || '';
        list.push({
          name: u.name || 'Registered User',
          email: u.email,
          avatar: persistentAvatar,
          initialColor: colors[idx % colors.length],
          role: u.role,
        });
      }
    });

    // 2. Also check if there's any active / recent registered user from localStorage
    try {
      const savedUsers = localStorage.getItem('mealmitra_registered_users');
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers) as any[];
        parsed.forEach((u, idx) => {
          const emailLower = u.email?.trim().toLowerCase();
          if (emailLower && !fakeEmails.includes(emailLower) && !seenEmails.has(emailLower)) {
            seenEmails.add(emailLower);
            const persistentAvatar = getSavedAvatarForUser(u.email) || getSavedAvatarForUser(u.id) || u.avatar || '';
            list.push({
              name: u.name || 'User',
              email: u.email,
              avatar: persistentAvatar,
              initialColor: colors[(idx + 2) % colors.length],
              role: u.role,
            });
          }
        });
      }
    } catch {}

    // 3. Defaults - Primary user
    const defaults = [
      {
        name: 'MANAN PATEL',
        email: 'patelmanan4057@gmail.com',
        avatar: getSavedAvatarForUser('patelmanan4057@gmail.com') || '',
        initialColor: 'bg-blue-600',
        role: 'customer' as UserRole,
      },
    ];

    defaults.forEach((def) => {
      const defEmailLower = def.email.toLowerCase();
      if (!seenEmails.has(defEmailLower) && defEmailLower !== 'manan.personal@gmail.com') {
        seenEmails.add(defEmailLower);
        list.push(def);
      }
    });

    return list;
  }, [users, showGoogleModal]);

  const handleSelectGoogleAccount = async (account: { name: string; email: string; avatar?: string; role?: UserRole }) => {
    setSelectedGoogleAccount(account.email);
    setIsSigningInGoogle(true);
    try {
      const freshAvatar = getSavedAvatarForUser(account.email) || account.avatar;
      const res = await loginWithGoogle({
        name: account.name,
        email: account.email,
        avatar: freshAvatar,
        role: account.role || 'customer',
      });
      if (res.success && res.user) {
        setShowGoogleModal(false);
        navigateToRole(res.user.role);
      }
    } finally {
      setIsSigningInGoogle(false);
      setSelectedGoogleAccount(null);
    }
  };


  const handleAddCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomGoogleError('');
    if (!customGoogleName.trim()) {
      setCustomGoogleError('Please enter your full name.');
      return;
    }
    if (!customGoogleEmail.trim() || !customGoogleEmail.includes('@')) {
      setCustomGoogleError('Please enter a valid Google email address.');
      return;
    }

    await handleSelectGoogleAccount({
      name: customGoogleName.trim(),
      email: customGoogleEmail.trim().toLowerCase(),
    });
  };

  const handleAdminAccess = () => {
    loginWithGoogle('admin');
    navigateToRole('admin');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#faf9f8] flex flex-col justify-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffdcc5]/20 via-[#faf9f8] to-[#d1e6c9]/20 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&auto=format&fit=crop&q=80')`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Hero Brand Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffdcc5]/60 border border-[#944a00]/20 text-[#944a00] text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#944a00] animate-pulse"></span>
              Join The Ecosystem
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1c1c] tracking-tight leading-[1.15]">
              Deliver <span className="text-[#944a00]">happiness</span> to your neighborhood.
            </h1>

            <p className="text-base sm:text-lg text-[#564337] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              MealMitra connects hungry customers with verified local home cooks and smart cluster delivery partners. Join us to start earning.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#dcc1b1]/50">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-9 h-9 rounded-lg bg-white border border-[#dcc1b1]/40 flex items-center justify-center text-[#51634c] shrink-0 shadow-2xs">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#1a1c1c]">Cook Direct</div>
                  <div className="text-[11px] text-[#564337]">Empowering home chefs</div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-9 h-9 rounded-lg bg-white border border-[#dcc1b1]/40 flex items-center justify-center text-[#4e6074] shrink-0 shadow-2xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#1a1c1c]">Smart Clusters</div>
                  <div className="text-[11px] text-[#564337]">Optimized routes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Unified Authentication Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-[24px] border border-[#dcc1b1]/60 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-6 sm:p-8 relative overflow-visible">
              <div className="relative z-10">
                {/* Clean Top Switch: Login | Register */}
                <div className="flex p-1 bg-[#faf9f8] rounded-full border border-[#eeeeed] mb-6 relative shadow-inner">
                  <div
                    className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-full shadow-xs border border-[#eeeeed] transition-transform duration-300 ease-in-out ${
                      !isLogin ? 'translate-x-[calc(100%+4px)]' : 'translate-x-1'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setLoginStep('phone');
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-full relative z-10 transition-colors ${
                      isLogin ? 'text-[#1a1c1c]' : 'text-[#564337]'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setRegStep(1);
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-full relative z-10 transition-colors ${
                      !isLogin ? 'text-[#1a1c1c]' : 'text-[#564337]'
                    }`}
                  >
                    Register
                  </button>
                </div>

                {isLogin ? (
                  // ==============================================================
                  // ======================== LOGIN FLOW ==========================
                  // ==============================================================
                  <div>
                    <div className="text-center mb-6">
                      <h2 className="text-[22px] font-extrabold text-[#1a1c1c] mb-1">
                        Welcome Back
                      </h2>
                      <p className="text-[11px] text-[#564337]">
                        Sign in to access your MealMitra dashboard
                      </p>
                    </div>

                    {/* Unregistered Phone Alert with 1-Click Register Action */}
                    {isUnregisteredError ? (
                      <div className="p-3 mb-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
                        <div className="flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-bold text-amber-900 leading-tight">
                              Account Not Found
                            </p>
                            <p className="text-[11px] text-amber-700 mt-0.5">
                              No account found with this phone number. Please register first.
                            </p>
                            <button
                              type="button"
                              onClick={handleSwitchToRegisterFromLogin}
                              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
                            >
                              <span>Register as New User</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      loginError && (
                        <div className="p-2.5 mb-4 bg-red-50 text-red-600 text-[11px] font-semibold rounded-lg border border-red-100 text-center">
                          {loginError}
                        </div>
                      )
                    )}

                    {loginMethod === 'otp' ? (
                      loginStep === 'phone' ? (
                        // Login Step 1: Phone input
                        <form onSubmit={handleSendLoginOtp} className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#564337] mb-1.5">
                              Registered Phone Number
                            </label>
                            <div className="relative">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#1a1c1c] whitespace-nowrap">
                                IN +91
                              </div>
                              <input
                                type="tel"
                                maxLength={10}
                                value={loginPhone}
                                onChange={(e) => {
                                  setLoginPhone(e.target.value.replace(/\D/g, ''));
                                  setLoginError('');
                                  setIsUnregisteredError(false);
                                }}
                                className="w-full pl-[72px] pr-4 py-3.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] transition-all font-medium shadow-2xs"
                                placeholder="Phone Number"
                                autoFocus
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-3.5 bg-[#1a1c1c] hover:bg-[#333] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group mt-4 cursor-pointer disabled:opacity-70"
                          >
                            <span>{isLoggingIn ? 'Checking Account...' : 'Send OTP'}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </form>
                      ) : (
                        // Login Step 2: OTP Verification
                        <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                          <div className="p-3 bg-[#faf9f8] rounded-xl border border-[#eeeeed] text-center">
                            <p className="text-xs text-[#564337]">
                              Enter OTP sent to <span className="font-bold text-[#1a1c1c]">+91 {loginPhone}</span>
                            </p>
                            <p className="text-[10px] text-[#51634c] font-semibold mt-0.5">
                              💡 Demo Mode: Enter 1234 or any 4 digits
                            </p>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#564337] mb-1.5 text-center">
                              Enter 4-Digit OTP
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                maxLength={6}
                                value={loginOtp}
                                onChange={(e) => setLoginOtp(e.target.value)}
                                className="w-full px-4 py-3.5 border border-[#eeeeed] bg-white rounded-xl text-center text-xl font-bold tracking-[0.4em] focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                                placeholder="••••"
                                autoFocus
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-3.5 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70"
                          >
                            <span>{isLoggingIn ? 'Verifying...' : 'Verify OTP & Login'}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setLoginStep('phone');
                              setLoginOtp('');
                              setLoginError('');
                            }}
                            className="w-full text-xs text-[#564337] hover:text-[#1a1c1c] font-medium py-1 text-center"
                          >
                            ← Change Phone Number
                          </button>
                        </form>
                      )
                    ) : (
                      // Email Login
                      <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full px-4 py-3.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] transition-all font-medium shadow-2xs"
                          placeholder="Email Address"
                        />
                        <div className="relative">
                          <input
                            type={showLoginPassword ? 'text' : 'password'}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full pl-4 pr-11 py-3.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] transition-all font-medium shadow-2xs"
                            placeholder="Password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#564337]/60 hover:text-[#1a1c1c] transition-colors cursor-pointer rounded-lg hover:bg-gray-100"
                            title={showLoginPassword ? 'Hide password' : 'Show password'}
                          >
                            {showLoginPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3.5 bg-[#1a1c1c] hover:bg-[#333] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                        >
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </form>
                    )}

                    <div className="flex items-center gap-3 my-5">
                      <div className="flex-1 h-px bg-[#eeeeed]"></div>
                      <span className="text-[9px] uppercase font-bold text-[#564337]/60">OR</span>
                      <div className="flex-1 h-px bg-[#eeeeed]"></div>
                    </div>

                    <div className="space-y-2.5">
                      {loginMethod === 'otp' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setLoginMethod('email');
                            setLoginError('');
                            setIsUnregisteredError(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-[#eeeeed] hover:bg-[#faf9f8] hover:border-[#dcc1b1] rounded-xl text-[11px] font-bold text-[#564337] transition-all shadow-2xs cursor-pointer"
                        >
                          <Mail className="w-4 h-4 text-red-500" />
                          <span>Continue with Email</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setLoginMethod('otp');
                            setLoginError('');
                            setIsUnregisteredError(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-[#eeeeed] hover:bg-[#faf9f8] hover:border-[#dcc1b1] rounded-xl text-[11px] font-bold text-[#564337] transition-all shadow-2xs cursor-pointer"
                        >
                          <Phone className="w-4 h-4 text-[#944a00]" />
                          <span>Continue with Phone OTP</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setCustomGoogleError('');
                          setShowAddCustomGoogle(false);
                          setShowGoogleModal(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-[#eeeeed] hover:bg-[#faf9f8] hover:border-[#dcc1b1] rounded-xl text-[11px] font-bold text-[#564337] transition-all shadow-2xs cursor-pointer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span>Sign In with Google</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // ==============================================================
                  // ======================= REGISTER FLOW ========================
                  // ==============================================================
                  <div>
                    <div className="text-center mb-5">
                      <h2 className="text-[22px] font-extrabold text-[#1a1c1c] mb-1">
                        New Registration
                      </h2>
                      <p className="text-[11px] text-[#564337]">
                        Step {regStep} of 4:{' '}
                        <span className="font-bold text-[#1a1c1c]">
                          {regStep === 1
                            ? 'Select Role'
                            : regStep === 2
                            ? 'Enter Phone Number'
                            : regStep === 3
                            ? 'Verify OTP'
                            : 'Complete Details'}
                        </span>
                      </p>
                    </div>

                    {/* Progress Indicator Dots */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                      {[1, 2, 3, 4].map((stepNum) => (
                        <div
                          key={stepNum}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            regStep === stepNum
                              ? 'w-8 bg-[#944a00]'
                              : regStep > stepNum
                              ? 'w-4 bg-[#51634c]'
                              : 'w-4 bg-[#eeeeed]'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Already Registered Alert with Direct Switch to Login */}
                    {isPhoneAlreadyRegistered ? (
                      <div className="p-3 mb-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
                        <div className="flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-bold text-amber-900 leading-tight">
                              Phone Number Already Registered
                            </p>
                            <p className="text-[11px] text-amber-700 mt-0.5">
                              This phone number is already registered. Please log in instead.
                            </p>
                            <button
                              type="button"
                              onClick={handleSwitchToLoginFromRegister}
                              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1c1c] hover:bg-[#333] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
                            >
                              <span>Log in with this number</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      regError && (
                        <div className="p-2.5 mb-4 bg-red-50 text-red-600 text-[11px] font-semibold rounded-lg border border-red-100 text-center">
                          {regError}
                        </div>
                      )
                    )}

                    {/* STEP 1: SELECT ROLE */}
                    {regStep === 1 && (
                      <div className="space-y-3">
                        <p className="text-xs text-[#564337] text-center mb-1">
                          Select the account type you want to create:
                        </p>

                        {/* Customer Role Option */}
                        <button
                          type="button"
                          onClick={() => setSelectedRole('customer')}
                          className={`w-full flex items-center p-3.5 rounded-2xl border-[1.5px] transition-all cursor-pointer text-left ${
                            selectedRole === 'customer'
                              ? 'bg-[#ffdcc5]/30 border-[#944a00] shadow-sm'
                              : 'bg-white border-[#eeeeed] hover:border-[#ffdcc5]'
                          }`}
                        >
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                              selectedRole === 'customer'
                                ? 'bg-[#944a00] text-white'
                                : 'bg-[#faf9f8] text-[#944a00]'
                            }`}
                          >
                            <User className="w-5 h-5" />
                          </div>
                          <div className="ml-3.5 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-[#1a1c1c] text-sm">Customer</h3>
                              {selectedRole === 'customer' && (
                                <span className="w-4 h-4 rounded-full bg-[#944a00] text-white flex items-center justify-center text-[10px]">
                                  ✓
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#564337] mt-0.5">
                              Order homemade meals from verified local home chefs
                            </p>
                          </div>
                        </button>

                        {/* Home Cook Role Option */}
                        <button
                          type="button"
                          onClick={() => setSelectedRole('cook')}
                          className={`w-full flex items-center p-3.5 rounded-2xl border-[1.5px] transition-all cursor-pointer text-left ${
                            selectedRole === 'cook'
                              ? 'bg-[#d1e6c9]/30 border-[#51634c] shadow-sm'
                              : 'bg-white border-[#eeeeed] hover:border-[#d1e6c9]'
                          }`}
                        >
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                              selectedRole === 'cook'
                                ? 'bg-[#51634c] text-white'
                                : 'bg-[#faf9f8] text-[#51634c]'
                            }`}
                          >
                            <ChefHat className="w-5 h-5" />
                          </div>
                          <div className="ml-3.5 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-[#1a1c1c] text-sm">Home Cook</h3>
                              {selectedRole === 'cook' && (
                                <span className="w-4 h-4 rounded-full bg-[#51634c] text-white flex items-center justify-center text-[10px]">
                                  ✓
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#564337] mt-0.5">
                              Sell homemade meals, publish weekly menus, and earn
                            </p>
                          </div>
                        </button>

                        {/* Delivery Partner Role Option */}
                        <button
                          type="button"
                          onClick={() => setSelectedRole('delivery')}
                          className={`w-full flex items-center p-3.5 rounded-2xl border-[1.5px] transition-all cursor-pointer text-left ${
                            selectedRole === 'delivery'
                              ? 'bg-[#d1e4fc]/30 border-[#4e6074] shadow-sm'
                              : 'bg-white border-[#eeeeed] hover:border-[#d1e4fc]'
                          }`}
                        >
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                              selectedRole === 'delivery'
                                ? 'bg-[#4e6074] text-white'
                                : 'bg-[#faf9f8] text-[#4e6074]'
                            }`}
                          >
                            <Bike className="w-5 h-5" />
                          </div>
                          <div className="ml-3.5 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-[#1a1c1c] text-sm">Delivery Partner</h3>
                              {selectedRole === 'delivery' && (
                                <span className="w-4 h-4 rounded-full bg-[#4e6074] text-white flex items-center justify-center text-[10px]">
                                  ✓
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#564337] mt-0.5">
                              Deliver clustered tiffins along efficient local routes
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={handleRoleSelected}
                          className="w-full py-3.5 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group mt-5 cursor-pointer"
                        >
                          <span>Continue as {selectedRole === 'cook' ? 'Home Cook' : selectedRole === 'delivery' ? 'Delivery Partner' : 'Customer'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    )}

                    {/* STEP 2: ENTER PHONE NUMBER */}
                    {regStep === 2 && (
                      <form onSubmit={handleSendRegisterOtp} className="space-y-4">
                        <div className="text-center mb-2">
                          <p className="text-xs text-[#564337]">
                            Enter your phone number for OTP verification.
                          </p>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#564337] mb-1.5">
                            Mobile Phone Number
                          </label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#1a1c1c] whitespace-nowrap">
                              IN +91
                            </div>
                            <input
                              type="tel"
                              maxLength={10}
                              value={regPhone}
                              onChange={(e) => {
                                setRegPhone(e.target.value.replace(/\D/g, ''));
                                setRegError('');
                                setIsPhoneAlreadyRegistered(false);
                              }}
                              className="w-full pl-[72px] pr-4 py-3.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] transition-all font-medium shadow-2xs"
                              placeholder="10-digit mobile number"
                              autoFocus
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isRegistering}
                          className="w-full py-3.5 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group mt-4 cursor-pointer disabled:opacity-70"
                        >
                          <span>{isRegistering ? 'Checking Phone...' : 'Send OTP'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setRegStep(1)}
                          className="w-full text-xs text-[#564337] hover:text-[#1a1c1c] font-medium py-1 text-center"
                        >
                          ← Change Role
                        </button>
                      </form>
                    )}

                    {/* STEP 3: VERIFY OTP */}
                    {regStep === 3 && (
                      <form onSubmit={handleVerifyRegisterOtp} className="space-y-4">
                        <div className="p-3 bg-[#faf9f8] rounded-xl border border-[#eeeeed] text-center">
                          <p className="text-xs text-[#564337]">
                            Enter verification code sent to{' '}
                            <span className="font-bold text-[#1a1c1c]">+91 {regPhone}</span>
                          </p>
                          <p className="text-[10px] text-[#51634c] font-semibold mt-0.5">
                            💡 Demo Mode: Enter 1234 or any 4 digits
                          </p>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#564337] mb-1.5 text-center">
                            Verification Code (OTP)
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={regOtp}
                            onChange={(e) => setRegOtp(e.target.value)}
                            className="w-full px-4 py-3.5 border border-[#eeeeed] bg-white rounded-xl text-center text-xl font-bold tracking-[0.4em] focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                            placeholder="••••"
                            autoFocus
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group mt-4 cursor-pointer"
                        >
                          <span>Verify & Proceed to Details</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRegStep(2);
                            setRegOtp('');
                          }}
                          className="w-full text-xs text-[#564337] hover:text-[#1a1c1c] font-medium py-1 text-center"
                        >
                          ← Change Phone Number
                        </button>
                      </form>
                    )}

                    {/* STEP 4: ROLE-SPECIFIC REGISTRATION DETAILS */}
                    {regStep === 4 && (
                      <form onSubmit={handleCompleteRegistration} className="space-y-3.5">
                        <div className="flex items-center justify-between p-2.5 bg-[#faf9f8] rounded-xl border border-[#eeeeed] mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#564337]">Role:</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                selectedRole === 'cook'
                                  ? 'bg-[#d1e6c9] text-[#51634c]'
                                  : selectedRole === 'delivery'
                                  ? 'bg-[#d1e4fc] text-[#4e6074]'
                                  : 'bg-[#ffdcc5] text-[#944a00]'
                              }`}
                            >
                              {selectedRole === 'cook'
                                ? 'Home Cook'
                                : selectedRole === 'delivery'
                                ? 'Delivery Partner'
                                : 'Customer'}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-[#1a1c1c]">+91 {regPhone}</span>
                        </div>

                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                          {/* Common Details */}
                          <div>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full px-4 py-2.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                              placeholder="Full Name *"
                              required
                            />
                          </div>

                          <div>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-4 py-2.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                              placeholder="Email Address *"
                              required
                            />
                          </div>

                          {/* Role Specific Details */}
                          {selectedRole === 'cook' && (
                            <>
                              <div>
                                <input
                                  type="text"
                                  value={kitchenName}
                                  onChange={(e) => setKitchenName(e.target.value)}
                                  className="w-full px-4 py-2.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                                  placeholder="Kitchen / Brand Name (e.g. Annapurna Kitchen) *"
                                  required
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)}
                                  className="w-full px-4 py-2.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                                  placeholder="Kitchen Address (Apartment, Street) *"
                                  required
                                />
                              </div>
                              <div>
                                <select
                                  value={foodCategory}
                                  onChange={(e) => setFoodCategory(e.target.value)}
                                  className="w-full px-4 py-2.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                                >
                                  <option value="Vegetarian Only">Food Type: Vegetarian Only</option>
                                  <option value="Non-Vegetarian Only">Food Type: Non-Vegetarian Only</option>
                                  <option value="Both">Food Type: Both Veg & Non-Veg</option>
                                </select>
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={fssaiLicense}
                                  onChange={(e) => setFssaiLicense(e.target.value)}
                                  className="w-full px-4 py-2.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                                  placeholder="FSSAI License / Registration No. (Optional)"
                                />
                              </div>
                            </>
                          )}

                          {selectedRole === 'delivery' && (
                            <>
                              <div>
                                <input
                                  type="text"
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)}
                                  className="w-full px-4 py-2.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                                  placeholder="Residential Address *"
                                  required
                                />
                              </div>
                              <div>
                                <select
                                  value={vehicleType}
                                  onChange={(e) => setVehicleType(e.target.value)}
                                  className="w-full px-4 py-2.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                                >
                                  <option value="Motorcycle">Vehicle: Motorcycle</option>
                                  <option value="Scooter">Vehicle: Scooter</option>
                                  <option value="Electric Vehicle">Vehicle: Electric Vehicle</option>
                                  <option value="Bicycle">Vehicle: Bicycle</option>
                                </select>
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={drivingLicense}
                                  onChange={(e) => setDrivingLicense(e.target.value)}
                                  className="w-full px-4 py-2.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                                  placeholder="Driving License Number (Optional)"
                                />
                              </div>
                            </>
                          )}

                          {selectedRole === 'customer' && (
                            <>
                              <div>
                                <input
                                  type="text"
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)}
                                  className="w-full px-4 py-2.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                                  placeholder="Delivery Address (Flat, Society, Street) *"
                                  required
                                />
                              </div>
                              <div>
                                <select
                                  value={dietaryPref}
                                  onChange={(e) => setDietaryPref(e.target.value)}
                                  className="w-full px-4 py-2.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                                >
                                  <option value="Vegetarian">Diet: Vegetarian</option>
                                  <option value="Jain">Diet: Pure Jain</option>
                                  <option value="Non-Vegetarian">Diet: Non-Vegetarian</option>
                                  <option value="All">Diet: All Foods</option>
                                </select>
                              </div>
                            </>
                          )}

                          <div>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full px-4 py-2.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] shadow-2xs"
                              placeholder="City *"
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isRegistering}
                          className="w-full py-3.5 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group mt-3 cursor-pointer disabled:opacity-70"
                        >
                          <span>{isRegistering ? 'Creating Account...' : 'Complete & Open Dashboard'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setRegStep(3)}
                          className="w-full text-xs text-[#564337] hover:text-[#1a1c1c] font-medium py-1 text-center"
                        >
                          ← Back to OTP
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Admin Portal Link */}
                <div className="absolute -bottom-[58px] left-0 right-0 text-center">
                  <button
                    type="button"
                    onClick={handleAdminAccess}
                    className="inline-flex items-center gap-1.5 text-[10px] text-[#564337]/70 hover:text-[#1a1c1c] transition-colors uppercase font-bold tracking-widest cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Access Admin Portal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Account Selector Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-7 border-b border-gray-100 relative">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="absolute right-5 top-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Google Accounts
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900">Sign in with Google</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Choose an account to continue to <span className="font-semibold text-gray-800">MealMitra</span>
              </p>
            </div>

            {/* Account List */}
            <div className="p-4 sm:p-6 space-y-2 max-h-[360px] overflow-y-auto">
              {googleAccountsList.map((acc) => {
                const isCurrentSigning = isSigningInGoogle && selectedGoogleAccount === acc.email;
                const dynamicAvatar = getSavedAvatarForUser(acc.email) || acc.avatar;
                return (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={isSigningInGoogle}
                    onClick={() => handleSelectGoogleAccount(acc)}
                    className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-left group cursor-pointer disabled:opacity-60"
                  >

                    {dynamicAvatar ? (
                      <img
                        src={dynamicAvatar}
                        alt={acc.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-2xs group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full ${acc.initialColor} text-white font-bold text-sm flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}
                      >
                        {acc.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {acc.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{acc.email}</div>
                    </div>

                    {isCurrentSigning ? (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    )}
                  </button>
                );
              })}

              {/* Use Another Account Accordion */}
              <div className="pt-2 border-t border-gray-100">
                {!showAddCustomGoogle ? (
                  <button
                    type="button"
                    disabled={isSigningInGoogle}
                    onClick={() => setShowAddCustomGoogle(true)}
                    className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-gray-50 border border-dashed border-gray-200 transition-all text-left group cursor-pointer text-gray-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800">Use another account</div>
                      <div className="text-[11px] text-gray-400">Sign in with any other Google ID</div>
                    </div>
                  </button>
                ) : (
                  <form
                    onSubmit={handleAddCustomGoogleSubmit}
                    className="p-3 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-2.5 animate-in fade-in"
                  >
                    <div className="text-xs font-bold text-gray-800 flex items-center justify-between">
                      <span>Add Google Account</span>
                      <button
                        type="button"
                        onClick={() => setShowAddCustomGoogle(false)}
                        className="text-[11px] text-gray-400 hover:text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>

                    {customGoogleError && (
                      <div className="text-[11px] text-red-600 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                        {customGoogleError}
                      </div>
                    )}

                    <input
                      type="text"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      placeholder="Full Name (e.g. Manan Patel)"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />

                    <input
                      type="email"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="Google Email (e.g. user@gmail.com)"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />

                    <button
                      type="submit"
                      disabled={isSigningInGoogle}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {isSigningInGoogle ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <span>Continue with this account</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Modal Footer Notice */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 text-center leading-relaxed">
              To continue, Google will share your name, email address, and profile picture with MealMitra.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
