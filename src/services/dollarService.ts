export interface DollarBlueResponse {
  compra: number;
  venta: number;
  fechaActualizacion: string;
  source: string;
}

/**
 * Consulta la cotización en vivo del Dólar Blue (precio de venta)
 * Utiliza DolarAPI con fallback a Bluelytics
 */
export async function fetchLiveDollarBlue(): Promise<DollarBlueResponse> {
  try {
    // Intento 1: DolarAPI (Oficial y más rápida)
    const res = await fetch('https://dolarapi.com/v1/dolares/blue', {
      headers: { Accept: 'application/json' },
      cache: 'no-cache'
    });

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.venta === 'number') {
        return {
          compra: data.compra,
          venta: data.venta,
          fechaActualizacion: data.fechaActualizacion || new Date().toISOString(),
          source: 'DolarAPI'
        };
      }
    }
  } catch (error) {
    console.warn('Fallo DolarAPI, intentando endpoint de respaldo...', error);
  }

  // Intento 2: Bluelytics (Respaldo)
  try {
    const resBackup = await fetch('https://api.bluelytics.com.ar/v2/latest', {
      headers: { Accept: 'application/json' },
      cache: 'no-cache'
    });

    if (resBackup.ok) {
      const dataBackup = await resBackup.json();
      if (dataBackup?.blue?.value_sell) {
        return {
          compra: dataBackup.blue.value_buy,
          venta: dataBackup.blue.value_sell,
          fechaActualizacion: dataBackup.last_update || new Date().toISOString(),
          source: 'Bluelytics'
        };
      }
    }
  } catch (error) {
    console.error('No se pudo conectar a los servicios de cotización del dólar', error);
  }

  throw new Error('No se pudo obtener la cotización del dólar en vivo.');
}
