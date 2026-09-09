/**
 * @file pilgrim.config.js
 * @description Configuración centralizada de comunicación con Pilgrim API Gateway.
 *
 * REGLA: Ningún servicio o componente debe hardcodear URLs de microservicios,
 * puertos internos ni direcciones IP. Toda la comunicación fluye a través de Pilgrim.
 */

// Obtener variables de entorno (Vite / Node fallback)
const envApiUrl = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.VITE_PILGRIM_API_URL
  : (typeof process !== 'undefined' && process.env ? process.env.REACT_APP_PILGRIM_API_URL : null);

const envWsUrl = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.VITE_PILGRIM_WS_URL
  : (typeof process !== 'undefined' && process.env ? process.env.REACT_APP_PILGRIM_WS_URL : null);

// Base URL limpia sin trailing slash
const rawBase = envApiUrl || (
  typeof window !== 'undefined' && window.location
    ? `${window.location.protocol}//${window.location.hostname}:8000/api`
    : import.meta.env.VITE_PILGRIM_API_URL || "/api"
);
export const PILGRIM_API_URL = rawBase.replace(/\/+$/, '');

// WebSocket URL
const defaultWs = PILGRIM_API_URL.replace(/^http/, 'ws');
export const PILGRIM_WS_URL = (envWsUrl || defaultWs).replace(/\/+$/, '');

export const PILGRIM_CONFIG = {
  baseURL: PILGRIM_API_URL,
  wsURL: PILGRIM_WS_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'X-Client-Role': 'admin',
    'X-Client-App': 'laika-admin'
  }
};

export default PILGRIM_CONFIG;
