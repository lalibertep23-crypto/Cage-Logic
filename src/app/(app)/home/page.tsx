// Home screen — rebuilt from mockup 2026-05-22.
// Octagon score frame. Segmented domain bars. Split PUNCH IN.
// All content preserved: score, domains, today, week, nudge, stripe track, mental CTA, quote.

import Link from 'next/link';
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

function getBeltColor(color: string | null): string {
  const map: Record<string, string> = {
    white: '#E8E4DC', blue: '#1E5FA8', purple: '#6B3A8A',
    brown: '#6B3A1F', black: '#1A1713',
  };
  return map[String(color ?? 'white').toLowerCase()] ?? '#E8E4DC';
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

// ── Octagon Score Frame ───────────────────────────────────────────────────────
function ScoreOctagon({
  value,
  topLabel,
  bottomLabel,
  color,
}: {
  value: string | number;
  topLabel: string;
  bottomLabel: string;
  color: string;
}) {
  const pts      = '54,4 126,4 176,54 176,146 126,196 54,196 4,146 4,54';
  const innerPts = '60,12 120,12 168,60 168,140 120,188 60,188 12,140 12,60';
  const strVal   = String(value).padStart(2, '0');

  return (
    <svg viewBox="0 0 180 200" width="100%" style={{ maxWidth: 155, display: 'block' }}>
      <defs>
        <filter id="octGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Outer ambient halo */}
      <polygon points={pts} fill="none" stroke={color} strokeWidth="10" opacity="0.12" filter="url(#octGlow)"/>
      {/* Main frame — dark fill + glowing border */}
      <polygon points={pts} fill="rgba(5,5,5,0.82)" stroke={color} strokeWidth="2.5" filter="url(#octGlow)"/>
      {/* Inner hairline */}
      <polygon points={innerPts} fill="none" stroke={color} strokeWidth="0.75" opacity="0.3"/>
      {/* Top label */}
      <text x="90" y="64" textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif" fontSize="16" letterSpacing="7" fill={color}>
        {topLabel}
      </text>
      {/* Main value */}
      <text x="90" y="150" textAnchor="middle"
        fontFamily="'Anton', sans-serif" fontSize="90" letterSpacing="-3" fill={color}>
        {strVal}
      </text>
      {/* Sub-label */}
      <text x="90" y="178" textAnchor="middle"
        fontFamily="'DM Mono', monospace" fontSize="13" fill="rgba(242,239,232,0.4)" letterSpacing="3">
        {bottomLabel}
      </text>
    </svg>
  );
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
  const roundedScore = Math.round(score.score ?? 0);
  const scoreColor  = getScoreColor(weekly.sessions);
  const streakColor = getStreakColor(streaks.training);
  const rampPct     = Math.min(100, (currentDay / RAMPING_DAYS) * 100);

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.line}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 26, background: C.amber }}/>
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 26, letterSpacing: '0.06em', lineHeight: 1 }}>
              CAGE LOGIC
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dim, marginTop: 3 }}>
              {dateStr}
            </div>
          </div>
        </div>
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
      <div style={{ position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${C.line}` }}>
        {/* Cage background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/home-score_bright.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.38, filter: 'brightness(0.75)',
        }}/>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', padding: '22px 22px 20px' }}>

          {/* Left: labels + progress */}
          <div style={{ flex: 1, paddingRight: 10 }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 17, letterSpacing: '0.22em', color: C.amber, marginBottom: 14 }}>
              INVESTMENT SCORE
            </div>
            {score.isRamping ? (
              <>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, letterSpacing: '0.1em', fontWeight: 700, color: C.text, marginBottom: 3 }}>
                  DAY {currentDay} OF {RAMPING_DAYS}
                </div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.16em', color: C.dim, marginBottom: 18 }}>
                  BASELINE FORMING
                </div>
              </>
            ) : (
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.14em', color: C.dim, marginBottom: 18 }}>
                30-DAY WINDOW · ACTIVE
              </div>
            )}
            {/* Progress bar with tick marks */}
            <div style={{ position: 'relative', height: 3, background: 'rgba(242,239,232,0.08)', marginBottom: 10 }}>
              {[25, 50, 75].map(p => (
                <div key={p} style={{ position: 'absolute', top: -3, left: `${p}%`, width: 1, height: 9, background: 'rgba(242,239,232,0.22)' }}/>
              ))}
              <div style={{
                position: 'absolute', inset: 0,
                width: `${score.isRamping ? rampPct : 100}%`,
                background: scoreColor,
              }}/>
            </div>
            {!score.isRamping && (
              <Link href="/score" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.dim, letterSpacing: '0.1em', textDecoration: 'none' }}>
                SEE BREAKDOWN →
              </Link>
            )}
          </div>

          {/* Right: octagon score frame */}
          <div style={{ width: 148, flexShrink: 0 }}>
            <ScoreOctagon
              value={score.isRamping ? currentDay : roundedScore}
              topLabel={score.isRamping ? 'RAMP' : 'SCORE'}
              bottomLabel={score.isRamping ? `/ ${RAMPING_DAYS}` : '/ 100'}
              color={scoreColor}
            />
          </div>
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
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 18, letterSpacing: '0.2em', color: C.text }}>STRIPE TRACK</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.dim, letterSpacing: '0.1em' }}>
                {String(primaryDiscipline.rank_color ?? 'WHITE').toUpperCase()} BELT
              </span>
              {/* Belt bar with stripe marks */}
              <div style={{
                width: 52, height: 10,
                background: getBeltColor(primaryDiscipline.rank_color as string | null),
                position: 'relative', border: `1px solid ${C.lineHard}`, flexShrink: 0,
              }}>
                {Array.from({ length: (primaryDiscipline.stripes as number) ?? 0 }, (_, i) => (
                  <div key={i} style={{
                    position: 'absolute', right: i * 7 + 3, top: 0, bottom: 0,
                    width: 4, background: 'rgba(255,255,255,0.88)',
                  }}/>
                ))}
              </div>
            </div>
          </div>
          {/* Time in bar */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.mid }}>TIME IN</span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.dim, letterSpacing: '0.06em' }}>
                {daysInCurrentPhase} / {STRIPE_THRESHOLD}d
              </span>
            </div>
            <div style={{ height: 4, background: C.sunk, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, width: `${stripeTimeProgress}%`, background: stripeTimeReady ? C.amber : C.amberLow }}/>
            </div>
          </div>
          {/* Investment bar */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.mid }}>INVESTMENT</span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: scoreReady ? green : C.dim, letterSpacing: '0.06em' }}>
                {score.isRamping ? 'CALIBRATING' : `${roundedScore} / 65 ${scoreReady ? '✓' : ''}`}
              </span>
            </div>
            <div style={{ height: 4, background: C.sunk, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', inset: 0,
                width: score.isRamping ? '3%' : `${Math.min(100, (roundedScore / 65) * 100)}%`,
                background: scoreReady ? green : C.amberLow,
              }}/>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.dimmer, letterSpacing: '0.06em', margin: 0 }}>
            {stripeTimeReady && scoreReady
              ? 'Both gates clear. Bring it to your coach.'
              : 'Keep building. Coach watches both.'}
          </p>
        </div>
      )}

      {/* ── Mental Check-in CTA ──────────────────────────────────────────── */}
      {!didCheckInToday && (
        <div style={{ padding: '14px 22px', borderBottom: `1px solid ${C.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily