import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MealSlotItem } from '../../types';
import {
  Utensils,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  CheckCircle,
  X,
  Clock,
  IndianRupee,
  Calendar,
  Sparkles,
  ChefHat,
  LayoutGrid,
  Columns,
  Check,
  AlertCircle,
  ShieldCheck,
  Flame,
  ArrowLeft,
} from 'lucide-react';


const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

const RECIPE_STYLE_PRESETS = [
  'Traditional Gujarati Recipe',
  'North Indian',
  'South Indian',
  'Jain Special',
  'Healthy & Low Calorie',
  'High Protein',
  'Kathiyawadi Homestyle',
  'Custom',
];

const SUGGESTED_SIDES = [
  'Roasted Papad',
  'Cucumber Kachumber',
  'Fresh Chaas',
  'Bhindi Masala',
  'Spiced Curd',
  'Green Salad',
  'Garlic Chutney',
  'Sweet Gulab Jamun',
  'Mango Pickle',
  'Boondi Raita',
];

const COMMON_BREAD_TYPES = [
  'Phulka Rotis',
  'Multigrain Rotis',
  'Whole Wheat Chapattis',
  'Laccha Parathas',
  'Bajra Rotlas',
  'Missi Rotis',
  'Butter Naan',
];

export const CookWeeklyMenu: React.FC = () => {
  const {
    currentCookProfile,
    updateCookWeeklyMenuSlot,
    removeCookWeeklyMealSlot,
    autofillCookWeeklyMenu,
  } = useApp();

  const [selectedDayTab, setSelectedDayTab] = useState<string>('Monday');
  const [viewMode, setViewMode] = useState<'day' | 'overview'>('day');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Form fields
  const [targetSlotDay, setTargetSlotDay] = useState<string>('Monday');
  const [mealType, setMealType] = useState<'lunch' | 'dinner'>('lunch');
  const [mealTitle, setMealTitle] = useState('');
  const [recipeTag, setRecipeTag] = useState('Traditional Gujarati Recipe');
  const [customTag, setCustomTag] = useState('');
  const [isCustomTag, setIsCustomTag] = useState(false);

  // Components
  const [mainDish, setMainDish] = useState('');
  const [dal, setDal] = useState('');
  const [breadQty, setBreadQty] = useState<number>(4);
  const [breadType, setBreadType] = useState<string>('Phulka Rotis');
  const [breadGhee, setBreadGhee] = useState<boolean>(true);
  const [rice, setRice] = useState('');
  const [sides, setSides] = useState<string[]>([]);
  const [sideInput, setSideInput] = useState('');

  // Image & Order info
  const [imagePreview, setImagePreview] = useState<string>('');
  const [price, setPrice] = useState<number>(180);
  const [dietary, setDietary] = useState<
    'Vegetarian' | 'High Protein' | 'Vegan' | 'Jain' | 'Gluten-Free' | 'Non-Veg'
  >('Vegetarian');
  const [timeSlot, setTimeSlot] = useState<string>('12:30 PM - 2:00 PM');
  const [maxOrders, setMaxOrders] = useState<number>(20);
  const [availableFor, setAvailableFor] = useState<
    'Daily orders' | 'Tiffin subscribers' | 'Both'
  >('Both');
  const [assignedDays, setAssignedDays] = useState<string[]>(['Monday']);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Find schedule for selected day from current cook profile
  const weeklyMenu = currentCookProfile.weeklyMenu || [];
  const currentDaySchedule =
    weeklyMenu.find((item) => item.day === selectedDayTab) || {
      day: selectedDayTab as any,
      lunch: {
        mainDish: '',
        dal: '',
        bread: '',
        rice: '',
        sides: [],
      },
      dinner: {
        mainDish: '',
        dal: '',
        bread: '',
        rice: '',
        sides: [],
      },
    };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setImagePreview(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDaySelection = (day: string) => {
    setAssignedDays((prev) =>
      prev.includes(day)
        ? prev.length > 1
          ? prev.filter((d) => d !== day)
          : prev
        : [...prev, day]
    );
  };

  const handleAddSide = (itemToAdd?: string) => {
    const text = (itemToAdd || sideInput).trim();
    if (!text) return;
    if (!sides.includes(text)) {
      setSides([...sides, text]);
    }
    setSideInput('');
  };

  const handleRemoveSide = (indexToRemove: number) => {
    setSides(sides.filter((_, idx) => idx !== indexToRemove));
  };

  const handleOpenAddModal = (
    initialMealType: 'lunch' | 'dinner' = 'lunch',
    day: string = selectedDayTab
  ) => {
    setModalMode('add');
    setTargetSlotDay(day);
    setMealType(initialMealType);
    setAssignedDays([day]);

    // Sensible smart defaults
    if (initialMealType === 'lunch') {
      setMealTitle(`${day} Homestyle Lunch`);
      setRecipeTag('Traditional Gujarati Recipe');
      setIsCustomTag(false);
      setCustomTag('');
      setMainDish('Panchmel Dal Tadka');
      setDal('Yellow Moong Dal');
      setBreadQty(4);
      setBreadType('Phulka Rotis');
      setBreadGhee(true);
      setRice('Steamed Basmati Rice');
      setSides(['Roasted Papad', 'Cucumber Kachumber', 'Fresh Chaas']);
      setPrice(180);
      setTimeSlot('12:30 PM - 2:00 PM');
      setImagePreview(
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
      );
    } else {
      setMealTitle(`${day} Light Homestyle Dinner`);
      setRecipeTag('North Indian');
      setIsCustomTag(false);
      setCustomTag('');
      setMainDish('Aloo Gobhi Adraki');
      setDal('Dal Fry');
      setBreadQty(3);
      setBreadType('Multigrain Rotis');
      setBreadGhee(false);
      setRice('Jeera Rice');
      setSides(['Spiced Curd', 'Green Salad']);
      setPrice(160);
      setTimeSlot('7:30 PM - 9:00 PM');
      setImagePreview(
        'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80'
      );
    }

    setDietary('Vegetarian');
    setMaxOrders(20);
    setAvailableFor('Both');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (
    type: 'lunch' | 'dinner',
    day: string = selectedDayTab,
    existingSlot: MealSlotItem
  ) => {
    setModalMode('edit');
    setTargetSlotDay(day);
    setMealType(type);
    setAssignedDays([day]);

    const title =
      existingSlot.mealTitle ||
      `${existingSlot.mainDish || `${day} Special`} ${
        type === 'lunch' ? 'Lunch' : 'Dinner'
      }`;
    setMealTitle(title);

    const tag = existingSlot.recipeTag || existingSlot.special || 'Traditional Gujarati Recipe';
    if (RECIPE_STYLE_PRESETS.includes(tag)) {
      setRecipeTag(tag);
      setIsCustomTag(false);
      setCustomTag('');
    } else {
      setRecipeTag('Custom');
      setIsCustomTag(true);
      setCustomTag(tag);
    }

    setMainDish(existingSlot.mainDish || '');
    setDal(existingSlot.dal || '');
    setBreadQty(existingSlot.breadQty || 4);
    setBreadType(existingSlot.breadType || 'Phulka Rotis');
    setBreadGhee(
      existingSlot.breadGhee !== undefined
        ? existingSlot.breadGhee
        : existingSlot.bread?.toLowerCase().includes('ghee') ?? true
    );
    setRice(existingSlot.rice || '');
    setSides(existingSlot.sides || []);
    setPrice(existingSlot.price || (type === 'lunch' ? 180 : 160));
    setDietary(existingSlot.dietary || 'Vegetarian');
    setTimeSlot(
      existingSlot.timeSlot ||
        (type === 'lunch' ? '12:30 PM - 2:00 PM' : '7:30 PM - 9:00 PM')
    );
    setMaxOrders(existingSlot.maxOrders || 20);
    setAvailableFor(existingSlot.availableFor || 'Both');
    setImagePreview(
      existingSlot.image ||
        (type === 'lunch'
          ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80')
    );
    setIsModalOpen(true);
  };

  const handleSaveMealSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainDish.trim() || !dal.trim()) {
      alert('Please enter at least a Main Sabzi/Dish and a Dal/Lentil.');
      return;
    }

    const breadFormatted = `${breadQty} ${breadType}${
      breadGhee ? ' (Ghee)' : ''
    }`;
    const effectiveTag = isCustomTag && customTag.trim() ? customTag.trim() : recipeTag;

    const slotPayload: MealSlotItem = {
      mealTitle:
        mealTitle.trim() ||
        `${mainDish} ${mealType === 'lunch' ? 'Lunch' : 'Dinner'}`,
      recipeTag: effectiveTag,
      special: effectiveTag,
      mainDish: mainDish.trim(),
      dal: dal.trim(),
      bread: breadFormatted,
      breadQty,
      breadType,
      breadGhee,
      rice: rice.trim() || 'Steamed Basmati Rice',
      sides,
      image: imagePreview,
      price: Number(price) || 180,
      timeSlot,
      maxOrders: Number(maxOrders) || 20,
      dietary,
      availableFor,
    };

    updateCookWeeklyMenuSlot(
      currentCookProfile.id,
      assignedDays,
      mealType,
      slotPayload
    );

    setIsModalOpen(false);
    showNotification(
      `✓ Successfully saved ${mealType === 'lunch' ? 'Lunch' : 'Dinner'} schedule for ${assignedDays.join(
        ', '
      )}!`
    );
  };

  const handleRemoveMeal = (day: string, slotType: 'lunch' | 'dinner') => {
    if (
      window.confirm(
        `Are you sure you want to remove the ${slotType} menu for ${day}?`
      )
    ) {
      removeCookWeeklyMealSlot(currentCookProfile.id, day, slotType);
      showNotification(`Removed ${day} ${slotType} schedule.`);
    }
  };

  const handleAutoFill = () => {
    if (
      window.confirm(
        'Auto-fill will populate all 7 days with authentic rotating Indian homestyle lunch & dinner thalis. Proceed?'
      )
    ) {
      autofillCookWeeklyMenu(currentCookProfile.id);
      showNotification('✨ All 7 days populated with 100% rotating menus!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200 relative pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1c1c] text-white px-5 py-3 rounded-2xl shadow-xl border border-white/20 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-4 h-4 text-[#d1e6c9]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Card (Follows Image 3 Inspiration) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dcc1b1]/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6">
        {/* Top Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#eeeeed]">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2.5">
              <Calendar className="w-6 h-6 text-[#944a00]" />
              <span>Weekly Meal Schedule (Monday – Sunday)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#564337] mt-1">
              Plan your complete weekly menu for tiffin subscribers & daily orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 100% Rotating Recipes Badge */}
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#d1e6c9] text-[#51634c] flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Rotating Recipes</span>
            </span>

            {/* View Mode Switcher: Day View vs Weekly Overview */}
            <div className="bg-[#faf9f8] p-1 rounded-xl border border-[#dcc1b1]/50 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'day'
                    ? 'bg-[#944a00] text-white shadow-2xs'
                    : 'text-[#564337] hover:bg-[#eeeeed]'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Day View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('overview')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'overview'
                    ? 'bg-[#944a00] text-white shadow-2xs'
                    : 'text-[#564337] hover:bg-[#eeeeed]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Weekly Overview</span>
              </button>
            </div>

            {/* Auto-fill Week Button */}
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-3.5 py-2 bg-[#ffdcc5]/60 hover:bg-[#ffdcc5] text-[#944a00] text-xs font-bold rounded-xl border border-[#944a00]/20 flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Auto-fills all 7 days with popular rotating recipes"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-fill Week</span>
            </button>

            {/* + Add Meal Button */}
            <button
              type="button"
              onClick={() => handleOpenAddModal('lunch', selectedDayTab)}
              className="px-4 py-2 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Meal</span>
            </button>
          </div>
        </div>

        {/* Horizontal Day Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day}
              onClick={() => {
                setSelectedDayTab(day);
                if (viewMode === 'overview') setViewMode('day');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedDayTab === day
                  ? 'bg-[#944a00] text-white shadow-xs scale-102'
                  : 'bg-[#faf9f8] text-[#564337] hover:bg-[#eeeeed] border border-[#dcc1b1]/50'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* VIEW 1: DAY VIEW (2 LARGE MEAL SECTIONS SIDE-BY-SIDE) */}
        {viewMode === 'day' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* LUNCH CARD */}
            {currentDaySchedule.lunch && currentDaySchedule.lunch.mainDish ? (
              <div className="p-6 rounded-2xl bg-[#faf9f8] border border-[#dcc1b1]/60 space-y-4 shadow-2xs hover:border-[#944a00]/40 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Lunch Header */}
                  <div className="flex items-center justify-between border-b border-[#dcc1b1]/40 pb-3">
                    <span className="font-extrabold text-sm sm:text-base text-[#944a00] flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-[#944a00]" />
                      <span>{selectedDayTab} Lunch</span>
                    </span>
                    {(currentDaySchedule.lunch.special ||
                      currentDaySchedule.lunch.recipeTag) && (
                      <span className="text-[11px] font-bold bg-[#ffdcc5] text-[#944a00] px-3 py-1 rounded-full shadow-2xs">
                        ★{' '}
                        {currentDaySchedule.lunch.recipeTag ||
                          currentDaySchedule.lunch.special}
                      </span>
                    )}
                  </div>

                  {/* Meal Title & Highlights */}
                  {currentDaySchedule.lunch.mealTitle && (
                    <div className="flex items-center justify-between bg-white/80 p-3 rounded-xl border border-[#dcc1b1]/40">
                      <div>
                        <h4 className="font-bold text-sm text-[#1a1c1c]">
                          {currentDaySchedule.lunch.mealTitle}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#564337] mt-0.5">
                          <span className="bg-[#d1e6c9]/40 text-[#51634c] px-2 py-0.5 rounded font-semibold border border-[#d1e6c9]">
                            {currentDaySchedule.lunch.dietary || 'Vegetarian'}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-[#564337]">
                            <Clock className="w-3 h-3 text-[#944a00]" />
                            {currentDaySchedule.lunch.timeSlot || '12:30 PM - 2:00 PM'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-[#944a00] text-sm sm:text-base">
                          ₹{currentDaySchedule.lunch.price || 180}
                        </span>
                        <span className="block text-[10px] text-[#564337]/80">
                          per meal
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Structured Fields (Matching Image 3) */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-[#564337] font-medium">
                        Main Sabzi / Curry:
                      </span>
                      <span className="font-bold text-[#1a1c1c] text-right">
                        {currentDaySchedule.lunch.mainDish}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-[#564337] font-medium">
                        Dal / Lentil:
                      </span>
                      <span className="font-bold text-[#1a1c1c] text-right">
                        {currentDaySchedule.lunch.dal}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-[#564337] font-medium">Breads:</span>
                      <span className="font-bold text-[#1a1c1c] text-right">
                        {currentDaySchedule.lunch.bread}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-[#564337] font-medium">Rice:</span>
                      <span className="font-bold text-[#1a1c1c] text-right">
                        {currentDaySchedule.lunch.rice}
                      </span>
                    </div>

                    {/* Sides & Accompaniments (Chips) */}
                    <div className="pt-3 border-t border-[#dcc1b1]/40">
                      <span className="text-[#564337] font-medium block mb-2">
                        Sides & Accompaniments:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(currentDaySchedule.lunch.sides || []).length > 0 ? (
                          currentDaySchedule.lunch.sides.map((side, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-white border border-[#dcc1b1]/60 rounded-lg text-[11px] font-medium text-[#1a1c1c] shadow-2xs"
                            >
                              • {side}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#564337]/60 italic">
                            No sides added
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-[#dcc1b1]/40 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenEditModal(
                        'lunch',
                        selectedDayTab,
                        currentDaySchedule.lunch
                      )
                    }
                    className="flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-[#564337] bg-white hover:bg-[#eeeeed] border border-[#dcc1b1] rounded-xl transition-all shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#944a00]" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMeal(selectedDayTab, 'lunch')}
                    className="px-4 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Empty Lunch Slot Card */
              <div className="p-8 rounded-2xl border-2 border-dashed border-[#dcc1b1] bg-white/60 text-center flex flex-col items-center justify-center space-y-3 min-h-[300px]">
                <div className="w-12 h-12 rounded-2xl bg-[#ffdcc5]/50 flex items-center justify-center text-[#944a00]">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1c1c] text-sm">
                    No Lunch Scheduled for {selectedDayTab}
                  </h4>
                  <p className="text-xs text-[#564337] mt-1 max-w-xs mx-auto">
                    Add complete lunch sabzi, dal, roti, and sides for your tiffin subscribers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddModal('lunch', selectedDayTab)}
                  className="px-4 py-2 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add {selectedDayTab} Lunch</span>
                </button>
              </div>
            )}

            {/* DINNER CARD */}
            {currentDaySchedule.dinner && currentDaySchedule.dinner.mainDish ? (
              <div className="p-6 rounded-2xl bg-[#faf9f8] border border-[#dcc1b1]/60 space-y-4 shadow-2xs hover:border-[#51634c]/40 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Dinner Header */}
                  <div className="flex items-center justify-between border-b border-[#dcc1b1]/40 pb-3">
                    <span className="font-extrabold text-sm sm:text-base text-[#51634c] flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-[#51634c]" />
                      <span>{selectedDayTab} Dinner</span>
                    </span>
                    {(currentDaySchedule.dinner.special ||
                      currentDaySchedule.dinner.recipeTag) && (
                      <span className="text-[11px] font-bold bg-[#d1e6c9] text-[#51634c] px-3 py-1 rounded-full shadow-2xs">
                        ★{' '}
                        {currentDaySchedule.dinner.recipeTag ||
                          currentDaySchedule.dinner.special}
                      </span>
                    )}
                  </div>

                  {/* Meal Title & Highlights */}
                  {currentDaySchedule.dinner.mealTitle && (
                    <div className="flex items-center justify-between bg-white/80 p-3 rounded-xl border border-[#dcc1b1]/40">
                      <div>
                        <h4 className="font-bold text-sm text-[#1a1c1c]">
                          {currentDaySchedule.dinner.mealTitle}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#564337] mt-0.5">
                          <span className="bg-[#d1e6c9]/40 text-[#51634c] px-2 py-0.5 rounded font-semibold border border-[#d1e6c9]">
                            {currentDaySchedule.dinner.dietary || 'Vegetarian'}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-[#564337]">
                            <Clock className="w-3 h-3 text-[#51634c]" />
                            {currentDaySchedule.dinner.timeSlot || '7:30 PM - 9:00 PM'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-[#51634c] text-sm sm:text-base">
                          ₹{currentDaySchedule.dinner.price || 160}
                        </span>
                        <span className="block text-[10px] text-[#564337]/80">
                          per meal
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Structured Fields (Matching Image 3) */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-[#564337] font-medium">
                        Main Sabzi / Dish:
                      </span>
                      <span className="font-bold text-[#1a1c1c] text-right">
                        {currentDaySchedule.dinner.mainDish}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-[#564337] font-medium">
                        Dal / Soup:
                      </span>
                      <span className="font-bold text-[#1a1c1c] text-right">
                        {currentDaySchedule.dinner.dal}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-[#564337] font-medium">Breads:</span>
                      <span className="font-bold text-[#1a1c1c] text-right">
                        {currentDaySchedule.dinner.bread}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-[#564337] font-medium">
                        Rice / Khichdi:
                      </span>
                      <span className="font-bold text-[#1a1c1c] text-right">
                        {currentDaySchedule.dinner.rice}
                      </span>
                    </div>

                    {/* Sides & Accompaniments (Chips) */}
                    <div className="pt-3 border-t border-[#dcc1b1]/40">
                      <span className="text-[#564337] font-medium block mb-2">
                        Sides & Accompaniments:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(currentDaySchedule.dinner.sides || []).length > 0 ? (
                          currentDaySchedule.dinner.sides.map((side, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-white border border-[#dcc1b1]/60 rounded-lg text-[11px] font-medium text-[#1a1c1c] shadow-2xs"
                            >
                              • {side}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#564337]/60 italic">
                            No sides added
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-[#dcc1b1]/40 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenEditModal(
                        'dinner',
                        selectedDayTab,
                        currentDaySchedule.dinner
                      )
                    }
                    className="flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-[#564337] bg-white hover:bg-[#eeeeed] border border-[#dcc1b1] rounded-xl transition-all shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#51634c]" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMeal(selectedDayTab, 'dinner')}
                    className="px-4 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Empty Dinner Slot Card */
              <div className="p-8 rounded-2xl border-2 border-dashed border-[#dcc1b1] bg-white/60 text-center flex flex-col items-center justify-center space-y-3 min-h-[300px]">
                <div className="w-12 h-12 rounded-2xl bg-[#d1e6c9]/50 flex items-center justify-center text-[#51634c]">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1c1c] text-sm">
                    No Dinner Scheduled for {selectedDayTab}
                  </h4>
                  <p className="text-xs text-[#564337] mt-1 max-w-xs mx-auto">
                    Add healthy light supper, rotis, khichdi, and sides for dinner deliveries.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddModal('dinner', selectedDayTab)}
                  className="px-4 py-2 bg-[#51634c] hover:bg-[#3d4b39] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add {selectedDayTab} Dinner</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: WEEKLY OVERVIEW (COMPACT MONDAY-SUNDAY TABLE/GRID) */}
        {viewMode === 'overview' && (
          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#564337]">
              <span>
                Click on any meal slot cell to directly edit its components.
              </span>
              <span className="font-semibold">Showing 7-day schedule</span>
            </div>

            <div className="overflow-x-auto border border-[#dcc1b1]/60 rounded-2xl bg-white shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#faf9f8] border-b border-[#dcc1b1]/60 text-[#564337] uppercase font-bold text-[11px] tracking-wider">
                    <th className="py-3.5 px-4 w-28">Day</th>
                    <th className="py-3.5 px-4">Lunch (12:30 – 2:00 PM)</th>
                    <th className="py-3.5 px-4">Dinner (7:30 – 9:00 PM)</th>
                    <th className="py-3.5 px-4 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeeed]">
                  {DAYS_OF_WEEK.map((day) => {
                    const dayItem =
                      weeklyMenu.find((m) => m.day === day) || {
                        day,
                        lunch: { mainDish: '', dal: '', bread: '', rice: '', sides: [] },
                        dinner: { mainDish: '', dal: '', bread: '', rice: '', sides: [] },
                      };

                    return (
                      <tr
                        key={day}
                        className="hover:bg-[#faf9f8]/80 transition-colors group"
                      >
                        {/* Day Cell */}
                        <td className="py-4 px-4 font-bold text-[#1a1c1c] align-top">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDayTab(day);
                              setViewMode('day');
                            }}
                            className="text-[#944a00] hover:underline font-extrabold flex items-center gap-1.5"
                          >
                            <span>{day}</span>
                          </button>
                        </td>

                        {/* Lunch Cell */}
                        <td
                          onClick={() => {
                            if (dayItem.lunch?.mainDish) {
                              handleOpenEditModal('lunch', day, dayItem.lunch);
                            } else {
                              handleOpenAddModal('lunch', day);
                            }
                          }}
                          className="py-4 px-4 align-top cursor-pointer hover:bg-[#ffdcc5]/20 rounded-lg transition-colors"
                        >
                          {dayItem.lunch?.mainDish ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#1a1c1c] text-xs">
                                  {dayItem.lunch.mealTitle || dayItem.lunch.mainDish}
                                </span>
                                {(dayItem.lunch.recipeTag || dayItem.lunch.special) && (
                                  <span className="text-[10px] bg-[#ffdcc5] text-[#944a00] px-2 py-0.5 rounded-full font-bold">
                                    ★ {dayItem.lunch.recipeTag || dayItem.lunch.special}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#564337]">
                                <span className="font-semibold text-[#1a1c1c]">Main:</span>{' '}
                                {dayItem.lunch.mainDish} + {dayItem.lunch.dal}
                              </p>
                              <p className="text-[11px] text-[#564337]/80">
                                {dayItem.lunch.bread} • {dayItem.lunch.rice}
                                {dayItem.lunch.sides?.length
                                  ? ` • ${dayItem.lunch.sides.length} sides`
                                  : ''}
                              </p>
                              <div className="flex items-center gap-2 pt-0.5">
                                <span className="text-[10px] font-extrabold text-[#944a00]">
                                  ₹{dayItem.lunch.price || 180}
                                </span>
                                <span className="text-[9px] bg-[#d1e6c9]/50 text-[#51634c] px-1.5 rounded font-semibold">
                                  {dayItem.lunch.dietary || 'Vegetarian'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-[#564337]/50 italic flex items-center gap-1 hover:text-[#944a00]">
                              <Plus className="w-3.5 h-3.5" /> Add Lunch
                            </span>
                          )}
                        </td>

                        {/* Dinner Cell */}
                        <td
                          onClick={() => {
                            if (dayItem.dinner?.mainDish) {
                              handleOpenEditModal('dinner', day, dayItem.dinner);
                            } else {
                              handleOpenAddModal('dinner', day);
                            }
                          }}
                          className="py-4 px-4 align-top cursor-pointer hover:bg-[#d1e6c9]/20 rounded-lg transition-colors"
                        >
                          {dayItem.dinner?.mainDish ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#1a1c1c] text-xs">
                                  {dayItem.dinner.mealTitle || dayItem.dinner.mainDish}
                                </span>
                                {(dayItem.dinner.recipeTag || dayItem.dinner.special) && (
                                  <span className="text-[10px] bg-[#d1e6c9] text-[#51634c] px-2 py-0.5 rounded-full font-bold">
                                    ★ {dayItem.dinner.recipeTag || dayItem.dinner.special}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#564337]">
                                <span className="font-semibold text-[#1a1c1c]">Main:</span>{' '}
                                {dayItem.dinner.mainDish} + {dayItem.dinner.dal}
                              </p>
                              <p className="text-[11px] text-[#564337]/80">
                                {dayItem.dinner.bread} • {dayItem.dinner.rice}
                                {dayItem.dinner.sides?.length
                                  ? ` • ${dayItem.dinner.sides.length} sides`
                                  : ''}
                              </p>
                              <div className="flex items-center gap-2 pt-0.5">
                                <span className="text-[10px] font-extrabold text-[#51634c]">
                                  ₹{dayItem.dinner.price || 160}
                                </span>
                                <span className="text-[9px] bg-[#d1e6c9]/50 text-[#51634c] px-1.5 rounded font-semibold">
                                  {dayItem.dinner.dietary || 'Vegetarian'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-[#564337]/50 italic flex items-center gap-1 hover:text-[#51634c]">
                              <Plus className="w-3.5 h-3.5" /> Add Dinner
                            </span>
                          )}
                        </td>

                        {/* Actions Cell */}
                        <td className="py-4 px-4 text-center align-top">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDayTab(day);
                              setViewMode('day');
                            }}
                            className="px-3 py-1 bg-[#faf9f8] hover:bg-[#eeeeed] border border-[#dcc1b1] text-[#564337] text-[11px] font-bold rounded-lg transition-colors"
                          >
                            View Day
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3. ADD / EDIT STRUCTURED MEAL BUILDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 border border-[#dcc1b1]/50 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="bg-[#faf9f8] px-6 py-4 border-b border-[#dcc1b1]/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 px-2.5 rounded-xl text-[#564337] hover:text-[#1a1c1c] hover:bg-white border border-[#dcc1b1]/60 flex items-center gap-1.5 text-xs font-bold transition-all shadow-2xs"
                  title="Back"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <div className="h-5 w-px bg-[#dcc1b1]/60 hidden sm:block" />
                <div>
                  <h3 className="text-lg font-extrabold text-[#1a1c1c] flex items-center gap-2">
                    <Utensils
                      className={`w-5 h-5 ${
                        mealType === 'lunch' ? 'text-[#944a00]' : 'text-[#51634c]'
                      }`}
                    />
                    <span>
                      {modalMode === 'add' ? 'Add' : 'Edit'} {targetSlotDay}{' '}
                      {mealType === 'lunch' ? 'Lunch' : 'Dinner'}
                    </span>
                  </h3>
                  <p className="text-xs text-[#564337]">
                    Assemble complete meal components for daily & tiffin subscribers.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white text-[#564337] transition-colors border border-transparent hover:border-[#dcc1b1]/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>


            {/* Modal Scrollable Body */}
            <form
              onSubmit={handleSaveMealSlot}
              className="p-6 space-y-6 overflow-y-auto flex-1 text-xs"
            >
              {/* Slot Type Toggle */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#1a1c1c] block">
                  Meal Slot
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMealType('lunch');
                      setTimeSlot('12:30 PM - 2:00 PM');
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                      mealType === 'lunch'
                        ? 'bg-[#ffdcc5] text-[#944a00] border-[#944a00] shadow-xs'
                        : 'bg-[#faf9f8] text-[#564337] border-[#dcc1b1]/60 hover:bg-white'
                    }`}
                  >
                    <Utensils className="w-4 h-4 text-[#944a00]" />
                    <span>Lunch (12:30 PM – 2:00 PM)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMealType('dinner');
                      setTimeSlot('7:30 PM - 9:00 PM');
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                      mealType === 'dinner'
                        ? 'bg-[#d1e6c9] text-[#51634c] border-[#51634c] shadow-xs'
                        : 'bg-[#faf9f8] text-[#564337] border-[#dcc1b1]/60 hover:bg-white'
                    }`}
                  >
                    <Utensils className="w-4 h-4 text-[#51634c]" />
                    <span>Dinner (7:30 PM – 9:00 PM)</span>
                  </button>
                </div>
              </div>

              {/* Meal Title & Recipe Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#1a1c1c]">
                    Meal Title
                  </label>
                  <input
                    required
                    value={mealTitle}
                    onChange={(e) => setMealTitle(e.target.value)}
                    placeholder="e.g. Traditional Gujarati Lunch"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#dcc1b1] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#ffdcc5] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#1a1c1c]">
                    Recipe Style / Tag
                  </label>
                  {isCustomTag ? (
                    <div className="flex gap-1.5">
                      <input
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        placeholder="Type custom style..."
                        className="flex-1 px-3.5 py-2.5 bg-white border border-[#dcc1b1] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#ffdcc5] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomTag(false);
                          setRecipeTag('Traditional Gujarati Recipe');
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold text-[#564337] hover:underline"
                      >
                        Reset
                      </button>
                    </div>
                  ) : (
                    <select
                      value={recipeTag}
                      onChange={(e) => {
                        if (e.target.value === 'Custom') {
                          setIsCustomTag(true);
                        } else {
                          setRecipeTag(e.target.value);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#dcc1b1] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#ffdcc5] outline-none"
                    >
                      {RECIPE_STYLE_PRESETS.map((preset) => (
                        <option key={preset} value={preset}>
                          {preset}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Main Components Section */}
              <div className="space-y-3.5 p-4 rounded-2xl bg-[#faf9f8] border border-[#dcc1b1]/50">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1a1c1c] uppercase tracking-wider">
                  <ChefHat className="w-4 h-4 text-[#944a00]" />
                  <span>Main Homestyle Components</span>
                </div>

                {/* Main Sabzi and Dal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#1a1c1c]">
                      Main Sabzi / Curry <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={mainDish}
                      onChange={(e) => setMainDish(e.target.value)}
                      placeholder="e.g. Panchmel Dal Tadka / Paneer Butter Masala"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#dcc1b1] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#ffdcc5] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#1a1c1c]">
                      Dal / Lentil / Soup <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={dal}
                      onChange={(e) => setDal(e.target.value)}
                      placeholder="e.g. Yellow Moong Dal / Dal Fry / Kadhi"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#dcc1b1] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#ffdcc5] outline-none"
                    />
                  </div>
                </div>

                {/* Bread Component (Quantity, Type, Ghee) */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#1a1c1c]">
                    Breads Component
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-white p-3 rounded-xl border border-[#dcc1b1]/60">
                    <div className="sm:col-span-3">
                      <label className="text-[10px] text-[#564337] block font-semibold mb-0.5">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={breadQty}
                        onChange={(e) => setBreadQty(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-[#faf9f8] border border-[#dcc1b1] rounded-lg text-xs font-bold text-center outline-none"
                      />
                    </div>

                    <div className="sm:col-span-5">
                      <label className="text-[10px] text-[#564337] block font-semibold mb-0.5">
                        Bread Type
                      </label>
                      <select
                        value={breadType}
                        onChange={(e) => setBreadType(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#faf9f8] border border-[#dcc1b1] rounded-lg text-xs font-medium outline-none"
                      >
                        {COMMON_BREAD_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-4 flex items-center gap-2 pt-3 sm:pt-4">
                      <input
                        type="checkbox"
                        id="breadGheeToggle"
                        checked={breadGhee}
                        onChange={(e) => setBreadGhee(e.target.checked)}
                        className="w-4 h-4 accent-[#944a00] rounded cursor-pointer"
                      />
                      <label
                        htmlFor="breadGheeToggle"
                        className="text-xs font-bold text-[#1a1c1c] cursor-pointer select-none"
                      >
                        Applied Desi Ghee
                      </label>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#564337]/80 italic">
                    Preview: {breadQty} {breadType}
                    {breadGhee ? ' (Ghee)' : ''}
                  </p>
                </div>

                {/* Rice / Khichdi */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#1a1c1c]">
                    Rice / Khichdi / Pulao
                  </label>
                  <input
                    value={rice}
                    onChange={(e) => setRice(e.target.value)}
                    placeholder="e.g. Steamed Basmati Rice / Jeera Rice / Khichdi"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#dcc1b1] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#ffdcc5] outline-none"
                  />
                </div>

                {/* Sides & Accompaniments (Dynamic Chips) */}
                <div className="space-y-2">
                  <label className="font-bold text-[#1a1c1c]">
                    Sides & Accompaniments (Dynamic Items)
                  </label>

                  <div className="flex gap-2">
                    <input
                      value={sideInput}
                      onChange={(e) => setSideInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSide();
                        }
                      }}
                      placeholder="Add side item (e.g. Roasted Papad, Fresh Chaas)"
                      className="flex-1 px-3.5 py-2 bg-white border border-[#dcc1b1] rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#ffdcc5]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSide()}
                      className="px-4 py-2 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
                    >
                      + Add Side
                    </button>
                  </div>

                  {/* Suggestion Quick Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-[#564337] font-semibold py-0.5">
                      Quick suggestions:
                    </span>
                    {SUGGESTED_SIDES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleAddSide(item)}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white hover:bg-[#ffdcc5]/40 text-[#564337] border border-[#dcc1b1]/50 font-medium transition-colors"
                      >
                        + {item}
                      </button>
                    ))}
                  </div>

                  {/* Active Chips Display */}
                  <div className="flex flex-wrap gap-2 pt-2 min-h-[38px] p-2.5 rounded-xl bg-white border border-[#dcc1b1]/50">
                    {sides.length === 0 ? (
                      <span className="text-[11px] text-[#564337]/60 italic self-center">
                        No sides added yet. Type an item above or click a suggestion.
                      </span>
                    ) : (
                      sides.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 bg-[#faf9f8] border border-[#dcc1b1] px-3 py-1 rounded-lg text-xs font-bold text-[#1a1c1c] shadow-2xs"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSide(index)}
                            className="text-[#564337] hover:text-red-600 rounded-full transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Meal Photo (Optional) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#1a1c1c]">
                    Meal Image (Optional)
                  </label>
                  <span className="text-[11px] text-[#564337]">
                    Represents the complete lunch or dinner tiffin
                  </span>
                </div>
                <div className="flex items-center gap-4 bg-[#faf9f8] p-3 rounded-2xl border border-[#dcc1b1]/50">
                  <div className="w-24 h-24 rounded-xl bg-white border border-[#dcc1b1] overflow-hidden shrink-0 relative group">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#564337]/50 text-[10px]">
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span>No Photo</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-[11px] text-[#564337]">
                      Upload a real picture of your freshly plated meal components to attract customers.
                    </p>
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#eeeeed] text-[#564337] border border-[#dcc1b1] text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-2xs">
                      <ImageIcon className="w-3.5 h-3.5 text-[#944a00]" />
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Pricing & Order Information */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#faf9f8] border border-[#dcc1b1]/50">
                <div className="font-extrabold text-[#1a1c1c] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-[#944a00]" />
                  <span>Order Information & Availability</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#1a1c1c]">
                      Price Per Meal (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#564337]" />
                      <input
                        type="number"
                        min="50"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-[#dcc1b1] rounded-xl text-xs font-extrabold text-[#944a00] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#1a1c1c]">
                      Dietary Tag
                    </label>
                    <select
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-[#dcc1b1] rounded-xl text-xs font-medium outline-none"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Jain">Jain (No Onion/Garlic)</option>
                      <option value="Vegan">Vegan</option>
                      <option value="High Protein">High Protein</option>
                      <option value="Non-Veg">Non-Veg</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#1a1c1c]">
                      Delivery Time Slot
                    </label>
                    <input
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#dcc1b1] rounded-xl text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="font-bold text-[#1a1c1c]">
                      Maximum Daily Orders Capacity
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      value={maxOrders}
                      onChange={(e) => setMaxOrders(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-[#dcc1b1] rounded-xl text-xs font-medium outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#1a1c1c]">
                      Available For
                    </label>
                    <div className="grid grid-cols-3 gap-1 pt-0.5">
                      {(['Daily orders', 'Tiffin subscribers', 'Both'] as const).map(
                        (option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setAvailableFor(option)}
                            className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-colors ${
                              availableFor === option
                                ? 'bg-[#944a00] text-white border-[#944a00]'
                                : 'bg-white text-[#564337] border-[#dcc1b1]/60 hover:bg-[#eeeeed]'
                            }`}
                          >
                            {option === 'Daily orders'
                              ? 'Daily'
                              : option === 'Tiffin subscribers'
                              ? 'Subscribers'
                              : 'Both'}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Days Multi-selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#1a1c1c]">
                    Available Days (Assign to schedule)
                  </label>
                  <span className="text-[11px] text-[#564337]">
                    Preselected for {targetSlotDay}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDaySelection(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        assignedDays.includes(day)
                          ? 'bg-[#51634c] text-white shadow-xs'
                          : 'bg-[#faf9f8] text-[#564337] hover:bg-[#eeeeed] border border-[#dcc1b1]/50'
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#eeeeed] flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 text-xs font-bold text-[#564337] bg-[#faf9f8] hover:bg-[#eeeeed] border border-[#dcc1b1] rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-bold text-white bg-[#944a00] hover:bg-[#713700] rounded-xl shadow-md transition-all flex justify-center items-center gap-2 active:scale-98"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Meal to Schedule</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
