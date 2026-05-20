'use client';

import { useActionState, useState } from 'react';
import { reportInjuryAction, type InjuryState } from './actions';

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:      '#1A1713',
  bgSunk:  '#13110E',
  surface: '#252118',
  border:  'rgba(245,240,232,0.5)',
  borderMid:'rgba(245,240,232,0.14)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.38)',
  dimmer:  'rgba(245,240,232,0.22)',
  amber:   '#D4922E',
  amberLow:'rgba(201,130,42,0.35)',
  brick:   '#8B3A1E',
  brickLow:'rgba(139,58,30,0.4)',
  midLow:  '#B8B2A8',
};

const flatInput: React.CSSProperties = {
  background: C.surface,
  border: 'none',
  borderBottom: `1px solid ${C.borderMid}`,
  padding: '10px 12px',
  color: C.text,
  fontFamily: 'var(--font-dm-mono)',
  fontSize: 13,
  letterSpacing: '0.04em',
  outline: 'none',
  width: '100%',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-bebas)',
  fontSize: 13,
  letterSpacing: '0.22em',
  color: C.midLow,
  display: 'block',
  marginBottom: 8,
};

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

const SIDE_OPTIONS = [
  { value: 'left',      label: 'LEFT' },
  { value: 'right',     label: 'RIGHT' },
  { value: 'bilateral', label: 'BOTH' },
  { value: 'axial',     label: 'CENTER' },
  { value: 'na',        label: 'N/A' },
];

const initialState: InjuryState = {};

export function InjuryForm({ today }: { today: string }) {
  const [state, formAction, pending] = useActionState(reportInjuryAction, initialState);
  const [pain, setPain] = useState<number | null>(null);
  const [region, setRegion] = useState('');
  const [side, setSide] = useState('na');

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Body region */}
      <div>
        <span style={labelStyle}>BODY REGION</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {REGION_OPTIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRegion(r.value)}
              style={{
                background: region === r.value ? C.brickLow : C.surface,
                border: `1px solid ${region === r.value ? C.brick : C.border}`,
                color: region === r.value ? C.brick : C.dim,
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
          ))}
        </div>
        <input type="hidden" name="region" value={region} required />
        {state.fieldErrors?.region && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, marginTop: 6 }}>
            {state.fieldErrors.region}
          </p>
        )}
      </div>

      {/* Side */}
      <div>
        <span style={labelStyle}>SIDE</span>
        <div style={{ display: 'flex', background: C.bgSunk, gap: 1 }}>
          {SIDE_OPTIONS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSide(s.value)}
              style={{
                flex: 1,
                padding: '12px 2px',
                background: side === s.value ? C.brick : 'transparent',
                color: side === s.value ? C.bg : C.midLow,
                fontFamily: 'var(--font-bebas)',
                fontSize: 11,
                letterSpacing: '0.12em',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 100ms, color 100ms',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="side" value={side} />
        {state.fieldErrors?.side && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, marginTop: 6 }}>
            {state.fieldErrors.side}
          </p>
        )}
      </div>

      {/* When it happened */}
      <div>
        <span style={labelStyle}>WHEN IT HAPPENED</span>
        <input
          id="occurredOn" name="occurredOn" type="date"
          required defaultValue={today} max={today}
          style={flatInput}
        />
        {state.fieldErrors?.occurredOn && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, marginTop: 6 }}>
            {state.fieldErrors.occurredOn}
          </p>
        )}
      </div>

      {/* Pain scale */}
      <div>
        <span style={labelStyle}>PAIN RIGHT NOW</span>
        <div style={{ display: 'flex', background: C.bgSunk, gap: 1 }}>
          {[0,1,2,3,4,5,6,7,8,9,10].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPain(n)}
              style={{
                flex: 1,
                height: 44,
                background: pain === n ? C.brick : 'transparent',
                color: pain === n ? C.bg : C.midLow,
                border: 'none',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: 10,
                cursor: 'pointer',
                transition: 'background 80ms',
              }}
            >
              {n}
            </button>
          ))}
        </div>
        {[0,1,2,3,4,5,6,7,8,9,10].map((n) => (
          <input
            key={n}
            type="radio"
            name="pain"
            value={n}
            checked={pain === n}
            required={n === 0}
            onChange={() => {}}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
          />
        ))}
        {state.fieldErrors?.pain && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, marginTop: 6 }}>
            {state.fieldErrors.pain}
          </p>
        )}
      </div>

      {/* Mechanism */}
      <div>
        <span style={labelStyle}>HOW IT HAPPENED <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>— OPTIONAL</span></span>
        <input
          id="mechanism" name="mechanism" type="text"
          maxLength={1000}
          placeholder="e.g. caught in a heel hook, jammed elbow on a sprawl"
          style={flatInput}
        />
      </div>

      {/* Notes */}
      <div>
        <span style={labelStyle}>NOTES <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>— ENCRYPTED</span></span>
        <textarea
          id="notes" name="notes"
          rows={3} maxLength={2000}
          placeholder="What you felt. Anything a coach or PT should know."
          style={{ ...flatInput, resize: 'none' }}
        />
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, marginTop: 6 }}>
          AES-256-GCM encrypted before storage. Not shared.
        </p>
      </div>

      {/* Disclaimer */}
      <div style={{ borderLeft: `2px solid ${C.border}`, padding: '10px 12px', background: C.surface }}>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dimmer, margin: 0 }}>
          Not medical advice. Cage Logic does not diagnose. A medical professional and your coach make the final call on training and return.
        </p>
      </div>

      {state.error && (
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick }}>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !region || pain === null}
        style={{
          width: '100%',
          background: region && pain !== null && !pending ? C.brick : C.brickLow,
          color: C.bg,
          border: 'none',
          padding: '18px 24px',
          fontFamily: 'var(--font-anton)',
          fontSize: 20,
          letterSpacing: '0.08em',
          cursor: region && pain !== null && !pending ? 'pointer' : 'not-allowed',
          transition: 'background 120ms',
        }}
      >
        {pending ? 'SAVING...' : 'REPORT →'}
      </button>
    </form>
  );
}
