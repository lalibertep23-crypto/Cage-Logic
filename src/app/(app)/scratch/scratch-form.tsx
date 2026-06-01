'use client';

import { useActionState, useEffect, useRef } from 'react';
import { saveScratchPadAction, clearScratchPadAction, type ScratchState } from './actions';

const C = {
  bg:      '#050505',
  surface: '#0D0D0D',
  border:  'rgba(242,239,232,0.10)',
  text:    '#F2EFE8',
  dim:     'rgba(242,239,232,0.45)',
  dimmer:  'rgba(242,239,232,0.22)',
  amber:   '#C8943A',
  amberLow:'rgba(200,148,58,0.30)',
  brick:   '#A43A2F',
  green:   '#5C8A3C',
};

const initial: ScratchState = {};

export function ScratchForm({
  existing,
  updatedAt,
}: {
  existing: string;
  updatedAt: string | null;
}) {
  const [state, formAction, pending] = useActionState(saveScratchPadAction, initial);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  function handleInput() {
    const el = textRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

      {/* Status line */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 22px 8px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 9,
          letterSpacing: '0.14em',
          color: state.ok ? C.green : updatedAt ? C.dimmer : 'transparent',
        }}>
          {state.ok ? 'SAVED' : updatedAt ? `LAST SAVED ${updatedAt}` : '·'}
        </span>
        {existing && (
          <form action={clearScratchPadAction}>
            <button type="submit" style={{
              background: 'none', border: 'none', padding: 0,
              fontFamily: 'var(--font-dm-mono)', fontSize: 9,
              letterSpacing: '0.14em', color: C.brick, cursor: 'pointer',
            }}>
              CLEAR
            </button>
          </form>
        )}
      </div>

      {/* Main form */}
      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '18px 22px' }}>
        <textarea
          ref={textRef}
          name="content"
          defaultValue={existing}
          onInput={handleInput}
          placeholder={
            'Dump it here. Partner names, positions, what broke down, what clicked.\n\nReference this when you log.'
          }
          style={{
            flex: 1,
            minHeight: 320,
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: C.text,
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 15,
            letterSpacing: '0.03em',
            lineHeight: 1.75,
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            caretColor: C.amber,
          }}
          autoFocus
        />

        {state.error && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, marginTop: 8 }}>
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          style={{
            marginTop: 20,
            width: '100%',
            padding: '15px',
            background: pending ? C.amberLow : C.amber,
            color: C.bg,
            border: 'none',
            fontFamily: 'var(--font-bebas)',
            fontSize: 16,
            letterSpacing: '0.22em',
            cursor: pending ? 'default' : 'pointer',
            transition: 'background 120ms',
          }}
        >
          {pending ? 'SAVING…' : 'SAVE'}
        </button>
      </form>
    </div>
  );
}
