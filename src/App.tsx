import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  FilterX,
  RefreshCw,
  Box,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCatalog } from './hooks/useCatalog';
import { useTenant } from './hooks/useTenant';
import { useWhatsAppCheckout } from './hooks/useWhatsAppCheckout';
import { Product, CategoryType } from './types';

// Componentes
import { LiquidBackground } from './components/layout/LiquidBackground';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { FloatingWhatsAppButton } from './components/layout/FloatingWhatsAppButton';
import { CategoryChips } from './components/catalog/CategoryChips';
import { SearchFilterBar } from './components/catalog/SearchFilterBar';
import { ProductCard } from './components/catalog/ProductCard';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { CanjeCalculatorModal } from './components/canje/CanjeCalculatorModal';
import { AdminDrawer } from './components/admin/AdminDrawer';

const CATEGORIES: CategoryType[] = [
  'iPhone',
  'Mac',
  'Notebook',
  'iPad',
  'Apple Watch',
  'Accesorios',
  'Android',
  'Consolas',
  'Parlantes'
];

export function App() {
  const { tenant } = useTenant();

  const {
    products,
    filteredProducts,
    config,
    setConfig,
    isUpdatingDollar,
    refreshDollarRate,
    selectedCategory,
    setSelectedCategory,
    selectedTypeFilter,
    setSelectedTypeFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    onlyInStock,
    setOnlyInStock,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    resetToDefault
  } = useCatalog(tenant);

  const { buyDirectProduct, buyWithPlanCanje, consultGeneralCanje } = useWhatsAppCheckout(config);

  // Estados de Modales y Vistas
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [selectedProductForCanje, setSelectedProductForCanje] = useState<Product | null>(null);
  const [isCanjeOpen, setIsCanjeOpen] = useState(false);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentMobileTab, setCurrentMobileTab] = useState<'catalog' | 'canje'>('catalog');

  // Paginación del Catálogo Principal
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 12;

  // Resetear a la primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTypeFilter, searchQuery, sortBy, onlyInStock]);

  const totalProductsCount = filteredProducts.length;
  const totalPages = Math.ceil(totalProductsCount / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    document.getElementById('catalog-products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sincronización dinámica de título de pestaña del navegador y favicon según la configuración de la tienda
  useEffect(() => {
    document.title = `${config.storeName} | Catálogo Apple & High-Tech`;
    
    const faviconLink = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (faviconLink) {
      if (config.logoUrl) {
        faviconLink.href = config.logoUrl;
      } else {
        faviconLink.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 170 170%22 fill=%22white%22><path d=%22M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.6-7.85-11.71-14.3-5-7.79-8.98-16.63-11.96-26.52-2.97-9.89-4.46-19.34-4.46-28.36 0-13.48 3.51-24.62 10.53-33.43 7.02-8.81 15.82-13.33 26.4-13.56 5.33 0 11.04 1.34 17.13 4.02 6.09 2.68 10.15 4.08 12.18 4.08 1.63 0 5.86-1.42 12.7-4.26 6.84-2.84 12.51-4.04 17.01-3.6 12.61.99 22.49 5.82 29.64 14.5-11.19 6.78-16.67 15.87-16.44 27.27.23 8.91 3.59 16.35 10.08 22.32 6.49 5.97 14.19 9.38 23.09 10.23-1.96 5.88-4.32 11.77-7.09 17.68zM119.22 33.55c0-6.73 2.45-13.06 7.35-18.99 4.9-5.93 10.96-9.67 18.18-11.23.11 1.09.16 2.06.16 2.92 0 6.62-2.56 13.06-7.68 19.33-5.12 6.27-11.27 9.87-18.45 10.8-.44-.94-.66-1.9-.66-2.83z%22/></svg>";
      }
    }
  }, [config.storeName, config.logoUrl]);

  const handleOpenDetail = (product: Product) => {
    setSelectedProductForDetail(product);
    setIsDetailOpen(true);
  };

  const handleOpenCanje = (targetProduct: Product | null = null) => {
    setSelectedProductForCanje(targetProduct);
    setIsCanjeOpen(true);
    setCurrentMobileTab('canje');
  };

  const handleQuickBuy = (product: Product) => {
    buyDirectProduct(product);
  };

  const handleSelectMobileTab = (tab: 'catalog' | 'canje') => {
    setCurrentMobileTab(tab);
    if (tab === 'canje') {
      setIsCanjeOpen(true);
    } else if (tab === 'catalog') {
      setIsDetailOpen(false);
      setIsCanjeOpen(false);
      setIsAdminOpen(false);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative min-h-screen pb-24 sm:pb-12 text-slate-100 flex flex-col justify-between">
      {/* Fondo Liquid Glass / Leather Luxury */}
      <LiquidBackground 
        bgTexture={config.customSettings?.bgTexture}
        aesthetic={config.customSettings?.aesthetic}
      />

      {/* Cabecera Principal */}
      <Navbar
        config={config}
        isUpdatingDollar={isUpdatingDollar}
        onRefreshDollar={refreshDollarRate}
        onOpenCanje={() => handleOpenCanje(null)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        totalProductsCount={products.length}
      />

      <main className="max-w-7xl mx-auto w-full px-2 sm:px-6 flex-1">
        {/* ─── HERO BANNER ─── */}
        {config.customSettings?.aesthetic === 'leather-luxury' ? (
          <section className="px-4 pt-6 sm:pt-9 pb-2 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-zinc-300 text-[11px] font-bold tracking-wide uppercase mb-3">
              <Sparkles size={12} className="text-white" />
              <span>{config.heroTagline || 'Villa Regina, Río Negro'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {config.heroTitle || 'Tecnología Apple'}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 max-w-xl mx-auto leading-relaxed">
              {config.heroSubtitle || 'Equipos Nuevos Sellados y Usados Seleccionados con Garantía y Plan Canje'}
            </p>

            {/* Badges de Confianza */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 text-[11px] sm:text-xs font-semibold text-zinc-300">
              <div className="flex items-center gap-1.5 text-zinc-200">
                <Box size={14} className="text-white" />
                <span>{config.heroWarrantyNew || 'Sellados: Gtía Apple 1 Año'}</span>
              </div>
              <span className="text-zinc-600 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <ShieldCheck size={14} />
                <span>{config.heroWarrantyUsed || 'Usados Seleccionados'}</span>
              </div>
              {config.showHeroCanjeBadge !== false && (
                <>
                  <span className="text-zinc-600 hidden sm:inline">·</span>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <RefreshCw size={14} className="animate-spin-slow" />
                    <span>Plan Canje Inmediato</span>
                  </div>
                </>
              )}
            </div>
          </section>
        ) : (
          <section className="px-3 pt-4 sm:pt-6 pb-2">
            <div className="relative rounded-3xl p-5 sm:p-8 liquid-glass-elevated border border-white/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-zinc-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200 text-[11px] font-bold tracking-wide uppercase mb-3">
                  <Sparkles size={13} className="text-white" />
                  <span>{config.heroTagline || `Catálogo Oficial · ${config.storeName}`}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  {config.heroTitle || (
                    <>
                      Tecnología Sellada y Usados Seleccionados, <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-zinc-400">
                        con Garantía Real.
                      </span>
                    </>
                  )}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                  {config.heroSubtitle || (
                    <>
                      Equipos <strong className="text-white">Sellados con Garantía Oficial Apple (1 Año)</strong> y <strong className="text-purple-300">Usados Seleccionados con 1 Mes de Garantía</strong>. Precios en ARS sincronizados en tiempo real con el <strong className="text-emerald-400">Dólar Blue Venta</strong>.
                    </>
                  )}
                </p>

                {/* Badges de Confianza */}
                <div className="flex flex-wrap gap-2.5 sm:gap-4 mt-4 pt-3 border-t border-white/10 text-[11px] sm:text-xs font-semibold text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Box size={14} />
                    <span>{config.heroWarrantyNew || 'Sellados: Gtía Apple 1 Año'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-300">
                    <ShieldCheck size={14} />
                    <span>{config.heroWarrantyUsed || 'Usados: 1 Mes Gtía'}</span>
                  </div>
                  {config.showHeroCanjeBadge !== false && (
                    <div className="flex items-center gap-1.5 text-emerald-300">
                      <RefreshCw size={14} className="animate-spin-slow" />
                      <span>Plan Canje Disponible</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── NAVEGACIÓN DE CATEGORÍAS ─── */}
        <section className="mt-2">
          <CategoryChips
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            products={products}
            aesthetic={config.customSettings?.aesthetic}
          />
        </section>

        {/* ─── BARRA DE BÚSQUEDA Y FILTROS ─── */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTypeFilter={selectedTypeFilter}
          onSelectTypeFilter={setSelectedTypeFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onlyInStock={onlyInStock}
          onToggleOnlyInStock={() => setOnlyInStock(!onlyInStock)}
          totalResults={filteredProducts.length}
          aesthetic={config.customSettings?.aesthetic}
        />

        {/* ─── GRID DE PRODUCTOS ─── */}
        <section id="catalog-products-section" className="px-3 sm:px-6 my-4 scroll-mt-24">
          {paginatedProducts.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    config={config}
                    onOpenDetail={handleOpenDetail}
                    onOpenCanje={(prod) => handleOpenCanje(prod)}
                    onQuickBuy={handleQuickBuy}
                  />
                ))}
              </div>

              {/* Controles de Paginación */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl liquid-glass border border-white/15">
                  <span className="text-xs font-bold text-slate-300">
                    Mostrando <strong className="text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> - <strong className="text-white">{Math.min(currentPage * ITEMS_PER_PAGE, totalProductsCount)}</strong> de <strong className="text-white">{totalProductsCount}</strong> equipos
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 py-2 px-3.5 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-white border border-white/10 transition-all active:scale-95"
                    >
                      <ChevronLeft size={16} />
                      <span className="hidden xs:inline">Anterior</span>
                    </button>

                    <div className="flex items-center gap-1 px-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                            currentPage === pageNum
                              ? 'bg-white text-black shadow-lg scale-105'
                              : 'text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 py-2 px-3.5 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-white border border-white/10 transition-all active:scale-95"
                    >
                      <span className="hidden xs:inline">Siguiente</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center rounded-3xl liquid-glass p-8 border border-white/10 my-6 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-3">
                <FilterX size={26} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No encontramos productos</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                No hay resultados con los filtros actuales en {config.storeName}.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todos');
                  setSelectedTypeFilter('Todos');
                  setOnlyInStock(false);
                }}
                className="btn-liquid-cyan py-2.5 px-5 rounded-xl text-xs font-bold text-black"
              >
                Restablecer filtros
              </button>
            </div>
          )}
        </section>
      </main>

      {/* ─── MODALES ─── */}
      <ProductDetailModal
        product={selectedProductForDetail}
        config={config}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenCanje={(prod) => {
          setIsDetailOpen(false);
          handleOpenCanje(prod);
        }}
        onBuyWhatsApp={(prod, storage, color) => {
          buyDirectProduct(prod, storage, color);
          setIsDetailOpen(false);
        }}
      />

      <CanjeCalculatorModal
        isOpen={isCanjeOpen}
        onClose={() => {
          setIsCanjeOpen(false);
          setCurrentMobileTab('catalog');
        }}
        targetProduct={selectedProductForCanje}
        allProducts={products}
        config={config}
        onCanjeWhatsApp={(evaluation, target, tradeInState) => {
          buyWithPlanCanje(evaluation, target, tradeInState);
          setIsCanjeOpen(false);
        }}
        onConsultGeneralCanje={(evaluation, tradeInState) => {
          consultGeneralCanje(evaluation, tradeInState);
          setIsCanjeOpen(false);
        }}
      />

      <AdminDrawer
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setCurrentMobileTab('catalog');
        }}
        products={products}
        config={config}
        isUpdatingDollar={isUpdatingDollar}
        onRefreshDollar={refreshDollarRate}
        onUpdateConfig={setConfig}
        onAddProduct={addProduct}
        onUpdateProduct={updateProduct}
        onDeleteProduct={deleteProduct}
        onToggleStock={toggleStock}
        onResetCatalog={resetToDefault}
      />

      <BottomNav
        currentTab={currentMobileTab}
        onSelectTab={handleSelectMobileTab}
        config={config}
      />

      <FloatingWhatsAppButton config={config} />

      <footer className="w-full py-6 px-4 text-center border-t border-white/5 text-slate-500 text-xs mt-8">
        <p className="font-semibold text-slate-400">
          © {new Date().getFullYear()} {config.storeName} · Todos los derechos reservados.
        </p>
        <p className="text-[11px] text-slate-600 mt-1">
          Equipos Sellados con Garantía Oficial Apple · Equipos Usados con 1 mes de garantía por fallas técnicas.
        </p>
      </footer>
    </div>
  );
}
export default App;
