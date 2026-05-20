// Add a new competition event. Per-match results are added on the detail view.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CompetitionForm } from './competition-form';

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
    bg: '#1A1713', surface: '#252118', border: 'rgba(245,240,232,0.5)',
    text: '#F5F0E8', dim: 'rgba(245,240,232,0.38)', dimmer: 'rgba(245,240,232,0.22)',
    amber: '#D4922E',
  };

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>
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
