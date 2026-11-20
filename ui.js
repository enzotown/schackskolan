// ui.js — yta, färger, ljud och pekning
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const DW = 1000, DH = 700;
let vw = DW, vh = DH, SC = 1, OX = 0, OY = 0, DPR = 1;
let time = 0;

const C = {
  cream: '#fffaf3', brown: '#4a3f39', brown2: '#6b5d54',
  mint: '#7bcbb6', mintDark: '#4fae94', coral: '#ef8064', coralDark: '#c9553f',
  yellow: '#ffe08a', yellowDark: '#e8b93d', sand: '#f3ddb4',
  lightSq: '#f4e3c8', darkSq: '#c99560', edge: '#8a6134',
  whitePiece: '#fffdf8', blackPiece: '#3a322d'
};

const BX = 70, BY = 96, BSQ = 72, BSIZE = BSQ * 8;

function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  vw = window.innerWidth; vh = window.innerHeight;
  cv.width = Math.floor(vw * DPR); cv.height = Math.floor(vh * DPR);
  SC = Math.min(vw / DW, vh / DH);
  OX = (vw - DW * SC) / 2; OY = (vh - DH * SC) / 2;
  ctx.setTransform(DPR * SC, 0, 0, DPR * SC, DPR * OX, DPR * OY);
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', function () { setTimeout(resize, 200); });

function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

let actx = null, master = null;
function audio() {
  if (!actx) {
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      master = actx.createGain(); master.gain.value = 0.8;
      master.connect(actx.destination);
    } catch (e) {}
  }
  if (actx && actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(f, dur, vol, type, slide, delay) {
  const a = audio(); if (!a) return;
  const t0 = a.currentTime + (delay || 0);
  const o = a.createOscillator(), g = a.createGain();
  o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol || 0.06, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(master);
  o.start(t0); o.stop(t0 + dur + 0.03);
}
function moveSound() { tone(420, 0.07, 0.05, 'triangle', 300); }
function capSound() { tone(220, 0.12, 0.07, 'square', 120); tone(520, 0.08, 0.04, 'sine', 300); }
function badSound() { tone(200, 0.12, 0.05, 'sine', 160); }
function ding() { tone(880, 0.18, 0.05, 'sine'); tone(1320, 0.22, 0.04, 'sine', null, 0.08); }
function chime() { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.3, 0.07, 'triangle', null, i * 0.09); }); }

function sqX(s) { return BX + fOf(s) * BSQ; }
function sqY(s) { return BY + rOf(s) * BSQ; }
function sqName(s) { return FILES[fOf(s)] + (8 - rOf(s)); }
function squareAt(x, y) {
  const f = Math.floor((x - BX) / BSQ), r = Math.floor((y - BY) / BSQ);
  if (f < 0 || f > 7 || r < 0 || r > 7) return -1;
  return sqOf(f, r);
}
function toDesign(e) {
  const r = cv.getBoundingClientRect();
  const t = e.touches && e.touches[0] ? e.touches[0] : e;
  const cx = (t.clientX - r.left) * (cv.width / DPR / r.width);
  const cy = (t.clientY - r.top) * (cv.height / DPR / r.height);
  return { x: (cx - OX) / SC, y: (cy - OY) / SC };
}