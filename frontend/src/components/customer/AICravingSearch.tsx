import React, { useState, useEffect, useTransition } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService, CravingSearchResult } from '../../services/ai.service';
import { Meal } from '../../types';
import {
  Sparkles,
  Search,
  Flame,
  Heart,
  Activity,
  Zap,
  CheckCircle2,
  Clock,
  ChevronRight,
  RefreshCw,
  X,
  Volume2,
} from 'lucide-react';

interface AICravingSearchProps {
  onSelectMeal?: (meal: Meal) => void;
  standalone?: boolean;
}

const SAMPLE_CRAVINGS = [
  {
    label: 'Post-Workout High Protein',
    query: 'High protein light comfort food with low oil after heavy workout',
    badge: 'Fitness',
  },
  {
    label: 'Authentic Gujarati Dal & Phulkas',
    query: 'Authentic Gujarati sweet dal with soft phulkas and low oil',
    badge: 'Traditional',
  },
  {
    label: 'Ayurvedic Light Tummy Reset',
    query: 'Warm khichdi with kadhi on a rainy day with minimal spice',
    badge: 'Comfort',
  },
  {
    label: 'Kathiyawadi Spicy & Bhakri',
    query: 'Spicy sev tameta with crispy bhakri and masala chaas',
    badge: 'Desi Craving',
  },
  {
    label: 'Jain Pure Clean Lunch',
    query: '100% Jain no onion no garlic healthy thali under 400 calories',
    badge: 'Jain Safe',
  },
];

