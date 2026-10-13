export const COVERAGE_WINDOW_DAYS = 7;

const daysSince = (isoDate) => {
  if (!isoDate) return null;
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
};

export const evaluateRecencyPillar = (lastBackupAt, windowDays = COVERAGE_WINDOW_DAYS) => {
  const elapsed = daysSince(lastBackupAt);
  if (elapsed === null) return { covered: false, daysSince: null, label: 'Sin respaldos registrados' };
  if (elapsed <= windowDays) return { covered: true, daysSince: elapsed, label: elapsed === 0 ? 'Respaldado hoy' : `Hace ${elapsed} dia(s)` };
  return { covered: false, daysSince: elapsed, label: `Hace ${elapsed} dia(s), fuera de ventana` };
};

export const latestDate = (items = [], keys = ['created_at']) => {
  let latest = null;
  items.forEach((item) => {
    keys.forEach((key) => {
      const value = item?.[key];
      if (!value) return;
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return;
      if (!latest || parsed > latest) latest = parsed;
    });
  });
  return latest ? latest.toISOString() : null;
};

export default { COVERAGE_WINDOW_DAYS, evaluateRecencyPillar, latestDate };
