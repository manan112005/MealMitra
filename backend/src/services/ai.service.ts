export interface HealthGoal {
  id: string;
  name: string;
  category: 'clinical' | 'fitness' | 'lifestyle';
  description: string;
  icon: string;
  macroRatio?: { protein: number; carbs: number; fat: number };
}

export interface MacroBreakdown {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  sodiumMg: number;
  glycemicIndex: 'Low' | 'Medium' | 'High';
  healthScore: number; // 0 - 100
}

export interface MealRecommendationMatch {
  mealId: string;
  mealName: string;
  cookId: string;
  cookName: string;
  cookAvatar?: string;
  price: number;
  dietary: string;
  matchScore: number; // percentage 0-100%
  matchReason: string;
  matchedTags: string[];
  macros: MacroBreakdown;
  image?: string;
}

// Knowledge base of common home-cooked Indian dishes, ingredients, and nutritional profiles
const DISH_NUTRITION_DATABASE: Record<
  string,
  {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
    gi: 'Low' | 'Medium' | 'High';
    tags: string[];
    suitableFor: string[];
  }
> = {
  'dal dhokli': {
    calories: 380,
    protein: 14,
    carbs: 58,
    fat: 8,
    fiber: 9,
    sodium: 420,
    gi: 'Low',
    tags: ['High Fiber', 'Comfort Food', 'Traditional Gujarati', 'Low Fat'],
    suitableFor: ['diabetic', 'weight-loss', 'low-sodium', 'jain', 'comfort'],
  },
  'gujarati dal': {
    calories: 160,
    protein: 8,
    carbs: 24,
    fat: 3,
    fiber: 6,
    sodium: 310,
    gi: 'Low',
    tags: ['Sweet & Tangy', 'Low Oil', 'Digestive Light', 'Jain Option'],
    suitableFor: ['diabetic', 'low-sodium', 'weight-loss', 'jain', 'light'],
  },
  'phulka roti': {
    calories: 85,
    protein: 3,
    carbs: 18,
    fat: 0.8,
    fiber: 3,
    sodium: 45,
    gi: 'Medium',
    tags: ['100% Whole Wheat', 'No Oil', 'Soft & Light'],
    suitableFor: ['diabetic', 'weight-loss', 'low-sodium', 'high-protein'],
  },
  'bhakri': {
    calories: 130,
    protein: 3.5,
    carbs: 26,
    fat: 2,
    fiber: 4,
    sodium: 60,
    gi: 'Low',
    tags: ['Crispy Kathiyawadi', 'High Fiber Millet/Wheat'],
    suitableFor: ['diabetic', 'traditional', 'high-fiber'],
  },
  'sev tameta nu shaak': {
    calories: 240,
    protein: 6,
    carbs: 22,
    fat: 14,
    fiber: 4,
    sodium: 520,
    gi: 'Medium',
    tags: ['Kathiyawadi Classic', 'Tangy & Spicy', 'Comfort'],
    suitableFor: ['comfort', 'traditional'],
  },
  'paneer bhurji': {
    calories: 310,
    protein: 19,
    carbs: 8,
    fat: 21,
    fiber: 2.5,
    sodium: 380,
    gi: 'Low',
    tags: ['High Protein', 'Keto Friendly', 'Low Carb'],
    suitableFor: ['high-protein', 'muscle-gain', 'diabetic', 'post-workout'],
  },
  'khichdi': {
    calories: 260,
    protein: 9,
    carbs: 46,
    fat: 4,
    fiber: 5,
    sodium: 290,
    gi: 'Low',
    tags: ['Easy Digestion', 'Ayurvedic Comfort', 'Low Oil'],
    suitableFor: ['diabetic', 'low-sodium', 'weight-loss', 'light', 'comfort'],
  },
  'kadhi': {
    calories: 120,
    protein: 5,
    carbs: 14,
    fat: 4.5,
    fiber: 1,
    sodium: 320,
    gi: 'Low',
    tags: ['Probiotic Buttermilk', 'Digestive Spices'],
    suitableFor: ['light', 'comfort', 'diabetic'],
  },
  'moong dal chilla': {
    calories: 190,
    protein: 12,
    carbs: 24,
    fat: 4,
    fiber: 6,
    sodium: 250,
    gi: 'Low',
    tags: ['High Protein', 'Gluten-Free', 'Light Breakfast/Dinner'],
    suitableFor: ['high-protein', 'weight-loss', 'diabetic', 'post-workout'],
  },
  'palak paneer': {
    calories: 280,
    protein: 16,
    carbs: 10,
    fat: 18,
    fiber: 5,
    sodium: 360,
    gi: 'Low',
    tags: ['Iron Rich', 'High Protein', 'Keto Friendly'],
    suitableFor: ['high-protein', 'diabetic', 'muscle-gain'],
  },
  'mix veg sabzi': {
    calories: 160,
    protein: 4.5,
    carbs: 20,
    fat: 6,
    fiber: 6.5,
    sodium: 280,
    gi: 'Low',
    tags: ['Antioxidant Rich', 'Low Calorie', 'High Micronutrients'],
    suitableFor: ['weight-loss', 'diabetic', 'low-sodium', 'heart-health'],
  },
  'undhiyu': {
    calories: 390,
    protein: 11,
    carbs: 45,
    fat: 18,
    fiber: 10,
    sodium: 460,
    gi: 'Medium',
    tags: ['Authentic Seasonal Gujarati', 'Green Veggies & Muthiyas'],
    suitableFor: ['traditional', 'comfort'],
  },
  'masala chaas': {
    calories: 45,
    protein: 2.2,
    carbs: 4,
    fat: 1.5,
    fiber: 0.5,
    sodium: 180,
    gi: 'Low',
    tags: ['Probiotic Gut Health', 'Cooling & Low Calorie', 'Roasted Cumin'],
    suitableFor: ['weight-loss', 'diabetic', 'low-sodium', 'light', 'post-workout'],
  },
  'sprouts salad': {
    calories: 140,
    protein: 9,
    carbs: 22,
    fat: 1.2,
    fiber: 7,
    sodium: 120,
    gi: 'Low',
    tags: ['Live Enzymes', 'Raw High Protein', 'Zero Oil'],
    suitableFor: ['high-protein', 'weight-loss', 'diabetic', 'low-sodium', 'post-workout'],
  },
};

