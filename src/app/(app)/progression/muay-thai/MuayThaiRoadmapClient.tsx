'use client';

// Muay Thai Roadmap — Option A layout (matches wrestling).
// 5-tier prajied medal strip. Tap tier → see 3 levels via tab selector.
// Content: full 15-level system from CAGE_LOGIC_METHOD_PROGRESSIONS.md.

import { useState } from 'react';
import Image from 'next/image';
import { BackButton } from '@/components/ui/back-button';
import { C, fonts } from '@/lib/design-tokens';

type Level = {
  num:       number;
  name:      string;
  identity:  string;
  checklist: string[];
  sessions:  string;
};

type Tier = {
  tierNum:      number;
  label:        string;
  tagline:      string;
  badge:        string;
  armbandColor: string;
  levels:       Level[];
};

const TIERS: Tier[] = [
  {
    tierNum: 1, label: 'FOUNDATION',
    tagline: 'Build the structure everything else is built on.',
    badge: '/prajied-level1.png',
    armbandColor: 'rgba(242,235,220,0.75)',
    levels: [
      {
        num: 1, name: 'STANCE & GUARD',
        identity: 'You can stand correctly and be hit without flinching.',
        checklist: [
          'Muay Thai stance — feet shoulder-width, rear foot at 45°',
          'Weight distribution 60/40 front/rear',
          'Guard hands at chin height, elbows protecting ribs',
          'Advance/retreat/lateral without crossing feet',
          'Lead leg teep — chamber, drive hip through, return to stance',
          'Exhale on contact — consistent through full pad round',
          '16+ classes logged',
          'Coach criteria: stance automatic; guard does not drop when tired',
        ],
        sessions: '16+ CLASSES',
      },
      {
        num: 2, name: 'THE STRAIGHT WEAPONS',
        identity: 'Jab-cross is your handshake. Automatic. No thinking.',
        checklist: [
          'Jab — relaxed shoulder, full extension, snap back to guard',
          'Cross — weight transfer, hip rotation, rear shoulder through',
          '1-2 combination — no pause between jab and cross',
          '1-2 with footwork — advance with jab, pivot 45° off cross',
          'Guard maintained before and after every combination',
          'Jab accuracy 70%+ on focus mitts over 3-minute round',
          '24+ classes logged',
          'Coach criteria: jab-cross is a habit, not a thought',
        ],
        sessions: '24+ CLASSES',
      },
      {
        num: 3, name: 'DEFENSE & DISTANCE',
        identity: 'You know where you are. You can take a hit and keep composure.',
        checklist: [
          'Leg check — shin block, knee out, return to stance',
          'Shell defense — chin tucked, elbows sealed, no posture collapse',
          'Parry — lead hand redirects cross (controlled, not a flinch)',
          'Teep distance management — push advancing partner back',
          'Clinch defense basics — hands inside, chin down',
          'Check 8 of 10 leg kicks in controlled drilling round',
          '32+ classes logged',
          'Coach criteria: defense is instinctive — no flinching',
        ],
        sessions: '32+ CLASSES',
      },
    ],
  },
  {
    tierNum: 2, label: 'THE WEAPONS',
    tagline: 'Each weapon is earned before the next is taught.',
    badge: '/prajied-level2.png',
    armbandColor: 'rgba(176,112,48,0.85)',
    levels: [
      {
        num: 1, name: 'THE ROUND KICK',
        identity: 'The round kick belongs to you. Power, balance, recovery — all present.',
        checklist: [
          'Pivot foot rotates 90° — shin is the contact surface (not foot)',
          'Hip drives fully through on contact',
          'Lead round kick — setup with teep feint, target the body',
          'Rear round kick — full hip extension, power and speed versions',
          'Round kick to body — liver (lead kick) and spleen (rear kick)',
          'Low kick — inside and outside leg kick mechanics',
          'Balance recovery — land in base without stepping forward',
          '20 round kicks per side at full effort, balance maintained on all 20',
          '40+ classes logged',
          'Coach criteria: kick is a weapon, not a movement',
        ],
        sessions: '40+ CLASSES',
      },
      {
        num: 2, name: 'THE TEEP & THE KNEE',
        identity: 'You control distance and the clinch.',
        checklist: [
          'Teep with intent — push opponent off balance (not just extend)',
          'Rear knee basic — hip drives knee upward from clinch',
          'Opponent posture pulled down into knee on contact',
          'Double collar tie — hands behind neck, elbows compress',
          'Knee from collar tie — pull + knee, minimum 3 controlled reps',
          'Knee as counter — teep catches opponent mid-advance',
          'Footwork under wall pressure — create angle, do not freeze',
          'Push training partner off balance 5 times in 2-minute round',
          '48+ classes logged',
          'Coach criteria: teep is not passive; knees are controlled',
        ],
        sessions: '48+ CLASSES',
      },
      {
        num: 3, name: 'THE ELBOW',
        identity: "The elbow is Muay Thai's most dangerous weapon. Earned last.",
        checklist: [
          'Horizontal elbow — tip of elbow as contact point, parallel to floor',
          'Diagonal elbow — entry from above, slice downward',
          'Elbow as counter — follow-on same side after opponent misses',
          'Clinch + elbow — create slight distance first, then execute',
          'No wide swing — compact motion confirmed by coach',
          'Elbow pads worn in all elbow drilling rounds',
          '20 clean horizontal elbow reps on elbow pad (no forearm contact)',
          '56+ classes logged',
          'Coach verbal confirmation: "safe to use in controlled sparring"',
        ],
        sessions: '56+ CLASSES',
      },
    ],
  },
  {
    tierNum: 3, label: 'THE CLINCH',
    tagline: 'Where Muay Thai is won and lost. Most Western fighters never learn it.',
    badge: '/prajied-level3.png',
    armbandColor: 'rgba(140,30,30,0.85)',
    levels: [
      {
        num: 1, name: 'CLINCH ENTRY & CONTROL',
        identity: 'You can get inside and stay inside. Posture is maintained.',
        checklist: [
          'Clinch entry — swim-in arm (under then over) to double collar tie',
          'Clinch posture — head forward and down, elbows tight',
          'Hand fighting in clinch — break opponent grip, re-establish own',
          'Pummeling in clinch — continuous in-and-out, 2-minute drilling',
          'Clinch exit — push off with forearms, re-establish stance',
          'Maintain double collar tie for full 3-minute drilling round',
          '64+ classes logged',
          'Coach criteria: clinch posture correct; hands are active, not passive',
        ],
        sessions: '64+ CLASSES',
      },
      {
        num: 2, name: 'KNEES & SWEEPS IN THE CLINCH',
        identity: "You score from the clinch. Opponents don't want to be there with you.",
        checklist: [
          "Knee to body — pull opponent's posture down into knee",
          'Knee to head — controlled, coach-supervised only',
          'Long knee (straight knee) — extend and drive as counter to advance',
          "Foot sweep — inside-foot trip when opponent's weight loads forward",
          'Hip throw (kouchi-adjacent) — off-balance moment, correct timing',
          'Full combination: knee → exit → teep → re-enter → knee (no pauses)',
          'Mat safety — partner swept safely, tap protocol understood',
          '72+ classes logged',
          'Coach criteria: knees connect because of pull, not pure power',
        ],
        sessions: '72+ CLASSES',
      },
      {
        num: 3, name: 'DIRTY BOXING & EXITS',
        identity: 'You are dangerous from mid-range to close range to the clinch.',
        checklist: [
          'Short hook in clinch — elbow tight, power from hip rotation',
          'Short uppercut in clinch — drive from knees upward',
          'Frame and push — forearm on neck or chest, push to kicking range',
          'Grab-and-knee off missed punch — arm catch, pull, knee follows',
          'Clinch exit creates lateral angle — not straight back',
          'Exit to round kick — angle creation directly leads to kick',
          'Full combination: entry → knee → exit → kick (linked in padwork)',
          '80+ classes logged',
          'Coach criteria: mid-range is not dead space',
        ],
        sessions: '80+ CLASSES',
      },
    ],
  },
  {
    tierNum: 4, label: 'COMBINATIONS & TIMING',
    tagline: 'Now you can fight. What does your fight look like?',
    badge: '/prajied-level4.png',
    armbandColor: 'rgba(90,90,105,0.85)',
    levels: [
      {
        num: 1, name: 'COMBINATION ARCHITECTURE',
        identity: 'You throw combinations with purpose — not just sequences.',
        checklist: [
          '4-weapon combo — jab → cross → round kick body → teep (no pause)',
          'Body-head combination — body shot followed immediately by head strike',
          'Defensive combination — block → counter → follow (all 3 parts present)',
          'Pad round without prompting — athlete calls combinations',
          'Combination ending in range, clinch, and at distance — all three present',
          'Coach identifies 3 intentional combination structures in a 3-minute round',
          '92+ classes logged',
          'Coach criteria: combinations have architecture, not accident',
        ],
        sessions: '92+ CLASSES',
      },
      {
        num: 2, name: 'COUNTER FIGHTING',
        identity: 'You are most dangerous when hit first. Counter fighting is your reflex.',
        checklist: [
          'Catch-and-counter — catch incoming kick, return kick or enter clinch',
          'Slip outside — move outside jab, rear cross counter follows',
          'Slip inside — move inside jab, lead hook counter',
          'Parry-and-enter — parry cross, step in, enter clinch or throw elbow',
          'Pull-and-counter — pull back off straight punch, return 1-2',
          '3-count counter drill — defend 3 weapons, counter on the 3rd',
          'Land 5 of 10 counter combinations in controlled sparring round',
          '100+ classes logged',
          'Coach criteria: harder to hit moving backward than standing still',
        ],
        sessions: '100+ CLASSES',
      },
      {
        num: 3, name: 'RING IQ',
        identity: "You understand the ring. You know when you're in trouble before the coach sees it.",
        checklist: [
          'Ring cutting — correct footwork to cut off lateral movement',
          'Pressure fighter mode — demonstrated on command, identifiable by coach',
          'Outfighter mode — demonstrated on command, identifiable by coach',
          'Pace variation — hard 30s → technical 30s → hard 30s (coach confirms)',
          "Own dominant side identified; opponent's weaker side targeted",
          'Pace called unprompted during pad round — not waiting on coach',
          '112+ classes logged',
          'Coach criteria: this level is a coaching discussion, not a skills test',
        ],
        sessions: '112+ CLASSES',
      },
    ],
  },
  {
    tierNum: 5, label: 'FIGHT MIND',
    tagline: 'Not about winning. About who you become when it matters most.',
    badge: '/prajied-level5.png',
    armbandColor: 'rgba(200,148,58,0.95)',
    levels: [
      {
        num: 1, name: 'CONTROLLED SPARRING',
        identity: 'You can spar with composure. Fear does not become aggression.',
        checklist: [
          '10+ documented sparring rounds (technical/controlled pace)',
          'Composure after being hit — slows down, does not panic or speed up',
          'Defense in sparring — shots-landed count acceptable per coach standard',
          'Energy management — 3-round spar without visible gassing',
          'Partner trust — training partners willing to spar again',
          '128+ classes logged + 10 documented sparring rounds',
          'Coach criteria: this athlete is safe to spar with',
        ],
        sessions: '128+ CLASSES + 10 SPARRING ROUNDS',
      },
      {
        num: 2, name: 'FIGHT STRATEGY',
        identity: 'Every round you fight has a plan. Every adjustment is visible to the coach.',
        checklist: [
          'Pre-spar game plan stated before each round — specific, not generic',
          'Mid-round adjustment — coach calls it, athlete demonstrates in same round',
          'Post-round breakdown — identifies 2 things that worked, 1 thing to change',
          'Improvement visible across 3 consecutive sparring rounds',
          '144+ classes logged',
          "Coach criteria: rounds improve because of thinking, not just conditioning",
        ],
        sessions: '144+ CLASSES',
      },
      {
        num: 3, name: 'COMPLETE NAK MUAY',
        identity: 'All eight limbs are operational. You are a practitioner of the art.',
        checklist: [
          'All Tier 1 techniques demonstrable on command',
          'All Tier 2 techniques demonstrable on command',
          'All Tier 3 techniques demonstrable on command',
          'All Tier 4 techniques demonstrable on command',
          '5-round capacity — technique maintained through final round',
          'Teaches newer practitioners when asked — no prompting needed',
          'Composure in setbacks — no ego reactions, no anger in drilling',
          '160+ classes + 25+ sparring rounds',
          'Coach verbal confirmation: "This athlete can demonstrate Muay Thai correctly to anyone who asks"',
          'Eligible for instructor track evaluation',
        ],
        sessions: '160+ CLASSES + 25+ SPARRING ROUNDS',
      },
    ],
  },
];

