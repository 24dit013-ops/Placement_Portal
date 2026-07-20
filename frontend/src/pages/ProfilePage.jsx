import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  FileText,
  Upload,
  Download,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Globe,
  Github,
  Linkedin,
  Sparkles,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { triggerToast } = useNotifications();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    branch: user?.branch || 'Computer Science & Engineering',
    semester: user?.semester || '8th Semester',
    cgpa: user?.cgpa || 9.2,
    skills: user?.skills ? user?.skills.join(', ') : 'React.js, Node.js, Express.js, MongoDB',
    bio: user?.bio || '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    portfolio: user?.portfolio || '',
    avatar: user?.avatar || ''
  });

  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const res = await studentAPI.updateProfile({
        ...formData,
        skills: skillsArray
      });

      if (res.data.success) {
        updateUser(res.data.user);
        triggerToast('Profile Updated', 'Your profile details have been saved successfully.', 'success');
      }
    } catch (err) {
      triggerToast('Update Failed', err.response?.data?.message || 'Could not update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadingResume(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      localStorage.setItem('local_resume_pdf', dataUrl);

      const data = new FormData();
      data.append('resume', selectedFile);

      try {
        const res = await studentAPI.uploadResume(data);
        if (res.data.success) {
          updateUser({
            ...res.data.user,
            resumeUrl: res.data.user.resumeUrl || dataUrl
          });
          setSelectedFile(null);
          triggerToast('Resume Uploaded', 'Your resume was uploaded successfully!', 'success');
        }
      } catch (err) {
        // Fallback for offline / stopped backend server: save Data URL in local user state
        updateUser({
          ...user,
          resumeUrl: dataUrl,
          resumeOriginalName: selectedFile.name,
          resumeSize: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
          resumeUploadDate: new Date()
        });
        setSelectedFile(null);
        triggerToast('Resume Saved', 'Resume saved for in-browser document preview!', 'success');
      } finally {
        setUploadingResume(false);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDeleteResume = async () => {
    try {
      const res = await studentAPI.deleteResume();
      if (res.data.success) {
        updateUser(res.data.user);
        triggerToast('Resume Deleted', 'Resume removed from portal.', 'info');
      }
    } catch (err) {
      triggerToast('Error', 'Could not delete resume', 'error');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Profile & Resume Management
          </h1>
          <p className="text-xs text-slate-500">
            Keep your student credentials and cloud resume up to date for campus drives
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-950/60 dark:text-brand-300">
            Profile Score: {user?.profileCompletion || 85}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Edit Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          
          <form onSubmit={handleSaveProfile} className="glass-panel p-8 space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white pb-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-500" />
              Personal & Academic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Branch</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option>Computer Science & Engineering</option>
                  <option>Information Technology</option>
                  <option>Electronics & Communication</option>
                  <option>Electrical & Electronics</option>
                  <option>Mechanical Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option>8th Semester</option>
                  <option>7th Semester</option>
                  <option>6th Semester</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">CGPA (out of 10)</label>
                <input
                  type="number"
                  step="0.1"
                  max="10"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Skills (Comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="React.js, Node.js, Express, MongoDB, Python"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Professional Bio</label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Brief summary of your academic background, technical focus, and projects..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5 text-blue-500" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Github className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" /> GitHub URL
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none"
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-brand-500" /> Portfolio URL
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>

        </div>

        {/* Right 1 Column: Cloud Resume Storage Module */}
        <div className="space-y-6">
          
          <div className="glass-panel p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-500" />
                Cloud Resume Storage
              </h3>
              <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200">
                Cloudinary
              </span>
            </div>

            {user?.resumeUrl ? (
              <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-brand-500 text-white shadow-md">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                        {user.resumeOriginalName || 'Resume.pdf'}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {user.resumeSize || '1.4 MB'} • Uploaded {user.resumeUploadDate ? new Date(user.resumeUploadDate).toLocaleDateString() : 'Today'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-200/60 dark:border-brand-800/60">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 font-bold text-xs hover:bg-brand-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {showPreview ? 'Hide Preview' : 'Preview PDF'}
                  </button>

                  <a
                    href={user.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleDeleteResume}
                    className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Resume
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl space-y-3">
                <Upload className="w-8 h-8 text-brand-500 mx-auto" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No Resume Uploaded</p>
                  <p className="text-[11px] text-slate-400">PDF, DOCX up to 10MB</p>
                </div>
              </div>
            )}

            {/* Upload / Replace Resume Form */}
            <form onSubmit={handleResumeUpload} className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {user?.resumeUrl ? 'Replace Current Resume' : 'Select PDF File'}
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 dark:file:bg-brand-950 dark:file:text-brand-300 hover:file:bg-brand-100"
              />
              <button
                type="submit"
                disabled={!selectedFile || uploadingResume}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                {uploadingResume ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploadingResume ? 'Uploading to Cloudinary...' : 'Upload Resume'}
              </button>
            </form>

          </div>

          {/* PDF Live Preview Modal / Viewer Container */}
          {showPreview && (user?.resumeUrl || localStorage.getItem('local_resume_pdf')) && (() => {
            const activePdfUrl = localStorage.getItem('local_resume_pdf') || user?.resumeUrl;
            return (
              <div className="glass-panel p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Live PDF Document Preview</span>
                  <button onClick={() => setShowPreview(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Close</button>
                </div>
                <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                  <object
                    data={activePdfUrl}
                    type="application/pdf"
                    className="w-full h-full border-0"
                  >
                    <embed
                      src={activePdfUrl}
                      type="application/pdf"
                      className="w-full h-full border-0"
                    />
                    <iframe
                      src={activePdfUrl}
                      title="Resume Preview"
                      className="w-full h-full border-0"
                    />
                  </object>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">File: {user?.resumeOriginalName || localStorage.getItem('local_resume_name') || 'Resume.pdf'}</span>
                  <a
                    href={activePdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-brand-500 hover:underline inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open Document in New Tab
                  </a>
                </div>
              </div>
            );
          })()}

        </div>

      </div>

    </div>
  );
}
