import { useCallback, useEffect, useState } from 'react';
import { b2bAPI } from '@/services/b2bService';
import { useNotification } from '@/context/NotificationContext';

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.contracts)) return payload.contracts;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const useManagerContracts = () => {
  const { error: notifyError } = useNotification();
  const [contracts, setContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await b2bAPI.getContracts();
      setContracts(normalizeList(payload));
    } catch (err) {
      notifyError(err?.message || 'Error al cargar contratos de gestores');
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const selectedContract = contracts.find((contract) => String(contract.id) === String(selectedContractId)) || null;

  const selectContract = useCallback((contractId) => {
    setSelectedContractId(contractId);
  }, []);

  return {
    contracts,
    selectedContract,
    selectedContractId,
    loading,
    selectContract,
    refresh: fetchContracts,
  };
};

export default useManagerContracts;
