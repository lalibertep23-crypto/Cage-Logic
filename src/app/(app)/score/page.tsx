// Investment Score detail — tap-through from home score widget.
// Read-only breakdown of the 5 domains.
// Voice: direct, dry, factual. No motivational. No emojis.
// Migrated to design-tokens 2026-05-22.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { loadHomeData } from '@/lib/score/loadHomeData';
import { RAMPING_DAYS, type DomainPcts } from '@/lib/score/computeInvestmentScore';
import { C } from '@/lib/design-tokens';

export const dynamic = 'force-dynamic';

// Functional score color — green / amber / brick
function domainColor(v: number): string {
  if (v >= 70) return '#5C8A3C';   // green — on track
  if (v >= 40) return C.amber;     // amber — building
  return C.brick;                  // brick — gap
}

const DOMAINS: {
  key: keyof DomainPcts;
  label: string;
  weight: number;
  what: string;
  uplift: string;
}[] = [
  {
    key: 'consistency',
    label: 'CONSISTENCY',
    weight: 25,
    what: 'Sessions logged against your declared training frequency. Recency-weighted — recent sessions count more.',
    uplift: 'Log a session within 24 hours of training.',
  },
  {
    key: 'reflection',
    label: 'REFLECTION',
    weight: 20,
    what: 'Quality of session reflections. Length tiers (0 / 10 / 60 / 100 pts). Return-edit bonus +15. Unreflected sessions pull this down.',
    uplift: 'Add a reflection to your most recent session.',
  },
  {
    key: 'mental',
    label: 'MENTAL',
    weight: 20,
    what: 'Weekly BRS check-in, daily prompts, post-loss reflection. Decay-weighted over 4 weeks.',
    uplift: 'A three-minute BRS check-in moves this domain.',
  },
  {
    key: 'recovery',
    label: 'RECOVERY',
    weight: 20,
    what: '50% logging behavior + 50% actual state. Energy and soreness together determine your state score. Unlogged days count as zero.',
    uplift: "Log today's soreness. Five seconds.",
  },
  {
    key: 'selfStudy',
    label: 'SELF-STUDY',
    weight: 15,
    what: 'Technique tags, custom techniques, return edits, follow-up notes. Point system normalized to 100.',
    uplift: 'Open an old reflection. Add one follow-up note.',
  },
];

export default async function ScorePage() {
  const data = await loadHomeData();
  if (!data) redirect('/');

  const { score, daysSinceSignup } = data;
  const dayLabel = `DAY ${Math.min(daysSinceSignup + 1, RAMPING_DAYS)} OF ${RAMPING_DAYS}`;
  const roundedScore = Math.round(score.score ?? 0);

  const weakestKey = DOMAINS.reduce((min, d) =>
    score.domains[d.key] < score.domains[min.key] ? d : min
  ).key;

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.line}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
            INVESTMENT SCORE
          </span>
        </div>
        <Link href="/home" style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em',
          color: C.dimmer, textDecoration: 'none',
        }}>
          ← HOME
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* ── Overall score hero ───────────────────────────────────────── */}
        <div style={{
          marginTop: 24,
          borderLeft: `3px solid ${C.amber}`,
          background: C.surface,
          padding: '20px 20px 20px 16px',
        }}>
          {score.isRamping ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-anton)', fontSize: 36, letterSpacing: '0.04em', color: C.mid }}>
                  RAMPING
                </span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.14em', color: C.dimmer }}>
                  {dayLabel}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
                Score forms on day {RAMPING_DAYS}. All five domains are already tracking — this is the baseline forming.
              </p>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-anton)', fontSize: 72, letterSpacing: '-0.02em', color: C.amber, lineHeight: 0.9 }}>
                  {String(roundedScore).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: C.dim }}>&nbsp;/ 100</span>
              </div>
              <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dim, margin: 0 }}>
                30-DAY WINDOW · WEIGHTED ACROSS 5 DOMAINS
              </p>
            </>
          )}
        </div>

        {/* ── Score axis ruler ─────────────────────────────────────────── */}
        {!score.isRamping && (
          <div style={{ marginTop: 12 }}>
            <div style={{ position: 'relative', height: 14, borderTop: `1px solid ${C.lineHard}` }}>
              {[0, 20, 40, 60, 80, 100].map((t) => (
                <div key={t} style={{
                  position: 'absolute', top: 0, left: `${t}%`,
                  width: 1, height: 8, background: C.dim,
                }}/>
              ))}
              <div style={{
                position: 'absolute', top: -1, left: `${roundedScore}%`,
                transform: 'translateX(-50%)',
                width: 2, height: 14, background: C.amberGlow,
                boxShadow: `0 0 6px ${C.amberGlow}`,
              }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.dimmer, letterSpacing: '0.06em' }}>
              {[0, 20, 40, 60, 80, 100].map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
        )}

        {/* ── Domain breakdown ─────────────────────────────────────────── */}
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column' }}>
          {DOMAINS.map((d, i) => {
            const v = Math.round(score.domains[d.key]);
            const isWeakest = d.key === weakestKey && !score.isRamping;
            const color = domainColor(v);

            return (
              <div
                key={d.key}
                style={{
                  borderTop: `1px solid ${C.line}`,
                  borderBottom: i === DOMAINS.length - 1 ? `1px solid ${C.line}` : 'none',
                  padding: '16px 0',
                }}
              >
                {/* Label + score row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 6, height: 6, background: color, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.16em', color: C.amber }}>
               