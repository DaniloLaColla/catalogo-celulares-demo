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

¡Hola! Me interesa este equipo y quería consultarles disponibilidad:

📱 *Producto:* ${product.name} (${product.productType.toUpperCase()})
💾 *Capacidad:* ${storage}
🎨 *Color:* ${color}
${batteryText}
🛡️ *Garantía:* ${product.warranty}

💵 *Precio:* $${product.priceUSD} USD${arsTotal}
${config.showArsPrice ? '\nℹ️ _El importe en ARS es estimativo y se calcula al valor del Dólar Blue al momento del pago._\n' : ''}
📍 *Puntos de Entrega:*
${deliveryOptions}

¿Sigue disponible? Me gustaría conocer más detalles.`;

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

    const targetBatteryText = isUsado
      ? `🔋 *Batería del equipo:* ${targetProduct.batteryPercentage || 90}% (Original)`
      : `📦 *Condición:* Nuevo Sellado (Batería 100% / 0 Ciclos)`;

    const isManual = config.canjeMode === 'manual';

    let message = '';

    const batteryStr = tradeInState?.batteryUnknown
      ? 'A verificar en peritaje'
      : tradeInState?.batteryPercentage
      ? `${tradeInState.batteryPercentage}%`
      : 'A verificar';

    const screenLabel = tradeInState?.screenStatus === 'intacta' 
      ? 'Impecable (Sin rayas)' 
      : tradeInState?.screenStatus === 'microrayones' 
      ? 'Microrayones de uso' 
      : tradeInState?.screenStatus === 'rajada' 
      ? 'Rajada / Rota' 
      : tradeInState?.screenStatus || 'Estándar';

    const faceIdLabel = tradeInState?.faceIdWorking ? '100% Funcional' : 'Presenta fallas';
    const boxStr = tradeInState?.hasBoxAndCable ? 'Sí (Caja y cable original)' : 'Solo equipo';

    if (isManual && tradeInState) {
      message = 
`🔄 *CONSULTA PLAN CANJE | ${config.storeName}* 🔄

¡Hola! Completé el diagnóstico en la web para entregar mi equipo usado en parte de pago:

🎯 *EQUIPO QUE DESEO LLEVAR:*
📱 *Modelo:* ${targetProduct.name} (${targetProduct.productType.toUpperCase()} - ${storage} - ${color})
${targetBatteryText}
🛡️ *Garantía:* ${targetProduct.warranty}
💵 *Precio de Lista:* $${targetProduct.priceUSD} USD

📦 *MI EQUIPO ACTUAL (A ENTREGAR):*
📲 *Modelo:* ${tradeInState.brand} ${tradeInState.model} (${tradeInState.storage})
🔋 *Batería de mi equipo:* ${batteryStr}
✨ *Pantalla:* ${screenLabel}
🛡️ *Biometría (Face ID / Huella):* ${faceIdLabel}
📦 *Caja y Accesorios:* ${boxStr}

📸 Adjunto fotos de mi equipo para que me pasen la cotización final y la diferencia a abonar. ¿Cómo coordinamos?`;
    } else {
      const realDifferenceUSD = Math.max(0, targetProduct.priceUSD - evaluation.estimatedValueUSD);
      const arsDiff = config.showArsPrice
        ? ` (~$${(realDifferenceUSD * config.usdToArsRate).toLocaleString('es-AR')} ARS)`
        : '';

      const tradeInName = tradeInState 
        ? `${tradeInState.brand} ${tradeInState.model}` 
        : evaluation.tradeInModel;

      const tradeInCap = tradeInState?.storage || evaluation.tradeInStorage;

      message = 
`🔄 *CONSULTA PLAN CANJE | ${config.storeName}* 🔄

¡Hola! Quería consultar por el Plan Canje para entregar mi usado y llevar este equipo:

🎯 *EQUIPO QUE DESEO LLEVAR:*
📱 *Modelo:* ${targetProduct.name} (${targetProduct.productType.toUpperCase()} - ${storage} - ${color})
${targetBatteryText}
🛡️ *Garantía:* ${targetProduct.warranty}
💵 *Valor Lista:* $${targetProduct.priceUSD} USD

📦 *MI EQUIPO ACTUAL (A ENTREGAR):*
📲 *Modelo:* ${tradeInName} (${tradeInCap})
🔋 *Batería de mi equipo:* ${batteryStr}
✨ *Pantalla:* ${screenLabel}
🛡️ *Biometría:* ${faceIdLabel}
📦 *Caja y Accesorios:* ${boxStr}
💰 *Toma Estimada:* $${evaluation.estimatedValueUSD} USD

───────────────────────────
✨ *DIFERENCIA ESTIMADA:* *$${realDifferenceUSD} USD*${arsDiff}
───────────────────────────
${config.showArsPrice ? 'ℹ️ _El importe en ARS se ajusta a la cotización del Dólar Blue al concretar la operación._\n' : ''}
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

    const screenLabel = tradeInState?.screenStatus === 'intacta' 
      ? 'Impecable (Sin rayas)' 
      : tradeInState?.screenStatus === 'microrayones' 
      ? 'Microrayones de uso' 
      : tradeInState?.screenStatus === 'rajada' 
      ? 'Rajada / Rota' 
      : tradeInState?.screenStatus || 'Estándar';

    const faceIdLabel = tradeInState?.faceIdWorking ? '100% Funcional' : 'Presenta fallas';

    const tradeInName = tradeInState 
      ? `${tradeInState.brand} ${tradeInState.model}` 
      : evaluation.tradeInModel;

    const tradeInCap = tradeInState?.storage || evaluation.tradeInStorage;

    let message = '';

    if (isManual && tradeInState) {
      message = 
`🔄 *COTIZACIÓN PLAN CANJE | ${config.storeName}* 🔄

¡Hola! Quiero consultar cuánto me toman mi equipo en parte de pago:

📲 *Equipo:* ${tradeInName} (${tradeInCap})
🔋 *Salud de Batería de mi equipo:* ${batteryStr}
✨ *Pantalla:* ${screenLabel}
🛡️ *Biometría (Face ID / Huella):* ${faceIdLabel}
📦 *Caja y Accesorios:* ${boxStr}

📸 Adjunto fotos de mi equipo para recibir la cotización de un asesor comercial.`;
    } else {
      message = 
`🔄 *COTIZACIÓN PLAN CANJE | ${config.storeName}* 🔄

¡Hola! Quería consultar por la cotización de mi equipo en el Plan Canje:

📲 *Equipo a entregar:* ${tradeInName} (${tradeInCap})
🔋 *Batería de mi equipo:* ${batteryStr}
✨ *Pantalla:* ${screenLabel}
🛡️ *Biometría:* ${faceIdLabel}
📦 *Caja y Accesorios:* ${boxStr}
💰 *Valuación estimada en la web:* $${evaluation.estimatedValueUSD} USD

📸 Adjunto fotos del equipo para verificar el estado. ¿Qué opciones tienen disponibles en stock para entregar este equipo en parte de pago?`;
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
