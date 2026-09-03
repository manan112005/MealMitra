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
  const [showNotificationToast, setShowNotificationToast] = useState(false);



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
        {currentUser && (
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
