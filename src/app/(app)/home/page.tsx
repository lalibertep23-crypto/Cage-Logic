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
    <div style={{ display: 'flex', gap: 2.5, flex: 1 }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{
          flex: 1, height: 13,
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
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 18px 10px',
        borderBottom: `1px solid ${C.line}`,
        background: 'rgba(5,4,3,0.92)',
      }}>
        <Link href="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Brain — the brand anchor */}
          <div style={{ width: 58, height: 58, position: 'relative', flexShrink: 0 }}>
            <Image
              src="/cage-logic-back-button.png"
              alt="Cage Logic"
              fill
              sizes="58px"
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(200,148,58,0.55)) drop-shadow(0 0 18px rgba(200,148,58,0.22)) drop-shadow(0 1px 3px rgba(0,0,0,0.95))',
              }}
            />
          </div>
          {/* Wordmark */}
          <div>
            <div style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 20,
              letterSpacing: '0.15em',
              color: C.amber,
              lineHeight: 1,
              textShadow: '0 1px 6px rgba(0,0,0,0.80)',
            }}>
              CAGE LOGIC
            </div>
            <div style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 8,
              letterSpacing: '0.18em',
              color: 'rgba(242,239,232,0.45)',
              lineHeight: 1,
              marginTop: 3,
            }}>
              {dateStr}
            </div>
          </div>
        </Link>
        <div style={{ textAlign: 'right' }}>
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
        height: '42vmax', minHeight: 260, maxHeight: 380,
      }}>
        {/* Fighter wrap image — state determined by day threshold */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${wrapImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }}/>
        {/* Gradient — preserve readability at bottom, reveal fighter above */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,4,3,0.18) 0%, rgba(5,4,3,0.08) 30%, rgba(5,4,3,0.72) 68%, rgba(5,4,3,0.97) 100%)',
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

          {/* Progress bar */}
          <div style={{ position: 'relative', height: 2, background: 'rgba(242,239,232,0.10)' }}>
            {/* Day 15 tick */}
            <div style={{ position: 'absolute', top: -4, left: '50%', width: 1, height: 10, background: 'rgba(242,239,232,0.28)' }}/>
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: `${score.isRamping ? rampPct : 100}%`,
              background: score.isRamping ? C.amber : scoreColor,
            }}/>
          </div>
          {/* Day markers */}
          {score.isRamping && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.10em', color: 'rgba(242,239,232,0.28)' }}>0</span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.10em', color: 'rgba(242,239,232,0.28)' }}>15</span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.10em', color: 'rgba(242,239,232,0.28)' }}>30</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Domains ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 22px 18px', borderBottom: `1px solid ${C.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {DOMAIN_DEFS.map((d) => {
            const pct    = Math.max(0, Math.min(100, score.domains[d.key]));
            const filled = Math.round(pct / 10);
            const color  = getDomainColor(pct);
            return (
              <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, flexShrink: 0 }}>
                  <d.Icon color={color}/>
                </div>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.12em', color: C.text, width: 82, flexShrink: 0 }}>
                  {d.label}
                </span>
                <SegmentedBar filled={filled} color={color}/>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color, letterSpacing: '0.06em', width: 36, textAlign: 'right', flexShrink: 0 }}>
                  {filled} / 10
                </span>
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
              flex: 1,
              background: today.loggedToday ? C.surface : C.amber,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 20px',
              border: `1px solid ${today.loggedToday ? C.lineHard : 'transparent'}`,
              borderLeft: 'none',
            }}>
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

      {/* ── Nudge strip ──────────────────────────────────────────────────── */}
      <div style={{
        padding: '12px 22px', background: C.surface,
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: `1px solid ${C.line}`,
      }}>
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.brick} strokeWidth="1.8" strokeLinecap="square">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="13"/>
          <circle cx="12" cy="16.5" r="0.75" fill={C.brick} stroke="none"/>
        </svg>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, letterSpacing: '0.16em', flexShrink: 0 }}>NOTE</span>
        <div style={{ width: 1, height: 18, background: C.brick, opacity: 0.35, flexShrink: 0 }}/>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: C.text, lineHeight: 1.6, letterSpacing: '0.03em' }}>
          {nudge}
        </span>
      </div>

      {/* ── Stripe Track ─────────────────────────────────────────────────── */}
      {primaryDiscipline && (
        <div style={{
          borderBottom: `1px solid ${C.line}`,
          borderLeft: `3px solid ${stripeTimeReady && scoreReady ? C.amber : C.amberLow}`,
          background: C.surface,
        }}>
          <div style={{ padding: '16px 22px' }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 17, letterSpacing: '0.2em', color: C.text }}>
                  STRIPE TRACK
                </span>
                {stripeTimeReady && scoreReady && (
                  <span style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em',
                    color: C.amber, border: `1px solid ${C.amber}`, padding: '2px 6px',
                  }}>GATES CLEAR</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.dim, letterSpacing: '0.1em' }}>
                  {String(primaryDiscipline.rank_color ?? 'WHITE').toUpperCase()} BELT
                </span>
                <BeltVisual
                  color={primaryDiscipline.rank_color as string | null}
                  stripes={(primaryDiscipline.stripes as number) ?? 0}
                />
              </div>
            </div>
            {/* Time in bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.mid }}>TIME IN PHASE</span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: stripeTimeReady ? C.amber : C.dim, letterSpacing: '0.06em' }}>
                  {daysInCurrentPhase}d · {STRIPE_THRESHOLD}d target {stripeTimeReady ? '✓' : ''}
                </span>
              </div>
              <div style={{ height: 5, background: C.sunk, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, width: `${stripeTimeProgress}%`, background: stripeTimeReady ? C.amber : C.amberLow }}/>
              </div>
            </div>
            {/* Investment bar */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.mid }}>INVESTMENT SCORE</span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: scoreReady ? green : C.dim, letterSpacing: '0.06em' }}>
                  {score.isRamping ? 'CALIBRATING' : `${roundedScore} / 65 min ${scoreReady ? '✓' : ''}`}
                </span>
              </div>
              <div style={{ height: 5, background: C.sunk, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  width: score.isRamping ? '3%' : `${Math.min(100, (roundedScore / 65) * 100)}%`,
                  background: scoreReady ? green : C.amberLow,
                }}/>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.dimmer, letterSpacing: '0.06em', margin: 0, lineHeight: 1.6 }}>
              {stripeTimeReady && scoreReady
                ? 'Both gates clear. Bring it to your coach.'
                : 'Coach watches both gates. Keep building.'}
            </p>
          </div>
        </div>
      )}


      {/* ── Mental Check-in CTA ── */}
      {!didCheckInToday && (
        <Link href="/mental" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            borderBottom: `1px solid ${C.line}`,
            borderLeft: `3px solid ${C.amber}`,
            background: C.surface,
          }}>
            <div style={{ padding: '16px 22px' }}>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 17, letterSpacing: '0.2em', color: C.text }}>
                  MENTAL CHECK-IN
                </span>
                <span style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em',
                  color: C.brick, border: `1px solid ${C.brick}`, padding: '2px 6px',
                }}>
                  NOT DONE
                </span>
              </div>
              {/* Description */}
              <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.dim, letterSpacing: '0.06em', margin: '0 0 14px', lineHeight: 1.65 }}>
                Daily prompt active. 2 min. Scores toward Mental domain.
              </p>
              {/* CTA row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.2em', color: C.amber }}>
                  OPEN CHECK-IN
                </span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 18, color: C.amber }}>→</span>
              </div>
            </div>
          </div>
        </Link>
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
