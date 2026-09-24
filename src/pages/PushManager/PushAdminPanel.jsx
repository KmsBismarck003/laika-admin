import React, { useState, useEffect } from 'react';
import { PushEngine } from './services/PushEngine';
import { BentoGrid, BentoCard, Button, Input, Icon, Badge } from '@/components';
import { apiClient } from '@/services/apiClient';
import './PushAdminPanel.css';

const PushAdminPanel = () => {
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    url: '',
    type: 'MANUAL',
    targetAudience: 'ALL'
  });
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    // Check permission on mount
    const checkPerms = async () => {
      await PushEngine.init();
      setPermissionStatus(PushEngine.permission);
    };
    checkPerms();
  }, []);

  const handleRequestPermission = async () => {
    const granted = await PushEngine.requestPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
    if (granted) {
      setFeedback({ type: 'success', msg: 'Permiso de notificaciones concedido con éxito.' });
    } else {
      setFeedback({ type: 'error', msg: 'Permiso denegado por el usuario o navegador.' });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendPush = async (e) => {
    e.preventDefault();
    
    if (permissionStatus !== 'granted') {
      setFeedback({ type: 'error', msg: 'No se pueden enviar notificaciones sin permisos del navegador.' });
      return;
    }

    if (!formData.title.trim() || !formData.body.trim()) {
      setFeedback({ type: 'error', msg: 'El título y el cuerpo son obligatorios.' });
      return;
    }

    setIsSending(true);
    setFeedback(null);

    try {
      const response = await apiClient.post('/users/push/send', {
        title: formData.title,
        body: formData.body,
        url: formData.url,
        audience: formData.targetAudience
      });

      if (response && response.status === 'success') {
        setFeedback({ type: 'success', msg: `Notificación push enviada a ${response.sentCount || 0} dispositivos registrados en la BD.` });
        setFormData({ ...formData, title: '', body: '', url: '' });
      } else {
        setFeedback({ type: 'error', msg: 'Error del servidor al enviar la notificación.' });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', msg: err.message || 'Error de red al intentar enviar la notificación.' });
    } finally {
      setIsSending(false);
    }
  };

  const handleTestSmartTrigger = async (type) => {
    if (permissionStatus !== 'granted') {
      setFeedback({ type: 'error', msg: 'Permisos de notificación no concedidos.' });
      return;
    }

    let data = {};
    if (type === 'TICKET_PURCHASE') {
      data = { eventName: 'Concierto Sinfónico VIP', url: window.location.origin + '/user/tickets' };
    } else if (type === 'NEW_EVENT') {
      data = { eventName: 'Festival Laika 2027', url: window.location.origin + '/event/1' };
    } else if (type === 'CART_REMINDER') {
      data = { url: window.location.origin + '/cart' };
    }

    // Bypass anti-spam for testing by not calling the real shouldSend internally,
    // or just call triggerSmart which works once per hour by default.
    // Wait, triggerSmart has anti-spam throttle, let's call sendNotification directly with Psychology content
    // so the admin can test it repeatedly.
    const { PushPsychology } = await import('./utils/PushPsychology');
    const content = PushPsychology.optimizeContent(type, data);
    
    const success = await PushEngine.sendNotification(content.title, {
      body: content.body,
      data: content.url || window.location.origin
    });

    if (success) {
      setFeedback({ type: 'success', msg: `Trigger automático [${type}] probado con éxito en tu dispositivo.` });
    } else {
      setFeedback({ type: 'error', msg: `Fallo al probar el trigger automático [${type}].` });
    }
  };

  return (
    <div className="fade-in" style={{ padding: '0.5rem 0' }}>
      <BentoGrid style={{ marginBottom: '1.5rem' }}>
        <BentoCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Central de Notificaciones Push</h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Gestiona y envía notificaciones nativas a dispositivos Windows, macOS, Android e iOS.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <Badge variant={permissionStatus === 'granted' ? 'success' : permissionStatus === 'denied' ? 'danger' : 'default'} rounded>
                Estado del Sistema: {permissionStatus.toUpperCase()}
              </Badge>
              {permissionStatus !== 'granted' && (
                <Button variant="secondary" size="small" onClick={handleRequestPermission}>
                  Habilitar Permisos Locales
                </Button>
              )}
            </div>
          </div>
        </BentoCard>
      </BentoGrid>

      <BentoGrid>
        {/* Panel Izquierdo - Formulario */}
        <BentoCard>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Nueva Campaña Push</h2>
          <form onSubmit={handleSendPush} className="push-form">
            
            <div className="form-group">
              <label>Audiencia Objetivo</label>
              <select name="targetAudience" value={formData.targetAudience} onChange={handleInputChange}>
                <option value="ALL">Todos los usuarios suscritos</option>
                <option value="TICKET_HOLDERS">Usuarios con boletos comprados</option>
                <option value="INACTIVE">Usuarios inactivos (últimos 30 días)</option>
                <option value="VIP">Usuarios VIP</option>
              </select>
            </div>

            <div className="form-group">
              <label>Título de la Notificación</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="Ej. Preventa exclusiva activa"
                maxLength={50}
              />
              <span className="char-count">{formData.title.length}/50</span>
            </div>

            <div className="form-group">
              <label>Cuerpo del Mensaje (Técnicas de Psicología UX)</label>
              <textarea 
                name="body" 
                value={formData.body} 
                onChange={handleInputChange} 
                placeholder="Genera intriga, urgencia o valor exclusivo. Sin emojis."
                maxLength={150}
                rows={3}
              />
              <span className="char-count">{formData.body.length}/150</span>
            </div>

            <div className="form-group">
              <label>URL de Destino (Opcional)</label>
              <input 
                type="text" 
                name="url" 
                value={formData.url} 
                onChange={handleInputChange} 
                placeholder="https://laikaclub.com/eventos/secreto"
              />
            </div>

            <Button 
              type="submit" 
              variant="primary"
              fullWidth
              style={{ marginTop: '1rem' }}
              disabled={isSending || permissionStatus !== 'granted'}
              loading={isSending}
            >
              Lanzar Notificación Push
            </Button>
            
            {feedback && (
              <div style={{ marginTop: '1rem' }}>
                <Badge variant={feedback.type === 'error' ? 'danger' : 'success'} style={{ display: 'block', padding: '0.75rem', textAlign: 'center' }}>
                  {feedback.msg}
                </Badge>
              </div>
            )}
          </form>
        </BentoCard>

        {/* Panel Derecho - Previsualización de Sistema */}
        <BentoCard style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Previsualización Nativa</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Así es como lo verán los usuarios en su Sistema Operativo (Windows/Mac/Android)</p>
          
          <div className="os-preview-container">
            <div className="mock-os-notification">
              <div className="mock-os-icon">
                <img src="/117.png" alt="App Icon" />
              </div>
              <div className="mock-os-content">
                <div className="mock-os-header">
                  <span className="mock-os-appname">LaikaClub</span>
                  <span className="mock-os-time">Ahora</span>
                </div>
                <h4 className="mock-os-title">{formData.title || 'Título de Notificación'}</h4>
                <p className="mock-os-body">{formData.body || 'El cuerpo del mensaje aparecerá aquí. Utiliza frases persuasivas.'}</p>
              </div>
            </div>
          </div>

          <div className="psychology-tips" style={{ background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--primary)', padding: '1.5rem', borderRadius: '0 8px 8px 0', marginTop: 'auto' }}>
            <h3 style={{ marginTop: 0, fontSize: '1rem', color: 'var(--primary)' }}>Tácticas de Retención (Sin Spam)</h3>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Curiosidad:</strong> Evita revelar toda la información en el mensaje. Obliga al clic.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Urgencia:</strong> "Últimos lugares", "Por tiempo limitado".</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Exclusividad:</strong> Haz sentir especial al usuario. "Solo para miembros VIP".</li>
              <li><strong>Cero Emojis:</strong> Mantiene la estética premium y profesional del club.</li>
            </ul>
          </div>
        </BentoCard>
      </BentoGrid>

      <BentoGrid style={{ marginTop: '1.5rem' }}>
        <BentoCard>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '0.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Simulador de Triggers Automáticos (Testing)</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Prueba en vivo cómo reciben los usuarios las notificaciones del sistema según su comportamiento (Generado vía Psicología UX).
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button 
              variant="secondary"
              onClick={() => handleTestSmartTrigger('TICKET_PURCHASE')}
              disabled={permissionStatus !== 'granted'}
            >
              🎟️ Compra de Boleto
            </Button>
            
            <Button 
              variant="secondary"
              onClick={() => handleTestSmartTrigger('NEW_EVENT')}
              disabled={permissionStatus !== 'granted'}
            >
              📢 Nuevo Evento Publicado
            </Button>

            <Button 
              variant="secondary"
              onClick={() => handleTestSmartTrigger('CART_REMINDER')}
              disabled={permissionStatus !== 'granted'}
            >
              🛒 Recordatorio de Carrito
            </Button>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
};

export default PushAdminPanel;
