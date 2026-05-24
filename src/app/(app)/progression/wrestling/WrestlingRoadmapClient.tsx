'use client';

// Wrestling Roadmap — client component. Side-tab tier nav + detail panel.
// Tiers: Foundation → Chain Wrestling → Pressure → Scramble → Competitor → Elite.
// Skill lists flagged TBD where Chris has not yet finalized criteria.

import { useState } from 'react';
import Image from 'next/image';
import { BackButton } from '@/components/ui/back-button';
import { C, fonts } from '@/lib/design-tokens';

type Tier = {
  levelKey:  string;
  num:       number;
  label:     string;
  identity:  string;
  badge:     string;
  skills:    string[];
  checklist: string[];
  weeks:     string;
  tbd:       boolean;
};

const TIERS: Tier[] = [
  {
    levelKey: 'level_1', num: 1,
    label: 'FOUNDATION', identity: 'You know where you are.',
    badge: '/foundation-wrestling.png',
    skills: ['Stance & Motion', 'Hand Fighting', 'Single Leg Entry', 'Sprawl Defense', 'Top Pressure'],
    checklist: [
      'Maintains wrestling stance under fatigue',
      'Sound shot mechanics — no knee drop',
      'One full attack chain (entry \u2192 two finishes)',
      'Positional pressure on top',
      'Wins inside position in pummeling',
      '24+ sessions logged',
      'Coach signoff',
    ],
    weeks: 'WEEKS 1–13',
    tbd: false,
  },
  {
    levelKey: 'level_2', num: 2,
    label: 'CHAIN WRESTLING', identity: 'You know what comes next.',
    badge: '/chain-wrestling-wrestling.png',
    skills: ['Attack Chains', 'High-C to Double', 'Reshot Concepts', 'Mat Returns', 'Scramble Entries'],
    checklist: [
      '3+ documented attack chains',
      'Live reshot executed in wrestling',
      'Mat return after missed shot',
      '40+ sessions logged',
      'Coach signoff',
    ],
    weeks: 'TBD — CHRIS',
    tbd: true,
  },
  {
    levelKey: 'level_3', num: 3,
    label: 'PRESSURE', identity: 'You take what you want.',
    badge: '/pressure-badge-wrestling.png',
    skills: ['Riding', 'Breakdowns', 'Hip Control', 'Chest Pressure', 'Top Control Chains'],
    checklist: [
      '50+ live rounds logged',
      '6 documented takedown chains',
      '70%+ mat return rate in live wrestling',
      'Win 5 situational sparring rounds',
      'Coach signoff',
    ],
    weeks: 'TBD — CHRIS',
    tbd: true,
  },
  {
    levelKey: 'level_4', num: 4,
    label: 'SCRAMBLE', identity: 'You win the chaos.',
    badge: '/scramble-badge-wrestling.png',
    skills: ['Recovery', 'Reversal', 'Read & React', 'Scramble to Top', 'Transition Defense'],
    checklist: [
      'Win 3 scramble drills vs. peers',
      'Demonstrate reversal in live rolling',
      'Recover from bad position 5\u00d7 in live wrestling',
      'Coach signoff',
    ],
    weeks: 'TBD — CHRIS',
    tbd: true,
  },
  {
    levelKey: 'level_5', num: 5,
    label: 'COMPETITOR', identity: 'You dictate the match.',
    badge: '/competitor-badge-wrestling.png',
    skills: ['Match Pacing', 'Strategy', 'Fatigue Management', 'Situational Offense', 'Film Review'],
    checklist: [
      'Compete in a sanctioned event',
      'Pre-comp strategy briefing with coach',
      'Demonstrate fatigue management in live rounds',
      'Post-match coach review sign-off',
    ],
    weeks: 'TBD — CHRIS',
    tbd: true,
  },
  {
    levelKey: 'level_6', num: 6,
    label: 'ELITE', identity: "You\'re the problem.",
    badge: '/elite-badge-wrestling.png',
    skills: ['Advanced Chains', 'Counter-wrestling', 'Clinic Execution', 'Teaching Others', 'Match Calling'],
    checklist: [
      'Teach a technique to junior wrestlers',
      'Demonstrate elite chain in film session',
      'Consistent dominance in the room',
      'Coach nomination required',
    ],
    weeks: 'TBD — CHRIS',
    tbd: true,
  },
];

