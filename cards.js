// cards.js — pjäserna och hur de går
const CARD_INFO = [
  { p: 'R', name: 'Tornet', txt: 'Rakt hur långt som helst. Stoppar vid en pjäs — men kan slå den.' },
  { p: 'N', name: 'Hästen', txt: 'Två rutor åt ena hållet, en åt andra. Hoppar över allt som står i vägen.' },
  { p: 'B', name: 'Löparen', txt: 'Snett hur långt som helst. Den stannar alltid på samma färg.' },
  { p: 'Q', name: 'Damen', txt: 'Rakt och snett — tornet och löparen i en enda pjäs. Starkast.' },
  { p: 'K', name: 'Kungen', txt: 'Bara en ruta åt gången, och aldrig in i schack.' },
  { p: 'P', name: 'Bonden', txt: 'Framåt ett steg (två från start). Slår snett framåt. Blir dam på sista raden.' }
];

function miniMoves(p) {
  const out = [];
  const add = function (df, dr) {
    if (df >= -2 && df <= 2 && dr >= -2 && dr <= 2 && !(df === 0 && dr === 0)) out.push([df, dr]);
  };
  if (p === 'R') { for (let i = -2; i <= 2; i++) { add(i, 0); add(0, i); } }
  if (p === 'B') { for (let i = -2; i <= 2; i++) { add(i, i); add(i, -i); } }
  if (p === 'Q') { for (let i = -2; i <= 2; i++) { add(i, 0); add(0, i); add(i, i); add(i, -i); } }
  if (p === 'K') { add(1, 0); add(-1, 0); add(0, 1); add(0, -1); add(1, 1); add(1, -1); add(-1, 1); add(-1, -1); }
  if (p === 'N') { add(1, -2); add(2, -1); add(2, 1); add(1, 2); add(-1, 2); add(-2, 1); add(-2, -1); add(-1, -2); }
  if (p === 'P') { add(0, -1); add(0, -2); add(-1, -1); add(1, -1); }
  return out;
}

function drawCards() {
  drawBg();
  drawRoundBack();
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = C.brown;
  ctx.font = 'bold 38px "Trebuchet MS", sans-serif';
  ctx.fillText('Pjäserna och hur de går', DW / 2, 62);
  ctx.restore();

  const step = 5;
  for (let i = 0; i < CARD_INFO.length; i++) {
    const info = CARD_INFO[i];
    const col = i % 2, row = Math.floor(i / 2);
    const x = 30 + col * 480, y = 90 + row * 196, w = 460, h = 180;
    ctx.save();
    ctx.fillStyle = 'rgba(74,63,57,.13)';
    rr(x + 4, y + 6, w, h, 22); ctx.fill();
    ctx.fillStyle = C.cream;
    rr(x, y, w, h, 22); ctx.fill();
    ctx.strokeStyle = 'rgba(74,63,57,.12)'; ctx.lineWidth = 4;
    rr(x, y, w, h, 22); ctx.stroke();
    ctx.restore();

    drawPieceIcon(info.p, x + 62, y + 92, 92);

    // liten karta över dragen
    const gx = x + 130, gy = y + 40, cell = 20;
    const cx0 = gx + cell * 2.5, cy0 = gy + cell * 2.5;
    ctx.save();
    for (let fx = 0; fx < 5; fx++) {
      for (let fy = 0; fy < 5; fy++) {
        ctx.fillStyle = 'rgba(74,63,57,.06)';
        ctx.fillRect(gx + fx * cell, gy + fy * cell, cell - 1.5, cell - 1.5);
      }
    }
    const ms = miniMoves(info.p);
    for (let k = 0; k < ms.length; k++) {
      const fx = 2 + ms[k][0], fy = 2 + ms[k][1];
      if (fx < 0 || fx > 4 || fy < 0 || fy > 4) continue;
      ctx.fillStyle = C.mint;
      ctx.beginPath();
      ctx.arc(gx + fx * cell + cell / 2, gy + fy * cell + cell / 2, cell * 0.22, 0, 6.3);
      ctx.fill();
    }
    ctx.restore();
    drawPieceIcon(info.p, cx0, cy0 - 2, cell * 1.5);

    ctx.save();
    ctx.textAlign = 'left';
    ctx.fillStyle = C.brown;
    ctx.font = 'bold 24px "Trebuchet MS", sans-serif';
    ctx.fillText(info.name, gx + 116, y + 56);
    ctx.fillStyle = C.brown2;
    ctx.font = '17px "Trebuchet MS", sans-serif';
    wrapLeft(info.txt, gx + 116, y + 88, w - 140, 22);
    ctx.restore();
  }
}

function wrapLeft(txt, x, y, maxW, lh) {
  const words = txt.split(' ');
  let line = '', yy = y;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), x, yy); line = words[i] + ' '; yy += lh;
    } else line = test;
  }
  ctx.fillText(line.trim(), x, yy);
}