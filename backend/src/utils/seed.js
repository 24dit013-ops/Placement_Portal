import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Company } from '../models/Company.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { Notification } from '../models/Notification.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log('[Seed]: Waiting for database connection...');
      return;
    }

    // Check if database already has users
    const count = await User.countDocuments();
    if (count > 0) {
      console.log(`[Seed]: Database already contains ${count} user records. Skipping seed reset.`);
      return;
    }

    console.log('[Seed]: Populating database with enterprise campus placement records...');

    // Create Admin User
    const admin = await User.create({
      name: 'Dr. Rajesh Sharma',
      email: 'admin@portal.edu',
      password: 'admin123',
      role: 'Administrator',
      department: 'Director of Training & Placement',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    });

    // Create Student User
    const student = await User.create({
      name: 'Aashwin V',
      email: 'student@portal.edu',
      password: 'student123',
      role: 'Student',
      branch: 'Computer Science & Engineering',
      semester: '8th Semester',
      cgpa: 9.2,
      skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'TypeScript', 'System Design'],
      phone: '+91 99887 76655',
      bio: 'Final year CSE undergraduate passionate about building high-scalability web applications and cloud software systems.',
      linkedin: 'https://linkedin.com/in/aashwin-v',
      github: 'https://github.com/aashwin-v',
      portfolio: 'https://aashwin.dev',
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeOriginalName: 'Aashwin_Resume_SDE_2026.pdf',
      resumeSize: '1.45 MB',
      resumeUploadDate: new Date(),
      placementStatus: 'In Process',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'
    });

    // Seed Companies
    const companies = await Company.create([
      {
        name: 'Google India',
        logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        description: 'Global technological leader in Internet services, AI, Cloud computing, and Software systems.',
        website: 'https://careers.google.com',
        location: 'Bangalore / Hyderabad',
        industry: 'Software / Internet',
        employeeCount: '10,000+ Employees',
        rating: 4.9,
        hrName: 'Ananya Roy',
        hrEmail: 'ananya.roy@google.com',
        hrPhone: '+91 98123 45678',
        recruiterContact: 'university-recruiting-in@google.com',
        hiringProcess: ['Online Coding Challenge', 'Technical Round 1', 'Technical Round 2', 'HR Round'],
        createdBy: admin._id
      },
      {
        name: 'Microsoft',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
        description: 'Empowering every person and organization on the planet to achieve more with Cloud & AI innovation.',
        website: 'https://careers.microsoft.com',
        location: 'Redmond / Hyderabad / Noida',
        industry: 'Enterprise Software & Cloud',
        employeeCount: '8,000+ Employees',
        rating: 4.8,
        hrName: 'Sanjay Kumar',
        hrEmail: 'sanjay.k@microsoft.com',
        hrPhone: '+91 98234 56789',
        recruiterContact: 'ms-campus@microsoft.com',
        hiringProcess: ['Online Assessment', 'Technical Discussion', 'System Architecture', 'HR Round'],
        createdBy: admin._id
      },
      {
        name: 'Razorpay',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg',
        description: 'India\'s leading Payment Gateway and Financial Technology infrastructure company.',
        website: 'https://razorpay.com/careers',
        location: 'Bangalore, India',
        industry: 'FinTech / Payments',
        employeeCount: '3,000+ Employees',
        rating: 4.7,
        hrName: 'Meera Iyer',
        hrEmail: 'meera.iyer@razorpay.com',
        hrPhone: '+91 98345 67890',
        recruiterContact: 'campus@razorpay.com',
        hiringProcess: ['Machine Coding Round', 'Design & Code Review', 'Culture Fit Round'],
        createdBy: admin._id
      },
      {
        name: 'Amazon',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        description: 'Earth\'s most customer-centric company pioneering E-Commerce, AWS Cloud, and Logistics.',
        website: 'https://amazon.jobs',
        location: 'Bangalore / Hyderabad / Chennai',
        industry: 'E-Commerce & Cloud Computing',
        employeeCount: '20,000+ Employees',
        rating: 4.6,
        hrName: 'Vikram Malhotra',
        hrEmail: 'vikram.m@amazon.com',
        hrPhone: '+91 98456 78901',
        recruiterContact: 'aws-campus-hiring@amazon.com',
        hiringProcess: ['Online Assessment', 'Loop Interview 1', 'Loop Interview 2', 'Bar Raiser'],
        createdBy: admin._id
      }
    ]);

    // Seed Jobs
    const jobs = await Job.create([
      {
        title: 'Software Development Engineer I (SDE-1)',
        company: companies[0]._id,
        location: 'Bangalore, India',
        jobType: 'Full Time',
        role: 'Frontend / Fullstack Developer',
        experienceLevel: 'Fresher (2026 Grad)',
        salaryPackage: '44.0 LPA',
        numericPackage: 44.0,
        description: 'We are seeking world-class Software Development Engineers to design scalable microservices and frontend user interfaces.',
        requirements: ['Strong Data Structures & Algorithms', 'Proficiency in React.js and Node.js', 'Minimum CGPA 8.0/10.0'],
        responsibilities: ['Design and maintain frontend user experiences', 'Optimize web app latency'],
        skillsRequired: ['React.js', 'Node.js', 'TypeScript', 'Algorithms'],
        minCgpa: 8.0,
        allowedBranches: ['Computer Science', 'Information Technology'],
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'Active',
        postedBy: admin._id,
        applicantsCount: 42
      },
      {
        title: 'Software Engineer - Azure Cloud Systems',
        company: companies[1]._id,
        location: 'Hyderabad / Remote',
        jobType: 'Full Time',
        role: 'Backend Cloud Engineer',
        experienceLevel: 'Fresher / Entry Level',
        salaryPackage: '38.5 LPA',
        numericPackage: 38.5,
        description: 'Join Azure Cloud Core infrastructure team. Build distributed computing backends.',
        requirements: ['Experience with C++, Java, or Node.js', 'Knowledge of Cloud & Docker'],
        responsibilities: ['Write clean microservices', 'Investigate performance bottlenecks'],
        skillsRequired: ['Node.js', 'Distributed Systems', 'Cloud Computing'],
        minCgpa: 7.5,
        allowedBranches: ['Computer Science', 'Information Technology', 'Electronics'],
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'Active',
        postedBy: admin._id,
        applicantsCount: 35
      },
      {
        title: 'Full Stack FinTech Engineer',
        company: companies[2]._id,
        location: 'Bangalore, India',
        jobType: 'Full Time',
        role: 'Full Stack Developer',
        experienceLevel: 'Fresher',
        salaryPackage: '24.0 LPA',
        numericPackage: 24.0,
        description: 'Build mission-critical payment processing engines and merchant dashboards.',
        requirements: ['Hands-on experience with Node.js, Express, React, MongoDB'],
        responsibilities: ['Implement payment checkout widgets'],
        skillsRequired: ['React.js', 'Express.js', 'MongoDB', 'Node.js'],
        minCgpa: 7.0,
        allowedBranches: ['Computer Science', 'Information Technology'],
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: 'Active',
        postedBy: admin._id,
        applicantsCount: 28
      }
    ]);

    // Seed Applications
    await Application.create([
      {
        student: student._id,
        job: jobs[0]._id,
        status: 'Interview Scheduled',
        interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        interviewLocation: 'Google Meet (Link will be emailed 24h prior)',
        adminNotes: 'Candidate cleared online coding test with 100% score.',
        timeline: [
          { status: 'Pending', title: 'Application Submitted', description: 'Submitted via placement portal', updatedAt: new Date(Date.now() - 7*24*60*60*1000), updatedBy: 'Student' },
          { status: 'Shortlisted', title: 'Shortlisted for Round 1', description: 'Screened based on CGPA and resume score', updatedAt: new Date(Date.now() - 4*24*60*60*1000), updatedBy: 'Placement Cell' },
          { status: 'Interview Scheduled', title: 'Technical Interview Scheduled', description: 'Date fixed for Google Meet Technical Round 1', updatedAt: new Date(Date.now() - 1*24*60*60*1000), updatedBy: 'Placement Cell' }
        ]
      }
    ]);

    // Seed Notifications
    await Notification.create([
      {
        recipient: student._id,
        title: 'Interview Scheduled - Google SDE-1',
        message: 'Your Technical Round 1 interview has been scheduled for 3 days from today.',
        type: 'Interview Scheduled',
        linkUrl: '/student/applications'
      }
    ]);

    console.log('[Seed Database]: Database successfully populated with initial enterprise placement records!');
  } catch (error) {
    console.error('[Seed Error]:', error.message);
  }
};
