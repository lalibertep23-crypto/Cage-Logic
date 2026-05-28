'use client';

// Soreness form — body map tap interface.
// SVG hotspot zones over new-body.png. Amber glow on selection.
// Zones calibrated to 1024x1536 viewBox.

import { useActionState, useState } from 'react';
import { logSorenessAction, type SorenessState } from './actions';

const C = {
  bg:       '#050505',
  surface:  '#0D0D0D',
  border:   'rgba(242,239,232,0.08)',
  text:     '#F2EFE8',
  dim:      'rgba(242,239,232,0.45)',
  dimmer:   'rgba(242,239,232,0.22)',
  amber:    '#C8943A',
  amberLow: 'rgba(200,148,58,0.38)',
  amberRing:'rgba(200,148,58,0.75)',
  green:    '#3D8B55',
  brick:    '#A43A2F',
  midLow:   '#8E8577',
};

function sorenessColor(n: number) {
  if (n <= 3) return C.green;
  if (n <= 6) return C.amber;
  return C.brick;
}
function energyColor(n: number) {
  if (n >= 7) return C.green;
  if (n >= 4) return C.amber;
  return C.brick;
}

// Body zone definitions — ellipses in 1024x1536 coordinate space
const ZONES: {
  id: string;
  label: string;
  shapes: { cx: number; cy: number; rx: number; ry: number }[];
}[] = [
  { id: 'head',       label: 'HEAD',         shapes: [{ cx: 512, cy: 118,  rx: 100, ry: 108 }] },
  { id: 'neck',       label: 'NECK',         shapes: [{ cx: 512, cy: 252,  rx:  46, ry:  48 }] },
  { id: 'shoulder',   label: 'SHOULDER',     shapes: [{ cx: 330, cy: 330,  rx:  92, ry:  68 }, { cx: 694, cy: 330,  rx: 92, ry: 68 }] },
  { id: 'ribs',       label: 'RIBS / CHEST', shapes: [{ cx: 512, cy: 470,  rx: 135, ry: 105 }] },
  { id: 'elbow',      label: 'ELBOW',        shapes: [{ cx: 248, cy: 570,  rx:  52, ry:  52 }, { cx: 776, cy: 570,  rx: 52, ry: 52 }] },
  { id: 'upper_back', label: 'UPPER BACK',   shapes: [{ cx: 512, cy: 410,  rx: 100, ry:  70 }] },
  { id: 'wrist_hand', label: 'WRIST / HAND', shapes: [{ cx: 196, cy: 760,  rx:  56, ry:  88 }, { cx: 828, cy: 760,  rx: 56, ry: 88 }] },
  { id: 'low_back',   label: 'LOWER BACK',   shapes: [{ cx: 512, cy: 640,  rx: 115, ry:  72 }] },
  { id: 'hip_groin',  label: 'HIP / GROIN',  shapes: [{ cx: 512, cy: 820,  rx: 148, ry:  85 }] },
  { id: 'knee',       label: 'KNEE',         shapes: [{ cx: 432, cy: 1060, rx:  68, ry:  68 }, { cx: 592, cy: 1060, rx: 68, ry: 68 }] },
  { id: 'ankle_foot', label: 'ANKLE / FOOT', shapes: [{ cx: 418, cy: 1390, rx:  58, ry: 108 }, { cx: 606, cy: 1390, rx: 58, ry: 108 }] },
];

const initialState: SorenessState = {};
type Defaults = { overall: number | null; energy: number | null; regions: string[] };

