import React from 'react';
import { Zap } from 'lucide-react';
import { BentoGrid, BentoCard, Icon } from '@/components';

const MerchHeader = ({ gestores }) => {
    const totalGestores = gestores.length;
    const premiumActivos = gestores.filter(g => g.is_premium).length;
    const tiendasHabilitadas = gestores.filter(g => g.settings?.is_enabled).length;

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Zap size={24} />
                <h1 style={{ margin: 0 }}>MONETIZACIÓN Y PERMISOS</h1>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>PANEL DE CONTROL TÉCNICO PARA GESTORES Y MEMBRESÍAS</p>

            <BentoGrid>
                <BentoCard variant="stat">
                    <div className="bento-stat-content">
                        <div>
                            <div className="bento-stat-label">GESTORES REGISTRADOS</div>
                            <div className="bento-stat-value">{totalGestores}</div>
                        </div>
                        <div className="bento-stat-icon">
                            <Icon name="users" size={24} />
                        </div>
                    </div>
                </BentoCard>

                <BentoCard variant="stat">
                    <div className="bento-stat-content">
                        <div>
                            <div className="bento-stat-label">PREMIUM ACTIVOS</div>
                            <div className="bento-stat-value">{premiumActivos}</div>
                        </div>
                        <div className="bento-stat-icon">
                            <Icon name="star" size={24} />
                        </div>
                    </div>
                </BentoCard>

                <BentoCard variant="stat">
                    <div className="bento-stat-content">
                        <div>
                            <div className="bento-stat-label">TIENDAS HABILITADAS</div>
                            <div className="bento-stat-value">{tiendasHabilitadas}</div>
                        </div>
                        <div className="bento-stat-icon">
                            <Icon name="shoppingCart" size={24} />
                        </div>
                    </div>
                </BentoCard>
            </BentoGrid>
        </div>
    );
};

export default MerchHeader;
