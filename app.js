// app.js — skärmar, träningen och inmatningen
let screen = 'menu', st = null, sel = -1, moves = [], stars = [], last = null;
let lesson = null, mate = null, msg = '', msgT = 0, hint = null, anim = null, done = 0;
let aiLevel = 2, aiThink = 0, aiMove = null, playerColor = 'w', aiTimer = 0;

function goMenu() {
  screen = 'menu'; st = null; sel = -1; moves = []; stars = []; lesson = null; mate = null;
  msg = ''; anim = null; hint = null; done = 0;
}

function startLesson(L) {
  lesson = L; mate = null; screen = 'lesson';
  st = lessonState(L.map, 'w');
  stars = L.stars.map(function (n) { return S(n); });
  sel = -1; moves = []; last = null; msg = L.text; msgT = 4; hint = null; anim = null; done = 0;
}

function startMate(M) {
  mate = M; lesson = null; screen = 'mate';
  st = lessonState(M.map, 'w');
  stars = []; sel = -1; moves = []; last = null; msg = M.text; msgT = 4; hint = null; anim = null; done = 0;
}

function startPlay() {
  screen = 'play'; st = newState(); sel = -1; moves = []; stars = []; last = null;
  msg = 'Du är vit. Tryck på en pjäs för att se vart den kan gå.'; msgT = 5; done = 0; aiMove = null;
}

function checkSt() {
  if (!st) return;
  if (lesson && lesson.kind === 'escape') {
    if (!inCheck(st, 'w')) { winLesson(); }
    return;
  }
  if (lesson && lesson.kind === 'promote') {
    const hasQueen = st.b.some(function (p) { return p === 'Q'; });
    if (hasQueen) winLesson();
    return;
  }
  if (mate) {
    if (status(st) === 'matt') { winLesson(); }
  }
}

function winLesson() {
  done = 3.0;
  chime();
  msg = 'Rätt! Snyggt jobbat.';
  msgT = 3;
}

function selectSq(s) {
  const p = st.b[s];
  if (!p) { sel = -1; moves = []; return; }
  if (colorOf(p) !== st.turn) { sel = -1; moves = []; return; }
  if (screen === 'lesson' && lesson && lesson.piece && p !== lesson.piece) {
    msg = 'Nu är det ' + lesson.name.toLowerCase() + ' som gäller!'; msgT = 2.2; badSound();
    return;
  }
  sel = s;
  moves = legalMoves(st, s);
  if (!moves.length && screen === 'lesson') {
    msg = 'Dit kan den inte gå. Titta på punkterna!'; msgT = 2.2;
  }
}

function doMove(m) {
  const from = m.from, to = m.to;
  const before = st;
  if (screen === 'play') history.push(before);
  anim = { p: st.b[from], from: from, to: to, t: 0 };
  const wasCap = !!m.cap;
  st = applyMove(st, m);
  last = { from: from, to: to };
  if (screen === 'lesson' && stars.length) {
    const i = stars.indexOf(to);
    if (i >= 0) { stars.splice(i, 1); ding(); }
  }
  if (wasCap) capSound(); else moveSound();
  sel = -1; moves = [];
  if (stars.length === 0 && screen === 'lesson' && lesson.kind === 'collect') winLesson();
  else checkSt();
  if (screen === 'mate' && done <= 0) {
    revertTo = before; revertT = 1.4;
    msg = status(st) === 'schack' ? 'Schack! Men inte matt.' : 'Inte matt än. Prova ett annat drag.';
    msgT = 1.6; badSound();
  }
  if (screen === 'play' && st.turn === 'b' && !gameOver(st)) aiTimer = 0.55;
}

function onDown(e) {
  e.preventDefault();
  audio();
  const p = toDesign(e);

  if (screen === 'menu') { menuTap(p); return; }
  if (p.x < 56 && p.y < 56) { goMenu(); return; }
  if (done > 0 && p.x > 300 && p.y > 400) { done = 0; goMenu(); return; }

  // högerpanelen
  if (p.x > 660) {
    if (screen === 'play') {
      if (p.y > 470 && p.y < 530 && p.x < 830) { if (moves.length === 0) { hint = bestMove(st); } return; }
      if (p.y > 540 && p.y < 600 && p.x < 830) { undo(); return; }
      if (p.y > 610 && p.y < 668 && p.x < 830) { startPlay(); return; }
      return;
    }
    if (p.y > 470 && p.y < 530) { restart(); return; }
    return;
  }

  const s = squareAt(p.x, p.y);
  if (s < 0) return;
  if (sel >= 0) {
    const m = moves.filter(function (x) { return x.to === s; })[0];
    if (m) { hint = null; doMove(m); return; }
  }
  selectSq(s);
}

function undo() {
  if (screen !== 'play' || !history.length) return;
  let prev = history.pop();
  if (prev.turn === 'b' && history.length) prev = history.pop();
  st = prev; sel = -1; moves = []; last = null; aiTimer = 0;
}

function restart() {
  if (lesson) startLesson(lesson);
  else if (mate) startMate(mate);
  else if (screen === 'play') startPlay();
}

function onUp(e) { e.preventDefault(); }
cv.addEventListener('pointerdown', onDown);
cv.addEventListener('pointerup', onUp);
cv.addEventListener('pointercancel', onUp);