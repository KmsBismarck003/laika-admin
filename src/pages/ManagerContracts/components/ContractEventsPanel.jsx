import React, { useMemo } from 'react';
import { Badge, Table } from '@/components';
import { getContractCoverage } from '../utils/coverageRules';

const formatDate = (value) => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString();
};

const ContractEventsPanel = ({ contract, events, assigned, loading }) => {
  const coverage = useMemo(
    () => getContractCoverage(events || [], assigned || []),
    [events, assigned],
  );

  if (!contract) return <p className="mgrc-empty">Selecciona un contrato para ver la cobertura de sus eventos.</p>;
  if (loading) return <p className="mgrc-empty">Cargando eventos del contrato...</p>;
  if (!events || events.length === 0) {
    return <p className="mgrc-empty">Este contrato no tiene eventos vinculados. El personal asignado quedara disponible cuando se creen eventos bajo este folio.</p>;
  }

  const columns = [
    { key: 'name', header: 'Evento', render: (value, row) => value || row.title || `Evento ${row.id}` },
    {
      key: 'event_date',
      header: 'Fecha',
      render: (value, row) => formatDate(value || row.date || row.startDate),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (value) => <Badge variant={value === 'ACTIVE' ? 'success' : 'default'} rounded>{value || 'N/A'}</Badge>,
    },
    {
      key: 'coverage',
      header: 'Personal',
      render: (_, row) => {
        const item = coverage.detail.find((entry) => String(entry.event.id) === String(row.id));
        if (!item) return 'N/A';
        return `${item.operatorCount} operativo(s)`;
      },
    },
    {
      key: 'result',
      header: 'Cobertura',
      render: (_, row) => {
        const item = coverage.detail.find((entry) => String(entry.event.id) === String(row.id));
        const ok = item?.meetsMinimum;
        return <Badge variant={ok ? 'success' : 'danger'} rounded>{ok ? 'Cubierto' : 'Descubierto'}</Badge>;
      },
    },
  ];

  return (
    <div>
      <p className="mgrc-subtitle">
        El personal del folio {contract.id} cubre sus eventos. {coverage.covered} de {coverage.total} eventos cubiertos.
      </p>
      <div style={{ marginTop: '0.75rem' }}>
        <Table columns={columns} data={events} />
      </div>
    </div>
  );
};

export default ContractEventsPanel;
