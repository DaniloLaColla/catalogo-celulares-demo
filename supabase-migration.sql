-- =========================================================================
-- MIGRACIÓN MULTI-TENANT PARA CATÁLOGO CELULARES SAAS
-- =========================================================================
-- Copia y pega este script en: Supabase Dashboard -> SQL Editor -> Run

-- 1. Crear tabla de inquilinos (Tenants)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    custom_domain TEXT UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar Seguridad RLS y Políticas de Acceso
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Lectura pública para que cualquier frontend pueda cargar la tienda por su slug
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'tenants' AND policyname = 'Allow public read on tenants'
    ) THEN
        CREATE POLICY "Allow public read on tenants" ON public.tenants FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'tenants' AND policyname = 'Allow public insert on tenants'
    ) THEN
        CREATE POLICY "Allow public insert on tenants" ON public.tenants FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'tenants' AND policyname = 'Allow public update on tenants'
    ) THEN
        CREATE POLICY "Allow public update on tenants" ON public.tenants FOR UPDATE USING (true);
    END IF;
END $$;

-- 3. Crear el Tenant Inicial ("demo" para TestStore)
INSERT INTO public.tenants (id, slug, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'demo', 'TestStore')
ON CONFLICT (slug) DO NOTHING;

-- 4. Agregar columna tenant_id a la tabla products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Asignar los 29 productos existentes al tenant demo
UPDATE public.products 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

-- Índice para búsquedas ultrarrápidas de productos por tienda
CREATE INDEX IF NOT EXISTS idx_products_tenant ON public.products(tenant_id);

-- 5. Agregar tenant_id y custom_settings a la tabla store_config
ALTER TABLE public.store_config 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

ALTER TABLE public.store_config 
ADD COLUMN IF NOT EXISTS custom_settings JSONB DEFAULT '{}'::jsonb;

-- Asignar la configuración actual al tenant demo
UPDATE public.store_config 
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE id = 'default' AND tenant_id IS NULL;

-- 6. Crear tabla de cotizaciones e historial de leads (Quotations / Leads CRM)
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    trade_in_model TEXT NOT NULL,
    trade_in_storage TEXT NOT NULL,
    battery_percentage INTEGER,
    screen_status TEXT,
    body_status TEXT,
    face_id_working BOOLEAN,
    has_box_cable BOOLEAN,
    estimated_value_usd NUMERIC NOT NULL,
    target_product_id TEXT,
    target_product_name TEXT,
    difference_to_pay_usd NUMERIC,
    usd_to_ars_rate NUMERIC,
    difference_to_pay_ars NUMERIC,
    status TEXT DEFAULT 'quoted', -- 'quoted' (calculado en web) | 'whatsapp_sent' (enviado por chat)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'quotations' AND policyname = 'Allow public insert on quotations'
    ) THEN
        CREATE POLICY "Allow public insert on quotations" ON public.quotations FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'quotations' AND policyname = 'Allow public read on quotations'
    ) THEN
        CREATE POLICY "Allow public read on quotations" ON public.quotations FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'quotations' AND policyname = 'Allow public update on quotations'
    ) THEN
        CREATE POLICY "Allow public update on quotations" ON public.quotations FOR UPDATE USING (true);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_quotations_tenant ON public.quotations(tenant_id);

-- 7. Tabla Maestra Global de Dispositivos de Plan Canje (Master Trade-In Devices)
CREATE TABLE IF NOT EXISTS public.master_trade_in_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    capacities JSONB NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(brand, model)
);

ALTER TABLE public.master_trade_in_devices ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'master_trade_in_devices' AND policyname = 'Allow public read on master_trade_in_devices') THEN
        CREATE POLICY "Allow public read on master_trade_in_devices" ON public.master_trade_in_devices FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'master_trade_in_devices' AND policyname = 'Allow public insert on master_trade_in_devices') THEN
        CREATE POLICY "Allow public insert on master_trade_in_devices" ON public.master_trade_in_devices FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'master_trade_in_devices' AND policyname = 'Allow public update on master_trade_in_devices') THEN
        CREATE POLICY "Allow public update on master_trade_in_devices" ON public.master_trade_in_devices FOR UPDATE USING (true);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_master_canje_brand_order ON public.master_trade_in_devices(brand, display_order);

