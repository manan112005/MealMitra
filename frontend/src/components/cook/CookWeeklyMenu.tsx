import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DayMenuSchedule } from '../../types';
import { MOCK_COOKS } from '../../data/mockData';
import {
  BookOpen,
  Calendar,
  Utensils,
  Save,
  CheckCircle,
  Sparkles,
  Plus,
} from 'lucide-react';

const DEFAULT_SCHEDULE: DayMenuSchedule[] = MOCK_COOKS[0].weeklyMenu;

export const CookWeeklyMenu: React.FC = () => {
  const { currentCookProfile, updateWeeklyMenu } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [menuData, setMenuData] = useState<DayMenuSchedule[]>(
    () => currentCookProfile?.weeklyMenu || DEFAULT_SCHEDULE
  );
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (currentCookProfile?.weeklyMenu && currentCookProfile.weeklyMenu.length > 0) {
      setMenuData(currentCookProfile.weeklyMenu);
    }
  }, [currentCookProfile]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const currentDayMenu =
    (menuData && menuData.find((d) => d.day === selectedDay)) ||
    (menuData && menuData[0]) ||
    DEFAULT_SCHEDULE[0];

  const handleLunchChange = (field: string, value: any) => {
    setMenuData((prev) =>
      prev.map((d) =>
        d.day === selectedDay
          ? {
              ...d,
              lunch: {
                ...d.lunch,
                [field]: value,
              },
            }
          : d
      )
    );
  };

  const handleDinnerChange = (field: string, value: any) => {
    setMenuData((prev) =>
      prev.map((d) =>
        d.day === selectedDay
          ? {
              ...d,
              dinner: {
                ...d.dinner,
                [field]: value,
              },
            }
          : d
      )
    );
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateWeeklyMenu(menuData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#944a00]" />
            <span>Weekly Rotating Menu Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Plan and publish your Monday to Sunday lunch and dinner dishes for daily customers and monthly subscribers.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Full Weekly Menu</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-3.5 bg-[#d1e6c9] text-[#51634c] text-xs font-bold rounded-xl flex items-center gap-2 shadow-2xs">
          <CheckCircle className="w-4 h-4" />
          <span>Weekly schedule updated! Customers can now view your latest dishes.</span>
        </div>
      )}

      {/* Days Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDay === day
                ? 'bg-[#944a00] text-white shadow-xs scale-102'
                : 'bg-white text-[#564337] hover:bg-[#faf9f8] border border-[#dcc1b1]/50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Structured Day Menu Editor */}
      <form onSubmit={handleSaveAll} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Lunch Editor */}
          <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eeeeed]">
              <h3 className="font-extrabold text-base text-[#944a00] flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                <span>{selectedDay} Lunch Menu</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffdcc5] text-[#944a00]">
                12:30 PM - 2:00 PM
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1a1c1c]">Main Sabzi / Dish</label>
                <input
                  type="text"
                  value={currentDayMenu.lunch.mainDish}
                  onChange={(e) => handleLunchChange('mainDish', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg text-[#1a1c1c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1a1c1c]">Dal / Kadhi / Lentil</label>
                <input
                  type="text"
                  value={currentDayMenu.lunch.dal}
                  onChange={(e) => handleLunchChange('dal', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg text-[#1a1c1c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1a1c1c]">Breads (Rotis / Thepla)</label>
                  <input
                    type="text"
                    value={currentDayMenu.lunch.bread}
                    onChange={(e) => handleLunchChange('bread', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg text-[#1a1c1c]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1a1c1c]">Rice / Pulao</label>
                  <input
                    type="text"
                    value={currentDayMenu.lunch.rice}
                    onChange={(e) => handleLunchChange('rice', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg text-[#1a1c1c]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1a1c1c]">Special Dessert / Star Item (Optional)</label>
                <input
                  type="text"
                  value={currentDayMenu.lunch.special || ''}
                  onChange={(e) => handleLunchChange('special', e.target.value)}
                  placeholder="e.g. Aamras, Mohanthal, Gulab Jamun"
                  className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg text-[#1a1c1c]"
                />
              </div>
            </div>
          </div>

          {/* Dinner Editor */}
          <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eeeeed]">
              <h3 className="font-extrabold text-base text-[#51634c] flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                <span>{selectedDay} Dinner Menu</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d1e6c9] text-[#51634c]">
                7:30 PM - 9:00 PM
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1a1c1c]">Main Sabzi / Light Dinner Dish</label>
                <input
                  type="text"
                  value={currentDayMenu.dinner.mainDish}
                  onChange={(e) => handleDinnerChange('mainDish', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg text-[#1a1c1c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1a1c1c]">Dal / Kadhi / Soup</label>
                <input
                  type="text"
                  value={currentDayMenu.dinner.dal}
                  onChange={(e) => handleDinnerChange('dal', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg text-[#1a1c1c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1a1c1c]">Breads (Rotis / Bhakri)</label>
                  <input
                    type="text"
                    value={currentDayMenu.dinner.bread}
                    onChange={(e) => handleDinnerChange('bread', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg text-[#1a1c1c]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1a1c1c]">Rice / Khichdi</label>
                  <input
                    type="text"
                    value={currentDayMenu.dinner.rice}
                    onChange={(e) => handleDinnerChange('rice', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg text-[#1a1c1c]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1a1c1c]">Special Item (Optional)</label>
                <input
                  type="text"
                  value={currentDayMenu.dinner.special || ''}
                  onChange={(e) => handleDinnerChange('special', e.target.value)}
                  placeholder="e.g. Masala Chaas, Roasted Papad, Sweet Sheera"
                  className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-lg text-[#1a1c1c]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
          >
            Save & Publish {selectedDay}'s Menu
          </button>
        </div>
      </form>
    </div>
  );
};
