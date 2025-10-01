import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-red-600 dark:border-red-400 border-t-transparent" />
      </div>
    );
  }

  // If not authenticated OR user is not admin, redirect to login
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;