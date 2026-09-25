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
  ArrowRight,
  Clock,
  ChefHat,
  Bike,
} from 'lucide-react';

export const DeliveryPickups: React.FC = () => {
  const { routeStops, completeRouteStop, cooks, orders, setDeliveryTab } = useApp();
  const [successStopId, setSuccessStopId] = useState<string | null>(null);

  const pickupStops = routeStops.filter((s) => s.type === 'Cook Pickup');
  const activePickups = pickupStops.filter((s) => s.status !== 'Completed');
  const completedPickups = pickupStops.filter((s) => s.status === 'Completed');

  const handleCollectPickup = (stopId: string) => {
    completeRouteStop(stopId);
    setSuccessStopId(stopId);
    setTimeout(() => {
      setSuccessStopId(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Store className="w-6 h-6 text-[#944a00]" />
            <span>Home Kitchen Pickups</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Collect freshly packed tiffins directly from verified home cooks in your cluster.
          </p>
        </div>

        {pickupStops.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-[#ffdcc5] text-[#944a00] font-bold text-xs rounded-xl">
              {activePickups.length} Pickups Pending
            </span>
            <button
              onClick={() => setDeliveryTab('active')}
              className="px-4 py-1.5 bg-[#4e6074] hover:bg-[#384859] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Go to Active Drop</span>
            </button>
          </div>
        )}
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

      {successStopId && (
        <div className="p-4 bg-[#d1e6c9] text-[#51634c] text-xs font-bold rounded-2xl flex items-center justify-between gap-2 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#51634c]" />
            <span>Tiffins collected successfully! Proceeding to Customer Address delivery navigation.</span>
          </div>
          <button
            onClick={() => setDeliveryTab('active')}
            className="px-3 py-1 bg-[#51634c] text-white rounded-lg text-[11px] font-bold"
          >
            Start Customer Drop ➔
          </button>
        </div>
      )}

      {/* Assigned Cook Pickups */}
      {pickupStops.length === 0 ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-10 text-center space-y-3">
            <Store className="w-12 h-12 text-[#564337]/30 mx-auto" />
            <h3 className="font-bold text-base text-[#1a1c1c]">No Active Pickups In Queue</h3>
            <p className="text-xs text-[#564337] max-w-md mx-auto">
              When customers place meal orders with home cooks, your cluster pickup list and customer drop-off route will automatically appear here.
            </p>
          </div>

          {/* Directory of verified cooks in this cluster */}
          {cooks && cooks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337] flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-[#944a00]" />
                <span>Verified Home Cooks in Your Cluster ({cooks.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {cooks.map((cook) => (
                  <div
                    key={cook.id}
                    className="bg-white p-4 rounded-xl border border-[#dcc1b1]/50 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cook.avatar || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100&auto=format&fit=crop&q=80'}
                        alt={cook.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100&auto=format&fit=crop&q=80';
                        }}
                        className="w-11 h-11 rounded-full object-cover border border-[#dcc1b1]/60 shrink-0"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#1a1c1c]">{cook.name}</div>
                        <div className="text-[11px] text-[#944a00] font-medium truncate max-w-[150px]">
                          {cook.specialties?.length ? cook.specialties.join(', ') : 'Specialty Home Cook'}
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] text-[#564337] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#944a00] shrink-0" />
                      <span className="truncate">{cook.location || cook.pickupAddress || 'Ahmedabad Cluster'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#eeeeed] text-[10px]">
                      <span className={`font-bold ${cook.kitchenOpen ? 'text-[#006e2c]' : 'text-stone-500'}`}>
                        ● Kitchen {cook.kitchenOpen ? 'Open' : 'Closed'}
                      </span>
                      <a href={`tel:${cook.phone || '+919825123456'}`} className="text-[#005cb8] font-bold hover:underline">
                        {cook.phone || '+91 98251 23456'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pickupStops.map((pickup) => {
            const isDone = pickup.status === 'Completed';
            return (
              <div
                key={pickup.id}
                className={`bg-white rounded-2xl border p-6 shadow-2xs space-y-5 transition-all ${
                  isDone ? 'border-gray-200 bg-gray-50/50' : 'border-[#944a00]/40 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-[#1a1c1c]">{pickup.targetName}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isDone ? 'bg-[#d1e6c9] text-[#51634c]' : 'bg-[#ffdcc5] text-[#944a00]'
                      }`}>
                        {isDone ? '✓ Picked Up' : 'Cook Kitchen Pickup'}
                      </span>
                    </div>
                    <div className="text-xs text-[#564337] mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#944a00] shrink-0" />
                      <span>{pickup.address}</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${pickup.phone}`}
                    className="p-2.5 bg-[#faf9f8] hover:bg-[#ffdcc5]/40 border border-[#dcc1b1] rounded-xl text-[#944a00] transition-colors cursor-pointer"
                    title="Call Home Cook"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                {/* Items in this batch */}
                <div className="p-3.5 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 space-y-1.5 text-xs">
                  <div className="font-bold text-[#1a1c1c] flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#4e6074]" />
                    <span>Tiffin Batch Details:</span>
                  </div>
                  <div className="text-[#564337] font-medium leading-relaxed">{pickup.itemsSummary}</div>
                  <div className="text-[11px] text-[#51634c] font-semibold flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>Pickup Window: {pickup.eta}</span>
                  </div>
                </div>

                {/* Pickup Action */}
                <div>
                  {isDone ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 p-2.5 bg-[#d1e6c9] text-[#51634c] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Collected & In Thermal Bag</span>
                      </div>
                      <button
                        onClick={() => setDeliveryTab('active')}
                        className="px-4 py-2.5 bg-[#4e6074] hover:bg-[#384859] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Drop to Customer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCollectPickup(pickup.id)}
                      className="w-full py-3 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Package className="w-4 h-4" />
                      <span>Pick Up & Collect Tiffins from {pickup.targetName}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
