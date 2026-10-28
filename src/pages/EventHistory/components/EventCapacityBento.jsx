import React from 'react';
import { Icon } from '@/components';

/**
 * EventCapacityBento — Tarjetas Bento Box para el aforo, boletos y ratio de asistencia
 */
export const EventCapacityBento = ({ tickets, loading }) => {
  const sold = Number(tickets?.sold) || 0;
  const totalCapacity = Number(tickets?.total_capacity) || 0;
  const sellThroughPct = Number(tickets?.sell_through_pct) || (totalCapacity > 0 ? Math.round((sold / totalCapacity) * 100) : 0);
  const used = Number(tickets?.used) || 0;
  const active = Number(tickets?.active) || 0;
  const refunded = Number(tickets?.refunded) || 0;
  const cancelled = Number(tickets?.cancelled) || 0;
  const available = Number(tickets?.available) || Math.max(0, totalCapacity - sold);

  const attendanceRate = sold > 0 ? Math.round((used / sold) * 100) : 0;

  return (
    <div className="bento-section">
      <div className="bento-section-title">
        <Icon name="users" size={20} />
        <span>Aforo, Venta y Auditoría de Asistencia</span>
      </div>

      <div className="bento-metrics-row">
        {/* Card: Ocupación y Venta */}
        <div className="bento-kpi-card bento-kpi-card--span-6">
          <div className="bento-kpi-header">
            <div>
              <span className="bento-kpi-title">Boletos Vendidos vs Aforo Total</span>
              <div className="bento-kpi-big-number" style={{ marginTop: '0.35rem' }}>
                {loading ? '...' : sold.toLocaleString('es-MX')}
                <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 500, marginLeft: '0.4rem' }}>
                  / {totalCapacity > 0 ? totalCapacity.toLocaleString('es-MX') : 'Ilimitado'}
                </span>
              </div>
            </div>
            <div className="bento-kpi-icon tickets">
              <Icon name="ticket" size={22} />
            </div>
          </div>

          <div className="bento-progress-block">
            <div className="bento-progress-labels">
              <span>Porcentaje de Aforo Vendido</span>
              <strong style={{ color: 'var(--color-text)' }}>{sellThroughPct}%</strong>
            </div>
            <div className="bento-progress-track">
              <div
                className="bento-progress-fill green"
                style={{ width: `${Math.min(100, Math.max(0, sellThroughPct))}%` }}
              />
            </div>
          </div>

          <div className="bento-breakdown-row">
            <span className="breakdown-chip">
              <Icon name="check" size={13} />
              <span>Vendidos: <strong>{sold}</strong></span>
            </span>
            <span className="breakdown-chip">
              <Icon name="minus" size={13} />
              <span>Disponibles: <strong>{available}</strong></span>
            </span>
          </div>
        </div>

        {/* Card: Tasa de Ingreso Real */}
        <div className="bento-kpi-card bento-kpi-card--span-6">
          <div className="bento-kpi-header">
            <div>
              <span className="bento-kpi-title">Asistencia Real en Puerta</span>
              <div className="bento-kpi-big-number" style={{ marginTop: '0.35rem' }}>
                {loading ? '...' : used.toLocaleString('es-MX')}
                <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 500, marginLeft: '0.4rem' }}>
                  escaneados ({attendanceRate}%)
                </span>
              </div>
            </div>
            <div className="bento-kpi-icon attendance">
              <Icon name="checkCircle" size={22} />
            </div>
          </div>

          <div className="bento-progress-block">
            <div className="bento-progress-labels">
              <span>Ratio de Ingreso Efectivo (de boletos vendidos)</span>
              <strong style={{ color: 'var(--color-text)' }}>{attendanceRate}%</strong>
            </div>
            <div className="bento-progress-track">
              <div
                className="bento-progress-fill purple"
                style={{ width: `${Math.min(100, Math.max(0, attendanceRate))}%` }}
              />
            </div>
          </div>

          <div className="bento-breakdown-row">
            <span className="breakdown-chip">
              <Icon name="userCheck" size={13} />
              <span>Ingresados: <strong>{used}</strong></span>
            </span>
            <span className="breakdown-chip">
              <Icon name="clock" size={13} />
              <span>No Canjeados: <strong>{active}</strong></span>
            </span>
            {refunded > 0 && (
              <span className="breakdown-chip" style={{ color: 'var(--color-warning)' }}>
                <Icon name="alertCircle" size={13} />
                <span>Reembolsos: <strong>{refunded}</strong></span>
              </span>
            )}
            {cancelled > 0 && (
              <span className="breakdown-chip" style={{ color: 'var(--color-danger)' }}>
                <Icon name="xCircle" size={13} />
                <span>Cancelados: <strong>{cancelled}</strong></span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
