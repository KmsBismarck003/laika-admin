import React from 'react';
import { Icon, Pagination } from '@/components';

/**
 * MerchStoresBento — Panel Bento Box de control técnico de gestores, tiendas y comisiones
 */
export const MerchStoresBento = ({
  gestores,
  totalFilteredGestores,
  kpis,
  searchQuery,
  onSearchChange,
  storeStatusFilter,
  onStoreStatusFilterChange,
  membershipFilter,
  onMembershipFilterChange,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  updatingId,
  onTogglePremium,
  onEditSettings,
  loading
}) => {
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalFilteredGestores);

  return (
    <div className="merch-stores-bento-section">
      {/* Rejilla de KPIs de Monetización */}
      <div className="merch-kpi-grid">
        <div className="merch-kpi-cell merch-kpi-cell--span-3">
          <div className="merch-kpi-header">
            <span className="merch-kpi-label">Gestores Registrados</span>
            <div className="merch-kpi-icon-box info">
              <Icon name="users" size={20} />
            </div>
          </div>
          <div className="merch-kpi-value-row">
            <span className="merch-kpi-number">{kpis.totalGestores}</span>
            <span className="merch-kpi-caption">administradores</span>
          </div>
        </div>

        <div className="merch-kpi-cell merch-kpi-cell--span-3">
          <div className="merch-kpi-header">
            <span className="merch-kpi-label">Tiendas Habilitadas</span>
            <div className="merch-kpi-icon-box success">
              <Icon name="shoppingCart" size={20} />
            </div>
          </div>
          <div className="merch-kpi-value-row">
            <span className="merch-kpi-number">{kpis.enabledStores}</span>
            <span className="merch-kpi-caption">con acceso a catálogo</span>
          </div>
        </div>

        <div className="merch-kpi-cell merch-kpi-cell--span-3">
          <div className="merch-kpi-header">
            <span className="merch-kpi-label">Premium Activos</span>
            <div className="merch-kpi-icon-box warning">
              <Icon name="star" size={20} />
            </div>
          </div>
          <div className="merch-kpi-value-row">
            <span className="merch-kpi-number">{kpis.premiumCount}</span>
            <span className="merch-kpi-caption">membresías Pro</span>
          </div>
        </div>

        <div className="merch-kpi-cell merch-kpi-cell--span-3">
          <div className="merch-kpi-header">
            <span className="merch-kpi-label">Comisión Promedio</span>
            <div className="merch-kpi-icon-box purple">
              <Icon name="percent" size={20} />
            </div>
          </div>
          <div className="merch-kpi-value-row">
            <span className="merch-kpi-number">{kpis.avgCommission}%</span>
            <span className="merch-kpi-caption">tarifa institucional</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="merch-filters-card">
        <div className="merch-search-box">
          <Icon name="search" size={16} className="merch-search-icon" />
          <input
            type="text"
            className="merch-search-input"
            placeholder="Buscar gestor por nombre o correo electrónico..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Buscar gestor"
          />
        </div>

        <select
          className="merch-select"
          value={storeStatusFilter}
          onChange={(e) => onStoreStatusFilterChange(e.target.value)}
          aria-label="Filtrar por estado de tienda"
        >
          <option value="all">Todas las Tiendas</option>
          <option value="enabled">Solo Tiendas Habilitadas</option>
          <option value="disabled">Solo Tiendas Bloqueadas</option>
        </select>

        <select
          className="merch-select"
          value={membershipFilter}
          onChange={(e) => onMembershipFilterChange(e.target.value)}
          aria-label="Filtrar por membresía"
        >
          <option value="all">Todas las Membresías</option>
          <option value="premium">Solo Gestores Premium</option>
          <option value="standard">Solo Estándar</option>
        </select>
      </div>

      {/* Tabla Bento de Gestores */}
      <div className="merch-table-bento-card">
        <div className="merch-table-header-row">
          <div className="merch-table-title">
            <h3>
              <Icon name="shield" size={18} />
              <span>Directorio Técnico de Gestores y Comercios</span>
            </h3>
            <p>
              Gestión de cuotas de activación, porcentajes de comisión y privilegios de tienda oficial. ({totalFilteredGestores} gestores)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bento-loading-state">
            <Icon name="refreshCw" size={22} className="bento-spin-icon" />
            <span>Consultando directorio de gestores y tiendas...</span>
          </div>
        ) : gestores.length === 0 ? (
          <div className="bento-empty-card" style={{ padding: '3rem 1.5rem' }}>
            <div className="bento-empty-icon">
              <Icon name="users" size={30} />
            </div>
            <h3>Sin gestores registrados coincidentes</h3>
            <p>
              {searchQuery || storeStatusFilter !== 'all' || membershipFilter !== 'all'
                ? 'No hay registros que coincidan con los criterios de búsqueda aplicados.'
                : 'Aún no se han registrado cuentas con el rol de gestor en el sistema.'}
            </p>
          </div>
        ) : (
          <>
            <div className="merch-table-wrapper">
              <table className="merch-data-table">
                <thead>
                  <tr>
                    <th>Identidad del Gestor</th>
                    <th>Membresía Pro</th>
                    <th>Estado Tienda</th>
                    <th>Cuota Activación</th>
                    <th>Límite Prod.</th>
                    <th>Comisión</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {gestores.map((g) => {
                    const isUpdating = updatingId === g.id;
                    const isEnabled = Boolean(g.settings?.is_enabled);
                    const feePaid = Boolean(g.settings?.activation_fee_paid);

                    return (
                      <tr key={g.id}>
                        <td>
                          <div className="gestor-name-cell">
                            {g.first_name} {g.last_name}
                          </div>
                          <div className="gestor-email-cell">{g.email}</div>
                        </td>

                        <td>
                          <button
                            type="button"
                            className={`btn-membership-toggle ${g.is_premium ? 'premium' : 'standard'}`}
                            onClick={() => !isUpdating && onTogglePremium(g.id, g.is_premium)}
                            disabled={isUpdating}
                            title="Alternar membresía Premium"
                          >
                            <Icon
                              name={isUpdating ? 'refreshCw' : g.is_premium ? 'star' : 'user'}
                              size={13}
                              className={isUpdating ? 'bento-spin-icon' : ''}
                            />
                            <span>{g.is_premium ? 'PREMIUM' : 'ESTÁNDAR'}</span>
                          </button>
                        </td>

                        <td>
                          {isEnabled ? (
                            <span className="status-badge checked-in">
                              <Icon name="check" size={11} />
                              <span>Habilitada</span>
                            </span>
                          ) : (
                            <span className="status-badge pending">
                              <Icon name="lock" size={11} />
                              <span>Bloqueada</span>
                            </span>
                          )}
                        </td>

                        <td>
                          {feePaid ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontWeight: 600, fontSize: '0.8rem' }}>
                              <Icon name="checkCircle" size={13} />
                              <span>Pagada</span>
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-warning)', fontWeight: 600, fontSize: '0.8rem' }}>
                              <Icon name="clock" size={13} />
                              <span>Pendiente</span>
                            </span>
                          )}
                        </td>

                        <td>
                          <span className="ticket-code-pill">
                            {g.settings?.product_limit || 50} uds
                          </span>
                        </td>

                        <td>
                          <strong style={{ color: 'var(--color-text)' }}>
                            {g.settings?.commission_percentage || 10}%
                          </strong>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn-adjust-settings"
                            onClick={() => onEditSettings({ ...g })}
                            title="Ajustar parámetros comerciales"
                          >
                            <Icon name="settings" size={14} />
                            <span>Ajustar</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación Bento */}
            <div className="bento-table-pagination-row">
              <div className="bento-pagination-info">
                Mostrando {totalFilteredGestores > 0 ? startIndex : 0} - {endIndex} de {totalFilteredGestores} gestores
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div className="bento-page-size-selector">
                  <span>Por página:</span>
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
