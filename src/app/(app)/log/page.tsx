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
    <main style={{ background: '#1A1713', minHeight: '100vh', color: '#F5F0E8' }}>
      {/* ── Hero — image + title merged ───────────────────────────── */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        {/* Image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/log-session_bright.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          filter: 'saturate(1.3) contrast(1.1)',
        }} />
        {/* Gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(15,13,11,0.05) 0%, rgba(15,13,11,0.2) 40%, rgba(15,13,11,0.85) 78%, rgba(15,13,11,1) 100%), linear-gradient(to right, rgba(15,13,11,0.65) 0%, rgba(15,13,11,0) 50%)',
        }} />
        {/* Title overlaid — bottom-left anchor */}
        <div style={{
          position: 'absolute', bottom: 18, left: 22, right: 22,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 28, background: '#D4922E', flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-anton)', fontSize: 28, letterSpacing: '0.08em', lineHeight: 1, color: '#F5F0E8' }}>LOG SESSION</div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'rgba(245,240,232,0.5)', marginTop: 4 }}>
                WHAT DID YOU PUT IN TODAY
              </div>
            </div>
          </div>
          <Link href="/home" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em',
            color: 'rgba(245,240,232,0.3)', textDecoration: 'none',
          }}>
            ← HOME
          </Link>
        </div>
      </div>

      {/* Active injury banner */}
      {activeInjuries.length > 0 && (
        <div style={{
          background: 'rgba(139,58,30,0.25)',
          borderBottom: '1px solid rgba(139,58,30,0.5)',
          padding: '10px 22px',
          fontFamily: 'var(--font-dm-mono)', fontSize: 9,
          letterSpacing: '0.1em', color: '#D4922E',
        }}>
          {activeInjuries.length} active injur{activeInjuries.length === 1 ? 'y' : 'ies'} on file — log how it felt today.
        </div>
      )}

      <LogForm tags={tags} activeInjuries={activeInjuries} />
    </main>
  );
}