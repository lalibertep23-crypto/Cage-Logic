'use client';

// Wrestling Roadmap — Option A layout.
// Top: horizontal medal strip (6 tier badges). Tap to select.
// Below: full-width detail panel — badge hero, focus chips, checklist.
// Material progression: Concrete → Bronze → Steel → Silver → Gold → Platinum.
// Content: full 18-chain system from CAGE_LOGIC_METHOD_PROGRESSIONS.md

import { useState } from 'react';
import Image from 'next/image';
import { BackButton } from '@/components/ui/back-button';
import { C, fonts } from '@/lib/design-tokens';

type Tier = {
  levelKey:   string;
  num:        number;
  label:      string;
  material:   string;
  identity:   string;
  badge:      string;
  skills:     string[];
  checklist:  string[];
  weeks:      string;
  tbd:        boolean;
};

const TIERS: Tier[] = [
  {
    levelKey: 'level_1', num: 1,
    label: 'FOUNDATION', material: 'CONCRETE',
    identity: 'You know where you are.',
    badge: '/foundation-wrestling.png',
    skills: ['Stance & Motion', 'Hand Fighting', 'Single Leg Entry', 'Sprawl Defense', 'Top Pressure'],
    checklist: [
      'Maintains wrestling stance under fatigue',
      'Sound shot mechanics — no knee drop',
      'One full attack chain (entry → two finishes)',
      'Positional pressure on top',
      'Wins inside position in pummeling',
      '24+ sessions logged',
      'Coach signoff',
    ],
    weeks: '24+ SESSIONS',
    tbd: false,
  },
  {
    levelKey: 'level_2', num: 2,
    label: 'CHAIN WRESTLING', material: 'BRONZE',
    identity: 'You know what comes next.',
    badge: '/chain-wrestling-wrestling.png',
    skills: ['Shot-to-Finish Chains', 'Double Leg', 'Front Headlock', 'Scramble Counters', 'Top Control Entry'],
    checklist: [
      'Single leg → high-C conversion when opponent posts',
      'Single leg → inside and outside trip finishes',
      'Double leg — lift-and-drive or ankle-block finish',
      'Front headlock from failed shot → arm-in guillotine entry',
      'Sprawl → mat return via wrist control',
      'Sprawl → go-behind (step over, establish waist)',
      'Re-shot — immediate level change after being sprawled on',
      'Referee\'s position top — legal hand placement',
      'Standup from bottom — base, distance, clean execution',
      'Link two attacks in one live sequence',
      'Finish at least one live takedown per session',
      '50+ sessions logged',
      'Coach signoff',
    ],
    weeks: '50+ SESSIONS',
    tbd: false,
  },
  {
    levelKey: 'level_3', num: 3,
    label: 'PRESSURE', material: 'STEEL',
    identity: 'You take what you want.',
    badge: '/pressure-badge-wrestling.png',
    skills: ['Breakdown & Ride', 'Near Fall Series', 'Gut Wrench', 'Turk & Cradle', 'Standup Prevention'],
    checklist: [
      'Spiral ride — inside tricep and ankle grip, chest on back',
      'Tight waist breakdown — clear two-on-one defensive grip',
      'Cross-body ride — prevent standup for full round',
      'Gut wrench — over/under grip, barrel roll to near fall',
      'Turk (leg lace) — from breakdown, tilt to near fall',
      'Near cradle — head and knee lock, squeeze to nearfall',
      'Bar arm — far arm trapped from top, turn to near fall',
      'Half nelson — from belly-down, roll to back with control',
      'Control top position 2+ full 2-minute rounds',
      'Takedown success rate above 50% (3-session coach-tracked)',
      '80+ sessions logged',
      'Coach signoff',
    ],
    weeks: '80+ SESSIONS',
    tbd: false,
  },
  {
    levelKey: 'level_4', num: 4,
    label: 'SCRAMBLE', material: 'SILVER',
    identity: 'You win the chaos.',
    badge: '/scramble-badge-wrestling.png',
    skills: ['Scramble Reads', 'Reversal System', 'Hip Heist', 'Granby Roll', 'Reattack Chains'],
    checklist: [
      'Identify all 4 scramble types and correct first-move decisions',
      'Re-shoot off scramble — immediate level change without resetting',
      'Hip heist (Peterson roll) — from opponent\'s overhook on bottom',
      'Granby roll — defensive inversion to scramble recovery',
      'Switch — from referee\'s bottom before opponent\'s weight settles',
      'Stand-in-base — proper timing, clean hand clearing',
      'Sit-out — sit, turn in, recover to neutral',
      'Immediate reattack — second link in chain before opponent resets',
      'Feint high, attack low (misdirection)',
      '60%+ scramble win rate (coach-tracked over 3 sessions)',
      '110+ sessions logged',
      'Coach signoff',
    ],
    weeks: '110+ SESSIONS',
    tbd: false,
  },
  {
    levelKey: 'level_5', num: 5,
    label: 'COMPETITOR', material: 'GOLD',
    identity: 'You dictate the match.',
    badge: '/competitor-badge-wrestling.png',
    skills: ['Match Management', 'Clock Awareness', 'Opponent Scouting', 'Fatigue-Phase Wrestling', 'Counter Selection'],
    checklist: [
      'Riding time — ride vs. release decision based on score',
      'Stalling identification — uses positioning and calls to counter',
      'Clock management — knows exact score needed with 1:00 remaining',
      'Defending a lead — control vs. attack decision correct with +2 score',
      'Attacking a deficit — forces action, does not wait',
      'Scouting — identify opponent\'s primary attack and defensive pattern',
      'Counter selection — match own attack to opponent\'s defensive gap',
      'Technique maintained in minute 4 of a 4-minute round',
      'Takedown attempt executed in final 30 seconds of a hard round',
      '5+ dual meets or tournaments with consistent record',
      'Pre-match gameplan articulated before each match',
      'Visible tactical adjustment between periods',
      '150+ sessions logged',
      'Coach signoff',
    ],
    weeks: '150+ SESSIONS',
    tbd: false,
  },
  {
    levelKey: 'level_6', num: 6,
    label: 'ELITE', material: 'PLATINUM',
    identity: 'You are the problem in the room.',
    badge: '/elite-badge-wrestling.png',
    skills: ['Signature System', 'Teaching All 15 Chains', 'Real-Time Adaptation', 'Competition Dominance', 'Coach Reciprocity'],
    checklist: [
      'Define signature chain (3+ linked attacks) by name',
      'Demonstrate signature chain in under 60 seconds',
      'Signature chain used successfully in competition or high-level sparring',
      'Alternate version of signature chain when primary is scouted',
      'Accurately teach all 15 chains from Tiers 1–5',
      'Identify and correct technique errors verbally',
      'Identify and correct technique errors by demonstration',
      'Switch systems mid-round based on opponent\'s reaction — coach confirms',
      'Post-round verbal explanation: what adjustment was made and why',
      '200+ wrestling sessions',
      'Consistent regional-level competition results',
      'Coach nomination required — this tier is Frankie Edgar\'s standard',
    ],
    weeks: '200+ SESSIONS',
    tbd: false,
  },
];

