//Gets the capture of the whole table, lives in background since content script doesn't have access to this API

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "capture") {
    chrome.tabs.captureVisibleTab({ format: "png" }, (dataurl) => {
      sendResponse({ url: dataurl });
    });
    console.log("Sent");
    return true;
  }
});
