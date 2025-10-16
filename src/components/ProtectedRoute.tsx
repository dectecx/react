import React from 'react';
import { Navigate } from 'react-router-dom';
import { authManager } from '../services/authManager';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = authManager.getTokens();

  if (!token) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
