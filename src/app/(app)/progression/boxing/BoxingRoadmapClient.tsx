'use client';

// Boxing Roadmap — Option A layout.
// Top: horizontal regional glove strip (6 tier badges). Tap to select.
// Below: full-width detail panel — badge hero, focus chips, checklist.
// Regional progression: Canvas → Philadelphia Red → Commonwealth Blue → Mexican Gold → La Habana Gold → Sweet Science.
// Content: full boxing system from CAGE_LOGIC_METHOD_PROGRESSIONS.md
// NOTE: Badge image paths are placeholders — swap in generated glove assets when ready.

import { useState } from 'react';
import Image from 'next/image';
import { BrandNav } from '@/components/ui/brand-nav';
import { C, fonts } from '@/lib/design-tokens';

type Tier = {
  levelKey:   string;
  num:        number;
  label:      string;
  region:     string;       // short strip label (fits 48px circle)
  regionFull: string;       // full name for hero watermark
  identity:   string;
  badge:      string;       // glove art — used in strip circles
  hero:       string;       // C1-C6 cinematic — used in full-width detail panel
  skills:     string[];
  checklist:  string[];
  sessions:   string;
};

const TIERS: Tier[] = [
  {
    levelKey: 'foundation', num: 1,
    label: 'FOUNDATION', region: 'CANVAS', regionFull: 'RAW CANVAS',
    identity: 'Your jab has a snap. Your stance doesn\'t lie.',
    badge: '/boxing-raw-canvas.png',
    hero:  '/C1-boxing-foundation.png',
    skills: ['Stance & Guard', 'Jab Mechanics', 'Step-Jab Footwork', 'Pivots', 'Breathing'],
    checklist: [
      'Correct stance — weight 60/40, guard at cheekbone, elbows protecting ribs',
      'Chin tucked behind guard — not exposed',
      'Jab — full extension, snap back to exact guard position',
      'Step-jab — advance with jab, no balance loss',
      'Left pivot and right pivot in stance',
      'Exhale on contact — consistent through pad round',
      '50 jabs on bag — all snapping back to guard',
      'Stance held for entire pad round without coach correction',
      '16+ classes logged',
      'Coach signoff',
    ],
    sessions: '16+ CLASSES',
  },
  {
    levelKey: 'philly_red', num: 2,
    label: 'PHILADELPHIA RED', region: 'PHILLY', regionFull: 'PHILADELPHIA',
    identity: 'Your 1-2 is automatic. You move without thinking about moving.',
    badge: '/boxing-philly-red.png',
    hero:  '/C2-boxing-technical.png',
    skills: ['1-2 Combination', 'Footwork with Punches', 'Bob & Weave', 'Jab Accuracy', 'Hook Introduction'],
    checklist: [
      '1-2 — weight transfer, hip rotation, guard restored immediately after',
      'Step-jab: advance with jab — no forward lean or chin exposure',
      'Pivot off cross — 45° angle creation',
      'Bob — bend knees under incoming punch (no spine bend)',
      'Weave — lateral shoulder dip under hook',
      'Jab accuracy 70%+ on focus mitts in 3-minute round',
      'Footwork drill — step-jab, pivot, step-back continuous for 2 minutes',
      '3 rounds on heavy bag — footwork maintained throughout',
      '24+ classes logged',
      'Coach signoff',
    ],
    sessions: '24+ CLASSES',
  },
  {
    levelKey: 'commonwealth_blue', num: 3,
    label: 'COMMONWEALTH BLUE', region: 'ROYAL', regionFull: 'COMMONWEALTH',
    identity: 'Defense becomes offense. Slipping a punch creates a counter.',
    badge: '/boxing-commonwealth-blue.png',
    hero:  '/C3-boxing-pressure.png',
    skills: ['Hook & Uppercuts', 'Slip Outside', 'Slip Inside', 'Pull-Counter', 'Roll Under Hook', 'Body Work'],
    checklist: [
      'Left hook — 90° elbow angle, pivot on lead foot, hip rotation, fist horizontal',
      'Right uppercut — drop slight, drive up through hips — not a wide swing',
      'Left uppercut — same mechanics, opposite side',
      'Slip outside — move outside incoming jab, right cross counter follows',
      'Slip inside — move inside incoming jab, left hook counter',
      'Pull-counter — pull back off straight punch, return 1-2',
      'Roll under hook — shoulder dip, return short hook or uppercut',
      'Body work — left hook and right cross to body, guard maintained throughout',
      '4-weapon combination (jab-cross-hook-cross) at speed on pads',
      '4 rounds with head movement present throughout',
      '36+ classes logged',
      'Coach signoff',
    ],
    sessions: '36+ CLASSES',
  },
  {
    levelKey: 'mexican_gold', num: 4,
    label: 'MEXICAN GOLD', region: 'MEXICO', regionFull: 'MEXICAN GOLD',
    identity: 'Combinations flow. You fight in sequences, not punches.',
    badge: '/boxing-mexican-gold.png',
    hero:  '/C4-boxing-combination.png',
    skills: ['3–5 Punch Combinations', 'Signature Combination', 'Counter Timing', 'Ring Control', 'Body-to-Head', 'High-Low Feint'],
    checklist: [
      '5 different 3-punch or longer combinations — drilled and reproducible',
      'Signature combination: one 3+ punch chain that is yours — your rhythm, your flow',
      'Counter timing — wait for opponent\'s 3rd punch, counter on the opening',
      'Jab that starts a combination must land — combinations off missed jabs flagged by coach',
      'Ring control — footwork pattern to cut off or corner opponent',
      'Body-to-head: body jab or cross → hook or uppercut to head',
      'Feint high, throw low — feint low, throw high',
      'Pad round without prompting — athlete calls combinations',
      'Jab accuracy 70%+ against a moving target',
      '5 rounds, 3 minutes, 1-minute rest — output maintained throughout (no fade)',
      '48+ classes logged',
      'Coach signoff',
    ],
    sessions: '48+ CLASSES',
  },
  {
    levelKey: 'la_habana_gold', num: 5,
    label: 'LA HABANA GOLD', region: 'LA HABANA', regionFull: 'LA HABANA',
    identity: 'You can spar. You can think. You can take a punch and come back.',
    badge: '/boxing-la-habana.png',
    hero:  '/C5-boxing-contender.png',
    skills: ['20 Sparring Rounds', 'Pressure Fighting', 'Outfighting', 'Body Targeting', 'Jab Accuracy in Sparring', 'Composure Under Fire'],
    checklist: [
      '20 documented sparring rounds (technical/controlled pace, 3 minutes each)',
      'Pressure fighter: cut off ring, work behind jab, force corners and ropes',
      'Outfighter: maintain range with jab, land and move, avoid exchanges',
      'Athlete identifies own style — coach confirms the identification is correct',
      'Body shot damage: 3 rounds of intentional body work in sparring (coach tracked)',
      'Jab accuracy 60%+ in sparring (coach tracked over 3-minute round)',
      'Composure after being hit — no panic; immediately returns to structure',
      '6 rounds, 3 minutes each, at sparring pace — no fade, no quit',
      '1 amateur bout OR 15 hard rounds against more advanced practitioners',
      'Coach verbal: "Safe to spar with any compatible-level partner at this gym"',
      '72+ classes + 20 sparring rounds',
      'Coach signoff',
    ],
    sessions: '72+ CLASSES + 20 SPARRING ROUNDS',
  },
  {
    levelKey: 'sweet_science', num: 6,
    label: 'SWEET SCIENCE', region: 'THE ART', regionFull: 'THE SWEET SCIENCE',
    identity: 'Not just the sport. The art.',
    badge: '/boxing-sweet-science.png',
    hero:  '/C6-boxing-elite.png',
    skills: ['Ring Generalship', 'Opponent-Specific Adjustment', 'Fight IQ', 'Teaching Ability', 'Composure'],
    checklist: [
      'All Technician Level 1-4 techniques demonstrable on command',
      'Ring generalship: 2+ visible examples in 3 sparring rounds — coach observed',
      'Opponent-specific adjustment: coach assigns pattern; athlete adjusts; it works',
      'Fight IQ: accurately describe what each fighter is doing strategically — verbal debrief with coach',
      'Can teach any technique from Levels 1-3 when asked — correctly',
      'Composure is constant — in sparring, in teaching, in setbacks',
      '96+ classes + 30+ sparring rounds',
      'Coach verbal: "This person embodies the Sweet Science — not just executes it"',
      'Coach signoff',
    ],
    sessions: '96+ CLASSES + 30+ SPARRING ROUNDS',
  },
];

