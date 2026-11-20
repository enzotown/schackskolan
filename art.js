// art.js — brädan och pjäserna
function drawBoard(marks) {
  marks = marks || {};
  // ram
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.18)';
  rr(BX - 12, BY - 6, BSIZE + 24, BSIZE + 24, 18); ctx.fill();
  ctx.fillStyle = C.edge;
  rr(BX - 10, BY - 14, BSIZE + 20, BSIZE + 20, 14); ctx.fill();
  ctx.restore();

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const s = sqOf(f, r);
      ctx.fillStyle = (f + r) % 2 === 0 ? C.lightSq : C.darkSq;
      ctx.fillRect(BX + f * BSQ, BY + r * BSQ, BSQ, BSQ);
      if (marks.last && (marks.last.from === s || marks.last.to === s)) {
        ctx.fillStyle = 'rgba(255,224,138,.55)';
        ctx.fillRect(BX + f * BSQ, BY + r * BSQ, BSQ, BSQ);
      }
      if (marks.sel === s) {
        ctx.fillStyle = 'rgba(123,203,182,.65)';
        ctx.fillRect(BX + f * BSQ, BY + r * BSQ, BSQ, BSQ);
      }
      if (marks.check === s) {
        ctx.fillStyle = 'rgba(239,128,100,.65)';
        ctx.fillRect(BX + f * BSQ, BY + r * BSQ, BSQ, BSQ);
      }
    }
  }
  // koordinater
  ctx.save();
  ctx.font = 'bold 15px "Trebuchet MS", sans-serif';
  ctx.fillStyle = C.brown2; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let f = 0; f < 8; f++) ctx.fillText(FILES[f], BX + f * BSQ + BSQ / 2, BY + BSIZE + 18);
  for (let r = 0; r < 8; r++) ctx.fillText(String(8 - r), BX - 26, BY + r * BSQ + BSQ / 2);
  ctx.restore();

  // dragrutor
  if (marks.moves) {
    for (let i = 0; i < marks.moves.length; i++) {
      const s = marks.moves[i].to;
      const cx = sqX(s) + BSQ / 2, cy = sqY(s) + BSQ / 2;
      if (marks.moves[i].cap) {
        ctx.strokeStyle = 'rgba(74,63,57,.55)'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(cx, cy, BSQ * 0.40, 0, 6.3); ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(74,63,57,.32)';
        ctx.beginPath(); ctx.arc(cx, cy, BSQ * 0.14, 0, 6.3); ctx.fill();
      }
    }
  }
  // stjärnmål i träningen
  if (marks.stars) {
    for (let i = 0; i < marks.stars.length; i++) {
      const s = marks.stars[i];
      const cx = sqX(s) + BSQ / 2, cy = sqY(s) + BSQ / 2;
      starShape(cx, cy, BSQ * 0.28, Math.sin(time * 3 + i) * 0.08 + 1);
    }
  }
  // hintpil
  if (marks.hint) {
    const a = marks.hint;
    const x1 = sqX(a.from) + BSQ / 2, y1 = sqY(a.from) + BSQ / 2;
    const x2 = sqX(a.to) + BSQ / 2, y2 = sqY(a.to) + BSQ / 2;
    ctx.save();
    ctx.strokeStyle = 'rgba(79,174,148,.9)'; ctx.lineWidth = 9; ctx.lineCap = 'round';
    ctx.setLineDash([12, 10]); ctx.lineDashOffset = -time * 40;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.restore();
  }
}

function starShape(cx, cy, r, s) {
  s = s || 1;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5;
    const rad = i % 2 ? r * 0.45 : r;
    const px = Math.cos(a) * rad, py = Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = C.yellow; ctx.fill();
  ctx.strokeStyle = C.yellowDark; ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
}

// pjäserna: enkla, tjocka, vänliga former
function drawPiece(p, cx, cy, size, opts) {
  if (!p) return;
  const t = p.toLowerCase();
  const white = isWhite(p);
  const s = size / 100;
  ctx.save();
  ctx.translate(cx, cy); ctx.scale(s, s);
  if (opts && opts.flip) { }
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const body = white ? C.whitePiece : C.blackPiece;
  const edge = white ? C.brown : '#1d1714';
  const line = white ? 4.5 : 3.2;

  const fillStroke = function () {
    ctx.fillStyle = body; ctx.fill();
    ctx.strokeStyle = edge; ctx.lineWidth = line; ctx.stroke();
  };

  if (t === 'p') {
    ctx.beginPath(); ctx.ellipse(0, 40, 30, 9, 0, 0, 6.3); fillStroke();
    ctx.beginPath();
    ctx.moveTo(-18, 38); ctx.lineTo(-11, 8); ctx.lineTo(11, 8); ctx.lineTo(18, 38);
    ctx.closePath(); fillStroke();
    ctx.beginPath(); ctx.arc(0, -8, 19, 0, 6.3); fillStroke();
  } else if (t === 'r') {
    ctx.beginPath(); ctx.ellipse(0, 40, 33, 9, 0, 0, 6.3); fillStroke();
    ctx.beginPath();
    ctx.moveTo(-24, 38); ctx.lineTo(-26, -12); ctx.lineTo(26, -12); ctx.lineTo(24, 38);
    ctx.closePath(); fillStroke();
    ctx.beginPath();
    ctx.moveTo(-30, -12); ctx.lineTo(-30, -34); ctx.lineTo(-16, -34); ctx.lineTo(-16, -24);
    ctx.lineTo(-6, -24); ctx.lineTo(-6, -34); ctx.lineTo(6, -34); ctx.lineTo(6, -24);
    ctx.lineTo(16, -24); ctx.lineTo(16, -34); ctx.lineTo(30, -34); ctx.lineTo(30, -12);
    ctx.closePath(); fillStroke();
    ctx.beginPath(); ctx.moveTo(-24, 4); ctx.lineTo(24, 4);
    ctx.strokeStyle = white ? 'rgba(74,63,57,.35)' : 'rgba(255,250,243,.35)';
    ctx.lineWidth = 3; ctx.stroke();
  } else if (t === 'n') {
    ctx.beginPath(); ctx.ellipse(0, 40, 30, 9, 0, 0, 6.3); fillStroke();
    ctx.beginPath();
    ctx.moveTo(-20, 36);
    ctx.quadraticCurveTo(-26, 8, -12, -6);
    ctx.lineTo(-16, -26);
    ctx.lineTo(2, -16);
    ctx.quadraticCurveTo(16, -10, 22, 4);
    ctx.lineTo(24, 26);
    ctx.quadraticCurveTo(22, 38, 12, 36);
    ctx.closePath(); fillStroke();
    ctx.fillStyle = white ? C.brown : '#fffaf3';
    ctx.beginPath(); ctx.arc(4, -4, 3.6, 0, 6.3); ctx.fill();
    ctx.beginPath(); ctx.moveTo(24, 6); ctx.quadraticCurveTo(30, 10, 26, 20); ctx.stroke();
  }
  ctx.restore();
}