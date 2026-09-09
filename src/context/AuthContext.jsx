import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { authAPI } from '@/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const standardizeUser = (u) => {
    if (!u) return null;
    return {
      ...u,
      firstName: u.firstName || u.first_name || '',
      lastName: u.lastName || u.last_name || '',
      avatarUrl: u.avatarUrl || u.avatar_url || '',
      role: u.role || 'admin',
      permissions: u.permissions || {}
    };
  };

  const [user, setUserState] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!savedUser) return null;
      const parsed = JSON.parse(savedUser);
      // Validar que el usuario almacenado sea admin
      if (parsed && (parsed.role === 'admin' || parsed.is_admin || parsed.is_superuser)) {
        return standardizeUser(parsed);
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [authError, setAuthError] = useState(null);

  const saveAuthData = (token, userData, remember = true) => {
    const primaryStorage = remember ? localStorage : sessionStorage;
    const secondaryStorage = remember ? sessionStorage : localStorage;

    primaryStorage.setItem('token', token);
    primaryStorage.setItem('user', JSON.stringify(userData));

    secondaryStorage.removeItem('token');
    secondaryStorage.removeItem('user');
  };

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUserState(null);
  };

  // Logout
  const logout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn('Error al registrar logout en servidor:', err);
    } finally {
      clearAuthData();
      setLoggingOut(false);
    }
  }, []);

  // Check Authentication & Server Authorization on mount
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

      if (!token || !storedUser) {
        clearAuthData();
        setLoading(false);
        return;
      }

      const data = await authAPI.verifyToken();
      if (data && data.valid && data.user) {
        const verifiedRole = data.user.role;
        // VALIDACIÓN ESTRICTA EN SERVIDOR: Solo admins permitidos
        if (verifiedRole !== 'admin' && !data.user.is_admin && !data.user.is_superuser) {
          console.error('El usuario verificado no posee privilegios de Administrador');
          clearAuthData();
          setAuthError('Acceso denegado: Credenciales no corresponden a un administrador.');
          setLoading(false);
          return;
        }

        const std = standardizeUser(data.user);
        setUserState(std);
        if (localStorage.getItem('token')) {
          localStorage.setItem('user', JSON.stringify(std));
        } else {
          sessionStorage.setItem('user', JSON.stringify(std));
        }
      } else {
        clearAuthData();
      }
    } catch (error) {
      if (error && (error.status === 401 || error.status === 403)) {
        console.warn('Sesión de administrador inválida o expirada');
        clearAuthData();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login de Administrador
  const login = async (credentials) => {
    setAuthError(null);
    try {
      const data = await authAPI.login(credentials);

      if (!data || !data.token || !data.user) {
        throw new Error('Respuesta inválida del servidor de autenticación');
      }

      // VALIDACIÓN EN SERVIDOR DE ROL ADMIN
      const userRole = data.user.role;
      const isAdmin = userRole === 'admin' || data.user.is_admin || data.user.is_superuser;

      if (!isAdmin) {
        // Rechazar acceso si no es admin
        throw {
          status: 403,
          message: 'Acceso denegado: Esta consola es de uso exclusivo para Administradores del Sistema.'
        };
      }

      const stdUser = standardizeUser(data.user);
      saveAuthData(data.token, stdUser, credentials.rememberMe);
      setUserState(stdUser);

      return { success: true, user: stdUser };
    } catch (error) {
      console.error('Error durante autenticación de administrador:', error);
      const msg = error.message || 'Error de comunicación con el servicio de autenticación';
      setAuthError(msg);
      return {
        success: false,
        status: error.status || 500,
        error: msg
      };
    }
  };

  const updateUser = (updated) => {
    const std = standardizeUser({ ...user, ...updated });
    if (localStorage.getItem('token')) {
      localStorage.setItem('user', JSON.stringify(std));
    } else {
      sessionStorage.setItem('user', JSON.stringify(std));
    }
    setUserState(std);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loggingOut,
        authError,
        login,
        logout,
        checkAuth,
        updateUser,
        isAuthenticated: !!user && (user.role === 'admin' || user.is_admin)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
