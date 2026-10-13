import React from 'react';
import { BentoCard, Button, Table, Badge } from '@/components';

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString('es-MX');
};

const ScheduledBackupsPanel = ({
  scheduled,
  loading,
  actionLoading,
  onCancel,
  onTriggerNow,
  onCleanup,
}) => {
  const columns = [
    {
      key: 'scheduled_time',
      header: 'Próxima ejecución',
      render: (value, row) => formatDateTime(value || row.next_run || row.run_at),
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (value, row) => {
        const type = value || row.backup_type || 'completo';
        return <Badge variant="warning" rounded>{String(type).toUpperCase()}</Badge>;
      },
    },
    {
      key: 'status',
      header: 'Estado',
      render: (value, row) => {
        const status = value || row.state || 'programado';
        return <Badge variant="info" rounded dot>{String(status).toUpperCase()}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_, row) => {
        const scheduleId = row.id ?? row.schedule_id ?? row.scheduleId;
        return (
          <Button
            size="small"
            variant="danger"
            disabled={actionLoading || !scheduleId}
            onClick={() => onCancel(scheduleId)}
          >
            Cancelar
          </Button>
        );
      },
    },
  ];

  return (
    <BentoCard>
      <div className="dbk-header">
        <div>
          <h3 className="dbk-title" style={{ fontSize: '1rem' }}>Respaldos programados</h3>
          <p className="dbk-subtitle">Cancela un programado, dispara uno inmediato o purga obsoletos.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button size="small" variant="primary" disabled={actionLoading} onClick={onTriggerNow}>
            {actionLoading ? 'Procesando...' : 'Disparar ahora'}
          </Button>
          <Button size="small" variant="secondary" disabled={actionLoading} onClick={onCleanup}>
            Limpiar obsoletos
          </Button>
        </div>
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        {loading ? (
          <p className="dbk-empty">Cargando programados...</p>
        ) : (
          <Table
            columns={columns}
            data={scheduled}
            emptyMessage="No hay respaldos automáticos programados actualmente."
          />
        )}
      </div>
    </BentoCard>
  );
};

export default ScheduledBackupsPanel;
