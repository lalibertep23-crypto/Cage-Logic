// Step 4 — Log a session.
// Single-page form with 4 sections: when/where, technique tags (grouped by
// position), optional rolls (dynamic rows), energy/intensity/reflection.

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LogForm, type TagOption } from './log-form';

export const dynamic = 'force-dynamic';

export default async function LogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/');
  }

  const { data: tagRows } = await supabase
    .from('technique_tags')
    .select('id, slug, label, position, category, side, is_custom')
    .order('position', { ascending: true })
    .order('side', { ascending: true })
    .order('label', { ascending: true });

  const tags: TagOption[] = (tagRows ?? []).map((r) => ({
    id: r.id as string,
    slug: r.slug as string,
    label: r.label as string,
    position: (r.position as string | null) ?? null,
    category: (r.category as string | null) ?? null,
    side: (r.side as string | null) ?? 'neutral',
  }));

  // Active injuries: anything not resolved
  const { data: injuryRows } = await supabase
    .from('injury_reports')
    .select('id, body_region, side')
    .eq('athlete_id', user.id)
    .neq('stage', 'resolved');

  const activeInjuries = (injuryRows ?? []).map((r) => ({
    id: r.id as string,
    body_region: r.body_region as string,
    side: (r.side as string | null) ?? null,
  }));

  return (
    <main style={{ background: '#050505', minHeight: '100vh', color: '#F2EFE8' }}>
      {/* ── Hero — image + title merged ───────────────────────────── */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        {/* Image — iron-army-mat.png until log-session_bright.jpg is generated */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/iron-army-mat.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          filter: 'saturate(1.1) contrast(1.05)',
        }} />
        {/* Gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.05) 0%, rgba(5,5,5,0.25) 40%, rgba(5,5,5,0.88) 78%, rgba(5,5,5,1) 100%), linear-gradient(to right, rgba(5,5,5,0.70) 0%, rgba(5,5,5,0) 55%)',
        }} />
        {/* Title overlaid — bottom-left anchor */}
        <div style={{
          position: 'absolute', bottom: 18, left: 22, right: 22,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 28, background: '#C8943A', flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-anton)', fontSize: 28, letterSpacing: '0.08em', lineHeight: 1, color: '#F2EFE8' }}>LOG SESSION</div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'rgba(242,239,232,0.45)', marginTop: 4 }}>
                WHAT DID YOU PUT IN TODAY
              </div>
            </div>
          </div>
          <Link href="/home" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em',
            color: 'rgba(242,239,232,0.28)', textDecoration: 'none',
          }}>
            ← HOME
          </Link>
        </div>
      </div>

      {/* Active injury banner */}
      {activeInjuries.length > 0 && (
        <div style={{
          background: 'rgba(164,58,47,0.20)',
          borderBottom: '1px solid rgba(164,58,47,0.40)',
          padding: '10px 22px',
          fontFamily: 'var(--font-dm-mono)', fontSize: 9,
          letterSpacing: '0.1em', color: '#C8943A',
        }}>
          {activeInjuries.length} active injur{activeInjuries.length === 1 ? 'y' : 'ies'} on file — log how it felt today.
        </div>
      )}

      <LogForm tags={tags} activeInjuries={activeInjuries} />
    </main>
  );
}