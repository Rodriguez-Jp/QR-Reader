// async function createOffscreen() {
//   if (await chrome.offscreen.hasDocument()) {
//     console.log("already created");
//     return;
//   }

//   await chrome.offscreen.createDocument({
//     url: "/offscreen.html",
//     reasons: [chrome.offscreen.Reason.DOM_PARSER],
//     justification: "testing",
//   });
// }

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "capture") {
    chrome.tabs.captureVisibleTab({ format: "png" }, (dataurl) => {
      sendResponse({ url: dataurl });
    });
    console.log("Sent");
    return true;
  }
});
