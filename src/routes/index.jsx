import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layouts';
import { AdminProtectedRoute, LoadingScreen } from '@/components';

// Páginas de Administración (Lazy loaded para rendimiento óptimo)
const Login = lazy(() => import('../pages/Login/Login'));
const AuthSync = lazy(() => import('../pages/AuthSync'));
const AdminDashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const Users = lazy(() => import('../pages/Users/Users'));
const Events = lazy(() => import('../pages/Events/Events'));
const EventHistory = lazy(() => import('../pages/EventHistory/EventHistory'));
const B2BManager = lazy(() => import('../pages/B2B/B2BManager'));
const Config = lazy(() => import('../pages/Config/Config'));
const LuckySeatConfig = lazy(() => import('../pages/Config/LuckySeatConfig'));
const Database = lazy(() => import('../pages/Database/Database'));
const DatabaseMonitor = lazy(() => import('@/components/Admin/DatabaseMonitor/DatabaseMonitor'));
const Logs = lazy(() => import('../pages/Logs/Logs'));
const Venues = lazy(() => import('../pages/Venues/Venues'));
const AdminVenueMap = lazy(() => import('../pages/VenueMap/AdminVenueMap'));
const Ads = lazy(() => import('../pages/Ads/Ads'));
const SalesReports = lazy(() => import('../pages/SalesReports/SalesReports'));
const RestoreAudit = lazy(() => import('../pages/RestoreAudit/RestoreAudit'));
const LaikaManager = lazy(() => import('../pages/LaikaManager/LaikaManager'));
const AuthAudit = lazy(() => import('../pages/AuthAudit/AuthAudit'));
const EmailManager = lazy(() => import('../pages/EmailManager/EmailManager'));
const NewsTickerAdmin = lazy(() => import('../pages/NewsTicker/NewsTickerAdmin'));
const BigDataAnalytics = lazy(() => import('../pages/BigDataAnalytics'));
const MerchandiseApproval = lazy(() => import('../pages/MerchandiseApproval/index'));
const PushManager = lazy(() => import('../pages/PushManager/PushAdminPanel'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen label="CARGANDO MÓDULO" status="INICIALIZANDO COMPONENTES..." />}>
      <Routes>
        {/* Ruta de Autenticación de Administrador */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth-sync" element={<AuthSync />} />

        {/* Rutas Protegidas del Rol Administrador */}
        <Route
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />

          {/* Gestión y Usuarios */}
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/auth-audit" element={<AuthAudit />} />

          {/* Eventos y Ventas */}
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/history" element={<EventHistory />} />
          <Route path="/admin/b2b" element={<B2BManager />} />
          <Route path="/admin/sales" element={<SalesReports />} />
          <Route path="/admin/venues" element={<Venues />} />
          <Route path="/admin/venue-map" element={<AdminVenueMap />} />
          <Route path="/admin/venues/:venueId/rooms/:roomId/map" element={<AdminVenueMap />} />
          <Route path="/admin/merchandise" element={<MerchandiseApproval />} />

          {/* Marketing y Difusión */}
          <Route path="/admin/ads" element={<Ads />} />
          <Route path="/admin/laika" element={<LaikaManager />} />
          <Route path="/admin/emails" element={<EmailManager />} />
          <Route path="/admin/push-manager" element={<PushManager />} />
          <Route path="/admin/ticker" element={<NewsTickerAdmin />} />

          {/* Infraestructura y Sistema */}
          <Route path="/admin/database" element={<Database />} />
          <Route path="/admin/database-monitor" element={<DatabaseMonitor />} />
          <Route path="/admin/logs" element={<Logs />} />
          <Route path="/admin/config" element={<Config />} />
          <Route path="/admin/config/lucky-seat" element={<LuckySeatConfig />} />
          <Route path="/admin/restore-audit" element={<RestoreAudit />} />

          {/* Inteligencia y Analítica */}
          <Route path="/admin/big-data" element={<BigDataAnalytics />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
