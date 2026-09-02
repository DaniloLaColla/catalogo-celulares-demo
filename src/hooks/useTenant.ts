import { useState, useEffect } from 'react';
import { Tenant } from '../types';
import { resolveCurrentTenantSlug, getTenantBySlug, DEFAULT_TENANT } from '../services/tenantService';

export function useTenant() {
  const [tenant, setTenant] = useState<Tenant>(DEFAULT_TENANT);
  const [isTenantLoading, setIsTenantLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const slug = resolveCurrentTenantSlug();

    async function load() {
      setIsTenantLoading(true);
      try {
        const resolved = await getTenantBySlug(slug);
        if (isMounted) {
          setTenant(resolved);
        }
      } catch (e) {
        console.warn('Error resolviendo tenant:', e);
        if (isMounted) {
          setTenant({ ...DEFAULT_TENANT, slug });
        }
      } finally {
        if (isMounted) {
          setIsTenantLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    tenant,
    isTenantLoading
  };
}
