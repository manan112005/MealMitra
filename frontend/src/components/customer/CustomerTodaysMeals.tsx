import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Meal, CookProfile } from '../../types';
import {
  Utensils,
  Filter,
  Star,
  User,
  Heart,
  Clock,
  Sparkles,
  Flame,
  CheckCircle,
  Calendar,
  Sun,
  Moon,
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const CustomerTodaysMeals: React.FC = () => {
  const {
    meals,
    cooks,
    currentCookProfile,
    setSelectedMealForOrder,
    toggleFollowCook,
    setSelectedCookId,
    setCustomerTab,
  } = useApp();

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = daysOfWeek[new Date().getDay()];
  const tomorrowDayName = daysOfWeek[(new Date().getDay() + 1) % 7];

  const [selectedDay, setSelectedDay] = useState<string>(todayDayName);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Lunch' | 'Dinner'>('All');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'delivery'>('rating');

  const dietaryOptions = ['All', 'Vegetarian', 'High Protein', 'Vegan', 'Kathiyawadi / Jain'];

  // Build a comprehensive pool of discoverable meals from registered cooks & weeklyMenu + standalone meals
  const allDiscoverableMeals = useMemo(() => {
    const list: Meal[] = [];
    const activeCooksList: CookProfile[] =
      cooks && cooks.length > 0 ? cooks : [currentCookProfile];

    activeCooksList.forEach((cook) => {
      if (cook.weeklyMenu && Array.isArray(cook.weeklyMenu)) {
        cook.weeklyMenu.forEach((daySchedule) => {
          const dayName = daySchedule.day;

          // 1. Lunch Meal
          if (daySchedule.lunch) {
            const l = daySchedule.lunch;
            const items = [
              l.mainDish,
              l.dal,
              l.bread,
              l.rice,
              ...(Array.isArray(l.sides) ? l.sides : []),
            ].filter(Boolean);

            list.push({
              id: `meal-${cook.id}-${dayName}-lunch`,
              cookId: cook.id,
              cookName: cook.name,
              cookAvatar: cook.avatar,
              name: l.mealTitle || `${dayName} Homestyle Lunch Thali`,
              description: `${l.mainDish || 'Special Sabzi'}, ${l.dal || 'Dal Tadka'}, ${l.bread || 'Phulkas'}, ${l.rice || 'Steamed Rice'} with ${Array.isArray(l.sides) ? l.sides.join(', ') : 'fresh sides'}`,
              price: l.price || 180,
              image:
                l.image ||
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
              category: 'Lunch',
              dietary: (l.dietary as any) || 'Vegetarian',
              availableQty: cook.lunchAvailableQty !== undefined ? cook.lunchAvailableQty : 25,
              totalQty: cook.lunchTotalQty || 25,
              rating: cook.rating || 4.9,
              reviewsCount: cook.reviewsCount || 120,
              calories: 520,
              distanceKm: cook.distanceKm || 1.2,
              deliveryEstimateMin: 25,
              itemsIncluded: items.length > 0 ? items : ['Homestyle Sabzi', 'Dal Tadka', '4 Phulkas', 'Jeera Rice', 'Salad & Papad'],
              availableDays: [dayName],
              isSpecial: dayName === 'Sunday' || dayName === 'Saturday',
            });
          }

          // 2. Dinner Meal
          if (daySchedule.dinner) {
            const d = daySchedule.dinner;
            const items = [
              d.mainDish,
              d.dal,
              d.bread,
              d.rice,
              ...(Array.isArray(d.sides) ? d.sides : []),
            ].filter(Boolean);

            list.push({
              id: `meal-${cook.id}-${dayName}-dinner`,
              cookId: cook.id,
              cookName: cook.name,
              cookAvatar: cook.avatar,
              name: d.mealTitle || `${dayName} Homestyle Dinner Thali`,
              description: `${d.mainDish || 'Special Sabzi'}, ${d.dal || 'Kadhi / Dal'}, ${d.bread || 'Rotis'}, ${d.rice || 'Khichdi'} with ${Array.isArray(d.sides) ? d.sides.join(', ') : 'fresh sides'}`,
              price: d.price || 160,
              image:
                d.image ||
                'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80',
              category: 'Dinner',
              dietary: (d.dietary as any) || 'Vegetarian',
              availableQty: cook.dinnerAvailableQty !== undefined ? cook.dinnerAvailableQty : 20,
              totalQty: cook.dinnerTotalQty || 20,
              rating: cook.rating || 4.9,
              reviewsCount: cook.reviewsCount || 120,
              calories: 480,
              distanceKm: cook.distanceKm || 1.2,
              deliveryEstimateMin: 30,
              itemsIncluded: items.length > 0 ? items : ['Comfort Sabzi', 'Gujarati Kadhi', '3 Soft Rotis', 'Vaghareli Khichdi', 'Chaas'],
              availableDays: [dayName],
              isSpecial: false,
            });
          }
        });
      }
    });

    // Merge any custom meals added directly
    if (meals && meals.length > 0) {
      meals.forEach((m) => {
        if (!list.some((existing) => existing.id === m.id)) {
          list.push(m);
        }
      });
    }

    return list;
  }, [cooks, currentCookProfile, meals]);

  // Filtered Meals based on Day selection, Category/Slot, and Dietary preferences
  const filteredMeals = useMemo(() => {
    return allDiscoverableMeals
      .filter((meal) => {
        // Day filter
        const daysAvailable = meal.availableDays || daysOfWeek;
        const matchDay =
          selectedDay === 'All' ||
          daysAvailable.includes(selectedDay) ||
          daysAvailable.includes(todayDayName);

        // Category / Slot filter
        const matchCat =
          selectedCategory === 'All' ||
          meal.category === selectedCategory ||
          meal.category === 'Both';

        // Dietary filter
        const matchDiet =
          selectedDietary === 'All' ||
          meal.dietary === selectedDietary ||
          (selectedDietary === 'Kathiyawadi / Jain' &&
            (meal.name.includes('Kathiyawadi') || meal.dietary === 'Jain' || meal.dietary === 'Vegetarian'));

        return matchDay && matchCat && matchDiet;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'priceAsc') return a.price - b.price;
        return a.deliveryEstimateMin - b.deliveryEstimateMin;
      });
  }, [allDiscoverableMeals, selectedDay, selectedCategory, selectedDietary, sortBy, todayDayName]);

  const scheduleDays = [
    { label: `Today (${todayDayName})`, value: todayDayName, isToday: true },
    { label: `Tomorrow (${tomorrowDayName})`, value: tomorrowDayName, isTomorrow: true },
    { label: 'Sunday', value: 'Sunday' },
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'All Days', value: 'All' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#944a00]" />
            <span>Discover Day-wise Tiffins & Daily Menus</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Explore live homestyle lunch & dinner menus by neighborhood home chefs. Pick any day or slot and reserve your tiffin directly.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-[#564337]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-[#dcc1b1] rounded-xl text-xs font-semibold text-[#1a1c1c] focus:ring-1 focus:ring-[#944a00] shadow-2xs"
          >
            <option value="rating">Top Rated (4.8+)</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="delivery">Fastest Delivery Time</option>
          </select>
        </div>
      </div>

      {/* 1. Day Selector Bar (Horizontal Scrollable Tabs) */}
      <div className="bg-white p-3 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-bold text-[#1a1c1c] flex items-center gap-1.5 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-[#944a00]" />
            <span>Select Day Schedule:</span>
          </div>
          <span className="text-[11px] text-[#564337]">
            Currently Viewing:{' '}
            <strong className="text-[#944a00]">
              {selectedDay === 'All' ? 'Full Weekly Menu' : selectedDay}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {scheduleDays.map((item) => {
            const isSelected = selectedDay === item.value;
            return (
              <button
                key={item.value}
                onClick={() => setSelectedDay(item.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#944a00] text-white shadow-xs'
                    : 'bg-[#faf9f8] text-[#564337] hover:bg-[#ffdcc5]/40 border border-[#dcc1b1]/50'
                }`}
              >
                {item.isToday && (
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500 animate-pulse'}`} />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Slot & Dietary Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Lunch / Dinner Tabs */}
        <div className="flex gap-1.5 p-1 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#944a00] text-white shadow-2xs'
                : 'text-[#564337] hover:text-[#1a1c1c]'
            }`}
          >
            All Slots
          </button>
          <button
            onClick={() => setSelectedCategory('Lunch')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'Lunch'
                ? 'bg-[#944a00] text-white shadow-2xs'
                : 'text-[#564337] hover:text-[#1a1c1c]'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Lunch Slot (12:30–2:00 PM)</span>
          </button>
          <button
            onClick={() => setSelectedCategory('Dinner')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'Dinner'
                ? 'bg-[#944a00] text-white shadow-2xs'
                : 'text-[#564337] hover:text-[#1a1c1c]'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Dinner Slot (7:30–9:00 PM)</span>
          </button>
        </div>

        {/* Dietary Tag Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold text-[#564337] mr-1">Diet:</span>
          {dietaryOptions.map((diet) => (
            <button
              key={diet}
              onClick={() => setSelectedDietary(diet)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                selectedDietary === diet
                  ? 'bg-[#51634c] text-white'
                  : 'bg-[#faf9f8] text-[#564337] hover:bg-[#eeeeed] border border-[#dcc1b1]/40'
              }`}
            >
              {diet}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Meals Grid */}
      {filteredMeals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-12 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-[#ffdcc5]/50 flex items-center justify-center mx-auto text-[#944a00]">
            <Utensils className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-[#1a1c1c]">No meals matching this day or filter</h3>
            <p className="text-xs text-[#564337] max-w-md mx-auto">
              Home chefs are currently updating their schedule for this filter. Try selecting 'All Slots' or another day.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedDay(todayDayName);
              setSelectedCategory('All');
              setSelectedDietary('All');
            }}
            className="px-5 py-2.5 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Flame className="w-4 h-4" />
            <span>Show Today's Available Meals</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => {
            const cook = cooks.find((c) => c.id === meal.cookId) || currentCookProfile;
            const isSoldOut = meal.availableQty <= 0;

            return (
              <div
                key={meal.id}
                className="bg-white rounded-2xl border border-[#dcc1b1]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
              >
                {/* Meal Image & Badges */}
                <div
                  className="h-48 w-full relative overflow-hidden bg-[#eeeeed] cursor-pointer"
                  onClick={() => setSelectedMealForOrder(meal)}
                >
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-[#d1e6c9]/95 text-[#51634c] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs backdrop-blur-xs">
                      {meal.dietary}
                    </span>
                    <span className="bg-white/95 text-[#1a1c1c] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1">
                      {meal.category === 'Lunch' ? (
                        <Sun className="w-3 h-3 text-amber-500" />
                      ) : (
                        <Moon className="w-3 h-3 text-indigo-500" />
                      )}
                      <span>{meal.category} Slot</span>
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollowCook(meal.cookId);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full text-[#564337] hover:text-[#944a00] transition-colors shadow-2xs cursor-pointer"
                    title="Favorite Cook"
                  >
                    <Heart
                      className={`w-4 h-4 ${cook?.isFollowing ? 'fill-[#944a00] text-[#944a00]' : ''}`}
                    />
                  </button>

                  <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    🗓️ {meal.availableDays?.[0] || selectedDay} Schedule
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3
                        onClick={() => setSelectedMealForOrder(meal)}
                        className="font-bold text-base text-[#1a1c1c] line-clamp-1 group-hover:text-[#944a00] transition-colors cursor-pointer"
                      >
                        {meal.name}
                      </h3>
                      <span className="font-extrabold text-base text-[#944a00]">₹{meal.price}</span>
                    </div>

                    {/* Cook Info */}
                    <div className="flex items-center justify-between text-xs text-[#564337] pt-0.5">
                      <div
                        onClick={() => {
                          if (cook) {
                            setSelectedCookId(cook.id);
                            setCustomerTab('discover');
                          }
                        }}
                        className="flex items-center gap-1.5 font-medium hover:text-[#944a00] cursor-pointer"
                      >
                        <img
                          src={cook?.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&auto=format&fit=crop&q=80'}
                          alt={meal.cookName}
                          className="w-5 h-5 rounded-full object-cover border border-[#dcc1b1]"
                        />
                        <span className="font-bold">{meal.cookName}</span>
                        {cook?.chefName && (
                          <span className="text-[10px] text-[#564337]/80">({cook.chefName})</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 font-bold text-[#944a00]">
                        <Star className="w-3.5 h-3.5 fill-[#e67e22] text-[#e67e22]" />
                        <span>{meal.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#564337] line-clamp-2 leading-relaxed">
                      {meal.description}
                    </p>

                    {/* Included Thali Items Pill Box */}
                    <div className="pt-2">
                      <div className="text-[10px] font-bold text-[#564337] uppercase tracking-wider mb-1">
                        Thali Components:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {meal.itemsIncluded.slice(0, 4).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#faf9f8] border border-[#dcc1b1]/50 px-2 py-0.5 rounded-md text-[#564337] font-medium"
                          >
                            ✓ {item}
                          </span>
                        ))}
                        {meal.itemsIncluded.length > 4 && (
                          <span className="text-[10px] text-[#944a00] font-semibold self-center">
                            +{meal.itemsIncluded.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-[#eeeeed] flex items-center justify-between gap-2">
                    <div className="text-[11px]">
                      {!isSoldOut ? (
                        <span className="text-[#51634c] font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span>{meal.availableQty} slots left</span>
                        </span>
                      ) : (
                        <span className="text-red-700 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          <span>Slot Sold Out</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedMealForOrder(meal)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                        !isSoldOut
                          ? 'bg-[#944a00] hover:bg-[#713700] text-white'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                      }`}
                    >
                      <span>
                        {!isSoldOut
                          ? `Reserve ${meal.category} Slot • ₹${meal.price}`
                          : 'Join Waitlist'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
