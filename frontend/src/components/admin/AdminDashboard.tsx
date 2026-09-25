import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  Users,
  ChefHat,
  Bike,
  Activity,
  ClipboardList,
  Banknote,
  Repeat,
  ShoppingBag,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  BarChart3,
  PieChart,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    cooks,
    subscriptions,
    clusterStops,
    routeStops,
    deliveryPartnerState,
    setAdminTab,
  } = useApp();
  const { users } = useAuth();

  // 1. Real Customer Calculations (unified deduplication matching User Management)
  const realCustomers = useMemo(() => {
    const authCustomers = users.filter((u) => u.role === 'customer');
    const allCustomerIdentifiers = new Set<string>();

    authCustomers.forEach((c) => {
      if (c.name) allCustomerIdentifiers.add(c.name.trim().toLowerCase());
    });
    (orders || []).forEach((o) => {
      if (o.customerName) allCustomerIdentifiers.add(o.customerName.trim().toLowerCase());
    });
    (subscriptions || []).forEach((s) => {
      if (s.customerName) allCustomerIdentifiers.add(s.customerName.trim().toLowerCase());
    });

    return Array.from(allCustomerIdentifiers);
  }, [users, subscriptions, orders]);

  const activeSubscribersCount = useMemo(() => {
    return (subscriptions || []).filter((s) => s.status === 'Active').length;
  }, [subscriptions]);

  // 2. Real Home Cook Calculations
  const openKitchensCount = useMemo(() => {
    return cooks.filter((c) => c.kitchenOpen).length;
  }, [cooks]);

  const pendingCookAppsCount = useMemo(() => {
    return users.filter((u) => u.status === 'pending' && u.role === 'cook').length;
  }, [users]);

  // 3. Real Delivery Fleet Calculations
  const registeredRiders = useMemo(() => {
    return users.filter((u) => u.role === 'delivery');
  }, [users]);

  const deliveryFleetCount = registeredRiders.length > 0 ? registeredRiders.length : 1;
  const activeEnRouteStops = (clusterStops || []).filter((s) => s.status !== 'Delivered').length;
  const totalCompletedDeliveries =
    (orders || []).filter((o) => o.status === 'Delivered').length +
    (subscriptions || []).reduce((acc, s) => acc + (s.mealsDeliveredCount || 0), 0);

  // 4. Real Revenue Calculations
  const directOrdersRevenue = useMemo(() => {
    return (orders || []).reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [orders]);

  const subscriptionsRevenue = useMemo(() => {
    return (subscriptions || []).reduce((sum, s) => sum + (Number(s.planPrice) || 0), 0);
  }, [subscriptions]);

  const grossVolume = directOrdersRevenue + subscriptionsRevenue;
  const platformFeePercentage = 10; // 10% platform commission
  const platformRevenue = Math.round(grossVolume * (platformFeePercentage / 100));

  // 5. Real Order Cycle Tracking
  const preparingOrders = (orders || []).filter(
    (o) => o.status === 'Confirmed' || o.status === 'Preparing'
  ).length;
  const outForDeliveryOrders = (orders || []).filter(
    (o) => o.status === 'Out for Delivery' || o.status === 'On the way' || o.status === 'Ready'
  ).length;
  const deliveredOrders = (orders || []).filter((o) => o.status === 'Delivered').length;
  const totalOrdersCount = orders.length || 1;

  // 6. Live Activity Stream (Orders + Subscriptions + Deliveries)
  const combinedActivity = useMemo(() => {
    const list: {
      id: string;
      title: string;
      subtitle: string;
      tag: string;
      tagColor: string;
      time: string;
      image?: string;
      amount?: number;
    }[] = [];

    (orders || []).forEach((o) => {
      list.push({
        id: `ord-${o.id}`,
        title: `${o.customerName} ordered ${o.mealName}`,
        subtitle: `Kitchen: ${o.cookName} • ${o.deliveryAddress || 'Ahmedabad'}`,
        tag: o.status,
        tagColor:
          o.status === 'Delivered'
            ? 'bg-emerald-100 text-emerald-800'
            : o.status === 'Cancelled'
            ? 'bg-red-100 text-red-700'
            : 'bg-amber-100 text-amber-800',
        time: o.orderTime || 'Just now',
        image: o.mealImage || o.cookAvatar,
        amount: o.totalAmount,
      });
    });

    (subscriptions || []).forEach((s) => {
      list.push({
        id: `sub-${s.id}`,
        title: `${s.customerName} subscribed to ${s.planName}`,
        subtitle: `Chef ${s.cookName} • ${s.planCategory} (${s.planPeriod})`,
        tag: `Subscribed (${s.status})`,
        tagColor: 'bg-indigo-100 text-indigo-800',
        time: s.startDate || 'Recently',
        image: s.cookAvatar,
        amount: s.planPrice,
      });
    });

    return list.slice(0, 6);
  }, [orders, subscriptions]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2.5">
            <span>Platform Overview & Live Analytics</span>
          </h2>
          <p className="text-sm text-[#564337] mt-1">
            Real-time ecosystem metrics across Customers, Home Kitchens, and Delivery Fleet
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Real-time Live Sync</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Customers */}
        <div
          onClick={() => setAdminTab('users')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs relative overflow-hidden cursor-pointer hover:border-[#944a00] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
              Ecosystem
            </span>
          </div>
          <div className="text-xs font-bold text-[#564337] uppercase tracking-wider">Total Customers</div>
          <div className="text-3xl font-black text-[#1a1c1c] mt-1 group-hover:scale-105 transition-transform origin-left">
            {realCustomers.length}
          </div>
          <p className="text-xs text-emerald-700 mt-2 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{activeSubscribersCount} Active Subscribers</span>
          </p>
        </div>

        {/* Metric 2: Home Cooks */}
        <div
          onClick={() => setAdminTab('users')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs relative overflow-hidden cursor-pointer hover:border-emerald-600 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {openKitchensCount} Open
            </span>
          </div>
          <div className="text-xs font-bold text-[#564337] uppercase tracking-wider">Home Kitchens</div>
          <div className="text-3xl font-black text-[#1a1c1c] mt-1 group-hover:scale-105 transition-transform origin-left">
            {cooks.length}
          </div>
          <p className="text-xs text-[#564337] mt-2 font-semibold flex items-center gap-1">
            <span>{pendingCookAppsCount > 0 ? `+${pendingCookAppsCount} pending review` : 'All certified verified'}</span>
          </p>
        </div>

        {/* Metric 3: Delivery Partners */}
        <div
          onClick={() => setAdminTab('users')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs relative overflow-hidden cursor-pointer hover:border-blue-600 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
              <Bike className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {deliveryPartnerState?.isOnline ? 'Online' : 'Fleet Ready'}
            </span>
          </div>
          <div className="text-xs font-bold text-[#564337] uppercase tracking-wider">Delivery Fleet</div>
          <div className="text-3xl font-black text-[#1a1c1c] mt-1 group-hover:scale-105 transition-transform origin-left">
            {deliveryFleetCount}
          </div>
          <p className="text-xs text-[#564337] mt-2 font-semibold flex items-center gap-1">
            <span>{activeEnRouteStops} cluster stops assigned</span>
          </p>
        </div>

        {/* Metric 4: Platform Revenue */}
        <div
          onClick={() => setAdminTab('financials')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs relative overflow-hidden cursor-pointer hover:border-indigo-600 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shadow-2xs">
              <Banknote className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {platformFeePercentage}% Fee
            </span>
          </div>
          <div className="text-xs font-bold text-[#564337] uppercase tracking-wider">Platform Revenue</div>
          <div className="text-3xl font-black text-[#1a1c1c] mt-1 group-hover:scale-105 transition-transform origin-left">
            ₹{platformRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-[#564337] mt-2 font-semibold">
            Gross Volume: ₹{grossVolume.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Visual Analytics & Breakdown Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GMV & Revenue Velocity Graph Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-4 border-b border-[#eeeeed]">
            <div>
              <h3 className="font-bold text-[#1a1c1c] text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#944a00]" />
                <span>Financial Volume & Channel Breakdown</span>
              </h3>
              <p className="text-xs text-[#564337]">
                Live split between Direct Meal Orders and Recurring Tiffin Subscriptions
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#944a00]">
                <span className="w-3 h-3 rounded-sm bg-[#944a00]"></span> Direct Orders
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-3 h-3 rounded-sm bg-emerald-600"></span> Subscriptions
              </span>
            </div>
          </div>

          {/* Graphical Bars Comparison */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-[#1a1c1c]">Direct Orders GMV</span>
                <span className="text-[#944a00]">₹{directOrdersRevenue.toLocaleString()} ({grossVolume > 0 ? Math.round((directOrdersRevenue / grossVolume) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
                <div
                  className="bg-[#944a00] h-3.5 rounded-full transition-all duration-700"
                  style={{ width: `${grossVolume > 0 ? (directOrdersRevenue / grossVolume) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-[#1a1c1c]">Recurring Tiffin Subscriptions MRR</span>
                <span className="text-emerald-700">₹{subscriptionsRevenue.toLocaleString()} ({grossVolume > 0 ? Math.round((subscriptionsRevenue / grossVolume) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-3.5 rounded-full transition-all duration-700"
                  style={{ width: `${grossVolume > 0 ? (subscriptionsRevenue / grossVolume) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#eeeeed] text-center">
              <div className="p-3 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40">
                <div className="text-[11px] font-bold text-[#564337]">Total GMV</div>
                <div className="text-lg font-black text-[#1a1c1c] mt-0.5">₹{grossVolume.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40">
                <div className="text-[11px] font-bold text-[#564337]">Cook Payouts (80%)</div>
                <div className="text-lg font-black text-emerald-700 mt-0.5">₹{Math.round(grossVolume * 0.8).toLocaleString()}</div>
              </div>
              <div className="p-3 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40">
                <div className="text-[11px] font-bold text-[#564337]">Fleet Share (10%)</div>
                <div className="text-lg font-black text-blue-700 mt-0.5">₹{Math.round(grossVolume * 0.1).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Order Status Cycle Panel */}
        <div className="bg-gradient-to-br from-[#8f4100] to-[#51634c] p-6 rounded-2xl shadow-lg relative overflow-hidden text-white flex flex-col justify-between">
          <div className="space-y-4 relative z-10">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
                Active Operations
              </span>
              <h3 className="font-extrabold text-xl mt-1.5">Live Order & Tiffin Cycle</h3>
              <p className="text-white/80 text-xs">Real-time status across active batches</p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white/90">Confirmed & Preparing</span>
                  <span>{preparingOrders} active</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <div
                    className="bg-amber-300 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(preparingOrders / totalOrdersCount) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white/90">Out for Delivery</span>
                  <span>{outForDeliveryOrders} en route</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <div
                    className="bg-sky-300 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(outForDeliveryOrders / totalOrdersCount) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white/90">Completed / Delivered</span>
                  <span>{deliveredOrders} delivered</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <div
                    className="bg-emerald-300 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(deliveredOrders / totalOrdersCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 relative z-10">
            <button
              onClick={() => setAdminTab('orders')}
              className="w-full py-2.5 bg-white hover:bg-[#faf9f8] text-[#944a00] font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Manage Live Orders & Tracking</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Platform Activity Feed */}
      <div className="bg-white p-6 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#eeeeed]">
          <h3 className="font-bold text-[#1a1c1c] text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <span>Live Ecosystem Activity Feed</span>
          </h3>
          <button
            onClick={() => setAdminTab('orders')}
            className="text-xs font-bold text-[#944a00] hover:underline cursor-pointer"
          >
            View All ({orders.length + (subscriptions?.length || 0)})
          </button>
        </div>

        <div className="divide-y divide-[#eeeeed]">
          {combinedActivity.map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#faf9f8] px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-10 h-10 rounded-xl object-cover border border-[#dcc1b1]/40 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#944a00] flex items-center justify-center font-bold text-sm shrink-0">
                    🍱
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1a1c1c] truncate">{item.title}</p>
                  <p className="text-xs text-[#564337] truncate">{item.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                {item.amount && (
                  <span className="font-black text-sm text-[#1a1c1c]">
                    ₹{item.amount.toLocaleString()}
                  </span>
                )}
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${item.tagColor}`}>
                  {item.tag}
                </span>
                <span className="text-[11px] text-[#564337]">{item.time}</span>
              </div>
            </div>
          ))}

          {combinedActivity.length === 0 && (
            <div className="p-8 text-center text-[#564337]">
              <p className="text-sm font-medium">No live orders or subscriptions yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
