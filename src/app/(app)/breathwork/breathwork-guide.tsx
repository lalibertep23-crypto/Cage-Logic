'use client';

// Performance Breathing — Phase 1 — Darkroom Mode
// Brain focal point. Edge-to-center amber pulse. Radiating lines.
// V1.5 TODO: voiceover layer (audio cues per phase — not built in V1)

import { useReducer, useEffect, useRef, useTransition } from 'react';
import { logBreathworkSession } from './breathwork-actions';

// ── Palette ──────────────────────────────────────────────────────────────
const C = {
  bg:      '#050505',
  surface: '#0D0D0D',
  text:    '#F2EFE8',
  dim:     'rgba(242,239,232,0.45)',
  dimmer:  'rgba(242,239,232,0.22)',
  amber:   '#C8943A',
  green:   '#3D8B55',
  border:  'rgba(242,239,232,0.08)',
};

// ── Phase visual config ───────────────────────────────────────────────────
// Each phase drives: edge glow intensity, inward fill opacity,
// brain glow strength, radiating line opacity, and CSS transition timing.
const VIS = {
  idle: {
    edgeShadow:   'inset 0 0 45px rgba(200,148,58,0.10), inset 0 0 90px rgba(200,148,58,0.04)',
    fillOpacity:  0,
    brainGlow:    0.13,
    lineOpacity:  0.06,
    transition:   '1.5s ease',
  },
  IN: {
    edgeShadow:   'inset 0 0 110px rgba(200,148,58,0.50), inset 0 0 220px rgba(200,148,58,0.24)',
    fillOpacity:  0.88,
    brainGlow:    1.0,
    lineOpacity:  0.42,
    transition:   '4s ease-in',
  },
  PAUSE: {
    edgeShadow:   'inset 0 0 110px rgba(200,148,58,0.50), inset 0 0 220px rgba(200,148,58,0.24)',
    fillOpacity:  0.88,
    brainGlow:    1.0,
    lineOpacity:  0.42,
    transition:   '0.15s ease',
  },
  OUT: {
    edgeShadow:   'inset 0 0 45px rgba(200,148,58,0.10), inset 0 0 90px rgba(200,148,58,0.04)',
    fillOpacity:  0,
    brainGlow:    0.15,
    lineOpacity:  0.06,
    transition:   '6s ease-out',
  },
} as const;

// ── Breath protocol ───────────────────────────────────────────────────────
const STEPS = [
  { phase: 'IN'    as const, seconds: 4, label: 'IN',   sub: 'NOSE' },
  { phase: 'PAUSE' as const, seconds: 1, label: 'HOLD', sub: '' },
  { phase: 'OUT'   as const, seconds: 6, label: 'OUT',  sub: 'MOUTH / GUARD' },
];

// ── Timer state ───────────────────────────────────────────────────────────
interface TimerState {
  running:        boolean;
  phase:          'IN' | 'PAUSE' | 'OUT';
  secondsLeft:    number;
  secondsTotal:   number;
  elapsedSeconds: number;
  breathsComplete: number;
  done:           boolean;
}

type Action =
  | { type: 'START' }
  | { type: 'TICK'; totalSec: number }
  | { type: 'STOP' }
  | { type: 'RESET' };

const INIT: TimerState = {
  running: false, phase: 'IN', secondsLeft: 4, secondsTotal: 4,
  elapsedSeconds: 0, breathsComplete: 0, done: false,
};

function reduce(s: TimerState, a: Action): TimerState {
  if (a.type === 'START') return { ...INIT, running: true };
  if (a.type === 'STOP')  return { ...s, running: false };
  if (a.type === 'RESET') return INIT;
  if (a.type === 'TICK') {
    if (!s.running) return s;
    const elapsed = s.elapsedSeconds + 1;
    if (elapsed >= a.totalSec) return { ...s, running: false, done: true, elapsedSeconds: elapsed };
    if (s.secondsLeft <= 1) {
      const idx  = STEPS.findIndex(p => p.phase === s.phase);
      const next = STEPS[(idx + 1) % STEPS.length];
      const breaths = next.phase === 'IN' ? s.breathsComplete + 1 : s.breathsComplete;
      return { ...s, phase: next.phase, secondsLeft: next.seconds, secondsTotal: next.seconds, elapsedSeconds: elapsed, breathsComplete: breaths };
    }
    return { ...s, secondsLeft: s.secondsLeft - 1, elapsedSeconds: elapsed };
  }
  return s;
}

