import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth, AuthUser } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Utensils,
  ChefHat,
  Bike,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Lock,
  HeartHandshake,
  Clock,
  Upload,
  CheckCircle2,
} from 'lucide-react';

export const EntryScreen: React.FC = () => {
  const { setRole, setCustomerTab, setCookTab, setDeliveryTab, setAdminTab } = useApp();
  const { signup, loginWithEmail, loginWithOTP, loginWithGoogle } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  
  // Login State
  const [loginMethod, setLoginMethod] = useState<'otp' | 'email'>('otp');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Signup State (Multi-step)
  const [signupStep, setSignupStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<'customer' | 'cook' | 'delivery'>('customer');
  
  // Signup Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [foodCategory, setFoodCategory] = useState('Veg');
  const [vehicleType, setVehicleType] = useState('Bike');
  const [signupOtp, setSignupOtp] = useState('');
  const [signupError, setSignupError] = useState('');

  React.useEffect(() => {
    setLoginError('');
    setSignupError('');
  }, [isLogin, loginMethod, signupStep]);

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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginMethod === 'email') {
      if (!loginEmail || !loginPassword) {
        setLoginError('Please enter email and password.');
        return;
      }
      const { user, error } = loginWithEmail(loginEmail, loginPassword, selectedRole);
      if (user) {
        navigateToRole(user.role);
      } else {
        setLoginError(error || 'Invalid credentials.');
      }
    } else {
      if (!loginPhone) {
        setLoginError('Please enter phone number.');
        return;
      }
      if (!loginOtpSent) {
        setLoginOtpSent(true);
        return;
      }
      if (!loginOtp) {
        setLoginError('Please enter OTP.');
        return;
      }
      const { user, error } = loginWithOTP(loginPhone, loginOtp, selectedRole);
      if (user) {
        navigateToRole(user.role);
      } else {
        setLoginError(error || 'Invalid OTP.');
      }
    }
  };

  const handleSignupNext = () => {
    setSignupError('');
    if (signupStep === 2) {
      if (!name || !phone || !email || !password || !address || !city) {
        setSignupError('Please fill in all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        setSignupError('Passwords do not match.');
        return;
      }
    }
    setSignupStep(prev => prev + 1);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    
    if (signupOtp.length < 4) {
      setSignupError('Please enter a valid OTP.');
      return;
    }

    const { success, error } = signup({
      name,
      email,
      phone,
      password,
      role: selectedRole,
      applicationDetails: {
        address,
        city,
        foodCategory: selectedRole === 'cook' ? foodCategory : undefined,
        vehicleType: selectedRole === 'delivery' ? vehicleType : undefined,
      }
    });

    if (success) {
      setSignupStep(5); // Success step
    } else {
      setSignupError(error || 'Failed to register.');
    }
  };

  const handleAdminLogin = () => {
    loginWithGoogle('admin');
    navigateToRole('admin');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#faf9f8] flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffdcc5]/20 via-[#faf9f8] to-[#d1e6c9]/20 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&auto=format&fit=crop&q=80')`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Hero Copy */}
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

          {/* Right Column: Interactive Role Selector & Auth Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-[24px] border border-[#dcc1b1]/60 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-6 sm:p-8 relative overflow-visible">
              <div className="relative z-10">
                
                {/* Top Toggle (Login / Sign Up) */}
                <div className="flex p-1 bg-[#faf9f8] rounded-full border border-[#eeeeed] mb-6 relative shadow-inner">
                  <div
                    className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-full shadow-xs border border-[#eeeeed] transition-transform duration-300 ease-in-out ${
                      !isLogin ? 'translate-x-[calc(100%+4px)]' : 'translate-x-1'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setSignupStep(1); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-full relative z-10 transition-colors ${
                      isLogin ? 'text-[#1a1c1c]' : 'text-[#564337]'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 text-xs font-bold rounded-full relative z-10 transition-colors ${
                      !isLogin ? 'text-[#1a1c1c]' : 'text-[#564337]'
                    }`}
                  >
                    Partner Sign Up
                  </button>
                </div>

                {isLogin ? (
                  // ================= LOGIN FLOW =================
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-[22px] font-extrabold text-[#1a1c1c] mb-1">
                        Welcome Back
                      </h2>
                      <p className="text-[11px] text-[#564337]">
                        Sign in to access your MealMitra dashboard
                      </p>
                    </div>

                    {/* Role Selector */}
                    <div className="mb-6">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1a1c1c] mb-2.5">
                        Login As
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRole('customer')}
                          className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-[14px] border-[1.5px] transition-all ${
                            selectedRole === 'customer'
                              ? 'bg-[#ffdcc5]/40 border-[#944a00] text-[#944a00]'
                              : 'bg-white border-[#eeeeed] text-[#564337] hover:border-[#dcc1b1]'
                          }`}
                        >
                          <User className={`w-4 h-4 mb-2 ${selectedRole === 'customer' ? 'text-[#944a00]' : 'text-[#564337]'}`} />
                          <span className="text-[10px] font-bold">Customer</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedRole('cook')}
                          className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-[14px] border-[1.5px] transition-all ${
                            selectedRole === 'cook'
                              ? 'bg-white border-[#51634c] text-[#1a1c1c]'
                              : 'bg-white border-[#eeeeed] text-[#564337] hover:border-[#dcc1b1]'
                          }`}
                        >
                          <ChefHat className={`w-4 h-4 mb-2 ${selectedRole === 'cook' ? 'text-[#51634c]' : 'text-[#564337]'}`} />
                          <span className="text-[10px] font-bold">Home Cook</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedRole('delivery')}
                          className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-[14px] border-[1.5px] transition-all ${
                            selectedRole === 'delivery'
                              ? 'bg-white border-[#4e6074] text-[#1a1c1c]'
                              : 'bg-white border-[#eeeeed] text-[#564337] hover:border-[#dcc1b1]'
                          }`}
                        >
                          <Bike className={`w-4 h-4 mb-2 ${selectedRole === 'delivery' ? 'text-[#4e6074]' : 'text-[#564337]'}`} />
                          <span className="text-[10px] font-bold text-center leading-tight">Delivery<br/>Partner</span>
                        </button>
                      </div>
                    </div>

                    {loginError && (
                      <div className="p-2.5 mb-4 bg-red-50 text-red-600 text-[11px] font-semibold rounded-lg border border-red-100 text-center">
                        {loginError}
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      {loginMethod === 'otp' ? (
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#1a1c1c] whitespace-nowrap">
                            IN +91
                          </div>
                          <input
                            type="tel"
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value)}
                            className="w-full pl-[72px] pr-4 py-3.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] transition-all font-medium shadow-2xs"
                            placeholder="Phone Number"
                          />
                        </div>
                      ) : (
                        <>
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full px-4 py-3.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] transition-all font-medium shadow-2xs"
                            placeholder="Email Address"
                          />
                          <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full px-4 py-3.5 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] transition-all font-medium shadow-2xs"
                            placeholder="Password"
                          />
                        </>
                      )}

                      {loginMethod === 'otp' && loginOtpSent && (
                        <div className="pt-2">
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-[#564337] mb-2">
                            Enter 6-Digit OTP
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#564337]/50" />
                            <input
                              type="text"
                              maxLength={6}
                              value={loginOtp}
                              onChange={(e) => setLoginOtp(e.target.value)}
                              className="w-full pl-11 pr-4 py-3.5 border border-[#eeeeed] bg-white rounded-xl text-sm tracking-[0.5em] font-bold focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] transition-all shadow-2xs"
                              placeholder="••••••"
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-[#1a1c1c] text-white font-bold text-sm rounded-xl shadow-md hover:bg-[#333] transition-all flex items-center justify-center gap-2 group mt-4"
                      >
                        <span>
                          {loginMethod === 'otp' && !loginOtpSent ? 'Send OTP' : 'Login'}
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>

                    <div className="flex items-center gap-3 my-6">
                      <div className="flex-1 h-px bg-[#eeeeed]"></div>
                      <span className="text-[9px] uppercase font-bold text-[#564337]/60">OR</span>
                      <div className="flex-1 h-px bg-[#eeeeed]"></div>
                    </div>

                    <div className="space-y-3">
                      {loginMethod === 'otp' ? (
                        <button
                          type="button"
                          onClick={() => { setLoginMethod('email'); setLoginError(''); }}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#eeeeed] hover:bg-[#faf9f8] hover:border-[#dcc1b1] rounded-xl text-[11px] font-bold text-[#564337] transition-all shadow-2xs"
                        >
                          <Mail className="w-4 h-4 text-red-500" />
                          <span>Continue with Email</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setLoginMethod('otp'); setLoginError(''); }}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#eeeeed] hover:bg-[#faf9f8] hover:border-[#dcc1b1] rounded-xl text-[11px] font-bold text-[#564337] transition-all shadow-2xs"
                        >
                          <Phone className="w-4 h-4 text-[#944a00]" />
                          <span>Continue with OTP</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          loginWithGoogle(selectedRole);
                          navigateToRole(selectedRole);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#eeeeed] hover:bg-[#faf9f8] hover:border-[#dcc1b1] rounded-xl text-[11px] font-bold text-[#564337] transition-all shadow-2xs"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span>Sign In with Google</span>
                      </button>
                    </div>
                  </>
                ) : (
                  // ================= SIGNUP FLOW =================
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-[22px] font-extrabold text-[#1a1c1c] mb-1">
                        Partner Registration
                      </h2>
                      <p className="text-[11px] text-[#564337]">
                        Step {signupStep} of 4: {
                          signupStep === 1 ? 'Select Role' :
                          signupStep === 2 ? 'Basic Details' :
                          signupStep === 3 ? 'Document Uploads' : 'OTP Verification'
                        }
                      </p>
                    </div>

                    {signupError && (
                      <div className="p-2.5 mb-4 bg-red-50 text-red-600 text-[11px] font-semibold rounded-lg border border-red-100 text-center">
                        {signupError}
                      </div>
                    )}

                    {signupStep === 1 && (
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => setSelectedRole('cook')}
                          className={`w-full flex items-center p-4 rounded-2xl border-[1.5px] transition-all ${
                            selectedRole === 'cook'
                              ? 'bg-[#d1e6c9]/30 border-[#51634c] shadow-sm'
                              : 'bg-white border-[#eeeeed] hover:border-[#d1e6c9]'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                            selectedRole === 'cook' ? 'bg-[#51634c] text-white' : 'bg-[#faf9f8] text-[#51634c]'
                          }`}>
                            <ChefHat className="w-6 h-6" />
                          </div>
                          <div className="ml-4 text-left">
                            <h3 className="font-bold text-[#1a1c1c] text-sm">Home Cook</h3>
                            <p className="text-[11px] text-[#564337] mt-0.5">Share your homemade meals and earn income</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedRole('delivery')}
                          className={`w-full flex items-center p-4 rounded-2xl border-[1.5px] transition-all ${
                            selectedRole === 'delivery'
                              ? 'bg-blue-50/50 border-[#4e6074] shadow-sm'
                              : 'bg-white border-[#eeeeed] hover:border-blue-200'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                            selectedRole === 'delivery' ? 'bg-[#4e6074] text-white' : 'bg-[#faf9f8] text-[#4e6074]'
                          }`}>
                            <Bike className="w-6 h-6" />
                          </div>
                          <div className="ml-4 text-left">
                            <h3 className="font-bold text-[#1a1c1c] text-sm">Delivery Partner</h3>
                            <p className="text-[11px] text-[#564337] mt-0.5">Deliver fresh meals and earn per order</p>
                          </div>
                        </button>
                      </div>
                    )}

                    {signupStep === 2 && (
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1]" placeholder="Full Name" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1]" placeholder="Email Address" />
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#1a1c1c]">IN +91</div>
                          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-[72px] pr-4 py-3 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1]" placeholder="Phone Number" />
                        </div>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1]" placeholder={selectedRole === 'cook' ? 'Kitchen Address' : 'Residential Address'} />
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1]" placeholder="City" />
                        
                        {selectedRole === 'cook' && (
                          <select value={foodCategory} onChange={(e) => setFoodCategory(e.target.value)} className="w-full px-4 py-3 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1]">
                            <option value="Veg">Vegetarian Only</option>
                            <option value="Non-Veg">Non-Vegetarian Only</option>
                            <option value="Both">Both Veg & Non-Veg</option>
                          </select>
                        )}
                        {selectedRole === 'delivery' && (
                          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="w-full px-4 py-3 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1]">
                            <option value="Bike">Motorcycle</option>
                            <option value="Scooter">Scooter</option>
                            <option value="Bicycle">Bicycle</option>
                            <option value="Electric Vehicle">Electric Vehicle</option>
                          </select>
                        )}

                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1]" placeholder="Password" />
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border border-[#eeeeed] bg-white rounded-xl text-sm focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1]" placeholder="Confirm Password" />
                      </div>
                    )}

                    {signupStep === 3 && (
                      <div className="space-y-4">
                        <label className="block border-2 border-dashed border-[#dcc1b1] rounded-xl p-6 text-center hover:bg-[#faf9f8] transition-colors cursor-pointer">
                          <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" />
                          <Upload className="w-8 h-8 text-[#564337] mx-auto mb-2" />
                          <p className="text-sm font-semibold text-[#1a1c1c]">Upload Govt ID (Aadhaar/PAN)</p>
                          <p className="text-[10px] text-[#564337] mt-1">JPEG, PNG or PDF up to 5MB</p>
                        </label>
                        {selectedRole === 'delivery' && (
                          <label className="block border-2 border-dashed border-[#dcc1b1] rounded-xl p-6 text-center hover:bg-[#faf9f8] transition-colors cursor-pointer">
                            <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" />
                            <Upload className="w-8 h-8 text-[#564337] mx-auto mb-2" />
                            <p className="text-sm font-semibold text-[#1a1c1c]">Upload Driving License</p>
                            <p className="text-[10px] text-[#564337] mt-1">JPEG, PNG or PDF up to 5MB</p>
                          </label>
                        )}
                        {selectedRole === 'cook' && (
                          <label className="block border-2 border-dashed border-[#dcc1b1] rounded-xl p-6 text-center hover:bg-[#faf9f8] transition-colors cursor-pointer">
                            <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" />
                            <Upload className="w-8 h-8 text-[#564337] mx-auto mb-2" />
                            <p className="text-sm font-semibold text-[#1a1c1c]">Upload FSSAI License (Optional)</p>
                            <p className="text-[10px] text-[#564337] mt-1">JPEG, PNG or PDF up to 5MB</p>
                          </label>
                        )}
                      </div>
                    )}

                    {signupStep === 4 && (
                      <form onSubmit={handleSignupSubmit} className="space-y-4">
                        <div className="pt-2">
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-[#564337] mb-2">
                            Enter 6-Digit OTP sent to {phone}
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#564337]/50" />
                            <input
                              type="text"
                              maxLength={6}
                              value={signupOtp}
                              onChange={(e) => setSignupOtp(e.target.value)}
                              className="w-full pl-11 pr-4 py-3.5 border border-[#eeeeed] bg-white rounded-xl text-sm tracking-[0.5em] font-bold focus:outline-none focus:border-[#dcc1b1] focus:ring-1 focus:ring-[#dcc1b1] transition-all shadow-2xs"
                              placeholder="••••••"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3.5 bg-[#944a00] text-white font-bold text-sm rounded-xl shadow-md hover:bg-[#713700] transition-all flex items-center justify-center gap-2 mt-4"
                        >
                          Submit Application
                        </button>
                      </form>
                    )}

                    {signupStep === 5 && (
                      <div className="text-center py-6">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-[#1a1c1c] mb-2">Application Submitted!</h3>
                        <p className="text-sm text-[#564337] mb-6">
                          Thank you for joining MealMitra. Your application is under review. You will receive approval confirmation via email and SMS.
                        </p>
                        <button
                          onClick={() => { setIsLogin(true); setSignupStep(1); }}
                          className="px-6 py-2.5 bg-[#faf9f8] border border-[#eeeeed] rounded-lg text-sm font-semibold text-[#564337] hover:bg-[#eeeeed]"
                        >
                          Return to Login
                        </button>
                      </div>
                    )}

                    {signupStep < 4 && (
                      <button
                        type="button"
                        onClick={handleSignupNext}
                        className={`w-full py-3.5 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group mt-6 ${
                          selectedRole === 'cook' ? 'bg-[#51634c] hover:bg-[#3a4736]' : 'bg-[#4e6074] hover:bg-[#384554]'
                        }`}
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                    
                    {signupStep > 1 && signupStep < 5 && (
                      <button
                        type="button"
                        onClick={() => setSignupStep(prev => prev - 1)}
                        className="w-full mt-3 text-xs font-semibold text-[#564337] hover:text-[#1a1c1c]"
                      >
                        Back
                      </button>
                    )}
                  </>
                )}

                {/* Admin Portal Link */}
                <div className="absolute -bottom-[68px] left-0 right-0 text-center">
                  <button
                    type="button"
                    onClick={handleAdminLogin}
                    className="inline-flex items-center gap-1.5 text-[10px] text-[#564337]/70 hover:text-[#1a1c1c] transition-colors uppercase font-bold tracking-widest"
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
    </div>
  );
};
