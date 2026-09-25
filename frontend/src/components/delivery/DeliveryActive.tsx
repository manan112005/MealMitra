import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bike,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  Compass,
  Zap,
  ArrowRight,
  ChefHat,
  ExternalLink,
  Thermometer,
  Flame,
} from 'lucide-react';
import { optimizeDeliveryRoute } from '../../utils/routeOptimizer';
import { GoogleMapView } from './GoogleMapView';

export const DeliveryActive: React.FC = () => {
  const { routeStops, completeRouteStop, setDeliveryTab, deliveryPartnerState } = useApp();
  const [customerOtp, setCustomerOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [isDeliveredSuccess, setIsDeliveredSuccess] = useState(false);

  const routeOptimization = useMemo(() => {
    return optimizeDeliveryRoute(routeStops);
  }, [routeStops]);

  const optimizedStops = routeOptimization.orderedStops;
  // Strictly only look for pending or in-progress customer drops
  const pendingDropStops = optimizedStops.filter(
    (s) => s.type === 'Customer Drop' && s.status !== 'Completed'
  );
  const activeCustomerStop =
    pendingDropStops.find((s) => s.status === 'In Progress') ||
    pendingDropStops.find((s) => s.status === 'Pending') ||
    pendingDropStops[0] ||
    null;

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerOtp.length !== 4 && customerOtp !== '') {
      setOtpError(true);
      return;
    }
    setOtpError(false);
    if (activeCustomerStop) {
      completeRouteStop(activeCustomerStop.id);
    }
    setIsDeliveredSuccess(true);
    setTimeout(() => {
      setIsDeliveredSuccess(false);
      setDeliveryTab('dashboard');
    }, 1500);
  };

  if (!activeCustomerStop) {
    return (
      <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Bike className="w-6 h-6 text-[#4e6074]" />
            <span>Active Turn-by-Turn Delivery Navigation</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Live in-transit drop-off guidance and proof of delivery handover.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-12 text-center shadow-2xs space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-700">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-extrabold text-[#1a1c1c]">No Active In-Transit Drops Pending</h3>
          <p className="text-xs text-[#564337] max-w-sm mx-auto">
            All assigned customer deliveries have been completed or handed over. When cooks prepare new orders, active drops will automatically appear here.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setDeliveryTab('pickup')}
              className="px-5 py-2.5 bg-[#944a00] hover:bg-[#783c00] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Check Kitchen Pickups
            </button>
            <button
              onClick={() => setDeliveryTab('dashboard')}
              className="px-5 py-2.5 bg-[#4e6074] hover:bg-[#384859] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              View Dashboard & Earnings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Bike className="w-6 h-6 text-[#4e6074]" />
            <span>Google Maps Turn-by-Turn Delivery Navigation</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Live in-transit Google Maps GPS guidance, shortest path vector, and proof of delivery handover.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-[#d1e4fc] text-[#4e6074] font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Google Maps GPS Active</span>
          </span>
          <button
            onClick={() => setDeliveryTab('deliveries')}
            className="px-3.5 py-1.5 bg-white border border-[#dcc1b1] text-[#564337] font-bold text-xs rounded-xl hover:bg-[#eeeeed] transition-colors cursor-pointer"
          >
            All Waypoints
          </button>
        </div>
      </div>

      {isDeliveredSuccess && (
        <div className="p-4 bg-[#d1e6c9] text-[#51634c] text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Delivery confirmed! Trip earnings of ₹60 credited to your wallet.</span>
        </div>
      )}

      {/* Active Trip Thermal Safety & Live Traffic AI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Hot-Food Thermal Decay Gauge */}
        <div className="bg-gradient-to-br from-[#fff7f0] to-[#fff] p-4 rounded-2xl border border-[#ffdcc5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[#b34700]">
              <Thermometer className="w-4 h-4 text-[#ff6d00]" />
              <span>AI Hot-Food Thermal Decay</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#b34700] text-[10px] font-black">
              🔥 76.4°C Steaming Hot
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#ff6d00] to-emerald-500 rounded-full w-4/5" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#6a422a]">
            <span>Safety Limit: 58°C</span>
            <span className="font-extrabold text-emerald-700">32 mins safe margin</span>
          </div>
        </div>

        {/* AI Traffic Auto-Reroute Active Bar */}
        <div className="bg-gradient-to-br from-indigo-50/80 to-white p-4 rounded-2xl border border-indigo-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-indigo-900">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>AI Traffic Bypass Active</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black">
              -11 Mins Saved
            </span>
          </div>

          <p className="text-xs text-indigo-950 font-medium">
            Diverted around SG Highway via Judges Bungalow Rd. Arriving on time with maximum heat.
          </p>
        </div>
      </div>

      {/* Real Google Maps Navigation Component */}
      <GoogleMapView
        stops={optimizedStops}
        activeStop={activeCustomerStop}
        clusterName={deliveryPartnerState?.activeCluster}
      />

      {/* Delivery Details & OTP Verification Section */}
      <div className="bg-white rounded-2xl border-2 border-[#4e6074]/40 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#eeeeed]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4e6074] bg-[#d1e4fc] px-2.5 py-0.5 rounded-full">
              In-Transit Destination
            </span>
            <h3 className="text-xl font-extrabold text-[#1a1c1c] mt-1">
              Delivering to {activeCustomerStop.targetName}
            </h3>
            <div className="text-xs text-[#564337] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#944a00]" />
              <span>{activeCustomerStop.address}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${activeCustomerStop.phone}`}
              className="px-4 py-2.5 bg-[#faf9f8] hover:bg-[#eeeeed] border border-[#dcc1b1] text-[#564337] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#944a00]" />
              <span>Call Customer</span>
            </a>
          </div>
        </div>

        {/* Meal Package Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#faf9f8] p-4 rounded-xl border border-[#dcc1b1]/40 space-y-1.5">
            <div className="font-bold text-[#1a1c1c] flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-[#944a00]" />
              <span>Customer Meal Package:</span>
            </div>
            <div className="text-[#564337] font-medium">{activeCustomerStop.itemsSummary}</div>
            <div className="text-[11px] text-[#51634c] font-semibold pt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pre-paid Online via MealMitra Razorpay (Zero cash collection)</span>
            </div>
          </div>

          <div className="bg-[#faf9f8] p-4 rounded-xl border border-[#dcc1b1]/40 space-y-1.5">
            <div className="font-bold text-[#1a1c1c]">Customer Gate Drop Instructions:</div>
            <div className="text-[#564337] leading-relaxed">
              "Ring doorbell once, hand over hot insulated containers directly to resident."
            </div>
            <div className="text-[10px] text-[#4e6074] font-semibold">
              Insulated Thermal Bag: Temperature Verified Hot (65°C+)
            </div>
          </div>
        </div>

        {/* Delivery OTP Handover Form */}
        <form onSubmit={handleConfirmDelivery} className="p-5 bg-[#faf9f8] rounded-2xl border border-[#dcc1b1]/60 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <div className="text-xs font-bold text-[#1a1c1c] uppercase tracking-wider">
                Customer Handover Verification
              </div>
              <div className="text-[11px] text-[#564337]">
                Ask customer for 4-digit Delivery OTP (Demo OTP: <strong className="text-[#944a00]">4821</strong> or click Confirm Delivery)
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={4}
                value={customerOtp}
                onChange={(e) => setCustomerOtp(e.target.value)}
                placeholder="4-digit OTP"
                className="w-32 px-3 py-2 text-center text-sm font-mono font-bold bg-white border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
              />

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#4e6074] hover:bg-[#384859] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirm Delivery
              </button>
            </div>
          </div>

          {otpError && (
            <div className="text-xs text-red-600 font-semibold">
              Please enter a valid 4-digit OTP or leave empty for quick prototype completion.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
