'use client';

import { useState, useTransition } from 'react';
import { deleteSessionAction } from './actions';

const C = {
  brick:   '#8B3A1E',
  brickLow:'rgba(139,58,30,0.25)',
  dimmer:  'rgba(245,240,232,0.35)',
  bg:      '#1A1713',
};

export function DeleteButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 9,
          letterSpacing: '0.12em',
          color: C.dimmer,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        DELETE
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.brick }}>
        DELETE?
      </span>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => deleteSessionAction(id))}
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 9,
          letterSpacing: '0.12em',
          color: C.bg,
          background: C.brick,
          border: 'none',
          padding: '4px 10px',
          cursor: pending ? 'not-allowed' : 'pointer',
        }}
      >
        {pending ? '...' : 'YES'}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 9,
          letterSpacing: '0.12em',
          color: C.dimmer,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        NO
      </button>
    </div>
  );
}
