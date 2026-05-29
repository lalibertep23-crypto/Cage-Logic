// Soreness logger — tap a number, tag regions, save. Upserts daily_soreness_logs.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SorenessForm } from './soreness-form';

export const dynamic = 'force-dynamic';

function localDateString(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default async function SorenessPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: existing } = await supabase
    .from('daily_soreness_logs')
    .select('overall_soreness_0_10, energy_0_10, body_regions')
    .eq('athlete_id', user.id)
    .eq('log_date', localDateString(new Date()))
    .maybeSingle();

  const defaults = {
    overall: existing ? ((existing.overall_soreness_0_10 as number | null) ?? null) : null,
    energy: existing ? ((existing.energy_0_10 as number | null) ?? null) : null,
    regions: existing ? ((existing.body_regions as string[] | null) ?? []) : [],
  };

  return (
    <main style={{ background: '#050505', minHeight: '100vh', color: '#F2EFE8', paddingBottom: 80 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: '1px solid rgba(242,239,232,0.13)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: '#C8943A' }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
            SORENESS
          </span>
        </div>
        <Link href="/recovery" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(242,239,232,0.35)', textDecoration: 'none' }}>
          ← RECOVERY
        </Link>
      </div>

      <div style={{ padding: '24px 22px 0' }}>
        <div style={{ borderLeft: '3px solid rgba(201,130,42,0.35)', padding: '14px 14px 14px 12px', background: '#111111', marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: 'rgba(242,239,232,0.55)', margin: 0 }}>
            Anything sore today. Tap a number, tag where, save. Ten seconds.
          </p>
        </div>
        <SorenessForm defaults={defaults} />
      </div>
    </main>
  );
}
