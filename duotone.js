function Duotone(id, image, primaryClr, middleClr, secondaryClr) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.filter = "grayscale(1) brightness(1) contrast(1.4)";

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // draws image to canvas

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const gradient = triColorGradientMap(secondaryClr, middleClr, primaryClr);

  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = gradient[pixels[i] * 4];
    pixels[i + 1] = gradient[pixels[i + 1] * 4 + 1];
    pixels[i + 2] = gradient[pixels[i + 2] * 4 + 2];
  }
  ctx.putImageData(imageData, 0, 0);
}

function triColorGradientMap(primaryClr, middleClr, secondaryClr) {
  const hexToRgb = (hex) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  });

  const rgb1 = hexToRgb(primaryClr);
  const rgb2 = hexToRgb(middleClr);
  const rgb3 = hexToRgb(secondaryClr);

  const gradient = new Uint8ClampedArray(256 * 4);
  for (let i = 0; i < 128; i++) {
    const factor = i / 127;
    gradient[i * 4] = Math.round((1 - factor) * rgb1.r + factor * rgb2.r);
    gradient[i * 4 + 1] = Math.round((1 - factor) * rgb1.g + factor * rgb2.g);
    gradient[i * 4 + 2] = Math.round((1 - factor) * rgb1.b + factor * rgb2.b);
    gradient[i * 4 + 3] = 255;
  }
  for (let i = 128; i < 256; i++) {
    const factor = (i - 128) / 127;
    gradient[i * 4] = Math.round((1 - factor) * rgb2.r + factor * rgb3.r);
    gradient[i * 4 + 1] = Math.round((1 - factor) * rgb2.g + factor * rgb3.g);
    gradient[i * 4 + 2] = Math.round((1 - factor) * rgb2.b + factor * rgb3.b);
    gradient[i * 4 + 3] = 255;
  }
  return gradient;
}
