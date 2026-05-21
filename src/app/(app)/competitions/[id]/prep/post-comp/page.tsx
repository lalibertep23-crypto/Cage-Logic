// Post-Comp debrief — performance reflection after the comp date has passed.
// Encrypted free-text + plaintext drill priorities + plaintext metrics.
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { decryptField } from '@/lib/crypto';
import { PostCompForm } from './post-comp-form';

export const dynamic = 'force-dynamic';

type Level = 'low' | 'medium' | 'high';

export default async function PostCompPage({
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

  const { data: reflection } = await supabase
    .from('comp_post_reflections')
    .select('*')
    .eq('comp_id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();

  const compName = comp.name as string;

  // Decrypt on server before passing to client form
  const existing = reflection
    ? {
        whatWorked: decryptField(reflection.what_worked_encrypted as string | null),
        whatBroke: decryptField(reflection.what_broke_encrypted as string | null),
        whatSurprised: decryptField(reflection.what_surprised_encrypted as string | null),
        drillPriority1: (reflection.drill_priority_1 as string | null) ?? null,
        drillPriority2: (reflection.drill_priority_2 as string | null) ?? null,
        injuryFlag: Boolean(reflection.injury_flag),
        fatigueLevel: (reflection.fatigue_level as Level | null) ?? null,
        mentalStatePre: (reflection.mental_state_pre as Level | null) ?? null,
        mentalStateDuring: (reflection.mental_state_during as Level | null) ?? null,
        nextCompPlanned: (reflection.next_comp_planned as boolean | null) ?? null,
      }
    : null;

  const isComplete =
    existing?.whatWorked &&
    existing?.whatBroke &&
    existing?.whatSurprised &&
    existing?.drillPriority1;

  const C = {
    bg:      '#1A1713',
    surface: '#252118',
    border:  'rgba(245,240,232,0.13)',
    text:    '#F5F0E8',
    dim:     'rgba(245,240,232,0.55)',
    dimmer:  'rgba(245,240,232,0.35)',
    amber:   '#D4922E',
    amberLow:'rgba(201,130,42,0.35)',
    brick:   '#8B3A1E',
    brickLow:'rgba(139,58,30,0.35)',
  };

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>POST-COMP</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginTop: 2 }}>
              {compName.toUpperCase()}
            </div>
          </div>
        </div>
        <Link href={`/competitions/${id}`} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          ← BACK
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* Debrief complete card */}
        {isComplete && (
          <div style={{ marginTop: 24, background: C.surface, borderLeft: `3px solid ${C.amberLow}`, padding: '14px 14px 14px 12px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.amber, marginBottom: 10 }}>
              DEBRIEF COMPLETE
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em', color: C.dimmer, marginBottom: 4 }}>
                DRILL PRIORITY 1
              </div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', color: C.text }}>
                {existing!.drillPriority1}
              </div>
            </div>
            {existing!.drillPriority2 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em', color: C.dimmer, marginBottom: 4 }}>
                  DRILL PRIORITY 2
                </div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', color: C.text }}>
                  {existing!.drillPriority2}
                </div>
              </div>
            )}
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
              THESE WILL RESURFACE AS TRAINING CUES. EDIT BELOW TO UPDATE.
            </p>
          </div>
        )}

        {/* Injury flagged */}
        {existing?.injuryFlag && (
          <div style={{ marginTop: isComplete ? 8 : 24, background: C.surface, borderLeft: `3px solid ${C.brickLow}`, padding: '14px 14px 14px 12px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.brick, marginBottom: 6 }}>
              INJURY FLAGGED
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 10px' }}>
              You noted an injury. Log it in Recovery so it is tracked properly.
            </p>
            <Link href="/recovery" style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.16em', color: C.brick, textDecoration: 'none' }}>
              GO TO RECOVERY →
            </Link>
          </div>
        )}

        {/* Next comp prompt */}
        {existing?.nextCompPlanned && (
          <div style={{
            marginTop: 8, background: C.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 14px',
          }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', color: C.dim }}>
              Next comp in the plan.
            </span>
            <Link href="/competitions/new" style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.16em', color: C.amber, textDecoration: 'none' }}>
              ADD IT →
            </Link>
          </div>
        )}

        {/* The form */}
        <div style={{ marginTop: isComplete ? 16 : 24 }}>
          <PostCompForm compId={id} existing={existing} />
        </div>

      </div>
    </main>
  );
}
