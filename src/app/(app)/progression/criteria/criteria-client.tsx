'use client';

// Criteria client — checklist toggle, phase/objective/tip display.
// Design-token spec. Circles not squares. Chevrons not arrows.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { C as DT, fonts } from '@/lib/design-tokens';

type Props = {
  fromRank: string;
  accentColor: string;
  phase: string;
  phaseDesc: string;
  objective: string;
  objectiveNote: string;
  requirements: string[];
  coachTip: string;
};

export function CriteriaClient({
  fromRank,
  accentColor,
  phase,
  phaseDesc,
  objective,
  objectiveNote,
  requirements,
  coachTip,
}: Props) {
  const storageKey = `cl-criteria-${fromRank}`;
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as boolean[];
        setChecked(requirements.map((_, i) => parsed[i] ?? false));
      } else {
        setChecked(requirements.map(() => false));
      }
    } catch {
      setChecked(requirements.map(() => false));
    }
  }, [storageKey, requirements.length]);

  function toggle(i: number) {
    setChecked((prev) => {
      const next = prev.map((v, idx) => (idx === i ? !v : v));
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  const doneCount = checked.filter(Boolean).length;
  const allDone = requirements.length > 0 && doneCount === requirements.length;

  return (
    <div>

      {/* CURRENT PHASE */}
      <div style={{
        padding: '18px 16px 16px',
        borderBottom: '1px solid rgba(200,148,58,0.08)',
      }}>
        <div style={{
          fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em',
          color: accentColor, marginBottom: 10, opacity: 0.70,
        }}>CURRENT PHASE</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {/* Shield icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke={accentColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
               style={{ flexShrink: 0, marginTop: 3, opacity: 0.80 }}>
            <path d="M12 2L4 6v6c0 5.25 3.5 10.14 8 11.5C16.5 22.14 20 17.25 20 12V6L12 2z"/>
          </svg>
          <div>
            <div style={{
              fontFamily: fonts.header, fontSize: 18, letterSpacing: '0.06em',
              color: DT.text, lineHeight: 1.1, marginBottom: 6,
            }}>{phase}</div>
            <div style={{
              fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.05em',
              color: 'rgba(242,239,232,0.48)', lineHeight: 1.75,
            }}>{phaseDesc}</div>
          </div>
        </div>
      </div>

      {/* TODAY'S OBJECTIVE */}
      <div style={{
        padding: '16px 16px 14px',
        borderBottom: '1px solid rgba(200,148,58,0.08)',
      }}>
        <div style={{
          fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em',
          color: accentColor, marginBottom: 10, opacity: 0.70,
        }}>TODAY&apos;S OBJECTIVE</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {/* Target / reticle icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke={accentColor} strokeWidth="1.4" strokeLinecap="round"
               style={{ flexShrink: 0, marginTop: 3, opacity: 0.80 }}>
            <circle cx="12" cy="12" r="9"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="12" cy="12" r="1.2" fill={accentColor} stroke="none"/>
          </svg>
          <div>
            <div style={{
              fontFamily: fonts.label, fontSize: 16, letterSpacing: '0.10em',
              color: DT.text, marginBottom: 4,
            }}>{objective}</div>
            <div style={{
              fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.05em',
              color: 'rgba(242,239,232,0.42)',
            }}>{objectiveNote}</div>
          </div>
        </div>
      </div>

      {/* STRIPE'S REQUIREMENTS */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10,
        }}>
          <div style={{
            fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em',
            color: accentColor, opacity: 0.70,
          }}>STRIPE&apos;S REQUIREMENTS</div>
          <div style={{
            fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.10em',
            color: allDone ? accentColor : 'rgba(242,239,232,0.38)',
          }}>{doneCount}/{requirements.length} COMPLETE</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {requirements.map((item, i) => {
            const done = checked[i] ?? false;
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 14px',
                  background: done ? 'rgba(200,148,58,0.06)' : 'rgba(14,12,10,0.70)',
                  border: `1px solid ${done ? 'rgba(200,148,58,0.22)' : 'rgba(242,239,232,0.08)'}`,
                  textAlign: 'left', cursor: 'pointer', width: '100%',
                }}
              >
                {/* Circle indicator */}
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${done ? accentColor : 'rgba(242,239,232,0.28)'}`,
                  background: done ? accentColor : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {done && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L4 7L9 1" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                {/* Item label */}
                <span style={{
                  flex: 1,
                  fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.04em',
                  color: done ? 'rgba(242,239,232,0.40)' : DT.text,
                  textDecoration: done ? 'line-through' : 'none',
                }}>{item}</span>
                {/* Chevron */}
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M2 1l3 3-3 3"
                    stroke={done ? 'rgba(200,148,58,0.35)' : 'rgba(242,239,232,0.22)'}
                    strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </button>
            );
          })}
        </div>

        {/* All-done state */}
        {allDone && (
          <div style={{
            marginTop: 12, padding: '13px 16px 11px',
            background: 'rgba(200,148,58,0.08)',
            border: '1px solid rgba(200,148,58,0.35)',
            borderLeft: `3px solid ${accentColor}`,
          }}>
            <div style={{
              fontFamily: fonts.label, fontSize: 15, letterSpacing: '0.14em', color: accentColor,
            }}>READY TO TALK TO YOUR COACH</div>
            <div style={{
              fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.04em',
              lineHeight: 1.7, color: 'rgba(242,239,232,0.55)', marginTop: 5,
            }}>You checked everything. Final call belongs to your instructor.</div>
          </div>
        )}
      </div>

      {/* COACH TIP */}
      <div style={{
        margin: '14px 16px 0',
        padding: '14px 16px',
        background: 'rgba(14,12,10,0.60)',
        border: '1px solid rgba(242,239,232,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          {/* Lightbulb icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="rgba(200,148,58,0.60)" strokeWidth="1.4" strokeLinecap="round"
               style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M12 2a7 7 0 017 7c0 2.8-1.6 5.3-4 6.5V18H9v-2.5C6.6 14.3 5 11.8 5 9a7 7 0 017-7z"/>
            <path d="M9 21h6M10 18h4"/>
          </svg>
          <div>
            <div style={{
              fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.16em',
              color: 'rgba(200,148,58,0.55)', marginBottom: 6,
            }}>COACH TIP</div>
            <div style={{
              fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.04em',
              lineHeight: 1.75, color: 'rgba(242,239,232,0.50)', fontStyle: 'italic',
            }}>{coachTip}</div>
          </div>
        </div>
      </div>

      {/* VIEW DEMO LIBRARY — full-width amber CTA */}
      <div style={{ padding: '20px 16px 0' }}>
        <Link href="/resources" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            padding: '16px 20px',
            background: '#C8943A',
            textAlign: 'center',
          }}>
            <span style={{
              fontFamily: fonts.label, fontSize: 16, letterSpacing: '0.22em', color: '#050505',
            }}>VIEW DEMO LIBRARY</span>
          </div>
        </Link>
      </div>

    </div>
  );
}
