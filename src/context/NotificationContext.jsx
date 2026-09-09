import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const addNotification = useCallback((type, message, duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newNotification = { id, type, message, timestamp: new Date() };

    setNotifications(prev => [newNotification, ...prev]);

    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const success = useCallback((msg, duration) => addNotification('success', msg, duration), [addNotification]);
  const error = useCallback((msg, duration) => addNotification('error', msg, duration), [addNotification]);
  const info = useCallback((msg, duration) => addNotification('info', msg, duration), [addNotification]);
  const warning = useCallback((msg, duration) => addNotification('warning', msg, duration), [addNotification]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        selectedNotification,
        setSelectedNotification,
        addNotification,
        removeNotification,
        clearAll,
        success,
        error,
        info,
        warning
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de NotificationProvider');
  }
  return context;
};

export default NotificationContext;
