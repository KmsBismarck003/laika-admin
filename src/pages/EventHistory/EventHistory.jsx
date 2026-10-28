import React from 'react';
import './EventHistory.css';
import { LoadingScreen, Icon } from '@/components';
import { useEventHistory } from './hooks/useEventHistory';
import { EventHistoryCatalog } from './components/EventHistoryCatalog';
import { EventDetailHero } from './components/EventDetailHero';
import { EventFinancialBento } from './components/EventFinancialBento';
import { EventCapacityBento } from './components/EventCapacityBento';
import { EventAttendeesAudit } from './components/EventAttendeesAudit';

/**
 * EventHistory — Vista delgada de orquestación (Thin Page Wrapper)
 * Cumple con la regla de 5 capas y arquitectura Bento Box Tier-1.
 */
const EventHistory = () => {
  const {
    events,
    rawEventsCount,
    loading,
    error,
    catalogSummary,
    searchQuery,
    setSearchQuery,
    venueFilter,
    setVenueFilter,
    availableVenues,
    sortOrder,
    setSortOrder,
    selectedEvent,
    selectEvent,
    clearSelectedEvent,
    refreshAnalytics,
    analytics,
    loadingAnalytics,
    analyticsError,
    attendees,
    rawAttendeesCount,
    totalFilteredAttendees,
    attendeeSearch,
    setAttendeeSearch,
    attendeeStatusFilter,
    setAttendeeStatusFilter,
    attendeePage,
    setAttendeePage,
    totalAttendeePages,
    attendeePageSize,
    setAttendeePageSize,
    reloadCatalog
  } = useEventHistory();

  if (loading) {
    return <LoadingScreen label="Cargando Historial de Eventos..." />;
  }

  if (error) {
    return (
      <div className="event-history-page">
        <div className="bento-empty-card" style={{ borderColor: 'var(--color-danger)' }}>
          <div className="bento-empty-icon" style={{ color: 'var(--color-danger)' }}>
            <Icon name="alertCircle" size={28} />
          </div>
          <h3>Error al cargar el historial</h3>
          <p>{error}</p>
          <button
            type="button"
            className="filter-action-btn"
            onClick={reloadCatalog}
            style={{ marginTop: '0.5rem' }}
          >
            <Icon name="refreshCw" size={15} />
            <span>Reintentar Conexión</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-history-page">
      {selectedEvent ? (
        <div className="event-details-bento-container">
          <EventDetailHero
            event={selectedEvent}
            onBack={clearSelectedEvent}
            onRefresh={refreshAnalytics}
            loadingRefresh={loadingAnalytics}
          />

          {analyticsError && (
            <div
              className="bento-kpi-card"
              style={{
                borderColor: 'var(--color-warning)',
                background: 'var(--color-warning-bg, var(--color-surface))',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.25rem'
              }}
            >
              <Icon name="alertCircle" size={20} style={{ color: 'var(--color-warning)' }} />
              <div style={{ flex: 1, fontSize: '0.875rem', color: 'var(--color-text)' }}>
                {analyticsError}
              </div>
              <button
                type="button"
                className="filter-action-btn"
                onClick={refreshAnalytics}
                style={{ height: '36px', minHeight: '36px' }}
              >
                <Icon name="refreshCw" size={14} />
                <span>Reintentar</span>
              </button>
            </div>
          )}

          {/* Bloque Financiero Bento */}
          <EventFinancialBento
            revenue={analytics.revenue}
            loading={loadingAnalytics}
          />

          {/* Bloque de Capacidad y Asistencia Bento */}
          <EventCapacityBento
            tickets={analytics.tickets}
            loading={loadingAnalytics}
          />

          {/* Bitácora de Accesos y Validación en Puerta */}
          <EventAttendeesAudit
            attendees={attendees}
            totalCount={rawAttendeesCount}
            filteredCount={totalFilteredAttendees}
            searchQuery={attendeeSearch}
            onSearchChange={setAttendeeSearch}
            statusFilter={attendeeStatusFilter}
            onStatusFilterChange={setAttendeeStatusFilter}
            currentPage={attendeePage}
            totalPages={totalAttendeePages}
            onPageChange={setAttendeePage}
            pageSize={attendeePageSize}
            onPageSizeChange={setAttendeePageSize}
            loading={loadingAnalytics}
          />
        </div>
      ) : (
        <EventHistoryCatalog
          events={events}
          rawEventsCount={rawEventsCount}
          catalogSummary={catalogSummary}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          venueFilter={venueFilter}
          onVenueFilterChange={setVenueFilter}
          availableVenues={availableVenues}
          sortOrder={sortOrder}
          onSortOrderToggle={() =>
            setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
          }
          onSelectEvent={selectEvent}
          onReload={reloadCatalog}
          loading={loading}
        />
      )}
    </div>
  );
};

export default EventHistory;
