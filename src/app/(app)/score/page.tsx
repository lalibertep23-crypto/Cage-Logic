// Investment Score detail — tap-through from home score widget.
// Read-only breakdown of the 5 domains.
// Voice: direct, dry, factual. No motivational. No emojis.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { loadHomeData } from '@/lib/score/loadHomeData';
import { RAMPING_DAYS, type DomainPcts } from '@/lib/score/computeInvestmentScore';

export const dynamic = 'force-dynamic';

// ── Palette ─────────────────────────────────────────────────────────────────
const C = {
  bg:       '#1A1713',
  surface:  '#252118',
  border:   'rgba(245,240,232,0.5)',
  text:     '#F5F0E8',
  dim:      'rgba(245,240,232,0.38)',
  dimmer:   'rgba(245,240,232,0.22)',
  amber:    '#D4922E',
  amberLow: 'rgba(201,130,42,0.35)',
  green:    '#3D8B55',
  greenLow: 'rgba(42,92,63,0.4)',
  brick:    '#8B3A1E',
};

const DOMAINS: {
  key: keyof DomainPcts;
  label: string;
  weight: number;
  uplift: string;
}[] = [
  { key: 'consistency', label: 'CONSISTENCY', weight: 25, uplift: 'Log a session within 24 hours of training.' },
  { key: 'reflection',  label: 'REFLECTION',  weight: 20, uplift: 'Add a reflection to your most recent session.' },
  { key: 'mental',      label: 'MENTAL',       weight: 20, uplift: 'A three-minute BRS check-in moves this.' },
  { key: 'recovery',    label: 'RECOVERY',     weight: 20, uplift: "Log today's soreness. Five seconds." },
  { key: 'selfStudy',   label: 'SELF-STUDY',   weight: 15, uplift: 'Open an old reflection. Add one follow-up note.' },
];

function domainColor(v: number): string {
  if (v >= 70) return C.green;
  if (v >= 40) return C.amber;
  return C.brick;
}

export default async function ScorePage() {
  const data = await loadHomeData();
  if (!data) redirect('/');

  const { score, daysSinceSignup } = data;
  const dayLabel = `DAY ${Math.min(daysSinceSignup + 1, RAMPING_DAYS)} OF ${RAMPING_DAYS}`;

  const weakestKey = DOMAINS.reduce((min, d) =>
    score.domains[d.key] < score.domains[min.key] ? d : min
  ).key;

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
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

        {/* ── Overall score ────────────────────────────────────────────── */}
        <div style={{
          marginTop: 24,
          borderLeft: `3px solid ${C.amber}`,
          background: C.surface,
          padding: '20px 20px 20px 16px',
        }}>
          {score.isRamping ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-anton)', fontSize: 36, letterSpacing: '0.04em', color: C.dim }}>
                  RAMPING
                </span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.14em', color: C.dimmer }}>
                  {dayLabel}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
                Your score forms on day {RAMPING_DAYS}. The five domains below are already tracking — this is the score forming.
              </p>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-anton)', fontSize: 56, letterSpacing: '0.04em', color: C.amber, lineHeight: 1 }}>
                  {Math.round(score.score ?? 0)}
                </span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: C.dim }}>/ 100</span>
              </div>
              <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dim, margin: 0 }}>
                LAST 30 DAYS — WEIGHTED ACROSS 5 DOMAINS
              </p>
            </>
          )}
        </div>

        {/* ── Domain breakdown ─────────────────────────────────────────── */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column' }}>
          {DOMAINS.map((d, i) => {
            const v = Math.round(score.domains[d.key]);
            const isWeakest = d.key === weakestKey;
            const color = domainColor(v);
            return (
              <div
                key={d.key}
                style={{
                  borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
                  borderBottom: `1px solid ${C.border}`,
                  padding: '16px 0',
                }}
              >
                {/* Label row */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 6, height: 6, background: color, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.16em', color: '#FFD97A' }}>
                      {d.label}
                    </span>
                    {isWeakest && (
                      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 7, letterSpacing: '0.18em', color: C.amber }}>
                        MOST ROOM
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-anton)', fontSize: 18, color }}>
                      {v}
                    </span>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, color: C.dimmer }}>
                      %
                    </span>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer }}>
                      · {d.weight}% WT
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: 3, background: C.border, marginBottom: 10 }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.max(0, Math.min(100, v))}%`,
                    background: color,
                    transition: 'width 0.4s ease',
                  }} />
                </div>

                {/* Uplift hint */}
                <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim, margin: 0 }}>
                  {d.uplift}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
