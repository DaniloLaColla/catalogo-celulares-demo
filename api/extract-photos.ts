import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Serverless Function para extraer TODAS las fotos de publicaciones y carruseles
 * de Instagram, Facebook Marketplace, Facebook Posts y la Web sin CORS.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawUrl = (req.query.url as string) || (req.body && req.body.url);
  if (!rawUrl) {
    return res.status(400).json({ error: 'Falta el parámetro url.' });
  }

  try {
    const images = await extractAllImagesFromBackend(rawUrl);
    return res.status(200).json({
      success: true,
      count: images.length,
      images
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al extraer fotos.'
    });
  }
}

/**
 * Función central de extracción en Node.js
 */
export async function extractAllImagesFromBackend(rawUrl: string): Promise<string[]> {
  let cleanUrl = rawUrl.trim();
  const foundImages: string[] = [];

  const addImg = (src: string) => {
    if (!src || typeof src !== 'string') return;
    let s = src.trim();
    // Decodificar entidades HTML si vienen codificadas (&amp; -> &)
    s = s.replace(/&amp;/g, '&');
    if (!s.startsWith('http')) return;
    if (
      s.includes('avatar') || 
      s.includes('profile_pic') || 
      s.includes('150x150') || 
      s.includes('favicon') || 
      s.includes('emoji') ||
      s.includes('rsrc.php') ||
      s.includes('data:image')
    ) return;

    if (!foundImages.includes(s)) {
      foundImages.push(s);
    }
  };

  // ─── 0. SEGUIMIENTO DE REDIRECCIONES (Especial para links de Facebook /share/) ───
  if (cleanUrl.includes('facebook.com/share/')) {
    try {
      const redirectRes = await fetch(cleanUrl, {
        method: 'HEAD',
        redirect: 'follow',
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
        }
      });
      if (redirectRes.url && redirectRes.url !== cleanUrl) {
        cleanUrl = redirectRes.url;
      }
    } catch {
      // Continuar con cleanUrl
    }
  }

  // ─── 1. INSTAGRAM CAROUSEL & MULTI-PHOTO EXTRACTOR ───
  const igMatch = cleanUrl.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch && igMatch[1]) {
    const shortcode = igMatch[1];

    // Intento A: Instagram __a=1 con App ID oficial
    try {
      const igApiUrl = `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`;
      const igRes = await fetch(igApiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'X-IG-App-ID': '936619743392459',
          'Accept': '*/*',
          'Sec-Fetch-Mode': 'cors',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      if (igRes.ok) {
        const data = await igRes.json();
        const item = data?.items?.[0] || data?.graphql?.shortcode_media;

        if (item?.carousel_media && Array.isArray(item.carousel_media)) {
          item.carousel_media.forEach((c: any) => {
            const bestImage = c.image_versions2?.candidates?.[0]?.url || c.display_url;
            if (bestImage) addImg(bestImage);
          });
        } else if (item?.edge_sidecar_to_children?.edges) {
          item.edge_sidecar_to_children.edges.forEach((edge: any) => {
            const bestImage = edge.node?.display_url || edge.node?.display_resources?.[edge.node.display_resources.length - 1]?.src;
            if (bestImage) addImg(bestImage);
          });
        } else {
          const single = item?.image_versions2?.candidates?.[0]?.url || item?.display_url;
          if (single) addImg(single);
        }
      }
    } catch (err) {
      console.warn('Instagram API interna fallo, probando mirrors...', err);
    }

    // Intento B: VxInstagram mirror
    if (foundImages.length === 0) {
      try {
        const vxUrl = `https://api.vxinstagram.com/p/${shortcode}`;
        const vxRes = await fetch(vxUrl);
        if (vxRes.ok) {
          const vxData = await vxRes.json();
          if (Array.isArray(vxData.media)) {
            vxData.media.forEach((m: any) => {
              if (m.url && m.type === 'image') addImg(m.url);
            });
          } else if (vxData.media_url) {
            addImg(vxData.media_url);
          }
        }
      } catch (vxErr) {
        console.warn('VxInstagram mirror fallo...', vxErr);
      }
    }
  }

  // ─── 2. FACEBOOK & MARKETPLACE EXTRACTOR ───
  if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.me') || cleanUrl.includes('fb.watch')) {
    // Intento A: Scraping con User-Agent de WhatsApp/Facebook crawler (Meta entrega el OpenGraph real sin login)
    try {
      const fbRes = await fetch(cleanUrl, {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'es-LA,es;q=0.9,en;q=0.8'
        }
      });

      if (fbRes.ok) {
        const html = await fbRes.text();

        // Extraer etiquetas og:image
        const ogImageMatches = html.matchAll(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/gi);
        for (const m of ogImageMatches) {
          if (m[1]) addImg(m[1]);
        }

        const secureImageMatches = html.matchAll(/<meta\s+property=["']og:image:secure_url["']\s+content=["'](.*?)["']/gi);
        for (const m of secureImageMatches) {
          if (m[1]) addImg(m[1]);
        }

        // Buscar imágenes en CDNs de Facebook (scontent / fbcdn) en alta resolución
        const cdnMatches = html.matchAll(/(https:\/\/(?:scontent|scontent-[a-z0-9-]+|external-[a-z0-9-]+)\.xx\.fbcdn\.net\/[^\s"'>\\]+)/gi);
        for (const m of cdnMatches) {
          if (m[1]) addImg(m[1]);
        }
      }
    } catch (fbErr) {
      console.warn('Facebook crawler scraping fallo...', fbErr);
    }
  }

  // ─── 3. MICROLINK API HEADLESS BROWSER (Para Facebook, Marketplace o Webs) ───
  if (foundImages.length === 0) {
    try {
      const mlUrl = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}`;
      const mlRes = await fetch(mlUrl);
      if (mlRes.ok) {
        const mlData = await mlRes.json();
        if (mlData.status === 'success' && mlData.data) {
          if (mlData.data.image?.url) addImg(mlData.data.image.url);
          if (Array.isArray(mlData.data.images)) {
            mlData.data.images.forEach((img: any) => {
              const u = typeof img === 'string' ? img : img?.url;
              if (u) addImg(u);
            });
          }
        }
      }
    } catch (mlErr) {
      console.warn('MicroLink fallback fallo...', mlErr);
    }
  }

  if (foundImages.length === 0) {
    throw new Error('No se pudieron extraer fotos de este enlace de Facebook/Instagram. Sube las fotos desde tu celular o PC.');
  }

  return Array.from(new Set(foundImages));
}
