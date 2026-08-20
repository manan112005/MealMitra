import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionPlan } from '../../types';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  PauseCircle,
  PlayCircle,
  Sparkles,
  ShieldCheck,
  Building,
  Home,
  Repeat,
} from 'lucide-react';

export const CustomerSubscriptions: React.FC = () => {
  const { userSubscription, updateUserSubscription, subscribeToPlan, cooks, subscriptionPlans } = useApp();
  const [selectedPlanPeriod, setSelectedPlanPeriod] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [selectedCookId, setSelectedCookId] = useState<string>('cook-1');

  // Editable addresses
  const [lunchAddress, setLunchAddress] = useState('Office: 602 Mondeal Square, SG Highway, Prahlad Nagar');
  const [dinnerAddress, setDinnerAddress] = useState('Home: Flat 402, Shivalik Heights, Judges Bungalow Rd, Bodakdev');
  const [lunchTime, setLunchTime] = useState('1:00 PM - 1:30 PM');
  const [dinnerTime, setDinnerTime] = useState('8:00 PM - 8:30 PM');

  const plansToShow = subscriptionPlans.filter((p) => p.type === selectedPlanPeriod);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    subscribeToPlan(plan, {
      address: `${lunchAddress} (Lunch) / ${dinnerAddress} (Dinner)`,
      lunchTiming: lunchTime,
      dinnerTiming: dinnerTime,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Repeat className="w-6 h-6 text-[#944a00]" />
            <span>Monthly & Yearly Tiffin Subscriptions</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Enjoy healthy, wholesome home-cooked food every day with automated schedule & dual address delivery.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="p-1 bg-white border border-[#dcc1b1]/60 rounded-xl flex gap-1 self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setSelectedPlanPeriod('Monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedPlanPeriod === 'Monthly'
                ? 'bg-[#944a00] text-white shadow-2xs'
                : 'text-[#564337] hover:text-[#1a1c1c]'
            }`}
          >
            Monthly Plans
          </button>
          <button
            onClick={() => setSelectedPlanPeriod('Yearly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedPlanPeriod === 'Yearly'
                ? 'bg-[#944a00] text-white shadow-2xs'
                : 'text-[#564337] hover:text-[#1a1c1c]'
            }`}
          >
            Yearly Plans (Save 20%)
          </button>
        </div>
      </div>

      {/* Active Subscription Status Banner (If User Has One) */}
      {userSubscription && (
        <div className="bg-gradient-to-r from-white via-[#faf9f8] to-[#d1e6c9]/30 rounded-2xl border-2 border-[#51634c]/40 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-[#eeeeed]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#51634c] bg-[#d1e6c9] px-2.5 py-0.5 rounded-full">
                  ● Active {userSubscription.status} Subscription
                </span>
                <span className="text-xs text-[#564337]">Started: {userSubscription.startDate}</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#1a1c1c]">
                {userSubscription.planName} — Prepared by {userSubscription.cookName}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  updateUserSubscription({
                    status: userSubscription.status === 'Active' ? 'Paused' : 'Active',
                  });
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  userSubscription.status === 'Active'
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    : 'bg-green-100 text-green-900 hover:bg-green-200'
                }`}
              >
                {userSubscription.status === 'Active' ? (
                  <>
                    <PauseCircle className="w-4 h-4" /> Pause Deliveries
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" /> Resume Subscription
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress & Next Delivery Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 bg-white rounded-xl border border-[#dcc1b1]/40">
              <div className="text-xs text-[#564337] font-medium">Meal Deliveries Tracked</div>
              <div className="text-base font-extrabold text-[#1a1c1c] mt-1">
                {userSubscription.mealsDeliveredCount} of {userSubscription.totalMealsCount} Meals Fulfilled
              </div>
              <div className="w-full bg-[#eeeeed] h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[#51634c] h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (userSubscription.mealsDeliveredCount / userSubscription.totalMealsCount) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#dcc1b1]/40">
              <div className="text-xs text-[#564337] font-medium">Next Scheduled Tiffin</div>
              <div className="text-sm font-bold text-[#944a00] mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Today at {userSubscription.lunchTiming} (Lunch)</span>
              </div>
              <p className="text-[11px] text-[#564337] mt-1">Status: Assigned to Delivery Cluster</p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#dcc1b1]/40">
              <div className="text-xs text-[#564337] font-medium">Configured Drop Locations</div>
              <div className="text-[11px] text-[#1a1c1c] font-semibold mt-1 truncate">
                🏢 Lunch: {userSubscription.officeAddress || userSubscription.deliveryAddress}
              </div>
              <div className="text-[11px] text-[#1a1c1c] font-semibold mt-0.5 truncate">
                🏡 Dinner: {userSubscription.deliveryAddress}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Choose Cook Bar */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337]">
          1. Select Your Preferred Neighborhood Home Cook
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cooks.map((cook) => (
            <button
              key={cook.id}
              onClick={() => setSelectedCookId(cook.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                selectedCookId === cook.id
                  ? 'bg-[#ffdcc5]/40 border-[#944a00] shadow-xs'
                  : 'bg-[#faf9f8] border-[#dcc1b1]/50 hover:bg-[#eeeeed]'
              }`}
            >
              <img
                src={cook.avatar}
                alt={cook.name}
                className="w-12 h-12 rounded-full object-cover border border-white shadow-2xs"
              />
              <div className="min-w-0">
                <div className="font-bold text-xs text-[#1a1c1c] truncate">{cook.name}</div>
                <div className="text-[11px] text-[#564337]">{cook.cuisine[0]} Specialist</div>
                <div className="text-[10px] text-[#944a00] font-semibold mt-0.5">
                  ★ {cook.rating} • {cook.distanceKm} km away
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dual Address Timing Configuration Drawer / Box */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337]">
              2. Smart Dual-Address Delivery Setup
            </h3>
            <p className="text-xs text-[#564337]">
              Deliver lunch to your workplace and dinner to your home without re-entering addresses daily.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#faf9f8] border border-[#dcc1b1]/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#944a00]">
              <Building className="w-4 h-4" />
              <span>Weekday Lunch Drop (1:00 PM)</span>
            </div>
            <input
              type="text"
              value={lunchAddress}
              onChange={(e) => setLunchAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#dcc1b1] rounded-lg text-[#1a1c1c]"
            />
            <div className="flex items-center gap-2 text-[11px] text-[#564337]">
              <Clock className="w-3.5 h-3.5 text-[#564337]" />
              <span>Preferred Slot: {lunchTime}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#faf9f8] border border-[#dcc1b1]/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#51634c]">
              <Home className="w-4 h-4" />
              <span>Evening Dinner Drop (8:00 PM)</span>
            </div>
            <input
              type="text"
              value={dinnerAddress}
              onChange={(e) => setDinnerAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#dcc1b1] rounded-lg text-[#1a1c1c]"
            />
            <div className="flex items-center gap-2 text-[11px] text-[#564337]">
              <Clock className="w-3.5 h-3.5 text-[#564337]" />
              <span>Preferred Slot: {dinnerTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Pricing Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337]">
          3. Choose Your Plan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plansToShow.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between space-y-6 transition-all ${
                plan.isPopular
                  ? 'border-[#944a00] shadow-[0_8px_30px_rgba(148,74,0,0.08)] relative scale-102'
                  : 'border-[#dcc1b1]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#944a00] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="font-extrabold text-lg text-[#1a1c1c]">{plan.name}</h4>
                  <p className="text-xs text-[#564337] mt-1">{plan.description}</p>
                </div>

                <div className="py-2 border-y border-[#eeeeed]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#944a00]">₹{plan.price.toLocaleString()}</span>
                    <span className="text-xs text-[#564337]">/ {plan.billingPeriod.toLowerCase()}</span>
                  </div>
                  <div className="text-[11px] text-[#51634c] font-bold mt-0.5">
                    Category: {plan.category}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-[#1a1c1c] mb-1">What's included:</div>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-[#564337]">
                      <CheckCircle2 className="w-4 h-4 text-[#51634c] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 rounded-xl font-bold text-xs shadow-xs transition-all ${
                  plan.isPopular
                    ? 'bg-[#944a00] hover:bg-[#713700] text-white'
                    : 'bg-[#faf9f8] hover:bg-[#ffdcc5]/40 text-[#944a00] border border-[#dcc1b1]'
                }`}
              >
                Subscribe to {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
