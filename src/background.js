async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;

  await chrome.offscreen.createDocument({
    url: "../static/offscreen.html",
    reason: ["DOM_PARSER"],
    justification: "testing",
  });
}

chrome.runtime.onMessage.addListener(async function (request) {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (request.action === "position") {
    const { startX, startY, width, height } = request.info;
    const positionInfo = { tab, startX, startY, width, height };
    chrome.runtime.sendMessage({
      action: "getqr",
      info: { positionInfo },
    });

    // console.log("triggered!");
    // const { startX, startY, width, height } = request.info;
    // const finalQr = getQr(tab, startX, startY, width, height);
    // console.log(finalQr, "patata");
  }
});
