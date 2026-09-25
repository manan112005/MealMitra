import React, { useState, useEffect, useTransition } from 'react';
import { useApp } from '../../context/AppContext';
import {
  aiService,
  ClusterRouteResult,
  ThermalDecayResult,
  TrafficOptimizerResult,
} from '../../services/ai.service';
import {
  Zap,
  Sparkles,
  Flame,
  Navigation,
  Clock,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  RotateCw,
  CheckCircle2,
  Bike,
  Store,
  Home,
  ChevronRight,
  Thermometer,
  Layers,
  ArrowRight,
  MapPin,
} from 'lucide-react';

export const DeliveryAIFleetHub: React.FC = () => {
  const { routeStops, completeRouteStop, setDeliveryTab, deliveryPartnerState } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'clustering' | 'thermal' | 'traffic'>('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clusterData, setClusterData] = useState<ClusterRouteResult | null>(null);
  const [thermalData, setThermalData] = useState<ThermalDecayResult | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficOptimizerResult | null>(null);
  const [isAutoRerouteEnabled, setIsAutoRerouteEnabled] = useState(true);
  const [packedMins, setPackedMins] = useState<number>(12);
  const [_, startTransition] = useTransition();

  // Load telemetry from AI service
  const loadAITelemetry = async () => {
    setIsProcessing(true);
    try {
      const [clusterRes, thermalRes, trafficRes] = await Promise.all([
        aiService.clusterMultiKitchenRoutes(routeStops),
        aiService.predictThermalDecay({
          initialTempC: 80,
          packedMinutesAgo: packedMins,
          transitDurationMins: 16,
          ambientTempC: 33,
        }),
        aiService.optimizeTrafficRoute({
          currentZone: 'Bodakdev Hub',
          targetDestination: 'Navrangpura / Satellite',
          avoidPeakCongestion: isAutoRerouteEnabled,
        }),
      ]);

      startTransition(() => {
        setClusterData(clusterRes);
        setThermalData(thermalRes);
        setTrafficData(trafficRes);
      });
    } catch (e) {
      console.error('Failed to load delivery AI data:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    loadAITelemetry();
  }, [routeStops, isAutoRerouteEnabled, packedMins]);

  // Periodic temperature decay simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPackedMins((prev) => (prev >= 45 ? 10 : prev + 1));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Fleet AI Navigation Bar */}
      <div className="bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#0f172a] text-white p-5 sm:p-7 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/20 via-emerald-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              Delivery Fleet AI Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Dynamic Logistics, Thermal Safety & Traffic AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Bundles multi-kitchen pickups to reduce fuel by 35%, models food thermal decay in real-time, and auto-bypasses Ahmedabad traffic bottlenecks.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={loadAITelemetry}
              disabled={isProcessing}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>Refresh AI</span>
            </button>
            <button
              onClick={() => setDeliveryTab('deliveries')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-black hover:brightness-110 shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Active Stops</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Feature Pill Switcher */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-700/60 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Fleet Telemetry', icon: Layers },
            { id: 'clustering', label: '1. Multi-Kitchen Route Clustering', icon: Navigation },
            { id: 'thermal', label: '2. Hot-Food Thermal Decay Predictor', icon: Thermometer },
            { id: 'traffic', label: '3. Ahmedabad Traffic & Rerouter', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Delivery Fleet AI Features */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================= */}
        {/* 1. Multi-Kitchen Dynamic Route Clustering Card */}
        {/* ========================================================= */}
        {(activeTab === 'all' || activeTab === 'clustering') && (
          <div className="lg:col-span-12 bg-white rounded-3xl border border-[#dcc1b1]/70 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-blue-700">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Feature 1: Route Clustering
                  </div>
                  <h3 className="text-lg font-black text-[#1a1c1c]">
                    AI Multi-Kitchen Dynamic Route Clustering
                  </h3>
                </div>
              </div>

              {clusterData && (
                <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  {clusterData.metrics.fuelSavingsPercent}% Fuel & Distance Saved
                </span>
              )}
            </div>

            {/* Metrics Row */}
            {clusterData && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#faf9f8] p-3.5 rounded-2xl border border-[#e8ded6]">
                  <span className="text-[11px] font-bold text-[#8c6553] block">Bundled Kitchens</span>
                  <span className="text-base font-black text-[#1a1c1c]">
                    {clusterData.bundledKitchensCount} Kitchens
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                    1 Single Thermal Run
                  </span>
                </div>

                <div className="bg-[#faf9f8] p-3.5 rounded-2xl border border-[#e8ded6]">
                  <span className="text-[11px] font-bold text-[#8c6553] block">Optimized Distance</span>
                  <span className="text-base font-black text-blue-700">
                    {clusterData.metrics.optimizedDistanceKm} km
                  </span>
                  <span className="text-[10px] text-[#7d5843] line-through block mt-0.5">
                    {clusterData.metrics.naiveDistanceKm} km unbundled
                  </span>
                </div>

                <div className="bg-[#faf9f8] p-3.5 rounded-2xl border border-[#e8ded6]">
                  <span className="text-[11px] font-bold text-[#8c6553] block">Time Saved</span>
                  <span className="text-base font-black text-emerald-700">
                    ~{clusterData.metrics.timeSavedMins} mins
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                    Faster customer drop
                  </span>
                </div>

                <div className="bg-[#faf9f8] p-3.5 rounded-2xl border border-[#e8ded6]">
                  <span className="text-[11px] font-bold text-[#8c6553] block">CO2 Emissions Saved</span>
                  <span className="text-base font-black text-slate-800">
                    {clusterData.metrics.co2ReductionGrams}g CO₂
                  </span>
                  <span className="text-[10px] text-blue-600 font-bold block mt-0.5">
                    Green Delivery
                  </span>
                </div>
              </div>
            )}

            {/* Sequence Pathway Visualizer */}
            <div className="bg-[#faf8f6] p-4 rounded-2xl border border-[#e8ded6] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#564337]">
                <span className="flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-blue-600" /> Optimal TSP Traveling Sequence
                </span>
                <span className="text-[11px] text-emerald-700 font-extrabold">
                  ✓ Continuous Shortest Path
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5" /> Rider Start
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5" /> Nilam's Kitchen (Bodakdev)
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5" /> Mom's Kitchen (Satellite)
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" /> Drop #1 (Sarthik Tower)
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" /> Drop #2 (Navrangpura)
                </span>
              </div>

              {clusterData && (
                <p className="text-xs text-[#6a5445] pt-1">
                  💡 <strong>Mitra AI Note:</strong> {clusterData.thermalRouteAdvice}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. Hot-Food ETA & Thermal Decay Predictor Card */}
        {/* ========================================================= */}
        {(activeTab === 'all' || activeTab === 'thermal') && (
          <div className="lg:col-span-6 bg-white rounded-3xl border border-[#dcc1b1]/70 p-6 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#ff6d00] flex items-center justify-center border border-orange-200">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#b34700]">
                      <Flame className="w-3.5 h-3.5 text-[#ff6d00]" /> Feature 2: Thermal Safety
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#1a1c1c]">
                      AI Hot-Food ETA & Thermal Decay
                    </h3>
                  </div>
                </div>

                {thermalData && (
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full border flex items-center gap-1 ${
                      thermalData.thermalStatus === 'Steaming Hot'
                        ? 'bg-orange-50 text-[#b34700] border-orange-200'
                        : thermalData.thermalStatus === 'Warm & Fresh'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    {thermalData.thermalStatus}
                  </span>
                )}
              </div>

              {thermalData && (
                <>
                  {/* Gauge & Temp Readouts */}
                  <div className="bg-gradient-to-br from-[#fff7f0] to-[#fff] p-4 rounded-2xl border border-[#ffdcc5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[#8c6553] block">Current Box Temperature</span>
                        <div className="text-2xl sm:text-3xl font-black text-[#1a1c1c] flex items-baseline gap-1">
                          <span>{thermalData.currentTempC}°C</span>
                          <span className="text-xs font-bold text-orange-600">Steaming</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-bold text-[#8c6553] block">Doorstep Arrival ETA</span>
                        <div className="text-xl sm:text-2xl font-black text-emerald-700">
                          {thermalData.arrivalTempC}°C
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          (Safety Limit: 58°C)
                        </span>
                      </div>
                    </div>

                    {/* Thermal Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-[#564337]">
                        <span>Safe Margin Remaining:</span>
                        <span className="text-emerald-700 font-extrabold">
                          {thermalData.remainingSafeMinutes} mins safe window
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(
                              15,
                              Math.min(100, (thermalData.remainingSafeMinutes / thermalData.maxSafeMinutes) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Alert Message Callout */}
                    <div className="p-2.5 rounded-xl bg-white border border-[#eedfd6] text-xs text-[#6a422a] flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{thermalData.alertMessage}</span>
                    </div>
                  </div>

                  {/* Thermal Degradation Curve Steps */}
                  <div>
                    <span className="text-xs font-bold text-[#564337] block mb-2">
                      Dual-Insulated Cooling Curve Forecast:
                    </span>
                    <div className="grid grid-cols-6 gap-1 text-center">
                      {thermalData.tempCurve.map((pt) => (
                        <div
                          key={pt.minute}
                          className={`p-1.5 rounded-xl border text-[10px] font-bold ${
                            pt.isPast
                              ? 'bg-orange-50 border-orange-200 text-orange-800'
                              : 'bg-white border-[#e8ded6] text-[#6a5445]'
                          }`}
                        >
                          <span className="block text-[9px] text-[#8c6553]">{pt.minute}m</span>
                          <span>{pt.tempC}°</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-[#f0ebe6] flex items-center justify-between text-xs text-[#7d5843]">
              <span>Double-walled silver thermal box</span>
              <span className="font-bold text-emerald-700">✓ Sealed Lock Active</span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. AI Live Traffic & Route Optimizer Card */}
        {/* ========================================================= */}
        {(activeTab === 'all' || activeTab === 'traffic') && (
          <div className="lg:col-span-6 bg-white rounded-3xl border border-[#dcc1b1]/70 p-6 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-indigo-700">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Feature 3: Smart Traffic Reroute
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#1a1c1c]">
                      AI Live Traffic & Route Optimizer
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsAutoRerouteEnabled(!isAutoRerouteEnabled)}
                  className={`text-xs font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    isAutoRerouteEnabled
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {isAutoRerouteEnabled ? '✓ Auto-Reroute Active' : 'Manual Route'}
                </button>
              </div>

              {trafficData && (
                <>
                  {/* Traffic Hotspots in Ahmedabad */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#564337]">
                      <span>Ahmedabad Live Congestion Zones:</span>
                      <span className="text-indigo-700">Saved ~{trafficData.timeSavedViaBypassMins} mins</span>
                    </div>

                    <div className="space-y-2">
                      {trafficData.congestionHotspots.slice(0, 3).map((spot, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-[#faf9f8] border border-[#e8ded6] text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[#1a1c1c]">{spot.corridor}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                spot.delayMins >= 10
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              +{spot.delayMins} min delay
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            {spot.bypassRecommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Turn-by-Turn Auto-Reroute Guidance */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                    <span className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-indigo-600" /> Active Bypass Turn Guidance:
                    </span>
                    <ul className="space-y-1.5">
                      {trafficData.optimizedPathGuidance.map((step, idx) => (
                        <li key={idx} className="text-xs text-indigo-900 flex items-start gap-1.5">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-[#f0ebe6] flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Heat Preserved: +{trafficData?.thermalHeatPreservedC || 4.6}°C
              </span>
              <button
                onClick={() => setDeliveryTab('deliveries')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Navigate Live Route</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
