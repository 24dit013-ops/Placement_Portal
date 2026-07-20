import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://placement-portal-v9j9.onrender.com/api';
  }
  return '/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach authorization token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for status handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired/invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// API Endpoints Mapping
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  changePassword: (data) => API.put('/auth/change-password', data)
};

export const studentAPI = {
  getSummary: () => API.get('/students/dashboard-summary'),
  updateProfile: (data) => API.put('/students/profile', data),
  uploadResume: (formData) => API.post('/students/resume', formData, {
    headers: { 'Content-Type': undefined }
  }),
  deleteResume: () => API.delete('/students/resume'),
  toggleSaveJob: (jobId) => API.post(`/students/saved-jobs/${jobId}`),
  getSavedJobs: () => API.get('/students/saved-jobs')
};

export const jobAPI = {
  getJobs: (params) => API.get('/jobs', { params }),
  getJobById: (id) => API.get(`/jobs/${id}`),
  createJob: (data) => API.post('/jobs', data),
  updateJob: (id, data) => API.put(`/jobs/${id}`, data),
  deleteJob: (id) => API.delete(`/jobs/${id}`)
};

export const applicationAPI = {
  apply: (jobId, data) => API.post(`/applications/apply/${jobId}`, data),
  getMyApplications: () => API.get('/applications/my-applications'),
  withdraw: (id) => API.delete(`/applications/${id}/withdraw`),
  getAllApplicationsAdmin: (params) => API.get('/applications/admin/all', { params }),
  updateStatus: (id, data) => API.put(`/applications/admin/status/${id}`, data)
};

export const companyAPI = {
  getCompanies: () => API.get('/companies'),
  getCompanyById: (id) => API.get(`/companies/${id}`),
  createCompany: (data) => API.post('/companies', data),
  updateCompany: (id, data) => API.put(`/companies/${id}`, data),
  deleteCompany: (id) => API.delete(`/companies/${id}`)
};

export const analyticsAPI = {
  getAdminSummary: () => API.get('/analytics/admin-summary')
};

export const notificationAPI = {
  getNotifications: () => API.get('/notifications'),
  markRead: (id) => API.put(`/notifications/${id}/read`),
  markAllRead: () => API.put('/notifications/read-all')
};

export default API;
