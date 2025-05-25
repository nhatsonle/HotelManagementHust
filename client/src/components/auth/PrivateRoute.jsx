import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/auth.service';

const PrivateRoute = ({ children }) => {
  const user = authService.getCurrentUser();

  if (!user) {
    // Redirect to sign-in page if not authenticated
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default PrivateRoute; 