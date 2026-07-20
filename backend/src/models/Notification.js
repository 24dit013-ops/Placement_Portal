import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'Application Submitted',
      'Status Updated',
      'Interview Scheduled',
      'Offer Released',
      'Job Deadline Reminder',
      'New Job Alert',
      'General'
    ],
    default: 'General'
  },
  read: { type: Boolean, default: false },
  linkUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
