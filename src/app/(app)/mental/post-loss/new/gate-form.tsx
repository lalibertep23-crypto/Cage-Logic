'use client';

import { useActionState, useState } from 'react';
import { createLossEventAction, type GateState } from './actions';

const C = {
  bg:      '#050505',
  surface: '#111111',
  border:  'rgba(242,239,232,0.13)',
  text:    '#F2EFE8',
  dim:     'rgba(242,239,232,0.55)',
  dimmer:  'rgba(242,239,232,0.35)',
  amber:   '#C8943A',
  brick:   '#8B3A1E',
  brickLow:'rgba(139,58,30,0.35)',
};

const CONTEXT_OPTIONS = [
  { value: 'competition', label: 'COMPETITION' },
  { value: 'rolling',     label: 'ROLLING (GYM)' },
  { value: 'other',       label: 'OTHER' },
];

const FEEL_OPTIONS = [
  { value: 'fine',      label: 'FINE',     sub: 'Acknowledge it. Move on. No log.', accent: C.dim },
  { value: 'stings',    label: 'STINGS',   sub: 'Logged. No structured reflection.', accent: C.amber },
  { value: 'tough_one', label: 'TOUGH ONE', sub: 'Logged. Structured reflection opens next.', accent: C.brick },
];

const initialState: GateState = {};

const flatInput: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: '#050505',
  border: `1px solid rgba(242,239,232,0.14)`,
  color: '#F2EFE8',
  fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em',
  padding: '10px 12px',
  outline: 'none',
};

export function GateForm() {
  const [state, formAction, pending] = useActionState(createLossEventAction, initialState);
  const [feel, setFeel] = useState<string | null>(null);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Context */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
          WHERE DID IT HAPPEN
        </div>
        <select name="context" required style={{ ...flatInput, appearance: 'none' as const }}>
          <option value="">— PICK ONE —</option>
          {CONTEXT_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {state.fieldErrors?.context && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.context}
          </p>
        )}
      </div>

      {/* How are you feeling */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 8 }}>
          HOW ARE YOU FEELING ABOUT IT
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {FEEL_OPTIONS.map((opt) => {
            const selected = feel === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFeel(opt.value)}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 4,
                  padding: '12px 14px',
                  background: selected ? C.surface : 'transparent',
                  border: `1px solid ${selected ? opt.accent : C.border}`,
                  borderLeft: `3px solid ${selected ? opt.accent : C.border}`,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.12em', color: selected ? opt.accent : C.dim }}>
                  {opt.label}
                </span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.5, color: C.dimmer }}>
                  {opt.sub}
                </span>
              </button>
            );
          })}
        </div>
        {feel && <input type="hidden" name="feel" value={feel} />}
        {state.fieldErrors?.feel && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.feel}
          </p>
        )}
      </div>

      {state.error && (
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick }} role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !feel}
        style={{
          width: '100%', padding: '12px 0 10px',
          background: (!pending && feel) ? C.brick : 'transparent',
          border: `1px solid ${(!pending && feel) ? C.brick : C.border}`,
          color: (!pending && feel) ? C.text : C.dimmer,
          fontFamily: 'var(--font-anton)', fontSize: 16, letterSpacing: '0.1em',
          cursor: (!pending && feel) ? 'pointer' : 'default',
        }}
      >
        {pending ? 'SAVING…' : 'CONTINUE'}
      </button>
    </form>
  );
}
