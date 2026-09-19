import React from 'react';
import './Login.css';

const LoginLayout = ({ children }) => {
  return (
    <div className="admin-login-layout">
      <div className="admin-login-ambient-light" />
      <div className="admin-login-container">
        {children}
      </div>
    </div>
  );
};

export default LoginLayout;
