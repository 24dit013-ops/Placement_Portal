import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { Lock, Bell, User, Shield, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { triggerToast } = useNotifications();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      triggerToast('Mismatch', 'New passwords do not match', 'error');
      return;
    }
    setUpdating(true);
    try {
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      if (res.data.success) {
        triggerToast('Success', 'Password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      triggerToast('Error', err.response?.data?.message || 'Password update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account & Portal Settings
        </h1>
        <p className="text-xs text-slate-500">Manage password security & system alerts</p>
      </div>

      <div className="glass-panel p-6 space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b flex items-center gap-2">
          <Lock className="w-4 h-4 text-brand-500" /> Security & Change Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow"
          >
            {updating ? 'Updating Password...' : 'Update Security Password'}
          </button>
        </form>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-500" /> Notification Preferences
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500" />
            Email alerts when new jobs matching my branch are posted
          </label>
          <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500" />
            Real-time status updates on my job applications
          </label>
          <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500" />
            Interview scheduled calendar reminders
          </label>
        </div>
      </div>
    </div>
  );
}
