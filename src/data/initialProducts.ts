import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // ─── iPHONE SELLADOS ───
  {
    id: 'iphone-16-pro-max-sellado',
    name: 'iPhone 16 Pro Max',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 1390,
    originalPriceUSD: 1490,
    specs: 'A18 Pro Chip · 8GB RAM · Control de Cámara · Titanio',
    description: 'Equipo NUEVO SELLADO en caja original sin abrir. Máxima potencia, cámara tetraprisma 5x y batería de máxima duración.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['256GB', '512GB', '1TB'],
    colorOptions: [
      { name: 'Titanio Desierto', hex: '#C2A385' },
      { name: 'Titanio Natural', hex: '#9E9893' },
      { name: 'Titanio Blanco', hex: '#E3E4E5' },
      { name: 'Titanio Negro', hex: '#3C3B37' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado de Fábrica',
    inStock: true,
    isFeatured: true,
    tags: ['Sellado', 'Garantía Apple 1 Año'],
    warranty: 'Garantía Oficial Apple (1 Año)'
  },
  {
    id: 'iphone-15-sellado',
    name: 'iPhone 15',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 790,
    originalPriceUSD: 850,
    specs: 'A16 Bionic · Dynamic Island · USB-C · 48MP',
    description: 'Equipo NUEVO SELLADO. Pantalla con Dynamic Island, puerto USB-C y sensor principal de 48 megapíxeles.',
    image: 'https://images.unsplash.com/photo-1695048132958-86f1e1ffb157?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['128GB', '256GB'],
    colorOptions: [
      { name: 'Negro', hex: '#2A2B2D' },
      { name: 'Azul', hex: '#9BB5C4' },
      { name: 'Rosa', hex: '#E7B8C4' },
      { name: 'Verde', hex: '#C4D7CB' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado de Fábrica',
    inStock: true,
    isFeatured: false,
    tags: ['Sellado', 'USB-C'],
    warranty: 'Garantía Oficial Apple (1 Año)'
  },

  // ─── iPHONE USADOS SELECCIONADOS (Con % exacto de batería y color único) ───
  {
    id: 'iphone-15-pro-usado-94',
    name: 'iPhone 15 Pro',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 890,
    originalPriceUSD: 999,
    specs: 'A17 Pro · 8GB RAM · Chasis Titanio · Impecable',
    description: 'Equipo USADO SELECCIONADO en estado estético 10/10. Sin detalles, peritado técnicamente al 100%. Color único publicado.',
    image: 'https://images.unsplash.com/photo-1695048132958-86f1e1ffb157?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['128GB'],
    colorOptions: [
      { name: 'Titanio Natural (Único)', hex: '#9E9893' }
    ],
    batteryPercentage: 94,
    batteryHealth: '94% Original',
    inStock: true,
    isFeatured: true,
    tags: ['Batería 94%', '1 Mes Garantía', 'Oportunidad'],
    warranty: '1 Mes de Garantía ante fallas'
  },
  {
    id: 'iphone-14-pro-usado-89',
    name: 'iPhone 14 Pro',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 720,
    originalPriceUSD: 800,
    specs: 'A16 Bionic · Pantalla ProMotion 120Hz · Dynamic Island',
    description: 'Equipo USADO en excelente estado general. Funcionamiento perfecto de FaceID, cámaras y pantalla TrueTone.',
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['128GB'],
    colorOptions: [
      { name: 'Deep Purple (Único)', hex: '#483D50' }
    ],
    batteryPercentage: 89,
    batteryHealth: '89% Original',
    inStock: true,
    isFeatured: false,
    tags: ['Batería 89%', '1 Mes Garantía'],
    warranty: '1 Mes de Garantía ante fallas'
  },
  {
    id: 'iphone-13-usado-87',
    name: 'iPhone 13',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 490,
    originalPriceUSD: 560,
    specs: 'A15 Bionic · Pantalla OLED 6.1" · Modo Cine',
    description: 'Equipo USADO revisado exhaustivamente. Batería original con excelente autonomía diaria. Ideal para primer iPhone o Plan Canje.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['128GB'],
    colorOptions: [
      { name: 'Midnight / Negro (Único)', hex: '#1C232B' }
    ],
    batteryPercentage: 87,
    batteryHealth: '87% Original',
    inStock: true,
    isFeatured: true,
    tags: ['Batería 87%', 'Super Precio', '1 Mes Garantía'],
    warranty: '1 Mes de Garantía ante fallas'
  },

  // ─── MAC (SELLADO Y USADO) ───
  {
    id: 'macbook-pro-14-m3-pro-sellado',
    name: 'MacBook Pro 14" M3 Pro',
    category: 'Mac',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 1980,
    specs: 'Chip M3 Pro · 18GB RAM · 512GB SSD · Liquid Retina XDR',
    description: 'NUEVO SELLADO en caja original de fábrica. 18GB de memoria unificada y pantalla con tasa de refresco adaptativa 120Hz ProMotion.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['512GB SSD'],
    colorOptions: [
      { name: 'Space Black', hex: '#2A2B2D' },
      { name: 'Silver', hex: '#E3E4E5' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado (0 Ciclos)',
    inStock: true,
    isFeatured: true,
    tags: ['Sellado', 'M3 Pro', 'Garantía Apple'],
    warranty: 'Garantía Oficial Apple (1 Año)'
  },
  {
    id: 'macbook-air-m2-usado-95',
    name: 'MacBook Air 13" M2',
    category: 'Mac',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 870,
    specs: 'Chip M2 · 8GB RAM · 256GB SSD · Teclado Español',
    description: 'MacBook USADA en estado impecable. Chasis sin marcas ni rayones. Batería original con poquísimos ciclos de uso.',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['256GB SSD'],
    colorOptions: [
      { name: 'Medianoche (Único)', hex: '#1E2530' }
    ],
    batteryPercentage: 95,
    batteryHealth: '95% (48 Ciclos)',
    inStock: true,
    isFeatured: false,
    tags: ['Batería 95%', '1 Mes Garantía'],
    warranty: '1 Mes de Garantía ante fallas'
  },

  // ─── NOTEBOOK ───
  {
    id: 'dell-xps-15-oled-sellado',
    name: 'Dell XPS 15 OLED 4K',
    category: 'Notebook',
    brand: 'Dell',
    productType: 'Sellado',
    priceUSD: 1650,
    specs: 'Intel Core i9 13th Gen · 32GB RAM · 1TB SSD · RTX 4060',
    description: 'NUEVA SELLADA en caja. Pantalla InfinityEdge OLED táctil 3.5K y tarjeta gráfica dedicada NVIDIA GeForce RTX 4060.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['1TB SSD'],
    colorOptions: [
      { name: 'Platinum Silver', hex: '#D2D4D7' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellada',
    inStock: true,
    isFeatured: true,
    tags: ['Sellado', 'RTX 4060'],
    warranty: 'Garantía Oficial (1 Año)'
  },

  // ─── IPAD (SELLADO Y USADO) ───
  {
    id: 'ipad-pro-13-m4-sellado',
    name: 'iPad Pro 13" M4 OLED',
    category: 'iPad',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 1350,
    specs: 'Chip M4 · Ultra Retina XDR Tandem OLED · 256GB',
    description: 'NUEVO SELLADO. La tablet más potente del mundo con tecnología de doble capa Tandem OLED y chip M4.',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['256GB', '512GB'],
    colorOptions: [
      { name: 'Negro Espacial', hex: '#2A2B2D' },
      { name: 'Plata', hex: '#E3E4E5' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado',
    inStock: true,
    isFeatured: true,
    tags: ['Sellado', 'M4 Tandem OLED'],
    warranty: 'Garantía Oficial Apple (1 Año)'
  },
  {
    id: 'ipad-air-5-usado-92',
    name: 'iPad Air 5ta Gen M1',
    category: 'iPad',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 490,
    specs: 'Chip M1 · 64GB · Pantalla Liquid Retina 10.9"',
    description: 'Equipo USADO como nuevo. Ideal para dibujo y estudiantes. Compatible con Apple Pencil 2da Gen.',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['64GB'],
    colorOptions: [
      { name: 'Azul (Único)', hex: '#9BB5C4' }
    ],
    batteryPercentage: 92,
    batteryHealth: '92% Original',
    inStock: true,
    isFeatured: false,
    tags: ['Batería 92%', 'Chip M1', '1 Mes Garantía'],
    warranty: '1 Mes de Garantía ante fallas'
  },

  // ─── APPLE WATCH ───
  {
    id: 'apple-watch-ultra-2-sellado',
    name: 'Apple Watch Ultra 2',
    category: 'Apple Watch',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 850,
    specs: 'Titanio 49mm · GPS + Cellular · Brillo 3000 nits',
    description: 'NUEVO SELLADO. Reloj de titanio con cristal de zafiro plano y batería de hasta 72hs.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['49mm Titanio'],
    colorOptions: [
      { name: 'Titanio Natural', hex: '#9E9893' },
      { name: 'Titanio Negro', hex: '#282829' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado',
    inStock: true,
    isFeatured: true,
    tags: ['Sellado', 'Titanio 49mm'],
    warranty: 'Garantía Oficial Apple (1 Año)'
  },
  {
    id: 'apple-watch-s8-usado-89',
    name: 'Apple Watch Series 8 45mm',
    category: 'Apple Watch',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 290,
    specs: 'Aluminio 45mm · Sensor de Temperatura · ECG',
    description: 'Equipo USADO en impecable estado estético. Se entrega con malla deportiva y cargador magnético rápido.',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['45mm'],
    colorOptions: [
      { name: 'Midnight / Negro (Único)', hex: '#1C232B' }
    ],
    batteryPercentage: 89,
    batteryHealth: '89% Original',
    inStock: true,
    isFeatured: false,
    tags: ['Batería 89%', '1 Mes Garantía'],
    warranty: '1 Mes de Garantía ante fallas'
  },

  // ─── ACCESORIOS ───
  {
    id: 'airpods-max-usb-c-sellado',
    name: 'AirPods Max (USB-C)',
    category: 'Accesorios',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 590,
    specs: 'Cancelación Activa de Ruido Pro · Audio Espacial · USB-C',
    description: 'NUEVOS SELLADOS de fábrica. Audio de alta resolución con almohadillas viscoelásticas y estuche Smart Case.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['Edición USB-C'],
    colorOptions: [
      { name: 'Midnight', hex: '#1C232B' },
      { name: 'Starlight', hex: '#F0ECE4' },
      { name: 'Purple', hex: '#9B8EA9' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado',
    inStock: true,
    isFeatured: true,
    tags: ['Sellado', 'Audio Hi-Res'],
    warranty: 'Garantía Oficial Apple (1 Año)'
  },

  // ─── ANDROID ───
  {
    id: 'samsung-s24-ultra-sellado',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Android',
    brand: 'Samsung',
    productType: 'Sellado',
    priceUSD: 1090,
    specs: 'Snapdragon 8 Gen 3 · 12GB RAM · 200MP · S-Pen · Galaxy AI',
    description: 'NUEVO SELLADO en caja original con garantía oficial.',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['256GB', '512GB'],
    colorOptions: [
      { name: 'Titanium Gray', hex: '#636569' },
      { name: 'Titanium Black', hex: '#2A2B2D' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado',
    inStock: true,
    isFeatured: true,
    tags: ['Sellado', 'Galaxy AI'],
    warranty: 'Garantía Oficial (1 Año)'
  }
];
