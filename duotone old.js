// Spotify Duotone Filter with HTML Canvas and Javascript
// by Anthony Teo
/* 
This function generates a duotone version of an image on an HTML Canvas element using Javascript.
It makes use of the newer canvas functions, including filter and the globalCompositeOperations, making it
less code-heavy compared to existing implementations in canvas.
The benefit of using this method compared to CSS filters is the ability to convert the canvas to an image to be saved.
Libraries like HTMLtoCanvas state in their documentation that CSS filters are not supported, so it is probably not possible
to do so in CSS. This is a purely JS and Canvas implementation.
*/

function Duotone(id, image, primaryClr, secondaryClr, actions = (ctx) => null) {
  console.log("called");
  let canvas = document.getElementById(id);
  let ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // draws image to canvas

  // Convert to grayscale by averaging the values of each pixel
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  for (var i = 0; i < pixels.length; i += 4) {
    let lightness =
      0.2126 * pixels[i] + 0.715 * pixels[i + 1] + 0.0722 * pixels[i + 2];

    pixels[i] = lightness;
    pixels[i + 1] = lightness;
    pixels[i + 2] = lightness;
  }

  // Puts the grayscaled image data back into the canvas
  ctx.putImageData(imageData, 0, 0);

  // Puts the duotone image into the canvas with multiply and lighten
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = primaryClr; // colour for highlights
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // lighten
  ctx.globalCompositeOperation = "lighten";
  ctx.fillStyle = secondaryClr; // colour for shadows
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Call any other drawing operations through the function parameter passed in
  actions(ctx);
}