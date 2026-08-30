import { Product, CanjeEvaluationResult, CanjeTradeInState, StoreConfig } from '../types';

export function useWhatsAppCheckout(config: StoreConfig) {
  const cleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');

  /**
   * Compra Directa Express (2 clics)
   */
  const buyDirectProduct = (
    product: Product,
    selectedStorage?: string,
    selectedColor?: string
  ) => {
    const storage = selectedStorage || product.storageOptions[0] || 'Base';
    const isUsado = product.productType === 'Usado';
    const color = isUsado
      ? (product.colorOptions[0]?.name || 'Color publicado')
      : (selectedColor || product.colorOptions[0]?.name || 'Estándar');

    const phone = cleanPhone(config.whatsappNumber);

    const arsTotal = config.showArsPrice
      ? ` (~$${(product.priceUSD * config.usdToArsRate).toLocaleString('es-AR')} ARS)`
      : '';

    const batteryText = isUsado 
      ? `🔋 *Salud de Batería:* ${product.batteryPercentage || 90}% (Original)`
      : `📦 *Condición:* Nuevo Sellado (0 Ciclos)`;

    const deliveryOptions = config.deliveryLocations && config.deliveryLocations.length > 0
      ? config.deliveryLocations.map((l, i) => `   ${i+1}. ${l}`).join('\n')
      : '   - Retiro en showroom o Envío a domicilio';

    const message = 
`⚡ *CONSULTA DE DISPONIBILIDAD | ${config.storeName}* ⚡

¡Hola! Quería consultar disponibilidad para coordinar este equipo:

📱 *Producto:* ${product.name} (${product.productType.toUpperCase()})
💾 *Capacidad:* ${storage}
🎨 *Color:* ${color}
${batteryText}
🛡️ *Garantía:* ${product.warranty}

💵 *Precio Final:* $${product.priceUSD} USD${arsTotal}

📍 *Punto de Retiro / Entrega:*
${deliveryOptions}

¿Tienen disponibilidad para coordinar hoy mismo?`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, '_blank');
  };

  /**
   * Compra con Plan Canje Aplicado (2 clics)
   */
  const buyWithPlanCanje = (
    evaluation: CanjeEvaluationResult,
    targetProduct: Product,
    tradeInState?: CanjeTradeInState,
    selectedStorage?: string,
    selectedColor?: string
  ) => {
    const phone = cleanPhone(config.whatsappNumber);
    const storage = selectedStorage || targetProduct.storageOptions[0] || 'Base';
    const isUsado = targetProduct.productType === 'Usado';
    const color = isUsado
      ? (targetProduct.colorOptions[0]?.name || 'Color publicado')
      : (selectedColor || targetProduct.colorOptions[0]?.name || 'Estándar');

    const isManual = config.canjeMode === 'manual';

    let message = '';

    const batteryStr = tradeInState?.batteryUnknown
      ? 'A verificar en peritaje'
      : tradeInState?.batteryPercentage
      ? `${tradeInState.batteryPercentage}%`
      : 'A verificar';

    const boxStr = tradeInState?.hasBoxAndCable ? 'Sí (Caja y cable)' : 'Solo equipo';

    if (isManual && tradeInState) {
      message = 
`🔄 *CONSULTA PLAN CANJE | ${config.storeName}* 🔄

¡Hola! Completé el diagnóstico en la web para entregar mi equipo usado en parte de pago:

🎯 *EQUIPO QUE DESEO LLEVAR:*
📱 *Modelo:* ${targetProduct.name} (${targetProduct.productType.toUpperCase()} - ${storage} - ${color})
💵 *Precio de Lista:* $${targetProduct.priceUSD} USD

📦 *MI EQUIPO ACTUAL (A ENTREGAR):*
📲 *Modelo:* ${tradeInState.brand} ${tradeInState.model} (${tradeInState.storage})
🔋 *Batería:* ${batteryStr}
✨ *Pantalla:* ${tradeInState.screenStatus}
🛡️ *Biometría (Face ID / Huella):* ${tradeInState.faceIdWorking ? '100% Funcional' : 'Presenta fallas'}
📦 *Caja y Accesorios:* ${boxStr}

📸 Adjunto fotos de mi equipo para que me pasen la cotización final y la diferencia a abonar. ¿Cómo coordinamos?`;
    } else {
      const arsDiff = config.showArsPrice
        ? ` (~$${(evaluation.differenceToPayUSD * config.usdToArsRate).toLocaleString('es-AR')} ARS)`
        : '';

      message = 
`🔄 *CONSULTA PLAN CANJE | ${config.storeName}* 🔄

¡Hola! Quería consultar por el Plan Canje para llevar este equipo:

🎯 *EQUIPO QUE DESEO LLEVAR:*
📱 *Modelo:* ${targetProduct.name} (${targetProduct.productType.toUpperCase()} - ${storage} - ${color})
🛡️ *Garantía:* ${targetProduct.warranty}
💵 *Valor Lista:* $${targetProduct.priceUSD} USD

📦 *MI EQUIPO ACTUAL (A ENTREGAR):*
📲 *Modelo:* ${evaluation.tradeInModel} (${evaluation.tradeInStorage})
🔋 *Batería:* ${batteryStr}
💰 *Toma Estimada:* $${evaluation.estimatedValueUSD} USD

───────────────────────────
✨ *DIFERENCIA ESTIMADA:* *$${evaluation.differenceToPayUSD} USD*${arsDiff}
───────────────────────────

📸 Adjunto fotos de mi equipo para verificar el estado. ¿Cuándo podemos coordinar la revisión y entrega?`;
    }

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, '_blank');
  };

  /**
   * Consulta General o Cotización Suelta de Plan Canje
   */
  const consultGeneralCanje = (evaluation: CanjeEvaluationResult, tradeInState?: CanjeTradeInState) => {
    const phone = cleanPhone(config.whatsappNumber);
    const isManual = config.canjeMode === 'manual';

    const batteryStr = tradeInState?.batteryUnknown
      ? 'A verificar en peritaje'
      : tradeInState?.batteryPercentage
      ? `${tradeInState.batteryPercentage}%`
      : 'A verificar';

    const boxStr = tradeInState?.hasBoxAndCable ? 'Sí (Caja y cable original)' : 'Solo equipo';

    let message = '';

    if (isManual && tradeInState) {
      message = 
`🔄 *COTIZACIÓN PLAN CANJE | ${config.storeName}* 🔄

¡Hola! Quiero consultar cuánto me toman mi equipo en parte de pago:

📲 *Equipo:* ${tradeInState.brand} ${tradeInState.model} (${tradeInState.storage})
🔋 *Salud de Batería:* ${batteryStr}
✨ *Pantalla:* ${tradeInState.screenStatus}
📦 *Caja y Cable:* ${boxStr}

📸 Adjunto fotos para recibir la cotización de un asesor.`;
    } else {
      message = 
`🔄 *COTIZACIÓN PLAN CANJE | ${config.storeName}* 🔄

¡Hola! Quería consultar por la cotización de mi equipo en el Plan Canje:

📲 *Equipo a entregar:* ${evaluation.tradeInModel} (${evaluation.tradeInStorage})
🔋 *Batería:* ${batteryStr}
💰 *Valuación estimada en la web:* $${evaluation.estimatedValueUSD} USD

📸 Adjunto fotos del equipo. ¿Qué opciones tienen disponibles en stock para entregar este equipo en parte de pago?`;
    }

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, '_blank');
  };

  return {
    buyDirectProduct,
    buyWithPlanCanje,
    consultGeneralCanje
  };
}
