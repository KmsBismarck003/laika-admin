import { isRequired } from '@/utils/validators';

export const BACKUP_TYPES = ['completo', 'incremental', 'selectivo', 'full'];
export const AUTO_FREQUENCIES = ['hourly', 'daily', 'weekly', 'monthly'];

const isPositiveInteger = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

export const validateRetentionDays = (value) => {
  if (!isPositiveInteger(value)) return 'La retencion debe ser un entero mayor a cero dias.';
  if (Number(value) > 365) return 'La retencion no puede superar 365 dias.';
  return null;
};

export const validateMaxBackups = (value) => {
  if (!isPositiveInteger(value)) return 'El maximo de respaldos debe ser un entero mayor a cero.';
  return null;
};

export const validateTimeHHMM = (value) => {
  if (!isRequired(value)) return 'La hora es obligatoria.';
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(value).trim())) {
    return 'La hora debe tener formato 24h HH:MM.';
  }
  return null;
};

export const validateDayOfMonth = (value) => {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1 || num > 31) {
    return 'El dia del mes debe estar entre 1 y 31.';
  }
  return null;
};

export const validateDayOfWeek = (value) => {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 0 || num > 6) {
    return 'El dia de la semana debe estar entre 0 (domingo) y 6 (sabado).';
  }
  return null;
};

export const validateBackupType = (value) => {
  if (!BACKUP_TYPES.includes(value)) return 'Tipo de respaldo no soportado.';
  return null;
};

export const validateTableSelection = (tables = []) => {
  if (!Array.isArray(tables) || tables.length === 0) {
    return 'Selecciona al menos una tabla para el respaldo selectivo.';
  }
  return null;
};

export const validateAutoConfig = (config = {}) => {
  const errors = {};

  if (!AUTO_FREQUENCIES.includes(config.frequency)) {
    errors.frequency = 'Frecuencia no soportada.';
  }
  const timeError = validateTimeHHMM(config.time);
  if (timeError) errors.time = timeError;

  const retentionError = validateRetentionDays(config.retentionDays);
  if (retentionError) errors.retentionDays = retentionError;

  const maxError = validateMaxBackups(config.maxBackups);
  if (maxError) errors.maxBackups = maxError;

  if (config.frequency === 'weekly') {
    const dayError = validateDayOfWeek(config.dayOfWeek);
    if (dayError) errors.dayOfWeek = dayError;
  }
  if (config.frequency === 'monthly') {
    const dayError = validateDayOfMonth(config.dayOfMonth);
    if (dayError) errors.dayOfMonth = dayError;
  }

  const typeError = validateBackupType(config.backupType);
  if (typeError) errors.backupType = typeError;

  return { valid: Object.keys(errors).length === 0, errors };
};

export default {
  BACKUP_TYPES,
  AUTO_FREQUENCIES,
  validateRetentionDays,
  validateMaxBackups,
  validateTimeHHMM,
  validateDayOfMonth,
  validateDayOfWeek,
  validateBackupType,
  validateTableSelection,
  validateAutoConfig,
};
