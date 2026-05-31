// Home screen — rebuilt from mockup 2026-05-22.
// Octagon score frame. Segmented domain bars. Split PUNCH IN.
// All content preserved: score, domains, today, week, nudge, stripe track, mental CTA, quote.

import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { differenceInCalendarDays, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import { loadHomeData } from '@/lib/score/loadHomeData';
import { RAMPING_DAYS } from '@/lib/score/computeInvestmentScore';
import { getTodayQuote } from '@/lib/daily-quotes';
import { C } from '@/lib/design-tokens';

export const dynamic = 'force-dynamic';

const green = '#5C8A3C';

function getStreakColor(streak: number): string {
  if (streak >= 4) return green;
  if (streak >= 1) return C.amber;
  return C.brick;
}

function getScoreColor(sessions7: number): string {
  if (sessions7 >= 4) return green;
  if (sessions7 >= 2) return C.amber;
  return C.brick;
}

function getDomainColor(pct: number): string {
  if (pct >= 70) return green;
  if (pct >= 40) return C.amber;
  return C.brick;
}

// ── Belt Visual ───────────────────────────────────────────────────────────────
// CSS-only: gradient body + black tip panel + white stripe marks.
// No images. Accurate to a real BJJ belt structure.
function BeltVisual({ color, stripes }: { color: string | null; stripes: number }) {
  const rank = String(color ?? 'white').toLowerCase();
  const gradients: Record<string, [string, string, string]> = {
    white:  ['#F0EDE5', '#D4D0C8', '#B0ACA4'],
    blue:   ['#2668C0', '#1A4E96', '#0F3268'],
    purple: ['#7844AA', '#5C3088', '#3C1E60'],
    brown:  ['#804020', '#5E2C10', '#3A1608'],
    black:  ['#2E2A24', '#1A1612', '#0A0806'],
  };
  const [hi, mid, lo] = gradients[rank] ?? gradients.white;

  return (
    <div style={{ display: 'flex', width: 84, height: 15, flexShrink: 0, overflow: 'hidden', border: '1px solid rgba(242,239,232,0.10)' }}>
      {/* Belt body */}
      <div style={{ flex: 1, background: `linear-gradient(180deg, ${hi} 0%, ${mid} 55%, ${lo} 100%)`, position: 'relative' }}>
        {/* Top sheen */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.18)' }}/>
        {/* Center seam */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.14)', transform: 'translateY(-50%)' }}/>
        {/* Bottom shadow */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(0,0,0,0.22)' }}/>
      </div>
      {/* Black tip panel */}
      <div style={{ width: 22, background: 'linear-gradient(180deg, #1E1A16 0%, #0A0806 100%)', position: 'relative', borderLeft: '1px solid rgba(242,239,232,0.07)', flexShrink: 0 }}>
        {Array.from({ length: Math.min(stripes, 4) }, (_, i) => (
          <div key={i} style={{ position: 'absolute', right: i * 5 + 2, top: 2, bottom: 2, width: 2.5, background: 'rgba(242,239,232,0.82)' }}/>
        ))}
      </div>
    </div>
  );
}

// ── Domain Icons ──────────────────────────────────────────────────────────────

function IconConsistency({ color }: { color: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="5" y2="12"/>
      <line x1="19" y1="12" x2="22" y2="12"/>
    </svg>
  );
}

function IconReflection({ color }: { color: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M6,21 C6,15.5 18,15.5 18,21"/>
      <path d="M16,4 L19,2"/>
      <path d="M15,6.5 L18,5"/>
    </svg>
  );
}

function IconMental({ color }: { color: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5,18 L5,13 C5,8 8,4 13,4 C18,4 21,7 21,12 C21,16 19,18 17,18"/>
      <path d="M17,18 C19,18 21,19 20,21 C19,22 17,22 16,21 L16,18"/>
      <path d="M5,18 L5,21 L16,21"/>
      <path d="M9,7 C11,9 9,12 11,15"/>
      <path d="M14,5 C16,8 14,11 16,14"/>
    </svg>
  );
}

function IconRecovery({ color }: { color: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M12,2 L12,22"/>
      <path d="M2,12 L6,12 L8,8 L10,16 L12,12 L22,12"/>
    </svg>
  );
}

function IconSelfStudy({ color }: { color: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M4,5 L12,8 L20,5 L20,19 L12,22 L4,19 Z"/>
      <path d="M12,8 L12,22"/>
    </svg>
  );
}

// ── Discipline card helpers ─────────────────────────────────────────────────
function getDisciplineImage(discipline: string, rankColor: string | null): string {
  const d = discipline.toLowerCase();
  if (d === 'bjj') {
    const map: Record<string, string> = {
      white: '/white-belt.png', blue: '/blue-belt.png',
      purple: '/purple-belt.png', brown: '/brown-belt.png',
    };
    return map[rankColor ?? 'white'] ?? '/bjj-navigation-badge.png';
  }
  if (d === 'muay_thai') {
    const map: Record<string, string> = {
      level_1: '/prajied-level1.png', level_2: '/prajied-level2.png',
      level_3: '/prajied-level3.png', level_4: '/prajied-level4.png',
      level_5: '/prajied-level5.png',
    };
    return map[rankColor ?? 'level_1'] ?? '/muay-thai-navigation-badge.png';
  }
  if (d === 'boxing')    return '/boxing-navigation-badge.png';
  if (d === 'wrestling') return '/wrestling-navigation-badge.png';
  if (d === 'mma')       return '/mma-navigation-badge.png';
  if (d === 'sambo')     return '/sambo-pressure-kurtka.png';
  return '/bjj-navigation-badge.png';
}

function getDisciplineRankLabel(discipline: string, rankColor: string | null): string {
  const d = discipline.toLowerCase();
  const r = (rankColor ?? '').toLowerCase();
  if (d === 'bjj') {
    const map: Record<string, string> = {
      white: 'WHITE', blue: 'BLUE', purple: 'PURPLE', brown: 'BROWN', black: 'BLACK',
    };
    return map[r] ?? 'WHITE';
  }
  if (d === 'muay_thai') {
    const map: Record<string, string> = {
      level_1: 'PRAJIED I', level_2: 'PRAJIED II', level_3: 'PRAJIED III',
      level_4: 'PRAJIED IV', level_5: 'PRAJIED V',
    };
    return map[r] ?? 'PRAJIED I';
  }
  if (d === 'boxing') return (rankColor ?? 'LEVEL 1').toString().replace('_', ' ').toUpperCase();
  if (d === 'wrestling') {
    const map: Record<string, string> = {
      level_1: 'TIER 1', level_2: 'TIER 2', level_3: 'TIER 3',
      level_4: 'TIER 4', level_5: 'TIER 5', level_6: 'ELITE',
    };
    return map[r] ?? 'TIER 1';
  }
  if (d === 'sambo') {
    const map: Record<string, string> = {
      level_1: 'НОВИЧОК', level_2: '3-й РАЗ', level_3: '2-й РАЗ',
      level_4: '1-й РАЗ', level_5: 'КМС', level_6: 'МС',
    };
    return map[r] ?? 'НОВИЧОК';
  }
  return (rankColor ?? '').toString().replace('_', ' ').toUpperCase();
}

// ── Wrap image — changes as athlete progresses through 30-day ramp ────────────
function getWrapImage(day: number, isRamping: boolean): string {
  if (!isRamping) return '/ready-for-war.png';
  if (day <= 4)  return '/initial-wrap.png';
  if (day <= 9)  return '/focused-tension-building.png';
  if (day <= 14) return '/hands-tightening-committment.png';
  if (day <= 19) return '/aggressive-prep-intensity.png';
  if (day <= 24) return '/lock-in-mindset.png';
  return '/ready-for-war.png';
}

function getRampDescriptor(day: number): string {
  if (day <= 9)  return 'FORMING';
  if (day <= 19) return 'BUILDING';
  if (day <= 26) return 'LOCKING IN';
  return 'READY';
}

// ── Segmented Bar (10 blocks) ─────────────────────────────────────────────────
function SegmentedBar({ filled, color }: { filled: number; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 3.5, flex: 1 }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{
          flex: 1, height: 20,
          background: i < filled ? color : 'rgba(242,239,232,0.07)',
        }}/>
      ))}
    </div>
  );
}

