import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  UtensilsCrossed,
  Bell,
  User,
  ChefHat,
  Bike,
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCheck,
  Trash2,
  X,
  ArrowLeft,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    customerTab,
    setCustomerTab,
    cookTab,
    setCookTab,
    deliveryTab,
    setDeliveryTab,
    adminTab,
    setAdminTab,
    selectedCookId,
    setSelectedCookId,
    notifications,
    markNotificationsAsRead,
    clearNotifications,
    currentCookProfile,
  } = useApp();

  const { currentUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    if (currentUser) {
      if (role === 'customer') setCustomerTab('dashboard');
      else if (role === 'cook') setCookTab('dashboard');
      else if (role === 'delivery') setDeliveryTab('dashboard');
      else if (role === 'admin') setAdminTab('dashboard');
    } else {
      setRole('entry');
    }
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

  const isNotOnDashboard =
    role !== 'entry' &&
    ((role === 'customer' && (customerTab !== 'dashboard' || !!selectedCookId)) ||
      (role === 'cook' && cookTab !== 'dashboard') ||
      (role === 'delivery' && deliveryTab !== 'dashboard') ||
      (role === 'admin' && adminTab !== 'dashboard'));

  const handleGoBack = () => {
    if (role === 'customer') {
      if (selectedCookId) {
        setSelectedCookId(null);
      } else {
        setCustomerTab('dashboard');
      }
    } else if (role === 'cook') {
      setCookTab('dashboard');
    } else if (role === 'delivery') {
      setDeliveryTab('dashboard');
    } else if (role === 'admin') {
      setAdminTab('dashboard');
    }
  };

  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  return (
    <header className="sticky top-0 z-30 bg-[#faf9f8]/95 backdrop-blur-md border-b border-[#dcc1b1]/50 h-16 w-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 text-left group focus:outline-none cursor-pointer"
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

        {isNotOnDashboard && (
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#dcc1b1]/80 hover:bg-[#ffdcc5]/40 text-[#944a00] font-bold text-xs transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>
        )}

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
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Authentication Info Display (without logout button) */}
        {currentUser && (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block text-right">
              {currentUser.role === 'cook' ? (
                <>
                  <div className="text-sm font-bold text-[#1a1c1c]">
                    {currentCookProfile?.name || currentUser.applicationDetails?.kitchenName || 'Home Kitchen'}
                  </div>
                  <div className="text-[10px] text-[#944a00] font-semibold">
                    Chef {currentUser?.name || currentCookProfile?.chefName || 'Home Cook'}
                  </div>
                </>
              ) : currentUser.role === 'delivery' ? (
                <>
                  <div className="text-sm font-bold text-[#1a1c1c]">{currentUser.name}</div>
                  <div className="text-[10px] text-[#4e6074] font-medium">Delivery Partner</div>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold text-[#1a1c1c]">{currentUser.name}</div>
                  <div className="text-[10px] text-[#564337] font-medium capitalize">
                    {currentUser.role === 'admin' ? 'Super Admin' : 'Customer'}
                  </div>
                </>
              )}
            </div>
            <img
              src={
                (currentUser.role === 'cook' && currentCookProfile?.avatar) ||
                currentUser.avatar ||
                `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="100%" height="100%" fill="%23ffdcc5"/><text x="50%" y="54%" font-size="44" font-weight="bold" fill="%23944a00" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif">${encodeURIComponent(
                  ((currentUser.role === 'cook' ? (currentUser?.name || currentCookProfile?.name) : currentUser.name) || 'User').trim().charAt(0).toUpperCase()
                )}</text></svg>`
              }
              alt={currentUser.name}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
            />
          </div>
        )}

        {/* Dynamic Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) {
                markNotificationsAsRead();
              }
            }}
            className="p-2.5 rounded-full text-[#564337] hover:text-[#944a00] hover:bg-[#eeeeed] transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-[#944a00] text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#dcc1b1]/60 p-4 z-50 animate-in fade-in duration-150">
              <div className="flex justify-between items-center pb-2.5 mb-2.5 border-b border-[#eeeeed]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1a1c1c]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#ffdcc5] text-[#944a00] text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications && notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-[#564337] hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Clear all notifications"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#564337] hover:text-[#1a1c1c] p-1 rounded-lg cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Notification List or Empty State */}
              {notifications && notifications.length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl border text-xs transition-all ${
                        notif.read
                          ? 'bg-[#faf9f8] border-[#eeeeed]'
                          : 'bg-[#ffdcc5]/20 border-[#ffdcc5] shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-[#1a1c1c]">
                          <ShoppingBag className="w-3.5 h-3.5 text-[#944a00] shrink-0" />
                          <span>{notif.title}</span>
                        </div>
                        <span className="text-[10px] text-[#564337] whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-[#564337] mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#faf9f8] border border-[#eeeeed] text-[#564337]/50 flex items-center justify-center mx-auto">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-xs text-[#1a1c1c]">No Notifications</div>
                  <p className="text-[11px] text-[#564337] max-w-xs mx-auto leading-relaxed">
                    You're all caught up! Real-time alerts for orders, kitchen status, and deliveries will appear here when they happen.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
