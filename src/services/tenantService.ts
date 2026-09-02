import { Tenant } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const DEFAULT_TENANT: Tenant = {
  id: '00000000-0000-0000-0000-000000000001',
  slug: 'demo',
  name: 'TestStore',
  isActive: true
};

/**
 * Resuelve el slug de la tienda actual según variables de entorno, parámetros de URL o subdominio
 */
export function resolveCurrentTenantSlug(): string {
  // 1. Variable de entorno configurada en Vercel por cliente
  const envSlug = import.meta.env.VITE_TENANT_SLUG;
  if (envSlug && typeof envSlug === 'string' && envSlug.trim() !== '') {
    return envSlug.trim().toLowerCase();
  }

  // 2. Parámetro de URL (?tienda=nombre o ?t=nombre)
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const querySlug = urlParams.get('tienda') || urlParams.get('t');
    if (querySlug && querySlug.trim() !== '') {
      return querySlug.trim().toLowerCase();
    }

    // 3. Subdominio (ej: applepoint.mitienda.app)
    const hostname = window.location.hostname;
    // Excluir localhost, ip o dominios raíz
    if (hostname && !hostname.includes('localhost') && !hostname.startsWith('127.') && !hostname.startsWith('192.')) {
      const parts = hostname.split('.');
      if (parts.length > 2 && parts[0] !== 'www') {
        return parts[0].toLowerCase();
      }
    }
  }

  // 4. Fallback por defecto
  return 'demo';
}

/**
 * Obtiene la información del tenant desde Supabase
 */
export async function getTenantBySlug(slug: string): Promise<Tenant> {
  if (!isSupabaseConfigured) {
    return { ...DEFAULT_TENANT, slug };
  }

  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', slug)
      .single();

    if (data && !error) {
      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        customDomain: data.custom_domain || undefined,
        isActive: Boolean(data.is_active),
        createdAt: data.created_at
      };
    }
  } catch (err) {
    console.warn('Tabla tenants no disponible aún, usando fallback:', err);
  }

  // Fallback seguro si la tabla aún no existe o el slug no fue hallado
  return { ...DEFAULT_TENANT, slug };
}
