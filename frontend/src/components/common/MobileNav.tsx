import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  ShoppingBag,
  CalendarDays,
  User,
  ChefHat,
  Flame,
  BookOpen,
  TrendingUp,
  PackageCheck,
  Navigation,
  Bike,
  Wallet,
  Home,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const {
    role,
    setRole,
    customerTab,
    setCustomerTab,
    cookTab,
    setCookTab,
    deliveryTab,
    setDeliveryTab,
    setSelectedCookId,
  } = useApp();

  if (role === 'entry') return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#dcc1b1] shadow-lg px-2 py-1.5 flex justify-around items-center">
      {role === 'customer' && (
        <>
          <button
            onClick={() => {
              setSelectedCookId(null);
              setRole('entry');
            }}
            className="flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-bold text-[#944a00] transition-colors"
            title="Return to Landing Page"
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Landing</span>
          </button>
          <button
            onClick={() => {
              setSelectedCookId(null);
              setCustomerTab('dashboard');
            }}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
              customerTab === 'dashboard' ? 'text-[#944a00]' : 'text-[#564337]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => {
              setSelectedCookId(null);
              setCustomerTab('discover');
            }}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
              customerTab === 'discover' ? 'text-[#944a00]' : 'text-[#564337]'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span>Discover</span>
          </button>
          <button
            onClick={() => setCustomerTab('orders')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
              customerTab === 'orders' ? 'text-[#944a00]' : 'text-[#564337]'
            }`}
          >
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            <span>Orders</span>
          </button>
          <button
            onClick={() => setCustomerTab('subscriptions')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
              customerTab === 'subscriptions' ? 'text-[#944a00]' : 'text-[#564337]'
            }`}
          >
            <CalendarDays className="w-5 h-5 mb-0.5" />
            <span>Tiffins</span>
          </button>
        </>
      )}

      {role === 'cook' && (
        <>
          <button
            onClick={() => {
              setSelectedCookId(null);
              setRole('entry');
            }}
            className="flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-bold text-[#944a00] transition-colors"
            title="Return to Landing Page"
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Landing</span>
          </button>
          <button
            onClick={() => setCookTab('dashboard')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
              cookTab === 'dashboard' ? 'text-[#944a00]' : 'text-[#564337]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setCookTab('kitchen')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
              cookTab === 'kitchen' ? 'text-[#944a00]' : 'text-[#564337]'
            }`}
          >
            <Flame className="w-5 h-5 mb-0.5" />
            <span>Kitchen</span>
          </button>
          <button
            onClick={() => setCookTab('orders')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
              cookTab === 'orders' ? 'text-[#944a00]' : 'text-[#564337]'
            }`}
          >
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            <span>Orders</span>
          </button>
          <button
            onClick={() => setCookTab('menu')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
              cookTab === 'menu' ? 'text-[#944a00]' : 'text-[#564337]'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span>Weekly</span>
          </button>
        </>
      )}

      {role === 'delivery' && (
        <>
          <button
            onClick={() => {
              setSelectedCookId(null);
              setRole('entry');
            }}
            className="flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-bold text-[#944a00] transition-colors"
            title="Return to Landing Page"
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Landing</span>
          </button>
          <button
            onClick={() => setDeliveryTab('dashboard')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
              deliveryTab === 'dashboard' ? 'text-[#944a00]' : 'text-[#564337]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setDeliveryTab('deliveries')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
              deliveryTab === 'deliveries' ? 'text-[#944a00]' : 'text-[#564337]'
            }`}
          >
            <PackageCheck className="w-5 h-5 mb-0.5" />
            <span>Deliveries</span>
          </button>
          <button
            onClick={() => setDeliveryTab('route')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
              deliveryTab === 'route' ? 'text-[#944a00]' : 'text-[#564337]'
            }`}
          >
            <Navigation className="w-5 h-5 mb-0.5" />
            <span>Route</span>
          </button>
          <button
            onClick={() => setDeliveryTab('earnings')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
              deliveryTab === 'earnings' ? 'text-[#944a00]' : 'text-[#564337]'
            }`}
          >
            <Wallet className="w-5 h-5 mb-0.5" />
            <span>Earnings</span>
          </button>
        </>
      )}
    </nav>
  );
};
