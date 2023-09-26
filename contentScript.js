// const scanButton = document.getElementById("scan-button");

// scanButton.addEventListener("click", beginScan);

function beginScan() {
  let grayLayout = document.getElementById("gray-layout");

  if (!grayLayout) {
    grayLayout = document.createElement("div");
    grayLayout.classList.add("scan-modal");

    document.body.appendChild(grayLayout);
  }
}

beginScan();
