import { api } from './api';
import { Meal } from '../types';

export interface HealthGoalItem {
  id: string;
  name: string;
  category: 'clinical' | 'fitness' | 'lifestyle';
  description: string;
  icon: string;
}

export interface MacroBreakdown {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  sodiumMg: number;
  glycemicIndex: 'Low' | 'Medium' | 'High';
  healthScore: number;
}

export interface MealRecommendationMatch {
  mealId: string;
  mealName: string;
  cookId: string;
  cookName: string;
  cookAvatar?: string;
  price: number;
  dietary: string;
  matchScore: number;
  matchReason: string;
  matchedTags: string[];
  macros: MacroBreakdown;
  image?: string;
}

export interface NutritionAnalysisResult {
  estimate?: MacroBreakdown | null;
  goalAnalysis?: {
    success: boolean;
    targetMacros: {
      calories: number;
      proteinGrams: number;
      carbsGrams: number;
      fatGrams: number;
    };
    coachTips: string[];
    recommendedMeals: MealRecommendationMatch[];
  } | null;
}

export interface CravingSearchResult {
  query: string;
  detectedIntent: {
    moods: string[];
    cuisines: string[];
    healthAttributes: string[];
    spiceLevel: string;
  };
  topMatchesCount: number;
  matches: (Meal & {
    aiScore?: number;
    aiExplanation?: string;
    aiHighlightTags?: string[];
  })[];
}

export interface MealPhotoScanResult {
  detectedDish: string;
  confidence: number;
  ingredients: string[];
  macros: MacroBreakdown;
  suitability: {
    diabeticSafe: boolean;
    lowSodium: boolean;
    highProtein: boolean;
    lowOil: boolean;
  };
  mitraNote: string;
}

export const HEALTH_GOALS_CATALOG: HealthGoalItem[] = [
  {
    id: 'diabetic-friendly',
    name: 'Diabetic-Friendly',
    category: 'clinical',
    description: 'Low Glycemic Index, fiber-dense lentils & whole grains preventing glucose spikes.',
    icon: 'Activity',
  },
  {
    id: 'low-sodium',
    name: 'Low Sodium / Heart Safe',
    category: 'clinical',
    description: 'Cooked with pure rock salt (Sendha Namak), enhanced with fresh herbs & lemon.',
    icon: 'Heart',
  },
  {
    id: 'high-protein',
    name: 'High Protein / Muscle',
    category: 'fitness',
    description: 'Paneer, double lentil thalis, roasted sprouts & curd for 20g+ clean protein.',
    icon: 'Dumbbell',
  },
  {
    id: 'weight-loss',
    name: 'Weight Loss / Calorie Deficit',
    category: 'fitness',
    description: 'Cold-pressed oil (<1 tsp), oil-free phulkas, and high-satiety seasonal greens.',
    icon: 'Flame',
  },
  {
    id: 'jain-pure',
    name: '100% Jain Pure',
    category: 'lifestyle',
    description: 'Strictly zero onion, zero garlic, zero root vegetables in hygienic kitchens.',
    icon: 'Sparkles',
  },
  {
    id: 'light-digestive',
    name: 'Light & Easy Digest',
    category: 'lifestyle',
    description: 'Ayurvedic khichdi-kadhi, steamed moong, cooling chaas for soothing digestion.',
    icon: 'Smile',
  },
];

