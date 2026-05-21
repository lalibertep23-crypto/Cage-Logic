// Daily injury progress log. Pain + function + modified-training + encrypted notes.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProgressForm } from './progress-form';

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

export default async function ProgressNewPage({
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

  const { data: inj } = await supabase
    .from('injury_reports')
    .select('id, body_region')
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!inj) notFound();

  const region =
    REGION_LABELS[inj.body_region as string] ?? (inj.body_region as string);

  const C = {
    bg: '#1A1713', surface: '#252118', border:  'rgba(245,240,232,0.13)',
    text: '#F5F0E8', dim: 'rgba(245,240,232,0.55)', dimmer: 'rgba(245,240,232,0.22)',
    brick: '#8B3A1E', brickLow: 'rgba(139,58,30,0.35)',
  };

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px', borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.brick }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>PROGRESS LOG</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer, marginTop: 2 }}>
              {region.toUpperCase()}
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
            Daily read on pain + function. 30 seconds. Builds the trend over time.
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
            HONEST READS BUILD ACCURATE TRENDS.
          </p>
        </div>

        <ProgressForm injuryId={id} />
      </div>
    </main>
  );
}
