'use client';

// BJJ Roadmap — Accordion layout.
// All 5 belts visible. Current belt pre-expanded. Past belts reviewable. Future belts locked preview.
// CONTENT: Draft placeholder — Chris Denardo validates stripe criteria against Iron Army standards before V1.5

import { useState } from 'react';
import { BrandNav } from '@/components/ui/brand-nav';
import { C, fonts } from '@/lib/design-tokens';

type Stripe = { num: number; label: string };

type Belt = {
  key:           string;
  orderIndex:    number;
  name:          string;
  accentColor:   string;
  textColor:     string;
  image:         string;
  identity:      string;
  stripes:       Stripe[];
  skills:        string[];
  checklist:     string[];
  sessionReq:    string;
  blackBeltNote?: boolean;
};

const BELTS: Belt[] = [
  {
    key: 'white', orderIndex: 0,
    name: 'WHITE BELT',
    accentColor: 'rgba(235,230,210,0.85)',
    textColor:   '#E8E3D0',
    image:       '/white-belt.png',
    identity:    'You showed up. You tapped. You came back. That\'s the whole game at white.',
    stripes: [
      { num: 1, label: 'Survive a round. Know where you are on the mat.' },
      { num: 2, label: 'Hip escape and bridge are automatic. No thinking.' },
      { num: 3, label: 'Guard retention and basic posture breaking from closed guard.' },
      { num: 4, label: 'Consistent in all basics. Coach confirms ready for belt assessment.' },
    ],
    skills: ['Hip Escape', 'Mount Escape', 'Side Control Survival', 'Closed Guard', 'Tapout Culture'],
    checklist: [
      'Taps cleanly — correct timing, not too early, never too late',
      'Hip escape (shrimp) — both sides, consistent technique under pressure',
      'Bridge and roll from mount — correct hip drive and timing',
      'Side control escape — frame and shrimp to guard recovery',
      'Closed guard — posture breaking and basic guard maintenance',
      'Aware of position hierarchy (mount > back > side > guard)',
      'Stays calm under pressure — no panic, no spaz',
      '30+ classes logged',
      'Coach signoff',
    ],
    sessionReq: '30+ CLASSES',
  },
  {
    key: 'blue', orderIndex: 1,
    name: 'BLUE BELT',
    accentColor: 'rgba(42,80,145,0.95)',
    textColor:   '#9BB8E0',
    image:       '/blue-belt.png',
    identity:    'Survival is baseline now. Build offense on top of it.',
    stripes: [
      { num: 1, label: 'Own a position — consistent from top or from guard.' },
      { num: 2, label: '3-5 submissions. Know when and how to attack.' },
      { num: 3, label: 'Handle size and strength with technique, not effort.' },
      { num: 4, label: 'Curriculum complete. Movement automatic. Ready for assessment.' },
    ],
    skills: ['Guard Passing', 'Submission Setups', 'Half Guard', 'Takedowns', 'Top Control'],
    checklist: [
      'Takedown — double or single leg, functional execution',
      'Guard pass — at least 2 (knee slice, torreando, or stack)',
      'Half guard bottom — frame, underhook, sweep or recovery',
      'Mount control — high mount, ezekiel or arm triangle setup',
      'Armbar from guard — correct mechanics and finish',
      'Triangle from guard — correct mechanics and finish',
      'Rear naked choke from back mount — control before choke',
      'Consistent positional control 2+ minutes vs. same-level partners',
      '100+ classes logged',
      'Coach signoff',
    ],
    sessionReq: '100+ CLASSES',
  },
  {
    key: 'purple', orderIndex: 2,
    name: 'PURPLE BELT',
    accentColor: 'rgba(110,52,155,0.95)',
    textColor:   '#C8A0E0',
    image:       '/purple-belt.png',
    identity:    'Technique beats strength here. If it doesn\'t, the technique is wrong.',
    stripes: [
      { num: 1, label: 'Defined game. You know what your A-game is.' },
      { num: 2, label: 'Back takes and back defense both solid.' },
      { num: 3, label: 'Competition experience. Real rolls against real people.' },
      { num: 4, label: 'Teach fundamentals accurately. Coach confirms readiness.' },
    ],
    skills: ['Guard Development', 'Back Takes', 'Leg Entanglement Entry', 'Competition', 'Pressure Passing'],
    checklist: [
      'Defined guard system — own at least one (spider, De La Riva, half, or butterfly)',
      'Guard break and pass combination — smooth connected top game',
      'Back take — from guard, from turtle, or armbar-to-back transition',
      'Back defense — prevent the choke, recover to side or guard',
      'Leg entanglement entry — outside heel hook or basic inside sankaku',
      'Competition: 1 tournament OR 20+ hard rounds vs. blues and purples',
      'Verbal game plan before a roll — executed with intent',
      'Can accurately teach all white belt requirements on demand',
      '3+ years consistent training (guideline)',
      'Coach signoff',
    ],
    sessionReq: '3+ YEARS / COACH ASSESSED',
  },
  {
    key: 'brown', orderIndex: 3,
    name: 'BROWN BELT',
    accentColor: 'rgba(150,88,32,0.95)',
    textColor:   '#D4AA78',
    image:       '/brown-belt.png',
    identity:    'The work is in the gaps now. You know what you don\'t know.',
    stripes: [
      { num: 1, label: 'Understand your patterns. Know how opponents react to your game.' },
      { num: 2, label: 'Can teach the full blue belt curriculum accurately.' },
      { num: 3, label: 'Back to competition. Different athlete now.' },
      { num: 4, label: 'Coach nomination. The checklist phase is finished.' },
    ],
    skills: ['Conceptual Mastery', 'System Connections', 'Coaching Ability', 'Counter System', 'Pressure'],
    checklist: [
      'Define personal game: primary guard, primary pass, primary submission sequence',
      'Counter system — 2+ responses when primary game is shut down',
      'Teach entire blue belt curriculum accurately and reproducibly',
      'High-level sparring — holds own against advanced practitioners',
      'Competition against advanced belts — performance tracked, not just result',
      'Movement is unconscious — no deliberate thought about base or framing',
      'Contributes to gym culture — helps lower belts without derailing own training',
      'Coach signoff — this is a conversation, not a checklist',
    ],
    sessionReq: 'COACH ASSESSED',
  },
  {
    key: 'black', orderIndex: 4,
    name: 'BLACK BELT',
    accentColor: '#C8943A',
    textColor:   '#C8943A',
    image:       '/first-degree.png',
    identity:    'The belt is a byproduct. The pursuit never stops.',
    stripes: [
      { num: 1, label: '1st Degree — continued growth and active contribution.' },
      { num: 2, label: '2nd Degree — distinguished time on the mat.' },
      { num: 3, label: '3rd Degree — decades of service to the art.' },
      { num: 4, label: '4th Degree — a life given to Brazilian Jiu-Jitsu.' },
    ],
    skills: ['Complete Game', 'Conceptual Mastery', 'Teaching', 'Mentorship', 'Integrity'],
    checklist: [
      'Complete game across all positions — no exploitable holes',
      'Curriculum knowledge beyond personal performance',
      'Consistent contribution to gym and community',
      'Represents the art with integrity inside and outside the gym',
    ],
    sessionReq: 'PROFESSOR AWARDED',
    blackBeltNote: true,
  },
];

