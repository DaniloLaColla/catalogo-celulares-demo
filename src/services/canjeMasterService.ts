import { supabase, isSupabaseConfigured } from './supabaseClient';
import { SupportedTradeInDevice } from '../types';
import { SUPPORTED_TRADE_IN_DEVICES, setMasterTradeInDevicesCache } from '../data/canjeValuation';

/**
 * Carga la lista maestra de dispositivos de canje desde Supabase Cloud.
 * Si no está disponible, utiliza el catálogo local como fallback.
 */
export async function loadMasterTradeInDevices(): Promise<SupportedTradeInDevice[]> {
  if (!isSupabaseConfigured) return SUPPORTED_TRADE_IN_DEVICES;

  try {
    const { data, error } = await supabase
      .from('master_trade_in_devices')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (data && !error && data.length > 0) {
      const devices = data.map((d: any) => ({
        brand: d.brand,
        model: d.model,
        capacities: d.capacities || []
      }));
      setMasterTradeInDevicesCache(devices);
      return devices;
    }
  } catch (err) {
    console.warn('Tabla master_trade_in_devices no disponible aún, usando catálogo local:', err);
  }

  return SUPPORTED_TRADE_IN_DEVICES;
}

/**
 * Permite agregar o actualizar un modelo en la lista maestra central de Supabase
 */
export async function addMasterTradeInDevice(device: SupportedTradeInDevice, displayOrder: number = 0): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase
      .from('master_trade_in_devices')
      .upsert({
        brand: device.brand,
        model: device.model,
        capacities: device.capacities,
        display_order: displayOrder,
        is_active: true
      }, { onConflict: 'brand,model' });

    if (!error) {
      await loadMasterTradeInDevices();
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Error al guardar modelo en lista maestra:', err);
    return false;
  }
}