export class AIService {
  /**
   * Estimates nutrition & macros for a dish or photo description
   */
  static estimateNutrition(mealName: string, description: string = ''): MacroBreakdown {
    const text = `${mealName} ${description}`.toLowerCase();

    // Check for direct database matches or keywords
    let matchedDish = Object.keys(DISH_NUTRITION_DATABASE).find((key) =>
      text.includes(key)
    );

    if (matchedDish) {
      const data = DISH_NUTRITION_DATABASE[matchedDish];
      return {
        calories: data.calories,
        proteinGrams: data.protein,
        carbsGrams: data.carbs,
        fatGrams: data.fat,
        fiberGrams: data.fiber,
        sodiumMg: data.sodium,
        glycemicIndex: data.gi,
        healthScore: Math.min(
          98,
          Math.max(65, 80 + data.protein * 1.2 + data.fiber * 1.5 - data.fat * 0.8)
        ),
      };
    }

    // Heuristic estimation based on contents
    let calories = 380;
    let protein = 12;
    let carbs = 48;
    let fat = 11;
    let fiber = 6;
    let sodium = 380;
    let gi: 'Low' | 'Medium' | 'High' = 'Medium';

    if (text.includes('paneer') || text.includes('tofu') || text.includes('soya') || text.includes('egg') || text.includes('chicken')) {
      protein += 12;
      fat += 5;
      calories += 80;
      gi = 'Low';
    }
    if (text.includes('dal') || text.includes('chana') || text.includes('rajma') || text.includes('moong') || text.includes('sprout')) {
      protein += 6;
      fiber += 4;
      calories += 40;
      gi = 'Low';
    }
    if (text.includes('roti') || text.includes('phulka') || text.includes('chapati')) {
      carbs += 18;
      protein += 3;
      fiber += 2;
    }
    if (text.includes('puri') || text.includes('paratha') || text.includes('fried') || text.includes('ghee')) {
      fat += 9;
      calories += 110;
    }
    if (text.includes('salad') || text.includes('soup') || text.includes('boiled') || text.includes('steamed')) {
      calories -= 70;
      fat -= 4;
      fiber += 3;
      gi = 'Low';
    }
    if (text.includes('khichdi') || text.includes('porridge') || text.includes('oats')) {
      fat -= 3;
      calories -= 50;
      gi = 'Low';
    }

    const healthScore = Math.min(
      96,
      Math.max(60, Math.round(75 + protein * 1.1 + fiber * 1.4 - fat * 0.7))
    );

    return {
      calories: Math.round(calories),
      proteinGrams: Math.round(protein),
      carbsGrams: Math.round(carbs),
      fatGrams: Math.round(fat),
      fiberGrams: Math.round(fiber),
      sodiumMg: Math.round(sodium),
      glycemicIndex: gi,
      healthScore,
    };
  }

