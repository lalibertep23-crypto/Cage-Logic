'use client';

// Sambo Roadmap — Soviet classification system.
// 6 tiers: Новичок → Третий разряд → Второй разряд → Первый разряд → КМС → МС
// Badge strip: CSS kurtka-color circles — no image dependencies.
// Accent: Soviet red #B83A30. Background: cinematic dark + red radial.
// Copy voice: Soviet-dry. Numbers and classifications. No celebration.

import { useState } from 'react';
import { BrandNav } from '@/components/ui/brand-nav';
import { C, fonts } from '@/lib/design-tokens';

type Tier = {
  levelKey: string;
  num:      number;
  label:    string;    // Cyrillic primary classification name
  sublabel: string;    // English / transliteration
  rank:     string;    // Short display: НОВ / 3Р / 2Р / 1Р / КМС / МС
  image:    string;    // Tier atmospheric image
  kurtka:   string;    // Color system key
  identity: string;
  skills:   string[];
  checklist: string[];
  sessions: string;
};

const RED  = '#B83A30';
const GOLD = '#C8943A';

// Kurtka color system — mirrors Soviet kurtka progression
const KURTKA: Record<string, { bg: string; border: string; text: string; label: string }> = {
  GREY:  { bg: 'rgba(130,128,120,0.18)', border: 'rgba(160,158,150,0.55)', text: 'rgba(190,188,180,0.90)', label: 'СЕРЫЙ' },
  GREEN: { bg: 'rgba(40,90,50,0.22)',    border: 'rgba(55,115,65,0.65)',   text: 'rgba(80,155,90,0.90)',  label: 'ЗЕЛЁНЫЙ' },
  RED:   { bg: 'rgba(130,38,30,0.22)',   border: 'rgba(170,50,42,0.65)',   text: 'rgba(200,70,60,0.90)',  label: 'КРАСНЫЙ' },
  BADGE: { bg: 'rgba(130,38,30,0.26)',   border: 'rgba(190,60,50,0.80)',   text: 'rgba(210,80,68,0.95)',  label: 'КР+ЗНАК' },
  MEDAL: { bg: 'rgba(20,38,72,0.30)',    border: 'rgba(70,95,150,0.65)',   text: 'rgba(110,140,200,0.95)', label: 'КМС' },
  GOLD:  { bg: 'rgba(120,85,18,0.28)',   border: 'rgba(200,148,58,0.80)',  text: 'rgba(200,148,58,0.95)', label: 'МС' },
};

