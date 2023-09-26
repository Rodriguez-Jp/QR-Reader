const scanButton = document.getElementById("scan-button");

scanButton.addEventListener("click", sendScan);

async function sendScan() {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const response = await chrome.tabs.sendMessage(tab.id, { action: "scan" });
  console.log(response);
}
