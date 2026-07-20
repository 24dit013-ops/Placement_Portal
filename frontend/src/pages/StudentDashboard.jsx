import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CardSkeleton } from '../components/SkeletonLoader';
import {
  Briefcase,
  FileCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  FileText,
  User,
  Bell,
  Building2,
  Star,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await studentAPI.getSummary();
        if (res.data.success) {
          setData(res.data.summary);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const s = data || {
    appliedCount: 0,
    availableJobsCount: 0,
    savedJobsCount: 0,
    selectionStatus: 'In Process',
    placementProgress: 'In Process',
    profileCompletion: 85,
    resumeScore: 80,
    resumeStatus: 'Uploaded',
    recentApplications: [],
    upcomingInterviews: [],
    recommendedJobs: [],
    recentNotifications: [],
    latestOffers: []
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner Card (Stripe/Linear Inspired) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-sky-400 p-8 text-white shadow-xl shadow-brand-500/20">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Final Year Placement Batch 2026
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-brand-100 text-sm font-medium leading-relaxed">
              Track your ongoing job applications, schedule technical interviews, and manage your cloud verified resume.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/student/jobs')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-brand-700 font-bold text-xs hover:bg-brand-50 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Explore Jobs ({s.availableJobsCount})
            </button>
            <button
              onClick={() => navigate('/student/profile')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-white font-bold text-xs hover:bg-white/25 transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Manage Resume
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Placement Progress Card */}
        <div className="glass-panel p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Placement Progress</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{s.placementProgress}</div>
            <div className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Campus Verification Ready
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Profile Completion % */}
        <div className="glass-panel p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Profile Completion</span>
            <div className="text-2xl font-black text-brand-500">{s.profileCompletion}%</div>
            <div className="w-28 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
              <div className="bg-brand-500 h-full rounded-full transition-all duration-500" style={{ width: `${s.profileCompletion}%` }} />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-500 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
        </div>

        {/* Resume Score */}
        <div className="glass-panel p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Resume Score</span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{s.resumeScore} / 100</div>
            <span className="text-[11px] font-medium text-slate-400">{s.resumeStatus}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-500 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Applications & Selection Status */}
        <div className="glass-panel p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Applied Positions</span>
            <div className="text-2xl font-black text-amber-500">{s.appliedCount} Applications</div>
            <span className="text-[11px] font-bold text-brand-500">{s.selectionStatus}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Grid Layout: Main Activity & Right Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Applications Timeline */}
          <div className="glass-panel p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Recent Applications</h3>
                <p className="text-xs text-slate-500">Track real-time status of submitted applications</p>
              </div>
              <Link to="/student/applications" className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {s.recentApplications.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">No applications submitted yet</p>
                <Link to="/student/jobs" className="mt-2 inline-block px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold">
                  Browse Active Job Openings
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {s.recentApplications.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between hover:border-brand-300 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-brand-500 shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {app.job?.title || 'Job Opening'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {app.job?.company?.name || 'Company'} • {app.job?.salaryPackage || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === 'Selected' || app.status === 'Offer Released'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : app.status === 'Interview Scheduled'
                        ? 'bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300'
                        : 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Jobs */}
          <div className="glass-panel p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Recommended Opportunities</h3>
                <p className="text-xs text-slate-500">Jobs tailored to your skills & branch</p>
              </div>
              <Link to="/student/jobs" className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1">
                Explore All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {s.recommendedJobs.map((job) => (
                <div
                  key={job._id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-400 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-600 border border-brand-200 dark:bg-brand-950/60 dark:text-brand-300">
                        {job.jobType}
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">{job.salaryPackage}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{job.title}</h4>
                    <p className="text-xs text-slate-500">{job.company?.name} • {job.location}</p>
                  </div>

                  <Link
                    to={`/student/jobs`}
                    className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors text-center block"
                  >
                    View & Apply
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-8">
          
          {/* Upcoming Interviews Calendar Widget */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-500">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Upcoming Interviews</h3>
                <p className="text-[11px] text-slate-500">Schedule & Meeting Countdown</p>
              </div>
            </div>

            {s.upcomingInterviews.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center">
                <p className="text-xs text-slate-500 font-medium">No upcoming interviews scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {s.upcomingInterviews.map((item) => (
                  <div key={item._id} className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300">{item.company}</span>
                      <span className="text-[10px] font-semibold text-purple-600 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded-full">
                        {new Date(item.interviewDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.role}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-500" /> {item.interviewLocation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Offers Banner */}
          {s.latestOffers.length > 0 && (
            <div className="glass-panel p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white space-y-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                <h3 className="text-sm font-extrabold">Congratulations!</h3>
              </div>
              {s.latestOffers.map((o, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                  <div className="text-xs font-bold">{o.company}</div>
                  <div className="text-sm font-black text-amber-200">{o.package}</div>
                  <div className="text-[10px] text-white/80">{o.role}</div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions Shortcuts */}
          <div className="glass-panel p-6 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/student/profile"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/50 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between transition-colors"
              >
                <span>Upload / Update PDF Resume</span>
                <ArrowRight className="w-4 h-4 text-brand-500" />
              </Link>
              <Link
                to="/student/saved-jobs"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/50 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between transition-colors"
              >
                <span>Saved Bookmarked Jobs</span>
                <ArrowRight className="w-4 h-4 text-brand-500" />
              </Link>
              <Link
                to="/student/settings"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/50 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between transition-colors"
              >
                <span>Account & Password Settings</span>
                <ArrowRight className="w-4 h-4 text-brand-500" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
