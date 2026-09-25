import React, { useMemo, useState } from 'react';
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
  Zap,
  RotateCw,
  Compass,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Map as MapIcon,
  Thermometer,
  Flame,
  AlertTriangle,
} from 'lucide-react';
import { optimizeDeliveryRoute } from '../../utils/routeOptimizer';
import { GoogleMapView } from './GoogleMapView';

export const DeliveryRouteCluster: React.FC = () => {
  const { routeStops, completeRouteStop, setDeliveryTab, deliveryPartnerState } = useApp();
  const [isOptimizedMode, setIsOptimizedMode] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [viewTab, setViewTab] = useState<'googlemap' | 'network'>('googlemap');

  // Compute shortest path optimization for current route stops
  const routeOptimization = useMemo(() => {
    return optimizeDeliveryRoute(routeStops);
  }, [routeStops]);

  const displayStops = isOptimizedMode ? routeOptimization.orderedStops : routeStops;
  const totalDistance = isOptimizedMode
    ? routeOptimization.totalOptimizedDistanceKm
    : routeStops.reduce((sum, s) => sum + s.distanceKm, 0);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Navigation className="w-6 h-6 text-[#4e6074]" />
            <span>Google Maps GPS & Shortest Path Routing</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Real-time Google Maps live GPS tracking and Traveling Salesperson (TSP) sequence across cluster stops.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Tab Switcher */}
          <div className="flex bg-white rounded-xl border border-[#dcc1b1]/70 p-1 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setViewTab('googlemap')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewTab === 'googlemap' ? 'bg-[#4e6074] text-white shadow-2xs' : 'text-[#564337]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Google Maps GPS</span>
            </button>
            <button
              onClick={() => setViewTab('network')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewTab === 'network' ? 'bg-[#4e6074] text-white shadow-2xs' : 'text-[#564337]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Topology View</span>
            </button>
          </div>

          <button
            onClick={handleRecalculate}
            className="px-3.5 py-1.5 bg-white hover:bg-[#faf9f8] border border-[#dcc1b1]/70 text-[#564337] font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Recalculate Nearest-Neighbor Path"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#4e6074] ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>Re-optimize</span>
          </button>

          <button
            onClick={() => setIsOptimizedMode(!isOptimizedMode)}
            className={`px-3.5 py-1.5 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
              isOptimizedMode
                ? 'bg-[#4e6074] text-white'
                : 'bg-white text-[#564337] border border-[#dcc1b1]/70'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>{isOptimizedMode ? 'Shortest Path: ON' : 'Standard'}</span>
          </button>
        </div>
      </div>

      {/* Shortest Path Metric Optimization Highlights */}
      {routeStops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-[#564337] uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#4e6074]" />
              <span>Optimized Total Route</span>
            </div>
            <div className="text-2xl font-black text-[#4e6074]">{totalDistance} km</div>
            <div className="text-[10px] text-[#51634c] font-semibold">
              vs {routeOptimization.unoptimizedDistanceKm} km separate trips
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-[#564337] uppercase tracking-wider flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-[#51634c]" />
              <span>Distance Saved</span>
            </div>
            <div className="text-2xl font-black text-[#51634c]">
              -{routeOptimization.distanceSavedKm} km
            </div>
            <div className="text-[10px] text-[#51634c] font-semibold">
              {routeOptimization.efficiencyPercentage}% transit efficiency gain
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-[#564337] uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#944a00]" />
              <span>Transit Time Saved</span>
            </div>
            <div className="text-2xl font-black text-[#944a00]">
              ~{routeOptimization.timeSavedMins} mins
            </div>
            <div className="text-[10px] text-[#564337]">Food delivered steaming hot</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-[#564337] uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4e6074]" />
              <span>Live Cluster Zone</span>
            </div>
            <div className="text-sm font-extrabold text-[#1a1c1c] truncate">
              {deliveryPartnerState?.activeCluster || 'Ahmedabad Cluster'}
            </div>
            <div className="text-[10px] text-[#4e6074] font-semibold">
              Multi-kitchen batch pickup
            </div>
          </div>
        </div>
      )}

      {/* 3 Delivery Fleet AI Active Features Bar */}
      <div className="bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#1e293b] text-white p-4 sm:p-5 rounded-2xl border border-slate-700 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Delivery Fleet AI Suite Live Telemetry
            </span>
          </div>

          <button
            onClick={() => setDeliveryTab('fleet-ai')}
            className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl border border-white/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Open Dedicated Fleet AI Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Feature 1: Multi-Kitchen dynamic route clustering */}
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-300">
              <span className="flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" /> 1. Multi-Kitchen Bundling
              </span>
              <span className="text-emerald-400 font-extrabold">35% Fuel Saved</span>
            </div>
            <p className="text-xs text-slate-200">
              Bundled 2 neighboring home kitchens into 1 single thermal delivery run.
            </p>
          </div>

          {/* Feature 2: Hot-food ETA & thermal decay predictor */}
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-orange-300">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5" /> 2. Thermal Decay Box
              </span>
              <span className="text-orange-400 font-extrabold">78°C Steaming Hot</span>
            </div>
            <p className="text-xs text-slate-200">
              Double-walled thermal insulation: 38 mins remaining in food safety zone.
            </p>
          </div>

          {/* Feature 3: AI Live traffic & route optimizer */}
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-indigo-300">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> 3. Traffic Auto-Reroute
              </span>
              <span className="text-blue-400 font-extrabold">-11 Mins Saved</span>
            </div>
            <p className="text-xs text-slate-200">
              Bypassing SG Highway flyover via Judges Bungalow Rd green corridor.
            </p>
          </div>
        </div>
      </div>

      {/* Main Map Views */}
      {routeStops.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-12 text-center space-y-3">
          <Navigation className="w-12 h-12 text-[#564337]/30 mx-auto" />
          <h3 className="font-bold text-base text-[#1a1c1c]">No Active Cluster Batches Queued</h3>
          <p className="text-xs text-[#564337] max-w-md mx-auto">
            Your shift is active. When home cooks receive orders, the Google Maps shortest path engine automatically sequences kitchen pickups and customer drops.
          </p>
          <button
            onClick={() => setDeliveryTab('pickup')}
            className="mt-2 px-5 py-2.5 bg-[#944a00] hover:bg-[#783c00] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Check Cook Pickups Queue
          </button>
        </div>
      ) : viewTab === 'googlemap' ? (
        <GoogleMapView
          stops={routeOptimization.orderedStops}
          clusterName={deliveryPartnerState?.activeCluster}
        />
      ) : (
        /* Topological Visual Graph View */
        <div className="bg-gradient-to-br from-[#faf9f8] via-white to-[#d1e4fc]/30 rounded-2xl border-2 border-[#dcc1b1]/70 p-6 shadow-2xs relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#4e6074]">
                Shortest Path Topological Network • {displayStops.length} Stops
              </span>
            </div>
            <span className="text-[11px] text-[#564337] font-semibold bg-white px-2.5 py-1 rounded-full border border-[#dcc1b1]/50">
              ⚡ Shortest TSP Path: Bodakdev ➔ Satellite ➔ Navrangpura
            </span>
          </div>

          <div className="relative py-6 px-4 flex flex-col md:flex-row items-center justify-between gap-4 overflow-x-auto">
            <div className="flex flex-col items-center text-center min-w-[110px] z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#4e6074] text-white flex items-center justify-center font-bold shadow-md ring-4 ring-[#d1e4fc]">
                <Bike className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold text-[#1a1c1c] mt-2">You (Rider)</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded mt-0.5 bg-[#d1e4fc] text-[#4e6074]">
                Start Point
              </span>
            </div>

            <div className="hidden md:flex flex-1 items-center justify-center px-1">
              <div className="w-full h-1 bg-dashed bg-[#4e6074]/50 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#4e6074] rounded border border-[#dcc1b1] shadow-2xs">
                  {(displayStops[0] as any)?.distanceFromPrevKm || 1.1}km
                </div>
              </div>
            </div>

            {displayStops.map((stop: any, idx: number) => {
              const isCompleted = stop.status === 'Completed';
              const isInProgress = stop.status === 'In Progress';
              return (
                <React.Fragment key={stop.id}>
                  <div className="flex flex-col items-center text-center min-w-[125px] max-w-[140px] z-10">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md transition-transform ${
                        isCompleted
                          ? 'bg-[#51634c] text-white'
                          : isInProgress
                          ? 'bg-[#944a00] text-white ring-4 ring-[#ffdcc5] scale-110'
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
                      {stop.type === 'Cook Pickup' ? `Stop #${idx + 1} Pickup` : `Stop #${idx + 1} Drop`}
                    </span>
                    <span className="text-[10px] text-[#564337] mt-0.5 font-mono">{stop.eta}</span>
                  </div>

                  {idx < displayStops.length - 1 && (
                    <div className="hidden md:flex flex-1 items-center justify-center px-1">
                      <div className="w-full h-1 bg-dashed bg-[#4e6074]/50 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#564337] rounded border border-[#dcc1b1] shadow-2xs">
                          {(displayStops[idx + 1] as any)?.distanceFromPrevKm || 1.4}km
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Turn-by-turn Step Cards */}
      {routeStops.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337]">
              Optimized Turn-By-Turn Cluster Route Sequence
            </h3>
            <button
              onClick={() => setDeliveryTab('active')}
              className="text-xs font-bold text-[#4e6074] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Open Active GPS Turn View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {displayStops.map((stop: any, idx: number) => {
              const isCompleted = stop.status === 'Completed';
              const isInProgress = stop.status === 'In Progress';
              return (
                <div
                  key={stop.id}
                  className={`p-5 rounded-2xl border shadow-2xs transition-all ${
                    isCompleted
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : isInProgress
                      ? 'bg-white border-2 border-[#4e6074] shadow-md ring-2 ring-[#d1e4fc]'
                      : 'bg-white border-[#dcc1b1]/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          isCompleted
                            ? 'bg-green-100 text-green-800'
                            : isInProgress
                            ? 'bg-[#4e6074] text-white'
                            : 'bg-[#faf9f8] text-[#564337] border border-[#dcc1b1]'
                        }`}
                      >
                        {isCompleted ? '✓' : `#${idx + 1}`}
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
                          {isInProgress && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d1e4fc] text-[#4e6074]">
                              ● In Progress
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#564337] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#944a00] shrink-0" />
                          <span>{stop.address}</span>
                        </div>

                        {/* Turn Maneuver */}
                        {stop.turnManeuver && (
                          <div className="text-[11px] font-semibold text-[#4e6074] flex items-center gap-1">
                            <Compass className="w-3 h-3 shrink-0" />
                            <span>{stop.turnManeuver}</span>
                          </div>
                        )}

                        <div className="text-[11px] text-[#564337]">
                          <span className="font-semibold text-[#1a1c1c]">Tiffins: </span>
                          {stop.itemsSummary}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-[#1a1c1c]">
                          +{stop.distanceFromPrevKm || 1.2} km
                        </div>
                        <div className="text-[10px] text-[#564337]">ETA {stop.eta}</div>
                      </div>

                      <a
                        href={`tel:${stop.phone}`}
                        className="p-2.5 bg-[#faf9f8] hover:bg-[#eeeeed] border border-[#dcc1b1] rounded-xl text-[#564337] transition-colors"
                        title="Call Contact"
                      >
                        <Phone className="w-4 h-4" />
                      </a>

                      {!isCompleted ? (
                        <button
                          onClick={() => completeRouteStop(stop.id)}
                          className="px-4 py-2.5 bg-[#4e6074] hover:bg-[#384859] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          {stop.type === 'Cook Pickup' ? 'Confirm Kitchen Pickup' : 'Confirm Customer Handover'}
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-[#51634c] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Done
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
