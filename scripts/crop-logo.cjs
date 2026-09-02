const sharp = require('sharp');
const path = require('path');

async function processImages() {
  console.log('Procesando logo e imágenes de iStore Regina...');

  const circleSvg = Buffer.from(
    '<svg width="500" height="500"><circle cx="250" cy="250" r="246" fill="#ffffff" /></svg>'
  );

  await sharp('public/tenants/istore-regina/logo-badge.jpg')
    .resize(500, 500, { fit: 'cover' })
    .composite([{
      input: circleSvg,
      blend: 'dest-in'
    }])
    .png()
    .toFile('public/tenants/istore-regina/logo-circle.png');

  console.log('✅ Logo circular transparente creado en logo-circle.png');

  await sharp('public/tenants/istore-regina/leather-black.jpg')
    .extract({ left: 0, top: 10, width: 576, height: 340 })
    .jpeg({ quality: 90 })
    .toFile('public/tenants/istore-regina/pure-leather-black.jpg');

  console.log('✅ Textura de cuero negro puro creada en pure-leather-black.jpg');
}

processImages().catch(console.error);
