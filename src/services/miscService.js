/**
 * StatsService & Achievements - Manejo de datos y logros
 */
import { apiClient } from './apiClient'

export const statsAPI = {
    getAdminDashboard: () => apiClient.get('/stats/admin/dashboard'),
    getManagerStats: () => apiClient.get('/stats/manager/dashboard'),
    getStaffStats: () => apiClient.get('/stats/staff/dashboard'),
    getEventStats: eventId => apiClient.get(`/stats/events/${eventId}`),
    getSalesReport: (params = {}) => apiClient.get('/stats/sales/report', params),
    getSalesByEvent: () => apiClient.get('/stats/admin/sales')
}

export const achievementsAPI = {
    getAll: () => apiClient.get('/achievements'),
    getMy: () => apiClient.get('/achievements/my'),
    getCoupons: () => apiClient.get('/achievements/coupons'),
    check: () => apiClient.post('/achievements/check'),
    validateCoupon: (couponCode, subtotal, feePercent = 10) =>
        apiClient.post('/achievements/coupons/validate', {
            coupon_code: couponCode,
            subtotal,
            service_fee_percent: feePercent
        }),
    consumeCoupon: (couponCode, subtotal, feePercent = 10) =>
        apiClient.post('/achievements/coupons/consume', {
            coupon_code: couponCode,
            subtotal,
            service_fee_percent: feePercent
        }),
    hasPremiumTicket: () => apiClient.get('/achievements/has-premium-ticket'),
    runIncentives: (testMode = false) => apiClient.post(`/achievements/run-incentives?test_mode=${testMode}`)
}

export const analyticsAPI = {
    getAnalyticsTables: async () => {
        return apiClient.get('/analytics/tables');
    },
    getArtistSuggestions: async () => {
        return apiClient.get('/analytics/suggestions');
    },
    getMapReduceStats: async (table = 'tickets', filter = '') => {
        return apiClient.get('/analytics/mapreduce', { table, focus_filter: filter });
    },
    getFullAnalysis: async () => {
        return apiClient.get('/analytics/full');
    },
    getIncrementalAnalysis: async (lastDate) => {
        return apiClient.get('/analytics/incremental', { last_date: lastDate });
    },
    getMapReduceStats3D: async (table, filters = {}) => {
        const params = typeof filters === 'string' ? { table, focus_filter: filters } : { table, ...filters };
        return apiClient.get('/analytics/3d', params);
    },
    runPredictAction: async () => {
        return apiClient.post('/analytics/predict');
    },
    runAnomaliesAction: async () => {
        return apiClient.post('/analytics/anomalies');
    },
    runCleanAction: async (table) => {
        return apiClient.post(`/analytics/clean?table=${encodeURIComponent(table)}`);
    },
    getDescriptiveStats: async (table, managerId = null, eventId = null) => {
        const params = { table };
        if (managerId) params.manager_id = managerId;
        if (eventId) params.event_id = eventId;
        return apiClient.get('/analytics/stats/descriptive', params);
    },
    syncNoSqlVault: async (params = {}) => {
        return apiClient.post('/analytics/vault/sync', params);
    },
    downloadNoSqlSnapshotUrl: (snapshotId) => {
        return `${apiClient.baseURL}/analytics/vault/download/${snapshotId}`;
    },
    getNoSqlVaultStatus: async () => {
        return apiClient.get('/analytics/vault/status');
    },
    listNoSqlVault: async () => {
        return apiClient.get('/analytics/vault/list');
    },
    deleteNoSqlSnapshot: async (snapshotId) => {
        return apiClient.delete(`/analytics/vault/delete/${snapshotId}`);
    },
    restoreNoSqlSnapshot: async (snapshotId) => {
        return apiClient.post(`/analytics/vault/restore/${snapshotId}`);
    },
    getRegressionML: async (managerId = null, extraParams = {}) => {
        const params = { ...extraParams };
        if (managerId) params.manager_id = managerId;
        return apiClient.get('/analytics/ml/regression', params);
    },
    getDecisionTreeML: async (managerId = null, extraParams = {}) => {
        const params = { ...extraParams };
        if (managerId) params.manager_id = managerId;
        return apiClient.get('/analytics/ml/decision-tree', params);
    },
    getProspectingML: async () => {
        return apiClient.get('/analytics/ml/prospecting');
    },
    addProspectingLead: async (leadData) => {
        return apiClient.post('/analytics/ml/prospecting/lead', leadData);
    },
    getUserBehaviorML: async (managerId = null) => {
        const params = {};
        if (managerId) params.manager_id = managerId;
        return apiClient.get('/analytics/ml/user-behavior', params);
    },
    getDemandPredictionML: async (managerId = null) => {
        const params = {};
        if (managerId) params.manager_id = managerId;
        return apiClient.get('/analytics/ml/demand-prediction', params);
    },
    getMerchSalesInsights: async (dateFrom = null, dateTo = null) => {
        const params = {};
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
        return apiClient.get('/analytics/merch/sales-insights', params);
    },
    grantRetentionCoupon: async (userId, discountValue = 15.0) => {
        return apiClient.post('/analytics/ml/user-behavior/grant-coupon', {
            user_id: userId,
            discount_value: discountValue
        });
    },
    getPCAML: async (k = 3) => {
        return apiClient.get('/bigdata/ml/pca', { k });
    },
    getElbowML: async (max_k = 8) => {
        return apiClient.get('/bigdata/ml/elbow', { max_k });
    },
    getAnomalyML: async (managerId = null) => {
        const params = {};
        if (managerId) params.manager_id = managerId;
        return apiClient.get('/bigdata/ml/anomaly', params);
    },
    getMarketGapsML: async (managerId = null) => {
        const params = {};
        if (managerId) params.manager_id = managerId;
        return apiClient.get('/bigdata/ml/market-gaps', params);
    },
    getEventTargetAudience: async (features, limit = 1) => {
        return apiClient.post('/bigdata/ml/recommend-target', { features, limit });
    },
    getUserRecommendations: async (userId, limit = 5) => {
        return apiClient.get(`/bigdata/ml/recommendations/${userId}`, { limit });
    }
}
