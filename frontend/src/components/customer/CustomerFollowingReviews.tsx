import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  Star,
  ChefHat,
  MapPin,
  Utensils,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  MessageSquare,
  ThumbsUp,
  X,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';


interface Props {
  viewMode?: 'following' | 'reviews';
}

export const CustomerFollowingReviews: React.FC<Props> = ({ viewMode = 'following' }) => {
  const { cooks, reviews, addReview, toggleFollowCook, setSelectedCookId, setCustomerTab, meals } = useApp();
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'following' | 'reviews'>(viewMode);

  // Review Filter state
  const [filterMode, setFilterMode] = useState<'all' | 'followed'>('all');

  // Review Modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedCookIdForReview, setSelectedCookIdForReview] = useState<string>('');
  const [reviewDishName, setReviewDishName] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const followedCooks = cooks.filter((c) => c.isFollowing);

  const displayedReviews = reviews.filter((rev) => {
    if (filterMode === 'followed') {
      const followedCookIds = followedCooks.map((c) => c.id);
      const followedCookNames = followedCooks.map((c) => c.name.toLowerCase());
      return (
        followedCookIds.includes(rev.cookId) ||
        followedCookNames.includes(rev.cookName.toLowerCase())
      );
    }
    return true;
  });

  const handleOpenCook = (cookId: string) => {
    setSelectedCookId(cookId);
    setCustomerTab('discover');
  };

  const handleOpenReviewModal = (preselectedCookId?: string) => {
    if (preselectedCookId) {
      setSelectedCookIdForReview(preselectedCookId);
    } else if (cooks.length > 0) {
      setSelectedCookIdForReview(cooks[0].id);
    } else {
      setSelectedCookIdForReview('');
    }
    setReviewRating(5);
    setReviewComment('');
    setReviewDishName('');
    setReviewSuccess(false);
    setShowReviewModal(true);
  };

  const handleSubmitNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const chosenCook = cooks.find((c) => c.id === selectedCookIdForReview) || cooks[0];
    const cookName = chosenCook ? chosenCook.name : 'Home Chef';
    const cookId = chosenCook ? chosenCook.id : 'custom-cook';

    addReview({
      customerName: user?.name || 'MANAN PATEL',
      customerAvatar: user?.avatar || '',
      cookId,
      cookName,
      mealName: reviewDishName.trim() || 'Homestyle Special Tiffin',
      dishName: reviewDishName.trim() || 'Homestyle Special Tiffin',
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setShowReviewModal(false);
      setReviewComment('');
      setReviewDishName('');
    }, 1200);
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

        <div className="flex flex-wrap items-center gap-2">
          {activeSubTab === 'reviews' && (
            <button
              onClick={() => handleOpenReviewModal()}
              className="px-3.5 py-2 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          )}

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
      </div>

      {activeSubTab === 'following' ? (
        /* Followed Cooks Grid */
        <div className="space-y-4">
          {followedCooks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-12 text-center space-y-4 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-[#ffdcc5]/50 flex items-center justify-center mx-auto text-[#944a00]">
                <Heart className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#1a1c1c]">You haven't followed any cooks yet</h3>
                <p className="text-xs text-[#564337] max-w-md mx-auto">
                  Follow your neighborhood home cooks to receive daily menu notifications and kitchen capacity alerts.
                </p>
              </div>
              <button
                onClick={() => setCustomerTab('discover')}
                className="px-5 py-2.5 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-2 transition-colors"
              >
                <span>Discover Home Cooks</span>
                <ArrowRight className="w-4 h-4" />
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
          {reviews.length > 0 && followedCooks.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#564337]">Filter:</span>
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filterMode === 'all'
                    ? 'bg-[#944a00] text-white'
                    : 'bg-white border border-[#dcc1b1]/60 text-[#564337] hover:bg-[#faf9f8]'
                }`}
              >
                All Cooks ({reviews.length})
              </button>
              <button
                onClick={() => setFilterMode('followed')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filterMode === 'followed'
                    ? 'bg-[#944a00] text-white'
                    : 'bg-white border border-[#dcc1b1]/60 text-[#564337] hover:bg-[#faf9f8]'
                }`}
              >
                Followed Cooks Only ({displayedReviews.length})
              </button>
            </div>
          )}

          {displayedReviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-12 text-center space-y-4 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-[#ffdcc5]/50 flex items-center justify-center mx-auto text-[#944a00]">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#1a1c1c]">No community reviews yet</h3>
                <p className="text-xs text-[#564337] max-w-md mx-auto">
                  When customers rate and review dishes from local home cooks, genuine ratings and neighborhood feedback will appear here in real time.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenReviewModal()}
                  className="px-5 py-2.5 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write First Review</span>
                </button>
                <button
                  onClick={() => setCustomerTab('discover')}
                  className="px-5 py-2.5 bg-white border border-[#dcc1b1] hover:bg-[#faf9f8] text-[#564337] text-xs font-bold rounded-xl shadow-2xs transition-colors"
                >
                  Explore Home Cooks
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl border border-[#dcc1b1]/50 p-5 shadow-2xs space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {rev.customerAvatar ? (
                        <img
                          src={rev.customerAvatar}
                          alt={rev.customerName}
                          className="w-10 h-10 rounded-full object-cover border border-[#ffdcc5]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#ffdcc5] text-[#944a00] flex items-center justify-center font-bold text-xs uppercase">
                          {rev.customerName.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-xs text-[#1a1c1c]">{rev.customerName}</h4>
                        <div className="text-[11px] text-[#564337]">
                          Reviewed for{' '}
                          <button
                            onClick={() => {
                              const matching = cooks.find((c) => c.id === rev.cookId || c.name === rev.cookName);
                              if (matching) handleOpenCook(matching.id);
                            }}
                            className="font-bold text-[#944a00] hover:underline"
                          >
                            {rev.cookName}
                          </button>
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

                  <div className="flex justify-between items-center text-[11px] text-[#564337] pt-1">
                    <span className="font-medium text-[#713700]">
                      Dish: <span className="text-[#1a1c1c]">{rev.dishName || rev.mealName || 'Homestyle Meal'}</span>
                    </span>
                    <span className="text-[10px] text-[#787675]">{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#dcc1b1] shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="p-1 px-2.5 rounded-lg text-[#564337] hover:text-[#1a1c1c] hover:bg-gray-100 border border-[#dcc1b1]/60 flex items-center gap-1 text-xs font-bold transition-all shadow-2xs"
                  title="Back"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <div className="h-4 w-px bg-[#dcc1b1]/50" />
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-[#e67e22] fill-[#e67e22]" />
                  <h3 className="text-base font-bold text-[#1a1c1c]">Write a Community Review</h3>
                </div>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#564337]">
              Share your dining experience with neighbors and help home chefs maintain high food quality.
            </p>

            {reviewSuccess ? (
              <div className="p-4 bg-[#d1e6c9] text-[#51634c] text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! Your review has been added to the community feed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitNewReview} className="space-y-4">
                {/* Select Cook */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1a1c1c]">Home Cook</label>
                  {cooks.length > 0 ? (
                    <select
                      value={selectedCookIdForReview}
                      onChange={(e) => setSelectedCookIdForReview(e.target.value)}
                      className="w-full p-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:ring-1 focus:ring-[#944a00]"
                      required
                    >
                      {cooks.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.cuisine.join(', ')})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Enter cook or kitchen name"
                      value={selectedCookIdForReview}
                      onChange={(e) => setSelectedCookIdForReview(e.target.value)}
                      className="w-full p-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
                      required
                    />
                  )}
                </div>

                {/* Dish Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1a1c1c]">Dish / Meal Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kathiyawadi Thali, Paneer Bhurji & Phulka"
                    value={reviewDishName}
                    onChange={(e) => setReviewDishName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:ring-1 focus:ring-[#944a00]"
                  />
                </div>

                {/* Star Rating */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1a1c1c]">Your Rating</label>
                  <div className="flex justify-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= reviewRating ? 'fill-[#e67e22] text-[#e67e22]' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1a1c1c]">Review & Comments</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    placeholder="Describe the freshness, taste, softness of rotis, spice balance, etc."
                    className="w-full p-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:ring-1 focus:ring-[#944a00]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2.5 border border-[#dcc1b1] text-[#564337] rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#944a00] hover:bg-[#713700] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Submit Review
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
