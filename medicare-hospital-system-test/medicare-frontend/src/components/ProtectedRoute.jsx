import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);
  if (!user?.token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}
