async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) {
    console.log("already created");
    return;
  }

  await chrome.offscreen.createDocument({
    url: "/offscreen.html",
    reasons: [chrome.offscreen.Reason.DOM_PARSER],
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
    await createOffscreen();

    chrome.runtime.sendMessage({
      type: "Test",
      target: "offscreen",
      data: {
        action: "getqr",
        info: { positionInfo },
      },
    });

    console.log("Sent");

    // console.log("triggered!");
    // const { startX, startY, width, height } = request.info;
    // const finalQr = getQr(tab, startX, startY, width, height);
    // console.log(finalQr, "patata");
  }
});
