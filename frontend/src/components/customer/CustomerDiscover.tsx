import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  MapPin,
  Filter,
  Star,
  Heart,
  Utensils,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { CustomerCookProfile } from './CustomerCookProfile';

export const CustomerDiscover: React.FC = () => {
  const { cooks, selectedCookId, setSelectedCookId, toggleFollowCook } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Areas');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [selectedDistance, setSelectedDistance] = useState('All');
  const [onlyOpenKitchens, setOnlyOpenKitchens] = useState(false);

  const cuisinesList = [
    'All',
    'Gujarati',
    'North Indian',
    'Punjabi',
    'Mediterranean',
    'High Protein',
    'Vegan',
    'Comfort Soups',
  ];

  const locationsList = [
    'All Areas',
    'Navrangpura',
    'Bodakdev',
    'Satellite Road',
    'Vastrapur',
    'Prahlad Nagar',
  ];

  const filteredCooks = useMemo(() => {
    return cooks.filter((cook) => {
      // Search
      const matchesSearch =
        cook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cook.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        cook.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Location
      const matchesLocation =
        selectedLocation === 'All Areas' || cook.location.includes(selectedLocation);

      // Cuisine
      const matchesCuisine =
        selectedCuisine === 'All' || cook.cuisine.includes(selectedCuisine);

      // Rating
      const matchesRating =
        selectedRating === 'All' ||
        (selectedRating === '4.8+' && cook.rating >= 4.8) ||
        (selectedRating === '4.5+' && cook.rating >= 4.5);

      // Distance
      const matchesDistance =
        selectedDistance === 'All' ||
        (selectedDistance === '< 2 km' && cook.distanceKm <= 2) ||
        (selectedDistance === '< 5 km' && cook.distanceKm <= 5);

      // Kitchen Open Only
      const matchesOpen = !onlyOpenKitchens || cook.kitchenOpen;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCuisine &&
        matchesRating &&
        matchesDistance &&
        matchesOpen
      );
    });
  }, [cooks, searchQuery, selectedLocation, selectedCuisine, selectedRating, selectedDistance, onlyOpenKitchens]);

  // If a cook is selected, show their full profile view
  if (selectedCookId) {
    return <CustomerCookProfile cookId={selectedCookId} onBack={() => setSelectedCookId(null)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight">
          Discover Local Home Cooks
        </h2>
        <p className="text-xs sm:text-sm text-[#564337]">
          Connect with trusted neighborhood cooks preparing authentic homemade thalis, bowls, and tiffins.
        </p>
      </div>

      {/* Filter & Search Bar Card */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 shadow-2xs p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#564337] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by cook name, cuisine (e.g. Gujarati, Punjabi), or dish..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-xs sm:text-sm text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00]"
            />
          </div>

          {/* Location Filter */}
          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 text-[#944a00] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-xs text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00] cursor-pointer"
            >
              {locationsList.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Distance Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-xs text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00] cursor-pointer"
            >
              <option value="All">All Distances</option>
              <option value="< 2 km">Within 2 km (Fast Delivery)</option>
              <option value="< 5 km">Within 5 km</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#eeeeed]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-[11px] font-bold text-[#564337] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Cuisine:
            </span>
            {cuisinesList.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCuisine === c
                    ? 'bg-[#944a00] text-white shadow-2xs'
                    : 'bg-[#faf9f8] text-[#564337] hover:bg-[#eeeeed] border border-[#dcc1b1]/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Toggle Kitchen Open Only */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1a1c1c] shrink-0">
            <input
              type="checkbox"
              checked={onlyOpenKitchens}
              onChange={(e) => setOnlyOpenKitchens(e.target.checked)}
              className="w-4 h-4 text-[#944a00] rounded focus:ring-[#944a00] accent-[#944a00]"
            />
            <span>Open Kitchens Only</span>
          </label>
        </div>
      </div>

      {/* Cook Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCooks.map((cook) => (
          <div
            key={cook.id}
            className="bg-white rounded-2xl border border-[#dcc1b1]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div className="p-5 space-y-4">
              {/* Cook Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={cook.avatar}
                    alt={cook.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-[#ffdcc5] shadow-xs shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-[#1a1c1c] group-hover:text-[#944a00] transition-colors">
                        {cook.name}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-[#51634c]" title="FSSAI Hygiene Verified" />
                    </div>

                    <div className="flex items-center text-xs text-[#564337] mt-0.5 gap-2">
                      <span className="flex items-center text-[#944a00] font-bold">
                        <Star className="w-3.5 h-3.5 fill-[#e67e22] text-[#e67e22] mr-0.5" />
                        {cook.rating} ({cook.reviewsCount})
                      </span>
                      <span>•</span>
                      <span>{cook.experienceYears} yrs experience</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[#564337] mt-1">
                      <MapPin className="w-3 h-3 text-[#944a00]" />
                      <span>{cook.location} • {cook.distanceKm} km away</span>
                    </div>
                  </div>
                </div>

                {/* Open / Closed Badge */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                    cook.kitchenOpen
                      ? 'bg-[#d1e6c9] text-[#51634c]'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {cook.kitchenOpen ? 'Kitchen Open' : 'Kitchen Closed — Sold Out'}
                </span>
              </div>

              {/* Bio snippet & Specialties */}
              <p className="text-xs text-[#564337] line-clamp-2 leading-relaxed">
                {cook.bio}
              </p>

              {/* Daily Capacity Status Indicators */}
              <div className="p-3 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-[#564337]">
                    <span>Lunch Availability</span>
                    <span className="font-bold text-[#1a1c1c]">{cook.lunchAvailableQty} left</span>
                  </div>
                  <div className="w-full bg-[#eeeeed] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#944a00] h-full rounded-full"
                      style={{
                        width: `${((cook.lunchTotalQty - cook.lunchAvailableQty) / cook.lunchTotalQty) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium text-[#564337]">
                    <span>Dinner Availability</span>
                    <span className="font-bold text-[#1a1c1c]">{cook.dinnerAvailableQty} left</span>
                  </div>
                  <div className="w-full bg-[#eeeeed] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#51634c] h-full rounded-full"
                      style={{
                        width: `${((cook.dinnerTotalQty - cook.dinnerAvailableQty) / cook.dinnerTotalQty) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Cuisine Tags */}
              <div className="flex flex-wrap gap-1.5">
                {cook.cuisine.map((c, i) => (
                  <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#faf9f8] border border-[#dcc1b1]/40 text-[#564337]">
                    {c}
                  </span>
                ))}
                <span className="text-[10px] font-semibold text-[#51634c] ml-auto">
                  {cook.mealsDelivered.toLocaleString()}+ orders delivered
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-[#faf9f8]/60 border-t border-[#eeeeed] flex items-center justify-between gap-3">
              <button
                onClick={() => toggleFollowCook(cook.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                  cook.isFollowing
                    ? 'bg-[#ffdcc5] text-[#944a00] border-[#944a00]/30'
                    : 'bg-white border-[#dcc1b1] text-[#564337] hover:bg-[#faf9f8]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${cook.isFollowing ? 'fill-[#944a00]' : ''}`} />
                <span>{cook.isFollowing ? 'Following' : 'Follow'}</span>
              </button>

              <button
                onClick={() => setSelectedCookId(cook.id)}
                className="flex-1 py-2 px-4 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Menu & Schedule</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCooks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#dcc1b1]/60 p-8">
          <Utensils className="w-10 h-10 text-[#564337]/50 mx-auto mb-2" />
          <h3 className="font-bold text-base text-[#1a1c1c]">No cooks match your current filter</h3>
          <p className="text-xs text-[#564337] mt-1">
            Try clearing some filters or searching for another neighborhood.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLocation('All Areas');
              setSelectedCuisine('All');
              setSelectedRating('All');
              setSelectedDistance('All');
              setOnlyOpenKitchens(false);
            }}
            className="mt-4 px-4 py-2 bg-[#944a00] text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
