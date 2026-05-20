'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { logProgressAction, type ProgressState } from './actions';

const C = {
  bg: '#1A1713', surface: '#252118', border: 'rgba(245,240,232,0.5)',
  text: '#F5F0E8', dim: 'rgba(245,240,232,0.38)', dimmer: 'rgba(245,240,232,0.22)',
  brick: '#8B3A1E', brickLow: 'rgba(139,58,30,0.35)',
  amber: '#D4922E', green: '#3D8B55',
};

const initialState: ProgressState = {};

function painColor(n: number): string {
  if (n <= 3) return C.green;
  if (n <= 6) return C.amber;
  return C.brick;
}

function fnColor(n: number): string {
  if (n >= 7) return C.green;
  if (n >= 4) return C.amber;
  return C.brick;
}

const flatTextarea: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: C.bg, border: `1px solid rgba(245,240,232,0.14)`,
  color: C.text, fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em',
  padding: '10px 12px', outline: 'none', resize: 'none' as const,
};

export function ProgressForm({ injuryId }: { injuryId: string }) {
  const [state, formAction, pending] = useActionState(logProgressAction, initialState);
  const [pain, setPain] = useState<number | null>(null);
  const [fn, setFn] = useState<number | null>(null);
  const [didModified, setDidModified] = useState(false);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <input type="hidden" name="injuryId" value={injuryId} />
      {pain !== null && <input type="hidden" name="pain" value={pain} />}
      {fn !== null && <input type="hidden" name="fn" value={fn} />}
      <input type="hidden" name="didModified" value={didModified ? 'on' : ''} />

      {/* Pain */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em', color: C.dimmer, marginBottom: 4 }}>
          PAIN TODAY
        </div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.04em', color: C.dimmer, marginBottom: 10 }}>
          0 = NONE · 10 = WORST IT&apos;S BEEN
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[0,1,2,3,4,5,6,7,8,9,10].map((n) => {
            const selected = pain === n;
            const accent = painColor(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => setPain(n)}
                style={{
                  width: 40, height: 40,
                  background: selected ? accent : 'transparent',
                  border: `1px solid ${selected ? accent : C.border}`,
                  color: selected ? C.bg : C.dim,
                  fontFamily: 'var(--font-anton)', fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
        {state.fieldErrors?.pain && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.pain}
          </p>
        )}
      </div>

      {/* Function */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em', color: C.dimmer, marginBottom: 4 }}>
          FUNCTION TODAY
        </div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.04em', color: C.dimmer, marginBottom: 10 }}>
          0 = CAN&apos;T USE IT AT ALL · 10 = BACK TO NORMAL
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[0,1,2,3,4,5,6,7,8,9,10].map((n) => {
            const selected = fn === n;
            const accent = fnColor(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => setFn(n)}
                style={{
                  width: 40, height: 40,
                  background: selected ? accent : 'transparent',
                  border: `1px solid ${selected ? accent : C.border}`,
                  color: selected ? C.bg : C.dim,
                  fontFamily: 'var(--font-anton)', fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
        {state.fieldErrors?.fn && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick, marginTop: 4 }}>
            {state.fieldErrors.fn}
          </p>
        )}
      </div>

      {/* Modified training toggle */}
      <button
        type="button"
        onClick={() => setDidModified(!didModified)}
        style={{
          width: '100%', padding: '12px 14px', textAlign: 'left',
          background: didModified ? 'rgba(42,92,63,0.18)' : C.surface,
          border: `1px solid ${didModified ? C.green : C.border}`,
          cursor: 'pointer',
        }}
      >
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.1em', color: didModified ? C.green : C.dim }}>
          {didModified ? '✓ ' : ''}DID MODIFIED TRAINING TODAY
        </div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.04em', color: C.dimmer, marginTop: 4 }}>
          DRILLING, CONDITIONING, REHAB — ANYTHING THAT KEPT THE STREAK ALIVE WITHOUT AGGRAVATING THE INJURY.
        </div>
      </button>

      {/* Notes */}
      <div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em', color: C.dimmer, marginBottom: 6 }}>
          NOTES (ENCRYPTED, OPTIONAL)
        </div>
        <textarea
          name="notes"
          rows={3}
          maxLength={2000}
          placeholder="What it felt like. What aggravated it. What helped."
          style={flatTextarea}
        />
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: '6px 0 0' }}>
          AES-256-GCM ENCRYPTED BEFORE STORAGE. NOT SHARED.
        </p>
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
        disabled={pending || pain === null || fn === null}
        style={{
          width: '100%', padding: '12px 0 10px',
          background: (!pending && pain !== null && fn !== null) ? C.brick : 'transparent',
          border: `1px solid ${(!pending && pain !== null && fn !== null) ? C.brick : C.border}`,
          color: (!pending && pain !== null && fn !== null) ? C.text : C.dimmer,
          fontFamily: 'var(--font-anton)', fontSize: 16, letterSpacing: '0.1em',
          cursor: (!pending && pain !== null && fn !== null) ? 'pointer' : 'default',
        }}
      >
        {pending ? 'SAVING…' : 'SAVE PROGRESS LOG'}
      </button>
    </form>
  );
}
