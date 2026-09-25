import React from 'react';
import { Database as DatabaseIcon, Check } from 'lucide-react';
import { Card } from '@/components';

const BigDataMetrics = ({ selectedTable, canonicalData }) => {
    return (
        <div className="bigdata-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1.5rem', minWidth: 0 }}>
            <Card className="bigdata-panel-card" style={{ 
                padding: '1.5rem', 
                background: 'var(--color-surface)', 
                border: '1px solid var(--color-border)', 
                borderRadius: '24px', 
                position: 'relative', 
                overflow: 'hidden', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: 'var(--color-primary)' }}></div>
                
                <div className="bigdata-subtitle" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-secondary)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    INTELIGENCIA DE NEGOCIO
                </div>
                
                <div className="bigdata-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1rem', lineHeight: '1.2' }}>
                    Mapeo de Solidez Geográfica
                </div>
                
                <p className="bigdata-desc" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1 }}>
                    Renderizado inmersivo de <b style={{ color: 'var(--color-text)' }}>{selectedTable}</b>. La altimetría refleja el volumen financiero captado y normalizado para los análisis tácticos que has filtrado.
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', background: 'var(--color-surface-hover)', padding: '10px 16px', borderRadius: '12px', width: 'fit-content', maxWidth: '100%', border: '1px solid var(--color-border)' }}>
                    <DatabaseIcon size={16} color="currentColor" /> {canonicalData.length} Registros Activos
                </div>
            </Card>

            <Card className="bigdata-panel-card" style={{ 
                padding: '1.8rem', 
                background: 'var(--color-surface)', 
                border: '1px solid var(--color-border)', 
                borderRadius: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                minWidth: 0,
                overflow: 'hidden'
            }}>
                <div className="bigdata-subtitle" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Ingreso Consolidado (Filtro Actual)
                </div>
                
                <div className="bigdata-title" style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '1.5rem', color: 'var(--color-text)', display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', minWidth: 0 }}>
                    ${canonicalData.reduce((acc, d) => acc + d.val_num, 0).toLocaleString()} 
                    <span style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>MXN</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap', borderTop: '1px solid var(--color-border)', paddingTop: '1.2rem', marginTop: 'auto' }}>
                    <div className="bigdata-desc" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500, minWidth: 0 }}>
                        Pico Máximo: <strong style={{ color: 'var(--color-text)', marginLeft: '6px' }}>{canonicalData[0]?.producto?.substring(0, 30) || '---'}</strong>
                    </div>
                    <div style={{ background: '#ecfdf5', color: '#10b981', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #a7f3d0' }}>
                        <Check size={14} strokeWidth={3}/> VALIDADO
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default BigDataMetrics;
