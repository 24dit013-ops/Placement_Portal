import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="glass-panel p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
        <AlertCircle className="w-12 h-12 text-brand-500 mx-auto" />
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-500">The requested page or route does not exist on the portal.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    </div>
  );
}
