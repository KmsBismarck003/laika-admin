import { apiClient } from './apiClient';

export const b2bAPI = {
  // Organizations
  getOrganizations: async () => {
    return apiClient.get('/admin/b2b/organizations');
  },
  createOrganization: async (data) => {
    return apiClient.post('/admin/b2b/organizations', data);
  },
  updateOrganization: async (orgId, data) => {
    return apiClient.put(`/admin/b2b/organizations/${orgId}`, data);
  },
  deleteOrganization: async (orgId) => {
    return apiClient.delete(`/admin/b2b/organizations/${orgId}`);
  },

  // Contracts
  getContracts: async () => {
    return apiClient.get('/admin/b2b/contracts');
  },
  getContractById: async (contractId) => {
    return apiClient.get(`/admin/b2b/contracts/${contractId}`);
  },
  getContractsByOrg: async (orgId) => {
    return apiClient.get(`/admin/b2b/organizations/${orgId}/contracts`);
  },
  createContract: async (data) => {
    return apiClient.post('/admin/b2b/contracts', data);
  },
  updateContract: async (contractId, data) => {
    return apiClient.put(`/admin/b2b/contracts/${contractId}`, data);
  },
  upgradePackage: async (contractId, data) => {
    return apiClient.put(`/admin/b2b/contracts/${contractId}`, data);
  },
  renewContract: async (data) => {
    return apiClient.post('/admin/b2b/contracts', data);
  },
  deleteContract: async (contractId) => {
    return apiClient.delete(`/admin/b2b/contracts/${contractId}`);
  },
  extendContract: async (contractId, data) => {
    return apiClient.patch(`/admin/b2b/contracts/${contractId}/extend`, data);
  },

  // Contract Managers
  getContractManagers: async (contractId) => {
    return apiClient.get(`/admin/b2b/contracts/${contractId}/managers`);
  },
  assignContractManager: async (data) => {
    return apiClient.post('/admin/b2b/managers/assign', data);
  },
  unassignContractManager: async (contractId, userId) => {
    return apiClient.delete(`/admin/b2b/contracts/${contractId}/managers/${userId}`);
  },

  // Contract Events (cobertura de personal por evento)
  // Intenta el endpoint dedicado; si el backend no lo expone (404),
  // recurre a /events/all filtrado por gestor/organizacion del contrato.
  getContractEvents: async (contractId, { managerId = null, organizationId = null } = {}) => {
    try {
      return await apiClient.get(`/admin/b2b/contracts/${contractId}/events`);
    } catch (err) {
      if (err?.status !== 404) throw err;
      const all = await apiClient.get('/events/all', { limit: 100 });
      const list = Array.isArray(all) ? all : (all?.events || all?.data || []);
      if (!managerId && !organizationId) return [];
      return list.filter((event) => {
        const eventManager = event.manager_id ?? event.managerId ?? event.created_by ?? event.createdBy;
        const eventOrg = event.organization_id ?? event.organizationId ?? event.org_id;
        if (managerId && eventManager !== undefined && eventManager !== null) {
          if (String(eventManager) === String(managerId)) return true;
        }
        if (organizationId && eventOrg !== undefined && eventOrg !== null) {
          if (String(eventOrg) === String(organizationId)) return true;
        }
        return false;
      });
    }
  }
};

export default b2bAPI;
