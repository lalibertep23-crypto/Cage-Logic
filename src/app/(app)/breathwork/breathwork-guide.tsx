'use client';

// Breathwork Phase 1 animated guide.
// Protocol: nose inhale 4s → pause 1s → exhale through mouth/guard 6s.
// Octagon visualizer: cage from above. Pulsing octagon shape on each breath phase.
// Research: Laborde 2024, Schulze 2019, Fincham 2023.

import { useReducer, useEffect, useRef, useTransition } from 'react';
import { logBreathworkSession } from './breathwork-actions';

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:      '#1A1713',
  surface: '#252118',
  bgSunk:  '#13110E',
  border:  'rgba(245,240,232,0.13)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.55)',
  dimmer:  'rgba(245,240,232,0.22)',
  amber:   '#D4922E',
  amberLow:'rgba(201,130,42,0.35)',
  amberDim:'rgba(201,130,42,0.10)',
  green:   '#3D8B55',
  greenLow:'rgba(42,92,63,0.35)',
  mid:     '#D8D2C8',
  midLow:  '#B8B2A8',
};

// ── Octagon geometry (SVG 220×220, center 110,110) ───────────────────────────
// Regular octagon, flat-top orientation (22.5° offset from x-axis)
const CX = 110;
const CY = 110;
const OUTER_R = 90;  // cage frame
const INNER_R = 68;  // breathing octagon base size

const ANGLES_DEG = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
const ANGLES_RAD = ANGLES_DEG.map((d) => (d * Math.PI) / 180);

function octPoints(cx: number, cy: number, r: number): string {
  return ANGLES_RAD.map((a) => `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`).join(' ');
}

const OUTER_POINTS = octPoints(CX, CY, OUTER_R);
const INNER_POINTS = octPoints(CX, CY, INNER_R);

// Vertices as [x, y] pairs for drawing radial lines
const OUTER_VERTS = ANGLES_RAD.map((a) => ({
  x: CX + OUTER_R * Math.cos(a),
  y: CY + OUTER_R * Math.sin(a),
}));

// ── Types ────────────────────────────────────────────────────────────────────
interface PhaseStep {
  label: string;
  sublabel: string;
  seconds: number;
  big: boolean;
  color: string;
  fillColor: string;
}

interface TimerState {
  running: boolean;
  phaseIndex: number;
  secondsLeft: number;
  secondsTotal: number;
  elapsedSeconds: number;
  roundsComplete: number;
  done: boolean;
}

type TimerAction =
  | { type: 'START'; firstSeconds: number }
  | { type: 'TICK'; steps: PhaseStep[]; totalSeconds: number; stepsPerRound: number }
  | { type: 'STOP' }
  | { type: 'RESET' };

// ── Phase 1 Protocol ─────────────────────────────────────────────────────────
const PHASE_1_STEPS: PhaseStep[] = [
  { label: 'IN',    sublabel: 'NOSE',          seconds: 4, big: true,  color: C.amber,  fillColor: C.amberDim },
  { label: 'PAUSE', sublabel: '',              seconds: 1, big: true,  color: C.dimmer, fillColor: 'rgba(245,240,232,0.04)' },
  { label: 'OUT',   sublabel: 'MOUTH / GUARD', seconds: 6, big: false, color: C.green,  fillColor: 'rgba(42,92,63,0.12)' },
];

const DURATIONS = [5, 10];

// ── Reducer ──────────────────────────────────────────────────────────────────
function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START':
      return {
        running: true, phaseIndex: 0,
        secondsLeft: action.firstSeconds, secondsTotal: action.firstSeconds,
        elapsedSeconds: 0, roundsComplete: 0, done: false,
      };
    case 'TICK': {
      if (!state.running) return state;
      const nextElapsed = state.elapsedSeconds + 1;
      if (nextElapsed >= action.totalSeconds) {
        return { ...state, running: false, done: true, elapsedSeconds: nextElapsed };
      }
      if (state.secondsLeft <= 1) {
        const nextIndex = (state.phaseIndex + 1) % action.steps.length;
        const nextStep = action.steps[nextIndex];
        const completedRound = nextIndex === 0 ? state.roundsComplete + 1 : state.roundsComplete;
        return {
          ...state, phaseIndex: nextIndex,
          secondsLeft: nextStep.seconds, secondsTotal: nextStep.seconds,
          elapsedSeconds: nextElapsed, roundsComplete: completedRound,
        };
      }
      return { ...state, secondsLeft: state.secondsLeft - 1, elapsedSeconds: nextElapsed };
    }
    case 'STOP':
      return { ...state, running: false };
    case 'RESET':
      return { running: false, phaseIndex: 0, secondsLeft: 0, secondsTotal: 0, elapsedSeconds: 0, roundsComplete: 0, done: false };
    default:
      return state;
  }
}

