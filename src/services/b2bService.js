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
  getContractsByOrg: async (orgId) => {
    return apiClient.get(`/admin/b2b/organizations/${orgId}/contracts`);
  },
  createContract: async (data) => {
    return apiClient.post('/admin/b2b/contracts', data);
  },
  updateContract: async (contractId, data) => {
    return apiClient.put(`/admin/b2b/contracts/${contractId}`, data);
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
  }
};

export default b2bAPI;