  /**
   * Health & Diet Coach: Analyzes goals & matches optimal meals/cooks
   */
  static analyzeDietGoals(params: {
    healthGoals: string[];
    targetCalories?: number;
    dietaryPreference?: string;
    availableMeals?: any[];
  }) {
    const { healthGoals = [], targetCalories = 2000, dietaryPreference, availableMeals = [] } = params;

    const normalizedGoals = healthGoals.map((g) => g.toLowerCase().replace(/\s+/g, '-'));

    // Compute tailored macro targets based on goals
    let targetProtein = Math.round((targetCalories * 0.2) / 4); // 20% protein default
    let targetCarbs = Math.round((targetCalories * 0.5) / 4); // 50% carbs default
    let targetFat = Math.round((targetCalories * 0.3) / 9); // 30% fat default

    if (normalizedGoals.some((g) => g.includes('protein') || g.includes('muscle') || g.includes('workout'))) {
      targetProtein = Math.round((targetCalories * 0.32) / 4);
      targetCarbs = Math.round((targetCalories * 0.43) / 4);
      targetFat = Math.round((targetCalories * 0.25) / 9);
    } else if (normalizedGoals.some((g) => g.includes('diabetic') || g.includes('keto') || g.includes('low-carb'))) {
      targetProtein = Math.round((targetCalories * 0.28) / 4);
      targetCarbs = Math.round((targetCalories * 0.37) / 4);
      targetFat = Math.round((targetCalories * 0.35) / 9);
    } else if (normalizedGoals.some((g) => g.includes('weight-loss') || g.includes('fat-loss'))) {
      targetProtein = Math.round((targetCalories * 0.3) / 4);
      targetCarbs = Math.round((targetCalories * 0.45) / 4);
      targetFat = Math.round((targetCalories * 0.25) / 9);
    }

    // Generate Mitra AI Coach Insights
    const coachTips: string[] = [];
    if (normalizedGoals.some((g) => g.includes('diabetic'))) {
      coachTips.push('Targeting complex fiber-rich lentils, low-GI whole wheat phulkas & low-oil preparations to keep post-meal blood glucose steady.');
    }
    if (normalizedGoals.some((g) => g.includes('low-sodium') || g.includes('heart'))) {
      coachTips.push('Highlighting home kitchens utilizing rock salt (Sendha Namak), fresh coriander, cumin & lemon for flavor rather than excess sodium.');
    }
    if (normalizedGoals.some((g) => g.includes('protein') || g.includes('muscle'))) {
      coachTips.push('Prioritizing double-lentil portions, fresh homemade paneer, roasted sprouts, and curd/chaas pairings for 25g+ protein per thali.');
    }
    if (normalizedGoals.some((g) => g.includes('weight-loss') || g.includes('low-oil'))) {
      coachTips.push('Filtered for oil-controlled homestyle curries (< 1 tsp cold pressed oil per serving) paired with oil-free phulkas.');
    }
    if (coachTips.length === 0) {
      coachTips.push('Curating balanced, nutrient-dense home-cooked meals tailored to keep your energy vibrant throughout the day.');
    }

    // Score & match available meals
    const scoredMeals: MealRecommendationMatch[] = availableMeals.map((meal) => {
      const macros = this.estimateNutrition(meal.name || '', meal.description || '');
      let matchScore = 78;
      const matchedTags: string[] = [];
      const reasons: string[] = [];

      // Dietary preference check
      if (dietaryPreference && meal.dietary) {
        if (dietaryPreference.toLowerCase() === meal.dietary.toLowerCase()) {
          matchScore += 10;
          matchedTags.push(`Diet: ${meal.dietary}`);
        } else if (dietaryPreference.toLowerCase() === 'jain' && meal.dietary.toLowerCase() !== 'jain') {
          matchScore -= 40;
        }
      }

      // Goal checks
      if (normalizedGoals.some((g) => g.includes('diabetic'))) {
        if (macros.glycemicIndex === 'Low') {
          matchScore += 12;
          matchedTags.push('Low GI / Diabetic Safe');
          reasons.push('Low glycemic whole-grain base prevents sugar spikes');
        }
      }

      if (normalizedGoals.some((g) => g.includes('low-sodium'))) {
        if (macros.sodiumMg < 350) {
          matchScore += 10;
          matchedTags.push('Low Sodium (<350mg)');
          reasons.push('Cooked with minimal rock salt and natural spices');
        }
      }

      if (normalizedGoals.some((g) => g.includes('protein') || g.includes('workout'))) {
        if (macros.proteinGrams >= 15) {
          matchScore += 14;
          matchedTags.push(`${macros.proteinGrams}g Protein`);
          reasons.push('Rich in plant/dairy protein for muscle recovery');
        }
      }

      if (normalizedGoals.some((g) => g.includes('weight-loss') || g.includes('low-oil'))) {
        if (macros.calories <= 450 && macros.fatGrams <= 10) {
          matchScore += 12;
          matchedTags.push('Low Calorie & Low Oil');
          reasons.push('Portion-balanced with finite healthy fats');
        }
      }

      matchScore = Math.min(99, Math.max(50, Math.round(matchScore)));

      const finalReason =
        reasons.length > 0
          ? reasons.join('. ') + '.'
          : `Balanced homestyle meal with ${macros.calories} kcal and ${macros.proteinGrams}g protein.`;

      return {
        mealId: meal.id,
        mealName: meal.name,
        cookId: meal.cookId,
        cookName: meal.cookName,
        cookAvatar: meal.cookAvatar,
        price: meal.price,
        dietary: meal.dietary,
        matchScore,
        matchReason: finalReason,
        matchedTags,
        macros,
        image: meal.image,
      };
    });

    // Sort by match score descending
    scoredMeals.sort((a, b) => b.matchScore - a.matchScore);

    return {
      success: true,
      targetMacros: {
        calories: targetCalories,
        proteinGrams: targetProtein,
        carbsGrams: targetCarbs,
        fatGrams: targetFat,
      },
      coachTips,
      recommendedMeals: scoredMeals,
    };
  }

