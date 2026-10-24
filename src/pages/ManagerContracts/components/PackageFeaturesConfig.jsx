import React from 'react';
import { Input, Button } from '@/components';

const PRESETS = [
  {
    key: 'basic',
    label: '📦 Básico',
    description: 'Boletaje general, 1 fecha por evento',
    apply: {
      maxEvents: 3,
      isUnlimited: false,
      maxFunctionsPerEvent: 1,
      merchEnabled: false,
      seatingMapEnabled: false,
      metricsEnabled: false,
      adsEnabled: false,
      maxAdsPerEvent: 0,
    },
  },
  {
    key: 'pro',
    label: '🚀 Pro',
    description: 'LaikaShop + Analítica + 5 fechas',
    apply: {
      maxEvents: 10,
      isUnlimited: false,
      maxFunctionsPerEvent: 5,
      merchEnabled: true,
      seatingMapEnabled: false,
      metricsEnabled: true,
      adsEnabled: true,
      maxAdsPerEvent: 3,
    },
  },
  {
    key: 'enterprise',
    label: '👑 Enterprise',
    description: 'Todo desbloqueado + Mapa Asientos',
    apply: {
      isUnlimited: true,
      maxEvents: 0,
      maxFunctionsPerEvent: 20,
      merchEnabled: true,
      seatingMapEnabled: true,
      metricsEnabled: true,
      adsEnabled: true,
      maxAdsPerEvent: 10,
    },
  },
];

const PackageFeaturesConfig = ({ form, onChange, disabled = false }) => {
  const setField = (field, value) => {
    onChange({ [field]: value });
  };

  const applyPreset = (preset) => {
    onChange(preset.apply);
  };

  return (
    <div className="pkg-config-container" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem',
      background: 'var(--color-surface-hover)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius, 8px)',
      padding: '1rem',
      marginTop: '0.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text)', fontWeight: 700 }}>
            ⚡ Personalización de Paquete y Módulos
          </h4>
          <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
            Selecciona una plantilla rápida o personaliza los módulos que tendrá activos el gestor.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              disabled={disabled}
              onClick={() => applyPreset(p)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid var(--color-border-strong)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              title={p.description}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Límite de fechas / funciones por evento */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
        <Input
          label="Máx. Fechas/Funciones por Evento"
          type="number"
          min="1"
          max="100"
          disabled={disabled}
          value={form.maxFunctionsPerEvent ?? 1}
          onChange={(e) => setField('maxFunctionsPerEvent', Math.max(1, parseInt(e.target.value, 10) || 1))}
        />
      </div>

      {/* Módulos Habilitados */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-secondary)' }}>
          Módulos y Herramientas del Sistema
        </span>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.6rem'
        }}>
          {/* LaikaShop */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 0.75rem',
            borderRadius: '6px',
            background: form.merchEnabled ? 'rgba(59, 130, 246, 0.08)' : 'var(--color-surface)',
            border: `1px solid ${form.merchEnabled ? 'var(--color-primary, #3b82f6)' : 'var(--color-border)'}`,
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
            color: 'var(--color-text)',
            transition: 'all 0.15s ease'
          }}>
            <input
              type="checkbox"
              disabled={disabled}
              checked={Boolean(form.merchEnabled)}
              onChange={(e) => setField('merchEnabled', e.target.checked)}
            />
            <div>
              <div style={{ fontWeight: 600 }}>🛍️ LaikaShop (Mercancía)</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Venta de productos/souvenirs</div>
            </div>
          </label>

          {/* Mapa de Asientos */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 0.75rem',
            borderRadius: '6px',
            background: form.seatingMapEnabled ? 'rgba(59, 130, 246, 0.08)' : 'var(--color-surface)',
            border: `1px solid ${form.seatingMapEnabled ? 'var(--color-primary, #3b82f6)' : 'var(--color-border)'}`,
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
            color: 'var(--color-text)',
            transition: 'all 0.15s ease'
          }}>
            <input
              type="checkbox"
              disabled={disabled}
              checked={Boolean(form.seatingMapEnabled)}
              onChange={(e) => setField('seatingMapEnabled', e.target.checked)}
            />
            <div>
              <div style={{ fontWeight: 600 }}>🗺️ Mapa de Recinto y Asientos</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Salas y butacas numeradas</div>
            </div>
          </label>

          {/* Analítica */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 0.75rem',
            borderRadius: '6px',
            background: form.metricsEnabled ? 'rgba(59, 130, 246, 0.08)' : 'var(--color-surface)',
            border: `1px solid ${form.metricsEnabled ? 'var(--color-primary, #3b82f6)' : 'var(--color-border)'}`,
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
            color: 'var(--color-text)',
            transition: 'all 0.15s ease'
          }}>
            <input
              type="checkbox"
              disabled={disabled}
              checked={Boolean(form.metricsEnabled)}
              onChange={(e) => setField('metricsEnabled', e.target.checked)}
            />
            <div>
              <div style={{ fontWeight: 600 }}>📊 Métricas y Analítica</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Conversión y ventas en vivo</div>
            </div>
          </label>

          {/* Publicidad */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 0.75rem',
            borderRadius: '6px',
            background: form.adsEnabled ? 'rgba(59, 130, 246, 0.08)' : 'var(--color-surface)',
            border: `1px solid ${form.adsEnabled ? 'var(--color-primary, #3b82f6)' : 'var(--color-border)'}`,
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
            color: 'var(--color-text)',
            transition: 'all 0.15s ease'
          }}>
            <input
              type="checkbox"
              disabled={disabled}
              checked={Boolean(form.adsEnabled)}
              onChange={(e) => setField('adsEnabled', e.target.checked)}
            />
            <div>
              <div style={{ fontWeight: 600 }}>📢 Banners Publicitarios</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Anuncios para sus eventos</div>
            </div>
          </label>
        </div>

        {/* Input condicional de límite de anuncios */}
        {form.adsEnabled && (
          <div style={{ maxWidth: '240px', marginTop: '0.25rem' }}>
            <Input
              label="Máx. Anuncios por Evento"
              type="number"
              min="1"
              max="50"
              disabled={disabled}
              value={form.maxAdsPerEvent ?? 3}
              onChange={(e) => setField('maxAdsPerEvent', Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageFeaturesConfig;
