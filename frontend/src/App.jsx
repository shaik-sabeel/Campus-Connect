// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages - assuming these files exist as per your explorer
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import EventListPage from './pages/EventListPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';        // NEW: Edit Event Page
import ProfilePage from './pages/ProfilePage';
import ClubListPage from './pages/ClubListPage';          // NEW: Club List Page
import ClubDetailsPage from './pages/ClubDetailsPage';    // NEW: Club Details Page
import CreateClubPage from './pages/CreateClubPage';      // NEW: Create Club Page
import EditClubPage from './pages/EditClubPage';          // NEW: Edit Club Page
import AdminPanelPage from './pages/AdminPanelPage';      // NEW: Admin Panel
import AllUsersPage from './pages/AllUsersPage';          // NEW: All Users (Admin)

import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';          // ADDED: For toast messages
import 'react-toastify/dist/ReactToastify.css';           // ADDED: Toastify CSS


function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    try {
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      console.error("Could not parse dark mode from localStorage, defaulting to false.", e);
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthProvider> {/* Ensure AuthProvider wraps the whole application */}
      <div className="min-h-screen">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Publicly Accessible Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Authenticated User Routes */}
            {/* The routes nested within <ProtectedRoute> will only be accessible if the user is logged in. */}
            {/* If the user tries to access these without login, they will be redirected to /login */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              <Route path="/events" element={<EventListPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route path="/create-event" element={<CreateEventPage />} />
              <Route path="/events/:id/edit" element={<EditEventPage />} /> {/* NEW EDIT EVENT ROUTE */}
              
              <Route path="/profile" element={<ProfilePage />} /> {/* User can view their own profile */}
              {/* Optional: <Route path="/profile/:userId" element={<ProfilePage viewOnly={true} />} /> for viewing others' profiles, would require a `userId` param */}

              <Route path="/clubs" element={<ClubListPage />} />          {/* NEW CLUB ROUTES */}
              <Route path="/clubs/:id" element={<ClubDetailsPage />} />
              <Route path="/create-club" element={<CreateClubPage />} />
              <Route path="/clubs/:id/edit" element={<EditClubPage />} /> {/* NEW EDIT CLUB ROUTE */}
            </Route>

            {/* Admin Specific Routes */}
            {/* The routes nested within <AdminProtectedRoute> will only be accessible if the user is logged in AND has the 'admin' role. */}
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminPanelPage />} />
              <Route path="/admin/users" element={<AllUsersPage />} /> {/* NEW ALL USERS ADMIN ROUTE */}
              {/* Special admin view for pending event/club details if accessed from admin dashboard: */}
              {/* It reuses EventDetailsPage, but signals it's in admin review mode */}
              <Route path="/admin/events/:id" element={<EventDetailsPage adminView={true} />} />
              <Route path="/admin/clubs/:id" element={<ClubDetailsPage adminView={true} />} />

            </Route>

            {/* TODO: Add a 404 Not Found Page */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </AnimatePresence>
        <Footer />
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme={darkMode ? "dark" : "light"} /> {/* ADDED: Toast container */}
      </div>
    </AuthProvider>
  );
}

export default App;