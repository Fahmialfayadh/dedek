/* ===========================
   Valentine Rounds – script.js
   =========================== */

const roundEls = [
  document.getElementById("round1"),
  document.getElementById("round2"),
  document.getElementById("round3"),
  document.getElementById("round4")
];

const fxLayer = document.getElementById("fx-layer");
const questionArea = document.getElementById("questionArea");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const teaseText = document.getElementById("teaseText");

const heartLock = document.getElementById("heartLock");
const lockCount = document.getElementById("lockCount");

/* Pixel Desktop */
const pixelFolders = document.querySelectorAll(".pixel-folder");
const pixelWindows = document.querySelectorAll(".pixel-window");
const closeButtons = document.querySelectorAll(".btn-close");
const toFinalBtn = document.getElementById("toFinalBtn");
const typeText = document.getElementById("typeText");
const replayBtn = document.getElementById("replayBtn");

const noLines = [
  "Yakin mau NO?",
  "Coba pikir lagi deh...",
  "NO terdeteksi, YES dibuff +30%.",
  "YES makin besar sekarang.",
  "Udah susah ngindarnya kan?",
  "Pilihan terbaik tinggal YES."
];

const stickerSet = ["🥰", "😘", "💖", "💌", "🌹", "🧸", "🍫", "😻"];

var currentRound = 0;
var noCount = 0;
var yesGrow = 1;
var lockTap = 0;
var lockOpened = false;
var typeTimer = null;
var stickerRain = null;

/* ---------- Core ---------- */

