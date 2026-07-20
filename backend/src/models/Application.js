import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: {
    type: String,
    enum: ['Pending', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Offer Released'],
    default: 'Pending'
  },
  coverNote: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  interviewDate: { type: Date },
  interviewLocation: { type: String, default: '' },
  adminNotes: { type: String, default: '' },
  
  // Timeline audit trail for tracking status changes
  timeline: [{
    status: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String, default: 'Placement System' }
  }],

  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Application = mongoose.model('Application', applicationSchema);
