import React from 'react';
import { Icon, Pagination } from '@/components';

/**
 * EventAttendeesAudit — Bitácora Bento Box de auditoría de accesos y validación en puerta
 * Con soporte para paginación modular, búsqueda y filtros por estado.
 */
export const EventAttendeesAudit = ({
  attendees,
  totalCount,
  filteredCount,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  loading
}) => {
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, filteredCount);

  return (
    <div className="bento-section">
      <div className="bento-table-card">
        <div className="bento-table-header">
          <div className="bento-table-title-group">
            <h3>
              <Icon name="shield" size={18} />
              <span>Bitácora de Accesos y Validación en Puerta</span>
            </h3>
            <p>
              Auditoría nominal de asistentes y registros de escaneo óptico del evento. ({totalCount} registros totales)
            </p>
          </div>

          <div className="bento-table-filters">
            <div className="filter-search-box" style={{ minWidth: '220px' }}>
              <Icon name="search" size={15} className="filter-search-icon" />
              <input
                type="text"
                className="filter-search-input"
                placeholder="Buscar por nombre, correo o boleto..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ height: '38px', fontSize: '0.825rem' }}
                aria-label="Buscar en la bitácora de accesos"
              />
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              style={{ height: '38px', fontSize: '0.825rem' }}
              aria-label="Filtrar asistentes por estado"
            >
              <option value="all">Todos los Estados ({filteredCount})</option>
              <option value="checked-in">Solo Ingresados (Checked-in)</option>
              <option value="pending">No Presentados / Pendientes</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="bento-loading-state">
            <Icon name="refreshCw" size={20} className="bento-spin-icon" />
            <span>Consultando bitácora de escaneo en puerta...</span>
          </div>
        ) : attendees.length === 0 ? (
          <div className="bento-empty-card" style={{ padding: '2.5rem 1rem' }}>
            <div className="bento-empty-icon">
              <Icon name="users" size={28} />
            </div>
            <h3>Sin registros coincidentes</h3>
            <p>
              {searchQuery || statusFilter !== 'all'
                ? 'No se encontraron asistentes con los filtros de búsqueda aplicados.'
                : 'No se registraron validaciones ópticas en puerta para este evento.'}
            </p>
          </div>
        ) : (
          <>
            <div className="bento-table-wrapper">
              <table className="bento-data-table">
                <thead>
                  <tr>
                    <th>Asistente</th>
                    <th>Contacto</th>
                    <th>Código de Boleto</th>
                    <th>Puerta / Punto</th>
                    <th>Hora de Validación</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((item, idx) => (
                    <tr key={item.ticket || idx}>
                      <td className="attendee-name-col">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon name="user" size={14} style={{ color: 'var(--color-text-muted)' }} />
                          <span>{item.name || 'Invitado General'}</span>
                        </div>
                      </td>
                      <td className="attendee-email-col">{item.email || 'N/A'}</td>
                      <td>
                        <span className="ticket-code-pill">
                          {item.ticket || 'S/C'}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Icon name="logIn" size={13} style={{ color: 'var(--color-text-muted)' }} />
                          <span>{item.entry && item.entry !== 'N/A' ? item.entry : 'Acceso Principal'}</span>
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                          {item.time && item.time !== 'N/A' ? item.time : 'Sin marca'}
                        </span>
                      </td>
                      <td>
                        {item.status === 'checked-in' ? (
                          <span className="status-badge checked-in">
                            <Icon name="checkCircle" size={12} />
                            <span>Ingresado</span>
                          </span>
                        ) : (
                          <span className="status-badge pending">
                            <Icon name="clock" size={12} />
                            <span>No ingresó</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fila de Paginación y Selector de Tamaño */}
            <div className="bento-table-pagination-row">
              <div className="bento-pagination-info">
                Mostrando {filteredCount > 0 ? startIndex : 0} - {endIndex} de {filteredCount} asistentes
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div className="bento-page-size-selector">
                  <span>Filas por página:</span>
                  <select
                    className="bento-page-size-select"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    aria-label="Seleccionar filas por página"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