// ── Brain SVG ─────────────────────────────────────────────────────────────
// Same paths as nav icon. Glow driven by 0→1 intensity value.
function Brain({ size, glow }: { size: number; glow: number }) {
  const blur1 = (glow * 14).toFixed(1);
  const blur2 = (glow * 28).toFixed(1);
  const a1    = (glow * 0.9).toFixed(2);
  const a2    = (glow * 0.45).toFixed(2);
  const glowFilter = glow > 0.05
    ? `drop-shadow(0 0 ${blur1}px rgba(200,148,58,${a1})) drop-shadow(0 0 ${blur2}px rgba(200,148,58,${a2}))`
    : undefined;
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={C.amber}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: 0.28 + glow * 0.72, filter: glowFilter }}
    >
      {/* Cerebrum dome */}
      <path d="M5,18 L5,13 C5,8 8,4 13,4 C18,4 21,7 21,12 C21,16 19,18 17,18"/>
      {/* Cerebellum */}
      <path d="M17,18 C19,18 21,19 20,21 C19,22 17,22 16,21 L16,18"/>
      {/* Brain stem */}
      <path d="M5,18 L5,21 L16,21"/>
      {/* Sulci */}
      <path d="M9,7 C11,9 9,12 11,15"/>
      <path d="M14,5 C16,8 14,11 16,14"/>
    </svg>
  );
}

// ── Radiating lines ───────────────────────────────────────────────────────
// 8 lines from brain center (12,12 in 24×24 viewBox) to well past edges.
// preserveAspectRatio="xMidYMid slice" scales to fill the full-screen container.
// Cardinal directions at full weight, diagonals at half weight.
const LINE_DEFS = [
  { x2: 12,  y2: -32, op: 1.0 },   // up
  { x2: 36,  y2: -22, op: 0.5 },   // up-right
  { x2: 36,  y2: 12,  op: 1.0 },   // right
  { x2: 36,  y2: 36,  op: 0.5 },   // down-right
  { x2: 12,  y2: 44,  op: 1.0 },   // down
  { x2: -12, y2: 36,  op: 0.5 },   // down-left
  { x2: -12, y2: 12,  op: 1.0 },   // left
  { x2: -12, y2: -22, op: 0.5 },   // up-left
];

