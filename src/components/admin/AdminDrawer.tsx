import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Trash2, 
  Settings, 
  Lock, 
  DollarSign, 
  Phone, 
  RefreshCw, 
  Download, 
  Box, 
  BatteryCharging, 
  Bot, 
  MapPin, 
  Image as ImageIcon, 
  Truck, 
  Upload, 
  Camera, 
  MessageSquare, 
  Calculator, 
  Star, 
  HardDrive, 
  Palette, 
  Check, 
  Sparkles, 
  Link2, 
  AlertCircle, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  Monitor, 
  Tablet, 
  Watch, 
  Headphones, 
  Gamepad2, 
  Volume2,
  BookmarkPlus,
  Pencil,
  Tag,
  Search,
  Sliders,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  KeyRound,
  Save,
  Type,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Product, StoreConfig, CategoryType, ProductColor, SupportedTradeInDevice, ConditionPenalties, QuotationLead } from '../../types';
import { AppleLogo } from '../ui/AppleLogo';
import { getQuotationsByTenant } from '../../services/quotationService';
import { DEFAULT_TENANT } from '../../services/tenantService';
import { scrapePhotosFromLink } from '../../services/socialScraperService';
import { SUPPORTED_TRADE_IN_DEVICES, DEFAULT_CONDITION_PENALTIES } from '../../data/canjeValuation';

const STORAGE_KEY_CUSTOM_PRESETS = 'nexus_tech_custom_presets_v3';

interface CustomPresetsState {
  storageByCategory: Partial<Record<CategoryType, string[]>>;
  colorsByCategory: Partial<Record<CategoryType, ProductColor[]>>;
  modelsByCategory: Partial<Record<CategoryType, string[]>>;
}

const CATEGORY_ITEMS: { id: CategoryType; label: string; icon: React.ReactNode; colorClass: string }[] = [
  { id: 'iPhone', label: 'iPhone', icon: <Smartphone size={16} />, colorClass: 'text-cyan-400 border-cyan-400/40' },
  { id: 'Mac', label: 'Mac', icon: <Monitor size={16} />, colorClass: 'text-purple-400 border-purple-400/40' },
  { id: 'Notebook', label: 'Notebook', icon: <Laptop size={16} />, colorClass: 'text-blue-400 border-blue-400/40' },
  { id: 'iPad', label: 'iPad', icon: <Tablet size={16} />, colorClass: 'text-pink-400 border-pink-400/40' },
  { id: 'Apple Watch', label: 'Apple Watch', icon: <Watch size={16} />, colorClass: 'text-emerald-400 border-emerald-400/40' },
  { id: 'Consolas', label: 'Consolas', icon: <Gamepad2 size={16} />, colorClass: 'text-indigo-400 border-indigo-400/40' },
  { id: 'Parlantes', label: 'Parlantes', icon: <Volume2 size={16} />, colorClass: 'text-orange-400 border-orange-400/40' },
  { id: 'Accesorios', label: 'Accesorios', icon: <Headphones size={16} />, colorClass: 'text-amber-400 border-amber-400/40' },
  { id: 'Android', label: 'Android', icon: <Sparkles size={16} />, colorClass: 'text-green-400 border-green-400/40' }
];

const BASE_MODEL_PRESETS: Record<CategoryType, string[]> = {
  'iPhone': [
    'iPhone 17 Pro Max',
    'iPhone 17 Pro',
    'iPhone 17 Air',
    'iPhone 17',
    'iPhone 16 Pro Max',
    'iPhone 16 Pro',
    'iPhone 16 Plus',
    'iPhone 16',
    'iPhone 15 Pro Max',
    'iPhone 15 Pro',
    'iPhone 15 Plus',
    'iPhone 15',
    'iPhone 14 Pro Max',
    'iPhone 14 Pro',
    'iPhone 14',
    'iPhone 13 Pro Max',
    'iPhone 13 Pro',
    'iPhone 13',
    'iPhone 12 Pro Max',
    'iPhone 12',
    'iPhone 11'
  ],
  'Mac': [
    'MacBook Pro 16" M3 Max',
    'MacBook Pro 14" M3 Pro',
    'MacBook Pro 14" M3',
    'MacBook Air 15" M3',
    'MacBook Air 13" M3',
    'MacBook Air 13" M2',
    'Mac mini M2 Pro',
    'Mac mini M2',
    'iMac 24" M3'
  ],
  'Notebook': [
    'Dell XPS 13 OLED',
    'Dell Inspiron 15',
    'Lenovo ThinkPad X1 Carbon',
    'Lenovo Legion Pro 5',
    'ASUS ROG Zephyrus G14',
    'HP Spectre x360'
  ],
  'iPad': [
    'iPad Pro 13" (M4)',
    'iPad Pro 11" (M4)',
    'iPad Air 13" (M2)',
    'iPad Air 11" (M2)',
    'iPad 10ma Gen (10.9")',
    'iPad 9na Gen (10.2")',
    'iPad mini 6 (8.3")'
  ],
  'Apple Watch': [
    'Apple Watch Ultra 2 (49mm)',
    'Apple Watch Series 10 (46mm)',
    'Apple Watch Series 10 (42mm)',
    'Apple Watch Series 9 (45mm)',
    'Apple Watch Series 9 (41mm)',
    'Apple Watch SE 2 (44mm)',
    'Apple Watch SE 2 (40mm)'
  ],
  'Consolas': [
    'PlayStation 5 Pro',
    'PlayStation 5 Slim (Con Disco)',
    'PlayStation 5 Slim (Digital)',
    'PlayStation 4 Pro',
    'Xbox Series X 1TB',
    'Xbox Series S 512GB',
    'Nintendo Switch OLED',
    'Nintendo Switch V2',
    'Meta Quest 3'
  ],
  'Parlantes': [
    'JBL Flip 6',
    'JBL Charge 5',
    'JBL Xtreme 4',
    'JBL Boombox 3',
    'JBL PartyBox 110',
    'JBL PartyBox 310',
    'Marshall Emberton II',
    'Marshall Stanmore III',
    'Apple HomePod (2da Gen)',
    'Apple HomePod mini'
  ],
  'Accesorios': [
    'AirPods Pro (2da Gen USB-C)',
    'AirPods 4 con ANC',
    'AirPods 4',
    'AirPods Max (USB-C)',
    'Cargador Apple 20W USB-C',
    'Cargador Apple 35W Dual USB-C',
    'Cable Apple USB-C a USB-C',
    'Apple Pencil Pro',
    'Apple Pencil (USB-C)',
    'Magic Keyboard iPad Pro',
    'Funda Silicone Case MagSafe',
    'Batería MagSafe Battery Pack'
  ],
  'Android': [
    'Samsung Galaxy S24 Ultra',
    'Samsung Galaxy S24+',
    'Samsung Galaxy S24',
    'Samsung Galaxy S23 Ultra',
    'Samsung Galaxy Z Fold 6',
    'Samsung Galaxy Z Flip 6',
    'Xiaomi 14 Ultra',
    'Google Pixel 9 Pro'
  ]
};

const BASE_STORAGE_PRESETS: Record<CategoryType, string[]> = {
  'iPhone': ['64GB', '128GB', '256GB', '512GB', '1TB'],
  'Mac': ['8GB / 256GB SSD', '16GB / 512GB SSD', '18GB / 512GB SSD', '36GB / 1TB SSD', '48GB / 1TB SSD', '64GB / 2TB SSD'],
  'Notebook': ['8GB / 256GB SSD', '16GB / 512GB SSD', '16GB / 1TB SSD', '32GB / 1TB SSD'],
  'iPad': ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'],
  'Apple Watch': ['40mm', '41mm', '42mm', '44mm', '45mm', '46mm', '49mm (Ultra)'],
  'Consolas': ['512GB SSD', '825GB SSD', '1TB SSD', '2TB SSD'],
  'Parlantes': ['Estándar'],
  'Accesorios': ['Estándar', 'Original'],
  'Android': ['128GB', '256GB', '512GB', '1TB']
};

