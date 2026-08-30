-- ==============================================================================
-- SCHEMA SUPABASE: CATÁLOGO WEB FUTURISTA "LIQUID GLASS" (iOS 26)
-- Copia y pega este script completo en el SQL Editor de tu proyecto en Supabase
-- ==============================================================================

-- 1. Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Configuración de la Tienda
CREATE TABLE IF NOT EXISTS store_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  store_name TEXT NOT NULL DEFAULT 'TestStore',
  whatsapp_number TEXT NOT NULL DEFAULT '5492984219804',
  admin_pin TEXT NOT NULL DEFAULT '1234',
  usd_to_ars_rate NUMERIC NOT NULL DEFAULT 1355,
  auto_dollar_update BOOLEAN DEFAULT true,
  dollar_spread_usd NUMERIC DEFAULT 0,
  last_dollar_fetch_time TEXT,
  canje_mode TEXT DEFAULT 'automatico',
  canje_pricing JSONB,
  currency_symbol TEXT DEFAULT '$',
  show_ars_price BOOLEAN DEFAULT true,
  instagram_user TEXT DEFAULT 'teststore.oficial',
  delivery_locations JSONB DEFAULT '["Palermo Soho (Showroom / Punto de Retiro)", "Belgrano (Oficina Comercial)", "Envíos en el día en moto a CABA y GBA"]'::jsonb,
  shipping_info TEXT DEFAULT 'Envíos a todo el país vía Andreani / Correo Argentino con seguro 100%',
  logo_url TEXT,
  hero_tagline TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_warranty_new TEXT,
  hero_warranty_used TEXT,
  show_hero_canje_badge BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Productos del Catálogo
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Apple',
  product_type TEXT NOT NULL DEFAULT 'Sellado',
  price_usd NUMERIC NOT NULL,
  original_price_usd NUMERIC,
  specs TEXT,
  description TEXT,
  image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb,
  storage_options JSONB DEFAULT '[]'::jsonb,
  color_options JSONB DEFAULT '[]'::jsonb,
  battery_percentage NUMERIC DEFAULT 100,
  battery_health TEXT,
  in_stock BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]'::jsonb,
  warranty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Habilitar Seguridad RLS (Row Level Security) y Políticas de Acceso Público
ALTER TABLE store_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (cualquier cliente puede ver los productos y configuración)
CREATE POLICY "Permitir lectura publica de configuracion" ON store_config FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de productos" ON products FOR SELECT USING (true);

-- Políticas de escritura (inserción, actualización, eliminación pública o con token)
CREATE POLICY "Permitir escritura publica de configuracion" ON store_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir escritura publica de productos" ON products FOR ALL USING (true) WITH CHECK (true);

-- 5. Habilitar Realtime para sincronización instantánea en todos los dispositivos
ALTER PUBLICATION supabase_realtime ADD TABLE store_config;
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- 6. Insertar registro inicial de configuración si no existe
INSERT INTO store_config (id, store_name, whatsapp_number, admin_pin, usd_to_ars_rate)
VALUES ('default', 'NEXUS TECH', '5492984219804', '1234', 1355)
ON CONFLICT (id) DO NOTHING;
