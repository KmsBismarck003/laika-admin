/**
 * @file api.js
 * @description Puente API unificado para compatibilidad directa con imports existentes.
 */
import api from './index';

export const {
  auth: authAPI,
  user: userAPI,
  event: eventAPI,
  database: databaseAPI,
  monitoring: monitoringAPI,
  logs: logsAPI,
  adminUsers: adminUsersAPI,
  restoreAudit: restoreAuditAPI,
  config: configAPI,
  pages: pagesAPI,
  ads: adsAPI,
  notification: notificationAPI,
  manager: managerAPI,
  venue: venueAPI,
  stats: statsAPI,
  achievements: achievementsAPI,
  analytics: analyticsAPI,
  ticker: tickerAPI,
  merch: merchService,
  b2b: b2bAPI
} = api;

export default api;
