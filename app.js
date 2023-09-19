const scanButton = document.getElementById("scan-button");

scanButton.addEventListener("click", beginScan);

async function beginScan() {
  //Need to work on this
  //   await new Promise((resolve, reject) => {
  //     try {
  //       return (
  //         chrome.scripting.executeScript({
  //           files: ["/contentScript.js"],
  //           target: { tabId: getTabId() },
  //         }),
  //         resolve
  //       );
  //     } catch (error) {
  //       return reject(error);
  //     }
  //   });
}
