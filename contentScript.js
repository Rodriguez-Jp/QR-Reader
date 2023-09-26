function beginScan() {
  let grayLayout = document.getElementById("gray-layout");

  if (!grayLayout) {
    grayLayout = document.createElement("div");
    grayLayout.classList.add("scan-modal");

    document.body.appendChild(grayLayout);
  }

  document.body.addEventListener("mousedown", getPosition);
}

function getPosition(e) {
  console.log(e);
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === "scan") {
    beginScan();
  }
});
