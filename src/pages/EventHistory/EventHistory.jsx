import React, { useState, useEffect } from 'react';
import { apiClient } from '@/services/apiClient';
import { BentoGrid, BentoCard, LoadingScreen, Icon, Badge } from '@/components';
import { getImageUrl } from '@/utils/imageUtils';

const EventHistory = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    fetchHistoricalEvents();
  }, []);

  const fetchHistoricalEvents = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/events/historical');
      setEvents(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error('Error fetching historical events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (eventId) => {
    try {
      setLoadingAnalytics(true);
      const [ticketsRes, revenueRes] = await Promise.all([
        apiClient.get(`/events/manager/events/${eventId}/tickets`),
        apiClient.get(`/events/manager/events/${eventId}/revenue`)
      ]);
      setAnalytics({
        tickets: ticketsRes,
        revenue: revenueRes
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    fetchAnalytics(event.id);
  };

  if (loading) return <LoadingScreen label="Cargando Historial..." />;

  if (selectedEvent) {
    return (
      <div className="event-history-details-container fade-in">
        <button className="back-btn" onClick={() => setSelectedEvent(null)}>
          <Icon name="arrowLeft" /> Volver al Historial
        </button>
        
        <div className="event-history-header">
          {selectedEvent.image_url && <img src={getImageUrl(selectedEvent.image_url)} alt={selectedEvent.name} className="event-history-cover" />}
          <div className="event-history-info">
            <h2>{selectedEvent.name}</h2>
            <p className="event-date-loc"><Icon name="calendar" size={14}/> Finalizado el {selectedEvent.event_date}</p>
            <p className="event-date-loc"><Icon name="mapPin" size={14}/> {selectedEvent.venue_name || 'Sin sede'}</p>
            <span className="badge-finished">Evento Concluido</span>
          </div>
        </div>

        {loadingAnalytics ? (
          <div className="analytics-loading">Cargando métricas...</div>
        ) : analytics ? (
        <BentoGrid>
          <BentoCard variant="stat">
            <div className="bento-stat-content">
              <div>
                <div className="bento-stat-label">Ingresos Totales</div>
                <div className="bento-stat-value">${analytics?.revenue?.gross?.toLocaleString() || 0}</div>
              </div>
              <div className="bento-stat-icon"><Icon name="dollarSign" size={24} /></div>
            </div>
          </BentoCard>

          <BentoCard variant="stat">
            <div className="bento-stat-content">
              <div>
                <div className="bento-stat-label">Boletos Vendidos</div>
                <div className="bento-stat-value">{analytics?.tickets?.sold || 0}</div>
              </div>
              <div className="bento-stat-icon"><Icon name="ticket" size={24} /></div>
            </div>
          </BentoCard>

          <BentoCard variant="stat">
            <div className="bento-stat-content">
              <div>
                <div className="bento-stat-label">Asistencias (Scaneados)</div>
                <div className="bento-stat-value">{analytics?.tickets?.used || 0}</div>
              </div>
              <div className="bento-stat-icon"><Icon name="checkCircle" size={24} /></div>
            </div>
          </BentoCard>
        </BentoGrid>
        ) : (
          <div className="analytics-error">No se pudieron cargar las métricas.</div>
        )}
      </div>
    );
  }

  return (
    <div className="event-history-container fade-in">
      <div className="event-history-topbar">
        <h1>Historial de Eventos Finalizados</h1>
        <p>Consulta métricas y auditoría de eventos que ya concluyeron.</p>
      </div>

      {events.length === 0 ? (
        <BentoCard>
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Icon name="history" size={48} />
            <h3>Sin eventos finalizados</h3>
            <p>Los eventos aparecerán aquí automáticamente una vez que su fecha y hora hayan concluido.</p>
          </div>
        </BentoCard>
      ) : (
        <BentoGrid>
          {events.map(event => (
            <BentoCard key={event.id} className="bento-card--clickable" onClick={() => handleSelectEvent(event)} style={{ padding: 0 }}>
              <div style={{ width: '100%', height: '160px', overflow: 'hidden', position: 'relative' }}>
                {event.image_url ? (
                  <img src={getImageUrl(event.image_url)} alt={event.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><Icon name="image" size={32} /></div>
                )}
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{event.name}</h4>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}><Icon name="calendar" size={14} /> {event.event_date}</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}><Icon name="mapPin" size={14} /> {event.venue_name || 'Sin sede'}</p>
              </div>
            </BentoCard>
          ))}
        </BentoGrid>
      )}
    </div>
  );
};

export default EventHistory;
