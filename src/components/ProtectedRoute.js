// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

const ProtectedRoute = ({ component: Component }) => {
  const { authData } = useAuth();

  return authData ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
