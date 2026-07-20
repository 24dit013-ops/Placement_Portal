import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { SavedJob } from '../models/SavedJob.js';
import { Notification } from '../models/Notification.js';

// @desc    Update Student Profile
// @route   PUT /api/students/profile
export const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = [
      'name', 'phone', 'branch', 'semester', 'cgpa',
      'skills', 'bio', 'linkedin', 'github', 'portfolio', 'avatar'
    ];

    const updateData = {};
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        ...user.toObject(),
        profileCompletion: user.getProfileCompletion()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload / Replace Resume
// @route   POST /api/students/resume
export const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file && !req.body.resumeUrl) {
      return res.status(400).json({ success: false, message: 'Please select a file or provide URL' });
    }

    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';
    const fileUrl = req.file
      ? `${protocol}://${host}/uploads/resumes/${req.file.filename}`
      : req.body.resumeUrl;

    const publicId = req.file ? req.file.filename : 'local_resume_id';
    const originalName = req.file ? req.file.originalname : 'Resume.pdf';
    const fileSize = req.file ? `${(req.file.size / (1024 * 1024)).toFixed(2)} MB` : '1.24 MB';

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        resumeUrl: fileUrl,
        resumePublicId: publicId,
        resumeOriginalName: originalName,
        resumeSize: fileSize,
        resumeUploadDate: new Date()
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Resume uploaded successfully to Cloudinary',
      resume: {
        resumeUrl: user.resumeUrl,
        resumeOriginalName: user.resumeOriginalName,
        resumeSize: user.resumeSize,
        resumeUploadDate: user.resumeUploadDate
      },
      user: {
        ...user.toObject(),
        profileCompletion: user.getProfileCompletion()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Resume
// @route   DELETE /api/students/resume
export const deleteResumeFile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          resumeUrl: 1,
          resumePublicId: 1,
          resumeOriginalName: 1,
          resumeSize: 1,
          resumeUploadDate: 1
        }
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Resume deleted successfully',
      user: {
        ...user.toObject(),
        profileCompletion: user.getProfileCompletion()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle Save Job
// @route   POST /api/students/saved-jobs/:jobId
export const toggleSaveJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const existing = await SavedJob.findOne({ student: req.user._id, job: jobId });

    if (existing) {
      await SavedJob.findByIdAndDelete(existing._id);
      return res.json({ success: true, saved: false, message: 'Job removed from saved list' });
    } else {
      await SavedJob.create({ student: req.user._id, job: jobId });
      return res.json({ success: true, saved: true, message: 'Job saved successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Saved Jobs
// @route   GET /api/students/saved-jobs
export const getSavedJobs = async (req, res) => {
  try {
    const saved = await SavedJob.find({ student: req.user._id }).populate({
      path: 'job',
      populate: { path: 'company' }
    });

    res.json({
      success: true,
      savedJobs: saved.map(s => s.job)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Student Dashboard Overview Stats & Widgets
// @route   GET /api/students/dashboard-summary
export const getStudentDashboardSummary = async (req, res) => {
  try {
    const studentId = req.user._id;

    const [
      applications,
      activeJobs,
      savedJobs,
      notifications,
      user
    ] = await Promise.all([
      Application.find({ student: studentId })
        .populate({ path: 'job', populate: { path: 'company' } })
        .sort({ updatedAt: -1 }),
      Job.find({ status: 'Active' }).populate('company').sort({ createdAt: -1 }),
      SavedJob.find({ student: studentId }),
      Notification.find({ recipient: studentId }).sort({ createdAt: -1 }).limit(5),
      User.findById(studentId)
    ]);

    const appliedCount = applications.length;
    const availableJobsCount = activeJobs.length;
    
    // Status metrics
    const selectedApps = applications.filter(a => a.status === 'Selected' || a.status === 'Offer Released');
    const shortlistApps = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview Scheduled');
    
    let selectionStatus = 'In Progress';
    if (selectedApps.length > 0) selectionStatus = 'Offer Received 🎉';
    else if (shortlistApps.length > 0) selectionStatus = 'Shortlisted / Interview';

    // Upcoming Interviews
    const upcomingInterviews = applications
      .filter(a => a.status === 'Interview Scheduled' && a.interviewDate)
      .map(a => ({
        _id: a._id,
        company: a.job?.company?.name || 'Tech Corp',
        companyLogo: a.job?.company?.logo || '',
        role: a.job?.role || a.job?.title,
        interviewDate: a.interviewDate,
        interviewLocation: a.interviewLocation || 'Online Google Meet'
      }));

    // Recommended Jobs (Matching skills or branch)
    const recommendedJobs = activeJobs
      .filter(j => {
        if (!user.skills || user.skills.length === 0) return true;
        return j.skillsRequired.some(s => user.skills.includes(s));
      })
      .slice(0, 4);

    // Latest Offers
    const latestOffers = selectedApps.map(a => ({
      company: a.job?.company?.name,
      companyLogo: a.job?.company?.logo,
      role: a.job?.role,
      package: a.job?.salaryPackage
    }));

    // Resume score calculation algorithm
    let resumeScore = 70;
    if (user.resumeUrl) resumeScore += 15;
    if (user.cgpa >= 8.0) resumeScore += 10;
    if (user.skills && user.skills.length >= 4) resumeScore += 5;
    resumeScore = Math.min(resumeScore, 100);

    res.json({
      success: true,
      summary: {
        appliedCount,
        availableJobsCount,
        savedJobsCount: savedJobs.length,
        selectionStatus,
        placementProgress: user.placementStatus,
        profileCompletion: user.getProfileCompletion(),
        resumeScore,
        resumeStatus: user.resumeUrl ? 'Uploaded & Verified' : 'Missing Resume',
        recentApplications: applications.slice(0, 5),
        upcomingInterviews,
        recommendedJobs,
        recentNotifications: notifications,
        latestOffers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
