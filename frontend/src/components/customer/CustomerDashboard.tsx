import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AICravingSearch } from './AICravingSearch';
import {
  ShoppingBag,
  CalendarCheck,
  Heart,
  Award,
  Star,
  User,
  ArrowRight,
  Sparkles,
  MapPin,
  Flame,
  CheckCircle,
  Activity,
  ChevronRight,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    meals,
    cooks,
    orders,
    userSubscription,
    subscriptions,
    currentUser,
    setSelectedMealForOrder,
    setSelectedCookId,
    setCustomerTab,
    toggleFollowCook,
  } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  const followedCooksCount = cooks.filter((c) => c.isFollowing).length;

  const isCookFollowedOrSubscribed = (cookId?: string, cookName?: string) => {
    if (!cookId && !cookName) return false;

    // 1. Check if the cook is followed
    const matchedCook = cooks.find(
      (c) =>
        (cookId && c.id === cookId) ||
        (cookName &&
          (c.name.toLowerCase().trim() === cookName.toLowerCase().trim() ||
            (c.chefName && c.chefName.toLowerCase().trim() === cookName.toLowerCase().trim())))
    );
    if (matchedCook?.isFollowing) return true;

    // 2. Check if customer has an active subscription with this cook
    if (userSubscription && userSubscription.status === 'Active') {
      if (cookId && userSubscription.cookId === cookId) return true;
      if (
        cookName &&
        userSubscription.cookName &&
        (userSubscription.cookName.toLowerCase().trim() === cookName.toLowerCase().trim() ||
          (matchedCook && userSubscription.cookName.toLowerCase().trim() === matchedCook.name.toLowerCase().trim()))
      ) {
        return true;
      }
    }

    // 3. Check active subscriptions in subscriptions list
    const hasActiveSub = (subscriptions || []).some(
      (s) =>
        s.status === 'Active' &&
        ((currentUser?.id && s.customerId === currentUser.id) ||
          (currentUser?.name && s.customerName && s.customerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim())) &&
        ((cookId && s.cookId === cookId) ||
          (cookName && s.cookName && s.cookName.toLowerCase().trim() === cookName.toLowerCase().trim()))
    );
    if (hasActiveSub) return true;

    return false;
  };

  // Availability-aware matching: only show meals from cooks the user follows or subscribes to
  const recommendedMeals = useMemo(() => {
    return [...meals]
      .filter((m) => isCookFollowedOrSubscribed(m.cookId, m.cookName) && m.availableQty > 0)
      .slice(0, 6);
  }, [meals, cooks, userSubscription, subscriptions, currentUser]);
  const topCooks = cooks.slice(0, 3);

  const handleCookProfileView = (cookId: string) => {
    setSelectedCookId(cookId);
    setCustomerTab('discover');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-white via-[#faf9f8] to-[#ffdcc5]/20 p-6 sm:p-8 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
              Good afternoon 👋
            </h2>
            <p className="text-sm sm:text-base text-[#564337]">
              Reserve fresh homemade tiffins from neighborhood kitchens. Finite batches cooked fresh daily.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCustomerTab('ai-coach')}
              className="px-4 py-2.5 bg-gradient-to-r from-[#ff6d00] to-[#e65100] hover:brightness-105 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Mitra AI Diet Coach</span>
            </button>
            <button
              onClick={() => setCustomerTab('meals')}
              className="self-start sm:self-auto px-4 py-2.5 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>Today's Slots</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature 2: AI Meal Mood & Smart Craving Search Bar */}
      <AICravingSearch />

      {/* Feature 1 Promo Spotlight: AI Diet & Calorie Coach Card */}
      <section className="bg-gradient-to-r from-[#1a1c1c] via-[#2d2c2b] to-[#1a1c1c] text-white p-5 sm:p-6 rounded-3xl border border-[#444] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6d00] to-[#ff9100] text-white flex items-center justify-center shrink-0 shadow-md">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#ffdcc5] mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6d00]" /> Personalized Nutrition
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Diabetic-friendly, Low Sodium, or High Protein?
            </h3>
            <p className="text-xs sm:text-sm text-[#ccc] mt-0.5 max-w-xl">
              Set your clinical diet targets or snap a meal picture. Mitra AI filters menus with verified portion-controlled ingredients.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCustomerTab('ai-coach')}
          className="self-end md:self-auto px-4 py-2.5 rounded-xl bg-white text-[#1a1c1c] text-xs font-black hover:bg-[#ffefe3] hover:text-[#944a00] active:scale-95 transition-all shadow-md shrink-0 flex items-center gap-1.5"
        >
          <span>Open AI Coach</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {/* Quick Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => setCustomerTab('orders')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#944a00] transition-all group"
        >
          <div className="flex items-center gap-2 text-[#564337] mb-2">
            <ShoppingBag className="w-4 h-4 text-[#944a00]" />
            <span className="text-xs font-bold">Active Reservations</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#944a00] group-hover:scale-105 transition-transform origin-left">
            {activeOrdersCount}
          </div>
          <span className="text-[11px] text-[#564337]/80 mt-1 block">
            {activeOrdersCount > 0 ? 'Live in progress' : 'No active reservations'}
          </span>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => setCustomerTab('subscriptions')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#51634c] transition-all group"
        >
          <div className="flex items-center gap-2 text-[#564337] mb-2">
            <CalendarCheck className="w-4 h-4 text-[#51634c]" />
            <span className="text-xs font-bold">Subscription</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#51634c] group-hover:scale-105 transition-transform origin-left">
            {userSubscription ? 'Active' : 'Get Plan'}
          </div>
          <span className="text-[11px] text-[#564337]/80 mt-1 block">
            {userSubscription ? `${userSubscription.remainingDays} days remaining` : 'Daily tiffin plan'}
          </span>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => setCustomerTab('following')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#944a00] transition-all group"
        >
          <div className="flex items-center gap-2 text-[#564337] mb-2">
            <Heart className="w-4 h-4 text-[#944a00]" />
            <span className="text-xs font-bold">Favorite Cooks</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#944a00] group-hover:scale-105 transition-transform origin-left">
            {followedCooksCount}
          </div>
          <span className="text-[11px] text-[#564337]/80 mt-1 block">Kitchen open alerts</span>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => setCustomerTab('profile')}
          className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer hover:border-[#51634c] transition-all group"
        >
          <div className="flex items-center gap-2 text-[#564337] mb-2">
            <Award className="w-4 h-4 text-[#51634c]" />
            <span className="text-xs font-bold">Reward Points</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#51634c] group-hover:scale-105 transition-transform origin-left">
            1,250
          </div>
          <span className="text-[11px] text-[#564337]/80 mt-1 block">₹125 off next order</span>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#1a1c1c]">Personalized for you</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdcc5] text-[#944a00] text-[10px] font-bold">
                <Sparkles className="w-3 h-3" />
                AI Smart Pick
              </span>
            </div>
            <p className="text-xs text-[#564337]">
              Based on the home cooks you follow and your subscribed tiffin plans
            </p>
          </div>
          <button
            onClick={() => setCustomerTab('meals')}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#944a00] hover:underline"
          >
            <span>View All Today's Meals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recommendedMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col hover:shadow-md transition-all group"
              >
                {/* Image & Badges */}
                <div className="h-48 w-full relative overflow-hidden bg-[#eeeeed]">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    onClick={() => meal.availableQty > 0 && setSelectedMealForOrder(meal)}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${meal.availableQty > 0 ? 'cursor-pointer' : ''}`}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-[#d1e6c9]/95 text-[#51634c] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs backdrop-blur-xs">
                      {meal.dietary}
                    </span>
                    <span className="bg-white/90 text-[#1a1c1c] text-[11px] font-semibold px-2 py-1 rounded-full shadow-2xs">
                      {meal.category}
                    </span>
                  </div>
                  {(() => {
                    const matchedCook = cooks.find(
                      (c) =>
                        (meal.cookId && c.id === meal.cookId) ||
                        (meal.cookName && c.name.toLowerCase().trim() === meal.cookName.toLowerCase().trim())
                    );
                    const isFollowed = Boolean(matchedCook?.isFollowing);
                    return (
                      <button
                        onClick={() => toggleFollowCook(meal.cookId)}
                        className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-xs rounded-full hover:bg-white transition-all shadow-2xs cursor-pointer group/heart"
                        title={isFollowed ? 'Unfollow Cook' : 'Follow Cook & Add to Favorites'}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isFollowed ? 'fill-red-500 text-red-500' : 'text-[#564337] group-hover/heart:text-red-500'
                          }`}
                        />
                      </button>
                    );
                  })()}
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-base text-[#1a1c1c] line-clamp-1 group-hover:text-[#944a00] transition-colors">
                        {meal.name}
                      </h4>
                      <span className="font-extrabold text-lg text-[#944a00]">₹{meal.price}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#564337] mt-2">
                      <span className="flex items-center gap-1 font-medium">
                        <User className="w-3.5 h-3.5 text-[#564337]" />
                        <span>{meal.cookName}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-bold text-[#944a00]">
                        <Star className="w-3.5 h-3.5 fill-[#e67e22] text-[#e67e22]" />
                        <span>{meal.rating}</span>
                      </span>
                      <span>•</span>
                      <span>{meal.distanceKm} km</span>
                    </div>

                    <p className="text-xs text-[#564337]/90 mt-2 line-clamp-2 leading-relaxed">
                      {meal.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#eeeeed] flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#564337]">
                      {meal.availableQty > 0 ? (
                        <span className="text-[#51634c] font-semibold">
                          ● {meal.availableQty} slots available
                        </span>
                      ) : (
                        <span className="text-amber-800 font-semibold">● Capacity Full</span>
                      )}
                    </span>

                    <button
                      onClick={() => setSelectedMealForOrder(meal)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                        meal.availableQty > 0
                          ? 'bg-[#944a00] hover:bg-[#713700] text-white'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {meal.availableQty > 0 ? (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      ) : (
                        'Join Waitlist'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-[#dcc1b1] p-8 sm:p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 bg-[#ffdcc5]/60 rounded-full flex items-center justify-center text-[#944a00] shadow-xs">
              <Heart className="w-7 h-7" />
            </div>
            <div className="max-w-md space-y-1.5">
              <h4 className="text-base sm:text-lg font-bold text-[#1a1c1c]">
                No Followed or Subscribed Cooks Yet
              </h4>
              <p className="text-xs sm:text-sm text-[#564337]">
                Personalized dishes are shown from the home cooks you follow or subscribe to. Follow your favorite neighborhood chefs below or subscribe to unlock their fresh daily menus!
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCustomerTab('discover')}
                className="px-5 py-2.5 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Neighborhood Cooks</span>
              </button>
              <button
                onClick={() => setCustomerTab('subscriptions')}
                className="px-5 py-2.5 bg-[#d1e6c9] hover:bg-[#b8d8ad] text-[#51634c] text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>View Tiffin Plans</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Recommended Cooks Section */}
      <section className="space-y-4 pt-2">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1a1c1c]">Top Rated Cooks Near You</h3>
            <p className="text-xs text-[#564337]">
              Experienced neighborhood home chefs with daily rotating thali menus
            </p>
          </div>
          <button
            onClick={() => setCustomerTab('discover')}
            className="text-xs font-bold text-[#944a00] hover:underline flex items-center gap-1"
          >
            <span>Explore All Cooks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topCooks.map((cook) => (
            <div
              key={cook.id}
              className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <img
                  src={cook.avatar}
                  alt={cook.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#ffdcc5] shadow-xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#1a1c1c] truncate">{cook.name}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cook.kitchenOpen
                          ? 'bg-[#d1e6c9] text-[#51634c]'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {cook.kitchenOpen ? 'Kitchen Open' : 'Sold Out'}
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-[#564337] mt-1 gap-1.5 flex-wrap">
                    <span className="flex items-center text-[#944a00] font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#e67e22] text-[#e67e22] mr-0.5" />
                      {cook.rating}
                    </span>
                    <span>•</span>
                    <span>{cook.experienceYears} yrs exp</span>
                    <span>•</span>
                    <span>{cook.cuisine[0]}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-[#564337] mt-1">
                    <MapPin className="w-3 h-3 text-[#944a00]" />
                    <span className="truncate">{cook.location} ({cook.distanceKm} km)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#eeeeed] flex gap-2">
                <button
                  onClick={() => toggleFollowCook(cook.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    cook.isFollowing
                      ? 'bg-[#ffdcc5] text-[#944a00] border-[#944a00]/30'
                      : 'border-[#dcc1b1] text-[#564337] hover:bg-[#faf9f8]'
                  }`}
                >
                  {cook.isFollowing ? 'Following' : '+ Follow'}
                </button>
                <button
                  onClick={() => handleCookProfileView(cook.id)}
                  className="flex-1 py-1.5 px-3 bg-[#faf9f8] hover:bg-[#ffdcc5]/40 text-[#944a00] font-bold text-xs rounded-lg border border-[#dcc1b1]/50 text-center transition-colors"
                >
                  View Profile & Menu
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
