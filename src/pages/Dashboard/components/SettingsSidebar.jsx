import React, { useState } from 'react';
import { Settings, Database as DatabaseIcon, Eye, ChevronDown, ChevronUp, Check, Terminal } from 'lucide-react';
import Card from '@/components/Card/Card';

const SettingsSidebar = ({ 
    hMult, setHMult, 
    barWidth, setBarWidth, 
    markerSize, setMarkerSize, 
    customColor, setCustomColor, 
    opacity, setOpacity, 
    buildingShape, setBuildingShape, 
    isWireframe, setIsWireframe,
    canonicalData,
    mlData,
    analysisMode,
    selectedTable
}) => {
    const [isLogOpen, setIsLogOpen] = useState(false);

    // Lógica para determinar qué mostrar en el log según el modo
    const getLogContent = () => {
        if (analysisMode === 'ML_PCA' && mlData?.data && Array.isArray(mlData.data)) {
            return mlData.data.slice(0, 20).map((d, i) => (
                <div key={i} className="log-row-premium">
                    <span className="log-rank" style={{ color: 'var(--color-text)', fontWeight: 900 }}>C{d.cluster}</span>
                    <span className="log-name" title={d.metrics?.producto || 'Registro'}>
                        {d.metrics?.producto || 'ID: ' + i}
                    </span>
                    <span className="log-val" style={{ fontSize: '0.6rem', opacity: 0.7 }}>Mapa PCA</span>
                </div>
            ));
        }

        if ((analysisMode === 'ML_REGRESSION' || analysisMode === 'ML_DECISION_TREE') && mlData?.data && Array.isArray(mlData.data)) {
            return mlData.data.slice(0, 20).map((d, i) => (
                <div key={i} className="log-row-premium">
                    <span className="log-rank">{(i+1).toString().padStart(2, '0')}</span>
                    <span className="log-name" title={d.producto || 'Dato'}>{d.producto || 'Reg.' + i}</span>
                    <span className="log-val" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>${Math.round(d.y_pred || 0).toLocaleString()}</span>
                        <span style={{ fontSize: '0.55rem', opacity: 0.5 }}>Real: ${Math.round(d.y || 0).toLocaleString()}</span>
                    </span>
                </div>
            ));
        }

        // Default: Exploration 2D or Fallback
        const displayData = canonicalData || [];
        return displayData.slice(0, 20).map((d, i) => (
            <div key={i} className="log-row-premium">
                <span className="log-rank">{(i+1).toString().padStart(2, '0')}</span>
                <span className="log-name" title={d.producto}>{d.producto}</span>
                <span className="log-val">${d.val_num.toLocaleString()}</span>
            </div>
        ));
    };

    return (
        <aside className="bigdata-side-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0, overflowY: 'auto', overflowX: 'hidden', maxHeight: '100%' }}>


            <Card className="bigdata-panel-card" style={{ 
                padding: '0', 
                background: 'var(--color-surface)', 
                border: '1px solid var(--color-border)', 
                borderRadius: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                flexGrow: isLogOpen ? 1 : 0, 
                overflow: 'hidden', 
                boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                minWidth: 0
            }}>
                <div 
                    onClick={() => setIsLogOpen(!isLogOpen)}
                    style={{ 
                        padding: '1.2rem', 
                        borderBottom: isLogOpen ? '1px solid var(--color-border)' : 'none', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        gap: '.5rem',
                        flexWrap: 'wrap',
                        background: 'var(--color-surface-hover)',
                        cursor: 'pointer',
                        userSelect: 'none',
                        minWidth: 0
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <DatabaseIcon size={14} color="currentColor" style={{ color: 'var(--color-text)' }} />
                        <h3 className="bigdata-title" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                            {analysisMode === '2D_EXPLORATION' ? 'LOG DE ACTIVIDAD' : 'LOG DE RESULTADOS PROCESADOS'}
                        </h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {analysisMode !== '2D_EXPLORATION' && isLogOpen && (
                            <span style={{ fontSize: '0.6rem', color: 'var(--color-primary-fg)', background: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>MODO IA</span>
                        )}
                        {isLogOpen ? <ChevronUp size={14} color="currentColor" style={{ color: 'var(--color-text-secondary)' }} /> : <ChevronDown size={14} color="currentColor" style={{ color: 'var(--color-text-secondary)' }} />}
                    </div>
                </div>
                
                {isLogOpen && (
                    <div className="log-container-premium bigdata-panel-body" style={{ animation: 'slideDown 0.3s ease-out', maxHeight: '320px' }}>
                        {getLogContent()}
                        {((analysisMode === '2D_EXPLORATION' && canonicalData.length === 0) || 
                          (analysisMode !== '2D_EXPLORATION' && !mlData)) && (
                            <div className="bigdata-desc" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Sin datos coincidentes</div>
                        )}
                    </div>
                )}
            </Card>

            {/* MÉTRICAS REUBICADAS (Debajo del Log) */}
            <Card className="bigdata-panel-card" style={{ 
                padding: '1.2rem', 
                background: 'var(--color-surface)', 
                border: '1px solid var(--color-border)', 
                borderRadius: '24px', 
                position: 'relative', 
                overflow: 'hidden', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.5s ease',
                minWidth: 0
            }}>
                <div style={{ 
                    position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', 
                    background: 'var(--color-primary)',
                    transition: 'background 0.5s ease'
                }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <div className="bigdata-subtitle" style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--color-text-secondary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        INTELIGENCIA DE DATOS
                    </div>
                </div>

                <div className="bigdata-title" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.4rem' }}>
                    { analysisMode === 'ML_DECISION_TREE' ? 'Hallazgo: Árbol Decisión' :
                      analysisMode === 'ML_REGRESSION' ? 'Hallazgo: Proyección' :
                      analysisMode === 'ML_NEURAL_NETWORK' ? 'Hallazgo: Red Neuronal' :
                      analysisMode === 'ML_PCA' ? 'Hallazgo: Segmentación' :
                      'Mapeo de Solidez' }
                </div>

                <p className="bigdata-desc" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', opacity: 0.9, lineHeight: '1.4', marginBottom: '1rem' }}>
                    { (analysisMode !== '2D_EXPLORATION' && mlData?.insights?.length > 0) 
                        ? <b style={{ color: 'var(--color-text)' }}>{mlData.insights[0]}</b>
                        : `Análisis de ${selectedTable}.`
                    }
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-text)', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', padding: '6px 12px', borderRadius: '12px', width: 'fit-content', maxWidth: '100%' }}>
                    <DatabaseIcon size={10} color="currentColor" /> {canonicalData.length} Registros
                </div>
            </Card>

            <Card className="bigdata-panel-card" style={{ 
                padding: '1.2rem', 
                background: 'var(--color-surface)', 
                border: '1px solid var(--color-border)', 
                color: 'var(--color-text)', 
                borderRadius: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                minWidth: 0,
                overflow: 'hidden'
            }}>
                <div className="bigdata-subtitle" style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-text-secondary)', opacity: 0.9, marginBottom: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    INGRESO TOTAL
                </div>
                
                <div className="bigdata-title" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.6rem', color: 'var(--color-text)', display: 'flex', alignItems: 'baseline', gap: '4px', flexWrap: 'wrap', minWidth: 0 }}>
                    ${canonicalData.reduce((acc, d) => acc + d.val_num, 0).toLocaleString()} 
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>MXN</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--color-border)', paddingTop: '0.8rem' }}>
                    <div className="bigdata-desc" style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', minWidth: 0 }}>
                        Pico: <strong style={{ color: 'var(--color-text)' }}>{canonicalData[0]?.producto?.substring(0, 10) || '---'}</strong>
                    </div>
                    <div style={{ 
                        background: 'var(--color-surface-hover)', 
                        color: 'var(--color-text)', 
                        border: '1px solid var(--color-border)', 
                        padding: '2px 6px', 
                        borderRadius: '6px', 
                        fontSize: '0.55rem', 
                        fontWeight: 800, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '3px'
                    }}>
                        { (analysisMode !== '2D_EXPLORATION') ? <Terminal size={8}/> : <Check size={8}/> }
                        { (analysisMode !== '2D_EXPLORATION') ? 'IA' : 'OK' }
                    </div>
                </div>
            </Card>
        </aside>
    );
};

export default SettingsSidebar;