function RadiateLines() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid slice"
    >
      {LINE_DEFS.map((l, i) => (
        <line
          key={i}
          x1={12} y1={12}
          x2={l.x2} y2={l.y2}
          stroke={C.amber}
          strokeWidth="0.055"
          strokeOpacity={l.op * 0.65}
        />
      ))}
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export function BreathworkGuide({ onComplete }: { onComplete?: () => void }) {
  const [durationMin, setDurationMin] = useReducer((_: number, n: number) => n, 5);
  const [timer, dispatch]             = useReducer(reduce, INIT);
  const [, startTransition]           = useTransition();
  const [comfortRating, setComfortRating] = useReducer((_: number | null, n: number | null) => n, null);
  const [logged, setLogged]           = useReducer((_: boolean, v: boolean) => v, false);
  const loggedRef                     = useRef(false);

  const totalSec    = durationMin * 60;
  const isActive    = timer.running || timer.done;
  const currentStep = STEPS.find(s => s.phase === timer.phase) ?? STEPS[0];
  const sessionPct  = totalSec > 0 ? Math.min(100, (timer.elapsedSeconds / totalSec) * 100) : 0;

  // Which visual config to use
  const vis = timer.running
    ? VIS[timer.phase]
    : timer.done
      ? VIS.IN
      : VIS.idle;

  useEffect(() => {
    if (!timer.running) return;
    const id = setInterval(() => dispatch({ type: 'TICK', totalSec }), 1000);
    return () => clearInterval(id);
  }, [timer.running, totalSec]);

  useEffect(() => {
    if (!timer.done) {
      loggedRef.current = false;
      setLogged(false);
      setComfortRating(null);
    }
  }, [timer.done]);

  function submitRating(rating: number) {
    if (loggedRef.current) return;
    loggedRef.current = true;
    setLogged(true);
    startTransition(async () => {
      await logBreathworkSession('phase_1', durationMin, rating);
      onComplete?.();
    });
  }

  // ── PRE-SESSION ───────────────────────────────────────────────────────
  if (!isActive) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Duration — minimal text selector, no big button */}
        <div style={{ display: 'flex', gap: 28, marginBottom: 36 }}>
          {[5, 10].map(d => (
            <button
              key={d}
              onClick={() => setDurationMin(d)}
              style={{
                background:   'transparent',
                border:       'none',
                borderBottom: durationMin === d ? `1px solid ${C.amber}` : '1px solid transparent',
                padding:      '6px 0',
                fontFamily:   'var(--font-dm-mono)',
                fontSize:     13,
                letterSpacing:'0.22em',
                color:        durationMin === d ? C.amber : C.dimmer,
                cursor:       'pointer',
                transition:   'all 0.2s',
              }}
            >
              {d} MIN
            </button>
          ))}
        </div>

        {/* Brain tap target — this IS the start button */}
        <button
          onClick={() => dispatch({ type: 'START' })}
          aria-label="Begin breathing session"
          style={{
            background:    'transparent',
            border:        'none',
            cursor:        'pointer',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:           18,
            padding:       '16px 48px',
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Ambient halo behind brain */}
            <div style={{
              position:   'absolute',
              inset:      -24,
              background: 'radial-gradient(ellipse at center, rgba(200,148,58,0.10) 0%, transparent 72%)',
              borderRadius: '50%',
            }} />
            <Brain size={80} glow={0.22} />
          </div>
          <span style={{
            fontFamily:    'var(--font-dm-mono)',
            fontSize:      10,
            letterSpacing: '0.32em',
            color:         C.dimmer,
          }}>
            TAP TO BEGIN
          </span>
        </button>

        {/* Protocol reminder */}
        <div style={{
          marginTop:  28,
          borderLeft: `2px solid rgba(200,148,58,0.18)`,
          padding:    '12px 14px',
          background: C.surface,
          width:      '100%',
          boxSizing:  'border-box',
        }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dimmer, margin: 0 }}>
            Lie on your back. Mouthguard in. One hand on chest, one on belly. Belly rises. Chest stays still.
          </p>
        </div>

      </div>
    );
  }

  // ── ACTIVE / DONE — full-screen darkroom ──────────────────────────────
  return (
    <div
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         200,
        background:     C.bg,
        boxShadow:      vis.edgeShadow,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        overflow:       'hidden',
        transition:     vis.transition,
      }}
    >

      {/* ── Radial fill — amber builds inward from edges toward brain ── */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'radial-gradient(ellipse at center, rgba(200,148,58,0.07) 0%, rgba(200,148,58,0.30) 100%)',
          opacity:    vis.fillOpacity,
          transition: vis.transition,
          pointerEvents: 'none',
        }}
      />

      {/* ── Radiating lines — behind everything, brighten on inhale ── */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          opacity:    vis.lineOpacity,
          transition: vis.transition,
          pointerEvents: 'none',
        }}
      >
        <RadiateLines />
      </div>

      {/* ── Center content ─────────────────────────────────────────── */}
      <div
        style={{
          position:      'relative',
          zIndex:        1,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
        }}
      >

        {!timer.done ? (
          <>
            {/* Phase label */}
            <div style={{
              fontFamily:    'var(--font-dm-mono)',
              fontSize:      10,
              letterSpacing: '0.30em',
              color:         C.dimmer,
              marginBottom:  32,
            }}>
              {currentStep.label}{currentStep.sub ? ` · ${currentStep.sub}` : ''}
            </div>

            {/* Brain — glow driven by phase */}
            <div style={{ transition: vis.transition }}>
              <Brain size={92} glow={vis.brainGlow} />
            </div>

            {/* Countdown */}
            <div style={{
              fontFamily:    'var(--font-anton)',
              fontSize:      80,
              letterSpacing: '0.02em',
              color:         C.text,
              lineHeight:    1,
              marginTop:     14,
            }}>
              {timer.secondsLeft}
            </div>

            {/* Breath count */}
            <div style={{
              fontFamily:    'var(--font-dm-mono)',
              fontSize:      9,
              letterSpacing: '0.22em',
              color:         C.dimmer,
              marginTop:     14,
            }}>
              {timer.breathsComplete} {timer.breathsComplete === 1 ? 'BREATH' : 'BREATHS'} COMPLETE
            </div>
          </>
        ) : (
          /* ── Done state ─────────────────────────────────────────── */
          <div style={{
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:           18,
            width:         '100%',
            padding:       '0 36px',
            boxSizing:     'border-box',
          }}>
            <Brain size={64} glow={0.75} />

            <p style={{
              fontFamily:    'var(--font-bebas)',
              fontSize:      18,
              letterSpacing: '0.18em',
              color:         C.amber,
              margin:        0,
            }}>
              {durationMin} MIN · {timer.breathsComplete} BREATHS
            </p>

            {!logged ? (
              <>
                <span style={{
                  fontFamily:    'var(--font-dm-mono)',
                  fontSize:      10,
                  letterSpacing: '0.24em',
                  color:         C.dimmer,
                }}>
                  COMFORT RATING
                </span>

                <div style={{ display: 'flex', gap: 2, width: '100%' }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button
                      key={n}
                      onClick={() => setComfortRating(n)}
                      style={{
                        flex:        1,
                        padding:     '12px 0',
                        background:  comfortRating != null && n <= comfortRating
                          ? 'rgba(200,148,58,0.30)'
                          : 'rgba(255,255,255,0.04)',
                        border:      comfortRating === n
                          ? `1px solid ${C.amber}`
                          : '1px solid transparent',
                        color:       comfortRating != null && n <= comfortRating ? C.amber : C.dimmer,
                        fontFamily:  'var(--font-dm-mono)',
                        fontSize:    10,
                        cursor:      'pointer',
                        transition:  'background 80ms',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => comfortRating != null && submitRating(comfortRating)}
                  style={{
                    width:         '100%',
                    background:    comfortRating != null ? C.amber : 'rgba(255,255,255,0.05)',
                    color:         comfortRating != null ? C.bg : C.dimmer,
                    border:        'none',
                    padding:       '16px 24px',
                    fontFamily:    'var(--font-anton)',
                    fontSize:      18,
                    letterSpacing: '0.08em',
                    cursor:        comfortRating != null ? 'pointer' : 'default',
                    transition:    'background 120ms',
                  }}
                >
                  LOG SESSION →
                </button>
              </>
            ) : (
              <>
                <p style={{
                  fontFamily:    'var(--font-dm-mono)',
                  fontSize:      11,
                  letterSpacing: '0.08em',
                  color:         C.green,
                  margin:        0,
                }}>
                  Logged. Counts toward Phase 1 completion.
                </p>
                <button
                  onClick={() => dispatch({ type: 'RESET' })}
                  style={{
                    background:    'transparent',
                    border:        `1px solid ${C.border}`,
                    color:         C.dimmer,
                    padding:       '12px 32px',
                    fontFamily:    'var(--font-bebas)',
                    fontSize:      14,
                    letterSpacing: '0.14em',
                    cursor:        'pointer',
                  }}
                >
                  GO AGAIN →
                </button>
              </>
            )}
          </div>
        )}

      </div>

      {/* ── Progress bar + stop ───────────────────────────────────── */}
      {timer.running && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <div style={{ height: 2, background: 'rgba(242,239,232,0.05)' }}>
            <div style={{
              height:     '100%',
              width:      `${sessionPct}%`,
              background: C.amber,
              transition: 'width 1s linear',
            }} />
          </div>
          <button
            onClick={() => dispatch({ type: 'STOP' })}
            style={{
              display:       'block',
              margin:        '0 auto',
              padding:       '18px 40px',
              background:    'transparent',
              border:        'none',
              color:         C.dimmer,
              fontFamily:    'var(--font-dm-mono)',
              fontSize:      10,
              letterSpacing: '0.26em',
              cursor:        'pointer',
            }}
          >
            STOP
          </button>
        </div>
      )}

    </div>
  );
}
