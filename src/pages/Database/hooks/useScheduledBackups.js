import { useState, useCallback, useEffect } from 'react';
import api from '@/services/api';
import { useNotification } from '@/context/NotificationContext';

/**
 * useScheduledBackups — Respaldos programados: listar, cancelar, disparar ahora y limpiar obsoletos.
 */
export function useScheduledBackups(enabled = true) {
  const { success, error: notifyError } = useNotification();
  const [scheduled, setScheduled] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchScheduled = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.database.getScheduledBackups();
      setScheduled(response?.scheduled || []);
    } catch (error) {
      notifyError('Error al cargar respaldos programados');
      setScheduled([]);
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  useEffect(() => {
    if (enabled) fetchScheduled();
  }, [enabled, fetchScheduled]);

  const cancelScheduled = useCallback(async (scheduleId) => {
    setActionLoading(true);
    try {
      await api.database.cancelScheduledBackup(scheduleId);
      success('Respaldo programado cancelado');
      await fetchScheduled();
      return { success: true };
    } catch (error) {
      notifyError('Error al cancelar el respaldo programado');
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [fetchScheduled, success, notifyError]);

  const triggerNow = useCallback(async () => {
    setActionLoading(true);
    try {
      await api.database.triggerBackupNow();
      success('Respaldo inmediato disparado correctamente');
      await fetchScheduled();
      return { success: true };
    } catch (error) {
      notifyError('Error al disparar el respaldo inmediato');
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [fetchScheduled, success, notifyError]);

  const cleanupOld = useCallback(async () => {
    setActionLoading(true);
    try {
      await api.database.cleanupOldBackups();
      success('Limpieza de respaldos obsoletos completada');
      await fetchScheduled();
      return { success: true };
    } catch (error) {
      notifyError('Error al limpiar respaldos obsoletos');
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [fetchScheduled, success, notifyError]);

  return {
    scheduled, loading, actionLoading,
    reload: fetchScheduled, cancelScheduled, triggerNow, cleanupOld,
  };
}