function tierNumFromKey(levelKey: string): number {
  const match = levelKey.match(/level_(\d)/);
  return match ? parseInt(match[1], 10) : 1;
}

const ACCENT = '#8A9BAE';
const GOLD   = '#C8943A';

export default function WrestlingRoadmapClient({ currentTierKey }: { currentTierKey: string }) {
  const currentNum = tierNumFromKey(currentTierKey);
  const [selectedNum, setSelectedNum] = useState(currentNum);
  const selected = TIERS[selectedNum - 1] ?? TIERS[0];

  return (
    <main style={{ minHeight: '100vh', color: C.text, position: 'relative', overflow: 'hidden' }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src="/concrete-dark.jpg" alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,3,2,0.86)' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(138,155,174,0.06) 0%, transparent 70%)',
        }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px 10px',
          borderBottom: '1px solid rgba(138,155,174,0.12)',
          background: 'rgba(5,3,2,0.70)',
          backdropFilter: 'blur(10px)',
          flexShrink: 0,
        }}>
          <BackButton href="/progression" size={44} />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: fonts.header, fontSize: 18, letterSpacing: '0.08em',
              color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.90)',
            }}>WRESTLING</div>
            <div style={{
              fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.24em',
              color: ACCENT, marginTop: 2,
            }}>— FORGED. NOT AWARDED. —</div>
          </div>
          <div style={{ width: 44 }}/>
        </div>

        {/* ── Tier progress strip ── */}
        <div style={{
          padding: '10px 16px 8px',
          borderBottom: '1px solid rgba(138,155,174,0.08)',
          background: 'rgba(5,3,2,0.40)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {TIERS.map((t) => {
              const isDone     = t.num < currentNum;
              const isCurrent  = t.num === currentNum;
              const isSelected = t.num === selectedNum;
              return (
                <button
                  key={t.levelKey}
                  onClick={() => setSelectedNum(t.num)}
                  style={{
                    flex: 1, height: 4, padding: 0, border: 'none', cursor: 'pointer',
                    background: isDone
                      ? ACCENT
                      : isCurrent
                        ? GOLD
                        : isSelected
                          ? 'rgba(138,155,174,0.35)'
                          : 'rgba(242,239,232,0.08)',
                    transition: 'background 0.15s',
                  }}
                />
              );
            })}
          </div>
          <div style={{
            fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.20em',
            color: 'rgba(138,155,174,0.55)', marginTop: 6,
          }}>
            TIER {currentNum} OF 6 — {TIERS[currentNum - 1]?.label ?? ''}
          </div>
        </div>

        {/* ── Main: side-tab layout ── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', paddingBottom: 96 }}>

          {/* Left: tier tabs */}
          <div style={{
            width: 116, flexShrink: 0,
            borderRight: '1px solid rgba(138,155,174,0.10)',
            overflowY: 'auto',
            background: 'rgba(5,3,2,0.40)',
          }}>
            {TIERS.map((t) => {
              const isDone     = t.num < currentNum;
              const isCurrent  = t.num === currentNum;
              const isSelected = t.num === selectedNum;
              const isLocked   = t.num > currentNum;

              return (
                <button
                  key={t.levelKey}
                  onClick={() => setSelectedNum(t.num)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '12px 8px 10px 10px',
                    borderBottom: '1px solid rgba(138,155,174,0.06)',
                    borderLeft: isSelected
                      ? ('3px solid ' + (isCurrent ? GOLD : ACCENT))
                      : '3px solid transparent',
                    background: isSelected ? 'rgba(138,155,174,0.07)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', gap: 3,
                  }}
                >
                  <div style={{
                    fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.20em',
                    color: isLocked
                      ? 'rgba(242,239,232,0.15)'
                      : isDone
                        ? 'rgba(138,155,174,0.45)'
                        : 'rgba(200,148,58,0.65)',
                  }}>TIER {t.num}</div>
                  <div style={{
                    fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.06em', lineHeight: 1.25,
                    color: isLocked
                      ? 'rgba(242,239,232,0.18)'
                      : isSelected
                        ? '#fff'
                        : 'rgba(242,239,232,0.52)',
                  }}>{t.label}</div>
                  {isCurrent && (
                    <div style={{
                      fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.14em',
                      color: GOLD, marginTop: 1,
                    }}>● ACTIVE</div>
                  )}
                  {isDone && (
                    <div style={{
                      fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.14em',
                      color: 'rgba(138,155,174,0.45)',
                    }}>✓ DONE</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: detail panel */}
          <div style={{ flex: 1, overflowY: 'auto' }}>

            {/* Badge hero */}
            <div style={{
              position: 'relative', height: 180, overflow: 'hidden',
              borderBottom: '1px solid rgba(138,155,174,0.10)',
            }}>
              <Image
                src={selected.badge}
                alt={selected.label}
                fill
                sizes="(max-width: 768px) 75vw, 400px"
                style={{ objectFit: 'contain', objectPosition: 'center', opacity: 0.90 }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(5,3,2,0.95) 0%, rgba(5,3,2,0.25) 55%, transparent 100%)',
              }}/>
              <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
                <div style={{
                  fontFamily: fonts.header, fontSize: 20, letterSpacing: '0.10em',
                  color: '#fff', lineHeight: 1.0,
                }}>{selected.label}</div>
                <div style={{
                  fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.04em',
                  color: ACCENT, marginTop: 5, fontStyle: 'italic',
                }}>{selected.identity}</div>
              </div>
            </div>

            {/* Focus areas */}
            <div style={{ padding: '14px 14px 0' }}>
              <div style={{
                fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
                color: 'rgba(138,155,174,0.55)', marginBottom: 8,
              }}>FOCUS AREAS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.skills.map((s) => (
                  <div key={s} style={{
                    padding: '5px 10px',
                    background: 'rgba(138,155,174,0.07)',
                    border: '1px solid rgba(138,155,174,0.15)',
                    fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.10em',
                    color: 'rgba(242,239,232,0.68)',
                  }}>{s}</div>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <div style={{ padding: '16px 14px 0' }}>
              <div style={{
                fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
                color: 'rgba(138,155,174,0.55)', marginBottom: 10,
              }}>REQUIREMENTS — {selected.weeks}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {selected.checklist.map((item, i) => {
                  const completed = selected.num < currentNum;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{
                        width: 16, height: 16, flexShrink: 0, marginTop: 1,
                        border: '1px solid ' + (completed ? 'rgba(138,155,174,0.35)' : 'rgba(242,239,232,0.20)'),
                        borderRadius: 2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: completed ? 'rgba(138,155,174,0.08)' : 'transparent',
                      }}>
                        {completed && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5 4-4" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div style={{
                        fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.03em', lineHeight: 1.4,
                        color: completed ? 'rgba(242,239,232,0.35)' : 'rgba(242,239,232,0.75)',
                      }}>{item}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TBD flag */}
            {selected.tbd && (
              <div style={{
                margin: '16px 14px 0',
                padding: '10px 12px',
                background: 'rgba(200,148,58,0.04)',
                border: '1px solid rgba(200,148,58,0.10)',
                borderLeft: '3px solid rgba(200,148,58,0.30)',
              }}>
                <div style={{
                  fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.18em',
                  color: 'rgba(200,148,58,0.50)',
                }}>TIMELINE + CRITERIA — PENDING CHRIS REVIEW</div>
              </div>
            )}

            {/* Note: Chris is not a wrestler / Elite gym */}
            <div style={{
              margin: '12px 14px 24px',
              padding: '10px 12px',
              background: 'rgba(138,155,174,0.04)',
              border: '1px solid rgba(138,155,174,0.10)',
            }}>
              <div style={{
                fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.16em',
                color: 'rgba(138,155,174,0.45)', lineHeight: 1.6,
              }}>
                WRESTLING PROGRAM — ELITE ACADEMY · JACKSON, NJ
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
