import React from 'react';
import { Icon } from '@/components';
import { getImageUrl } from '@/utils/imageUtils';

/**
 * EventHistoryCatalog — Cuadrícula Bento Box del catálogo de eventos finalizados
 */
export const EventHistoryCatalog = ({
  events,
  rawEventsCount,
  catalogSummary,
  searchQuery,
  onSearchChange,
  venueFilter,
  onVenueFilterChange,
  availableVenues,
  sortOrder,
  onSortOrderToggle,
  onSelectEvent,
  onReload,
  loading
}) => {
  return (
    <div className="event-history-catalog-view">
      {/* Topbar del catálogo */}
      <div className="event-history-topbar">
        <div className="event-history-title-row">
          <div className="event-history-title-group">
            <h1>Historial de Eventos Finalizados</h1>
            <p className="event-history-subtitle">
              <Icon name="history" size={16} />
              <span>Consulta de auditoría, balance económico y bitácora de eventos concluidos.</span>
            </p>
          </div>

          <div className="event-history-header-stats">
            <span className="header-stat-pill">
              <Icon name="checkCircle" size={14} style={{ color: '#10b981' }} />
              <span>Eventos Concluidos: <strong>{rawEventsCount}</strong></span>
            </span>
            {catalogSummary.totalCapacity > 0 && (
              <span className="header-stat-pill">
                <Icon name="users" size={14} style={{ color: '#38bdf8' }} />
                <span>Aforo Histórico: <strong>{catalogSummary.totalCapacity.toLocaleString('es-MX')}</strong></span>
              </span>
            )}
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="event-history-filters-bar">
          <div className="filter-search-box">
            <Icon name="search" size={16} className="filter-search-icon" />
            <input
              type="text"
              className="filter-search-input"
              placeholder="Buscar evento por nombre, fecha o sede..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Buscar eventos en el historial"
            />
          </div>

          <select
            className="filter-select"
            value={venueFilter}
            onChange={(e) => onVenueFilterChange(e.target.value)}
            aria-label="Filtrar por sede"
          >
            <option value="all">Todas las Sedes ({availableVenues.length})</option>
            {availableVenues.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="filter-action-btn"
            onClick={onSortOrderToggle}
            title={sortOrder === 'desc' ? 'Orden: Más recientes primero' : 'Orden: Más antiguos primero'}
          >
            <Icon name={sortOrder === 'desc' ? 'arrowDown' : 'arrowUp'} size={15} />
            <span>{sortOrder === 'desc' ? 'Más Recientes' : 'Más Antiguos'}</span>
          </button>

          <button
            type="button"
            className="filter-action-btn"
            onClick={onReload}
            disabled={loading}
            title="Recargar catálogo de eventos"
          >
            <Icon name="refreshCw" size={15} className={loading ? 'bento-spin-icon' : ''} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Grid de Tarjetas Bento */}
      {events.length === 0 ? (
        <div className="bento-empty-card">
          <div className="bento-empty-icon">
            <Icon name="history" size={28} />
          </div>
          <h3>Sin eventos históricos encontrados</h3>
          <p>
            {searchQuery || venueFilter !== 'all'
              ? 'No hay eventos que coincidan con los filtros de búsqueda aplicados. Intenta modificarlos.'
              : 'Los eventos aparecerán automáticamente aquí una vez que hayan concluido su fecha y horario de realización.'}
          </p>
        </div>
      ) : (
        <div className="historical-catalog-grid">
          {events.map((event) => {
            const formattedDate = event.event_date
              ? new Date(event.event_date + 'T00:00:00').toLocaleDateString('es-MX', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              : 'Fecha N/A';

            return (
              <div
                key={event.id}
                className="historical-event-bento-card"
                onClick={() => onSelectEvent(event)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectEvent(event);
                  }
                }}
              >
                <div className="event-card-media">
                  {event.image_url ? (
                    <img
                      src={getImageUrl(event.image_url)}
                      alt={event.name}
                      className="event-card-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="event-card-placeholder">
                      <Icon name="image" size={32} />
                      <span style={{ fontSize: '0.75rem' }}>Sin portada</span>
                    </div>
                  )}

                  <div className="event-card-badge-overlay">
                    <span className="event-status-pill">
                      <Icon name="check" size={11} />
                      <span>Concluido</span>
                    </span>
                  </div>
                </div>

                <div className="event-card-body">
                  <h3 className="event-card-title" title={event.name}>
                    {event.name}
                  </h3>

                  <div className="event-card-meta-list">
                    <div className="event-meta-item">
                      <Icon name="calendar" size={14} />
                      <span>{formattedDate}</span>
                    </div>

                    <div className="event-meta-item">
                      <Icon name="mapPin" size={14} />
                      <span>{event.venue_name || 'Sede sin asignar'}</span>
                    </div>

                    {event.capacity && (
                      <div className="event-meta-item">
                        <Icon name="users" size={14} />
                        <span>Aforo: {Number(event.capacity).toLocaleString()} asistentes</span>
                      </div>
                    )}
                  </div>

                  <div className="event-card-footer">
                    <span className="event-action-text">
                      <span>Ver Auditoría y Métricas</span>
                      <Icon name="chevronRight" size={15} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
