import React from 'react';
import { UserRole } from './types';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { EntryScreen } from './components/entry/EntryScreen';

// Customer Components
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { CustomerDiscover } from './components/customer/CustomerDiscover';
import { CustomerTodaysMeals } from './components/customer/CustomerTodaysMeals';
import { CustomerOrders } from './components/customer/CustomerOrders';
import { CustomerSubscriptions } from './components/customer/CustomerSubscriptions';
import { CustomerFollowingReviews } from './components/customer/CustomerFollowingReviews';
import { CustomerProfile } from './components/customer/CustomerProfile';
import { CustomerOrderModal } from './components/customer/CustomerOrderModal';

// Home Cook Components
import { CookDashboard } from './components/cook/CookDashboard';
import { CookKitchenManager } from './components/cook/CookKitchenManager';
import { CookWeeklyMenu } from './components/cook/CookWeeklyMenu';
import { CookOrders } from './components/cook/CookOrders';
import { CookSubscriptions } from './components/cook/CookSubscriptions';
import { CookSubscribers } from './components/cook/CookSubscribers';
import { CookEarningsAnalytics } from './components/cook/CookEarningsAnalytics';
import { CookProfileSettings } from './components/cook/CookProfileSettings';

// Delivery Partner Components
import { DeliveryDashboard } from './components/delivery/DeliveryDashboard';
import { DeliveryRouteCluster } from './components/delivery/DeliveryRouteCluster';
import { DeliveryPickups } from './components/delivery/DeliveryPickups';
import { DeliveryActive } from './components/delivery/DeliveryActive';
import { DeliveryHistoryEarnings } from './components/delivery/DeliveryHistoryEarnings';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminApplications } from './components/admin/AdminApplications';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminFinancials } from './components/admin/AdminFinancials';
import { AdminSettings } from './components/admin/AdminSettings';

const MainLayout: React.FC = () => {
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
    selectedMealForOrder,
    setSelectedMealForOrder,
    setSelectedCookId,
  } = useApp();

  const { currentUser } = useAuth();

  // Ensure authenticated user role is synced, and unauthenticated users return to entry screen
  React.useEffect(() => {
    if (currentUser) {
      if (role === 'entry' || !role) {
        const savedRole = (localStorage.getItem('mealmitra_role') as UserRole) || currentUser.role;
        setRole(savedRole && savedRole !== 'entry' ? savedRole : currentUser.role);
      }
    } else {
      const savedUser = localStorage.getItem('mealmitra_currentUser');
      if (!savedUser && role !== 'entry') {
        setRole('entry');
      }
    }
  }, [currentUser, role, setRole]);

  return (
    <div className="min-h-screen bg-[#faf9f8] flex flex-col font-sans text-[#1a1c1c] selection:bg-[#ffdcc5] selection:text-[#944a00]">
      {/* Top Universal App Header */}
      <Header />

      {/* Main Container */}
      {!currentUser || role === 'entry' ? (
        <main className="flex-1">
          <EntryScreen />
        </main>
      ) : (
        <div className="flex-1 flex w-full">
          {/* Left Navigation Sidebar */}
          <Sidebar />

          {/* Dynamic Content View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-10 overflow-y-auto">
            {/* Customer Role Views */}

            {role === 'customer' && (
              <>
                {customerTab === 'dashboard' && <CustomerDashboard />}
                {customerTab === 'discover' && <CustomerDiscover />}
                {customerTab === 'meals' && <CustomerTodaysMeals />}
                {customerTab === 'orders' && <CustomerOrders />}
                {customerTab === 'subscriptions' && <CustomerSubscriptions />}
                {customerTab === 'following' && <CustomerFollowingReviews viewMode="following" />}
                {customerTab === 'reviews' && <CustomerFollowingReviews viewMode="reviews" />}
                {customerTab === 'profile' && <CustomerProfile />}
              </>
            )}

            {/* Home Cook Role Views */}
            {role === 'cook' && (
              <>
                {cookTab === 'dashboard' && <CookDashboard />}
                {cookTab === 'profile' && <CookProfileSettings />}
                {cookTab === 'kitchen' && <CookKitchenManager />}
                {cookTab === 'menu' && <CookWeeklyMenu />}
                {cookTab === 'orders' && <CookOrders />}
                {cookTab === 'subscriptions' && <CookSubscriptions />}
                {cookTab === 'customers' && <CookSubscribers />}
                {cookTab === 'earnings' && <CookEarningsAnalytics />}
              </>
            )}

            {/* Delivery Partner Role Views */}
            {role === 'delivery' && (
              <>
                {deliveryTab === 'dashboard' && <DeliveryDashboard />}
                {deliveryTab === 'deliveries' && <DeliveryRouteCluster />}
                {deliveryTab === 'pickup' && <DeliveryPickups />}
                {deliveryTab === 'active' && <DeliveryActive />}
                {deliveryTab === 'history' && <DeliveryHistoryEarnings defaultTab="history" />}
                {deliveryTab === 'earnings' && <DeliveryHistoryEarnings defaultTab="earnings" />}
                {deliveryTab === 'performance' && <DeliveryHistoryEarnings defaultTab="performance" />}
              </>
            )}

            {/* Admin Role Views */}
            {role === 'admin' && (
              <>
                {adminTab === 'dashboard' && <AdminDashboard />}
                {adminTab === 'users' && <AdminUsers />}
                {adminTab === 'applications' && <AdminApplications />}
                {adminTab === 'orders' && <AdminOrders />}
                {adminTab === 'financials' && <AdminFinancials />}
                {adminTab === 'settings' && <AdminSettings />}
              </>
            )}
          </main>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Global Meal Order Checkout Modal */}
      {selectedMealForOrder && (
        <CustomerOrderModal
          meal={selectedMealForOrder}
          onClose={() => setSelectedMealForOrder(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
