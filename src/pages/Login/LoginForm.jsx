import React from 'react';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const LoginForm = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  submitting, 
  errorMessage, 
  authError 
}) => {
  return (
    <div className="admin-login-form-container">
      {(errorMessage || authError) && (
        <div className="admin-login-error" role="alert">
          <AlertCircle size={18} className="error-icon" />
          <div className="error-content">
            <strong>Error de Autenticación</strong>
            <p>{errorMessage || authError}</p>
          </div>
        </div>
      )}

      <form className="admin-login-form" onSubmit={handleSubmit}>
        <div className="admin-login-field">
          <div className="admin-login-input-wrapper">
            <Mail className="input-icon" size={16} />
            <input
              id="email"
              name="email"
              type="email"
              className="admin-login-input"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div className="admin-login-field">
          <div className="admin-login-input-wrapper">
            <Lock className="input-icon" size={16} />
            <input
              id="password"
              name="password"
              type="password"
              className="admin-login-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div className="admin-login-options">
          <label className="admin-login-checkbox">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={submitting}
            />
            <span className="checkbox-custom"></span>
            Remember me
          </label>
          <a href="#" className="admin-login-forgot" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
        </div>

        <button
          type="submit"
          className="admin-login-submit"
          disabled={submitting}
        >
          {submitting ? (
            <span className="submit-spinner" />
          ) : (
            <span>LOGIN</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
