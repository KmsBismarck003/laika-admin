import React from 'react';
import { Icon } from '@/components';
import { getImageUrl } from '@/utils/imageUtils';

/**
 * EventDetailHero — Tarjeta Bento Hero con banner controlado y metadatos del evento
 */
export const EventDetailHero = ({
  event,
  onBack,
  onRefresh,
  loadingRefresh
}) => {
  if (!event) return null;

  const formattedDate = event.event_date
    ? new Date(event.event_date + 'T00:00:00').toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Fecha no disponible';

  return (
    <div className="event-details-hero-section">
      <div className="back-navigation-row">
        <button
          type="button"
          className="bento-back-btn"
          onClick={onBack}
          aria-label="Volver al catálogo del historial"
        >
          <Icon name="chevronLeft" size={18} />
          <span>Volver al Historial</span>
        </button>

        <button
          type="button"
          className="filter-action-btn"
          onClick={onRefresh}
          disabled={loadingRefresh}
          title="Actualizar métricas del evento"
        >
          <Icon
            name="refreshCw"
            size={16}
            className={loadingRefresh ? 'bento-spin-icon' : ''}
          />
          <span>{loadingRefresh ? 'Actualizando...' : 'Recargar Datos'}</span>
        </button>
      </div>

      <div className="event-hero-bento-card" style={{ marginTop: '0.85rem' }}>
        <div className="event-hero-banner-wrap">
          {event.image_url ? (
            <img
              src={getImageUrl(event.image_url)}
              alt={event.name}
              className="event-hero-cover-img"
            />
          ) : (
            <div className="event-card-placeholder">
              <Icon name="image" size={40} />
              <span>Sin imagen de portada</span>
            </div>
          )}

          <div className="event-hero-overlay">
            <div className="hero-overlay-top">
              <span className="hero-event-category-badge">
                <Icon name="shield" size={13} />
                <span>{event.category || 'Evento Concluido'}</span>
              </span>
              <span className="event-status-pill">
                <Icon name="checkCircle" size={13} />
                <span>Finalizado</span>
              </span>
            </div>

            <div className="hero-overlay-bottom">
              <h2 className="hero-event-name">{event.name}</h2>
              <div className="hero-chips-bar">
                <span className="hero-chip">
                  <Icon name="calendar" size={14} />
                  <span>{formattedDate}</span>
                </span>
                {event.event_time && (
                  <span className="hero-chip">
                    <Icon name="clock" size={14} />
                    <span>{event.event_time.slice(0, 5)} hrs</span>
                  </span>
                )}
                <span className="hero-chip">
                  <Icon name="mapPin" size={14} />
                  <span>{event.venue_name || 'Sede no especificada'}</span>
                </span>
                {event.capacity && (
                  <span className="hero-chip">
                    <Icon name="users" size={14} />
                    <span>Aforo: {Number(event.capacity).toLocaleString()} personas</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
