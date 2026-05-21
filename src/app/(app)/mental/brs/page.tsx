// BRS check-in — 6-item Brief Resilience Scale (Smith et al., 2008).
// Validated wording. Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BrsForm } from './brs-form';

export const dynamic = 'force-dynamic';

export default async function BrsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  return (
    <main style={{ background: '#1A1713', minHeight: '100vh', color: '#F5F0E8', paddingBottom: 80 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: '1px solid rgba(245,240,232,0.13)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: '#3D8B55' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
              BOUNCE BACK
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: 'rgba(245,240,232,0.22)', marginTop: 2 }}>
              BRIEF RESILIENCE SCALE
            </div>
          </div>
        </div>
        <Link href="/mental" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'rgba(245,240,232,0.22)', textDecoration: 'none' }}>
          ← MENTAL
        </Link>
      </div>

      <div style={{ padding: '24px 22px 0' }}>
        <div style={{ borderLeft: '3px solid rgba(42,92,63,0.4)', padding: '14px 14px 14px 12px', background: '#252118', marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: 'rgba(245,240,232,0.55)', margin: 0 }}>
            6 questions. 3 minutes. Tracks how you bounce back. First read is the baseline. Don&apos;t overthink the answers.
          </p>
        </div>
        <BrsForm />
      </div>
    </main>
  );
}
