// art2.js — biskop, dam, kung, knappar och Enzo
function drawPieceBig(p, cx, cy, size, opts) {
  if (!p) return;
  const t = p.toLowerCase();
  if (t === 'b' || t === 'q' || t === 'k') {
    const white = isWhite(p);
    const s = size / 100;
    ctx.save();
    ctx.translate(cx, cy); ctx.scale(s, s);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const body = white ? C.whitePiece : C.blackPiece;
    const edge = white ? C.brown : '#1d1714';
    const line = white ? 4.5 : 3.2;
    const fillStroke = function () { ctx.fillStyle = body; ctx.fill(); ctx.strokeStyle = edge; ctx.lineWidth = line; ctx.stroke(); };

    ctx.beginPath(); ctx.ellipse(0, 40, 32, 9, 0, 0, 6.3); fillStroke();
    if (t === 'b') {
      ctx.beginPath();
      ctx.moveTo(-20, 38); ctx.quadraticCurveTo(-8, 22, -10, 6);
      ctx.quadraticCurveTo(-12, -18, 0, -36);
      ctx.quadraticCurveTo(12, -18, 10, 6);
      ctx.quadraticCurveTo(8, 22, 20, 38);
      ctx.closePath(); fillStroke();
      ctx.beginPath(); ctx.arc(0, -40, 7, 0, 6.3); fillStroke();
      ctx.strokeStyle = edge; ctx.lineWidth = 3.4;
      ctx.beginPath(); ctx.moveTo(-4, -6); ctx.lineTo(4, -16); ctx.stroke();
    } else if (t === 'q') {
      ctx.beginPath();
      ctx.moveTo(-24, 38); ctx.quadraticCurveTo(-14, 14, -16, -6);
      ctx.lineTo(-22, -30); ctx.lineTo(-8, -16); ctx.lineTo(0, -34);
      ctx.lineTo(8, -16); ctx.lineTo(22, -30); ctx.lineTo(16, -6);
      ctx.quadraticCurveTo(14, 14, 24, 38);
      ctx.closePath(); fillStroke();
      [-22, 0, 22].forEach(function (px) {
        ctx.beginPath(); ctx.arc(px, px === 0 ? -38 : -34, 6, 0, 6.3); fillStroke();
      });
    } else {
      ctx.beginPath();
      ctx.moveTo(-24, 38); ctx.quadraticCurveTo(-14, 14, -16, -4);
      ctx.lineTo(-18, -26); ctx.lineTo(-8, -14); ctx.lineTo(0, -30);
      ctx.lineTo(8, -14); ctx.lineTo(18, -26); ctx.lineTo(16, -4);
      ctx.quadraticCurveTo(14, 14, 24, 38);
      ctx.closePath(); fillStroke();
      ctx.beginPath(); ctx.moveTo(0, -32); ctx.lineTo(0, -52); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-9, -43); ctx.lineTo(9, -43); ctx.stroke();
    }
    ctx.restore();
    return;
  }
  drawPiece(p, cx, cy, size, opts);
}

function drawPieceIcon(p, cx, cy, size) {
  const t = p.toLowerCase();
  if (t === 'n') drawPiece(p, cx, cy, size);
  else drawPieceBig(p, cx, cy, size);
}

function drawBtn(x, y, w, h, label, col, small) {
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.16)';
  rr(x + 3, y + 5, w, h, small ? 16 : 24); ctx.fill();
  ctx.fillStyle = col || C.mint;
  rr(x, y, w, h, small ? 16 : 24); ctx.fill();
  ctx.fillStyle = C.cream;
  ctx.font = 'bold ' + (small ? 20 : 26) + 'px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2 + 1);
  ctx.restore();
}

function drawEnzo(x, y, mood, s) {
  s = s || 1;
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(74,63,57,.14)';
  ctx.beginPath(); ctx.ellipse(0, 2, 30, 7, 0, 0, 6.3); ctx.fill();
  ctx.strokeStyle = '#5c6b7a'; ctx.lineWidth = 11; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-11, -34); ctx.lineTo(-13, -4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(11, -34); ctx.lineTo(13, -4); ctx.stroke();
  ctx.fillStyle = C.brown; rr(-22, -8, 20, 9, 4); ctx.fill(); rr(4, -8, 20, 9, 4); ctx.fill();
  ctx.fillStyle = C.mint; rr(-25, -84, 50, 54, 16); ctx.fill();
  ctx.fillStyle = C.mintDark; rr(-25, -46, 50, 16, 8); ctx.fill();
  ctx.strokeStyle = C.mint; ctx.lineWidth = 12; ctx.lineCap = 'round';
  const wave = mood === 'happy' ? Math.sin(time * 9) * 0.45 : 0;
  ctx.save(); ctx.translate(-24, -76); ctx.rotate(-0.5 + wave);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 32); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.translate(24, -76); ctx.rotate(0.5 - wave);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 32); ctx.stroke(); ctx.restore();
  ctx.fillStyle = '#f3e1cf';
  ctx.beginPath(); ctx.arc(-30 - wave * 12, -44, 7.5, 0, 6.3); ctx.fill();
  ctx.beginPath(); ctx.arc(30 + wave * 12, -44, 7.5, 0, 6.3); ctx.fill();
  rr(-8, -92, 16, 12, 5); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -110, 25, 0, 6.3); ctx.fill();
  ctx.beginPath(); ctx.arc(-24, -110, 6, 0, 6.3); ctx.fill();
  ctx.beginPath(); ctx.arc(24, -110, 6, 0, 6.3); ctx.fill();
  ctx.fillStyle = '#ef8064';
  ctx.beginPath(); ctx.arc(0, -118, 25, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -132, 6, 0, 6.3); ctx.fill();
  ctx.fillStyle = C.brown;
  const blink = (Math.floor(time * 0.9) % 7 === 0) ? 0.3 : 1;
  ctx.beginPath(); ctx.ellipse(-9, -114, 3.4, 3.4 * blink, 0, 0, 6.3); ctx.fill();
  ctx.beginPath(); ctx.ellipse(9, -114, 3.4, 3.4 * blink, 0, 0, 6.3); ctx.fill();
  ctx.strokeStyle = '#b0573f'; ctx.lineWidth = 2.6;
  ctx.beginPath();
  if (mood === 'happy') ctx.arc(0, -104, 8, 0.2, Math.PI - 0.2);
  else ctx.arc(0, -100, 6, Math.PI * 0.25, Math.PI * 0.75);
  ctx.stroke();
  ctx.fillStyle = 'rgba(239,128,100,.30)';
  ctx.beginPath(); ctx.arc(-16, -106, 5, 0, 6.3); ctx.fill();
  ctx.beginPath(); ctx.arc(16, -106, 5, 0, 6.3); ctx.fill();
  ctx.restore();
}