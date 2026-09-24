import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { EntryScreen } from './components/entry/EntryScreen';
import { Home, ArrowLeft } from 'lucide-react';

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

  // Ensure authenticated user role is preserved on page refresh
  React.useEffect(() => {
    if (currentUser && role === 'entry') {
      setRole(currentUser.role);
    }
  }, [currentUser, role, setRole]);

  return (
    <div className="min-h-screen bg-[#faf9f8] flex flex-col font-sans text-[#1a1c1c] selection:bg-[#ffdcc5] selection:text-[#944a00]">
      {/* Top Universal App Header */}
      <Header />

      {/* Main Container */}
      {role === 'entry' ? (
        <main className="flex-1">
          <EntryScreen />
        </main>
      ) : (
        <div className="flex-1 flex w-full">
          {/* Left Navigation Sidebar */}
          <Sidebar />

          {/* Dynamic Content View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-10 overflow-y-auto">
            {/* Global Quick Back to Landing Bar on all portal pages */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md border border-[#dcc1b1]/60 rounded-2xl px-4 sm:px-5 py-2.5 shadow-2xs">
              <div className="flex items-center gap-2 sm:gap-3">
                {((role === 'customer' && customerTab !== 'dashboard') ||
                  (role === 'cook' && cookTab !== 'dashboard') ||
                  (role === 'delivery' && deliveryTab !== 'dashboard') ||
                  (role === 'admin' && adminTab !== 'dashboard')) && (
                  <>
                    <button
                      onClick={() => {
                        if (role === 'customer') setCustomerTab('dashboard');
                        else if (role === 'cook') setCookTab('dashboard');
                        else if (role === 'delivery') setDeliveryTab('dashboard');
                        else if (role === 'admin') setAdminTab('dashboard');
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ffdcc5]/60 hover:bg-[#ffdcc5] text-[#944a00] font-bold text-xs transition-all shadow-2xs hover:shadow-xs group"
                      title="Go to dashboard"
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                      <span>← Back</span>
                    </button>
                    <div className="h-4 w-px bg-[#dcc1b1]/50 hidden sm:block"></div>
                  </>
                )}

                <div className="text-xs text-[#564337] flex items-center gap-1.5">
                  <span className="capitalize font-semibold text-[#1a1c1c]">
                    {role === 'customer' ? 'Customer Portal' : role === 'cook' ? 'Home Cook Portal' : role === 'delivery' ? 'Delivery Partner Portal' : 'Admin Portal'}
                  </span>
                  <span>/</span>
                  <span className="text-[#944a00] font-bold capitalize">
                    {role === 'customer' ? customerTab : role === 'cook' ? cookTab : role === 'delivery' ? deliveryTab : adminTab}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.history.back()}
                  className="text-xs text-[#564337] hover:text-[#944a00] flex items-center gap-1 font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Back</span>
                </button>
              </div>
            </div>

            {/* Customer Role Views */}
            {role === 'customer' && (
              <>
                {customerTab === 'dashboard' && <CustomerDashboard />}
                {customerTab === 'discover' && <CustomerDiscover />}
                {customerTab === 'meals' && <CustomerTodaysMeals />}
                {customerTab === 'orders' && <CustomerOrders />}
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