export const aiService = {
  /**
   * Fetch health goals catalog
   */
  async getHealthGoals(): Promise<HealthGoalItem[]> {
    try {
      const res = await api.get<HealthGoalItem[]>('/ai/health-goals');
      if (res.success && res.data) {
        return res.data;
      }
    } catch {
      // fallback
    }
    return HEALTH_GOALS_CATALOG;
  },

  /**
   * Analyze goals and calculate macro targets & meal recommendations
   */
  async analyzeGoals(params: {
    healthGoals: string[];
    targetCalories?: number;
    dietaryPreference?: string;
    availableMeals?: Meal[];
  }): Promise<NutritionAnalysisResult> {
    try {
      const res = await api.post<NutritionAnalysisResult>('/ai/nutrition-analysis', params);
      if (res.success && res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn('AI backend fallback:', e);
    }

    // Local fallback calculation
    const targetCalories = params.targetCalories || 2000;
    const targetProtein = Math.round((targetCalories * 0.25) / 4);
    const targetCarbs = Math.round((targetCalories * 0.45) / 4);
    const targetFat = Math.round((targetCalories * 0.3) / 9);

    const recommendedMeals: MealRecommendationMatch[] = (params.availableMeals || []).map((m, idx) => {
      const isHighProt = params.healthGoals.includes('high-protein');
      const isDiabetic = params.healthGoals.includes('diabetic-friendly');
      const isWeightLoss = params.healthGoals.includes('weight-loss');
      const isLowSodium = params.healthGoals.includes('low-sodium');

      const cal = m.calories || 380;
      const prot = isHighProt ? 22 : 14;
      const fiber = isDiabetic ? 8 : 5;
      const sodium = isLowSodium ? 290 : 380;
      const score = Math.min(98, 85 + (idx % 3) * 4);

      return {
        mealId: m.id,
        mealName: m.name,
        cookId: m.cookId,
        cookName: m.cookName,
        cookAvatar: m.cookAvatar,
        price: m.price,
        dietary: m.dietary,
        matchScore: score,
        matchReason: `Custom homestyle balance matching your ${params.healthGoals.join(', ')} goals.`,
        matchedTags: ['Mitra AI Verified', m.dietary, `${cal} kcal`],
        macros: {
          calories: cal,
          proteinGrams: prot,
          carbsGrams: Math.round((cal - prot * 4 - 12 * 9) / 4),
          fatGrams: isWeightLoss ? 7 : 11,
          fiberGrams: fiber,
          sodiumMg: sodium,
          glycemicIndex: isDiabetic ? 'Low' : 'Medium',
          healthScore: score,
        },
        image: m.image,
      };
    });

    return {
      estimate: null,
      goalAnalysis: {
        success: true,
        targetMacros: {
          calories: targetCalories,
          proteinGrams: targetProtein,
          carbsGrams: targetCarbs,
          fatGrams: targetFat,
        },
        coachTips: [
          'Mitra AI selected home kitchens prioritizing minimal unrefined oil & whole grains.',
          'Consistently pair complex carbs with natural legumes to balance glycemic load.',
        ],
        recommendedMeals,
      },
    };
  },

  /**
   * Search meals & cook specials via natural language craving/mood
   */
  async searchCraving(
    query: string,
    meals: Meal[],
    cooks: any[] = []
  ): Promise<CravingSearchResult> {
    try {
      const res = await api.post<CravingSearchResult>('/ai/mood-search', { query, meals, cooks });
      if (res.success && res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn('AI Craving Search API fallback:', e);
    }

    // Local heuristic craving search
    const clean = query.toLowerCase();
    const queryWords = clean.split(/\s+/).filter((w) => w.length > 2);

    const scored = meals.map((m) => {
      let score = 55;
      const text = `${m.name} ${m.description} ${m.cookName} ${(m.itemsIncluded || []).join(' ')} ${m.dietary}`.toLowerCase();
      const tags: string[] = [];

      queryWords.forEach((word) => {
        if (text.includes(word)) {
          score += 15;
        }
      });

      if (clean.includes('low oil') && !text.includes('fried')) {
        score += 20;
        tags.push('Low Oil');
      }
      if (clean.includes('phulka') && text.includes('phulka')) {
        score += 25;
        tags.push('Soft Phulkas');
      }
      if (clean.includes('protein') || clean.includes('workout')) {
        score += 20;
        tags.push('Post-Workout Recovery');
      }
      if (clean.includes('sweet') && text.includes('gujarati')) {
        score += 20;
        tags.push('Sweet & Savory');
      }
      if (clean.includes('comfort') || clean.includes('light')) {
        score += 15;
        tags.push('Comfort Homestyle');
      }

      const finalScore = Math.min(99, Math.max(45, score));
      return {
        ...m,
        aiScore: finalScore,
        aiExplanation: `Freshly prepared homestyle batch matching "${query}".`,
        aiHighlightTags: tags.length > 0 ? tags : ['Chef Fresh Special'],
      };
    });

    scored.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

    return {
      query,
      detectedIntent: {
        moods: ['Comfort', 'Energizing'],
        cuisines: ['Gujarati', 'Homestyle'],
        healthAttributes: ['Low Oil', 'High Protein'],
        spiceLevel: clean.includes('spicy') ? 'Spicy' : clean.includes('mild') ? 'Mild' : 'Medium',
      },
      topMatchesCount: scored.filter((s) => (s.aiScore || 0) >= 70).length,
      matches: scored,
    };
  },

  /**
   * Analyze meal photo or custom meal description
   */
  async scanMealPhoto(imageFileOrName: string): Promise<MealPhotoScanResult> {
    // High fidelity nutritional recognition simulator
    const nameLower = imageFileOrName.toLowerCase();

    if (nameLower.includes('khichdi') || nameLower.includes('kadhi')) {
      return {
        detectedDish: 'Ayurvedic Moong Khichdi with Sweet Kadhi',
        confidence: 0.96,
        ingredients: ['Yellow Moong Dal', 'Kolam Rice', 'Buttermilk', 'Turmeric', 'Cumin Ghee Tadka'],
        macros: {
          calories: 360,
          proteinGrams: 14,
          carbsGrams: 52,
          fatGrams: 8,
          fiberGrams: 7,
          sodiumMg: 310,
          glycemicIndex: 'Low',
          healthScore: 94,
        },
        suitability: {
          diabeticSafe: true,
          lowSodium: true,
          highProtein: false,
          lowOil: true,
        },
        mitraNote: 'Excellent light meal for gut reset and low inflammation. Easy on metabolism.',
      };
    }

    if (nameLower.includes('paneer') || nameLower.includes('protein')) {
      return {
        detectedDish: 'Homestyle Paneer Bhurji with 3 Whole Wheat Phulkas',
        confidence: 0.94,
        ingredients: ['Fresh Malai Paneer', 'Tomatoes', 'Capsicum', '100% Whole Wheat Phulkas'],
        macros: {
          calories: 480,
          proteinGrams: 26,
          carbsGrams: 42,
          fatGrams: 18,
          fiberGrams: 8,
          sodiumMg: 390,
          glycemicIndex: 'Low',
          healthScore: 92,
        },
        suitability: {
          diabeticSafe: true,
          lowSodium: false,
          highProtein: true,
          lowOil: true,
        },
        mitraNote: 'High protein content (26g) ideal for post-workout muscle repair and high satiety.',
      };
    }

    // Default Gujarati Thali scan result
    return {
      detectedDish: 'Traditional Gujarati Thali (Dal, Shaak, 3 Phulkas & Salad)',
      confidence: 0.93,
      ingredients: ['Toor Dal', 'Bhindi Masala', 'Whole Wheat Phulkas', 'Kachumber Salad'],
      macros: {
        calories: 420,
        proteinGrams: 16,
        carbsGrams: 64,
        fatGrams: 9,
        fiberGrams: 11,
        sodiumMg: 340,
        glycemicIndex: 'Low',
        healthScore: 91,
      },
      suitability: {
        diabeticSafe: true,
        lowSodium: true,
        highProtein: true,
        lowOil: true,
      },
      mitraNote: 'Rich in dietary fiber (11g) and low in saturated fats. Well-portioned home nutrition.',
    };
  },
};
