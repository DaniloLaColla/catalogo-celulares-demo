const sharp = require('sharp');
const path = require('path');

async function processImages() {
  console.log('Procesando logo e imágenes de iStore Regina...');

  // Medidas exactas detectadas matemáticamente del emblema circular en logo-badge.jpg:
  // Centro real: X=509, Y=466.5 | Ancho=852, Alto=851 | Radio exterior=426
  const extractSize = 854;
  const left = 82;
  const top = 39;
  const maskCx = 427;
  const maskCy = 427.5;
  const maskRadius = 425; // Toma el anillo exterior blanco de forma 100% simétrica sin fondo gris

  const circleSvg = Buffer.from(
    '<svg width="500" height="500"><circle cx="250" cy="250" r="248" fill="#ffffff" /></svg>'
  );

  // 1. Extraer el cuadrado EXACTAMENTE centrado en el emblema (X=509, Y=466.5, diámetro=854)
  await sharp('public/tenants/istore-regina/logo-badge.jpg')
    .extract({ left: 82, top: 39, width: 854, height: 854 })
    .resize(500, 500)
    .composite([{
      input: circleSvg,
      blend: 'dest-in'
    }])
    .png()
    .toFile('public/tenants/istore-regina/logo-circle.png');

  console.log('✅ Logo circular transparente perfectamente centrado creado en logo-circle.png');

  await sharp('public/tenants/istore-regina/leather-black.jpg')
    .extract({ left: 0, top: 10, width: 576, height: 340 })
    .jpeg({ quality: 90 })
    .toFile('public/tenants/istore-regina/pure-leather-black.jpg');

  console.log('✅ Textura de cuero negro puro creada en pure-leather-black.jpg');
}

processImages().catch(console.error);
