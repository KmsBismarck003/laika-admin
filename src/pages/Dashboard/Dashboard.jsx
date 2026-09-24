import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api'
import { useNotification } from '@/context/NotificationContext'
import { Card, Button, Alert, Icon, AnimatedCounter, SkeletonCard, ConfirmationModal, BentoGrid, BentoCard } from '@/components'
import Skeleton from '@/components/Skeleton/Skeleton';
import PermissionGuard from '@/components/common/PermissionGuard'
import useSkeleton from '@/hooks/useSkeleton'
import { useSkeletonContext } from '@/context/SkeletonContext'
import './admin.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loadingErrors, setLoadingErrors] = useState([])
  const [alert, setAlert] = useState(null)
  const [displayText, setDisplayText] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [draggedItem, setDraggedItem] = useState(null)
  const { showSkeleton } = useSkeletonContext()
  // Instant UI:forced latency removed

  // Definición inicial de secciones (se usará si no hay nada en localStorage)
  const initialSections = [
    {
      id: 'criticas',
      label: 'Control Principal',
      icon: 'activity',
      items: [
        { id: 'users', path: '/admin/users', icon: 'users', label: 'Gestión Usuarios', color: 'var(--primary)' },
        { id: 'monitoring_rt', path: '/admin/monitoring', icon: 'activity', label: 'Monitoreo en Vivo', color: 'var(--primary)' },
        { id: 'big_data', path: '/admin/big-data', icon: 'chart', label: 'Análisis y Predicciones', color: 'var(--primary)' },
        { id: 'audit', path: '/admin/auth-audit', icon: 'shield', label: 'Registro de Accesos' }
      ]
    },
    {
      id: 'operativa',
      label: 'Gestión de Eventos',
      icon: 'calendar',
      items: [
        { id: 'events', path: '/admin/events', icon: 'calendar', label: 'Administrar Eventos' },
        { id: 'sales', path: '/admin/sales', icon: 'dollarSign', label: 'Reportes de Ventas' },
        { id: 'venues', path: '/admin/venues', icon: 'map', label: 'Lugares y Sedes' }
      ]
    },
    {
      id: 'infra',
      label: 'Seguridad y Sistema',
      icon: 'settings',
      items: [
        { id: 'monitoring', path: '/admin/monitoring', icon: 'activity', label: 'Estado del Sistema' },
        { id: 'database', path: '/admin/database', icon: 'database', label: 'Copias de Seguridad' },
        { id: 'config', path: '/admin/config', icon: 'settings', label: 'Ajustes' }
      ]
    }
  ]

  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem('dashboard_order')
    return saved ? JSON.parse(saved) : initialSections
  })
  const fullText = '¡Hola, Admin!'

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, index + 1))
      index++
      if (index >= fullText.length) clearInterval(timer)
    }, 100)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(clockTimer)
  }, [])

  const [stats, setStats] = useState({
    totalUsers: null,
    totalEvents: null,
    totalSales: null,
    activeUsers: null
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setLoadingErrors([])
    const errors = []

    try {
      console.log('📤 Obteniendo estadísticas...')

      const statsPromise = api.stats.getAdminDashboard()
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout en estadísticas')), 5000)
      )

      try {
        const statsResponse = await Promise.race([statsPromise, timeoutPromise])
        console.log('✅ Estadísticas obtenidas:', statsResponse)

        setStats({
          totalUsers: statsResponse?.totalUsers ?? statsResponse?.total_users ?? 0,
          totalEvents: statsResponse?.totalEvents ?? statsResponse?.total_events ?? 0,
          totalSales: statsResponse?.totalSales ?? statsResponse?.total_sales ?? 0,
          activeUsers: statsResponse?.activeUsers ?? statsResponse?.active_users ?? 0
        })
      } catch (error) {
        console.error('❌ Error al cargar estadísticas:', error)
        errors.push('Estadísticas no disponibles')
      }

      if (errors.length > 0) {
        setLoadingErrors(errors)
        setAlert({
          type: 'warning',
          message: `Algunos datos no se pudieron cargar: ${errors.join(', ')} `
        })
      }
    } catch (error) {
      console.error('❌ Error crítico al cargar dashboard:', error)
      setAlert({
        type: 'error',
        message: 'Error crítico al cargar el dashboard. Por favor, recarga la página.'
      })
    } finally {
      setLoading(false)
    }
  }

  // --- LÓGICA DRAG & DROP ---
  const handleDragStart = (e, sectionId, itemId) => {
    setDraggedItem({ sectionId, itemId })
    e.dataTransfer.effectAllowed = 'move'
    // Hacer la tarjeta semi-transparente mientras se arrastra
    e.target.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
    setDraggedItem(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetSectionId, targetItemId) => {
    e.preventDefault()
    if (!draggedItem) return

    const newSections = [...sections]
    const sourceSection = newSections.find(s => s.id === draggedItem.sectionId)
    const targetSection = newSections.find(s => s.id === targetSectionId)

    const sourceIdx = sourceSection.items.findIndex(i => i.id === draggedItem.itemId)
    const targetIdx = targetSection.items.findIndex(i => i.id === targetItemId)

    if (sourceIdx !== -1 && targetIdx !== -1) {
      const [movedItem] = sourceSection.items.splice(sourceIdx, 1)
      targetSection.items.splice(targetIdx, 0, movedItem)
      setSections(newSections)
      localStorage.setItem('dashboard_order', JSON.stringify(newSections))
    }
  }

  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  const handleResetOrder = () => {
    setIsResetModalOpen(true)
  }

  const handleConfirmReset = () => {
    localStorage.removeItem('dashboard_order')
    setSections(initialSections)
    setIsResetModalOpen(false)
  }


  const isLoading = loading || showSkeleton;

  return (
    <div className="admin-dashboard-page" style={{ padding: '2rem' }}>
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div className="welcome-banner">
          <h1 className="welcome-greeting" style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{isLoading ? <Skeleton width="220px" height="32px" /> : displayText}</h1>
          {isLoading ? (
            <Skeleton width="300px" height="14px" style={{ marginTop: '8px' }} />
          ) : (
            <p className="welcome-date" style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {currentTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} | {currentTime.toLocaleTimeString('es-ES')}
            </p>
          )}
        </div>
        <div className="header-actions">
          {isLoading ? (
            <Skeleton width="100px" height="26px" style={{ borderRadius: '4px' }} />
          ) : (
            <Button
              variant="primary"
              size="small"
              onClick={handleResetOrder}
              title="Restablecer orden"
            >
              <Icon name="refresh" size={14} />
            </Button>
          )}
        </div>
      </header>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="premium-alert"
          style={{ marginBottom: '2rem' }}
        />
      )}

      {/* STATS BENTO */}
      <div className="bento-section">
        <BentoGrid>
          <BentoCard variant="stat">
            <div className="bento-stat-content">
              <div>
                {isLoading ? <Skeleton width="90px" height="12px" style={{ marginBottom: '6px' }} /> : <div className="bento-stat-label">Total Usuarios</div>}
                <div className="bento-stat-value">
                  {isLoading ? <Skeleton width="60px" height="32px" /> : stats.totalUsers !== null ? <AnimatedCounter value={stats.totalUsers} /> : '-'}
                </div>
              </div>
              <div className="bento-stat-icon">
                {isLoading ? <Skeleton width="24px" height="24px" /> : <Icon name="users" size={24} />}
              </div>
            </div>
          </BentoCard>

          <BentoCard variant="stat">
            <div className="bento-stat-content">
              <div>
                {isLoading ? <Skeleton width="80px" height="12px" style={{ marginBottom: '6px' }} /> : <div className="bento-stat-label">Eventos</div>}
                <div className="bento-stat-value">
                  {isLoading ? <Skeleton width="50px" height="32px" /> : stats.totalEvents !== null ? <AnimatedCounter value={stats.totalEvents} /> : '-'}
                </div>
              </div>
              <div className="bento-stat-icon">
                {isLoading ? <Skeleton width="24px" height="24px" /> : <Icon name="calendar" size={24} />}
              </div>
            </div>
          </BentoCard>

          <BentoCard variant="stat">
            <div className="bento-stat-content">
              <div>
                {isLoading ? <Skeleton width="90px" height="12px" style={{ marginBottom: '6px' }} /> : <div className="bento-stat-label">Ventas Totales</div>}
                <div className="bento-stat-value">
                  {isLoading ? <Skeleton width="100px" height="32px" /> : stats.totalSales !== null ? <AnimatedCounter value={stats.totalSales} /> : '-'}
                </div>
              </div>
              <div className="bento-stat-icon">
                {isLoading ? <Skeleton width="24px" height="24px" /> : <Icon name="dollarSign" size={24} />}
              </div>
            </div>
          </BentoCard>

          <BentoCard variant="stat">
            <div className="bento-stat-content">
              <div>
                {isLoading ? <Skeleton width="60px" height="12px" style={{ marginBottom: '6px' }} /> : <div className="bento-stat-label">Online</div>}
                <div className="bento-stat-value">
                  {isLoading ? <Skeleton width="40px" height="32px" /> : stats.activeUsers !== null ? <AnimatedCounter value={stats.activeUsers} /> : '-'}
                </div>
              </div>
              <div className="bento-stat-icon">
                {isLoading ? <Skeleton width="24px" height="24px" /> : <Icon name="checkCircle" size={24} />}
              </div>
            </div>
          </BentoCard>
        </BentoGrid>
      </div>

      {/* SECTIONS BENTO */}
      <div className="dashboard-shortcuts">
        {sections.map((section) => (
          <div key={section.id} className="bento-section">
            <h3 className="bento-section-title">
              {isLoading ? (
                <Skeleton width="180px" height="24px" />
              ) : (
                <>
                  <Icon name={section.icon} size={20} /> {section.label}
                </>
              )}
            </h3>
            <BentoGrid>
              {isLoading ? (
                [...Array(section.items.length)].map((_, i) => (
                  <BentoCard key={i} variant="action">
                    <Skeleton style={{ height: '56px', width: '56px', borderRadius: '20px' }} />
                    <Skeleton style={{ height: '14px', width: '80px' }} />
                  </BentoCard>
                ))
              ) : (
                section.items.map((item) => (
                  <BentoCard
                    key={item.id}
                    variant="action"
                    draggable
                    onDragStart={(e) => handleDragStart(e, section.id, item.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, section.id, item.id)}
                    onClick={() => navigate(item.path)}
                  >
                    <div className="bento-action-icon" style={{ backgroundColor: item.color || 'var(--primary)' }}>
                      <Icon name={item.icon} size={24} />
                    </div>
                    <div className="bento-action-label">{item.label}</div>
                  </BentoCard>
                ))
              )}
            </BentoGrid>
          </div>
        ))}
      </div>

      {/* METRICS BENTO */}
      <div className="bento-section">
        <BentoGrid>
          <BentoCard variant="metric" colSpan={2} onClick={() => navigate('/admin/monitoring')}>
            <div className="bento-metric-header">
              <span className="bento-metric-title">MEMORIA RAM</span>
              <div className="bento-metric-icon-box">
                <Icon name="server" size={14} />
              </div>
            </div>
            <div className="bento-metric-body">
              {showSkeleton ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Skeleton type="text" width="40%" height="10px" />
                  <Skeleton type="text" width="80%" height="24px" />
                  <Skeleton type="rect" width="100%" height="8px" borderRadius="4px" />
                </div>
              ) : (
                <>
                  <div className="bento-metric-info-row">
                    <span className="bento-metric-subtitle">USO DE MEMORIA VOLÁTIL</span>
                    <span className="bento-metric-value">87.7%</span>
                  </div>
                  <div className="bento-metric-progress-wrapper">
                    <div 
                      className="bento-metric-progress-bar" 
                      style={{ width: '87.7%', backgroundColor: '#ef4444' }} 
                    ></div>
                  </div>
                </>
              )}
            </div>
          </BentoCard>

          <BentoCard variant="metric" colSpan={2} onClick={() => navigate('/admin/monitoring')}>
            <div className="bento-metric-header">
              <span className="bento-metric-title">CPU CORE</span>
              <div className="bento-metric-icon-box">
                <Icon name="cpu" size={14} />
              </div>
            </div>
            <div className="bento-metric-body">
              {showSkeleton ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Skeleton type="text" width="40%" height="10px" />
                  <Skeleton type="text" width="80%" height="24px" />
                  <Skeleton type="rect" width="100%" height="8px" borderRadius="4px" />
                </div>
              ) : (
                <>
                  <div className="bento-metric-info-row">
                    <span className="bento-metric-subtitle">CARGA DE PROCESAMIENTO</span>
                    <span className="bento-metric-value">56%</span>
                  </div>
                  <div className="bento-metric-progress-wrapper">
                    <div 
                      className="bento-metric-progress-bar" 
                      style={{ width: '56%', backgroundColor: '#eab308' }} 
                    ></div>
                  </div>
                </>
              )}
            </div>
          </BentoCard>
        </BentoGrid>
      </div>

      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Restablecer Orden"
        message="¿Estás seguro de que deseas restablecer el orden de las tarjetas del dashboard a su estado original?"
        confirmText="Restablecer"
        cancelText="Cancelar"
      />
    </div>
  )
}

export default Dashboard

