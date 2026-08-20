import React, { useState } from 'react';
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
} from 'lucide-react';

export const DeliveryActive: React.FC = () => {
  const { routeStops, completeRouteStop, setDeliveryTab } = useApp();
  const [customerOtp, setCustomerOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [isDeliveredSuccess, setIsDeliveredSuccess] = useState(false);

  const safeStops = routeStops || [];
  const activeCustomerStop =
    safeStops.find((s) => s.type === 'Customer Drop' && s.status === 'In Progress') ||
    safeStops.find((s) => s.type === 'Customer Drop' && s.status === 'Pending') ||
    safeStops.find((s) => s.type === 'Customer Drop') ||
    safeStops[0];

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
    }, 2000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
          <Bike className="w-6 h-6 text-[#4e6074]" />
          <span>Active Turn-by-Turn Delivery Navigation</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#564337]">
          Live in-transit drop-off guidance and proof of delivery handover.
        </p>
      </div>

      {isDeliveredSuccess && (
        <div className="p-4 bg-[#d1e6c9] text-[#51634c] text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Delivery confirmed! Trip earnings of ₹60 credited to your wallet.</span>
        </div>
      )}

      {/* Live Navigation Head Card */}
      <div className="bg-white rounded-2xl border-2 border-[#4e6074]/40 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#eeeeed]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4e6074] bg-[#d1e4fc] px-2.5 py-0.5 rounded-full">
              In-Transit Drop #{activeCustomerStop.stopOrder}
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
              className="px-4 py-2.5 bg-[#faf9f8] hover:bg-[#eeeeed] border border-[#dcc1b1] text-[#564337] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#944a00]" />
              <span>Call Customer</span>
            </a>
          </div>
        </div>

        {/* GPS Turn-by-Turn Guidance Bar */}
        <div className="bg-[#4e6074] text-white p-4 rounded-xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-extrabold text-lg">
              ↰
            </div>
            <div>
              <div className="text-sm font-bold">In 200m, Turn Left onto Judges Bungalow Rd</div>
              <div className="text-xs text-white/80">Then destination will be on the right (Shivalik Heights)</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-extrabold">{activeCustomerStop.eta}</div>
            <div className="text-[11px] text-white/80">0.8 km left</div>
          </div>
        </div>

        {/* Meal Package Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#faf9f8] p-4 rounded-xl border border-[#dcc1b1]/40 space-y-1">
            <div className="font-bold text-[#1a1c1c]">Customer Meal Order:</div>
            <div className="text-[#564337]">{activeCustomerStop.itemsSummary}</div>
            <div className="text-[11px] text-[#51634c] font-semibold pt-1">
              ✓ Pre-paid Online (Do not collect cash)
            </div>
          </div>

          <div className="bg-[#faf9f8] p-4 rounded-xl border border-[#dcc1b1]/40 space-y-1">
            <div className="font-bold text-[#1a1c1c]">Customer Gate Drop Instructions:</div>
            <div className="text-[#564337] leading-relaxed">
              "Flat 402, 4th floor. Ring doorbell once, or leave on table outside."
            </div>
          </div>
        </div>

        {/* Delivery OTP Handover Form */}
        <form onSubmit={handleConfirmDelivery} className="p-5 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/60 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <div className="text-xs font-bold text-[#1a1c1c] uppercase tracking-wider">
                Handover Verification
              </div>
              <div className="text-[11px] text-[#564337]">
                Ask customer for the 4-digit Delivery OTP (Demo OTP: <strong className="text-[#944a00]">4821</strong> or click confirm)
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
                className="px-6 py-2.5 bg-[#4e6074] hover:bg-[#384859] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
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
