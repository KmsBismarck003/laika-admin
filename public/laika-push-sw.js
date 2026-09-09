// laika-push-sw.js - Service Worker para notificaciones push en Laika Admin
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Laika Admin', body: event.data.text() };
    }
  }
  const title = data.title || 'Notificación de Laika Admin';
  const options = {
    body: data.body || 'Nuevo evento detectado en la consola administrativa.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data.url || '/'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});
