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
`⚡ *NUEVO PEDIDO DIRECTO | ${config.storeName}* ⚡

Hola! Quiero coordinar la compra de este equipo:

📱 *Producto:* ${product.name} (${product.productType.toUpperCase()})
💾 *Capacidad:* ${storage}
🎨 *Color:* ${color}
${batteryText}
🛡️ *Garantía:* ${product.warranty}

💵 *Precio Final:* $${product.priceUSD} USD${arsTotal}

📍 *Modalidad de Entrega que prefiero:*
${deliveryOptions}

💳 *Forma de Pago:* [Efectivo USD / USDT / Transferencia]

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
      ? 'Desconocida (A peritar por el vendedor)'
      : tradeInState?.batteryPercentage
      ? `${tradeInState.batteryPercentage}%`
      : 'A verificar';

    const boxStr = tradeInState?.hasBoxAndCable ? 'Sí (Caja y cable original)' : 'No';

    if (isManual && tradeInState) {
      message = 
`🔄 *SOLICITUD DE COTIZACIÓN PLAN CANJE | ${config.storeName}* 🔄

Hola! Completé el diagnóstico en la web para entregar mi equipo usado:

📲 *EQUIPO QUE ENTREGO:*
• *Modelo:* ${tradeInState.brand} ${tradeInState.model} (${tradeInState.storage})
• *Salud de Batería:* ${batteryStr}
• *Estado de Pantalla:* ${tradeInState.screenStatus}
• *Face ID / Biometría:* ${tradeInState.faceIdWorking ? '100% Operativo' : 'No funciona'}
• *Caja y Accesorios:* ${boxStr}

🎯 *EQUIPO QUE QUIERO LLEVAR:*
• *Modelo:* ${targetProduct.name} (${targetProduct.productType} - ${storage} - ${color})
• *Precio de Lista:* $${targetProduct.priceUSD} USD

📸 *Adjunto fotos de mi equipo para recibir la cotización y saber la diferencia.*

¿Cuánto me tomarían mi equipo para coordinar el canje?`;
    } else {
      const arsDiff = config.showArsPrice
        ? ` (~$${(evaluation.differenceToPayUSD * config.usdToArsRate).toLocaleString('es-AR')} ARS)`
        : '';

      message = 
`🔄 *COTIZACIÓN PLAN CANJE | ${config.storeName}* 🔄

Hola! Quiero canjear mi equipo por este modelo del catálogo:

🎯 *EQUIPO QUE DESEO LLEVAR:*
📱 *Modelo:* ${targetProduct.name} (${targetProduct.productType} - ${storage} - ${color})
🛡️ *Garantía:* ${targetProduct.warranty}
💵 *Valor Lista:* $${targetProduct.priceUSD} USD

📦 *EQUIPO QUE ENTREGO EN PARTE DE PAGO:*
📲 *Modelo:* ${evaluation.tradeInModel} ${evaluation.tradeInStorage}
🔋 *Batería:* ${batteryStr}
💰 *Cotización Estimada de Toma:* $${evaluation.estimatedValueUSD} USD

───────────────────────────
✨ *DIFERENCIA A ABONAR:* *$${evaluation.differenceToPayUSD} USD*${arsDiff}
───────────────────────────

📍 *Punto de retiro o zona de entrega:* [Escribir aquí]
📸 *Adjunto fotos de mi equipo para confirmar el estado.*

¿Cuándo podemos realizar el peritaje y coordinar el canje?`;
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
      ? 'Desconocida (A peritar por el vendedor)'
      : tradeInState?.batteryPercentage
      ? `${tradeInState.batteryPercentage}%`
      : 'A verificar';

    const boxStr = tradeInState?.hasBoxAndCable ? 'Sí (Caja y cable original)' : 'No';

    let message = '';

    if (isManual && tradeInState) {
      message = 
`🔄 *COTIZACIÓN DE PLAN CANJE | ${config.storeName}* 🔄

Hola! Quiero consultar cuánto me toman mi equipo en parte de pago:

📲 *Equipo:* ${tradeInState.brand} ${tradeInState.model} (${tradeInState.storage})
🔋 *Salud de Batería:* ${batteryStr}
✨ *Pantalla:* ${tradeInState.screenStatus}
📦 *Caja y Cable:* ${boxStr}

📸 *Adjunto fotos para recibir la cotización de un asesor comercial.*`;
    } else {
      message = 
`🔄 *CONSULTA COTIZACIÓN PLAN CANJE | ${config.storeName}* 🔄

Hola! Quería consultar por el Plan Canje para mi dispositivo:

📲 *Equipo a entregar:* ${evaluation.tradeInModel} ${evaluation.tradeInStorage}
🔋 *Batería:* ${batteryStr}
💰 *Valuación estimada en la web:* $${evaluation.estimatedValueUSD} USD

¿Qué opciones disponibles tienen en stock para entregar este equipo como parte de pago?`;
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