  /**
   * Smart Craving & Mood Search Engine
   * Semantically maps natural language queries to cook menus and specials
   */
  static matchMoodAndCraving(query: string, meals: any[] = [], cooks: any[] = []) {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) {
      return {
        query,
        detectedIntent: {
          moods: [],
          cuisines: [],
          healthAttributes: [],
          spiceLevel: 'Any',
          dietary: 'Any',
        },
        matches: meals.slice(0, 10),
      };
    }

    // Cook name search support
    const matchingCookIds = new Set<string>();
    cooks.forEach((c) => {
      if (
        (c.name && cleanQuery.includes(c.name.toLowerCase())) ||
        (c.chefName && cleanQuery.includes(c.chefName.toLowerCase())) ||
        (c.specialties && c.specialties.some((s: string) => cleanQuery.includes(s.toLowerCase())))
      ) {
        matchingCookIds.add(c.id);
      }
    });

    // Intent & Keyword Dictionary
    const moodKeywords = {
      comfort: ['comfort', 'cozy', 'warm', 'home', 'mom', 'ghar', 'gharkakhana', 'simple', 'rainy', 'sick', 'soothing', 'nostalgic'],
      light: ['light', 'halka', 'low oil', 'no oil', 'easy', 'digest', 'fresh', 'cooling', 'clean', 'tummy'],
      energetic: ['workout', 'gym', 'heavy workout', 'post workout', 'protein', 'fitness', 'energy', 'power', 'muscle'],
      indulgent: ['sweet', 'rich', 'shahi', 'festive', 'party', 'tasty', 'chatpata', 'masaledar', 'crispy'],
      traditional: ['authentic', 'desi', 'kathiyawadi', 'gujarati', 'punjabi', 'rajasthani', 'south indian', 'village', 'marwadi'],
    };

