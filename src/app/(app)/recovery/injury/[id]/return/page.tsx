// Step 9d — I-PRRS return-to-roll gate page.
// 6-item Injury-Psychological Readiness to Return to Sport (Glazer 2009).
// Cage Logic wording adapted for BJJ context. NOT clinical clearance.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { IPrrsForm } from './iprrs-form';
import { BrandNav } from '@/components/ui/brand-nav';

export const dynamic = 'force-dynamic';

const REGION_LABELS: Record<string, string> = {
  head: 'Head',
  neck: 'Neck',
  shoulder: 'Shoulder',
  elbow: 'Elbow',
  wrist_hand: 'Wrist / Hand',
  ribs: 'Ribs',
  upper_back: 'Upper back',
  low_back: 'Lower back',
  hip_groin: 'Hip / Groin',
  knee: 'Knee',
  ankle_foot: 'Ankle / Foot',
  other: 'Other',
};

export default async function IPrrsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: injury } = await supabase
    .from('injury_reports')
    .select('id, body_region, i_prrs_score')
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();

  if (!injury) notFound();

  const region =
    REGION_LABELS[injury.body_region as string] ?? (injury.body_region as string);
  const prevScore =
    injury.i_prrs_score != null ? Number(injury.i_prrs_score) : null;

  const C = {
    bg: '#050505', surface: '#111111', border:  'rgba(242,239,232,0.13)',
    text: '#F2EFE8', dim: 'rgba(242,239,232,0.55)', dimmer: 'rgba(242,239,232,0.35)',
    amber: '#C8943A', brick: '#8B3A1E', brickLow: 'rgba(139,58,30,0.35)',
    green: '#5C8A3C', greenLow: 'rgba(42,92,63,0.35)',
  };

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>
      <BrandNav backHref="/recovery" />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px', borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.brick }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>I-PRRS</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer, marginTop: 2 }}>
              {region.toUpperCase()}{prevScore != null ? ` · LAST SCORE ${prevScore.toFixed(0)}/60` : ''}
            </div>
          </div>
        </div>
        <Link href={`/recovery/injury/${id}`} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          CANCEL
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>
        <div style={{ marginTop: 24, background: C.surface, borderLeft: `2px solid ${C.brickLow}`, padding: '12px 12px', marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 4px' }}>
            6 questions about your confidence. 0 = no confidence. 100 = utmost confidence.
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dimmer, margin: '0 0 4px' }}>
            Not a clearance. A confidence read. Be honest. A medical professional and your coach make the final call.
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
            INJURY-PSYCHOLOGICAL READINESS TO RETURN TO SPORT — GLAZER 2009
          </p>
        </div>

        <IPrrsForm injuryId={id} />

        <div style={{ marginTop: 20, background: C.surface, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 10 }}>
            HOW THIS READS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: '≥ 50/60', body: 'Confidence is high. Live rolling considered with normal caution.', color: C.green },
              { label: '30–49/60', body: 'Positional work only. Live rolling not recommended.', color: C.amber },
              { label: '< 30/60', body: 'Stay in modified mode. Re-test in 7 days.', color: C.brick },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.08em', color: row.color, minWidth: 56 }}>
                  {row.label}
                </span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>
                  {row.body}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
