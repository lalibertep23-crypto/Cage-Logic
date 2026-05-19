// Daily mental check-in. 1-tap, 5-option mood read.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CheckInForm } from './check-in-form';

export const dynamic = 'force-dynamic';

export default async function CheckInPage() {
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
          <div style={{ width: 3, height: 22, background: '#D4922E' }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
            DAILY READ
          </span>
        </div>
        <Link href="/mental" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(245,240,232,0.22)', textDecoration: 'none' }}>
          ← MENTAL
        </Link>
      </div>

      <div style={{ padding: '24px 22px 0' }}>
        <div style={{ borderLeft: '3px solid rgba(201,130,42,0.35)', padding: '14px 14px 14px 12px', background: '#252118', marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: 'rgba(245,240,232,0.38)', margin: 0 }}>
            Where&apos;s your head at today. One tap. 10 seconds. Builds the Mental domain — daily moves it faster than weekly.
          </p>
        </div>
        <CheckInForm />
      </div>
    </main>
  );
}
