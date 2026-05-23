// Session detail — read-only view reached by tapping a session row in history.
// Voice: direct, dry, factual. No motivational. No emojis.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { parseISO, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from './delete-button';

export const dynamic = 'force-dynamic';

// ── Palette ─────────────────────────────────────────────────────────────────
const C = {
  bg:       '#1A1713',
  surface:  '#252118',
  border:   'rgba(245,240,232,0.13)',
  borderMid:'rgba(245,240,232,0.14)',
  text:     '#F5F0E8',
  dim:      'rgba(245,240,232,0.55)',
  dimmer:   'rgba(245,240,232,0.35)',
  amber:    '#D4922E',
  amberLow: 'rgba(201,130,42,0.35)',
  green:    '#3D8B55',
  brick:    '#8B3A1E',
};

const SESSION_TYPE_LABELS: Record<string, string> = {
  gi:         'GI',
  no_gi:      'NO-GI',
  drilling:   'DRILLING',
  open_mat:   'OPEN MAT',
  comp_class: 'COMP CLASS',
};

const OUTCOME_LABELS: Record<string, string> = {
  tapped_them: 'TAPPED THEM',
  got_tapped:  'GOT TAPPED',
  draw:        'DRAW',
  positional:  'POSITIONAL',
};

const SIZE_LABELS: Record<string, string> = {
  smaller: 'SMALLER',
  same:    'SAME SIZE',
  bigger:  'BIGGER',
};

type Reflection = {
  what_clicked:       string | null;
  what_didnt:         string | null;
  question_for_coach: string | null;
  follow_up_notes:    string | null;
  skills_executed:    string | null;
};

