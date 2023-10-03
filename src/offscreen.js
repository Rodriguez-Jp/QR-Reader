import QRCode from "qrcode-reader";

chrome.runtime.onMessage.addListner(async (request) => {
  if (request.action !== "getqr") {
    return;
  }

  const { tab, startX, startY, width, height } = request.info;

  console.log(await getQr(tab, startX, startY, width, height));
});

async function getQr(tab, left, top, width, height) {
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
