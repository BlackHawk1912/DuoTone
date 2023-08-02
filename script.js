let originalImage = new Image();
let filteredImage = new Image();

function handleImageUpload(event) {
  const file = event.target.files[0];

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
    Duotone("duotoneCanvas", originalImage, duotoneSwitches[5].color1, duotoneSwitches[0].color2);
  };

  if (file) {
    const objectURL = URL.createObjectURL(file);
    originalImage.src = objectURL;
  }
}
// Listen for messages from the service worker
const channel = new BroadcastChannel('shareChannel');
channel.onmessage = event => {
  const file = event.data.file;
  Duotone("duotoneCanvas", file, duotoneSwitches[5].color1, duotoneSwitches[0].color2);

};

document.getElementById("uploadButton").addEventListener("click", function () {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.addEventListener("change", handleImageUpload);
  fileInput.click();
});

// Helper function to handle duotone switches
function handleDuotoneSwitch(color1, color2) {
  return function (event) {
    document.getElementById("duotoneCanvas") = document.getElementById("original-image")
    
    Duotone("duotoneCanvas", image, color1, color2);
  };
}

// Set up event listeners for duotone switches
const duotoneSwitches = [
  { switchId: "switch-1", color1:"#29d8f7", color2:"#5b398f" },
  { switchId: "switch-2", color1:"#6fa1fa", color2:"#702a58" },
  { switchId: "switch-3", color1:"#d571f7", color2:"#3a439f" },
  { switchId: "switch-4", color1:"#c05cf2", color2:"#2f3744" },
  { switchId: "switch-5", color1:"#e86d99", color2:"#3d40a2" },
  { switchId: "switch-6", color1:"#f25068", color2:"#5f1d65" },
  { switchId: "switch-7", color1:"#eed27f", color2:"#4f355a" },
  { switchId: "switch-8", color1:"#edc07d", color2:"#ad4e6c" },
  { switchId: "switch-9", color1:"#eaa47f", color2:"#613184" },
  { switchId: "switch-10", color1:"#f2ed9b", color2:"#8e3c75" },
  { switchId: "switch-11", color1:"#d5dd78", color2:"#4b3b79" },
  { switchId: "switch-12", color1:"#90cc5a", color2:"#2a4466" },  
];

for (const { switchId, color1, color2 } of duotoneSwitches) {
  document.getElementById(switchId).addEventListener("click", handleDuotoneSwitch(color1, color2));
}

// Function to handle image download
document.getElementById("downloadButton").addEventListener("click", function () {
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
      document.getElementById("bottom-element").classList.toggle("hide");
      document.getElementById("lockscreen-filter").classList.toggle("hide");
      document.getElementById("button-container").classList.toggle("hide");
    });
});