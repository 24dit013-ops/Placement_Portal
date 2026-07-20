import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="glass-panel p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">403</h1>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Access Denied</h2>
        <p className="text-xs text-slate-500">You do not have Administrator permissions to view this route.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
