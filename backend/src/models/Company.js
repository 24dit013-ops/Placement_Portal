import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logo: { type: String, default: '' },
  description: { type: String, default: '' },
  website: { type: String, default: '' },
  location: { type: String, required: true },
  industry: { type: String, required: true },
  employeeCount: { type: String, default: '500+ Employees' },
  rating: { type: Number, default: 4.5 },
  
  // HR & Recruiter Contact Details
  hrName: { type: String, default: '' },
  hrEmail: { type: String, default: '' },
  hrPhone: { type: String, default: '' },
  recruiterContact: { type: String, default: '' },

  // Hiring Process Steps
  hiringProcess: [{ type: String }],
  
  // Gallery images
  gallery: [{ type: String }],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Company = mongoose.model('Company', companySchema);