const TIERS: Tier[] = [
  {
    levelKey: 'level_1', num: 1,
    label: 'Новичок', sublabel: 'NOVICE', rank: 'НОВ',
    image: '/sambo-foundation.png',
    kurtka: 'GREY',
    identity: 'You fall safely. You grip with intent.',
    skills: ['Falling — Укеми', 'Kurtka Grip', 'Sambist Stance', 'Single Leg Entry', 'Hold-Down Control'],
    checklist: [
      'All four ukemi demonstrated without hesitation or injury',
      'Three kurtka grips demonstrated on command — purposeful, not grabbing',
      'Sambist stance maintained under light drilling pressure for a full round',
      'Single-leg takedown finished in live drilling (not cooperative)',
      'Side control held for 20 seconds against 50% resistance',
      'Hip throw to back landing on cooperative partner — back landing confirmed by coach',
      '20+ sessions logged',
      'Coach signoff',
    ],
    sessions: '20+ SESSIONS',
  },
  {
    levelKey: 'level_2', num: 2,
    label: 'Третий разряд', sublabel: 'THIRD CATEGORY', rank: '3Р',
    image: '/sambo-control.png',
    kurtka: 'GREEN',
    identity: 'Your throws have landing logic. First leg locks.',
    skills: ['Back-Landing Throws', 'Heel Hook Entry', 'Kneebar & Ankle Lock', 'Throw Combinations', 'Match Scoring'],
    checklist: [
      'Three distinct throws completed to back landing in live drilling',
      'Heel hook applied correctly in coaching drilling — tap confirmed, no injury',
      'Kneebar and straight ankle lock demonstrated from top position',
      'Throw combination executed: miss first throw, enter second without disengaging',
      'Match scoring: correctly identifies back vs. hip vs. minor score — 5 of 5',
      '30+ sessions logged',
      "Coach signoff — \"this athlete's throws have landing logic\"",
    ],
    sessions: '30+ SESSIONS',
  },
  {
    levelKey: 'level_3', num: 3,
    label: 'Второй разряд', sublabel: 'SECOND CATEGORY', rank: '2Р',
    image: '/sambo-pressure.png',
    kurtka: 'RED',
    identity: 'You have a suplex. You are dangerous.',
    skills: ['Back Arch Suplex', 'Inside Heel Hook', 'Throw-to-Leg Chain', 'Pattern Recognition', 'Round Management'],
    checklist: [
      'Back arch suplex demonstrated on cooperative partner — safety protocol confirmed by coach',
      'Inside heel hook in controlled live drilling — 3 sessions documented, no injuries',
      'Throw-to-leg-attack chain executed in live drilling without pause',
      'Opponent pattern identified within 90 seconds: throw-biased vs. leg-lock-biased',
      '5-minute live round maintained with technical intent — coach observed, no fade',
      '45+ sessions logged',
      'Coach signoff',
    ],
    sessions: '45+ SESSIONS',
  },
  {
    levelKey: 'level_4', num: 4,
    label: 'Первый разряд', sublabel: 'FIRST CATEGORY', rank: '1Р',
    image: '/sambo-dominance.png',
    kurtka: 'BADGE',
    identity: 'You are a sambo player. Not a visitor.',
    skills: ['8-Throw Portfolio', 'Full Leg Lock Portfolio', 'Competition Results', 'Coaching Competency', 'Technical Lineage'],
    checklist: [
      '8 distinct throws demonstrable on command from both grip sides',
      'Full leg lock portfolio: ankle lock, kneebar, toehold, outside heel hook, inside heel hook',
      '2+ documented competition results at sanctioned sambo events — OR coach-evaluated equivalent',
      'Coaching competency: runs a Novice-level drilling session independently',
      "Can explain sambo's technical lineage and its contribution to modern MMA accurately",
      '70+ sessions logged',
      "Coach signoff — \"this athlete is a resource for this gym\"",
    ],
    sessions: '70+ SESSIONS',
  },
  {
    levelKey: 'level_5', num: 5,
    label: 'КМС', sublabel: 'КАНДИДАТ В МАСТЕРА СПОРТА', rank: 'КМС',
    image: '/sambo-composure.png',
    kurtka: 'MEDAL',
    identity: 'Sambo is how you think.',
    skills: ['Tiers 1–4 Mastered', 'Competition Record', 'Teaching Output', 'Coach Nomination Required'],
    checklist: [
      'Coach conversation required — КМС is not a checklist promotion',
      'All Tiers 1–4 techniques demonstrable with quality on command',
      'Match control: forces match into chosen domain (throw vs. leg lock) consistently',
      'Teaching output: a beginner who learned from this athlete is technically sound',
      '4+ documented competition results — OR elite coaching evaluation equivalent',
      'Coach verbal: "This person could walk into any sambo room in the world and be respected immediately"',
    ],
    sessions: '100+ SESSIONS',
  },
  {
    levelKey: 'level_6', num: 6,
    label: 'МС', sublabel: 'МАСТЕР СПОРТА', rank: 'МС',
    image: '/sambo-mastery.png',
    kurtka: 'GOLD',
    identity: 'The complete practitioner.',
    skills: ['Full System Mastery', 'Competition Dominance', 'Coach Reciprocity', 'Master-Level Teaching'],
    checklist: [
      'Coach conversation required — МС is not a checklist promotion',
      'All Tiers 1–5 techniques demonstrable with quality on command',
      'Forces match into chosen domain (throw vs. leg lock) consistently — documented',
      'Teaching output: a beginner who learned from this athlete is technically sound',
      '4+ documented competition results — OR elite coaching evaluation',
      'Coach verbal: "This person could walk into any sambo room in the world and be respected immediately"',
    ],
    sessions: '150+ SESSIONS',
  },
];

function tierNumFromKey(levelKey: string): number {
  const match = levelKey.match(/level_(\d)/);
  return match ? parseInt(match[1], 10) : 1;
}

