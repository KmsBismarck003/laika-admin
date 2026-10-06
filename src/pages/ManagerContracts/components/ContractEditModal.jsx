import React, { useEffect, useState } from 'react';
import { Button, Input, Modal } from '@/components';

const emptyForm = { name: '', status: 'ACTIVE', startDate: '', endDate: '', maxEvents: 0, isUnlimited: false };

const ContractEditModal = ({ isOpen, onClose, contract, onSubmit, processing, fieldErrors = {} }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) return;
    if (contract) {
      setForm({
        name: contract.name || '',
        status: contract.status || 'ACTIVE',
        startDate: contract.startDate || '',
        endDate: contract.endDate || '',
        maxEvents: contract.maxEvents || 0,
        isUnlimited: Boolean(contract.isUnlimited),
      });
    } else {
      setForm(emptyForm);
    }
  }, [contract, isOpen]);

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!contract) return;
    const result = await onSubmit(contract.id, form);
    if (result?.success) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar contrato - Folio ${contract?.id ?? ''}`}>
      <form className="mgrc-form" onSubmit={handleSubmit}>
        <Input label="Nombre del contrato / paquete" required value={form.name} onChange={(e) => set({ name: e.target.value })} />
        {fieldErrors.name && <span className="mgrc-error">{fieldErrors.name}</span>}

        <div className="mgrc-form-row">
          <div>
            <Input label="Fecha inicio" type="date" required value={form.startDate} onChange={(e) => set({ startDate: e.target.value })} />
            {fieldErrors.startDate && <span className="mgrc-error">{fieldErrors.startDate}</span>}
          </div>
          <div>
            <Input label="Fecha fin" type="date" required value={form.endDate} onChange={(e) => set({ endDate: e.target.value })} />
            {fieldErrors.endDate && <span className="mgrc-error">{fieldErrors.endDate}</span>}
          </div>
        </div>

        <div>
          <label className="mgrc-field-label" htmlFor="mgrc-edit-status">Estado</label>
          <select
            id="mgrc-edit-status"
            className="laika-input"
            value={form.status}
            onChange={(e) => set({ status: e.target.value })}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          >
            <option value="ACTIVE">Activo</option>
            <option value="PENDING">Pendiente</option>
            <option value="FINISHED">Finalizado</option>
          </select>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
          <input type="checkbox" checked={form.isUnlimited} onChange={(e) => set({ isUnlimited: e.target.checked })} />
          Paquete ilimitado
        </label>

        {!form.isUnlimited && (
          <div>
            <Input label="Limite maximo de eventos" type="number" min="1" required value={form.maxEvents} onChange={(e) => set({ maxEvents: Number(e.target.value) })} />
            {fieldErrors.maxEvents && <span className="mgrc-error">{fieldErrors.maxEvents}</span>}
          </div>
        )}

        <Button type="submit" variant="primary" disabled={processing}>
          {processing ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </form>
    </Modal>
  );
};

export default ContractEditModal;