function tierNumFromRank(rankColor: string): number {
  const match = rankColor?.match(/prajied_(\d)/);
  return match ? parseInt(match[1], 10) : 1;
}

const ACCENT = '#C23B22';
const GOLD   = '#C8943A';

export default function MuayThaiRoadmapClient({ currentRank }: { currentRank: string }) {
  const currentTierNum = tierNumFromRank(currentRank);
  const [selectedTierNum, setSelectedTierNum] = useState(currentTierNum);
  const [selectedLevelNum, setSelectedLevelNum] = useState(1);

  const selectedTier  = TIERS[selectedTierNum - 1] ?? TIERS[0];
  const selectedLevel = selectedTier.levels[selectedLevelNum - 1] ?? selectedTier.levels[0];
  const accentColor   = selectedTier.armbandColor;

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 96, position: 'relative' }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src="/concrete-dark.jpg" alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,3,2,0.88)' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(194,59,34,0.06) 0%, transparent 70%)',
        }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px 10px',
          borderBottom: '1px solid rgba(194,59,34,0.12)',
          background: 'rgba(5,3,2,0.70)',
          backdropFilter: 'blur(10px)',
        }}>
          <BackButton href="/progression" size={44} />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: fonts.header, fontSize: 18, letterSpacing: '0.08em',
              color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.90)',
            }}>MUAY THAI</div>
            <div style={{
              fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.24em',
              color: ACCENT, marginTop: 2,
            }}>— THE ART OF EIGHT LIMBS —</div>
          </div>
          <div style={{ width: 44 }}/>
        </div>

        {/* ── Tier progress bar ── */}
        <div style={{ padding: '10px 16px 0', background: 'rgba(5,3,2,0.40)' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {TIERS.map((t) => {
              const isDone    = t.tierNum < currentTierNum;
              const isCurrent = t.tierNum === currentTierNum;
              return (
                <div key={t.tierNum} style={{
                  flex: 1, height: 3,
                  background: isDone ? ACCENT : isCurrent ? GOLD : 'rgba(242,239,232,0.08)',
                }}/>
              );
            })}
          </div>
          <div style={{
            fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.20em',
            color: 'rgba(194,59,34,0.55)', marginTop: 5, paddingBottom: 10,
          }}>
            TIER {currentTierNum} OF 5 — {TIERS[currentTierNum - 1]?.label ?? ''}
          </div>
        </div>

        {/* ── Prajied medal strip ── */}
        <div style={{
          padding: '16px 14px 14px',
          borderBottom: '1px solid rgba(194,59,34,0.08)',
          background: 'rgba(5,3,2,0.30)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {TIERS.map((t) => {
              const isDone     = t.tierNum < currentTierNum;
              const isCurrent  = t.tierNum === currentTierNum;
              const isSelected = t.tierNum === selectedTierNum;
              const isLocked   = t.tierNum > currentTierNum;

              const ringColor = isSelected
                ? (isCurrent ? GOLD : t.armbandColor)
                : isDone
                  ? 'rgba(194,59,34,0.35)'
                  : 'rgba(242,239,232,0.08)';

              const badgeOpacity = isLocked ? 0.18 : isDone ? 0.65 : 1.0;

              return (
                <button
                  key={t.tierNum}
                  onClick={() => { setSelectedTierNum(t.tierNum); setSelectedLevelNum(1); }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    padding: 0, border: 'none', background: 'transparent', cursor: 'pointer',
                    flex: 1,
                  }}
                >
                  <div style={{
                    width: 52, height: 52,
                    borderRadius: '50%',
                    border: '2px solid ' + ringColor,
                    background: isSelected ? 'rgba(5,3,2,0.60)' : 'rgba(5,3,2,0.30)',
                    position: 'relative', overflow: 'hidden', flexShrink: 0,
                    boxShadow: isSelected && isCurrent
                      ? '0 0 14px rgba(200,148,58,0.35)'
                      : isSelected
                        ? ('0 0 12px ' + t.armbandColor + '40')
                        : 'none',
                  }}>
                    <Image src={t.badge} alt={t.label} fill sizes="52px"
                      style={{
                        objectFit: 'cover', opacity: badgeOpacity,
                        filter: isLocked ? 'grayscale(1)' : 'none',
                      }}
                    />
                  </div>
                  <div style={{
                    fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.10em',
                    color: isSelected
                      ? t.armbandColor
                      : isLocked ? 'rgba(242,239,232,0.14)' : 'rgba(242,239,232,0.32)',
                    whiteSpace: 'nowrap', lineHeight: 1,
                  }}>T{t.tierNum}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div>

          {/* Badge hero */}
          <div style={{
            position: 'relative', height: 200, overflow: 'hidden',
            borderBottom: '1px solid rgba(194,59,34,0.10)',
          }}>
            <Image src={selectedTier.badge} alt={selectedTier.label} fill sizes="100vw" priority
              style={{ objectFit: 'contain', objectPosition: 'center', opacity: 0.88 }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(5,3,2,1) 0%, rgba(5,3,2,0.50) 45%, transparent 100%)',
            }}/>
            <div style={{
              position: 'absolute', top: 12, right: 14,
              fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.28em',
              color: accentColor,
            }}>TIER {selectedTier.tierNum}</div>
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
              <div style={{
                fontFamily: fonts.header, fontSize: 22, letterSpacing: '0.10em',
                color: '#fff', lineHeight: 1.0,
              }}>{selectedTier.label}</div>
              <div style={{
                fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.04em',
                color: accentColor, marginTop: 5, fontStyle: 'italic',
              }}>{selectedTier.tagline}</div>
            </div>
          </div>

          {/* Level selector tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(194,59,34,0.10)',
            background: 'rgba(5,3,2,0.50)',
          }}>
            {selectedTier.levels.map((lv) => {
              const isActive = lv.num === selectedLevelNum;
              return (
                <button key={lv.num} onClick={() => setSelectedLevelNum(lv.num)} style={{
                  flex: 1, padding: '10px 6px 9px',
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  borderBottom: isActive ? ('2px solid ' + ACCENT) : '2px solid transparent',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.16em',
                    color: isActive ? '#fff' : 'rgba(242,239,232,0.35)',
                  }}>LVL {lv.num}</div>
                  <div style={{
                    fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.08em',
                    color: isActive ? ACCENT : 'rgba(242,239,232,0.22)',
                    marginTop: 2, lineHeight: 1.2,
                  }}>{lv.name}</div>
                </button>
              );
            })}
          </div>

          {/* Level content */}
          <div style={{ padding: '16px 16px 0' }}>
            <div style={{
              fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.04em', fontStyle: 'italic',
              color: 'rgba(242,239,232,0.55)', marginBottom: 14,
            }}>{selectedLevel.identity}</div>

            <div style={{
              fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
              color: 'rgba(194,59,34,0.55)', marginBottom: 12,
            }}>REQUIREMENTS — {selectedLevel.sessions}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedLevel.checklist.map((item, i) => {
                const completed = selectedTier.tierNum < currentTierNum;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                    <div style={{
                      width: 17, height: 17, flexShrink: 0, marginTop: 1,
                      border: '1px solid ' + (completed ? 'rgba(194,59,34,0.40)' : 'rgba(242,239,232,0.18)'),
                      borderRadius: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: completed ? 'rgba(194,59,34,0.10)' : 'transparent',
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

          {/* Gym note */}
          <div style={{
            margin: '20px 16px 0',
            padding: '10px 13px',
            background: 'rgba(194,59,34,0.03)',
            border: '1px solid rgba(194,59,34,0.08)',
          }}>
            <div style={{
              fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.16em',
              color: 'rgba(194,59,34,0.38)',
            }}>
              IRON ARMY · TOMS RIVER, NJ — ALL CRITERIA SUBJECT TO COACH VERIFICATION
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