    const detectedMoods: string[] = [];
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some((k) => cleanQuery.includes(k))) {
        detectedMoods.push(mood);
      }
    }

    // Detected dietary and health tags
    const healthAttributes: string[] = [];
    if (cleanQuery.includes('low oil') || cleanQuery.includes('no oil') || cleanQuery.includes('less oil') || cleanQuery.includes('bina tel')) {
      healthAttributes.push('Low Oil');
    }
    if (cleanQuery.includes('protein') || cleanQuery.includes('workout') || cleanQuery.includes('gym')) {
      healthAttributes.push('High Protein');
    }
    if (cleanQuery.includes('low sodium') || cleanQuery.includes('less salt') || cleanQuery.includes('kam namak')) {
      healthAttributes.push('Low Sodium');
    }
    if (cleanQuery.includes('diabetic') || cleanQuery.includes('sugar free') || cleanQuery.includes('low carb')) {
      healthAttributes.push('Diabetic Safe');
    }
    if (cleanQuery.includes('jain') || cleanQuery.includes('no onion') || cleanQuery.includes('no garlic')) {
      healthAttributes.push('Jain');
    }

    // Detected cuisines
    const detectedCuisines: string[] = [];
    if (cleanQuery.includes('gujarati') || cleanQuery.includes('kathiyawadi') || cleanQuery.includes('surati')) {
      detectedCuisines.push('Gujarati');
    }
    if (cleanQuery.includes('punjabi') || cleanQuery.includes('north indian')) {
      detectedCuisines.push('Punjabi');
    }
    if (cleanQuery.includes('rajasthani') || cleanQuery.includes('marwari') || cleanQuery.includes('marwadi')) {
      detectedCuisines.push('Rajasthani');
    }
    if (cleanQuery.includes('south indian') || cleanQuery.includes('dosa') || cleanQuery.includes('idli')) {
      detectedCuisines.push('South Indian');
    }

    // Detected spice level
    let detectedSpice = 'Any';
    if (cleanQuery.includes('spicy') || cleanQuery.includes('theekha') || cleanQuery.includes('chatpata') || cleanQuery.includes('hot')) {
      detectedSpice = 'Spicy';
    } else if (cleanQuery.includes('mild') || cleanQuery.includes('sweet') || cleanQuery.includes('meetha') || cleanQuery.includes('less spice') || cleanQuery.includes('kam theekha')) {
      detectedSpice = 'Mild';
    }

    // Scoring algorithm for each meal
    const scoredMeals = meals.map((meal) => {
      let score = 50; // base score
      const matchReasons: string[] = [];
      const tags: string[] = [];

      const mealText = `${meal.name} ${meal.description || ''} ${meal.cookName || ''} ${(meal.itemsIncluded || []).join(' ')} ${meal.dietary || ''}`.toLowerCase();

      // Query word overlap
      const queryWords = cleanQuery.split(/\s+/).filter((w) => w.length > 2);
      let wordMatches = 0;
      for (const word of queryWords) {
        if (mealText.includes(word)) {
          wordMatches++;
          score += 15;
        }
      }

      if (wordMatches > 0) {
        tags.push(`${wordMatches} keyword matches`);
      }

      // Exact dish phrases match
      if (cleanQuery.includes('dal') && mealText.includes('dal')) {
        score += 20;
        matchReasons.push('Authentic homemade slow-simmered dal');
      }
      if ((cleanQuery.includes('phulka') || cleanQuery.includes('roti') || cleanQuery.includes('chapati')) && (mealText.includes('phulka') || mealText.includes('roti'))) {
        score += 20;
        matchReasons.push('Freshly rolled soft phulkas included');
        tags.push('Soft Phulkas');
      }
      if (cleanQuery.includes('khichdi') && mealText.includes('khichdi')) {
        score += 35;
        matchReasons.push('Soothing Ayurvedic khichdi paired with kadhi');
        tags.push('Khichdi Kadhi');
      }
      if ((cleanQuery.includes('workout') || cleanQuery.includes('protein')) && (mealText.includes('protein') || mealText.includes('paneer') || mealText.includes('sprouts'))) {
        score += 25;
        matchReasons.push('High protein recovery meal (>18g protein)');
        tags.push('High Protein');
      }
      if (cleanQuery.includes('low oil') && !mealText.includes('fried') && !mealText.includes('puri')) {
        score += 20;
        matchReasons.push('Cooked with minimal cold-pressed oil');
        tags.push('Low Oil');
      }
      if (cleanQuery.includes('sweet') && mealText.includes('gujarati')) {
        score += 20;
        matchReasons.push('Traditional Gujarati mild sweetness');
        tags.push('Sweet & Savory');
      }
      if (cleanQuery.includes('bhakri') && mealText.includes('bhakri')) {
        score += 35;
        matchReasons.push('Traditional crispy Kathiyawadi bhakri');
        tags.push('Crispy Bhakri');
      }
      if (cleanQuery.includes('jain') && (meal.dietary === 'Jain' || mealText.includes('jain'))) {
        score += 30;
        tags.push('100% Jain Pure');
        matchReasons.push('Zero root vegetables, onion or garlic');
      }

      // Cuisine match
      for (const cuisine of detectedCuisines) {
        if (mealText.includes(cuisine.toLowerCase())) {
          score += 25;
          tags.push(cuisine);
          matchReasons.push(`Authentic ${cuisine} kitchen recipe`);
        }
      }

      // Cook match boost
      if (meal.cookId && matchingCookIds.has(meal.cookId)) {
        score += 30;
        tags.push('Chef Specialty Match');
        matchReasons.push(`Signature dish from ${meal.cookName || 'selected chef'}`);
      }

      // Cap match percentage
      const matchPercentage = Math.min(99, Math.max(45, Math.round(score)));

      const explanation =
        matchReasons.length > 0
          ? matchReasons.join('. ') + '.'
          : `Homestyle dish matching your craving for ${query}.`;

      return {
        ...meal,
        aiScore: matchPercentage,
        aiExplanation: explanation,
        aiHighlightTags: Array.from(new Set(tags)),
      };
    });

    // Sort descending by AI score
    scoredMeals.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

    return {
      query,
      detectedIntent: {
        moods: detectedMoods,
        cuisines: detectedCuisines,
        healthAttributes,
        spiceLevel: detectedSpice,
      },
      topMatchesCount: scoredMeals.filter((m) => (m.aiScore || 0) >= 70).length,
      matches: scoredMeals,
    };
  }
}
