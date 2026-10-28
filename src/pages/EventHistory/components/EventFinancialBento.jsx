import React from 'react';
import { Icon, AnimatedCounter } from '@/components';

/**
 * EventFinancialBento — Tarjetas Bento Box para el balance económico y de recaudación
 */
export const EventFinancialBento = ({ revenue, loading }) => {
  const gross = Number(revenue?.gross) || 0;
  const net = Number(revenue?.net) || 0;
  const refunded = Number(revenue?.refunded_amount) || 0;
  const ticketsSold = Number(revenue?.tickets_sold) || 0;
  const ticketsRefunded = Number(revenue?.tickets_refunded) || 0;

  const averageTicket = ticketsSold > 0 ? Math.round(net / ticketsSold) : 0;

  return (
    <div className="bento-section">
      <div className="bento-section-title">
        <Icon name="dollarSign" size={20} />
        <span>Rendimiento Económico y Recaudación</span>
      </div>

      <div className="bento-metrics-row">
        {/* KPI: Ingresos Brutos */}
        <div className="bento-kpi-card bento-kpi-card--span-3">
          <div className="bento-kpi-header">
            <span className="bento-kpi-title">Ingresos Brutos</span>
            <div className="bento-kpi-icon revenue">
              <Icon name="dollarSign" size={20} />
            </div>
          </div>
          <div className="bento-kpi-value-block">
            <div className="bento-kpi-big-number">
              ${loading ? '...' : gross.toLocaleString('es-MX')}
            </div>
            <span className="bento-kpi-caption">Ventas totales acumuladas</span>
          </div>
        </div>

        {/* KPI: Ingresos Netos */}
        <div className="bento-kpi-card bento-kpi-card--span-3">
          <div className="bento-kpi-header">
            <span className="bento-kpi-title">Ingresos Netos</span>
            <div className="bento-kpi-icon revenue">
              <Icon name="trendingUp" size={20} />
            </div>
          </div>
          <div className="bento-kpi-value-block">
            <div className="bento-kpi-big-number">
              ${loading ? '...' : net.toLocaleString('es-MX')}
            </div>
            <span className="bento-kpi-caption">Descontando devoluciones</span>
          </div>
        </div>

        {/* KPI: Reembolsos */}
        <div className="bento-kpi-card bento-kpi-card--span-3">
          <div className="bento-kpi-header">
            <span className="bento-kpi-title">Monto Reembolsado</span>
            <div className="bento-kpi-icon warning">
              <Icon name="alertCircle" size={20} />
            </div>
          </div>
          <div className="bento-kpi-value-block">
            <div className="bento-kpi-big-number" style={{ color: refunded > 0 ? 'var(--color-warning)' : 'inherit' }}>
              ${loading ? '...' : refunded.toLocaleString('es-MX')}
            </div>
            <span className="bento-kpi-caption">
              {ticketsRefunded} boleto{ticketsRefunded === 1 ? '' : 's'} devuelto{ticketsRefunded === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* KPI: Ticket Promedio */}
        <div className="bento-kpi-card bento-kpi-card--span-3">
          <div className="bento-kpi-header">
            <span className="bento-kpi-title">Ticket Promedio</span>
            <div className="bento-kpi-icon tickets">
              <Icon name="tag" size={20} />
            </div>
          </div>
          <div className="bento-kpi-value-block">
            <div className="bento-kpi-big-number">
              ${loading ? '...' : averageTicket.toLocaleString('es-MX')}
            </div>
            <span className="bento-kpi-caption">Gasto promedio por asistente</span>
          </div>
        </div>
      </div>
    </div>
  );
};
