// Step 9c — Injury detail.
// Shows injury fields, decrypts notes server-side, button to take I-PRRS.
// Hard rule: not medical advice; medical professional + coach make the call.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { parseISO, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import { decryptField } from '@/lib/crypto';
import { markInjuryResolvedAction } from './actions';

export const dynamic = 'force-dynamic';

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
  green:   '#3D8B55',
};

const REGION_LABELS: Record<string, string> = {
  head: 'HEAD', neck: 'NECK', shoulder: 'SHOULDER', elbow: 'ELBOW',
  wrist_hand: 'WRIST / HAND', ribs: 'RIBS', upper_back: 'UPPER BACK',
  low_back: 'LOWER BACK', hip_groin: 'HIP / GROIN', knee: 'KNEE',
  ankle_foot: 'ANKLE / FOOT', other: 'OTHER',
};

const SIDE_LABELS: Record<string, string> = {
  left: 'LEFT', right: 'RIGHT', bilateral: 'BOTH', axial: 'CENTER', na: '',
};

const STAGE_LABELS: Record<string, string> = {
  acute: 'ACUTE', sub_acute: 'SUB-ACUTE', modified_training: 'MODIFIED TRAINING',
  return_to_drill: 'RETURN TO DRILL', return_to_roll: 'RETURN TO ROLL', resolved: 'RESOLVED',
};

function painColor(v: number | null): string {
  if (v == null) return C.dim;
  if (v <= 3) return C.green;
  if (v <= 6) return C.amber;
  return C.brick;
}

export default async function InjuryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: injury } = await supabase
    .from('injury_reports')
    .select('id, body_region, side, mechanism, pain_at_report_0_10, occurred_on, reported_at, stage, i_prrs_score, resolved_on, notes_encrypted')
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();

  if (!injury) notFound();

  let notes: string | null = null;
  try {
    notes = decryptField(injury.notes_encrypted as string | null);
  } catch {
    notes = '[encrypted — could not decrypt]';
  }

  const region     = injury.body_region as string;
  const side       = (injury.side as string | null) ?? 'na';
  const stage      = (injury.stage as string | null) ?? 'acute';
  const pain       = (injury.pain_at_report_0_10 as number | null) ?? null;
  const occurredOn = injury.occurred_on as string;
  const mechanism  = (injury.mechanism as string | null) ?? null;
  const iPrrsScore = injury.i_prrs_score != null ? Number(injury.i_prrs_score) : null;
  const resolvedOn = (injury.resolved_on as string | null) ?? null;

  const regionLabel = REGION_LABELS[region] ?? region.toUpperCase();
  const sideLabel   = side !== 'na' && SIDE_LABELS[side] ? ` (${SIDE_LABELS[side]})` : '';

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.brick }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 20, letterSpacing: '0.08em' }}>
              {regionLabel}{sideLabel}
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginTop: 2 }}>
              {STAGE_LABELS[stage] ?? stage.toUpperCase()}
            </div>
          </div>
        </div>
        <Link href="/recovery" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          ← RECOVERY
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* Stats grid */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            { label: 'OCCURRED',     value: format(parseISO(occurredOn), 'MMM d, yyyy').toUpperCase() },
            { label: 'PAIN AT REPORT', value: pain != null ? `${pain}/10` : '—' },
            { label: 'LATEST I-PRRS', value: iPrrsScore != null ? `${iPrrsScore.toFixed(0)}/60` : '—' },
            { label: 'RESOLVED',     value: resolvedOn ? format(parseISO(resolvedOn), 'MMM d, yyyy').toUpperCase() : '—' },
          ].map((s) => (
            <div key={s.label} style={{ background: C.surface, padding: '12px 12px 10px' }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em', color: C.dimmer, marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, letterSpacing: '0.04em', color: C.text }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Mechanism */}
        {mechanism && (
          <div style={{ marginTop: 16, background: C.surface, borderLeft: `3px solid ${C.brickLow}`, padding: '14px 14px 14px 12px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 11, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 8 }}>
              HOW IT HAPPENED
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0, whiteSpace: 'pre-wrap' }}>
              {mechanism}
            </p>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div style={{ marginTop: 8, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '14px 14px 14px 12px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 11, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 8 }}>
              NOTES (ENCRYPTED)
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0, whiteSpace: 'pre-wrap' }}>
              {notes}
            </p>
          </div>
        )}

        {/* Return readiness CTA */}
        <div style={{ marginTop: 16, background: C.surface, borderLeft: `3px solid ${C.amberLow}`, padding: '14px 14px 14px 12px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.18em', color: C.text, marginBottom: 6 }}>
            RETURN READINESS
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 12px' }}>
            I-PRRS confidence check before live rolling. 6 questions, 2 minutes. Not a clearance — a confidence read. Medical professional and coach make the final call.
          </p>
          <Link
            href={`/recovery/injury/${id}/return`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 16px 7px',
              border: `1px solid ${C.amber}`,
              color: C.amber,
              fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.14em',
              textDecoration: 'none',
            }}
          >
            TAKE I-PRRS CHECK →
          </Link>
        </div>

        {/* Daily progress logs */}
        <ProgressSection injuryId={id} resolved={resolvedOn != null} />

        {/* Mark resolved */}
        {!resolvedOn && (
          <form action={markInjuryResolvedAction}>
            <input type="hidden" name="injuryId" value={id} />
            <div style={{ marginTop: 16, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '14px 14px' }}>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.dimmer, marginBottom: 6 }}>
                CLOSE IT OUT
              </div>
              <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 12px' }}>
                Done with this one. Marks resolved and exits modified mode.
              </p>
              <button
                type="submit"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '9px 16px 7px',
                  border: `1px solid ${C.brick}`,
                  background: 'transparent',
                  color: C.brick,
                  fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.14em',
                  cursor: 'pointer',
                }}
              >
                MARK RESOLVED
              </button>
            </div>
          </form>
        )}

      </div>
    </main>
  );
}

async function ProgressSection({
  injuryId,
  resolved,
}: {
  injuryId: string;
  resolved: boolean;
}) {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from('injury_progress_logs')
    .select('id, log_date, pain_0_10, function_0_10, did_modified_training, created_at')
    .eq('injury_id', injuryId)
    .order('created_at', { ascending: false })
    .limit(14);

  const logs = (rows ?? []).map((r) => ({
    id:          r.id as string,
    log_date:    r.log_date as string,
    pain:        (r.pain_0_10 as number | null) ?? null,
    fn:          (r.function_0_10 as number | null) ?? null,
    didModified: (r.did_modified_training as boolean | null) ?? false,
  }));

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>PROGRESS</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        {!resolved && (
          <Link
            href={`/recovery/injury/${injuryId}/progress/new`}
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.amber, textDecoration: 'none' }}
          >
            + LOG TODAY
          </Link>
        )}
      </div>

      {logs.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', color: C.dimmer }}>
          No progress logs yet. Daily pain + function check builds the trend.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {logs.map((l, i) => (
            <div
              key={l.id}
              style={{
                borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
                borderBottom: `1px solid ${C.border}`,
                padding: '12px 0',
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              }}
            >
              <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.1em', color: C.text }}>
                {format(parseISO(l.log_date), 'EEE, MMM d').toUpperCase()}
              </span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.08em', color: C.dim }}>
                <span style={{ color: painColor(l.pain) }}>PAIN {l.pain ?? '—'}/10</span>
                {' · '}
                <span>FN {l.fn ?? '—'}/10</span>
                {l.didModified ? ' · MOD' : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
