import React from 'react';
import AutomaticBackupConfig from '@/components/Admin/AutomaticBackupConfig/AutomaticBackupConfig';

/**
 * AutoBackupConfigModal — Punto de entrada del módulo a la configuración automática.
 * Envuelve el configurador existente; la extracción total de su lógica a
 * useAutoBackupConfig se completará en el ciclo de limpieza 
 */
const AutoBackupConfigModal = ({ isOpen, onClose }) => {
  return <AutomaticBackupConfig isOpen={isOpen} onClose={onClose} />;
};

export default AutoBackupConfigModal;
