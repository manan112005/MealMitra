import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  Clock,
  MapPin,
  Bike,
  ChefHat,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowRight,
  RotateCcw,
  Star,
  Sparkles,
  Store,
  Users,
  Calendar,
} from 'lucide-react';

export const CustomerOrders: React.FC = () => {
  const { orders, updateOrderStatus, setSelectedMealForOrder, meals, cooks, setCustomerTab, waitlist, addReview } = useApp();
  const { user } = useAuth();
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  const [reviewModalOrder, setReviewModalOrder] = useState<Order | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const activeOrders = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  );
  const pastOrders = orders.filter((o) => o.status === 'Delivered');

  const statusSteps: OrderStatus[] = [
    'Slot Reserved',
    'Confirmed',
    'Preparing',
    'Meal Ready',
    'Delivered',
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Picked Up' || status === 'Out for Delivery') return 3;
    const idx = statusSteps.indexOf(status);
    return idx >= 0 ? idx : 1;
  };

  const handleSimulateNextStep = (order: Order) => {
    const currentIndex = getStepIndex(order.status);
    if (currentIndex < statusSteps.length - 1) {
      const nextStatus = statusSteps[currentIndex + 1];
      updateOrderStatus(order.id, nextStatus);
    }
  };

  const handleReorder = (order: Order) => {
    const safeMeals = meals || [];
    const matchingMeal = safeMeals.find((m) => m.name === order.mealName) || safeMeals[0];
    if (matchingMeal) {
      setSelectedMealForOrder(matchingMeal);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewModalOrder) {
      const targetCook = (cooks || []).find((c) => c.name === reviewModalOrder.cookName);
      addReview({
        customerName: user?.name || 'MANAN PATEL',
        customerAvatar: user?.avatar || '',
        cookId: targetCook ? targetCook.id : reviewModalOrder.cookName,
        cookName: reviewModalOrder.cookName,
        mealName: reviewModalOrder.mealName,
        dishName: reviewModalOrder.mealName,
        rating: reviewRating,
        comment: reviewText.trim() || 'Delicious and authentic home-cooked meal!',
      });
    }
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewModalOrder(null);
      setReviewText('');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-[#944a00]" />
          <span>My Reservations & Tiffin Status</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#564337]">
          Track your confirmed tiffin preparation and delivery in real time, or reserve again for upcoming slots.
        </p>
      </div>

      {/* Active Waitlist Section if customer joined any waitlist */}
      {waitlist && waitlist.length > 0 && (
        <div className="bg-[#faf9f8] rounded-2xl border border-amber-300/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-700" />
              <span>Active Waitlist Slots ({waitlist.length})</span>
            </h3>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Automatic Booking Window Notification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {waitlist.map((entry) => (
              <div
                key={entry.id}
                className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-2xs space-y-1"
              >
                <div className="flex justify-between items-start">
                  <div className="font-bold text-xs text-[#1a1c1c]">{entry.mealName}</div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {entry.status}
                  </span>
                </div>
                <div className="text-xs text-[#564337]">
                  Chef: <strong>{entry.cookName}</strong> • {entry.date} ({entry.mealPeriod})
                </div>
                <p className="text-[10px] text-[#564337] italic">
                  Joined at {entry.createdAt}. You will be notified as soon as a subscriber skips or a slot is released.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Orders Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#944a00] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#944a00] animate-ping"></span>
          <span>Live In-Progress Reservations ({activeOrders.length})</span>
        </h3>

        {activeOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-8 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-[#564337]/40 mx-auto" />
            <div className="font-bold text-sm text-[#1a1c1c]">No active reservations right now</div>
            <p className="text-xs text-[#564337]">Reserve fresh home-cooked tiffins from available slots!</p>
            <button
              onClick={() => setCustomerTab('meals')}
              className="px-4 py-2 bg-[#944a00] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Browse Today's Tiffins
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {activeOrders.map((order) => {
              const currentStep = getStepIndex(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-[#944a00]/30 shadow-md p-5 sm:p-6 space-y-5"
                >
                  {/* Top Order Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eeeeed]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#1a1c1c]">{order.id}</span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#ffdcc5] text-[#944a00]">
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#564337] mt-1">
                        Cooked by <strong className="text-[#1a1c1c]">{order.cookName}</strong> • Ordered {order.orderDate} at {order.orderTime}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-[#564337]">Slot Window</div>
                        <div className="text-sm font-extrabold text-[#944a00] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{order.deliveryTimeSlot}</span>
                        </div>
                      </div>

                      {/* Prototype Stepper trigger */}
                      <button
                        onClick={() => handleSimulateNextStep(order)}
                        title="Advance status for demonstration"
                        className="px-3 py-1.5 bg-[#faf9f8] hover:bg-[#ffdcc5]/40 text-[#944a00] border border-[#dcc1b1] text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span>Demo Advance Status ➔</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual 5-Step Progress Bar */}
                  <div className="py-2">
                    <div className="grid grid-cols-5 gap-2 text-center">
                      {statusSteps.map((step, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;
                        return (
                          <div key={step} className="flex flex-col items-center">
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                                isCurrent
                                  ? 'bg-[#944a00] text-white ring-4 ring-[#ffdcc5] scale-110 shadow-sm animate-pulse'
                                  : isDone
                                  ? 'bg-[#51634c] text-white'
                                  : 'bg-[#eeeeed] text-[#564337]'
                              }`}
                            >
                              {isDone && !isCurrent ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] sm:text-xs font-semibold ${
                                isCurrent
                                  ? 'text-[#944a00] font-bold'
                                  : isDone
                                  ? 'text-[#51634c]'
                                  : 'text-[#564337]/70'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="relative mt-2 mx-6">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[#eeeeed] rounded-full" />
                      <div
                        className="absolute top-0 left-0 h-1 bg-[#944a00] rounded-full transition-all duration-500"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Order Details & Delivery Partner info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#eeeeed] text-xs">
                    <div className="space-y-1.5">
                      <div className="font-bold text-[#1a1c1c]">Meal Item Details:</div>
                      <div className="flex justify-between text-[#564337]">
                        <span>
                          {order.quantity}x {order.mealName}
                        </span>
                        <span className="font-semibold text-[#1a1c1c]">₹{order.pricePerUnit * order.quantity}</span>
                      </div>
                      {order.specialNotes && (
                        <div className="text-[11px] text-[#944a00] font-medium bg-[#ffdcc5]/40 p-1.5 rounded-md">
                          Note: "{order.specialNotes}"
                        </div>
                      )}
                      <div className="pt-1 flex justify-between font-extrabold text-sm text-[#1a1c1c] border-t border-[#eeeeed]">
                        <span>Total Amount Paid</span>
                        <span className="text-[#944a00]">₹{order.totalAmount}</span>
                      </div>
                    </div>

                    <div className="bg-[#faf9f8] p-3 rounded-xl border border-[#dcc1b1]/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1a1c1c] flex items-center gap-1.5">
                          {order.fulfillmentType === 'Pickup' ? (
                            <>
                              <Store className="w-4 h-4 text-[#51634c]" /> Kitchen Pickup
                            </>
                          ) : (
                            <>
                              <Bike className="w-4 h-4 text-[#4e6074]" /> Delivery Partner
                            </>
                          )}
                        </span>
                        <span className="text-[#51634c] font-bold text-[11px]">
                          ● {order.fulfillmentType === 'Pickup' ? 'Self Collection' : 'Assigned & Active'}
                        </span>
                      </div>
                      <div className="text-[#564337]">
                        <strong>
                          {order.fulfillmentType === 'Pickup'
                            ? `${order.cookName}'s Kitchen`
                            : order.deliveryPartnerName || 'Ramesh Patel (Cluster Partner)'}
                        </strong>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#564337]">
                        <MapPin className="w-3.5 h-3.5 text-[#944a00] shrink-0" />
                        <span className="truncate">
                          {order.fulfillmentType === 'Pickup'
                            ? `Collection point: ${order.customerAddress}`
                            : `Drop: ${order.customerAddress}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Completed Reservations */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337]">
          Past Completed Reservations ({pastOrders.length})
        </h3>

        <div className="space-y-3">
          {pastOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#dcc1b1]/50 p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-xs transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1a1c1c]">{order.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d1e6c9] text-[#51634c]">
                    ✓ {order.fulfillmentType === 'Pickup' ? 'Collected' : 'Delivered'}
                  </span>
                  <span className="text-xs text-[#564337]">on {order.orderDate}</span>
                </div>

                <div className="text-xs text-[#564337]">
                  Chef: <strong>{order.cookName}</strong> • {order.quantity}x {order.mealName}
                </div>

                <div className="text-xs font-bold text-[#944a00]">Total: ₹{order.totalAmount}</div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setReviewModalOrder(order)}
                  className="flex-1 sm:flex-initial px-3 py-2 bg-[#faf9f8] hover:bg-[#eeeeed] text-[#564337] border border-[#dcc1b1] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Star className="w-3.5 h-3.5 text-[#e67e22]" />
                  <span>Rate Tiffin</span>
                </button>

                <button
                  onClick={() => handleReorder(order)}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-[#944a00] hover:bg-[#713700] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reserve Again</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#dcc1b1] shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setReviewModalOrder(null)}
                  className="p-1 px-2.5 rounded-lg text-[#564337] hover:text-[#1a1c1c] hover:bg-gray-100 border border-[#dcc1b1]/60 flex items-center gap-1 text-xs font-bold transition-all shadow-2xs"
                  title="Back"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>Back</span>
                </button>
                <div className="h-4 w-px bg-[#dcc1b1]/50" />
                <h3 className="text-base font-bold text-[#1a1c1c]">
                  Rate {reviewModalOrder.cookName}'s Food
                </h3>
              </div>
            </div>
            <p className="text-xs text-[#564337]">
              How was your meal for order #{reviewModalOrder.id}? Your feedback helps home cooks maintain high quality.
            </p>

            {reviewSuccess ? (
              <div className="p-4 bg-[#d1e6c9] text-[#51634c] text-xs font-bold rounded-xl text-center">
                ✓ Thank you! Review shared with {reviewModalOrder.cookName}.
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? 'fill-[#e67e22] text-[#e67e22]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1a1c1c]">Your Comments</label>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    placeholder="e.g. Delicious, warm and perfectly spiced dal and soft rotis!"
                    className="w-full p-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:ring-1 focus:ring-[#944a00]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOrder(null)}
                    className="px-4 py-2.5 border border-[#dcc1b1] text-[#564337] rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#944a00] hover:bg-[#713700] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
