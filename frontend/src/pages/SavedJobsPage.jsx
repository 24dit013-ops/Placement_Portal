import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { CardSkeleton } from '../components/SkeletonLoader';
import { Bookmark, Building2, MapPin, IndianRupee, ArrowRight, Trash2 } from 'lucide-react';

export default function SavedJobsPage() {
  const { triggerToast } = useNotifications();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const res = await studentAPI.getSavedJobs();
      if (res.data.success) {
        setSavedJobs(res.data.savedJobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (jobId) => {
    try {
      const res = await studentAPI.toggleSaveJob(jobId);
      if (res.data.success) {
        setSavedJobs(savedJobs.filter(j => j._id !== jobId));
        triggerToast('Removed', 'Removed from saved opportunities', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Opportunities
          </h1>
          <p className="text-xs text-slate-500">Your bookmarked job listings</p>
        </div>
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          {savedJobs.length} Bookmarks
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Saved Jobs Yet</h3>
          <p className="text-xs text-slate-500">Bookmark positions while browsing jobs to review later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((j) => (
            <div key={j._id} className="glass-panel p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border flex items-center justify-center text-brand-500">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{j.title}</h3>
                      <p className="text-xs text-slate-500">{j.company?.name}</p>
                    </div>
                  </div>
                  <button onClick={() => handleRemove(j._id)} className="text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <span className="badge-sky">{j.jobType}</span>
                  <span className="badge-green font-bold">{j.salaryPackage}</span>
                </div>
              </div>

              <a
                href="/student/jobs"
                className="w-full py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-colors text-center block"
              >
                View Job & Apply
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
