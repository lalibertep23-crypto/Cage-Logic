// BRS result — reads athlete's BRS history. Shows latest score + band.
// Voice: direct, dry, factual. No motivational. No emojis.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const C = {
  bg:      '#050505',
  surface: '#111111',
  border:  'rgba(242,239,232,0.13)',
  text:    '#F2EFE8',
  dim:     'rgba(242,239,232,0.55)',
  dimmer:  'rgba(242,239,232,0.35)',
  amber:   '#C8943A',
  amberLow:'rgba(201,130,42,0.35)',
  green:   '#5C8A3C',
  brick:   '#8B3A1E',
};

function band(score: number): string {
  if (score < 3) return 'LOW RESILIENCE';
  if (score <= 4.3) return 'NORMAL RESILIENCE';
  return 'HIGH RESILIENCE';
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

  if (records.length === 0 || records[0].score == null) redirect('/mental');

  const latest   = records[0].score as number;
  const previous = records.length >= 2 ? records[1].score : null;
  const isFirst  = previous == null;
  const delta    = previous != null ? latest - previous : null;

  let headline: string;
  let body: string;
  let color = C.amber;

  if (isFirst) {
    headline = `${latest.toFixed(2)} — BASELINE`;
    body = `Range: ${band(latest)}. This is your baseline. Re-test in 30 days.`;
    color = C.amber;
  } else {
    const prev = previous as number;
    if (delta! > 0.05) {
      headline = `${latest.toFixed(2)} — UP FROM ${prev.toFixed(2)}`;
      body = `Resilience trending. Range: ${band(latest)}.`;
      color = C.green;
    } else if (delta! < -0.05) {
      headline = `${latest.toFixed(2)} — DOWN FROM ${prev.toFixed(2)}`;
      body = `Something shifted. Note what's going on in reflection. Range: ${band(latest)}.`;
      color = C.brick;
    } else {
      headline = `${latest.toFixed(2)} — HELD FROM ${prev.toFixed(2)}`;
      body = `Range: ${band(latest)}. Steady.`;
      color = C.amber;
    }
  }

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
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>BRS RESULT</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginTop: 2 }}>BRIEF RESILIENCE SCALE</div>
          </div>
        </div>
        <Link href="/home" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>← HOME</Link>
      </div>

      <div style={{ padding: '0 22px' }}>
        <div style={{ marginTop: 24, borderLeft: `3px solid ${color}`, background: C.surface, padding: '20px 20px 20px 16px' }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 10 }}>BRIEF RESILIENCE SCALE</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-anton)', fontSize: 52, letterSpacing: '0.04em', color, lineHeight: 1 }}>{latest.toFixed(2)}</span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: C.dim }}>/ 5.00</span>
          </div>
          <p style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.16em', color: C.text, margin: '0 0 8px' }}>{headline}</p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>{body}</p>
        </div>

        <div style={{ marginTop: 16, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 8 }}>WHAT THIS MEANS</div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
            BRS measures how you bounce back from stress. It&apos;s a trait — slow to change. Re-test in about 30 days to see movement.
          </p>
        </div>
      </div>
    </main>
  );
}