function showRound(index) {
  currentRound = index;
  roundEls.forEach(function (el, i) {
    el.classList.toggle("active", i === index);
  });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function fxHeart(x, y, content, large) {
  if (!content) content = "💖";
  var el = document.createElement("span");
  el.className = "fx-heart";
  el.textContent = content;
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.fontSize = (large ? 28 + Math.random() * 18 : 18 + Math.random() * 12) + "px";
  fxLayer.appendChild(el);
  setTimeout(function () { el.remove(); }, 1300);
}

function burst(x, y, amount) {
  if (!amount) amount = 12;
  for (var i = 0; i < amount; i++) {
    var nx = x + (Math.random() * 120 - 60);
    var ny = y + (Math.random() * 80 - 40);
    fxHeart(nx, ny, i % 2 ? "💘" : "💖", true);
  }
}

/* ---------- Round 1: YES / NO ---------- */

function moveNoButton() {
  var areaRect = questionArea.getBoundingClientRect();
  var btnW = noBtn.offsetWidth;
  var btnH = noBtn.offsetHeight;
  var left = Math.random() * Math.max(10, areaRect.width - btnW - 10);
  var top = Math.random() * Math.max(8, areaRect.height - btnH - 8);
  noBtn.classList.add("floating");
  noBtn.style.left = left + "px";
  noBtn.style.top = top + "px";
}

function makeYesFullscreen() {
  yesBtn.classList.add("fullscreen");
  noBtn.classList.add("hidden");
  teaseText.textContent = "YES mode fullscreen aktif. Tinggal klik YES.";
}

function handleNoClick() {
  noCount += 1;
  yesGrow = clamp(yesGrow + 0.28, 1, 3.2);
  yesBtn.style.setProperty("--grow", yesGrow.toFixed(2));
  teaseText.textContent = noLines[Math.min(noCount - 1, noLines.length - 1)];

  var noRect = noBtn.getBoundingClientRect();
  burst(noRect.left + noRect.width / 2, noRect.top + noRect.height / 2, 6);
  moveNoButton();

  if (noCount >= 5) {
    makeYesFullscreen();
  }
}

function cleanupRound1State() {
  yesBtn.classList.remove("fullscreen");
  noBtn.classList.remove("floating", "hidden");
  noBtn.style.left = "";
  noBtn.style.top = "";
}

function goToRound2() {
  cleanupRound1State();
  showRound(1);
  burst(window.innerWidth * 0.5, window.innerHeight * 0.45, 28);
}

/* ---------- Round 3: Pixel Desktop ---------- */

function startDesktopRound() {
  showRound(2);
  burst(window.innerWidth * 0.5, window.innerHeight * 0.45, 20);
}

function openWindow(targetId) {
  var win = document.getElementById(targetId);
  if (win) {
    win.removeAttribute("hidden");
    win.style.zIndex = 30 + document.querySelectorAll('.pixel-window:not([hidden])').length;
  }
}

function closeWindow(winBtn) {
  var win = winBtn.closest(".pixel-window");
  if (win) {
    win.setAttribute("hidden", "");
  }
}

/* ---------- Round 4: Final ---------- */

function typeWriter(text) {
  clearInterval(typeTimer);
  typeText.textContent = "";
  var i = 0;
  typeTimer = setInterval(function () {
    typeText.textContent += text[i];
    i += 1;
    if (i >= text.length) clearInterval(typeTimer);
  }, 42);
}

function spawnStickerRain() {
  var el = document.createElement("span");
  el.className = "fx-sticker";
  el.textContent = stickerSet[Math.floor(Math.random() * stickerSet.length)];
  el.style.left = Math.random() * window.innerWidth + "px";
  el.style.top = (window.innerHeight - 26) + "px";
  fxLayer.appendChild(el);
  setTimeout(function () { el.remove(); }, 2400);
}

function startFinalRound() {
  showRound(3);
  typeWriter("Scene ini jadi bukti kalau valentine ini bukan cuma manis, tapi juga personal dan estetik. Love you always.");

  clearInterval(stickerRain);
  var count = 0;
  stickerRain = setInterval(function () {
    spawnStickerRain();
    count += 1;
    if (count > 26) clearInterval(stickerRain);
  }, 180);

  burst(window.innerWidth * 0.5, window.innerHeight * 0.5, 22);
}

/* ---------- Reset ---------- */

function resetFlow() {
  noCount = 0;
  yesGrow = 1;
  lockTap = 0;
  lockOpened = false;

  yesBtn.classList.remove("fullscreen");
  yesBtn.style.setProperty("--grow", "1");

  noBtn.classList.remove("floating", "hidden");
  noBtn.style.left = "";
  noBtn.style.top = "";

  teaseText.textContent = "";
  lockCount.textContent = "0 / 7";
  heartLock.style.animation = "";
  heartLock.style.transform = "scale(1)";

  typeText.textContent = "";
  clearInterval(typeTimer);
  clearInterval(stickerRain);

  pixelWindows.forEach(function (win) {
    win.setAttribute("hidden", "");
  });

  showRound(0);
}

/* ========== EVENT LISTENERS ========== */

noBtn.addEventListener("click", function (e) {
  e.preventDefault();
  handleNoClick();
});

yesBtn.addEventListener("click", function () {
  burst(window.innerWidth * 0.5, window.innerHeight * 0.5, 30);
  setTimeout(goToRound2, 260);
});

heartLock.addEventListener("click", function () {
  if (lockOpened) return;

  lockTap += 1;
  if (lockTap === 1) heartLock.style.animation = "none";

  lockCount.textContent = lockTap + " / 7";
  heartLock.style.transform = "scale(" + (1 + lockTap * 0.07) + ")";

  var rect = heartLock.getBoundingClientRect();
  fxHeart(rect.left + rect.width / 2, rect.top + rect.height / 2, "💗", true);

  if (lockTap >= 7) {
    lockOpened = true;
    lockCount.textContent = "Unlocked!";
    setTimeout(startDesktopRound, 320);
  }
});

pixelFolders.forEach(function (folder) {
  folder.addEventListener("click", function () {
    var targetId = folder.dataset.target;
    openWindow(targetId);
  });
});

closeButtons.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    closeWindow(btn);
  });
});

if (toFinalBtn) toFinalBtn.addEventListener("click", startFinalRound);
if (replayBtn) replayBtn.addEventListener("click", resetFlow);

window.addEventListener("pointerdown", function (e) {
  if (currentRound === 0) {
    fxHeart(e.clientX, e.clientY, "💕");
  }
});

console.log("✅ script.js loaded successfully");
