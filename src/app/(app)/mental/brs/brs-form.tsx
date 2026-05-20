'use client';

import { useActionState, useState } from 'react';
import { submitBrsAction, type BrsState } from './actions';

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
  green:   '#3D8B55',
  greenLow:'rgba(42,92,63,0.4)',
  brick:   '#8B3A1E',
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

const OPTIONS = [
  { value: '1', label: 'STRONGLY DISAGREE' },
  { value: '2', label: 'DISAGREE' },
  { value: '3', label: 'NEUTRAL' },
  { value: '4', label: 'AGREE' },
  { value: '5', label: 'STRONGLY AGREE' },
];

const initialState: BrsState = {};

export function BrsForm() {
  const [state, formAction, pending] = useActionState(submitBrsAction, initialState);
  const [answers, setAnswers] = useState<Partial<Record<ItemName, string>>>({});

  const allAnswered = ITEMS.every((item) => answers[item.name]);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

      {ITEMS.map((item, idx) => (
        <div key={item.name} style={{ background: C.surface, borderLeft: `2px solid ${C.border}`, marginBottom: 2 }}>
          {/* Question header */}
          <div style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
              {String(idx + 1).padStart(2, '0')} / {ITEMS.length}
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: C.text, margin: 0 }}>
              {item.text}
            </p>
          </div>

          {/* Answer options — flat tap segments */}
          <div style={{ display: 'flex', background: C.bgSunk, gap: 1 }}>
            {OPTIONS.map((opt) => {
              const isSelected = answers[item.name] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [item.name]: opt.value }))}
                  style={{
                    flex: 1,
                    padding: '14px 2px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    background: isSelected ? C.green : 'transparent',
                    color: isSelected ? C.bg : C.dimmer,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 100ms, color 100ms',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-anton)', fontSize: 16, letterSpacing: '0.04em', lineHeight: 1 }}>
                    {opt.value}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 7,
                    letterSpacing: '0.12em',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    maxWidth: 36,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {opt.label.replace(' ', '\n')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Hidden radio */}
          {OPTIONS.map((opt) => (
            <input
              key={opt.value}
              type="radio"
              name={item.name}
              value={opt.value}
              checked={answers[item.name] === opt.value}
              required={idx === 0}
              onChange={() => {}}
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
            />
          ))}

          {state.fieldErrors?.[item.name] && (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, padding: '6px 14px' }}>
              {state.fieldErrors[item.name]}
            </p>
          )}
        </div>
      ))}

      {state.error && (
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, marginTop: 8 }}>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !allAnswered}
        style={{
          width: '100%',
          background: allAnswered && !pending ? C.green : C.greenLow,
          color: C.bg,
          border: 'none',
          padding: '18px 24px',
          fontFamily: 'var(--font-anton)',
          fontSize: 20,
          letterSpacing: '0.08em',
          cursor: allAnswered && !pending ? 'pointer' : 'not-allowed',
          transition: 'background 120ms',
          marginTop: 16,
        }}
      >
        {pending ? 'SAVING...' : 'SUBMIT →'}
      </button>
    </form>
  );
}
