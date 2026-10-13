import { useState, useCallback } from 'react';
import api from '@/services/api';
import { analyticsAPI } from '@/services/miscService';
import { useNotification } from '@/context/NotificationContext';

/**
 * useBackupActions — Hook para orquestar la creación, eliminación y descarga de respaldos.
 * Todas las operaciones retornan { success } para que el orquestador decida (cerrar modal, refrescar).
 */
export function useBackupActions() {
  const { success, error: notifyError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);

  const toggleTableSelection = useCallback((tableName) => {
    setSelectedTables(prev =>
      prev.includes(tableName)
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  }, []);

  const handleCreateBackup = useCallback(async (type) => {
    setLoading(true);
    setAlert({ type: 'info', message: `Iniciando respaldo ${type}...` });
    try {
      await api.database.createBackup(type);
      success(`Respaldo ${type} creado correctamente`);
      setAlert({ type: 'success', message: 'Respaldo completado exitosamente' });
      return { success: true };
    } catch (error) {
      const errorMsg = error?.data?.detail || 'Error al realizar el respaldo';
      notifyError(errorMsg);
      setAlert({ type: 'error', message: errorMsg });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [success, notifyError]);

  const handleSelectiveBackup = useCallback(async () => {
    if (selectedTables.length === 0) {
      notifyError('Selecciona al menos una tabla');
      return { success: false };
    }
    setLoading(true);
    try {
      await api.database.createBackup('selectivo', { tables: selectedTables });
      success('Respaldo selectivo creado correctamente');
      setSelectedTables([]);
      return { success: true };
    } catch (error) {
      notifyError('Error al crear respaldo selectivo');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [selectedTables, success, notifyError]);

  const handleCreateNoSqlBackup = useCallback(async (type) => {
    setLoading(true);
    try {
      if (type === 'atlas') {
        await analyticsAPI.syncNoSqlVault({ type: 'completo' });
        success('Sincronización Cloud Atlas iniciada correctamente');
      } else {
        await api.database.createBackup('full', { engine: 'mongodb' });
        success('Respaldo a disco JSON iniciado correctamente');
      }
      return { success: true };
    } catch (error) {
      notifyError('Error al crear respaldo NoSQL');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [success, notifyError]);

  const handleDeleteBackup = useCallback(async (backupId) => {
    try {
      await api.database.deleteBackup(backupId);
      success('Respaldo eliminado exitosamente');
      return { success: true };
    } catch (error) {
      notifyError('Error al eliminar respaldo');
      return { success: false, error };
    }
  }, [success, notifyError]);

  const handleDownloadBackup = useCallback((backupId, format = 'sql') => {
    try {
      let url = api.database.downloadBackupUrl(backupId);
      let fileName = backupId.toLowerCase().endsWith('.sql') ? backupId : `${backupId}.sql`;

      if (format === 'json') {
        url = api.database.exportJsonUrl();
        fileName = `database_export_${new Date().toISOString().split('T')[0]}.json`;
      } else if (format === 'excel') {
        url = api.database.exportExcelUrl();
        fileName = `database_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      } else if (format === 'pdf') {
        url = api.database.exportPdfUrl();
        fileName = `database_report_${new Date().toISOString().split('T')[0]}.pdf`;
      } else if (format === 'svg') {
        url = api.database.exportSvgUrl();
        fileName = `database_schema_${new Date().toISOString().split('T')[0]}.svg`;
      }

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      success('Iniciando descarga en formato ' + format.toUpperCase() + '...');
      return { success: true };
    } catch (error) {
      notifyError('Error al iniciar la descarga');
      return { success: false, error };
    }
  }, [success, notifyError]);

  const handleClearCache = useCallback(async () => {
    try {
      await api.database.clearCache();
      success('Caché limpiado exitosamente');
      return { success: true };
    } catch (error) {
      notifyError('Error al limpiar caché');
      return { success: false, error };
    }
  }, [success, notifyError]);

  const handleOptimizeDB = useCallback(async () => {
    try {
      await api.database.optimize();
      success('Base de datos optimizada exitosamente');
      return { success: true };
    } catch (error) {
      notifyError('Error al optimizar base de datos');
      return { success: false, error };
    }
  }, [success, notifyError]);

  const fetchTables = useCallback(async () => {
    try {
      const res = await api.database.listTables();
      setTables(res.tables || []);
    } catch (err) {
      notifyError('Error al cargar tablas');
    }
  }, [notifyError]);

  return {
    loading, alert, setAlert,
    tables, selectedTables, setSelectedTables, toggleTableSelection,
    handleCreateBackup, handleSelectiveBackup, handleCreateNoSqlBackup,
    handleDeleteBackup, handleDownloadBackup,
    handleClearCache, handleOptimizeDB, fetchTables
  };
}
