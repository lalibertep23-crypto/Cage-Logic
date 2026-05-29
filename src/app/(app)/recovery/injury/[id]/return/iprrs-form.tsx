'use client';

import { useActionState } from 'react';
import { submitIPrrsAction, type IPrrsState } from './actions';

const C = {
  bg: '#050505', surface: '#111111', border:  'rgba(242,239,232,0.13)',
  text: '#F2EFE8', dim: 'rgba(242,239,232,0.55)', dimmer: 'rgba(242,239,232,0.35)',
  brick: '#8B3A1E', brickLow: 'rgba(139,58,30,0.35)',
};

type ItemName = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6';

const ITEMS: { name: ItemName; text: string }[] = [
  { name: 'q1', text: 'My confidence to train fully right now is…' },
  { name: 'q2', text: 'My confidence to train without pain is…' },
  { name: 'q3', text: 'My confidence to give 100% effort is…' },
  { name: 'q4', text: 'My confidence to not think about the injury during rolling is…' },
  { name: 'q5', text: 'My confidence in the injured area to handle hard rolling is…' },
  { name: 'q6', text: 'My confidence in my skill level and ability right now is…' },
];

const OPTIONS = [
  { value: '0',   label: '0 — NO CONFIDENCE' },
  { value: '10',  label: '10' },
  { value: '20',  label: '20' },
  { value: '30',  label: '30' },
  { value: '40',  label: '40' },
  { value: '50',  label: '50 — MODERATE' },
  { value: '60',  label: '60' },
  { value: '70',  label: '70' },
  { value: '80',  label: '80' },
  { value: '90',  label: '90' },
  { value: '100', label: '100 — UTMOST CONFIDENCE' },
];

const initialState: IPrrsState = {};

const flatSelect: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: C.bg, border: `1px solid rgba(242,239,232,0.14)`,
  color: C.text, fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em',
  padding: '10px 12px', outline: 'none', appearance: 'none' as const,
};

export function IPrrsForm({ injuryId }: { injuryId: string }) {
  const [state, formAction, pending] = useActionState(submitIPrrsAction, initialState);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <input type="hidden" name="injuryId" value={injuryId} />

      {ITEMS.map((item, idx) => (
        <div key={item.name} style={{ background: C.surface, borderLeft: `2px solid ${C.brickLow}`, padding: '12px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, color: C.dimmer }}>
              {idx + 1}/{ITEMS.length}
            </span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>
              {item.text}
            </span>
          </div>
          <select name={item.name} required style={flatSelect}>
            <option value="">PICK A VALUE</option>
            {OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {state.fieldErrors?.[item.name] && (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
              {state.fieldErrors[item.name]}
            </p>
          )}
        </div>
      ))}

      {state.error && (
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick }} role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          width: '100%', padding: '12px 0 10px',
          background: !pending ? C.brick : 'transparent',
          border: `1px solid ${!pending ? C.brick : C.border}`,
          color: !pending ? C.text : C.dimmer,
          fontFamily: 'var(--font-anton)', fontSize: 16, letterSpacing: '0.1em',
          cursor: !pending ? 'pointer' : 'default',
        }}
      >
        {pending ? 'SAVING…' : 'SUBMIT'}
      </button>
    </form>
  );
}
