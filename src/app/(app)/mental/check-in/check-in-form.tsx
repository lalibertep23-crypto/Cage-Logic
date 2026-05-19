'use client';

import { useActionState, useState } from 'react';
import { submitCheckInAction, type CheckInState } from './actions';

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:      '#1A1713',
  bgSunk:  '#13110E',
  border:  'rgba(245,240,232,0.08)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.38)',
  dimmer:  'rgba(245,240,232,0.22)',
  amber:   '#D4922E',
  amberLow:'rgba(201,130,42,0.35)',
  brick:   '#8B3A1E',
};

const OPTIONS = [
  { value: '1', label: 'BAD' },
  { value: '2', label: 'LOW' },
  { value: '3', label: 'STEADY' },
  { value: '4', label: 'GOOD' },
  { value: '5', label: 'SHARP' },
];

const initialState: CheckInState = {};

export function CheckInForm() {
  const [state, formAction, pending] = useActionState(submitCheckInAction, initialState);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ display: 'flex', background: C.bgSunk, gap: 1 }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSelected(opt.value)}
            style={{
              flex: 1,
              padding: '20px 4px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              background: selected === opt.value ? C.amber : 'transparent',
              color: selected === opt.value ? C.bg : C.dimmer,
              border: 'none',
              cursor: 'pointer',
              transition: 'background 100ms, color 100ms',
            }}
          >
            <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.04em', lineHeight: 1 }}>
              {opt.value}
            </span>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 10, letterSpacing: '0.16em' }}>
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      {/* Hidden radio inputs — one per option, checked if selected */}
      {OPTIONS.map((opt) => (
        <input
          key={opt.value}
          type="radio"
          name="mood"
          value={opt.value}
          checked={selected === opt.value}
          required={opt.value === OPTIONS[0].value}
          onChange={() => {}}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
      ))}

      {state.fieldErrors?.mood && (
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick }}>
          {state.fieldErrors.mood}
        </p>
      )}

      {state.error && (
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick }}>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !selected}
        style={{
          width: '100%',
          background: selected && !pending ? C.amber : C.amberLow,
          color: C.bg,
          border: 'none',
          padding: '18px 24px',
          fontFamily: 'var(--font-anton)',
          fontSize: 20,
          letterSpacing: '0.08em',
          cursor: selected && !pending ? 'pointer' : 'not-allowed',
          transition: 'background 120ms',
        }}
      >
        {pending ? 'SAVING...' : 'LOG IT →'}
      </button>
    </form>
  );
}
