'use client';

import { useActionState } from 'react';
import { submitPhase1Action, type Phase1State } from './actions';

const C = {
  bg: '#050505', surface: '#111111', border:  'rgba(242,239,232,0.13)',
  text: '#F2EFE8', dim: 'rgba(242,239,232,0.55)', dimmer: 'rgba(242,239,232,0.35)',
  brick: '#8B3A1E', brickLow: 'rgba(139,58,30,0.35)',
};

type FieldName = 'event' | 'body' | 'head' | 'wins' | 'next24';

const QUESTIONS: { name: FieldName; label: string; placeholder: string }[] = [
  { name: 'event',  label: 'WHAT HAPPENED',                      placeholder: 'Plain facts. The matchup, the moment, the way it went.' },
  { name: 'body',   label: 'BODY — WHAT DOES IT FEEL LIKE NOW',  placeholder: 'Chest tight, legs heavy, jaw clenched — first read.' },
  { name: 'head',   label: 'HEAD — THE LOUDEST THOUGHT NOW',     placeholder: 'No filter. Whatever is loudest.' },
  { name: 'wins',   label: 'WHAT YOU DID WELL, OR WHAT THIS TEACHES', placeholder: 'One thing. Not a pep talk — a real observation.' },
  { name: 'next24', label: 'WHAT YOU NEED IN THE NEXT 24 HOURS', placeholder: 'Sleep, food, a conversation, a walk, a drill session.' },
];

const initialState: Phase1State = {};

const flatTextarea: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: '#050505', border: `1px solid rgba(242,239,232,0.14)`,
  color: '#F2EFE8', fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em',
  padding: '10px 12px', outline: 'none', resize: 'none' as const,
};

export function Phase1Form({ eventId }: { eventId: string }) {
  const [state, formAction, pending] = useActionState(submitPhase1Action, initialState);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <input type="hidden" name="eventId" value={eventId} />

      {QUESTIONS.map((q, idx) => (
        <div key={q.name}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, color: C.dimmer }}>
              {idx + 1}/{QUESTIONS.length}
            </span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em', color: C.dimmer }}>
              {q.label}
            </span>
          </div>
          <textarea
            name={q.name}
            rows={3}
            maxLength={2000}
            placeholder={q.placeholder}
            style={flatTextarea}
          />
          {state.fieldErrors?.[q.name] && (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
              {state.fieldErrors[q.name]}
            </p>
          )}
        </div>
      ))}

      <div style={{ background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '12px 12px' }}>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
          ANSWERS ENCRYPTED BEFORE STORAGE. SYSTEM ONLY TRACKS THAT YOU WROTE AND HOW MUCH — NOT THE WORDS.
        </p>
      </div>

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
