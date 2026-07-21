# Placement Portal – Enterprise MERN Stack Web Application

A modern, production-ready enterprise SaaS Placement Portal built using the **MERN Stack** (MongoDB Atlas, Express.js, React.js, Node.js), featuring a sky-blue SaaS design inspired by Stripe Dashboard, Linear, Notion, Vercel, and Shadcn UI.

---

## Key Features

### Dual Role Access Control (RBAC)
- **Student Role**: Browse opportunities, track application status timelines, upload PDF resumes directly to Cloudinary, save jobs, and receive real-time notifications.
- **Administrator Role**: Director analytics dashboard with Recharts visualizers, student database management with CSV exports, job posting CRUD, company directory management with recruiter contacts, and application status update pipelines.

### Student Dashboard Features
- **Placement Progress Tracker & Status**
- **Profile Completion %** & **Resume Score**
- **Recommended Opportunities** tailored to skills and branch
- **Upcoming Interviews Calendar & Countdown**
- **Cloud Resume Manager**: PDF upload to Cloudinary, live PDF preview modal, download, replace & delete options
- **Multi-Filter Job Explorer**: Filter by company, location, role, package range, job type, skills, and experience level
- **Application Status Audit Trail**: Timeline tracker (`Pending` → `Shortlisted` → `Interview Scheduled` → `Selected` / `Rejected` → `Offer Released`)

### Admin Dashboard & Analytics
- **Executive KPI Cards**: Total Students, Active Jobs, Applications, Selected Candidates, Placement %, Average & Highest Package
- **Interactive Recharts**:
  - Monthly Applications & Selections Area Chart
  - Branch-Wise Students vs Selection Bar Chart
  - Salary Package Distribution Pie Chart
  - Top Recruiters Leaderboard

### Real-Time Notification Center
- Slide-over Notification Drawer for alerts:
  - Application Submitted
  - Status Updated
  - Interview Scheduled
  - Offer Released
  - Job Deadline Reminder
  - New Job Alert

---

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Recharts, Lucide Icons, Axios, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), JWT Auth, bcryptjs, Multer, Cloudinary API, Helmet, CORS, Rate Limiting
- **Theme**: Sky-Blue & Slate Enterprise SaaS theme with Dark/Light Mode toggle

---

## Quick Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
*Note: Running `npm start` automatically connects to MongoDB and seeds initial demo data (Admin credentials: `admin@portal.edu` / `admin123`, Student credentials: `student@portal.edu` / `student123`).*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Credentials

| Role | Email | Password |
| --- | --- | --- |
| **Student** | `student@portal.edu` | `student123` |
| **Administrator** | `admin@portal.edu` | `admin123` |

---

## License
MIT License. Built for enterprise campus placement management.
