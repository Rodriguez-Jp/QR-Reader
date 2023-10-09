const scanButton = document.getElementById("scan-button");
const urlText = document.getElementById("url-text");

scanButton.addEventListener("click", sendScan);

async function sendScan() {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  chrome.tabs.sendMessage(tab.id, { action: "scan" });
}

//Hide popup while scanning
chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === "hidePopup") {
    document.body.style.display = "none";
  }
});

//Gets the QR and display it in the popup
chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === "finalQR") {
    document.body.style.display = "block";
    urlText.innerText = request.data;
    urlText.href = `${request.data}`;
  }

  if (request.action === "error") {
    alert("That is not a QR");
    document.body.style.display = "block";
  }
});
