import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginLayout from './LoginLayout';
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';
import LoginFooter from './LoginFooter';
import './Login.css';

const DECOUPLED_PORTS = {
  admin: 3010,
  gestor: 3020,
  operador: 3030
};

const roleRedirectMap = {
  admin: '/admin',
  gestor: '/events/manage',
  operador: '/staff/dashboard',
  usuario: '/user/dashboard'
};

const handleRoleRedirection = (userObj, navigate, from = null) => {
  const userRole = userObj?.role;
  const targetPort = DECOUPLED_PORTS[userRole];
  const currentPort = window.location.port ? parseInt(window.location.port, 10) : 80;

  if (targetPort && currentPort !== targetPort) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const b64User = btoa(encodeURIComponent(JSON.stringify(userObj)));
    const targetPath = roleRedirectMap[userRole] || '/';
    window.location.href = `http://localhost:${targetPort}/auth-sync?token=${token}&user=${b64User}&redirect=${encodeURIComponent(targetPath)}`;
    return true;
  }

  const targetPath = from || '/admin';
  navigate(targetPath, { replace: true });
  return false;
};

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
      handleRoleRedirection(user, navigate, from);
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
        handleRoleRedirection(result.user, navigate, from);
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
    <LoginLayout>
      <LoginHeader />
      <LoginForm 
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submitting={submitting}
        errorMessage={errorMessage}
        authError={authError}
      />
      <LoginFooter />
    </LoginLayout>
  );
};

export default Login;
