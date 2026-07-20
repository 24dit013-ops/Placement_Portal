import React, { useState, useEffect } from 'react';
import { jobAPI, applicationAPI, studentAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { CardSkeleton } from '../components/SkeletonLoader';
import {
  Search,
  Filter,
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  Send,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function JobsPage() {
  const { triggerToast } = useNotifications();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState([]);
  
  // Search & Filter state
  const [keyword, setKeyword] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [minPackage, setMinPackage] = useState('');
  const [sort, setSort] = useState('newest');

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobAPI.getJobs({
        keyword,
        jobType: selectedJobType,
        minPackage,
        sort
      });
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await studentAPI.getSavedJobs();
      if (res.data.success) {
        setSavedJobIds(res.data.savedJobs.map(j => j._id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, [keyword, selectedJobType, minPackage, sort]);

  const handleToggleSave = async (e, jobId) => {
    e.stopPropagation();
    try {
      const res = await studentAPI.toggleSaveJob(jobId);
      if (res.data.success) {
        if (res.data.saved) {
          setSavedJobIds([...savedJobIds, jobId]);
          triggerToast('Saved', 'Job bookmarked to saved list', 'success');
        } else {
          setSavedJobIds(savedJobIds.filter(id => id !== jobId));
          triggerToast('Removed', 'Job removed from saved list', 'info');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyJob) return;
    setApplying(true);
    try {
      const res = await applicationAPI.apply(applyJob._id, { coverNote });
      if (res.data.success) {
        triggerToast('Applied!', `Successfully applied for ${applyJob.title}`, 'success');
        setApplyJob(null);
        setCoverNote('');
      }
    } catch (err) {
      triggerToast('Application Error', err.response?.data?.message || 'Could not submit application', 'error');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Campus Job Opportunities
          </h1>
          <p className="text-xs text-slate-500">
            Browse high-paying roles from top global technology enterprises
          </p>
        </div>
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-950/60 dark:text-brand-300">
          {jobs.length} Active Positions
        </span>
      </div>

      {/* Multi-Filter Bar & Search Header */}
      <div className="glass-panel p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by job title, company, skills..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Job Type Filter */}
          <select
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
            className="py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">All Job Types</option>
            <option value="Full Time" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Full Time</option>
            <option value="Internship" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Internship</option>
            <option value="Remote" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Remote</option>
          </select>

          {/* Package Filter */}
          <select
            value={minPackage}
            onChange={(e) => setMinPackage(e.target.value)}
            className="py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Min Salary Package</option>
            <option value="10" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">10+ LPA</option>
            <option value="18" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">18+ LPA</option>
            <option value="25" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">25+ LPA</option>
            <option value="35" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">35+ LPA</option>
          </select>

          {/* Sort By */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="newest" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Newest First</option>
            <option value="highest-package" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Highest Package</option>
            <option value="deadline" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Closest Deadline</option>
          </select>

        </div>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Job Openings Match Your Filters</h3>
          <p className="text-xs text-slate-500">Try clearing your search filters or keyword query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((j) => {
            const isSaved = savedJobIds.includes(j._id);
            return (
              <div
                key={j._id}
                onClick={() => setSelectedJob(j)}
                className="glass-panel glass-panel-hover p-6 cursor-pointer flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                        {j.company?.logo ? (
                          <img src={j.company.logo} alt={j.company.name} className="w-full h-full object-contain" />
                        ) : (
                          <Building2 className="w-6 h-6 text-brand-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">{j.title}</h3>
                        <p className="text-xs text-slate-500">{j.company?.name || 'Enterprise'}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleToggleSave(e, j._id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isSaved
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-500'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="badge-sky">{j.jobType}</span>
                    <span className="badge-green font-black">{j.salaryPackage}</span>
                    <span className="badge-purple">{j.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {j.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {j.skillsRequired.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400">
                    Deadline: {new Date(j.deadline).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setApplyJob(j);
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
                  >
                    Apply Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border p-2 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-brand-500" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedJob.title}</h2>
                  <p className="text-xs text-slate-500">{selectedJob.company?.name} • {selectedJob.location}</p>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="flex gap-2">
                <span className="badge-green text-sm px-3 py-1 font-black">{selectedJob.salaryPackage}</span>
                <span className="badge-sky text-sm px-3 py-1">{selectedJob.jobType}</span>
                <span className="badge-purple text-sm px-3 py-1">Min CGPA: {selectedJob.minCgpa}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">Job Description</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{selectedJob.description}</p>
              </div>

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" /> {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setSelectedJob(null)} className="px-4 py-2 text-xs font-bold text-slate-500">Close</button>
              <button
                onClick={() => {
                  setApplyJob(selectedJob);
                  setSelectedJob(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-md"
              >
                Proceed to Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Form Modal */}
      {applyJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleApplySubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Apply for Position</h3>
                <p className="text-xs text-slate-500">{applyJob.title} at {applyJob.company?.name}</p>
              </div>
              <button type="button" onClick={() => setApplyJob(null)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 text-xs text-brand-800 dark:text-brand-300">
                🚀 Your cloud resume stored on Cloudinary will be attached automatically with this application.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Cover Note / Message to Hiring Manager (Optional)
                </label>
                <textarea
                  rows={4}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Explain why you are a great candidate for this role..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setApplyJob(null)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
              <button
                type="submit"
                disabled={applying}
                className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-md flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
