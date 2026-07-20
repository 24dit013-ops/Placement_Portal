import { Job } from '../models/Job.js';
import { Company } from '../models/Company.js';

// @desc    Get all jobs with multi-filter, search, and sort
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const {
      keyword,
      company,
      location,
      role,
      jobType,
      minPackage,
      sort
    } = req.query;

    const query = { status: 'Active' };

    // Search keyword
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { role: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
        { skillsRequired: { $elemMatch: { $regex: keyword, $options: 'i' } } }
      ];
    }

    if (company) query.company = company;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (role) query.role = { $regex: role, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (minPackage) query.numericPackage = { $gte: Number(minPackage) };

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'highest-package') sortOption = { numericPackage: -1 };
    if (sort === 'lowest-package') sortOption = { numericPackage: 1 };
    if (sort === 'deadline') sortOption = { deadline: 1 };

    const jobs = await Job.find(query).populate('company').sort(sortOption);

    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new job (Admin only)
// @route   POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const {
      title, company, location, jobType, role, experienceLevel,
      salaryPackage, numericPackage, description, requirements,
      responsibilities, skillsRequired, minCgpa, allowedBranches, deadline
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      jobType: jobType || 'Full Time',
      role,
      experienceLevel: experienceLevel || 'Fresher',
      salaryPackage,
      numericPackage: numericPackage || parseFloat(salaryPackage) || 10,
      description,
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      skillsRequired: skillsRequired || [],
      minCgpa: minCgpa || 6.0,
      allowedBranches: allowedBranches || ['Computer Science', 'Information Technology', 'Electronics'],
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30*24*60*60*1000),
      postedBy: req.user._id
    });

    const populatedJob = await Job.findById(job._id).populate('company');

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      job: populatedJob
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update job (Admin only)
// @route   PUT /api/jobs/:id
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('company');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    res.json({ success: true, message: 'Job posting updated', job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job (Admin only)
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }
    res.json({ success: true, message: 'Job posting deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
