import QrCode from "qrcode-reader/src/qrcode.js";

chrome.runtime.onMessage.addListener(async function (request) {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (request.action === "position") {
    console.log("triggered!");
    const { startX, startY, width, height } = request.info;
    const finalQr = getQr(tab, startX, startY, width, height);
    console.log(finalQr, "patata");
  }
});

function getQr(tab, left, top, width, height) {
  chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (dataurl) => {
    const qr = new Image();
    qr.onload = () => {
      const captureCanvasQr = document.createElement("canvas");
      captureCanvasQr.width = width;
      captureCanvasQr.height = height;
      const ctx = captureCanvasQr.getContext("2d");

      ctx.drawImage(qr, left, top, width, height, 0, 0, width, height);

      const url = captureCanvasQr.toDataURL();
      const qrReader = new QrCode();
      qrReader.callback = (error) => {
        if (error) console.log(error);
        return qrReader.decode(url);
      };
    };
  });
}
