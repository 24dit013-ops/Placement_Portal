import express from 'express';
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);

// Admin restricted
router.post('/', protect, authorize('Administrator'), createCompany);
router.put('/:id', protect, authorize('Administrator'), updateCompany);
router.delete('/:id', protect, authorize('Administrator'), deleteCompany);

export default router;
