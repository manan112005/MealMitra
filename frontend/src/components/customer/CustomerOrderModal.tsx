import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Meal } from '../../types';
import { paymentService } from '../../services/payment.service';
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
} from 'lucide-react';

interface Props {
  meal: Meal;
  onClose: () => void;
}

export const CustomerOrderModal: React.FC<Props> = ({ meal, onClose }) => {
  const { placeOrder, joinWaitlist, setCustomerTab, cooks } = useApp();

  const cook = cooks.find((c) => c.id === meal.cookId) || cooks[0];

  // Reservation state
  const [bookingDate, setBookingDate] = useState<'Today' | 'Tomorrow' | string>('Today');
  const [mealPeriod, setMealPeriod] = useState<'Lunch' | 'Dinner'>(
    meal.category === 'Dinner' ? 'Dinner' : 'Lunch'
  );
  const [fulfillmentType, setFulfillmentType] = useState<'Delivery' | 'Pickup'>('Delivery');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('Flat 402, Shivalik Heights, Judges Bungalow Rd, Bodakdev');
  const [phone, setPhone] = useState('+91 99250 12345');
  const [timeSlot, setTimeSlot] = useState(
    mealPeriod === 'Dinner' ? '8:00 PM - 8:30 PM' : '1:00 PM - 1:30 PM'
  );
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Waitlist state
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false);
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  // Dynamic capacity & cutoff based on chosen date and period
  const isToday = bookingDate === 'Today';
  const cutoffTime = mealPeriod === 'Lunch' 
    ? (cook?.lunchCutoffTime || '10:30 AM') 
    : (cook?.dinnerCutoffTime || '05:30 PM');

  // Compute available slots
  const availableSlots = isToday
    ? mealPeriod === 'Lunch'
      ? (cook?.lunchAvailableQty ?? meal.availableQty)
      : (cook?.dinnerAvailableQty ?? meal.availableQty)
    : 25; // Advance booking has open capacity slots

  const isSoldOut = availableSlots < 1;

  // Cost computation
  const subtotal = meal.price * quantity;
  const deliveryFee = fulfillmentType === 'Pickup' ? 0 : (subtotal > 300 ? 0 : 30);
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
        customerName: 'Jay Shah',
        customerPhone: phone,
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

  const handlePlaceReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSoldOut) return;

    setIsProcessingPayment(true);

    try {
      await paymentService.openCheckout({
        amount: total,
        name: 'MealMitra Tiffin Reservation',
        description: `Tiffin Slot: ${meal.name} (${mealPeriod})`,
        prefill: {
          name: 'Customer',
          contact: phone,
        },
        orderData: {
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
        },
        onSuccess: (_response) => {
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
          setIsSubmitted(true);
          setIsProcessingPayment(false);
        },
        onFailure: (err) => {
          console.warn('Payment failed or cancelled:', err);
          setIsProcessingPayment(false);
        },
      });
    } catch (error: any) {
      console.error('Payment Error:', error);
      alert(`Could not initiate payment: ${error.message || 'Please try again.'}`);
      setIsProcessingPayment(false);
    }
  };

  const handleGoToOrders = () => {
    onClose();
    setCustomerTab('orders');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#dcc1b1]/60 my-auto animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-[#eeeeed] flex justify-between items-center bg-[#faf9f8] shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 px-2.5 rounded-xl text-[#564337] hover:text-[#1a1c1c] hover:bg-white border border-[#dcc1b1]/50 flex items-center gap-1.5 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-[#dcc1b1]/60" />
            <div>
              <h3 className="font-bold text-base text-[#1a1c1c]">
                {isSubmitted ? 'Booking Confirmed!' : 'Reserve Tiffin Slot'}
              </h3>
              <p className="text-[11px] text-[#564337]">
                Finite home-cooked meals • Prepared fresh to order
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


        {isSubmitted ? (
          /* Confirmation Stepper View */
          <div className="p-6 space-y-6 text-center overflow-y-auto flex-1">
            <div className="w-16 h-16 rounded-full bg-[#d1e6c9] text-[#51634c] flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#51634c] bg-[#d1e6c9]/50 px-3 py-1 rounded-full">
                Booking {confirmedOrderId} Confirmed
              </span>
              <h4 className="text-xl font-extrabold text-[#1a1c1c] pt-2">
                Tiffin Slot Reserved Successfully!
              </h4>
              <p className="text-xs text-[#564337] leading-relaxed">
                <strong>{meal.cookName}</strong> has scheduled your meal for{' '}
                <span className="text-[#944a00] font-bold">{bookingDate} ({mealPeriod})</span>.
              </p>
              <p className="text-[11px] text-[#564337]">
                Fulfillment Mode:{' '}
                <strong className="text-[#1a1c1c]">
                  {fulfillmentType === 'Pickup' ? 'Self Kitchen Pickup' : 'Doorstep Delivery'}
                </strong>
              </p>
            </div>

            {/* Live Stepper Tracker */}
            <div className="bg-[#faf9f8] p-4 rounded-xl border border-[#dcc1b1]/50 text-left space-y-3">
              <div className="text-[11px] font-bold text-[#564337] uppercase tracking-wider">
                Official MealMitra Workflow Tracker
              </div>
              <div className="flex items-center justify-between text-xs font-semibold relative">
                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-[#944a00] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <span className="text-[9px] text-[#944a00] font-bold mt-1 text-center">Slot Reserved</span>
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
                  <span className="text-[9px] text-[#564337] mt-1 text-center">Preparing</span>
                </div>
                <div className="flex-1 h-0.5 bg-[#eeeeed] mx-1"></div>

                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-[#eeeeed] text-[#564337] flex items-center justify-center text-[10px]">
                    4
                  </div>
                  <span className="text-[9px] text-[#564337] mt-1 text-center">Meal Ready</span>
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

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-[#dcc1b1] text-[#564337] hover:bg-[#faf9f8] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Reserve Another Meal
              </button>
              <button
                onClick={handleGoToOrders}
                className="flex-1 py-3 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                View in Reservations
              </button>
            </div>
          </div>
        ) : (
          /* Reservation Placement Form */
          <form onSubmit={handlePlaceReservation} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Scrollable Form Content */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {/* Meal summary banner */}
              <div className="flex gap-4 p-3 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
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
                    <span className="text-[10px] text-[#564337]">
                      Cutoff: {cutoffTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. Date & Meal Period Selection (Advance vs Same Day) */}
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

                {/* Lunch vs Dinner Slot Selector */}
                <div className="flex gap-2 p-1 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40">
                  {(['Lunch', 'Dinner'] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => handleMealPeriodChange(period)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        mealPeriod === period
                          ? 'bg-[#944a00] text-white shadow-2xs'
                          : 'text-[#564337] hover:text-[#1a1c1c]'
                      }`}
                    >
                      {period} Slot
                    </button>
                  ))}
                </div>
              </div>

              {/* Capacity Indicator Banner */}
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                isSoldOut
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-[#d1e6c9]/40 border-[#51634c]/30 text-[#51634c]'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isSoldOut ? 'bg-red-500' : 'bg-green-600 animate-pulse'}`}></span>
                  <span className="font-bold">
                    {isSoldOut
                      ? `Slots Full for ${bookingDate} ${mealPeriod}`
                      : `${availableSlots} of ${cook?.lunchTotalQty || 40} tiffin slots remaining`}
                  </span>
                </div>
                <span className="text-[11px] opacity-80">Cutoff: {cutoffTime}</span>
              </div>

              {/* SOLD OUT / WAITLIST FALLBACK */}
              {isSoldOut ? (
                <div className="bg-[#faf9f8] p-4 rounded-xl border-2 border-dashed border-red-300 space-y-3">
                  <div className="flex items-start gap-2 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Chef's daily capacity is full for this slot.</div>
                      <p className="text-[11px] text-[#564337] mt-0.5">
                        Per MealMitra guidelines, home chefs cook finite batches. You can join the waitlist, pick another date, or explore similar chefs.
                      </p>
                    </div>
                  </div>

                  {waitlistJoined ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center space-y-1">
                      <div className="text-xs font-bold text-green-800 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Added to Waitlist!
                      </div>
                      <p className="text-[11px] text-green-700">
                        If another customer skips or releases a slot before {cutoffTime}, you'll receive an instant notification window.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        disabled={isJoiningWaitlist}
                        onClick={handleJoinWaitlist}
                        className="w-full py-2.5 bg-[#51634c] hover:bg-[#3f4e3b] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Users className="w-4 h-4" />
                        <span>{isJoiningWaitlist ? 'Joining Waitlist...' : 'Join Slot Waitlist'}</span>
                      </button>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBookingDate('Tomorrow')}
                          className="flex-1 py-2 bg-white border border-[#dcc1b1] text-[#564337] font-bold text-xs rounded-xl hover:bg-[#eeeeed] cursor-pointer"
                        >
                          Book for Tomorrow
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            setCustomerTab('discover');
                          }}
                          className="flex-1 py-2 bg-white border border-[#dcc1b1] text-[#944a00] font-bold text-xs rounded-xl hover:bg-[#eeeeed] cursor-pointer"
                        >
                          View Similar Chefs
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* 2. Fulfillment Option: Pickup vs Delivery */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1a1c1c]">Fulfillment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFulfillmentType('Delivery')}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                          fulfillmentType === 'Delivery'
                            ? 'bg-[#ffdcc5]/40 border-[#944a00] text-[#944a00] font-bold'
                            : 'bg-[#faf9f8] border-[#dcc1b1]/50 text-[#564337]'
                        }`}
                      >
                        <Truck className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="text-xs font-bold">Doorstep Delivery</div>
                          <div className="text-[10px] text-[#564337]">Cluster delivery route</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFulfillmentType('Pickup')}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                          fulfillmentType === 'Pickup'
                            ? 'bg-[#d1e6c9]/40 border-[#51634c] text-[#51634c] font-bold'
                            : 'bg-[#faf9f8] border-[#dcc1b1]/50 text-[#564337]'
                        }`}
                      >
                        <Store className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="text-xs font-bold">Kitchen Pickup</div>
                          <div className="text-[10px] text-[#564337]">Free • No fees</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex justify-between items-center py-2 border-b border-[#eeeeed]">
                    <div>
                      <div className="text-xs font-bold text-[#1a1c1c]">Tiffin Slots Quantity</div>
                      <div className="text-[11px] text-[#564337]">Max {availableSlots} available right now</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={quantity <= 1}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg border border-[#dcc1b1] flex items-center justify-center text-[#564337] hover:bg-[#faf9f8] disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-sm text-[#1a1c1c] w-6 text-center">{quantity}</span>
                      <button
                        type="button"
                        disabled={quantity >= availableSlots}
                        onClick={() => setQuantity((q) => Math.min(availableSlots, q + 1))}
                        className="w-8 h-8 rounded-lg border border-[#dcc1b1] flex items-center justify-center text-[#564337] hover:bg-[#faf9f8] disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Delivery Address OR Pickup Details */}
                  {fulfillmentType === 'Delivery' ? (
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-[#1a1c1c]">
                        <MapPin className="w-3.5 h-3.5 text-[#944a00]" />
                        <span>Delivery Address</span>
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg focus:ring-1 focus:ring-[#944a00] text-[#1a1c1c]"
                        placeholder="House / Flat / Street address"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/50 space-y-1 text-xs">
                      <div className="font-bold text-[#51634c] flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5" /> Kitchen Pickup Location:
                      </div>
                      <p className="text-[#564337]">
                        {cook.name}'s Home Kitchen — {cook.location} ({cook.distanceKm} km away)
                      </p>
                      <p className="text-[10px] text-[#564337] italic">
                        Collect your fresh packed tiffin during slot hours: {timeSlot}
                      </p>
                    </div>
                  )}

                  {/* Contact Phone & Delivery/Pickup Window */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#1a1c1c]">Contact Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg focus:ring-1 focus:ring-[#944a00] text-[#1a1c1c]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-[#1a1c1c]">
                        <Clock className="w-3.5 h-3.5 text-[#944a00]" />
                        <span>{fulfillmentType === 'Pickup' ? 'Pickup Window' : 'Delivery Window'}</span>
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg focus:ring-1 focus:ring-[#944a00] text-[#1a1c1c]"
                      >
                        {mealPeriod === 'Lunch' ? (
                          <>
                            <option value="1:00 PM - 1:30 PM">1:00 PM - 1:30 PM (Lunch)</option>
                            <option value="1:30 PM - 2:00 PM">1:30 PM - 2:00 PM (Lunch)</option>
                            <option value="2:00 PM - 2:30 PM">2:00 PM - 2:30 PM (Lunch)</option>
                          </>
                        ) : (
                          <>
                            <option value="7:30 PM - 8:00 PM">7:30 PM - 8:00 PM (Dinner)</option>
                            <option value="8:00 PM - 8:30 PM">8:00 PM - 8:30 PM (Dinner)</option>
                            <option value="8:30 PM - 9:00 PM">8:30 PM - 9:00 PM (Dinner)</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1a1c1c]">Special Kitchen Notes (Optional)</label>
                    <input
                      type="text"
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder="e.g. Mild spice, less oil, extra phulkas"
                      className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg focus:ring-1 focus:ring-[#944a00] text-[#1a1c1c]"
                    />
                  </div>

                  {/* Price Breakdown */}
                  <div className="p-3 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#564337]">
                      <span>Tiffin Subtotal ({quantity} slot{quantity > 1 ? 's' : ''})</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[#564337]">
                      <span>Fulfillment Fee ({fulfillmentType})</span>
                      <span>{deliveryFee === 0 ? <span className="text-[#51634c] font-bold">FREE</span> : `₹${deliveryFee}`}</span>
                    </div>
                    {fulfillmentType === 'Delivery' && (
                      <div className="flex justify-between text-[#564337]">
                        <span>Eco Thermal Container Carrier</span>
                        <span>₹{packagingFee}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-[#dcc1b1]/50 flex justify-between font-extrabold text-sm text-[#1a1c1c]">
                      <span>Total Amount</span>
                      <span className="text-[#944a00]">₹{total}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sticky Bottom Footer for Checkout */}
            {!isSoldOut && (
              <div className="p-4 sm:px-6 bg-[#faf9f8] border-t border-[#dcc1b1]/40 flex gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 border border-[#dcc1b1] hover:bg-white text-[#564337] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="flex-1 py-3 px-6 bg-[#944a00] hover:bg-[#713700] disabled:bg-gray-300 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  {isProcessingPayment 
                    ? 'Processing Payment...' 
                    : `Pay Securely • ₹${total}`}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