const BASE_COLOR_PRESETS: Record<CategoryType, ProductColor[]> = {
  'iPhone': [
    { name: 'Titanio Natural', hex: '#9E9893' },
    { name: 'Titanio Negro', hex: '#3C3B37' },
    { name: 'Titanio Blanco', hex: '#E4E3DF' },
    { name: 'Titanio Desierto', hex: '#C5B5A2' },
    { name: 'Negro Espacial', hex: '#2C2B30' },
    { name: 'Plata', hex: '#E2E4E5' },
    { name: 'Azul Medianoche', hex: '#1F2937' },
    { name: 'Starlight (Blanco Estrella)', hex: '#FAF7F2' },
    { name: 'Oro', hex: '#F4E8CE' },
    { name: 'Púrpura Intenso', hex: '#6B5B95' },
    { name: 'Verde Alpino', hex: '#384C38' },
    { name: 'Rosa', hex: '#E8C1C5' },
    { name: 'Product(RED)', hex: '#D9383A' }
  ],
  'Mac': [
    { name: 'Gris Espacial', hex: '#5A5B5D' },
    { name: 'Plata', hex: '#E2E4E5' },
    { name: 'Medianoche', hex: '#1F2937' },
    { name: 'Blanco Estrella', hex: '#FAF7F2' },
    { name: 'Negro Espacial', hex: '#2C2B30' }
  ],
  'Notebook': [
    { name: 'Negro', hex: '#222222' },
    { name: 'Gris Grafito', hex: '#4A4A4A' },
    { name: 'Plata', hex: '#E2E4E5' },
    { name: 'Azul', hex: '#2B4C7E' }
  ],
  'iPad': [
    { name: 'Gris Espacial', hex: '#5A5B5D' },
    { name: 'Plata', hex: '#E2E4E5' },
    { name: 'Blanco Estrella', hex: '#FAF7F2' },
    { name: 'Azul', hex: '#7BA4C4' },
    { name: 'Púrpura', hex: '#B8A9C9' },
    { name: 'Rosa', hex: '#E8C1C5' }
  ],
  'Apple Watch': [
    { name: 'Titanio Natural', hex: '#9E9893' },
    { name: 'Titanio Negro', hex: '#3C3B37' },
    { name: 'Aluminio Medianoche', hex: '#1F2937' },
    { name: 'Aluminio Blanco Estrella', hex: '#FAF7F2' },
    { name: 'Aluminio Plata', hex: '#E2E4E5' }
  ],
  'Consolas': [
    { name: 'Blanco / Negro (Original)', hex: '#E4E4E4' },
    { name: 'Negro Mate', hex: '#1A1A1A' },
    { name: 'Edición Especial', hex: '#7C3AED' }
  ],
  'Parlantes': [
    { name: 'Negro', hex: '#1A1A1A' },
    { name: 'Azul', hex: '#1E40AF' },
    { name: 'Rojo', hex: '#DC2626' },
    { name: 'Camuflado / Militar', hex: '#4D5340' },
    { name: 'Gris / Plata', hex: '#9CA3AF' }
  ],
  'Accesorios': [
    { name: 'Blanco', hex: '#FFFFFF' },
    { name: 'Negro', hex: '#1A1A1A' },
    { name: 'Transparente (MagSafe)', hex: '#D1D5DB' }
  ],
  'Android': [
    { name: 'Titanium Gray', hex: '#7D7E80' },
    { name: 'Titanium Black', hex: '#2B2B2B' },
    { name: 'Titanium Violet', hex: '#5B4B6E' },
    { name: 'Titanium Yellow', hex: '#F3E5AB' }
  ]
};

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  config: StoreConfig;
  isUpdatingDollar?: boolean;
  onRefreshDollar?: () => void;
  onUpdateConfig: (newConfig: StoreConfig) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onToggleStock: (id: string) => void;
  onResetCatalog: () => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  products,
  config,
  isUpdatingDollar = false,
  onRefreshDollar,
  onUpdateConfig,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleStock,
  onResetCatalog
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'products' | 'config' | 'leads' | 'bot'>('products');
  const [leads, setLeads] = useState<QuotationLead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  const loadLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const activeTenantId = config.tenantId || DEFAULT_TENANT.id;
      const data = await getQuotationsByTenant(activeTenantId);
      setLeads(data);
    } catch (e) {
      console.warn('Error cargando leads:', e);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'leads' && isAuthenticated) {
      loadLeads();
    }
  }, [activeTab, isAuthenticated, config.tenantId]);

  // Métricas calculadas para la pestaña de Cotizaciones / Leads CRM
  const leadMetrics = useMemo(() => {
    const total = leads.length;
    const sent = leads.filter((l) => l.status === 'whatsapp_sent').length;
    const conversion = total > 0 ? Math.round((sent / total) * 100) : 0;

    const modelStats = leads.reduce((acc: Record<string, number>, lead) => {
      if (lead.tradeInModel) {
        acc[lead.tradeInModel] = (acc[lead.tradeInModel] || 0) + 1;
      }
      return acc;
    }, {});

    const sortedModels = Object.entries(modelStats).sort((a, b) => b[1] - a[1]);
    const topModelName = sortedModels.length > 0 ? sortedModels[0][0] : 'Sin datos';
    const topModelCount = sortedModels.length > 0 ? sortedModels[0][1] : 0;
    const topModelPercentage = total > 0 && topModelCount > 0 ? Math.round((topModelCount / total) * 100) : 0;

    return {
      total,
      sent,
      conversion,
      topModelName,
      topModelCount,
      topModelPercentage
    };
  }, [leads]);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const drawerContainerRef = useRef<HTMLDivElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const prodFileInputRef = useRef<HTMLInputElement>(null);

  const [newLocationInput, setNewLocationInput] = useState('');
  
  // Custom Model State & Scope
  const [customModelInput, setCustomModelInput] = useState('');
  const [modelScope, setModelScope] = useState<'product' | 'category'>('category');

  // Custom Storage State & Scope
  const [customStorageInput, setCustomStorageInput] = useState('');
  const [storageScope, setStorageScope] = useState<'product' | 'category'>('category');

  // Custom Color State & Scope
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#6366F1');
  const [colorScope, setColorScope] = useState<'product' | 'category'>('category');

  // ─── ESTADO LOCAL BORRADOR DE CONFIGURACIÓN (TAB 2) ───
  const [draftConfig, setDraftConfig] = useState<StoreConfig>(config);
  const [isPinConfirmModalOpen, setIsPinConfirmModalOpen] = useState(false);
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [confirmPinError, setConfirmPinError] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Estados para cambio de PIN con reconfirmación
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState('');
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);
  const [pinChangeSuccess, setPinChangeSuccess] = useState<string | null>(null);

  // Sincronizar draftConfig cuando cambie config externamente
  useEffect(() => {
    setDraftConfig(config);
  }, [config]);

  // Estados para Administrar Precios y Deducciones de Canje
  const [canjeSearchQuery, setCanjeSearchQuery] = useState('');
  const [isEditingPenaltiesOpen, setIsEditingPenaltiesOpen] = useState(false);
  const [isAddingTradeInDevice, setIsAddingTradeInDevice] = useState(false);
  const [newTradeInBrand, setNewTradeInBrand] = useState('Apple');
  const [newTradeInModel, setNewTradeInModel] = useState('');
  const [newTradeInStorage, setNewTradeInStorage] = useState('128GB');
  const [newTradeInPrice, setNewTradeInPrice] = useState(500);

  // Estados de Filtros y Búsqueda en Lista de Productos del Admin
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<CategoryType | 'Todos'>('Todos');
  const [adminTypeFilter, setAdminTypeFilter] = useState<'Todos' | 'Sellado' | 'Usado'>('Todos');
  const [adminStockFilter, setAdminStockFilter] = useState<'Todos' | 'inStock' | 'paused'>('Todos');

  // Lista de Productos Filtrada en Admin
  const adminFilteredProducts = products.filter((p) => {
    const matchCategory = adminCategoryFilter === 'Todos' || p.category === adminCategoryFilter;
    const matchType = adminTypeFilter === 'Todos' || p.productType === adminTypeFilter;
    const matchStock = 
      adminStockFilter === 'Todos' ||
      (adminStockFilter === 'inStock' && p.inStock) ||
      (adminStockFilter === 'paused' && !p.inStock);
    const query = adminSearchQuery.trim().toLowerCase();
    const matchSearch = 
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.specs.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.storageOptions?.some((s) => s.toLowerCase().includes(query)) ||
      p.colorOptions?.some((c) => c.name.toLowerCase().includes(query));

    return matchCategory && matchType && matchStock && matchSearch;
  });

  // Paginación de Lista de Inventario en Admin
  const [adminCurrentPage, setAdminCurrentPage] = useState<number>(1);
  const ADMIN_ITEMS_PER_PAGE = 8;

  // Resetear a pág 1 al cambiar filtros de admin
  useEffect(() => {
    setAdminCurrentPage(1);
  }, [adminSearchQuery, adminCategoryFilter, adminTypeFilter, adminStockFilter]);

  const adminTotalPages = Math.ceil(adminFilteredProducts.length / ADMIN_ITEMS_PER_PAGE) || 1;
  const paginatedAdminProducts = adminFilteredProducts.slice(
    (adminCurrentPage - 1) * ADMIN_ITEMS_PER_PAGE,
    adminCurrentPage * ADMIN_ITEMS_PER_PAGE
  );

  // Presets guardados permanentemente por categoría
  const [customPresets, setCustomPresets] = useState<CustomPresetsState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_PRESETS);
      return saved ? JSON.parse(saved) : { storageByCategory: {}, colorsByCategory: {}, modelsByCategory: {} };
    } catch {
      return { storageByCategory: {}, colorsByCategory: {}, modelsByCategory: {} };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_PRESETS, JSON.stringify(customPresets));
    } catch (e) {
      console.warn('Error guardando presets:', e);
    }
  }, [customPresets]);

  // Extracción de fotos desde link
  const [socialLinkInput, setSocialLinkInput] = useState('');
  const [isExtractingPhoto, setIsExtractingPhoto] = useState(false);
  const [extractSuccessMsg, setExtractSuccessMsg] = useState<string | null>(null);
  const [extractErrorMsg, setExtractErrorMsg] = useState<string | null>(null);

  // Estado del producto en el formulario
  const [newProd, setNewProd] = useState<Omit<Product, 'id'>>({
    name: 'iPhone 17 Pro Max',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 850,
    specs: '',
    description: '',
    image: '',
    gallery: [],
    storageOptions: ['128GB', '256GB'],
    colorOptions: [
      { name: 'Titanio Natural', hex: '#9E9893' },
      { name: 'Titanio Negro', hex: '#3C3B37' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado de Fábrica',
    inStock: true,
    tags: ['Nuevo'],
    warranty: 'Garantía Oficial Apple (1 Año)'
  });

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === config.adminPin) {
      setIsAuthenticated(true);
      setPinError(false);
      setEnteredPin('');
    } else {
      setPinError(true);
    }
  };

  /**
   * Confirma y aplica los cambios de configuración tras validar el PIN
   */
  const handleConfirmSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmPinInput === config.adminPin) {
      onUpdateConfig(draftConfig);
      setIsPinConfirmModalOpen(false);
      setConfirmPinInput('');
      setConfirmPinError(false);
      setSaveSuccessMsg('✨ Cambios en Canje, Logo y Dólar guardados exitosamente');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } else {
      setConfirmPinError(true);
    }
  };

  /**
   * Carga los datos de un producto existente para editarlo
   */
  const handleStartEdit = (p: Product) => {
    setEditingProductId(p.id);
    setIsAddingProduct(true);

    const isUsado = p.productType === 'Usado';
    const loadedColors = p.colorOptions && p.colorOptions.length > 0 
      ? p.colorOptions 
      : [{ name: 'Titanio Natural', hex: '#9E9893' }];

    setNewProd({
      name: p.name,
      category: p.category,
      brand: p.brand,
      productType: p.productType,
      priceUSD: p.priceUSD,
      originalPriceUSD: p.originalPriceUSD,
      specs: p.specs,
      description: p.description,
      image: p.image,
      gallery: p.gallery && p.gallery.length > 0 ? p.gallery : [p.image],
      storageOptions: p.storageOptions && p.storageOptions.length > 0 ? p.storageOptions : ['128GB'],
      colorOptions: loadedColors,
      batteryPercentage: p.batteryPercentage || 90,
      batteryHealth: p.batteryHealth || (isUsado ? '89% Original' : 'Sellado de Fábrica'),
      inStock: p.inStock,
      tags: p.tags || ['Nuevo'],
      warranty: p.warranty || (isUsado ? '1 Mes de Garantía ante fallas' : 'Garantía Oficial Apple (1 Año)')
    });

    setExtractSuccessMsg(null);
    setExtractErrorMsg(null);

    drawerContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setIsAddingProduct(false);
    setEditingProductId(null);
    setExtractSuccessMsg(null);
    setExtractErrorMsg(null);
    
    setNewProd({
      name: 'iPhone 17 Pro Max',
      category: 'iPhone',
      brand: 'Apple',
      productType: 'Sellado',
      priceUSD: 850,
      specs: '',
      description: '',
      image: '',
      gallery: [],
      storageOptions: ['128GB', '256GB'],
      colorOptions: [
        { name: 'Titanio Natural', hex: '#9E9893' },
        { name: 'Titanio Negro', hex: '#3C3B37' }
      ],
      batteryPercentage: 100,
      batteryHealth: 'Sellado de Fábrica',
      inStock: true,
      tags: ['Nuevo'],
      warranty: 'Garantía Oficial Apple (1 Año)'
    });
  };

  const handleSelectCategory = (cat: CategoryType) => {
    const baseModels = BASE_MODEL_PRESETS[cat] || [];
    const savedCustomModels = customPresets.modelsByCategory?.[cat] || [];
    const allModels = [...baseModels, ...savedCustomModels];
    const defaultModel = allModels.length > 0 ? allModels[0] : '';

    const baseStorage = BASE_STORAGE_PRESETS[cat] || ['Estándar'];
    const savedCustomStorage = customPresets.storageByCategory[cat] || [];
    const allStorage = Array.from(new Set([...baseStorage, ...savedCustomStorage]));

    const baseColors = BASE_COLOR_PRESETS[cat] || [{ name: 'Estándar', hex: '#888888' }];
    const savedCustomColors = customPresets.colorsByCategory[cat] || [];
    const allColors = [...baseColors, ...savedCustomColors];

    let defaultBrand: Product['brand'] = 'Apple';
    if (cat === 'Consolas') defaultBrand = 'Sony';
    else if (cat === 'Parlantes') defaultBrand = 'JBL';
    else if (cat === 'Android') defaultBrand = 'Samsung';
    else if (cat === 'Notebook') defaultBrand = 'Dell';

    setNewProd((prev) => ({
      ...prev,
      category: cat,
      name: defaultModel,
      brand: defaultBrand,
      storageOptions: allStorage.slice(0, 2),
      colorOptions: allColors.slice(0, 2),
      warranty: prev.productType === 'Sellado'
        ? (cat === 'iPhone' || cat === 'Mac' || cat === 'iPad' || cat === 'Apple Watch' ? 'Garantía Oficial Apple (1 Año)' : 'Garantía Oficial de Fábrica (1 Año)')
        : '1 Mes de Garantía ante fallas'
    }));
  };

  const handleAddCustomModel = () => {
    if (!customModelInput.trim()) return;
    const val = customModelInput.trim();

    setNewProd({ ...newProd, name: val });

    if (modelScope === 'category') {
      setCustomPresets((prev) => {
        const currentForCat = prev.modelsByCategory?.[newProd.category] || [];
        if (!currentForCat.some((m) => m.toLowerCase() === val.toLowerCase())) {
          return {
            ...prev,
            modelsByCategory: {
              ...(prev.modelsByCategory || {}),
              [newProd.category]: [...currentForCat, val]
            }
          };
        }
        return prev;
      });
    }

    setCustomModelInput('');
  };

  const handleExtractPhotosFromLink = async () => {
    if (!socialLinkInput.trim()) return;

    setIsExtractingPhoto(true);
    setExtractSuccessMsg(null);
    setExtractErrorMsg(null);

    try {
      const extractedImages = await scrapePhotosFromLink(socialLinkInput);

      setNewProd((prev) => {
        const mergedGallery = Array.from(new Set([...(prev.gallery || []), ...extractedImages]));
        const cover = prev.image ? prev.image : mergedGallery[0];
        return {
          ...prev,
          image: cover,
          gallery: mergedGallery
        };
      });

      setExtractSuccessMsg(`✨ ¡${extractedImages.length === 1 ? 'Foto extraída' : `${extractedImages.length} fotos extraídas`} con éxito!`);
      setSocialLinkInput('');
    } catch (err: any) {
      setExtractErrorMsg(err.message || 'No se pudo extraer la foto de este enlace.');
    } finally {
      setIsExtractingPhoto(false);
    }
  };

  const handleToggleStorage = (storage: string) => {
    const current = newProd.storageOptions || [];
    if (current.includes(storage)) {
      if (current.length === 1) return;
      setNewProd({ ...newProd, storageOptions: current.filter((s) => s !== storage) });
    } else {
      setNewProd({ ...newProd, storageOptions: [...current, storage] });
    }
  };

  const handleAddCustomStorage = () => {
    if (!customStorageInput.trim()) return;
    const val = customStorageInput.trim().toUpperCase();

    if (!newProd.storageOptions.includes(val)) {
      setNewProd({ ...newProd, storageOptions: [...newProd.storageOptions, val] });
    }

    if (storageScope === 'category') {
      setCustomPresets((prev) => {
        const currentForCat = prev.storageByCategory[newProd.category] || [];
        if (!currentForCat.includes(val)) {
          return {
            ...prev,
            storageByCategory: {
              ...prev.storageByCategory,
              [newProd.category]: [...currentForCat, val]
            }
          };
        }
        return prev;
      });
    }

    setCustomStorageInput('');
  };

  const handleToggleColor = (color: ProductColor) => {
    const current = newProd.colorOptions || [];
    const exists = current.some((c) => c.name.toLowerCase() === color.name.toLowerCase());
    if (exists) {
      if (current.length === 1) return;
      setNewProd({ ...newProd, colorOptions: current.filter((c) => c.name.toLowerCase() !== color.name.toLowerCase()) });
    } else {
      setNewProd({ ...newProd, colorOptions: [...current, color] });
    }
  };

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    const newColor: ProductColor = {
      name: customColorName.trim(),
      hex: customColorHex
    };

    const exists = newProd.colorOptions.some((c) => c.name.toLowerCase() === newColor.name.toLowerCase());
    if (!exists) {
      setNewProd({ ...newProd, colorOptions: [...newProd.colorOptions, newColor] });
    }

    if (colorScope === 'category') {
      setCustomPresets((prev) => {
        const currentForCat = prev.colorsByCategory[newProd.category] || [];
        const isAlreadySaved = currentForCat.some((c) => c.name.toLowerCase() === newColor.name.toLowerCase());
        if (!isAlreadySaved) {
          return {
            ...prev,
            colorsByCategory: {
              ...prev.colorsByCategory,
              [newProd.category]: [...currentForCat, newColor]
            }
          };
        }
        return prev;
      });
    }

    setCustomColorName('');
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        let w = img.width;
        let h = img.height;

        if (w > h) {
          if (w > MAX_DIM) {
            h *= MAX_DIM / w;
            w = MAX_DIM;
          }
        } else {
          if (h > MAX_DIM) {
            w *= MAX_DIM / h;
            h = MAX_DIM;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/png', 0.9);
        setDraftConfig((prev) => ({ ...prev, logoUrl: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleProdPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 750;
          let w = img.width;
          let h = img.height;

          if (w > h) {
            if (w > MAX_DIM) {
              h *= MAX_DIM / w;
              w = MAX_DIM;
            }
          } else {
            if (h > MAX_DIM) {
              w *= MAX_DIM / h;
              h = MAX_DIM;
            }
          }

          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

          setNewProd((prev) => {
            const currentGallery = prev.gallery || [];
            const newGallery = [...currentGallery, dataUrl];
            return {
              ...prev,
              image: prev.image ? prev.image : dataUrl,
              gallery: newGallery
            };
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setNewProd((prev) => {
      const currentGallery = prev.gallery || [];
      const updatedGallery = currentGallery.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        image: updatedGallery[0] || '',
        gallery: updatedGallery
      };
    });
  };

  const handleSetMainPhoto = (photoUrl: string) => {
    setNewProd((prev) => ({ ...prev, image: photoUrl }));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.priceUSD) return;

    const isUsado = newProd.productType === 'Usado';
    const fallbackImg = newProd.image || (newProd.gallery && newProd.gallery.length > 0 ? newProd.gallery[0] : 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80');

    const finalGallery = newProd.gallery && newProd.gallery.length > 0
      ? Array.from(new Set([fallbackImg, ...newProd.gallery]))
      : [fallbackImg];

    const finalColors = newProd.colorOptions && newProd.colorOptions.length > 0 
      ? newProd.colorOptions 
      : [{ name: 'Estándar', hex: '#9E9893' }];

    const finalStorage = newProd.storageOptions && newProd.storageOptions.length > 0 
      ? newProd.storageOptions 
      : ['128GB'];

    const finalProdData: Omit<Product, 'id'> = {
      ...newProd,
      image: fallbackImg,
      gallery: finalGallery,
      storageOptions: finalStorage,
      colorOptions: finalColors,
      batteryHealth: isUsado ? `${newProd.batteryPercentage || 90}% Original` : 'Sellado de Fábrica',
      warranty: isUsado ? '1 Mes de Garantía ante fallas' : (newProd.category === 'iPhone' || newProd.category === 'Mac' || newProd.category === 'iPad' || newProd.category === 'Apple Watch' ? 'Garantía Oficial Apple (1 Año)' : 'Garantía Oficial de Fábrica (1 Año)')
    };

    if (editingProductId) {
      onUpdateProduct({
        ...finalProdData,
        id: editingProductId
      });
    } else {
      onAddProduct(finalProdData);
    }

    handleCancelForm();
  };

  // ─── GESTIÓN DE PRECIOS Y COTIZACIONES DE PLAN CANJE (EN DRAFT) ───
  const currentCanjeDevices: SupportedTradeInDevice[] = draftConfig.canjePricing?.devices || SUPPORTED_TRADE_IN_DEVICES;
  const currentCanjePenalties: ConditionPenalties = {
    ...DEFAULT_CONDITION_PENALTIES,
    ...(draftConfig.canjePricing?.penalties || {})
  };

  const handleUpdateDeviceCapacityPrice = (brand: string, model: string, storage: string, newPriceUSD: number) => {
    const updatedDevices = currentCanjeDevices.map((d) => {
      if (d.brand === brand && d.model === model) {
        const updatedCaps = d.capacities.map((c) => {
          if (c.storage === storage) {
            return { ...c, basePriceUSD: Number(newPriceUSD) || 0 };
          }
          return c;
        });
        return { ...d, capacities: updatedCaps };
      }
      return d;
    });

    setDraftConfig((prev) => ({
      ...prev,
      canjePricing: {
        ...(prev.canjePricing || {}),
        devices: updatedDevices
      }
    }));
  };

  const handleRemoveTradeInDevice = (brand: string, model: string) => {
    const updatedDevices = currentCanjeDevices.filter((d) => !(d.brand === brand && d.model === model));
    setDraftConfig((prev) => ({
      ...prev,
      canjePricing: {
        ...(prev.canjePricing || {}),
        devices: updatedDevices
      }
    }));
  };

  const handleCreateNewTradeInDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTradeInModel.trim()) return;

    const exists = currentCanjeDevices.some(
      (d) => d.brand.toLowerCase() === newTradeInBrand.toLowerCase() && d.model.toLowerCase() === newTradeInModel.trim().toLowerCase()
    );

    let updatedDevices: SupportedTradeInDevice[];
    if (exists) {
      updatedDevices = currentCanjeDevices.map((d) => {
        if (d.brand.toLowerCase() === newTradeInBrand.toLowerCase() && d.model.toLowerCase() === newTradeInModel.trim().toLowerCase()) {
          const capExists = d.capacities.some((c) => c.storage === newTradeInStorage);
          if (!capExists) {
            return {
              ...d,
              capacities: [...d.capacities, { storage: newTradeInStorage, basePriceUSD: Number(newTradeInPrice) || 100 }]
            };
          }
        }
        return d;
      });
    } else {
      updatedDevices = [
        {
          brand: newTradeInBrand,
          model: newTradeInModel.trim(),
          capacities: [{ storage: newTradeInStorage, basePriceUSD: Number(newTradeInPrice) || 100 }]
        },
        ...currentCanjeDevices
      ];
    }

    setDraftConfig((prev) => ({
      ...prev,
      canjePricing: {
        ...(prev.canjePricing || {}),
        devices: updatedDevices
      }
    }));

    setNewTradeInModel('');
    setIsAddingTradeInDevice(false);
  };

  const handleUpdatePenalty = (key: keyof ConditionPenalties, value: number) => {
    setDraftConfig((prev) => ({
      ...prev,
      canjePricing: {
        ...(prev.canjePricing || {}),
        penalties: {
          ...currentCanjePenalties,
          [key]: Number(value) || 0
        }
      }
    }));
  };

  const handleResetCanjePricing = () => {
    setDraftConfig((prev) => ({
      ...prev,
      canjePricing: {
        devices: SUPPORTED_TRADE_IN_DEVICES,
        penalties: DEFAULT_CONDITION_PENALTIES
      }
    }));
  };

  const filteredCanjeDevices = currentCanjeDevices.filter((d) => 
    d.model.toLowerCase().includes(canjeSearchQuery.toLowerCase()) ||
    d.brand.toLowerCase().includes(canjeSearchQuery.toLowerCase())
  );

  const handleAddLocation = () => {
    if (!newLocationInput.trim()) return;
    const updated = [...(draftConfig.deliveryLocations || []), newLocationInput.trim()];
    setDraftConfig((prev) => ({ ...prev, deliveryLocations: updated }));
    setNewLocationInput('');
  };

  const handleDeleteLocation = (indexToDelete: number) => {
    const updated = draftConfig.deliveryLocations.filter((_, idx) => idx !== indexToDelete);
    setDraftConfig((prev) => ({ ...prev, deliveryLocations: updated }));
  };

  /**
   * Actualización de PIN con reconfirmación obligatoria
   */
  const handleUpdateAdminPinWithConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError(null);
    setPinChangeSuccess(null);

    const cleanNewPin = newPinInput.trim();
    const cleanConfirmPin = confirmNewPinInput.trim();

    if (!cleanNewPin || cleanNewPin.length < 4) {
      setPinChangeError('El nuevo PIN debe contener al menos 4 dígitos.');
      return;
    }

    if (cleanNewPin !== cleanConfirmPin) {
      setPinChangeError('Los PINs ingresados no coinciden. Escribe el mismo PIN en ambos campos.');
      return;
    }

    onUpdateConfig({ ...config, adminPin: cleanNewPin });
    setDraftConfig((prev) => ({ ...prev, adminPin: cleanNewPin }));
    setNewPinInput('');
    setConfirmNewPinInput('');
    setPinChangeSuccess(`✨ PIN de administrador actualizado exitosamente a: ${cleanNewPin}`);
    setTimeout(() => setPinChangeSuccess(null), 5000);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const safeStoreName = config.storeName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'catalogo';
    downloadAnchor.setAttribute("download", `${safeStoreName}_catalogo_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Modelos para la categoría actual
  const baseCategoryModels = BASE_MODEL_PRESETS[newProd.category] || [];
  const savedCategoryModels = customPresets.modelsByCategory?.[newProd.category] || [];
  const currentModel = newProd.name;
  const isCurrentModelCustom = currentModel && 
    !baseCategoryModels.includes(currentModel) && 
    !savedCategoryModels.includes(currentModel);

  const displayModelPills = Array.from(new Set([
    ...baseCategoryModels,
    ...savedCategoryModels,
    ...(isCurrentModelCustom ? [currentModel] : [])
  ]));

  // Storage pills
  const baseCategoryStorage = BASE_STORAGE_PRESETS[newProd.category] || ['128GB', '256GB'];
  const savedCategoryStorage = customPresets.storageByCategory[newProd.category] || [];
  const currentProductCustomStorage = (newProd.storageOptions || []).filter(
    (s) => !baseCategoryStorage.includes(s) && !savedCategoryStorage.includes(s)
  );
  const displayStoragePills = Array.from(new Set([
    ...baseCategoryStorage, 
    ...savedCategoryStorage, 
    ...currentProductCustomStorage
  ]));

  // Color pills
  const baseCategoryColors = BASE_COLOR_PRESETS[newProd.category] || [{ name: 'Estándar', hex: '#888888' }];
  const savedCategoryColors = customPresets.colorsByCategory[newProd.category] || [];
  const currentProductCustomColors = (newProd.colorOptions || []).filter(
    (c) => !baseCategoryColors.some((b) => b.name.toLowerCase() === c.name.toLowerCase()) &&
           !savedCategoryColors.some((s) => s.name.toLowerCase() === c.name.toLowerCase())
  );
  const displayColorPills = [
    ...baseCategoryColors,
    ...savedCategoryColors,
    ...currentProductCustomColors
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Drawer Lateral */}
        <motion.div
          ref={drawerContainerRef}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-xl h-full bg-[#08080A]/95 border-l border-white/15 p-5 sm:p-7 overflow-y-auto no-scrollbar z-10 flex flex-col justify-between text-slate-100 shadow-2xl"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10 text-white border border-white/15">
                  <Settings size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Panel Administrador</h3>
                  <p className="text-xs text-slate-400">Control de Productos, Precios de Canje y Ajustes</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Pantalla PIN de Acceso */}
            {!isAuthenticated ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4 shadow-[0_0_25px_rgba(255,255,255,0.15)]">
                  <Lock size={28} />
                </div>

                <h4 className="text-xl font-bold text-white mb-1">Acceso Protegido</h4>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  Ingresa tu PIN de 4 dígitos. (PIN por defecto: <span className="text-white font-bold">1234</span>)
                </p>

                <form onSubmit={handleVerifyPin} className="w-full max-w-xs space-y-4">
                  <input
                    type="password"
                    maxLength={6}
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="••••"
                    autoFocus
                    className="w-full text-center tracking-[1em] text-2xl font-black py-3 rounded-2xl bg-white/5 border border-white/15 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                  />

                  {pinError && (
                    <p className="text-xs font-semibold text-rose-400">PIN Incorrecto. Prueba con 1234.</p>
                  )}

                  <button
                    type="submit"
                    className="w-full btn-liquid-cyan py-3 rounded-2xl text-xs font-bold text-black"
                  >
                    Desbloquear Panel
                  </button>
                </form>
              </div>
            ) : (
              /* VISTA PRINCIPAL DEL PANEL AUTENTICADO */
              <div>
                {/* Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-6 p-1 rounded-2xl bg-white/5 border border-white/10">
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      handleCancelForm();
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center truncate ${
                      activeTab === 'products' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Productos ({products.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('config')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center truncate ${
                      activeTab === 'config' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Canje & Dólar
                  </button>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center truncate flex items-center justify-center gap-1.5 ${
                      activeTab === 'leads' ? 'bg-emerald-500 text-black font-black shadow-md' : 'text-emerald-400 hover:text-white'
                    }`}
                  >
                    <TrendingUp size={13} className="shrink-0" />
                    <span>Cotizaciones</span>
                    {leads.length > 0 && (
                      <span className={`text-[10px] px-1 rounded-full ${activeTab === 'leads' ? 'bg-black text-emerald-400' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        {leads.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('bot')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center truncate ${
                      activeTab === 'bot' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bots WhatsApp
                  </button>
                </div>

                {/* ─── TAB 1: PRODUCTOS ─── */}
                {activeTab === 'products' && (
                  <div className="space-y-4">
                    {!isAddingProduct ? (
                      <button
                        onClick={() => {
                          setEditingProductId(null);
                          setIsAddingProduct(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                      >
                        <Plus size={16} />
                        <span>Cargar Nuevo Producto</span>
                      </button>
                    ) : (
                      <form onSubmit={handleSaveProduct} className="p-4 rounded-2xl bg-white/5 border border-white/20 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                          <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                            editingProductId ? 'text-amber-400' : 'text-white'
                          }`}>
                            {editingProductId ? (
                              <>
                                <Pencil size={14} className="text-amber-400" />
                                <span>Editando: {newProd.name || 'Producto'}</span>
                              </>
                            ) : (
                              <span>Nuevo Producto</span>
                            )}
                          </h4>

                          {editingProductId && (
                            <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                              Modo Edición
                            </span>
                          )}
                        </div>

                        {/* PASO 1: CATEGORÍA */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-cyan-500/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles size={14} className="text-cyan-400" />
                              <span>1. Categoría del Producto</span>
                            </label>
                            <span className="text-[10px] text-cyan-400 font-bold">
                              Seleccionado: {newProd.category}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5">
                            {CATEGORY_ITEMS.map((cat) => {
                              const isSelected = newProd.category === cat.id;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => handleSelectCategory(cat.id)}
                                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                                    isSelected
                                      ? 'bg-white text-black border-white shadow-md scale-[1.02]'
                                      : 'bg-dark-900 text-slate-300 border-white/10 hover:border-white/25 hover:text-white'
                                  }`}
                                >
                                  {cat.icon}
                                  <span className="truncate">{cat.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* PASO 2: CONDICIÓN */}
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1 font-semibold">
                            2. Condición del Equipo
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setNewProd({
                                ...newProd, 
                                productType: 'Sellado', 
                                warranty: (newProd.category === 'iPhone' || newProd.category === 'Mac' || newProd.category === 'iPad' || newProd.category === 'Apple Watch' ? 'Garantía Oficial Apple (1 Año)' : 'Garantía Oficial de Fábrica (1 Año)'),
                                batteryPercentage: 100
                              })}
                              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                                newProd.productType === 'Sellado'
                                  ? 'bg-white text-black border-white shadow-sm'
                                  : 'bg-dark-900 text-slate-300 border-white/10'
                              }`}
                            >
                              <Box size={14} />
                              <span>📦 Sellado ({newProd.category === 'iPhone' ? 'Garantía Apple' : 'Garantía Oficial'})</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setNewProd({
                                ...newProd, 
                                productType: 'Usado', 
                                warranty: '1 Mes de Garantía ante fallas',
                                batteryPercentage: 89
                              })}
                              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                                newProd.productType === 'Usado'
                                  ? 'bg-purple-500 text-white border-purple-400 shadow-sm'
                                  : 'bg-dark-900 text-slate-300 border-white/10'
                              }`}
                            >
                              <RefreshCw size={14} />
                              <span>🔄 Usado (1 Mes Gtía)</span>
                            </button>
                          </div>
                        </div>

                        {/* PASO 3: MODELO */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                              <Tag size={14} className="text-cyan-400" />
                              <span>3. Nombre del Modelo: </span>
                              <span className="text-cyan-300 font-black truncate max-w-[200px]">{newProd.name || 'Sin seleccionar'}</span>
                            </label>
                            <span className="text-[10px] text-slate-400">Toca para elegir</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto no-scrollbar pr-1">
                            {displayModelPills.map((modelName) => {
                              const isSelected = newProd.name === modelName;
                              const isSaved = savedCategoryModels.includes(modelName);
                              const isProductOnly = isCurrentModelCustom && newProd.name === modelName;

                              return (
                                <button
                                  key={modelName}
                                  type="button"
                                  onClick={() => setNewProd({ ...newProd, name: modelName })}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                    isSelected
                                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-sm'
                                      : 'bg-dark-900 text-slate-300 border-white/10 hover:border-white/25 hover:text-white'
                                  }`}
                                >
                                  {isSelected && <Check size={11} />}
                                  <span>{modelName}</span>
                                  {isSaved && <span className="text-[9px] opacity-70">💾</span>}
                                  {isProductOnly && <span className="text-[9px] opacity-70">✨</span>}
                                </button>
                              );
                            })}
                          </div>

                          <div className="p-2.5 rounded-xl bg-dark-900/90 border border-white/10 space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={customModelInput}
                                onChange={(e) => setCustomModelInput(e.target.value)}
                                placeholder={`Escribir otro modelo de ${newProd.category}...`}
                                className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomModel())}
                              />
                              <button
                                type="button"
                                onClick={handleAddCustomModel}
                                disabled={!customModelInput.trim()}
                                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-xs font-bold text-black border border-cyan-400/40 shrink-0 flex items-center gap-1"
                              >
                                <Plus size={13} />
                                <span>Seleccionar</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-4 text-[11px] text-slate-300 pt-0.5">
                              <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Guardar:</span>
                              
                              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                                <input
                                  type="radio"
                                  name="modelScope"
                                  checked={modelScope === 'category'}
                                  onChange={() => setModelScope('category')}
                                  className="accent-cyan-400"
                                />
                                <span className="flex items-center gap-1">
                                  <BookmarkPlus size={12} className="text-cyan-400" />
                                  Para futuras cargas de <strong>{newProd.category}</strong>
                                </span>
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                                <input
                                  type="radio"
                                  name="modelScope"
                                  checked={modelScope === 'product'}
                                  onChange={() => setModelScope('product')}
                                  className="accent-cyan-400"
                                />
                                <span>Solo para este producto</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* PASO 4: ALMACENAMIENTOS */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                              <HardDrive size={14} className="text-cyan-400" />
                              <span>
                                4. {newProd.category === 'Apple Watch' ? 'Tamaño de Caja' : 'Opciones de Almacenamiento'} ({newProd.storageOptions?.length || 0} seleccionadas)
                              </span>
                            </label>
                            <span className="text-[10px] text-slate-400">Toca para activar/desactivar</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {displayStoragePills.map((st) => {
                              const isSelected = newProd.storageOptions.includes(st);
                              const isCustomSaved = savedCategoryStorage.includes(st);
                              const isProductOnly = currentProductCustomStorage.includes(st);

                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleToggleStorage(st)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                    isSelected
                                      ? 'bg-white text-black border-white shadow-sm'
                                      : 'bg-dark-900 text-slate-400 border-white/10 hover:text-white'
                                  }`}
                                >
                                  {isSelected && <Check size={11} />}
                                  <span>{st}</span>
                                  {isCustomSaved && <span className="text-[9px] opacity-70">💾</span>}
                                  {isProductOnly && <span className="text-[9px] opacity-70">✨</span>}
                                </button>
                              );
                            })}
                          </div>

                          <div className="p-2.5 rounded-xl bg-dark-900/90 border border-white/10 space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={customStorageInput}
                                onChange={(e) => setCustomStorageInput(e.target.value)}
                                placeholder="Escribir capacidad custom (ej. 24GB / 1TB SSD)..."
                                className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomStorage())}
                              />
                              <button
                                type="button"
                                onClick={handleAddCustomStorage}
                                disabled={!customStorageInput.trim()}
                                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-xs font-bold text-black border border-cyan-400/40 shrink-0 flex items-center gap-1"
                              >
                                <Plus size={13} />
                                <span>Agregar</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-4 text-[11px] text-slate-300 pt-0.5">
                              <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Guardar:</span>
                              
                              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                                <input
                                  type="radio"
                                  name="storageScope"
                                  checked={storageScope === 'category'}
                                  onChange={() => setStorageScope('category')}
                                  className="accent-cyan-400"
                                />
                                <span className="flex items-center gap-1">
                                  <BookmarkPlus size={12} className="text-cyan-400" />
                                  Para futuras cargas de <strong>{newProd.category}</strong>
                                </span>
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                                <input
                                  type="radio"
                                  name="storageScope"
                                  checked={storageScope === 'product'}
                                  onChange={() => setStorageScope('product')}
                                  className="accent-cyan-400"
                                />
                                <span>Solo para este producto</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* PASO 5: COLORES */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                              <Palette size={14} className="text-purple-400" />
                              <span>5. Colores Disponibles ({newProd.colorOptions?.length || 0} seleccionados)</span>
                            </label>
                            <span className="text-[10px] text-slate-400">
                              {newProd.productType === 'Usado' ? 'Elige o suma los colores disponibles' : 'Elige los colores a ofrecer'}
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            <div className="flex flex-wrap gap-1.5">
                              {displayColorPills.map((col) => {
                                const isSelected = newProd.colorOptions.some((c) => c.name.toLowerCase() === col.name.toLowerCase());
                                const isSaved = savedCategoryColors.some((s) => s.name.toLowerCase() === col.name.toLowerCase());
                                const isProductOnly = currentProductCustomColors.some((cp) => cp.name.toLowerCase() === col.name.toLowerCase());

                                return (
                                  <button
                                    key={col.name}
                                    type="button"
                                    onClick={() => handleToggleColor(col)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                                      isSelected
                                        ? 'bg-white text-black border-white shadow-sm'
                                        : 'bg-dark-900 text-slate-400 border-white/10 hover:text-white'
                                    }`}
                                  >
                                    <span className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0" style={{ backgroundColor: col.hex }} />
                                    <span>{col.name}</span>
                                    {isSelected && <Check size={11} />}
                                    {isSaved && <span className="text-[9px] opacity-70">💾</span>}
                                    {isProductOnly && <span className="text-[9px] opacity-70">✨</span>}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="p-2.5 rounded-xl bg-dark-900/90 border border-white/10 space-y-2">
                              <div className="flex gap-2 items-center">
                                <input
                                  type="color"
                                  value={customColorHex}
                                  onChange={(e) => setCustomColorHex(e.target.value)}
                                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer p-0 shrink-0"
                                  title="Elegir tono exacto"
                                />
                                <input
                                  type="text"
                                  value={customColorName}
                                  onChange={(e) => setCustomColorName(e.target.value)}
                                  placeholder="Nombre del color custom (ej. Verde Esmeralda)..."
                                  className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500"
                                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomColor())}
                                />
                                <button
                                  type="button"
                                  onClick={handleAddCustomColor}
                                  disabled={!customColorName.trim()}
                                  className="px-3.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-40 text-xs font-bold text-white border border-purple-400/40 shrink-0 flex items-center gap-1"
                                >
                                  <Plus size={13} />
                                  <span>Agregar</span>
                                </button>
                              </div>

                              <div className="flex items-center gap-4 text-[11px] text-slate-300 pt-0.5">
                                <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Guardar:</span>
                                
                                <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                                  <input
                                    type="radio"
                                    name="colorScope"
                                    checked={colorScope === 'category'}
                                    onChange={() => setColorScope('category')}
                                    className="accent-purple-400"
                                  />
                                  <span className="flex items-center gap-1">
                                    <BookmarkPlus size={12} className="text-purple-400" />
                                    Para futuras cargas de <strong>{newProd.category}</strong>
                                  </span>
                                </label>

                                <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                                  <input
                                    type="radio"
                                    name="colorScope"
                                    checked={colorScope === 'product'}
                                    onChange={() => setColorScope('product')}
                                    className="accent-purple-400"
                                  />
                                  <span>Solo para este producto</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Batería solo para Usados */}
                        {newProd.productType === 'Usado' && (newProd.category === 'iPhone' || newProd.category === 'iPad' || newProd.category === 'Mac' || newProd.category === 'Apple Watch' || newProd.category === 'Android') && (
                          <div className="grid grid-cols-1 gap-2 p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
                            <div>
                              <label className="text-[11px] font-bold text-purple-300 block mb-1 flex items-center gap-1">
                                <BatteryCharging size={13} />
                                Salud Batería (%)
                              </label>
                              <input
                                type="number"
                                required
                                min={50}
                                max={100}
                                value={newProd.batteryPercentage || 89}
                                onChange={(e) => setNewProd({ ...newProd, batteryPercentage: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-purple-400/40 text-xs text-emerald-400 font-bold"
                              />
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">Precio (USD)</label>
                            <input
                              type="number"
                              required
                              value={newProd.priceUSD}
                              onChange={(e) => setNewProd({ ...newProd, priceUSD: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs text-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">Specs resumidas</label>
                            <input
                              type="text"
                              value={newProd.specs}
                              onChange={(e) => setNewProd({ ...newProd, specs: e.target.value })}
                              placeholder={newProd.category === 'iPhone' ? 'ej. A18 Pro · Titanio · USB-C' : newProd.category === 'Consolas' ? 'ej. 4K 120FPS · DualSense' : 'ej. Características clave'}
                              className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Descripción extendida</label>
                          <textarea
                            rows={2}
                            value={newProd.description}
                            onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                            placeholder="Detalles sobre el estado, caja, accesorios, etc."
                            className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs text-white"
                          />
                        </div>

                        {/* FOTOS */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                              <ImageIcon size={14} className="text-cyan-400" />
                              <span>Galería de Fotos ({newProd.gallery?.length || (newProd.image ? 1 : 0)})</span>
                            </label>
                            <span className="text-[10px] text-slate-400">Subir desde Celular / PC o Link</span>
                          </div>

                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            ref={prodFileInputRef}
                            onChange={handleMultipleProdPhotosChange}
                            className="hidden"
                          />

                          <button
                            type="button"
                            onClick={() => prodFileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/15 transition-all shadow-sm"
                          >
                            <Camera size={15} />
                            <span>Subir Fotos desde tu Celular / PC (Múltiples)</span>
                          </button>

                          <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
                            <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                              <Link2 size={12} />
                              <span>Pegar Link de Instagram o Facebook</span>
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={socialLinkInput}
                                onChange={(e) => setSocialLinkInput(e.target.value)}
                                placeholder="https://www.instagram.com/p/... o Facebook"
                                className="flex-1 px-3 py-1.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white placeholder:text-slate-500"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleExtractPhotosFromLink())}
                              />
                              <button
                                type="button"
                                onClick={handleExtractPhotosFromLink}
                                disabled={isExtractingPhoto || !socialLinkInput.trim()}
                                className="px-3.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-xs font-bold text-white border border-purple-400/30 shrink-0 flex items-center gap-1.5"
                              >
                                {isExtractingPhoto ? (
                                  <>
                                    <RefreshCw size={12} className="animate-spin" />
                                    <span>Cargando...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles size={12} />
                                    <span>Extraer Foto</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {extractSuccessMsg && (
                              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold pt-0.5">
                                <CheckCircle2 size={12} />
                                <span>{extractSuccessMsg}</span>
                              </div>
                            )}

                            {extractErrorMsg && (
                              <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-medium pt-0.5">
                                <AlertCircle size={12} />
                                <span>{extractErrorMsg}</span>
                              </div>
                            )}
                          </div>

                          {newProd.gallery && newProd.gallery.length > 0 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-2">
                              {newProd.gallery.map((photo, idx) => {
                                const isMain = newProd.image === photo || (idx === 0 && !newProd.image);

                                return (
                                  <div
                                    key={idx}
                                    className={`relative rounded-xl overflow-hidden aspect-square border group ${
                                      isMain ? 'border-emerald-400 ring-2 ring-emerald-400/30' : 'border-white/20'
                                    }`}
                                  >
                                    <img 
                                      src={photo} 
                                      alt={`Foto ${idx + 1}`} 
                                      className="w-full h-full object-cover"
                                    />
                                    
                                    {isMain && (
                                      <span className="absolute top-1 left-1 bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded shadow">
                                        ★ Portada
                                      </span>
                                    )}

                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                                      {!isMain && (
                                        <button
                                          type="button"
                                          onClick={() => handleSetMainPhoto(photo)}
                                          title="Marcar como portada principal"
                                          className="p-1 rounded bg-white/20 text-white hover:bg-emerald-500 hover:text-black"
                                        >
                                          <Star size={12} />
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => handleRemovePhoto(idx)}
                                        title="Eliminar foto"
                                        className="p-1 rounded bg-white/20 text-white hover:bg-rose-500 hover:text-white"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={handleCancelForm}
                            className="flex-1 py-2.5 rounded-xl bg-white/10 text-xs font-bold text-slate-300"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-black ${
                              editingProductId ? 'bg-gradient-to-r from-amber-400 to-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'btn-liquid-cyan'
                            }`}
                          >
                            {editingProductId ? 'Actualizar Producto' : 'Guardar Producto con Opciones'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* BARRA DE BÚSQUEDA Y FILTROS DEL INVENTARIO */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Sliders size={14} className="text-cyan-400" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Inventario de Productos
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15">
                            {adminFilteredProducts.length} de {products.length}
                          </span>
                        </div>

                        {(adminSearchQuery || adminCategoryFilter !== 'Todos' || adminTypeFilter !== 'Todos' || adminStockFilter !== 'Todos') && (
                          <button
                            type="button"
                            onClick={() => {
                              setAdminSearchQuery('');
                              setAdminCategoryFilter('Todos');
                              setAdminTypeFilter('Todos');
                              setAdminStockFilter('Todos');
                            }}
                            className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 hover:underline"
                          >
                            <RotateCcw size={10} />
                            <span>Limpiar Filtros</span>
                          </button>
                        )}
                      </div>

                      {/* Buscador por Nombre, Specs o Color */}
                      <div className="relative">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={adminSearchQuery}
                          onChange={(e) => setAdminSearchQuery(e.target.value)}
                          placeholder="Buscar por modelo, memoria, specs o color (ej. iPhone 17, 256GB, Titanio)..."
                          className="w-full pl-8 pr-8 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none transition-all"
                        />
                        {adminSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setAdminSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>

                      {/* Filtro por Categorías (Pills Horizontales) */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                        {(['Todos', ...CATEGORY_ITEMS.map((c) => c.id)] as (CategoryType | 'Todos')[]).map((cat) => {
                          const isSelected = adminCategoryFilter === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setAdminCategoryFilter(cat)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap border transition-all ${
                                isSelected
                                  ? 'bg-white text-black border-white shadow-sm'
                                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>

                      {/* Filtros Secundarios: Condición y Stock */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {/* Condición */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/30 border border-white/5">
                          {(['Todos', 'Sellado', 'Usado'] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setAdminTypeFilter(t)}
                              className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                adminTypeFilter === t
                                  ? t === 'Usado'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                                    : 'bg-white/15 text-white border border-white/20'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {t === 'Todos' ? 'Condición: Todos' : t}
                            </button>
                          ))}
                        </div>

                        {/* Stock */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/30 border border-white/5">
                          {(['Todos', 'inStock', 'paused'] as const).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setAdminStockFilter(s)}
                              className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                adminStockFilter === s
                                  ? s === 'inStock'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                                    : s === 'paused'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                                    : 'bg-white/15 text-white border border-white/20'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {s === 'Todos' ? 'Stock: Todos' : s === 'inStock' ? 'Activos' : 'Pausados'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* LISTA RÁPIDA DE PRODUCTOS FILTRADOS */}
                    <div className="space-y-2.5 max-h-[50vh] overflow-y-auto no-scrollbar pr-1">
                      {adminFilteredProducts.length === 0 ? (
                        <div className="text-center py-8 px-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                          <p className="text-xs text-slate-400">
                            No se encontraron productos con los filtros actuales.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setAdminSearchQuery('');
                              setAdminCategoryFilter('Todos');
                              setAdminTypeFilter('Todos');
                              setAdminStockFilter('Todos');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                          >
                            Restablecer Filtros
                          </button>
                        </div>
                      ) : (
                        paginatedAdminProducts.map((p) => (
                          <div
                            key={p.id}
                            className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                              editingProductId === p.id 
                                ? 'bg-amber-500/10 border-amber-400/40 ring-1 ring-amber-400/30'
                                : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-10 h-10 object-contain filter drop-shadow"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h5 className="text-xs font-bold text-white truncate">{p.name}</h5>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                    p.productType === 'Usado' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/20 text-slate-200'
                                  }`}>
                                    {p.productType === 'Usado' ? `🔋${p.batteryPercentage || 90}%` : 'Sellado'}
                                  </span>
                                  <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                                    {p.category}
                                  </span>
                                  {p.gallery && p.gallery.length > 1 && (
                                    <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-white/10 text-slate-300">
                                     📸 {p.gallery.length} fotos
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-300 font-semibold">
                                  ${p.priceUSD} USD · {p.storageOptions?.join(', ')}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleStartEdit(p)}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-black text-amber-300 border border-amber-400/30 transition-all flex items-center gap-1 text-[10px] font-bold"
                                title="Editar producto"
                              >
                                <Pencil size={12} />
                                <span className="hidden sm:inline">Editar</span>
                              </button>

                              <button
                                onClick={() => onToggleStock(p.id)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                                  p.inStock
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                                    : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                                }`}
                              >
                                {p.inStock ? 'Stock' : 'Pausado'}
                              </button>

                              <button
                                onClick={() => onDeleteProduct(p.id)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                                title="Eliminar producto"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Paginación del Inventario Admin */}
                    {adminTotalPages > 1 && (
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                        <span className="text-[11px] text-slate-400">
                          Mostrando <strong>{(adminCurrentPage - 1) * ADMIN_ITEMS_PER_PAGE + 1}</strong>-<strong>{Math.min(adminCurrentPage * ADMIN_ITEMS_PER_PAGE, adminFilteredProducts.length)}</strong> de <strong>{adminFilteredProducts.length}</strong>
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setAdminCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={adminCurrentPage === 1}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold transition-all"
                            title="Página anterior"
                          >
                            <ChevronLeft size={14} />
                          </button>

                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                            {adminCurrentPage} / {adminTotalPages}
                          </span>

                          <button
                            type="button"
                            onClick={() => setAdminCurrentPage((p) => Math.min(adminTotalPages, p + 1))}
                            disabled={adminCurrentPage === adminTotalPages}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold transition-all"
                            title="Página siguiente"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── TAB 2: CONFIGURACIÓN (CON CONFIRMACIÓN POR PIN) ─── */}
                {activeTab === 'config' && (
                  <div className="space-y-5">
                    {/* Alerta de Éxito al Guardar */}
                    {saveSuccessMsg && (
                      <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
                        <CheckCircle2 size={16} />
                        <span>{saveSuccessMsg}</span>
                      </div>
                    )}

                    {/* MODALIDAD DE PLAN CANJE */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/30 via-dark-900 to-zinc-900 border border-purple-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                          <RefreshCw size={16} className="text-purple-400" />
                          <span>Modalidad del Plan Canje</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          draftConfig.canjeMode === 'automatico'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {draftConfig.canjeMode === 'automatico' ? 'Cotización en Pantalla' : 'Por Vendedor (WhatsApp)'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300">
                        Elige si el cotizador calcula el monto en dólares en pantalla o si recopila el diagnóstico y envía al cliente a WhatsApp para cotizar con un vendedor:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setDraftConfig((prev) => ({ ...prev, canjeMode: 'automatico' }))}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            draftConfig.canjeMode === 'automatico'
                              ? 'bg-purple-500/20 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                            <Calculator size={14} className="text-purple-300" />
                            <span>1. Con Montos en Pantalla</span>
                          </div>
                          <p className="text-[10px] text-slate-300 leading-snug">
                            Muestra el valor estimado en USD/ARS, calcula la diferencia exacta y detalla el bonus de caja y cable.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDraftConfig((prev) => ({ ...prev, canjeMode: 'manual' }))}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            draftConfig.canjeMode === 'manual'
                              ? 'bg-blue-500/20 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                            <MessageSquare size={14} className="text-blue-300" />
                            <span>2. Cotización por Vendedor</span>
                          </div>
                          <p className="text-[10px] text-slate-300 leading-snug">
                            Oculta los números en la web. El cliente llena el estado del equipo y un botón abre WhatsApp para que tú le des la cotización.
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* ─── SECCIÓN: ASIGNACIÓN MANUAL DE PRECIOS Y DEDUCCIONES DE PLAN CANJE ─── */}
                    {draftConfig.canjeMode === 'automatico' && (
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/30 space-y-4 shadow-lg">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                              <Calculator size={16} />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                Precios y Deducciones de Canje (Manual)
                              </h4>
                              <p className="text-[10px] text-slate-400">
                                Personaliza el valor en USD que pagas por cada modelo y ajusta los descuentos por estado.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleResetCanjePricing}
                            className="text-[10px] text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                            title="Restablecer valores originales"
                          >
                            <RotateCcw size={11} />
                            <span>Restablecer</span>
                          </button>
                        </div>

                        {/* 1. Panel de Ajuste de Deducciones por Estado (%) */}
                        <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setIsEditingPenaltiesOpen(!isEditingPenaltiesOpen)}
                            className="w-full p-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Sliders size={14} className="text-purple-400" />
                              <span className="text-xs font-bold text-white">
                                Ajustar Deducciones por Estado del Equipo (Batería, Pantalla, Chasis...)
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-400">
                              <span className="text-[10px] font-semibold">
                                {isEditingPenaltiesOpen ? 'Ocultar' : 'Configurar %'}
                              </span>
                              {isEditingPenaltiesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </div>
                          </button>

                          {isEditingPenaltiesOpen && (
                            <div className="p-3.5 border-t border-white/10 bg-dark-900/60 space-y-3.5">
                              {/* Batería */}
                              <div className="space-y-1.5">
                                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                                  <BatteryCharging size={13} />
                                  Descuento según Salud de Batería (%)
                                </span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                                    <label className="text-[9px] text-slate-400 block">88% a 94%</label>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min={0}
                                        max={50}
                                        value={currentCanjePenalties.batteryPct88to94}
                                        onChange={(e) => handleUpdatePenalty('batteryPct88to94', Number(e.target.value))}
                                        className="w-full px-2 py-1 rounded-lg bg-dark-900 border border-white/10 text-xs text-white font-bold"
                                      />
                                      <span className="text-xs text-slate-400 font-bold">%</span>
                                    </div>
                                  </div>

                                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                                    <label className="text-[9px] text-slate-400 block">80% a 87%</label>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min={0}
                                        max={50}
                                        value={currentCanjePenalties.batteryPct80to87}
                                        onChange={(e) => handleUpdatePenalty('batteryPct80to87', Number(e.target.value))}
                                        className="w-full px-2 py-1 rounded-lg bg-dark-900 border border-white/10 text-xs text-white font-bold"
                                      />
                                      <span className="text-xs text-slate-400 font-bold">%</span>
                                    </div>
                                  </div>

                                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                                    <label className="text-[9px] text-slate-400 block">Menor a 80%</label>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min={0}
                                        max={70}
                                        value={currentCanjePenalties.batteryPctBelow80}
                                        onChange={(e) => handleUpdatePenalty('batteryPctBelow80', Number(e.target.value))}
                                        className="w-full px-2 py-1 rounded-lg bg-dark-900 border border-white/10 text-xs text-white font-bold"
                                      />
                                      <span className="text-xs text-slate-400 font-bold">%</span>
                                    </div>
                                  </div>

                                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                                    <label className="text-[9px] text-slate-400 block">Desconocida</label>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min={0}
                                        max={50}
                                        value={currentCanjePenalties.batteryUnknown}
                                        onChange={(e) => handleUpdatePenalty('batteryUnknown', Number(e.target.value))}
                                        className="w-full px-2 py-1 rounded-lg bg-dark-900 border border-white/10 text-xs text-white font-bold"
                                      />
                                      <span className="text-xs text-slate-400 font-bold">%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Pantalla */}
                              <div className="space-y-1.5">
                                <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                                  <Smartphone size={13} />
                                  Descuento según Estado de Pantalla (%)
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                                    <label className="text-[9px] text-slate-400 block">Microrayones</label>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min={0}
                                        max={50}
                                        value={currentCanjePenalties.screenMicrorayones}
                                        onChange={(e) => handleUpdatePenalty('screenMicrorayones', Number(e.target.value))}
                                        className="w-full px-2 py-1 rounded-lg bg-dark-900 border border-white/10 text-xs text-white font-bold"
                                      />
                                      <span className="text-xs text-slate-400 font-bold">%</span>
                                    </div>
                                  </div>

                                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                                    <label className="text-[9px] text-slate-400 block">Rajada / Fisura</label>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min={0}
                                        max={80}
                                        value={currentCanjePenalties.screenRajada}
                                        onChange={(e) => handleUpdatePenalty('screenRajada', Number(e.target.value))}
                                        className="w-full px-2 py-1 rounded-lg bg-dark-900 border border-white/10 text-xs text-white font-bold"
                                      />
                                      <span className="text-xs text-slate-400 font-bold">%</span>
                                    </div>
                                  </div>

                                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                                    <label className="text-[9px] text-slate-400 block">Cambiada (No Orig.)</label>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min={0}
                                        max={60}
                                        value={currentCanjePenalties.screenCambiada}
                                        onChange={(e) => handleUpdatePenalty('screenCambiada', Number(e.target.value))}
                                        className="w-full px-2 py-1 rounded-lg bg-dark-900 border border-white/10 text-xs text-white font-bold"
                                      />
                                      <span className="text-xs text-slate-400 font-bold">%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Chasis, FaceID y Bonus */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                  <label className="text-[9px] text-slate-400 block">Marcas leves Chasis</label>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      min={0}
                                      max={30}
                                      value={currentCanjePenalties.bodyMarcasLeves}
                                      onChange={(e) => handleUpdatePenalty('bodyMarcasLeves', Number(e.target.value))}
                                      className="w-full px-2 py-1 rounded-lg bg-dark-900 border border-white/10 text-xs text-white font-bold"
                                    />
                                    <span className="text-xs text-slate-400 font-bold">%</span>
                                  </div>
                                </div>

                                <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                  <label className="text-[9px] text-slate-400 block">Golpes / Abolladuras</label>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      min={0}
                                      max={50}
                                      value={currentCanjePenalties.bodyGolpes}
                                      onChange={(e) => handleUpdatePenalty('bodyGolpes', Number(e.target.value))}
                                      className="w-full px-2 py-1 rounded-lg bg-dark-900 border border-white/10 text-xs text-white font-bold"
                                    />
                                    <span className="text-xs text-slate-400 font-bold">%</span>
                                  </div>
                                </div>

                                <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                  <label className="text-[9px] text-slate-400 block">Face ID / Touch ID Dañado</label>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      min={0}
                                      max={70}
                                      value={currentCanjePenalties.faceIdDefect}
                                      onChange={(e) => handleUpdatePenalty('faceIdDefect', Number(e.target.value))}
                                      className="w-full px-2 py-1 rounded-lg bg-dark-900 border border-white/10 text-xs text-white font-bold"
                                    />
                                    <span className="text-xs text-slate-400 font-bold">%</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                                <div>
                                  <span className="text-xs font-bold text-emerald-300 block">Bonus Caja & Cable Original</span>
                                  <span className="text-[10px] text-slate-400">Monto extra que suma si el cliente lo entrega con accesorios originales</span>
                                </div>
                                <div className="flex items-center gap-1 w-24">
                                  <span className="text-xs text-emerald-400 font-bold">+$</span>
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={currentCanjePenalties.boxCableBonusUSD}
                                    onChange={(e) => handleUpdatePenalty('boxCableBonusUSD', Number(e.target.value))}
                                    className="w-full px-2 py-1 rounded-lg bg-dark-900 border border-emerald-400/40 text-xs text-emerald-400 font-bold text-center"
                                  />
                                  <span className="text-xs text-emerald-400 font-bold">USD</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 2. Buscador y Lista de Modelos de Canje para Editar Precios Base en USD */}
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="relative flex-1">
                              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="text"
                                value={canjeSearchQuery}
                                onChange={(e) => setCanjeSearchQuery(e.target.value)}
                                placeholder="Buscar modelo (ej. iPhone 17, 16 Pro, S24)..."
                                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => setIsAddingTradeInDevice(!isAddingTradeInDevice)}
                              className="py-1.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-bold shrink-0 flex items-center gap-1"
                            >
                              <Plus size={13} />
                              <span>{isAddingTradeInDevice ? 'Cerrar' : 'Agregar Modelo'}</span>
                            </button>
                          </div>

                          {/* Formulario para agregar nuevo modelo a cotizar */}
                          {isAddingTradeInDevice && (
                            <form onSubmit={handleCreateNewTradeInDevice} className="p-3 rounded-xl bg-dark-900 border border-cyan-400/40 space-y-2.5">
                              <span className="text-xs font-bold text-cyan-300 block">Sumar Nuevo Modelo a la Tabla de Canje</span>
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">Marca</label>
                                  <select
                                    value={newTradeInBrand}
                                    onChange={(e) => setNewTradeInBrand(e.target.value)}
                                    className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
                                  >
                                    <option value="Apple">Apple</option>
                                    <option value="Samsung">Samsung</option>
                                    <option value="Xiaomi">Xiaomi</option>
                                    <option value="Otro">Otro</option>
                                  </select>
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="text-[10px] text-slate-400 block mb-0.5">Modelo</label>
                                  <input
                                    type="text"
                                    required
                                    value={newTradeInModel}
                                    onChange={(e) => setNewTradeInModel(e.target.value)}
                                    placeholder="ej. iPhone 17 Pro Max"
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">Capacidad</label>
                                  <input
                                    type="text"
                                    required
                                    value={newTradeInStorage}
                                    onChange={(e) => setNewTradeInStorage(e.target.value)}
                                    placeholder="128GB"
                                    className="w-full px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-2">
                                  <label className="text-[10px] text-slate-300 font-bold">Precio Base Impecable:</label>
                                  <div className="flex items-center gap-1 w-24">
                                    <span className="text-xs text-emerald-400 font-bold">$</span>
                                    <input
                                      type="number"
                                      required
                                      value={newTradeInPrice}
                                      onChange={(e) => setNewTradeInPrice(Number(e.target.value))}
                                      className="w-full px-2 py-1 rounded-lg bg-black/50 border border-emerald-400/40 text-xs text-emerald-400 font-bold"
                                    />
                                    <span className="text-xs text-slate-400">USD</span>
                                  </div>
                                </div>

                                <button
                                  type="submit"
                                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-md"
                                >
                                  Guardar en Tabla
                                </button>
                              </div>
                            </form>
                          )}

                          {/* Lista Scrollable de Dispositivos de Canje con Inputs de Precios en Vivo */}
                          <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar pr-1">
                            {filteredCanjeDevices.map((device, idx) => (
                              <div
                                key={`${device.brand}-${device.model}-${idx}`}
                                className="p-2.5 rounded-xl bg-black/30 border border-white/10 hover:border-white/20 transition-all space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-bold">
                                      {device.brand}
                                    </span>
                                    <h5 className="text-xs font-bold text-white">{device.model}</h5>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTradeInDevice(device.brand, device.model)}
                                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                                    title="Quitar este modelo del cotizador"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>

                                {/* Capacidades con Inputs Editables */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                  {device.capacities.map((cap) => (
                                    <div
                                      key={cap.storage}
                                      className="p-1.5 rounded-lg bg-dark-900 border border-white/5 flex items-center justify-between gap-1.5"
                                    >
                                      <span className="text-[10px] text-slate-300 font-semibold truncate">
                                        {cap.storage}:
                                      </span>
                                      <div className="flex items-center gap-0.5">
                                        <span className="text-[10px] text-emerald-400 font-bold">$</span>
                                        <input
                                          type="number"
                                          value={cap.basePriceUSD}
                                          onChange={(e) => handleUpdateDeviceCapacityPrice(device.brand, device.model, cap.storage, Number(e.target.value))}
                                          className="w-14 px-1 py-0.5 rounded bg-black/60 border border-white/10 text-[11px] text-emerald-400 font-bold text-center focus:border-emerald-400"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECCIÓN EDITAR LOGO */}
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                          <ImageIcon size={16} className="text-white" />
                          <span>Logo de la Tienda</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {draftConfig.logoUrl ? 'Personalizado' : 'Manzana Apple (Base)'}
                        </span>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        ref={logoFileInputRef}
                        onChange={handleLogoFileChange}
                        className="hidden"
                      />

                      <div className="flex items-center gap-3">
                        {draftConfig.logoUrl ? (
                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center p-1 overflow-hidden shrink-0">
                            <img src={draftConfig.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-slate-400 shrink-0">
                            <AppleLogo size={24} className="text-white fill-white" />
                          </div>
                        )}

                        <div className="flex-1 space-y-2 min-w-0">
                          <button
                            type="button"
                            onClick={() => logoFileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-sm"
                          >
                            <Upload size={14} />
                            <span>Subir Logo desde tu PC / Celular</span>
                          </button>

                          <input
                            type="text"
                            value={draftConfig.logoUrl || ''}
                            onChange={(e) => setDraftConfig((prev) => ({ ...prev, logoUrl: e.target.value }))}
                            placeholder="O pegar URL de imagen: https://..."
                            className="w-full px-3 py-1.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white"
                          />
                        </div>
                      </div>

                      {draftConfig.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setDraftConfig((prev) => ({ ...prev, logoUrl: '' }))}
                          className="text-[11px] text-rose-400 hover:underline block pt-1"
                        >
                          Restablecer a la Manzana de Apple oficial
                        </button>
                      )}
                    </div>

                    {/* SECCIÓN TEXTOS DEL BANNER PRINCIPAL (HERO EN VIVO / WYSIWYG) */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                          <Sparkles size={15} className="text-cyan-400" />
                          <span>Edición Visual del Banner Principal (Portada)</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setDraftConfig((prev) => ({
                              ...prev,
                              heroTagline: '',
                              heroTitle: '',
                              heroSubtitle: '',
                              heroWarrantyNew: '',
                              heroWarrantyUsed: '',
                              showHeroCanjeBadge: true
                            }));
                          }}
                          className="text-[10px] text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                          title="Restablecer textos por defecto"
                        >
                          <RotateCcw size={11} />
                          <span>Restablecer</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        Edita directamente sobre la maqueta del banner en tiempo real:
                      </p>

                      {/* BANNER MOCKUP CON EDICIÓN DIRECTA EN VIVO */}
                      <div className="relative rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-black/80 border border-white/20 shadow-2xl overflow-hidden space-y-3.5">
                        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                        {/* 1. Tagline Pill Editable en su posición */}
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                              <Pencil size={10} />
                              Pill Superior
                            </span>
                          </div>

                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200 text-xs font-bold w-full sm:w-auto max-w-sm focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400 transition-all">
                            <Sparkles size={13} className="text-cyan-300 shrink-0" />
                            <input
                              type="text"
                              value={draftConfig.heroTagline ?? ''}
                              onChange={(e) => setDraftConfig((prev) => ({ ...prev, heroTagline: e.target.value }))}
                              placeholder={`Catálogo Oficial · ${draftConfig.storeName}`}
                              className="bg-transparent border-0 outline-none text-slate-200 text-xs font-bold w-full placeholder:text-slate-500 tracking-wide uppercase"
                            />
                          </div>
                        </div>

                        {/* 2. Título Principal Editable en su posición */}
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                              <Pencil size={10} />
                              Título Principal
                            </span>
                          </div>

                          <textarea
                            rows={2}
                            value={draftConfig.heroTitle ?? ''}
                            onChange={(e) => setDraftConfig((prev) => ({ ...prev, heroTitle: e.target.value }))}
                            placeholder="Tecnología Sellada y Usados Seleccionados, con Garantía Real."
                            className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 focus:bg-white/10 rounded-2xl p-2.5 text-base sm:text-lg font-black text-white placeholder:text-slate-500 leading-tight outline-none resize-none transition-all shadow-inner"
                          />
                        </div>

                        {/* 3. Subtítulo / Párrafo Editable en su posición */}
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                              <Pencil size={10} />
                              Bajada / Descripción
                            </span>
                          </div>

                          <textarea
                            rows={2}
                            value={draftConfig.heroSubtitle ?? ''}
                            onChange={(e) => setDraftConfig((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                            placeholder="Equipos Sellados con Garantía Oficial Apple (1 Año) y Usados Seleccionados con 1 Mes de Garantía. Precios en ARS sincronizados en tiempo real con el Dólar Blue Venta."
                            className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 focus:bg-white/10 rounded-xl p-2 text-xs text-slate-300 placeholder:text-slate-500 leading-relaxed outline-none resize-none transition-all"
                          />
                        </div>

                        {/* 4. Pills de Garantía y Canje Editables en Fila Inferior */}
                        <div className="relative z-10 pt-2 border-t border-white/10 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Pencil size={10} />
                              Pills de Garantía y Plan Canje
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {/* Badge Sellados */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 focus-within:border-white text-[11px] font-semibold text-slate-200">
                              <Box size={13} className="shrink-0 text-slate-400" />
                              <input
                                type="text"
                                value={draftConfig.heroWarrantyNew ?? ''}
                                onChange={(e) => setDraftConfig((prev) => ({ ...prev, heroWarrantyNew: e.target.value }))}
                                placeholder="Sellados: Gtía Apple 1 Año"
                                className="bg-transparent border-0 outline-none text-slate-200 text-[11px] font-semibold w-full placeholder:text-slate-500"
                              />
                            </div>

                            {/* Badge Usados */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/30 border border-purple-500/30 focus-within:border-purple-400 text-[11px] font-semibold text-purple-300">
                              <ShieldCheck size={13} className="shrink-0 text-purple-400" />
                              <input
                                type="text"
                                value={draftConfig.heroWarrantyUsed ?? ''}
                                onChange={(e) => setDraftConfig((prev) => ({ ...prev, heroWarrantyUsed: e.target.value }))}
                                placeholder="Usados: 1 Mes Gtía"
                                className="bg-transparent border-0 outline-none text-purple-300 text-[11px] font-semibold w-full placeholder:text-purple-400/50"
                              />
                            </div>

                            {/* Badge Canje (Toggle) */}
                            <button
                              type="button"
                              onClick={() => setDraftConfig((prev) => ({ ...prev, showHeroCanjeBadge: prev.showHeroCanjeBadge === false }))}
                              className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                                draftConfig.showHeroCanjeBadge !== false
                                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                                  : 'bg-white/5 border-white/10 text-slate-500 opacity-60'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <RefreshCw size={13} className="shrink-0 text-emerald-400" />
                                <span className="truncate">Plan Canje</span>
                              </div>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-black/40">
                                {draftConfig.showHeroCanjeBadge !== false ? 'Activo' : 'Oculto'}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECCIÓN DIRECCIONES DE ENTREGA */}
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                          <MapPin size={16} className="text-emerald-400" />
                          <span>Puntos de Retiro y Direcciones</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {draftConfig.deliveryLocations?.length || 0} configuradas
                        </span>
                      </div>

                      <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                        {draftConfig.deliveryLocations?.map((loc, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-dark-900 border border-white/10 flex items-center justify-between gap-2"
                          >
                            <span className="text-xs text-slate-200 truncate">{loc}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteLocation(idx)}
                              className="p-1 rounded text-slate-400 hover:text-rose-400"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={newLocationInput}
                          onChange={(e) => setNewLocationInput(e.target.value)}
                          placeholder="ej. Puerto Madero (Edificio Alvear)"
                          className="flex-1 px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs text-white"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLocation())}
                        />
                        <button
                          type="button"
                          onClick={handleAddLocation}
                          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20 shrink-0"
                        >
                          + Agregar
                        </button>
                      </div>

                      <div className="pt-2">
                        <label className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                          <Truck size={13} className="text-cyan-400" />
                          Política / Modalidad de Envíos
                        </label>
                        <input
                          type="text"
                          value={draftConfig.shippingInfo}
                          onChange={(e) => setDraftConfig((prev) => ({ ...prev, shippingInfo: e.target.value }))}
                          placeholder="ej. Envíos en el día a CABA y GBA · Envíos a todo el país vía Andreani"
                          className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* DÓLAR BLUE EN VIVO */}
                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign size={18} className="text-emerald-400" />
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            Actualización Dólar Blue Venta
                          </h4>
                        </div>

                        <button
                          type="button"
                          onClick={() => setDraftConfig((prev) => ({ ...prev, autoDollarUpdate: !prev.autoDollarUpdate }))}
                          className={`px-3 py-1 rounded-full text-[11px] font-extrabold border transition-all ${
                            draftConfig.autoDollarUpdate
                              ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                              : 'bg-white/10 text-slate-400 border-white/20'
                          }`}
                        >
                          {draftConfig.autoDollarUpdate ? 'En Vivo: ACTIVADO' : 'Manual'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Cotización Actual en Tienda</span>
                          <span className="text-2xl font-black text-emerald-400">
                            ${draftConfig.usdToArsRate.toLocaleString('es-AR')} ARS
                          </span>
                          {draftConfig.lastDollarFetchTime && (
                            <span className="text-[10px] text-slate-500 block">
                              Última sincronización: {draftConfig.lastDollarFetchTime} hs
                            </span>
                          )}
                        </div>

                        {draftConfig.autoDollarUpdate && onRefreshDollar && (
                          <button
                            type="button"
                            onClick={onRefreshDollar}
                            disabled={isUpdatingDollar}
                            className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all active:scale-95"
                          >
                            <RefreshCw size={13} className={isUpdatingDollar ? 'animate-spin' : ''} />
                            <span>{isUpdatingDollar ? 'Actualizando...' : 'Refrescar'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* DATOS GENERALES */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                          Nombre de la Tienda
                        </label>
                        <input
                          type="text"
                          value={draftConfig.storeName}
                          onChange={(e) => setDraftConfig((prev) => ({ ...prev, storeName: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1 mb-1">
                          <Phone size={14} className="text-emerald-400" />
                          WhatsApp Pedidos
                        </label>
                        <input
                          type="text"
                          value={draftConfig.whatsappNumber}
                          onChange={(e) => setDraftConfig((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
                          placeholder="5491112345678"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-xs text-emerald-400 font-bold tracking-wider"
                        />
                      </div>
                    </div>

                    {/* SECCIÓN CAMBIO DE PIN CON RECONFIRMACIÓN OBLIGATORIA */}
                    <div className="pt-2 border-t border-white/10 space-y-3">
                      <form onSubmit={handleUpdateAdminPinWithConfirmation} className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/30 space-y-3 shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                            <KeyRound size={16} className="text-amber-400" />
                            <span>Cambio de PIN de Administrador</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            PIN actual: <strong className="text-amber-300">{config.adminPin}</strong>
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300">
                          Ingresa tu nuevo PIN de 4 a 6 dígitos y reconfírmalo para aplicar el cambio:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1 font-semibold">
                              Nuevo PIN
                            </label>
                            <input
                              type="password"
                              maxLength={6}
                              value={newPinInput}
                              onChange={(e) => setNewPinInput(e.target.value)}
                              placeholder="••••"
                              className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/15 text-sm text-white font-bold tracking-widest text-center focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1 font-semibold">
                              Reconfirmar Nuevo PIN
                            </label>
                            <input
                              type="password"
                              maxLength={6}
                              value={confirmNewPinInput}
                              onChange={(e) => setConfirmNewPinInput(e.target.value)}
                              placeholder="••••"
                              className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/15 text-sm text-white font-bold tracking-widest text-center focus:border-amber-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        {pinChangeError && (
                          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold pt-0.5">
                            <AlertCircle size={14} />
                            <span>{pinChangeError}</span>
                          </div>
                        )}

                        {pinChangeSuccess && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold pt-0.5">
                            <CheckCircle2 size={14} />
                            <span>{pinChangeSuccess}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={!newPinInput || !confirmNewPinInput}
                          className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          <KeyRound size={14} />
                          <span>Actualizar PIN con Reconfirmación</span>
                        </button>
                      </form>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={exportJSON}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300"
                        >
                          <Download size={15} />
                          <span>Exportar JSON</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const entered = window.prompt('Ingresa tu PIN de administrador para restablecer el catálogo original:');
                            if (entered === config.adminPin) {
                              onResetCatalog();
                            } else if (entered !== null) {
                              alert('PIN Incorrecto. No se realizaron cambios.');
                            }
                          }}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300"
                        >
                          <RefreshCw size={15} />
                          <span>Restablecer Catálogo</span>
                        </button>
                      </div>
                    </div>

                    {/* ÚNICO BOTÓN PRINCIPAL PARA GUARDAR CAMBIOS (DEBAJO DEL TODO) */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmPinInput('');
                          setConfirmPinError(false);
                          setIsPinConfirmModalOpen(true);
                        }}
                        className="w-full py-3.5 rounded-2xl btn-liquid-cyan text-black text-xs font-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all hover:scale-[1.01]"
                      >
                        <Save size={16} />
                        <span>Guardar Cambios de Canje, Logo y Dólar</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── TAB 3: COTIZACIONES / LEADS CRM ─── */}
                {activeTab === 'leads' && (
                  <div className="space-y-4 text-xs text-slate-300 py-2">
                    {/* Tarjeta de Métricas y Resumen */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {/* 1. Total Cotizados */}
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                          <TrendingUp size={12} className="text-slate-400" />
                          Total Cotizados
                        </span>
                        <p className="text-lg font-black text-white">{leadMetrics.total}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Interesados en Plan Canje</p>
                      </div>

                      {/* 2. Contactos a WhatsApp & Conversión */}
                      <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                            <MessageSquare size={12} className="text-emerald-400" />
                            Contactos WhatsApp
                          </span>
                          {leadMetrics.total > 0 && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {leadMetrics.conversion}% conv.
                            </span>
                          )}
                        </div>
                        <p className="text-lg font-black text-emerald-400">
                          {leadMetrics.sent}
                        </p>
                        <p className="text-[10px] text-emerald-300/70 font-medium">Clientes que te escribieron</p>
                      </div>

                      {/* 3. Modelo Más Ofrecido en Toma (Opción 4) */}
                      <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                          <Smartphone size={12} className="text-amber-400" />
                          Más Ofrecido en Toma
                        </span>
                        <p className="text-lg font-black text-amber-300 truncate" title={leadMetrics.topModelName}>
                          {leadMetrics.topModelName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium truncate">
                          {leadMetrics.topModelCount > 0
                            ? `${leadMetrics.topModelCount} cotizaciones (${leadMetrics.topModelPercentage}%)`
                            : 'Al recibir cotizaciones'}
                        </p>
                      </div>
                    </div>

                    {/* Botón de Refrescar Leads */}
                    <div className="flex items-center justify-between pt-1">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Smartphone size={14} className="text-emerald-400" />
                        Historial de Cotizaciones Recientes
                      </h4>
                      <button
                        type="button"
                        onClick={loadLeads}
                        disabled={isLoadingLeads}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white transition-all"
                      >
                        <RefreshCw size={12} className={isLoadingLeads ? 'animate-spin' : ''} />
                        <span>Actualizar</span>
                      </button>
                    </div>

                    {/* Lista de Leads */}
                    {isLoadingLeads ? (
                      <div className="py-12 text-center text-slate-400 space-y-2">
                        <RefreshCw size={20} className="animate-spin mx-auto text-emerald-400" />
                        <p className="text-xs">Cargando cotizaciones...</p>
                      </div>
                    ) : leads.length === 0 ? (
                      <div className="py-12 px-6 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <TrendingUp size={24} />
                        </div>
                        <h5 className="text-sm font-bold text-white">No hay cotizaciones registradas aún</h5>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                          Cuando tus clientes usen el cotizador de Plan Canje en la web, acá vas a ver cada cálculo con el equipo que entregan, la batería, la valuación de toma y si te contactaron por WhatsApp.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
                        {leads.map((lead, idx) => {
                          const isSent = lead.status === 'whatsapp_sent';
                          const dateFormatted = lead.createdAt
                            ? new Date(lead.createdAt).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Reciente';

                          return (
                            <div
                              key={lead.id || idx}
                              className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                                isSent
                                  ? 'bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-400/50'
                                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                              }`}
                            >
                              {/* Header del lead */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <Clock size={12} className="text-slate-500" />
                                  <span className="text-[10px] text-slate-400 font-mono">{dateFormatted}</span>
                                </div>
                                <span
                                  className={`text-[9px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                                    isSent
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                                      : 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30'
                                  }`}
                                >
                                  {isSent ? '💬 Contactó por WhatsApp' : '👁️ Cotizó en Web'}
                                </span>
                              </div>

                              {/* Detalles del Canje */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                    Entrega el cliente:
                                  </span>
                                  <p className="text-xs font-black text-white flex items-center gap-1.5">
                                    <Smartphone size={13} className="text-purple-400" />
                                    {lead.tradeInModel} ({lead.tradeInStorage})
                                  </p>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
                                    <span>🔋 {lead.batteryPercentage ? `${lead.batteryPercentage}%` : 'A verificar'}</span>
                                    <span>· Pantalla: {lead.screenStatus}</span>
                                    <span>· Chasis: {lead.bodyStatus}</span>
                                  </div>
                                  <p className="text-xs font-bold text-emerald-400 pt-0.5">
                                    Valuación de toma: ${lead.estimatedValueUSD} USD
                                  </p>
                                </div>

                                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                    Quiere comprar:
                                  </span>
                                  <p className="text-xs font-black text-white flex items-center gap-1.5">
                                    <Sparkles size={13} className="text-cyan-400" />
                                    {lead.targetProductName || 'Consulta general de canje'}
                                  </p>
                                  {lead.differenceToPayUSD !== undefined && lead.differenceToPayUSD > 0 && (
                                    <div className="pt-1">
                                      <p className="text-[10px] text-slate-400">Diferencia a abonar:</p>
                                      <p className="text-xs font-black text-cyan-300">
                                        ${lead.differenceToPayUSD} USD
                                        {lead.differenceToPayARS && (
                                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                                            (~${lead.differenceToPayARS.toLocaleString('es-AR')} ARS)
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ─── TAB 4: BOTS (PRÓXIMAMENTE) ─── */}
                {activeTab === 'bot' && (
                  <div className="space-y-4 text-xs text-slate-300 py-4">
                    <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-950/40 via-white/[0.02] to-transparent border border-purple-500/30 text-center space-y-4 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                      <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                        <Bot size={32} />
                      </div>

                      <div className="space-y-1.5">
                        <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-[11px] font-black text-purple-300 tracking-wider uppercase">
                          Próximamente
                        </span>
                        <h4 className="text-base font-bold text-white">
                          Bots & Automatizaciones de Catálogo
                        </h4>
                      </div>

                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Próximamente podrás activar respuestas automáticas de cotización de Plan Canje por WhatsApp y sincronización inteligente de stock con listas de proveedores en tiempo real.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-left">
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                          <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                            <Sparkles size={12} className="text-purple-400" />
                            WhatsApp Auto-Quote Bot
                          </span>
                          <p className="text-[10px] text-slate-400">
                            Responde cotizaciones y pedidos directamente a tus clientes.
                          </p>
                        </div>

                        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                          <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                            <RefreshCw size={12} className="text-cyan-400" />
                            Auto-Stock Importer
                          </span>
                          <p className="text-[10px] text-slate-400">
                            Importación automática de precios y stock desde listas mayoristas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-[10px] text-slate-500">
              {config.storeName} · Sistema de Administración de Catálogo & Plan Canje
            </p>
          </div>
        </motion.div>

        {/* ─── MODAL DE CONFIRMACIÓN CON PIN PARA GUARDAR CAMBIOS DE CONFIGURACIÓN ─── */}
        {isPinConfirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPinConfirmModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#0e0e12] border border-cyan-500/30 p-6 z-10 text-center shadow-2xl space-y-4"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                <Lock size={26} />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Confirmar con PIN</h4>
                <p className="text-xs text-slate-400">
                  Ingresa tu PIN de administrador para aplicar y guardar los cambios de Canje, Logo y Dólar.
                </p>
              </div>

              <form onSubmit={handleConfirmSaveConfig} className="space-y-3.5">
                <input
                  type="password"
                  maxLength={6}
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  placeholder="••••"
                  autoFocus
                  className="w-full text-center tracking-[0.8em] text-2xl font-black py-2.5 rounded-2xl bg-white/5 border border-white/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white"
                />

                {confirmPinError && (
                  <p className="text-xs font-semibold text-rose-400">
                    PIN Incorrecto. Ingresa tu PIN de administrador.
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsPinConfirmModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-slate-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl btn-liquid-cyan text-xs font-black text-black shadow-md"
                  >
                    Confirmar y Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
