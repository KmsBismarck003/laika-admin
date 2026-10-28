import React from 'react';
import { Icon } from '@/components';

/**
 * MerchApprovalHeader — Cabecera Bento Box con conmutador de pestañas y métricas rápidas
 */
export const MerchApprovalHeader = ({
  activeTab,
  onTabChange,
  pendingCount,
  onReload,
  loading
}) => {
  return (
    <div className="merch-header-section">
      <div className="merch-header-top-row">
        <div className="merch-title-group">
          <h1>Aprobación de Mercancía y Tiendas</h1>
          <p className="merch-subtitle">
            <Icon name="shoppingBag" size={16} />
            <span>Control técnico de catálogo, solicitudes de productos y monetización de gestores.</span>
          </p>
        </div>

        <button
          type="button"
          className="merch-action-btn"
          onClick={onReload}
          disabled={loading}
          title="Recargar datos de mercancía y gestores"
        >
          <Icon name="refreshCw" size={15} className={loading ? 'bento-spin-icon' : ''} />
          <span>{loading ? 'Actualizando...' : 'Recargar Sistema'}</span>
        </button>
      </div>

      {/* Barra de pestañas Bento */}
      <div className="merch-tabs-bar" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'products'}
          className={`merch-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => onTabChange('products')}
        >
          <Icon name="shoppingBag" size={16} />
          <span>Solicitudes de Mercancía</span>
          {pendingCount > 0 && (
            <span className={`tab-counter-badge ${activeTab !== 'products' ? 'pulse-warning' : ''}`}>
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'stores'}
          className={`merch-tab-btn ${activeTab === 'stores' ? 'active' : ''}`}
          onClick={() => onTabChange('stores')}
        >
          <Icon name="shield" size={16} />
          <span>Control de Tiendas y Gestores</span>
        </button>
      </div>
    </div>
  );
};