const MATERIAL_COLORS: Record<string, string> = {
  CONCRETE: 'rgba(180,178,169,0.70)',
  BRONZE:   'rgba(176,112,48,0.85)',
  STEEL:    'rgba(138,155,174,0.80)',
  SILVER:   'rgba(210,210,210,0.80)',
  GOLD:     'rgba(200,148,58,0.95)',
  PLATINUM: 'rgba(220,230,240,0.90)',
};

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
  const matColor = MATERIAL_COLORS[selected.material] ?? ACCENT;

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 96, position: 'relative' }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src="/concrete-dark.jpg" alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,3,2,0.88)' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(138,155,174,0.05) 0%, transparent 70%)',
        }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px 10px',
          borderBottom: '1px solid rgba(138,155,174,0.12)',
          background: 'rgba(5,3,2,0.70)',
          backdropFilter: 'blur(10px)',
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

        {/* ── Tier progress bar ── */}
        <div style={{
          padding: '10px 16px 0',
          background: 'rgba(5,3,2,0.40)',
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {TIERS.map((t) => {
              const isDone    = t.num < currentNum;
              const isCurrent = t.num === currentNum;
              return (
                <div
                  key={t.levelKey}
                  style={{
                    flex: 1, height: 3,
                    background: isDone ? ACCENT : isCurrent ? GOLD : 'rgba(242,239,232,0.08)',
                  }}
                />
              );
            })}
          </div>
          <div style={{
            fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.20em',
            color: 'rgba(138,155,174,0.55)', marginTop: 5, paddingBottom: 10,
          }}>
            TIER {currentNum} OF 6 — {TIERS[currentNum - 1]?.label ?? ''}
          </div>
        </div>

        {/* ── Medal strip ── */}
        <div style={{
          padding: '16px 14px 14px',
          borderBottom: '1px solid rgba(138,155,174,0.08)',
          background: 'rgba(5,3,2,0.30)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
            {TIERS.map((t) => {
              const isDone     = t.num < currentNum;
              const isCurrent  = t.num === currentNum;
              const isSelected = t.num === selectedNum;
              const isLocked   = t.num > currentNum;
              const matCol     = MATERIAL_COLORS[t.material] ?? ACCENT;

              const ringColor = isSelected
                ? (isCurrent ? GOLD : matCol)
                : isDone
                  ? 'rgba(138,155,174,0.35)'
                  : 'rgba(242,239,232,0.08)';

              const badgeOpacity = isLocked ? 0.18 : isDone ? 0.65 : 1.0;

              return (
                <button
                  key={t.levelKey}
                  onClick={() => setSelectedNum(t.num)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    padding: 0, border: 'none', background: 'transparent', cursor: 'pointer',
                    flex: 1,
                  }}
                >
                  {/* Medal circle */}
                  <div style={{
                    width: 48, height: 48,
                    borderRadius: '50%',
                    border: '2px solid ' + ringColor,
                    background: isSelected ? 'rgba(5,3,2,0.60)' : 'rgba(5,3,2,0.30)',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                    boxShadow: isSelected && isCurrent
                      ? ('0 0 12px rgba(200,148,58,0.35)')
                      : isSelected
                        ? ('0 0 10px ' + matCol + '40')
                        : 'none',
                  }}>
                    <Image
                      src={t.badge}
                      alt={t.label}
                      fill
                      sizes="48px"
                      style={{
                        objectFit: 'cover',
                        opacity: badgeOpacity,
                        filter: isLocked ? 'grayscale(1)' : 'none',
                      }}
                    />
                  </div>
                  {/* Material label */}
                  <div style={{
                    fontFamily: fonts.label,
                    fontSize: 7,
                    letterSpacing: '0.12em',
                    color: isSelected
                      ? matCol
                      : isLocked
                        ? 'rgba(242,239,232,0.14)'
                        : 'rgba(242,239,232,0.32)',
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                  }}>{t.material}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div>

          {/* Badge hero — full width */}
          <div style={{
            position: 'relative', height: 220, overflow: 'hidden',
            borderBottom: '1px solid rgba(138,155,174,0.10)',
          }}>
            <Image
              src={selected.badge}
              alt={selected.label}
              fill
              sizes="100vw"
              priority
              style={{ objectFit: 'contain', objectPosition: 'center', opacity: 0.92 }}
            />
            {/* Bottom fade */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(5,3,2,1) 0%, rgba(5,3,2,0.50) 45%, transparent 100%)',
            }}/>
            {/* Material watermark top-right */}
            <div style={{
              position: 'absolute', top: 12, right: 14,
              fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.28em',
              color: matColor,
            }}>{selected.material}</div>
            {/* Tier identity bottom */}
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
              <div style={{
                fontFamily: fonts.header, fontSize: 24, letterSpacing: '0.10em',
                color: '#fff', lineHeight: 1.0,
              }}>{selected.label}</div>
              <div style={{
                fontFamily: fonts.body, fontSize: 12, letterSpacing: '0.04em',
                color: matColor, marginTop: 5, fontStyle: 'italic',
              }}>{selected.identity}</div>
            </div>
          </div>

          {/* Focus areas */}
          <div style={{ padding: '16px 16px 0' }}>
            <div style={{
              fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
              color: 'rgba(138,155,174,0.55)', marginBottom: 10,
            }}>FOCUS AREAS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {selected.skills.map((s) => (
                <div key={s} style={{
                  padding: '6px 11px',
                  background: 'rgba(138,155,174,0.07)',
                  border: '1px solid rgba(138,155,174,0.16)',
                  fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.10em',
                  color: 'rgba(242,239,232,0.68)',
                }}>{s}</div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div style={{ padding: '18px 16px 0' }}>
            <div style={{
              fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
              color: 'rgba(138,155,174,0.55)', marginBottom: 12,
            }}>REQUIREMENTS — {selected.weeks}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selected.checklist.map((item, i) => {
                const completed = selected.num < currentNum;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                    <div style={{
                      width: 17, height: 17, flexShrink: 0, marginTop: 1,
                      border: '1px solid ' + (completed ? 'rgba(138,155,174,0.40)' : 'rgba(242,239,232,0.18)'),
                      borderRadius: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: completed ? 'rgba(138,155,174,0.10)' : 'transparent',
                    }}>
                      {completed && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5 4-4" stroke={ACCENT} strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div style={{
                      fontFamily: fonts.body, fontSize: 12, letterSpacing: '0.03em', lineHeight: 1.45,
                      color: completed ? 'rgba(242,239,232,0.32)' : 'rgba(242,239,232,0.78)',
                    }}>{item}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TBD flag — only shown when tbd is true */}
          {selected.tbd && (
            <div style={{
              margin: '18px 16px 0',
              padding: '11px 13px',
              background: 'rgba(200,148,58,0.04)',
              border: '1px solid rgba(200,148,58,0.10)',
              borderLeft: '3px solid rgba(200,148,58,0.28)',
            }}>
              <div style={{
                fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.18em',
                color: 'rgba(200,148,58,0.50)',
              }}>TIMELINE + CRITERIA — PENDING CHRIS REVIEW</div>
            </div>
          )}

          {/* Frankie note — Tier 6 only */}
          {selected.num === 6 && (
            <div style={{
              margin: '12px 16px 0',
              padding: '11px 13px',
              background: 'rgba(200,148,58,0.05)',
              border: '1px solid rgba(200,148,58,0.14)',
              borderLeft: '3px solid rgba(200,148,58,0.40)',
            }}>
              <div style={{
                fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.16em',
                color: 'rgba(200,148,58,0.60)',
              }}>FRANKIE EDGAR STANDARD — ELITE TIER REQUIRES COACH NOMINATION</div>
            </div>
          )}

          {/* Gym note */}
          <div style={{
            margin: '12px 16px 0',
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
    </main>
  );
}