const REGION_COLORS: Record<string, string> = {
  'CANVAS':    'rgba(232,225,210,0.65)',
  'PHILLY':    'rgba(185,38,38,0.85)',
  'ROYAL':     'rgba(54,88,162,0.85)',
  'MEXICO':    'rgba(200,148,58,0.95)',
  'LA HABANA': 'rgba(28,78,160,0.85)',
  'THE ART':   'rgba(220,185,70,0.95)',
};

function tierNumFromKey(key: string): number {
  const order = ['foundation', 'philly_red', 'commonwealth_blue', 'mexican_gold', 'la_habana_gold', 'sweet_science'];
  const i = order.indexOf(key);
  return i >= 0 ? i + 1 : 1;
}

const ACCENT = '#8A9BAE';
const GOLD   = '#C8943A';

export default function BoxingRoadmapClient({ currentTierKey }: { currentTierKey: string }) {
  const currentNum = tierNumFromKey(currentTierKey);
  const [openNum, setOpenNum] = useState(currentNum);

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 96, position: 'relative' }}>

      {/* Fixed background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src="/boxing-background.png" alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,3,2,0.90)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── BrandNav ── */}
        <BrandNav backHref="/progression" />

        {/* ── Progress bar ── */}
        <div style={{ padding: '8px 16px 0', background: 'rgba(5,3,2,0.40)' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {TIERS.map((t) => (
              <div key={t.levelKey} style={{
                flex: 1, height: 3,
                background: t.num < currentNum ? ACCENT : t.num === currentNum ? GOLD : 'rgba(242,239,232,0.08)',
              }} />
            ))}
          </div>
          <div style={{
            fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.20em',
            color: 'rgba(138,155,174,0.55)', marginTop: 5, paddingBottom: 10,
          }}>
            TIER {currentNum} OF 6 — {TIERS[currentNum - 1]?.label ?? ''}
          </div>
        </div>

        {/* ── Page title ── */}
        <div style={{
          padding: '6px 20px 14px',
          borderBottom: '1px solid rgba(185,38,38,0.12)',
        }}>
          <div style={{
            fontFamily: fonts.header, fontSize: 30, letterSpacing: '0.10em',
            color: '#fff', lineHeight: 1,
          }}>BOXING</div>
          <div style={{
            fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.22em',
            color: 'rgba(138,155,174,0.55)', marginTop: 4,
          }}>IRON ARMY · TOMS RIVER, NJ</div>
        </div>

        {/* ── Tier Accordion ── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {TIERS.map((t) => {
            const isEarned  = t.num < currentNum;
            const isCurrent = t.num === currentNum;
            const isLocked  = t.num > currentNum;
            const isOpen    = openNum === t.num;
            const regCol    = REGION_COLORS[t.region] ?? ACCENT;

            const rowAccent = isCurrent
              ? GOLD
              : isEarned
                ? regCol
                : 'rgba(242,239,232,0.08)';

            return (
              <div key={t.levelKey} style={{
                borderBottom: '1px solid rgba(242,239,232,0.06)',
                borderLeft: `3px solid ${rowAccent}`,
              }}>

                {/* Row header */}
                <button
                  onClick={() => setOpenNum(isOpen ? 0 : t.num)}
                  style={{
                    width: '100%', padding: 0, border: 'none',
                    background: isOpen && isCurrent ? 'rgba(200,148,58,0.04)' : 'transparent',
                    cursor: 'pointer', display: 'block', textAlign: 'left',
                  }}
                >
                  <div style={{ position: 'relative', height: 80, overflow: 'hidden' }}>
                    {/* C1-C6 hero image — right-anchored */}
                    <Image
                      src={t.hero}
                      alt={t.label}
                      fill
                      sizes="100vw"
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'right center',
                        opacity: isLocked ? 0.12 : isEarned ? 0.35 : 0.55,
                        filter: isLocked ? 'grayscale(0.80)' : 'none',
                      }}
                    />
                    {/* Scrim */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to right, rgba(5,3,2,0.97) 0%, rgba(5,3,2,0.82) 38%, rgba(5,3,2,0.20) 65%, rgba(5,3,2,0.0) 100%)',
                    }} />
                    {/* Content */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center',
                      padding: '0 16px', gap: 12,
                    }}>
                      {/* Status */}
                      <div style={{ width: 22, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isEarned ? (
                          <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" stroke={regCol} strokeWidth="1.2" opacity="0.65"/>
                            <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke={regCol} strokeWidth="1.5"
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
                            background: GOLD, boxShadow: '0 0 8px rgba(200,148,58,0.65)',
                          }} />
                        )}
                      </div>

                      {/* Tier name + region */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: fonts.header,
                          fontSize: isCurrent ? 20 : 17,
                          letterSpacing: '0.08em',
                          color: isCurrent ? GOLD : isEarned ? regCol : 'rgba(242,239,232,0.25)',
                          lineHeight: 1,
                        }}>{t.label}</div>
                        <div style={{
                          fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.18em',
                          color: isCurrent ? 'rgba(200,148,58,0.55)' : 'rgba(242,239,232,0.28)',
                          marginTop: 3,
                        }}>{t.regionFull}</div>
                      </div>

                      {/* Chevron */}
                      <div style={{ width: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

                {/* Expanded content */}
                {isOpen && (
                  <div style={{
                    background: isCurrent ? 'rgba(200,148,58,0.03)' : 'rgba(5,3,2,0.55)',
                    borderTop: `1px solid ${isCurrent ? 'rgba(200,148,58,0.10)' : 'rgba(242,239,232,0.05)'}`,
                  }}>

                    {/* Hero image — large */}
                    <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                      <Image
                        src={t.hero}
                        alt={t.label}
                        fill sizes="100vw" priority
                        style={{ objectFit: 'cover', objectPosition: 'right center', opacity: isLocked ? 0.22 : 0.88 }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(5,3,2,1) 0%, rgba(5,3,2,0.35) 55%, transparent 100%), linear-gradient(to right, rgba(5,3,2,0.70) 0%, rgba(5,3,2,0) 50%)',
                      }} />
                      <div style={{ position: 'absolute', top: 12, right: 14 }}>
                        <div style={{
                          fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.28em',
                          color: regCol, textShadow: '0 1px 6px rgba(0,0,0,0.90)',
                        }}>{t.regionFull}</div>
                      </div>
                      <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
                        <div style={{
                          fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.04em',
                          color: regCol, fontStyle: 'italic', lineHeight: 1.4,
                          opacity: isLocked ? 0.45 : 0.90,
                          textShadow: '0 1px 8px rgba(0,0,0,0.95)',
                        }}>"{t.identity}"</div>
                      </div>
                    </div>

                    <div style={{ padding: '14px 16px 20px' }}>

                      {/* Focus areas */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{
                          fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
                          color: 'rgba(138,155,174,0.55)', marginBottom: 8,
                        }}>FOCUS AREAS</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {t.skills.map((s) => (
                            <div key={s} style={{
                              padding: '5px 10px',
                              background: 'rgba(138,155,174,0.06)',
                              border: `1px solid ${isLocked ? 'rgba(138,155,174,0.08)' : 'rgba(138,155,174,0.16)'}`,
                              fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.10em',
                              color: isLocked ? 'rgba(242,239,232,0.28)' : 'rgba(242,239,232,0.62)',
                            }}>{s}</div>
                          ))}
                        </div>
                      </div>

                      {/* Checklist */}
                      <div>
                        <div style={{
                          fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
                          color: 'rgba(138,155,174,0.55)', marginBottom: 10,
                        }}>REQUIREMENTS — {t.sessions}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {t.checklist.map((item, i) => {
                            const done = isEarned;
                            return (
                              <div key={i} style={{
                              display: 'flex', alignItems: 'flex-start', gap: 10,
                            }}>
                              <div style={{
                                width: 17, height: 17, flexShrink: 0, marginTop: 1,
                                border: '1px solid ' + (done ? 'rgba(138,155,174,0.40)' : 'rgba(242,239,232,0.18)'),
                                borderRadius: 2,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: done ? 'rgba(138,155,174,0.10)' : 'transparent',
                              }}>
                                {done && (
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5l2.5 2.5 4-4" stroke={ACCENT} strokeWidth="1.5"
                                      strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <div style={{
                                fontFamily: fonts.body, fontSize: 12, letterSpacing: '0.03em', lineHeight: 1.45,
                                color: done ? 'rgba(242,239,232,0.32)' : 'rgba(242,239,232,0.78)',
                              }}>{item}</div>
                            </div>
                          );
                        })}
                        </div>
                      </div>

                      {/* Elite note — Tier 6 only */}
                      {t.num === 6 && (
                        <div style={{
                          marginTop: 12,
                          padding: '11px 13px',
                          background: 'rgba(200,148,58,0.05)',
                          border: '1px solid rgba(200,148,58,0.14)',
                          borderLeft: '3px solid rgba(200,148,58,0.40)',
                        }}>
                          <div style={{
                            fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.16em',
                            color: 'rgba(200,148,58,0.60)',
                          }}>ELITE TIER — COACH CONVERSATION, NOT A CHECKLIST. THE COACH MUST SAY IT.</div>
                        </div>
                      )}

                      {/* Gym note */}
                      <div style={{
                        marginTop: 12,
                        padding: '10px 13px',
                        background: 'rgba(138,155,174,0.04)',
                        border: '1px solid rgba(138,155,174,0.09)',
                      }}>
                        <div style={{
                          fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.16em',
                          color: 'rgba(138,155,174,0.40)',
                        }}>
                          IRON ARMY · TOMS RIVER, NJ — ALL CRITERIA SUBJECT TO COACH VERIFICATION
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
