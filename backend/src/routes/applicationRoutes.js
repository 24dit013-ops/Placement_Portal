import express from 'express';
import {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getAllApplicationsAdmin,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Student routes
router.post('/apply/:jobId', authorize('Student'), applyForJob);
router.get('/my-applications', authorize('Student'), getMyApplications);
router.delete('/:id/withdraw', authorize('Student'), withdrawApplication);

// Admin routes
router.get('/admin/all', authorize('Administrator'), getAllApplicationsAdmin);
router.put('/admin/status/:id', authorize('Administrator'), updateApplicationStatus);

export default router;
