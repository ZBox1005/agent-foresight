// AgentForesight — website hero animation (16:9 · 45 s · seamless loop).
// One element tree rendered from the authored clock T (animations-v3.jsx).
(function () {
  const W = 1920, H = 1080;
  const C = {
    bg: '#FBFCFE', ink: '#1D2340', navy: '#0B0D5B', teal: '#0096A7',
    muted: '#5F6880', faint: '#8A91A3', post: '#5A6377',
    panel: '#F5F5F5', panelBd: '#E5E8EC',
    ghostBd: '#C3CAD6', ghostInk: '#C0C7D2',
    nBg: '#F5F5F5', nBd: '#D9DDE4',
    sBg: '#DEFFDF', sBd: '#49B74B', sInk: '#2E7D32',
    eBg: '#F8E8E4', eBd: '#D15952', eInk: '#C0392B',
    ind: '#3F47B3', indBg: '#EEF0FC', indBd: '#C9CEF2',
  };
  const F = {
    ui: "'Nunito', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, Menlo, monospace",
    serif: "Georgia, 'Times New Roman', serif",
  };

  // Assets are swapped to data: URLs once loaded so exported frames are self-contained.
  const ASSET_NAMES = ['logo_full', 'logo_word', 'robot_planner', 'robot_solver', 'robot_verifier', 'robot_auditor', 'robot_auditor_worried', 'robot_auditor_happy', 'shield_check', 'check_circle', 'arrow_sketch', 'warn_red', 'stop', 'trophy'];
  const ASSET = {};
  ASSET_NAMES.forEach((n) => { ASSET[n] = 'assets/' + n + '.png'; });
  const assetsReady = Promise.all(ASSET_NAMES.map((n) => fetch(ASSET[n]).then((r) => r.blob()).then((b) => new Promise((res) => {
    const fr = new FileReader();
    fr.onload = () => { ASSET[n] = fr.result; res(); };
    fr.onerror = () => res();
    fr.readAsDataURL(b);
  })).catch(() => {})));

  // ── motion: exactly three eased helpers ──────────────────────────────────
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const lin = (T, s, d) => clamp01((T - s) / d);
  const MOTION = {
    enter: (T, s, d = 0.5) => Easing.easeOutCubic(lin(T, s, d)),
    move: (T, s, d = 0.8) => Easing.easeInOutCubic(lin(T, s, d)),
    pop: (T, s, d = 0.5) => Easing.easeOutBack(lin(T, s, d)),
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const vis = (T, a, b, fi = 0.3, fo = 0.3) => Math.min(MOTION.enter(T, a, fi), 1 - MOTION.enter(T, b, fo));
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mixc = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const rgb = (c) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;

  // ── layout (world coordinates, 1920×1080) ────────────────────────────────
  const L = { cx0: 300, cw: 172, cstep: 200, cy: 232, ch: 300 };
  const cardX = (i) => L.cx0 + i * L.cstep;
  const cardCX = (i) => cardX(i) + L.cw / 2;
  const LANE_TOP = 592, AUD_H = 150, BUB_BOTTOM = 662, BRK_Y = 556;

  const AG = {
    planner: { name: 'Planner', img: 'robot_planner', fill: '#FEB64A', bd: '#EF8932' },
    solver: { name: 'Math Solver', img: 'robot_solver', fill: '#6ACDC2', bd: '#3E9F9A' },
    verifier: { name: 'Verifier', img: 'robot_verifier', fill: '#AAD96B', bd: '#75AF42' },
  };

  // [bold]  $math$  {wrong|fixed}
  function parse(src) {
    const out = []; let mode = 'p', buf = '';
    const flush = () => { if (buf) out.push({ k: mode, t: buf }); buf = ''; };
    for (let i = 0; i < src.length; i++) {
      const ch = src[i];
      if (ch === '[' && mode === 'p') { flush(); mode = 'b'; continue; }
      if (ch === ']' && mode === 'b') { flush(); mode = 'p'; continue; }
      if (ch === '$') { flush(); mode = mode === 'm' ? 'p' : 'm'; continue; }
      if (ch === '{') {
        flush(); const j = src.indexOf('}', i); const parts = src.slice(i + 1, j).split('|');
        out.push({ k: 'swap', a: parts[0], b: parts[1] }); i = j; continue;
      }
      buf += ch;
    }
    flush(); return out;
  }
  const TASK = parse('[Task Query:] If the domain of the function log $x²$ is $x < a$ or $x > b$, for some $a$ and $b$, find $a + b$.');
  const STEPS = [
    { agent: 'planner', on: '[Plan:] Find domain → match $x < a$ or $x > b$ → compute $a + b$.' },
    { agent: 'solver', on: '[Domain condition:] log($x²$) ⇒ $x² > 0$' },
    { agent: 'solver', on: '[Tool call:] solve(x**2 > 0, x)' },
    { agent: 'solver', on: '[Tool result:] (x > −∞) & (x < ∞) & Ne(x, 0)' },
    { agent: 'solver', on: '[Rewrite domain:] $x ≠ 0$ ⇒ $x < 0$ or $x > 0$' },
    { agent: 'solver', on: '[From] $x < 0$ or $x > 0$[:] $a = 0,$ $b = {1|0}$ ⇒ $a + b = {1|0}$' },
    { agent: 'verifier', on: '[Verification:] expected $= 0$, computed $= 0$', post: '[Verification:] computed $= 1$' },
    { agent: 'verifier', on: '[Answer verified:] Predicted: $0$', post: '[Final answer:] $1$' },
  ].map((s) => ({ ...s, onSegs: parse(s.on), postSegs: s.post ? parse(s.post) : null }));

  const segLen = (s) => (s.k === 'swap' ? s.a.length : s.t.length);
  function Rich({ segs, typed = 1, swapQ = 0, hi = 0, bold, math }) {
    const total = segs.reduce((n, s) => n + segLen(s), 0);
    let budget = Math.round(clamp01(typed) * total);
    return segs.map((s, j) => {
      const len = segLen(s); const shown = Math.max(0, Math.min(len, budget)); budget -= len;
      const st = s.k === 'b' ? bold : (s.k === 'm' || s.k === 'swap') ? math : null;
      if (s.k === 'swap') {
        const a = hi * (1 - swapQ);
        return (
          <span key={j} style={{ ...st, position: 'relative', display: 'inline-block' }}>
            <span style={{ display: 'inline-block', padding: '0 3px', borderRadius: 5, opacity: shown < len ? 0 : 1 - swapQ, transform: `translateY(${-swapQ * 0.7}em)`, color: rgb(mixc(hex(C.ink), hex(C.eInk), hi)), background: `rgba(209,89,82,${0.17 * a})`, boxShadow: `inset 0 -2.5px 0 rgba(209,89,82,${a})` }}>{s.a}</span>
            <span style={{ position: 'absolute', left: 3, top: 0, opacity: swapQ, transform: `translateY(${(1 - swapQ) * 0.7}em)`, color: C.sInk, fontWeight: 700 }}>{s.b}</span>
          </span>
        );
      }
      return <span key={j} style={st}>{s.t.slice(0, shown)}<span style={{ color: 'transparent' }}>{s.t.slice(shown)}</span></span>;
    });
  }
  const BOLD_MONO = { fontWeight: 700, color: C.navy };
  const MATH_MONO = { fontFamily: F.serif, fontStyle: 'italic', fontSize: '1.1em' };

  function Chip({ label, fill, bd, ink = C.ink, size = 13, style }) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: `${size * 0.3}px ${size * 0.72}px`, borderRadius: size * 0.55, background: fill, border: `1.5px solid ${bd}`, color: ink, font: `800 ${size}px/1.1 ${F.ui}`, whiteSpace: 'nowrap', ...style }}>{label}</div>
    );
  }
  const G = ({ children }) => <span style={{ color: C.sInk, fontWeight: 900 }}>{children}</span>;
  const Rd = ({ children }) => <span style={{ color: C.eInk, fontWeight: 900 }}>{children}</span>;

  // ── timeline (all keyed to CUES) ─────────────────────────────────────────
  function buildK(CUES) {
    const K = { TK: CUES.Task, P: CUES.PostHoc, R: CUES.Rewind, A: CUES.Audit, L: CUES.Alarm, V: CUES.Recover, O: CUES.Outro };
    K.taskIn = K.TK - 0.5; K.taskType = K.TK - 0.2;
    K.teamIn = K.TK + 0.45; K.dock = K.TK + 2.3; K.ghostIn = K.TK + 2.75;
    K.chapA = K.P + 0.05; K.chapAOut = K.P + 1.15;
    K.ph = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => K.P + 1.35 + i * 0.46);
    K.phFail = K.P + 5.2; K.phScan = K.P + 6.15; K.phTrace = K.P + 6.95; K.phWaste = K.P + 7.45;
    K.rwLine = K.R + 0.1; K.rwDur = 0.9;
    K.rw = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => K.rwLine + K.rwDur * (1890 - (cardX(i) + L.cw)) / 1610);
    K.chapB = K.R + 0.75; K.chapBOut = K.R + 1.75; K.audIn = K.R + 1.2;
    K.on = []; K.scan = []; K.scanDur = []; K.verdict = [];
    K.on[0] = K.A + 0.35; K.scan[0] = K.A + 1.25; K.scanDur[0] = 0.7;
    for (let i = 1; i <= 4; i++) { K.on[i] = K.A + 2.75 + (i - 1) * 1.2; K.scan[i] = K.on[i] + 0.55; K.scanDur[i] = 0.4; }
    K.on[5] = K.A + 7.6; K.scan[5] = K.A + 8.2; K.scanDur[5] = 0.8;
    K.errHi = K.L + 0.15; K.expand = K.L + 0.45; K.rows = [0.85, 1.15, 1.45, 1.75].map((d) => K.L + d); K.stop = K.L + 2.3;
    K.fixFly = K.V + 0.3; K.collapse = K.V + 0.8; K.swap = K.V + 0.95; K.stopOut = K.V + 1.05; K.fixTone = K.V + 1.2; K.fixVerdict = K.V + 1.35;
    K.on[6] = K.V + 2.1; K.scan[6] = K.V + 2.6; K.scanDur[6] = 0.38;
    K.on[7] = K.V + 3.25; K.scan[7] = K.V + 3.7; K.scanDur[7] = 0.38;
    for (let i = 0; i < 8; i++) K.verdict[i] = K.scan[i] + K.scanDur[i];
    K.trophy = K.V + 4.35;
    K.audMove = K.on.map((t, i) => (i === 0 ? -99 : t - 0.1));
    K.worryIn = K.scan[5] + 0.4;
    K.sumIn = K.O + 0.3; K.sumOut = K.O + 4.3; K.heroBack = K.O + 4.5;
    return K;
  }

  const OV = { cx: 960, cy: 540, s: 1 };
  const focus = (x, s = 1.55) => ({ cx: x, cy: 222 + 444 / s, s });
  function buildCam(K) {
    const k = [[0, OV], [K.TK - 0.6, OV], [K.TK + 2.3, { cx: 960, cy: 548, s: 1.025 }], [K.P + 0.35, OV],
      [K.P + 4.9, { cx: 990, cy: 540, s: 1.045 }], [K.P + 5.65, focus(1500, 1.5)], [K.P + 8.3, focus(1500, 1.56)],
      [K.R + 0.55, OV], [K.R + 1.95, OV], [K.A + 0.95, focus(cardCX(0) + 110)]];
    for (let i = 1; i <= 5; i++) { k.push([K.on[i] - 0.15, focus(cardCX(i - 1) + 110)]); k.push([K.on[i] + 0.5, focus(cardCX(i) + 110)]); }
    k.push([K.verdict[5] - 0.25, focus(cardCX(5) + 110, 1.6)]);
    k.push([K.verdict[5] + 0.35, focus(cardCX(5) + 110, 1.68)]);
    k.push([K.L + 0.45, focus(1600, 1.58)]);
    k.push([K.V + 1.7, focus(1600, 1.6)]);
    k.push([K.V + 4.35, focus(1600, 1.63)]);
    k.push([K.V + 5.4, OV]);
    k.push([K.O + 1, OV]);
    return k;
  }
  function camAt(T, kf) {
    if (T <= kf[0][0]) return kf[0][1];
    for (let i = 0; i < kf.length - 1; i++) {
      const [t0, c0] = kf[i], [t1, c1] = kf[i + 1];
      if (T >= t0 && T <= t1) {
        const e = t1 > t0 ? MOTION.move(T, t0, t1 - t0) : 1;
        return { cx: lerp(c0.cx, c1.cx, e), cy: lerp(c0.cy, c1.cy, e), s: Math.exp(lerp(Math.log(c0.s), Math.log(c1.s), e)) };
      }
    }
    return kf[kf.length - 1][1];
  }
  function clampCam(c) {
    const hw = 960 / c.s, hh = 540 / c.s;
    return { cx: Math.min(Math.max(c.cx, hw), W - hw), cy: Math.min(Math.max(c.cy, hh), H - hh), s: c.s };
  }

  function buildCaps(K) {
    return [
      { at: K.TK + 0.7, until: K.P - 0.1, text: 'A multi-agent system solves a math task, step by step.' },
      { at: K.P + 1.4, until: K.P + 5.1, text: 'Post-hoc attribution waits until the run is over.' },
      { at: K.P + 5.25, until: K.P + 6.1, text: <>The run fails with a <Rd>wrong answer</Rd>.</> },
      { at: K.P + 6.2, until: K.P + 7.35, text: 'Only then is the decisive error traced back to Step 6.' },
      { at: K.P + 7.45, until: K.R + 0.5, text: 'Too late: the error already spread, and Steps 7–8 wasted compute.' },
      { at: K.A + 0.45, until: K.A + 2.6, text: 'At each step, the auditor sees only the prefix, never future steps.' },
      { at: K.A + 2.75, until: K.A + 7.5, text: <>Every prefix gets a verdict: <G>CONTINUE</G> or <Rd>ALARM</Rd>.</> },
      { at: K.A + 7.65, until: K.L + 0.2, text: 'Step 6 commits a decisive error…' },
      { at: K.L + 0.3, until: K.L + 2.25, text: <><Rd>ALARM</Rd> at the very step it happens: where, who, and what.</> },
      { at: K.L + 2.35, until: K.V + 0.2, text: 'The run halts before Step 7. This is the intervention window.' },
      { at: K.V + 0.3, until: K.V + 4.25, text: 'The fix is applied, and the run continues.' },
      { at: K.V + 4.35, until: K.O + 0.25, text: <><G>Correct answer.</G> The error never propagated.</> },
    ].map((c) => ({ ...c, text: <span style={{ display: 'inline-block', padding: '13px 32px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.95)', border: '1.5px solid #E1E5EC', boxShadow: '0 12px 30px rgba(20,30,70,0.10)', font: `700 31px/1.25 ${F.ui}`, color: C.ink, whiteSpace: 'nowrap' }}>{c.text}</span> }));
  }

  // ── cards ────────────────────────────────────────────────────────────────
  const NEU = { bg: hex(C.nBg), bd: hex(C.nBd) }, SAFE = { bg: hex(C.sBg), bd: hex(C.sBd) }, ERR = { bg: hex(C.eBg), bd: hex(C.eBd) };
  function cardState(i, T, K) {
    const st = STEPS[i];
    const post = T < K.A - 0.2;
    const ghost = MOTION.enter(T, K.ghostIn + i * 0.06, 0.4);
    const mat = post ? MOTION.enter(T, K.ph[i], 0.3) * (1 - MOTION.enter(T, K.rw[i], 0.25)) : MOTION.enter(T, K.on[i], 0.3);
    const t0 = post ? K.ph[i] : K.on[i];
    const typed = lin(T, t0 + 0.08, post ? 0.32 : (i === 0 ? 0.65 : 0.38));
    let bg = NEU.bg, bd = NEU.bd, check = 0, warn = 0, wasted = 0, ring = 0, ringScale = 1, hi = 0, swapQ = 0, shake = 0;
    if (post) {
      if (i === 5) { const e = MOTION.enter(T, K.phTrace, 0.3); bg = mixc(bg, ERR.bg, e); bd = mixc(bd, ERR.bd, e); warn = MOTION.pop(T, K.phTrace + 0.05, 0.4) * (1 - MOTION.enter(T, K.rw[i], 0.25)); hi = e; }
      if (i === 7) bd = mixc(bd, ERR.bd, MOTION.enter(T, K.phFail, 0.3));
      if (i >= 6) wasted = MOTION.enter(T, K.phWaste + (i - 6) * 0.1, 0.35);
    } else if (i === 5) {
      const e = MOTION.enter(T, K.verdict[5], 0.2), f = MOTION.enter(T, K.fixTone, 0.4);
      bg = mixc(mixc(bg, ERR.bg, e), SAFE.bg, f); bd = mixc(mixc(bd, ERR.bd, e), SAFE.bd, f);
      warn = MOTION.pop(T, K.verdict[5], 0.4) * (1 - MOTION.enter(T, K.fixTone, 0.25));
      check = MOTION.pop(T, K.fixTone + 0.15, 0.42);
      hi = MOTION.enter(T, K.errHi, 0.35);
      swapQ = MOTION.enter(T, K.swap, 0.5);
      const dt = T - K.verdict[5];
      const pulse = vis(T, K.verdict[5], K.fixTone, 0.15, 0.3);
      ring = Math.max(0, pulse * (0.5 + 0.4 * Math.sin(dt * 7.5)));
      ringScale = 1 + 0.025 * Math.sin(dt * 7.5);
      if (dt > 0 && dt < 0.5) shake = 7 * Math.sin(dt * 70) * (1 - dt / 0.5);
    } else {
      const e = MOTION.enter(T, K.verdict[i], 0.3);
      bg = mixc(bg, SAFE.bg, e); bd = mixc(bd, SAFE.bd, e);
      check = MOTION.pop(T, K.verdict[i], 0.42);
    }
    const held = i >= 6 ? vis(T, K.stop, K.stopOut, 0.3, 0.3) : 0;
    return {
      ghost, ghostBd: rgb(mixc(hex(C.ghostBd), hex(C.eBd), held * 0.6)), ghostDim: 1 - held * 0.25, mat,
      pop: MOTION.pop(T, t0, 0.42), avatarPop: 0.55 + 0.45 * MOTION.pop(T, t0 + 0.06, 0.45), typed,
      segs: post ? (st.postSegs || st.onSegs) : st.onSegs, bg: rgb(bg), bd: rgb(bd), check, warn, wasted, ring, ringScale, hi, swapQ, shake,
    };
  }
  function Card({ i, s }) {
    const ag = AG[STEPS[i].agent];
    return (
      <div style={{ position: 'absolute', left: cardX(i) + s.shake, top: L.cy, width: L.cw, height: L.ch }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 18, border: `2px dashed ${s.ghostBd}`, background: 'repeating-linear-gradient(135deg, rgba(195,202,214,0.17) 0 9px, rgba(255,255,255,0) 9px 18px)', opacity: s.ghost * (1 - s.mat) * s.ghostDim }}>
          <div style={{ position: 'absolute', left: 14, top: 11, font: `400 30px/1 ${F.serif}`, color: C.ghostInk }}>{i + 1}.</div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `400 64px/1 ${F.serif}`, color: C.ghostInk }}>?</div>
        </div>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: s.bg, border: `2.5px solid ${s.bd}`, opacity: s.mat, transform: `scale(${0.9 + 0.1 * s.pop})`, boxShadow: '0 10px 24px rgba(29,35,64,0.07)', overflow: 'hidden', visibility: s.mat > 0.001 ? 'visible' : 'hidden' }}>
          <div style={{ position: 'absolute', left: 13, top: 11, font: `400 32px/1 ${F.serif}`, color: C.ink }}>{i + 1}.</div>
          <div style={{ position: 'absolute', left: 82, top: 6, width: 76, height: 72, display: 'flex', justifyContent: 'center', transform: `scale(${s.avatarPop})`, transformOrigin: '50% 100%' }}>
            <img src={ASSET[ag.img]} style={{ height: 72 }} />
          </div>
          <div style={{ position: 'absolute', left: 120, top: 75, transform: 'translateX(-50%)' }}>
            <Chip label={ag.name} fill={ag.fill} bd={ag.bd} size={12} />
          </div>
          <div style={{ position: 'absolute', left: 10, right: 10, top: 108, bottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: `400 18.5px/1.42 ${F.mono}`, color: C.ink, textWrap: 'balance' }}>
            <div><Rich segs={s.segs} typed={s.typed} swapQ={s.swapQ} hi={s.hi} bold={BOLD_MONO} math={MATH_MONO} /></div>
          </div>
          <div style={{ position: 'absolute', inset: 0, opacity: s.wasted, background: 'repeating-linear-gradient(135deg, rgba(209,89,82,0.17) 0 8px, rgba(209,89,82,0) 8px 16px)' }} />
        </div>
        <img src={ASSET.check_circle} style={{ position: 'absolute', right: -14, top: -16, width: 40, height: 40, transform: `scale(${s.check})`, opacity: clamp01(s.check * 3) }} />
        <img src={ASSET.warn_red} style={{ position: 'absolute', right: -17, top: -19, width: 46, transform: `scale(${s.warn})`, opacity: clamp01(s.warn * 3) }} />
        <div style={{ position: 'absolute', inset: -9, borderRadius: 25, border: `3px solid ${C.eBd}`, opacity: s.ring, transform: `scale(${s.ringScale})` }} />
      </div>
    );
  }
  function Arrows({ T, K }) {
    const post = T < K.A - 0.2;
    return [0, 1, 2, 3, 4, 5, 6].map((i) => {
      const g = MOTION.enter(T, K.ghostIn + (i + 1) * 0.06, 0.4);
      const lit = post ? MOTION.enter(T, K.ph[i + 1], 0.3) * (1 - MOTION.enter(T, K.rw[i + 1], 0.25)) : MOTION.enter(T, K.on[i + 1], 0.3);
      return <img key={i} src={ASSET.arrow_sketch} style={{ position: 'absolute', left: cardX(i) + L.cw + 2, top: L.cy + L.ch / 2 - 8, width: 24, opacity: g * (0.3 + 0.7 * lit) }} />;
    });
  }

  // ── task + roster ────────────────────────────────────────────────────────
  function TaskBar({ T, K, cs }) {
    const o = MOTION.enter(T, K.taskIn, 0.5) * (1 - clamp01((cs - 1.07) / 0.12));
    return (
      <div style={{ position: 'absolute', left: 300, top: 120 - (1 - o) * 26, width: 1572, height: 68, borderRadius: 18, background: C.panel, border: `1.5px solid ${C.panelBd}`, opacity: o, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `400 28px/1 ${F.serif}`, color: C.ink, whiteSpace: 'nowrap' }}>
        <div><Rich segs={TASK} typed={lin(T, K.taskType, 1.25)} bold={{ fontWeight: 700, color: C.navy }} math={{ fontStyle: 'italic' }} /></div>
      </div>
    );
  }
  function activity(key, T, K) {
    let a = 0;
    STEPS.forEach((st, i) => {
      if (st.agent !== key) return;
      if (T < K.R) a = Math.max(a, vis(T, K.ph[i] - 0.05, K.ph[i] + 0.42, 0.1, 0.2));
      a = Math.max(a, vis(T, K.on[i] - 0.05, K.on[i] + 0.7, 0.12, 0.25));
    });
    return a;
  }
  function AgentBlock({ img, name, fill, bd, ink, cx, top, scale, o, act }) {
    return (
      <div style={{ position: 'absolute', left: cx - 110, top, width: 220, opacity: o, transformOrigin: '50% 0', transform: `scale(${scale * (1 + 0.07 * act)})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', height: 112, display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 160, height: 160, marginLeft: -80, marginTop: -76, borderRadius: '50%', background: `radial-gradient(circle, ${fill}B0 0%, ${fill}00 68%)`, opacity: act }} />
          <img src={img} style={{ position: 'relative', height: 112 }} />
        </div>
        <Chip label={name} fill={fill} bd={bd} ink={ink} size={15} style={{ marginTop: 2 }} />
      </div>
    );
  }
  const TEAM = ['planner', 'solver', 'verifier'];
  const INTRO_X = { planner: 700, solver: 960, verifier: 1220 };
  const SLOT_Y = { planner: 168, solver: 330, verifier: 492 };
  function Roster({ T, K }) {
    const dock = MOTION.move(T, K.dock, 0.85);
    const panelO = MOTION.enter(T, K.dock + 0.2, 0.5);
    const titleO = MOTION.enter(T, K.teamIn - 0.1, 0.4);
    const audO = MOTION.enter(T, K.audIn, 0.45);
    let audAct = 0;
    for (let i = 0; i < 8; i++) audAct = Math.max(audAct, vis(T, K.scan[i] - 0.05, K.verdict[i] + 0.1, 0.1, 0.2));
    return (
      <>
        <div style={{ position: 'absolute', left: 40, top: 120, width: 228, height: 552, borderRadius: 24, background: C.panel, border: `1.5px solid ${C.panelBd}`, opacity: panelO }} />
        <div style={{ position: 'absolute', left: 40, top: 688, width: 228, height: 196, borderRadius: 24, background: C.indBg, border: `1.5px solid ${C.indBd}`, opacity: audO }} />
        <div style={{ position: 'absolute', left: lerp(960, 154, dock) - 200, top: lerp(226, 134, dock), width: 400, textAlign: 'center', transformOrigin: '50% 0', transform: `scale(${lerp(1.75, 1, dock)})`, font: `900 18.5px/1.2 ${F.ui}`, color: C.navy, opacity: titleO }}>Multi-Agent System</div>
        {TEAM.map((k, j) => {
          const t = K.teamIn + j * 0.12, ag = AG[k];
          return <AgentBlock key={k} img={ASSET[ag.img]} name={ag.name} fill={ag.fill} bd={ag.bd} cx={lerp(INTRO_X[k], 154, dock)} top={lerp(292, SLOT_Y[k], dock) + 2.5 * Math.sin(T * 3.1 + j * 1.7)} scale={lerp(1.85, 1, dock) * (0.6 + 0.4 * MOTION.pop(T, t, 0.5))} o={MOTION.enter(T, t, 0.3)} act={activity(k, T, K)} />;
        })}
        <div style={{ position: 'absolute', left: 40, top: 700, width: 228, textAlign: 'center', font: `900 16px/1.2 ${F.ui}`, color: C.ind, opacity: audO }}>Online Auditor</div>
        <AgentBlock img={ASSET.robot_auditor} name="AgentForesight-7B" fill={C.ind} bd={C.ind} ink="#FFFFFF" cx={154} top={726 + 2 * Math.sin(T * 2.7)} scale={0.6 + 0.4 * MOTION.pop(T, K.audIn + 0.1, 0.5)} o={audO} act={audAct} />
      </>
    );
  }

  // ── auditor lane ─────────────────────────────────────────────────────────
  function laneAud(T, K) {
    let idx = 0, hop = 0;
    for (let i = 1; i < 8; i++) { const p = MOTION.move(T, K.audMove[i], 0.42); idx += p; if (p > 0 && p < 1) hop = Math.sin(Math.PI * p); }
    return { x: cardCX(0) + idx * L.cstep, hop };
  }
  function LaneAuditor({ T, K, a }) {
    const o = MOTION.enter(T, K.audIn, 0.2);
    const drop = MOTION.pop(T, K.audIn, 0.6);
    const worried = vis(T, K.worryIn, K.fixTone, 0.15, 0.3);
    const happy = vis(T, K.trophy, K.O + 3, 0.15, 0.3);
    const neutral = 1 - Math.max(worried, happy);
    const top = LANE_TOP - (1 - drop) * 320 - a.hop * 18 + 2 * Math.sin(T * 4);
    return (
      <div style={{ position: 'absolute', left: a.x, top, width: 0, height: 0, opacity: o, visibility: o > 0 ? 'visible' : 'hidden' }}>
        <div style={{ position: 'absolute', left: -60, top: 0, width: 120, height: AUD_H, transformOrigin: '50% 100%', transform: `scaleY(${1 + 0.05 * a.hop})` }}>
          <img src={ASSET.robot_auditor} style={{ position: 'absolute', left: 8, top: 0, height: AUD_H, opacity: neutral }} />
          <img src={ASSET.robot_auditor_worried} style={{ position: 'absolute', left: 8, top: 1, height: AUD_H, opacity: worried }} />
          <img src={ASSET.robot_auditor_happy} style={{ position: 'absolute', left: 10, top: 0, height: AUD_H, opacity: happy }} />
        </div>
        <div style={{ position: 'absolute', left: -110, width: 220, top: AUD_H + 6, display: 'flex', justifyContent: 'center', opacity: vis(T, K.audIn + 0.3, K.A + 1.5, 0.3, 0.4) }}>
          <Chip label="AgentForesight-7B" fill={C.ind} bd={C.ind} ink="#FFFFFF" size={14} />
        </div>
      </div>
    );
  }
  function ScanBand({ T, K }) {
    for (let i = 0; i < 8; i++) {
      const s0 = K.scan[i], d = K.scanDur[i];
      if (T < s0 - 0.02 || T > s0 + d + 0.17) continue;
      const p = MOTION.move(T, s0, d);
      const o = Math.min(MOTION.enter(T, s0 - 0.02, 0.1), 1 - MOTION.enter(T, s0 + d - 0.02, 0.17));
      const x = lerp(cardX(0) - 40, cardX(i) + L.cw - 34, p);
      return (
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
          <div style={{ position: 'absolute', left: cardX(0) - 8, top: L.cy - 8, width: Math.max(0, x - cardX(0) + 40), height: L.ch + 16, borderRadius: 20, background: 'rgba(111,128,218,0.08)' }} />
          <div style={{ position: 'absolute', left: x, top: L.cy - 12, width: 40, height: L.ch + 24, borderRadius: 8, background: 'linear-gradient(90deg, rgba(111,128,218,0) 0%, rgba(111,128,218,0.22) 70%, rgba(63,71,179,0.5) 100%)', borderRight: `3px solid ${C.ind}` }} />
        </div>
      );
    }
    return null;
  }
  function Bracket({ T, K }) {
    const o = MOTION.enter(T, K.A + 0.1, 0.4);
    let e = 0;
    for (let i = 0; i < 8; i++) e += MOTION.move(T, K.on[i] + 0.05, 0.4);
    const x0 = cardX(0);
    const xe = e <= 0 ? x0 : x0 + e * L.cstep - (L.cstep - L.cw);
    const k = Math.max(1, Math.round(e));
    const fx0 = xe + (e <= 0 ? 0 : L.cstep - L.cw), fx1 = cardX(7) + L.cw, futW = Math.max(0, fx1 - fx0);
    const labX = Math.max((x0 + xe) / 2, xe - 150);
    const tick = { position: 'absolute', top: BRK_Y - 12, width: 3, height: 13, background: C.ind, borderRadius: 2 };
    const pill = { position: 'absolute', top: BRK_Y, transform: 'translate(-50%,-50%)', padding: '5px 12px', borderRadius: 999, font: `900 14px/1 ${F.ui}`, letterSpacing: '0.08em', whiteSpace: 'nowrap' };
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: o }}>
        <div style={{ opacity: clamp01(e * 3) }}>
          <div style={{ position: 'absolute', left: x0, top: BRK_Y - 1.5, width: Math.max(0, xe - x0), height: 3, background: C.ind, borderRadius: 2 }} />
          <div style={{ ...tick, left: x0 - 1.5 }} />
          <div style={{ ...tick, left: xe - 1.5 }} />
          <div style={{ ...pill, left: labX, background: C.ind, color: '#FFFFFF' }}>VISIBLE PREFIX · {k === 1 ? 'STEP 1' : `STEPS 1–${k}`}</div>
        </div>
        <div style={{ opacity: clamp01((futW - 60) / 120) }}>
          <div style={{ position: 'absolute', left: fx0, top: BRK_Y - 1, width: futW, height: 0, borderTop: `2px dashed ${C.ghostBd}` }} />
          <div style={{ ...pill, left: (fx0 + fx1) / 2, background: '#FFFFFF', border: `1.5px dashed ${C.ghostBd}`, color: C.faint, opacity: clamp01((futW - 220) / 120) }}>FUTURE · NOT VISIBLE</div>
        </div>
      </div>
    );
  }

  // ── verdict bubble (pill → full alarm verdict) ───────────────────────────
  const BST = {
    dots: { w: 128, bg: '#F3F4FD', bd: '#C9CEF2' },
    cont: { w: 246, bg: '#EEFFEF', bd: C.sBd },
    alarm: { w: 206, bg: '#FFF1EE', bd: C.eBd },
  };
  function bubbleEvents(K) {
    const ev = [];
    for (let i = 0; i < 8; i++) { ev.push({ t: K.scan[i], s: 'dots' }); ev.push({ t: K.verdict[i], s: i === 5 ? 'alarm' : 'cont' }); }
    ev.push({ t: K.fixVerdict, s: 'cont' });
    return ev.sort((x, y) => x.t - y.t);
  }
  function Bubble({ T, K, a, EV }) {
    let cur = -1;
    for (let j = 0; j < EV.length; j++) if (T >= EV[j].t) cur = j;
    const e = EV[Math.max(cur, 0)], prev = cur > 0 ? EV[cur - 1] : e;
    const q = MOTION.enter(T, e.t, 0.28), pp = MOTION.pop(T, e.t, 0.4);
    const S0 = BST[prev.s], S1 = BST[e.s];
    const exp = MOTION.move(T, K.expand, 0.6) * (1 - MOTION.move(T, K.collapse, 0.5));
    const w = lerp(lerp(S0.w, S1.w, q), 420, exp), h = lerp(58, 240, exp);
    const gap = lerp(54, 100, exp);
    const side = a.x > 1600 ? 'left' : 'right';
    let o = cur < 0 ? 0 : MOTION.enter(T, EV[0].t, 0.2);
    o *= 1 - vis(T, K.audMove[7] - 0.12, K.scan[7] - 0.05, 0.12, 0.12);
    o *= 1 - MOTION.enter(T, K.trophy - 0.12, 0.2);
    const scale = cur === 0 ? 0.5 + 0.5 * pp : 0.93 + 0.07 * pp;
    const bg = rgb(mixc(hex(S0.bg), hex(S1.bg), q)), bd = rgb(mixc(hex(S0.bd), hex(S1.bd), q));
    const layer = (s) => (s === e.s ? (prev.s === s ? 1 : clamp01((q - 0.3) / 0.7)) : s === prev.s ? 1 - clamp01(q * 2.5) : 0);
    const rows = MOTION.enter;
    const rowP = K.rows.map((t) => rows(T, t, 0.35) * (1 - rows(T, K.collapse - 0.15, 0.25)));
    const fixShown = 1 - MOTION.enter(T, K.fixFly, 0.05);
    const label = { width: 70, font: `900 13px/1 ${F.ui}`, letterSpacing: '0.1em', color: C.faint };
    const tail = side === 'right'
      ? { left: -9, borderLeft: `3px solid ${bd}`, borderBottom: `3px solid ${bd}` }
      : { right: -9, borderRight: `3px solid ${bd}`, borderTop: `3px solid ${bd}` };
    return (
      <div style={{ position: 'absolute', left: side === 'right' ? a.x + gap : a.x - gap - w, top: BUB_BOTTOM - h, width: w, height: h, transformOrigin: side === 'right' ? '0% 100%' : '100% 100%', transform: `scale(${scale})`, opacity: o, visibility: o > 0.001 ? 'visible' : 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: bg, border: `3px solid ${bd}`, borderRadius: lerp(29, 22, exp), boxShadow: '0 12px 28px rgba(29,35,64,0.12)' }} />
        <div style={{ position: 'absolute', bottom: 13, width: 16, height: 16, background: bg, transform: 'rotate(45deg)', ...tail }} />
        <div style={{ position: 'absolute', left: 0, top: lerp(0, 8, exp), width: 246, height: 58 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 128, height: 58, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, opacity: layer('dots') }}>
            {[0, 1, 2].map((j) => <div key={j} style={{ width: 11, height: 11, borderRadius: 6, background: C.ind, opacity: 0.85, transform: `translateY(${-5 * Math.max(0, Math.sin(T * 10 - j * 0.8))}px)` }} />)}
          </div>
          <div style={{ position: 'absolute', left: 16, top: 0, height: 58, display: 'flex', alignItems: 'center', gap: 10, opacity: layer('cont') }}>
            <img src={ASSET.shield_check} style={{ height: 34 }} />
            <span style={{ font: `900 25px/1 ${F.ui}`, letterSpacing: '0.05em', color: C.sInk }}>CONTINUE</span>
          </div>
          <div style={{ position: 'absolute', left: 16, top: 0, height: 58, display: 'flex', alignItems: 'center', gap: 10, opacity: layer('alarm') }}>
            <img src={ASSET.warn_red} style={{ height: 32 }} />
            <span style={{ font: `900 25px/1 ${F.ui}`, letterSpacing: '0.05em', color: C.eInk }}>ALARM</span>
          </div>
        </div>
        <div style={{ position: 'absolute', right: 22, top: 30, font: `800 14px/1 ${F.ui}`, color: C.faint, opacity: exp, whiteSpace: 'nowrap' }}>on prefix 1–6</div>
        <div style={{ position: 'absolute', left: 22, right: 18, top: 70, opacity: clamp01(exp * 1.5) }}>
          {[
            ['WHERE', <span style={{ font: `900 23px/1 ${F.ui}`, color: C.ink }}>Step 6</span>],
            ['WHO', <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><img src={ASSET.robot_solver} style={{ height: 32 }} /><Chip label="Math Solver" fill={AG.solver.fill} bd={AG.solver.bd} size={15} /></div>],
            ['WHAT', <span style={{ font: `800 21px/1.1 ${F.ui}`, color: C.eInk, whiteSpace: 'nowrap' }}>Wrong boundary extraction</span>],
            ['FIX', <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 10, background: '#EEFFEF', border: `2px solid ${C.sBd}`, color: C.sInk, opacity: fixShown }}><span style={{ font: `800 16px/1 ${F.ui}` }}>set</span><span style={{ font: `italic 20px/1 ${F.serif}` }}>a = 0, b = 0</span></div>],
          ].map(([lb, val], j) => (
            <div key={lb} style={{ display: 'flex', alignItems: 'center', height: 38, gap: 12, opacity: rowP[j], transform: `translateX(${(1 - rowP[j]) * 16}px)` }}>
              <div style={label}>{lb}</div>{val}
            </div>
          ))}
        </div>
      </div>
    );
  }
  function FixChip({ T, K, a }) {
    const p = MOTION.move(T, K.fixFly, 0.7);
    const o = vis(T, K.fixFly, K.fixFly + 0.6, 0.02, 0.12);
    const x0 = a.x + 100 + 22 + 70 + 12 + 92, y0 = BUB_BOTTOM - 240 + 70 + 3 * 38 + 19;
    const x = lerp(x0, cardCX(5), p), y = lerp(y0, 468, p) - 70 * Math.sin(Math.PI * p);
    return (
      <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${lerp(1, 0.8, p)})`, opacity: o, visibility: o > 0.001 ? 'visible' : 'hidden', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 10, background: '#EEFFEF', border: `2px solid ${C.sBd}`, color: C.sInk, boxShadow: '0 10px 24px rgba(46,125,50,0.25)', whiteSpace: 'nowrap' }}>
        <span style={{ font: `800 16px/1 ${F.ui}` }}>set</span><span style={{ font: `italic 20px/1 ${F.serif}` }}>a = 0, b = 0</span>
      </div>
    );
  }
  function StopSign({ T, K }) {
    const p = MOTION.pop(T, K.stop, 0.5), o = vis(T, K.stop, K.stopOut, 0.15, 0.3);
    const dt = T - K.stop;
    const wob = 10 * Math.sin(dt * 9) * Math.max(0, 1 - dt / 0.8);
    return <img src={ASSET.stop} style={{ position: 'absolute', left: cardX(6) - 14 - 33, top: 349, width: 66, height: 66, opacity: o, transform: `scale(${p}) rotate(${wob}deg)` }} />;
  }
  function Trophy({ T, K }) {
    const p = MOTION.pop(T, K.trophy, 0.6), o = MOTION.enter(T, K.trophy, 0.2);
    return <img src={ASSET.trophy} style={{ position: 'absolute', left: 1612 - 70, top: 600 + 3 * Math.sin((T - K.trophy) * 3.4), width: 140, opacity: o, transformOrigin: '50% 100%', transform: `scale(${p}) rotate(${(1 - p) * -14}deg)` }} />;
  }

  // ── post-hoc marks + rewind ──────────────────────────────────────────────
  function PostHocMarks({ T, K }) {
    const off = 1 - MOTION.enter(T, K.R, 0.3);
    const sp = MOTION.move(T, K.phScan, 0.8);
    const so = vis(T, K.phScan - 0.05, K.phScan + 0.9, 0.15, 0.25) * off;
    const co = vis(T, K.phScan - 0.05, K.phScan + 0.64, 0.15, 0.14) * off;
    const bx = lerp(1880, cardCX(5) - 20, sp);
    const fp = MOTION.pop(T, K.phFail, 0.45), fo = MOTION.enter(T, K.phFail, 0.2) * off;
    const tp = MOTION.pop(T, K.phTrace + 0.1, 0.45), to = MOTION.enter(T, K.phTrace + 0.1, 0.2) * off;
    const wp = MOTION.move(T, K.phWaste, 0.45), wo = MOTION.enter(T, K.phWaste, 0.2) * off;
    const wx0 = cardX(6), wx1 = cardX(7) + L.cw;
    return (
      <>
        <div style={{ position: 'absolute', left: bx, top: L.cy - 12, width: 70, height: L.ch + 24, borderRadius: 8, opacity: so, background: 'linear-gradient(270deg, rgba(90,99,119,0) 0%, rgba(90,99,119,0.14) 60%, rgba(90,99,119,0.42) 100%)', borderLeft: `3px solid ${C.post}` }} />
        <div style={{ position: 'absolute', left: bx + 34, top: BRK_Y, transform: 'translate(-50%,-50%)', opacity: co, padding: '6px 14px', borderRadius: 999, background: C.post, color: '#FFFFFF', font: `800 15px/1 ${F.ui}`, whiteSpace: 'nowrap' }}>post-hoc attribution model</div>
        <div style={{ position: 'absolute', left: cardCX(5), top: BRK_Y, transform: `translate(-50%,-50%) scale(${tp})`, opacity: to, padding: '6px 14px', borderRadius: 999, background: C.eBd, color: '#FFFFFF', font: `900 15px/1 ${F.ui}`, whiteSpace: 'nowrap' }}>Decisive error · Step 6</div>
        <div style={{ position: 'absolute', left: wx0, top: BRK_Y - 1.5, width: (wx1 - wx0) * wp, height: 3, background: C.eBd, borderRadius: 2, opacity: wo }} />
        <div style={{ position: 'absolute', left: (wx0 + wx1) / 2, top: BRK_Y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * wp})`, opacity: wo, padding: '5px 12px', borderRadius: 999, background: '#FFFFFF', border: `2px solid ${C.eBd}`, color: C.eInk, font: `900 14px/1 ${F.ui}`, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>propagated · wasted compute</div>
        <div style={{ position: 'absolute', right: W - (cardX(7) + L.cw), top: 600, transformOrigin: '100% 50%', transform: `scale(${fp})`, opacity: fo, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px 10px 12px', borderRadius: 999, background: C.eBg, border: `2.5px solid ${C.eBd}`, whiteSpace: 'nowrap' }}>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: C.eBd, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `900 24px/1 ${F.ui}` }}>×</div>
          <span style={{ font: `900 24px/1 ${F.ui}`, color: C.eInk }}>Wrong answer: 1</span>
          <span style={{ font: `700 19px/1 ${F.ui}`, color: C.muted }}>(gold: 0)</span>
        </div>
      </>
    );
  }
  const Tri = () => <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '9px solid #FFFFFF' }} />;
  function Rewinder({ T, K }) {
    const p = lin(T, K.rwLine, K.rwDur), o = vis(T, K.rwLine - 0.05, K.rwLine + K.rwDur, 0.1, 0.15);
    return (
      <div style={{ position: 'absolute', left: lerp(1890, 280, p), top: L.cy - 18, width: 0, height: L.ch + 36, opacity: o }}>
        <div style={{ position: 'absolute', left: -1.5, top: 0, bottom: 0, width: 3, borderRadius: 2, background: C.navy }} />
        <div style={{ position: 'absolute', left: 0, top: L.ch + 44, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 3, padding: '6px 13px', borderRadius: 999, background: C.navy, color: '#FFFFFF', font: `900 14px/1 ${F.ui}`, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
          <Tri /><Tri /><span style={{ marginLeft: 6 }}>REWIND</span>
        </div>
      </div>
    );
  }

  // ── screen-space layers ──────────────────────────────────────────────────
  function Chapter({ T, t0, t1, title, sub, accent }) {
    const o = MOTION.enter(T, t0, 0.3) * (1 - MOTION.enter(T, t1 + 0.25, 0.35));
    const pin = MOTION.pop(T, t0, 0.55), out = MOTION.move(T, t1, 0.6);
    const s = (0.88 + 0.12 * pin) * lerp(1, 0.4, out);
    return (
      <div style={{ position: 'absolute', left: 960 + 640 * out, top: 470 - 400 * out, transform: `translate(-50%,-50%) scale(${s})`, opacity: o, visibility: o > 0.001 ? 'visible' : 'hidden', padding: '32px 64px 36px', borderRadius: 30, background: 'rgba(255,255,255,0.97)', border: `1.5px solid ${C.panelBd}`, borderTop: `6px solid ${accent}`, boxShadow: '0 30px 70px rgba(20,30,70,0.14)', textAlign: 'center', whiteSpace: 'nowrap' }}>
        <div style={{ font: `900 60px/1.05 ${F.ui}`, color: C.navy }}>{title}</div>
        <div style={{ font: `700 28px/1.3 ${F.ui}`, color: C.muted, marginTop: 14 }}>{sub}</div>
      </div>
    );
  }
  function HudChip({ o, text, ink, bd, bg }) {
    return <div style={{ position: 'absolute', right: 40, top: 28, opacity: o, transform: `translateY(${(1 - o) * -10}px)`, padding: '10px 20px', borderRadius: 999, background: bg, border: `1.5px solid ${bd}`, color: ink, font: `800 21px/1 ${F.ui}`, whiteSpace: 'nowrap' }}>{text}</div>;
  }
  function MiniTrack({ T, start, cells }) {
    return (
      <div style={{ display: 'flex', gap: 16 }}>
        {cells.map((c, i) => {
          const p = MOTION.pop(T, start + i * 0.05, 0.4), o = MOTION.enter(T, start + i * 0.05, 0.2);
          return (
            <div key={i} style={{ position: 'relative', width: 84, height: 84, borderRadius: 18, background: c.bg, border: `3px solid ${c.bd}`, opacity: o, transform: `scale(${0.6 + 0.4 * p})`, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `400 36px/1 ${F.serif}`, color: C.ink }}>
              {c.hatch ? <div style={{ position: 'absolute', inset: 0, borderRadius: 15, background: 'repeating-linear-gradient(135deg, rgba(209,89,82,0.22) 0 8px, rgba(209,89,82,0) 8px 16px)' }} /> : null}
              <span style={{ position: 'relative' }}>{i + 1}</span>
              {c.badge ? <img src={c.badge} style={{ position: 'absolute', right: -15, top: -17, width: 38 }} /> : null}
            </div>
          );
        })}
      </div>
    );
  }
  function Summary({ T, K }) {
    const o = vis(T, K.sumIn, K.sumOut, 0.4, 0.45);
    const nn = { bg: C.nBg, bd: C.nBd }, ss = { bg: C.sBg, bd: C.sBd };
    const cellsA = [nn, nn, nn, nn, nn, { bg: C.eBg, bd: C.eBd, badge: ASSET.warn_red }, { ...nn, hatch: true }, { ...nn, hatch: true }];
    const cellsB = [ss, ss, ss, ss, ss, { ...ss, badge: ASSET.stop }, ss, ss];
    const rA = MOTION.enter(T, K.O + 0.4, 0.45), rB = MOTION.enter(T, K.O + 0.9, 0.45);
    const resA = MOTION.enter(T, K.O + 1.45, 0.4), resB = MOTION.enter(T, K.O + 1.85, 0.4), tag = MOTION.enter(T, K.O + 2.35, 0.5);
    const row = { display: 'grid', gridTemplateColumns: '380px 784px 470px', columnGap: 40, alignItems: 'center' };
    const sub = { font: `700 24px/1.3 ${F.ui}`, color: C.faint, marginTop: 6, whiteSpace: 'nowrap' };
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 64, opacity: o, visibility: o > 0.001 ? 'visible' : 'hidden' }}>
        <div style={{ ...row, opacity: rA, transform: `translateY(${(1 - rA) * 20}px)` }}>
          <div><div style={{ font: `900 38px/1.1 ${F.ui}`, color: C.post }}>Post-hoc attribution</div><div style={sub}>diagnoses after the run ends</div></div>
          <MiniTrack T={T} start={K.O + 0.45} cells={cellsA} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: resA }}>
            <div style={{ flex: 'none', width: 52, height: 52, borderRadius: 26, background: C.eBd, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `900 38px/1 ${F.ui}` }}>×</div>
            <div><div style={{ font: `900 36px/1.1 ${F.ui}`, color: C.eInk }}>Wrong answer</div><div style={sub}>found after failure · 2 steps wasted</div></div>
          </div>
        </div>
        <div style={{ ...row, opacity: rB, transform: `translateY(${(1 - rB) * 20}px)` }}>
          <div><img src={ASSET.logo_word} style={{ height: 48, display: 'block' }} /><div style={sub}>audits every prefix online</div></div>
          <MiniTrack T={T} start={K.O + 0.95} cells={cellsB} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: resB }}>
            <img src={ASSET.check_circle} style={{ flex: 'none', width: 52, height: 52 }} />
            <div><div style={{ font: `900 36px/1.1 ${F.ui}`, color: C.sInk }}>Correct answer</div><div style={sub}>alarm at Step 6 · fixed before it spread</div></div>
          </div>
        </div>
        <div style={{ marginTop: 16, font: `800 46px/1.2 ${F.ui}`, color: C.navy, opacity: tag, transform: `translateY(${(1 - tag) * 14}px)` }}>From post-hoc diagnosis to deployment-time intervention.</div>
      </div>
    );
  }
  function Hero({ T, K }) {
    const p = MOTION.move(T, 1.7, 1.0) * (1 - MOTION.move(T, K.heroBack, 1.0));
    const late = T > K.R;
    const drift = late ? 0.988 + 0.012 * lin(T, K.heroBack + 1.0, 1.0) : 1 + 0.012 * lin(T, 0, 1.7);
    const w = lerp(1080 * drift, 232, p), h = (w * 335) / 1498;
    const cx = lerp(960, 156, p), cy = lerp(430, 52, p);
    const subO = late ? MOTION.enter(T, K.heroBack + 0.5, 0.45) : 1 - MOTION.enter(T, 1.55, 0.4);
    return (
      <>
        <div style={{ position: 'absolute', left: cx - w / 2 - 14, top: cy - h / 2 - 9, width: w + 28, height: h + 18, borderRadius: 16, background: 'rgba(255,255,255,0.94)', boxShadow: '0 6px 18px rgba(20,30,70,0.08)', opacity: clamp01((p - 0.6) / 0.4) }} />
        <img src={ASSET.logo_full} style={{ position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 604 + (1 - subO) * 14, textAlign: 'center', opacity: subO, font: `800 40px/1.2 ${F.ui}`, color: C.navy }}>Online Auditing for Early Failure Prediction in Multi-Agent Systems</div>
      </>
    );
  }

  // ── the piece ────────────────────────────────────────────────────────────
  function Piece({ tw }) {
    const { T, CUES, time } = useComposition();
    const K = React.useMemo(() => buildK(CUES), [CUES]);
    const KF = React.useMemo(() => buildCam(K), [K]);
    const EV = React.useMemo(() => bubbleEvents(K), [K]);
    const caps = React.useMemo(() => buildCaps(K), [K]);
    const cam = tw.camera === 'Overview' ? OV : clampCam(camAt(T, KF));
    const worldO = 1 - MOTION.move(T, K.O, 0.6);
    const a = laneAud(T, K);
    const flash = T >= K.verdict[5] ? 1 - MOTION.enter(T, K.verdict[5], 0.9) : 0;
    return (
      <div data-screen-label={`AgentForesight hero ${Math.floor(time)}s`} style={{ position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden', fontFamily: F.ui }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${960 - cam.cx * cam.s}px, ${540 - cam.cy * cam.s}px) scale(${cam.s})`, opacity: worldO, visibility: worldO > 0.001 ? 'visible' : 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, #DCE2EA 1.5px, rgba(0,0,0,0) 1.9px)', backgroundSize: '32px 32px', opacity: MOTION.enter(T, K.taskIn, 0.8) }} />
          <TaskBar T={T} K={K} cs={cam.s} />
          <Roster T={T} K={K} />
          <Arrows T={T} K={K} />
          {STEPS.map((_, i) => <Card key={i} i={i} s={cardState(i, T, K)} />)}
          <ScanBand T={T} K={K} />
          <PostHocMarks T={T} K={K} />
          <Rewinder T={T} K={K} />
          <Bracket T={T} K={K} />
          <StopSign T={T} K={K} />
          <Trophy T={T} K={K} />
          <LaneAuditor T={T} K={K} a={a} />
          <Bubble T={T} K={K} a={a} EV={EV} />
          <FixChip T={T} K={K} a={a} />
        </div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, rgba(209,89,82,0) 50%, rgba(209,89,82,0.30) 100%)', opacity: flash }} />
        <Chapter T={T} t0={K.chapA} t1={K.chapAOut} title="(a) Post-hoc failure attribution" sub="The run is diagnosed only after it has ended." accent={C.post} />
        <Chapter T={T} t0={K.chapB} t1={K.chapBOut} title="(b) Online auditing" sub="AgentForesight judges every prefix while the run unfolds." accent={C.ind} />
        <HudChip o={vis(T, K.chapAOut + 0.35, K.R + 0.5)} text="(a) Post-hoc failure attribution" ink={C.post} bd="#D5DAE2" bg="#FFFFFF" />
        <HudChip o={vis(T, K.chapBOut + 0.35, K.O + 0.3)} text="(b) Online auditing · AgentForesight" ink={C.ind} bd={C.indBd} bg={C.indBg} />
        <Summary T={T} K={K} />
        <Hero T={T} K={K} />
        {tw.captions ? <Captions items={caps} style={{ left: 0, right: 0, bottom: 34, font: `700 31px/1.25 ${F.ui}`, color: C.ink, textShadow: 'none' }} /> : null}
      </div>
    );
  }

  function AFVideo() {
    const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, captions: true, camera: 'Dynamic' });
    const [, setReady] = React.useState(0);
    React.useEffect(() => { let live = true; assetsReady.then(() => { if (live) setReady(1); }); return () => { live = false; }; }, []);
    return (
      <>
        <CompositionStage width={W} height={H} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={C.bg}>
          <Piece tw={t} />
        </CompositionStage>
        <TweaksPanel title="Tweaks">
          <TweakSection label="Editor" />
          <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
          <TweakSection label="Video" />
          <TweakToggle label="Captions" value={t.captions} onChange={(v) => setTweak('captions', v)} />
          <TweakRadio label="Camera" value={t.camera} options={['Dynamic', 'Overview']} onChange={(v) => setTweak('camera', v)} />
        </TweaksPanel>
      </>
    );
  }
  window.AFVideo = AFVideo;
})();
