import React from 'react';
import { Badge } from '@/components';

const formatDate = (value) => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString();
};

const statusVariant = (status) => {
  if (status === 'ACTIVE') return 'success';
  if (status === 'PENDING') return 'warning';
  if (status === 'FINISHED') return 'default';
  return 'default';
};

const ContractDetailCard = ({ contract }) => {
  if (!contract) {
    return <p className="mgrc-empty">Selecciona un contrato para ver su detalle, vigencia y paquete.</p>;
  }

  return (
    <div>
      <div className="mgrc-detail-grid">
        <div className="mgrc-field">
          <span className="mgrc-field-label">Folio</span>
          <span className="mgrc-field-value">{contract.id}</span>
        </div>
        <div className="mgrc-field">
          <span className="mgrc-field-label">Contrato</span>
          <span className="mgrc-field-value">{contract.name || 'N/A'}</span>
        </div>
        <div className="mgrc-field">
          <span className="mgrc-field-label">Cliente</span>
          <span className="mgrc-field-value">{contract.organization?.name || 'N/A'}</span>
        </div>
        <div className="mgrc-field">
          <span className="mgrc-field-label">Estado</span>
          <span className="mgrc-field-value">
            <Badge variant={statusVariant(contract.status)} rounded>{contract.status || 'N/A'}</Badge>
          </span>
        </div>
        <div className="mgrc-field">
          <span className="mgrc-field-label">Inicio</span>
          <span className="mgrc-field-value">{formatDate(contract.startDate)}</span>
        </div>
        <div className="mgrc-field">
          <span className="mgrc-field-label">Vence</span>
          <span className="mgrc-field-value">{formatDate(contract.endDate)}</span>
        </div>
        <div className="mgrc-field">
          <span className="mgrc-field-label">Paquete</span>
          <span className="mgrc-field-value">
            {contract.isUnlimited ? 'Ilimitado' : `${contract.maxEvents ?? 0} eventos max.`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailCard;
