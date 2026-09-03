import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Meal } from '../../types';
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
} from 'lucide-react';

export const CustomerTodaysMeals: React.FC = () => {
  const { meals, setSelectedMealForOrder, toggleFollowCook } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Lunch' | 'Dinner'>('All');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'delivery'>('rating');

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[new Date().getDay()];

  const dietaryOptions = ['All', 'Vegetarian', 'High Protein', 'Vegan'];

  const filteredMeals = meals
    .filter((meal) => {
      const daysAvailable = meal.availableDays || days;
      const matchDay = daysAvailable.includes(currentDay);
      const matchCat =
        selectedCategory === 'All' ||
        meal.category === selectedCategory ||
        meal.category === 'Both';
      const matchDiet = selectedDietary === 'All' || meal.dietary === selectedDietary;
      return matchDay && matchCat && matchDiet;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'priceAsc') return a.price - b.price;
      return a.deliveryEstimateMin - b.deliveryEstimateMin;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#944a00]" />
            <span>Today's Fresh Homemade Meals</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Prepared fresh by neighborhood home chefs. Order early before kitchen daily capacities sell out.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-[#564337]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-[#dcc1b1] rounded-xl text-xs font-semibold text-[#1a1c1c] focus:ring-1 focus:ring-[#944a00]"
          >
            <option value="rating">Top Rated (4.8+)</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="delivery">Fastest Delivery Time</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Lunch / Dinner Tabs */}
        <div className="flex gap-1.5 p-1 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40">
          {(['All', 'Lunch', 'Dinner'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#944a00] text-white shadow-2xs'
                  : 'text-[#564337] hover:text-[#1a1c1c]'
              }`}
            >
              {cat === 'All' ? 'All Slots' : `${cat} Meals`}
            </button>
          ))}
        </div>

        {/* Dietary Tag Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold text-[#564337] mr-1">Diet:</span>
          {dietaryOptions.map((diet) => (
            <button
              key={diet}
              onClick={() => setSelectedDietary(diet)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
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

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map((meal) => (
          <div
            key={meal.id}
            className="bg-white rounded-2xl border border-[#dcc1b1]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
          >
            {/* Meal Image */}
            <div 
              className="h-48 w-full relative overflow-hidden bg-[#eeeeed] cursor-pointer"
              onClick={() => setSelectedMealForOrder(meal)}
            >
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="bg-[#d1e6c9]/95 text-[#51634c] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs backdrop-blur-xs">
                  {meal.dietary}
                </span>
                <span className="bg-white/90 text-[#1a1c1c] text-[11px] font-semibold px-2 py-1 rounded-full shadow-2xs">
                  {meal.category}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollowCook(meal.cookId);
                }}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full text-[#564337] hover:text-[#944a00] transition-colors shadow-2xs"
                title="Favorite Cook"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-base text-[#1a1c1c] line-clamp-1 group-hover:text-[#944a00] transition-colors">
                    {meal.name}
                  </h3>
                  <span className="font-extrabold text-base text-[#944a00]">₹{meal.price}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#564337]">
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
                  <span>{meal.deliveryEstimateMin} mins ETA</span>
                </div>

                <p className="text-xs text-[#564337] line-clamp-2 leading-relaxed">
                  {meal.description}
                </p>

                {/* Items included pill list */}
                <div className="pt-2 flex flex-wrap gap-1">
                  {meal.itemsIncluded.slice(0, 3).map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-[#faf9f8] border border-[#dcc1b1]/40 px-2 py-0.5 rounded text-[#564337]"
                    >
                      • {item}
                    </span>
                  ))}
                  {meal.itemsIncluded.length > 3 && (
                    <span className="text-[10px] text-[#944a00] font-semibold">
                      +{meal.itemsIncluded.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-[#eeeeed] flex items-center justify-between">
                <div className="text-[11px]">
                  {meal.availableQty > 0 ? (
                    <span className="text-[#51634c] font-bold">
                      ● {meal.availableQty} ready
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold">● Kitchen Sold Out</span>
                  )}
                </div>

                <button
                  disabled={meal.availableQty < 1}
                  onClick={() => setSelectedMealForOrder(meal)}
                  className="px-4 py-2 bg-[#944a00] hover:bg-[#713700] disabled:bg-gray-200 disabled:text-gray-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95"
                >
                  {meal.availableQty > 0 ? 'Order Meal' : 'Sold Out'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
