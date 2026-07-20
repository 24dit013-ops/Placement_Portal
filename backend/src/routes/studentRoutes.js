import express from 'express';
import {
  updateProfile,
  uploadResumeFile,
  deleteResumeFile,
  toggleSaveJob,
  getSavedJobs,
  getStudentDashboardSummary
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadResume } from '../config/cloudinary.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Student', 'Administrator'));

router.put('/profile', updateProfile);
router.post('/resume', uploadResume.single('resume'), uploadResumeFile);
router.delete('/resume', deleteResumeFile);
router.post('/saved-jobs/:jobId', toggleSaveJob);
router.get('/saved-jobs', getSavedJobs);
router.get('/dashboard-summary', getStudentDashboardSummary);

export default router;
