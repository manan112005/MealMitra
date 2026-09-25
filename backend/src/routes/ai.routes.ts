import { Router } from 'express';
import {
  analyzeNutrition,
  searchMoodAndCraving,
  getHealthGoalsCatalog,
  clusterRoutes,
  predictThermal,
  optimizeTraffic,
} from '../controllers/ai.controller.js';

const router = Router();

router.post('/nutrition-analysis', analyzeNutrition);
router.post('/mood-search', searchMoodAndCraving);
router.get('/health-goals', getHealthGoalsCatalog);

// Delivery Fleet AI routes
router.post('/route-clustering', clusterRoutes);
router.post('/thermal-decay', predictThermal);
router.post('/traffic-optimizer', optimizeTraffic);

export default router;
