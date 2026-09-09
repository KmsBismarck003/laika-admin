import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '../index';

export const AdminProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen label="AUTENTICANDO" status="VERIFICANDO PRIVILEGIOS DE ADMINISTRADOR..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Doble validación estricta de seguridad
  if (user.role !== 'admin' && !user.is_admin && !user.is_superuser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminProtectedRoute;
