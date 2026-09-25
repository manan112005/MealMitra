import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Flame,
  ShoppingBag,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ChefHat,
} from 'lucide-react';

export const CookDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    currentCookProfile,
    updateKitchenStatus,
    orders,
    subscriptions,
    updateOrderStatus,
    setCookTab,
  } = useApp();

  const cookOrders = (orders || []).filter(
    (o) =>
      currentCookProfile &&
      ((o.cookId && o.cookId === currentCookProfile.id) ||
        (o.cookName && o.cookName.toLowerCase() === currentCookProfile.name.toLowerCase()))
  );
  const pendingOrders = cookOrders.filter((o) => o.status === 'Confirmed' || o.status === 'Preparing');

  const cookSubscribers = (subscriptions || []).filter((sub) => {
    if (!currentCookProfile) return false;
    const matchId = Boolean(sub.cookId && sub.cookId === currentCookProfile.id);
    const cookNameNormalized = (currentCookProfile.name || '').toLowerCase().trim();
    const chefNameNormalized = (currentCookProfile.chefName || '').toLowerCase().trim();
    const subCookName = (sub.cookName || '').toLowerCase().trim();
    const matchName = Boolean(
      subCookName &&
      (subCookName === cookNameNormalized ||
        subCookName === chefNameNormalized ||
        (cookNameNormalized && (subCookName.includes(cookNameNormalized) || cookNameNormalized.includes(subCookName))) ||
        (chefNameNormalized && (subCookName.includes(chefNameNormalized) || chefNameNormalized.includes(subCookName))))
    );
    return matchId || matchName;
  });

  const ordersRevenue = cookOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const handleToggleKitchen = () => {
    updateKitchenStatus({
      kitchenOpen: !currentCookProfile.kitchenOpen,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Kitchen Live Control Banner */}
      <section className="bg-white rounded-2xl border-2 border-[#51634c]/40 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#eeeeed]">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm transition-colors ${
                currentCookProfile.kitchenOpen ? 'bg-[#51634c]' : 'bg-red-500'
              }`}
            >
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1a1c1c]">
                  {currentCookProfile.name}'s Kitchen
                </h2>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    currentCookProfile.kitchenOpen
                      ? 'bg-[#d1e6c9] text-[#51634c]'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {currentCookProfile.kitchenOpen ? '● Accepting Orders' : '● Closed'}
                </span>
              </div>
              <p className="text-xs font-bold text-[#944a00] mt-0.5 flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5" />
                <span>Head Chef: {currentUser?.name || currentCookProfile.chefName || 'Home Cook'}</span>
              </p>
              <p className="text-xs text-[#564337] mt-0.5">
                {currentCookProfile.kitchenOpen
                  ? 'Your menu is visible to neighborhood customers with live availability.'
                  : 'Kitchen is currently offline. Customers cannot place new orders.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleKitchen}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 ${
                currentCookProfile.kitchenOpen
                  ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                  : 'bg-[#51634c] hover:bg-[#3d4b39] text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>{currentCookProfile.kitchenOpen ? 'Close Kitchen for Today' : 'Open Kitchen Now'}</span>
            </button>

            <button
              onClick={() => setCookTab('kitchen')}
              className="px-4 py-2.5 bg-[#faf9f8] hover:bg-[#eeeeed] text-[#564337] border border-[#dcc1b1] text-xs font-bold rounded-xl transition-colors"
            >
              Manage Slots
            </button>
          </div>
        </div>

        {/* Real-time Lunch & Dinner Available Steppers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-[#944a00]">Today's Lunch Capacity</div>
              <div className="text-base font-extrabold text-[#1a1c1c] mt-0.5">
                {currentCookProfile.lunchAvailableQty} of {currentCookProfile.lunchTotalQty} Meals Remaining
              </div>
              <div className="text-[11px] text-[#564337] mt-0.5">Slot: 12:30 PM – 2:00 PM</div>
            </div>
            <button
              onClick={() => setCookTab('kitchen')}
              className="px-3 py-1.5 text-xs font-bold text-[#944a00] hover:underline"
            >
              Update Qty ➔
            </button>
          </div>

          <div className="p-4 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-[#51634c]">Today's Dinner Capacity</div>
              <div className="text-base font-extrabold text-[#1a1c1c] mt-0.5">
                {currentCookProfile.dinnerAvailableQty} of {currentCookProfile.dinnerTotalQty} Meals Remaining
              </div>
              <div className="text-[11px] text-[#564337] mt-0.5">Slot: 7:30 PM – 9:00 PM</div>
            </div>
            <button
              onClick={() => setCookTab('kitchen')}
              className="px-3 py-1.5 text-xs font-bold text-[#51634c] hover:underline"
            >
              Update Qty ➔
            </button>
          </div>
        </div>
      </section>

      {/* Quick Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setCookTab('orders')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#944a00] transition-all group"
        >
          <div className="flex items-center gap-2 text-[#564337] mb-2">
            <ShoppingBag className="w-4 h-4 text-[#944a00]" />
            <span className="text-xs font-bold">Today's Orders</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#944a00] group-hover:scale-105 transition-transform origin-left">
            {cookOrders.length}
          </div>
          <span className="text-[11px] text-[#564337]/80 mt-1 block">
            {pendingOrders.length} pending in kitchen
          </span>
        </div>

        <div
          onClick={() => setCookTab('earnings')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#51634c] transition-all group"
        >
          <div className="flex items-center gap-2 text-[#564337] mb-2">
            <TrendingUp className="w-4 h-4 text-[#51634c]" />
            <span className="text-xs font-bold">Today's Revenue</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#51634c] group-hover:scale-105 transition-transform origin-left">
            ₹{ordersRevenue > 0 ? ordersRevenue.toLocaleString() : (cookSubscribers.length > 0 ? (cookSubscribers.length * 3499).toLocaleString() : '0')}
          </div>
          <span className="text-[11px] text-[#51634c] font-semibold mt-1 block">Live kitchen payouts</span>
        </div>

        <div
          onClick={() => setCookTab('customers')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#944a00] transition-all group"
        >
          <div className="flex items-center gap-2 text-[#564337] mb-2">
            <Users className="w-4 h-4 text-[#944a00]" />
            <span className="text-xs font-bold">Active Subscribers</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#944a00] group-hover:scale-105 transition-transform origin-left">
            {cookSubscribers.length}
          </div>
          <span className="text-[11px] text-[#564337]/80 mt-1 block">Daily lunch & dinner tiffins</span>
        </div>

        <div
          onClick={() => setCookTab('profile')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#51634c] transition-all group"
        >
          <div className="flex items-center gap-2 text-[#564337] mb-2">
            <ShieldCheck className="w-4 h-4 text-[#51634c]" />
            <span className="text-xs font-bold">Hygiene Score</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#51634c] group-hover:scale-105 transition-transform origin-left">
            98%
          </div>
          <span className="text-[11px] text-[#564337]/80 mt-1 block">FSSAI Certified Gold</span>
        </div>
      </section>

      {/* AI Demand Prediction Box */}
      <section className="bg-gradient-to-r from-[#faf9f8] via-[#ffdcc5]/20 to-[#d1e6c9]/20 rounded-2xl border border-[#dcc1b1]/60 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#944a00] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1a1c1c]">AI Predictive Kitchen Insights</h3>
              <p className="text-[11px] text-[#564337]">Smart recommendations based on historical neighborhood demand & weather</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#dcc1b1] text-[#944a00]">
            AI Forecast
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-[#dcc1b1]/40 space-y-1">
            <div className="font-bold text-[#944a00]">📈 Lunch Demand Spike (+22%)</div>
            <p className="text-[#564337] text-[11px]">
              High demand detected for Gujarati Deluxe Thali today due to nearby office cluster subscriptions.
            </p>
            <div className="font-bold text-[#1a1c1c] text-[11px] pt-1">Recommended Prep: 28 Meals</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#dcc1b1]/40 space-y-1">
            <div className="font-bold text-[#51634c]">🥣 Evening Comfort Dinner</div>
            <p className="text-[#564337] text-[11px]">
              Weather shows slight evening rain. Customers prefer warm Khichdi & Kadhi combis.
            </p>
            <div className="font-bold text-[#1a1c1c] text-[11px] pt-1">Recommended Prep: 22 Meals</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#dcc1b1]/40 space-y-1">
            <div className="font-bold text-[#4e6074]">📦 Packaging & Delivery Prep</div>
            <p className="text-[#564337] text-[11px]">
              Assigned cluster delivery partner scheduled for 12:45 PM batch pickup.
            </p>
            <div className="font-bold text-[#1a1c1c] text-[11px] pt-1">Pickup Window: 12:45 – 1:00 PM</div>
          </div>
        </div>
      </section>

      {/* Live Order Queue */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-[#1a1c1c]">Live Orders in Queue</h3>
            <p className="text-xs text-[#564337]">Orders currently in your kitchen pipeline</p>
          </div>
          <button
            onClick={() => setCookTab('orders')}
            className="text-xs font-bold text-[#944a00] hover:underline flex items-center gap-1"
          >
            <span>View All Processing Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {cookOrders.slice(0, 3).map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#dcc1b1]/50 p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1a1c1c]">{order.id}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#ffdcc5] text-[#944a00]">
                    {order.status}
                  </span>
                  <span className="text-xs text-[#564337]">{order.deliveryTimeSlot}</span>
                </div>

                <div className="text-xs text-[#564337]">
                  Customer: <strong className="text-[#1a1c1c]">{order.customerName}</strong> ({order.customerPhone})
                </div>

                <div className="text-xs font-semibold text-[#1a1c1c]">
                  Items: {(order as any).items ? (order as any).items.map((it: any) => `${it.quantity}x ${it.mealName}`).join(', ') : `${order.quantity}x ${order.mealName}`}
                </div>

                {order.specialNotes && (
                  <div className="text-[11px] text-[#944a00] font-medium bg-[#ffdcc5]/30 px-2 py-0.5 rounded inline-block">
                    Note: "{order.specialNotes}"
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {order.status === 'Confirmed' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Preparing')}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                  >
                    Accept & Start Cooking
                  </button>
                )}
                {order.status === 'Preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Picked Up')}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-[#51634c] hover:bg-[#3d4b39] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                  >
                    Handover to Rider
                  </button>
                )}
                {order.status === 'Picked Up' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-[#51634c] hover:bg-[#3d4b39] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                  >
                    Mark Delivered ✓
                  </button>
                )}
                {order.status === 'Delivered' && (
                  <span className="text-xs font-bold text-[#51634c] bg-[#d1e6c9]/60 px-3 py-1 rounded-lg">
                    ✓ Delivered
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
