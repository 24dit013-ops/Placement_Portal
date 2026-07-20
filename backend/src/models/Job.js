import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  location: { type: String, required: true },
  jobType: { 
    type: String, 
    enum: ['Full Time', 'Internship', 'Contract', 'Remote', 'Hybrid'], 
    default: 'Full Time' 
  },
  role: { type: String, required: true },
  experienceLevel: { type: String, default: 'Fresher / Entry Level' },
  salaryPackage: { type: String, required: true }, // e.g. "18 LPA"
  numericPackage: { type: Number, default: 12 }, // for package stats / sorting
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  skillsRequired: [{ type: String }],
  minCgpa: { type: Number, default: 6.0 },
  allowedBranches: [{ type: String }],
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicantsCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Job = mongoose.model('Job', jobSchema);
