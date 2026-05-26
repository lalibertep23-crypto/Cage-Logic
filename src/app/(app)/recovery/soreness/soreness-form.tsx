'use client';

import { useActionState, useState } from 'react';
import { logSorenessAction, type SorenessState } from './actions';

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:      '#1A1713',
  bgSunk:  '#13110E',
  surface: '#252118',
  border:  'rgba(245,240,232,0.13)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.55)',
  dimmer:  'rgba(245,240,232,0.35)',
  amber:   '#D4922E',
  amberLow:'rgba(201,130,42,0.35)',
  green:   '#3D8B55',
  brick:   '#8B3A1E',
  midLow:  '#B8B2A8',
};

function sorenessColor(n: number): string {
  if (n <= 3) return C.green;
  if (n <= 6) return C.amber;
  return C.brick;
}

function energyColor(n: number): string {
  if (n >= 7) return C.green;
  if (n >= 4) return C.amber;
  return C.brick;
}

const REGION_OPTIONS = [
  { value: 'head',       label: 'HEAD' },
  { value: 'neck',       label: 'NECK' },
  { value: 'shoulder',   label: 'SHOULDER' },
  { value: 'elbow',      label: 'ELBOW' },
  { value: 'wrist_hand', label: 'WRIST / HAND' },
  { value: 'ribs',       label: 'RIBS' },
  { value: 'upper_back', label: 'UPPER BACK' },
  { value: 'low_back',   label: 'LOWER BACK' },
  { value: 'hip_groin',  label: 'HIP / GROIN' },
  { value: 'knee',       label: 'KNEE' },
  { value: 'ankle_foot', label: 'ANKLE / FOOT' },
  { value: 'other',      label: 'OTHER' },
];

const initialState: SorenessState = {};

type Defaults = { overall: number | null; energy: number | null; regions: string[] };

export function SorenessForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction, pending] = useActionState(logSorenessAction, initialState);
  const [overall, setOverall] = useState<number | null>(defaults.overall);
  const [energy, setEnergy] = useState<number | null>(defaults.energy);
  const [regions, setRegions] = useState<string[]>(defaults.regions);

  function toggleRegion(v: string) {
    setRegions((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);
  }

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Overall scale ─────────────────────────────────────────────── */}
      <div>
        <span style={{
          fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.22em',
          color: C.midLow, display: 'block', marginBottom: 10,
        }}>
          OVERALL SORENESS
        </span>
        <div style={{ display: 'flex', background: C.bgSunk, gap: 1 }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
            const isSelected = overall === n;
            const color = sorenessColor(n === 0 ? 0 : n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => setOverall(n)}
                style={{
                  flex: 1,
                  height: 44,
                  background: isSelected ? color : 'transparent',
                  color: isSelected ? C.bg : C.midLow,
                  border: 'none',
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: 10,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'background 80ms',
                }}
              >
                {n}
              </button>
            );
          })}
        </div>

        {/* Hidden radio */}
        {[0,1,2,3,4,5,6,7,8,9,10].map((n) => (
          <input
            key={n}
            type="radio"
            name="overall"
            value={n}
            checked={overall === n}
            required={n === 0}
            onChange={() => {}}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
          />
        ))}

        {state.fieldErrors?.overall && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, marginTop: 6 }}>
            {state.fieldErrors.overall}
          </p>
        )}
      </div>

      {/* ── Energy scale ─────────────────────────────────────────────── */}
      <div>
        <span style={{
          fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.22em',
          color: C.midLow, display: 'block', marginBottom: 4,
        }}>
          ENERGY LEVEL
        </span>
        <span style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em',
          color: C.dimmer, display: 'block', marginBottom: 10,
        }}>
          — how you felt today, separate from pain
        </span>
        <div style={{ display: 'flex', background: C.bgSunk, gap: 1 }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
            const isSelected = energy === n;
            const color = energyColor(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => setEnergy(n)}
                style={{
                  flex: 1,
                  height: 44,
                  background: isSelected ? color : 'transparent',
                  color: isSelected ? C.bg : C.midLow,
                  border: 'none',
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: 10,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'background 80ms',
                }}
              >
                {n}
              </button>
            );
          })}
        </div>

        {/* Hidden radio */}
        {[0,1,2,3,4,5,6,7,8,9,10].map((n) => (
          <input
            key={n}
            type="radio"
            name="energy"
            value={n}
            checked={energy === n}
            onChange={() => {}}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
          />
        ))}
      </div>

      {/* ── Regions ──────────────────────────────────────────────────── */}
      <div>
        <span style={{
          fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.22em',
          color: C.midLow, display: 'block', marginBottom: 10,
        }}>
          WHERE <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>— any that apply</span>
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {REGION_OPTIONS.map((r) => {
            const isChecked = regions.includes(r.value);
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => toggleRegion(r.value)}
                style={{
                  background: isChecked ? C.amberLow : C.surface,
                  border: `1px solid ${isChecked ? C.amber : C.border}`,
                  color: isChecked ? C.amber : C.dim,
                  padding: '11px 14px',
                  fontFamily: 'var(--font-bebas)',
                  fontSize: 12,
                  letterSpacing: '0.14em',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 100ms, color 100ms, border-color 100ms',
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Hidden checkboxes */}
        {REGION_OPTIONS.map((r) => (
          <input
            key={r.value}
            type="checkbox"
            name="regions"
            value={r.value}
            checked={regions.includes(r.value)}
            onChange={() => {}}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
          />
        ))}
      </div>

      {/* ── Notes (optional) ─────────────────────────────────────────── */}
      <div>
        <span style={{
          fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.22em',
          color: C.midLow, display: 'block', marginBottom: 10,
        }}>
          CAUSE <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>— optional</span>
        </span>
        <textarea
          name="notes"
          maxLength={500}
          rows={2}
          placeholder="e.g. pulled hip flexor drilling singles"
          style={{
            background: C.bgSunk,
            border: 'none',
            color: '#F5F0E8',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 11,
            letterSpacing: '0.03em',
            lineHeight: 1.7,
            padding: '12px 14px',
            width: '100%',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {state.fieldErrors?.overall && (
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick }}>
          {state.fieldErrors.overall}
        </p>
      )}

      {state.error && (
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick }}>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          width: '100%',
          padding: '15px',
          background: pending ? 'rgba(201,130,42,0.4)' : '#D4922E',
          color: '#1A1713',
          border: 'none',
          fontFamily: 'var(--font-bebas)',
          fontSize: 16,
          letterSpacing: '0.22em',
          cursor: pending ? 'default' : 'pointer',
          transition: 'background 120ms',
        }}
      >
        {pending ? 'SAVING…' : 'LOG SORENESS'}
      </button>

    </form>
  );
}
