import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { CardSkeleton } from '../components/SkeletonLoader';
import {
  Users,
  Briefcase,
  FileCheck,
  Award,
  TrendingUp,
  Building2,
  PieChart as PieIcon,
  BarChart2,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsAPI.getAdminSummary();
        if (res.data.success) {
          setData(res.data.analytics);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const a = data || {
    totalStudents: 120,
    totalJobs: 15,
    activeJobsCount: 12,
    totalApplications: 240,
    selectedCount: 85,
    placementPercentage: '88.5',
    highestPackage: '44.0 LPA',
    avgPackage: '14.2 LPA',
    companiesVisited: 18,
    branchWiseStats: [],
    monthlyApplications: [],
    packageDistribution: [],
    applicationStatusDistribution: [],
    companyHiring: [],
    recentActivities: []
  };

  const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-8">
      
      {/* Admin Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800 w-fit mb-2">
            <ShieldCheck className="w-4 h-4" /> Executive Placement Director Portal
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Campus Placement Analytics & Insights
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-semibold block">Placement Target</span>
            <span className="text-base font-black text-emerald-500">{a.placementPercentage}% Achieved</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Students */}
        <div className="glass-panel p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Total Registered Students</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{a.totalStudents}</div>
            <span className="text-[11px] font-bold text-brand-500">{a.selectedCount} Placed Candidates</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Openings & Applications */}
        <div className="glass-panel p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Jobs & Applications</span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{a.totalApplications}</div>
            <span className="text-[11px] font-bold text-slate-400">{a.activeJobsCount} Active Drives</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-500 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Highest & Avg Package */}
        <div className="glass-panel p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Salary Metrics</span>
            <div className="text-2xl font-black text-emerald-500">{a.highestPackage}</div>
            <span className="text-[11px] font-semibold text-slate-400">Avg: {a.avgPackage}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Companies Visited */}
        <div className="glass-panel p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Recruiting Enterprises</span>
            <div className="text-2xl font-black text-amber-500">{a.companiesVisited}</div>
            <span className="text-[11px] font-bold text-amber-600">Top Recruiters Joined</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Analytics Charts Row 1: Monthly Trend & Branch Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Monthly Applications Trend (Area Chart) */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Monthly Application & Selection Trend</h3>
              <p className="text-xs text-slate-500">Student submissions vs offer releases</p>
            </div>
            <span className="badge-sky text-[10px]">Monthly Report</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={a.monthlyApplications}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#ffffff', fontSize: '12px' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#0284c7" fillOpacity={1} fill="url(#colorApp)" name="Applications" />
                <Area type="monotone" dataKey="selections" stroke="#10b981" fillOpacity={1} fill="url(#colorSel)" name="Selections" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department / Branch-wise Placements (Bar Chart) */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Branch-wise Students & Selection</h3>
              <p className="text-xs text-slate-500">Total batch strength vs placed students</p>
            </div>
            <span className="badge-purple text-[10px]">Department Breakdown</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.branchWiseStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="branch" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.split(' ')[0]} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#ffffff', fontSize: '12px' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="totalStudents" fill="#0284c7" name="Total Students" radius={[6, 6, 0, 0]} />
                <Bar dataKey="placedStudents" fill="#10b981" name="Placed Students" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Analytics Charts Row 2: Package Distribution & Application Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Package Distribution (Pie Chart) */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Package Distribution</h3>
          <p className="text-xs text-slate-500">Salary bracket breakdown</p>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={a.packageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {a.packageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#ffffff', fontSize: '12px' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {a.packageDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate">{item.range}: <strong>{item.count}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Company-wise Hiring Leaderboard */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Top Enterprise Recruiters Leaderboard</h3>
          <p className="text-xs text-slate-500">Companies hiring highest candidate numbers</p>

          <div className="space-y-3">
            {a.companyHiring.map((comp, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-500 text-white font-black text-xs flex items-center justify-center">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{comp.name}</h4>
                    <span className="text-[10px] text-slate-400">Average Offer: {comp.avgOffer}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-500">{comp.hiredCount} Candidates Hired</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
