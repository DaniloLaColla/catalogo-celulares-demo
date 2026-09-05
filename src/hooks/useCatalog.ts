import { useState, useEffect, useCallback } from 'react';
import { Product, CategoryType, StoreConfig, Tenant } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { fetchLiveDollarBlue } from '../services/dollarService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { DEFAULT_TENANT } from '../services/tenantService';
import { loadMasterTradeInDevices } from '../services/canjeMasterService';

const DEFAULT_CONFIG: StoreConfig = {
  storeName: 'TestStore',
  logoUrl: '',
  whatsappNumber: '5492984219804',
  adminPin: '1234',
  usdToArsRate: 1355,
  autoDollarUpdate: true,
  dollarSpreadUSD: 0,
  lastDollarFetchTime: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
  canjeMode: 'automatico',
  currencySymbol: '$',
  showArsPrice: true,
  instagramUser: 'teststore.oficial',
  deliveryLocations: [
    'Palermo Soho (Showroom / Punto de Retiro)',
    'Belgrano (Oficina Comercial)',
    'Envíos en el día en moto a CABA y GBA'
  ],
  shippingInfo: 'Envíos a todo el país vía Andreani / Correo Argentino con seguro 100%'
};

// Mapeo de Supabase snake_case a TypeScript Product
function mapDbToProduct(row: any): Product {
  return {
    id: row.id,
    tenantId: row.tenant_id || undefined,
    name: row.name,
    category: row.category,
    brand: row.brand,
    productType: row.product_type,
    priceUSD: Number(row.price_usd),
    originalPriceUSD: row.original_price_usd ? Number(row.original_price_usd) : undefined,
    specs: row.specs || '',
    description: row.description || '',
    image: row.image || '',
    gallery: row.gallery || [],
    storageOptions: row.storage_options || [],
    colorOptions: row.color_options || [],
    batteryPercentage: row.battery_percentage !== null ? Number(row.battery_percentage) : undefined,
    batteryHealth: row.battery_health,
    inStock: Boolean(row.in_stock),
    isFeatured: Boolean(row.is_featured),
    tags: row.tags || [],
    warranty: row.warranty || ''
  };
}

// Mapeo de TypeScript Product a Supabase snake_case
function mapProductToDb(p: Product | Omit<Product, 'id'>, id?: string, tenantId?: string) {
  return {
    id: id || (p as Product).id || `prod-${Date.now()}`,
    tenant_id: (p as any).tenantId || tenantId || DEFAULT_TENANT.id,
    name: p.name,
    category: p.category,
    brand: p.brand,
    product_type: p.productType,
    price_usd: p.priceUSD,
    original_price_usd: p.originalPriceUSD || null,
    specs: p.specs || '',
    description: p.description || '',
    image: p.image || '',
    gallery: p.gallery || [],
    storage_options: p.storageOptions || [],
    color_options: p.colorOptions || [],
    battery_percentage: p.batteryPercentage || null,
    battery_health: p.batteryHealth || null,
    in_stock: p.inStock,
    is_featured: p.isFeatured || false,
    tags: p.tags || [],
    warranty: p.warranty || '',
    updated_at: new Date().toISOString()
  };
}

// Mapeo de Supabase snake_case a StoreConfig
function mapDbToConfig(row: any): StoreConfig {
  return {
    tenantId: row.tenant_id || undefined,
    storeName: row.store_name || DEFAULT_CONFIG.storeName,
    logoUrl: row.logo_url || '',
    whatsappNumber: row.whatsapp_number || DEFAULT_CONFIG.whatsappNumber,
    adminPin: row.admin_pin || DEFAULT_CONFIG.adminPin,
    usdToArsRate: Number(row.usd_to_ars_rate) || DEFAULT_CONFIG.usdToArsRate,
    autoDollarUpdate: row.auto_dollar_update !== undefined ? Boolean(row.auto_dollar_update) : DEFAULT_CONFIG.autoDollarUpdate,
    dollarSpreadUSD: Number(row.dollar_spread_usd) || 0,
    lastDollarFetchTime: row.last_dollar_fetch_time || DEFAULT_CONFIG.lastDollarFetchTime,
    canjeMode: row.canje_mode || DEFAULT_CONFIG.canjeMode,
    canjePricing: row.canje_pricing || undefined,
    currencySymbol: row.currency_symbol || '$',
    showArsPrice: row.show_ars_price !== undefined ? Boolean(row.show_ars_price) : true,
    instagramUser: row.instagram_user || DEFAULT_CONFIG.instagramUser,
    deliveryLocations: row.delivery_locations || DEFAULT_CONFIG.deliveryLocations,
    shippingInfo: row.shipping_info || DEFAULT_CONFIG.shippingInfo,
    heroTagline: row.hero_tagline || undefined,
    heroTitle: row.hero_title || undefined,
    heroSubtitle: row.hero_subtitle || undefined,
    heroWarrantyNew: row.hero_warranty_new || undefined,
    heroWarrantyUsed: row.hero_warranty_used || undefined,
    showHeroCanjeBadge: row.show_hero_canje_badge !== undefined ? Boolean(row.show_hero_canje_badge) : true,
    customSettings: row.custom_settings || {}
  };
}