export default function SamboRoadmapClient({ currentTierKey }: { currentTierKey: string }) {
  const currentNum = tierNumFromKey(currentTierKey);
  const [selectedNum, setSelectedNum] = useState(currentNum);
  const selected = TIERS[selectedNum - 1] ?? TIERS[0];
  const kurtka   = KURTKA[selected.kurtka] ?? KURTKA.GREY;

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 96, position: 'relative' }}>

      {/* Background — cinematic dark, Soviet red radial */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: '#060402' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(184,58,48,0.09) 0%, transparent 70%)',
        }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── BrandNav ── */}
        <BrandNav backHref="/progression" glass={false} />

        {/* ── Cinematic Hero ── */}
        <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/sambo-gym-hero.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            filter: 'saturate(0.55) contrast(1.20) brightness(0.48)',
          }} />
          {/* Red-tinted gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(6,4,2,0.20) 0%, rgba(6,4,2,0.10) 30%, rgba(6,4,2,0.85) 72%, rgba(6,4,2,1.0) 100%), linear-gradient(to right, rgba(6,4,2,0.92) 0%, rgba(6,4,2,0.08) 65%)',
          }} />
          {/* Soviet red vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 70% 0%, rgba(184,58,48,0.18) 0%, transparent 60%)',
          }} />
          {/* Title — bottom-left */}
          <div style={{ position: 'absolute', bottom: 18, left: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 38, background: RED, flexShrink: 0 }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <div style={{ fontFamily: fonts.header, fontSize: 30, letterSpacing: '0.10em', lineHeight: 1, color: '#F2EFE8' }}>САМБО</div>
                  <div style={{ fontFamily: fonts.header, fontSize: 18, letterSpacing: '0.14em', lineHeight: 1, color: 'rgba(242,239,232,0.45)' }}>SAMBO</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                  <div style={{ fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.18em', color: 'rgba(184,58,48,0.80)' }}>САМООБОРОНА БЕЗ ОРУЖИЯ</div>
                  <div style={{ width: 1, height: 10, background: 'rgba(184,58,48,0.35)' }} />
                  <div style={{ fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.14em', color: 'rgba(242,239,232,0.35)' }}>SELF-DEFENSE WITHOUT WEAPONS</div>
                </div>
              </div>
            </div>
          </div>
          {/* Current tier badge — top right */}
          <div style={{
            position: 'absolute', top: 14, right: 14,
            padding: '4px 10px',
            background: 'rgba(184,58,48,0.18)',
            border: '1px solid rgba(184,58,48,0.40)',
          }}>
            <div style={{ fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.20em', color: 'rgba(184,58,48,0.80)' }}>
              РАЗРЯД {currentNum} / 6
            </div>
          </div>
        </div>

        {/* ── Tier progress bar ── */}
        <div style={{
          padding: '10px 16px 0',
          background: 'rgba(6,4,2,0.40)',
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
                    background: isDone ? RED : isCurrent ? GOLD : 'rgba(242,239,232,0.08)',
                  }}
                />
              );
            })}
          </div>
          <div style={{
            fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.20em',
            color: 'rgba(184,58,48,0.55)', marginTop: 5, paddingBottom: 10,
          }}>
            TIER {currentNum} OF 6 — {TIERS[currentNum - 1]?.label ?? ''}
          </div>
        </div>

        {/* ── Soviet classification strip ── */}
        <div style={{
          padding: '16px 14px 14px',
          borderBottom: '1px solid rgba(184,58,48,0.08)',
          background: 'rgba(6,4,2,0.30)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {TIERS.map((t) => {
              const isDone     = t.num < currentNum;
              const isCurrent  = t.num === currentNum;
              const isSelected = t.num === selectedNum;
              const isLocked   = t.num > currentNum;
              const k          = KURTKA[t.kurtka] ?? KURTKA.GREY;

              const ringColor = isSelected
                ? (isCurrent ? GOLD : k.border)
                : isDone
                  ? 'rgba(184,58,48,0.30)'
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
                  {/* Kurtka color circle */}
                  <div style={{
                    width: 44, height: 44,
                    borderRadius: '50%',
                    border: '2px solid ' + ringColor,
                    background: isSelected
                      ? k.bg
                      : isLocked
                        ? 'rgba(6,4,2,0.20)'
                        : 'rgba(6,4,2,0.30)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isSelected && isCurrent
                      ? '0 0 12px rgba(200,148,58,0.30)'
                      : isSelected
                        ? ('0 0 10px ' + k.border + '55')
                        : 'none',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      fontFamily: fonts.label,
                      fontSize: t.rank.length > 2 ? 7 : 9,
                      letterSpacing: '0.04em',
                      color: isSelected
                        ? k.text
                        : isLocked
                          ? 'rgba(242,239,232,0.12)'
                          : isDone
                            ? 'rgba(184,58,48,0.45)'
                            : 'rgba(242,239,232,0.40)',
                      lineHeight: 1,
                    }}>{t.rank}</div>
                  </div>
                  {/* Kurtka label */}
                  <div style={{
                    fontFamily: fonts.label,
                    fontSize: 6,
                    letterSpacing: '0.06em',
                    color: isSelected
                      ? k.text
                      : isLocked
                        ? 'rgba(242,239,232,0.10)'
                        : 'rgba(242,239,232,0.28)',
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                  }}>{k.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div>

          {/* Hero — tier image + kurtka color overlay + classification name */}
          <div style={{
            position: 'relative',
            height: 140,
            borderBottom: '1px solid rgba(184,58,48,0.12)',
            overflow: 'hidden',
          }}>
            {/* Tier atmospheric image */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${selected.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'saturate(0.60) contrast(1.10) brightness(0.45)',
            }}/>
            {/* Kurtka color wash */}
            <div style={{
              position: 'absolute', inset: 0,
              background: kurtka.bg,
              opacity: 0.55,
            }}/>
            {/* Dark gradient for text legibility */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(6,4,2,0.10) 0%, rgba(6,4,2,0.75) 80%)',
            }}/>
            {/* Left bar — kurtka color */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
              background: kurtka.border,
            }}/>
            {/* Kurtka label — top right */}
            <div style={{
              position: 'absolute', top: 10, right: 14,
              fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.18em',
              color: kurtka.text,
              textShadow: '0 1px 6px rgba(0,0,0,0.80)',
            }}>{kurtka.label}</div>
            {/* Classification name — bottom left */}
            <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{
                  fontFamily: fonts.header, fontSize: 24, letterSpacing: '0.08em',
                  color: '#fff', lineHeight: 1.0,
                  textShadow: '0 2px 12px rgba(0,0,0,0.90)',
                }}>{selected.label}</div>
                <div style={{
                  fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.18em',
                  color: 'rgba(242,239,232,0.45)',
                }}>{selected.sublabel}</div>
              </div>
              <div style={{
                fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.04em',
                color: 'rgba(242,239,232,0.70)', marginTop: 4, fontStyle: 'italic',
                textShadow: '0 1px 8px rgba(0,0,0,0.90)',
              }}>{selected.identity}</div>
            </div>
          </div>

          {/* Focus areas */}
          <div style={{ padding: '16px 16px 0' }}>
            <div style={{
              fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
              color: 'rgba(184,58,48,0.55)', marginBottom: 10,
            }}>FOCUS AREAS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {selected.skills.map((s) => (
                <div key={s} style={{
                  padding: '6px 11px',
                  background: 'rgba(184,58,48,0.05)',
                  border: '1px solid rgba(184,58,48,0.16)',
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
              color: 'rgba(184,58,48,0.55)', marginBottom: 12,
            }}>REQUIREMENTS — {selected.sessions}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selected.checklist.map((item, i) => {
                const done = selected.num < currentNum;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                    <div style={{
                      width: 17, height: 17, flexShrink: 0, marginTop: 1,
                      border: '1px solid ' + (done ? 'rgba(184,58,48,0.40)' : 'rgba(242,239,232,0.18)'),
                      borderRadius: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? 'rgba(184,58,48,0.10)' : 'transparent',
                    }}>
                      {done && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5 4-4" stroke={RED} strokeWidth="1.5"
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

          {/* МС note — Tier 6 only */}
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
              }}>МС — МАСТЕР СПОРТА. THE RANK ON THE KURTKA SPEAKS.</div>
            </div>
          )}

          {/* Russian footer — cultural attribution */}
          <div style={{
            margin: '12px 16px 0',
            padding: '12px 14px',
            background: 'rgba(184,58,48,0.05)',
            border: '1px solid rgba(184,58,48,0.12)',
            borderLeft: '3px solid rgba(184,58,48,0.35)',
          }}>
            <div style={{
              fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.14em',
              color: 'rgba(184,58,48,0.75)',
            }}>САМБО — САМООБОРОНА БЕЗ ОРУЖИЯ</div>
            <div style={{
              fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.16em',
              color: 'rgba(242,239,232,0.28)', marginTop: 4,
            }}>РАЗРАБОТАНО В СССР · 1938 · ХАРЛАМПИЕВ / DEVELOPED IN USSR · 1938 · KHARLAMPIEV</div>
            <div style={{
              fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.12em',
              color: 'rgba(184,58,48,0.30)', marginTop: 8,
            }}>IRON ARMY · TOMS RIVER, NJ — ВСЕ КРИТЕРИИ ПОДТВЕРЖДАЮТСЯ ТРЕНЕРОМ</div>
          </div>

        </div>
      </div>
    </main>
  );
}
