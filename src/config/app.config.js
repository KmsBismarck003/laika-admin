/**
 * @file app.config.js
 * @description Configuración general de la aplicación Laika Admin.
 */
import { PILGRIM_CONFIG } from './pilgrim.config';

export const APP_CONFIG = {
  name: 'LAIKA ADMIN',
  version: '1.0.0',
  description: 'Consola Desacoplada de Administración de Laika Club',
  role: 'admin',
  environment: import.meta.env?.MODE || 'development',
};

export const API_CONFIG = {
  baseURL: PILGRIM_CONFIG.baseURL,
  wsURL: PILGRIM_CONFIG.wsURL,
  timeout: 30000,
  retries: 2,
};

export const AUTH_CONFIG = {
  tokenKey: 'token',
  userKey: 'user',
  requiredRole: 'admin',
  sessionKey: 'sessionToken',
  defaultSessionTimeout: 60, // minutos
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000,
};

export const UX_CONFIG = {
  toastDuration: 4000,
  animationsDefault: true,
  densityDefault: 'comfortable',
};

export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 25, 50, 100],
};

export const ROLES = {
  ADMIN: 'admin',
};

export default APP_CONFIG;
