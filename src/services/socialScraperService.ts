/**
 * Servicio para extraer TODAS las fotos de un carrusel o publicación
 * llamando a la Serverless Function de la tienda.
 */
export async function scrapePhotosFromLink(url: string): Promise<string[]> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    throw new Error('Por favor ingresa un enlace válido.');
  }

  // 1. Llamar a nuestro endpoint backend serverless /api/extract-photos
  try {
    const res = await fetch(`/api/extract-photos?url=${encodeURIComponent(cleanUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.images) && data.images.length > 0) {
        return data.images;
      }
    }
  } catch (backendErr) {
    console.warn('Endpoint /api/extract-photos no disponible, intentando fallback...', backendErr);
  }

  // 2. Fallback directo a MicroLink en caso de ser necesario
  try {
    const microlinkEndpoint = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}`;
    const mlRes = await fetch(microlinkEndpoint);
    if (mlRes.ok) {
      const mlJson = await mlRes.json();
      if (mlJson.status === 'success' && mlJson.data) {
        const list: string[] = [];
        if (mlJson.data.image?.url) list.push(mlJson.data.image.url);
        if (Array.isArray(mlJson.data.images)) {
          mlJson.data.images.forEach((img: any) => {
            const u = typeof img === 'string' ? img : img?.url;
            if (u && !list.includes(u)) list.push(u);
          });
        }
        if (list.length > 0) return list;
      }
    }
  } catch (mlErr) {
    console.warn('MicroLink fallback fallo:', mlErr);
  }

  // Si es un enlace directo
  if (/\.(jpg|jpeg|png|webp|heic)(\?.*)?$/i.test(cleanUrl)) {
    return [cleanUrl];
  }

  throw new Error('No se pudieron extraer fotos automáticamente de este enlace. Puedes subir las fotos desde tu celular o PC.');
}
