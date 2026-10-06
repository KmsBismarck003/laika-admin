import React from 'react';
import { Button, Input } from '@/components';
import { AssignedStaffingTable } from './StaffingTable';
import { getDisplayName } from '../utils/staffingRules';

const StaffingPanel = ({
  contract,
  assigned,
  available,
  tab,
  onTabChange,
  searchQuery,
  onSearchChange,
  loading,
  actionLoading,
  onAssign,
  onUnassignRequest,
}) => {
  if (!contract) return <p className="mgrc-empty">Selecciona un contrato para gestionar su personal.</p>;

  return (
    <div>
      <div className="mgrc-tabs">
        <Button size="small" variant={tab === 'operador' ? 'primary' : 'secondary'} onClick={() => onTabChange('operador')}>
          Operadores
        </Button>
        <Button size="small" variant={tab === 'usuario' ? 'primary' : 'secondary'} onClick={() => onTabChange('usuario')}>
          Usuarios
        </Button>
      </div>

      <h4 className="mgrc-field-label">Asignados al folio {contract.id}</h4>
      <AssignedStaffingTable data={assigned} loading={loading} actionLoading={actionLoading} onUnassign={onUnassignRequest} />

      <div style={{ marginTop: '1rem' }}>
        <h4 className="mgrc-field-label">Disponibles para vincular ({tab})</h4>
        <div style={{ margin: '0.5rem 0' }}>
          <Input
            placeholder={`Buscar ${tab} por nombre o email...`}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            fullWidth
          />
        </div>
        <div className="mgrc-list">
          {loading ? (
            <p className="mgrc-empty">Cargando candidatos...</p>
          ) : available.length === 0 ? (
            <p className="mgrc-empty">No hay candidatos disponibles.</p>
          ) : (
            available.map((user) => (
              <div className="mgrc-user-row" key={user.id}>
                <div className="mgrc-user-meta">
                  <div className="mgrc-user-name">{getDisplayName(user)}</div>
                  <div className="mgrc-user-email">{user.email} ({user.role})</div>
                </div>
                <Button size="small" variant="secondary" disabled={actionLoading} onClick={() => onAssign(user.id)}>
                  Vincular
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffingPanel;
