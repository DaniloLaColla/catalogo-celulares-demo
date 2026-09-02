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

