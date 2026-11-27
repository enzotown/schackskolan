// menu.js — startsidan med tio brickor
let history = [], revertTo = null, revertT = 0;

const TILES = [
  { kind: 'lesson', i: 0 }, { kind: 'lesson', i: 1 }, { kind: 'lesson', i: 2 }, { kind: 'lesson', i: 3 },
  { kind: 'lesson', i: 4 }, { kind: 'lesson', i: 5 }, { kind: 'lesson', i: 6 }, { kind: 'mate', i: 0 },
  { kind: 'mate', i: 1 }, { kind: 'mate', i: 2 }, { kind: 'play', i: 0 }, { kind: 'cards', i: 0 }
];
const TX = [30, 268, 506, 744], TY = [104, 306, 508], TW = 218, TH = 178;

function tileRect(k) {
  const col = k % 4, row = Math.floor(k / 4);
  return { x: TX[col], y: TY[row], w: TW, h: TH };
}

function menuTap(p) {
  for (let k = 0; k < TILES.length; k++) {
    const r = tileRect(k);
    if (p.x > r.x && p.x < r.x + r.w && p.y > r.y && p.y < r.y + r.h) {
      const t = TILES[k];
      audio();
      if (t.kind === 'lesson') startLesson(LESSONS[t.i]);
      else if (t.kind === 'mate') startMate(MATES[t.i]);
      else if (t.kind === 'play') startPlay();
      else { screen = 'cards'; }
      return;
    }
  }
}

function drawMenu() {
  drawBg();
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(74,63,57,.16)';
  ctx.font = 'bold 46px "Trebuchet MS", sans-serif';
  ctx.fillText('Schackskolan', 502, 62);
  ctx.fillStyle = C.brown;
  ctx.fillText('Schackskolan', 500, 58);
  ctx.restore();

  for (let k = 0; k < TILES.length; k++) {
    const t = TILES[k], r = tileRect(k);
    ctx.save();
    ctx.fillStyle = 'rgba(74,63,57,.14)';
    rr(r.x + 4, r.y + 6, r.w, r.h, 22); ctx.fill();
    ctx.fillStyle = C.cream;
    rr(r.x, r.y, r.w, r.h, 22); ctx.fill();
    ctx.strokeStyle = t.kind === 'play' ? C.coral : (t.kind === 'cards' ? C.yellowDark : C.mint);
    ctx.lineWidth = 5;
    rr(r.x, r.y, r.w, r.h, 22); ctx.stroke();

    let label = '', sub = '';
    if (t.kind === 'lesson') {
      const L = LESSONS[t.i];
      label = L.name;
      drawPieceIcon(L.piece, r.x + r.w / 2, r.y + 66, 84);
      sub = (L.kind === 'escape' ? 'kom ur schack' : (L.kind === 'promote' ? 'slå & bli dam' : 'samla stjärnor'));
    } else if (t.kind === 'mate') {
      const M = MATES[t.i];
      label = M.name;
      drawPieceIcon(t.i === 2 ? 'R' : (t.i === 1 ? 'R' : 'Q'), r.x + r.w / 2, r.y + 66, 84);
      sub = 'matt på ett drag';
    } else if (t.kind === 'play') {
      label = 'Spela';
      drawKotten(r.x + r.w / 2, r.y + 104, 'happy', 0.62);
      sub = 'mot roboten';
    } else {
      label = 'Pjäserna';
      drawPieceIcon('N', r.x + 68, r.y + 66, 70);
      drawPieceIcon('p', r.x + 148, r.y + 66, 62);
      sub = 'hur de går';
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = C.brown;
    let fs = 23;
    do {
      ctx.font = 'bold ' + fs + 'px "Trebuchet MS", sans-serif';
      fs -= 1;
    } while (ctx.measureText(label).width > r.w - 22 && fs > 13);
    ctx.fillText(label, r.x + r.w / 2, r.y + r.h - 44);
    ctx.fillStyle = C.brown2;
    ctx.font = '16px "Trebuchet MS", sans-serif';
    ctx.fillText(sub, r.x + r.w / 2, r.y + r.h - 20);
    ctx.restore();
  }
}

function drawBg() {
  const g = ctx.createLinearGradient(0, 0, 0, DH);
  g.addColorStop(0, '#eef8fc'); g.addColorStop(0.5, '#fdf6ea'); g.addColorStop(1, C.sand);
  ctx.fillStyle = g; ctx.fillRect(0, 0, DW, DH);
}