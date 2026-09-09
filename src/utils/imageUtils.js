/**
 * @file imageUtils.js
 * @description Utilidad para generar URLs de imágenes apuntando a Pilgrim API.
 * Elimina cualquier puerto o IP hardcodeada.
 */
import { PILGRIM_API_URL } from '../config/pilgrim.config';

export const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/400x200?text=Sin+Imagen';

  let cleanPath = String(path).trim();

  // Si ya es una URL absoluta o blob, devolver directamente
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://') || cleanPath.startsWith('blob:') || cleanPath.startsWith('data:')) {
    return cleanPath;
  }

  // Normalizar doble /api/
  cleanPath = cleanPath.replace(/\/api\/api\//g, '/api/');

  // Derivar base de Pilgrim (eliminando '/api' final para recursos estáticos si aplica)
  const pilgrimOrigin = PILGRIM_API_URL.replace(/\/api\/?$/, '');

  // Manejar uploads
  if (cleanPath.startsWith('/uploads/')) {
    return `${pilgrimOrigin}${cleanPath}`;
  }
  if (cleanPath.startsWith('uploads/')) {
    return `${pilgrimOrigin}/${cleanPath}`;
  }

  // Asegurar diagonal inicial
  const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${pilgrimOrigin}${finalPath}`;
};

export default getImageUrl;
