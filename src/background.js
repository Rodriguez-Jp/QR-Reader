chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "capture") {
    chrome.tabs.captureVisibleTab({ format: "png" }, (dataurl) => {
      sendResponse({ url: dataurl });
    });
    console.log("Sent");
    return true;
  }
});
