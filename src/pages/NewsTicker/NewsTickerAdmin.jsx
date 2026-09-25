import React, { useState, useEffect, useRef } from 'react'
import api from '@/services/api'
import { Card, Button, Input, NewsTicker } from '@/components'
import Skeleton from '@/components/Skeleton/Skeleton';
import { useNotification } from '@/context/NotificationContext'
import EmojiPicker from 'emoji-picker-react'

const NewsTickerAdmin = () => {
    const { success, error: showError } = useNotification()
    const emojiPickerRef = useRef(null)

    const [tickerSettings, setTickerSettings] = useState({
        text: '',
        backgroundColor: '#000000',
        textColor: '#ffffff',
        speed: 20
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showSaved, setShowSaved] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    useEffect(() => {
        fetchTickerSettings()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const fetchTickerSettings = async () => {
        setLoading(true)
        try {
            const data = await api.ticker.getSettings({ _t: Date.now() })
            if (data) setTickerSettings(data)
        } catch (error) {
            console.error('Error fetching ticker settings:', error)
            showError('Error al cargar la configuración de la cinta')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveTicker = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await api.ticker.updateSettings(tickerSettings)
            setShowSaved(true)
            setTimeout(() => setShowSaved(false), 3000)
            await fetchTickerSettings()
        } catch (err) {
            console.error('Error saving ticker:', err)
            showError(`Error al guardar: ${err.message || 'Error desconocido'}`)
        } finally {
            setSaving(false)
        }
    }

    const onEmojiClick = (emojiObject) => {
        const emoji = emojiObject.emoji
        // Add at the end as requested
        const newText = tickerSettings.text + emoji
        setTickerSettings({ ...tickerSettings, text: newText })
        setShowEmojiPicker(false)
    }

    if (loading) {
        return (
            <div className="admin-ticker-page" style={{ padding: '2rem', background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
                <div className="page-header mb-8">
                    <Skeleton style={{ height: '28px', width: '280px', marginBottom: '8px', borderRadius: '8px' }} animate />
                    <Skeleton style={{ height: '14px', width: '320px', borderRadius: '4px' }} animate />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2.5rem', alignItems: 'start' }}>
                    {/* Form Layout Skeleton */}
                    <Card style={{ padding: '2rem', borderRadius: '16px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <Skeleton style={{ height: '12px', width: '120px', marginBottom: '8px' }} />
                            <Skeleton style={{ height: '140px', width: '100%', borderRadius: '12px' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <Skeleton style={{ height: '10px', width: '80px', marginBottom: '8px' }} />
                                <Skeleton style={{ height: '42px', width: '100%', borderRadius: '8px' }} />
                            </div>
                            <div>
                                <Skeleton style={{ height: '10px', width: '80px', marginBottom: '8px' }} />
                                <Skeleton style={{ height: '42px', width: '100%', borderRadius: '8px' }} />
                            </div>
                        </div>
                        <div>
                            <Skeleton style={{ height: '10px', width: '140px', marginBottom: '8px' }} />
                            <Skeleton style={{ height: '42px', width: '100%', borderRadius: '8px' }} />
                        </div>
                        <Skeleton style={{ height: '48px', width: '100%', borderRadius: '12px' }} />
                    </Card>

                    {/* Preview Panel Skeleton */}
                    <div style={{ position: 'sticky', top: '2rem' }}>
                        <Skeleton style={{ height: '12px', width: '120px', marginBottom: '1rem' }} />
                        <Card style={{ height: '240px', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                           <Skeleton style={{ height: '10px', width: '120px', margin: '0 auto 1rem', borderRadius: '4px' }} />
                           <Skeleton style={{ height: '38px', width: '100%', borderRadius: '4px' }} />
                           <div style={{ marginTop: '1.5rem', height: '80px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-ticker-page" style={{ padding: '2rem', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
            <div className="page-header mb-8">
                <h1 className="text-2xl font-bold uppercase tracking-tight" style={{ color: 'var(--color-text)' }}>Gestión de Cinta de Noticias</h1>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Configura avisos globales para el Home en tiempo real</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 400px',
                gap: '2.5rem',
                alignItems: 'start'
            }}>
                {/* Form Side */}
                <Card className="glass-panel" style={{ padding: '2rem' }}>
                    <form onSubmit={handleSaveTicker} className="ticker-form">
                        <div className="form-group mb-8">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <label className="input-label font-bold uppercase text-[10px] tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>
                                    Mensaje de la Cinta
                                </label>

                                <div
                                    style={{ position: 'relative' }}
                                    ref={emojiPickerRef}
                                    onMouseEnter={() => setShowEmojiPicker(true)}
                                // We don't onMouseLeave here because we want the picker to stay open while the user is over it
                                >
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        style={{
                                            background: showEmojiPicker ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: '6px',
                                            padding: '4px 12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            color: showEmojiPicker ? 'var(--color-primary-fg)' : 'var(--color-text)'
                                        }}
                                    >
                                        <span style={{ fontSize: '14px' }}>😊</span>
                                        <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Emojis</span>
                                    </button>

                                    {showEmojiPicker && (
                                        <div
                                            onMouseLeave={() => setShowEmojiPicker(false)}
                                            style={{
                                                position: 'absolute',
                                                top: 'calc(100% + 10px)',
                                                right: 0,
                                                zIndex: 1000,
                                                boxShadow: '0 15px 40px rgba(0,0,0,0.5)'
                                            }}
                                        >
                                            <EmojiPicker
                                                onEmojiClick={onEmojiClick}
                                                theme="dark"
                                                width={320}
                                                height={400}
                                                searchPlaceholder="Buscar emoji..."
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <textarea
                                className="input"
                                style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    padding: '1.25rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-surface)',
                                    color: 'var(--color-text)',
                                    resize: 'none',
                                    fontSize: '1rem',
                                    lineHeight: '1.5'
                                }}
                                value={tickerSettings.text}
                                onChange={e => setTickerSettings({ ...tickerSettings, text: e.target.value })}
                                placeholder="Ej. 🔥 OFERTAS RELÁMPAGO • ✨ NUEVOS EVENTOS DISPONIBLES"
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div className="form-group">
                                <label className="input-label block mb-2 font-bold uppercase text-[10px] tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>Fondo</label>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={tickerSettings.backgroundColor}
                                        onChange={e => setTickerSettings({ ...tickerSettings, backgroundColor: e.target.value })}
                                        style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', padding: '0', cursor: 'pointer' }}
                                    />
                                    <Input
                                        value={tickerSettings.backgroundColor}
                                        onChange={e => setTickerSettings({ ...tickerSettings, backgroundColor: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="input-label block mb-2 font-bold uppercase text-[10px] tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>Texto</label>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={tickerSettings.textColor}
                                        onChange={e => setTickerSettings({ ...tickerSettings, textColor: e.target.value })}
                                        style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', padding: '0', cursor: 'pointer' }}
                                    />
                                    <Input
                                        value={tickerSettings.textColor}
                                        onChange={e => setTickerSettings({ ...tickerSettings, textColor: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group mb-8">
                            <label className="input-label block mb-2 font-bold uppercase text-[10px] tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>Velocidad (Segundos)</label>
                            <Input
                                type="number"
                                value={tickerSettings.speed}
                                onChange={e => setTickerSettings({ ...tickerSettings, speed: parseInt(e.target.value) || 20 })}
                                min="5"
                                max="100"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant={showSaved ? "success" : "primary"}
                            style={{ width: '100%', height: '48px', fontWeight: '900', letterSpacing: '0.05em' }}
                            disabled={saving}
                        >
                            {saving ? 'GUARDANDO...' : showSaved ? '¡CAMBIOS GUARDADOS!' : 'GUARDAR CAMBIOS'}
                        </Button>
                    </form>
                </Card>

                {/* Preview Side */}
                <div style={{ position: 'sticky', top: '2rem' }}>
                    <h3 className="mb-4 font-bold uppercase text-[10px] tracking-widest" style={{ color: 'var(--color-text)', opacity: 1 }}>Vista Previa en Vivo</h3>

                    <div
                        className="preview-card"
                        style={{
                            border: '1px solid var(--color-border)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: 'var(--color-surface)',
                            color: 'var(--color-text)',
                            padding: '1.5rem',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <p className="text-[10px] font-bold text-center" style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>— HOME VIEWPORT —</p>

                        <div style={{
                            border: '1px solid var(--color-border-strong)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            background: '#0a0a0a',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <NewsTicker settings={tickerSettings} />
                        </div>

                        <div style={{ marginTop: '1.5rem', height: '100px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', borderRadius: '4px', opacity: 1 }} />
                        <div style={{ marginTop: '0.5rem', height: '40px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', borderRadius: '4px', opacity: 1 }} />
                    </div>

                    <div className="mt-6 p-4 border border-dashed rounded-lg" style={{ borderColor: 'var(--color-danger)', background: 'var(--color-danger-bg)' }}>
                        <p className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--color-danger)' }}>Nota Pro</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Los emojis aparecen siempre al final del mensaje para no interrumpir tu flujo de escritura.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewsTickerAdmin
