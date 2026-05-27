'use client';

// Karate Roadmap — Kyu to Dan belt system.
// 6 tiers: White (Mukyu) → Orange → Green → Blue → Brown → Black (Shodan)
// Three lineage paths: Kyokushin / Shotokan / Goju-Ryu — selectable at onboarding.
// Badge strip: CSS belt-color circles — no image dependencies.
// Background: dark dojo — warm amber radial.
// Copy voice: precise, restrained — senior student, not sensei.
// Kata names appear in Japanese. Kiai, mokuso, rei — not translated.

import { useState } from 'react';
import { BrandNav } from '@/components/ui/brand-nav';
import { C, fonts } from '@/lib/design-tokens';

type Tier = {
  levelKey:  string;
  num:       number;
  label:     string;    // Belt color — display name
  grade:     string;    // Kyu / Dan designation
  rank:      string;    // Short circle label
  belt:      string;    // Belt color key
  identity:  string;
  skills:    string[];
  checklist: string[];
  sessions:  string;
  tameshiwari?: boolean;
  shodan?:      boolean;
};

const AMBER = '#C8943A';
const DIM   = 'rgba(200,148,58,0.55)';

// Belt color system — textile rendered as CSS
const BELT: Record<string, { bg: string; border: string; text: string; label: string }> = {
  WHITE:  { bg: 'rgba(242,239,232,0.12)', border: 'rgba(242,239,232,0.50)', text: 'rgba(242,239,232,0.85)', label: 'WHITE' },
  ORANGE: { bg: 'rgba(195,95,28,0.20)',   border: 'rgba(210,110,38,0.62)',  text: 'rgba(220,120,48,0.90)', label: 'ORANGE' },
  GREEN:  { bg: 'rgba(42,100,50,0.22)',   border: 'rgba(55,122,62,0.62)',   text: 'rgba(70,145,76,0.90)', label: 'GREEN' },
  BLUE:   { bg: 'rgba(28,65,150,0.22)',   border: 'rgba(40,85,172,0.62)',   text: 'rgba(75,120,210,0.90)', label: 'BLUE' },
  BROWN:  { bg: 'rgba(90,55,26,0.26)',    border: 'rgba(115,70,34,0.65)',   text: 'rgba(160,100,55,0.90)', label: 'BROWN' },
  BLACK:  { bg: 'rgba(22,18,12,0.50)',    border: 'rgba(200,148,58,0.65)',  text: 'rgba(200,148,58,0.95)', label: 'SHODAN' },
};

const TIERS: Tier[] = [
  {
    levelKey: 'white', num: 1,
    label: 'WHITE BELT', grade: 'MUKYU / NO RANK', rank: '無',
    belt: 'WHITE',
    identity: 'The bow. The stance. The first punch.',
    skills: ['Mokuso & Rei', 'Zenkutsu-dachi', 'Oi-zuki / Gyaku-zuki', 'Mae-geri', 'Kiai Timing'],
    checklist: [
      'Rei performed correctly at start and close of class — without prompting, without rushing',
      'Mokuso held for 1 minute in seiza — eyes closed, breathing settled',
      'Zenkutsu-dachi maintained through 20 consecutive kihon reps without coach correction',
      'Oi-zuki and gyaku-zuki with hip rotation as the power source — not arm-only',
      'Three blocks demonstrated on command: gedan-barai, age-uke, soto-uke',
      'Mae-geri with correct chamber, thrust, and return — both sides',
      'Kiai produced at correct moments without prompting',
      '18+ sessions logged',
      'Coach signoff',
    ],
    sessions: '18+ SESSIONS',
  },
  {
    levelKey: 'orange', num: 2,
    label: 'ORANGE BELT', grade: '8TH–7TH KYU', rank: '8K',
    belt: 'ORANGE',
    identity: 'The roundhouse exists. The kata lives in the body.',
    skills: ['Mawashi-geri', 'Yoko-geri', 'Shuto-uke', 'Kizami + Gyaku Combo', 'Taikyoku / Pinan Kata'],
    checklist: [
      'Mawashi-geri demonstrated with hip load and pivot — both sides, 10 reps',
      'Yoko-geri (side kick) — chamber and thrust, not a swing',
      'Shuto-uke (knife-hand block) — edge of hand, correct elbow position on contact',
      'Kizami-zuki + gyaku-zuki combination — jab sets, reverse commits',
      'First kata from memory: Taikyoku Shodan or Pinan Shodan — no prompting, correct direction changes, kiai in position',
      'Kihon ippon kumite: 5 attack-block-counter sequences without breaking form',
      'Distance awareness: adjusts maai without coach prompting in partner drilling',
      '18+ additional sessions (36+ cumulative)',
      'Coach signoff — "the kata is in the body, not in the head"',
    ],
    sessions: '36+ CUMULATIVE',
  },
  {
    levelKey: 'green', num: 3,
    label: 'GREEN BELT', grade: '5TH–4TH KYU', rank: '5K',
    belt: 'GREEN',
    identity: 'Combinations flow. Free sparring begins.',
    skills: ['Ushiro-geri', 'Hiza-geri', 'Empi-uchi', 'Kick-Punch-Kick', 'Jiyu Kumite Entry'],
    checklist: [
      'Ushiro-geri (back kick) — looks before kicking, heel drives straight back',
      'Hiza-geri (knee strike) — pulls opponent into knee, head or collar control established',
      'Empi-uchi (elbow): horizontal and downward — weight behind it, not a wing motion',
      'Kick-punch-kick combination: fluid, no pause to reset between weapons',
      'Second kata from memory — complete, correct, no stopping',
      'One round of jiyu kumite (free sparring) completed without warning for illegal technique, uncontrolled contact, or unsafe behavior',
      'Contact calibration demonstrated: three levels on command (touch / controlled / committed)',
      '28+ additional sessions (64+ cumulative)',
      'Coach signoff — "this athlete can spar without injuring their partner"',
    ],
    sessions: '64+ CUMULATIVE',
  },
  {
    levelKey: 'blue', num: 4,
    label: 'BLUE BELT', grade: '3RD KYU', rank: '3K',
    belt: 'BLUE',
    identity: 'You have a style. Counter-attack timing exists.',
    skills: ['Kumite Style Named', 'De Ashi Barai', 'Go/Tai/Sen No Sen', 'Advanced Kata', 'Kata Bunkai'],
    checklist: [
      'Kumite style named by athlete — confirmed by coach as accurate',
      'De ashi barai (front sweep) — timed off weight transfer',
      'Three timing concepts demonstrated in slow drilling: go no sen, tai no sen, sen no sen',
      'Advanced kata complete from memory with correct rhythm',
      'Kata bunkai: 3 practical applications demonstrated against cooperative partner — validity confirmed by coach',
      '8+ distinct attack combinations demonstrable on command',
      '3 rounds of jissen kumite (full or near-full contact, style-appropriate rules) completed',
      '40+ additional sessions (104+ cumulative)',
      'Coach signoff — "the kata has meaning to this athlete, they do not just perform it"',
    ],
    sessions: '104+ CUMULATIVE',
  },
  {
    levelKey: 'brown', num: 5,
    label: 'BROWN BELT', grade: '1ST–2ND KYU', rank: '1K',
    belt: 'BROWN',
    identity: 'The break. The beginning of ikken hissatsu.',
    skills: ['Tameshiwari', 'Sparring Combinations', 'Counter from Live Kumite', 'Teaching White Belt', 'Kata with Commentary'],
    checklist: [
      'Tameshiwari: one successful break documented (board, tile, or equivalent — coach witnessed)',
      '5+ combination sequences that work in controlled sparring — not just drilling',
      'One unscripted counter observed by coach in live kumite — reads opening, takes it',
      'Teaching session: takes a white belt through one technique — execution improves measurably in that session',
      'Kata with verbal commentary: explains each move\'s purpose while performing — bunkai context accurate',
      'Continuous training standard completed without stopping (standard set by coach, style-appropriate)',
      '55+ additional sessions (159+ cumulative)',
      'Coach signoff — "this athlete is ready to be called a student of karate-do, not just a practitioner of karate"',
    ],
    sessions: '159+ CUMULATIVE',
    tameshiwari: true,
  },
  {
    levelKey: 'black', num: 6,
    label: 'BLACK BELT', grade: 'SHODAN / 1ST DAN', rank: '段',
    belt: 'BLACK',
    identity: 'The beginning of real study. Not the end.',
    skills: ['All Kyu Techniques', 'Full Kata Library', 'Complete Class Independently', 'Articulate the Do', 'Coach Conversation Required'],
    checklist: [
      'Coach conversation required — Shodan is not a technique review. It is a philosophical conversation.',
      'All kyu-level techniques demonstrable on command — correct form, power, and intent',
      'Full kata library demonstrable from memory',
      'Bunkai for every taught kata demonstrable against cooperative partner',
      'Leads a complete class independently: bow-in to bow-out',
      'Can articulate what the do suffix means — in a real conversation, not a performance',
      'Names the one karate principle that has changed how they think outside the dojo',
      'Kumite record across 3+ months of consistent sparring',
      '80+ additional sessions (239+ cumulative)',
      'Coach verbal: "This person could walk into any dojo in the world, bow correctly, and be welcomed as a serious practitioner"',
    ],
    sessions: '239+ CUMULATIVE',
    shodan: true,
  },
];

