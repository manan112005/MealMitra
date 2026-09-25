import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Meal } from '../../types';
import { RazorpayCheckoutModal } from '../common/RazorpayCheckoutModal';
import {
  X,
  Plus,
  Minus,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  Star,
  Calendar,
  Truck,
  Store,
  Users,
  ArrowLeft,
  Smartphone,
  CreditCard,
  Landmark,
  Banknote,
  QrCode,
  Lock,
  Receipt,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface Props {
  meal: Meal;
  onClose: () => void;
}

export const CustomerOrderModal: React.FC<Props> = ({ meal, onClose }) => {
  const { placeOrder, joinWaitlist, setCustomerTab, cooks } = useApp();
  const { currentUser } = useAuth();

  const cook = cooks.find((c) => c.id === meal.cookId) || cooks[0];

  const realCustomerName = currentUser?.name || currentUser?.applicationDetails?.name || 'Customer';
  const realCustomerPhone = currentUser?.phone || '+91 98251 23456';
  const realCustomerAddress =
    currentUser?.applicationDetails?.address || 'Flat 402, Shivalik Residency, Navrangpura, Ahmedabad';

  // Modal Step state: 'details' -> 'confirmed' (Razorpay popup opens over modal)
  const [currentStep, setCurrentStep] = useState<'details' | 'confirmed'>('details');
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  // Reservation state
  const [bookingDate, setBookingDate] = useState<'Today' | 'Tomorrow' | string>('Today');
  const [mealPeriod, setMealPeriod] = useState<'Lunch' | 'Dinner'>(
    meal.category === 'Dinner' ? 'Dinner' : 'Lunch'
  );
  const [fulfillmentType, setFulfillmentType] = useState<'Delivery' | 'Pickup'>('Delivery');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState(realCustomerAddress);
  const [phone, setPhone] = useState(realCustomerPhone);
  const [timeSlot, setTimeSlot] = useState(
    mealPeriod === 'Dinner' ? '8:00 PM - 8:30 PM' : '1:00 PM - 1:30 PM'
  );
  const [specialNotes, setSpecialNotes] = useState('');
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [confirmedPaymentId, setConfirmedPaymentId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Payment method selection inside Razorpay view
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred' | 'custom'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Waitlist state
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false);
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  // Dynamic capacity & cutoff based on chosen date and period
  const isToday = bookingDate === 'Today';
  const cutoffTime =
    mealPeriod === 'Lunch' ? cook?.lunchCutoffTime || '10:30 AM' : cook?.dinnerCutoffTime || '05:30 PM';

  // Compute available slots
  const availableSlots = isToday
    ? mealPeriod === 'Lunch'
      ? cook?.lunchAvailableQty ?? meal.availableQty
      : cook?.dinnerAvailableQty ?? meal.availableQty
    : 25; // Advance booking has open capacity slots

  const isSoldOut = availableSlots < 1;

  // Cost computation
  const subtotal = meal.price * quantity;
  const deliveryFee = fulfillmentType === 'Pickup' ? 0 : subtotal > 300 ? 0 : 30;
  const packagingFee = fulfillmentType === 'Pickup' ? 0 : 15;
  const total = subtotal + deliveryFee + packagingFee;

  const handleMealPeriodChange = (period: 'Lunch' | 'Dinner') => {
    setMealPeriod(period);
    setTimeSlot(period === 'Dinner' ? '8:00 PM - 8:30 PM' : '1:00 PM - 1:30 PM');
  };

  const handleJoinWaitlist = async () => {
    setIsJoiningWaitlist(true);
    try {
      await joinWaitlist({
        cookId: cook.id,
        cookName: cook.name,
        mealId: meal.id,
        mealName: meal.name,
        customerName: realCustomerName,
        customerPhone: phone || realCustomerPhone,
        date: bookingDate,
        mealPeriod,
      });
      setWaitlistJoined(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsJoiningWaitlist(false);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSoldOut) return;
    if (!address.trim() && fulfillmentType === 'Delivery') {
      alert('Please provide a delivery address.');
      return;
    }
    setShowRazorpayModal(true);
  };

  const handlePaymentSuccess = (result: {
    paymentId: string;
    orderId: string;
    signature: string;
    method: string;
  }) => {
    const finalOrderId = placeOrder({
      meal,
      quantity,
      address,
      phone,
      timeSlot,
      specialNotes,
      bookingDate,
      mealPeriod,
      fulfillmentType,
      bookingType: 'one_time',
    });

    setConfirmedOrderId(finalOrderId);
    setConfirmedPaymentId(result.paymentId);
    setShowRazorpayModal(false);
    setCurrentStep('confirmed');
  };

  const handleGoToOrders = () => {
    onClose();
    setCustomerTab('orders');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      {/* Official Razorpay Checkout Popup Modal (Matches UI in Screenshot) */}
      <RazorpayCheckoutModal
        isOpen={showRazorpayModal}
        amount={total}
        itemName={meal.name}
        description={`Fresh meal prepared by ${meal.cookName}`}
        customerPhone={phone || realCustomerPhone}
        customerName={realCustomerName}
        onClose={() => setShowRazorpayModal(false)}
        onSuccess={handlePaymentSuccess}
        orderData={{
          mealId: meal.id,
          quantity,
          address,
          phone,
          timeSlot,
          specialNotes,
          bookingDate,
          mealPeriod,
          fulfillmentType,
          bookingType: 'one_time',
        }}
      />

      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#dcc1b1]/60 my-auto animate-in zoom-in-95 duration-150 relative">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-[#eeeeed] flex justify-between items-center bg-[#faf9f8] shrink-0">
          <div className="flex items-center gap-3">
            {currentStep === 'confirmed' ? (
              <div className="p-1 px-2.5 rounded-xl bg-[#d1e6c9] text-[#51634c] font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Success</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 px-2.5 rounded-xl text-[#564337] hover:text-[#1a1c1c] hover:bg-white border border-[#dcc1b1]/50 flex items-center gap-1.5 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="Back"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
            <div className="h-4 w-px bg-[#dcc1b1]/60" />
            <div>
              <h3 className="font-bold text-base text-[#1a1c1c]">
                {currentStep === 'confirmed'
                  ? 'Booking Confirmed!'
                  : 'Add to Cart & Order'}
              </h3>
              <p className="text-[11px] text-[#564337]">
                {currentStep === 'confirmed'
                  ? 'Your payment was verified and tiffin slot is reserved'
                  : 'Fresh home-cooked meal • Fast preparation & delivery'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#564337] hover:bg-[#eeeeed] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 2: CONFIRMED & TRACK RESERVATION */}
        {currentStep === 'confirmed' ? (
          <div className="p-6 space-y-6 text-center overflow-y-auto flex-1">
            <div className="w-16 h-16 rounded-full bg-[#d1e6c9] text-[#51634c] flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#51634c] bg-[#d1e6c9]/50 px-3 py-1 rounded-full">
                Booking #{confirmedOrderId} Confirmed
              </span>
              <h4 className="text-xl font-extrabold text-[#1a1c1c] pt-2">
                Payment Verified & Tiffin Slot Reserved!
              </h4>
              <p className="text-xs text-[#564337] leading-relaxed">
                <strong>{meal.cookName}</strong> has received your payment of <span className="font-bold text-[#944a00]">₹{total}</span> via <strong className="text-[#1a1c1c]">Razorpay Gateway</strong> for{' '}
                <span className="text-[#944a00] font-bold">
                  {bookingDate} ({mealPeriod})
                </span>
                .
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] text-[#51634c] bg-[#d1e6c9]/40 px-2.5 py-1 rounded-lg font-mono font-bold mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Razorpay Ref: {confirmedPaymentId}</span>
              </div>
            </div>

            {/* Live Stepper Tracker */}
            <div className="bg-[#faf9f8] p-4 rounded-xl border border-[#dcc1b1]/50 text-left space-y-3">
              <div className="text-[11px] font-bold text-[#564337] uppercase tracking-wider">
                Live Kitchen & Delivery Tracker
              </div>
              <div className="flex items-center justify-between text-xs font-semibold relative">
                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-[#944a00] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <span className="text-[9px] text-[#944a00] font-bold mt-1 text-center">Paid & Booked</span>
                </div>
                <div className="flex-1 h-0.5 bg-[#944a00] mx-1"></div>

                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-[#944a00] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <span className="text-[9px] text-[#944a00] font-bold mt-1 text-center">Confirmed</span>
                </div>
                <div className="flex-1 h-0.5 bg-[#ffdcc5] mx-1"></div>

                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-[#ffdcc5] text-[#944a00] flex items-center justify-center text-[10px] font-bold animate-pulse">
                    3
                  </div>
                  <span className="text-[9px] text-[#564337] mt-1 text-center">Kitchen Prep</span>
                </div>
                <div className="flex-1 h-0.5 bg-[#eeeeed] mx-1"></div>

                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-[#eeeeed] text-[#564337] flex items-center justify-center text-[10px]">
                    4
                  </div>
                  <span className="text-[9px] text-[#564337] mt-1 text-center">Packed</span>
                </div>
                <div className="flex-1 h-0.5 bg-[#eeeeed] mx-1"></div>

                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-[#eeeeed] text-[#564337] flex items-center justify-center text-[10px]">
                    5
                  </div>
                  <span className="text-[9px] text-[#564337] mt-1 text-center">
                    {fulfillmentType === 'Pickup' ? 'Collected' : 'Delivered'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-[#dcc1b1] text-[#564337] hover:bg-[#faf9f8] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
              <button
                onClick={handleGoToOrders}
                className="flex-1 py-3.5 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Track Order in Reservations</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* STEP 1: RESERVATION DETAILS FORM */
          <form onSubmit={handleProceedToPayment} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Scrollable Form Content */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {/* Meal summary banner */}
              <div className="flex gap-4 p-3 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40">
                <img src={meal.image} alt={meal.name} className="w-20 h-20 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#1a1c1c] truncate">{meal.name}</h4>
                    <span className="font-extrabold text-[#944a00] text-sm">₹{meal.price}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-[#564337]">By {meal.cookName}</p>
                    <div className="flex items-center gap-1 text-[10px] text-[#944a00] font-bold bg-[#ffdcc5]/50 px-1.5 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-[#e67e22] text-[#e67e22]" />
                      {cook?.rating || '4.8'} ({cook?.reviewsCount || '120'})
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#d1e6c9] text-[#51634c]">
                      {meal.dietary}
                    </span>
                    <span className="text-[10px] text-[#564337]">Cutoff: {cutoffTime}</span>
                  </div>
                </div>
              </div>

              {/* 1. Date & Meal Period Selection */}
              <div className="space-y-3">
                <label className="flex items-center justify-between text-xs font-bold text-[#1a1c1c]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#944a00]" />
                    <span>Select Date (Same-Day or Advance Booking)</span>
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {['Today', 'Tomorrow', 'Day After'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setBookingDate(d)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        bookingDate === d
                          ? 'bg-[#944a00] text-white border-[#944a00] shadow-2xs'
                          : 'bg-[#faf9f8] text-[#564337] border-[#dcc1b1]/50 hover:bg-[#eeeeed]'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleMealPeriodChange('Lunch')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      mealPeriod === 'Lunch'
                        ? 'bg-[#944a00] text-white border-[#944a00] shadow-2xs'
                        : 'bg-[#faf9f8] text-[#564337] border-[#dcc1b1]/50 hover:bg-[#eeeeed]'
                    }`}
                  >
                    Lunch Slot
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMealPeriodChange('Dinner')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      mealPeriod === 'Dinner'
                        ? 'bg-[#944a00] text-white border-[#944a00] shadow-2xs'
                        : 'bg-[#faf9f8] text-[#564337] border-[#dcc1b1]/50 hover:bg-[#eeeeed]'
                    }`}
                  >
                    Dinner Slot
                  </button>
                </div>
              </div>

              {/* Dynamic Availability Indicator & Waitlist Alert */}
              {isSoldOut ? (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">
                        {bookingDate} {mealPeriod} Slots are Sold Out!
                      </h4>
                      <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                        To preserve homestyle quality, {meal.cookName} cooks a finite number of meals.
                      </p>
                    </div>
                  </div>

                  {waitlistJoined ? (
                    <div className="p-2.5 bg-green-50 border border-green-200 rounded-lg text-xs font-bold text-green-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Joined Waitlist! You'll receive an SMS priority invite if a slot opens.</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleJoinWaitlist}
                      disabled={isJoiningWaitlist}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>{isJoiningWaitlist ? 'Joining...' : 'Join Waitlist for Released Slots'}</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#d1e6c9]/40 border border-[#51634c]/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#51634c] animate-pulse" />
                    <span className="text-xs font-bold text-[#51634c]">
                      {availableSlots} of 25 tiffin slots remaining
                    </span>
                  </div>
                  <span className="text-[10px] text-[#564337]">Cutoff: {cutoffTime}</span>
                </div>
              )}

              {/* 2. Fulfillment Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1a1c1c]">Fulfillment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('Delivery')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      fulfillmentType === 'Delivery'
                        ? 'bg-[#ffdcc5]/40 border-[#944a00] text-[#944a00]'
                        : 'bg-white border-[#dcc1b1]/60 text-[#564337] hover:bg-[#faf9f8]'
                    }`}
                  >
                    <Truck className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs text-[#1a1c1c]">Doorstep Delivery</div>
                      <div className="text-[10px] text-[#564337]">Cluster delivery route</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType('Pickup')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      fulfillmentType === 'Pickup'
                        ? 'bg-[#ffdcc5]/40 border-[#944a00] text-[#944a00]'
                        : 'bg-white border-[#dcc1b1]/60 text-[#564337] hover:bg-[#faf9f8]'
                    }`}
                  >
                    <Store className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-xs text-[#1a1c1c]">Kitchen Pickup</div>
                      <div className="text-[10px] text-[#564337]">Free • No fees</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. Quantity */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf9f8] border border-[#dcc1b1]/50">
                <div>
                  <div className="font-bold text-xs text-[#1a1c1c]">Tiffin Slots Quantity</div>
                  <div className="text-[10px] text-[#564337]">Max {availableSlots} available right now</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-[#dcc1b1] flex items-center justify-center text-[#564337] hover:bg-[#eeeeed] active:scale-95 transition-all cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-extrabold text-sm w-4 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(availableSlots || 1, quantity + 1))}
                    disabled={quantity >= availableSlots}
                    className="w-8 h-8 rounded-lg bg-white border border-[#dcc1b1] flex items-center justify-center text-[#564337] hover:bg-[#eeeeed] disabled:opacity-40 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4. Delivery Address or Pickup Info */}
              {fulfillmentType === 'Delivery' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1a1c1c] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#944a00]" />
                    <span>Delivery Address</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Enter complete delivery address"
                    className="w-full bg-[#faf9f8] border border-[#dcc1b1] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1c1c] focus:outline-[#944a00] focus:bg-white"
                  />
                </div>
              ) : (
                <div className="p-3 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/50 space-y-1">
                  <div className="text-xs font-bold text-[#1a1c1c]">Kitchen Pickup Location</div>
                  <div className="text-xs text-[#564337]">
                    {cook?.address || `${meal.cookName}'s Kitchen, Satellite / Navrangpura, Ahmedabad`}
                  </div>
                  <div className="text-[10px] text-[#944a00] font-semibold">
                    Collect warm tiffin during: {timeSlot}
                  </div>
                </div>
              )}

              {/* Phone and Slot Window */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1a1c1c]">Customer Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-[#faf9f8] border border-[#dcc1b1] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1c1c] focus:outline-[#944a00] focus:bg-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1a1c1c] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#944a00]" />
                    <span>Delivery Window</span>
                  </label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-[#faf9f8] border border-[#dcc1b1] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1c1c] focus:outline-[#944a00] focus:bg-white"
                  />
                </div>
              </div>

              {/* Special instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1c1c]">Special Cooking Instructions</label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Less spicy, extra lemon, leave with security"
                  className="w-full bg-[#faf9f8] border border-[#dcc1b1] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1c1c] focus:outline-[#944a00] focus:bg-white"
                />
              </div>
            </div>

            {/* Modal Bottom / Action Footer */}
            <div className="p-4 sm:p-5 border-t border-[#eeeeed] bg-[#faf9f8] flex gap-3 items-center shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-[#dcc1b1] text-xs font-bold text-[#564337] rounded-xl hover:bg-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSoldOut}
                className="flex-1 py-3.5 bg-[#944a00] hover:bg-[#713700] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Proceed to Payment • ₹{total}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
