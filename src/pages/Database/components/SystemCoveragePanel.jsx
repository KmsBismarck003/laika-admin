import React from 'react';
import { BentoCard, Button, Badge } from '@/components';

const formatSnapshot = (value) => {
  if (!value) return 'Nunca';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString('es-MX');
};

const SystemCoveragePanel = ({
  pillars,
  loading,
  actionLoading,
  allCovered,
  lastSnapshot,
  windowDays,
  onSnapshot,
}) => {
  return (
    <BentoCard>
      <div className="dbk-header">
        <div>
          <h3 className="dbk-title" style={{ fontSize: '1rem' }}>Cobertura del sistema</h3>
          <p className="dbk-subtitle">
            Pilar cubierto = respaldo en los últimos {windowDays} días. Último snapshot: {formatSnapshot(lastSnapshot)}.
          </p>
        </div>
        <Button size="small" variant="primary" disabled={actionLoading} onClick={onSnapshot}>
          {actionLoading ? 'Generando...' : 'Snapshot del sistema'}
        </Button>
      </div>
      <div className="dbk-coverage-grid">
        {loading ? (
          <p className="dbk-empty">Evaluando cobertura...</p>
        ) : (
          pillars.map((pillar) => (
            <div className="dbk-pillar" key={pillar.id}>
              <span className="dbk-pillar-label">{pillar.label}</span>
              <span className="dbk-pillar-value">
                <Badge variant={pillar.covered ? 'success' : 'danger'} rounded>
                  {pillar.covered ? 'Cubierto' : 'Descubierto'}
                </Badge>
              </span>
              <span className="dbk-subtitle">{pillar.detail}</span>
            </div>
          ))
        )}
      </div>
      {!loading && pillars.length > 0 && (
        <p className="dbk-notice" style={{ marginTop: '0.75rem' }}>
          {allCovered
            ? 'Integridad verificada: los 4 pilares están cubiertos.'
            : 'Atención: hay pilares descubiertos. Genera un respaldo manual o un snapshot del sistema.'}
        </p>
      )}
    </BentoCard>
  );
};

export default SystemCoveragePanel;
