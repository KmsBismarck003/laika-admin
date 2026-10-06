import React, { useState } from 'react';
import { BentoCard, BentoGrid, Button, ConfirmationModal } from '@/components';
import useManagerContracts from './hooks/useManagerContracts';
import useContractActions from './hooks/useContractActions';
import useContractStaffing from './hooks/useContractStaffing';
import useContractEvents from './hooks/useContractEvents';
import ManagerSelector from './components/ManagerSelector';
import ContractDetailCard from './components/ContractDetailCard';
import ContractEditModal from './components/ContractEditModal';
import ContractRenewModal from './components/ContractRenewModal';
import PackageUpgradeModal from './components/PackageUpgradeModal';
import StaffingPanel from './components/StaffingPanel';
import ContractEventsPanel from './components/ContractEventsPanel';
import './ManagerContracts.css';

const ManagerContracts = () => {
  const { contracts, selectedContract, selectedContractId, loading, selectContract, refresh } = useManagerContracts();
  const { processing, fieldErrors, editContract, upgradePackage, renewContract } = useContractActions(refresh);
  const staffing = useContractStaffing(selectedContractId, contracts);
  const contractEvents = useContractEvents(selectedContract);
  const [filter, setFilter] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [renewOpen, setRenewOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [pendingUnassign, setPendingUnassign] = useState(null);

  const hasSelection = Boolean(selectedContract);

  const handleRenew = (source, form, opts) => renewContract(
    source,
    form,
    { ...opts, transferStaff: opts?.transferStaff !== false, staffToCarry: opts?.transferStaff === false ? [] : staffing.assigned },
  );

  const confirmUnassignText = pendingUnassign ? `DESVINCULAR ${pendingUnassign}`.toUpperCase() : 'DESVINCULAR';

  return (
    <div className="mgrc-page">
      <div className="mgrc-header">
        <div>
          <h1 className="mgrc-title">Contratos de Gestores</h1>
          <p className="mgrc-subtitle">Selecciona un contrato para editarlo, renovarlo, mejorar su paquete y asignar personal exclusivo.</p>
        </div>
        <Button size="small" variant="secondary" onClick={refresh}>Refrescar</Button>
      </div>

      <div className="mgrc-layout">
        <BentoCard>
          <ManagerSelector
            contracts={contracts}
            selectedContractId={selectedContractId}
            onSelect={selectContract}
            query={filter}
            onQueryChange={setFilter}
            loading={loading}
          />
        </BentoCard>

        <BentoGrid>
          <BentoCard>
            <ContractDetailCard contract={selectedContract} />
            <div className="mgrc-actions">
              <Button size="small" variant="secondary" disabled={!hasSelection} onClick={() => setEditOpen(true)}>
                Editar contrato
              </Button>
              <Button size="small" variant="primary" disabled={!hasSelection} onClick={() => setRenewOpen(true)}>
                Renovar (nuevo folio)
              </Button>
              <Button size="small" variant="warning" disabled={!hasSelection} onClick={() => setUpgradeOpen(true)}>
                Mejorar paquete
              </Button>
            </div>
          </BentoCard>

          <BentoCard>
            <StaffingPanel
              contract={selectedContract}
              assigned={staffing.assigned}
              available={staffing.available}
              tab={staffing.tab}
              onTabChange={staffing.setTab}
              searchQuery={staffing.searchQuery}
              onSearchChange={staffing.setSearchQuery}
              loading={staffing.loading}
              actionLoading={staffing.actionLoading}
              onAssign={staffing.assign}
              onUnassignRequest={setPendingUnassign}
            />
          </BentoCard>

          <BentoCard>
            <ContractEventsPanel
              contract={selectedContract}
              events={contractEvents.events}
              assigned={staffing.assigned}
              loading={contractEvents.loading || staffing.loading}
            />
          </BentoCard>
        </BentoGrid>
      </div>

      <ContractEditModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        contract={selectedContract}
        onSubmit={editContract}
        processing={processing}
        fieldErrors={fieldErrors}
      />
      <ContractRenewModal
        isOpen={renewOpen}
        onClose={() => setRenewOpen(false)}
        sourceContract={selectedContract}
        onSubmit={handleRenew}
        processing={processing}
        fieldErrors={fieldErrors}
      />
      <PackageUpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        contract={selectedContract}
        onSubmit={upgradePackage}
        processing={processing}
        fieldErrors={fieldErrors}
      />
      <ConfirmationModal
        isOpen={pendingUnassign !== null}
        onClose={() => setPendingUnassign(null)}
        onConfirm={async () => {
          const result = await staffing.unassign(pendingUnassign);
          if (result?.success) setPendingUnassign(null);
        }}
        title="Desvincular personal"
        message={`El usuario dejara de tener acceso a los eventos de este contrato. Esta accion es reversible vinculandolo de nuevo si esta disponible.`}
        confirmText={confirmUnassignText}
        variant="danger"
        loading={staffing.actionLoading}
      />
    </div>
  );
};

export default ManagerContracts;
