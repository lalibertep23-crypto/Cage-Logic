// Home screen — Cage Logic design system.
// Concrete palette. Anton stencil score. Hairlines not cards.
// Asymmetric layout. No rounded corners. No motivational copy.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { differenceInCalendarDays, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import { loadHomeData } from '@/lib/score/loadHomeData';
import { RAMPING_DAYS } from '@/lib/score/computeInvestmentScore';
import { getTodayQuote } from '@/lib/daily-quotes';

export const dynamic = 'force-dynamic';

// ── Palette (mirrors cageside-home.jsx C object) ────────────────────────────
const C = {
  bg:       '#1A1713',
  bgRaised: '#252118',
  bgSunk:   '#13110E',
  amber:    '#D4922E',
  amberLow: '#7A4F1A',
  green:    '#3D8B55',
  text:     '#F5F0E8',
  mid:      '#D8D2C8',
  midLow:   '#B8B2A8',
  brick:    '#A83030',
  line:     'rgba(245,240,232,0.13)',
  lineHard: 'rgba(245,240,232,0.35)',
};

function getBeltColor(color: string | null): string {
  const map: Record<string, string> = {
    white:  '#E8E4DC',
    blue:   '#1E5FA8',
    purple: '#6B3A8A',
    brown:  '#6B3A1F',
    black:  '#1A1713',
    red:    '#8B2020',
  };
  return map[String(color ?? 'white').toLowerCase()] ?? '#E8E4DC';
}

const DOMAINS = [
  { key: 'consistency' as const, label: 'CONSISTENCY', weight: 25 },
  { key: 'reflection'  as const, label: 'REFLECTION',  weight: 20 },
  { key: 'mental'      as const, label: 'MENTAL',      weight: 20 },
  { key: 'recovery'    as const, label: 'RECOVERY',    weight: 20 },
  { key: 'selfStudy'   as const, label: 'SELF-STUDY',  weight: 15 },
];

