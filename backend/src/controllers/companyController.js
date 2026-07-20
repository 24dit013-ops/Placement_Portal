import { Company } from '../models/Company.js';
import { Job } from '../models/Job.js';

// @desc    Get all companies
// @route   GET /api/companies
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json({ success: true, count: companies.length, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single company with active job postings
// @route   GET /api/companies/:id
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    const jobs = await Job.find({ company: company._id, status: 'Active' });
    res.json({ success: true, company, activeJobs: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create company (Admin)
// @route   POST /api/companies
export const createCompany = async (req, res) => {
  try {
    const {
      name, logo, description, website, location, industry,
      employeeCount, rating, hrName, hrEmail, hrPhone,
      recruiterContact, hiringProcess, gallery
    } = req.body;

    const company = await Company.create({
      name,
      logo: logo || '',
      description: description || '',
      website: website || '',
      location: location || 'Bangalore, India',
      industry: industry || 'Information Technology',
      employeeCount: employeeCount || '500+ Employees',
      rating: rating || 4.5,
      hrName: hrName || '',
      hrEmail: hrEmail || '',
      hrPhone: hrPhone || '',
      recruiterContact: recruiterContact || '',
      hiringProcess: hiringProcess || ['Online Aptitude', 'Technical Round 1', 'HR Interview'],
      gallery: gallery || [],
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      company
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update company (Admin)
// @route   PUT /api/companies/:id
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.json({ success: true, message: 'Company updated successfully', company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete company (Admin)
// @route   DELETE /api/companies/:id
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
