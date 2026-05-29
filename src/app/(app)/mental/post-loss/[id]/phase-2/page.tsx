// Phase 2 — 24-72hr integration reflection.
// Locked until Phase 1 is at least 24hr old. Different head, different read.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Phase2Form } from './phase2-form';

export const dynamic = 'force-dynamic';

export default async function Phase2Page({
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

  // Must have Phase 1 already.
  const { data: phase1 } = await supabase
    .from('loss_phase_1_responses')
    .select('id, taken_at')
    .eq('loss_event_id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!phase1) {
    // No Phase 1 → can't do Phase 2 yet.
    redirect(`/mental/post-loss/${id}`);
  }

  // Phase 2 already submitted? Send back.
  const { data: existing } = await supabase
    .from('loss_phase_2_reflections')
    .select('id')
    .eq('loss_event_id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (existing) redirect(`/mental/post-loss/${id}`);

  const C = {
    bg: '#050505', surface: '#111111', border:  'rgba(242,239,232,0.13)',
    text: '#F2EFE8', dim: 'rgba(242,239,232,0.55)', dimmer: 'rgba(242,239,232,0.35)',
    amber: '#C8943A', amberLow: 'rgba(201,130,42,0.35)',
    brick: '#8B3A1E', brickLow: 'rgba(139,58,30,0.35)',
  };

  // 24-hour gate.
  const phase1At = new Date(phase1.taken_at as string).getTime();
  const hoursSince = (Date.now() - phase1At) / (1000 * 60 * 60);
  if (hoursSince < 24) {
    return (
      <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 22px 14px', borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 22, background: C.brick }} />
            <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>PHASE 2</span>
          </div>
          <Link href={`/mental/post-loss/${id}`} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
            ← BACK
          </Link>
        </div>
        <div style={{ padding: '0 22px' }}>
          <div style={{ marginTop: 24, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '14px 14px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.dimmer, marginBottom: 6 }}>
              NOT YET
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 4px' }}>
              Phase 2 unlocks 24 hours after Phase 1. About {Math.ceil(24 - hoursSince)} hour{Math.ceil(24 - hoursSince) === 1 ? '' : 's'} to go.
            </p>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
              THE 24-HOUR GAP IS ON PURPOSE. DIFFERENT HEAD, DIFFERENT READ.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px', borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>PHASE 2</span>
        </div>
        <Link href={`/mental/post-loss/${id}`} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          CANCEL
        </Link>
      </div>
      <div style={{ padding: '0 22px' }}>
        <div style={{ marginTop: 24, background: C.surface, borderLeft: `3px solid ${C.amberLow}`, padding: '14px 14px 14px 12px', marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 6px' }}>
            24+ hours out from Phase 1. Integration pass.
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
            FOUR QUESTIONS. THREE ENCRYPTED. ONE — THE DRILL CUE — STAYS PLAINTEXT SO THE SYSTEM CAN SURFACE IT BACK LATER.
          </p>
        </div>
        <Phase2Form eventId={id} />
      </div>
    </main>
  );
}
