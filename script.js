// Define the original image as a global variable
let originalImage = new Image();
let noImage = true;
let currentFilesName = "";

// Function to handle image upload
function handleImageData(imageData) {
  noImage = false;
  document.getElementById("button-container").style.display = "flex";
  originalImage.src = imageData;

  originalImage.onload = function () {
    const canvas = document.getElementById("duotoneCanvas");
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // Apply the duotone effect to the "duotoneCanvas"
    Duotone(
      "duotoneCanvas",
      originalImage,
      document.getElementsByClassName("activeSwitch")[0].dataset.color1,
      document.getElementsByClassName("activeSwitch")[0].dataset.color2,
      document.getElementsByClassName("activeSwitch")[0].dataset.color3
    );
  };
}

function debugPrint(description, message) {
  var debugWindow = document.getElementById("debug-window");
  debugWindow.innerHTML += `${description}: ${message}<br>`;  
}

// Function to handle image upload
document.getElementById("uploadButton").addEventListener("click", function () {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      const objectURL = URL.createObjectURL(file);
      handleImageData(objectURL);
      currentFilesName = file.name;
    }
  });
  fileInput.click();
});

document
  .getElementById("downloadButton")
  .addEventListener("click", async function () {
    const canvas = document.getElementById("duotoneCanvas");
    const image = canvas.toDataURL("image/jpeg", 1.0); // Convert to JPEG format

    // Compress the image using a canvas and Blob
    const compressedImage = await compressImage(image, 0.8); // Adjust quality as needed

    const anchor = document.createElement("a");
    anchor.href = compressedImage;

    var parts = currentFilesName.split(".");
    var fileExtension = parts.pop();
    var newFilename = parts.join(".") + "_duotone." + fileExtension;
    anchor.download = newFilename;
    anchor.click();
  });

async function compressImage(imageDataUrl, quality) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          const compressedImageUrl = URL.createObjectURL(blob);
          resolve(compressedImageUrl);
        },
        "image/jpeg",
        quality
      );
    };
    img.src = imageDataUrl;
  });
}


// Helper function to handle color switches
async function handleDuotoneSwitch() {
  // Remove 'activeSwitch' class from all switches
  const switches = document.getElementsByClassName("colorSwitch");
  for (const switchElement of switches) {
    switchElement.classList.remove("activeSwitch");
  }

  this.classList.add("activeSwitch");

  // Apply the duotone effect using the provided colors
  Duotone(
    "duotoneCanvas",
    originalImage,
    this.dataset.color1,
    this.dataset.color2,
    this.dataset.color3
  );
}

// Set up event listeners for color switches
const switches = document.getElementsByClassName("colorSwitch");
for (const switchElement of switches) {
  switchElement.addEventListener("click", handleDuotoneSwitch);
  switchElement.style.backgroundColor = switchElement.dataset.color1;
}

document.addEventListener("DOMContentLoaded", function () {
  const imageContainer = document.getElementById("image-container");
  // const buttonContainer = document.getElementById("button-container");
  // const bottomElement = document.getElementById("bottom-element");

  imageContainer.addEventListener("click", function () {
    if (noImage) {
      document.getElementById("uploadButton").click();
    } else {
      document.getElementById("bottom-element").classList.toggle("hide");
      document.getElementById("lockscreen-filter").classList.toggle("hide");
      document.getElementById("button-container").classList.toggle("hide");
    }
  });
});
