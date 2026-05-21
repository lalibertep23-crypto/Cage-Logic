'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { submitBrsAction, type BrsState } from './actions';

const C = {
  bg: '#1A1713', surface: '#252118', border:  'rgba(245,240,232,0.13)',
  text: '#F5F0E8', dim: 'rgba(245,240,232,0.55)', dimmer: 'rgba(245,240,232,0.22)',
  amber: '#D4922E', brick: '#8B3A1E',
};

type ItemName = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6';

const ITEMS: { name: ItemName; text: string }[] = [
  { name: 'q1', text: 'I tend to bounce back quickly after hard times.' },
  { name: 'q2', text: 'I have a hard time making it through stressful events.' },
  { name: 'q3', text: 'It does not take me long to recover from a stressful event.' },
  { name: 'q4', text: 'It is hard for me to snap back when something bad happens.' },
  { name: 'q5', text: 'I usually come through difficult times with little trouble.' },
  { name: 'q6', text: 'I tend to take a long time to get over set-backs in my life.' },
];

const OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'STRONGLY DISAGREE' },
  { value: '2', label: 'DISAGREE' },
  { value: '3', label: 'NEUTRAL' },
  { value: '4', label: 'AGREE' },
  { value: '5', label: 'STRONGLY AGREE' },
];

const initialState: BrsState = {};

type Answers = Partial<Record<ItemName, string>>;

export function BrsForm() {
  const [state, formAction, pending] = useActionState(submitBrsAction, initialState);
  const [answers, setAnswers] = useState<Answers>({});

  const allAnswered = ITEMS.every((item) => answers[item.name] != null);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hidden inputs for server action */}
      {ITEMS.map((item) =>
        answers[item.name] != null ? (
          <input key={item.name} type="hidden" name={item.name} value={answers[item.name]} />
        ) : null
      )}

      {ITEMS.map((item, idx) => (
        <div key={item.name} style={{ background: C.surface, padding: '14px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, color: C.dimmer }}>
              {idx + 1}/{ITEMS.length}
            </span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>
              {item.text}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {OPTIONS.map((opt) => {
              const selected = answers[item.name] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [item.name]: opt.value }))}
                  style={{
                    width: '100%', padding: '9px 12px', textAlign: 'left',
                    background: selected ? C.amber : 'transparent',
                    border: `1px solid ${selected ? C.amber : C.border}`,
                    color: selected ? C.bg : C.dim,
                    fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
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
        disabled={pending || !allAnswered}
        style={{
          width: '100%', padding: '12px 0 10px',
          background: (!pending && allAnswered) ? C.amber : 'transparent',
          border: `1px solid ${(!pending && allAnswered) ? C.amber : C.border}`,
          color: (!pending && allAnswered) ? C.bg : C.dimmer,
          fontFamily: 'var(--font-anton)', fontSize: 16, letterSpacing: '0.1em',
          cursor: (!pending && allAnswered) ? 'pointer' : 'default',
        }}
      >
        {pending ? 'SAVING…' : 'SUBMIT'}
      </button>
    </form>
  );
}
