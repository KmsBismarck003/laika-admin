/**
 * @file adminService.js
 * @description Operaciones de administración del sistema vía Pilgrim API Gateway.
 */
import { apiClient } from './apiClient';

export const databaseAPI = {
  createBackup: (type, options = {}) => apiClient.post('/database/backup', { type, backup_type: type, ...options }),
  listBackups: () => apiClient.get('/database/backups'),
  restore: backupId => apiClient.post('/database/restore', { backup_id: backupId }),
  deleteBackup: backupId => apiClient.delete(`/database/backups/${backupId}`),
  downloadBackupUrl: backupId => `${apiClient.baseURL}/database/backups/${backupId}/download`,
  exportExcelUrl: () => `${apiClient.baseURL}/database/export/excel`,
  exportJsonUrl: () => `${apiClient.baseURL}/database/export/json`,
  exportPdfUrl: () => `${apiClient.baseURL}/database/export/pdf`,
  exportSvgUrl: () => `${apiClient.baseURL}/database/export/svg`,
  listTables: () => apiClient.get('/database/tables'),
  getStats: () => apiClient.get('/database/stats'),
  clearCache: () => apiClient.post('/database/clear-cache'),
  optimize: () => apiClient.post('/database/optimize'),
  getAutomaticBackupConfig: async () => {
    const response = await apiClient.get('/database/automatic-backup/config');
    const raw = response?.config || response || {};
    return {
      ...response,
      config: {
        ...raw,
        backupType: raw.backupType ?? raw.backup_type ?? 'completo',
        retentionDays: raw.retentionDays ?? raw.retention_days ?? 30,
        maxBackups: raw.maxBackups ?? raw.max_backups ?? 10,
        notifyOnSuccess: raw.notifyOnSuccess ?? raw.notify_on_success ?? true,
        notifyOnError: raw.notifyOnError ?? raw.notify_on_error ?? true,
        dayOfWeek: raw.dayOfWeek ?? raw.day_of_week ?? 0,
        dayOfMonth: raw.dayOfMonth ?? raw.day_of_month ?? 1,
      },
      lastBackup: response?.lastBackup ?? response?.last_backup ?? null,
      nextBackup: response?.nextBackup ?? response?.next_backup ?? null,
    };
  },
  updateAutomaticBackupConfig: config => apiClient.put('/database/automatic-backup/config', {
    ...config,
    backup_type: config.backupType,
    retention_days: config.retentionDays,
    max_backups: config.maxBackups,
    notify_on_success: config.notifyOnSuccess,
    notify_on_error: config.notifyOnError,
    day_of_week: config.dayOfWeek,
    day_of_month: config.dayOfMonth,
  }),
  getScheduledBackups: async () => {
    const response = await apiClient.get('/database/automatic-backup/scheduled');
    const scheduled = Array.isArray(response)
      ? response
      : (response?.scheduled || response?.data || []);
    return { ...response, scheduled };
  },
  cancelScheduledBackup: scheduleId => apiClient.delete(`/database/automatic-backup/scheduled/${scheduleId}`),
  triggerBackupNow: () => apiClient.post('/database/automatic-backup/trigger'),
  cleanupOldBackups: () => apiClient.post('/database/automatic-backup/cleanup')
};

export const monitoringAPI = {
  getSystemStatus: () => apiClient.get('/monitoring/status'),
  getLogs: (params = {}) => apiClient.get('/monitoring/logs', params),
  getMetrics: () => apiClient.get('/monitoring/metrics'),
  getActiveUsers: () => apiClient.get('/monitoring/active-users')
};

export const logsAPI = {
  getAuditLogs: (params = {}) => apiClient.get('/logs/audit', params),
  getRequestLogs: (params = {}) => apiClient.get('/logs/requests', params)
};

export const adminUsersAPI = {
  getAll: (params = {}) => apiClient.get('/admin/users', params),
  create: userData => apiClient.post('/admin/users', userData),
  getById: userId => apiClient.get(`/admin/users/${userId}`),
  update: (userId, data) => apiClient.put(`/admin/users/${userId}`, data),
  resetPassword: (userId, newPassword) =>
    apiClient.patch(`/admin/users/${userId}/password`, { new_password: newPassword }),
  changeStatus: (userId, status) =>
    apiClient.patch(`/admin/users/${userId}/status`, { status }),
  unlock: userId => apiClient.patch(`/admin/users/${userId}/unlock`),
  updatePermissions: (userId, permissions) =>
    apiClient.put(`/admin/users/${userId}/permissions`, { permissions }),
  uploadPhoto: (userId, file) => apiClient.upload(`/admin/users/${userId}/avatar`, file)
};

export const restoreAuditAPI = {
  createEvent: data => apiClient.post('/restore-audit/events', data),
  getEvents: (params = {}) => apiClient.get('/restore-audit/events', params),
  getEvent: id => apiClient.get(`/restore-audit/events/${id}`),
  updateEvent: (id, data) => apiClient.put(`/restore-audit/events/${id}`, data),
  saveTechnicalChecks: (id, data) => apiClient.post(`/restore-audit/events/${id}/technical-checks`, data),
  saveFunctionalChecks: (id, data) => apiClient.post(`/restore-audit/events/${id}/functional-checks`, data),
  saveOperationalImpact: (id, data) => apiClient.post(`/restore-audit/events/${id}/operational-impact`, data),
  confirmEvent: (id, data) => apiClient.post(`/restore-audit/events/${id}/confirm`, data),
  getStats: () => apiClient.get('/restore-audit/stats'),
  exportHistory: (params = {}) => apiClient.get('/restore-audit/export', params)
};

export const configAPI = {
  getConfig: () => apiClient.get('/config'),
  updateConfig: config => apiClient.put('/config', config),
  getParameter: key => apiClient.get(`/config/${key}`),
  updateParameter: (key, value) => apiClient.post(`/config/${key}`, { value })
};

export default {
  databaseAPI,
  monitoringAPI,
  logsAPI,
  adminUsersAPI,
  restoreAuditAPI,
  configAPI
};
