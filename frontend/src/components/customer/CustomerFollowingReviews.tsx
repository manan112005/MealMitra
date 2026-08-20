import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  Star,
  ChefHat,
  MapPin,
  Utensils,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  viewMode?: 'following' | 'reviews';
}

export const CustomerFollowingReviews: React.FC<Props> = ({ viewMode = 'following' }) => {
  const { cooks, reviews, toggleFollowCook, setSelectedCookId, setCustomerTab } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'following' | 'reviews'>(viewMode);

  const followedCooks = cooks.filter((c) => c.isFollowing);

  const handleOpenCook = (cookId: string) => {
    setSelectedCookId(cookId);
    setCustomerTab('discover');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            {activeSubTab === 'following' ? (
              <>
                <Heart className="w-6 h-6 text-[#944a00] fill-[#944a00]" />
                <span>Followed Home Cooks</span>
              </>
            ) : (
              <>
                <Star className="w-6 h-6 text-[#e67e22] fill-[#e67e22]" />
                <span>Reviews & Community Ratings</span>
              </>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Stay updated with your favorite home cooks and read genuine neighbor reviews.
          </p>
        </div>

        <div className="p-1 bg-white border border-[#dcc1b1]/60 rounded-xl flex gap-1 self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setActiveSubTab('following')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'following'
                ? 'bg-[#944a00] text-white shadow-2xs'
                : 'text-[#564337] hover:text-[#1a1c1c]'
            }`}
          >
            Followed Cooks ({followedCooks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('reviews')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'reviews'
                ? 'bg-[#944a00] text-white shadow-2xs'
                : 'text-[#564337] hover:text-[#1a1c1c]'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'following' ? (
        /* Followed Cooks Grid */
        <div className="space-y-4">
          {followedCooks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-8 text-center space-y-3">
              <Heart className="w-10 h-10 text-[#564337]/40 mx-auto" />
              <h3 className="font-bold text-sm text-[#1a1c1c]">You haven't followed any cooks yet</h3>
              <p className="text-xs text-[#564337]">
                Follow your neighborhood cooks to receive kitchen open alerts and daily menu updates.
              </p>
              <button
                onClick={() => setCustomerTab('discover')}
                className="px-4 py-2 bg-[#944a00] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Discover Home Cooks
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {followedCooks.map((cook) => (
                <div
                  key={cook.id}
                  className="bg-white rounded-2xl border border-[#dcc1b1]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={cook.avatar}
                        alt={cook.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-[#ffdcc5] shadow-xs shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-[#1a1c1c]">{cook.name}</h3>
                          <ShieldCheck className="w-4 h-4 text-[#51634c]" />
                        </div>
                        <div className="flex items-center text-xs text-[#564337] mt-0.5 gap-2">
                          <span className="flex items-center text-[#944a00] font-bold">
                            <Star className="w-3.5 h-3.5 fill-[#e67e22] text-[#e67e22] mr-0.5" />
                            {cook.rating} ({cook.reviewsCount})
                          </span>
                          <span>•</span>
                          <span>{cook.cuisine.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#564337] mt-1">
                          <MapPin className="w-3 h-3 text-[#944a00]" />
                          <span>{cook.location} ({cook.distanceKm} km)</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                        cook.kitchenOpen ? 'bg-[#d1e6c9] text-[#51634c]' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {cook.kitchenOpen ? '● Kitchen Open' : '● Closed'}
                    </span>
                  </div>

                  <div className="p-3 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 text-xs text-[#564337]">
                    <div className="font-bold text-[#1a1c1c] mb-1">Today's Remaining Capacity:</div>
                    <div className="flex justify-between">
                      <span>Lunch: {cook.lunchAvailableQty} meals available</span>
                      <span>Dinner: {cook.dinnerAvailableQty} meals available</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#eeeeed]">
                    <button
                      onClick={() => toggleFollowCook(cook.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#ffdcc5] text-[#944a00] border border-[#944a00]/30 hover:bg-[#ffdcc5]/70 transition-colors"
                    >
                      Following
                    </button>
                    <button
                      onClick={() => handleOpenCook(cook.id)}
                      className="flex-1 py-1.5 px-3 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl text-center transition-colors shadow-2xs"
                    >
                      View Today's Menu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Reviews Feed */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-[#dcc1b1]/50 p-5 shadow-2xs space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffdcc5] text-[#944a00] flex items-center justify-center font-bold text-xs">
                      {rev.customerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1a1c1c]">{rev.customerName}</h4>
                      <div className="text-[11px] text-[#564337]">
                        Reviewed for <strong className="text-[#944a00]">{rev.cookName}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating ? 'fill-[#e67e22] text-[#e67e22]' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-xs text-[#1a1c1c] bg-[#faf9f8] p-3 rounded-xl border border-[#dcc1b1]/40 leading-relaxed">
                  "{rev.comment}"
                </div>

                <div className="flex justify-between items-center text-[10px] text-[#564337]">
                  <span>Dish: {rev.dishName}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