type Roll = {
  id:                   string;
  round_number:         number | null;
  partner_label:        string | null;
  partner_relative_size:string | null;
  outcome:              string | null;
  outcome_method:       string | null;
  felt:                 string | null;
};

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: session } = await supabase
    .from('training_sessions')
    .select('id, session_date, start_time, duration_minutes, session_type, energy_1_10, intensity_1_10, notes')
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();

  if (!session) notFound();

  const { data: techJoinRows } = await supabase
    .from('session_techniques')
    .select('technique_id')
    .eq('session_id', id);
  const techniqueIds = (techJoinRows ?? []).map((r) => r.technique_id as string);

  let techniques: { label: string; position: string | null }[] = [];
  if (techniqueIds.length > 0) {
    const { data: tagRows } = await supabase
      .from('technique_tags')
      .select('id, label, position')
      .in('id', techniqueIds);
    techniques = (tagRows ?? [])
      .map((r) => ({ label: r.label as string, position: (r.position as string | null) ?? null }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  const [reflRes, rollRes] = await Promise.all([
    supabase.from('session_reflections').select('what_clicked, what_didnt, question_for_coach, follow_up_notes, skills_executed').eq('session_id', id),
    supabase.from('roll_logs').select('id, round_number, partner_label, partner_relative_size, outcome, outcome_method, felt').eq('session_id', id).order('round_number', { ascending: true, nullsFirst: false }),
  ]);

  const reflections: Reflection[] = (reflRes.data ?? []).map((r) => ({
    what_clicked:       (r.what_clicked as string | null) ?? null,
    what_didnt:         (r.what_didnt as string | null) ?? null,
    question_for_coach: (r.question_for_coach as string | null) ?? null,
    follow_up_notes:    (r.follow_up_notes as string | null) ?? null,
    skills_executed:    (r.skills_executed as string | null) ?? null,
  }));

  const rolls: Roll[] = (rollRes.data ?? []).map((r) => ({
    id:                   r.id as string,
    round_number:         (r.round_number as number | null) ?? null,
    partner_label:        (r.partner_label as string | null) ?? null,
    partner_relative_size:(r.partner_relative_size as string | null) ?? null,
    outcome:              (r.outcome as string | null) ?? null,
    outcome_method:       (r.outcome_method as string | null) ?? null,
    felt:                 (r.felt as string | null) ?? null,
  }));

  const sessionDate     = session.session_date as string;
  const startTime       = (session.start_time as string | null) ?? null;
  const durationMinutes = (session.duration_minutes as number | null) ?? null;
  const sessionType     = (session.session_type as string | null) ?? null;
  const energy          = (session.energy_1_10 as number | null) ?? null;
  const intensity       = (session.intensity_1_10 as number | null) ?? null;
  const notes           = (session.notes as string | null) ?? null;

  const typeLabel = sessionType ? SESSION_TYPE_LABELS[sessionType] ?? sessionType.toUpperCase() : 'SESSION';

  function statColor(v: number): string {
    if (v >= 7) return C.green;
    if (v >= 4) return C.amber;
    return C.brick;
  }

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
              {format(parseISO(sessionDate), 'EEE, MMM d').toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.18em', color: C.dimmer, marginTop: 2 }}>
              {typeLabel}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href={`/history/${id}/edit`} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.12em', color: C.amber, textDecoration: 'none', borderBottom: `1px solid ${C.amberLow}`, paddingBottom: 1 }}>
            EDIT
          </Link>
          <DeleteButton id={id} />
          <Link href="/history" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
            ← HISTORY
          </Link>
        </div>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* ── Session stats ─────────────────────────────────────────────── */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            { label: 'START',     value: startTime ? startTime.slice(0, 5) : null },
            { label: 'DURATION',  value: durationMinutes ? `${durationMinutes} MIN` : null },
            { label: 'ENERGY',    value: energy != null ? String(energy) : null,    isScore: true, raw: energy },
            { label: 'INTENSITY', value: intensity != null ? String(intensity) : null, isScore: true, raw: intensity },
          ].map((s) => (
            <div key={s.label} style={{ background: C.surface, padding: '14px 14px 12px' }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.18em', color: C.dimmer, marginBottom: 6 }}>
                {s.label}
              </div>
              {s.value != null ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{
                    fontFamily: 'var(--font-anton)', fontSize: 24, letterSpacing: '0.04em',
                    color: s.isScore && s.raw != null ? statColor(s.raw) : C.text,
                    lineHeight: 1,
                  }}>
                    {s.value}
                  </span>
                  {s.isScore && (
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.dimmer }}>/10</span>
                  )}
                </div>
              ) : (
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 14, color: C.dimmer }}>—</span>
              )}
            </div>
          ))}
        </div>

        {notes && (
          <div style={{ marginTop: 2, background: C.surface, padding: '14px 14px' }}>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>{notes}</p>
          </div>
        )}

        {/* ── Techniques ───────────────────────────────────────────────── */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.2em', color: C.dimmer }}>TECHNIQUES</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em', color: C.dimmer }}>
              {techniques.length > 0 ? `${techniques.length} TAGGED` : ''}
            </span>
          </div>

          {techniques.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: C.dimmer, letterSpacing: '0.08em' }}>None tagged.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {techniques.map((t, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
                  borderBottom: `1px solid ${C.border}`,
                  padding: '10px 0',
                }}>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em', color: C.text }}>
                    {t.label}
                  </span>
                  {t.position && (
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.14em', color: C.dimmer }}>
                      {t.position.toUpperCase()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Reflection ───────────────────────────────────────────────── */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.2em', color: C.dimmer }}>REFLECTION</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          {reflections.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: C.dimmer, letterSpacing: '0.08em' }}>No reflection on this session.</p>
          ) : (
            reflections.map((r, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {r.skills_executed && (
                  <ReflectionField label="SKILLS EXECUTED WELL" value={r.skills_executed} accent={C.amber} />
                )}
                {r.what_clicked && (
                  <ReflectionField label="WHAT CLICKED" value={r.what_clicked} />
                )}
                {r.what_didnt && (
                  <ReflectionField label="WHAT TO FIX" value={r.what_didnt} />
                )}
                {r.question_for_coach && (
                  <ReflectionField label="QUESTION FOR COACH" value={r.question_for_coach} />
                )}
                {r.follow_up_notes && (
                  <ReflectionField label="FOLLOW-UP NOTES" value={r.follow_up_notes} />
                )}
              </div>
            ))
          )}
        </div>

        {/* ── Rolls ────────────────────────────────────────────────────── */}
        {rolls.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.2em', color: C.dimmer }}>ROLLS</span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em', color: C.dimmer }}>
                {rolls.length} LOGGED
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {rolls.map((r, i) => {
                const outcomeLabel = r.outcome ? OUTCOME_LABELS[r.outcome] ?? r.outcome.toUpperCase() : null;
                const partnerBits: string[] = [];
                if (r.partner_label) partnerBits.push(r.partner_label);
                if (r.partner_relative_size) partnerBits.push(SIZE_LABELS[r.partner_relative_size] ?? r.partner_relative_size);
                return (
                  <div key={r.id} style={{ background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '14px 14px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.14em', color: C.amber }}>
                        ROUND {String(r.round_number ?? i + 1).padStart(2, '0')}
                      </span>
                      {outcomeLabel && (
                        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.12em', color: C.dim }}>
                          {outcomeLabel}{r.outcome_method ? ` · ${r.outcome_method.toUpperCase()}` : ''}
                        </span>
                      )}
                    </div>
                    {partnerBits.length > 0 && (
                      <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.1em', color: C.dimmer, margin: '0 0 8px' }}>
                        {partnerBits.join(' · ')}
                      </p>
                    )}
                    {r.felt && (
                      <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
                        {r.felt}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

// ── ReflectionField ──────────────────────────────────────────────────────────
function ReflectionField({ label, value, accent }: { label: string; value: string; accent?: string }) {
  const C = {
    surface: '#252118',
    border:  'rgba(245,240,232,0.13)',
    text:    '#F5F0E8',
    dim:     'rgba(245,240,232,0.55)',
    dimmer:  'rgba(245,240,232,0.35)',
  };
  return (
    <div style={{ background: C.surface, padding: '12px 14px', borderLeft: `2px solid ${accent ?? C.border}` }}>
      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.16em', color: accent ?? C.dimmer, marginBottom: 6 }}>
        {label}
      </div>
      <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
        {value}
      </p>
    </div>
  );
}
