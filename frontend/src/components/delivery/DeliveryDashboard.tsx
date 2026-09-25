import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Bike,
  PackageCheck,
  Navigation,
  Wallet,
  Award,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Store,
} from 'lucide-react';

export const DeliveryDashboard: React.FC = () => {
  const { deliveryPartnerState, updateDeliveryDuty, setDeliveryTab, routeStops, completeRouteStop, orders } = useApp();
  const { currentUser } = useAuth();

  const realPartnerName = currentUser?.name || currentUser?.applicationDetails?.name || deliveryPartnerState?.name || 'Delivery Partner';
  const realVehicle = currentUser?.applicationDetails?.vehicleType || currentUser?.applicationDetails?.vehicleNumber || deliveryPartnerState?.vehicle || 'Two-Wheeler (EV / Bike)';
  const realCluster = currentUser?.applicationDetails?.preferredCluster
    ? `${currentUser.applicationDetails.preferredCluster} Cluster`
    : currentUser?.applicationDetails?.city
    ? `${currentUser.applicationDetails.city} Central Cluster`
    : deliveryPartnerState?.activeCluster || 'Ahmedabad Central Cluster';

  const realDeliveredCount = (orders || []).filter((o) => o.status === 'Delivered').length;
  const realTripEarnings = realDeliveredCount * 60;

  const safeStops = routeStops || [];
  const activeStop = safeStops.find((s) => s.status === 'In Progress') || safeStops.find((s) => s.status === 'Pending');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* On-Duty / Off-Duty Shift Banner */}
      <section className="bg-white rounded-2xl border-2 border-[#4e6074]/30 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#eeeeed]">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm transition-colors ${
                deliveryPartnerState?.isOnDuty ? 'bg-[#4e6074]' : 'bg-gray-400'
              }`}
            >
              <Bike className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1a1c1c]">
                  {realPartnerName}
                </h2>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    deliveryPartnerState?.isOnDuty
                      ? 'bg-[#d1e4fc] text-[#4e6074]'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {deliveryPartnerState?.isOnDuty ? '● On Duty — Online' : '● Off Duty'}
                </span>
              </div>
              <p className="text-xs text-[#564337] mt-0.5">
                Cluster Zone: <strong>{realCluster}</strong> • Vehicle: {realVehicle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => updateDeliveryDuty(!deliveryPartnerState?.isOnDuty)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
                deliveryPartnerState?.isOnDuty
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-[#4e6074] hover:bg-[#384859] text-white'
              }`}
            >
              {deliveryPartnerState?.isOnDuty ? 'Pause / Go Off Duty' : 'Go On Duty (Start Shift)'}
            </button>

            <button
              onClick={() => setDeliveryTab('deliveries')}
              className="px-4 py-2.5 bg-[#faf9f8] hover:bg-[#eeeeed] text-[#564337] border border-[#dcc1b1] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              View Route Map
            </button>
          </div>
        </div>

        {/* Current Active Assignment Status */}
        {activeStop ? (
          <div className="p-4 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    activeStop.type === 'Cook Pickup'
                      ? 'bg-[#ffdcc5] text-[#944a00]'
                      : 'bg-[#d1e6c9] text-[#51634c]'
                  }`}
                >
                  Current Stop #{activeStop.stopOrder}: {activeStop.type}
                </span>
                <span className="text-xs font-bold text-[#1a1c1c]">{activeStop.targetName}</span>
              </div>
              <div className="text-xs text-[#564337] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#944a00]" />
                <span>{activeStop.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setDeliveryTab('active')}
                className="flex-1 sm:flex-initial px-4 py-2 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Open Navigation & Action
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/60 flex items-center gap-3 text-xs text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">System Online & Ready for Orders:</span> When cooks pack tiffins for delivery, pickup dispatches will notify you instantly.
            </div>
          </div>
        )}
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setDeliveryTab('deliveries')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#4e6074] transition-all group"
        >
          <div className="flex items-center gap-2 text-[#564337] mb-2">
            <PackageCheck className="w-4 h-4 text-[#4e6074]" />
            <span className="text-xs font-bold">Today's Trips</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#4e6074] group-hover:scale-105 transition-transform origin-left">
            {realDeliveredCount}
          </div>
          <span className="text-[11px] text-[#564337]/80 mt-1 block">Tiffins safely delivered</span>
        </div>

        <div
          onClick={() => setDeliveryTab('earnings')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#51634c] transition-all group"
        >
          <div className="flex items-center gap-2 text-[#564337] mb-2">
            <Wallet className="w-4 h-4 text-[#51634c]" />
            <span className="text-xs font-bold">Today's Earnings</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#51634c] group-hover:scale-105 transition-transform origin-left">
            ₹{realTripEarnings}
          </div>
          <span className="text-[11px] text-[#51634c] font-semibold mt-1 block">Live wallet balance</span>
        </div>

        <div
          onClick={() => setDeliveryTab('performance')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#944a00] transition-all group"
        >
          <div className="flex items-center gap-2 text-[#564337] mb-2">
            <Award className="w-4 h-4 text-[#944a00]" />
            <span className="text-xs font-bold">Partner Rating</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#944a00] group-hover:scale-105 transition-transform origin-left">
            5.0 ★
          </div>
          <span className="text-[11px] text-[#564337]/80 mt-1 block">100% on-time delivery</span>
        </div>

        <div
          onClick={() => setDeliveryTab('deliveries')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#4e6074] transition-all group"
        >
          <div className="flex items-center gap-2 text-[#564337] mb-2">
            <Navigation className="w-4 h-4 text-[#4e6074]" />
            <span className="text-xs font-bold">Active Cluster</span>
          </div>
          <div className="text-sm font-extrabold text-[#1a1c1c] truncate group-hover:scale-105 transition-transform origin-left">
            {realCluster}
          </div>
          <span className="text-[11px] text-[#4e6074] font-bold mt-1 block">{safeStops.length} Stops Queued</span>
        </div>
      </section>

      {/* Smart Cluster Route Overview */}
      <section className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 shadow-2xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-[#1a1c1c] flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#4e6074]" />
              <span>Smart Cluster Route Sequence</span>
            </h3>
            <p className="text-xs text-[#564337]">
              Multi-cook batch pickup routed in optimal order to minimize transit and keep food steaming hot.
            </p>
          </div>
          <button
            onClick={() => setDeliveryTab('deliveries')}
            className="text-xs font-bold text-[#4e6074] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full Route Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {safeStops.length === 0 ? (
          <div className="p-8 text-center bg-[#faf9f8] rounded-2xl border border-[#dcc1b1]/40 space-y-2">
            <Bike className="w-10 h-10 text-[#564337]/40 mx-auto" />
            <h4 className="font-bold text-sm text-[#1a1c1c]">No Active Delivery Batch Queued</h4>
            <p className="text-xs text-[#564337] max-w-md mx-auto">
              When neighborhood home cooks prepare and hand over customer tiffins for delivery, your optimized multi-stop pickup and drop route will automatically generate here.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {safeStops.map((stop) => (
              <div
                key={stop.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all ${
                  stop.status === 'Completed'
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : stop.status === 'In Progress'
                    ? 'bg-[#d1e4fc]/30 border-[#4e6074] shadow-xs'
                    : 'bg-[#faf9f8] border-[#dcc1b1]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      stop.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : stop.status === 'In Progress'
                        ? 'bg-[#4e6074] text-white'
                        : 'bg-white border border-[#dcc1b1] text-[#564337]'
                    }`}
                  >
                    {stop.status === 'Completed' ? '✓' : stop.stopOrder}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#1a1c1c]">{stop.targetName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          stop.type === 'Cook Pickup'
                            ? 'bg-[#ffdcc5] text-[#944a00]'
                            : 'bg-[#d1e6c9] text-[#51634c]'
                        }`}
                      >
                        {stop.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#564337] mt-0.5">{stop.address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right text-xs">
                    <div className="font-bold text-[#1a1c1c]">{stop.eta}</div>
                    <div className="text-[10px] text-[#564337]">{stop.distanceKm} km</div>
                  </div>

                  {stop.status !== 'Completed' && (
                    <button
                      onClick={() => completeRouteStop(stop.id)}
                      className="px-3 py-1.5 bg-[#4e6074] hover:bg-[#384859] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      Mark Done ➔
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
