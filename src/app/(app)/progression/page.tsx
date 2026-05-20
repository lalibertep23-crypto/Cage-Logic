// Progression — list of past stripe / belt / rank promotions.
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { parseISO, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const C = {
  bg:      '#1A1713',
  surface: '#252118',
  border:  'rgba(245,240,232,0.5)',
  borderMid:'rgba(245,240,232,0.14)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.38)',
  dimmer:  'rgba(245,240,232,0.22)',
  amber:   '#D4922E',
  amberLow:'rgba(201,130,42,0.35)',
};

const DISCIPLINE_LABELS: Record<string, string> = {
  bjj: 'BJJ', mma: 'MMA', boxing: 'BOXING', muay_thai: 'MUAY THAI',
  wrestling: 'WRESTLING', judo: 'JUDO', kickboxing: 'KICKBOXING',
};

const EVENT_LABELS: Record<string, string> = {
  stripe: 'STRIPE', belt: 'BELT', rank_other: 'RANK',
};

export default async function ProgressionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: rows } = await supabase
    .from('progression_events')
    .select('id, discipline, event_type, to_rank, awarded_at, notes')
    .eq('athlete_id', user.id)
    .order('awarded_at', { ascending: false });

  const events = (rows ?? []).map((r) => ({
    id:         r.id as string,
    discipline: r.discipline as string,
    event_type: r.event_type as string,
    to_rank:    r.to_rank as string,
    awarded_at: r.awarded_at as string,
    notes:      (r.notes as string | null) ?? null,
  }));

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>PROGRESSION</span>
        </div>
        <Link href="/profile" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>← PROFILE</Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* Log promotion CTA */}
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.surface, borderLeft: `3px solid ${C.amberLow}`, padding: '14px 16px 14px 14px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.14em', color: C.text }}>NEW PROMOTION</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer, marginTop: 4 }}>STRIPE, BELT, OR OTHER RANK</div>
          </div>
          <Link href="/progression/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 14px 6px',
            border: `1px solid ${C.amber}`,
            color: C.amber,
            fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.14em',
            textDecoration: 'none',
          }}>
            LOG →
          </Link>
        </div>

        {/* History */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>HISTORY</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            {events.length > 0 && (
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>{events.length} EVENTS</span>
            )}
          </div>

          {events.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', color: C.dimmer }}>
              No promotions logged yet. First one earns its place here.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {events.map((e, i) => (
                <div key={e.id} style={{
                  borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
                  borderBottom: `1px solid ${C.border}`,
                  padding: '14px 0',
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.12em', color: C.amber }}>
                      {e.to_rank.toUpperCase()}
                    </span>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer }}>
                      {format(parseISO(e.awarded_at), 'MMM d, yyyy').toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dim }}>
                      {DISCIPLINE_LABELS[e.discipline] ?? e.discipline.toUpperCase()}
                    </span>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em', color: C.dimmer }}>
                      {EVENT_LABELS[e.event_type] ?? e.event_type.toUpperCase()}
                    </span>
                  </div>
                  {e.notes && (
                    <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {e.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
