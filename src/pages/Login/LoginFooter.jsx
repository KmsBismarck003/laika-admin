import React from 'react';

const LoginFooter = () => {
  return (
    <div className="admin-login-footer">
      <p>Conexión segura cifrada vía <strong>Pilgrim API Gateway</strong></p>
      <p>LAIKA Club &copy; {new Date().getFullYear()} — Todos los derechos reservados.</p>
    </div>
  );
};

export default LoginFooter;
