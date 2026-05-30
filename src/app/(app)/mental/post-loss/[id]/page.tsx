// Post-loss event view — summary + Phase 1/2 status.
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { parseISO, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import { BrandNav } from '@/components/ui/brand-nav';

export const dynamic = 'force-dynamic';

const C = {
  bg:      '#050505',
  surface: '#111111',
  border:  'rgba(242,239,232,0.13)',
  text:    '#F2EFE8',
  dim:     'rgba(242,239,232,0.55)',
  dimmer:  'rgba(242,239,232,0.35)',
  amber:   '#C8943A',
  amberLow:'rgba(201,130,42,0.35)',
  brick:   '#8B3A1E',
  brickLow:'rgba(139,58,30,0.35)',
  green:   '#5C8A3C',
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
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>
      <BrandNav backHref="/mental" />

      {/* ── Header ───────────────────────────────────────────────────────── */}
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
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.18em', color: C.dimmer, marginTop: 2 }}>
              {SEVERITY_LABELS[severity] ?? severity.toUpperCase()}
            </div>
          </div>
        </div>
        <Link href="/mental" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          ← MENTAL
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* ── Meta ─────────────────────────────────────────────────────── */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            { label: 'WHEN',     value: format(parseISO(occurredAt), 'EEE, MMM d').toUpperCase() },
            { label: 'SEVERITY', value: SEVERITY_LABELS[severity] ?? severity.toUpperCase() },
          ].map((s) => (
            <div key={s.label} style={{ background: C.surface, padding: '12px 12px 10px' }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.16em', color: C.dimmer, marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, letterSpacing: '0.04em', color: C.text }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Phase 1 ──────────────────────────────────────────────────── */}
        {phase1Done ? (
          <div style={{ marginTop: 16, background: C.surface, borderLeft: `3px solid ${C.green}`, padding: '16px 16px 14px 14px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.2em', color: C.green, marginBottom: 8 }}>
              PHASE 1 — DONE
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 8px' }}>
              Logged {phase1At ? format(parseISO(phase1At), 'MMM d, h:mm a') : '—'}.
            </p>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', color: C.dimmer, margin: 0, lineHeight: 1.5 }}>
              Content encrypted. Not shared with coaches. System tracks that you wrote — not what.
            </p>
          </div>
        ) : (
          <div style={{ marginTop: 16, background: C.surface, borderLeft: `3px solid ${C.brick}`, padding: '16px 16px 14px 14px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.2em', color: C.brick, marginBottom: 8 }}>
              PHASE 1 — NOT DONE
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 16px' }}>
              Five structured questions. Right now, while it&apos;s fresh.
            </p>
            <Link
              href={`/mental/post-loss/${id}/phase-1`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 18px 8px',
                border: `1px solid ${C.brick}`,
                color: C.brick,
                fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.14em',
                textDecoration: 'none',
              }}
            >
              START PHASE 1 →
            </Link>
          </div>
        )}

        {/* ── Phase 2 done ─────────────────────────────────────────────── */}
        {phase1Done && phase2Done && (
          <div style={{ marginTop: 8, background: C.surface, borderLeft: `3px solid ${C.green}`, padding: '16px 16px 14px 14px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.2em', color: C.green, marginBottom: 8 }}>
              PHASE 2 — DONE
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 8px' }}>
              Logged {phase2At ? format(parseISO(phase2At), 'MMM d, h:mm a') : '—'}.
            </p>
            {phase2Drill && (
              <div style={{ background: C.bg, borderLeft: `2px solid ${C.amberLow}`, padding: '12px 12px', marginTop: 10 }}>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.14em', color: C.dimmer, marginBottom: 6 }}>
                  DRILL CUE
                </div>
                <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em', color: C.text, margin: 0, lineHeight: 1.6 }}>
                  {phase2Drill}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Phase 2 unlocked ─────────────────────────────────────────── */}
        {phase2Eligible && (
          <div style={{ marginTop: 8, background: C.surface, borderLeft: `3px solid ${C.amber}`, padding: '16px 16px 14px 14px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.2em', color: C.amber, marginBottom: 8 }}>
              PHASE 2 UNLOCKED
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 16px' }}>
              24+ hours out from Phase 1. Different head now. Four questions, integration pass.
            </p>
            <Link
              href={`/mental/post-loss/${id}/phase-2`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 18px 8px',
                border: `1px solid ${C.amber}`,
                color: C.amber,
                fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.14em',
                textDecoration: 'none',
              }}
            >
              START PHASE 2 →
            </Link>
          </div>
        )}

        {/* ── Phase 2 locked ───────────────────────────────────────────── */}
        {phase2HoursToGo != null && (
          <div style={{ marginTop: 8, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '16px 16px 14px 14px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.2em', color: C.dimmer, marginBottom: 8 }}>
              PHASE 2 — LOCKED
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 8px' }}>
              Unlocks in about {phase2HoursToGo} hour{phase2HoursToGo === 1 ? '' : 's'}.
            </p>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', color: C.dimmer, margin: 0, lineHeight: 1.5 }}>
              The 24-hour gap is on purpose. Different head, different read.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
