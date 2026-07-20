import React from 'react';

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/4" />
        </div>
      </div>
      <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-full" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-2/3" />
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse">
      <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-slate-50 dark:bg-slate-800/40 rounded-xl" />
      ))}
    </div>
  );
}
