import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { TableSkeleton } from '../components/SkeletonLoader';
import {
  FileCheck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  ChevronRight,
  X,
  Trash2,
  Eye
} from 'lucide-react';

export default function ApplicationsPage() {
  const { triggerToast } = useNotifications();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [withdrawingId, setWithdrawingId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationAPI.getMyApplications();
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (id) => {
    try {
      const res = await applicationAPI.withdraw(id);
      if (res.data.success) {
        setApplications(applications.filter(a => a._id !== id));
        triggerToast('Withdrawn', 'Application record withdrawn', 'info');
        setWithdrawingId(null);
      }
    } catch (err) {
      triggerToast('Error', err.response?.data?.message || 'Could not withdraw', 'error');
    }
  };

  const statusSteps = ['Pending', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Offer Released'];

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Application Tracking Module
          </h1>
          <p className="text-xs text-slate-500">
            Monitor real-time evaluation status and interview schedules
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
          {applications.length} Submissions
        </span>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : applications.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-3">
          <FileCheck className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Job Applications Yet</h3>
          <p className="text-xs text-slate-500">Explore open opportunities and submit your first application.</p>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-850/50">
                  <th className="py-4 px-6">Company & Position</th>
                  <th className="py-4 px-6">Package</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6">Current Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border flex items-center justify-center text-brand-500 shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{app.job?.title}</div>
                          <div className="text-slate-500 text-xs">{app.job?.company?.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400">
                      {app.job?.salaryPackage || 'N/A'}
                    </td>

                    <td className="py-4 px-6 text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        app.status === 'Selected' || app.status === 'Offer Released'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : app.status === 'Interview Scheduled'
                          ? 'bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300'
                          : app.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {app.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold text-xs hover:bg-brand-100 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Timeline
                      </button>

                      {app.status !== 'Selected' && app.status !== 'Offer Released' && (
                        <button
                          onClick={() => setWithdrawingId(app._id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 transition-colors inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Withdraw
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Timeline Audit Trail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Application Timeline Tracker</h3>
                <p className="text-xs text-slate-500">{selectedApp.job?.title} at {selectedApp.job?.company?.name}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            {/* Visual Step Progress */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border space-y-6">
              <div className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Evaluation Audit Trail</div>
              
              <div className="relative border-l-2 border-brand-500/40 ml-4 space-y-6">
                {selectedApp.timeline && selectedApp.timeline.length > 0 ? (
                  selectedApp.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-brand-500 ring-4 ring-white dark:ring-slate-900" />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{step.title}</h4>
                          <span className="text-[10px] text-slate-400">{new Date(step.updatedAt).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{step.description}</p>
                        <span className="text-[10px] font-semibold text-brand-500">Updated by: {step.updatedBy}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-brand-500" />
                    <p className="text-xs text-slate-600">Application submitted and awaiting screening.</p>
                  </div>
                )}
              </div>
            </div>

            {selectedApp.interviewDate && (
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 text-xs space-y-1">
                <span className="font-extrabold text-purple-700 dark:text-purple-300">📅 Interview Scheduled Date</span>
                <p className="text-purple-900 dark:text-purple-200 font-bold">{new Date(selectedApp.interviewDate).toLocaleString()}</p>
                <p className="text-slate-500 text-[11px]">Location: {selectedApp.interviewLocation}</p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setSelectedApp(null)} className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">
                Close Tracker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Withdraw Modal */}
      {withdrawingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Withdraw Application?</h3>
            <p className="text-xs text-slate-500">Are you sure you want to withdraw this application? This action cannot be undone.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setWithdrawingId(null)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
              <button onClick={() => handleWithdraw(withdrawingId)} className="px-5 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-md">
                Confirm Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
