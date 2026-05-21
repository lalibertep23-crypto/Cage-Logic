'use client';

import { useActionState } from 'react';
import { createCompetitionAction, type CompetitionState } from './actions';

const C = {
  bg: '#1A1713', surface: '#252118', border:  'rgba(245,240,232,0.13)',
  text: '#F5F0E8', dim: 'rgba(245,240,232,0.55)', dimmer: 'rgba(245,240,232,0.35)',
  amber: '#D4922E', brick: '#8B3A1E',
};

const RULE_SET_OPTIONS = [
  { value: '',                 label: 'PICK ONE (OPTIONAL)' },
  { value: 'gi',               label: 'GI' },
  { value: 'no_gi',            label: 'NO-GI' },
  { value: 'submission_only',  label: 'SUBMISSION ONLY' },
  { value: 'mma',              label: 'MMA' },
  { value: 'boxing',           label: 'BOXING' },
  { value: 'muay_thai',        label: 'MUAY THAI' },
  { value: 'other',            label: 'OTHER' },
];

const initialState: CompetitionState = {};

const flatInput: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: C.bg, border: `1px solid rgba(245,240,232,0.14)`,
  color: C.text, fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em',
  padding: '10px 12px', outline: 'none',
};

const flatSelect: React.CSSProperties = {
  ...flatInput, appearance: 'none' as const,
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em',
  color: C.dimmer, marginBottom: 6, display: 'block',
};

export function CompetitionForm({ today }: { today: string }) {
  const [state, formAction, pending] = useActionState(createCompetitionAction, initialState);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      <div>
        <label htmlFor="name" style={labelStyle}>EVENT NAME</label>
        <input
          id="name" name="name" type="text" required maxLength={200}
          placeholder="e.g., NJ Open, Pans, NAGA Atlantic"
          style={flatInput}
        />
        {state.fieldErrors?.name && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="organization" style={labelStyle}>ORGANIZATION (OPTIONAL)</label>
        <input
          id="organization" name="organization" type="text" maxLength={100}
          placeholder="IBJJF, ADCC, NAGA, UFC, local promotion"
          style={flatInput}
        />
        {state.fieldErrors?.organization && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.organization}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="compDate" style={labelStyle}>DATE</label>
        <input
          id="compDate" name="compDate" type="date" required
          defaultValue={today}
          style={flatInput}
        />
        {state.fieldErrors?.compDate && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.compDate}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="weightClass" style={labelStyle}>WEIGHT CLASS (OPTIONAL)</label>
        <input
          id="weightClass" name="weightClass" type="text" maxLength={50}
          placeholder="e.g., Featherweight, -76kg, Open"
          style={flatInput}
        />
        {state.fieldErrors?.weightClass && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.weightClass}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="ruleSet" style={labelStyle}>RULE SET</label>
        <select id="ruleSet" name="ruleSet" defaultValue="" style={flatSelect}>
          {RULE_SET_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        {state.fieldErrors?.ruleSet && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.ruleSet}
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
        {pending ? 'SAVING…' : 'ADD COMPETITION'}
      </button>
    </form>
  );
}
