import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminUsersAPI } from '@/services/adminService';
import { b2bAPI } from '@/services/b2bService';
import { useNotification } from '@/context/NotificationContext';
import useDebounce from '@/hooks/useDebounce';
import { filterAvailable, isExclusiveViolation } from '../utils/staffingRules';

const normalizeUsers = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeManagers = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.managers)) return payload.managers;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const ROLE_BY_TAB = { operador: 'OPERADOR', usuario: 'USUARIO' };

const useContractStaffing = (contractId, contracts = []) => {
  const { success, error: notifyError } = useNotification();
  const [assigned, setAssigned] = useState([]);
  const [activeAssignments, setActiveAssignments] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [tab, setTab] = useState('operador');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);

  const activeContracts = useMemo(
    () => contracts.filter((contract) => contract.status === 'ACTIVE'),
    [contracts],
  );

  const loadAssigned = useCallback(async () => {
    if (!contractId) {
      setAssigned([]);
      return [];
    }
    const payload = await b2bAPI.getContractManagers(contractId);
    const list = normalizeManagers(payload);
    setAssigned(list);
    return list;
  }, [contractId]);

  const loadActiveAssignments = useCallback(async () => {
    const targets = activeContracts.filter((contract) => String(contract.id) !== String(contractId));
    if (targets.length === 0) {
      setActiveAssignments([]);
      return [];
    }
    const settled = await Promise.allSettled(targets.map((contract) => b2bAPI.getContractManagers(contract.id)));
    const merged = [];
    settled.forEach((result, index) => {
      if (result.status !== 'fulfilled') return;
      normalizeManagers(result.value).forEach((entry) => {
        merged.push({ ...entry, contractId: targets[index].id });
      });
    });
    setActiveAssignments(merged);
    return merged;
  }, [activeContracts, contractId]);

  const loadCandidates = useCallback(async () => {
    const params = { role: tab, limit: 50 };
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    const payload = await adminUsersAPI.getAll(params);
    setCandidates(normalizeUsers(payload));
  }, [tab, debouncedSearch]);

  const reload = useCallback(async () => {
    if (!contractId) return;
    setLoading(true);
    try {
      await Promise.all([loadAssigned(), loadActiveAssignments(), loadCandidates()]);
    } catch (err) {
      notifyError(err?.message || 'Error al cargar personal del contrato');
    } finally {
      setLoading(false);
    }
  }, [contractId, loadAssigned, loadActiveAssignments, loadCandidates, notifyError]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    setSearchQuery('');
  }, [contractId, tab]);

  const assignedIds = useMemo(() => assigned.map((entry) => entry.userId ?? entry.user_id ?? entry.id), [assigned]);
  const available = useMemo(
    () => filterAvailable(candidates, assignedIds, debouncedSearch),
    [candidates, assignedIds, debouncedSearch],
  );

  const assign = useCallback(async (userId) => {
    if (!contractId) return { success: false };
    if (isExclusiveViolation(userId, contractId, activeAssignments)) {
      notifyError('Operador ya asignado a otro gestor. Desvincualo primero de su contrato actual.');
      return { success: false, reason: 'exclusive' };
    }
    setActionLoading(true);
    try {
      await b2bAPI.assignContractManager({
        contractId,
        userId,
        roleInContract: ROLE_BY_TAB[tab] || 'OPERADOR',
      });
      success('Personal asignado al contrato correctamente');
      await Promise.all([loadAssigned(), loadCandidates()]);
      return { success: true };
    } catch (err) {
      notifyError(err?.message || 'Error al asignar personal al contrato');
      return { success: false, error: err };
    } finally {
      setActionLoading(false);
    }
  }, [contractId, activeAssignments, tab, success, notifyError, loadAssigned, loadCandidates]);

  const unassign = useCallback(async (userId) => {
    if (!contractId) return { success: false };
    setActionLoading(true);
    try {
      await b2bAPI.unassignContractManager(contractId, userId);
      success('Personal desvinculado del contrato');
      await Promise.all([loadAssigned(), loadCandidates()]);
      return { success: true };
    } catch (err) {
      notifyError(err?.message || 'Error al desvincular personal');
      return { success: false, error: err };
    } finally {
      setActionLoading(false);
    }
  }, [contractId, success, notifyError, loadAssigned, loadCandidates]);

  return {
    assigned,
    available,
    tab,
    setTab,
    searchQuery,
    setSearchQuery,
    loading,
    actionLoading,
    assign,
    unassign,
    reload,
  };
};

export default useContractStaffing;
