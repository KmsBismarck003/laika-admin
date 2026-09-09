import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated, authError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMessage('Por favor ingrese correo electrónico y contraseña.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const result = await login({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(result.error || 'Credenciales inválidas o sin permisos de Administrador.');
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Error de conexión con Pilgrim API Gateway.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-bg-glow" />

      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo-container">
            <Shield className="w-9 h-9 text-emerald-400" size={36} color="#00ff88" />
          </div>
          <div className="admin-login-badge">Acceso Restringido</div>
          <h1 className="admin-login-title">LAIKA ADMIN</h1>
          <p className="admin-login-subtitle">
            Consola central de gestión y control del sistema
          </p>
        </div>

        {(errorMessage || authError) && (
          <div className="admin-login-error-alert" role="alert">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <strong>Error de Acceso:</strong>
              <div>{errorMessage || authError}</div>
            </div>
          </div>
        )}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-login-field">
            <label htmlFor="email">Correo Institucional / Admin</label>
            <div className="admin-login-input-group">
              <Mail className="admin-login-input-icon" size={18} />
              <input
                id="email"
                name="email"
                type="email"
                className="admin-login-input"
                placeholder="admin@laikaclub.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label htmlFor="password">Contraseña</label>
            <div className="admin-login-input-group">
              <Lock className="admin-login-input-icon" size={18} />
              <input
                id="password"
                name="password"
                type="password"
                className="admin-login-input"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div className="admin-login-options">
            <label className="admin-login-checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={submitting}
              />
              Recordar este terminal
            </label>
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="admin-spinner" />
                <span>Verificando Credenciales...</span>
              </>
            ) : (
              <>
                <span>Iniciar Sesión Administrativa</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          Conexión segura cifrada vía <strong>Pilgrim API Gateway</strong>
          <br />LAIKA Club &copy; {new Date().getFullYear()} — Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login;
