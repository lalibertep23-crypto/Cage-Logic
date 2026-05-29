'use client';

import { useState } from 'react';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:         '#050505',
  surface:    '#111111',
  border:  'rgba(242,239,232,0.13)',
  text:       '#F2EFE8',
  dim:        'rgba(242,239,232,0.55)',
  dimmer:     'rgba(242,239,232,0.35)',
  amber:      '#C8943A',
  amberLow:   'rgba(201,130,42,0.35)',
  green:      '#5C8A3C',
  brick:      '#8B3A1E',
  brickLow:   'rgba(139,58,30,0.35)',
  bodyBase:   'rgba(242,239,232,0.08)',
  bodyStroke: 'rgba(242,239,232,0.18)',
};

// ── Region definitions ────────────────────────────────────────────────────────
type Region = {
  key: string;
  label: string;
  view: 'front' | 'back' | 'both';
  tip: string;
  professionals: string;
};

const REGIONS: Region[] = [
  {
    key: 'head', label: 'HEAD', view: 'both',
    tip: 'Any dizziness, pressure, or light sensitivity after head impact = no-roll day. Vestibular symptoms after a hit compound if ignored.',
    professionals: 'Neurologist, sports medicine MD, vestibular PT',
  },
  {
    key: 'neck', label: 'NECK', view: 'both',
    tip: 'Deep neck flexor activation (chin tuck × 10, daily) addresses most BJJ cervical strain. Shooting pain or numbness down the arm = see someone before it escalates.',
    professionals: 'PT, chiro, neurologist if radicular symptoms',
  },
  {
    key: 'shoulder', label: 'SHOULDER', view: 'both',
    tip: 'Scapular stability and rotator cuff endurance matter more than max strength here. Labrum injuries are common and don\'t always hurt enough to stop training until they tear fully.',
    professionals: 'PT, sports medicine MD, ortho surgeon for labrum',
  },
  {
    key: 'elbow', label: 'ELBOW', view: 'both',
    tip: 'Tap early, always. Elbow hyperextension injuries stack. UCL strains need 6–12 weeks minimum even with good care. Tapping late is the leading cause of surgery.',
    professionals: 'PT, ortho for UCL or ligament decisions',
  },
  {
    key: 'wrist_hand', label: 'WRIST / HAND', view: 'both',
    tip: 'Buddy tape finger sprains before rolling. Grip endurance work (not max grip) reduces wrist load significantly over time.',
    professionals: 'PT, hand surgeon for avulsion fractures or ligament instability',
  },
  {
    key: 'ribs', label: 'RIBS', view: 'front',
    tip: 'Rib bruising is common and manageable. Fractured ribs change your breathing mechanics — if your breath pattern shifts after a hit, get it checked.',
    professionals: 'Sports medicine MD, PT for breathing pattern rehab',
  },
  {
    key: 'upper_back', label: 'UPPER BACK', view: 'back',
    tip: 'Thoracic rotation and extension work reduces the chronic upper trap overload that guard-pulling posture creates. Most upper back pain in BJJ is postural, not structural.',
    professionals: 'PT, chiro for joint mobility',
  },
  {
    key: 'low_back', label: 'LOWER BACK', view: 'back',
    tip: 'McGill Big 3 (bird dog, side plank, modified curl-up) is the most evidence-backed daily prehab for low back in grappling. Leg and glute strength reduces lumbar load under fatigue.',
    professionals: 'PT, chiro, spine MD if pain shoots down the leg',
  },
  {
    key: 'hip_groin', label: 'HIP / GROIN', view: 'both',
    tip: 'Hip flexor and adductor load is high in guard work. Hip mobility before training reduces strain risk. Deep groin pain with internal rotation = labrum until proven otherwise.',
    professionals: 'PT, sports medicine MD for labrum or impingement',
  },
  {
    key: 'knee', label: 'KNEE', view: 'both',
    tip: 'VMO strengthening and single-leg work reduce ACL and MCL risk over time. In reaping and kneebar positions: tap before you feel the pop.',
    professionals: 'PT, ortho surgeon for ligament and meniscus decisions',
  },
  {
    key: 'ankle_foot', label: 'ANKLE / FOOT', view: 'both',
    tip: 'Ankle mobility directly affects guard base and takedown stability. Resistance band eversion work daily if rolling no-gi. Repeated ankle sprains accumulate into chronic instability.',
    professionals: 'PT, sports medicine MD',
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────
export type BodyMapProps = {
  sorenessFrequency: Record<string, number>;
  activeInjuries: { body_region: string; stage: string }[];
};

type ViewMode = 'front' | 'back';

// ── Status helpers ────────────────────────────────────────────────────────────
function regionStatus(
  key: string,
  freq: Record<string, number>,
  injuries: { body_region: string }[]
): 'injury' | 'high' | 'moderate' | 'clear' {
  if (injuries.some((i) => i.body_region === key)) return 'injury';
  const n = freq[key] ?? 0;
  if (n >= 5) return 'high';
  if (n >= 2) return 'moderate';
  return 'clear';
}

function statusFill(
  status: 'injury' | 'high' | 'moderate' | 'clear',
  selected: boolean
): string {
  if (selected) return C.amberLow;
  if (status === 'injury') return C.brickLow;
  if (status === 'high') return C.amberLow;
  if (status === 'moderate') return 'rgba(201,130,42,0.18)';
  return C.bodyBase;
}

function statusStroke(
  status: 'injury' | 'high' | 'moderate' | 'clear',
  selected: boolean
): string {
  if (selected) return C.amber;
  if (status === 'injury') return C.brick;
  if (status === 'high') return C.amber;
  if (status === 'moderate') return 'rgba(212,146,46,0.6)';
  return C.bodyStroke;
}

// ── SVG Body Figures ──────────────────────────────────────────────────────────
// ViewBox: 0 0 200 260

type RpFn = (key: string) => {
  fill: string;
  stroke: string;
  strokeWidth: number;
  onClick: () => void;
  style: React.CSSProperties;
};

function FrontBody({ rp }: { rp: RpFn }) {
  return (
    <g>
      {/* ── Decorative connectors (non-interactive) ─────────── */}
      {/* L upper arm */}
      <rect x={53} y={76} width={14} height={26} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      {/* R upper arm */}
      <rect x={133} y={76} width={14} height={26} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      {/* L forearm */}
      <rect x={54} y={114} width={13} height={26} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      {/* R forearm */}
      <rect x={133} y={114} width={13} height={26} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      {/* L thigh */}
      <rect x={82} y={138} width={16} height={34} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      {/* R thigh */}
      <rect x={102} y={138} width={16} height={34} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      {/* L shin */}
      <rect x={83} y={188} width={14} height={28} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      {/* R shin */}
      <rect x={103} y={188} width={14} height={28} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />

      {/* ── Clickable regions ───────────────────────────────── */}
      {/* HEAD */}
      <circle cx={100} cy={22} r={17} {...rp('head')} />

      {/* NECK */}
      <rect x={93} y={39} width={14} height={15} {...rp('neck')} />

      {/* L SHOULDER */}
      <ellipse cx={68} cy={68} rx={15} ry={9} {...rp('shoulder')} />
      {/* R SHOULDER */}
      <ellipse cx={132} cy={68} rx={15} ry={9} {...rp('shoulder')} />

      {/* RIBS (upper torso) */}
      <rect x={80} y={56} width={40} height={42} {...rp('ribs')} />

      {/* HIP / GROIN */}
      <polygon points="80,98 120,98 123,138 77,138" {...rp('hip_groin')} />

      {/* L ELBOW */}
      <rect x={49} y={100} width={18} height={16} {...rp('elbow')} />
      {/* R ELBOW */}
      <rect x={133} y={100} width={18} height={16} {...rp('elbow')} />

      {/* L WRIST / HAND */}
      <rect x={48} y={140} width={20} height={22} {...rp('wrist_hand')} />
      {/* R WRIST / HAND */}
      <rect x={132} y={140} width={20} height={22} {...rp('wrist_hand')} />

      {/* L KNEE */}
      <rect x={82} y={172} width={16} height={18} {...rp('knee')} />
      {/* R KNEE */}
      <rect x={102} y={172} width={16} height={18} {...rp('knee')} />

      {/* L ANKLE / FOOT */}
      <rect x={80} y={218} width={18} height={18} {...rp('ankle_foot')} />
      {/* R ANKLE / FOOT */}
      <rect x={102} y={218} width={18} height={18} {...rp('ankle_foot')} />
    </g>
  );
}

function BackBody({ rp }: { rp: RpFn }) {
  return (
    <g>
      {/* ── Decorative connectors ────────────────────────────── */}
      <rect x={53} y={76} width={14} height={26} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      <rect x={133} y={76} width={14} height={26} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      <rect x={54} y={114} width={13} height={26} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      <rect x={133} y={114} width={13} height={26} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      <rect x={82} y={138} width={16} height={34} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      <rect x={102} y={138} width={16} height={34} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      <rect x={83} y={188} width={14} height={28} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />
      <rect x={103} y={188} width={14} height={28} fill={C.bodyBase} stroke={C.bodyStroke} strokeWidth={0.6} />

      {/* ── Clickable regions ────────────────────────────────── */}
      {/* HEAD */}
      <circle cx={100} cy={22} r={17} {...rp('head')} />
      {/* NECK */}
      <rect x={93} y={39} width={14} height={15} {...rp('neck')} />
      {/* L SHOULDER */}
      <ellipse cx={68} cy={68} rx={15} ry={9} {...rp('shoulder')} />
      {/* R SHOULDER */}
      <ellipse cx={132} cy={68} rx={15} ry={9} {...rp('shoulder')} />

      {/* UPPER BACK */}
      <rect x={80} y={56} width={40} height={22} {...rp('upper_back')} />
      {/* LOWER BACK */}
      <rect x={80} y={78} width={40} height={20} {...rp('low_back')} />

      {/* HIP / GROIN */}
      <polygon points="80,98 120,98 123,138 77,138" {...rp('hip_groin')} />

      {/* L ELBOW */}
      <rect x={49} y={100} width={18} height={16} {...rp('elbow')} />
      {/* R ELBOW */}
      <rect x={133} y={100} width={18} height={16} {...rp('elbow')} />

      {/* L WRIST / HAND */}
      <rect x={48} y={140} width={20} height={22} {...rp('wrist_hand')} />
      {/* R WRIST / HAND */}
      <rect x={132} y={140} width={20} height={22} {...rp('wrist_hand')} />

      {/* L KNEE */}
      <rect x={82} y={172} width={16} height={18} {...rp('knee')} />
      {/* R KNEE */}
      <rect x={102} y={172} width={16} height={18} {...rp('knee')} />

      {/* L ANKLE / FOOT */}
      <rect x={80} y={218} width={18} height={18} {...rp('ankle_foot')} />
      {/* R ANKLE / FOOT */}
      <rect x={102} y={218} width={18} height={18} {...rp('ankle_foot')} />
    </g>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function BodyMap({ sorenessFrequency, activeInjuries }: BodyMapProps) {
  const [view, setView] = useState<ViewMode>('front');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  function tap(key: string) {
    setSelectedKey((prev) => (prev === key ? null : key));
  }

  // Build the props factory used by each SVG shape
  function rp(key: string): {
    fill: string;
    stroke: string;
    strokeWidth: number;
    onClick: () => void;
    style: React.CSSProperties;
  } {
    const status = regionStatus(key, sorenessFrequency, activeInjuries);
    const selected = selectedKey === key;
    return {
      fill:        statusFill(status, selected),
      stroke:      statusStroke(status, selected),
      strokeWidth: selected ? 1.5 : 0.8,
      onClick:     () => tap(key),
      style:       { cursor: 'pointer', transition: 'fill 120ms, stroke 120ms' },
    };
  }

  const selectedRegion = REGIONS.find((r) => r.key === selectedKey) ?? null;
  const sorenessCount  = selectedKey ? (sorenessFrequency[selectedKey] ?? 0) : 0;
  const injury         = selectedKey
    ? activeInjuries.find((i) => i.body_region === selectedKey)
    : undefined;

  return (
    <div>
      {/* Front / Back toggle */}
      <div style={{ display: 'flex', gap: 1, marginBottom: 20 }}>
        {(['front', 'back'] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => { setView(v); setSelectedKey(null); }}
            style={{
              flex: 1,
              padding: '10px 0',
              background: view === v ? C.amber : C.surface,
              color:      view === v ? C.bg    : C.dim,
              border: 'none',
              fontFamily: 'var(--font-bebas)',
              fontSize:   13,
              letterSpacing: '0.2em',
              cursor: 'pointer',
              transition: 'background 100ms',
            }}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>

      {/* SVG figure */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg
          viewBox="0 0 200 248"
          width="180"
          height="223"
          style={{ overflow: 'visible' }}
          aria-label="Body map — tap a region"
        >
          {view === 'front'
            ? <FrontBody rp={rp} />
            : <BackBody  rp={rp} />
          }
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginTop: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { color: C.brick,                       label: 'INJURY' },
          { color: C.amber,                        label: 'HIGH SORENESS' },
          { color: 'rgba(212,146,46,0.6)',          label: 'MODERATE' },
        ].map((l) => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, background: l.color, flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 8,
              letterSpacing: '0.12em', color: C.dimmer,
            }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Region detail panel */}
      {selectedRegion ? (
        <div style={{
          marginTop: 20,
          background: C.surface,
          borderLeft: `3px solid ${injury ? C.brick : C.amber}`,
          padding: '16px 16px 16px 14px',
        }}>
          {/* Header row */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', marginBottom: 12,
          }}>
            <span style={{
              fontFamily: 'var(--font-bebas)', fontSize: 18,
              letterSpacing: '0.18em', color: '#FFD97A',
            }}>
              {selectedRegion.label}
            </span>
            <button
              onClick={() => setSelectedKey(null)}
              style={{
                background: 'none', border: 'none',
                color: C.dimmer, cursor: 'pointer',
                fontFamily: 'var(--font-dm-mono)', fontSize: 11,
                padding: 0, lineHeight: 1,
              }}
              aria-label="Close"
            >✕</button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-anton)', fontSize: 24,
                color: sorenessCount >= 5 ? C.amber : sorenessCount >= 2 ? 'rgba(212,146,46,0.7)' : C.dim,
                lineHeight: 1,
              }}>
                {sorenessCount}
              </div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 8,
                letterSpacing: '0.1em', color: C.dimmer, marginTop: 3,
              }}>SORENESS LOGS / 30 DAYS</div>
            </div>
            {injury && (
              <div>
                <div style={{
                  fontFamily: 'var(--font-bebas)', fontSize: 14,
                  color: C.brick, letterSpacing: '0.12em',
                  textTransform: 'uppercase', lineHeight: 1,
                }}>
                  {injury.stage.replace(/_/g, ' ')}
                </div>
                <div style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 8,
                  letterSpacing: '0.1em', color: C.dimmer, marginTop: 3,
                }}>ACTIVE INJURY STAGE</div>
              </div>
            )}
          </div>

          {/* Tip */}
          <p style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10,
            letterSpacing: '0.03em', lineHeight: 1.75,
            color: C.dim, margin: '0 0 14px',
          }}>
            {selectedRegion.tip}
          </p>

          {/* Professionals */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 8,
              letterSpacing: '0.14em', color: C.dimmer,
            }}>
              WHO HELPS WITH THIS —{' '}
            </span>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9,
              color: C.dim,
            }}>
              {selectedRegion.professionals}
            </span>
          </div>

          {/* Legal note */}
          <p style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 8,
            letterSpacing: '0.06em', lineHeight: 1.5,
            color: C.dimmer, margin: '10px 0 0',
            borderTop: `1px solid rgba(242,239,232,0.08)`,
            paddingTop: 10,
          }}>
            Informative only. Not a diagnosis or treatment plan. A professional can confirm what applies to you.
          </p>
        </div>
      ) : (
        <p style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 9,
          letterSpacing: '0.08em', color: C.dimmer,
          textAlign: 'center', marginTop: 16,
        }}>
          Tap any region to see your data.
        </p>
      )}
    </div>
  );
}
