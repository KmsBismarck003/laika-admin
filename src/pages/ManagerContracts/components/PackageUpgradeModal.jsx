import React, { useEffect, useState } from 'react';
import { Button, Input, Modal } from '@/components';
import ContractDetailCard from './ContractDetailCard';

const PackageUpgradeModal = ({ isOpen, onClose, contract, onSubmit, processing, fieldErrors = {} }) => {
  const [form, setForm] = useState({ name: '', maxEvents: 0, isUnlimited: false });

  useEffect(() => {
    if (!isOpen || !contract) return;
    setForm({
      name: contract.name || '',
      maxEvents: contract.maxEvents || 0,
      isUnlimited: Boolean(contract.isUnlimited),
    });
  }, [isOpen, contract]);

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!contract) return;
    const result = await onSubmit(contract, form);
    if (result?.success) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Mejorar paquete - Folio ${contract?.id ?? ''}`}>
      <form className="mgrc-form" onSubmit={handleSubmit}>
        <p className="mgrc-notice">
          Mejorar paquete solo permite aumentar capacidad o activar ilimitado sobre el mismo folio.
          No permite reducir limites.
        </p>

        <ContractDetailCard contract={contract} />

        <Input label="Nombre del paquete" required value={form.name} onChange={(e) => set({ name: e.target.value })} />

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
          <input type="checkbox" checked={form.isUnlimited} onChange={(e) => set({ isUnlimited: e.target.checked })} />
          Paquete ilimitado
        </label>

        {!form.isUnlimited && (
          <div>
            <Input label="Nuevo limite maximo de eventos" type="number" min="1" required value={form.maxEvents} onChange={(e) => set({ maxEvents: Number(e.target.value) })} />
            {fieldErrors.maxEvents && <span className="mgrc-error">{fieldErrors.maxEvents}</span>}
          </div>
        )}

        <Button type="submit" variant="primary" disabled={processing}>
          {processing ? 'Aplicando...' : 'Aplicar mejora'}
        </Button>
      </form>
    </Modal>
  );
};

export default PackageUpgradeModal;
