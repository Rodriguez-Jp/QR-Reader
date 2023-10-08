import jsQR from "jsqr";

let canvasOffset, offsetX, offsetY, startX, startY, ctx, width, height;
let isDown = false;
let pageSize = document.body.getBoundingClientRect();

chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === "scan") {
    beginScan();
  }
});

function beginScan() {
  let grayLayoutRef = document.querySelector(".scan-modal");

  if (grayLayoutRef) {
    return;
  }

  let grayLayout = document.createElement("div");
  grayLayout.classList.add("scan-modal");

  let canvasElement = document.createElement("canvas");
  canvasElement.classList.add("scan-rectangle");
  canvasElement.id = "canvas";

  grayLayout.appendChild(canvasElement);

  document.body.appendChild(grayLayout);

  let canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;

  canvasOffset = canvas.getBoundingClientRect();
  canvas.width = pageSize.width;
  canvas.height = pageSize.height;
  offsetX = canvasOffset.left;
  offsetY = canvasOffset.top;
  isDown = false;

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

  chrome.runtime.sendMessage({
    action: "hidePopup",
  });

  isDown = true;
}

async function mouseUp(e) {
  e.preventDefault();
  e.stopPropagation();

  chrome.runtime.sendMessage(
    null,
    {
      action: "capture",
      info: { startX, startY, width, height },
    },
    null,
    (response) => {
      console.log(response);

      getQr(startX, startY, width, height, response.url, (qr) => {
        chrome.runtime.sendMessage({ action: "finalQR", data: qr.data });
      });

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

function getQr(left, top, width, height, dataurl, callback) {
  console.log(dataurl);
  if (dataurl === null) {
    document.querySelector(".scan-modal").remove();
    chrome.runtime.sendMessage({
      action: "error",
      data: "there was an error",
    });
  }
  const qr = new Image();
  qr.src = dataurl;
  qr.onload = () => {
    const captureCanvasQr = document.createElement("canvas");
    captureCanvasQr.width = width;
    captureCanvasQr.height = height;
    const ctx = captureCanvasQr.getContext("2d");

    ctx.drawImage(qr, left, top, width, height, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const qrDecoded = jsQR(imageData.data, width, height);

    if (qrDecoded === null) {
      chrome.runtime.sendMessage({
        action: "error",
        data: "there was an error",
      });
      return;
    }
    callback(qrDecoded);
  };
  qr.onerror = () => {
    document.querySelector(".scan-modal").remove();
    chrome.runtime.sendMessage({
      action: "error",
    });
  };
}

// function getQr(
//   tab: chrome.tabs.Tab,
//   left: number,
//   top: number,
//   width: number,
//   height: number,
//   windowWidth: number
// ) {
//   chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (dataUrl) => {
//     contentTab = tab;
//     const qr = new Image();
//     qr.src = dataUrl;
//     qr.onload = () => {
//       const devicePixelRatio = qr.width / windowWidth;
//       const captureCanvas = document.createElement("canvas");
//       captureCanvas.width = width * devicePixelRatio;
//       captureCanvas.height = height * devicePixelRatio;
//       const ctx = captureCanvas.getContext("2d");
//       if (!ctx) {
//         return;
//       }
//       ctx.drawImage(
//         qr,
//         left * devicePixelRatio,
//         top * devicePixelRatio,
//         width * devicePixelRatio,
//         height * devicePixelRatio,
//         0,
//         0,
//         width * devicePixelRatio,
//         height * devicePixelRatio
//       );
//       const url = captureCanvas.toDataURL();
//       const qrReader = new QRCode();
//       qrReader.callback = (error) => {
//         if (error) {
//           console.error(error);
//           const qrImageData = ctx.getImageData(
//             0,
//             0,
//             captureCanvas.width,
//             captureCanvas.height
//           );
//           const jsQrCode = jsQR(
//             qrImageData.data,
//             captureCanvas.width,
//             captureCanvas.height
//           );
//           if (jsQrCode) {
//             getTotp(jsQrCode.data);
//           } else {
//             if (!contentTab || !contentTab.id) {
//               return;
//             }
//             const id = contentTab.id;
//             chrome.tabs.sendMessage(id, { action: "errorqr" });
//           }
//         } else {
//           getTotp(text.result);
//         }
//       };
//       qrReader.decode(url);
//     };
//   });
// }
