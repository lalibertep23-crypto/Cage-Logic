'use client';

// ConsentToggle — allows athletes to opt in/out of research data licensing from Settings.
// Honors opt-out immediately on submit. No confirmation dialog — hard rule: one-tap cancel.
// Voice: direct, dry, factual. No pressure language.

import { useState, useTransition } from 'react';
import { updateConsentAction } from './actions';

const C = {
  surface: '#111111',
  border:  'rgba(242,239,232,0.13)',
  text:    '#F2EFE8',
  dim:     'rgba(242,239,232,0.55)',
  dimmer:  'rgba(242,239,232,0.35)',
  amber:   '#C8943A',
};

export function ConsentToggle({ initialConsent }: { initialConsent: boolean }) {
  const [consented, setConsented] = useState(initialConsent);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleToggle(newValue: boolean) {
    setConsented(newValue);
    setSaved(false);
    startTransition(async () => {
      await updateConsentAction(newValue);
      setSaved(true);
    });
  }

  return (
    <div style={{ background: C.surface, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
        Allow Cage Logic to include your anonymized training data in aggregate research datasets. No personal information leaves the platform.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Toggle */}
        <button
          onClick={() => handleToggle(!consented)}
          disabled={isPending}
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            border: 'none',
            background: consented ? C.amber : 'rgba(242,239,232,0.15)',
            cursor: isPending ? 'not-allowed' : 'pointer',
            position: 'relative',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
          aria-label={consented ? 'Opt out of research data sharing' : 'Opt in to research data sharing'}
        >
          <span style={{
            position: 'absolute',
            top: 3,
            left: consented ? 23 : 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#F2EFE8',
            transition: 'left 0.2s',
          }} />
        </button>

        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', color: C.dim }}>
          {isPending ? 'Saving...' : consented ? 'Opted in' : 'Opted out'}
        </span>

        {saved && !isPending && (
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', color: C.dimmer }}>
            Saved.
          </span>
        )}
      </div>

      <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dimmer, margin: 0 }}>
        You own your data. This setting takes effect immediately.
      </p>
    </div>
  );
}
