// Add a match to a competition.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MatchForm } from './match-form';
import { BrandNav } from '@/components/ui/brand-nav';

export const dynamic = 'force-dynamic';

export default async function NewMatchPage({
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

  const { data: comp } = await supabase
    .from('competitions')
    .select('id, name, comp_date')
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!comp) notFound();

  const C = {
    bg:      '#050505',
    surface: '#111111',
    border:  'rgba(242,239,232,0.13)',
    text:    '#F2EFE8',
    dim:     'rgba(242,239,232,0.55)',
    dimmer:  'rgba(242,239,232,0.35)',
    amber:   '#C8943A',
  };

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>
      <BrandNav backHref="/competitions" />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>ADD MATCH</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginTop: 2 }}>
              {(comp.name as string).toUpperCase()}
            </div>
          </div>
        </div>
        <Link href={`/competitions/${id}`} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          CANCEL
        </Link>
      </div>

      <div style={{ padding: '16px 22px 0' }}>
        <div style={{ background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '12px 12px', marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
            One match per submission. Add more matches to the same event after.
          </p>
        </div>
        <MatchForm competitionId={id} />
      </div>
    </main>
  );
}
