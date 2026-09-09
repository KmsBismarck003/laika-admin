import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Shield,
  LayoutDashboard,
  BarChart3,
  FileText,
  Briefcase,
  Calendar,
  History,
  DollarSign,
  MapPin,
  Map,
  ShoppingBag,
  Megaphone,
  Bot,
  Mail,
  Bell,
  Sparkles,
  Database,
  Activity,
  Users,
  Lock,
  RotateCcw,
  Settings,
  Sliders,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
  Moon,
  Sun
} from 'lucide-react';
import { NotificationContainer, NotificationBell } from '@/components';
import './AdminLayout.css';

const ADMIN_NAVIGATION_SECTIONS = [
  {
    id: 'control',
    label: 'Panel Principal',
    items: [
      { path: '/admin', label: 'Vista General', icon: LayoutDashboard },
      { path: '/admin/big-data', label: 'Big Data & ML', icon: BarChart3 },
      { path: '/admin/logs', label: 'Historial de Logs', icon: FileText },
    ]
  },
  {
    id: 'eventos',
    label: 'Ventas y Eventos',
    items: [
      { path: '/admin/b2b', label: 'B2B (Contratos)', icon: Briefcase },
      { path: '/admin/events', label: 'Gestión de Eventos', icon: Calendar },
      { path: '/admin/history', label: 'Historial Eventos', icon: History },
      { path: '/admin/sales', label: 'Reportes de Ventas', icon: DollarSign },
      { path: '/admin/venues', label: 'Recintos y Sedes', icon: MapPin },
      { path: '/admin/venue-map', label: 'Diseño de Mapas', icon: Map },
      { path: '/admin/merchandise', label: 'Aprobación Tienda', icon: ShoppingBag },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing y Difusión',
    items: [
      { path: '/admin/ads', label: 'Publicidad y Banners', icon: Megaphone },
      { path: '/admin/laika', label: 'Laika Agent IA', icon: Bot },
      { path: '/admin/emails', label: 'Email Marketing', icon: Mail },
      { path: '/admin/push-manager', label: 'Central Push', icon: Bell },
      { path: '/admin/ticker', label: 'Cinta de Noticias', icon: Sparkles },
    ]
  },
  {
    id: 'sistema',
    label: 'Seguridad y Sistema',
    items: [
      { path: '/admin/database', label: 'Base de Datos', icon: Database },
      { path: '/admin/database-monitor', label: 'Monitor Telemetría', icon: Activity },
      { path: '/admin/users', label: 'Gestión Usuarios', icon: Users },
      { path: '/admin/auth-audit', label: 'Auditoría Accesos', icon: Lock },
      { path: '/admin/restore-audit', label: 'Auditoría Restore', icon: RotateCcw },
      { path: '/admin/config', label: 'Configuración', icon: Settings },
      { path: '/admin/config/lucky-seat', label: 'Lucky Seat', icon: Sliders },
    ]
  }
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Filtrar navegación si hay término de búsqueda
  const filteredSections = ADMIN_NAVIGATION_SECTIONS.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  // Determinar título de página actual
  const getCurrentPageTitle = () => {
    for (const section of ADMIN_NAVIGATION_SECTIONS) {
      const found = section.items.find(item => item.path === location.pathname);
      if (found) return found.label;
    }
    if (location.pathname.startsWith('/admin/venues/') && location.pathname.includes('/map')) {
      return 'Constructor de Mapas';
    }
    return 'Panel de Administración';
  };

  return (
    <div className="laika-admin-layout">
      {/* ─── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className={`laika-admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="laika-admin-sidebar-header">
          <NavLink to="/admin" className="laika-admin-brand">
            <div className="laika-admin-brand-icon">
              <Shield size={22} color="#00ff88" />
            </div>
            {!collapsed && (
              <div className="laika-admin-brand-info">
                <span className="laika-admin-brand-title">LAIKA ADMIN</span>
                <span className="laika-admin-brand-badge">Consola Autónoma</span>
              </div>
            )}
          </NavLink>
          <button
            className="laika-admin-collapse-btn"
            onClick={() => setCollapsed(prev => !prev)}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {!collapsed && (
          <div className="laika-admin-sidebar-search">
            <div className="laika-admin-search-box">
              <Search className="laika-admin-search-icon" size={15} />
              <input
                type="text"
                className="laika-admin-search-input"
                placeholder="Buscar módulo..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        <nav className="laika-admin-sidebar-nav">
          {filteredSections.map(section => (
            <div key={section.id} className="laika-admin-nav-section">
              {!collapsed && (
                <div className="laika-admin-section-label">{section.label}</div>
              )}
              {section.items.map(item => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) =>
                      `laika-admin-nav-item ${isActive ? 'active' : ''}`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <IconComponent className="laika-admin-nav-icon" size={19} />
                    {!collapsed && (
                      <span className="laika-admin-nav-text">{item.label}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="laika-admin-sidebar-footer">
          <div className="laika-admin-user-profile">
            <div className="laika-admin-user-avatar">
              {user?.firstName ? user.firstName[0].toUpperCase() : 'A'}
            </div>
            {!collapsed && (
              <div className="laika-admin-user-info">
                <span className="laika-admin-user-name">
                  {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Administrador' : 'Admin'}
                </span>
                <span className="laika-admin-user-role">SUPERADMIN</span>
              </div>
            )}
          </div>

          <button
            className="laika-admin-logout-btn"
            onClick={handleLogout}
            title="Cerrar sesión de administrador"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="laika-admin-main">
        <header className="laika-admin-topbar">
          <div className="laika-admin-breadcrumb">
            <NavLink to="/admin" className="laika-admin-breadcrumb-root">
              <Shield size={16} color="#00ff88" />
              <span>Admin</span>
            </NavLink>
            <span className="laika-admin-breadcrumb-separator">/</span>
            <span className="laika-admin-breadcrumb-current">
              {getCurrentPageTitle()}
            </span>
          </div>

          <div className="laika-admin-topbar-actions">
            <div className="laika-admin-status-pill" title="Pilgrim API Gateway Conectado">
              <span className="laika-admin-status-dot" />
              <span>Pilgrim Activo</span>
            </div>

            <button
              onClick={toggleTheme}
              className="laika-admin-collapse-btn"
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <NotificationBell />
          </div>
        </header>

        <main className="laika-admin-content">
          <Outlet />
        </main>
      </div>

      <NotificationContainer />
    </div>
  );
};

export default AdminLayout;
