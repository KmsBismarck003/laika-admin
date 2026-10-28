import React, { useState } from 'react';
import { Icon, Pagination } from '@/components';
import { getImageUrl } from '@/utils/imageUtils';

/**
 * MerchPendingBento — Módulo Bento Box para revisión, auditoría y aprobación de mercancía
 * Presenta ficha técnica completa de producto, variantes, stock, entrega y acciones integradas.
 */
export const MerchPendingBento = ({
  products,
  totalFilteredProducts,
  pendingTotalCount,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  availableCategories,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  processingId,
  onApprove,
  onReject,
  loading
}) => {
  const [inspectingProduct, setInspectingProduct] = useState(null);
  const [imageErrorMap, setImageErrorMap] = useState({});

  const handleImageError = (id) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  const formatImage = (url) => {
    if (!url) return '';
    const first = url.split(',')[0].trim();
    return getImageUrl(first);
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalFilteredProducts);

  return (
    <div className="merch-pending-bento-section">
      {/* KPIs Rápidos de Mercancía */}
      <div className="merch-kpi-grid">
        <div className="merch-kpi-cell merch-kpi-cell--span-4">
          <div className="merch-kpi-header">
            <span className="merch-kpi-label">Solicitudes Pendientes</span>
            <div className="merch-kpi-icon-box warning">
              <Icon name="clock" size={20} />
            </div>
          </div>
          <div className="merch-kpi-value-row">
            <span className="merch-kpi-number">{pendingTotalCount}</span>
            <span className="merch-kpi-caption">requieren aprobación</span>
          </div>
        </div>

        <div className="merch-kpi-cell merch-kpi-cell--span-4">
          <div className="merch-kpi-header">
            <span className="merch-kpi-label">Categorías en Revisión</span>
            <div className="merch-kpi-icon-box info">
              <Icon name="tag" size={20} />
            </div>
          </div>
          <div className="merch-kpi-value-row">
            <span className="merch-kpi-number">{availableCategories.length}</span>
            <span className="merch-kpi-caption">tipos de productos</span>
          </div>
        </div>

        <div className="merch-kpi-cell merch-kpi-cell--span-4">
          <div className="merch-kpi-header">
            <span className="merch-kpi-label">Estado de la Cola</span>
            <div className={`merch-kpi-icon-box ${pendingTotalCount === 0 ? 'success' : 'warning'}`}>
              <Icon name={pendingTotalCount === 0 ? 'checkCircle' : 'alertCircle'} size={20} />
            </div>
          </div>
          <div className="merch-kpi-value-row">
            <span className="merch-kpi-number" style={{ fontSize: '1.4rem' }}>
              {pendingTotalCount === 0 ? 'Al Día' : 'Por Revisar'}
            </span>
            <span className="merch-kpi-caption">
              {pendingTotalCount === 0 ? 'Cero retrasos en catálogo' : 'Productos en espera'}
            </span>
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
            placeholder="Buscar por nombre, descripción o categoría..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Buscar producto pendiente"
          />
        </div>

        {availableCategories.length > 0 && (
          <select
            className="merch-select"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="all">Todas las Categorías ({availableCategories.length})</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Grid de Productos o Estado Vacío */}
      {loading ? (
        <div className="bento-loading-state">
          <Icon name="refreshCw" size={22} className="bento-spin-icon" />
          <span>Consultando catálogo de mercancía en revisión...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bento-empty-card" style={{ padding: '3.5rem 1.5rem' }}>
          <div className="bento-empty-icon">
            <Icon name="shoppingBag" size={32} />
          </div>
          <h3>No hay productos pendientes de revisión</h3>
          <p>
            {searchQuery || categoryFilter !== 'all'
              ? 'No se encontraron artículos con los filtros aplicados. Intenta restablecer la búsqueda.'
              : 'Todas las solicitudes de mercancía creadas por los gestores han sido aprobadas o procesadas.'}
          </p>
        </div>
      ) : (
        <>
          <div className="merch-products-grid">
            {products.map((item) => {
              const imgUrl = formatImage(item.image_url);
              const hasImgError = imageErrorMap[item.id];
              const isProcessing = processingId === item.id;
              const mainVariant = item.variants?.[0];
              const price = mainVariant?.price ?? item.price ?? 0;
              const stock = mainVariant?.stock ?? item.stock ?? 0;

              return (
                <div key={item.id} className="merch-product-bento-card">
                  <div
                    className="product-media-box"
                    onClick={() => setInspectingProduct(item)}
                    title="Clic para inspeccionar ficha técnica completa"
                  >
                    {imgUrl && !hasImgError ? (
                      <img
                        src={imgUrl}
                        alt={item.name}
                        className="product-media-img"
                        loading="lazy"
                        onError={() => handleImageError(item.id)}
                      />
                    ) : (
                      <div className="event-card-placeholder">
                        <Icon name="shoppingBag" size={36} />
                        <span>Sin imagen disponible</span>
                      </div>
                    )}

                    <div className="product-media-overlay-badges">
                      <span className="product-category-chip">
                        <Icon name="tag" size={11} />
                        <span>{item.category || 'General'}</span>
                      </span>
                      <span className="product-pending-badge">
                        <Icon name="clock" size={11} />
                        <span>Pendiente</span>
                      </span>
                    </div>
                  </div>

                  <div className="product-body" onClick={() => setInspectingProduct(item)} style={{ cursor: 'pointer' }}>
                    <h3 className="product-title" title={item.name}>
                      {item.name}
                    </h3>
                    <p className="product-desc" title={item.description}>
                      {item.description || 'Sin descripción provista por el gestor.'}
                    </p>

                    <div className="product-details-chips">
                      <span className="product-info-pill">
                        <Icon name="dollarSign" size={13} style={{ color: '#10b981' }} />
                        <span>Precio: <strong>${Number(price).toLocaleString('es-MX')}</strong></span>
                      </span>

                      <span className="product-info-pill">
                        <Icon name="layers" size={13} style={{ color: '#38bdf8' }} />
                        <span>Stock: <strong>{stock} uds</strong></span>
                      </span>

                      {item.variants && item.variants.length > 1 && (
                        <span className="product-info-pill" style={{ color: '#a855f7' }}>
                          <Icon name="grid" size={13} />
                          <span><strong>{item.variants.length}</strong> variantes</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="product-actions-bar">
                    <button
                      type="button"
                      className="btn-approve-merch"
                      onClick={() => onApprove(item.id)}
                      disabled={isProcessing}
                    >
                      <Icon
                        name={isProcessing ? 'refreshCw' : 'check'}
                        size={16}
                        className={isProcessing ? 'bento-spin-icon' : ''}
                      />
                      <span>{isProcessing ? 'Aprobando...' : 'Aprobar Producto'}</span>
                    </button>

                    <button
                      type="button"
                      className="btn-reject-merch"
                      onClick={() => onReject(item.id)}
                      disabled={isProcessing}
                    >
                      <Icon name="x" size={16} />
                      <span>Rechazar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginación Bento */}
          <div className="bento-table-pagination-row" style={{ marginTop: '1.5rem' }}>
            <div className="bento-pagination-info">
              Mostrando {totalFilteredProducts > 0 ? startIndex : 0} - {endIndex} de {totalFilteredProducts} productos
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div className="bento-page-size-selector">
                <span>Por página:</span>
                <select
                  className="bento-page-size-select"
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  aria-label="Seleccionar productos por página"
                >
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                  <option value={24}>24</option>
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

      {/* Modal Bento de Inspección Técnica Completa del Producto */}
      {inspectingProduct && (() => {
        const p = inspectingProduct;
        const imgUrl = formatImage(p.image_url);
        const hasImgError = imageErrorMap[p.id];
        const isProcessing = processingId === p.id;
        const variants = p.variants || [];
        const mainVariant = variants[0];
        const displayPrice = mainVariant?.price ?? p.price ?? 0;
        const displayStock = mainVariant?.stock ?? p.stock ?? 0;
        const formattedDate = p.created_at
          ? new Date(p.created_at).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : 'Reciente';

        return (
          <div className="bento-modal-overlay" onClick={() => setInspectingProduct(null)}>
            <div
              className="bento-modal-card bento-product-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bento-modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Icon name="shoppingBag" size={18} />
                  <h3>Ficha Técnica e Inspección de Mercancía</h3>
                </div>
                <button
                  type="button"
                  className="bento-modal-close-btn"
                  onClick={() => setInspectingProduct(null)}
                  aria-label="Cerrar ficha técnica"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>

              <div className="bento-modal-body">
                <div className="bento-product-modal-layout">
                  {/* Columna Izquierda: Imagen y Estado */}
                  <div className="product-modal-media-col">
                    <div className="product-modal-media-wrap">
                      {imgUrl && !hasImgError ? (
                        <img
                          src={imgUrl}
                          alt={p.name}
                          className="product-modal-img"
                          onError={() => handleImageError(p.id)}
                        />
                      ) : (
                        <div className="event-card-placeholder" style={{ padding: '2rem', textAlign: 'center' }}>
                          <Icon name="shoppingBag" size={48} />
                          <span style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                            Sin imagen disponible
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="product-pending-badge">
                        <Icon name="clock" size={12} />
                        <span>Pendiente de Aprobación</span>
                      </span>

                      {p.is_official && (
                        <span className="product-category-chip" style={{ background: 'rgba(16, 185, 129, 0.8)' }}>
                          <Icon name="shield" size={12} />
                          <span>Mercancía Oficial</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Columna Derecha: Especificaciones y Desglose */}
                  <div className="product-modal-details-col">
                    <div>
                      <h2 style={{ margin: '0 0 0.35rem 0', fontSize: '1.35rem', color: 'var(--color-text)', fontWeight: 800 }}>
                        {p.name}
                      </h2>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        {p.description || 'Sin descripción detallada registrada por el gestor.'}
                      </p>
                    </div>

                    {/* Grilla de Especificaciones */}
                    <div className="product-modal-spec-grid">
                      <div className="product-spec-card">
                        <span className="product-spec-label">Categoría</span>
                        <span className="product-spec-val">{p.category || 'General'}</span>
                      </div>

                      <div className="product-spec-card">
                        <span className="product-spec-label">Precio Referencial</span>
                        <span className="product-spec-val" style={{ color: '#10b981' }}>
                          ${Number(displayPrice).toLocaleString('es-MX')}
                        </span>
                      </div>

                      <div className="product-spec-card">
                        <span className="product-spec-label">Stock Total</span>
                        <span className="product-spec-val">{displayStock} uds</span>
                      </div>

                      <div className="product-spec-card">
                        <span className="product-spec-label">Límite por Persona</span>
                        <span className="product-spec-val">{p.max_per_person || 5} uds</span>
                      </div>

                      <div className="product-spec-card">
                        <span className="product-spec-label">Fecha de Solicitud</span>
                        <span className="product-spec-val">{formattedDate}</span>
                      </div>

                      <div className="product-spec-card">
                        <span className="product-spec-label">ID de Gestor</span>
                        <span className="product-spec-val">#{p.manager_id || p.managerId || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Desglose de Variantes */}
                    <div className="product-variants-box">
                      <span className="product-spec-label">
                        Variantes Registradas ({variants.length})
                      </span>
                      {variants.length > 0 ? (
                        <table className="product-variants-table">
                          <thead>
                            <tr>
                              <th>SKU</th>
                              <th>Atributos</th>
                              <th>Precio</th>
                              <th>Stock</th>
                            </tr>
                          </thead>
                          <tbody>
                            {variants.map((v, i) => {
                              const attrText = v.attributes
                                ? Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(', ')
                                : 'Estándar';
                              return (
                                <tr key={v.id || i}>
                                  <td><code>{v.sku || `VAR-${i + 1}`}</code></td>
                                  <td>{attrText}</td>
                                  <td><strong>${Number(v.price || 0).toLocaleString('es-MX')}</strong></td>
                                  <td>{v.stock || 0}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          Producto de variante única estándar.
                        </div>
                      )}
                    </div>

                    {/* Métodos de Entrega */}
                    {p.delivery_methods && p.delivery_methods.length > 0 && (
                      <div>
                        <span className="product-spec-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                          Métodos de Entrega Habilitados
                        </span>
                        <div className="product-delivery-badge-row">
                          {p.delivery_methods.map((method, idx) => (
                            <span key={idx} className="product-delivery-pill">
                              <Icon name="truck" size={12} />
                              <span>{method === 'pickup_event' ? 'Retiro en Evento' : method === 'shipping' ? 'Envío a Domicilio' : method}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bento-modal-footer">
                <button
                  type="button"
                  className="merch-action-btn"
                  onClick={() => setInspectingProduct(null)}
                >
                  Cerrar
                </button>

                <button
                  type="button"
                  className="btn-reject-merch"
                  onClick={() => {
                    onReject(p.id);
                    setInspectingProduct(null);
                  }}
                  disabled={isProcessing}
                  style={{ minHeight: '42px', padding: '0 1.25rem' }}
                >
                  <Icon name="x" size={16} />
                  <span>Rechazar Solicitud</span>
                </button>

                <button
                  type="button"
                  className="btn-approve-merch"
                  onClick={() => {
                    onApprove(p.id);
                    setInspectingProduct(null);
                  }}
                  disabled={isProcessing}
                  style={{ minHeight: '42px', padding: '0 1.25rem' }}
                >
                  <Icon name="check" size={16} />
                  <span>Aprobar y Publicar en Tienda</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
