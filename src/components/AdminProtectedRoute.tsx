import React from 'react';
import { Navigate } from 'react-router-dom';
import { authManager } from '../services/authManager';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { token } = authManager.getTokens();
  const isAdmin = authManager.isAdmin();

  if (!token) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // User authenticated but not admin, redirect to main page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
