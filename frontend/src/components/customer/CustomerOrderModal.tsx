import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Meal } from '../../types';
import { loadRazorpay } from '../../utils/razorpay';
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
} from 'lucide-react';

interface Props {
  meal: Meal;
  onClose: () => void;
}

export const CustomerOrderModal: React.FC<Props> = ({ meal, onClose }) => {
  const { placeOrder, setCustomerTab, cooks } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('Flat 402, Shivalik Heights, Judges Bungalow Rd, Bodakdev');
  const [phone, setPhone] = useState('+91 99250 12345');
  const [timeSlot, setTimeSlot] = useState(meal.timeSlot || '1:00 PM - 1:30 PM (Fastest)');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  const subtotal = meal.price * quantity;
  const deliveryFee = subtotal > 300 ? 0 : 30;
  const packagingFee = 15;
  const total = subtotal + deliveryFee + packagingFee;

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Are you offline or using an adblocker?');
      }

      const response = await fetch('http://localhost:3001/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'one_time',
          amount: total,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment');
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MealMitra',
        description: `Order for ${meal.name}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('http://localhost:3001/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.status === 'success') {
              const finalOrderId = placeOrder({
                meal,
                quantity,
                address,
                phone,
                timeSlot,
                specialNotes,
              });
              setConfirmedOrderId(finalOrderId);
              setIsSubmitted(true);
            } else {
              alert('Payment verification failed. Please try again.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Error verifying payment.');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: 'Jay Shah',
          contact: phone,
        },
        theme: {
          color: '#944a00',
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error(response.error);
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessingPayment(false);
      });
      rzp.open();

    } catch (error: any) {
      console.error('Payment Error:', error);
      alert(`Could not initiate payment: ${error.message || 'Ensure backend is running.'}`);
      setIsProcessingPayment(false);
    }
  };

  const handleGoToOrders = () => {
    onClose();
    setCustomerTab('orders');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#dcc1b1]/60 my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#eeeeed] flex justify-between items-center bg-[#faf9f8]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#944a00]" />
            <h3 className="font-bold text-base text-[#1a1c1c]">
              {isSubmitted ? 'Order Confirmed!' : 'Place Homemade Meal Order'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#564337] hover:bg-[#eeeeed] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          /* Confirmation Stepper View */
          <div className="p-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#d1e6c9] text-[#51634c] flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#51634c] bg-[#d1e6c9]/40 px-3 py-1 rounded-full">
                Order {confirmedOrderId} Confirmed
              </span>
              <h4 className="text-xl font-extrabold text-[#1a1c1c] pt-2">
                Your order is on its way to the kitchen!
              </h4>
              <p className="text-xs text-[#564337]">
                <strong>{meal.cookName}</strong> will start preparing your fresh meal shortly.
              </p>
            </div>

            {/* Live Stepper Preview */}
            <div className="bg-[#faf9f8] p-4 rounded-xl border border-[#dcc1b1]/50 text-left space-y-3">
              <div className="text-xs font-bold text-[#564337] uppercase tracking-wider">
                Live Status Tracker
              </div>
              <div className="flex items-center justify-between text-xs font-semibold relative">
                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-[#944a00] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <span className="text-[10px] text-[#944a00] font-bold mt-1">Confirmed</span>
                </div>
                <div className="flex-1 h-0.5 bg-[#ffdcc5] mx-1"></div>

                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-[#ffdcc5] text-[#944a00] flex items-center justify-center text-[10px] font-bold animate-pulse">
                    2
                  </div>
                  <span className="text-[10px] text-[#564337] mt-1">Preparing</span>
                </div>
                <div className="flex-1 h-0.5 bg-[#eeeeed] mx-1"></div>

                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-[#eeeeed] text-[#564337] flex items-center justify-center text-[10px]">
                    3
                  </div>
                  <span className="text-[10px] text-[#564337] mt-1">Picked Up</span>
                </div>
                <div className="flex-1 h-0.5 bg-[#eeeeed] mx-1"></div>

                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-[#eeeeed] text-[#564337] flex items-center justify-center text-[10px]">
                    4
                  </div>
                  <span className="text-[10px] text-[#564337] mt-1">Delivered</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-[#dcc1b1] text-[#564337] hover:bg-[#faf9f8] font-bold text-xs rounded-xl transition-colors"
              >
                Back to Meals
              </button>
              <button
                onClick={handleGoToOrders}
                className="flex-1 py-3 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Track Live in Orders
              </button>
            </div>
          </div>
        ) : (
          /* Order Placement Form */
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-5">
            {/* Meal summary item */}
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
                    {cooks.find(c => c.name === meal.cookName)?.rating || '4.8'} 
                    ({cooks.find(c => c.name === meal.cookName)?.reviewsCount || '120'} reviews)
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#d1e6c9] text-[#51634c]">
                    {meal.dietary}
                  </span>
                  <span className="text-[10px] text-[#564337]">
                    Only {meal.availableQty} meals remaining today
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex justify-between items-center py-2 border-b border-[#eeeeed]">
              <div>
                <div className="text-xs font-bold text-[#1a1c1c]">Quantity</div>
                <div className="text-[11px] text-[#564337]">Max {meal.availableQty} per customer</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg border border-[#dcc1b1] flex items-center justify-center text-[#564337] hover:bg-[#faf9f8] disabled:opacity-40 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-[#1a1c1c] w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  disabled={quantity >= meal.availableQty}
                  onClick={() => setQuantity((q) => Math.min(meal.availableQty, q + 1))}
                  className="w-8 h-8 rounded-lg border border-[#dcc1b1] flex items-center justify-center text-[#564337] hover:bg-[#faf9f8] disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Delivery Address */}
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
                className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg focus:ring-1 focus:ring-[#944a00] focus:border-[#944a00] text-[#1a1c1c]"
                placeholder="House / Flat / Street address"
              />
            </div>

            {/* Phone & Delivery Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1c1c]">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg focus:ring-1 focus:ring-[#944a00] focus:border-[#944a00] text-[#1a1c1c]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#1a1c1c]">
                  <Clock className="w-3.5 h-3.5 text-[#944a00]" />
                  <span>Time Slot</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg focus:ring-1 focus:ring-[#944a00] focus:border-[#944a00] text-[#1a1c1c]"
                >
                  <option value="1:00 PM - 1:30 PM (Fastest)">1:00 PM - 1:30 PM (Fastest)</option>
                  <option value="1:30 PM - 2:00 PM">1:30 PM - 2:00 PM</option>
                  <option value="2:00 PM - 2:30 PM">2:00 PM - 2:30 PM</option>
                  <option value="7:30 PM - 8:00 PM (Dinner)">7:30 PM - 8:00 PM (Dinner)</option>
                </select>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1a1c1c]">Special Cooking Instructions (Optional)</label>
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Mild spice, extra soft rotis, no onion"
                className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg focus:ring-1 focus:ring-[#944a00] focus:border-[#944a00] text-[#1a1c1c]"
              />
            </div>

            {/* Price Breakdown */}
            <div className="p-3 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#564337]">
                <span>Item Total ({quantity}x)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[#564337]">
                <span>Delivery Partner Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-[#51634c] font-bold">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-[#564337]">
                <span>Eco Thermal Packaging</span>
                <span>₹{packagingFee}</span>
              </div>
              <div className="pt-2 border-t border-[#dcc1b1]/50 flex justify-between font-extrabold text-sm text-[#1a1c1c]">
                <span>To Pay</span>
                <span className="text-[#944a00]">₹{total}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={meal.availableQty < 1 || isProcessingPayment}
              className="w-full py-3.5 px-6 bg-[#944a00] hover:bg-[#713700] disabled:bg-gray-300 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              {meal.availableQty < 1 
                ? 'Sold Out Today' 
                : isProcessingPayment 
                  ? 'Processing Payment...' 
                  : `Pay Securely & Place Order • ₹${total}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