const INITIAL_STATE: TimerState = {
  running: false, phaseIndex: 0, secondsLeft: 0, secondsTotal: 0,
  elapsedSeconds: 0, roundsComplete: 0, done: false,
};

// ── Component ────────────────────────────────────────────────────────────────
export function BreathworkGuide({ onComplete }: { onComplete?: () => void }) {
  const [durationMin, setDurationMin] = useReducer((_: number, n: number) => n, 5);
  const [timer, dispatch] = useReducer(timerReducer, INITIAL_STATE);
  const [, startTransition] = useTransition();
  const [comfortRating, setComfortRating] = useReducer((_: number | null, n: number | null) => n, null);
  const [logged, setLogged] = useReducer((_: boolean, v: boolean) => v, false);

  const steps = PHASE_1_STEPS;
  const totalSeconds = durationMin * 60;
  const currentStep = steps[timer.phaseIndex] ?? steps[0];

  // Tick
  useEffect(() => {
    if (!timer.running) return;
    const id = setInterval(() => {
      dispatch({ type: 'TICK', steps, totalSeconds, stepsPerRound: steps.length });
    }, 1000);
    return () => clearInterval(id);
  }, [timer.running, totalSeconds]);

  // Log only after comfort rating is submitted
  const loggedRef = useRef(false);
  function submitWithRating(rating: number) {
    if (loggedRef.current) return;
    loggedRef.current = true;
    setLogged(true);
    startTransition(async () => {
      await logBreathworkSession('phase_1', durationMin, rating);
      onComplete?.();
    });
  }

  // Reset logged ref when timer resets
  useEffect(() => {
    if (!timer.done) { loggedRef.current = false; setLogged(false); setComfortRating(null); }
  }, [timer.done]);

  // ── Octagon scale logic ───────────────────────────────────────────────────
  // Idle: 0.55. IN: expand to 1.0. PAUSE: hold 1.0. OUT: contract to 0.55.
  const isActive = timer.running || timer.done;

  let innerScale = 0.55;
  let innerTransition = 'transform 0.4s ease';
  if (isActive && !timer.done) {
    if (currentStep.label === 'IN') {
      innerScale = 1.0;
      innerTransition = `transform ${currentStep.seconds}s ease-in`;
    } else if (currentStep.label === 'PAUSE') {
      innerScale = 1.0;
      innerTransition = 'transform 0.2s';
    } else if (currentStep.label === 'OUT') {
      innerScale = 0.55;
      innerTransition = `transform ${currentStep.seconds}s ease-out`;
    }
  } else if (timer.done) {
    innerScale = 1.0;
    innerTransition = 'transform 0.6s ease-in';
  }

  // Glow color for current phase
  const glowColor = timer.done
    ? C.amber
    : !isActive
      ? 'rgba(201,130,42,0.0)'
      : currentStep.color;

  // Session progress bar
  const sessionPct = totalSeconds > 0 ? (timer.elapsedSeconds / totalSeconds) * 100 : 0;
  const minsLeft = Math.max(0, Math.ceil((totalSeconds - timer.elapsedSeconds) / 60));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Pre-session ─────────────────────────────────────────────────── */}
      {!isActive && (
        <>
          <div>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.midLow, display: 'block', marginBottom: 8 }}>
              DURATION
            </span>
            <div style={{ display: 'flex', background: C.bgSunk, gap: 1 }}>
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDurationMin(d)}
                  style={{
                    flex: 1, padding: '12px 2px',
                    background: durationMin === d ? C.amber : 'transparent',
                    color: durationMin === d ? C.bg : C.midLow,
                    fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.14em',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  {d} MIN
                </button>
              ))}
            </div>
          </div>

          <div style={{ borderLeft: `2px solid ${C.amberLow}`, padding: '12px 14px', background: C.surface }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.amber, marginBottom: 6 }}>
              BEFORE YOU START
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
              Lie on your back. Mouthguard in. One hand on chest, one on belly. Goal: belly rises, chest stays still.
            </p>
          </div>

          <button
            onClick={() => dispatch({ type: 'START', firstSeconds: steps[0].seconds })}
            style={{
              width: '100%', background: C.amber, color: C.bg, border: 'none',
              padding: '18px 24px', fontFamily: 'var(--font-anton)', fontSize: 20,
              letterSpacing: '0.08em', cursor: 'pointer',
            }}
          >
            START SESSION
          </button>
        </>
      )}

      {/* ── Active guide — octagon ───────────────────────────────────────── */}
      {isActive && (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '16px 0' }}>
          {/* Atmospheric background — low-opacity image behind the octagon */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: 'url(/breathwork-active_bright.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.14,
            filter: 'saturate(0.5)',
          }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>

          {/* Octagon visual */}
          <div style={{ position: 'relative', width: 220, height: 220 }}>
            <svg
              width={220} height={220}
              viewBox="0 0 220 220"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block' }}
            >
              <defs>
                <filter id="cage-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Radial cage lines — center to outer vertices */}
              {OUTER_VERTS.map((v, i) => (
                <line
                  key={i}
                  x1={CX} y1={CY} x2={v.x} y2={v.y}
                  stroke="rgba(245,240,232,0.04)"
                  strokeWidth="1"
                />
              ))}

              {/* Mid-ring octagon */}
              <polygon
                points={octPoints(CX, CY, OUTER_R * 0.58)}
                fill="none"
                stroke="rgba(245,240,232,0.05)"
                strokeWidth="1"
              />

              {/* Outer cage octagon */}
              <polygon
                points={OUTER_POINTS}
                fill="none"
                stroke={timer.done ? C.amber : 'rgba(201,130,42,0.22)'}
                strokeWidth="1.5"
              />

              {/* Corner accent marks — small ticks at each outer vertex */}
              {OUTER_VERTS.map((v, i) => {
                const inward = { x: CX + (OUTER_R - 6) * Math.cos(ANGLES_RAD[i]), y: CY + (OUTER_R - 6) * Math.sin(ANGLES_RAD[i]) };
                return (
                  <line
                    key={`tick-${i}`}
                    x1={v.x} y1={v.y} x2={inward.x} y2={inward.y}
                    stroke="rgba(201,130,42,0.35)"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Inner breathing octagon */}
              <polygon
                points={INNER_POINTS}
                fill={timer.done ? 'rgba(201,130,42,0.18)' : currentStep.fillColor}
                stroke={timer.done ? C.amber : currentStep.color}
                strokeWidth={timer.done ? 2 : 1.5}
                filter={isActive && !timer.done && currentStep.label === 'IN' ? 'url(#cage-glow)' : undefined}
                style={{
                  transform: `scale(${innerScale})`,
                  transformOrigin: `${CX}px ${CY}px`,
                  transition: innerTransition,
                }}
              />

              {/* Center — phase label + countdown */}
              {!timer.done ? (
                <>
                  <text
                    x={CX} y={CY - 10}
                    textAnchor="middle"
                    fontFamily="var(--font-bebas)"
                    fontSize="13"
                    letterSpacing="0.22em"
                    fill={currentStep.color}
                  >
                    {currentStep.label}
                  </text>
                  <text
                    x={CX} y={CY + 20}
                    textAnchor="middle"
                    fontFamily="var(--font-anton)"
                    fontSize="36"
                    fill={C.text}
                  >
                    {timer.secondsLeft}
                  </text>
                  {currentStep.sublabel ? (
                    <text
                      x={CX} y={CY + 34}
                      textAnchor="middle"
                      fontFamily="var(--font-dm-mono)"
                      fontSize="7"
                      letterSpacing="0.14em"
                      fill={C.dimmer}
                    >
                      {currentStep.sublabel}
                    </text>
                  ) : null}
                </>
              ) : (
                <text
                  x={CX} y={CY + 6}
                  textAnchor="middle"
                  fontFamily="var(--font-bebas)"
                  fontSize="18"
                  letterSpacing="0.22em"
                  fill={C.amber}
                >
                  DONE
                </text>
              )}
            </svg>
          </div>

          {/* Breath counter */}
          {!timer.done && (
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.18em', color: C.dimmer }}>
              {timer.roundsComplete} {timer.roundsComplete === 1 ? 'BREATH' : 'BREATHS'} COMPLETE
            </span>
          )}

          {/* Done state */}
          {timer.done ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', maxWidth: 300 }}>
              <p style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.18em', color: C.amber, margin: 0 }}>
                {durationMin} MIN. {timer.roundsComplete} BREATHS.
              </p>

              {!logged ? (
                <>
                  <div style={{ width: '100%' }}>
                    <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.midLow, display: 'block', marginBottom: 8, textAlign: 'center' }}>
                      COMFORT RATING
                    </span>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                        <button
                          key={n}
                          onClick={() => setComfortRating(n)}
                          style={{
                            flex: 1, padding: '10px 0',
                            background: comfortRating === n ? C.amber : comfortRating != null && n <= comfortRating ? C.amberLow : C.bgSunk,
                            color: comfortRating === n ? C.bg : C.midLow,
                            fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                            border: 'none', cursor: 'pointer',
                            transition: 'background 80ms',
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => comfortRating != null && submitWithRating(comfortRating)}
                    disabled={comfortRating == null}
                    style={{