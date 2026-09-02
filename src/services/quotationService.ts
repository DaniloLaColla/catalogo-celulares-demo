import { supabase, isSupabaseConfigured } from './supabaseClient';
import { QuotationLead } from '../types';
import { DEFAULT_TENANT } from './tenantService';

/**
 * Guarda una nueva cotización realizada por un cliente en la web
 */
export async function saveQuotation(lead: QuotationLead): Promise<string | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const payload = {
      tenant_id: lead.tenantId || DEFAULT_TENANT.id,
      trade_in_model: lead.tradeInModel,
      trade_in_storage: lead.tradeInStorage,
      battery_percentage: lead.batteryPercentage ?? null,
      screen_status: lead.screenStatus || 'intacta',
      body_status: lead.bodyStatus || 'impecable',
      face_id_working: lead.faceIdWorking !== false,
      has_box_cable: Boolean(lead.hasBoxCable),
      estimated_value_usd: lead.estimatedValueUSD,
      target_product_id: lead.targetProductId || null,
      target_product_name: lead.targetProductName || null,
      difference_to_pay_usd: lead.differenceToPayUSD ?? null,
      usd_to_ars_rate: lead.usdToArsRate ?? null,
      difference_to_pay_ars: lead.differenceToPayARS ?? null,
      status: lead.status || 'quoted'
    };

    const { data, error } = await supabase
      .from('quotations')
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      console.warn('No se pudo guardar la cotización en Supabase (tabla quotations aún no migrada o error):', error.message);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.warn('Error al registrar cotización:', err);
    return null;
  }
}

/**
 * Marca una cotización como enviada a WhatsApp cuando el cliente hace clic en el CTA
 */
export async function markQuotationWhatsAppSent(quotationId: string): Promise<void> {
  if (!isSupabaseConfigured || !quotationId) return;

  try {
    await supabase
      .from('quotations')
      .update({ status: 'whatsapp_sent' })
      .eq('id', quotationId);
  } catch (err) {
    console.warn('Error al actualizar estado de cotización:', err);
  }
}

/**
 * Obtiene las cotizaciones históricas para el panel de administración
 */
export async function getQuotationsByTenant(tenantId: string): Promise<QuotationLead[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('tenant_id', tenantId || DEFAULT_TENANT.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      tenantId: row.tenant_id,
      tradeInModel: row.trade_in_model,
      tradeInStorage: row.trade_in_storage,
      batteryPercentage: row.battery_percentage,
      screenStatus: row.screen_status,
      bodyStatus: row.body_status,
      faceIdWorking: row.face_id_working,
      hasBoxCable: row.has_box_cable,
      estimatedValueUSD: Number(row.estimated_value_usd),
      targetProductId: row.target_product_id,
      targetProductName: row.target_product_name,
      differenceToPayUSD: row.difference_to_pay_usd ? Number(row.difference_to_pay_usd) : undefined,
      usdToArsRate: row.usd_to_ars_rate ? Number(row.usd_to_ars_rate) : undefined,
      differenceToPayARS: row.difference_to_pay_ars ? Number(row.difference_to_pay_ars) : undefined,
      status: row.status as 'quoted' | 'whatsapp_sent',
      createdAt: row.created_at
    }));
  } catch (err) {
    console.warn('Error al obtener cotizaciones:', err);
    return [];
  }
}
