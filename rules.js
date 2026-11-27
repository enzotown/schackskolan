// rules.js — schackreglerna: bräda, drag, schack och matt
const FILES = 'abcdefgh';
const START = [
  'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
  'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
  'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'
];

function sqOf(f, r) { return r * 8 + f; }
function fOf(s) { return s % 8; }
function rOf(s) { return Math.floor(s / 8); }
function isWhite(p) { return p && p === p.toUpperCase(); }
function colorOf(p) { return isWhite(p) ? 'w' : 'b'; }
function other(c) { return c === 'w' ? 'b' : 'w'; }

function newState(lightning) {
  return {
    b: START.slice(), turn: 'w',
    castle: { wK: true, wQ: true, bK: true, bQ: true },
    ep: -1, half: 0, full: 1, last: null
  };
}

function cloneState(st) {
  return {
    b: st.b.slice(), turn: st.turn,
    castle: { wK: st.castle.wK, wQ: st.castle.wQ, bK: st.castle.bK, bQ: st.castle.bQ },
    ep: st.ep, half: st.half, full: st.full, last: st.last
  };
}

function inside(f, r) { return f >= 0 && f < 8 && r >= 0 && r < 8; }

// alla pseudo-legala drag (utan att kolla egen kung)
function pseudoMoves(st, from) {
  const b = st.b, p = b[from];
  if (!p) return [];
  const mine = colorOf(p), out = [];
  const f = fOf(from), r = rOf(from);
  const add = function (tf, tr, extra) {
    if (!inside(tf, tr)) return false;
    const t = sqOf(tf, tr), q = b[t];
    if (q && colorOf(q) === mine) return false;
    const m = { from: from, to: t };
    if (q) m.cap = q;
    if (extra) Object.assign(m, extra);
    out.push(m);
    return !q;
  };
  const t = p.toLowerCase();

  if (t === 'p') {
    const dir = mine === 'w' ? -1 : 1;
    const startRow = mine === 'w' ? 6 : 1;
    const lastRow = mine === 'w' ? 0 : 7;
    const one = r + dir;
    if (inside(f, one) && !b[sqOf(f, one)]) {
      const promo = one === lastRow;
      out.push({ from: from, to: sqOf(f, one), promo: promo });
      if (r === startRow && !b[sqOf(f, r + dir * 2)]) {
        out.push({ from: from, to: sqOf(f, r + dir * 2), dbl: true });
      }
    }
    [-1, 1].forEach(function (df) {
      if (!inside(f + df, one)) return;
      const ts = sqOf(f + df, one), q = b[ts];
      if (q && colorOf(q) !== mine) {
        out.push({ from: from, to: ts, cap: q, promo: one === lastRow });
      } else if (!q && ts === st.ep) {
        out.push({ from: from, to: ts, ep: true, cap: b[sqOf(f + df, r)] });
      }
    });
    return out;
  }

  if (t === 'n') {
    [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]
      .forEach(function (d) { add(f + d[0], r + d[1]); });
    return out;
  }
  if (t === 'k') {
    [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]
      .forEach(function (d) { add(f + d[0], r + d[1]); });
    // rokad
    const home = mine === 'w' ? 7 : 0;
    if (from === sqOf(4, home) && !inCheck(st, mine)) {
      const kSide = mine === 'w' ? 'wK' : 'bK', qSide = mine === 'w' ? 'wQ' : 'bQ';
      if (st.castle[kSide] && !b[sqOf(5, home)] && !b[sqOf(6, home)] &&
          !attacked(st, sqOf(5, home), other(mine)) && !attacked(st, sqOf(6, home), other(mine))) {
        out.push({ from: from, to: sqOf(6, home), castle: 'K' });
      }
      if (st.castle[qSide] && !b[sqOf(1, home)] && !b[sqOf(2, home)] && !b[sqOf(3, home)] &&
          !attacked(st, sqOf(3, home), other(mine)) && !attacked(st, sqOf(2, home), other(mine))) {
        out.push({ from: from, to: sqOf(2, home), castle: 'Q' });
      }
    }
    return out;
  }

  const dirs = t === 'r' ? [[1, 0], [-1, 0], [0, 1], [0, -1]]
    : t === 'b' ? [[1, 1], [1, -1], [-1, 1], [-1, -1]]
      : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  dirs.forEach(function (d) {
    let tf = f + d[0], tr = r + d[1];
    while (inside(tf, tr)) {
      const go = add(tf, tr);
      if (!go) break;
      tf += d[0]; tr += d[1];
    }
  });
  return out;
}

