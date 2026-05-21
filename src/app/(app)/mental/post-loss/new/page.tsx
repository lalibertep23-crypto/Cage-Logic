// Post-loss entry — tough-loss gate.
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { GateForm } from './gate-form';

export const dynamic = 'force-dynamic';

export default async function PostLossNewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const C = {
    bg:      '#1A1713',
    surface: '#252118',
    border:  'rgba(245,240,232,0.13)',
    text:    '#F5F0E8',
    dim:     'rgba(245,240,232,0.55)',
    dimmer:  'rgba(245,240,232,0.35)',
    amber:   '#D4922E',
    brick:   '#8B3A1E',
    brickLow:'rgba(139,58,30,0.35)',
  };

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.brick }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>TOUGH EVENT</span>
        </div>
        <Link href="/mental" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          CANCEL
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>
        <div style={{ marginTop: 24, background: C.surface, borderLeft: `3px solid ${C.brickLow}`, padding: '14px 14px 14px 12px', marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 6px' }}>
            Two questions before the system decides whether to run a structured reflection.
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dimmer, margin: 0 }}>
            Honest answers. Picking &quot;Fine&quot; logs nothing. Heavier picks open different paths.
          </p>
        </div>
        <GateForm />
      </div>
    </main>
  );
}