function beltNumFromKey(levelKey: string): number {
  const idx = TIERS.findIndex(t => t.levelKey === levelKey);
  return idx >= 0 ? idx + 1 : 1;
}

export default function KarateRoadmapClient({
  currentBeltKey,
  lineage,
}: {
  currentBeltKey: string;
  lineage: string;
}) {
  const currentNum = beltNumFromKey(currentBeltKey);
  const [selectedNum, setSelectedNum] = useState(currentNum);
  const selected = TIERS[selectedNum - 1] ?? TIERS[0];
  const belt = BELT[selected.belt] ?? BELT.WHITE;

  const lineageLabel =
    lineage === 'kyokushin' ? 'KYOKUSHIN' :
    lineage === 'goju_ryu'  ? 'GOJU-RYU'  :
    'SHOTOKAN';

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 96, position: 'relative' }}>

      {/* Background — dark dojo, warm amber radial */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: '#060503' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 65% 42% at 50% 0%, rgba(200,148,58,0.07) 0%, transparent 68%)',
        }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── BrandNav ── */}
        <BrandNav backHref="/progression" glass={false} />

        {/* ── Page title ── */}
        <div style={{
          padding: '0 20px 14px',
          borderBottom: '1px solid rgba(200,148,58,0.14)',
        }}>
          <div style={{
            fontFamily: fonts.header, fontSize: 30, letterSpacing: '0.10em',
            color: '#fff', lineHeight: 1,
            textShadow: '0 2px 16px rgba(0,0,0,0.90)',
          }}>KARATE</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <div style={{
              fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
              color: DIM,
            }}>ONE TECHNIQUE. PERFECT. ONCE.</div>
            <div style={{
              fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.18em',
              color: 'rgba(200,148,58,0.35)',
            }}>{lineageLabel}</div>
          </div>
        </div>

        {/* ── Belt progress bar ── */}
        <div style={{
          padding: '10px 16px 0',
          background: 'rgba(6,5,3,0.40)',
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {TIERS.map((t) => {
              const isDone    = t.num < currentNum;
              const isCurrent = t.num === currentNum;
              const b         = BELT[t.belt] ?? BELT.WHITE;
              return (
                <div
                  key={t.levelKey}
                  style={{
                    flex: 1, height: 3,
                    background: isDone
                      ? b.border
                      : isCurrent
                        ? AMBER
                        : 'rgba(242,239,232,0.08)',
                  }}
                />
              );
            })}
          </div>
          <div style={{
            fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.20em',
            color: DIM, marginTop: 5, paddingBottom: 10,
          }}>
            {TIERS[currentNum - 1]?.grade ?? ''} — {TIERS[currentNum - 1]?.label ?? ''}
          </div>
        </div>

        {/* ── Belt strip ── */}
        <div style={{
          padding: '16px 14px 14px',
          borderBottom: '1px solid rgba(200,148,58,0.08)',
          background: 'rgba(6,5,3,0.30)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {TIERS.map((t) => {
              const isDone     = t.num < currentNum;
              const isCurrent  = t.num === currentNum;
              const isSelected = t.num === selectedNum;
              const isLocked   = t.num > currentNum;
              const b          = BELT[t.belt] ?? BELT.WHITE;

              const ringColor = isSelected
                ? (isCurrent ? AMBER : b.border)
                : isDone
                  ? b.border + '55'
                  : 'rgba(242,239,232,0.08)';

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
                  {/* Belt circle */}
                  <div style={{
                    width: 44, height: 44,
                    borderRadius: '50%',
                    border: '2px solid ' + ringColor,
                    background: isSelected
                      ? b.bg
                      : isLocked
                        ? 'rgba(6,5,3,0.20)'
                        : 'rgba(6,5,3,0.30)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isSelected && isCurrent
                      ? '0 0 12px rgba(200,148,58,0.30)'
                      : isSelected
                        ? ('0 0 10px ' + b.border + '55')
                        : 'none',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      fontFamily: fonts.label,
                      fontSize: t.rank === '段' ? 13 : 9,
                      letterSpacing: t.rank === '段' ? '0' : '0.04em',
                      color: isSelected
                        ? b.text
                        : isLocked
                          ? 'rgba(242,239,232,0.12)'
                          : isDone
                            ? b.border
                            : 'rgba(242,239,232,0.40)',
                      lineHeight: 1,
                    }}>{t.rank}</div>
                  </div>
                  {/* Belt label */}
                  <div style={{
                    fontFamily: fonts.label,
                    fontSize: 6,
                    letterSpacing: '0.06em',
                    color: isSelected
                      ? b.text
                      : isLocked
                        ? 'rgba(242,239,232,0.10)'
                        : 'rgba(242,239,232,0.28)',
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                  }}>{b.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div>

          {/* Hero — belt color block */}
          <div style={{
            position: 'relative',
            padding: '28px 20px 24px',
            borderBottom: '1px solid rgba(200,148,58,0.10)',
            overflow: 'hidden',
          }}>
            {/* Left bar — belt color */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: 5,
              background: belt.border,
            }}/>
            {/* Belt color fill */}
            <div style={{
              position: 'absolute', inset: 0,
              background: belt.bg,
            }}/>
            {/* Content */}
            <div style={{ position: 'relative' }}>
              {/* Grade — top right */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.18em',
                color: belt.text,
              }}>{selected.grade}</div>
              {/* Belt name */}
              <div style={{
                fontFamily: fonts.header, fontSize: 28, letterSpacing: '0.08em',
                color: '#fff', lineHeight: 1.0,
              }}>{selected.label}</div>
              {/* Lineage sub */}
              <div style={{
                fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.22em',
                color: belt.text, marginTop: 6,
              }}>{lineageLabel}</div>
              {/* Identity line */}
              <div style={{
                fontFamily: fonts.body, fontSize: 12, letterSpacing: '0.04em',
                color: 'rgba(242,239,232,0.65)', marginTop: 12, fontStyle: 'italic',
              }}>{selected.identity}</div>
            </div>
          </div>

          {/* Tameshiwari notice — Brown belt only */}
          {selected.tameshiwari && (
            <div style={{
              margin: '14px 16px 0',
              padding: '11px 13px',
              background: 'rgba(200,148,58,0.05)',
              border: '1px solid rgba(200,148,58,0.16)',
              borderLeft: '3px solid rgba(200,148,58,0.45)',
            }}>
              <div style={{
                fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.18em',
                color: 'rgba(200,148,58,0.70)',
              }}>TAMESHIWARI REQUIRED — ONE SUCCESSFUL BREAK. COACH WITNESSED.</div>
              <div style={{
                fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.03em',
                color: 'rgba(242,239,232,0.45)', marginTop: 6,
              }}>Board, tile, or equivalent — standard set by coach and lineage.</div>
            </div>
          )}

          {/* Shodan notice — Black belt only */}
          {selected.shodan && (
            <div style={{
              margin: '14px 16px 0',
              padding: '11px 13px',
              background: 'rgba(200,148,58,0.05)',
              border: '1px solid rgba(200,148,58,0.16)',
              borderLeft: '3px solid rgba(200,148,58,0.45)',
            }}>
              <div style={{
                fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.18em',
                color: 'rgba(200,148,58,0.70)',
              }}>SHODAN — THE BEGINNING OF REAL STUDY</div>
              <div style={{
                fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.03em',
                color: 'rgba(242,239,232,0.45)', marginTop: 6,
              }}>不 — Shodan is not a rank of mastery. It is the first day of serious practice. Everything before it was preparation.</div>
            </div>
          )}

          {/* Focus areas */}
          <div style={{ padding: '16px 16px 0' }}>
            <div style={{
              fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
              color: DIM, marginBottom: 10,
            }}>FOCUS AREAS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {selected.skills.map((s) => (
                <div key={s} style={{
                  padding: '6px 11px',
                  background: 'rgba(200,148,58,0.04)',
                  border: '1px solid rgba(200,148,58,0.14)',
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
              color: DIM, marginBottom: 12,
            }}>REQUIREMENTS — {selected.sessions}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selected.checklist.map((item, i) => {
                const done = selected.num < currentNum;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                    <div style={{
                      width: 17, height: 17, flexShrink: 0, marginTop: 1,
                      border: '1px solid ' + (done ? 'rgba(200,148,58,0.40)' : 'rgba(242,239,232,0.18)'),
                      borderRadius: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? 'rgba(200,148,58,0.10)' : 'transparent',
                    }}>
                      {done && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5 4-4" stroke={AMBER} strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round"/>
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

          {/* Lineage note */}
          <div style={{
            margin: '12px 16px 0',
            padding: '10px 13px',
            background: 'rgba(200,148,58,0.04)',
            border: '1px solid rgba(200,148,58,0.09)',
          }}>
            <div style={{
              fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.16em',
              color: 'rgba(200,148,58,0.40)',
            }}>
              IRON ARMY · {lineageLabel} LINEAGE — ALL CRITERIA SUBJECT TO COACH VERIFICATION
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