// är rutan 'target' angripen av färgen 'by'?
function attacked(st, target, by) {
  const b = st.b, tf = fOf(target), tr = rOf(target);
  for (let s = 0; s < 64; s++) {
    const p = b[s];
    if (!p || colorOf(p) !== by) continue;
    const t = p.toLowerCase(), f = fOf(s), r = rOf(s);
    if (t === 'p') {
      const dir = by === 'w' ? -1 : 1;
      if (Math.abs(f - tf) === 1 && tr === r + dir) return true;
      continue;
    }
    if (t === 'n') {
      const d = Math.abs(f - tf) === 1 ? 2 : (Math.abs(f - tf) === 2 ? 1 : 0);
      if (d && Math.abs(r - tr) === 3 - d) return true;
      continue;
    }
    if (t === 'k') {
      if (Math.max(Math.abs(f - tf), Math.abs(r - tr)) === 1) return true;
      continue;
    }
    const df = tf - f, dr = tr - r;
    const straight = (df === 0 || dr === 0);
    const diag = Math.abs(df) === Math.abs(dr);
    if (t === 'r' && !straight) continue;
    if (t === 'b' && !diag) continue;
    if (t === 'q' && !straight && !diag) continue;
    if (!straight && !diag) continue;
    const stepF = Math.sign(df), stepR = Math.sign(dr);
    let cf = f + stepF, cr = r + stepR, blocked = false;
    while (cf !== tf || cr !== tr) {
      if (b[sqOf(cf, cr)]) { blocked = true; break; }
      cf += stepF; cr += stepR;
    }
    if (!blocked) return true;
  }
  return false;
}

function kingSquare(st, c) {
  const k = c === 'w' ? 'K' : 'k';
  for (let s = 0; s < 64; s++) if (st.b[s] === k) return s;
  return -1;
}
function inCheck(st, c) {
  const k = kingSquare(st, c);
  if (k < 0) return false;
  return attacked(st, k, other(c));
}

function applyMove(st, m) {
  const n = cloneState(st);
  const b = n.b, p = b[m.from];
  const c = colorOf(p);
  b[m.from] = 0;
  b[m.to] = m.promo ? (c === 'w' ? 'Q' : 'q') : p;
  if (m.ep) b[m.to + (c === 'w' ? 8 : -8)] = 0;
  if (m.castle === 'K') { b[m.to - 1] = 0; b[m.to + 1] = c === 'w' ? 'R' : 'r'; }
  if (m.castle === 'Q') { b[m.to + 1] = 0; b[m.to - 2] = c === 'w' ? 'R' : 'r'; }
  // rokadrättigheter
  if (p === 'K') { n.castle.wK = n.castle.wQ = false; }
  if (p === 'k') { n.castle.bK = n.castle.bQ = false; }
  if (m.from === 63) n.castle.wK = false;
  if (m.from === 56) n.castle.wQ = false;
  if (m.from === 7) n.castle.bK = false;
  if (m.from === 0) n.castle.bQ = false;
  if (m.to === 63) n.castle.wK = false;
  if (m.to === 56) n.castle.wQ = false;
  if (m.to === 7) n.castle.bK = false;
  if (m.to === 0) n.castle.bQ = false;

  n.ep = m.dbl ? (m.from + m.to) / 2 : -1;
  n.half = (p.toLowerCase() === 'p' || m.cap) ? 0 : n.half + 1;
  n.turn = other(st.turn);
  if (st.turn === 'b') n.full = st.full + 1;
  n.last = m;
  return n;
}

function legalMoves(st, from) {
  const p = st.b[from];
  if (!p || colorOf(p) !== st.turn) return [];
  return pseudoMoves(st, from).filter(function (m) {
    const ns = applyMove(st, m);
    return !inCheck(ns, st.turn);
  });
}

function allLegal(st) {
  const out = [];
  for (let s = 0; s < 64; s++) {
    if (st.b[s] && colorOf(st.b[s]) === st.turn) {
      const ms = legalMoves(st, s);
      for (let i = 0; i < ms.length; i++) out.push(ms[i]);
    }
  }
  return out;
}

function status(st) {
  const ms = allLegal(st);
  const chk = inCheck(st, st.turn);
  if (ms.length === 0) return chk ? 'matt' : 'patt';
  return chk ? 'schack' : 'spel';
}
function gameOver(st) { const s = status(st); return s === 'matt' || s === 'patt'; }