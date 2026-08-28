import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Meal } from '../../types';
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
} from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const CookWeeklyMenu: React.FC = () => {
  const { currentCookProfile, meals, addMeal, updateMeal, deleteMeal } = useApp();
  
  const [selectedDayTab, setSelectedDayTab] = useState<string>('Monday');

  // Filter meals that belong to this cook AND are available on the selected day.
  // If a meal has no availableDays array (legacy/mock), we can either show it everywhere or nowhere.
  // For safety, let's show it if it doesn't have the array, or if the array includes the selected day.
  const cookMeals = meals.filter(m => m.cookId === currentCookProfile.id);
  const displayedMeals = cookMeals.filter(m => {
    const days = m.availableDays || ['Monday']; // Legacy fallback to Monday
    return days.includes(selectedDayTab);
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(120);
  const [category, setCategory] = useState<'Lunch' | 'Dinner' | 'Both'>('Lunch');
  const [timeSlot, setTimeSlot] = useState('12:30 PM - 2:00 PM');
  const [dietary, setDietary] = useState<'Vegetarian' | 'Vegan' | 'Non-Veg'>('Vegetarian');
  const [availableDays, setAvailableDays] = useState<string[]>(['Monday']);
  const [imagePreview, setImagePreview] = useState<string>('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setImagePreview(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDaySelection = (day: string) => {
    setAvailableDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice(120);
    setCategory('Lunch');
    setTimeSlot('12:30 PM - 2:00 PM');
    setDietary('Vegetarian');
    setAvailableDays([selectedDayTab]);
    setImagePreview('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80');
    setEditingMealId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (meal: Meal) => {
    setName(meal.name);
    setDescription(meal.description);
    setPrice(meal.price);
    setCategory(meal.category);
    setTimeSlot(meal.timeSlot || '12:30 PM - 2:00 PM');
    setDietary(meal.dietary as 'Vegetarian' | 'Vegan' | 'Non-Veg');
    setAvailableDays(meal.availableDays || [selectedDayTab]);
    setImagePreview(meal.image);
    setEditingMealId(meal.id);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (availableDays.length === 0) {
      alert('Please select at least one day for this dish.');
      return;
    }

    if (editingMealId) {
      updateMeal(editingMealId, {
        name,
        description,
        price,
        category,
        timeSlot,
        dietary,
        availableDays,
        image: imagePreview,
      });
    } else {
      addMeal({
        name,
        description,
        price,
        category,
        timeSlot,
        availableDays,
        dietary: dietary as any,
        image: imagePreview,
        cookId: currentCookProfile.id,
        cookName: currentCookProfile.name,
        cookAvatar: currentCookProfile.avatar,
        rating: 0,
        reviewsCount: 0,
        itemsIncluded: [name],
        calories: 450,
        availableQty: category === 'Lunch' ? currentCookProfile.lunchTotalQty : currentCookProfile.dinnerTotalQty,
        totalQty: category === 'Lunch' ? currentCookProfile.lunchTotalQty : currentCookProfile.dinnerTotalQty,
        deliveryEstimateMin: 30,
        distanceKm: 0,
      });
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this dish completely?")) {
      deleteMeal(id);
    }
  };

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-200 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#944a00]" />
            <span>Weekly Dish Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Plan your menu by adding dishes to specific days of the week. Customers will see what's available today.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Days Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDayTab(day)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDayTab === day
                ? 'bg-[#944a00] text-white shadow-xs scale-102'
                : 'bg-white text-[#564337] hover:bg-[#faf9f8] border border-[#dcc1b1]/50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Grid of existing dishes for the selected day */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedMeals.length === 0 ? (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-[#dcc1b1] rounded-2xl bg-white/50">
            <Utensils className="w-12 h-12 text-[#dcc1b1] mx-auto mb-3" />
            <p className="text-[#564337] font-semibold">No dishes scheduled for {selectedDayTab}.</p>
            <p className="text-xs text-[#564337]/70 mt-1 mb-4">Click "Add New Dish" to assign a meal to this day.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#ffdcc5] hover:bg-[#ffeedd] text-[#944a00] text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" /> Add Dish to {selectedDayTab}
            </button>
          </div>
        ) : (
          displayedMeals.map((meal) => (
            <div key={meal.id} className="bg-white rounded-2xl border border-[#dcc1b1]/60 overflow-hidden shadow-2xs group flex flex-col hover:shadow-md transition-all">
              <div className="relative h-48 bg-[#eeeeed]">
                <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                  <span className="bg-[#ffdcc5]/95 backdrop-blur-xs text-[#944a00] px-2.5 py-1 text-[10px] font-bold rounded-full shadow-xs">
                    {meal.category}
                  </span>
                  {meal.availableDays && meal.availableDays.length > 1 && (
                    <span className="bg-white/95 backdrop-blur-xs text-[#1a1c1c] px-2.5 py-1 text-[10px] font-bold rounded-full shadow-xs border border-[#eeeeed]">
                      +{meal.availableDays.length - 1} Days
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[#1a1c1c] text-sm line-clamp-1">{meal.name}</h3>
                    <span className="font-extrabold text-[#944a00] text-sm">₹{meal.price}</span>
                  </div>
                  <p className="text-xs text-[#564337] mt-1 line-clamp-2">{meal.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="text-[10px] bg-[#d1e6c9]/40 text-[#51634c] px-2 py-0.5 rounded font-semibold border border-[#d1e6c9]">
                      {meal.dietary}
                    </span>
                    {meal.timeSlot && (
                      <span className="text-[10px] text-[#564337] flex items-center gap-1 font-medium bg-[#faf9f8] border border-[#eeeeed] px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3" /> {meal.timeSlot}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-[#eeeeed]">
                  <button
                    onClick={() => handleOpenEdit(meal)}
                    className="flex-1 py-1.5 flex items-center justify-center gap-1.5 text-xs font-bold text-[#564337] bg-[#faf9f8] hover:bg-[#eeeeed] border border-[#dcc1b1]/50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(meal.id)}
                    className="flex-1 py-1.5 flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#eeeeed] flex justify-between items-center z-10">
              <h3 className="text-lg font-bold text-[#1a1c1c]">
                {editingMealId ? 'Edit Dish' : 'Add New Dish'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#faf9f8] text-[#564337] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1a1c1c]">Dish Photo</label>
                <div className="relative w-full h-40 bg-[#faf9f8] border-2 border-dashed border-[#dcc1b1] rounded-2xl overflow-hidden group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-[#1a1c1c] shadow-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Change Photo
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1a1c1c]">Dish Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Punjabi Deluxe Thali"
                    className="w-full px-4 py-2.5 bg-white border border-[#dcc1b1] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#ffdcc5] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1a1c1c]">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the items included in the dish..."
                    className="w-full px-4 py-2.5 bg-white border border-[#dcc1b1] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#ffdcc5] outline-none min-h-[80px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1a1c1c]">Price (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#564337]" />
                      <input
                        required
                        type="number"
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#dcc1b1] rounded-xl text-sm font-bold text-[#944a00] focus:ring-2 focus:ring-[#ffdcc5] outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1a1c1c]">Dietary</label>
                    <select
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-white border border-[#dcc1b1] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#ffdcc5] outline-none"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Non-Veg">Non-Veg</option>
                      <option value="Jain">Jain</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1a1c1c]">Category</label>
                    <select
                      value={category}
                      onChange={(e) => {
                        const newCat = e.target.value as 'Lunch' | 'Dinner' | 'Both';
                        setCategory(newCat);
                        if (newCat === 'Lunch') setTimeSlot('12:30 PM - 2:00 PM');
                        else if (newCat === 'Dinner') setTimeSlot('7:30 PM - 9:00 PM');
                        else setTimeSlot('12:30 PM - 9:00 PM');
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-[#dcc1b1] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#ffdcc5] outline-none"
                    >
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Both">Both (All Day)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1a1c1c]">Delivery Time Slot</label>
                    <input
                      required
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-[#dcc1b1] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#ffdcc5] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-[#1a1c1c]">Available Days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDaySelection(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          availableDays.includes(day)
                            ? 'bg-[#51634c] text-white'
                            : 'bg-[#faf9f8] text-[#564337] hover:bg-[#eeeeed] border border-[#dcc1b1]/50'
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#eeeeed] flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-xs font-bold text-[#564337] bg-[#faf9f8] hover:bg-[#eeeeed] border border-[#dcc1b1] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-bold text-white bg-[#944a00] hover:bg-[#713700] rounded-xl shadow-md transition-colors flex justify-center items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {editingMealId ? 'Save Changes' : 'Publish Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
