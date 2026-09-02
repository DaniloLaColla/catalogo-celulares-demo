import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // ─── iPHONE 16 SERIES (SELLADOS & USADOS) ───
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
    gallery: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
    ],
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
    tags: ['Sellado', 'Garantía Apple 1 Año', 'Top Seller'],
    warranty: 'Garantía Oficial Apple (1 Año)'
  },
  {
    id: 'iphone-16-pro-sellado',
    name: 'iPhone 16 Pro',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 1190,
    originalPriceUSD: 1280,
    specs: 'A18 Pro · Pantalla 6.3" ProMotion 120Hz · Zoom 5x',
    description: 'Equipo NUEVO SELLADO. Chasis de titanio grado 5, botón Control de Cámara y puerto USB 3 de alta velocidad.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['128GB', '256GB', '512GB'],
    colorOptions: [
      { name: 'Titanio Natural', hex: '#9E9893' },
      { name: 'Titanio Negro', hex: '#3C3B37' },
      { name: 'Titanio Blanco', hex: '#E3E4E5' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado de Fábrica',
    inStock: true,
    isFeatured: true,
    tags: ['Sellado', 'ProMotion 120Hz'],
    warranty: 'Garantía Oficial Apple (1 Año)'
  },
  {
    id: 'iphone-16-sellado',
    name: 'iPhone 16',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 890,
    originalPriceUSD: 950,
    specs: 'Chip A18 · Botón Acción · Control de Cámara · 48MP Fusion',
    description: 'NUEVO SELLADO. Colores saturados por infusión de vidrio posterior, botón de acción y Apple Intelligence.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['128GB', '256GB'],
    colorOptions: [
      { name: 'Negro', hex: '#2A2B2D' },
      { name: 'Blanco', hex: '#F2F2F2' },
      { name: 'Rosa', hex: '#E7B8C4' },
      { name: 'Verde Azulado', hex: '#7CA8A4' },
      { name: 'Azul Ultramar', hex: '#4A6FA5' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado de Fábrica',
    inStock: true,
    isFeatured: false,
    tags: ['Sellado', 'A18'],
    warranty: 'Garantía Oficial Apple (1 Año)'
  },

  // ─── iPHONE 15 SERIES ───
  {
    id: 'iphone-15-pro-max-usado-91',
    name: 'iPhone 15 Pro Max',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 990,
    originalPriceUSD: 1100,
    specs: 'A17 Pro · 8GB RAM · Teleobjetivo 5x · Titanio',
    description: 'Equipo USADO SELECCIONADO en excelente estado estético 9.5/10. Chasis de titanio impecable y batería testeada.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['256GB'],
    colorOptions: [
      { name: 'Titanio Natural (Único)', hex: '#9E9893' }
    ],
    batteryPercentage: 91,
    batteryHealth: '91% Original',
    inStock: true,
    isFeatured: true,
    tags: ['Batería 91%', '1 Mes Garantía', 'Oportunidad'],
    warranty: '1 Mes de Garantía ante fallas'
  },
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
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['128GB'],
    colorOptions: [
      { name: 'Titanio Blanco (Único)', hex: '#E3E4E5' }
    ],
    batteryPercentage: 94,
    batteryHealth: '94% Original',
    inStock: true,
    isFeatured: true,
    tags: ['Batería 94%', '1 Mes Garantía', 'Oportunidad'],
    warranty: '1 Mes de Garantía ante fallas'
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
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['128GB', '256GB'],
    colorOptions: [
      { name: 'Negro', hex: '#2A2B2D' },
      { name: 'Azul', hex: '#9BB5C4' },
      { name: 'Rosa', hex: '#E7B8C4' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado de Fábrica',
    inStock: true,
    isFeatured: false,
    tags: ['Sellado', 'USB-C'],
    warranty: 'Garantía Oficial Apple (1 Año)'
  },
  {
    id: 'iphone-15-usado-89',
    name: 'iPhone 15',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 670,
    originalPriceUSD: 750,
    specs: 'A16 Bionic · Dynamic Island · USB-C · Impecable',
    description: 'Equipo USADO en condición excelente. Incluye vidrio templado y cable USB-C original.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['128GB'],
    colorOptions: [
      { name: 'Negro (Único)', hex: '#2A2B2D' }
    ],
    batteryPercentage: 89,
    batteryHealth: '89% Original',
    inStock: true,
    isFeatured: false,
    tags: ['Batería 89%', '1 Mes Garantía'],
    warranty: '1 Mes de Garantía ante fallas'
  },

  // ─── iPHONE 14 SERIES ───
  {
    id: 'iphone-14-pro-max-usado-86',
    name: 'iPhone 14 Pro Max',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 780,
    originalPriceUSD: 870,
    specs: 'A16 Bionic · Pantalla 6.7" 120Hz · Dynamic Island · 48MP',
    description: 'Equipo USADO SELECCIONADO. Gran pantalla ProMotion de 120Hz con Dynamic Island y batería de excelente rendimiento.',
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['128GB'],
    colorOptions: [
      { name: 'Negro Espacial (Único)', hex: '#2C2B30' }
    ],
    batteryPercentage: 86,
    batteryHealth: '86% Original',
    inStock: true,
    isFeatured: true,
    tags: ['Batería 86%', '1 Mes Garantía'],
    warranty: '1 Mes de Garantía ante fallas'
  },
  {
    id: 'iphone-14-pro-usado-89',
    name: 'iPhone 14 Pro',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 680,
    originalPriceUSD: 750,
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
    id: 'iphone-14-usado-87',
    name: 'iPhone 14',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 560,
    originalPriceUSD: 630,
    specs: 'A15 Bionic · Cámara Dual 12MP · Modo Acción · 5G',
    description: 'Equipo USADO muy cuidado. Sin rayas en pantalla ni golpes en el marco de aluminio.',
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['128GB'],
    colorOptions: [
      { name: 'Azul Medianoche (Único)', hex: '#1F2937' }
    ],
    batteryPercentage: 87,
    batteryHealth: '87% Original',
    inStock: true,
    isFeatured: false,
    tags: ['Batería 87%', '1 Mes Garantía'],
    warranty: '1 Mes de Garantía ante fallas'
  },

  // ─── iPHONE 13 SERIES ───
  {
    id: 'iphone-13-pro-max-usado-85',
    name: 'iPhone 13 Pro Max',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 660,
    originalPriceUSD: 740,
    specs: 'A15 Bionic · Pantalla 120Hz · Triple Cámara · Batería Gigante',
    description: 'Equipo USADO con batería testeada. Gran autonomía de batería y pantalla ProMotion de 120Hz muy fluida.',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['128GB'],
    colorOptions: [
      { name: 'Sierra Blue (Único)', hex: '#8FAEC5' }
    ],
    batteryPercentage: 85,
    batteryHealth: '85% Original',
    inStock: true,
    isFeatured: true,
    tags: ['Batería 85%', '1 Mes Garantía', 'Favorito'],
    warranty: '1 Mes de Garantía ante fallas'
  },
  {
    id: 'iphone-13-usado-88',
    name: 'iPhone 13',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 490,
    originalPriceUSD: 550,
    specs: 'A15 Bionic · 128GB · Modo Cine · Batería 88%',
    description: 'El iPhone con mejor relación precio/calidad del mercado. Estado estético 9/10, funcionamiento 10/10.',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['128GB'],
    colorOptions: [
      { name: 'Starlight Blanco (Único)', hex: '#F0ECE4' }
    ],
    batteryPercentage: 88,
    batteryHealth: '88% Original',
    inStock: true,
    isFeatured: true,
    tags: ['Batería 88%', 'Precio Calidad', '1 Mes Garantía'],
    warranty: '1 Mes de Garantía ante fallas'
  },

  // ─── iPHONE 12 & 11 SERIES (GAMA ACCESO) ───
  {
    id: 'iphone-12-usado-83',
    name: 'iPhone 12',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 360,
    originalPriceUSD: 410,
    specs: 'A14 Bionic · Pantalla Super Retina OLED · 5G · MagSafe',
    description: 'Equipo USADO en impecable estado. Pantalla OLED sin detalles, Face ID y cámaras funcionando perfecto.',
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['64GB'],
    colorOptions: [
      { name: 'Negro (Único)', hex: '#1C1C1E' }
    ],
    batteryPercentage: 83,
    batteryHealth: '83% Original',
    inStock: true,
    isFeatured: false,
    tags: ['Batería 83%', 'Económico', '1 Mes Garantía'],
    warranty: '1 Mes de Garantía ante fallas'
  },
  {
    id: 'iphone-11-usado-85',
    name: 'iPhone 11',
    category: 'iPhone',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 280,
    originalPriceUSD: 330,
    specs: 'A13 Bionic · 64GB · Doble Cámara con Modo Noche',
    description: 'Equipo USADO ideal como primer iPhone o teléfono de trabajo. Excelente rendimiento y costo accesible.',
    image: 'https://images.unsplash.com/photo-1574755393849-623942496936?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['64GB'],
    colorOptions: [
      { name: 'Blanco (Único)', hex: '#FAFAFA' }
    ],
    batteryPercentage: 85,
    batteryHealth: '85% Original',
    inStock: true,
    isFeatured: false,
    tags: ['Batería 85%', 'Más Económico', '1 Mes Garantía'],
    warranty: '1 Mes de Garantía ante fallas'
  },

  // ─── MAC / NOTEBOOKS ───
  {
    id: 'macbook-pro-14-m3-pro-sellado',
    name: 'MacBook Pro 14" (M3 Pro)',
    category: 'Mac',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 1990,
    originalPriceUSD: 2190,
    specs: 'Chip M3 Pro · 18GB RAM Unificada · 512GB SSD · Liquid Retina XDR',
    description: 'NUEVA SELLADA en caja. Potencia para edición de video 4K/8K, desarrollo de software y arquitectura profesional.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['512GB SSD', '1TB SSD'],
    colorOptions: [
      { name: 'Negro Espacial', hex: '#2C2B30' },
      { name: 'Plata', hex: '#E3E4E5' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado',
    inStock: true,
    isFeatured: true,
    tags: ['Sellado', 'M3 Pro', 'Garantía 1 Año'],
    warranty: 'Garantía Oficial Apple (1 Año)'
  },
  {
    id: 'macbook-air-13-m2-usada-94',
    name: 'MacBook Air 13" (Chip M2)',
    category: 'Mac',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 890,
    originalPriceUSD: 990,
    specs: 'Chip M2 · 8GB RAM · 256GB SSD · MagSafe 3 · Ultrafina',
    description: 'Equipo USADO en estado 10/10 (como nuevo). Solo 45 ciclos de carga en batería. Incluye cargador MagSafe original.',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['256GB SSD'],
    colorOptions: [
      { name: 'Midnight Oscuro (Único)', hex: '#1F2937' }
    ],
    batteryPercentage: 94,
    batteryHealth: '94% (45 Ciclos)',
    inStock: true,
    isFeatured: true,
    tags: ['Batería 94%', 'Chip M2', '1 Mes Garantía'],
    warranty: '1 Mes de Garantía ante fallas'
  },
  {
    id: 'dell-xps-15-oled-sellado',
    name: 'Dell XPS 15 OLED',
    category: 'Notebook',
    brand: 'Dell',
    productType: 'Sellado',
    priceUSD: 1650,
    specs: 'Intel Core i7 13va Gen · 32GB RAM · 1TB SSD · RTX 4060 · Pantalla 3.5K OLED Touch',
    description: 'NUEVA SELLADA de fábrica. Pantalla táctil OLED de precisión de color absoluta para creadores y gamers.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['1TB SSD'],
    colorOptions: [
      { name: 'Gris Platino', hex: '#7D7E80' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado',
    inStock: true,
    isFeatured: false,
    tags: ['Sellado', 'OLED 3.5K', 'RTX 4060'],
    warranty: 'Garantía Oficial Dell (1 Año)'
  },

  // ─── iPADS ───
  {
    id: 'ipad-pro-13-m4-sellado',
    name: 'iPad Pro 13" (Chip M4)',
    category: 'iPad',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 1290,
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
  {
    id: 'ipad-10-sellado',
    name: 'iPad 10ma Gen (10.9")',
    category: 'iPad',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 390,
    specs: 'A14 Bionic · Pantalla 10.9" All-Screen · USB-C · Wi-Fi 6',
    description: 'NUEVO SELLADO. Diseño moderno todo pantalla con conector USB-C y compatibilidad con teclado Magic Keyboard.',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['64GB', '256GB'],
    colorOptions: [
      { name: 'Plata', hex: '#E3E4E5' },
      { name: 'Azul', hex: '#6896C5' },
      { name: 'Rosa', hex: '#DE708F' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado',
    inStock: true,
    isFeatured: false,
    tags: ['Sellado', 'USB-C'],
    warranty: 'Garantía Oficial Apple (1 Año)'
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
    id: 'apple-watch-s10-sellado',
    name: 'Apple Watch Series 10 (46mm)',
    category: 'Apple Watch',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 460,
    specs: 'Carcasa de Aluminio Más Fina · Pantalla OLED Gran Angular · Carga Rápida',
    description: 'NUEVO SELLADO. La pantalla más grande y avanzada de Apple Watch, sensor de apnea del sueño y altavoz para música.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['46mm GPS'],
    colorOptions: [
      { name: 'Jet Black Brillante', hex: '#111111' },
      { name: 'Rose Gold', hex: '#E3B7AE' },
      { name: 'Silver Plata', hex: '#E3E4E5' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado',
    inStock: true,
    isFeatured: true,
    tags: ['Sellado', 'Series 10'],
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
  {
    id: 'apple-watch-se-2-usado-95',
    name: 'Apple Watch SE 2da Gen (44mm)',
    category: 'Apple Watch',
    brand: 'Apple',
    productType: 'Usado',
    priceUSD: 210,
    specs: 'Aluminio 44mm · Chip S8 · Detección de Caídas y Choques',
    description: 'Equipo USADO con 95% de batería. La mejor opción accesible de Apple Watch para entrenamiento y salud.',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['44mm'],
    colorOptions: [
      { name: 'Starlight (Único)', hex: '#F0ECE4' }
    ],
    batteryPercentage: 95,
    batteryHealth: '95% Original',
    inStock: true,
    isFeatured: false,
    tags: ['Batería 95%', 'Económico', '1 Mes Garantía'],
    warranty: '1 Mes de Garantía ante fallas'
  },

  // ─── ACCESORIOS Y AUDIO ───
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
  {
    id: 'airpods-pro-2-usb-c-sellado',
    name: 'AirPods Pro 2da Gen (USB-C)',
    category: 'Accesorios',
    brand: 'Apple',
    productType: 'Sellado',
    priceUSD: 260,
    specs: 'Chip H2 · Cancelación de Ruido 2x · Audio Adaptativo · Estuche USB-C MagSafe',
    description: 'NUEVOS SELLADOS en caja. Resistencia al polvo y agua IP54 y altavoz en estuche para Buscar (Find My).',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['Estuche USB-C'],
    colorOptions: [
      { name: 'Blanco', hex: '#FFFFFF' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado',
    inStock: true,
    isFeatured: true,
    tags: ['Sellado', 'Top Seller', 'Garantía 1 Año'],
    warranty: 'Garantía Oficial Apple (1 Año)'
  },

  // ─── CONSOLAS Y PARLANTES ───
  {
    id: 'ps5-pro-sellado',
    name: 'PlayStation 5 Pro',
    category: 'Consolas',
    brand: 'Sony',
    productType: 'Sellado',
    priceUSD: 890,
    specs: '2TB SSD · GPU Avanzada con PSSR AI Upscaling · Ray Tracing Avanzado',
    description: 'NUEVA SELLADA. La consola más potente del mercado con 2TB de almacenamiento ultrarrápido y 60/120 FPS estables.',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['2TB SSD'],
    colorOptions: [
      { name: 'Blanco / Negro Original', hex: '#E4E4E4' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado',
    inStock: true,
    isFeatured: true,
    tags: ['Sellado', 'PS5 Pro 2TB'],
    warranty: 'Garantía Oficial Sony (1 Año)'
  },
  {
    id: 'jbl-boombox-3-sellado',
    name: 'JBL Boombox 3 Wi-Fi',
    category: 'Parlantes',
    brand: 'JBL',
    productType: 'Sellado',
    priceUSD: 480,
    specs: 'Sonido Masivo Pro · Subwoofer Dedicado · Batería 24 Horas · IP67',
    description: 'NUEVO SELLADO. El parlante portátil con bajos más profundos del mercado, conectividad Wi-Fi con Dolby Atmos y Bluetooth 5.3.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['Edición Wi-Fi'],
    colorOptions: [
      { name: 'Negro', hex: '#1C1C1C' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado',
    inStock: true,
    isFeatured: false,
    tags: ['Sellado', 'Bajos Potentes'],
    warranty: 'Garantía Oficial JBL (1 Año)'
  },

  // ─── ANDROID GAMA ALTA ───
  {
    id: 'samsung-s24-ultra-sellado',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Android',
    brand: 'Samsung',
    productType: 'Sellado',
    priceUSD: 1090,
    specs: 'Snapdragon 8 Gen 3 · 12GB RAM · 200MP · S-Pen · Galaxy AI · Titanio',
    description: 'NUEVO SELLADO en caja original con garantía oficial.',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    storageOptions: ['256GB', '512GB'],
    colorOptions: [
      { name: 'Titanium Gray', hex: '#636569' },
      { name: 'Titanium Black', hex: '#2A2B2D' },
      { name: 'Titanium Violet', hex: '#4B3F72' }
    ],
    batteryPercentage: 100,
    batteryHealth: 'Sellado',
    inStock: true,
    isFeatured: true,
    tags: ['Sellado', 'Galaxy AI', 'S-Pen'],
    warranty: 'Garantía Oficial Samsung (1 Año)'
  }
];
