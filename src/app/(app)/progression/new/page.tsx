// Log a promotion (stripe / belt / other rank). V1: athlete self-logs.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PromotionForm } from './promotion-form';

export const dynamic = 'force-dynamic';

function localDateString(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default async function NewPromotionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: discRows } = await supabase
    .from('athlete_disciplines')
    .select('id, discipline, rank_color, stripes, is_primary')
    .eq('athlete_id', user.id)
    .order('is_primary', { ascending: false });

  const disciplines = (discRows ?? []).map((r) => ({
    id: r.id as string,
    discipline: r.discipline as string,
    rank_color: (r.rank_color as string | null) ?? null,
    stripes: (r.stripes as number | null) ?? 0,
  }));

  if (disciplines.length === 0) {
    // Edge case: no disciplines on file. Redirect home — V1 onboarding
    // always creates one, so this shouldn't fire in practice.
    redirect('/profile');
  }

  const C = {
    bg: '#1A1713', surface: '#252118', border:  'rgba(245,240,232,0.13)',
    text: '#F5F0E8', dim: 'rgba(245,240,232,0.55)', dimmer: 'rgba(245,240,232,0.22)',
    amber: '#D4922E', amberLow: 'rgba(201,130,42,0.35)',
  };

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px', borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>LOG PROMOTION</span>
        </div>
        <Link href="/progression" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          CANCEL
        </Link>
      </div>
      <div style={{ padding: '0 22px' }}>
        <div style={{ marginTop: 24, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '12px 12px', marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 4px' }}>
            Log a stripe, belt promotion, or other rank. Self-logged for now — coach-verified promotions come later.
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
            SAVING UPDATES YOUR CURRENT RANK ON YOUR PROFILE.
          </p>
        </div>
        <PromotionForm disciplines={disciplines} today={localDateString(new Date())} />
      </div>
    </main>
  );
}
