import { useState, useCallback, useEffect } from 'react';
import api from '@/services/api';
import { useNotification } from '@/context/NotificationContext';
import { validateAutoConfig } from '../utils/backupValidators';

const DEFAULT_CONFIG = {
  enabled: false,
  frequency: 'daily',
  time: '02:00',
  backupType: 'completo',
  retentionDays: 30,
  maxBackups: 10,
  notifyOnSuccess: true,
  notifyOnError: true,
  dayOfWeek: 0,
  dayOfMonth: 1,
};

/**
 * useAutoBackupConfig — Lógica de configuración de respaldos automáticos.
 * La presentación vive en AutoBackupConfigModal.
 */
export function useAutoBackupConfig(isOpen) {
  const { success, error: notifyError } = useNotification();
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [lastBackup, setLastBackup] = useState(null);
  const [nextBackup, setNextBackup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.database.getAutomaticBackupConfig();
      if (response?.config) setConfig({ ...DEFAULT_CONFIG, ...response.config });
      setLastBackup(response?.lastBackup ?? null);
      setNextBackup(response?.nextBackup ?? null);
    } catch (error) {
      notifyError('Error al cargar configuración de respaldos automáticos');
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  useEffect(() => {
    if (isOpen) {
      setFieldErrors({});
      loadConfig();
    }
  }, [isOpen, loadConfig]);

  const setField = useCallback((key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const saveConfig = useCallback(async () => {
    const { valid, errors } = validateAutoConfig(config);
    if (!valid) {
      setFieldErrors(errors);
      notifyError('Revisa la configuración antes de guardar');
      return { success: false, errors };
    }
    setLoading(true);
    try {
      await api.database.updateAutomaticBackupConfig(config);
      setFieldErrors({});
      success('Configuración de respaldos automáticos guardada');
      await loadConfig();
      return { success: true };
    } catch (error) {
      notifyError('Error al guardar configuración de respaldos');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [config, loadConfig, success, notifyError]);

  const testBackup = useCallback(async () => {
    setLoading(true);
    try {
      await api.database.createBackup(config.backupType);
      success('Respaldo de prueba creado exitosamente');
      await loadConfig();
      return { success: true };
    } catch (error) {
      notifyError('Error al crear respaldo de prueba');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [config.backupType, loadConfig, success, notifyError]);

  return {
    config, setField, loading, fieldErrors,
    lastBackup, nextBackup,
    reload: loadConfig, saveConfig, testBackup,
  };
}
