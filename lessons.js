// lessons.js — träningen: en pjäs i taget, på riktigt
function emptyBoard() { const b = new Array(64).fill(0); return b; }
function place(b, sq, p) { b[sqOf(FILES.indexOf(sq[0]), 8 - parseInt(sq[1], 10))] = p; return b; }
function S(name) { return sqOf(FILES.indexOf(name[0]), 8 - parseInt(name[1], 10)); }

function lessonState(map, turn) {
  const b = emptyBoard();
  Object.keys(map).forEach(function (k) { b[S(k)] = map[k]; });
  return { b: b, turn: turn || 'w', castle: { wK: 0, wQ: 0, bK: 0, bQ: 0 }, ep: -1, half: 0, full: 1, last: null };
}

const LESSONS = [
  {
    id: 'torn', name: 'Tornet', piece: 'R', kind: 'collect',
    text: 'Tornet går rakt — hur långt som helst, men bara i kors.',
    map: { d4: 'R' }, stars: ['a4', 'h4', 'd8']
  },
  {
    id: 'löpare', name: 'Löparen', piece: 'B', kind: 'collect',
    text: 'Löparen går snett, hur långt som helst. Den byter alltid färg på rutan.',
    map: { d4: 'B' }, stars: ['a1', 'h8', 'b6']
  },
  {
    id: 'damen', name: 'Damen', piece: 'Q', kind: 'collect',
    text: 'Damen är tornet och löparen i ett — rakt och snett.',
    map: { d4: 'Q' }, stars: ['a1', 'h4', 'd8']
  },
  {
    id: 'hästen', name: 'Hästen', piece: 'N', kind: 'collect',
    text: 'Hästen hoppar i ett L: två rutor åt ena hållet, en åt andra. Den hoppar över allt!',
    map: { d4: 'N', e5: 'p' }, stars: ['c6', 'f5', 'e2']
  },
  {
    id: 'kungen', name: 'Kungen', piece: 'K', kind: 'escape',
    text: 'Kungen går bara en ruta. Och den får aldrig gå in i schack!',
    map: { e1: 'K', a1: 'r' }, stars: []
  },
  {
    id: 'bonden', name: 'Bonden', piece: 'P', kind: 'collect',
    text: 'Bonden går framåt, ett steg — två om den står kvar på sin startruta.',
    map: { e2: 'P' }, stars: ['e4', 'e5']
  },
  {
    id: 'bonden2', name: 'Bonden slår', piece: 'P', kind: 'promote',
    text: 'Bonden slår snett framåt — och blir dam när den når sista raden!',
    map: { b7: 'P', a8: 'r', c8: 'n' }, stars: []
  }
];

const MATES = [
  {
    id: 'matt1', name: 'Damens matt',
    text: 'Sätt svart kung i schackmatt på ett drag.',
    map: { h8: 'k', g6: 'Q', f6: 'K' }
  },
  {
    id: 'matt2', name: 'Sista raden',
    text: 'Kungen har gömt sig bakom sina bönder. Hitta matten!',
    map: { g8: 'k', f7: 'p', g7: 'p', h7: 'p', a1: 'R', h1: 'K' }
  },
  {
    id: 'matt3', name: 'Två torn',
    text: 'Tornen hjälps åt att stänga in kungen.',
    map: { h8: 'k', a7: 'R', b1: 'R' }
  }
];

// räknar hur många drag som ger matt (används av test)
function mateCount(st) {
  let n = 0;
  allLegal(st).forEach(function (m) {
    const ns = applyMove(st, m);
    if (status(ns) === 'matt') n++;
  });
  return n;
}