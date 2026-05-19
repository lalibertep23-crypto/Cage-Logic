// Post-loss event view — summary + Phase 1 status.
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { parseISO, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const C = {
  bg:      '#1A1713',
  surface: '#252118',
  border:  'rgba(245,240,232,0.08)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.38)',
  dimmer:  'rgba(245,240,232,0.22)',
  amber:   '#D4922E',
  amberLow:'rgba(201,130,42,0.35)',
  brick:   '#8B3A1E',
  brickLow:'rgba(139,58,30,0.35)',
  green:   '#3D8B55',
};

const CONTEXT_LABELS: Record<string, string> = {
  competition: 'COMPETITION', rolling: 'ROLLING', other: 'OTHER',
};

const SEVERITY_LABELS: Record<string, string> = {
  tough: 'STINGS', rough: 'TOUGH ONE', crushing: 'CRUSHING',
};

export default async function PostLossEventPage({
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
    .select('id, context, severity, occurred_at')
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();

  if (!event) notFound();

  const [phase1Res, phase2Res] = await Promise.all([
    supabase
      .from('loss_phase_1_responses')
      .select('id, taken_at')
      .eq('loss_event_id', id)
      .eq('athlete_id', user.id)
      .order('taken_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('loss_phase_2_reflections')
      .select('id, taken_at, one_thing_to_drill')
      .eq('loss_event_id', id)
      .eq('athlete_id', user.id)
      .order('taken_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  const phase1 = phase1Res.data;
  const phase2 = phase2Res.data;

  const context = event.context as string;
  const severity = event.severity as string;
  const occurredAt = event.occurred_at as string;
  const phase1Done = phase1 != null;
  const phase1At = (phase1?.taken_at as string | null) ?? null;
  const phase2Done = phase2 != null;
  const phase2At = (phase2?.taken_at as string | null) ?? null;
  const phase2Drill = (phase2?.one_thing_to_drill as string | null) ?? null;

  // Phase 2 eligibility — needs Phase 1 + 24hr gap.
  const hoursSincePhase1 = phase1At
    ? (Date.now() - new Date(phase1At).getTime()) / (1000 * 60 * 60)
    : null;
  const phase2Eligible =
    phase1Done && !phase2Done && hoursSincePhase1 != null && hoursSincePhase1 >= 24;
  const phase2HoursToGo =
    phase1Done && !phase2Done && hoursSincePhase1 != null && hoursSincePhase1 < 24
      ? Math.ceil(24 - hoursSincePhase1)
      : null;

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.brick }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
              {CONTEXT_LABELS[context] ?? context.toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginTop: 2 }}>
              {SEVERITY_LABELS[severity] ?? severity.toUpperCase()}
            </div>
          </div>
        </div>
        <Link href="/mental" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          ← MENTAL
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* Meta */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            { label: 'WHEN',     value: format(parseISO(occurredAt), 'EEE, MMM d').toUpperCase() },
            { label: 'SEVERITY', value: SEVERITY_LABELS[severity] ?? severity.toUpperCase() },
          ].map((s) => (
            <div key={s.label} style={{ background: C.surface, padding: '12px 12px 10px' }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em', color: C.dimmer, marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em', color: C.text }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Phase 1 */}
        {phase1Done ? (
          <div style={{ marginTop: 16, background: C.surface, borderLeft: `3px solid ${C.green}`, padding: '14px 14px 14px 12px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.green, marginBottom: 6 }}>
              PHASE 1 — DONE
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 4px' }}>
              Logged {phase1At ? format(parseISO(phase1At), 'MMM d, h:mm a') : '—'}.
            </p>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
              CONTENT ENCRYPTED AT REST. NOT SHARED WITH COACHES. SYSTEM TRACKS THAT YOU WROTE — NOT WHAT.
            </p>
          </div>
        ) : (
          <div style={{ marginTop: 16, background: C.surface, borderLeft: `3px solid ${C.brickLow}`, padding: '14px 14px 14px 12px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.text, marginBottom: 6 }}>
              PHASE 1 REFLECTION
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 12px' }}>
              Five structured questions. Right now, while it&apos;s fresh.
            </p>
            <Link
              href={`/mental/post-loss/${id}/phase-1`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 16px 7px',
                border: `1px solid ${C.brick}`,
                color: C.brick,
                fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.14em',
                textDecoration: 'none',
              }}
            >
              START PHASE 1 →
            </Link>
          </div>
        )}

        {/* Phase 2 done */}
        {phase1Done && phase2Done && (
          <div style={{ marginTop: 8, background: C.surface, borderLeft: `3px solid ${C.green}`, padding: '14px 14px 14px 12px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.green, marginBottom: 6 }}>
              PHASE 2 — DONE
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 8px' }}>
              Logged {phase2At ? format(parseISO(phase2At), 'MMM d, h:mm a') : '—'}.
            </p>
            {phase2Drill && (
              <div style={{ background: C.bg, borderLeft: `2px solid ${C.amberLow}`, padding: '10px 10px 10px 10px', marginTop: 8 }}>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em', color: C.dimmer, marginBottom: 4 }}>
                  DRILL CUE
                </div>
                <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', color: C.text, margin: 0 }}>
                  {phase2Drill}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Phase 2 unlocked */}
        {phase2Eligible && (
          <div style={{ marginTop: 8, background: C.surface, borderLeft: `3px solid ${C.amberLow}`, padding: '14px 14px 14px 12px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.amber, marginBottom: 6 }}>
              PHASE 2 UNLOCKED
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 12px' }}>
              24+ hours out from Phase 1. Different head now. Four questions, integration pass.
            </p>
            <Link
              href={`/mental/post-loss/${id}/phase-2`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 16px 7px',
                border: `1px solid ${C.amber}`,
                color: C.amber,
                fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.14em',
                textDecoration: 'none',
              }}
            >
              START PHASE 2 →
            </Link>
          </div>
        )}

        {/* Phase 2 locked */}
        {phase2HoursToGo != null && (
          <div style={{ marginTop: 8, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '14px 14px 14px 12px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.dimmer, marginBottom: 6 }}>
              PHASE 2 — LOCKED
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 4px' }}>
              Unlocks in about {phase2HoursToGo} hour{phase2HoursToGo === 1 ? '' : 's'}.
            </p>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
              THE 24-HOUR GAP IS ON PURPOSE. DIFFERENT HEAD, DIFFERENT READ.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
