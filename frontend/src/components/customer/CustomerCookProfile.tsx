import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_COOKS } from '../../data/mockData';
import {
  Star,
  MapPin,
  Heart,
  Award,
  Users,
  ShieldCheck,
  Phone,
  ArrowLeft,
  Calendar,
  Utensils,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface Props {
  cookId: string;
  onBack: () => void;
}

export const CustomerCookProfile: React.FC<Props> = ({ cookId, onBack }) => {
  const { cooks, meals, toggleFollowCook, setSelectedMealForOrder } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const safeCooks = cooks || [];
  const cook = safeCooks.find((c) => c.id === cookId) || safeCooks[0] || (MOCK_COOKS && MOCK_COOKS[0]);
  const cookMeals = (meals || []).filter((m) => cook && m.cookId === cook.id);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const defaultDaySchedule = {
    day: 'Monday' as const,
    lunch: { mainDish: 'Deluxe Homestyle Sabzi', dal: 'Dal Tadka', bread: '4 Ghee Phulkas', rice: 'Jeera Rice', sides: ['Kachumber Salad', 'Papad'] },
    dinner: { mainDish: 'Paneer Butter Masala', dal: 'Gujarati Kadhi', bread: '3 Soft Rotis', rice: 'Vaghareli Khichdi', sides: ['Masala Chaas'] }
  };

  const daySchedule = (cook?.weeklyMenu && Array.isArray(cook.weeklyMenu) && cook.weeklyMenu.find((d) => d.day === selectedDay)) || (cook?.weeklyMenu && Array.isArray(cook.weeklyMenu) && cook.weeklyMenu[0]) || defaultDaySchedule;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#944a00] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discover Cooks</span>
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 w-full relative bg-[#eeeeed]">
          <img
            src={cook.coverImage || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1000&auto=format&fit=crop&q=80'}
            alt={cook.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Kitchen status badge on cover */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                cook.kitchenOpen
                  ? 'bg-[#d1e6c9] text-[#51634c]'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {cook.kitchenOpen ? '● Kitchen Open' : '● Kitchen Closed — Sold Out'}
            </span>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-[#eeeeed]">
            <div className="flex items-end gap-4">
              <img
                src={cook.avatar}
                alt={cook.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#1a1c1c]">{cook.name}</h1>
                  <span className="p-1 rounded-full bg-[#d1e6c9] text-[#51634c]" title="Verified Home Cook">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#564337] flex-wrap">
                  <span className="flex items-center gap-1 font-bold text-[#944a00]">
                    <Star className="w-3.5 h-3.5 fill-[#e67e22] text-[#e67e22]" />
                    {cook.rating} ({cook.reviewsCount} reviews)
                  </span>
                  <span>•</span>
                  <span>{cook.experienceYears} Years Experience</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#944a00]" />
                    {cook.location} ({cook.distanceKm} km)
                  </span>
                </div>
              </div>
            </div>

            {/* Follow / Call */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => toggleFollowCook(cook.id)}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border ${
                  cook.isFollowing
                    ? 'bg-[#ffdcc5] text-[#944a00] border-[#944a00]/30'
                    : 'bg-white border-[#dcc1b1] text-[#564337] hover:bg-[#faf9f8]'
                }`}
              >
                <Heart className={`w-4 h-4 ${cook.isFollowing ? 'fill-[#944a00]' : ''}`} />
                <span>{cook.isFollowing ? 'Following' : 'Follow Cook'}</span>
              </button>

              <a
                href={`tel:${cook.phone}`}
                className="px-4 py-2.5 bg-[#faf9f8] border border-[#dcc1b1] hover:bg-[#eeeeed] text-[#564337] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{cook.phone}</span>
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-[#eeeeed]">
            <div className="bg-[#faf9f8] p-3.5 rounded-xl border border-[#dcc1b1]/40 text-center">
              <div className="text-xs text-[#564337] font-medium">Meals Delivered</div>
              <div className="text-lg font-extrabold text-[#944a00]">{cook.mealsDelivered.toLocaleString()}+</div>
            </div>
            <div className="bg-[#faf9f8] p-3.5 rounded-xl border border-[#dcc1b1]/40 text-center">
              <div className="text-xs text-[#564337] font-medium">Followers</div>
              <div className="text-lg font-extrabold text-[#51634c]">{cook.followersCount}</div>
            </div>
            <div className="bg-[#faf9f8] p-3.5 rounded-xl border border-[#dcc1b1]/40 text-center">
              <div className="text-xs text-[#564337] font-medium">Cuisines</div>
              <div className="text-xs font-bold text-[#1a1c1c] mt-1 line-clamp-1">{cook.cuisine.join(', ')}</div>
            </div>
            <div className="bg-[#faf9f8] p-3.5 rounded-xl border border-[#dcc1b1]/40 text-center">
              <div className="text-xs text-[#564337] font-medium">Hygiene Standard</div>
              <div className="text-xs font-bold text-[#51634c] mt-1 line-clamp-1">{cook.hygieneRating}</div>
            </div>
          </div>

          {/* Bio & Specialties */}
          <div className="pt-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#564337]">About My Kitchen</h3>
              <p className="text-xs sm:text-sm text-[#1a1c1c] mt-1 leading-relaxed">{cook.bio}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#564337]">Signature Specialties</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {(cook.specialties || []).map((spec, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-[#ffdcc5]/60 text-[#944a00] text-xs font-semibold">
                    ✨ {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Live Menu Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-[#1a1c1c] flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#944a00]" />
              <span>Today's Available Menu</span>
            </h2>
            <p className="text-xs text-[#564337]">
              Cooked fresh in limited daily quantities. Once sold out, kitchen closes for that slot.
            </p>
          </div>
        </div>

        {/* Lunch & Dinner Daily Quantities Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white border border-[#dcc1b1]/60 shadow-2xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-[#1a1c1c] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#944a00]" /> Lunch Capacity (12:30 PM - 2:00 PM)
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#ffdcc5] text-[#944a00]">
                {cook.lunchAvailableQty} / {cook.lunchTotalQty} Remaining
              </span>
            </div>
            <div className="w-full bg-[#eeeeed] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#944a00] h-full rounded-full transition-all"
                style={{
                  width: `${((cook.lunchTotalQty - cook.lunchAvailableQty) / cook.lunchTotalQty) * 100}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-[#564337]">
              {cook.lunchAvailableQty > 0 ? `${cook.lunchAvailableQty} meals available for instant order` : 'Sold out for lunch today'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#dcc1b1]/60 shadow-2xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-[#1a1c1c] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#51634c]" /> Dinner Capacity (7:30 PM - 9:00 PM)
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#d1e6c9] text-[#51634c]">
                {cook.dinnerAvailableQty} / {cook.dinnerTotalQty} Remaining
              </span>
            </div>
            <div className="w-full bg-[#eeeeed] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#51634c] h-full rounded-full transition-all"
                style={{
                  width: `${((cook.dinnerTotalQty - cook.dinnerAvailableQty) / cook.dinnerTotalQty) * 100}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-[#564337]">
              {cook.dinnerAvailableQty > 0 ? `${cook.dinnerAvailableQty} meals available for pre-booking` : 'Pre-orders filled'}
            </p>
          </div>
        </div>

        {/* Available Meal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cookMeals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white rounded-2xl border border-[#dcc1b1]/60 shadow-2xs overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all"
            >
              <img
                src={meal.image}
                alt={meal.name}
                onClick={() => meal.availableQty > 0 && setSelectedMealForOrder(meal)}
                className={`w-full sm:w-44 h-44 object-cover shrink-0 ${meal.availableQty > 0 ? 'cursor-pointer' : ''}`}
              />
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-[#1a1c1c]">{meal.name}</h4>
                    <span className="font-extrabold text-sm text-[#944a00]">₹{meal.price}</span>
                  </div>
                  <p className="text-xs text-[#564337] mt-1 line-clamp-2">{meal.description}</p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {(meal.itemsIncluded || []).map((item, idx) => (
                      <span key={idx} className="text-[10px] bg-[#faf9f8] border border-[#dcc1b1]/40 px-1.5 py-0.5 rounded text-[#564337]">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#eeeeed] flex items-center justify-between">
                  <span className="text-[11px] text-[#564337]">
                    {meal.availableQty > 0 ? (
                      <span className="text-[#51634c] font-semibold">{meal.availableQty} meals ready</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Sold Out</span>
                    )}
                  </span>

                  <button
                    disabled={meal.availableQty < 1}
                    onClick={() => setSelectedMealForOrder(meal)}
                    className="px-4 py-2 bg-[#944a00] hover:bg-[#713700] disabled:bg-gray-200 disabled:text-gray-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                  >
                    {meal.availableQty > 0 ? 'Order Now' : 'Sold Out'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Menu Schedule (Monday-Sunday Chart) */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#1a1c1c] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#944a00]" />
              <span>Weekly Meal Schedule (Monday – Sunday)</span>
            </h2>
            <p className="text-xs text-[#564337]">
              Structured daily menu chart planned for full tiffin subscribers & daily orders.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#d1e6c9] text-[#51634c] self-start sm:self-auto">
            100% Rotating Recipes
          </span>
        </div>

        {/* Day Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDay === day
                  ? 'bg-[#944a00] text-white shadow-xs scale-102'
                  : 'bg-[#faf9f8] text-[#564337] hover:bg-[#eeeeed] border border-[#dcc1b1]/40'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Selected Day Structured Menu Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Lunch Schedule */}
          <div className="p-5 rounded-xl bg-[#faf9f8] border border-[#dcc1b1]/50 space-y-3">
            <div className="flex items-center justify-between border-b border-[#dcc1b1]/40 pb-2">
              <span className="font-bold text-sm text-[#944a00] flex items-center gap-1.5">
                <Utensils className="w-4 h-4" />
                {selectedDay} Lunch
              </span>
              {daySchedule.lunch.special && (
                <span className="text-[10px] font-bold bg-[#ffdcc5] text-[#944a00] px-2 py-0.5 rounded-full">
                  ★ {daySchedule.lunch.special}
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#564337]">Main Sabzi / Curry:</span>
                <span className="font-bold text-[#1a1c1c]">{daySchedule.lunch.mainDish}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#564337]">Dal / Lentil:</span>
                <span className="font-bold text-[#1a1c1c]">{daySchedule.lunch.dal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#564337]">Breads:</span>
                <span className="font-bold text-[#1a1c1c]">{daySchedule.lunch.bread}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#564337]">Rice:</span>
                <span className="font-bold text-[#1a1c1c]">{daySchedule.lunch.rice}</span>
              </div>
              <div className="pt-2 border-t border-[#dcc1b1]/30">
                <span className="text-[#564337] block mb-1">Sides & Accompaniments:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(daySchedule.lunch.sides || []).map((side, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white border border-[#dcc1b1]/40 rounded text-[11px] font-medium text-[#1a1c1c]">
                      • {side}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dinner Schedule */}
          <div className="p-5 rounded-xl bg-[#faf9f8] border border-[#dcc1b1]/50 space-y-3">
            <div className="flex items-center justify-between border-b border-[#dcc1b1]/40 pb-2">
              <span className="font-bold text-sm text-[#51634c] flex items-center gap-1.5">
                <Utensils className="w-4 h-4" />
                {selectedDay} Dinner
              </span>
              {daySchedule.dinner.special && (
                <span className="text-[10px] font-bold bg-[#d1e6c9] text-[#51634c] px-2 py-0.5 rounded-full">
                  ★ {daySchedule.dinner.special}
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#564337]">Main Sabzi / Dish:</span>
                <span className="font-bold text-[#1a1c1c]">{daySchedule.dinner.mainDish}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#564337]">Dal / Soup:</span>
                <span className="font-bold text-[#1a1c1c]">{daySchedule.dinner.dal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#564337]">Breads:</span>
                <span className="font-bold text-[#1a1c1c]">{daySchedule.dinner.bread}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#564337]">Rice / Khichdi:</span>
                <span className="font-bold text-[#1a1c1c]">{daySchedule.dinner.rice}</span>
              </div>
              <div className="pt-2 border-t border-[#dcc1b1]/30">
                <span className="text-[#564337] block mb-1">Sides & Accompaniments:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(daySchedule.dinner.sides || []).map((side, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white border border-[#dcc1b1]/40 rounded text-[11px] font-medium text-[#1a1c1c]">
                      • {side}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
