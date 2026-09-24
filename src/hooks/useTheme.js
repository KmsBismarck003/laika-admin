import { useContext } from 'react';
import ThemeContext from '@/context/ThemeContext';

/**
 * useTheme - Custom Hook puro (SRP: solo expone tema)
 * Delega persistencia y efectos al Provider.
 */
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
};
export default useTheme;
