// loop.js — uppdatering och teckning av brädskärmarna
function marksFor() {
  const mk = { sel: sel, moves: moves, last: last, stars: stars, hint: hint };
  if (st && inCheck(st, st.turn)) mk.check = kingSquare(st, st.turn);
  return mk;
}

function drawPieces() {
  for (let s = 0; s < 64; s++) {
    const p = st.b[s];
    if (!p) continue;
    if (anim && (s === anim.to || s === anim.from)) continue;
    const cx = sqX(s) + BSQ / 2, cy = sqY(s) + BSQ / 2;
    drawPieceIcon(p, cx, cy, BSQ * 0.86);
  }
}

function drawAnim() {
  if (!anim) return;
  const u = Math.min(1, anim.t / 0.24);
  const e = u * u * (3 - 2 * u);
  const x1 = sqX(anim.from) + BSQ / 2, y1 = sqY(anim.from) + BSQ / 2;
  const x2 = sqX(anim.to) + BSQ / 2, y2 = sqY(anim.to) + BSQ / 2;
  const cx = x1 + (x2 - x1) * e, cy = y1 + (y2 - y1) * e - Math.sin(e * Math.PI) * 10;
  drawPieceIcon(anim.p, cx, cy, BSQ * 0.86);
}

function drawPanel() {
  const x = 668, w = 300;
  ctx.save();
  ctx.fillStyle = C.cream;
  rr(x, 96, w, 560, 24); ctx.fill();
  ctx.strokeStyle = 'rgba(74,63,57,.12)'; ctx.lineWidth = 4;
  rr(x, 96, w, 560, 24); ctx.stroke();

  let title = 'Schack', sub = '';
  if (lesson) { title = lesson.name; sub = lesson.piece ? 'Pjäs: ' + pieceName(lesson.piece) : ''; }
  else if (mate) { title = mate.name; sub = 'Matt på ett drag'; }
  else if (screen === 'play') { title = 'Mot roboten'; sub = 'Du är vit'; }

  ctx.textAlign = 'center';
  ctx.fillStyle = C.brown;
  ctx.font = 'bold 26px "Trebuchet MS", sans-serif';
  ctx.fillText(title, x + w / 2, 140);
  if (sub) {
    ctx.fillStyle = C.brown2; ctx.font = '17px "Trebuchet MS", sans-serif';
    ctx.fillText(sub, x + w / 2, 168);
  }

  if (lesson && lesson.kind === 'collect') {
    ctx.fillStyle = C.brown2; ctx.font = 'bold 18px "Trebuchet MS", sans-serif';
    ctx.fillText('Kvar att plocka: ' + stars.length, x + w / 2, 200);
  }

  // pratbubbla
  if (msg) {
    ctx.fillStyle = 'rgba(123,203,182,.22)';
    rr(x + 16, 220, w - 32, 140, 18); ctx.fill();
    ctx.fillStyle = C.brown;
    ctx.font = '17px "Trebuchet MS", sans-serif';
    wrapText(msg, x + 30, 250, w - 60, 23);
  }

  if (screen === 'play') {
    drawBtn(x + 20, 470, 240, 60, 'Ledtråd', C.mint);
    drawBtn(x + 20, 540, 240, 60, 'Ångra', '#8f7bbf');
    drawBtn(x + 20, 610, 240, 58, 'Nytt spel', C.coral);
    ctx.fillStyle = C.brown2; ctx.font = '16px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    const s = status(st);
    let txt = s === 'schack' ? 'Schack!' : (s === 'matt' ? 'Schackmatt!' : (s === 'patt' ? 'Patt' : 'Din tur'));
    ctx.fillText(txt, x + w / 2, 440);
  } else {
    drawBtn(x + 20, 470, 240, 58, 'Börja om', C.mint);
    ctx.fillStyle = C.brown2; ctx.font = '15px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Tryck på pjäsen — de gröna', x + w / 2, 560);
    ctx.fillText('prickarna visar vart den får gå.', x + w / 2, 582);
  }
  ctx.restore();
}

function wrapText(txt, x, y, maxW, lh) {
  const words = txt.split(' ');
  let line = '', yy = y;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), x + maxW / 2, yy);
      line = words[i] + ' '; yy += lh;
    } else line = test;
  }
  ctx.fillText(line.trim(), x + maxW / 2, yy);
}

function drawBoardScreen() {
  drawBg();
  drawRoundBack();
  drawBoard(marksFor());
  drawPieces();
  drawAnim();
  drawPanel();
  if (done > 0) drawWin();
}

function drawRoundBack() {
  ctx.save();
  const x = 40, y = 40;
  ctx.fillStyle = 'rgba(74,63,57,.16)';
  ctx.beginPath(); ctx.arc(x + 2, y + 4, 28, 0, 6.3); ctx.fill();
  ctx.fillStyle = C.mint;
  ctx.beginPath(); ctx.arc(x, y, 28, 0, 6.3); ctx.fill();
  ctx.strokeStyle = C.cream; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + 6, y - 11); ctx.lineTo(x - 6, y); ctx.lineTo(x + 6, y + 11); ctx.stroke();
  ctx.restore();
}

function drawWin() {
  ctx.save();
  ctx.fillStyle = 'rgba(74,63,57,.35)';
  ctx.fillRect(0, 0, DW, DH);
  ctx.fillStyle = C.cream;
  rr(260, 200, 480, 300, 32); ctx.fill();
  starShape(500, 290, 56, 1 + Math.sin(time * 3) * 0.05);
  ctx.fillStyle = C.brown;
  ctx.font = 'bold 36px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Snyggt!', 500, 400);
  ctx.fillStyle = C.brown2;
  ctx.font = '22px "Trebuchet MS", sans-serif';
  ctx.fillText('Tryck för att gå vidare', 500, 450);
  ctx.restore();
}

function pieceName(p) {
  const map = { R: 'tornet', N: 'hästen', B: 'löparen', Q: 'damen', K: 'kungen', P: 'bonden' };
  return map[p] || 'pjäsen';
}

function update(dt) {
  time += dt;
  if (msgT > 0) msgT -= dt; else if (msg && msgT <= 0 && !lesson && !mate && screen !== 'play') msg = '';
  if (done > 0) done -= dt;
  if (anim) { anim.t += dt; if (anim.t > 0.24) anim = null; }
  if (revertT > 0) {
    revertT -= dt;
    if (revertT <= 0 && revertTo) { st = revertTo; revertTo = null; last = null; }
  }
  if (screen === 'play' && st && st.turn === 'b' && !gameOver(st) && !anim) {
    aiTimer -= dt;
    if (aiTimer <= 0) {
      const m = chooseMove(st, aiPieces <= 6 ? 1 + (aiLevel > 1 ? 1 : 0) : aiLevel);
      if (m) doMove(m);
    }
  }
}

let aiPieces = 16;
function draw() {
  if (screen === 'menu') drawMenu();
  else if (screen === 'cards') { drawCards(); }
  else drawMatePlay();
}
function drawMatePlay() { drawBoardScreen(); }

let lastT = performance.now();
function frame(now) {
  let dt = (now - lastT) / 1000; lastT = now;
  if (dt > 0.05) dt = 0.05;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

resize();
requestAnimationFrame(frame);