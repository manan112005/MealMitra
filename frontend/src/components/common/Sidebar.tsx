import React from 'react';
import { useApp } from '../../context/AppContext';
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
} from 'lucide-react';

export const Sidebar: React.FC = () => {
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
  const customerNavItems: { id: CustomerTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'discover', label: 'Discover Cooks', icon: Compass },
    { id: 'meals', label: "Today's Meals", icon: Utensils },
    { id: 'orders', label: 'Orders & Tracking', icon: ShoppingBag },
    { id: 'subscriptions', label: 'Subscriptions', icon: CalendarDays },
    { id: 'following', label: 'Following', icon: Heart },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  // Cook navigation items
  const cookNavItems: { id: CookTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Business Profile', icon: ChefHat },
    { id: 'kitchen', label: "Today's Kitchen", icon: Flame },
    { id: 'menu', label: 'Weekly Menu Manager', icon: BookOpen },
    { id: 'orders', label: 'Order Processing', icon: ShoppingBag },
    { id: 'customers', label: 'Subscribers & Customers', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
    { id: 'earnings', label: 'Earnings & Payouts', icon: Wallet },
    { id: 'analytics', label: 'Analytics & AI Insights', icon: TrendingUp },
    { id: 'settings', label: 'Kitchen Settings', icon: Settings },
  ];

  // Delivery navigation items
  const deliveryNavItems: { id: DeliveryTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deliveries', label: "Today's Deliveries", icon: PackageCheck },
    { id: 'route', label: 'Smart Cluster Route', icon: Navigation },
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
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
              alt="Jay Shah"
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#1a1c1c] truncate">Welcome, Jay Shah</p>
              <p className="text-[11px] text-[#564337] flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#51634c]"></span> Customer Role
              </p>
            </div>
          </div>
        )}

        {role === 'cook' && (
          <div className="flex items-center gap-3">
            <img
              src={currentCookProfile.avatar}
              alt={currentCookProfile.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#1a1c1c] truncate">{currentCookProfile.name}</p>
              <p className="text-[11px] text-[#944a00] font-medium flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${currentCookProfile.kitchenOpen ? 'bg-green-500' : 'bg-red-400'}`}></span>
                {currentCookProfile.kitchenOpen ? 'Kitchen Open' : 'Kitchen Closed'}
              </p>
            </div>
          </div>
        )}

        {role === 'delivery' && (
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
              alt="Ramesh Patel"
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#1a1c1c] truncate">Ramesh Patel</p>
              <p className="text-[11px] text-[#4e6074] font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> On Duty • 4.8★
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
          <button
            onClick={() => {
              setSelectedCookId(null);
              setRole('entry');
            }}
            className="w-full py-1.5 px-3 bg-white border border-[#dcc1b1] hover:bg-[#ffdcc5]/40 text-[#944a00] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-2xs"
            title="Return to Main Landing Page"
          >
            <Home className="w-3.5 h-3.5 text-[#944a00]" />
            <span>← Back to Landing Page</span>
          </button>

          <button
            onClick={() => {
              const nextRole: UserRole =
                role === 'customer' ? 'cook' : role === 'cook' ? 'delivery' : role === 'delivery' ? 'admin' : 'customer';
              setRole(nextRole);
            }}
            className="w-full py-1.5 px-3 bg-[#faf9f8] border border-[#dcc1b1]/60 hover:bg-[#eeeeed] text-[#564337] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Switch Role</span>
          </button>
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