// Mapeo de StoreConfig a Supabase snake_case
function mapConfigToDb(c: StoreConfig, tenantId?: string, configId?: string) {
  const activeTenantId = c.tenantId || tenantId || DEFAULT_TENANT.id;
  const activeConfigId = configId || (activeTenantId === DEFAULT_TENANT.id ? 'default' : `cfg-${activeTenantId}`);

  return {
    id: activeConfigId,
    tenant_id: activeTenantId,
    store_name: c.storeName,
    logo_url: c.logoUrl || null,
    whatsapp_number: c.whatsappNumber,
    admin_pin: c.adminPin,
    usd_to_ars_rate: c.usdToArsRate,
    auto_dollar_update: c.autoDollarUpdate,
    dollar_spread_usd: c.dollarSpreadUSD || 0,
    last_dollar_fetch_time: c.lastDollarFetchTime || null,
    canje_mode: c.canjeMode,
    canje_pricing: c.canjePricing || null,
    currency_symbol: c.currencySymbol,
    show_ars_price: c.showArsPrice,
    instagram_user: c.instagramUser || null,
    delivery_locations: c.deliveryLocations,
    shipping_info: c.shippingInfo,
    hero_tagline: c.heroTagline || null,
    hero_title: c.heroTitle || null,
    hero_subtitle: c.heroSubtitle || null,
    hero_warranty_new: c.heroWarrantyNew || null,
    hero_warranty_used: c.heroWarrantyUsed || null,
    show_hero_canje_badge: c.showHeroCanjeBadge !== false,
    custom_settings: c.customSettings || {},
    updated_at: new Date().toISOString()
  };
}

