// Phase 1 — acute post-loss reflection page.
// 5 structured questions. If already submitted for this event, redirect to the event view.
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Phase1Form } from './phase1-form';

export const dynamic = 'force-dynamic';

export default async function Phase1Page({
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

  const { data: event } = await supabase
    .from('loss_events')
    .select('id')
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!event) notFound();

  // Already submitted? Go back to event view.
  const { data: existing } = await supabase
    .from('loss_phase_1_responses')
    .select('id')
    .eq('loss_event_id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (existing) redirect(`/mental/post-loss/${id}`);

  const C = {
    bg: '#1A1713', surface: '#252118', border: 'rgba(245,240,232,0.5)',
    text: '#F5F0E8', dim: 'rgba(245,240,232,0.38)', dimmer: 'rgba(245,240,232,0.22)',
    brick: '#8B3A1E', brickLow: 'rgba(139,58,30,0.35)',
  };

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px', borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.brick }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>PHASE 1</span>
        </div>
        <Link href={`/mental/post-loss/${id}`} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          CANCEL
        </Link>
      </div>
      <div style={{ padding: '0 22px' }}>
        <div style={{ marginTop: 24, background: C.surface, borderLeft: `3px solid ${C.brickLow}`, padding: '14px 14px 14px 12px', marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 6px' }}>
            Five questions. Right now, while it&apos;s fresh.
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
            FREE-TEXT ENCRYPTED AT REST. NOT SHARED WITH COACHES. SYSTEM ONLY KNOWS THAT YOU WROTE.
          </p>
        </div>
        <Phase1Form eventId={id} />
      </div>
    </main>
  );
}
