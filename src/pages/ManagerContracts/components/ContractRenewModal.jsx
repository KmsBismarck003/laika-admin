import React, { useEffect, useState } from 'react';
import { Button, Input, Modal } from '@/components';

const ContractRenewModal = ({ isOpen, onClose, sourceContract, onSubmit, processing, fieldErrors = {} }) => {
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', maxEvents: 0, isUnlimited: false });
  const [transferStaff, setTransferStaff] = useState(true);

  useEffect(() => {
    if (!isOpen || !sourceContract) return;
    setForm({
      name: sourceContract.name || '',
      startDate: sourceContract.endDate || '',
      endDate: '',
      maxEvents: sourceContract.maxEvents || 0,
      isUnlimited: Boolean(sourceContract.isUnlimited),
    });
    setTransferStaff(true);
  }, [isOpen, sourceContract]);

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!sourceContract) return;
    const result = await onSubmit(sourceContract, { ...form, status: 'ACTIVE' }, { transferStaff });
    if (result?.success) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Renovar contrato - Folio ${sourceContract?.id ?? ''}`}>
      <form className="mgrc-form" onSubmit={handleSubmit}>
        <p className="mgrc-notice">
          La renovacion genera un contrato nuevo con folio distinto y marca el actual como FINISHED.
          La vigencia nueva debe iniciar el dia del vencimiento anterior o despues.
        </p>

        <Input label="Nombre del contrato renovado" required value={form.name} onChange={(e) => set({ name: e.target.value })} />

        <div className="mgrc-form-row">
          <div>
            <Input label="Nueva fecha inicio" type="date" required value={form.startDate} onChange={(e) => set({ startDate: e.target.value })} />
            {fieldErrors.startDate && <span className="mgrc-error">{fieldErrors.startDate}</span>}
          </div>
          <div>
            <Input label="Nueva fecha fin" type="date" required value={form.endDate} onChange={(e) => set({ endDate: e.target.value })} />
            {fieldErrors.endDate && <span className="mgrc-error">{fieldErrors.endDate}</span>}
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
          <input type="checkbox" checked={form.isUnlimited} onChange={(e) => set({ isUnlimited: e.target.checked })} />
          Mantener paquete ilimitado
        </label>

        {!form.isUnlimited && (
          <div>
            <Input label="Limite maximo de eventos" type="number" min="1" required value={form.maxEvents} onChange={(e) => set({ maxEvents: Number(e.target.value) })} />
            {fieldErrors.maxEvents && <span className="mgrc-error">{fieldErrors.maxEvents}</span>}
          </div>
        )}

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
          <input type="checkbox" checked={transferStaff} onChange={(e) => setTransferStaff(e.target.checked)} />
          Trasladar personal asignado al nuevo folio
        </label>

        <Button type="submit" variant="primary" disabled={processing}>
          {processing ? 'Renovando...' : 'Generar nuevo folio'}
        </Button>
      </form>
    </Modal>
  );
};

export default ContractRenewModal;
