import { useCallback, useEffect, useState } from 'react';
import { b2bAPI } from '@/services/b2bService';
import { useNotification } from '@/context/NotificationContext';

const normalizeEvents = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.events)) return payload.events;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const useContractEvents = (contract) => {
  const { error: notifyError } = useNotification();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const contractId = contract?.id ?? null;
  const managerId = contract?.manager?.id ?? contract?.managerId ?? null;
  const organizationId = contract?.organization?.id ?? contract?.organizationId ?? null;

  const fetchEvents = useCallback(async () => {
    if (!contractId) {
      setEvents([]);
      return;
    }
    setLoading(true);
    try {
      const payload = await b2bAPI.getContractEvents(contractId, { managerId, organizationId });
      setEvents(normalizeEvents(payload));
    } catch (err) {
      notifyError(err?.message || 'Error al cargar eventos del contrato');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [contractId, managerId, organizationId, notifyError]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, reload: fetchEvents };
};

export default useContractEvents;
