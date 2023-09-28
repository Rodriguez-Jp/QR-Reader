let canvasOffset, offsetX, offsetY, startX, startY, ctx;
let isDown = false;
const bodyWidth = document.body.getAttribute;
let pageSize = document.body.getBoundingClientRect();

function beginScan() {
  let grayLayoutRef = document.querySelector(".scan-modal");

  if (grayLayoutRef) {
    return;
  }

  let grayLayout = document.createElement("div");
  grayLayout.classList.add("scan-modal");

  let canvasElement = document.createElement("canvas");
  canvasElement.classList.add("scan-rectangle");
  canvasElement.id = "canvas";

  grayLayout.appendChild(canvasElement);

  document.body.appendChild(grayLayout);

  let canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;

  canvasOffset = canvas.getBoundingClientRect();
  canvas.width = pageSize.width;
  canvas.height = pageSize.height;
  offsetX = canvasOffset.left;
  offsetY = canvasOffset.top;
  isDown = false;

  document
    .getElementById("canvas")
    .addEventListener("mousedown", (e) => mouseDown(e));
  document
    .getElementById("canvas")
    .addEventListener("mouseup", (e) => mouseUp(e));
  document
    .getElementById("canvas")
    .addEventListener("mousemove", (e) => mouseMove(e));
}

function mouseDown(e) {
  e.preventDefault();
  e.stopPropagation();

  startX = parseInt(e.clientX - offsetX);
  startY = parseInt(e.clientY - offsetY);
  console.log(e.clientX, e.clientY);

  isDown = true;
}

function mouseUp(e) {
  e.preventDefault();
  e.stopPropagation();

  isDown = false;
}

function mouseMove(e) {
  e.preventDefault();
  e.stopPropagation();

  if (!isDown) return;

  let mouseX = parseInt(e.clientX - offsetX);
  let mouseY = parseInt(e.clientY - offsetY);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let width = mouseX - startX;
  let height = mouseY - startY;

  console.log(ctx);

  console.table(mouseX, mouseY, startX, startY, width, height);

  ctx.strokeRect(startX, startY, width, height);
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === "scan") {
    beginScan();
  }
});
