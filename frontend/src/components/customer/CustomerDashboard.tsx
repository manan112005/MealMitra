import React from 'react';
import { useApp } from '../../context/AppContext';
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
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    meals,
    cooks,
    orders,
    userSubscription,
    setSelectedMealForOrder,
    setSelectedCookId,
    setCustomerTab,
    toggleFollowCook,
  } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  const followedCooksCount = cooks.filter((c) => c.isFollowing).length;

  const recommendedMeals = meals.slice(0, 3);
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
              Find something homemade and delicious today. Fresh kitchens are cooking right now in your neighborhood.
            </p>
          </div>
          <button
            onClick={() => setCustomerTab('meals')}
            className="self-start sm:self-auto px-4 py-2.5 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Flame className="w-4 h-4" />
            <span>Explore Today's Menus</span>
          </button>
        </div>
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
            <span className="text-xs font-bold">Active Orders</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#944a00] group-hover:scale-105 transition-transform origin-left">
            {activeOrdersCount}
          </div>
          <span className="text-[11px] text-[#564337]/80 mt-1 block">
            {activeOrdersCount > 0 ? 'Live in transit' : 'No active orders'}
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
              Based on your recent homestyle cravings, dietary habits, and neighbor ratings
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-[#d1e6c9]/95 text-[#51634c] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs backdrop-blur-xs">
                    {meal.dietary}
                  </span>
                  <span className="bg-white/90 text-[#1a1c1c] text-[11px] font-semibold px-2 py-1 rounded-full shadow-2xs">
                    {meal.category}
                  </span>
                </div>
                <button
                  onClick={() => toggleFollowCook(meal.cookId)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full text-[#564337] hover:text-[#944a00] transition-colors shadow-2xs"
                  title="Favorite Cook"
                >
                  <Heart className="w-4 h-4" />
                </button>
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
                        ● {meal.availableQty} meals ready
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold">● Sold Out Today</span>
                    )}
                  </span>

                  <button
                    disabled={meal.availableQty < 1}
                    onClick={() => setSelectedMealForOrder(meal)}
                    className="px-4 py-2 bg-[#944a00] hover:bg-[#713700] disabled:bg-gray-200 disabled:text-gray-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95"
                  >
                    {meal.availableQty > 0 ? 'Order Now' : 'Sold Out'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
