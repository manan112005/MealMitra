import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CustomerTab, CookTab, DeliveryTab, AdminTab, UserRole } from '../../types';
import {
  LayoutDashboard,
  Compass,
  Utensils,
  ShoppingBag,
  CalendarDays,
  Heart,
  Star,
  User,
  ChefHat,
  Flame,
  BookOpen,
  Users,
  Repeat,
  Wallet,
  TrendingUp,
  Settings,
  PackageCheck,
  Navigation,
  Store,
  Bike,
  History,
  Award,
  ArrowLeftRight,
  Sparkles,
  Home,
  ArrowLeft,
  ShieldCheck,
  ClipboardList,
  Banknote,
  FileCheck,
  LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth();
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
    setSelectedCookId,
    currentCookProfile,
  } = useApp();

  if (role === 'entry') return null;

  // Customer navigation items
  const customerNavItems: { id: CustomerTab; label: string; icon: any; isSpecial?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'discover', label: 'Discover Cooks', icon: Compass },
    { id: 'meals', label: "Today's Meals", icon: Utensils },
    { id: 'ai-coach', label: 'Mitra AI Diet Coach', icon: Sparkles, isSpecial: true },
    { id: 'subscriptions', label: 'Tiffin Plans', icon: Repeat },
    { id: 'orders', label: 'Orders & Tracking', icon: ShoppingBag },
    { id: 'following', label: 'Following', icon: Heart },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  // Cook navigation items
  const cookNavItems: { id: CookTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Business Profile', icon: ChefHat },
    { id: 'kitchen', label: "Today's Kitchen", icon: Flame },
    { id: 'menu', label: 'Weekly Menu Manager', icon: BookOpen },
    { id: 'subscriptions', label: 'Subscription Plans', icon: Repeat },
    { id: 'orders', label: 'Order Processing', icon: ShoppingBag },
    { id: 'customers', label: 'Subscribers & Customers', icon: Users },
    { id: 'earnings', label: 'Earnings & Payouts', icon: Wallet },
  ];

  // Delivery navigation items
  const deliveryNavItems: { id: DeliveryTab; label: string; icon: any; isSpecial?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fleet-ai', label: 'Fleet AI & Routing', icon: Sparkles, isSpecial: true },
    { id: 'deliveries', label: "Today's Deliveries", icon: PackageCheck },
    { id: 'pickup', label: 'Cook Pickups', icon: Store },
    { id: 'active', label: 'Active Delivery', icon: Bike },
    { id: 'history', label: 'Delivery History', icon: History },
    { id: 'earnings', label: 'My Earnings', icon: Wallet },
    { id: 'performance', label: 'Performance Score', icon: Award },
  ];

  // Admin navigation items
  const adminNavItems: { id: AdminTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Platform Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'applications', label: 'Pending Applications', icon: FileCheck },
    { id: 'orders', label: 'Live Orders & Tracking', icon: ClipboardList },
    { id: 'financials', label: 'Financials & Payouts', icon: Banknote },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  const handleCustomerNav = (tabId: CustomerTab) => {
    setSelectedCookId(null);
    setCustomerTab(tabId);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#f4f3f2] border-r border-[#dcc1b1]/50 h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
      {/* Role Profile Mini Card */}
      <div className="p-4 border-b border-[#dcc1b1]/40">
        {role === 'customer' && (
          <div className="flex items-center gap-3">
            <img
              src={
                currentUser?.avatar ||
                `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="100%" height="100%" fill="%23ffdcc5"/><text x="50%" y="54%" font-size="44" font-weight="bold" fill="%23944a00" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif">${encodeURIComponent(
                  (currentUser?.name || 'Customer').trim().charAt(0).toUpperCase()
                )}</text></svg>`
              }
              alt={currentUser?.name || "Customer"}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#1a1c1c] truncate">Welcome, {currentUser?.name || 'Customer'}</p>
              <p className="text-[11px] text-[#564337] flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#51634c]"></span> Customer Role
              </p>
            </div>
          </div>
        )}

        {role === 'cook' && (
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar || currentCookProfile.avatar}
              alt={currentCookProfile.chefName || currentUser?.name || currentCookProfile.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#1a1c1c] truncate">
                {currentCookProfile.name || currentUser?.applicationDetails?.kitchenName || 'Home Kitchen'}
              </p>
              <p className="text-[10px] text-[#944a00] font-semibold truncate">
                Chef {currentUser?.name || currentCookProfile.chefName || 'Home Cook'}
              </p>
              <p className="text-[10px] text-[#564337] font-medium flex items-center gap-1 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${currentCookProfile.kitchenOpen ? 'bg-green-500' : 'bg-red-400'}`}></span>
                {currentCookProfile.kitchenOpen ? 'Kitchen Open' : 'Kitchen Closed'}
              </p>
            </div>
          </div>
        )}

        {role === 'delivery' && (
          <div className="flex items-center gap-3">
            <img
              src={
                currentUser?.avatar ||
                `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="100%" height="100%" fill="%23d1e4fc"/><text x="50%" y="54%" font-size="44" font-weight="bold" fill="%234e6074" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif">${encodeURIComponent(
                  (currentUser?.name || 'Delivery Partner').trim().charAt(0).toUpperCase()
                )}</text></svg>`
              }
              alt={currentUser?.name || "Delivery Partner"}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#1a1c1c] truncate">{currentUser?.name || 'Delivery Partner'}</p>
              <p className="text-[11px] text-[#4e6074] font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> On Duty • 4.9★
              </p>
            </div>
          </div>
        )}

        {role === 'admin' && (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6 text-indigo-700" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#1a1c1c] truncate">Super Admin</p>
              <p className="text-[11px] text-indigo-700 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> System Active
              </p>
            </div>
          </div>
        )}

        {/* Home Landing Page & Switch Role buttons */}
        <div className="mt-3 flex flex-col gap-1.5">


          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                const nextRole: UserRole =
                  role === 'customer' ? 'cook' : role === 'cook' ? 'delivery' : role === 'delivery' ? 'admin' : 'customer';
                setRole(nextRole);
              }}
              className="w-full py-1.5 px-3 bg-[#faf9f8] border border-[#dcc1b1]/60 hover:bg-[#eeeeed] text-[#564337] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span className="capitalize">Switch View: {role}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {role === 'customer' &&
          customerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = customerTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleCustomerNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-[#ffdcc5]/60 text-[#944a00] border-l-4 border-[#944a00] font-bold shadow-2xs'
                    : 'text-[#564337] hover:bg-[#eeeeed] hover:text-[#1a1c1c]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#944a00]' : item.isSpecial ? 'text-[#ff6d00] animate-pulse' : 'text-[#564337]'}`} />
                  <span>{item.label}</span>
                </div>

                {item.isSpecial && (
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[#ff6d00] to-[#e65100] text-white shadow-2xs">
                    AI
                  </span>
                )}
              </button>
            );
          })}

        {role === 'cook' &&
          cookNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = cookTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCookTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-[#ffdcc5]/60 text-[#944a00] border-l-4 border-[#944a00] font-bold shadow-2xs'
                    : 'text-[#564337] hover:bg-[#eeeeed] hover:text-[#1a1c1c]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#944a00]' : 'text-[#564337]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

        {role === 'delivery' &&
          deliveryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = deliveryTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setDeliveryTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-[#ffdcc5]/60 text-[#944a00] border-l-4 border-[#944a00] font-bold shadow-2xs'
                    : 'text-[#564337] hover:bg-[#eeeeed] hover:text-[#1a1c1c]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#944a00]' : item.isSpecial ? 'text-blue-600 animate-pulse' : 'text-[#564337]'}`} />
                  <span>{item.label}</span>
                </div>

                {item.isSpecial && (
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xs">
                    AI
                  </span>
                )}
              </button>
            );
          })}

        {role === 'admin' &&
          adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-indigo-100/80 text-indigo-700 border-l-4 border-indigo-600 font-bold shadow-2xs'
                    : 'text-[#564337] hover:bg-[#eeeeed] hover:text-[#1a1c1c]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-700' : 'text-[#564337]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-[#dcc1b1]/40">
        <button
          onClick={() => {
            logout();
            setRole('entry');
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors shadow-2xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Footer info badge */}
      <div className="p-3 border-t border-[#dcc1b1]/40 text-center">
        <div className="bg-white/80 rounded-lg p-2 border border-[#dcc1b1]/40 text-[11px] text-[#564337]">
          <div className="flex items-center justify-center gap-1 font-bold text-[#944a00]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MealMitra Prototype</span>
          </div>
          <p className="mt-0.5 text-[10px] text-[#564337]/80">Zero auth friction • 3 Live Views</p>
        </div>
      </div>
    </aside>
  );
};