export function useCatalog(currentTenant?: Tenant) {
  const activeTenant = currentTenant || DEFAULT_TENANT;
  const activeTenantId = activeTenant.id;
  const isDemo = activeTenant.slug === 'demo';

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [config, setConfig] = useState<StoreConfig>({
    ...DEFAULT_CONFIG,
    storeName: activeTenant.name || DEFAULT_CONFIG.storeName,
    tenantId: activeTenantId
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isUpdatingDollar, setIsUpdatingDollar] = useState(false);
  const [dollarFetchError, setDollarFetchError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'Todos'>('Todos');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'Todos' | 'Sellado' | 'Usado'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // ─── CARGA INICIAL DESDE SUPABASE CLOUD DB ───
  useEffect(() => {
    async function loadCloudData() {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Cargar modelos maestros de canje en segundo plano
        loadMasterTradeInDevices().catch(() => {});

        // 1. Cargar Configuración de Tienda
        let configQuery = supabase.from('store_config').select('*');
        if (isDemo) {
          configQuery = configQuery.eq('id', 'default');
        } else {
          configQuery = configQuery.eq('tenant_id', activeTenantId);
        }
        const { data: configData, error: configError } = await configQuery.maybeSingle();

        if (configData && !configError) {
          setConfig(mapDbToConfig(configData));
        } else if (!configData) {
          // Si no existe configuración previa para esta tienda, crear una inicial
          const initialConfig: StoreConfig = {
            ...DEFAULT_CONFIG,
            storeName: activeTenant.name || DEFAULT_CONFIG.storeName,
            tenantId: activeTenantId
          };
          await supabase.from('store_config').upsert(mapConfigToDb(initialConfig, activeTenantId));
          setConfig(initialConfig);
        }

        // 2. Cargar Productos
        let prodsQuery = supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!isDemo) {
          prodsQuery = prodsQuery.eq('tenant_id', activeTenantId);
        }

        const { data: prodsData, error: prodsError } = await prodsQuery;

        if (prodsData && prodsData.length > 0) {
          setProducts(prodsData.map(mapDbToProduct));
        } else if (!prodsError && (!prodsData || prodsData.length === 0)) {
          if (isDemo) {
            // Si es demo y está vacía, sembrar los iniciales
            const seedPayload = INITIAL_PRODUCTS.map((p) => mapProductToDb(p, undefined, activeTenantId));
            await supabase.from('products').upsert(seedPayload);
            setProducts(INITIAL_PRODUCTS);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.warn('Error al conectar con Supabase Cloud DB:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCloudData();
  }, [activeTenantId, isDemo, activeTenant.name]);

  // ─── SUSCRIPCIÓN EN TIEMPO REAL (REALTIME SYNC) ───
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channelName = `public:realtime_catalog_${activeTenant.slug}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        async () => {
          let q = supabase.from('products').select('*').order('created_at', { ascending: false });
          if (!isDemo) {
            q = q.eq('tenant_id', activeTenantId);
          }
          const { data } = await q;
          if (data) setProducts(data.map(mapDbToProduct));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'store_config' },
        async () => {
          let q = supabase.from('store_config').select('*');
          if (isDemo) {
            q = q.eq('id', 'default');
          } else {
            q = q.eq('tenant_id', activeTenantId);
          }
          const { data } = await q.maybeSingle();
          if (data) setConfig(mapDbToConfig(data));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTenantId, activeTenant.slug, isDemo]);

  // ─── ACTUALIZACIÓN DEL DÓLAR BLUE ───
  const refreshDollarRate = useCallback(async () => {
    setIsUpdatingDollar(true);
    setDollarFetchError(null);
    try {
      const liveData = await fetchLiveDollarBlue();
      const timeStr = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      const spread = config.dollarSpreadUSD || 0;
      const finalVenta = liveData.venta + spread;

      setConfig((prev) => ({
        ...prev,
        usdToArsRate: finalVenta,
        lastDollarFetchTime: timeStr
      }));

      if (isSupabaseConfigured) {
        // Actualizar SOLO las columnas de cotización del dólar en Supabase sin tocar store_name ni otros datos
        let configUpdate = supabase
          .from('store_config')
          .update({
            usd_to_ars_rate: finalVenta,
            last_dollar_fetch_time: timeStr,
            updated_at: new Date().toISOString()
          });

        if (isDemo) {
          configUpdate = configUpdate.eq('id', 'default');
        } else {
          configUpdate = configUpdate.eq('tenant_id', activeTenantId);
        }

        await configUpdate;
      }
    } catch (err) {
      console.warn('Error al actualizar dólar automático:', err);
      setDollarFetchError('No se pudo conectar al servicio de cotizaciones.');
    } finally {
      setIsUpdatingDollar(false);
    }
  }, [config.dollarSpreadUSD, activeTenantId, isDemo]);

  useEffect(() => {
    if (config.autoDollarUpdate) {
      refreshDollarRate();
      const interval = setInterval(() => {
        refreshDollarRate();
      }, 15 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [config.autoDollarUpdate, refreshDollarRate]);

  // ─── FILTROS Y ORDENAMIENTO ───
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchType = selectedTypeFilter === 'Todos' || p.productType === selectedTypeFilter;
    const matchSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStock = !onlyInStock || p.inStock;

    return matchCategory && matchType && matchSearch && matchStock;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
    if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  // ─── MUTACIONES EN LA NUBE (SUPABASE) ───
  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const warranty = newProduct.productType === 'Sellado'
      ? 'Garantía Oficial Apple (1 Año)'
      : '1 Mes de Garantía ante fallas';

    const productWithId: Product = {
      ...newProduct,
      id,
      tenantId: (newProduct as any).tenantId || activeTenantId,
      warranty: newProduct.warranty || warranty
    };

    // Actualización optimista de estado
    setProducts((prev) => [productWithId, ...prev]);

    if (isSupabaseConfigured) {
      await supabase.from('products').insert(mapProductToDb(productWithId, id, activeTenantId));
    }
    return productWithId;
  };

  const updateProduct = async (updated: Product) => {
    const updatedWithTenant: Product = {
      ...updated,
      tenantId: updated.tenantId || activeTenantId
    };
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updatedWithTenant : p)));

    if (isSupabaseConfigured) {
      await supabase
        .from('products')
        .update(mapProductToDb(updatedWithTenant, updated.id, activeTenantId))
        .eq('id', updated.id);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    if (isSupabaseConfigured) {
      await supabase.from('products').delete().eq('id', id);
    }
  };

  const toggleStock = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;

    const newStock = !target.inStock;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: newStock } : p))
    );

    if (isSupabaseConfigured) {
      await supabase
        .from('products')
        .update({ in_stock: newStock, updated_at: new Date().toISOString() })
        .eq('id', id);
    }
  };

  const updateConfig = async (newConfig: StoreConfig) => {
    const configWithTenant = { ...newConfig, tenantId: activeTenantId };
    setConfig(configWithTenant);

    if (isSupabaseConfigured) {
      await supabase.from('store_config').upsert(mapConfigToDb(configWithTenant, activeTenantId));
    }
  };

  const resetToDefault = async () => {
    setProducts(INITIAL_PRODUCTS);
    const initialConfig = { ...DEFAULT_CONFIG, tenantId: activeTenantId };
    setConfig(initialConfig);

    if (isSupabaseConfigured && isDemo) {
      await supabase.from('products').delete().or(`tenant_id.eq.${activeTenantId},tenant_id.is.null`);
      await supabase.from('products').upsert(INITIAL_PRODUCTS.map((p) => mapProductToDb(p, undefined, activeTenantId)));
      await supabase.from('store_config').upsert(mapConfigToDb(initialConfig, activeTenantId));
    }
  };

  return {
    products,
    filteredProducts,
    config,
    setConfig: updateConfig,
    isLoading,
    isUpdatingDollar,
    dollarFetchError,
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
  };
}
