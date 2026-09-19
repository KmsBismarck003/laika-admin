import React from 'react';
import { Shield } from 'lucide-react';

const LoginHeader = () => {
  return (
    <div className="admin-login-header">
      <div className="admin-login-header-top">
        <div className="admin-login-logo-box">
          <Shield className="admin-login-logo-icon" size={26} strokeWidth={1.5} />
        </div>
      </div>
      <h1 className="admin-login-title">LAIKA ADMIN</h1>
      <div className="admin-login-badge-wrapper">
        <span className="admin-login-badge">Acceso Restringido</span>
      </div>
      <p className="admin-login-subtitle">
        Consola central de gestión y control del sistema
      </p>
    </div>
  );
};

export default LoginHeader;
