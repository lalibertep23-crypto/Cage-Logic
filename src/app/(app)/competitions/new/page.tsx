// Add a new competition event. Per-match results are added on the detail view.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CompetitionForm } from './competition-form';
import { BrandNav } from '@/components/ui/brand-nav';

export const dynamic = 'force-dynamic';

function localDateString(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default async function NewCompetitionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const C = {
    bg: '#050505', surface: '#111111', border:  'rgba(242,239,232,0.13)',
    text: '#F2EFE8', dim: 'rgba(242,239,232,0.55)', dimmer: 'rgba(242,239,232,0.35)',
    amber: '#C8943A',
  };

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>
      <BrandNav backHref="/competitions" />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px', borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>NEW COMPETITION</span>
        </div>
        <Link href="/competitions" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          CANCEL
        </Link>
      </div>
      <div style={{ padding: '0 22px' }}>
        <div style={{ marginTop: 24, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '12px 12px', marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 4px' }}>
            Log the event itself first. Add per-match results on the next screen.
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
            PAST OR UPCOMING — BOTH WORK. PICK THE DATE.
          </p>
        </div>
        <CompetitionForm today={localDateString(new Date())} />
      </div>
    </main>
  );
}
