import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, ArrowRight, ShieldCheck, User, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [roleTab, setRoleTab] = useState('Student');
  const [email, setEmail] = useState('student@portal.edu');
  const [password, setPassword] = useState('student123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSwitch = (role) => {
    setRoleTab(role);
    if (role === 'Administrator') {
      setEmail('admin@portal.edu');
      setPassword('admin123');
    } else {
      setEmail('student@portal.edu');
      setPassword('student123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      if (res.user.role === 'Administrator') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            Placement<span className="text-brand-500">Portal</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Sign in to your Portal Account
        </h2>
        <p className="text-xs text-slate-500">Access campus recruitment opportunities & analytics</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-3xl p-8 space-y-6">
          
          {/* Role Toggle Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
            <button
              type="button"
              onClick={() => handleRoleSwitch('Student')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                roleTab === 'Student'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4" /> Student Login
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('Administrator')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                roleTab === 'Administrator'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin Login
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  placeholder="name@portal.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : `Sign in as ${roleTab}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Fill Demo Credentials</span>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => handleRoleSwitch('Student')}
                className="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 text-xs font-semibold border border-brand-200 dark:border-brand-800"
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch('Administrator')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 text-xs font-semibold border border-amber-200 dark:border-amber-800"
              >
                Admin Demo
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500">
            Don't have a student account?{' '}
            <Link to="/register" className="font-bold text-brand-500 hover:underline">
              Register Here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
