// Define the original image as a global variable
let originalImage = new Image();
let noImage = true;
let currentFilesName = "";

// Function to handle image upload
function handleImageData(imageData) {
  noImage = false;
  document.getElementById("button-container").style.display = "flex";

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

  originalImage.src = imageData;
}

function debugPrint(description, message) {
  document.getElementById("debug-window").innerHTML += description;
  document.getElementById("debug-window").innerHTML += ": ";
  document.getElementById("debug-window").innerHTML += message;
  document.getElementById("debug-window").innerHTML += "<br>";
}

// Function to handle image upload
function handleImageUpload(event) {
  const file = event.target.files[0];

  if (file) {
    const objectURL = URL.createObjectURL(file);
    handleImageData(objectURL);
    currentFilesName = file.name;
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

// Function to handle image download
document
  .getElementById("downloadButton")
  .addEventListener("click", function () {
    const canvas = document.getElementById("duotoneCanvas");
    const image = canvas.toDataURL("image/png");
    // TODO image compression
    const anchor = document.createElement("a");
    anchor.href = image;
    var parts = currentFilesName.split(".");
    var fileExtension = parts.pop();
    var newFilename = parts.join(".") + "_duotone." + fileExtension;
    anchor.download = newFilename;
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
