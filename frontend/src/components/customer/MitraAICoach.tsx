import React, { useState, useEffect, useTransition } from 'react';
import { useApp } from '../../context/AppContext';
import {
  aiService,
  HealthGoalItem,
  HEALTH_GOALS_CATALOG,
  MacroBreakdown,
  MealPhotoScanResult,
  MealRecommendationMatch,
} from '../../services/ai.service';
import { Meal } from '../../types';
import {
  Sparkles,
  Heart,
  Activity,
  Dumbbell,
  Flame,
  Smile,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,
  ChevronRight,
  RefreshCw,
  Info,
  ShieldCheck,
  Utensils,
  Zap,
  Award,
} from 'lucide-react';

export const MitraAICoach: React.FC = () => {
  const { meals, cooks, setSelectedMealForOrder, setSelectedCookId, setCustomerTab } = useApp();

  // Selected Health Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['diabetic-friendly', 'high-protein']);
  const [targetCalories, setTargetCalories] = useState<number>(1850);
  const [dietaryFilter, setDietaryFilter] = useState<string>('All');

  // Today's Intake Log State
  const [consumedCalories, setConsumedCalories] = useState<number>(1280);
  const [consumedProtein, setConsumedProtein] = useState<number>(54);

  // Recommendations & Goals Analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<MealRecommendationMatch[]>([]);
  const [coachTips, setCoachTips] = useState<string[]>([]);
  const [targetMacros, setTargetMacros] = useState({
    calories: 1850,
    proteinGrams: 110,
    carbsGrams: 200,
    fatGrams: 50,
  });

  // Photo Scan State
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [scannedResult, setScannedResult] = useState<MealPhotoScanResult | null>(null);
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState<string>('thali');

  const [_, startTransition] = useTransition();

  // Load and refresh AI goal recommendations
  const runGoalAnalysis = async (goals: string[], calories: number) => {
    setIsAnalyzing(true);
    try {
      const res = await aiService.analyzeGoals({
        healthGoals: goals,
        targetCalories: calories,
        dietaryPreference: dietaryFilter !== 'All' ? dietaryFilter : undefined,
        availableMeals: meals,
      });

      if (res.goalAnalysis) {
        startTransition(() => {
          setRecommendations(res.goalAnalysis?.recommendedMeals || []);
          setCoachTips(res.goalAnalysis?.coachTips || []);
          if (res.goalAnalysis?.targetMacros) {
            setTargetMacros(res.goalAnalysis.targetMacros);
          }
        });
      }
    } catch (err) {
      console.error('Goal analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    runGoalAnalysis(selectedGoals, targetCalories);
  }, [selectedGoals, targetCalories, dietaryFilter, meals]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) => {
      const exists = prev.includes(goalId);
      if (exists) {
        return prev.length > 1 ? prev.filter((g) => g !== goalId) : prev;
      } else {
        return [...prev, goalId];
      }
    });
  };

  const handleScanPhoto = async (sampleType: string) => {
    setIsScanningPhoto(true);
    setSelectedPhotoPreset(sampleType);
    try {
      // Simulate intelligent scan
      await new Promise((r) => setTimeout(r, 900));
      const result = await aiService.scanMealPhoto(sampleType);
      setScannedResult(result);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanningPhoto(false);
    }
  };

  const handleLogMeal = (macros: MacroBreakdown) => {
    setConsumedCalories((prev) => prev + macros.calories);
    setConsumedProtein((prev) => prev + macros.proteinGrams);
  };

  const handleOrderMeal = (mealMatch: MealRecommendationMatch) => {
    const fullMeal = meals.find((m) => m.id === mealMatch.mealId);
    if (fullMeal) {
      setSelectedMealForOrder(fullMeal);
    }
  };

  const handleViewCook = (cookId: string) => {
    setSelectedCookId(cookId);
    setCustomerTab('discover');
  };

  const calorieProgress = Math.min(100, Math.round((consumedCalories / targetCalories) * 100));
  const proteinProgress = Math.min(
    100,
    Math.round((consumedProtein / targetMacros.proteinGrams) * 100)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero AI Coach Banner */}
      <section className="bg-gradient-to-br from-[#1a1c1c] via-[#282a29] to-[#121413] text-white p-6 sm:p-8 rounded-3xl border border-[#3e4240] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#ff6d00]/30 via-[#00c853]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#ffdcc5] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6d00] animate-pulse" />
              Mitra AI Diet & Calorie Coach
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Health-Focused Homemade Nutrition.
            </h1>

            <p className="text-sm sm:text-base text-[#d1d5db] leading-relaxed">
              Tell Mitra AI your clinical goals (Diabetic, Low Sodium, High Protein, Weight Loss) or snap a meal picture. We curate home chefs using unrefined cold-pressed oils, rock salt, and balanced portioning.
            </p>
          </div>

          {/* Quick Target Tracker Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 w-full lg:w-80 shrink-0 space-y-4 shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold text-[#ffdcc5]">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#ff6d00]" /> Today's Calorie Goal
              </span>
              <span>{consumedCalories} / {targetCalories} kcal</span>
            </div>

            {/* Calorie Bar */}
            <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff6d00] to-[#00c853] transition-all duration-500 rounded-full"
                style={{ width: `${calorieProgress}%` }}
              />
            </div>

            {/* Protein Progress */}
            <div className="flex items-center justify-between text-xs font-bold text-[#e5e7eb]">
              <span className="flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[#38bdf8]" /> Protein Target
              </span>
              <span>{consumedProtein}g / {targetMacros.proteinGrams}g</span>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#38bdf8] to-[#818cf8] transition-all duration-500 rounded-full"
                style={{ width: `${proteinProgress}%` }}
              />
            </div>

            <p className="text-[11px] text-[#9ca3af] text-right">
              {targetCalories - consumedCalories > 0
                ? `${targetCalories - consumedCalories} kcal remaining today`
                : 'Calorie goal reached!'}
            </p>
          </div>
        </div>
      </section>

      {/* 1. Health Goals Selector & Macro Target Configurator */}
      <section className="bg-white rounded-3xl border border-[#dcc1b1]/60 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1a1c1c] tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#ff6d00]" />
              Select Your Health & Clinical Goals
            </h2>
            <p className="text-xs sm:text-sm text-[#6a5445] mt-1">
              Select all that apply. Mitra AI automatically recalculates macro splits and re-ranks daily kitchen menus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#6a5445]">Daily Budget:</span>
            <div className="flex items-center gap-1 bg-[#faf8f6] p-1 rounded-xl border border-[#e8ded6]">
              {[1500, 1850, 2200].map((cal) => (
                <button
                  key={cal}
                  type="button"
                  onClick={() => setTargetCalories(cal)}
                  className={`text-xs font-extrabold px-3 py-1.5 rounded-lg transition-all ${
                    targetCalories === cal
                      ? 'bg-[#ff6d00] text-white shadow-2xs'
                      : 'text-[#6a5445] hover:text-[#1a1c1c]'
                  }`}
                >
                  {cal} kcal
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Goals Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {HEALTH_GOALS_CATALOG.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleGoal(goal.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#fff7f0] to-[#fff] border-[#ff6d00] shadow-sm ring-2 ring-[#ff6d00]/20'
                    : 'bg-[#faf9f8] border-[#e6d8ce] hover:border-[#d4bcae] hover:bg-white text-[#564337]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected ? 'bg-[#ff6d00] text-white' : 'bg-[#f0ebe6] text-[#785947]'
                      }`}
                    >
                      {goal.id.includes('diabetic') && <Activity className="w-4 h-4" />}
                      {goal.id.includes('sodium') && <Heart className="w-4 h-4" />}
                      {goal.id.includes('protein') && <Dumbbell className="w-4 h-4" />}
                      {goal.id.includes('weight') && <Flame className="w-4 h-4" />}
                      {goal.id.includes('jain') && <Sparkles className="w-4 h-4" />}
                      {goal.id.includes('digestive') && <Smile className="w-4 h-4" />}
                    </div>
                    <span className="font-extrabold text-sm text-[#1a1c1c]">{goal.name}</span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#ff6d00] border-[#ff6d00] text-white'
                        : 'border-[#cfbcaf] bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <p className="text-xs text-[#6a5445] leading-relaxed line-clamp-2">
                  {goal.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Calculated Target Macro Split */}
        <div className="bg-[#faf8f6] rounded-2xl p-4 sm:p-5 border border-[#e8ded6] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#ff6d00]" />
            <span className="text-sm font-extrabold text-[#1a1c1c]">
              Target Macro Split for Your Goals:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold">
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              🥩 Protein: {targetMacros.proteinGrams}g
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              🌾 Carbs: {targetMacros.carbsGrams}g
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              🥑 Healthy Fats: {targetMacros.fatGrams}g
            </span>
          </div>
        </div>

        {/* AI Coach Live Insights */}
        {coachTips.length > 0 && (
          <div className="bg-gradient-to-r from-[#eff6ff] to-[#f0fdf4] p-4 rounded-2xl border border-[#bfdbfe] space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#1e40af] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#2563eb]" /> Mitra AI Clinical Notes
            </div>
            <ul className="space-y-1.5">
              {coachTips.map((tip, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-[#1e3a8a] flex items-start gap-2">
                  <span className="text-[#2563eb] font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 2. AI Meal Photo & Plate Scanner */}
      <section className="bg-white rounded-3xl border border-[#dcc1b1]/60 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6d00] uppercase tracking-wider mb-1">
              <Camera className="w-4 h-4" /> Instant Vision Recognition
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1a1c1c] tracking-tight">
              Snap & Analyze Any Meal Plate
            </h2>
            <p className="text-xs sm:text-sm text-[#6a5445] mt-0.5">
              Upload a meal photo or choose a preset plate. Mitra AI breaks down calories, glycemic index, and health safety.
            </p>
          </div>
        </div>

        {/* Presets & Photo upload trigger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <label className="text-xs font-bold text-[#564337] block">
              Select Sample Plate or Upload Photo:
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleScanPhoto('thali')}
                disabled={isScanningPhoto}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedPhotoPreset === 'thali'
                    ? 'bg-[#ffefe3] border-[#ff6d00] text-[#944a00] font-bold shadow-2xs'
                    : 'bg-[#faf9f8] border-[#e6d8ce] text-[#6a5445] hover:bg-white'
                }`}
              >
                <span className="text-2xl">🍱</span>
                <span className="text-xs font-bold">Gujarati Thali</span>
              </button>

              <button
                type="button"
                onClick={() => handleScanPhoto('paneer')}
                disabled={isScanningPhoto}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedPhotoPreset === 'paneer'
                    ? 'bg-[#ffefe3] border-[#ff6d00] text-[#944a00] font-bold shadow-2xs'
                    : 'bg-[#faf9f8] border-[#e6d8ce] text-[#6a5445] hover:bg-white'
                }`}
              >
                <span className="text-2xl">🧀</span>
                <span className="text-xs font-bold">Paneer Phulka</span>
              </button>

              <button
                type="button"
                onClick={() => handleScanPhoto('khichdi')}
                disabled={isScanningPhoto}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedPhotoPreset === 'khichdi'
                    ? 'bg-[#ffefe3] border-[#ff6d00] text-[#944a00] font-bold shadow-2xs'
                    : 'bg-[#faf9f8] border-[#e6d8ce] text-[#6a5445] hover:bg-white'
                }`}
              >
                <span className="text-2xl">🍲</span>
                <span className="text-xs font-bold">Khichdi Kadhi</span>
              </button>
            </div>

            <div className="relative border-2 border-dashed border-[#dcc1b1] hover:border-[#ff6d00] rounded-2xl p-6 text-center bg-[#faf9f8] hover:bg-white transition-all cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleScanPhoto(e.target.files[0].name);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-[#ffefe3] text-[#ff6d00] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#1a1c1c]">Snap or Upload Meal Photo</p>
                  <p className="text-[11px] text-[#7d5843]">Supports JPEG, PNG, WEBP from camera</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Scan Breakdown Result */}
          <div className="lg:col-span-7 bg-[#faf9f8] rounded-2xl border border-[#e6d8ce] p-5 sm:p-6 flex flex-col justify-between">
            {isScanningPhoto ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full border-4 border-[#ff6d00] border-t-transparent animate-spin" />
                <p className="text-sm font-extrabold text-[#1a1c1c]">Analyzing Ingredients & Glycemic Load...</p>
                <p className="text-xs text-[#7d5843]">Mitra AI Vision checking portion size and oil ratio</p>
              </div>
            ) : scannedResult ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e8f7ee] text-[#0d6e35] text-xs font-bold mb-1 border border-[#c4ebd1]">
                      ✓ {Math.round(scannedResult.confidence * 100)}% AI Recognition Confidence
                    </div>
                    <h3 className="font-black text-lg text-[#1a1c1c]">{scannedResult.detectedDish}</h3>
                  </div>

                  <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-white border border-[#dcc1b1] text-[#944a00] shadow-2xs">
                    Score: {scannedResult.macros.healthScore}/100
                  </span>
                </div>

                {/* Macro Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-3 rounded-xl border border-[#e8ded6] shadow-2xs">
                    <p className="text-[10px] uppercase font-bold text-[#8c6553]">Calories</p>
                    <p className="text-base font-extrabold text-[#1a1c1c]">
                      {scannedResult.macros.calories} <span className="text-xs font-normal">kcal</span>
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#e8ded6] shadow-2xs">
                    <p className="text-[10px] uppercase font-bold text-[#8c6553]">Protein</p>
                    <p className="text-base font-extrabold text-blue-600">
                      {scannedResult.macros.proteinGrams}g
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#e8ded6] shadow-2xs">
                    <p className="text-[10px] uppercase font-bold text-[#8c6553]">Carbs / Fiber</p>
                    <p className="text-base font-extrabold text-amber-600">
                      {scannedResult.macros.carbsGrams}g <span className="text-[10px] text-[#8c6553]">({scannedResult.macros.fiberGrams}g)</span>
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#e8ded6] shadow-2xs">
                    <p className="text-[10px] uppercase font-bold text-[#8c6553]">GI / Sodium</p>
                    <p className="text-sm font-extrabold text-emerald-600">
                      {scannedResult.macros.glycemicIndex} GI <span className="text-[10px]">({scannedResult.macros.sodiumMg}mg)</span>
                    </p>
                  </div>
                </div>

                {/* Ingredients Detected */}
                <div>
                  <p className="text-xs font-bold text-[#564337] mb-1.5">Detected Ingredients:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {scannedResult.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#e6d8ce] text-[#1a1c1c] font-medium"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mitra AI Note */}
                <div className="p-3 rounded-xl bg-[#fff7f0] border border-[#ffdcc5] text-xs text-[#7a4115] leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff6d00] shrink-0 mt-0.5" />
                  <span>{scannedResult.mitraNote}</span>
                </div>

                {/* Action button */}
                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleLogMeal(scannedResult.macros)}
                    className="px-4 py-2 rounded-xl bg-[#1a1c1c] text-white text-xs font-bold hover:bg-[#333] active:scale-95 transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#ff6d00]" />
                    Add to Today's Food Tracker
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                <Camera className="w-10 h-10 text-[#dcc1b1] mb-2" />
                <p className="text-sm font-bold text-[#1a1c1c]">Select a preset plate above or upload your meal photo</p>
                <p className="text-xs text-[#7d5843] mt-1">Instant nutritional breakdown powered by Mitra AI</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. AI Filtered & Recommended Dishes from Local Home Cooks */}
      <section className="bg-white rounded-3xl border border-[#dcc1b1]/60 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d6e35] uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-[#0d6e35]" /> Match Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1a1c1c] tracking-tight">
              Recommended Home Kitchens for Your Goals
            </h2>
            <p className="text-xs sm:text-sm text-[#6a5445] mt-0.5">
              Filtered specifically for {selectedGoals.join(', ')}. Fresh batches prepared with controlled salt & oil.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#6a5445]">Diet:</span>
            <select
              value={dietaryFilter}
              onChange={(e) => setDietaryFilter(e.target.value)}
              className="text-xs font-bold bg-[#faf8f6] border border-[#e8ded6] rounded-xl px-3 py-1.5 text-[#1a1c1c] focus:border-[#ff6d00] focus:outline-none"
            >
              <option value="All">All Diets</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Jain">100% Jain</option>
              <option value="High Protein">High Protein</option>
            </select>
          </div>
        </div>

        {isAnalyzing ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#ff6d00] animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#1a1c1c]">Matching kitchen specials with clinical macro constraints...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="p-8 text-center bg-[#faf9f8] rounded-2xl border border-dashed border-[#dcc1b1]">
            <p className="text-sm font-bold text-[#1a1c1c]">No active dishes match current strict filter.</p>
            <p className="text-xs text-[#6a5445] mt-1">Try toggling different goals or adjusting dietary preferences.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.slice(0, 6).map((item) => (
              <div
                key={item.mealId}
                className="bg-white rounded-2xl border border-[#dcc1b1]/70 p-5 shadow-2xs hover:shadow-md hover:border-[#ff6d00]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Match Pill */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#e8f7ee] to-[#d4f2de] border border-[#a8e5be] text-[#0d6e35] text-xs font-black">
                      <Sparkles className="w-3.5 h-3.5 text-[#0d6e35]" />
                      {item.matchScore}% Clinical Match
                    </div>

                    <span className="text-sm font-black text-[#1a1c1c]">
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Meal Name & Cook */}
                  <h4 className="font-black text-base text-[#1a1c1c] group-hover:text-[#ff6d00] transition-colors line-clamp-1">
                    {item.mealName}
                  </h4>

                  <button
                    type="button"
                    onClick={() => handleViewCook(item.cookId)}
                    className="text-xs text-[#7d5843] hover:text-[#ff6d00] font-medium flex items-center gap-1 mt-0.5 transition-colors"
                  >
                    By <span className="font-bold underline decoration-dotted">{item.cookName}</span>
                  </button>

                  {/* Match Reason Callout */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#faf6f2] border border-[#eee2d9] text-xs text-[#5e4739] leading-relaxed flex items-start gap-1.5">
                    <Info className="w-4 h-4 text-[#ff6d00] shrink-0 mt-0.5" />
                    <span>{item.matchReason}</span>
                  </div>

                  {/* Macro Mini Bar */}
                  <div className="mt-3 grid grid-cols-3 gap-1.5 bg-[#faf8f6] p-2 rounded-xl border border-[#e8ded6] text-center">
                    <div>
                      <span className="text-[10px] text-[#8c6553] font-bold block">Calories</span>
                      <span className="text-xs font-extrabold text-[#1a1c1c]">{item.macros.calories} kcal</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-600 font-bold block">Protein</span>
                      <span className="text-xs font-extrabold text-blue-700">{item.macros.proteinGrams}g</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-600 font-bold block">GI Score</span>
                      <span className="text-xs font-extrabold text-emerald-700">{item.macros.glycemicIndex} GI</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-5 pt-3.5 border-t border-[#f0ebe6] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0d6e35] bg-[#e8f7ee] px-2 py-0.5 rounded-md">
                    {item.dietary}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOrderMeal(item)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff6d00] to-[#e65100] text-white text-xs font-black hover:brightness-105 active:scale-95 shadow-2xs transition-all flex items-center gap-1.5"
                  >
                    <span>Reserve Slot</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
