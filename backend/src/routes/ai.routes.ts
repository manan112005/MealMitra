import { Router } from 'express';
import {
  analyzeNutrition,
  searchMoodAndCraving,
  getHealthGoalsCatalog,
} from '../controllers/ai.controller.js';

const router = Router();

router.post('/nutrition-analysis', analyzeNutrition);
router.post('/mood-search', searchMoodAndCraving);
router.get('/health-goals', getHealthGoalsCatalog);

export default router;
