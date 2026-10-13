import React, { useState } from 'react'
import { BentoCard, Alert } from '@/components'
import NoSqlVault from './NoSqlVault'
import SqlVault from './SqlVault'
import { useBackupManager } from './hooks/useBackupManager'
import { useBackupActions } from './hooks/useBackupActions'
import { useDatabaseModals } from './hooks/useDatabaseModals'
import { useRestoreWorkflow } from './hooks/useRestoreWorkflow'
import { useScheduledBackups } from './hooks/useScheduledBackups'
import { useSystemCoverage } from './hooks/useSystemCoverage'
import DatabaseHeader from './components/DatabaseHeader'
import DatabaseStats from './components/DatabaseStats'
import DatabaseActions from './components/DatabaseActions'
import DatabaseModals from './components/DatabaseModals'
import AutoBackupConfigModal from './components/AutoBackupConfigModal'
import ScheduledBackupsPanel from './components/ScheduledBackupsPanel'
import SystemCoveragePanel from './components/SystemCoveragePanel'

const Database = () => {
  const [activeView, setActiveView] = useState('sql')
  const [noSqlRefresh, setNoSqlRefresh] = useState(0)
  const [noSqlLoading, setNoSqlLoading] = useState(false)

  const manager = useBackupManager()
  const actions = useBackupActions()
  const modalHelpers = useDatabaseModals()
  const { modals, confirmConfig, setConfirmConfig, handleOpenModal, handleCloseModal } = modalHelpers
  const { handleRestore } = useRestoreWorkflow(modalHelpers, manager.fetchBackupsList)
  const scheduled = useScheduledBackups(activeView === 'sql')
  const coverage = useSystemCoverage(true)

  const loadingVaults = manager.loadingBackups || noSqlLoading

  const handleCreateBackup = async (type) => {
    const result = await actions.handleCreateBackup(type)
    if (result?.success) {
      handleCloseModal('backup')
      manager.fetchBackupsList()
    }
  }

  const handleSelectiveBackup = async () => {
    const result = await actions.handleSelectiveBackup()
    if (result?.success) {
      handleCloseModal('selective')
      actions.setSelectedTables([])
      manager.fetchBackupsList()
    }
  }

  const handleCreateNoSqlBackup = async (type) => {
    const result = await actions.handleCreateNoSqlBackup(type)
    if (result?.success) {
      handleCloseModal('noSqlBackup')
      setNoSqlRefresh(r => r + 1)
    }
  }

  const handleDeleteBackup = (backupId) => {
    setConfirmConfig({
      title: 'Eliminar Respaldo',
      message: '¿Estás seguro de que deseas eliminar este respaldo permanentemente? No podrás recuperarlo.',
      confirmText: 'ELIMINAR',
      variant: 'danger',
      onConfirm: async () => {
        handleCloseModal('confirm')
        const result = await actions.handleDeleteBackup(backupId)
        if (result?.success) manager.fetchBackupsList()
      }
    })
    handleOpenModal('confirm')
  }

  const handleOpenBackup = () => {
    if (activeView?.toLowerCase() === 'nosql') {
      handleOpenModal('noSqlBackup')
    } else {
      handleOpenModal('backup')
    }
  }

  const handleOpenSelective = () => {
    handleCloseModal('backup')
    handleOpenModal('selective')
    actions.fetchTables()
  }

  const handleOptimize = () => {
    if (activeView?.toLowerCase() === 'nosql') {
      actions.setAlert({ type: 'success', message: 'Optimización de Nodos y Compactación iniciada en Atlas...' })
      setTimeout(() => actions.setAlert(null), 3000)
    } else {
      actions.handleOptimizeDB()
    }
  }

  return (
    <div className="admin-database-page">
      <DatabaseHeader activeView={activeView} setActiveView={setActiveView} loading={loadingVaults} />

      <DatabaseStats
        backups={manager.backups}
        totalSize={manager.totalSize}
        lastBackup={manager.lastBackup}
        loading={loadingVaults}
      />

      {actions.alert && (
        <Alert
          type={actions.alert.type}
          message={actions.alert.message}
          onClose={() => actions.setAlert(null)}
          style={{ marginBottom: '1.5rem' }}
        />
      )}

      <BentoCard style={{ marginBottom: '2rem', padding: '1rem' }}>
        <DatabaseActions
          activeView={activeView}
          loading={loadingVaults}
          onOpenBackup={handleOpenBackup}
          onOpenAutoConfig={() => handleOpenModal('autoBackup')}
          onOptimize={handleOptimize}
          onClearCache={actions.handleClearCache}
        />
      </BentoCard>

      {activeView === 'sql' ? (
        <>
          {/* Seccion de Respaldo Externo (Desactivado por ruta BE inexistente)
          <div className="mb-8" style={{ marginBottom: '20px' }}>
            <ExternalBackupRestore />
          </div>
          */}

          <SqlVault
            backups={manager.currentBackups}
            loading={manager.loadingBackups}
            onRefresh={manager.fetchBackupsList}
            onRestore={(backupId) => handleRestore(backupId, manager.backups)}
            onDelete={handleDeleteBackup}
            onDownload={actions.handleDownloadBackup}
            retentionDays={manager.retentionDays}
            currentPage={manager.currentPage}
            totalPages={manager.totalPages}
            onPageChange={manager.setCurrentPage}
          />

          <div style={{ marginTop: '1rem' }}>
            <ScheduledBackupsPanel
              scheduled={scheduled.scheduled}
              loading={scheduled.loading}
              actionLoading={scheduled.actionLoading}
              onCancel={scheduled.cancelScheduled}
              onTriggerNow={async () => {
                const result = await scheduled.triggerNow()
                if (result?.success) manager.fetchBackupsList()
              }}
              onCleanup={scheduled.cleanupOld}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <SystemCoveragePanel
              pillars={coverage.pillars}
              loading={coverage.loading}
              actionLoading={coverage.actionLoading}
              allCovered={coverage.allCovered}
              lastSnapshot={coverage.lastSystemSnapshot}
              windowDays={coverage.windowDays}
              onSnapshot={async () => {
                const result = await coverage.runSystemSnapshot()
                if (result?.success) manager.fetchBackupsList()
              }}
            />
          </div>
        </>
      ) : (
        <NoSqlVault retentionDays={manager.retentionDays} refreshTrigger={noSqlRefresh} onLoadingChange={setNoSqlLoading} />
      )}

      <DatabaseModals
        activeView={activeView}
        modals={modals}
        onClose={handleCloseModal}
        handlers={{
          createBackup: handleCreateBackup,
          createNoSqlBackup: handleCreateNoSqlBackup,
          selectiveBackup: handleSelectiveBackup,
          toggleTableSelection: actions.toggleTableSelection,
          openSelective: handleOpenSelective
        }}
        data={{
          tables: actions.tables,
          selectedTables: actions.selectedTables,
          confirmConfig
        }}
      />

      <AutoBackupConfigModal
        isOpen={modals.showAutoBackupModal}
        onClose={() => handleCloseModal('autoBackup')}
      />
    </div>
  )
}

export default Database
