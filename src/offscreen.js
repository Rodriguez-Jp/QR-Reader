import QRCode from "qrcode-reader";

alert("loaded!");
chrome.runtime.onMessage.addListener((request) => {
  if (request.target === "offscreen") {
    alert("received!");

    const { tab, startX, startY, width, height } = request.data.info;

    console.log(getQr(tab, startX, startY, width, height));
  }
});

function getQr(tab, left, top, width, height) {
  chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (dataurl) => {
    const qr = new Image();
    qr.src = dataurl;
    qr.onload = () => {
      const captureCanvasQr = document.createElement("canvas");
      captureCanvasQr.width = width;
      captureCanvasQr.height = height;
      const ctx = captureCanvasQr.getContext("2d");

      ctx.drawImage(qr, left, top, width, height, 0, 0, width, height);

      const url = captureCanvasQr.toDataURL();
      const qrReader = new QRCode();
      qrReader.callback = (error) => {
        if (error) console.log(error);
        return qrReader.decode(url);
      };
    };
  });
}
