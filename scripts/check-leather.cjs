const sharp = require('sharp');

sharp('public/tenants/istore-regina/leather-black.jpg')
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    console.log('Info:', info.width, 'x', info.height);
    const x = Math.floor(info.width / 2);
    for (let y = 0; y < info.height; y += 30) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      console.log('y=' + y + ': rgb(' + r + ',' + g + ',' + b + ')');
    }
  });
