// https://www.mattkandler.com/blog/duotone-image-filter-javascript-rails

function Duotone(id, image, primaryClr, secondaryClr) {
  console.log("called");
  let canvas = document.getElementById(id);
  let ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // draws image to canvas

  // Convert to grayscale by averaging the values of each pixel
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = this.grayscale(imageData.data);
  const gradient = this.gradientMap(secondaryClr, primaryClr);
  // let d = pixels;
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = gradient[pixels[i] * 4];
    pixels[i + 1] = gradient[pixels[i + 1] * 4 + 1];
    pixels[i + 2] = gradient[pixels[i + 2] * 4 + 2];
  }
  ctx.putImageData(imageData, 0, 0);
}

function grayscale(pixels) {
  let d = pixels;
  let max = 0;
  let min = 255;
  for (let i = 0; i < d.length; i += 4) {
    // Fetch maximum and minimum pixel values
    if (d[i] > max) {
      max = d[i];
    }
    if (d[i] < min) {
      min = d[i];
    }
    // Grayscale by averaging RGB values
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];
    let v = 0.3333 * r + 0.3333 * g + 0.3333 * b;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  for (let i = 0; i < d.length; i += 4) {
    // Normalize each pixel to scale 0-255
    let v = ((d[i] - min) * 255) / (max - min);
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  return pixels;
}
function gradientMap(tone1, tone2) {
  let rgb1 = hexToRgb(tone1);
  let rgb2 = hexToRgb(tone2);
  let gradient = [];
  for (let i = 0; i < 256 * 4; i += 4) {
    gradient[i] = ((256 - i / 4) * rgb1.r + (i / 4) * rgb2.r) / 256;
    gradient[i + 1] = ((256 - i / 4) * rgb1.g + (i / 4) * rgb2.g) / 256;
    gradient[i + 2] = ((256 - i / 4) * rgb1.b + (i / 4) * rgb2.b) / 256;
    gradient[i + 3] = 255;
  }
  return gradient;
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
