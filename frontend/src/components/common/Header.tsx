import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  UtensilsCrossed,
  ArrowLeftRight,
  Bell,
  User,
  ChefHat,
  Bike,
  Sparkles,
  Check,
  RotateCcw,
  Home,
  ArrowLeft,
  LogOut,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { role, setRole, setCustomerTab, setCookTab, setDeliveryTab, setSelectedCookId, resetAllData } = useApp();
  const { currentUser, logout } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const rolesConfig: { id: UserRole; title: string; subtitle: string; icon: any; color: string }[] = [
    {
      id: 'customer',
      title: 'Customer Experience',
      subtitle: 'Browse cooks, order meals & subscriptions',
      icon: User,
      color: 'bg-[#ffdcc5] text-[#944a00]',
    },
    {
      id: 'cook',
      title: 'Home Cook Experience',
      subtitle: 'Manage kitchen, menus, orders & earnings',
      icon: ChefHat,
      color: 'bg-[#d1e6c9] text-[#51634c]',
    },
    {
      id: 'delivery',
      title: 'Delivery Partner Experience',
      subtitle: 'Smart cluster routes, pickups & deliveries',
      icon: Bike,
      color: 'bg-[#d1e4fc] text-[#4e6074]',
    },
  ];

  const handleRoleChange = (newRole: UserRole) => {
    setSelectedCookId(null);
    if (newRole === 'customer') setCustomerTab('dashboard');
    if (newRole === 'cook') setCookTab('dashboard');
    if (newRole === 'delivery') setDeliveryTab('dashboard');
    setRole(newRole);
    setShowRoleDropdown(false);
  };

  const handleLogout = () => {
    logout();
    setRole('entry');
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'customer':
        return { label: 'Customer View', bg: 'bg-[#ffdcc5]', text: 'text-[#944a00]', icon: User };
      case 'cook':
        return { label: 'Home Cook View', bg: 'bg-[#d1e6c9]', text: 'text-[#51634c]', icon: ChefHat };
      case 'delivery':
        return { label: 'Delivery Partner View', bg: 'bg-[#d1e4fc]', text: 'text-[#4e6074]', icon: Bike };
      default:
        return { label: 'Prototype Demo', bg: 'bg-[#eeeeed]', text: 'text-[#564337]', icon: Sparkles };
    }
  };

  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  return (
    <header className="sticky top-0 z-30 bg-[#faf9f8]/95 backdrop-blur-md border-b border-[#dcc1b1]/50 h-16 w-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setRole('entry')}
          className="flex items-center gap-2 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-[#944a00] text-white flex items-center justify-center shadow-sm group-hover:bg-[#713700] transition-colors">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-xl text-[#944a00] tracking-tight leading-none">
              MealMitra
            </div>
            <div className="text-[10px] uppercase font-semibold text-[#564337] tracking-wider hidden sm:block">
              Ghar Ka Khana, Sabke Liye
            </div>
          </div>
        </button>

        {role !== 'entry' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCookId(null);
                setRole('entry');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#ffdcc5]/50 border border-[#dcc1b1] text-xs font-bold text-[#944a00] shadow-2xs transition-all hover:shadow-xs"
              title="Return to Main Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-[#944a00]" />
              <span className="hidden xs:inline">Home / Landing</span>
              <span className="xs:hidden">Home</span>
            </button>

            <div className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge.bg} ${roleBadge.text}`}>
              <RoleIcon className="w-3.5 h-3.5" />
              <span>{roleBadge.label}</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset Prototype Data */}
        <button
          onClick={resetAllData}
          title="Reset Prototype Data to Defaults"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#564337] hover:text-[#944a00] hover:bg-[#eeeeed] rounded-lg transition-colors border border-[#dcc1b1]/40"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>

        {/* Authentication / Role Switcher */}
        {currentUser ? (
          <div className="flex items-center gap-3 ml-2">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-bold text-[#1a1c1c]">{currentUser.name}</div>
              <div className="text-[10px] text-[#564337] capitalize">{currentUser.role}</div>
            </div>
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-[#944a00]/30 bg-white hover:bg-[#ffdcc5]/40 text-[#944a00] text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95"
              id="role-switch-btn"
            >
              <ArrowLeftRight className="w-4 h-4 text-[#944a00]" />
              <span className="hidden sm:inline">Switch Role</span>
              <span className="capitalize text-xs px-2 py-0.5 rounded-full bg-[#ffdcc5] text-[#944a00]">
                {role === 'entry' ? 'Select' : role}
              </span>
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-[#dcc1b1]/60 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#eeeeed]">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#564337]">
                    Prototype Role Selection
                  </p>
                  <p className="text-[11px] text-[#564337]/80">
                    Switch instantly between the 3 role experiences.
                  </p>
                </div>

                <div className="mt-1 space-y-1">
                  {rolesConfig.map((item) => {
                    const Icon = item.icon;
                    const isSelected = role === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleRoleChange(item.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                          isSelected
                            ? 'bg-[#ffdcc5]/40 border border-[#944a00]/30'
                            : 'hover:bg-[#f4f3f2]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-[#1a1c1c]">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-[#564337] line-clamp-1">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#944a00]" />}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handleRoleChange('entry')}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left text-xs font-semibold text-[#564337] hover:bg-[#f4f3f2] border-t border-[#eeeeed] mt-2 pt-2`}
                  >
                    <Sparkles className="w-4 h-4 text-[#944a00]" />
                    <span>Return to Entry / Landing Screen</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notification Mock Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationToast(!showNotificationToast)}
            className="p-2 rounded-full text-[#564337] hover:text-[#944a00] hover:bg-[#eeeeed] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#944a00]"></span>
          </button>

          {showNotificationToast && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#dcc1b1]/60 p-4 z-50 text-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-[#1a1c1c]">Live MealMitra Alerts</span>
                <span className="text-[10px] text-[#51634c] font-semibold">Just Now</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded bg-[#faf9f8] border border-[#eeeeed]">
                  <p className="font-semibold text-[#944a00]">🍲 Nirmala Devi’s Kitchen is OPEN</p>
                  <p className="text-[#564337] text-[11px]">Today’s Lunch: Special Gujarati Deluxe Thali (12 meals left).</p>
                </div>
                <div className="p-2 rounded bg-[#faf9f8] border border-[#eeeeed]">
                  <p className="font-semibold text-[#51634c]">🚚 Order #MM-8942 Update</p>
                  <p className="text-[#564337] text-[11px]">Ramesh Patel is out for delivery. ETA 1:15 PM.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
