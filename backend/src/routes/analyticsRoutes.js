import express from 'express';
import { getAdminAnalytics } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin-summary', protect, authorize('Administrator'), getAdminAnalytics);

export default router;
