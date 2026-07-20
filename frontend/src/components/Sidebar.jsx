import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileCheck,
  Building2,
  Users,
  BarChart3,
  Bookmark,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'Administrator';

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Browse Jobs', path: '/student/jobs', icon: Briefcase },
    { name: 'My Applications', path: '/student/applications', icon: FileCheck },
    { name: 'Saved Opportunities', path: '/student/saved-jobs', icon: Bookmark },
    { name: 'Profile & Resume', path: '/student/profile', icon: User },
    { name: 'Account Settings', path: '/student/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Analytics Dashboard', path: '/admin/dashboard', icon: BarChart3 },
    { name: 'Manage Students', path: '/admin/students', icon: Users },
    { name: 'Job Openings', path: '/admin/jobs', icon: Briefcase },
    { name: 'Applications Pipeline', path: '/admin/applications', icon: FileCheck },
    { name: 'Company Directory', path: '/admin/companies', icon: Building2 },
    { name: 'Admin Settings', path: '/admin/settings', icon: Settings },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside
      className={`fixed left-0 top-0 z-30 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className={`flex items-center gap-3 overflow-hidden transition-all ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
            Placement<span className="text-brand-500">Portal</span>
          </span>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Pill Banner */}
      {!collapsed && (
        <div className="mx-4 mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${isAdmin ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-brand-500/10 text-brand-600 dark:text-brand-400'}`}>
            {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {user?.name || 'User'}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              {user?.role || 'Role'}
            </span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`
              }
              title={collapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Logout Button */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
