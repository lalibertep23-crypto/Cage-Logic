'use client';

import { useState, useEffect } from 'react';

const C = {
  bg:      '#1A1713',
  surface: '#252118',
  border:  'rgba(245,240,232,0.13)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.55)',
  dimmer:  'rgba(245,240,232,0.35)',
  amber:   '#D4922E',
};

type CriteriaData = {
  min_classes?: number;
  min_days?: number;
  must_show?: string[];
  coach_signoff?: boolean;
  notes?: string;
};

type Props = {
  fromRank: string;
  toRank: string;
  criteria: CriteriaData;
  gymName: string;
};

export function CriteriaClient({ fromRank, toRank, criteria, gymName }: Props) {
  const storageKey = `cl-criteria-${fromRank}`;
  const items = criteria.must_show ?? [];

  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as boolean[];
        // pad or trim to match current item count
        const result = items.map((_, i) => parsed[i] ?? false);
        setChecked(result);
      } else {
        setChecked(items.map(() => false));
      }
    } catch {
      setChecked(items.map(() => false));
    }
  }, [storageKey, items.length]);

  function toggle(i: number) {
    setChecked((prev) => {
      const next = prev.map((v, idx) => (idx === i ? !v : v));
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  const doneCount = checked.filter(Boolean).length;
  const allDone   = items.length > 0 && doneCount === items.length;

  const toLabel = toRank === 'blue'   ? 'BLUE BELT'
                : toRank === 'purple' ? 'PURPLE BELT'
                : toRank === 'brown'  ? 'BROWN BELT'
                : toRank === 'black'  ? 'BLACK BELT'
                : (() => {
                    const parts = toRank.split('_');
                    return `${(parts[0] ?? '').toUpperCase()} BELT — STRIPE ${parts[1] ?? ''}`;
                  })();

  return (
    <div>

      {/* Target rank */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em', color: C.dimmer, marginBottom: 5 }}>
          TARGET RANK
        </div>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 22, letterSpacing: '0.12em', color: C.amber }}>
          {toLabel}
        </div>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.08em', color: C.dimmer, marginTop: 2 }}>
          {gymName.toUpperCase()} · BJJ
        </div>
      </div>

      {/* Thresholds */}
      {(criteria.min_classes != null || criteria.min_days != null) && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          {criteria.min_classes != null && (
            <div style={{ flex: 1, background: C.surface, padding: '12px 14px 10px', border: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 22, letterSpacing: '0.04em', color: C.text }}>
                {criteria.min_classes}
              </div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.12em', color: C.dimmer, marginTop: 2 }}>
                MIN CLASSES
              </div>
            </div>
          )}
          {criteria.min_days != null && (
            <div style={{ flex: 1, background: C.surface, padding: '12px 14px 10px', border: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 22, letterSpacing: '0.04em', color: C.text }}>
                {criteria.min_days}
              </div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.12em', color: C.dimmer, marginTop: 2 }}>
                MIN DAYS
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress header */}
      {items.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.2em', color: C.dimmer }}>
            WHAT YOU NEED TO SHOW
          </span>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: allDone ? C.amber : C.dimmer }}>
            {doneCount} / {items.length}
          </span>
        </div>
      )}

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item, i) => {
          const done = checked[i] ?? false;
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                background: done ? 'rgba(201,130,42,0.06)' : C.surface,
                border: `1px solid ${done ? 'rgba(201,130,42,0.3)' : C.border}`,
                padding: '13px 14px 11px',
                textAlign: 'left', cursor: 'pointer',
                transition: 'background 100ms',
              }}
            >
              {/* Checkbox */}
              <div style={{
                flexShrink: 0,
                width: 16, height: 16, marginTop: 1,
                border: `1.5px solid ${done ? C.amber : 'rgba(245,240,232,0.3)'}`,
                background: done ? C.amber : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L4 7L9 1" stroke="#1A1713" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: 11,
                letterSpacing: '0.02em',
                lineHeight: 1.65,
                color: done ? C.dim : C.text,
                textDecoration: done ? 'line-through' : 'none',
              }}>
                {item}
              </span>
            </button>
          );
        })}
      </div>

      {/* Coach sign-off notice */}
      {criteria.coach_signoff && (
        <div style={{ marginTop: 16, padding: '12px 14px 10px', border: `1px solid rgba(201,130,42,0.2)`, background: 'rgba(201,130,42,0.03)' }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.amber, marginBottom: 4 }}>
            COACH SIGN-OFF REQUIRED
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.02em', lineHeight: 1.65, color: C.dim, margin: 0 }}>
            Criteria are a guide, not a formula. Final call belongs to your instructor.
          </p>
        </div>
      )}

      {/* Notes */}
      {criteria.notes && (
        <div style={{ marginTop: 14 }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.02em', lineHeight: 1.7, color: C.dimmer, margin: 0, fontStyle: 'italic' }}>
            {criteria.notes}
          </p>
        </div>
      )}

      {/* Done state */}
      {allDone && (
        <div style={{ marginTop: 20, padding: '14px 16px 12px', background: 'rgba(201,130,42,0.08)', border: `1px solid rgba(201,130,42,0.4)` }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.14em', color: C.amber }}>
            READY TO TALK TO YOUR COACH
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.02em', lineHeight: 1.65, color: C.dim, margin: '6px 0 0' }}>
            You have checked everything. The instructor decides timing. Start the conversation.
          </p>
        </div>
      )}

    </div>
  );
}
