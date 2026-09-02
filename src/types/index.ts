export type CategoryType = 
  | 'iPhone'
  | 'Mac'
  | 'Notebook'
  | 'iPad'
  | 'Apple Watch'
  | 'Accesorios'
  | 'Android'
  | 'Consolas'
  | 'Parlantes';

export type ProductType = 'Sellado' | 'Usado';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  tenantId?: string;
  name: string;
  category: CategoryType;
  brand: 'Apple' | 'Samsung' | 'Xiaomi' | 'Dell' | 'Lenovo' | 'ASUS' | 'Sony' | 'JBL' | 'Otro';
  productType: ProductType;
  priceUSD: number;
  originalPriceUSD?: number;
  specs: string;
  description: string;
  image: string;
  gallery?: string[];
  storageOptions: string[];
  colorOptions: ProductColor[];
  batteryPercentage?: number;
  batteryHealth?: string;
  inStock: boolean;
  isFeatured?: boolean;
  tags?: string[];
  warranty: string;
}

export interface CanjeTradeInState {
  brand: string;
  model: string;
  storage: string;
  batteryPercentage: number | null; // % exacto ingresado por el usuario (ej. 88)
  batteryUnknown: boolean; // Si marcó "No tengo esa información"
  batteryHealth?: string; // Para compatibilidad
  screenStatus: 'intacta' | 'microrayones' | 'rajada' | 'cambiada';
  bodyStatus: 'impecable' | 'marcas_leves' | 'golpes';
  faceIdWorking: boolean;
  hasBoxAndCable: boolean;
}

export interface CanjeEvaluationResult {
  tradeInModel: string;
  tradeInStorage: string;
  estimatedValueUSD: number;
  targetProduct: Product | null;
  differenceToPayUSD: number;
  breakdown: {
    baseValue: number;
    batteryDeduction: number;
    screenDeduction: number;
    bodyDeduction: number;
    bonusBonus: number;
  };
}

export type CanjeMode = 'automatico' | 'manual';

export interface ConditionPenalties {
  batteryPct88to94: number;
  batteryPct80to87: number;
  batteryPctBelow80: number;
  batteryUnknown: number;
  screenMicrorayones: number;
  screenRajada: number;
  screenCambiada: number;
  bodyMarcasLeves: number;
  bodyGolpes: number;
  faceIdDefect: number;
  boxCableBonusUSD: number;
}

export interface TradeInCapacityPrice {
  storage: string;
  basePriceUSD: number;
}

export interface SupportedTradeInDevice {
  brand: string;
  model: string;
  capacities: TradeInCapacityPrice[];
}

export interface CanjePricingConfig {
  devices?: SupportedTradeInDevice[];
  penalties?: Partial<ConditionPenalties>;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  customDomain?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface StoreConfig {
  tenantId?: string;
  storeName: string;
  logoUrl?: string;
  whatsappNumber: string;
  adminPin: string;
  usdToArsRate: number;
  autoDollarUpdate: boolean;
  dollarSpreadUSD?: number;
  lastDollarFetchTime?: string;
  canjeMode: CanjeMode;
  canjePricing?: CanjePricingConfig;
  currencySymbol: string;
  showArsPrice: boolean;
  instagramUser?: string;
  deliveryLocations: string[];
  shippingInfo: string;
  storeLocation?: string;
  heroTagline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroWarrantyNew?: string;
  heroWarrantyUsed?: string;
  showHeroCanjeBadge?: boolean;
  customSettings?: Record<string, any>;
}
