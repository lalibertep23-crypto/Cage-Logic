// Step 4 — Log a session.
// Single-page form with 4 sections: when/where, technique tags (grouped by
// position), optional rolls (dynamic rows), energy/intensity/reflection.

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LogForm, type TagOption } from './log-form';
import { BrainWatermark } from '@/components/ui/brand-nav';

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

  // Athlete's previously submitted custom techniques — deduplicated, most recent first
  const { data: customRows } = await supabase
    .from('custom_technique_submissions')
    .select('name')
    .eq('athlete_id', user.id)
    .order('created_at', { ascending: false });

  const seen = new Set<string>();
  const savedCustom: string[] = [];
  for (const row of (customRows ?? [])) {
    const key = (row.name as string).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      savedCustom.push(row.name as string);
    }
  }

  return (
    <main style={{ background: '#050505', minHeight: '100vh', color: '#F2EFE8' }}>
      {/* ── Hero — image + title merged ───────────────────────────── */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        {/* Iron Army mat — log screen lives at the gym */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/iron-army-mat.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          filter: 'saturate(0.70) contrast(1.10) brightness(0.55)',
        }} />
        {/* Deep overlay — left anchor for text, bottom solid */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,4,3,0.22) 0%, rgba(5,4,3,0.15) 35%, rgba(5,4,3,0.82) 72%, rgba(5,4,3,0.99) 100%), linear-gradient(to right, rgba(5,4,3,0.88) 0%, rgba(5,4,3,0.10) 60%)',
        }} />
        {/* Edge vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 55% 40%, rgba(5,4,3,0) 35%, rgba(5,4,3,0.60) 100%)',
        }} />
        {/* Iron Army logo — gym identity mark, centered top */}
        <div style={{
          position: 'absolute', top: 16, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', zIndex: 2,
        }}>
          <img
            src="/iron-army-logo.jpg"
            alt="Iron Army Academy"
            style={{
              height: 44,
              objectFit: 'contain',
              opacity: 0.72,
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.90)) grayscale(0.30)',
            }}
          />
        </div>
        {/* Brand watermark */}
        <BrainWatermark />
        {/* Title — bottom-left anchor */}
        <div style={{ position: 'absolute', bottom: 18, left: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 28, background: '#C8943A', flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-anton)', fontSize: 28, letterSpacing: '0.08em', lineHeight: 1, color: '#F2EFE8' }}>LOG SESSION</div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'rgba(242,239,232,0.45)', marginTop: 4 }}>
                WHAT DID YOU PUT IN TODAY
              </div>
            </div>
          </div>
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

      <LogForm tags={tags} activeInjuries={activeInjuries} savedCustom={savedCustom} />
    </main>
  );
}
