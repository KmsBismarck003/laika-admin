import React, { useState, useEffect, useCallback } from 'react'
import { BentoGrid, BentoCard, Table, Badge, Button, Input, Icon, SkeletonRow, Pagination, Modal } from '@/components'
import Skeleton from '@/components/Skeleton/Skeleton';
import { useNotification } from '@/context/NotificationContext'
import useAdminUsers from '@/hooks/useAdminUsers'
import { useSkeletonContext } from '@/context/SkeletonContext'
import { getImageUrl } from '@/utils/imageUtils'
import { achievementsAPI } from '@/services/miscService'

// Modales Advanced
import UserPermissionsModal from '@/components/Modals/UserPermissionsModal/UserPermissionsModal'
import UserFormModal from '@/components/Modals/UserFormModal'
import UserEditModal from '@/components/Modals/UserEditModal'
import UserPreviewModal from '@/components/Modals/UserPreviewModal/UserPreviewModal'
import ConfirmationModal from '@/components/Modals/ConfirmationModal'

// Removed legacy UserManagement.css and admin.css to rely on global Bento styling

const Users = () => {
  const { success, error: notifyError } = useNotification()
  const {
    users,
    total,
    loading,
    filters,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleStatus,
    unlockUser,
    approvePermission,
    togglePermission,
    updateFilters,
    clearFilters
  } = useAdminUsers()
  const { showSkeleton } = useSkeletonContext()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [campaignRunning, setCampaignRunning] = useState(false)
  const [campaignResult, setCampaignResult] = useState(null)

  const handleRunCampaign = async (testMode = false) => {
    setCampaignRunning(true)
    setCampaignResult(null)
    try {
      const res = await achievementsAPI.runIncentives(testMode)
      setCampaignResult(res)
      success(`Campaña de fidelización ejecutada con éxito. Se crearon ${res.incentives_created_count} cupones.`)
    } catch (e) {
      console.error(e)
      const errorMsg = e.response?.data?.detail || e.message || 'Error al ejecutar campaña'
      notifyError(errorMsg)
    } finally {
      setCampaignRunning(false)
    }
  }

  const [confirmConfig, setConfirmConfig] = useState({
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => { },
    variant: 'danger'
  })
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  // Carga inicial
  useEffect(() => {
    fetchUsers()
  }, [])

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateFilters({ search: searchInput })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput, filters.search, updateFilters])

  const handleClearFilters = () => {
    setSearchInput('')
    clearFilters()
  }

  const handleToggleStatus = (user) => {
    setSelectedUser(user) // CRITICAL: Sin esto el modal no se renderiza
    const isDeactivating = user.status === 'active'
    const label = isDeactivating ? 'BAJA' : 'ALTA'
    const finalConfirmText = `${label} ${user.first_name || 'USUARIO'}`.toUpperCase()

    setConfirmConfig({
      title: `Confirmar ${label}`,
      message: `¿Estás seguro de ${isDeactivating ? 'deshabilitar' : 'habilitar'} a ${user.first_name || user.email}?`,
      confirmText: finalConfirmText,
      variant: isDeactivating ? 'danger' : 'success',
      onConfirm: async () => {
        const ok = await toggleStatus(user.id, user.status)
        if (ok) setShowConfirmModal(false)
      }
    })
    setShowConfirmModal(true)
  }

  const handleUnlock = (user) => {
    setSelectedUser(user)
    const confirmText = `DESBLOQUEAR ${user.first_name || 'USUARIO'}`.toUpperCase()
    setConfirmConfig({
      title: 'Desbloquear Cuenta',
      message: `¿Desbloquear la cuenta de ${user.first_name || user.email}?`,
      confirmText,
      variant: 'info',
      onConfirm: async () => {
        const ok = await unlockUser(user.id)
        if (ok) setShowConfirmModal(false)
      }
    })
    setShowConfirmModal(true)
  }

  const handleDelete = (user) => {
    setSelectedUser(user)
    const confirmText = `ELIMINAR ${user.first_name || 'USUARIO'}`.toUpperCase()
    setConfirmConfig({
      title: 'ELIMINAR USUARIO',
      message: `¡ALERTA! Esta acción eliminará permanentemente a ${user.first_name || user.email} y todos sus datos asociados.`,
      confirmText,
      variant: 'danger',
      onConfirm: async () => {
        const ok = await deleteUser(user.id)
        if (ok) setShowConfirmModal(false)
      }
    })
    setShowConfirmModal(true)
  }

  // Sub-componente interno para cuenta regresiva de bloqueo
  const LockoutCountdown = ({ targetDate }) => {
    const [secondsLeft, setSecondsLeft] = useState(() => {
      if (!targetDate) return 0
      const diff = Math.floor((new Date(targetDate) - new Date()) / 1000)
      return diff > 0 ? diff : 0
    })

    useEffect(() => {
      if (secondsLeft <= 0) return
      const timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000)
      return () => clearInterval(timer)
    }, [secondsLeft])

    if (secondsLeft <= 0) return null

    const m = Math.floor(secondsLeft / 60)
    const s = secondsLeft % 60
    return (
      <span className="user-mgmt__status-badge user-mgmt__status-badge--locked">
        <Icon name="lock" size={10} className="mr-1" />
        BLOQUEADO ({m}:{s.toString().padStart(2, '0')})
      </span>
    )
  }

  const renderStatusBadge = (user) => {
    const lockoutUntil = user.lockout_until
    const isLockedByTime = lockoutUntil && new Date(lockoutUntil) > new Date()

    if (isLockedByTime || user.status === 'locked') {
      return <LockoutCountdown targetDate={lockoutUntil} /> || (
        <span className="user-mgmt__status-badge user-mgmt__status-badge--locked">
          <Icon name="lock" size={10} className="mr-1" /> BLOQUEADO
        </span>
      )
    }

    const config = {
      active: { label: 'Activo', cls: 'active' },
      disabled: { label: 'Baja', cls: 'disabled' }
    }
    const c = config[user.status] || { label: user.status || 'OFF', cls: 'disabled' }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span className={`user-mgmt__status-badge user-mgmt__status-badge--${c.cls}`}>
          <span className="user-mgmt__status-dot" /> {c.label}
        </span>
        {user.pending_request && (
          <span className="user-mgmt__status-badge" style={{ backgroundColor: 'rgba(255, 193, 7, 0.2)', color: '#ffc107', border: '1px solid #ffc107' }}>
            <Icon name="bell" size={10} className="mr-1" /> SOLICITUD
          </span>
        )}
      </div>
    )
  }

  const columns = [
    {
      key: 'avatar_url',
      header: '',
      render: (val, row) => (
        <div 
          className="user-mgmt__avatar-wrapper"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(row);
            setShowPreviewModal(true);
          }}
          style={{ cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-hover)' }}
          title="Ver vista previa"
        >
          <img 
            src={getImageUrl(val || row.avatar || row.profile_photo)} 
            alt="Avatar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://ui-avatars.com/api/?name=' + (row.first_name || 'U') + '&background=random'
            }}
          />
        </div>
      )
    },
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      render: (_, row) => `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.email || '—'
    },
    { key: 'email', header: 'Email', sortable: true },
    {
      key: 'role',
      header: 'Rol',
      sortable: true,
      render: (value) => {
        const variants = { admin: 'danger', gestor: 'warning', operador: 'info', usuario: 'default' }
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge variant={variants[value] || 'default'}>{value?.toUpperCase() || 'USUARIO'}</Badge>
            {value === 'admin' && <Icon name="sparkles" size={14} style={{ color: '#fadb14' }} />}
          </div>
        )
      }
    },
    { key: 'status', header: 'Estado', render: (_, row) => renderStatusBadge(row) },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_, row) => {
        if (row.role === 'admin') {
          return (
            <div className="user-mgmt__protected-badge">
              <Icon name="shield" size={16} /> <span style={{ marginLeft: '8px' }}>PROTEGIDO</span>
            </div>
          )
        }
        return (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {row.pending_request && (
              <Button size="small" variant="success" onClick={() => approvePermission(row.id, row.pending_request)}>
                <Icon name="check" size={12} className="mr-1" /> AUTORIZAR
              </Button>
            )}
            

            <Button size="small" variant="warning" onClick={() => { setSelectedUser(row); setShowEditModal(true) }}>
              <Icon name="edit" size={12} className="mr-1" /> EDITAR
            </Button>
            <Button size="small" variant="secondary" onClick={() => { setSelectedUser(row); setShowPermissionsModal(true) }}>
              <Icon name="shield" size={12} className="mr-1" /> PERMISOS
            </Button>
            <Button
              size="small"
              variant={row.status === 'active' ? 'danger' : 'primary'}
              onClick={() => handleToggleStatus(row)}
            >
              <Icon name="power" size={12} className="mr-1" /> {row.status === 'active' ? 'BAJA' : 'ALTA'}
            </Button>
            {(row.status === 'locked' || (row.lockout_until && new Date(row.lockout_until) > new Date())) && (
              <Button size="small" variant="info" onClick={() => handleUnlock(row)}>
                <Icon name="unlock" size={12} className="mr-1" /> LIBERAR
              </Button>
            )}
          </div>
        )
      }
    }
  ]


  return (
    <div className="admin-users-page" style={{ padding: '0.5rem 0' }}>
      <BentoGrid style={{ marginBottom: '1.5rem' }}>
        <BentoCard style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-text)' }}>Usuarios</h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="secondary" size="small" onClick={() => fetchUsers()}>Refrescar</Button>
              <Button variant="warning" size="small" onClick={() => setShowCampaignModal(true)}>
                <Icon name="tag" size={12} style={{ marginRight: '4px' }} /> Campañas
              </Button>
              <Button variant="primary" size="small" onClick={() => setShowCreateModal(true)}>
                <Icon name="plus" size={12} style={{ marginRight: '4px' }} /> Nuevo
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 300px' }}>
              <Input
                placeholder="Buscar..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                icon={<Icon name="search" size={14} />}
                fullWidth
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>ROL:</label>
                <select
                  style={{ background: 'var(--color-surface-hover)', color: 'var(--color-text)', border: '1px solid var(--color-border)', padding: '0.4rem', borderRadius: '6px', fontSize: '0.85rem' }}
                  value={filters.role}
                  onChange={e => updateFilters({ role: e.target.value })}
                >
                  <option value="">TODOS</option>
                  <option value="admin">ADMIN</option>
                  <option value="gestor">GESTOR</option>
                  <option value="operador">OPERADOR</option>
                  <option value="usuario">USUARIO</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>ESTADO:</label>
                <select
                  style={{ background: 'var(--color-surface-hover)', color: 'var(--color-text)', border: '1px solid var(--color-border)', padding: '0.4rem', borderRadius: '6px', fontSize: '0.85rem' }}
                  value={filters.status || ''}
                  onChange={e => updateFilters({ status: e.target.value })}
                >
                  <option value="">TODOS</option>
                  <option value="active">ACTIVO</option>
                  <option value="disabled">BAJA</option>
                  <option value="locked">BLOQUEO</option>
                </select>
              </div>

              {(filters.search || filters.role || filters.status) && (
                <Button variant="secondary" size="small" onClick={handleClearFilters} style={{ padding: '0.4rem' }}>
                  <Icon name="x" size={14} />
                </Button>
              )}

              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {loading ? <Skeleton type="text" width="30px" height="12px" style={{ display: 'inline-block' }} /> : <strong style={{ color: 'var(--color-text)' }}>{total}</strong>} REGISTROS
              </div>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>

      <BentoGrid>
        <BentoCard style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'var(--color-surface-hover)', borderBottom: '2px solid var(--color-border)' }}>
                {['USUARIO', 'EMAIL', 'ROL', 'ESTADO', 'FECHA', 'ACCIONES'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>{h}</th>)}
              </tr></thead>
              <tbody>{Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} columns={6} />)}</tbody>
            </table>
          ) : (
            <>
              <Table 
                columns={columns} 
                data={users} 
                sortable 
                rowPriority={(row) => {
                  const priorities = {
                    admin: 100,
                    gestor: 90,
                    operador: 80,
                    usuario: 70
                  }
                  return priorities[row.role] || 0
                }}
                rowClassName={(row) => `user-row--${row.role}`}
              />
              {total > (filters.limit || 15) && (
                <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--color-border)' }}>
                  <Pagination 
                    currentPage={filters.page || 1}
                    totalPages={Math.ceil(total / (filters.limit || 15))}
                    onPageChange={(page) => updateFilters({ page })}
                  />
                </div>
              )}
            </>
          )}
        </BentoCard>
      </BentoGrid>

      {/* Modales */}
      <UserFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createUser}
      />

      <Modal 
        isOpen={showCampaignModal} 
        onClose={() => setShowCampaignModal(false)} 
        title="Campañas de Reactivación" 
        size="medium"
        footer={
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button 
              variant="secondary" 
              onClick={() => handleRunCampaign(true)} 
              disabled={campaignRunning}
            >
              {campaignRunning ? 'Ejecutando...' : 'Ejecutar Prueba (1 min)'}
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleRunCampaign(false)} 
              disabled={campaignRunning}
            >
              {campaignRunning ? 'Ejecutando...' : 'Ejecutar Campaña (90 días)'}
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.5, margin: 0, color: 'var(--color-text-secondary)' }}>
            Ejecuta el escáner de inactividad de usuarios. El sistema analizará el historial de compras y actividad de todos los usuarios registrados y generará incentivos de manera automática en sus centros de cupones.
          </p>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderRadius: '4px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Badge variant="danger" style={{ marginTop: '2px' }}>REGRESO TRIUNFAL</Badge>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                <strong>Inactividad de Compra (90 días):</strong> Clientes que han comprado boletos en el pasado pero no en los últimos 90 días. Reciben un cupón del <strong>15% de descuento</strong>.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Badge variant="warning" style={{ marginTop: '2px' }}>PRIMER PASO</Badge>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                <strong>Registro sin Compras (30 días):</strong> Usuarios registrados hace más de 30 días que nunca han comprado un boleto. Reciben <strong>100% de descuento en el cargo por servicio</strong>.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Badge variant="info" style={{ marginTop: '2px' }}>DESPIERTA CUENTA</Badge>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                <strong>Inactividad de Acceso (60 días):</strong> Usuarios que no han iniciado sesión en los últimos 60 días. Reciben un cupón de <strong>$200 de descuento directo</strong>.
              </div>
            </div>
          </div>

          {campaignResult && (
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid rgba(0,255,0,0.2)', background: 'rgba(0,255,0,0.03)', padding: '1rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>
              <div style={{ color: '#4ade80', fontWeight: 'bold', marginBottom: '8px' }}>
                ✓ Campaña completada con éxito.
              </div>
              <div style={{ marginBottom: '4px' }}>Usuarios procesados: {campaignResult.processed_users}</div>
              <div style={{ marginBottom: '8px' }}>Nuevos cupones creados: {campaignResult.incentives_created_count}</div>
              {campaignResult.incentives && campaignResult.incentives.length > 0 ? (
                <table style={{ width: '100%', marginTop: '8px', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                      <th style={{ padding: '4px' }}>Email</th>
                      <th style={{ padding: '4px' }}>Campaña</th>
                      <th style={{ padding: '4px' }}>Código</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignResult.incentives.map((inc, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '4px', opacity: 0.8 }}>{inc.email}</td>
                        <td style={{ padding: '4px', opacity: 0.8 }}>{inc.campaign}</td>
                        <td style={{ padding: '4px', color: 'var(--primary)', fontWeight: 'bold' }}>{inc.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ opacity: 0.5 }}>Ningún usuario cumplió con los criterios en esta ejecución.</div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {selectedUser && (
        <>
          <UserPreviewModal
            isOpen={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
            user={selectedUser}
          />
          <UserEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            user={selectedUser}
            onUpdate={updateUser}
          />
          <UserPermissionsModal
            isOpen={showPermissionsModal}
            onClose={() => setShowPermissionsModal(false)}
            user={selectedUser}
            onUpdate={() => fetchUsers()}
          />
          <ConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={confirmConfig.onConfirm}
            title={confirmConfig.title}
            message={confirmConfig.message}
            confirmText={confirmConfig.confirmText}
            variant={confirmConfig.variant}
            loading={loading}
          />
        </>
      )}
    </div>
  )
}

export default Users
