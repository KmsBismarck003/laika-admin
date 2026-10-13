import { useState, useCallback, useEffect } from 'react';
import api from '@/services/api';
import { analyticsAPI } from '@/services/miscService';
import { useNotification } from '@/context/NotificationContext';
import useLocalStorage from '@/hooks/useLocalStorage';
import { COVERAGE_WINDOW_DAYS, evaluateRecencyPillar, latestDate } from '../utils/systemCoverageRules';

const downloadJson = (filename, payload) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * useSystemCoverage — Integridad de los 4 pilares (SQL, NoSQL, configuración, auditoría)
 * con ventana de 7 días y snapshot manual del sistema.
 */
export function useSystemCoverage(enabled = true) {
  const { success, error: notifyError } = useNotification();
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [lastSystemSnapshot, setLastSystemSnapshot] = useLocalStorage('dbk-last-system-snapshot', null);

  const fetchCoverage = useCallback(async () => {
    setLoading(true);
    try {
      const [backupsResponse, noSqlResponse, configResponse] = await Promise.all([
        api.database.listBackups().catch(() => ({ backups: [] })),
        analyticsAPI.listNoSqlVault().catch(() => []),
        api.config.getConfig().catch(() => null),
      ]);

      const allBackups = backupsResponse?.backups || [];
      const sqlBackups = allBackups.filter(b => b && b.type !== 'mongodb' && !(b.backup_id && b.backup_id.toLowerCase().includes('mongo')));
      const noSqlItems = Array.isArray(noSqlResponse) ? noSqlResponse : (noSqlResponse?.snapshots || noSqlResponse?.data || []);

      const sqlEval = evaluateRecencyPillar(latestDate(sqlBackups, ['created_at', 'timestamp']));
      const noSqlEval = evaluateRecencyPillar(latestDate(noSqlItems, ['created_at', 'timestamp', 'createdAt']));

      setPillars([
        { id: 'sql', label: 'BD SQL', ...sqlEval, detail: `${sqlBackups.length} respaldo(s) registrados` },
        { id: 'nosql', label: 'BD NoSQL', ...noSqlEval, detail: `${noSqlItems.length} snapshot(s) en bóveda` },
        {
          id: 'config',
          label: 'Configuración',
          covered: configResponse !== null,
          daysSince: null,
          detail: configResponse !== null ? 'Export disponible' : 'Sin acceso al servicio de configuración',
        },
        {
          id: 'audit',
          label: 'Auditoría y logs',
          covered: true,
          daysSince: null,
          detail: 'Export de auditoría disponible',
        },
      ]);
    } catch (error) {
      notifyError('Error al evaluar la cobertura del sistema');
      setPillars([]);
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  useEffect(() => {
    if (enabled) fetchCoverage();
  }, [enabled, fetchCoverage]);

  const runSystemSnapshot = useCallback(async () => {
    setActionLoading(true);
    try {
      await api.database.createBackup('completo');
      const stamp = new Date().toISOString().split('T')[0];

      try {
        const config = await api.config.getConfig();
        downloadJson(`system_config_${stamp}.json`, config);
      } catch {
        notifyError('Respaldo creado, pero no se pudo exportar la configuración');
      }

      try {
        const audit = await api.restoreAudit.exportHistory({});
        downloadJson(`system_audit_${stamp}.json`, audit);
      } catch {
        notifyError('Respaldo creado, pero no se pudo exportar la auditoría');
      }

      setLastSystemSnapshot(new Date().toISOString());
      success('Snapshot del sistema completado');
      await fetchCoverage();
      return { success: true };
    } catch (error) {
      notifyError('Error al generar el snapshot del sistema');
      return { success: false, error };
    } finally {
      setActionLoading(false);
    }
  }, [fetchCoverage, setLastSystemSnapshot, success, notifyError]);

  const allCovered = pillars.length > 0 && pillars.every(p => p.covered);

  return {
    pillars, loading, actionLoading, allCovered, lastSystemSnapshot,
    windowDays: COVERAGE_WINDOW_DAYS,
    reload: fetchCoverage, runSystemSnapshot,
  };
}
