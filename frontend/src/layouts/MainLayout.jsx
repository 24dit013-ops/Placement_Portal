import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import NotificationDrawer from '../components/NotificationDrawer';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Collapsible Enterprise Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Top Header */}
      <TopHeader collapsed={collapsed} />

      {/* Slide-over Notification Drawer */}
      <NotificationDrawer />

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 pt-20 px-4 sm:px-6 lg:px-8 pb-12 ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
