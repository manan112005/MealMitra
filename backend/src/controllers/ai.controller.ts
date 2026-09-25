import { Request, Response } from 'express';
import { AIService } from '../services/ai.service.js';

export const analyzeNutrition = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mealName, description, healthGoals, targetCalories, dietaryPreference, availableMeals } = req.body;

    const singleEstimate = mealName
      ? AIService.estimateNutrition(mealName, description || '')
      : null;

    const goalAnalysis = healthGoals
      ? AIService.analyzeDietGoals({
          healthGoals,
          targetCalories: Number(targetCalories) || 2000,
          dietaryPreference,
          availableMeals: availableMeals || [],
        })
      : null;

    res.status(200).json({
      success: true,
      data: {
        estimate: singleEstimate,
        goalAnalysis,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to analyze nutrition profile',
      error: error.message,
    });
  }
};

export const searchMoodAndCraving = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, meals = [], cooks = [] } = req.body;

    if (!query) {
      res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
      return;
    }

    const result = AIService.matchMoodAndCraving(query, meals, cooks);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to execute AI mood & craving search',
      error: error.message,
    });
  }
};

export const getHealthGoalsCatalog = async (_req: Request, res: Response): Promise<void> => {
  try {
    const catalog = [
      {
        id: 'diabetic-friendly',
        name: 'Diabetic-Friendly',
        category: 'clinical',
        description: 'Low Glycemic Index, fiber-dense lentils & whole grains that prevent insulin spikes.',
        icon: 'Activity',
      },
      {
        id: 'low-sodium',
        name: 'Low Sodium / Heart Health',
        category: 'clinical',
        description: 'Cooked with minimal rock salt, enriched with fresh herbs, lemon & digestive spices.',
        icon: 'Heart',
      },
      {
        id: 'high-protein',
        name: 'High Protein / Muscle Recovery',
        category: 'fitness',
        description: 'Rich in paneer, dal portions, sprouts & curd for 20g+ clean protein per meal.',
        icon: 'Dumbbell',
      },
      {
        id: 'weight-loss',
        name: 'Weight Loss / Calorie Deficit',
        category: 'fitness',
        description: 'Controlled cold-pressed oil (<1 tsp), oil-free phulkas and satiating high-volume salads.',
        icon: 'Flame',
      },
      {
        id: 'jain-pure',
        name: '100% Jain Pure',
        category: 'lifestyle',
        description: 'Strictly zero onion, zero garlic, zero root vegetables prepared in clean home kitchens.',
        icon: 'Sparkles',
      },
      {
        id: 'light-digestive',
        name: 'Light & Easy Digest',
        category: 'lifestyle',
        description: 'Ayurvedic khichdi-kadhi, steamed moong, cooling chaas for sensitive digestion.',
        icon: 'Smile',
      },
    ];

    res.status(200).json({
      success: true,
      data: catalog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health goals',
      error: error.message,
    });
  }
};

export const clusterRoutes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stops = [], riderLocation } = req.body;
    const result = AIService.clusterMultiKitchenRoutes({ stops, riderLocation });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to optimize multi-kitchen cluster route',
      error: error.message,
    });
  }
};

export const predictThermal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { initialTempC, packedMinutesAgo, transitDurationMins, ambientTempC } = req.body;
    const result = AIService.predictThermalDecay({
      initialTempC: Number(initialTempC) || 80,
      packedMinutesAgo: Number(packedMinutesAgo) || 0,
      transitDurationMins: Number(transitDurationMins) || 20,
      ambientTempC: Number(ambientTempC) || 33,
    });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to calculate thermal food decay ETA',
      error: error.message,
    });
  }
};

export const optimizeTraffic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentZone, targetDestination, avoidPeakCongestion } = req.body;
    const result = AIService.optimizeTrafficReroute({
      currentZone,
      targetDestination,
      avoidPeakCongestion: avoidPeakCongestion !== false,
    });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to optimize traffic routes',
      error: error.message,
    });
  }
};

