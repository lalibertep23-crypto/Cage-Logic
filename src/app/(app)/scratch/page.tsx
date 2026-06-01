// Scratch Pad — quick staging area for notes before logging.
// One text area. Saves to athletes.scratch_pad. No scoring, no analysis.
// Accessible from home screen and log header.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import { ScratchForm } from './scratch-form';
import { BrandNav } from '@/components/ui/brand-nav';

export const dynamic = 'force-dynamic';

export default async function ScratchPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: athlete } = await supabase
    .from('athletes')
    .select('scratch_pad, updated_at')
    .eq('id', user.id)
    .maybeSingle();

  const existing = (athlete?.scratch_pad as string | null) ?? '';
  const updatedAt = (athlete?.updated_at as string | null) ?? null;
  const updatedLabel = updatedAt
    ? format(parseISO(updatedAt), 'MMM d · h:mm a').toUpperCase()
    : null;

  return (
    <main style={{
      minHeight: '100vh',
      background: '#050505',
      color: '#F2EFE8',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 40,
    }}>
      <BrandNav backHref="/home" />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: '1px solid rgba(242,239,232,0.10)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: '#C8943A' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
              SCRATCH PAD
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: 'rgba(242,239,232,0.35)', marginTop: 2 }}>
              NOTES · NOT LOGGED · REFERENCE ONLY
            </div>
          </div>
        </div>
        <Link
          href="/log"
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 13,
            letterSpacing: '0.16em',
            color: '#C8943A',
            textDecoration: 'none',
            border: '1px solid rgba(200,148,58,0.40)',
            padding: '5px 12px 3px',
          }}
        >
          LOG SESSION →
        </Link>
      </div>

      <ScratchForm existing={existing} updatedAt={updatedLabel} />
    </main>
  );
}
