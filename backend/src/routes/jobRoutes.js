import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);

// Admin restricted
router.post('/', protect, authorize('Administrator'), createJob);
router.put('/:id', protect, authorize('Administrator'), updateJob);
router.delete('/:id', protect, authorize('Administrator'), deleteJob);

export default router;
