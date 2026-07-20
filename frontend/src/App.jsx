import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ForbiddenPage from './pages/ForbiddenPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import ProfilePage from './pages/ProfilePage';
import JobsPage from './pages/JobsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import SavedJobsPage from './pages/SavedJobsPage';
import SettingsPage from './pages/SettingsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageStudentsPage from './pages/ManageStudentsPage';
import ManageJobsPage from './pages/ManageJobsPage';
import ManageApplicationsPage from './pages/ManageApplicationsPage';
import ManageCompaniesPage from './pages/ManageCompaniesPage';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-sm">Loading Portal...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/403" element={<ForbiddenPage />} />

      {/* Student Portal Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['Student', 'Administrator']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="saved-jobs" element={<SavedJobsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Administrator Portal Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Administrator']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<ManageStudentsPage />} />
        <Route path="jobs" element={<ManageJobsPage />} />
        <Route path="applications" element={<ManageApplicationsPage />} />
        <Route path="companies" element={<ManageCompaniesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
