import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Sun, Moon, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-sky-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-brand-500 dark:from-white dark:to-brand-400 bg-clip-text text-transparent">
              Placement<span className="text-brand-500 font-black">Portal</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 -mt-1">
              Enterprise SaaS
            </span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-brand-500 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-brand-500 transition-colors">How It Works</a>
          <a href="#stats" className="hover:text-brand-500 transition-colors">Statistics</a>
          <a href="#faq" className="hover:text-brand-500 transition-colors">FAQ</a>
        </nav>

        {/* Action Buttons & Theme Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(user.role === 'Administrator' ? '/admin/dashboard' : '/student/dashboard')}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
              >
                {user.role === 'Administrator' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                Dashboard
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
