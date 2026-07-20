import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { Notification } from '../models/Notification.js';

// @desc    Apply for a job (Student)
// @route   POST /api/applications/apply/:jobId
export const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const studentId = req.user._id;

    // Check if already applied
    const existing = await Application.findOne({ student: studentId, job: jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this position' });
    }

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job opportunity no longer active' });
    }

    const application = await Application.create({
      student: studentId,
      job: jobId,
      coverNote: req.body.coverNote || '',
      resumeUrl: req.user.resumeUrl || 'https://cloudinary.com/demo_resume.pdf',
      status: 'Pending',
      timeline: [{
        status: 'Pending',
        title: 'Application Submitted',
        description: 'Your application has been received and sent to the campus recruitment team.',
        updatedAt: new Date(),
        updatedBy: 'Student'
      }]
    });

    // Increment job applicants count
    job.applicantsCount += 1;
    await job.save();

    // Create Notification
    await Notification.create({
      recipient: studentId,
      title: 'Application Submitted',
      message: `You successfully applied for ${job.title} at ${job.company?.name || 'Company'}.`,
      type: 'Application Submitted',
      linkUrl: `/student/applications`
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Student Applications
// @route   GET /api/applications/my-applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Withdraw Application (Student)
// @route   DELETE /api/applications/:id/withdraw
export const withdrawApplication = async (req, res) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, student: req.user._id });
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application record not found' });
    }

    if (app.status === 'Selected' || app.status === 'Offer Released') {
      return res.status(400).json({ success: false, message: 'Cannot withdraw an accepted offer application' });
    }

    await Application.findByIdAndDelete(app._id);

    // Decrement applicants count
    await Job.findByIdAndUpdate(app.job, { $inc: { applicantsCount: -1 } });

    res.json({ success: true, message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Applications (Admin)
// @route   GET /api/applications/admin/all
export const getAllApplicationsAdmin = async (req, res) => {
  try {
    const { status, job, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (job) filter.job = job;

    let apps = await Application.find(filter)
      .populate('student')
      .populate({ path: 'job', populate: { path: 'company' } })
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      apps = apps.filter(a =>
        a.student?.name?.toLowerCase().includes(q) ||
        a.student?.email?.toLowerCase().includes(q) ||
        a.student?.branch?.toLowerCase().includes(q) ||
        a.job?.title?.toLowerCase().includes(q) ||
        a.job?.company?.name?.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: apps.length,
      applications: apps
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Application Status (Admin)
// @route   PUT /api/applications/admin/status/:id
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, interviewDate, interviewLocation, adminNotes } = req.body;
    const app = await Application.findById(req.params.id)
      .populate('student')
      .populate({ path: 'job', populate: { path: 'company' } });

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    app.status = status || app.status;
    if (interviewDate) app.interviewDate = new Date(interviewDate);
    if (interviewLocation) app.interviewLocation = interviewLocation;
    if (adminNotes) app.adminNotes = adminNotes;

    // Timeline descriptions
    const timelineTitles = {
      'Pending': 'Application Under Review',
      'Shortlisted': 'Shortlisted for Next Round',
      'Interview Scheduled': 'Interview Scheduled',
      'Selected': 'Candidate Selected',
      'Rejected': 'Application Process Concluded',
      'Offer Released': 'Official Offer Letter Released'
    };

    app.timeline.push({
      status: app.status,
      title: timelineTitles[app.status] || 'Status Updated',
      description: adminNotes || `Status updated to ${app.status} by Placement Officer.`,
      updatedAt: new Date(),
      updatedBy: req.user.name || 'Placement Cell'
    });

    await app.save();

    // Create real-time notification for Student
    let notifType = 'Status Updated';
    if (app.status === 'Interview Scheduled') notifType = 'Interview Scheduled';
    if (app.status === 'Offer Released') notifType = 'Offer Released';

    await Notification.create({
      recipient: app.student._id,
      title: `Application Update: ${app.status}`,
      message: `Your application status for ${app.job?.title} at ${app.job?.company?.name} has been updated to "${app.status}".`,
      type: notifType,
      linkUrl: `/student/applications`
    });

    res.json({
      success: true,
      message: `Application status updated to ${app.status}`,
      application: app
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
