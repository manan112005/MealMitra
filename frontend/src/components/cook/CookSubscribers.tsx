import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Repeat,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Phone,
  Building,
  Home,
  UserCheck,
  TrendingUp,
  DollarSign,
  Tag,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export const CookSubscribers: React.FC = () => {
  const { currentCookProfile, subscriptions, setSubscriptions, getCookSubscriptionPlans } = useApp();
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Paused'>('All');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Lunch' | 'Dinner' | 'Both'>('All');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>('All');

  // Cook's offered plans
  const cookPlans = useMemo(() => {
    return getCookSubscriptionPlans(currentCookProfile.id);
  }, [currentCookProfile, getCookSubscriptionPlans]);

  // Filter subscriptions that belong to this cook
  const cookSubscribers = useMemo(() => {
    return (subscriptions || []).filter((sub) => {
      if (!currentCookProfile) return false;
      const matchId =
        sub.cookId &&
        (sub.cookId === currentCookProfile.id ||
          sub.cookId === 'cook-default');

      const currentNames = [
        currentCookProfile.name,
        currentCookProfile.chefName,
        'Magic mom',
        'Home Kitchen',
      ]
        .filter(Boolean)
        .map((n) => n!.toLowerCase().trim());

      const subCookName = (sub.cookName || '').toLowerCase().trim();
      const matchName =
        !sub.cookName ||
        currentNames.some(
          (cn) => subCookName.includes(cn) || cn.includes(subCookName) || subCookName.includes('kitchen')
        );

      const matchesCook = matchId || matchName;
      if (!matchesCook) return false;

      const matchesStatus = filterStatus === 'All' || sub.status === filterStatus;
      const matchesCategory =
        filterCategory === 'All' ||
        (filterCategory === 'Lunch' && (sub.planCategory?.includes('Lunch') || sub.planName.toLowerCase().includes('lunch'))) ||
        (filterCategory === 'Dinner' && (sub.planCategory?.includes('Dinner') || sub.planName.toLowerCase().includes('dinner'))) ||
        (filterCategory === 'Both' && (sub.planCategory?.includes('Lunch + Dinner') || sub.planName.toLowerCase().includes('full day')));

      const matchesPlan =
        selectedPlanFilter === 'All' ||
        sub.planId === selectedPlanFilter ||
        sub.planName.toLowerCase().includes(selectedPlanFilter.toLowerCase()) ||
        selectedPlanFilter.toLowerCase().includes(sub.planName.toLowerCase());

      return matchesStatus && matchesCategory && matchesPlan;
    });
  }, [subscriptions, currentCookProfile, filterStatus, filterCategory, selectedPlanFilter]);

  // Compute Revenue and Subscribers count per plan
  const planStats = useMemo(() => {
    return cookPlans.map((plan) => {
      const matchingSubs = cookSubscribers.filter((s) => {
        const isExactPlan =
          s.planId === plan.id ||
          s.planName.toLowerCase() === plan.name.toLowerCase() ||
          s.planName.toLowerCase().includes(plan.name.toLowerCase()) ||
          plan.name.toLowerCase().includes(s.planName.toLowerCase()) ||
          (s.planCategory === plan.category && s.planPeriod === plan.type);
        return isExactPlan;
      });

      const activeCount = matchingSubs.filter((s) => s.status === 'Active').length;
      const totalCount = matchingSubs.length;
      const revenue = matchingSubs.reduce((acc, curr) => acc + (curr.planPrice || plan.price), 0);

      return {
        plan,
        totalCount,
        activeCount,
        revenue,
      };
    });
  }, [cookPlans, cookSubscribers]);

  const totalMonthlyRevenue = useMemo(() => {
    return cookSubscribers.reduce((sum, s) => {
      const defaultPrice =
        cookPlans.find((p) => p.name === s.planName || p.category === s.planCategory)?.price || 3496;
      return sum + (s.planPrice || defaultPrice);
    }, 0);
  }, [cookSubscribers, cookPlans]);

  const handleToggleSubscriberStatus = (subId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
    setSubscriptions((prev) => {
      const updated = prev.map((s) => (s.id === subId ? { ...s, status: newStatus as any } : s));
      try {
        localStorage.setItem('mealmitra_subscriptions', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleFulfillMeal = (subId: string) => {
    setSubscriptions((prev) => {
      const updated = prev.map((s) => {
        if (s.id === subId) {
          const newDelivered = s.mealsDeliveredCount + 1;
          return {
            ...s,
            mealsDeliveredCount: Math.min(s.totalMealsCount, newDelivered),
          };
        }
        return s;
      });
      try {
        localStorage.setItem('mealmitra_subscriptions', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#944a00]" />
            <span>Active Tiffin Subscribers ({cookSubscribers.length})</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Track purchased subscription packages (Deluxe, Premium, Standard), customer prices, delivery schedules, and dietary instructions.
          </p>
        </div>

        {/* Global Monthly Subscription Revenue Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="p-3 bg-gradient-to-r from-[#ffdcc5]/50 to-[#d1e6c9]/50 rounded-2xl border border-[#dcc1b1]/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#51634c] text-white flex items-center justify-center font-black shadow-xs">
              ₹
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#564337]">
                Monthly Subscription Revenue
              </div>
              <div className="text-lg font-black text-[#944a00]">
                ₹{totalMonthlyRevenue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan-wise Breakdown Cards (Shows How Many Subscribed to Each Tier & Price) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#564337] uppercase tracking-wider">
          <span>Purchased Subscription Tiers & Pricing Breakdown</span>
          <span className="text-[11px] font-normal normal-case text-[#564337]">
            Click any plan card below to filter customers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {planStats.map(({ plan, totalCount, activeCount, revenue }) => {
            const isSelected = selectedPlanFilter === plan.name || selectedPlanFilter === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() =>
                  setSelectedPlanFilter((prev) => (prev === plan.name ? 'All' : plan.name))
                }
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 relative ${
                  isSelected
                    ? 'bg-[#ffdcc5]/40 border-[#944a00] shadow-sm ring-2 ring-[#944a00]/30'
                    : 'bg-white border-[#dcc1b1]/60 hover:border-[#944a00]/50 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#d1e6c9] text-[#51634c]">
                      {plan.category}
                    </span>
                    <h4 className="font-extrabold text-xs text-[#1a1c1c] mt-1 line-clamp-1">
                      {plan.name}
                    </h4>
                  </div>
                  <span className="text-sm font-black text-[#944a00] shrink-0">
                    ₹{plan.price.toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#eeeeed] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 font-bold text-[#1a1c1c]">
                    <Users className="w-3.5 h-3.5 text-[#944a00]" />
                    <span>{totalCount} {totalCount === 1 ? 'Customer' : 'Customers'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#51634c] bg-[#d1e6c9]/50 px-2 py-0.5 rounded-md">
                    ₹{revenue.toLocaleString()} / mo
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex gap-1 p-1 bg-white border border-[#dcc1b1]/60 rounded-xl shadow-2xs text-xs font-bold">
            {(['All', 'Active', 'Paused'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#944a00] text-white shadow-2xs'
                    : 'text-[#564337] hover:text-[#1a1c1c]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Slot Filter */}
          <div className="flex gap-1 p-1 bg-white border border-[#dcc1b1]/60 rounded-xl shadow-2xs text-xs font-bold">
            {(['All', 'Lunch', 'Dinner', 'Both'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-[#51634c] text-white shadow-2xs'
                    : 'text-[#564337] hover:text-[#1a1c1c]'
                }`}
              >
                {cat === 'Both' ? 'Lunch + Dinner' : cat}
              </button>
            ))}
          </div>
        </div>

        {selectedPlanFilter !== 'All' && (
          <button
            onClick={() => setSelectedPlanFilter('All')}
            className="text-xs font-bold text-[#944a00] hover:underline cursor-pointer"
          >
            Clear Plan Filter ({selectedPlanFilter}) ✕
          </button>
        )}
      </div>

      {/* Subscriber Cards List */}
      {cookSubscribers.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {cookSubscribers.map((sub) => {
            const initial = (sub.customerName || 'Customer').trim().charAt(0).toUpperCase();
            const isPaused = sub.status === 'Paused';

            // Resolve plan price
            const matchedPlan = cookPlans.find(
              (p) => p.name === sub.planName || p.category === sub.planCategory
            );
            const displayPrice = sub.planPrice || matchedPlan?.price || 3496;
            const pricePerMeal = Math.round(displayPrice / (sub.totalMealsCount || 26));

            return (
              <div
                key={sub.id}
                className={`bg-white rounded-2xl border p-6 shadow-2xs space-y-4 hover:shadow-xs transition-all ${
                  isPaused ? 'border-amber-200 bg-amber-50/20' : 'border-[#dcc1b1]/60'
                }`}
              >
                {/* Top Bar with Customer Details, Selected Plan Badge & Price */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 pb-4 border-b border-[#eeeeed]">
                  {/* Customer Info */}
                  <div className="flex items-center gap-3.5">
                    {sub.customerAvatar ? (
                      <img
                        src={sub.customerAvatar}
                        alt={sub.customerName}
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-[#ffdcc5] shadow-2xs shrink-0"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#ffdcc5] to-[#f5cbb1] text-[#944a00] flex items-center justify-center font-black text-lg shrink-0 shadow-2xs">
                        {initial}
                      </div>
                    )}

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-base text-[#1a1c1c]">{sub.customerName}</h3>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                            sub.status === 'Active'
                              ? 'bg-[#d1e6c9] text-[#51634c]'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              sub.status === 'Active' ? 'bg-[#51634c] animate-pulse' : 'bg-amber-600'
                            }`}
                          />
                          <span>{sub.status}</span>
                        </span>
                      </div>

                      <div className="text-xs text-[#564337] flex items-center gap-2 mt-0.5">
                        <a
                          href={`tel:${sub.customerPhone}`}
                          className="flex items-center gap-1 hover:underline text-[#944a00] font-semibold"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{sub.customerPhone}</span>
                        </a>
                        <span>•</span>
                        <span>Started: {sub.startDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Plan Tier Purchased & Price Badge */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Price Pill */}
                    <div className="p-3 bg-[#faf9f8] rounded-2xl border border-[#dcc1b1]/60 text-right min-w-[150px]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#564337]">
                        Plan Price Paid
                      </div>
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-xl font-black text-[#944a00]">
                          ₹{displayPrice.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-[#564337]">
                          /{sub.planPeriod || 'month'}
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold text-[#51634c]">
                        ₹{pricePerMeal}/meal • {sub.paymentMethod || 'UPI/Card (Paid)'}
                      </div>
                    </div>

                    {/* Plan Tier Tag */}
                    <div className="p-3 bg-[#faf9f8] rounded-2xl border border-[#dcc1b1]/60 text-left min-w-[170px]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#564337]">
                        Subscribed Tier
                      </div>
                      <div className="font-extrabold text-xs text-[#1a1c1c] truncate max-w-[200px]">
                        {sub.planName}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#944a00] mt-0.5">
                        <Tag className="w-3 h-3" />
                        <span>{sub.planCategory || 'Lunch Only'}</span>
                        <span>•</span>
                        <span>{sub.planPeriod || 'Monthly'}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="p-3 bg-[#faf9f8] rounded-2xl border border-[#dcc1b1]/60 text-right min-w-[120px]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#564337]">
                        Meal Fulfillment
                      </div>
                      <div className="font-black text-sm text-[#51634c]">
                        {sub.mealsDeliveredCount} / {sub.totalMealsCount} Meals
                      </div>
                      <div className="text-[10px] text-[#564337]">
                        {Math.max(0, sub.totalMealsCount - sub.mealsDeliveredCount)} remaining
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configured Addresses & Dietary Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 bg-[#faf9f8] p-4 rounded-xl border border-[#dcc1b1]/40">
                    <div className="font-bold text-[#1a1c1c] flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#944a00]" />
                      <span>Configured Drop Locations & Delivery Slots</span>
                    </div>
                    {sub.officeAddress && sub.officeAddress !== 'N/A' && (
                      <div className="flex items-start gap-2 text-[#564337]">
                        <Building className="w-4 h-4 text-[#944a00] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[#1a1c1c]">Lunch Drop: </span>
                          <span>{sub.officeAddress}</span>
                          <span className="text-[#944a00] font-semibold block text-[11px]">
                            Slot: {sub.lunchTiming || '1:00 PM – 1:30 PM'}
                          </span>
                        </div>
                      </div>
                    )}
                    {sub.deliveryAddress && (
                      <div className="flex items-start gap-2 text-[#564337]">
                        <Home className="w-4 h-4 text-[#51634c] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[#1a1c1c]">Dinner Drop: </span>
                          <span>{sub.deliveryAddress}</span>
                          <span className="text-[#51634c] font-semibold block text-[11px]">
                            Slot: {sub.dinnerTiming || '8:00 PM – 8:30 PM'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 bg-[#faf9f8] p-4 rounded-xl border border-[#dcc1b1]/40">
                    <div className="font-bold text-[#1a1c1c] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#944a00]" />
                      <span>Customer Specific Dietary Request</span>
                    </div>
                    <p className="text-xs text-[#564337] leading-relaxed italic bg-white p-2.5 rounded-lg border border-[#eeeeed]">
                      "{sub.dietaryNotes || 'Standard homemade recipe, clean home spices.'}"
                    </p>
                    <div className="text-[11px] text-[#51634c] font-semibold flex items-center gap-1.5 pt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        Fulfillment: {isPaused ? 'Paused by Customer' : `Next Delivery Today at ${sub.lunchTiming || '1:00 PM'}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#eeeeed]">
                  <div className="text-[11px] text-[#564337] flex items-center gap-2">
                    <span>Renewal: <strong>{sub.renewalDate || 'In 30 days'}</strong></span>
                    <span>•</span>
                    <span>Remaining Days: <strong>{sub.remainingDays || 30} Days</strong></span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleToggleSubscriberStatus(sub.id, sub.status)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        sub.status === 'Active'
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                          : 'bg-[#d1e6c9] hover:bg-[#b8d8ad] text-[#51634c]'
                      }`}
                    >
                      {sub.status === 'Active' ? 'Pause Subscription' : 'Resume Subscription'}
                    </button>

                    <button
                      onClick={() => handleFulfillMeal(sub.id)}
                      className="px-4 py-2 bg-[#51634c] hover:bg-[#3d4b39] text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark 1 Meal Delivered</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-12 text-center space-y-3 shadow-2xs">
          <Users className="w-12 h-12 text-[#944a00] mx-auto opacity-40" />
          <h3 className="font-bold text-base text-[#1a1c1c]">No Subscribers Found</h3>
          <p className="text-xs text-[#564337] max-w-sm mx-auto">
            {filterStatus !== 'All' || filterCategory !== 'All' || selectedPlanFilter !== 'All'
              ? 'No subscribers match the current filter selection.'
              : 'When neighborhood customers subscribe to your custom lunch or dinner tiffin plans, they will appear here with full pricing, plan tier, delivery and dietary details.'}
          </p>
        </div>
      )}
    </div>
  );
};
