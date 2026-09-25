import React from 'react';
import { Settings, ChevronDown, Palette, Eye, Database as DatabaseIcon } from 'lucide-react';
import { Card } from '@/components';

const BigDataTools = ({
    openColorPanel,
    setOpenColorPanel,
    colorPalette,
    setColorPalette,
    palettes,
    openMetricsPanel,
    setOpenMetricsPanel,
    hMult, setHMult,
    barWidth, setBarWidth,
    markerSize, setMarkerSize,
    customColor, setCustomColor,
    opacity, setOpacity,
    buildingShape, setBuildingShape,
    isWireframe, setIsWireframe,
    openLogPanel, setOpenLogPanel,
    canonicalData
}) => {
    return (
        <div className="bigdata-side-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
            {/* Esquema de Color */}
            <Card className="bigdata-panel-card" style={{ 
                padding: openColorPanel ? '1.5rem' : '1rem 1.2rem', 
                background: 'var(--color-surface)', 
                border: '1px solid var(--color-border)', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
                borderRadius: '16px', 
                transition: 'all 0.3s ease',
                overflow: 'visible',
                minWidth: 0
            }}>
                <button 
                    onClick={() => setOpenColorPanel(v => !v)} 
                    style={{ 
                        width: '100%', 
                        background: 'transparent', 
                        border: 'none', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: 0, 
                        cursor: 'pointer',
                        marginBottom: openColorPanel ? '1rem' : '0'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div className="bigdata-icon" style={{ background: 'var(--color-surface-hover)', padding: '6px', borderRadius: '8px', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                            <Palette size={16} />
                        </div>
                        <h3 className="bigdata-title" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, letterSpacing: '0.5px' }}>ESQUEMA DE COLOR</h3>
                    </div>
                    <ChevronDown size={18} color="currentColor" style={{ transform: openColorPanel ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                </button>
                
                {openColorPanel && (
                    <div className="bigdata-panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px', overflowY: 'auto', overflowX: 'hidden', maxHeight: '300px', minWidth: 0, paddingRight: '4px' }}>
                        {Object.keys(palettes).map(p => (
                            <button 
                                key={p} 
                                onClick={() => setColorPalette(p)} 
                                style={{
                                    background: colorPalette === p ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                                    color: colorPalette === p ? 'var(--color-primary-fg)' : 'var(--color-text-secondary)',
                                    border: colorPalette === p ? '1px solid var(--color-border-strong)' : '1px solid var(--color-border)',
                                    padding: '0.8rem 0.5rem',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </Card>

            {/* Configuración 3D */}
            <Card className="bigdata-panel-card" style={{ 
                padding: openMetricsPanel ? '1.5rem' : '1rem 1.2rem', 
                background: 'var(--color-surface)', 
                border: '1px solid var(--color-border)', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
                borderRadius: '16px', 
                transition: 'all 0.3s ease',
                overflow: 'visible',
                minWidth: 0
            }}>
                <button 
                    onClick={() => setOpenMetricsPanel(v => !v)} 
                    style={{ 
                        width: '100%', 
                        background: 'transparent', 
                        border: 'none', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: 0, 
                        cursor: 'pointer',
                        marginBottom: openMetricsPanel ? '1.5rem' : '0'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div className="bigdata-icon" style={{ background: 'var(--color-surface-hover)', padding: '6px', borderRadius: '8px', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                            <Settings size={16} />
                        </div>
                        <h3 className="bigdata-title" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, letterSpacing: '0.5px' }}>CONFIGURACIÓN 3D</h3>
                    </div>
                    <ChevronDown size={18} color="currentColor" style={{ transform: openMetricsPanel ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                </button>
                
                {openMetricsPanel && (
                    <div className="bigdata-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', overflowY: 'auto', overflowX: 'hidden', maxHeight: '65vh', minWidth: 0, paddingRight: '6px', scrollbarWidth: 'thin' }}>
                        <div className="slider-group">
                            <div className="slider-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem', flexWrap: 'wrap', marginBottom: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Altura (Z)</label>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text)', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', padding: '2px 8px', borderRadius: '6px' }}>{hMult}x</span>
                            </div>
                            <input type="range" min="0.5" max="5" step="0.1" value={hMult} onChange={(e) => setHMult(parseFloat(e.target.value))} className="slider-premium" />
                        </div>
                        
                        <div className="slider-group">
                            <div className="slider-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem', flexWrap: 'wrap', marginBottom: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Ancho Base</label>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text)', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', padding: '2px 8px', borderRadius: '6px' }}>{barWidth}</span>
                            </div>
                            <input type="range" min="0.05" max="0.5" step="0.01" value={barWidth} onChange={(e) => setBarWidth(parseFloat(e.target.value))} className="slider-premium" />
                        </div>
                        
                        <div className="slider-group">
                            <div className="slider-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem', flexWrap: 'wrap', marginBottom: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Tamaño Puntos</label>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text)', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', padding: '2px 8px', borderRadius: '6px' }}>{markerSize}px</span>
                            </div>
                            <input type="range" min="4" max="24" step="1" value={markerSize} onChange={(e) => setMarkerSize(parseInt(e.target.value))} className="slider-premium" />
                        </div>
                        
                        <div className="slider-group">
                            <div className="slider-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem', flexWrap: 'wrap', marginBottom: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Opacidad</label>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text)', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', padding: '2px 8px', borderRadius: '6px' }}>{Math.round(opacity * 100)}%</span>
                            </div>
                            <input type="range" min="0.1" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="slider-premium" />
                        </div>
                        
                        <div className="slider-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.5rem', flexWrap: 'wrap' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Color Custom</label>
                            <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} style={{ padding: 0, border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginTop: '0.5rem', minWidth: 0 }}>
                            <select 
                                className="select-premium" 
                                value={buildingShape} 
                                onChange={(e) => setBuildingShape(e.target.value)}
                                style={{ padding: '0.6rem', fontSize: '0.75rem', minWidth: 0 }}
                            >
                                <option value="cube">Cubos</option>
                                <option value="pyramid">Pirámides</option>
                                <option value="points">Puntos</option>
                            </select>
                            <button 
                                onClick={() => setIsWireframe(!isWireframe)} 
                                style={{
                                    background: isWireframe ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                                    color: isWireframe ? 'var(--color-primary-fg)' : 'var(--color-text-secondary)',
                                    border: '1px solid var(--color-border)',
                                    padding: '0.6rem',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Eye size={14}/> {isWireframe ? 'Boceto' : 'Sólido'}
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Log de Tectónico */}
            <Card className="bigdata-panel-card" style={{ 
                padding: openLogPanel ? '0' : '1rem 1.2rem', 
                background: 'var(--color-surface)', 
                border: '1px solid var(--color-border)', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
                borderRadius: '16px', 
                transition: 'all 0.3s ease',
                overflow: 'visible',
                flexGrow: 0,
                minWidth: 0
            }}>
                <button 
                    onClick={() => setOpenLogPanel(v => !v)} 
                    style={{ 
                        width: '100%', 
                        background: 'transparent', 
                        border: 'none', 
                        borderBottom: openLogPanel ? '1px solid var(--color-border)' : 'none',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: openLogPanel ? '1rem 1.5rem' : '0', 
                        cursor: 'pointer',
                        color: 'var(--color-text)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div className="bigdata-icon" style={{ background: 'var(--color-surface-hover)', padding: '6px', borderRadius: '8px', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                            <DatabaseIcon size={16} />
                        </div>
                        <h3 className="bigdata-title" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', margin: 0, letterSpacing: '0.5px' }}>LOG DE EVENTOS</h3>
                    </div>
                    <ChevronDown size={18} color="currentColor" style={{ transform: openLogPanel ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                </button>
                
                {openLogPanel && (
                    <div className="bigdata-panel-body" style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'hidden', padding: '0.5rem 1rem', minWidth: 0, scrollbarWidth: 'thin' }}>
                        {canonicalData.slice(0, 20).map((d, i) => (
                            <div key={i} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '.5rem',
                                padding: '0.8rem 0.5rem', 
                                borderBottom: '1px solid var(--color-border)',
                                transition: 'background 0.2s',
                                borderRadius: '8px',
                                minWidth: 0
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-surface-hover)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-muted)', width: '24px', flexShrink: 0 }}>{(i+1).toString().padStart(2, '0')}</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', flexGrow: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '10px' }}>{d.producto}</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text)', flexShrink: 0 }}>${d.val_num.toLocaleString()}</span>
                            </div>
                        ))}
                        {canonicalData.length === 0 && (
                            <div className="bigdata-desc" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Sin datos coincidentes</div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default BigDataTools;