export function SorenessForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction, pending] = useActionState(logSorenessAction, initialState);
  const [overall, setOverall] = useState<number | null>(defaults.overall);
  const [energy,  setEnergy]  = useState<number | null>(defaults.energy);
  const [regions, setRegions] = useState<string[]>(defaults.regions);
  const [other,   setOther]   = useState(defaults.regions.includes('other'));

  function toggleRegion(id: string) {
    setRegions(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  const allRegions = other
    ? [...regions.filter(r => r !== 'other'), 'other']
    : regions.filter(r => r !== 'other');

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Overall soreness */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.22em', color: C.midLow }}>
            OVERALL SORENESS
          </span>
          {overall !== null && (
            <span style={{ fontFamily: 'var(--font-anton)', fontSize: 20, color: sorenessColor(overall) }}>
              {overall}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {[0,1,2,3,4,5,6,7,8,9,10].map(n => {
            const sel = overall === n;
            const col = sorenessColor(n === 0 ? 0 : n);
            return (
              <button key={n} type="button" onClick={() => setOverall(n)} style={{
                flex: 1, height: 32,
                background: sel ? col : 'rgba(255,255,255,0.04)',
                color: sel ? C.bg : C.midLow,
                border: 'none',
                fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em',
                cursor: 'pointer', transition: 'background 80ms',
              }}>{n}</button>
            );
          })}
        </div>
        {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
          <input key={n} type="radio" name="overall" value={n}
            checked={overall === n} required={n === 0} onChange={() => {}}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
        ))}
        {state.fieldErrors?.overall && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, marginTop: 6, margin: 0 }}>
            {state.fieldErrors.overall}
          </p>
        )}
      </div>

      {/* Energy level */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.22em', color: C.midLow }}>
            ENERGY
          </span>
          {energy !== null && (
            <span style={{ fontFamily: 'var(--font-anton)', fontSize: 20, color: energyColor(energy) }}>
              {energy}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {[0,1,2,3,4,5,6,7,8,9,10].map(n => {
            const sel = energy === n;
            const col = energyColor(n);
            return (
              <button key={n} type="button" onClick={() => setEnergy(n)} style={{
                flex: 1, height: 32,
                background: sel ? col : 'rgba(255,255,255,0.04)',
                color: sel ? C.bg : C.midLow,
                border: 'none',
                fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em',
                cursor: 'pointer', transition: 'background 80ms',
              }}>{n}</button>
            );
          })}
        </div>
        {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
          <input key={n} type="radio" name="energy" value={n}
            checked={energy === n} onChange={() => {}}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
        ))}
      </div>

      {/* Body map */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.22em', color: C.midLow }}>
            WHERE IT HURTS
          </span>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>
            tap to select
          </span>
        </div>

        {/* Body image + SVG overlay */}
        <div style={{ position: 'relative', width: '100%', background: C.bg }}>
          <img
            src="/new-body.png"
            alt="Body diagram"
            style={{ width: '100%', display: 'block', opacity: 0.55, userSelect: 'none' }}
            draggable={false}
          />

          {/* SVG hotspot layer */}
          <svg
            viewBox="0 0 1024 1536"
            preserveAspectRatio="xMidYMid meet"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            <defs>
              <filter id="zone-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="14" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {ZONES.map(zone => {
              const sel = regions.includes(zone.id);
              return (
                <g key={zone.id} onClick={() => toggleRegion(zone.id)} style={{ cursor: 'pointer' }}>
                  {zone.shapes.map((s, i) => (
                    <ellipse
                      key={i}
                      cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry}
                      fill={sel ? 'rgba(200,148,58,0.38)' : 'rgba(200,148,58,0.04)'}
                      stroke={sel ? 'rgba(200,148,58,0.80)' : 'rgba(200,148,58,0.12)'}
                      strokeWidth={sel ? 10 : 5}
                      filter={sel ? 'url(#zone-glow)' : undefined}
                      style={{ transition: 'fill 150ms, stroke 150ms, stroke-width 150ms' }}
                    />
                  ))}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected region chips */}
        {regions.filter(r => r !== 'other').length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {regions.filter(r => r !== 'other').map(r => {
              const zone = ZONES.find(z => z.id === r);
              return zone ? (
                <span
                  key={r}
                  onClick={() => toggleRegion(r)}
                  style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.16em',
                    color: C.amber, borderBottom: '1px solid #C8943A',
                    paddingBottom: 1, cursor: 'pointer',
                  }}
                >
                  {zone.label}
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Other */}
        <button
          type="button"
          onClick={() => { setOther(prev => !prev); toggleRegion('other'); }}
          style={{
            marginTop: 10,
            background: 'transparent',
            border: 'none',
            padding: 0,
            fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.18em',
            color: other ? C.amber : C.dimmer,
            cursor: 'pointer',
            borderBottom: other ? '1px solid #C8943A' : '1px solid transparent',
          }}
        >
          + OTHER
        </button>

        {/* Hidden checkboxes for form submission */}
        {[...ZONES.map(z => z.id), 'other'].map(id => (
          <input key={id} type="checkbox" name="regions" value={id}
            checked={allRegions.includes(id)} onChange={() => {}}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
        ))}
      </div>

      {/* Notes */}
      <div>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.22em', color: C.midLow, display: 'block', marginBottom: 10 }}>
          CAUSE <span style={{ fontSize: 8, color: C.dimmer }}>— optional</span>
        </span>
        <textarea
          name="notes"
          maxLength={500}
          rows={2}
          placeholder="e.g. pulled hip flexor drilling singles"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(242,239,232,0.08)',
            color: C.text,
            fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.03em', lineHeight: 1.7,
            padding: '12px 14px', width: '100%', resize: 'none', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {state.error && (
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, margin: 0 }}>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          width: '100%', padding: '16px',
          background: pending ? 'rgba(200,148,58,0.4)' : C.amber,
          color: C.bg, border: 'none',
          fontFamily: 'var(--font-anton)', fontSize: 16, letterSpacing: '0.18em',
          cursor: pending ? 'default' : 'pointer', transition: 'background 120ms',
        }}
      >
        {pending ? 'SAVING…' : 'LOG SORENESS'}
      </button>

    </form>
  );
}
