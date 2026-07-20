import React, { useState, useEffect } from 'react';
import { companyAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { CardSkeleton } from '../components/SkeletonLoader';
import {
  Building2,
  Plus,
  Trash2,
  Globe,
  Mail,
  Phone,
  User,
  Star,
  Layers,
  MapPin,
  X,
  ExternalLink,
  Users
} from 'lucide-react';

export default function ManageCompaniesPage() {
  const { triggerToast } = useNotifications();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    website: '',
    location: 'Bangalore, India',
    industry: 'Software / IT Services',
    employeeCount: '1,000+ Employees',
    rating: 4.8,
    hrName: '',
    hrEmail: '',
    hrPhone: '',
    recruiterContact: '',
    hiringProcess: 'Online Aptitude, Technical Round 1, Technical Round 2, HR Round'
  });

  const fetchCompanies = async () => {
    try {
      const res = await companyAPI.getCompanies();
      if (res.data.success) {
        setCompanies(res.data.companies);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const processSteps = formData.hiringProcess.split(',').map(s => s.trim());
      const res = await companyAPI.createCompany({
        ...formData,
        hiringProcess: processSteps
      });
      if (res.data.success) {
        setCompanies([res.data.company, ...companies]);
        setShowAddModal(false);
        triggerToast('Company Added', 'Company details and HR contacts added', 'success');
      }
    } catch (err) {
      triggerToast('Error', err.response?.data?.message || 'Failed to add company', 'error');
    }
  };

  const handleDeleteCompany = async (id) => {
    try {
      const res = await companyAPI.deleteCompany(id);
      if (res.data.success) {
        setCompanies(companies.filter(c => c._id !== id));
        triggerToast('Deleted', 'Company record removed', 'info');
      }
    } catch (err) {
      triggerToast('Error', 'Could not delete company', 'error');
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Company Directory & Recruiter Management
          </h1>
          <p className="text-xs text-slate-500">Manage hiring partner profiles, HR contacts & hiring workflows</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Enterprise Partner
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((c) => (
            <div key={c._id} className="glass-panel p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border p-1.5 flex items-center justify-center shrink-0">
                      {c.logo ? <img src={c.logo} alt={c.name} className="w-full h-full object-contain" /> : <Building2 className="w-6 h-6 text-brand-500" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">{c.name}</h3>
                      <p className="text-xs text-slate-500">{c.industry} • {c.location}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCompany(c._id)} className="p-1.5 text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="badge-sky">{c.employeeCount || '500+ Employees'}</span>
                  <span className="badge-amber flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> {c.rating || 4.8}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{c.description}</p>

                {/* HR & Recruiter Contact Card */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border space-y-1 text-xs">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Company HR Contact</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-500" /> {c.hrName || 'Ananya Roy (HR Head)'}
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {c.hrEmail || 'hr@company.com'}
                  </div>
                </div>

                {/* Hiring Process Steps */}
                {c.hiringProcess && c.hiringProcess.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hiring Process</span>
                    <div className="flex flex-wrap gap-1">
                      {c.hiringProcess.map((step, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                          {idx + 1}. {step}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              <a
                href={c.website || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 text-center block"
              >
                Visit Official Website
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateCompany} className="bg-white dark:bg-slate-900 border rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold">Add Hiring Partner Company</h3>
              <button type="button" onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Google India"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Industry</label>
                  <input
                    type="text"
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="Software / Cloud"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">HR Manager Name</label>
                  <input
                    type="text"
                    value={formData.hrName}
                    onChange={(e) => setFormData({ ...formData, hrName: e.target.value })}
                    placeholder="Ananya Roy"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">HR Email</label>
                  <input
                    type="email"
                    value={formData.hrEmail}
                    onChange={(e) => setFormData({ ...formData, hrEmail: e.target.value })}
                    placeholder="hr@company.com"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Hiring Process Steps (Comma separated)</label>
                <input
                  type="text"
                  value={formData.hiringProcess}
                  onChange={(e) => setFormData({ ...formData, hiringProcess: e.target.value })}
                  placeholder="Coding Round, Technical 1, Technical 2, HR Round"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Company Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of company..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs shadow">Add Company</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
