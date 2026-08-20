import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  Package,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const DeliveryPickups: React.FC = () => {
  const { routeStops, completeRouteStop } = useApp();
  const [pickupOtp, setPickupOtp] = useState<{ [key: string]: string }>({});

  const pickupStops = routeStops.filter((s) => s.type === 'Cook Pickup');

  const handleVerifyOtp = (stopId: string) => {
    completeRouteStop(stopId);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
          <Store className="w-6 h-6 text-[#944a00]" />
          <span>Home Kitchen Pickups</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#564337]">
          Collect freshly packed tiffins directly from verified home cooks in your cluster.
        </p>
      </div>

      {/* Checklist instructions card */}
      <div className="p-4 bg-[#ffdcc5]/40 rounded-2xl border border-[#944a00]/20 flex items-start gap-3">
        <div className="p-2 bg-[#944a00] text-white rounded-xl shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-[#564337] space-y-1">
          <div className="font-bold text-[#1a1c1c]">Thermal Bag & Spill-Proof Guideline:</div>
          <p>
            Always inspect sealed containers from home cooks, verify meal count, and place upright inside the insulated thermal box for zero spillages.
          </p>
        </div>
      </div>

      {/* Pickup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pickupStops.map((pickup) => {
          const isDone = pickup.status === 'Completed';
          return (
            <div
              key={pickup.id}
              className={`bg-white rounded-2xl border p-6 shadow-2xs space-y-5 transition-all ${
                isDone ? 'border-gray-200 opacity-60' : 'border-[#944a00]/40 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-[#1a1c1c]">{pickup.targetName}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffdcc5] text-[#944a00]">
                      Cook Kitchen
                    </span>
                  </div>
                  <div className="text-xs text-[#564337] mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#944a00]" />
                    <span>{pickup.address}</span>
                  </div>
                </div>

                <a
                  href={`tel:${pickup.phone}`}
                  className="p-2.5 bg-[#faf9f8] hover:bg-[#ffdcc5]/40 border border-[#dcc1b1] rounded-xl text-[#944a00] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              {/* Items in this batch */}
              <div className="p-3.5 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 space-y-1.5 text-xs">
                <div className="font-bold text-[#1a1c1c] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#4e6074]" />
                  <span>Batch Collection:</span>
                </div>
                <div className="text-[#564337] font-medium">{pickup.itemsSummary}</div>
                <div className="text-[11px] text-[#51634c] font-semibold">
                  ETA at Kitchen: {pickup.eta}
                </div>
              </div>

              {/* Pickup Action & Verification */}
              <div>
                {isDone ? (
                  <div className="p-2.5 bg-green-50 text-green-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Collected & Stored in Bag</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVerifyOtp(pickup.id)}
                    className="w-full py-3 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Confirm Collection from {pickup.targetName}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