-- Población inicial del catálogo maestro de canje
INSERT INTO public.master_trade_in_devices (brand, model, capacities, display_order) VALUES
('Apple', 'iPhone 16 Pro Max', '[{"storage": "256GB", "basePriceUSD": 950}, {"storage": "512GB", "basePriceUSD": 1050}, {"storage": "1TB", "basePriceUSD": 1150}]'::jsonb, 1),
('Apple', 'iPhone 16 Pro', '[{"storage": "128GB", "basePriceUSD": 820}, {"storage": "256GB", "basePriceUSD": 900}, {"storage": "512GB", "basePriceUSD": 980}]'::jsonb, 2),
('Apple', 'iPhone 16 Plus', '[{"storage": "128GB", "basePriceUSD": 700}, {"storage": "256GB", "basePriceUSD": 780}]'::jsonb, 3),
('Apple', 'iPhone 16', '[{"storage": "128GB", "basePriceUSD": 650}, {"storage": "256GB", "basePriceUSD": 720}]'::jsonb, 4),
('Apple', 'iPhone 15 Pro Max', '[{"storage": "256GB", "basePriceUSD": 850}, {"storage": "512GB", "basePriceUSD": 930}, {"storage": "1TB", "basePriceUSD": 1000}]'::jsonb, 5),
('Apple', 'iPhone 15 Pro', '[{"storage": "128GB", "basePriceUSD": 720}, {"storage": "256GB", "basePriceUSD": 780}, {"storage": "512GB", "basePriceUSD": 840}]'::jsonb, 6),
('Apple', 'iPhone 15 Plus', '[{"storage": "128GB", "basePriceUSD": 600}, {"storage": "256GB", "basePriceUSD": 660}]'::jsonb, 7),
('Apple', 'iPhone 15', '[{"storage": "128GB", "basePriceUSD": 540}, {"storage": "256GB", "basePriceUSD": 600}]'::jsonb, 8),
('Apple', 'iPhone 14 Pro Max', '[{"storage": "128GB", "basePriceUSD": 660}, {"storage": "256GB", "basePriceUSD": 710}, {"storage": "512GB", "basePriceUSD": 760}]'::jsonb, 9),
('Apple', 'iPhone 14 Pro', '[{"storage": "128GB", "basePriceUSD": 570}, {"storage": "256GB", "basePriceUSD": 620}, {"storage": "512GB", "basePriceUSD": 670}]'::jsonb, 10),
('Apple', 'iPhone 14 Plus', '[{"storage": "128GB", "basePriceUSD": 460}, {"storage": "256GB", "basePriceUSD": 510}]'::jsonb, 11),
('Apple', 'iPhone 14', '[{"storage": "128GB", "basePriceUSD": 420}, {"storage": "256GB", "basePriceUSD": 470}]'::jsonb, 12),
('Apple', 'iPhone 13 Pro Max', '[{"storage": "128GB", "basePriceUSD": 510}, {"storage": "256GB", "basePriceUSD": 560}, {"storage": "512GB", "basePriceUSD": 610}]'::jsonb, 13),
('Apple', 'iPhone 13 Pro', '[{"storage": "128GB", "basePriceUSD": 440}, {"storage": "256GB", "basePriceUSD": 490}, {"storage": "512GB", "basePriceUSD": 530}]'::jsonb, 14),
('Apple', 'iPhone 13', '[{"storage": "128GB", "basePriceUSD": 360}, {"storage": "256GB", "basePriceUSD": 410}]'::jsonb, 15),
('Apple', 'iPhone 12 Pro Max', '[{"storage": "128GB", "basePriceUSD": 390}, {"storage": "256GB", "basePriceUSD": 430}]'::jsonb, 16),
('Apple', 'iPhone 12 Pro', '[{"storage": "128GB", "basePriceUSD": 330}, {"storage": "256GB", "basePriceUSD": 370}]'::jsonb, 17),
('Apple', 'iPhone 12', '[{"storage": "64GB", "basePriceUSD": 240}, {"storage": "128GB", "basePriceUSD": 280}]'::jsonb, 18),
('Apple', 'iPhone 11', '[{"storage": "64GB", "basePriceUSD": 170}, {"storage": "128GB", "basePriceUSD": 210}]'::jsonb, 19),
('Samsung', 'Galaxy S23 Ultra', '[{"storage": "256GB", "basePriceUSD": 580}, {"storage": "512GB", "basePriceUSD": 640}]'::jsonb, 20),
('Samsung', 'Galaxy S23 Plus', '[{"storage": "256GB", "basePriceUSD": 420}]'::jsonb, 21),
('Samsung', 'Galaxy S23', '[{"storage": "128GB", "basePriceUSD": 350}, {"storage": "256GB", "basePriceUSD": 390}]'::jsonb, 22),
('Samsung', 'Galaxy S22 Ultra', '[{"storage": "128GB", "basePriceUSD": 380}, {"storage": "256GB", "basePriceUSD": 420}]'::jsonb, 23)
ON CONFLICT (brand, model) DO NOTHING;


