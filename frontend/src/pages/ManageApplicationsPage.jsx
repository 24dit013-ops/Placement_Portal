import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { TableSkeleton } from '../components/SkeletonLoader';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Edit,
  X,
  Send,
  Building2,
  User
} from 'lucide-react';

export default function ManageApplicationsPage() {
  const { triggerToast } = useNotifications();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const [status, setStatus] = useState('Shortlisted');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewLocation, setInterviewLocation] = useState('Google Meet');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await applicationAPI.getAllApplicationsAdmin({});
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

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setUpdating(true);
    try {
      const res = await applicationAPI.updateStatus(selectedApp._id, {
        status,
        interviewDate: interviewDate || undefined,
        interviewLocation,
        adminNotes
      });
      if (res.data.success) {
        setApplications(applications.map(a => a._id === selectedApp._id ? res.data.application : a));
        triggerToast('Status Updated', `Application moved to "${status}"`, 'success');
        setSelectedApp(null);
      }
    } catch (err) {
      triggerToast('Error', err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Application Pipeline Manager
          </h1>
          <p className="text-xs text-slate-500">Review candidate submissions, schedule interviews & release offers</p>
        </div>
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
          {applications.length} Applicants Pipeline
        </span>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-6">Job Position</th>
                  <th className="py-4 px-6">Current Status</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6 text-right">Pipeline Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs font-medium">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{app.student?.name || 'Candidate'}</div>
                      <div className="text-slate-500 text-xs">{app.student?.branch || 'Branch'} • CGPA: {app.student?.cgpa || 8.0}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 dark:text-white">{app.job?.title || 'Title'}</div>
                      <div className="text-slate-500 text-xs">{app.job?.company?.name || 'Company'}</div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        app.status === 'Selected' || app.status === 'Offer Released'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : app.status === 'Interview Scheduled'
                          ? 'bg-purple-50 text-purple-600 border border-purple-200'
                          : app.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}>
                        {app.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setStatus(app.status);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 shadow-sm"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Status Pipeline Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleStatusUpdate} className="bg-white dark:bg-slate-900 border rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold">Update Candidate Status</h3>
                <p className="text-xs text-slate-500">{selectedApp.student?.name} for {selectedApp.job?.title}</p>
              </div>
              <button type="button" onClick={() => setSelectedApp(null)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">Select Pipeline Status Stage</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none"
                >
                  <option value="Pending" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Pending Review</option>
                  <option value="Shortlisted" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Shortlisted</option>
                  <option value="Interview Scheduled" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Schedule Interview</option>
                  <option value="Selected" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Select Candidate</option>
                  <option value="Offer Released" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Release Official Offer</option>
                  <option value="Rejected" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Reject Application</option>
                </select>
              </div>

              {status === 'Interview Scheduled' && (
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 dark:text-purple-200 mb-1">Interview Date & Time</label>
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 dark:text-purple-200 mb-1">Location / Link</label>
                    <input
                      type="text"
                      value={interviewLocation}
                      onChange={(e) => setInterviewLocation(e.target.value)}
                      placeholder="Google Meet Link"
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Feedback / Internal Notes</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes visible to student in application timeline..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setSelectedApp(null)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
              <button type="submit" disabled={updating} className="px-5 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs shadow flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                {updating ? 'Saving...' : 'Update & Notify Candidate'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