export default async function HomePage() {
  const data = await loadHomeData();
  if (!data) redirect('/');

  const { displayName, daysSinceSignup, score, today, weekly, streaks, nudge } = data;

  const supabase = await createClient();

  // Active injuries
  const { data: injuryRows } = await supabase
    .from('injury_reports')
    .select('id')
    .eq('athlete_id', data.athleteId)
    .is('resolved_on', null);
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
  const STRIPE_THRESHOLD = 90;
  const stripeTimeProgress = Math.min(100, (daysInCurrentPhase / STRIPE_THRESHOLD) * 100);
  const stripeTimeReady = daysInCurrentPhase >= STRIPE_THRESHOLD;
  const scoreReady = !score.isRamping && (score.score ?? 0) >= 65;

  const todayQuote = getTodayQuote();
  const dayLabel = `Day ${Math.min(daysSinceSignup + 1, RAMPING_DAYS)} of ${RAMPING_DAYS}`;
  const dateStr = format(new Date(), 'EEE · dd MMM').toUpperCase();
  const roundedScore = Math.round(score.score ?? 0);

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Header — standard app format ─────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.line}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>CAGE LOGIC</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.midLow, marginTop: 2 }}>
              {dateStr}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <Link href="/profile" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 14, letterSpacing: '0.08em', color: C.amber, textDecoration: 'none', fontWeight: 600 }}>
              {displayName ?? 'PROFILE'} ↗
            </Link>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', color: C.mid, marginTop: 2 }}>
              {streaks.training}D STREAK
            </div>
          </div>
          <div style={{
            width: 7, height: 7, flexShrink: 0,
            background: today.loggedToday ? C.green : C.brick,
            boxShadow: today.loggedToday ? `0 0 8px ${C.green}` : `0 0 8px ${C.brick}`,
          }}/>
        </div>
      </div>

      {/* ── Active injury banner ──────────────────────────────────────────── */}
      {activeInjuries > 0 && (
        <div style={{
          borderLeft: `2px solid ${C.brick}`,
          background: `${C.brick}18`,
          padding: '10px 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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

      {/* ── Score hero ───────────────────────────────────────────────────── */}
      <div style={{ padding: '18px 22px 14px', position: 'relative', overflow: 'hidden' }}>
        {/* Wall texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/home-score_bright.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.55, filter: 'brightness(1.2) saturate(1.3)' }} />
        {/* Content float above texture */}
        <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <span style={{
            fontFamily: 'var(--font-bebas)', fontSize: 17,
            letterSpacing: '0.2em', color: C.amber,
          }}>INVESTMENT SCORE</span>
          <div style={{ height: 1, width: 40, background: C.amberLow }}/>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.midLow, letterSpacing: '0.1em' }}>
            {score.isRamping ? dayLabel : '30D WINDOW'}
          </span>
        </div>

        {/* Asymmetric number row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          {/* Left: meta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 20, maxWidth: 140 }}>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.mid,
              letterSpacing: '0.06em', lineHeight: 1.45,
            }}>
              {score.isRamping
                ? `Day ${Math.min(daysSinceSignup + 1, RAMPING_DAYS)} of ${RAMPING_DAYS}. Baseline forming.`
                : `Up +${weekly.sessions} this week.`}
            </span>
            {!score.isRamping && (
              <Link href="/score" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.midLow, letterSpacing: '0.08em', textDecoration: 'none' }}>
                PEAK — · SEE BREAKDOWN
              </Link>
            )}
          </div>

          {/* Right: the stamped number */}
          <div style={{ textAlign: 'right' }}>
            {score.isRamping ? (
              <div style={{ textAlign: 'right' }}>
                <span className="stencil" style={{
                  fontFamily: 'var(--font-anton)',
                  fontSize: 72, lineHeight: 0.88,
                  color: C.amber, display: 'inline-block',
                  letterSpacing: '-0.02em',
                  textShadow: `0 1px 0 rgba(0,0,0,0.35), 0 0 24px rgba(201,130,42,0.18)`,
                }}>
                  RAMP
                </span>
                <div style={{ marginTop: 4, fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: C.amberLow, letterSpacing: '0.18em' }}>
                  ...ING [ {Math.min(daysSinceSignup + 1, RAMPING_DAYS)} / {RAMPING_DAYS} ]
                </div>
              </div>
            ) : (
              <span className="stencil" style={{
                fontFamily: 'var(--font-anton)',
                fontSize: 110, lineHeight: 0.85,
                color: C.amber, display: 'inline-block',
                letterSpacing: '-0.02em',
                textShadow: `0 1px 0 rgba(0,0,0,0.35), 0 0 32px rgba(201,130,42,0.15)`,
                filter: 'contrast(1.05)',
              }}>
                {String(roundedScore).padStart(2, '0')}
              </span>
            )}
          </div>
        </div>

        {/* Score axis — 0–100 tick ruler */}
        {!score.isRamping && (
          <div style={{ marginTop: 12 }}>
            <div style={{ position: 'relative', height: 14, borderTop: `1px solid ${C.lineHard}` }}>
              {[0, 20, 40, 60, 80, 100].map((t) => (
                <div key={t} style={{
                  position: 'absolute', top: 0, left: `${t}%`,
                  width: 1, height: t % 20 === 0 ? 8 : 4,
                  background: C.midLow,
                }}/>
              ))}
              <div style={{
                position: 'absolute', top: -1, left: `${roundedScore}%`,
                transform: 'translateX(-50%)',
                width: 2, height: 14, background: C.amber,
                boxShadow: `0 0 6px ${C.amber}`,
              }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.midLow, letterSpacing: '0.06em' }}>
              {[0, 20, 40, 60, 80, 100].map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
        )}

        {/* Ramping progress bar */}
        {score.isRamping && (
          <div style={{ marginTop: 18, height: 4, background: C.bgSunk, position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0,
              width: `${((daysSinceSignup + 1) / RAMPING_DAYS) * 100}%`,
              background: `repeating-linear-gradient(90deg, ${C.amber} 0 6px, ${C.amberLow} 6px 12px)`,
            }}/>
          </div>
        )}
        </div>{/* /content float */}
      </div>

      {/* ── Domain bars ──────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.line}`, padding: '14px 22px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 17, letterSpacing: '0.2em', color: C.mid }}>DOMAINS</span>
          <Link href="/score" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.amber, letterSpacing: '0.1em', textDecoration: 'none', border: `1px solid ${C.amberLow}`, padding: '3px 8px' }}>
            FULL BREAKDOWN →
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DOMAINS.map((d) => {
            const v = Math.max(0, Math.min(100, score.domains[d.key]));
            return (
              <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.1em', color: C.mid, width: 90, flexShrink: 0 }}>
                  {d.label}
                </span>
                <div style={{ flex: 1, height: 6, background: C.bgSunk, position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', inset: 0, width: `${v}%`,
                    background: v > 50 ? C.amberLow : C.brick,
                  }}/>
                  {v > 15 && <div style={{
                    position: 'absolute', inset: 0, width: `${v * 0.4}%`,
                    background: v > 50 ? C.amber : `${C.brick}aa`,
                  }}/>}
                </div>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: v > 50 ? C.amber : C.brick, letterSpacing: '0.06em', width: 30, textAlign: 'right', flexShrink: 0 }}>
                  {Math.round(v)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Today row ────────────────────────────────────────────────────── */}
      <div style={{
        borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`,
        padding: '14px 22px',
        background: `linear-gradient(90deg, ${C.bgRaised} 0%, transparent 70%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 17, letterSpacing: '0.2em', color: C.midLow }}>TODAY</span>
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 26, letterSpacing: '0.04em', color: today.loggedToday ? C.text : C.mid }}>
            {today.loggedToday ? 'LOGGED' : 'NOT YET'}
          </span>
          {today.loggedToday && today.sessionType && (
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.midLow, letterSpacing: '0.08em' }}>
              · {today.sessionType.replace('_', ' ')}
              {today.durationMinutes ? ` · ${today.durationMinutes}MIN` : ''}
            </span>
          )}
        </div>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.midLow, letterSpacing: '0.08em' }}>—</span>
      </div>

      {/* ── PUNCH IN — moved up, right after TODAY ───────────────────────── */}
      <div style={{ padding: '12px 22px 0' }}>
        <Link href="/log" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            background: today.loggedToday ? C.bgRaised : C.amber,
            color: today.loggedToday ? C.midLow : C.bg,
            padding: '18px 24px',
            position: 'relative',
            cursor: today.loggedToday ? 'default' : 'pointer',
            border: today.loggedToday ? `1px solid ${C.lineHard}` : '1px solid transparent',
            boxShadow: today.loggedToday ? 'none' : `inset 0 0 0 1px rgba(0,0,0,0.2), 0 4px 16px rgba(212,146,46,0.18)`,
            transition: 'background 120ms',
          }}>
            {!today.loggedToday && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(0,0,0,0.15)' }}/>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-anton)', fontSize: 30, letterSpacing: '0.06em', lineHeight: 0.95 }}>
                  {today.loggedToday ? 'PUNCHED IN' : 'PUNCH IN'}
                </div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.16em', opacity: 0.75, marginTop: 4 }}>
                  {today.loggedToday ? "EDIT TODAY'S LOG" : "LOG TODAY'S SESSION"}
                </div>
              </div>
              <svg width={44} height={26} viewBox="0 0 56 32" fill="none">
                <path d="M4 4V28 M14 4V28 M24 4V28 M34 4V28 M2 18L40 12"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"/>
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Week stats ───────────────────────────────────────────────────── */}
      <div style={{ padding: '14px 22px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 17, letterSpacing: '0.2em', color: C.mid }}>THIS WEEK</span>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.midLow, letterSpacing: '0.1em' }}>
            {format(new Date(), 'MMM d').toUpperCase()} · 7 DAYS
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { n: weekly.sessions,    label: 'SESSIONS',    weak: weekly.sessions < 2 },
            { n: weekly.reflections, label: 'REFLECTIONS', weak: weekly.reflections === 0 },
            { n: weekly.rolls,       label: 'ROLLS',       weak: false },
          ].map((s, i) => (
            <div key={i} style={{
              paddingLeft: i === 0 ? 0 : 16,
              paddingRight: i === 2 ? 0 : 16,
              borderRight: i < 2 ? `1px solid ${C.line}` : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-anton)',
                fontSize: 56, lineHeight: 0.9,
                letterSpacing: '-0.02em',
                color: s.weak ? C.brick : C.text,
              }}>
                {String(s.n).padStart(2, '0')}
              </div>
              <div style={{
                marginTop: 8,
                fontFamily: 'var(--font-bebas)', fontSize: 13,
                letterSpacing: '0.16em', color: s.weak ? C.brick : C.mid,
              }}>
                {s.label}{s.weak && <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, marginLeft: 6, color: C.brick }}>· gap</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Nudge strip ──────────────────────────────────────────────────── */}
      <div style={{
        margin: '12px 22px 0',
        padding: '10px 14px',
        borderLeft: `2px solid ${C.brick}`,
        background: C.bgRaised,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.brick, letterSpacing: '0.16em', flexShrink: 0 }}>NOTE</span>
        <div style={{ width: 1, height: 14, background: C.midLow, flexShrink: 0 }}/>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: C.text, lineHeight: 1.55, letterSpacing: '0.04em' }}>
          {nudge}
        </span>
      </div>


      {/* ── Stripe Track ─────────────────────────────────────────────────── */}
      {primaryDiscipline && (
        <div style={{ borderTop: `1px solid ${C.line}`, padding: '16px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 17, letterSpacing: '0.2em', color: C.mid }}>STRIPE TRACK</span>
            {/* Visual belt with stripes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.midLow, letterSpacing: '0.1em' }}>
                {String(primaryDiscipline.rank_color ?? 'WHITE').toUpperCase()} BELT
              </span>
              <div style={{
                width: 56, height: 10,
                background: getBeltColor(primaryDiscipline.rank_color as string | null),
                position: 'relative',
                border: '1px solid rgba(245,240,232,0.25)',
                flexShrink: 0,
              }}>
                {Array.from({ length: primaryDiscipline.stripes ?? 0 }, (_, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    right: i * 7 + 3,
                    top: 0, bottom: 0,
                    width: 4,
                    background: 'rgba(255,255,255,0.9)',
                  }}/>
                ))}
              </div>
            </div>
          </div>
          {/* Time bar */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.mid, letterSpacing: '0.08em' }}>TIME IN</span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.midLow, letterSpacing: '0.06em' }}>{daysInCurrentPhase} / {STRIPE_THRESHOLD}d</span>
            </div>
            <div style={{ height: 6, background: C.bgSunk, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, width: `${stripeTimeProgress}%`, background: stripeTimeReady ? C.amber : C.amberLow }}/>
            </div>
          </div>
          {/* Score bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.mid, letterSpacing: '0.08em' }}>INVESTMENT</span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: scoreReady ? C.green : C.midLow, letterSpacing: '0.06em' }}>
                {score.isRamping ? 'CALIBRATING' : `${roundedScore} / 65 ${scoreReady ? '✓' : ''}`}
              </span>
            </div>
            <div style={{ height: 6, background: C.bgSunk, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', inset: 0,
                width: score.isRamping ? '4%' : `${Math.min(100, Math.max(0, (roundedScore / 65) * 100))}%`,
                background: scoreReady ? C.green : C.amberLow,
              }}/>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.midLow, letterSpacing: '0.06em', marginTop: 10 }}>
            {stripeTimeReady && scoreReady ? 'Both tracks solid. Talk to your coach.' : 'Keep building. Your coach watches both.'}
          </p>
        </div>
      )}

      {/* ── Daily quote ──────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.line}`, padding: '18px 22px' }}>
        <p style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 11,
          letterSpacing: '0.04em', lineHeight: 1.75,
          color: C.mid, margin: '0 0 10px',
          fontStyle: 'italic',
        }}>
          &ldquo;{todayQuote.text}&rdquo;
        </p>
        <span style={{
          fontFamily: 'var(--font-bebas)', fontSize: 11,
