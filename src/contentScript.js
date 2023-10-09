import jsQR from "jsqr";

let canvasOffset, offsetX, offsetY, startX, startY, ctx, width, height;
let isDown = false;
let pageSize = document.body.getBoundingClientRect();

//Error handler function
function throwError() {
  chrome.runtime.sendMessage({
    action: "error",
    data: "there was an error",
  });
}

//Begins the scan function when Scan button is clicked
chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === "scan") {
    beginScan();
  }
});

function beginScan() {
  let grayLayoutRef = document.querySelector(".scan-modal");

  //Watch for the gray layout, in case is already in the document it doesn't create other one
  if (grayLayoutRef) {
    return;
  }

  let grayLayout = document.createElement("div");
  grayLayout.classList.add("scan-modal");

  //Canvas rectangle that reads to select the QR
  let canvasElement = document.createElement("canvas");
  canvasElement.classList.add("scan-rectangle");
  canvasElement.id = "canvas";

  grayLayout.appendChild(canvasElement);

  document.body.appendChild(grayLayout);

  let canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  ctx.lineWidth = 2;

  canvasOffset = canvas.getBoundingClientRect();
  canvas.width = pageSize.width;
  canvas.height = pageSize.height;
  offsetX = canvasOffset.left;
  offsetY = canvasOffset.top;
  isDown = false;

  //Listener for mouse actions
  document
    .getElementById("canvas")
    .addEventListener("mousedown", (e) => mouseDown(e));
  document
    .getElementById("canvas")
    .addEventListener("mouseup", (e) => mouseUp(e));
  document
    .getElementById("canvas")
    .addEventListener("mousemove", (e) => mouseMove(e));
}

function mouseDown(e) {
  e.preventDefault();
  e.stopPropagation();

  startX = parseInt(e.clientX - offsetX);
  startY = parseInt(e.clientY - offsetY);

  //sends the message to hide the popup once the user clicks
  chrome.runtime.sendMessage({
    action: "hidePopup",
  });

  isDown = true;
}

async function mouseUp(e) {
  e.preventDefault();
  e.stopPropagation();

  //Starts the capture once the user left the click
  chrome.runtime.sendMessage(
    null,
    {
      action: "capture",
      info: { startX, startY, width, height },
    },
    null,
    (response) => {
      getQr(startX, startY, width, height, response.url, (qr) => {
        chrome.runtime.sendMessage({ action: "finalQR", data: qr.data });
      });

      //Remove the gray Layout
      document.querySelector(".scan-modal").remove();
    }
  );

  isDown = false;
}

function mouseMove(e) {
  e.preventDefault();
  e.stopPropagation();

  if (!isDown) return;

  let mouseX = parseInt(e.clientX - offsetX);
  let mouseY = parseInt(e.clientY - offsetY);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  width = mouseX - startX;
  height = mouseY - startY;

  ctx.strokeRect(startX, startY, width, height);
}

//main function where the QR is scanned
function getQr(left, top, width, height, dataurl, callback) {
  //In case is an empty scan
  if (dataurl === null) {
    document.querySelector(".scan-modal").remove();
    throwError();
  }
  const qr = new Image();
  qr.src = dataurl;
  qr.onload = () => {
    //Try catch block to handle any error in the capture process
    try {
      const captureCanvasQr = document.createElement("canvas");
      captureCanvasQr.width = width;
      captureCanvasQr.height = height;
      const ctx = captureCanvasQr.getContext("2d");

      ctx.drawImage(qr, left, top, width, height, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);

      const qrDecoded = jsQR(imageData.data, width, height);

      if (qrDecoded === null) {
        throwError();
        return;
      }

      //Return the decodedQR in the callback function
      callback(qrDecoded);
    } catch (error) {
      throwError();
    }
  };
  qr.onerror = () => {
    document.querySelector(".scan-modal").remove();
    throwError();
  };
}
