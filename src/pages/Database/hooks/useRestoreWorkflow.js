import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { useNotification } from '@/context/NotificationContext';

/**
 * useRestoreWorkflow — Hook para gestionar el flujo crítico de restauración y auditoría.
 */
export function useRestoreWorkflow(modalHelpers, onSuccess) {
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotification();
  const { setConfirmConfig, handleOpenModal, handleCloseModal } = modalHelpers;

  const _doRestore = useCallback(async (backupId, backups = []) => {
    handleCloseModal('confirm');
    const restoreStartTime = new Date().toISOString();
    try {
      const response = await api.database.restore(backupId);
      success('Base de datos restaurada exitosamente');
      if (onSuccess) onSuccess();

      const backupInfo = backups.find(b => b.backup_id === backupId);
      const prefillData = {
        start_datetime: restoreStartTime.slice(0, 16),
        end_datetime: new Date().toISOString().slice(0, 16),
        database_name: response?.database || 'laika_club',
        environment: 'produccion',
        restore_type: backupInfo?.type || response?.backup_type || 'completo',
        backup_size_mb: backupInfo?.size_mb || '',
        execution_method: 'manual',
        server_name: window.location.hostname || 'localhost',
        restore_reason: `Restauración desde respaldo ${backupId.substring(0, 20)}...`
      };

      setConfirmConfig({
        title: 'Restauración Exitosa',
        message: '¿Deseas registrar esta restauración en el sistema de Auditoría para mantener un historial preventivo?',
        confirmText: 'REGISTRAR AUDITORÍA',
        variant: 'success',
        onConfirm: () => {
          handleCloseModal('confirm');
          navigate('/admin/restore-audit', {
            state: { prefill: prefillData, autoOpenWizard: true }
          });
        }
      });
      handleOpenModal('confirm');
    } catch (error) {
      notifyError('Error al restaurar base de datos');
    }
  }, [handleCloseModal, navigate, setConfirmConfig, handleOpenModal, onSuccess, success, notifyError]);

  const handleRestore = useCallback((backupId, backups = []) => {
    setConfirmConfig({
      title: 'Restaurar Base de Datos',
      message: 'ADVERTENCIA: Esta acción sobrescribirá TODOS los datos actuales con los del respaldo seleccionado. Esta operación es irreversible.',
      confirmText: 'RESTAURAR',
      variant: 'danger',
      onConfirm: () => _doRestore(backupId, backups)
    });
    handleOpenModal('confirm');
  }, [setConfirmConfig, handleOpenModal, _doRestore]);

  const handleNoSqlRestore = useCallback((snapId) => {
    setConfirmConfig({
      title: 'Restaurar NoSQL',
      message: `Esto sobreescribirá datos en Atlas. ¿Continuar con ${snapId}?`,
      confirmText: 'RESTAURAR',
      variant: 'danger',
      onConfirm: async () => {
        handleCloseModal('confirm');
        try {
          await api.database.restore(snapId);
          success('Restauración NoSQL completada');
          if (onSuccess) onSuccess();
        } catch (err) {
          notifyError('Error al restaurar');
        }
      }
    });
    handleOpenModal('confirm');
  }, [setConfirmConfig, handleOpenModal, handleCloseModal, onSuccess, success, notifyError]);

  return { handleRestore, handleNoSqlRestore };
}
