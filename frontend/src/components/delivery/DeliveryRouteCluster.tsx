import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Navigation,
  MapPin,
  Clock,
  CheckCircle2,
  Bike,
  Store,
  Home,
  Building,
  Sparkles,
  Phone,
} from 'lucide-react';

export const DeliveryRouteCluster: React.FC = () => {
  const { routeStops, completeRouteStop, setDeliveryTab } = useApp();

  const totalDistance = routeStops.reduce((sum, s) => sum + s.distanceKm, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Navigation className="w-6 h-6 text-[#4e6074]" />
            <span>AI Smart Cluster Route & Batch Navigation</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Batched pickups from nearby home kitchens combined into an optimal multi-drop sequence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-1.5 rounded-xl border border-[#dcc1b1]/60 text-xs font-bold text-[#564337] shadow-2xs">
            Total Cluster: <span className="text-[#4e6074]">{totalDistance.toFixed(1)} km</span>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#d1e4fc] text-[#4e6074]">
            ⚡ Saves 38 mins vs single-order trips
          </span>
        </div>
      </div>

      {/* Simulated Visual Route Map Canvas Box */}
      <div className="bg-gradient-to-br from-[#faf9f8] via-white to-[#d1e4fc]/30 rounded-2xl border-2 border-[#dcc1b1]/70 p-6 shadow-2xs relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4e6074]">
              Live GPS Cluster Map (Ahmedabad West Sector)
            </span>
          </div>
          <span className="text-[11px] text-[#564337] font-semibold">
            Cluster #CL-89 • Bodakdev ➔ Prahlad Nagar
          </span>
        </div>

        {/* Route Graph Nodes Diagram */}
        <div className="relative py-6 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {routeStops.map((stop, idx) => {
            const isCompleted = stop.status === 'Completed';
            const isInProgress = stop.status === 'In Progress';
            return (
              <React.Fragment key={stop.id}>
                <div className="flex flex-col items-center text-center max-w-[130px] z-10">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md transition-transform ${
                      isCompleted
                        ? 'bg-green-600 text-white'
                        : isInProgress
                        ? 'bg-[#4e6074] text-white ring-4 ring-[#d1e4fc] scale-110'
                        : 'bg-white text-[#564337] border-2 border-[#dcc1b1]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : stop.type === 'Cook Pickup' ? (
                      <Store className="w-5 h-5" />
                    ) : (
                      <Home className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-extrabold text-[#1a1c1c] mt-2 line-clamp-1">
                    {stop.targetName}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded mt-0.5 ${
                      stop.type === 'Cook Pickup' ? 'bg-[#ffdcc5] text-[#944a00]' : 'bg-[#d1e6c9] text-[#51634c]'
                    }`}
                  >
                    {stop.type}
                  </span>
                  <span className="text-[10px] text-[#564337] mt-0.5 font-mono">{stop.eta}</span>
                </div>

                {idx < routeStops.length - 1 && (
                  <div className="hidden md:flex flex-1 items-center justify-center px-1">
                    <div className="w-full h-1 bg-dashed bg-[#4e6074]/40 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1 text-[10px] font-bold text-[#564337] rounded border border-[#dcc1b1]/50 shadow-2xs">
                        {routeStops[idx + 1].distanceKm}km
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Turn-by-turn Step Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337]">
          Cluster Stop Checklist & Handover
        </h3>

        <div className="space-y-3">
          {routeStops.map((stop) => (
            <div
              key={stop.id}
              className={`p-5 rounded-2xl border shadow-2xs transition-all ${
                stop.status === 'Completed'
                  ? 'bg-gray-50 border-gray-200 opacity-60'
                  : stop.status === 'In Progress'
                  ? 'bg-white border-2 border-[#4e6074] shadow-md'
                  : 'bg-white border-[#dcc1b1]/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      stop.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : stop.status === 'In Progress'
                        ? 'bg-[#4e6074] text-white'
                        : 'bg-[#faf9f8] text-[#564337] border border-[#dcc1b1]'
                    }`}
                  >
                    {stop.status === 'Completed' ? '✓' : `#${stop.stopOrder}`}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-[#1a1c1c]">{stop.targetName}</h4>
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

                    <div className="text-xs text-[#564337] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#944a00] shrink-0" />
                      <span>{stop.address}</span>
                    </div>

                    <div className="text-[11px] text-[#564337] font-medium pt-1">
                      Task: <strong className="text-[#1a1c1c]">{stop.itemsSummary}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <a
                    href={`tel:${stop.phone}`}
                    className="p-2.5 bg-[#faf9f8] hover:bg-[#eeeeed] border border-[#dcc1b1] rounded-xl text-[#564337] transition-colors"
                    title="Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {stop.status !== 'Completed' ? (
                    <button
                      onClick={() => completeRouteStop(stop.id)}
                      className="px-4 py-2.5 bg-[#4e6074] hover:bg-[#384859] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      {stop.type === 'Cook Pickup' ? 'Confirm Kitchen Pickup' : 'Confirm Customer Handover'}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-[#51634c] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Stop Done
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