const DOMAIN_DEFS = [
  { key: 'consistency' as const, label: 'CONSISTENCY', Icon: IconConsistency },
  { key: 'reflection'  as const, label: 'REFLECTION',  Icon: IconReflection  },
  { key: 'mental'      as const, label: 'MENTAL',      Icon: IconMental      },
  { key: 'recovery'    as const, label: 'RECOVERY',    Icon: IconRecovery    },
  { key: 'selfStudy'   as const, label: 'SELF-STUDY',  Icon: IconSelfStudy   },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const data = await loadHomeData();
  if (!data) redirect('/');

  const { displayName, daysSinceSignup, score, today, weekly, streaks, nudge } = data;
  const supabase = await createClient();

  // Active injuries
  const { data: injuryRows } = await supabase
    .from('injury_reports').select('id')
    .eq('athlete_id', data.athleteId).is('resolved_on', null);
  const activeInjuries = (injuryRows ?? []).length;

  // Daily check-in done today?
  const todayStartIso = new Date(
    new Date().getFullYear(), new Date().getMonth(), new Date().getDate()
  ).toISOString();
  const { data: checkInToday } = await supabase
    .from('psych_assessments').select('id')
    .eq('athlete_id', data.athleteId).eq('instrument', 'daily_prompt')
    .gte('taken_at', todayStartIso).limit(1).maybeSingle();
  const didCheckInToday = checkInToday != null;

  // Stripe track
  const { data: primaryDiscipline } = await supabase
    .from('athlete_disciplines').select('rank_color, stripes, discipline')
    .eq('athlete_id', data.athleteId).eq('is_primary', true).maybeSingle();
  // All enrolled disciplines for the ranks section
  const { data: allDisciplineRows } = await supabase
    .from('athlete_disciplines').select('rank_color, stripes, discipline')
    .eq('athlete_id', data.athleteId)
    .order('is_primary', { ascending: false });
  const allDisciplines = allDisciplineRows ?? [];
  const { data: lastStripeEvent } = await supabase
    .from('progression_events').select('awarded_at')
    .eq('athlete_id', data.athleteId).eq('event_type', 'stripe')
    .order('awarded_at', { ascending: false }).limit(1).maybeSingle();
  const daysInCurrentPhase = lastStripeEvent
    ? differenceInCalendarDays(new Date(), new Date(lastStripeEvent.awarded_at as string))
    : daysSinceSignup;
  const STRIPE_THRESHOLD  = 90;
  const stripeTimeProgress = Math.min(100, (daysInCurrentPhase / STRIPE_THRESHOLD) * 100);
  const stripeTimeReady    = daysInCurrentPhase >= STRIPE_THRESHOLD;
  const scoreReady         = !score.isRamping && (score.score ?? 0) >= 65;

  const todayQuote  = getTodayQuote();
  const dateStr     = format(new Date(), 'EEE · dd MMM').toUpperCase();
  const currentDay  = Math.min(daysSinceSignup + 1, RAMPING_DAYS);
  const roundedScore    = Math.round(score.score ?? 0);
  const scoreColor      = getScoreColor(weekly.sessions);
  const streakColor     = getStreakColor(streaks.training);
  const rampPct         = Math.min(100, (currentDay / RAMPING_DAYS) * 100);
  const wrapImage       = getWrapImage(currentDay, score.isRamping);
  const rampDescriptor  = getRampDescriptor(currentDay);

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80, position: 'relative' }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        padding: '4px 2px 4px',
        position: 'absolute',
        top: 0, left: 0, right: 0,
        zIndex: 10,
        background: 'transparent',
      }}>
        <Link href="/home" style={{ textDecoration: 'none', marginTop: -14 }}>
          {/* Brain — the brand anchor */}
          <div style={{ width: 116, height: 116, position: 'relative', flexShrink: 0 }}>
            <Image
              src="/cage-logic-back-button.png"
              alt="Cage Logic"
              fill
              sizes="116px"
              style={{
                objectFit: 'contain',
                objectPosition: 'top center',
                filter: 'drop-shadow(0 2px 8px rgba(200,148,58,0.55)) drop-shadow(0 0 18px rgba(200,148,58,0.22)) drop-shadow(0 1px 3px rgba(0,0,0,0.95))',
              }}
            />
          </div>
        </Link>
        <div style={{ textAlign: 'right', paddingTop: 12 }}>
          <Link href="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, letterSpacing: '0.1em', color: C.amber, fontWeight: 600 }}>
              {(displayName ?? 'PROFILE').toUpperCase()}
            </span>
            {/* Pencil icon */}
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="square">
              <path d="M11,4H4a2,2 0 0,0-2,2v14a2,2 0 0,0 2,2h14a2,2 0 0,0 2-2v-7"/>
              <path d="M18.5,2.5a2.121,2.121 0 0,1 3,3L12,15l-4,1 1-4 9.5-9.5Z"/>
            </svg>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginTop: 5 }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dim }}>
              {streaks.training} DAY STREAK
            </span>
            {/* Colored square — earned state indicator */}
            <div style={{ width: 8, height: 8, background: streakColor, flexShrink: 0 }}/>
          </div>
          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 8,
            letterSpacing: '0.18em', color: 'rgba(242,239,232,0.35)',
            marginTop: 5,
          }}>{dateStr}</div>
        </div>
      </div>

      {/* ── Injury banner ────────────────────────────────────────────────── */}
      {activeInjuries > 0 && (
        <div style={{
          borderLeft: `2px solid ${C.brick}`, background: C.brickLow,
          padding: '10px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${C.line}`,
        }}>
          <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.12em', color: C.brick }}>
            MODIFIED MODE · {activeInjuries} ACTIVE {activeInjuries === 1 ? 'INJURY' : 'INJURIES'}
          </span>
          <Link href="/recovery" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, letterSpacing: '0.12em' }}>
            VIEW →
          </Link>
        </div>
      )}

      {/* ── Investment Score Hero ─────────────────────────────────────────── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        borderBottom: `1px solid ${C.line}`,
        height: '62vmax', minHeight: 340, maxHeight: 620,
      }}>
        {/* Fighter wrap image — state determined by day threshold */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${wrapImage})`,
          backgroundSize: '100% auto',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center 50%',
        }}/>
        {/* Gradient — preserve readability at bottom, reveal fighter above */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,4,3,0.18) 0%, rgba(5,4,3,0.06) 28%, rgba(5,4,3,0.65) 72%, rgba(5,4,3,0.97) 100%)',
        }}/>
        {/* Right-side vignette — keeps fighter face lit */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(5,4,3,0.60) 0%, rgba(5,4,3,0) 40%)',
        }}/>

        {/* Content — bottom anchor */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1, padding: '0 22px 20px' }}>

          {/* Label */}
          <div style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 13, letterSpacing: '0.26em',
            color: C.amber, marginBottom: 4,
          }}>
            INVESTMENT SCORE
          </div>

          {score.isRamping ? (
            <>
              {/* Day counter */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontFamily: 'var(--font-anton)',
                  fontSize: 48, letterSpacing: '0.02em', lineHeight: 1,
                  color: C.text,
                }}>
                  DAY {currentDay}
                </span>
                <span style={{
                  fontFamily: 'var(--font-anton)',
                  fontSize: 28, letterSpacing: '0.04em', lineHeight: 1,
                  color: C.amber, opacity: 0.75,
                }}>
                  OF {RAMPING_DAYS}
                </span>
              </div>
              {/* State descriptor */}
              <div style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: 9, letterSpacing: '0.22em',
                color: 'rgba(242,239,232,0.42)',
                marginBottom: 14,
              }}>
                {rampDescriptor}
              </div>
            </>
          ) : (
            <>
              {/* Revealed score */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                <span style={{
                  fontFamily: 'var(--font-anton)',
                  fontSize: 60, letterSpacing: '-0.01em', lineHeight: 1,
                  color: scoreColor,
                }}>
                  {String(roundedScore).padStart(2, '0')}
                </span>
                <span style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: 11, color: 'rgba(242,239,232,0.35)',
                  letterSpacing: '0.06em',
                }}>
                  / 100
                </span>
              </div>
              <Link href="/score" style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: 9, letterSpacing: '0.16em',
                color: 'rgba(242,239,232,0.38)',
                textDecoration: 'none',
                display: 'block', marginBottom: 14,
              }}>
                SEE BREAKDOWN →
              </Link>
            </>
          )}

          {/* Progress bar — 6 blocks of 5 days (tally count) */}
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: 6 }, (_, i) => {
              const threshold = (i + 1) * 5;
              const isFull    = !score.isRamping || currentDay >= threshold;
              const isActive  = score.isRamping && currentDay >= threshold - 4 && currentDay < threshold;
              const blockColor = !score.isRamping
                ? scoreColor
                : isFull
                  ? C.amber
                  : isActive
                    ? 'rgba(200,148,58,0.30)'
                    : 'rgba(242,239,232,0.07)';
              return (
                <div key={i} style={{
                  flex: 1, height: 10,
                  background: blockColor,
                }}/>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Domains ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '20px 22px 26px', borderBottom: `1px solid ${C.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 18, letterSpacing: '0.2em', color: C.text }}>DOMAINS</span>
          <Link href="/score" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.amber,
            letterSpacing: '0.12em', textDecoration: 'none',
            border: `1px solid ${C.amber}`, padding: '4px 10px',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            FULL BREAKDOWN <span>→</span>
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {DOMAIN_DEFS.map((d) => {
            const pct    = Math.max(0, Math.min(100, score.domains[d.key]));
            const filled = Math.round(pct / 10);
            const color  = getDomainColor(pct);
            return (
              <div key={d.key}>
                {/* Label row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 20, flexShrink: 0 }}>
                    <d.Icon color={color}/>
                  </div>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.14em', color: C.text, flex: 1 }}>
                    {d.label}
                  </span>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 22, letterSpacing: '0.06em', color, lineHeight: 1 }}>
                      {filled}
                    </span>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: 'rgba(242,239,232,0.30)', letterSpacing: '0.08em', marginLeft: 3 }}>
                      / 10
                    </span>
                  </div>
                </div>
                {/* Bar row */}
                <SegmentedBar filled={filled} color={color}/>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Today + PUNCH IN ─────────────────────────────────────────────── */}
      <div style={{ borderBottom: `1px solid ${C.line}` }}>
        {/* Today row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 22px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.14em', color: C.dim }}>TODAY</span>
            <span style={{ fontFamily: 'var(--font-anton)', fontSize: 28, letterSpacing: '0.04em' }}>
              {today.loggedToday ? 'LOGGED' : 'NOT YET'}
            </span>
            {today.loggedToday && today.sessionType && (
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.dim, letterSpacing: '0.08em' }}>
                {today.sessionType.replace('_', ' ')}{today.durationMinutes ? ` · ${today.durationMinutes}MIN` : ''}
              </span>
            )}
          </div>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 14, color: C.dim }}>—</span>
        </div>

        {/* Split PUNCH IN button */}
        <Link href="/log" style={{ textDecoration: 'none', display: 'block', margin: '0 22px 14px' }}>
          <div style={{ display: 'flex', overflow: 'hidden', height: 80 }}>
            {/* Left panel: cage image */}
            <div style={{
              width: 88, flexShrink: 0,
              backgroundImage: 'url(/home-punchin.png)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'brightness(0.55)',
              border: `1px solid ${C.lineHard}`,
              borderRight: 'none',
            }}/>
            {/* Right panel: amber / muted */}
            <div style={{
              flex: 1, position: 'relative', overflow: 'hidden',
              background: today.loggedToday ? C.surface : C.amber,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 20px',
              border: `1px solid ${today.loggedToday ? C.lineHard : 'transparent'}`,
              borderLeft: 'none',
            }}>
              {/* Tally marks — combat count, bottom-right corner */}
              {!today.loggedToday && (
                <svg width={54} height={36} viewBox="0 0 54 36" fill="none"
                  style={{ position: 'absolute', right: 48, bottom: 8, opacity: 0.18 }}
                  stroke="rgba(5,5,5,0.9)" strokeWidth="1.8" strokeLinecap="round">
                  {/* Group 1: 4 verticals + diagonal */}
                  <line x1="2"  y1="4" x2="2"  y2="28"/>
                  <line x1="8"  y1="4" x2="8"  y2="28"/>
                  <line x1="14" y1="4" x2="14" y2="28"/>
                  <line x1="20" y1="4" x2="20" y2="28"/>
                  <line x1="0"  y1="28" x2="22" y2="4"/>
                  {/* Group 2: 4 verticals + diagonal */}
                  <line x1="30" y1="4" x2="30" y2="28"/>
                  <line x1="36" y1="4" x2="36" y2="28"/>
                  <line x1="42" y1="4" x2="42" y2="28"/>
                  <line x1="48" y1="4" x2="48" y2="28"/>
                  <line x1="28" y1="28" x2="50" y2="4"/>
                </svg>
              )}
              <div>
                <div style={{
                  fontFamily: 'var(--font-anton)', fontSize: 30, letterSpacing: '0.06em', lineHeight: 1,
                  color: today.loggedToday ? C.mid : C.bg,
                }}>
                  {today.loggedToday ? 'PUNCHED IN' : 'PUNCH IN'}
                </div>
                <div style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.18em', marginTop: 4,
                  color: today.loggedToday ? C.dimmer : 'rgba(5,5,5,0.55)',
                }}>
                  {today.loggedToday ? "EDIT TODAY'S LOG" : "LOG TODAY'S SESSION"}
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 22, color: today.loggedToday ? C.dim : C.bg }}>→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ── This Week ────────────────────────────────────────────────────── */}
      <div style={{ padding: '14px 22px 18px', borderBottom: `1px solid ${C.line}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 18, letterSpacing: '0.2em', color: C.text }}>THIS WEEK</span>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.dim, letterSpacing: '0.1em' }}>
            {format(new Date(), 'MMM d').toUpperCase()} — 7 DAYS
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { n: weekly.sessions,    label: 'SESSIONS',    gap: weekly.sessions < 2 },
            { n: weekly.reflections, label: 'REFLECTIONS', gap: weekly.reflections === 0 },
            { n: weekly.rolls,       label: 'ROLLS',       gap: false },
          ].map((s, i) => (
            <div key={i} style={{
              paddingLeft: i === 0 ? 0 : 16,
              paddingRight: i === 2 ? 0 : 16,
              borderRight: i < 2 ? `1px solid ${C.line}` : 'none',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-anton)', fontSize: 58, lineHeight: 0.9,
                letterSpacing: '-0.02em', color: s.gap ? C.brick : C.text,
              }}>
                {String(s.n).padStart(2, '0')}
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.12em', color: s.gap ? C.brick : C.mid }}>
                  {s.label}
                </div>
                {s.gap && (
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.brick, marginTop: 2 }}>
                    → GAP
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ── Active Ranks ─────────────────────────────────────────────────── */}
      {allDisciplines.length > 0 && (
        <div style={{ borderBottom: `1px solid ${C.line}` }}>
          <div style={{ padding: '14px 22px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.26em', color: C.mid }}>ACTIVE RANKS</span>
            <Link href='/progression' style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.amber, letterSpacing: '0.12em', textDecoration: 'none' }}>VIEW ALL →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: '0 22px 16px' }}>
            {allDisciplines.slice(0, 4).map((d, i) => {
              const img = getDisciplineImage(d.discipline as string, d.rank_color as string | null);
              const rankLabel = getDisciplineRankLabel(d.discipline as string, d.rank_color as string | null);
              const stripes = (d.stripes as number) ?? 0;
              const dispName = (d.discipline as string).replace('_', ' ').toUpperCase();
              return (
                <Link key={i} href={`/progression/${(d.discipline as string).replace('_', '-')}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden',
                    border: '1px solid rgba(200,148,58,0.28)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.65), 0 0 0 1px rgba(200,148,58,0.06)',
                  }}>
                    {/* Card image */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `url(${img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'brightness(0.80) saturate(0.85)',
                    }} />
                    {/* Overlay gradient */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, top: '45%',
                      background: 'linear-gradient(to top, rgba(5,4,3,0.97) 0%, rgba(5,4,3,0.70) 50%, rgba(5,4,3,0) 100%)',
                      padding: '0 10px 10px',
                      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    }}>
                      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 11, letterSpacing: '0.26em', color: C.amber, lineHeight: 1 }}>{dispName}</div>
                      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.text, letterSpacing: '0.06em', marginTop: 3, lineHeight: 1 }}>{rankLabel}</div>
                      {/* Stripe bars */}
                      <div style={{ display: 'flex', gap: 2, marginTop: 6 }}>
                        {Array.from({ length: 4 }, (_, si) => (
                          <div key={si} style={{ flex: 1, height: 2, background: si < stripes ? C.amber : 'rgba(242,239,232,0.15)' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}




      {/* ── Daily Quote ── */}
      <div style={{ padding: '18px 22px 80px' }}>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, lineHeight: 1.75, color: C.dim, margin: '0 0 8px', letterSpacing: '0.03em' }}>
          "{todayQuote.text}"
        </p>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.dimmer, letterSpacing: '0.1em', margin: 0 }}>
          — {todayQuote.author.toUpperCase()}
        </p>
      </div>

    </main>
  );
}
