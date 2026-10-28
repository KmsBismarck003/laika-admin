import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { merchService } from '@/services/merch.service';
import api from '@/services/api';

/**
 * useMerchandiseApproval — Hook de lógica y estado para Aprobación de Mercancía y Tiendas
 * Conecta endpoints reales sin mocks y gestiona filtros, paginación y mutaciones.
 */
export const useMerchandiseApproval = () => {
  const { success, error: showError } = useNotification();

  // Pestaña activa: 'products' (aprobación) | 'stores' (gestores y tiendas)
  const [activeTab, setActiveTab] = useState('products');

  // Estados de carga
  const [loadingGestores, setLoadingGestores] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Datos crudos
  const [gestores, setGestores] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);

  // Estados de mutación en progreso
  const [updatingId, setUpdatingId] = useState(null);
  const [processingProductId, setProcessingProductId] = useState(null);
  const [editingSettings, setEditingSettings] = useState(null);

  // Filtros de Gestores y Tiendas
  const [gestorSearch, setGestorSearch] = useState('');
  const [storeStatusFilter, setStoreStatusFilter] = useState('all'); // 'all' | 'enabled' | 'disabled'
  const [membershipFilter, setMembershipFilter] = useState('all'); // 'all' | 'premium' | 'standard'
  const [gestorPage, setGestorPage] = useState(1);
  const [gestorPageSize, setGestorPageSize] = useState(10);

  // Filtros de Productos Pendientes
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productPage, setProductPage] = useState(1);
  const [productPageSize, setProductPageSize] = useState(8);

  // --- CARGA DE GESTORES Y CONFIGURACIONES DE TIENDA ---
  const loadGestores = useCallback(async () => {
    setLoadingGestores(true);
    try {
      const usersData = await api.adminUsers.getAll({ role: 'gestor' });
      const gestoresList = Array.isArray(usersData) ? usersData : [];

      const combinedData = await Promise.all(
        gestoresList.map(async (u) => {
          try {
            const settings = await merchService.getSettings(u.id);
            return { ...u, settings };
          } catch (e) {
            return {
              ...u,
              settings: {
                is_enabled: false,
                commission_percentage: 10,
                activation_fee_paid: false,
                product_limit: 50
              }
            };
          }
        })
      );

      setGestores(combinedData);
    } catch (err) {
      console.error('Error al cargar gestores:', err);
      showError('Error al sincronizar datos de gestores');
    } finally {
      setLoadingGestores(false);
    }
  }, [showError]);

  // --- CARGA DE PRODUCTOS PENDIENTES DE REVISIÓN ---
  const loadPendingProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const items = await merchService.getAllMerchandise(null, null, null, 'pending_review');
      setPendingProducts(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Error al cargar productos pendientes:', err);
      showError('Error al cargar solicitudes de mercancía');
    } finally {
      setLoadingProducts(false);
    }
  }, [showError]);

  // Carga inicial
  useEffect(() => {
    loadGestores();
    loadPendingProducts();
  }, [loadGestores, loadPendingProducts]);

  // Recarga global
  const reloadAll = useCallback(() => {
    loadGestores();
    loadPendingProducts();
  }, [loadGestores, loadPendingProducts]);

  // --- ACCIONES DE TIENDAS Y GESTORES ---
  const togglePremium = async (userId, currentStatus) => {
    try {
      setUpdatingId(userId);
      const newStatus = !currentStatus;

      await api.put(`/api/auth/users/${userId}/permissions`, {
        is_premium: newStatus,
        premium_until: newStatus ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
      });

      success(`Membresía ${newStatus ? 'Premium activada' : 'Estándar establecida'}`);
      loadGestores();
    } catch (error) {
      console.error('Error al actualizar membresía:', error);
      showError('No se pudo actualizar la membresía del gestor');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editingSettings) return;

    try {
      await merchService.updateSettings(editingSettings.id, {
        is_enabled: Boolean(editingSettings.settings.is_enabled),
        activation_fee_paid: Boolean(editingSettings.settings.activation_fee_paid),
        commission_percentage: parseFloat(editingSettings.settings.commission_percentage) || 10,
        product_limit: parseInt(editingSettings.settings.product_limit, 10) || 50
      });

      success('Configuración de tienda actualizada exitosamente');
      setEditingSettings(null);
      loadGestores();
    } catch (error) {
      console.error('Error al guardar configuración de tienda:', error);
      showError('Error al sincronizar configuración de tienda');
    }
  };

  // --- ACCIONES DE APROBACIÓN DE PRODUCTOS ---
  const handleUpdateProductStatus = async (productId, newStatus) => {
    try {
      setProcessingProductId(productId);
      await merchService.updateAdminStatus(productId, newStatus);
      success(`Producto ${newStatus === 'approved' ? 'Aprobado y publicado' : 'Rechazado'}`);
      loadPendingProducts();
    } catch (error) {
      console.error('Error al actualizar estado del producto:', error);
      showError('Error al actualizar estado de la mercancía');
    } finally {
      setProcessingProductId(null);
    }
  };

  // --- FILTRADO Y PAGINACIÓN DE GESTORES ---
  const filteredGestores = useMemo(() => {
    let list = [...gestores];

    if (gestorSearch.trim()) {
      const q = gestorSearch.toLowerCase().trim();
      list = list.filter(
        (g) =>
          g.email?.toLowerCase().includes(q) ||
          `${g.first_name || ''} ${g.last_name || ''}`.toLowerCase().includes(q)
      );
    }

    if (storeStatusFilter === 'enabled') {
      list = list.filter((g) => g.settings?.is_enabled);
    } else if (storeStatusFilter === 'disabled') {
      list = list.filter((g) => !g.settings?.is_enabled);
    }

    if (membershipFilter === 'premium') {
      list = list.filter((g) => g.is_premium);
    } else if (membershipFilter === 'standard') {
      list = list.filter((g) => !g.is_premium);
    }

    return list;
  }, [gestores, gestorSearch, storeStatusFilter, membershipFilter]);

  useEffect(() => {
    setGestorPage(1);
  }, [gestorSearch, storeStatusFilter, membershipFilter]);

  const totalFilteredGestores = filteredGestores.length;
  const totalGestorPages = Math.max(1, Math.ceil(totalFilteredGestores / gestorPageSize));
  const paginatedGestores = useMemo(() => {
    const start = (gestorPage - 1) * gestorPageSize;
    return filteredGestores.slice(start, start + gestorPageSize);
  }, [filteredGestores, gestorPage, gestorPageSize]);

  // --- FILTRADO Y PAGINACIÓN DE PRODUCTOS ---
  const availableProductCategories = useMemo(() => {
    const cats = new Set();
    pendingProducts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [pendingProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...pendingProducts];

    if (productSearch.trim()) {
      const q = productSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    if (productCategoryFilter !== 'all') {
      list = list.filter((p) => p.category === productCategoryFilter);
    }

    return list;
  }, [pendingProducts, productSearch, productCategoryFilter]);

  useEffect(() => {
    setProductPage(1);
  }, [productSearch, productCategoryFilter]);

  const totalFilteredProducts = filteredProducts.length;
  const totalProductPages = Math.max(1, Math.ceil(totalFilteredProducts / productPageSize));
  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * productPageSize;
    return filteredProducts.slice(start, start + productPageSize);
  }, [filteredProducts, productPage, productPageSize]);

  // --- KPIs GLOBALES ---
  const kpis = useMemo(() => {
    const totalGestores = gestores.length;
    const premiumCount = gestores.filter((g) => g.is_premium).length;
    const enabledStores = gestores.filter((g) => g.settings?.is_enabled).length;

    const commissions = gestores.map((g) => Number(g.settings?.commission_percentage) || 10);
    const avgCommission =
      commissions.length > 0
        ? (commissions.reduce((a, b) => a + b, 0) / commissions.length).toFixed(1)
        : '10.0';

    return {
      totalGestores,
      premiumCount,
      enabledStores,
      avgCommission,
      pendingCount: pendingProducts.length
    };
  }, [gestores, pendingProducts]);

  return {
    activeTab,
    setActiveTab,
    loading: loadingGestores && loadingProducts,
    loadingGestores,
    loadingProducts,
    kpis,
    reloadAll,

    // Gestores y Tiendas
    gestores: paginatedGestores,
    totalFilteredGestores,
    gestorSearch,
    setGestorSearch,
    storeStatusFilter,
    setStoreStatusFilter,
    membershipFilter,
    setMembershipFilter,
    gestorPage,
    setGestorPage,
    totalGestorPages,
    gestorPageSize,
    setGestorPageSize,
    updatingId,
    togglePremium,
    editingSettings,
    setEditingSettings,
    handleSaveSettings,

    // Productos Pendientes
    products: paginatedProducts,
    totalFilteredProducts,
    pendingProductsCount: pendingProducts.length,
    productSearch,
    setProductSearch,
    productCategoryFilter,
    setProductCategoryFilter,
    availableProductCategories,
    productPage,
    setProductPage,
    totalProductPages,
    productPageSize,
    setProductPageSize,
    processingProductId,
    approveProduct: (id) => handleUpdateProductStatus(id, 'approved'),
    rejectProduct: (id) => handleUpdateProductStatus(id, 'rejected')
  };
};
