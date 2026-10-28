import React from 'react';
import { Icon } from '@/components';

/**
 * MerchEditModal — Modal Bento Box para ajustar configuraciones comerciales de tienda
 */
export const MerchEditModal = ({
  editingSettings,
  setEditingSettings,
  handleSaveSettings
}) => {
  if (!editingSettings) return null;

  const settings = editingSettings.settings || {};

  return (
    <div
      className="bento-modal-overlay"
      onClick={() => setEditingSettings(null)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bento-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bento-modal-header">
          <h3>
            <Icon name="shield" size={18} />
            <span>Configuración Comercial de Tienda</span>
          </h3>
          <button
            type="button"
            className="bento-modal-close-btn"
            onClick={() => setEditingSettings(null)}
            aria-label="Cerrar modal"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <form onSubmit={handleSaveSettings}>
          <div className="bento-modal-body">
            <div className="bento-gestor-badge-row">
              <Icon name="user" size={16} style={{ color: 'var(--color-text-muted)' }} />
              <div>
                <strong>{editingSettings.first_name} {editingSettings.last_name}</strong>
                <span style={{ marginLeft: '0.4rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                  ({editingSettings.email})
                </span>
              </div>
            </div>

            <div className="bento-form-grid-2">
              <div className="bento-form-group">
                <span className="bento-form-label">Acceso a Tienda</span>
                <label className="bento-toggle-label">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.is_enabled)}
                    onChange={(e) =>
                      setEditingSettings((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, is_enabled: e.target.checked }
                      }))
                    }
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    {settings.is_enabled ? 'Tienda Habilitada' : 'Tienda Bloqueada'}
                  </span>
                </label>
              </div>

              <div className="bento-form-group">
                <span className="bento-form-label">Cuota de Activación</span>
                <label className="bento-toggle-label">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.activation_fee_paid)}
                    onChange={(e) =>
                      setEditingSettings((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, activation_fee_paid: e.target.checked }
                      }))
                    }
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    {settings.activation_fee_paid ? 'Cuota Pagada' : 'Pendiente de Pago'}
                  </span>
                </label>
              </div>
            </div>

            <div className="bento-form-grid-2">
              <div className="bento-form-group">
                <label className="bento-form-label" htmlFor="productLimitInput">
                  Límite de Productos
                </label>
                <div className="bento-input-wrapper">
                  <Icon name="layers" size={16} className="bento-input-icon" />
                  <input
                    id="productLimitInput"
                    type="number"
                    min="1"
                    max="1000"
                    className="bento-form-input"
                    value={settings.product_limit ?? 50}
                    onChange={(e) =>
                      setEditingSettings((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, product_limit: e.target.value }
                      }))
                    }
                  />
                </div>
              </div>

              <div className="bento-form-group">
                <label className="bento-form-label" htmlFor="commissionInput">
                  Comisión Laika (%)
                </label>
                <div className="bento-input-wrapper">
                  <Icon name="percent" size={16} className="bento-input-icon" />
                  <input
                    id="commissionInput"
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    className="bento-form-input"
                    value={settings.commission_percentage ?? 10}
                    onChange={(e) =>
                      setEditingSettings((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, commission_percentage: e.target.value }
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bento-modal-footer">
            <button
              type="button"
              className="merch-action-btn"
              onClick={() => setEditingSettings(null)}
            >
              Descartar
            </button>
            <button
              type="submit"
              className="merch-action-btn"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-primary-fg)',
                border: 'none'
              }}
            >
              <Icon name="check" size={16} />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
