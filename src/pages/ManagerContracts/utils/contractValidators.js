import { isRequired } from '@/utils/validators';

const toTime = (value) => {
  if (!value) return NaN;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? NaN : time;
};

const normalizeContract = (contract = {}) => ({
  organizationId: contract.organization?.id ?? contract.organizationId ?? '',
  name: contract.name ?? '',
  status: contract.status ?? 'ACTIVE',
  startDate: contract.startDate ?? '',
  endDate: contract.endDate ?? '',
  maxEvents: contract.maxEvents ?? 0,
  isUnlimited: Boolean(contract.isUnlimited),
});

export const validateEdit = (form = {}) => {
  const errors = {};

  if (!isRequired(form.name)) errors.name = 'El nombre del contrato es obligatorio.';
  if (!isRequired(form.startDate)) errors.startDate = 'La fecha de inicio es obligatoria.';
  if (!isRequired(form.endDate)) errors.endDate = 'La fecha de fin es obligatoria.';

  const start = toTime(form.startDate);
  const end = toTime(form.endDate);
  if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
    errors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio.';
  }

  if (!form.isUnlimited) {
    const maxEvents = Number(form.maxEvents);
    if (!Number.isInteger(maxEvents) || maxEvents <= 0) {
      errors.maxEvents = 'El limite de eventos debe ser un entero mayor a cero.';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateRenew = (source = {}, form = {}) => {
  const errors = {};
  const base = validateEdit({ ...normalizeContract(source), ...form });

  Object.assign(errors, base.errors);

  const previousEnd = toTime(source.endDate);
  const nextStart = toTime(form.startDate);
  if (!Number.isNaN(previousEnd) && !Number.isNaN(nextStart) && nextStart < previousEnd) {
    errors.startDate = 'La vigencia renovada debe iniciar el dia del vencimiento anterior o despues.';
  }

  if (!isRequired(form.startDate)) errors.startDate = 'La nueva fecha de inicio es obligatoria.';
  if (!isRequired(form.endDate)) errors.endDate = 'La nueva fecha de fin es obligatoria.';

  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateUpgrade = (current = {}, form = {}) => {
  const errors = {};

  if (!isRequired(form.name) && !isRequired(current.name)) {
    errors.name = 'El nombre del paquete es obligatorio.';
  }

  if (form.isUnlimited === false) {
    const next = Number(form.maxEvents);
    const prev = Number(current.maxEvents ?? 0);
    if (!Number.isInteger(next) || next <= 0) {
      errors.maxEvents = 'El limite de eventos debe ser un entero mayor a cero.';
    } else if (!current.isUnlimited && next < prev) {
      errors.maxEvents = 'Mejorar paquete no permite reducir el limite actual. Usa edicion con confirmacion para un downgrade.';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

export default { validateEdit, validateRenew, validateUpgrade };
