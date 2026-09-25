import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
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
  MessageSquare,
  ThumbsUp,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  cookId: string;
  onBack: () => void;
}

export const CustomerCookProfile: React.FC<Props> = ({ cookId, onBack }) => {
  const { cooks, meals, reviews, addReview, toggleFollowCook, setSelectedMealForOrder } = useApp();
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [selectedMealName, setSelectedMealName] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const safeCooks = cooks || [];
  const cook = safeCooks.find((c) => c.id === cookId) || safeCooks[0] || (MOCK_COOKS && MOCK_COOKS[0]);
  const cookMeals = (meals || []).filter((m) => cook && m.cookId === cook.id);

  const chefReviews = (reviews || []).filter((r) => cook && r.cookId === cook.id);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !cook) return;
    addReview({
      customerName: user?.name || 'MANAN PATEL',
      customerAvatar: user?.avatar || '',
      cookId: cook.id,
      cookName: cook.name,
      mealName: selectedMealName || cookMeals[0]?.name || 'Homestyle Tiffin Meal',
      dishName: selectedMealName || cookMeals[0]?.name || 'Homestyle Tiffin Meal',
      rating: newRating,
      comment: newComment.trim(),
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowReviewForm(false);
      setNewComment('');
      setNewRating(5);
    }, 1500);
  };

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
                <div className="text-xs font-bold text-[#944a00]">
                  Chef: {cook.chefName || 'Home Cook'}
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
              {cook.lunchAvailableQty > 0 ? `${cook.lunchAvailableQty} tiffin slots remaining (Cutoff: ${cook.lunchCutoffTime || '10:30 AM'})` : 'Lunch slots fully booked today'}
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
              {cook.dinnerAvailableQty > 0 ? `${cook.dinnerAvailableQty} tiffin slots remaining (Cutoff: ${cook.dinnerCutoffTime || '05:30 PM'})` : 'Dinner slots fully booked today'}
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
                onClick={() => setSelectedMealForOrder(meal)}
                className="w-full sm:w-44 h-44 object-cover shrink-0 cursor-pointer"
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
                      <span className="text-[#51634c] font-semibold">{meal.availableQty} slots ready</span>
                    ) : (
                      <span className="text-amber-800 font-semibold">Capacity Full</span>
                    )}
                  </span>

                  <button
                    onClick={() => setSelectedMealForOrder(meal)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
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

        {/* Selected Day Structured Meal Cards (2-column layout matching ref image 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

          {/* ── LUNCH CARD ── */}
          <div className="rounded-2xl border border-[#dcc1b1]/60 bg-[#faf9f8] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
            {/* Lunch image (if available) */}
            {daySchedule.lunch.image && (
              <div className="h-40 w-full overflow-hidden relative">
                <img src={daySchedule.lunch.image} alt={`${selectedDay} Lunch`} className="w-full h-full object-cover" />
                {daySchedule.lunch.price && (
                  <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#944a00] font-extrabold text-sm px-3 py-1 rounded-xl shadow-xs">
                    ₹{daySchedule.lunch.price}
                  </span>
                )}
              </div>
            )}

            <div className="p-5 space-y-3.5 flex-1 flex flex-col">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#dcc1b1]/40 pb-3">
                <span className="font-extrabold text-sm text-[#944a00] flex items-center gap-1.5">
                  <Utensils className="w-4 h-4" />
                  <span>{selectedDay} Lunch</span>
                </span>
                {(daySchedule.lunch.recipeTag || daySchedule.lunch.special) && (
                  <span className="text-[10px] font-bold bg-[#ffdcc5] text-[#944a00] px-2.5 py-1 rounded-full shadow-2xs">
                    ★ {daySchedule.lunch.recipeTag || daySchedule.lunch.special}
                  </span>
                )}
              </div>

              {/* Meal Title + meta */}
              {daySchedule.lunch.mealTitle && (
                <div className="flex items-center justify-between bg-white/80 px-3 py-2.5 rounded-xl border border-[#dcc1b1]/40">
                  <div>
                    <h4 className="font-bold text-sm text-[#1a1c1c]">{daySchedule.lunch.mealTitle}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] mt-0.5">
                      {daySchedule.lunch.dietary && (
                        <span className="bg-[#d1e6c9]/50 text-[#51634c] px-2 py-0.5 rounded font-semibold border border-[#d1e6c9]">
                          {daySchedule.lunch.dietary}
                        </span>
                      )}
                      {daySchedule.lunch.timeSlot && (
                        <span className="flex items-center gap-1 text-[#564337] font-medium">
                          <Clock className="w-3 h-3 text-[#944a00]" />
                          {daySchedule.lunch.timeSlot}
                        </span>
                      )}
                    </div>
                  </div>
                  {!daySchedule.lunch.image && daySchedule.lunch.price && (
                    <span className="font-extrabold text-[#944a00] text-base">
                      ₹{daySchedule.lunch.price}
                    </span>
                  )}
                </div>
              )}

              {/* Structured components */}
              <div className="space-y-2.5 text-xs flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#564337] font-medium">Main Sabzi / Curry:</span>
                  <span className="font-bold text-[#1a1c1c] text-right max-w-[60%]">{daySchedule.lunch.mainDish}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#564337] font-medium">Dal / Lentil:</span>
                  <span className="font-bold text-[#1a1c1c] text-right max-w-[60%]">{daySchedule.lunch.dal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#564337] font-medium">Breads:</span>
                  <span className="font-bold text-[#1a1c1c] text-right max-w-[60%]">{daySchedule.lunch.bread}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#564337] font-medium">Rice:</span>
                  <span className="font-bold text-[#1a1c1c] text-right max-w-[60%]">{daySchedule.lunch.rice}</span>
                </div>

                {/* Sides Chips */}
                <div className="pt-2.5 border-t border-[#dcc1b1]/40">
                  <span className="text-[#564337] font-medium block mb-2">Sides & Accompaniments:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(daySchedule.lunch.sides || []).map((side, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-[#dcc1b1]/60 rounded-lg text-[11px] font-medium text-[#1a1c1c] shadow-2xs">
                        • {side}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order CTA */}
              {cookMeals.some(m => m.category === 'Lunch' || m.category === 'Both') && (
                <button
                  onClick={() => {
                    const lunchMeal = cookMeals.find(m => m.category === 'Lunch' || m.category === 'Both');
                    if (lunchMeal) setSelectedMealForOrder(lunchMeal);
                  }}
                  className="w-full mt-3 py-2.5 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add Lunch to Cart</span>
                </button>
              )}
            </div>
          </div>

          {/* ── DINNER CARD ── */}
          <div className="rounded-2xl border border-[#dcc1b1]/60 bg-[#faf9f8] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
            {/* Dinner image (if available) */}
            {daySchedule.dinner.image && (
              <div className="h-40 w-full overflow-hidden relative">
                <img src={daySchedule.dinner.image} alt={`${selectedDay} Dinner`} className="w-full h-full object-cover" />
                {daySchedule.dinner.price && (
                  <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#51634c] font-extrabold text-sm px-3 py-1 rounded-xl shadow-xs">
                    ₹{daySchedule.dinner.price}
                  </span>
                )}
              </div>
            )}

            <div className="p-5 space-y-3.5 flex-1 flex flex-col">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#dcc1b1]/40 pb-3">
                <span className="font-extrabold text-sm text-[#51634c] flex items-center gap-1.5">
                  <Utensils className="w-4 h-4" />
                  <span>{selectedDay} Dinner</span>
                </span>
                {(daySchedule.dinner.recipeTag || daySchedule.dinner.special) && (
                  <span className="text-[10px] font-bold bg-[#d1e6c9] text-[#51634c] px-2.5 py-1 rounded-full shadow-2xs">
                    ★ {daySchedule.dinner.recipeTag || daySchedule.dinner.special}
                  </span>
                )}
              </div>

              {/* Meal Title + meta */}
              {daySchedule.dinner.mealTitle && (
                <div className="flex items-center justify-between bg-white/80 px-3 py-2.5 rounded-xl border border-[#dcc1b1]/40">
                  <div>
                    <h4 className="font-bold text-sm text-[#1a1c1c]">{daySchedule.dinner.mealTitle}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] mt-0.5">
                      {daySchedule.dinner.dietary && (
                        <span className="bg-[#d1e6c9]/50 text-[#51634c] px-2 py-0.5 rounded font-semibold border border-[#d1e6c9]">
                          {daySchedule.dinner.dietary}
                        </span>
                      )}
                      {daySchedule.dinner.timeSlot && (
                        <span className="flex items-center gap-1 text-[#564337] font-medium">
                          <Clock className="w-3 h-3 text-[#51634c]" />
                          {daySchedule.dinner.timeSlot}
                        </span>
                      )}
                    </div>
                  </div>
                  {!daySchedule.dinner.image && daySchedule.dinner.price && (
                    <span className="font-extrabold text-[#51634c] text-base">
                      ₹{daySchedule.dinner.price}
                    </span>
                  )}
                </div>
              )}

              {/* Structured components */}
              <div className="space-y-2.5 text-xs flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#564337] font-medium">Main Sabzi / Dish:</span>
                  <span className="font-bold text-[#1a1c1c] text-right max-w-[60%]">{daySchedule.dinner.mainDish}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#564337] font-medium">Dal / Soup:</span>
                  <span className="font-bold text-[#1a1c1c] text-right max-w-[60%]">{daySchedule.dinner.dal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#564337] font-medium">Breads:</span>
                  <span className="font-bold text-[#1a1c1c] text-right max-w-[60%]">{daySchedule.dinner.bread}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#564337] font-medium">Rice / Khichdi:</span>
                  <span className="font-bold text-[#1a1c1c] text-right max-w-[60%]">{daySchedule.dinner.rice}</span>
                </div>

                {/* Sides Chips */}
                <div className="pt-2.5 border-t border-[#dcc1b1]/40">
                  <span className="text-[#564337] font-medium block mb-2">Sides & Accompaniments:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(daySchedule.dinner.sides || []).map((side, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-[#dcc1b1]/60 rounded-lg text-[11px] font-medium text-[#1a1c1c] shadow-2xs">
                        • {side}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order CTA */}
              {cookMeals.some(m => m.category === 'Dinner' || m.category === 'Both') && (
                <button
                  onClick={() => {
                    const dinnerMeal = cookMeals.find(m => m.category === 'Dinner' || m.category === 'Both');
                    if (dinnerMeal) setSelectedMealForOrder(dinnerMeal);
                  }}
                  className="w-full mt-3 py-2.5 bg-[#51634c] hover:bg-[#3d4b39] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add Dinner to Cart</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 sm:p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        {/* Section Title & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eeeeed] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1a1c1c] flex items-center gap-2">
                <Star className="w-5 h-5 fill-[#e67e22] text-[#e67e22]" />
                Customer Ratings & Reviews
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fceddf] text-[#944a00] font-bold text-xs">
                {cook.rating} ★ ({cook.reviewsCount || chefReviews.length} total)
              </span>
            </div>
            <p className="text-xs text-[#564337]">
              Verified neighbor ratings and feedback for {cook.name}'s home kitchen.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#944a00] text-white text-xs font-bold hover:bg-[#7a3c00] transition-colors shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{showReviewForm ? 'Close Review Form' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Aspect Sentiment Breakdown (Academic Reference: Doc 2 p.6 & p.8) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#faf9f8] p-4 rounded-xl border border-[#dcc1b1]/40">
          <div className="text-center p-2 rounded-lg bg-white border border-[#dcc1b1]/30">
            <div className="text-[11px] font-semibold text-[#564337] uppercase tracking-wider">Taste & Flavor</div>
            <div className="text-base font-extrabold text-[#944a00] mt-0.5">{cook.aspectRatings?.flavor || 4.9} / 5.0</div>
            <div className="text-[10px] text-[#51634c] font-medium mt-0.5">98% positive</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white border border-[#dcc1b1]/30">
            <div className="text-[11px] font-semibold text-[#564337] uppercase tracking-wider">Spiciness Balance</div>
            <div className="text-base font-extrabold text-[#944a00] mt-0.5">{cook.aspectRatings?.spiciness || 4.8} / 5.0</div>
            <div className="text-[10px] text-[#51634c] font-medium mt-0.5">Authentic ghar ka</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white border border-[#dcc1b1]/30">
            <div className="text-[11px] font-semibold text-[#564337] uppercase tracking-wider">Portion Size</div>
            <div className="text-base font-extrabold text-[#944a00] mt-0.5">{cook.aspectRatings?.portion || 4.9} / 5.0</div>
            <div className="text-[10px] text-[#51634c] font-medium mt-0.5">Generous thali</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white border border-[#dcc1b1]/30">
            <div className="text-[11px] font-semibold text-[#564337] uppercase tracking-wider">Hygiene & Quality</div>
            <div className="text-base font-extrabold text-[#944a00] mt-0.5">{cook.aspectRatings?.punctuality || 5.0} / 5.0</div>
            <div className="text-[10px] text-[#51634c] font-medium mt-0.5">FSSAI compliant</div>
          </div>
        </div>

        {/* Review Form Drawer */}
        {showReviewForm && (
          <form
            onSubmit={handleAddReview}
            className="p-5 rounded-2xl bg-[#faf9f8] border-2 border-[#944a00]/30 space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between border-b border-[#dcc1b1]/40 pb-3">
              <h3 className="text-sm font-bold text-[#1a1c1c] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#944a00]" />
                Share Your Tiffin Experience with {cook.name}
              </h3>
              <span className="text-[11px] text-[#564337]">Verified Customer Review</span>
            </div>

            {reviewSubmitted ? (
              <div className="p-4 rounded-xl bg-[#d1e6c9]/40 border border-[#51634c]/30 flex items-center gap-3 text-xs font-bold text-[#51634c]">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Thank you! Your verified tiffin review has been posted.</span>
              </div>
            ) : (
              <>
                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                    Your Rating:
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newRating
                                ? 'fill-[#e67e22] text-[#e67e22]'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#944a00] ml-2">
                      {newRating === 5 && '5/5 — Outstanding Ghar Ka Khana!'}
                      {newRating === 4 && '4/5 — Very Tasty & Fresh'}
                      {newRating === 3 && '3/5 — Decent & Homestyle'}
                      {newRating === 2 && '2/5 — Needs Improvement'}
                      {newRating === 1 && '1/5 — Disappointing'}
                    </span>
                  </div>
                </div>

                {/* Meal Select */}
                {cookMeals.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                      Which meal did you reserve / enjoy?
                    </label>
                    <select
                      value={selectedMealName || cookMeals[0]?.name}
                      onChange={(e) => setSelectedMealName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#dcc1b1] bg-white text-[#1a1c1c] focus:outline-none focus:border-[#944a00]"
                    >
                      {cookMeals.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.mealPeriod} • ₹{m.price})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Comments */}
                <div>
                  <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                    Your Honest Feedback:
                  </label>
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tell your neighbors how the roti was, the dal flavor, spice level, or packaging cleanliness..."
                    className="w-full text-xs p-3 rounded-xl border border-[#dcc1b1] bg-white text-[#1a1c1c] focus:outline-none focus:border-[#944a00] resize-none"
                    required
                  />
                </div>

                {/* Submit & Cancel */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 rounded-xl border border-[#dcc1b1] text-xs font-semibold text-[#564337] hover:bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#944a00] text-white text-xs font-bold hover:bg-[#7a3c00] transition-colors cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#564337]">
            Neighbor Reviews & Verified Tiffin Feedback ({chefReviews.length})
          </h3>

          {chefReviews.length === 0 ? (
            <div className="p-8 text-center bg-[#faf9f8] rounded-2xl border border-dashed border-[#dcc1b1] space-y-2">
              <MessageSquare className="w-8 h-8 text-[#dcc1b1] mx-auto" />
              <div className="text-xs font-bold text-[#1a1c1c]">No reviews yet for {cook.name}</div>
              <p className="text-[11px] text-[#564337] max-w-sm mx-auto">
                Be the first neighbor to reserve a tiffin slot and share your thoughts on the home-cooked flavors!
              </p>
              <button
                onClick={() => setShowReviewForm(true)}
                className="mt-2 text-xs font-bold text-[#944a00] hover:underline"
              >
                + Write the First Review
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chefReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#faf9f8] rounded-2xl border border-[#dcc1b1]/50 p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                          alt={rev.customerName}
                          className="w-10 h-10 rounded-full object-cover border border-[#dcc1b1]"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-xs text-[#1a1c1c]">{rev.customerName}</h4>
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-[#d1e6c9] text-[#51634c] px-1.5 py-0.5 rounded-full">
                              <ShieldCheck className="w-2.5 h-2.5" /> Verified
                            </span>
                          </div>
                          <div className="text-[10px] text-[#564337]">{rev.date}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 bg-white px-2 py-1 rounded-lg border border-[#dcc1b1]/40">
                        <Star className="w-3.5 h-3.5 fill-[#e67e22] text-[#e67e22]" />
                        <span className="text-xs font-extrabold text-[#1a1c1c] ml-1">{rev.rating}.0</span>
                      </div>
                    </div>

                    <div className="text-xs text-[#1a1c1c] leading-relaxed bg-white p-3 rounded-xl border border-[#dcc1b1]/30">
                      "{rev.comment}"
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#dcc1b1]/30 text-[10px] text-[#564337]">
                    <span className="font-semibold text-[#944a00] truncate max-w-[200px]">
                      🍱 {rev.mealName || rev.dishName || 'Homestyle Tiffin'}
                    </span>
                    <span className="flex items-center gap-1 text-[#564337]">
                      <ThumbsUp className="w-3 h-3" /> {rev.likes || 0} found helpful
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
