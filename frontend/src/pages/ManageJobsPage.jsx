import React, { useState, useEffect } from 'react';
import { jobAPI, companyAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { TableSkeleton } from '../components/SkeletonLoader';
import { Plus, Briefcase, Building2, Trash2, Edit, X, CheckCircle2 } from 'lucide-react';

export default function ManageJobsPage() {
  const { triggerToast } = useNotifications();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: 'Bangalore, India',
    jobType: 'Full Time',
    role: 'Software Development Engineer',
    salaryPackage: '18.0 LPA',
    description: '',
    minCgpa: 7.0
  });

  const fetchJobsAndCompanies = async () => {
    try {
      const [jRes, cRes] = await Promise.all([
        jobAPI.getJobs({}),
        companyAPI.getCompanies()
      ]);
      if (jRes.data.success) setJobs(jRes.data.jobs);
      if (cRes.data.success) setCompanies(cRes.data.companies);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndCompanies();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const selectedComp = formData.company || (companies[0] ? companies[0]._id : '');
      const res = await jobAPI.createJob({
        ...formData,
        company: selectedComp,
        deadline: new Date(Date.now() + 30*24*60*60*1000)
      });
      if (res.data.success) {
        setJobs([res.data.job, ...jobs]);
        setShowAddModal(false);
        triggerToast('Job Created', 'New placement opening published successfully', 'success');
      }
    } catch (err) {
      triggerToast('Error', err.response?.data?.message || 'Failed to create job', 'error');
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      const res = await jobAPI.deleteJob(id);
      if (res.data.success) {
        setJobs(jobs.filter(j => j._id !== id));
        triggerToast('Deleted', 'Job opening removed', 'info');
      }
    } catch (err) {
      triggerToast('Error', 'Failed to delete job', 'error');
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Manage Job Openings
          </h1>
          <p className="text-xs text-slate-500">Post new job drives and update active recruitment requirements</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Post New Job Drive
        </button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-4 px-6">Job & Company</th>
                  <th className="py-4 px-6">Type & Location</th>
                  <th className="py-4 px-6">Salary Package</th>
                  <th className="py-4 px-6">Applicants</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs font-medium">
                {jobs.map((j) => (
                  <tr key={j._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{j.title}</div>
                      <div className="text-slate-500 text-xs">{j.company?.name || 'Company'}</div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="badge-sky">{j.jobType}</span>
                      <span className="text-xs text-slate-500 ml-2">{j.location}</span>
                    </td>

                    <td className="py-4 px-6 font-black text-emerald-500">
                      {j.salaryPackage}
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-700 dark:text-slate-300">
                      {j.applicantsCount || 0} Candidates
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteJob(j._id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateJob} className="bg-white dark:bg-slate-900 border rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold">Post New Job Opportunity</h3>
              <button type="button" onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Job Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Software Development Engineer"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Company</label>
                <select
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {companies.map(c => (
                    <option key={c._id} value={c._id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Salary Package</label>
                  <input
                    type="text"
                    required
                    value={formData.salaryPackage}
                    onChange={(e) => setFormData({ ...formData, salaryPackage: e.target.value })}
                    placeholder="24.0 LPA"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.minCgpa}
                    onChange={(e) => setFormData({ ...formData, minCgpa: parseFloat(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Job roles and expectations..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs shadow">Publish Job</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
