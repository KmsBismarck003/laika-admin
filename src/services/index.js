/**
 * @file index.js
 * @description Punto de entrada para todos los servicios de API de Laika Admin.
 */
import { authAPI } from './authService';
import { userAPI } from './userService';
import { eventAPI } from './eventService';
import { databaseAPI, monitoringAPI, logsAPI, adminUsersAPI, restoreAuditAPI, configAPI } from './adminService';
import { pagesAPI, adsAPI, notificationAPI, tickerAPI } from './contentService';
import { managerAPI, venueAPI } from './managerService';
import { statsAPI, achievementsAPI, analyticsAPI } from './miscService';
import { merchService } from './merchService';
import { b2bAPI } from './b2bService';
import { apiClient } from './apiClient';

export {
  apiClient,
  authAPI,
  userAPI,
  eventAPI,
  databaseAPI,
  monitoringAPI,
  logsAPI,
  adminUsersAPI,
  restoreAuditAPI,
  configAPI,
  pagesAPI,
  adsAPI,
  notificationAPI,
  tickerAPI,
  managerAPI,
  venueAPI,
  statsAPI,
  achievementsAPI,
  analyticsAPI,
  merchService,
  b2bAPI
};

const api = {
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
  ticker: tickerAPI,
  manager: managerAPI,
  venue: venueAPI,
  stats: statsAPI,
  achievements: achievementsAPI,
  analytics: analyticsAPI,
  merch: merchService,
  b2b: b2bAPI
};

export default api;
