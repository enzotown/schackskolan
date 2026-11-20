// ai.js — en liten schackspelare med tre styrkor
const VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
const PAWN_TAB = [
  0, 0, 0, 0, 0, 0, 0, 0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5, 5, 10, 25, 25, 10, 5, 5,
  0, 0, 0, 20, 20, 0, 0, 0,
  5, -5, -10, 0, 0, -10, -5, 5,
  5, 10, 10, -20, -20, 10, 10, 5,
  0, 0, 0, 0, 0, 0, 0, 0
];

function evaluate(st) {
  let score = 0;
  for (let s = 0; s < 64; s++) {
    const p = st.b[s];
    if (!p) continue;
    const t = p.toLowerCase();
    let v = VAL[t];
    if (t === 'p') v += PAWN_TAB[p === 'P' ? s : 63 - s];
    score += isWhite(p) ? v : -v;
  }
  return score;
}

// enkel alfa-beta; djup 1 = titta ett drag fram
function search(st, depth, alpha, beta, ply) {
  if (depth === 0) return { score: (st.turn === 'w' ? 1 : -1) * evaluate(st) };
  const ms = allLegal(st);
  if (!ms.length) {
    if (inCheck(st, st.turn)) return { score: st.turn === 'w' ? -99999 + ply : 99999 - ply };
    return { score: 0 };
  }
  let best = null;
  for (let i = 0; i < ms.length; i++) {
    const child = search(applyMove(st, ms[i]), depth - 1, -beta, -alpha, ply + 1);
    const sc = -child.score;
    if (best === null || sc > best.score) { best = { score: sc, move: ms[i] }; }
    if (sc > alpha) alpha = sc;
    if (alpha >= beta) break;
  }
  return best;
}

function chooseMove(st, level) {
  const ms = allLegal(st);
  if (!ms.length) return null;
  if (level <= 1) {
    // lätt: oftast slump, men tar gärna en pjäs om det är gratis
    const good = ms.filter(function (m) { return m.cap && VAL[m.cap.toLowerCase()] > 150; });
    if (good.length && Math.random() < 0.55) return good[Math.floor(Math.random() * good.length)];
    return ms[Math.floor(Math.random() * ms.length)];
  }
  const depth = level === 2 ? 1 : 2;
  const res = search(st, depth, -1e9, 1e9, 0);
  let pick = res.move;
  // lite variation: bland lika bra drag
  if (level === 2 && Math.random() < 0.3) {
    const alts = ms.filter(function (m) {
      const sc = -search(applyMove(st, m), depth - 1, -1e9, 1e9, 1).score;
      return Math.abs(sc - res.score) < 30;
    });
    if (alts.length) pick = alts[Math.floor(Math.random() * alts.length)];
  }
  return pick || ms[0];
}

// bästa draget för en hint
function bestMove(st) { return search(st, 2, -1e9, 1e9, 0).move; }