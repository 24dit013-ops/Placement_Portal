import React from 'react';
import { X, CheckCheck, Bell, Briefcase, Calendar, Award, AlertCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationDrawer() {
  const { notifications, unreadCount, isOpen, setIsOpen, markAsRead, markAllAsRead } = useNotifications();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'Interview Scheduled': return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'Offer Released': return <Award className="w-4 h-4 text-emerald-500" />;
      case 'New Job Alert': return <Briefcase className="w-4 h-4 text-brand-500" />;
      case 'Job Deadline Reminder': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default: return <Bell className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Notification Center</h2>
                <p className="text-xs text-slate-500">{unreadCount} unread messages</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No notifications yet</p>
                <p className="text-xs text-slate-400">Updates regarding your applications will appear here.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    !n.read
                      ? 'bg-brand-50/50 dark:bg-brand-950/30 border-brand-200/80 dark:border-brand-800/80 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                        <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
