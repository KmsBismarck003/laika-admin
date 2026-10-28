import React from 'react';
import './MerchandiseApproval.css';
import { LoadingScreen } from '@/components';
import { useMerchandiseApproval } from './hooks/useMerchandiseApproval';
import { MerchApprovalHeader } from './components/MerchApprovalHeader';
import { MerchPendingBento } from './components/MerchPendingBento';
import { MerchStoresBento } from './components/MerchStoresBento';
import { MerchEditModal } from './components/MerchEditModal';

/**
 * MerchandiseApproval — Vista delgada de orquestación (Thin Wrapper)
 * Cumple con la regla de 5 capas y arquitectura Bento Box Tier-1.
 */
const MerchandiseApproval = () => {
  const {
    activeTab,
    setActiveTab,
    loading,
    loadingGestores,
    loadingProducts,
    kpis,
    reloadAll,

    // Gestores y Tiendas
    gestores,
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
    products,
    totalFilteredProducts,
    pendingProductsCount,
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
    approveProduct,
    rejectProduct
  } = useMerchandiseApproval();

  if (loading) {
    return <LoadingScreen label="Cargando Aprobación de Mercancía y Tiendas..." />;
  }

  return (
    <div className="merch-approval-page">
      {/* Cabecera Bento con Conmutador de Pestañas */}
      <MerchApprovalHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={pendingProductsCount}
        onReload={reloadAll}
        loading={loadingGestores || loadingProducts}
      />

      {/* Pestaña: Aprobación de Mercancía */}
      {activeTab === 'products' && (
        <MerchPendingBento
          products={products}
          totalFilteredProducts={totalFilteredProducts}
          pendingTotalCount={pendingProductsCount}
          searchQuery={productSearch}
          onSearchChange={setProductSearch}
          categoryFilter={productCategoryFilter}
          onCategoryFilterChange={setProductCategoryFilter}
          availableCategories={availableProductCategories}
          currentPage={productPage}
          totalPages={totalProductPages}
          onPageChange={setProductPage}
          pageSize={productPageSize}
          onPageSizeChange={setProductPageSize}
          processingId={processingProductId}
          onApprove={approveProduct}
          onReject={rejectProduct}
          loading={loadingProducts}
        />
      )}

      {/* Pestaña: Control de Tiendas y Gestores */}
      {activeTab === 'stores' && (
        <MerchStoresBento
          gestores={gestores}
          totalFilteredGestores={totalFilteredGestores}
          kpis={kpis}
          searchQuery={gestorSearch}
          onSearchChange={setGestorSearch}
          storeStatusFilter={storeStatusFilter}
          onStoreStatusFilterChange={setStoreStatusFilter}
          membershipFilter={membershipFilter}
          onMembershipFilterChange={setMembershipFilter}
          currentPage={gestorPage}
          totalPages={totalGestorPages}
          onPageChange={setGestorPage}
          pageSize={gestorPageSize}
          onPageSizeChange={setGestorPageSize}
          updatingId={updatingId}
          onTogglePremium={togglePremium}
          onEditSettings={setEditingSettings}
          loading={loadingGestores}
        />
      )}

      {/* Modal Bento de Ajuste de Tienda */}
      <MerchEditModal
        editingSettings={editingSettings}
        setEditingSettings={setEditingSettings}
        handleSaveSettings={handleSaveSettings}
      />
    </div>
  );
};

export default MerchandiseApproval;
