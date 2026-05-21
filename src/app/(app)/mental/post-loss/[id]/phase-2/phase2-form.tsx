'use client';

import { useActionState } from 'react';
import { submitPhase2Action, type Phase2State } from './actions';

const C = {
  bg: '#1A1713', surface: '#252118', border:  'rgba(245,240,232,0.13)',
  text: '#F5F0E8', dim: 'rgba(245,240,232,0.55)', dimmer: 'rgba(245,240,232,0.35)',
  amber: '#D4922E', amberLow: 'rgba(201,130,42,0.35)',
  brick: '#8B3A1E',
};

type FieldName = 'whatChanged' | 'patternSeen' | 'whatWasMine' | 'oneThingToDrill';

const FREE_TEXT_QUESTIONS: { name: Exclude<FieldName, 'oneThingToDrill'>; label: string; placeholder: string }[] = [
  { name: 'whatChanged',  label: "WHAT'S DIFFERENT NOW",              placeholder: 'Sleep, food, conversations, body — what shifted.' },
  { name: 'patternSeen',  label: 'THE PATTERN, IF YOU CAN SEE ONE',   placeholder: 'Same problem in past losses? Same emotional shape?' },
  { name: 'whatWasMine',  label: "WHAT WAS YOURS TO OWN. WHAT WASN'T.", placeholder: 'Strip the noise. Land on the part you control.' },
];

const initialState: Phase2State = {};

const flatTextarea: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: '#1A1713', border: `1px solid rgba(245,240,232,0.14)`,
  color: '#F5F0E8', fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em',
  padding: '10px 12px', outline: 'none', resize: 'none' as const,
};
const flatInput: React.CSSProperties = { ...flatTextarea, resize: undefined };

export function Phase2Form({ eventId }: { eventId: string }) {
  const [state, formAction, pending] = useActionState(submitPhase2Action, initialState);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <input type="hidden" name="eventId" value={eventId} />

      {FREE_TEXT_QUESTIONS.map((q, idx) => (
        <div key={q.name}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, color: C.dimmer }}>
              {idx + 1}/{FREE_TEXT_QUESTIONS.length + 1}
            </span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em', color: C.dimmer }}>
              {q.label}
            </span>
          </div>
          <textarea name={q.name} rows={3} maxLength={2000} placeholder={q.placeholder} style={flatTextarea} />
          {state.fieldErrors?.[q.name] && (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
              {state.fieldErrors[q.name]}
            </p>
          )}
        </div>
      ))}

      {/* Drill cue — plaintext */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, color: C.dimmer }}>
            {FREE_TEXT_QUESTIONS.length + 1}/{FREE_TEXT_QUESTIONS.length + 1}
          </span>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em', color: C.dimmer }}>
            ONE THING TO DRILL FROM THIS
          </span>
        </div>
        <input
          name="oneThingToDrill"
          type="text"
          maxLength={200}
          placeholder='e.g., "underhook recovery from half-bottom" — one drillable cue'
          style={flatInput}
        />
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: '6px 0 0' }}>
          STAYS PLAINTEXT ON PURPOSE — A COACHING CUE MEANT TO SURFACE LATER, NOT A JOURNAL ENTRY.
        </p>
        {state.fieldErrors?.oneThingToDrill && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.oneThingToDrill}
          </p>
        )}
      </div>

      <div style={{ background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '12px 12px' }}>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
          FIRST THREE ANSWERS ENCRYPTED. SYSTEM ONLY TRACKS THAT YOU WROTE — NOT THE WORDS. DRILL CUE STAYS PLAINTEXT.
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
          background: !pending ? C.amber : 'transparent',
          border: `1px solid ${!pending ? C.amber : C.border}`,
          color: !pending ? C.bg : C.dimmer,
          fontFamily: 'var(--font-anton)', fontSize: 16, letterSpacing: '0.1em',
          cursor: !pending ? 'pointer' : 'default',
        }}
      >
        {pending ? 'SAVING…' : 'SUBMIT'}
      </button>
    </form>
  );
}