const BELT_ORDER = ['white', 'blue', 'purple', 'brown', 'black'];

function beltOrderIndex(key: string): number {
  const i = BELT_ORDER.indexOf(key);
  return i >= 0 ? i : 0;
}

const GOLD   = '#C8943A';
const SILVER = '#8A9BAE';

export default function BjjRoadmapClient({
  currentBeltKey,
  currentStripes,
}: {
  currentBeltKey: string;
  currentStripes: number;
}) {
  const currentIdx = beltOrderIndex(currentBeltKey);
  const [openKey, setOpenKey] = useState<string>(currentBeltKey);

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text, paddingBottom: 96 }}>

      {/* ── BrandNav ── */}
      <BrandNav backHref="/progression" />

      {/* ── Cinematic Hero ── */}
      <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
        {/* Mat background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/iron-army-mat.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          filter: 'saturate(0.60) contrast(1.15) brightness(0.50)',
        }} />
        {/* Gradient overlays */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,4,3,0.18) 0%, rgba(5,4,3,0.10) 30%, rgba(5,4,3,0.80) 70%, rgba(5,4,3,1.0) 100%), linear-gradient(to right, rgba(5,4,3,0.92) 0%, rgba(5,4,3,0.08) 65%)',
        }} />
        {/* Belt image — right-anchored atmospheric */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '55%',
          backgroundImage: `url(${BELTS.find(b => b.key === currentBeltKey)?.image ?? '/white-belt.png'})`,
          backgroundSize: 'auto 75%',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.18,
          filter: 'grayscale(0.30)',
        }} />
        {/* Current belt stripe indicator */}
        <div style={{
          position: 'absolute', top: 16, right: 16,
          display: 'flex', gap: 5, alignItems: 'center',
        }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: s <= currentStripes ? GOLD : 'rgba(242,239,232,0.12)',
              border: s <= currentStripes ? 'none' : '1px solid rgba(242,239,232,0.20)',
            }} />
          ))}
        </div>
        {/* Title — bottom-left */}
        <div style={{ position: 'absolute', bottom: 18, left: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 32, background: GOLD, flexShrink: 0 }} />
            <div>
              <div style={{
                fontFamily: fonts.header, fontSize: 26, letterSpacing: '0.10em',
                lineHeight: 1, color: '#F2EFE8',
              }}>BRAZILIAN JIU-JITSU</div>
              <div style={{
                fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.22em',
                color: 'rgba(200,148,58,0.65)', marginTop: 5,
              }}>
                {String(currentBeltKey).toUpperCase()} BELT
                {currentStripes > 0 ? ` · ${currentStripes} STRIPE${currentStripes > 1 ? 'S' : ''}` : ''} · IRON ARMY
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Belt Accordion ── */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {BELTS.map((belt) => {
          const beltIdx   = belt.orderIndex;
          const isEarned  = beltIdx < currentIdx;
          const isCurrent = belt.key === currentBeltKey;
          const isLocked  = beltIdx > currentIdx;
          const isOpen    = openKey === belt.key;

          const rowAccent = isCurrent
            ? GOLD
            : isEarned
              ? belt.accentColor
              : 'rgba(242,239,232,0.08)';

          return (
            <div key={belt.key} style={{
              borderBottom: '1px solid rgba(242,239,232,0.06)',
              borderLeft: `3px solid ${rowAccent}`,
            }}>

              {/* ── Row header — always visible ── */}
              <button
                onClick={() => setOpenKey(isOpen ? '' : belt.key)}
                style={{
                  width: '100%', padding: 0, border: 'none',
                  background: isOpen && isCurrent ? 'rgba(200,148,58,0.04)' : 'transparent',
                  cursor: 'pointer', display: 'block', textAlign: 'left',
                }}
              >
                <div style={{
                  position: 'relative',
                  height: 72,
                  overflow: 'hidden',
                }}>
                  {/* Belt image — right-anchored */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${belt.image})`,
                    backgroundSize: 'auto 80%',
                    backgroundPosition: 'right center',
                    backgroundRepeat: 'no-repeat',
                    opacity: isLocked ? 0.10 : isEarned ? 0.32 : 0.50,
                    filter: isLocked ? 'grayscale(1)' : 'none',
                  }} />
                  {/* Scrim */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to right, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.80) 40%, rgba(5,5,5,0.20) 65%, rgba(5,5,5,0.0) 100%)',
                  }} />
                  {/* Content */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center',
                    padding: '0 16px',
                    gap: 12,
                  }}>
                    {/* Status icon */}
                    <div style={{
                      width: 22, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isEarned ? (
                        <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke={belt.accentColor} strokeWidth="1.2" opacity="0.65"/>
                          <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke={belt.accentColor} strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round" opacity="0.85"/>
                        </svg>
                      ) : isLocked ? (
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none"
                             stroke="rgba(242,239,232,0.18)" strokeWidth="1.3" strokeLinecap="round">
                          <rect x="1" y="6" width="10" height="7" rx="1"/>
                          <path d="M3.5 6V4a2.5 2.5 0 015 0v2"/>
                        </svg>
                      ) : (
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: GOLD,
                          boxShadow: '0 0 8px rgba(200,148,58,0.65)',
                        }} />
                      )}
                    </div>

                    {/* Belt name */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: fonts.header,
                        fontSize: isCurrent ? 20 : 17,
                        letterSpacing: '0.08em',
                        color: isCurrent
                          ? GOLD
                          : isEarned
                            ? belt.textColor
                            : 'rgba(242,239,232,0.25)',
                        lineHeight: 1,
                      }}>{belt.name}</div>
                      {isCurrent && (
                        <div style={{
                          fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.20em',
                          color: 'rgba(200,148,58,0.55)', marginTop: 3,
                        }}>CURRENT BELT</div>
                      )}
                    </div>

                    {/* Stripe dots — current and earned only */}
                    {!isLocked && !belt.blackBeltNote && (
                      <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
                        {[1, 2, 3, 4].map((s) => {
                          const filled = isEarned ? true : (isCurrent && s <= currentStripes);
                          return (
                            <div key={s} style={{
                              width: 9, height: 9, borderRadius: '50%',
                              background: filled
                                ? (isCurrent ? GOLD : belt.accentColor)
                                : 'rgba(242,239,232,0.10)',
                              border: filled ? 'none' : '1px solid rgba(242,239,232,0.16)',
                            }} />
                          );
                        })}
                      </div>
                    )}

                    {/* Chevron */}
                    <div style={{
                      width: 20, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d={isOpen ? 'M2 6.5l3-3 3 3' : 'M2 3.5l3 3 3-3'}
                          stroke={isCurrent ? GOLD : 'rgba(242,239,232,0.28)'}
                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* ── Expanded content ── */}
              {isOpen && (
                <div style={{
                  background: isCurrent ? 'rgba(200,148,58,0.03)' : 'rgba(5,5,5,0.50)',
                  borderTop: `1px solid ${isCurrent ? 'rgba(200,148,58,0.10)' : 'rgba(242,239,232,0.05)'}`,
                }}>

                  {/* Belt image hero */}
                  <div style={{ position: 'relative', height: 110, overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `url(${belt.image})`,
                      backgroundSize: 'auto 92%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      opacity: isLocked ? 0.16 : 0.58,
                      filter: isLocked ? 'grayscale(0.80)' : 'none',
                    }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to bottom, rgba(5,5,5,0.50) 0%, rgba(5,5,5,0.10) 50%, rgba(5,5,5,0.80) 100%)',
                    }} />
                    <div style={{
                      position: 'absolute', bottom: 10, left: 16, right: 16,
                    }}>
                      <div style={{
                        fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.04em',
                        color: belt.textColor, fontStyle: 'italic', lineHeight: 1.4,
                        opacity: isLocked ? 0.45 : 0.90,
                        textShadow: '0 1px 8px rgba(0,0,0,0.90)',
                      }}>"{belt.identity}"</div>
                    </div>
                  </div>

                  <div style={{ padding: '14px 16px 20px' }}>

                    {/* Stripe milestones */}
                    {!belt.blackBeltNote && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{
                          fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
                          color: 'rgba(138,155,174,0.55)', marginBottom: 10,
                        }}>STRIPE MILESTONES</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {belt.stripes.map((stripe) => {
                            const stripeEarned = isEarned || (isCurrent && stripe.num <= currentStripes);
                            return (
                              <div key={stripe.num} style={{
                                display: 'flex', alignItems: 'flex-start', gap: 10,
                              }}>
                                <div style={{
                                  width: 22, height: 22, flexShrink: 0,
                                  border: `1px solid ${stripeEarned ? belt.accentColor : 'rgba(242,239,232,0.12)'}`,
                                  borderRadius: '50%',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  background: stripeEarned ? 'rgba(200,148,58,0.08)' : 'transparent',
                                  marginTop: 1,
                                }}>
                                  <span style={{
                                    fontFamily: fonts.label, fontSize: 9,
                                    color: stripeEarned ? belt.accentColor : 'rgba(242,239,232,0.25)',
                                  }}>{stripe.num}</span>
                                </div>
                                <div style={{
                                  fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.03em',
                                  color: stripeEarned ? 'rgba(242,239,232,0.65)' : 'rgba(242,239,232,0.35)',
                                  lineHeight: 1.4, paddingTop: 3,
                                }}>{stripe.label}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Focus areas */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{
                        fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
                        color: 'rgba(138,155,174,0.55)', marginBottom: 8,
                      }}>FOCUS AREAS</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {belt.skills.map((s) => (
                          <div key={s} style={{
                            padding: '5px 10px',
                            background: 'rgba(138,155,174,0.06)',
                            border: `1px solid ${isLocked ? 'rgba(138,155,174,0.08)' : 'rgba(138,155,174,0.16)'}`,
                            fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.10em',
                            color: isLocked ? 'rgba(242,239,232,0.25)' : 'rgba(242,239,232,0.62)',
                          }}>{s}</div>
                        ))}
                      </div>
                    </div>

                    {/* Checklist */}
                    <div>
                      <div style={{
                        fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
                        color: 'rgba(138,155,174,0.55)', marginBottom: 10,
                      }}>REQUIREMENTS — {belt.sessionReq}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {belt.checklist.map((item, i) => {
                          const done = isEarned;
                          return (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                              <div style={{
                                width: 16, height: 16, flexShrink: 0, marginTop: 2,
                                border: `1px solid ${done ? 'rgba(138,155,174,0.35)' : 'rgba(242,239,232,0.14)'}`,
                                borderRadius: 2,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: done ? 'rgba(138,155,174,0.10)' : 'transparent',
                              }}>
                                {done && (
                                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5l2.5 2.5 4-4" stroke={SILVER} strokeWidth="1.4"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                              <div style={{
                                fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.03em', lineHeight: 1.45,
                                color: done
                                  ? 'rgba(242,239,232,0.28)'
                                  : isLocked
                                    ? 'rgba(242,239,232,0.38)'
                                    : 'rgba(242,239,232,0.78)',
                              }}>{item}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Black belt note */}
                    {belt.blackBeltNote && (
                      <div style={{
                        marginTop: 14,
                        padding: '10px 12px',
                        background: 'rgba(200,148,58,0.05)',
                        border: '1px solid rgba(200,148,58,0.14)',
                        borderLeft: '3px solid rgba(200,148,58,0.40)',
                      }}>
                        <div style={{
                          fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.16em',
                          color: 'rgba(200,148,58,0.60)',
                        }}>BLACK BELT — AWARDED BY THE PROFESSOR. NOT TAKEN. NOT RUSHED.</div>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div style={{
        margin: '10px 16px 0',
        padding: '10px 12px',
        background: 'rgba(138,155,174,0.03)',
        border: '1px solid rgba(138,155,174,0.07)',
      }}>
        <div style={{
          fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.15em',
          color: 'rgba(138,155,174,0.35)',
        }}>IRON ARMY · TOMS RIVER, NJ — ALL PROMOTIONS COACH-VERIFIED · CHRIS DENARDO</div>
      </div>

      <div style={{
        margin: '6px 16px 0',
        padding: '8px 12px',
        background: 'rgba(200,148,58,0.03)',
        border: '1px solid rgba(200,148,58,0.07)',
      }}>
        <div style={{
          fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.14em',
          color: 'rgba(200,148,58,0.38)',
        }}>CONTENT DRAFT — STRIPE CRITERIA TO BE CONFIRMED AGAINST IRON ARMY STANDARDS</div>
      </div>

    </main>
  );
}
