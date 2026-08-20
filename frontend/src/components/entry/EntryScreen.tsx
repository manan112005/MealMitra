import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Utensils,
  ChefHat,
  Bike,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const EntryScreen: React.FC = () => {
  const { setRole, setCustomerTab, setCookTab, setDeliveryTab, setAdminTab } = useApp();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'cook' | 'delivery' | 'admin'>('customer');

  const roleDetails = {
    customer: {
      title: 'Hungry Customer',
      icon: Utensils,
      color: 'bg-[#ffdcc5] text-[#944a00] border-[#944a00]/30',
      badge: 'Order & Tiffin Subscriptions',
      headline: 'Explore local dishes',
      desc: 'Find and order fresh meals prepared by verified home chefs near you with daily lunch & dinner plans.',
      features: [
        'Discover authentic daily homestyle menus',
        'Flexible monthly & yearly tiffin subscriptions',
        'Live order tracking & direct cook chat',
      ],
    },
    cook: {
      title: 'Home Cook',
      icon: ChefHat,
      color: 'bg-[#d1e6c9] text-[#51634c] border-[#51634c]/30',
      badge: 'Culinary Business & Kitchen',
      headline: 'Share your home cooking',
      desc: 'Manage your daily kitchen status, set available meal quantities, publish weekly menus, and grow your local business.',
      features: [
        'Real-time kitchen capacity & availability manager',
        'Weekly Monday–Sunday meal schedule planner',
        'AI Demand prediction & revenue analytics',
      ],
    },
    delivery: {
      title: 'Delivery Partner',
      icon: Bike,
      color: 'bg-[#d1e4fc] text-[#4e6074] border-[#4e6074]/30',
      badge: 'Smart Cluster Logistics',
      headline: 'Deliver smiles & hot tiffins',
      desc: 'Collect meals from multiple neighborhood cooks and deliver them efficiently through AI cluster-optimized routes.',
      features: [
        'Smart batch pickup from multiple nearby home cooks',
        'Turn-by-turn simulated active delivery navigation',
        'Daily earnings dashboard & performance metrics',
      ],
    },
    admin: {
      title: 'Platform Admin',
      icon: ShieldCheck,
      color: 'bg-indigo-100 text-indigo-700 border-indigo-700/30',
      badge: 'System Control Center',
      headline: 'Oversee the ecosystem',
      desc: 'Monitor live orders, manage users, track platform revenue, and configure global settings across all three roles.',
      features: [
        'Live tracking of all active deliveries & orders',
        'User management for customers, cooks, and riders',
        'Financial dashboard with payout & commission insights',
      ],
    },
  };

  const currentInfo = roleDetails[selectedRole];
  const Icon = currentInfo.icon;

  const handleStart = () => {
    if (selectedRole === 'customer') {
      setCustomerTab('dashboard');
      setRole('customer');
    } else if (selectedRole === 'cook') {
      setCookTab('dashboard');
      setRole('cook');
    } else if (selectedRole === 'delivery') {
      setDeliveryTab('dashboard');
      setRole('delivery');
    } else {
      setAdminTab('dashboard');
      setRole('admin');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#faf9f8] flex flex-col justify-center overflow-hidden">
      {/* Soft warm background glow and kitchen texture overlay */}
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
              Ghar Ka Khana, Sabke Liye
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1c1c] tracking-tight leading-[1.15]">
              Discover healthy <span className="text-[#944a00]">homemade meals</span> from trusted local cooks.
            </h1>

            <p className="text-base sm:text-lg text-[#564337] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Join MealMitra’s 3-sided community ecosystem connecting hungry customers with verified neighborhood home cooks and smart cluster delivery partners.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#dcc1b1]/50">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-9 h-9 rounded-lg bg-white border border-[#dcc1b1]/40 flex items-center justify-center text-[#944a00] shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#1a1c1c]">100% Homemade</div>
                  <div className="text-[11px] text-[#564337]">No commercial kitchens</div>
                </div>
              </div>

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
                  <div className="text-[11px] text-[#564337]">Hot & on-time tiffins</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Role Selector Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#ffdcc5]/20 rounded-bl-full -mr-12 -mt-12 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#1a1c1c]">Get Started</h2>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#eeeeed] text-[#564337]">
                      MVP Prototype
                    </span>
                  </div>
                  <p className="text-xs text-[#564337] mt-1">
                    Select your role to explore the dedicated 3-in-1 application interface.
                  </p>
                </div>

                {/* Dropdown Form */}
                <div className="space-y-2">
                  <label htmlFor="role-select" className="block text-xs font-bold uppercase tracking-wider text-[#564337]">
                    Continue as
                  </label>
                  <div className="relative">
                    <select
                      id="role-select"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      className="w-full bg-[#faf9f8] border border-[#dcc1b1] text-[#1a1c1c] text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#944a00] focus:border-[#944a00] transition-colors cursor-pointer appearance-none shadow-2xs"
                    >
                      <option value="customer">🍽️ Customer (Discover & Order Meals)</option>
                      <option value="cook">👩‍🍳 Home Cook (Kitchen & Business Portal)</option>
                      <option value="delivery">🛵 Delivery Partner (Route & Deliveries)</option>
                      <option value="admin">🛡️ Platform Admin (System Management)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#564337]">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Role Dynamic Preview Card */}
                <div className={`p-4 rounded-xl border transition-all ${currentInfo.color}`}>
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-lg bg-white shadow-2xs shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1a1c1c]">{currentInfo.headline}</span>
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/80">
                          {currentInfo.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#564337] leading-relaxed">
                        {currentInfo.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-black/10 space-y-1.5">
                    {currentInfo.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-[#1a1c1c] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-current shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  onClick={handleStart}
                  id="get-started-cta"
                  className="w-full py-3.5 px-6 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                  <span>Launch {currentInfo.title} View</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-center">
                  <span className="text-xs text-[#564337]">
                    Zero login / password required • Instant prototype switching
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Quick Role Tiles at Bottom */}
        <div className="mt-12 pt-8 border-t border-[#dcc1b1]/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <button
            onClick={() => {
              setCustomerTab('dashboard');
              setRole('customer');
            }}
            className="p-5 rounded-xl bg-white border border-[#dcc1b1]/60 hover:border-[#944a00] hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#ffdcc5] text-[#944a00] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#1a1c1c] mb-1 flex items-center justify-between">
              <span>Customer Experience</span>
              <ArrowRight className="w-4 h-4 text-[#944a00] opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-[#564337]">
              Browse home cooks, today's fresh lunch/dinner, place orders, and manage monthly tiffins.
            </p>
          </button>

          <button
            onClick={() => {
              setCookTab('dashboard');
              setRole('cook');
            }}
            className="p-5 rounded-xl bg-white border border-[#dcc1b1]/60 hover:border-[#51634c] hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#d1e6c9] text-[#51634c] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ChefHat className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#1a1c1c] mb-1 flex items-center justify-between">
              <span>Home Cook Portal</span>
              <ArrowRight className="w-4 h-4 text-[#51634c] opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-[#564337]">
              Set daily available lunch/dinner quantity, update weekly menus, accept orders, and track revenue.
            </p>
          </button>

          <button
            onClick={() => {
              setDeliveryTab('dashboard');
              setRole('delivery');
            }}
            className="p-5 rounded-xl bg-white border border-[#dcc1b1]/60 hover:border-[#4e6074] hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#d1e4fc] text-[#4e6074] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Bike className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#1a1c1c] mb-1 flex items-center justify-between">
              <span>Delivery Partner</span>
              <ArrowRight className="w-4 h-4 text-[#4e6074] opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-[#564337]">
              Smart cluster pickups from multiple home kitchens and optimized drop-off routes.
            </p>
          </button>

          <button
            onClick={() => {
              setAdminTab('dashboard');
              setRole('admin');
            }}
            className="p-5 rounded-xl bg-white border border-[#dcc1b1]/60 hover:border-indigo-600 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#1a1c1c] mb-1 flex items-center justify-between">
              <span>Platform Admin</span>
              <ArrowRight className="w-4 h-4 text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-[#564337]">
              Manage the 3-sided ecosystem. View users, monitor live orders, and track platform financials.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
