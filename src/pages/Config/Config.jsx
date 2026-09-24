import React, { useState, useEffect } from 'react'
import { BentoGrid, BentoCard, Button, Alert } from '@/components'
import Skeleton from '@/components/Skeleton'
import { useSkeletonContext } from '@/context/SkeletonContext'
import { useNotification } from '@/context/NotificationContext'
import api from '@/services/api'
// Removed admin.css to rely on global Bento styling
const Config = () => {
  const { success, error: showError } = useNotification()
  const { showSkeleton } = useSkeletonContext()
  const [loading, setLoading] = useState(true)
  const [systemConfig, setSystemConfig] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    sessionTimeout: 30,
    maxTicketsPerUser: 5
  })
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setLoading(true)
    try {
      console.log('📤 Obteniendo configuración...')
      const configResponse = await api.config.getConfig()
      console.log('✅ Configuración obtenida:', configResponse)

      setSystemConfig({
        maintenanceMode: configResponse.maintenanceMode || configResponse.maintenance_mode || false,
        registrationEnabled: configResponse.registrationEnabled || configResponse.registration_enabled !== false,
        sessionTimeout: configResponse.sessionTimeout || configResponse.session_timeout || 30,
        maxTicketsPerUser: configResponse.maxTicketsPerUser || configResponse.max_tickets_per_user || 10
      })
    } catch (error) {
      console.error('❌ Error al cargar configuración:', error)
      showError('Error al cargar configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleConfigChange = async (key, value) => {
    try {
      console.log('📤 Actualizando configuración:', key, value)
      // Optimistic update
      setSystemConfig(prev => ({ ...prev, [key]: value }))

      const configKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      await api.config.updateParameter(configKey, value)

      console.log('✅ Configuración actualizada')
      setAlert({ type: 'success', message: 'Configuración actualizada' })
      setTimeout(() => setAlert(null), 3000)
    } catch (error) {
      console.error('❌ Error al actualizar configuración:', error)
      showError('Error al actualizar configuración')
      // Revert on error
      fetchConfig()
    }
  }

  // Instant UI

  return (
    <div className="admin-config-page">
      <div className="page-header">
        <h1>Configuración del Sistema</h1>
        <Button variant="secondary" onClick={fetchConfig} disabled={loading}>
          Actualizar
        </Button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <BentoGrid>
        <BentoCard title="Ajustes Generales" style={{ padding: '2rem' }}>
          {showSkeleton ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '8px 0' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <Skeleton type="text" width={`${40 + i * 12}%`} height="14px" style={{ marginBottom: '6px' }} />
                    <Skeleton type="text" width={`${55 + i * 5}%`} height="10px" />
                  </div>
                  <Skeleton type="text" width="44px" height="24px" style={{ borderRadius: '12px' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="config-grid" style={{ display: 'grid', gap: '2rem' }}>
              <div className="config-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div className="config-info">
                  <strong style={{ color: 'var(--text-primary)' }}>Modo Mantenimiento</strong>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Deshabilita el acceso de usuarios al sistema</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={systemConfig.maintenanceMode}
                    onChange={(e) => handleConfigChange('maintenanceMode', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="config-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div className="config-info">
                  <strong style={{ color: 'var(--text-primary)' }}>Registro de Usuarios</strong>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Permite que nuevos usuarios se registren</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={systemConfig.registrationEnabled}
                    onChange={(e) => handleConfigChange('registrationEnabled', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="config-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div className="config-info">
                  <strong style={{ color: 'var(--text-primary)' }}>Tiempo de Sesión (minutos)</strong>
                </div>
                <input
                  type="number"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '4px', width: '80px', textAlign: 'center' }}
                  value={systemConfig.sessionTimeout}
                  onChange={(e) => handleConfigChange('sessionTimeout', parseInt(e.target.value))}
                  min="5"
                  max="120"
                />
              </div>

              <div className="config-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="config-info">
                  <strong style={{ color: 'var(--text-primary)' }}>Boletos Máximos por Usuario</strong>
                </div>
                <input
                  type="number"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '4px', width: '80px', textAlign: 'center' }}
                  value={systemConfig.maxTicketsPerUser}
                  onChange={(e) => handleConfigChange('maxTicketsPerUser', parseInt(e.target.value))}
                  min="1"
                  max="50"
                />
              </div>
            </div>
          )}
        </BentoCard>
      </BentoGrid>
    </div>
  )
}

export default Config
