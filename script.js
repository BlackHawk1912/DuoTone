// Funktion für den Duotone-Filter
function Duotone(id, src, primaryClr, secondaryClr, actions = (ctx) => null) {
    let canvas = document.getElementById(id);
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Löscht die Leinwand vor dem Zeichnen des neuen Bildes

    let downloadedImg = new Image();
    downloadedImg.crossOrigin = ""; // to allow us to manipulate the image without tainting canvas
    downloadedImg.onload = function () {
        ctx.drawImage(downloadedImg, 0, 0, canvas.width, canvas.height); // draws image to canvas on load
        // Converts to grayscale by averaging the values of each pixel
        imageData = ctx.getImageData(0, 0, 800, 800);
        const pixels = imageData.data;
        for (let i = 0; i < pixels.length; i += 4) {
            const red = pixels[i];
            const green = pixels[i + 1];
            const blue = pixels[i + 2];
            // Using relative luminance to convert to grayscale
            const avg = Math.round((0.299 * red + 0.587 * green + 0.114 * blue) * 1);
            pixels[i] = avg;
            pixels[i + 1] = avg;
            pixels[i + 2] = avg;
        }
        // Puts the grayscaled image data back into the canvas
        ctx.putImageData(imageData, 0, 0);
        // puts the duotone image into canvas with multiply and lighten
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = primaryClr; // colour for highlights
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // lighten
        ctx.globalCompositeOperation = "lighten";
        ctx.fillStyle = secondaryClr; // colour for shadows
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // calls any other draws that you want through the function parameter passed in
        actions(ctx);
    };
    downloadedImg.src = src; // source for the image
}

// Function to handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const image = new Image();
        image.onload = function () {
            Duotone("duotoneCanvas", image.src, "#FF0000", "#00FF00");
        };
        image.src = reader.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

// Funktionen für die Buttons zur Änderung der Farbkombinationen
function applyColorCombination1() {
    Duotone("duotoneCanvas", "path/to/image", "#FF0000", "#00FF00");
}

function applyColorCombination2() {
    Duotone("duotoneCanvas", "path/to/image", "#00FF00", "#FF0000");
}

function applyColorCombination3() {
    Duotone("duotoneCanvas", "path/to/image", "#0000FF", "#FFFF00");
}

document.getElementById("uploadButton").addEventListener("click", function () {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", handleImageUpload);
    fileInput.click();
});

// Button-Elemente auswählen und Event-Listener hinzufügen
document.getElementById("buttonCombination1").addEventListener("click", applyColorCombination1);
document.getElementById("buttonCombination2").addEventListener("click", applyColorCombination2);
document.getElementById("buttonCombination3").addEventListener("click", applyColorCombination3);

// Function to handle image download
document.getElementById("duotoneCanvas").addEventListener("click", function () {
    const canvas = document.getElementById("duotoneCanvas");
    const image = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = "duotone_image.png";
    anchor.click();
});
