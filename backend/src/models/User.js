import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['Student', 'Administrator'], default: 'Student' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },

  // Student specific fields
  branch: { type: String, default: 'Computer Science' },
  semester: { type: String, default: '8th Semester' },
  cgpa: { type: Number, default: 0.0 },
  skills: [{ type: String }],
  bio: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  portfolio: { type: String, default: '' },

  // Resume details
  resumeUrl: { type: String, default: '' },
  resumePublicId: { type: String, default: '' },
  resumeOriginalName: { type: String, default: '' },
  resumeSize: { type: String, default: '' },
  resumeUploadDate: { type: Date },

  // Placement metrics
  placementStatus: {
    type: String,
    enum: ['Unplaced', 'In Process', 'Placed'],
    default: 'Unplaced'
  },
  placedCompany: { type: String, default: '' },
  offeredPackage: { type: String, default: '' },

  // Admin specific fields
  department: { type: String, default: 'Placement Cell' },

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate profile completion percentage
userSchema.methods.getProfileCompletion = function() {
  if (this.role === 'Administrator') return 100;
  let score = 0;
  if (this.name) score += 10;
  if (this.email) score += 10;
  if (this.phone) score += 10;
  if (this.branch) score += 10;
  if (this.semester) score += 10;
  if (this.cgpa && this.cgpa > 0) score += 15;
  if (this.skills && this.skills.length > 0) score += 15;
  if (this.resumeUrl) score += 15;
  if (this.linkedin || this.github || this.portfolio) score += 5;
  return Math.min(score, 100);
};

export const User = mongoose.model('User', userSchema);
