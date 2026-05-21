'use client';

import { useActionState, useState } from 'react';
import { addMatchAction, type MatchState } from './actions';

const C = {
  bg:      '#1A1713',
  surface: '#252118',
  border:  'rgba(245,240,232,0.13)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.55)',
  dimmer:  'rgba(245,240,232,0.22)',
  amber:   '#D4922E',
  amberLow:'rgba(201,130,42,0.35)',
  green:   '#3D8B55',
  brick:   '#8B3A1E',
};

const RESULT_OPTIONS = [
  { value: 'win',        label: 'WIN',        accent: C.green },
  { value: 'loss',       label: 'LOSS',       accent: C.brick },
  { value: 'draw',       label: 'DRAW',       accent: C.amber },
  { value: 'dq',         label: 'DQ',         accent: C.amber },
  { value: 'no_contest', label: 'NO CONTEST', accent: C.dim },
];

const METHOD_OPTIONS = [
  { value: '',           label: '— OPTIONAL —' },
  { value: 'submission', label: 'SUBMISSION' },
  { value: 'points',     label: 'POINTS' },
  { value: 'advantage',  label: 'ADVANTAGE' },
  { value: 'decision',   label: 'DECISION' },
  { value: 'ko_tko',     label: 'KO / TKO' },
  { value: 'dq',         label: 'DQ' },
  { value: 'time',       label: 'TIME' },
  { value: 'other',      label: 'OTHER' },
];

const initialState: MatchState = {};

const flatInput: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: '#1A1713',
  border: `1px solid rgba(245,240,232,0.14)`,
  color: '#F5F0E8',
  fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em',
  padding: '10px 12px',
  outline: 'none',
};

export function MatchForm({ competitionId }: { competitionId: string }) {
  const [state, formAction, pending] = useActionState(addMatchAction, initialState);
  const [result, setResult] = useState<string | null>(null);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <input type="hidden" name="competitionId" value={competitionId} />

      {/* Round */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
          ROUND (OPTIONAL)
        </div>
        <input
          name="roundLabel"
          type="text"
          maxLength={40}
          placeholder="R1, Semi, Final"
          style={flatInput}
        />
        {state.fieldErrors?.roundLabel && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.roundLabel}
          </p>
        )}
      </div>

      {/* Opponent */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
          OPPONENT (OPTIONAL)
        </div>
        <input
          name="opponentLabel"
          type="text"
          maxLength={120}
          placeholder="Name, gym, or just a tag"
          style={flatInput}
        />
        {state.fieldErrors?.opponentLabel && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.opponentLabel}
          </p>
        )}
      </div>

      {/* Result */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 8 }}>
          RESULT
        </div>
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {RESULT_OPTIONS.map((opt) => {
            const selected = result === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setResult(opt.value)}
                style={{
                  padding: '8px 12px 6px',
                  background: selected ? opt.accent : 'transparent',
                  border: `1px solid ${selected ? opt.accent : C.border}`,
                  color: selected ? C.text : C.dimmer,
                  fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.12em',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {result && (
          <input type="hidden" name="result" value={result} />
        )}
        {state.fieldErrors?.result && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.result}
          </p>
        )}
      </div>

      {/* Method */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
          METHOD (OPTIONAL)
        </div>
        <select
          name="method"
          defaultValue=""
          style={{ ...flatInput, appearance: 'none' as const }}
        >
          {METHOD_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
          DURATION (OPTIONAL)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            name="durationMin"
            type="number"
            min={0}
            max={120}
            placeholder="min"
            style={{ ...flatInput, width: 72, textAlign: 'center' }}
          />
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.dimmer }}>MIN</span>
          <input
            name="durationSec"
            type="number"
            min={0}
            max={59}
            placeholder="sec"
            style={{ ...flatInput, width: 72, textAlign: 'center' }}
          />
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.dimmer }}>SEC</span>
        </div>
        {(state.fieldErrors?.durationMin || state.fieldErrors?.durationSec) && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.durationMin ?? state.fieldErrors.durationSec}
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
          NOTES (OPTIONAL)
        </div>
        <textarea
          name="notes"
          rows={3}
          maxLength={1000}
          placeholder="What happened. What worked, what didn't."
          style={{ ...flatInput, resize: 'none' as const }}
        />
        {state.fieldErrors?.notes && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.notes}
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
        disabled={pending || !result}
        style={{
          width: '100%', padding: '12px 0 10px',
          background: (!pending && result) ? C.amber : 'transparent',
          border: `1px solid ${(!pending && result) ? C.amber : C.border}`,
          color: (!pending && result) ? C.bg : C.dimmer,
          fontFamily: 'var(--font-anton)', fontSize: 16, letterSpacing: '0.1em',
          cursor: (!pending && result) ? 'pointer' : 'default',
        }}
      >
        {pending ? 'SAVING…' : 'ADD MATCH'}
      </button>
    </form>
  );
}
