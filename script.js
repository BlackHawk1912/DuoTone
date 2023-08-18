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
      document.querySelector('input[name="colorSwitch"]:checked').dataset
        .color1,
      document.querySelector('input[name="colorSwitch"]:checked').dataset
        .color2,
      document.querySelector('input[name="colorSwitch"]:checked').dataset.color3
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
    const canvas = document.getElementById("duotoneCanvas").classList.add("");
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
  // Apply the duotone effect using the provided colors
  if (noImage) {
    return;
  }
  const selectedRadioButton = this.previousElementSibling;

  // Update the UI first
  selectedRadioButton.checked = true;

  document.getElementById("duotoneCanvas").classList.add("loadingAnimation");
  // Use setTimeout to allow the UI to update before starting the long-running operation
  setTimeout(async () => {
    await Duotone(
      "duotoneCanvas",
      originalImage,
      selectedRadioButton.dataset.color1,
      selectedRadioButton.dataset.color2,
      selectedRadioButton.dataset.color3
    );

    // Remove loading style after Duotone is applied
    document
      .getElementById("duotoneCanvas")
      .classList.remove("loadingAnimation");
  }, 0); // The 0 delay is enough to allow the rendering thread to catch up
}

// Set up event listeners for color switches
const radioButtons = document.querySelectorAll(
  ".colorSwitch-container input[type='radio']"
);
for (const radioButton of radioButtons) {
  radioButton.nextElementSibling.addEventListener("click", handleDuotoneSwitch);
  radioButton.nextElementSibling.style.backgroundColor =
    radioButton.dataset.color1;
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
