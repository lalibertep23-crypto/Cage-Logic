// Report injury form page.
// Voice: direct, dry, factual. No motivational. No emojis.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InjuryForm } from './injury-form';

export const dynamic = 'force-dynamic';

function localDateString(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default async function NewInjuryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  return (
    <main style={{ background: '#1A1713', minHeight: '100vh', color: '#F5F0E8', paddingBottom: 80 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: '1px solid rgba(245,240,232,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: '#8B3A1E' }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
            REPORT INJURY
          </span>
        </div>
        <Link href="/recovery" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(245,240,232,0.22)', textDecoration: 'none' }}>
          ← RECOVERY
        </Link>
      </div>

      <div style={{ padding: '24px 22px 0' }}>
        <div style={{ borderLeft: '3px solid rgba(139,58,30,0.4)', padding: '14px 14px 14px 12px', background: '#252118', marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: 'rgba(245,240,232,0.38)', margin: 0 }}>
            Something more than sore. Log what happened. Reporting this puts you in modified training mode. Soreness logging continues separately.
          </p>
        </div>
        <InjuryForm today={localDateString(new Date())} />
      </div>
    </main>
  );
}
