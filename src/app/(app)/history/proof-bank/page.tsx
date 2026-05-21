// Proof Bank — reverse-chrono list of "skills executed well" entries.
// Danaher principle: confidence = accumulated skills. This is the record.
// Voice: direct, dry, factual. No motivational. No emojis.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { parseISO, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const C = {
  bg:       '#1A1713',
  surface:  '#252118',
  border:   'rgba(245,240,232,0.13)',
  text:     '#F5F0E8',
  dim:      'rgba(245,240,232,0.55)',
  dimmer:   'rgba(245,240,232,0.35)',
  amber:    '#D4922E',
  amberLow: 'rgba(201,130,42,0.35)',
};

export default async function ProofBankPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  // Join session_reflections → training_sessions for the date
  const { data: rows } = await supabase
    .from('session_reflections')
    .select('id, skills_executed, session_id, training_sessions(session_date, session_type)')
    .eq('athlete_id', user.id)
    .not('skills_executed', 'is', null)
    .order('created_at', { ascending: false })
    .limit(60);

  type Entry = {
    id: string;
    sessionId: string;
    sessionDate: string;
    sessionType: string | null;
    skills: string;
  };

  const entries: Entry[] = (rows ?? [])
    .filter((r) => r.skills_executed && (r.skills_executed as string).trim().length > 0)
    .map((r) => {
      const ts = r.training_sessions as { session_date: string; session_type: string | null } | null;
      return {
        id:          r.id as string,
        sessionId:   r.session_id as string,
        sessionDate: ts?.session_date ?? '',
        sessionType: ts?.session_type ?? null,
        skills:      (r.skills_executed as string).trim(),
      };
    });

  const SESSION_TYPE_LABELS: Record<string, string> = {
    gi: 'GI', no_gi: 'NO-GI', drilling: 'DRILLING',
    open_mat: 'OPEN MAT', comp_class: 'COMP CLASS',
  };

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
              PROOF BANK
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.amberLow, marginTop: 2 }}>
              SKILLS EXECUTED WELL · {entries.length} ENTRIES
            </div>
          </div>
        </div>
        <Link href="/history" style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em',
          color: C.dimmer, textDecoration: 'none',
        }}>
          ← HISTORY
        </Link>
      </div>

      {/* ── Explainer strip ──────────────────────────────────────────────── */}
      <div style={{
        margin: '0',
        padding: '10px 22px',
        borderBottom: `1px solid ${C.border}`,
        background: C.surface,
      }}>
        <p style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 10,
          letterSpacing: '0.04em', lineHeight: 1.6,
          color: C.dim, margin: 0,
        }}>
          Confidence doesn&apos;t come from words. It comes from accumulated skills. This is yours.
        </p>
      </div>

      {/* ── Entries ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '0 22px' }}>
        {entries.length === 0 ? (
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: C.dimmer, letterSpacing: '0.08em', lineHeight: 1.7 }}>
              No entries yet.<br />
              After your next session, log skills you executed well.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}>
            {entries.map((e, i) => (
              <Link
                key={e.id}
                href={`/history/${e.sessionId}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: C.text,
                  borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
                  borderBottom: `1px solid ${C.border}`,
                  padding: '16px 0',
                }}
              >
                {/* Date + type row */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 5, height: 5, background: C.amber, flexShrink: 0 }} />
                    <span style={{
                      fontFamily: 'var(--font-bebas)', fontSize: 14,
                      letterSpacing: '0.12em', color: C.amber,
                    }}>
                      {e.sessionDate ? format(parseISO(e.sessionDate), 'EEE, MMM d').toUpperCase() : '—'}
                    </span>
                    {e.sessionType && (
                      <span style={{
                        fontFamily: 'var(--font-dm-mono)', fontSize: 8,
                        letterSpacing: '0.14em', color: C.dimmer,
                      }}>
                        {SESSION_TYPE_LABELS[e.sessionType] ?? e.sessionType.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: C.dimmer }}>→</span>
                </div>

                {/* Skills text */}
                <p style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 11,
                  letterSpacing: '0.03em', lineHeight: 1.7,
                  color: C.text, margin: 0,
                  paddingLeft: 15,
                }}>
                  {e.skills}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
