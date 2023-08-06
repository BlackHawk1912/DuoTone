// Define the original image as a global variable
let originalImage = new Image();
let noImage = true;

alert("START Test");
// Function to handle image upload
function handleImageData(imageData) {
  alert("handleImageData");
  noImage = false;
  document.getElementById("button-container").style.display = "flex";

  originalImage.onload = function () {
    const canvas = document.getElementById("duotoneCanvas");
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    const originalCanvas = document.getElementById("original-image");
    originalCanvas.width = originalImage.width;
    originalCanvas.height = originalImage.height;

    // Save the original image in the "originalImage" object
    originalCanvas.getContext("2d").drawImage(originalImage, 0, 0);

    // Apply the duotone effect to the "duotoneCanvas"
    Duotone(
      "duotoneCanvas",
      originalImage,
      document.getElementsByClassName("activeSwitch")[0].dataset.color1,
      document.getElementsByClassName("activeSwitch")[0].dataset.color2,
      document.getElementsByClassName("activeSwitch")[0].dataset.color3
    );
  };

  originalImage.src = imageData;
}

// Function to handle image upload
function handleImageUpload(event) {
  const file = event.target.files[0];

  if (file) {
    const objectURL = URL.createObjectURL(file);
    handleImageData(objectURL);
  }
}

document.getElementById("uploadButton").addEventListener("click", function () {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.addEventListener("change", handleImageUpload);
  fileInput.click();
});

// Helper function to handle duotone switches
async function handleDuotoneSwitch() {
  // Remove 'activeSwitch' class from all switches
  const switches = document.getElementsByClassName("colorSwitch");
  for (const switchElement of switches) {
    switchElement.classList.remove("activeSwitch");
  }

  // Add 'activeSwitch' class to the clicked switch
  this.classList.add("activeSwitch");

  // Get the color1 and color2 values from the data attributes
  const color1 = this.dataset.color1;
  const color2 = this.dataset.color2;
  const color3 = this.dataset.color3;

  // Apply the duotone effect using the provided colors
  Duotone("duotoneCanvas", originalImage, color1, color2, color3);
}

// Set up event listeners for duotone switches
const switches = document.getElementsByClassName("colorSwitch");
for (const switchElement of switches) {
  switchElement.addEventListener("click", handleDuotoneSwitch);

  // Set the initial background color using the data attributes
  const color1 = switchElement.dataset.color1;
  // const color2 = switchElement.dataset.color2;
  switchElement.style.backgroundColor = color1;
}

// Function to handle image download
document
  .getElementById("downloadButton")
  .addEventListener("click", function () {
    const canvas = document.getElementById("duotoneCanvas");
    const image = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = "duotone_image.png";
    anchor.click();
  });

document.addEventListener("DOMContentLoaded", function () {
  const lockscreenFilter = document.getElementById("lockscreen-filter");
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

function displayImage(imageData) {
  alert("displayImage");
  const imageContainer = document.getElementById("test-image");
  const image = new Image();
  image.src = imageData;
  imageContainer.innerHTML = "";
  imageContainer.appendChild(image);
}

// Function to handle receiving the image from the service worker
async function handleImage(event) {
  alert("handleImage");
  try {
    const imageData = await event.data.formData.get("image");
    if (imageData) {
      alert("should work");
      handleImageData(imageData);
    }
  } catch (error) {
    console.error("Error handling received image:", error);
  }
}

// Register the event listener for receiving the image from the service worker
window.addEventListener("DOMContentLoaded", () => {
  alert("DOMContentLoaded");
  navigator.shareTarget &&
    navigator.shareTarget.addEventListener("file", handleImage);
});