export const AICravingSearch: React.FC<AICravingSearchProps> = ({
  onSelectMeal,
  standalone = false,
}) => {
  const { meals, cooks, setSelectedMealForOrder, setSelectedCookId, setCustomerTab } = useApp();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<CravingSearchResult | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [_, startTransition] = useTransition();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResult(null);
      return;
    }

    setIsSearching(true);
    try {
      const result = await aiService.searchCraving(searchQuery, meals, cooks);
      startTransition(() => {
        setSearchResult(result);
      });
    } catch (err) {
      console.error('Craving search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePresetClick = (preset: typeof SAMPLE_CRAVINGS[0]) => {
    setQuery(preset.query);
    setActivePreset(preset.label);
    handleSearch(preset.query);
  };

  const handleClear = () => {
    setQuery('');
    setActivePreset(null);
    setSearchResult(null);
  };

  const handleOrderClick = (meal: Meal) => {
    if (onSelectMeal) {
      onSelectMeal(meal);
    } else {
      setSelectedMealForOrder(meal);
    }
  };

  const handleCookClick = (cookId: string) => {
    setSelectedCookId(cookId);
    setCustomerTab('discover');
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#fff7f0] via-white to-[#f4f7f4] rounded-3xl border border-[#e5d5c5] shadow-xs p-5 sm:p-7 relative overflow-hidden">
      {/* Decorative AI Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#ff6d00]/10 via-[#00a86b]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#ff6d00]/10 to-[#ffdcc5] text-[#b34700] text-xs font-bold uppercase tracking-wider mb-2 border border-[#ff6d00]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#ff6d00] animate-pulse" />
            AI Craving & Mood Matcher
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1a1c1c] tracking-tight">
            Craving something specific? Speak your mind.
          </h2>
          <p className="text-xs sm:text-sm text-[#6a5445] mt-0.5">
            Describe what your body or mood needs in plain words. Mitra AI matches local chefs' live menus.
          </p>
        </div>

        {searchResult && (
          <button
            onClick={handleClear}
            className="text-xs font-semibold text-[#8c6553] hover:text-[#1a1c1c] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#dcc1b1]/60 shadow-2xs hover:bg-[#faf9f8] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Reset Search
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      <div className="relative z-10 mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="relative flex items-center"
        >
          <div className="absolute left-4.5 text-[#944a00]">
            <Sparkles className={`w-5 h-5 ${isSearching ? 'animate-spin text-[#ff6d00]' : ''}`} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (activePreset) setActivePreset(null);
            }}
            placeholder='Try: "Authentic Gujarati sweet dal with soft phulkas and low oil after gym"'
            className="w-full pl-12 pr-28 py-3.5 sm:py-4 text-sm sm:text-base font-medium text-[#1a1c1c] placeholder:text-[#9e8b7e] bg-white rounded-2xl border-2 border-[#e6cbbd] focus:border-[#ff6d00] focus:ring-4 focus:ring-[#ff6d00]/15 transition-all shadow-xs"
          />

          <div className="absolute right-2 sm:right-2.5 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-full text-[#9e8b7e] hover:text-[#1a1c1c] hover:bg-[#f0ebe6] transition-colors"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#ff6d00] to-[#e65100] text-white font-bold text-xs sm:text-sm hover:shadow-md hover:brightness-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-xs"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Matching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>AI Find</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Suggested Quick Craving Pills */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-[#8c6553] whitespace-nowrap flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-[#ff6d00]" /> Ideas:
        </span>
        {SAMPLE_CRAVINGS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => handlePresetClick(preset)}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium border transition-all flex items-center gap-1.5 ${
              activePreset === preset.label
                ? 'bg-[#1a1c1c] text-white border-[#1a1c1c] shadow-xs'
                : 'bg-white/90 text-[#543b2b] border-[#e6d0c2] hover:bg-white hover:border-[#ff6d00] hover:text-[#944a00]'
            }`}
          >
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-[#ffdcc5] text-[#944a00]">
              {preset.badge}
            </span>
            {preset.label}
          </button>
        ))}
      </div>

      {/* Live AI Search Results View */}
      {searchResult && (
        <div className="mt-6 pt-6 border-t border-[#e5d5c5]/80 relative z-10 space-y-4">
          {/* Intent Analysis Pill Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-xs p-3.5 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#1a1c1c] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6d00]" /> AI Detected Intent:
              </span>

              {searchResult.detectedIntent.moods.map((m) => (
                <span
                  key={m}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#ffefe3] text-[#b34700] border border-[#ffdcc5]"
                >
                  Mood: {m}
                </span>
              ))}

              {searchResult.detectedIntent.healthAttributes.map((h) => (
                <span
                  key={h}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#e8f7ee] text-[#1b7a43] border border-[#c4ebd1]"
                >
                  ✓ {h}
                </span>
              ))}

              {searchResult.detectedIntent.cuisines.map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#f0f4ff] text-[#2c5282] border border-[#d0e1fd]"
                >
                  {c} Cuisine
                </span>
              ))}

              {searchResult.detectedIntent.spiceLevel !== 'Any' && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#fff3e0] text-[#e65100] border border-[#ffe0b2]">
                  🌶 {searchResult.detectedIntent.spiceLevel} Spice
                </span>
              )}
            </div>

            <div className="text-xs font-semibold text-[#6a5445]">
              Found <strong className="text-[#1a1c1c]">{searchResult.matches.length}</strong> matching home dishes
            </div>
          </div>

          {/* Matched Meals Grid */}
          {searchResult.matches.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#dcc1b1] space-y-2">
              <p className="text-sm font-bold text-[#1a1c1c]">No exact match found for your craving.</p>
              <p className="text-xs text-[#6a5445]">Try browsing today's fresh kitchen specials or adjust your keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResult.matches.slice(0, 6).map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white rounded-2xl border border-[#dcc1b1]/70 p-4 shadow-2xs hover:shadow-md hover:border-[#ff6d00]/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top match badge */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#e8f7ee] to-[#d4f2de] border border-[#a8e5be] text-[#0d6e35] text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0d6e35]" />
                        {meal.aiScore || 92}% Craving Match
                      </div>

                      <span className="text-xs font-extrabold text-[#1a1c1c] bg-[#faf8f6] px-2 py-0.5 rounded-md border border-[#e8ded6]">
                        ₹{meal.price}
                      </span>
                    </div>

                    {/* Meal Title & Cook */}
                    <h4 className="font-extrabold text-sm sm:text-base text-[#1a1c1c] group-hover:text-[#ff6d00] transition-colors line-clamp-1">
                      {meal.name}
                    </h4>

                    <button
                      type="button"
                      onClick={() => handleCookClick(meal.cookId)}
                      className="text-xs text-[#7d5843] hover:text-[#ff6d00] font-medium flex items-center gap-1 mt-0.5 transition-colors"
                    >
                      By <span className="font-bold underline decoration-dotted">{meal.cookName}</span>
                    </button>

                    {/* AI Explanation Callout */}
                    {meal.aiExplanation && (
                      <div className="mt-2.5 p-2 rounded-xl bg-[#faf6f2] border border-[#eee2d9] text-[11px] text-[#5e4739] leading-relaxed flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#ff6d00] shrink-0 mt-0.5" />
                        <span>{meal.aiExplanation}</span>
                      </div>
                    )}

                    {/* Highlight Tags */}
                    {meal.aiHighlightTags && meal.aiHighlightTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {meal.aiHighlightTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#f4ede6] text-[#6d4d3b]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-4 pt-3 border-t border-[#f0ebe6] flex items-center justify-between">
                    <span className="text-xs text-[#7a6455] font-medium">
                      🔥 {meal.calories || 380} kcal
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOrderClick(meal)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#ff6d00] to-[#e65100] text-white text-xs font-bold hover:brightness-105 active:scale-95 shadow-2xs transition-all flex items-center gap-1"
                    >
                      <span>Reserve Meal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
