import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SubscriptionPlan, CookProfile } from '../../types';
import { paymentService } from '../../services/payment.service';
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
  ChefHat,
  Star,
  Sun,
  Moon,
  Filter,
  ArrowRight,
  Heart,
  Check,
  CreditCard,
  X,
  Smartphone,
  Landmark,
  Wallet,
  Banknote,
  QrCode,
  Lock,
  Copy,
  Tag,
  ChevronRight,
  AlertCircle,
  Receipt,
} from 'lucide-react';

export const CustomerSubscriptions: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    userSubscription,
    updateUserSubscription,
    subscribeToPlan,
    skipSubscriptionMeal,
    cooks,
    currentCookProfile,
    getCookSubscriptionPlans,
    toggleFollowCook,
  } = useApp();

  const activeCooksList: CookProfile[] =
    cooks && cooks.length > 0 ? cooks : [currentCookProfile];

  const [selectedCookId, setSelectedCookId] = useState<string>(() => activeCooksList[0]?.id || currentCookProfile.id);
  const [selectedPlanPeriod, setSelectedPlanPeriod] = useState<'All' | 'Monthly' | '15 Days' | 'Weekly'>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Lunch Only' | 'Dinner Only' | 'Lunch + Dinner'>('All');

  // Keep selectedCookId in sync if cooks change
  useEffect(() => {
    if (activeCooksList.length > 0 && (!selectedCookId || !activeCooksList.some((c) => c.id === selectedCookId))) {
      setSelectedCookId(activeCooksList[0].id);
    }
  }, [cooks, activeCooksList]);

  // Selected Cook profile
  const selectedCook = activeCooksList.find((c) => c.id === selectedCookId) || activeCooksList[0] || currentCookProfile;

  // Plans specific to the selected Cook
  const cookPlans = useMemo(() => {
    return getCookSubscriptionPlans(selectedCook.id);
  }, [selectedCook, getCookSubscriptionPlans]);

  // Filtered Plans based on period & category
  const filteredPlans = useMemo(() => {
    return cookPlans.filter((p) => {
      const matchPeriod = selectedPlanPeriod === 'All' || p.type === selectedPlanPeriod;
      const matchCategory =
        selectedCategory === 'All' ||
        p.category === selectedCategory ||
        (selectedCategory === 'Lunch + Dinner' && p.category.includes('Lunch + Dinner'));
      return matchPeriod && matchCategory;
    });
  }, [cookPlans, selectedPlanPeriod, selectedCategory]);

  // Editable addresses prefilled from user profile
  const [lunchAddress, setLunchAddress] = useState(
    currentUser?.applicationDetails?.address
      ? `Office: ${currentUser.applicationDetails.address}`
      : 'Office: 602 Mondeal Square, SG Highway, Prahlad Nagar'
  );
  const [dinnerAddress, setDinnerAddress] = useState(
    currentUser?.applicationDetails?.address
      ? `Home: ${currentUser.applicationDetails.address}`
      : 'Home: Flat 402, Shivalik Heights, Judges Bungalow Rd, Bodakdev'
  );
  const [lunchTime, setLunchTime] = useState('1:00 PM - 1:30 PM');
  const [dinnerTime, setDinnerTime] = useState('8:00 PM - 8:30 PM');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Payment Modal State
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan | null>(null);
  const [subPaymentStep, setSubPaymentStep] = useState<'select_method' | 'razorpay_gateway' | 'failed'>('select_method');
  const [subFailureReason, setSubFailureReason] = useState('Transaction declined by issuing bank.');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod' | 'razorpay'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred' | 'custom'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8920');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('821');
  const [cardName, setCardName] = useState(currentUser?.name || 'MANAN PATEL');
  const [useRewardPoints, setUseRewardPoints] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    orderId: string;
    planName: string;
    amount: number;
    chefName: string;
    method: string;
  } | null>(null);

  const activateSubscription = (plan: SubscriptionPlan) => {
    subscribeToPlan(plan, {
      cookId: selectedCook.id,
      cookName: selectedCook.name || 'Home Kitchen',
      cookAvatar: selectedCook.avatar,
      address: dinnerAddress,
      officeAddress: lunchAddress,
      lunchTiming: lunchTime,
      dinnerTiming: dinnerTime,
      dietaryNotes: currentUser?.applicationDetails?.dietaryPreference || 'Standard homemade recipe, fresh home spices',
    });

    setSuccessMsg(`🎉 Successfully subscribed to ${plan.name} with Chef ${selectedCook.chefName || selectedCook.name}!`);
    setTimeout(() => setSuccessMsg(''), 5000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPayment = (plan: SubscriptionPlan) => {
    setSelectedPlanForPayment(plan);
    setSubPaymentStep('select_method');
    setPaymentSuccessData(null);
    setIsProcessingPayment(false);
  };

  const [subGatewayProgress, setSubGatewayProgress] = useState(15);
  const [subGatewayStatus, setSubGatewayStatus] = useState('Connecting to Razorpay gateway...');
  const [subGatewayTimer, setSubGatewayTimer] = useState<any>(null);

  const handleInitiateSubGateway = () => {
    if (!selectedPlanForPayment) return;
    const discount = useRewardPoints ? 125 : 0;
    const finalAmount = Math.max(0, selectedPlanForPayment.price - discount);

    if (paymentMethod === 'cod') {
      finalizeSubscriptionSuccess(finalAmount);
      return;
    }

    setSubPaymentStep('razorpay_gateway');
    setSubGatewayProgress(25);
    setSubGatewayStatus('Connecting to Razorpay subscription gateway...');

    const timer1 = setTimeout(() => {
      setSubGatewayProgress(60);
      setSubGatewayStatus(`Authorizing recurring mandate via ${paymentMethod.toUpperCase()}...`);
    }, 700);

    const timer2 = setTimeout(() => {
      setSubGatewayProgress(85);
      setSubGatewayStatus('Verifying security token with bank...');
    }, 1500);

    const timer3 = setTimeout(async () => {
      setSubGatewayProgress(100);
      setSubGatewayStatus('Mandate authorized! Activating subscription...');

      try {
        const simulatedPaymentId = `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const simulatedSignature = `sig_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

        await paymentService.verifyPayment({
          razorpay_order_id: `order_rzp_${Date.now()}`,
          razorpay_payment_id: simulatedPaymentId,
          razorpay_signature: simulatedSignature,
          subscriptionData: {
            planId: selectedPlanForPayment.id,
            cookId: selectedCook.id,
            address: dinnerAddress,
            officeAddress: lunchAddress,
            lunchTiming: lunchTime,
            dinnerTiming: dinnerTime,
            dietaryNotes: currentUser?.applicationDetails?.dietaryPreference || 'Standard homemade recipe, fresh home spices',
          },
        });

        finalizeSubscriptionSuccess(finalAmount);
      } catch {
        finalizeSubscriptionSuccess(finalAmount);
      }
    }, 2400);

    setSubGatewayTimer([timer1, timer2, timer3]);
  };

  const handleCancelSubGateway = () => {
    if (subGatewayTimer && Array.isArray(subGatewayTimer)) {
      subGatewayTimer.forEach((t) => clearTimeout(t));
    }
    setSubFailureReason(`Subscription authorization was cancelled by the user.`);
    setSubPaymentStep('failed');
  };

  const finalizeSubscriptionSuccess = (finalAmount: number) => {
    if (!selectedPlanForPayment) return;
    
    activateSubscription(selectedPlanForPayment);

    const generatedOrderId = `MM-SUB-${Math.floor(100000 + Math.random() * 900000)}`;
    const methodLabels: Record<string, string> = {
      upi: selectedUpiApp === 'custom' ? `UPI (${customUpiId || 'custom@upi'})` : `UPI (${selectedUpiApp.toUpperCase()})`,
      card: `Credit/Debit Card (ending in ${cardNumber.slice(-4)})`,
      netbanking: `Net Banking (${selectedBank} Bank)`,
      cod: 'Pay on 1st Tiffin Delivery (Doorstep Cash/UPI)',
      razorpay: 'Razorpay Secure Gateway',
    };

    setPaymentSuccessData({
      orderId: generatedOrderId,
      planName: selectedPlanForPayment.name,
      amount: finalAmount,
      chefName: selectedCook.chefName || selectedCook.name,
      method: methodLabels[paymentMethod] || 'Secure Online Payment',
    });
    setIsProcessingPayment(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Repeat className="w-6 h-6 text-[#944a00]" />
            <span>Tiffin Subscriptions by Home Chefs</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Select your favorite neighborhood cook, choose custom Lunch & Dinner tiffin plans, and enjoy fresh homemade meals daily.
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-4 bg-[#d1e6c9] border border-[#51634c]/30 text-[#51634c] text-xs font-bold rounded-2xl flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#51634c] shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg('')}
            className="text-[#51634c] hover:text-[#1a1c1c] text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

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
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
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

          {/* Upcoming Subscription Meals & Skip Slot Section */}
          <div className="pt-4 border-t border-[#eeeeed] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="font-bold text-xs text-[#1a1c1c] flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-[#944a00]" />
                <span>Upcoming Scheduled Tiffins & Skip Slot Control</span>
              </div>
              <span className="text-[11px] text-[#564337]">
                Chef's Skip Cutoff: <strong>10:30 AM (Lunch) / 5:30 PM (Dinner)</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(userSubscription.upcomingMeals || []).map((slot) => (
                <div
                  key={slot.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    slot.status === 'Skipped'
                      ? 'bg-[#faf9f8] border-dashed border-gray-300 opacity-60'
                      : 'bg-white border-[#dcc1b1]/50 shadow-2xs'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#1a1c1c]">{slot.date} ({slot.dayName})</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        slot.status === 'Skipped' 
                          ? 'bg-amber-100 text-amber-900' 
                          : 'bg-[#d1e6c9] text-[#51634c]'
                      }`}>
                        {slot.status === 'Skipped' ? 'Slot Released' : slot.mealPeriod}
                      </span>
                    </div>
                    <div className="text-xs text-[#564337] truncate">{slot.mealName}</div>
                    <div className="text-[10px] text-[#564337]">
                      Cutoff deadline: {slot.cutoffTime}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {slot.status === 'Skipped' ? (
                      <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        Released to Waitlist
                      </span>
                    ) : (
                      <button
                        onClick={async () => {
                          if (window.confirm(`Skip ${slot.dayName}'s ${slot.mealPeriod}? This slot will be released back to the kitchen pool for waitlisted customers.`)) {
                            await skipSubscriptionMeal(slot.id, slot.date, slot.mealPeriod);
                          }
                        }}
                        className="px-3 py-1.5 bg-[#faf9f8] hover:bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
                      >
                        Skip & Release
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 1. Step 1: Cook Selector Carousel / Grid */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337] flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-[#944a00]" />
              <span>Step 1: Choose Your Home Chef</span>
            </h3>
            <p className="text-xs text-[#564337]">
              Each chef prepares authentic homemade food with their own custom subscription plans, rates & terms.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#ffdcc5] text-[#944a00] self-start sm:self-auto">
            Selected: {selectedCook.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {activeCooksList.map((cook) => {
            const isSelected = selectedCookId === cook.id;
            const plansCount = getCookSubscriptionPlans(cook.id).length;

            return (
              <div
                key={cook.id}
                onClick={() => setSelectedCookId(cook.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  isSelected
                    ? 'bg-[#ffdcc5]/30 border-[#944a00] shadow-sm'
                    : 'bg-[#faf9f8] border-[#dcc1b1]/50 hover:border-[#944a00]/50 hover:bg-white'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 bg-[#944a00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <Check className="w-3 h-3" />
                    <span>Selected</span>
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <img
                    src={cook.avatar}
                    alt={cook.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-sm text-[#1a1c1c] truncate">{cook.name}</div>
                    <div className="text-xs text-[#944a00] font-semibold truncate">
                      Chef: {cook.chefName || 'Home Cook'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#564337] mt-0.5">
                      <span className="flex items-center gap-0.5 font-bold text-[#944a00]">
                        <Star className="w-3 h-3 fill-[#e67e22] text-[#e67e22]" />
                        <span>{cook.rating}</span>
                      </span>
                      <span>•</span>
                      <span>{cook.location || 'Ahmedabad'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#dcc1b1]/40 flex items-center justify-between text-xs">
                  <span className="text-[#564337]">{cook.cuisine?.[0] || 'Homestyle'} Specialist</span>
                  <span className="font-bold text-[#51634c] bg-[#d1e6c9]/60 px-2 py-0.5 rounded-md text-[10px]">
                    {plansCount} Plans Available
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Step 2: Dual Address Delivery Preferences */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#944a00]" />
            <span>Step 2: Smart Dual-Address Delivery Setup</span>
          </h3>
          <p className="text-xs text-[#564337]">
            MealMitra automatically routes your lunch to office and dinner to home without manual re-entry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#faf9f8] border border-[#dcc1b1]/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#944a00]">
              <Building className="w-4 h-4" />
              <span>Weekday Lunch Drop Location</span>
            </div>
            <input
              type="text"
              value={lunchAddress}
              onChange={(e) => setLunchAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#dcc1b1] rounded-lg text-[#1a1c1c] focus:ring-1 focus:ring-[#944a00]"
            />
            <div className="flex items-center gap-2 text-[11px] text-[#564337]">
              <Clock className="w-3.5 h-3.5 text-[#564337]" />
              <span>Lunch Slot Window: {lunchTime}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#faf9f8] border border-[#dcc1b1]/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#51634c]">
              <Home className="w-4 h-4" />
              <span>Evening Dinner Drop Location</span>
            </div>
            <input
              type="text"
              value={dinnerAddress}
              onChange={(e) => setDinnerAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#dcc1b1] rounded-lg text-[#1a1c1c] focus:ring-1 focus:ring-[#51634c]"
            />
            <div className="flex items-center gap-2 text-[11px] text-[#564337]">
              <Clock className="w-3.5 h-3.5 text-[#564337]" />
              <span>Dinner Slot Window: {dinnerTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Step 3: Choose Chef's Custom Subscription Plan */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#944a00]" />
              <span>Step 3: Select Plan by {selectedCook.name}</span>
            </h3>
            <p className="text-xs text-[#564337]">
              Showing live pricing & meal terms configured by Chef {selectedCook.chefName || selectedCook.name}.
            </p>
          </div>

          {/* Filters: Category & Duration */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Category Filter */}
            <div className="flex gap-1 p-1 bg-white border border-[#dcc1b1]/60 rounded-xl shadow-2xs">
              {(['All', 'Lunch Only', 'Dinner Only', 'Lunch + Dinner'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#944a00] text-white shadow-2xs'
                      : 'text-[#564337] hover:text-[#1a1c1c]'
                  }`}
                >
                  {cat === 'All' ? 'All Slots' : cat}
                </button>
              ))}
            </div>

            {/* Duration Filter */}
            <div className="flex gap-1 p-1 bg-white border border-[#dcc1b1]/60 rounded-xl shadow-2xs">
              {(['All', 'Monthly', '15 Days'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlanPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedPlanPeriod === p
                      ? 'bg-[#51634c] text-white shadow-2xs'
                      : 'text-[#564337] hover:text-[#1a1c1c]'
                  }`}
                >
                  {p === 'All' ? 'All Durations' : p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Cards Grid */}
        {filteredPlans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-10 text-center space-y-3 shadow-2xs">
            <Repeat className="w-10 h-10 text-[#944a00] mx-auto opacity-50" />
            <h4 className="font-bold text-sm text-[#1a1c1c]">No plans matching this filter</h4>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPlanPeriod('All');
              }}
              className="px-4 py-2 bg-[#944a00] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Show All Plans for {selectedCook.name}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between space-y-6 transition-all ${
                  plan.isPopular
                    ? 'border-[#944a00] shadow-[0_8px_30px_rgba(148,74,0,0.08)] relative scale-102 ring-2 ring-[#944a00]/20'
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
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ffdcc5] text-[#944a00]">
                        {plan.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#d1e6c9] text-[#51634c]">
                        {plan.type}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-lg text-[#1a1c1c]">{plan.name}</h4>
                    <p className="text-xs text-[#564337] mt-1">{plan.description}</p>
                  </div>

                  {/* Price & Billing */}
                  <div className="py-2 border-y border-[#eeeeed]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#944a00]">₹{plan.price.toLocaleString()}</span>
                      <span className="text-xs text-[#564337]">{plan.billingPeriod}</span>
                    </div>
                    <div className="text-[11px] text-[#51634c] font-bold mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Delivery: {plan.deliveryTimeWindow || 'Slot timing'}</span>
                    </div>
                  </div>

                  {/* Features Checklist */}
                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-[#1a1c1c] mb-1">Included in this Plan:</div>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-[#564337]">
                        <CheckCircle2 className="w-4 h-4 text-[#51634c] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Policy & Terms */}
                  {plan.terms && plan.terms.length > 0 && (
                    <div className="p-2.5 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 text-[10px] text-[#564337] space-y-0.5">
                      <div className="font-bold text-[#1a1c1c]">Terms & Cutoff:</div>
                      {plan.terms.map((t, idx) => (
                        <div key={idx}>• {t}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subscribe Action Button */}
                <button
                  onClick={() => handleOpenPayment(plan)}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
                    plan.isPopular
                      ? 'bg-[#944a00] hover:bg-[#713700] text-white'
                      : 'bg-[#51634c] hover:bg-[#3d4b39] text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Subscribe to {plan.category} • ₹{plan.price.toLocaleString()}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Interactive Subscription Payment Options Modal */}
      {selectedPlanForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#dcc1b1]/80 shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#944a00] to-[#51634c] p-6 text-white flex items-center justify-between relative">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCook.avatar}
                  alt={selectedCook.name}
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-white/80 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
                      Secure Checkout
                    </span>
                    <span className="text-[11px] font-semibold bg-[#ffdcc5] text-[#944a00] px-2 py-0.5 rounded-full">
                      {selectedPlanForPayment.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">
                    {selectedPlanForPayment.name}
                  </h3>
                  <p className="text-xs text-white/90">
                    Handcrafted by Chef {selectedCook.chefName || selectedCook.name} ({selectedCook.name})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlanForPayment(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: If Payment Succeeded */}
            {paymentSuccessData ? (
              <div className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
                <div className="w-20 h-20 rounded-full bg-[#d1e6c9] text-[#51634c] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#51634c] bg-[#d1e6c9]/60 px-3 py-1 rounded-full">
                    Payment Verified & Subscription Active
                  </span>
                  <h4 className="text-2xl font-black text-[#1a1c1c]">
                    Welcome to Daily Homemade Food!
                  </h4>
                  <p className="text-xs text-[#564337] max-w-md mx-auto">
                    Your subscription order has been confirmed with Chef <strong>{paymentSuccessData.chefName}</strong>. Your first freshly prepared hot tiffin will be delivered starting tomorrow!
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="p-5 bg-[#faf9f8] rounded-2xl border border-[#dcc1b1]/50 text-left space-y-3 max-w-md mx-auto text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-[#eeeeed]">
                    <span className="text-[#564337]">Subscription Ref ID:</span>
                    <span className="font-mono font-bold text-[#944a00]">{paymentSuccessData.orderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#564337]">Plan Subscribed:</span>
                    <span className="font-bold text-[#1a1c1c]">{paymentSuccessData.planName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#564337]">Paid Via:</span>
                    <span className="font-semibold text-[#51634c]">{paymentSuccessData.method}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#eeeeed] text-sm">
                    <span className="font-bold text-[#1a1c1c]">Total Amount Paid:</span>
                    <span className="font-black text-[#944a00]">₹{paymentSuccessData.amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      setSelectedPlanForPayment(null);
                      setPaymentSuccessData(null);
                    }}
                    className="px-6 py-3 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Repeat className="w-4 h-4" />
                    <span>View My Active Subscription</span>
                  </button>
                </div>
              </div>
            ) : subPaymentStep === 'select_method' ? (
              /* Modal Body: Payment Selection Form */
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Delivery Snapshot */}
                <div className="p-4 bg-[#faf9f8] rounded-2xl border border-[#dcc1b1]/50 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-[#1a1c1c] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#944a00]" />
                      <span>Delivery Timing: {selectedPlanForPayment.deliveryTimeWindow}</span>
                    </div>
                    <div className="text-[#564337] flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#51634c] shrink-0 mt-0.5" />
                      <span>
                        {selectedPlanForPayment.category.includes('Lunch') ? lunchAddress : dinnerAddress}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 border-t sm:border-t-0 sm:border-l sm:pl-4 border-[#eeeeed] pt-2 sm:pt-0">
                    <div className="text-[11px] text-[#564337]">Total Included Meals</div>
                    <div className="text-sm font-extrabold text-[#51634c]">
                      {selectedPlanForPayment.mealsCount || (selectedPlanForPayment.type === 'Monthly' ? 26 : 13)} Tiffins
                    </div>
                  </div>
                </div>

                {/* Reward points discount toggle */}
                <div className="p-3.5 bg-gradient-to-r from-[#ffdcc5]/40 to-[#d1e6c9]/40 rounded-xl border border-[#dcc1b1]/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#944a00]" />
                    <div>
                      <div className="text-xs font-bold text-[#1a1c1c]">Apply 1,250 Reward Points</div>
                      <div className="text-[11px] text-[#564337]">Save ₹125 instantly on this subscription</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setUseRewardPoints(!useRewardPoints)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      useRewardPoints
                        ? 'bg-[#51634c] text-white shadow-xs'
                        : 'bg-white text-[#564337] border border-[#dcc1b1] hover:bg-gray-50'
                    }`}
                  >
                    {useRewardPoints ? 'Applied ✓' : 'Apply'}
                  </button>
                </div>

                {/* Payment Methods Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#564337] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#51634c]" />
                      <span>Choose Payment Method</span>
                    </h4>
                    <span className="text-[10px] text-[#51634c] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      100% Encrypted & Safe
                    </span>
                  </div>

                  {/* Payment Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'upi'
                          ? 'bg-[#ffdcc5]/40 border-[#944a00] text-[#944a00] font-bold shadow-2xs'
                          : 'bg-white border-[#dcc1b1]/60 text-[#564337] hover:bg-gray-50'
                      }`}
                    >
                      <Smartphone className="w-5 h-5" />
                      <span className="text-xs">UPI / Apps</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'card'
                          ? 'bg-[#ffdcc5]/40 border-[#944a00] text-[#944a00] font-bold shadow-2xs'
                          : 'bg-white border-[#dcc1b1]/60 text-[#564337] hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="text-xs">Debit / Credit</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'netbanking'
                          ? 'bg-[#ffdcc5]/40 border-[#944a00] text-[#944a00] font-bold shadow-2xs'
                          : 'bg-white border-[#dcc1b1]/60 text-[#564337] hover:bg-gray-50'
                      }`}
                    >
                      <Landmark className="w-5 h-5" />
                      <span className="text-xs">Net Banking</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'cod'
                          ? 'bg-[#ffdcc5]/40 border-[#944a00] text-[#944a00] font-bold shadow-2xs'
                          : 'bg-white border-[#dcc1b1]/60 text-[#564337] hover:bg-gray-50'
                      }`}
                    >
                      <Banknote className="w-5 h-5" />
                      <span className="text-xs">Pay on 1st Tiffin</span>
                    </button>
                  </div>

                  {/* Payment Method Details Panel */}
                  <div className="p-4 rounded-2xl bg-[#faf9f8] border border-[#dcc1b1]/60 space-y-4">
                    {/* Method 1: UPI */}
                    {paymentMethod === 'upi' && (
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-[#1a1c1c]">Instant UPI Payment</div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'gpay', name: 'Google Pay', icon: '🟢' },
                            { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                            { id: 'paytm', name: 'Paytm UPI', icon: '🔵' },
                            { id: 'cred', name: 'CRED UPI', icon: '⚫' },
                          ].map((app) => (
                            <button
                              key={app.id}
                              onClick={() => {
                                setSelectedUpiApp(app.id as any);
                                setShowQrCode(false);
                              }}
                              className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                selectedUpiApp === app.id && !showQrCode
                                  ? 'bg-[#944a00] text-white border-[#944a00] shadow-xs'
                                  : 'bg-white border-[#dcc1b1]/60 text-[#564337] hover:bg-gray-50'
                              }`}
                            >
                              <span>{app.icon}</span>
                              <span>{app.name}</span>
                            </button>
                          ))}
                        </div>

                        {/* UPI ID input */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#564337]">Or Enter UPI ID / VPA</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={customUpiId}
                              onChange={(e) => {
                                setCustomUpiId(e.target.value);
                                setSelectedUpiApp('custom');
                              }}
                              placeholder="e.g. manan@okaxis, 9825123456@paytm"
                              className="flex-1 bg-white border border-[#dcc1b1] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-[#944a00]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowQrCode(!showQrCode)}
                              className="px-3 py-2 bg-white border border-[#dcc1b1] hover:bg-gray-50 text-xs font-bold text-[#944a00] rounded-xl flex items-center gap-1 cursor-pointer"
                            >
                              <QrCode className="w-4 h-4" />
                              <span>{showQrCode ? 'Hide QR' : 'Show QR'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Dynamic QR Code preview */}
                        {showQrCode && (
                          <div className="p-4 bg-white rounded-xl border border-[#dcc1b1] text-center space-y-2 animate-in fade-in duration-200">
                            <div className="text-xs font-bold text-[#1a1c1c]">
                              Scan & Pay with Any UPI App
                            </div>
                            <div className="w-36 h-36 mx-auto bg-gray-100 rounded-xl p-2 border-2 border-dashed border-[#944a00] flex items-center justify-center">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=mealmitra@icici&pn=MealMitra&am=${
                                  selectedPlanForPayment.price - (useRewardPoints ? 125 : 0)
                                }&cu=INR`}
                                alt="UPI QR"
                                className="w-full h-full object-contain rounded-lg"
                              />
                            </div>
                            <div className="text-[10px] text-[#564337]">
                              UPI ID: <strong>mealmitra@icici</strong> • Fast & Instant Approval
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Method 2: Card */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-[#1a1c1c]">
                          <span>Enter Card Details</span>
                          <span className="text-[10px] text-[#564337]">Visa / Master / RuPay</span>
                        </div>

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Card Number"
                            className="w-full bg-white border border-[#dcc1b1] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-[#944a00]"
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="bg-white border border-[#dcc1b1] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-[#944a00]"
                            />
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="CVV"
                              maxLength={4}
                              className="bg-white border border-[#dcc1b1] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-[#944a00]"
                            />
                          </div>

                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Name on Card"
                            className="w-full bg-white border border-[#dcc1b1] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-[#944a00]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Method 3: Net Banking */}
                    {paymentMethod === 'netbanking' && (
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-[#1a1c1c]">Select Bank</div>
                        <div className="grid grid-cols-3 gap-2">
                          {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                            <button
                              key={bank}
                              onClick={() => setSelectedBank(bank)}
                              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                selectedBank === bank
                                  ? 'bg-[#51634c] text-white border-[#51634c] shadow-xs'
                                  : 'bg-white border-[#dcc1b1]/60 text-[#564337] hover:bg-gray-50'
                              }`}
                            >
                              {bank} Bank
                            </button>
                          ))}
                        </div>

                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full bg-white border border-[#dcc1b1] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-[#944a00]"
                        >
                          <option value="HDFC">HDFC Bank</option>
                          <option value="SBI">State Bank of India</option>
                          <option value="ICICI">ICICI Bank</option>
                          <option value="Axis">Axis Bank</option>
                          <option value="Kotak">Kotak Mahindra Bank</option>
                          <option value="Bank of Baroda">Bank of Baroda</option>
                          <option value="IndusInd">IndusInd Bank</option>
                          <option value="IDFC First">IDFC First Bank</option>
                        </select>
                      </div>
                    )}

                    {/* Method 4: Pay on 1st Tiffin Delivery */}
                    {paymentMethod === 'cod' && (
                      <div className="p-3 bg-white rounded-xl border border-[#dcc1b1] space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#51634c]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Taste First, Pay at Doorstep</span>
                        </div>
                        <p className="text-xs text-[#564337]">
                          Pay cash or UPI directly to our delivery mitra when your very first hot homestyle tiffin arrives at your doorstep tomorrow!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="p-4 bg-[#faf9f8] rounded-2xl border border-[#dcc1b1]/50 space-y-2 text-xs">
                  <div className="flex justify-between text-[#564337]">
                    <span>Plan Base Price ({selectedPlanForPayment.billingPeriod})</span>
                    <span>₹{selectedPlanForPayment.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#51634c] font-semibold">
                    <span>Cluster Delivery & Packaging</span>
                    <span>FREE (100% Waived)</span>
                  </div>
                  {useRewardPoints && (
                    <div className="flex justify-between text-[#944a00] font-bold">
                      <span>Reward Points Discount</span>
                      <span>- ₹125</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#564337] text-[11px]">
                    <span>GST (5% Included)</span>
                    <span>₹{Math.round(selectedPlanForPayment.price * 0.05)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#eeeeed] text-base font-black text-[#1a1c1c]">
                    <span>Final Amount:</span>
                    <span className="text-xl text-[#944a00]">
                      ₹{Math.max(0, selectedPlanForPayment.price - (useRewardPoints ? 125 : 0)).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Modal Footer / Action */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setSelectedPlanForPayment(null)}
                    disabled={isProcessingPayment}
                    className="px-5 py-3 rounded-xl border border-[#dcc1b1] text-xs font-bold text-[#564337] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleInitiateSubGateway}
                    disabled={isProcessingPayment}
                    className="flex-1 py-3.5 bg-[#944a00] hover:bg-[#713700] disabled:bg-gray-400 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing with Razorpay...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          Pay ₹
                          {Math.max(
                            0,
                            selectedPlanForPayment.price - (useRewardPoints ? 125 : 0)
                          ).toLocaleString()}{' '}
                          & Start Subscription
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : subPaymentStep === 'razorpay_gateway' ? (
              /* SUBSCRIPTION RAZORPAY GATEWAY SIMULATOR */
              <div className="p-6 space-y-4 bg-[#fbfbfb]">
                <div className="p-4 bg-[#0c2340] text-white rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#3395ff] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg tracking-wider">
                    Razorpay Test Mode
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base tracking-tight">Razorpay</span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-blue-200 font-semibold">
                        Subscription Gateway
                      </span>
                    </div>
                    <div className="text-xs text-blue-100 font-medium">Merchant: MealMitra Home Tiffins</div>
                  </div>
                  <div className="text-right pr-2">
                    <div className="text-[10px] text-blue-200 uppercase font-bold">Plan Amount</div>
                    <div className="text-lg font-black text-[#68d391]">
                      ₹{Math.max(0, selectedPlanForPayment.price - (useRewardPoints ? 125 : 0)).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#dcc1b1]/70 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#eeeeed]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#faf9f8] border border-[#dcc1b1] flex items-center justify-center text-lg">
                        {paymentMethod === 'upi' ? '📱' : paymentMethod === 'card' ? '💳' : '🏦'}
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-[#1a1c1c]">{selectedPlanForPayment.name} Subscription</div>
                        <div className="text-[11px] text-[#564337]">
                          Authorizing {paymentMethod.toUpperCase()} with Chef {selectedCook.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Processing</span>
                    </div>
                  </div>

                  {/* Live Progress */}
                  <div className="space-y-2 py-2">
                    <div className="flex justify-between text-xs font-bold text-[#1a1c1c]">
                      <span>{subGatewayStatus}</span>
                      <span className="text-[#944a00] font-mono">{subGatewayProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#eeeeed] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#944a00] via-[#e67e22] to-emerald-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${subGatewayProgress}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-[#564337] leading-relaxed">
                    Razorpay is setting up your subscription mandate of <strong>₹{Math.max(0, selectedPlanForPayment.price - (useRewardPoints ? 125 : 0)).toLocaleString()}</strong>.
                  </p>

                  <div className="pt-2 border-t border-[#eeeeed] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleCancelSubGateway}
                      className="px-4 py-2 text-xs font-bold text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl border border-red-200 transition-colors cursor-pointer"
                    >
                      ✕ Cancel Subscription Payment
                    </button>
                    <div className="flex items-center gap-1 text-[10px] text-[#564337]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#51634c]" />
                      <span>Razorpay PCI-DSS Level 1</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* SUBSCRIPTION PAYMENT FAILED SCREEN */
              <div className="p-6 space-y-5 text-center bg-[#faf9f8]">
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-sm">
                  <AlertCircle className="w-9 h-9" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-3 py-1 rounded-full">
                    Subscription Payment Unsuccessful
                  </span>
                  <h4 className="text-xl font-extrabold text-[#1a1c1c] pt-1">Payment Failed</h4>
                  <p className="text-xs text-red-800 bg-red-50 p-3 rounded-xl border border-red-200 leading-relaxed text-left">
                    {subFailureReason}
                  </p>
                  <p className="text-[11px] text-[#564337]">
                    No funds were deducted. Your customization settings remain saved.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSubPaymentStep('select_method')}
                    className="w-full py-3.5 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Retry Payment / Change Method</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('cod');
                      const discount = useRewardPoints ? 125 : 0;
                      finalizeSubscriptionSuccess(Math.max(0, selectedPlanForPayment.price - discount));
                    }}
                    className="w-full py-3 bg-white border border-[#dcc1b1] hover:bg-[#faf9f8] text-[#564337] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Switch to Pay on 1st Tiffin Delivery</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
