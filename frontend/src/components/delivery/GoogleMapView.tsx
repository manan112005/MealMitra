import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Bike,
  Store,
  Home,
  ExternalLink,
  Layers,
  Crosshair,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { GeoLocation, OptimizedStopItem, calculateHaversineDistance } from '../../utils/routeOptimizer';

interface GoogleMapViewProps {
  stops: OptimizedStopItem[];
  activeStop?: OptimizedStopItem | null;
  riderLocation?: GeoLocation;
  clusterName?: string;
  onArrivedAtStop?: (stopId: string) => void;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  stops,
  activeStop,
  riderLocation,
  clusterName = 'Bodakdev – Satellite Cluster',
  onArrivedAtStop,
}) => {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [realGpsCoords, setRealGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'directions'>('map');
  const [simulatedProgress, setSimulatedProgress] = useState(35); // 0 to 100%

  // Get current active target destination or default
  const currentTarget = activeStop || stops.find((s) => s.status === 'In Progress') || stops[0];

  // Rider position: Use real GPS if granted, or rider location / interpolated position
  const currentRiderPos: GeoLocation = {
    lat: realGpsCoords?.lat || riderLocation?.lat || 23.035,
    lng: realGpsCoords?.lng || riderLocation?.lng || 72.515,
    name: realGpsCoords ? 'Live GPS Location' : 'Rider Location (Bodakdev)',
  };

  // Target destination coordinates
  const targetPos: GeoLocation = currentTarget?.location || {
    lat: 23.0373,
    lng: 72.5123,
    name: currentTarget?.targetName || 'Destination',
  };

  // Calculate live distance between Rider and active target
  const distanceToTarget = calculateHaversineDistance(currentRiderPos, targetPos);

  // Watch real device GPS location if permitted
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setRealGpsCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log('GPS watch note: using cluster navigation coordinates', error.message);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Simulate rider movement along shortest path if tracking active
  useEffect(() => {
    if (!isLiveTracking) return;

    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 95) return 15;
        return prev + 2;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveTracking]);

  // Construct real Google Maps Directions URL for external app navigation
  const googleMapsAppUrl = (() => {
    const origin = `${currentRiderPos.lat},${currentRiderPos.lng}`;
    const destination = encodeURIComponent(currentTarget?.address || `${targetPos.lat},${targetPos.lng}`);
    
    // Add waypoints if multiple stops exist
    const waypointsList = stops
      .filter((s) => s.id !== currentTarget?.id && s.status !== 'Completed')
      .map((s) => encodeURIComponent(s.address))
      .slice(0, 3)
      .join('|');

    const waypointsParam = waypointsList ? `&waypoints=${waypointsList}` : '';
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsParam}&travelmode=two_wheeler`;
  })();

  // Construct Google Maps Embed Query
  const embedMapUrl = (() => {
    const destQuery = encodeURIComponent(`${currentTarget?.address || targetPos.name}, Ahmedabad, Gujarat, India`);
    const zoomLevel = mapType === 'satellite' ? 17 : 15;
    return `https://maps.google.com/maps?q=${destQuery}&t=${mapType === 'satellite' ? 'k' : mapType === 'terrain' ? 'p' : 'm'}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;
  })();

  return (
    <div className="bg-white rounded-2xl border-2 border-[#4e6074]/40 shadow-sm overflow-hidden space-y-4">
      {/* Top Map Control Bar */}
      <div className="p-4 bg-[#faf9f8] border-b border-[#dcc1b1]/50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4e6074] text-white flex items-center justify-center shadow-xs shrink-0">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-[#1a1c1c]">Google Maps Live Delivery Tracking</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                GPS Active
              </span>
            </div>
            <p className="text-[11px] text-[#564337]">
              {realGpsCoords ? 'Connected to Device GPS' : 'AI Shortest-Path Route Vector Simulation'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Map Layer Switcher */}
          <div className="flex bg-white rounded-lg border border-[#dcc1b1]/60 p-0.5 text-[11px] font-bold">
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mapType === 'roadmap' ? 'bg-[#4e6074] text-white shadow-2xs' : 'text-[#564337]'
              }`}
            >
              Road
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mapType === 'satellite' ? 'bg-[#4e6074] text-white shadow-2xs' : 'text-[#564337]'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('terrain')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mapType === 'terrain' ? 'bg-[#4e6074] text-white shadow-2xs' : 'text-[#564337]'
              }`}
            >
              Terrain
            </button>
          </div>

          {/* Open In Native Google Maps App */}
          <a
            href={googleMapsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-[#4e6074] hover:bg-[#384859] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Launch Full Google Maps Native Turn-by-Turn App"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Google Maps App</span>
          </a>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative h-[340px] sm:h-[420px] w-full bg-slate-100 overflow-hidden">
        {/* Real Embedded Google Map Iframe */}
        <iframe
          title="Google Map Live Navigation"
          src={embedMapUrl}
          className="w-full h-full border-0 filter saturate-110"
          loading="lazy"
          allowFullScreen
        ></iframe>

        {/* Live Floating HUD Overlay (Turn-by-turn guidance header) */}
        <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-[#dcc1b1]/70 shadow-lg space-y-2 pointer-events-auto">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#4e6074] text-white flex items-center justify-center font-bold text-lg shrink-0">
                ↰
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#1a1c1c]">
                  {currentTarget?.turnManeuver || 'Turn Left onto Judges Bungalow Road'}
                </div>
                <div className="text-[10px] text-[#564337] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#944a00]" />
                  <span className="truncate">{currentTarget?.address}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-black text-[#4e6074]">{distanceToTarget} km</div>
              <div className="text-[10px] font-mono text-[#564337]">{currentTarget?.eta || 'ETA 4 mins'}</div>
            </div>
          </div>

          {/* Progress bar of current leg */}
          <div className="space-y-1 pt-1 border-t border-[#eeeeed]">
            <div className="flex justify-between text-[10px] font-bold text-[#564337]">
              <span>Rider En Route</span>
              <span className="text-[#51634c]">Speed: 24 km/h • On-Time</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4e6074] to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${simulatedProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Floating Quick Action Overlay at Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap justify-between items-center gap-2 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#dcc1b1]/60 shadow-md text-xs font-bold text-[#1a1c1c] flex items-center gap-2 pointer-events-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Target: {currentTarget?.targetName}</span>
            <span className="text-[10px] font-semibold text-[#564337]">({currentTarget?.type})</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setIsLiveTracking(!isLiveTracking)}
              className="p-2 bg-white/95 hover:bg-white text-[#564337] border border-[#dcc1b1]/70 rounded-xl shadow-md transition-colors cursor-pointer"
              title={isLiveTracking ? 'Pause GPS Simulation' : 'Resume GPS Tracking'}
            >
              {isLiveTracking ? <Pause className="w-4 h-4 text-[#4e6074]" /> : <Play className="w-4 h-4 text-emerald-600" />}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-white/95 hover:bg-white text-[#564337] border border-[#dcc1b1]/70 rounded-xl shadow-md transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Audio Guidance' : 'Mute Voice GPS'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-gray-500" /> : <Volume2 className="w-4 h-4 text-[#4e6074]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Route Legs & Live Stop Sequence Bar */}
      {(() => {
        const activeWaypoints = stops.filter((s) => s.status !== 'Completed');
        if (activeWaypoints.length === 0) return null;

        return (
          <div className="p-4 pt-0 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#564337] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#4e6074]" />
              <span>Active Waypoints Pending Handover • {activeWaypoints.length} Remaining</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activeWaypoints.map((stop, idx) => {
                const isCurrent = stop.id === currentTarget?.id;

                return (
                  <div
                    key={stop.id}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      isCurrent
                        ? 'bg-[#d1e4fc]/30 border-[#4e6074] shadow-xs ring-2 ring-[#4e6074]/20'
                        : 'bg-[#faf9f8] border-[#dcc1b1]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                            isCurrent
                              ? 'bg-[#4e6074] text-white'
                              : 'bg-white border border-[#dcc1b1] text-[#564337]'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-extrabold text-[#1a1c1c] line-clamp-1">{stop.targetName}</div>
                          <div className="text-[10px] text-[#564337] line-clamp-1">{stop.address}</div>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          stop.type === 'Cook Pickup' ? 'bg-[#ffdcc5] text-[#944a00]' : 'bg-[#d1e6c9] text-[#51634c]'
                        }`}
                      >
                        {stop.type === 'Cook Pickup' ? 'Pickup' : 'Drop'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#eeeeed]/80 text-[10px]">
                      <span className="text-[#564337] font-mono">ETA: {stop.eta}</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4e6074] font-bold hover:underline flex items-center gap-0.5"
                      >
                        <span>View Map</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
