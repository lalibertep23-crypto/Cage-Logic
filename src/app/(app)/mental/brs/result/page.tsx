// BRS result — latest score + band + template copy (first / up / down / held).
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const C = {
  bg:      '#1A1713',
  surface: '#252118',
  border:  'rgba(245,240,232,0.13)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.55)',
  dimmer:  'rgba(245,240,232,0.35)',
  amber:   '#D4922E',
  amberLow:'rgba(201,130,42,0.35)',
  green:   '#3D8B55',
  greenLow:'rgba(42,92,63,0.4)',
  brick:   '#8B3A1E',
};

function band(score: number): string {
  if (score < 3) return 'LOW RESILIENCE';
  if (score <= 4.3) return 'NORMAL RESILIENCE';
  return 'HIGH RESILIENCE';
}

function trendColor(delta: number | null): string {
  if (delta == null) return C.amber;
  if (delta > 0.05) return C.green;
  if (delta < -0.05) return C.brick;
  return C.amber;
}

export default async function BrsResultPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: rows } = await supabase
    .from('psych_assessments')
    .select('id, score, taken_at')
    .eq('athlete_id', user.id)
    .eq('instrument', 'BRS')
    .order('taken_at', { ascending: false })
    .limit(2);

  const records = (rows ?? []).map((r) => ({
    id:       r.id as string,
    score:    r.score != null ? Number(r.score) : null,
    taken_at: r.taken_at as string,
  }));

  if (records.length === 0 || records[0].score == null) redirect('/mental/brs');

  const latest   = records[0].score as number;
  const previous = records.length >= 2 ? records[1].score : null;
  const isFirst  = previous == null;
  const delta    = previous != null ? latest - previous : null;

  let headline: string;
  let body: string;
  if (isFirst) {
    headline = `${latest.toFixed(2)} — BASELINE`;
    body = `Range: ${band(latest)}. Re-test in 30 days.`;
  } else {
    const prev = previous as number;
    if (delta! > 0.05) {
      headline = `${latest.toFixed(2)} — UP FROM ${prev.toFixed(2)}`;
      body = `Resilience trending. Range: ${band(latest)}.`;
    } else if (delta! < -0.05) {
      headline = `${latest.toFixed(2)} — DOWN FROM ${prev.toFixed(2)}`;
      body = `Something shifted. Note what&apos;s going on in reflection. Range: ${band(latest)}.`;
    } else {
      headline = `${latest.toFixed(2)} — HELD FROM ${prev.toFixed(2)}`;
      body = `Range: ${band(latest)}. Steady.`;
    }
  }

  const color = trendColor(delta);

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: color }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
              BRS RESULT
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginTop: 2 }}>
              BRIEF RESILIENCE SCALE
            </div>
          </div>
        </div>
        <Link href="/mental" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          ← MENTAL
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* Score display */}
        <div style={{
          marginTop: 24,
          borderLeft: `3px solid ${color}`,
          background: C.surface,
          padding: '20px 20px 20px 16px',
        }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 10 }}>
            BRIEF RESILIENCE SCALE
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-anton)', fontSize: 52, letterSpacing: '0.04em', color, lineHeight: 1 }}>
              {latest.toFixed(2)}
            </span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: C.dim }}>/ 5.00</span>
          </div>
          <p style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.16em', color: C.text, margin: '0 0 8px' }}>
            {headline}
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
            {body}
          </p>
        </div>

        {/* What this means */}
        <div style={{ marginTop: 16, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 8 }}>
            WHAT THIS MEANS
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
            BRS measures how you bounce back from stress. It&apos;s a trait — slow to change. Re-test in about 30 days to see movement.
          </p>
        </div>

        {/* Back to mental */}
        <div style={{ marginTop: 24 }}>
          <Link
            href="/mental"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 18px 8px',
              border: `1px solid ${C.amberLow}`,
              color: C.amber,
              fontFamily: 'var(--font-bebas)',
              fontSize: 14,
              letterSpacing: '0.14em',
              textDecoration: 'none',
            }}
          >
            ← MENTAL HUB
          </Link>
        </div>

      </div>
    </main>
  );
}
