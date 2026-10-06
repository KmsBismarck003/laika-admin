import React from 'react';
import { Button, Input, Table } from '@/components';
import { getDisplayName } from '../utils/staffingRules';

const ManagerSelector = ({ contracts, selectedContractId, onSelect, query, onQueryChange, loading }) => {
  const filtered = contracts.filter((contract) => {
    const text = String(query || '').trim().toLowerCase();
    if (!text) return true;
    const haystack = `${contract.name || ''} ${contract.organization?.name || ''} ${contract.id || ''}`.toLowerCase();
    return haystack.includes(text);
  });

  const columns = [
    { key: 'id', header: 'Folio' },
    { key: 'name', header: 'Contrato' },
    {
      key: 'organization',
      header: 'Cliente',
      render: (value) => value?.name || 'N/A',
    },
    {
      key: 'manager',
      header: 'Gestor',
      render: (_, row) => getDisplayName(row.manager || row.gestor || {}),
    },
    {
      key: 'actions',
      header: 'Ver',
      render: (_, row) => (
        <Button
          size="small"
          variant={String(row.id) === String(selectedContractId) ? 'primary' : 'secondary'}
          onClick={() => onSelect(row.id)}
        >
          Seleccionar
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Input
        placeholder="Buscar por contrato, cliente o folio..."
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        fullWidth
      />
      <div style={{ marginTop: '0.75rem' }}>
        {loading ? (
          <p className="mgrc-empty">Cargando contratos...</p>
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </div>
    </div>
  );
};

export default ManagerSelector;
