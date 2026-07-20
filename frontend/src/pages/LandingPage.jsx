import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  Briefcase,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const stats = [
    { label: 'Highest Package', value: '44.0 LPA', icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
    { label: 'Placement Rate', value: '94.2%', icon: Award, color: 'from-emerald-500 to-teal-500' },
    { label: 'Companies Visited', value: '180+', icon: Building2, color: 'from-brand-500 to-sky-400' },
    { label: 'Average Package', value: '14.2 LPA', icon: Sparkles, color: 'from-purple-500 to-indigo-500' }
  ];

  const features = [
    {
      title: 'Automated Application Tracking',
      description: 'Track your job applications step-by-step from screening to shortlisted, interview scheduled, and offer letter release.',
      icon: FileCheck
    },
    {
      title: 'Cloud Resume Storage',
      description: 'Upload your PDF resume once with Cloudinary integration, preview directly in-browser, and submit to top tech recruiters.',
      icon: Briefcase
    },
    {
      title: 'Real-time Recruiters Portal',
      description: 'Enterprise dashboard for administrators to manage student records, post high-paying jobs, and schedule campus drives.',
      icon: ShieldCheck
    },
    {
      title: 'Interactive Analytics & Charts',
      description: 'Visualize branch-wise placements, package distributions, monthly registrations, and company hiring stats.',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Sky Blue Ambient Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-300 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Next-Gen Campus Placement SaaS Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
            >
              Start Your Career Journey with{' '}
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-sky-400 bg-clip-text text-transparent">
                Confidence
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium"
            >
              Connect top university talent with premier global companies. Experience seamless job discovery, cloud resume management, real-time interview scheduling, and enterprise analytics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-500 text-white font-bold text-base hover:bg-brand-600 shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 group"
              >
                Student Registration
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-850 transition-all shadow-sm"
              >
                Portal Login
              </Link>
            </motion.div>

          </div>

          {/* SaaS Mockup Preview Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 p-3 shadow-2xl backdrop-blur-xl max-w-5xl mx-auto"
          >
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-white p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-400">placement.portal.edu/dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-400 font-semibold bg-brand-950/60 px-3 py-1 rounded-full border border-brand-800">
                  <ShieldCheck className="w-4 h-4" /> Live SaaS Engine
                </div>
              </div>

              {/* Sample Dashboard Preview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-xs text-slate-400">Total Placement Offers</span>
                  <div className="text-2xl font-black text-white mt-1">428 Offers</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-2">↑ 24% from last batch</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-xs text-slate-400">Average Salary Package</span>
                  <div className="text-2xl font-black text-brand-400 mt-1">14.2 LPA</div>
                  <div className="text-[11px] text-brand-300 font-semibold mt-2">Top: 44.0 LPA (Google)</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-xs text-slate-400">Cloud Resume Verified</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">98.5%</div>
                  <div className="text-[11px] text-emerald-300 font-semibold mt-2">Cloudinary Encrypted</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section id="stats" className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{item.value}</div>
                    <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enterprise Features Built for Students & Placement Cells
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3 font-medium text-sm">
              Designed with Linear & Stripe SaaS aesthetic standards for maximum efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-brand-400 transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-500 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Placement Portal Enterprise MERN Stack Application. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
