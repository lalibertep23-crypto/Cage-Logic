// Progression — belt art + stripe overlay + criteria link + promotion history.
// Voice: direct, dry, factual.

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

const BELT_COLORS: Record<string, string> = {
  white:  '#E8E4DC',
  blue:   '#2B5BA8',
  purple: '#6B3FA0',
  brown:  '#7B4A1E',
  black:  '#1A1A1A',
};

const DISCIPLINE_LABELS: Record<string, string> = {
  bjj: 'BJJ', mma: 'MMA', boxing: 'BOXING', muay_thai: 'MUAY THAI',
  wrestling: 'WRESTLING', judo: 'JUDO', kickboxing: 'KICKBOXING',
};

const EVENT_LABELS: Record<string, string> = {
  stripe: 'STRIPE', belt: 'BELT', rank_other: 'RANK',
};

function BeltSVG({ color, stripes, maxStripes = 4 }: { color: string; stripes: number; maxStripes?: number }) {
  const beltFill = BELT_COLORS[color] ?? BELT_COLORS.white;
  const isBlack = color === 'black';
  const stripePositions = [252, 263, 274, 285];
  return (
    <svg viewBox="0 0 310 64" style={{ width: '100%', maxWidth: 310, display: 'block' }} aria-label={`${color} belt, ${stripes} stripe${stripes !== 1 ? 's' : ''}`}>
      {/* Belt body */}
      <rect x="0" y="12" width="295" height="40" rx="5" fill={beltFill} />
      {/* Center crease */}
      <rect x="0" y="30" width="295" height="4" fill="rgba(0,0,0,0.08)" />
      {/* Black tip panel */}
      <rect x="238" y="12" width="57" height="40" rx="3" fill="#111" />
      {/* Tip edge highlight */}
      <rect x="238" y="12" width="2" height="40" fill="rgba(255,255,255,0.06)" />
      {/* Stripe marks */}
      {stripePositions.slice(0, maxStripes).map((x, i) => (
        <rect
          key={i}
          x={x}
          y="16"
          width="7"
          height="32"
          rx="1"
          fill={i < stripes ? (isBlack ? '#D4922E' : '#FFFFFF') : 'rgba(255,255,255,0.12)'}
        />
      ))}
      {/* Belt tip fold */}
      <ellipse cx="295" cy="32" rx="6" ry="20" fill={beltFill} opacity="0.4" />
    </svg>
  );
}

export default async function ProgressionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  // Primary BJJ discipline (rank state)
  const { data: disciplineRows } = await supabase
    .from('athlete_disciplines')
    .select('discipline, rank_color, stripes')
    .eq('athlete_id', user.id)
    .eq('discipline', 'bjj')
    .eq('is_primary', true)
    .limit(1);

  const discipline = disciplineRows?.[0];
  const rankColor = (discipline?.rank_color as string | null) ?? 'white';
  const stripes   = (discipline?.stripes as number | null) ?? 0;

  // Determine criteria key for next rank
  const fromRank = `${rankColor}_${stripes}`;
  const nextRankLabel = stripes < 4
    ? `STRIPE ${stripes + 1}`
    : rankColor === 'white'  ? 'BLUE BELT'
    : rankColor === 'blue'   ? 'PURPLE BELT'
    : rankColor === 'purple' ? 'BROWN BELT'
    : rankColor === 'brown'  ? 'BLACK BELT'
    : '—';

  // History
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

  const rankLabel = stripes > 0
    ? `${rankColor.toUpperCase()} BELT — ${stripes} STRIPE${stripes !== 1 ? 'S' : ''}`
    : `${rankColor.toUpperCase()} BELT`;

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>PROGRESSION</span>
        </div>
        <Link href="/profile" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>← PROFILE</Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* Belt art section */}
        <div style={{ marginTop: 28 }}>
          <div style={{ padding: '22px 18px 20px', background: C.surface, border: `1px solid ${C.border}` }}>

            {/* Belt SVG */}
            <div style={{ padding: '0 4px 18px' }}>
              <BeltSVG color={rankColor} stripes={stripes} />
            </div>

            {/* Rank label */}
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 18, letterSpacing: '0.14em', color: C.amber, marginBottom: 4 }}>
              {rankLabel}
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, marginBottom: 18 }}>
              BJJ · IRON ARMY
            </div>

            {/* Next milestone row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em', color: C.dimmer, marginBottom: 4 }}>NEXT MILESTONE</div>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.12em', color: C.text }}>{nextRankLabel}</div>
              </div>
              <Link
                href={`/progression/criteria?from=${fromRank}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px 6px',
                  border: `1px solid ${C.amber}`,
                  color: C.amber,
                  fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.14em',
                  textDecoration: 'none',
                }}
              >
                VIEW CRITERIA →
              </Link>
            </div>

          </div>
        </div>

        {/* Log new promotion CTA */}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `3px solid ${C.amberLow}`, padding: '12px 14px 12px 14px', background: 'rgba(201,130,42,0.04)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.14em', color: C.text }}>LOG A PROMOTION</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer, marginTop: 3 }}>STRIPE, BELT, OR OTHER RANK</div>
          </div>
          <Link href="/progression/new" style={{ display: 'inline-flex', alignItems: 'center', padding: '7px 12px 5px', border: `1px solid rgba(201,130,42,0.5)`, color: C.amber, fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.14em', textDecoration: 'none' }}>
            LOG →
          </Link>
        </div>

        {/* History */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.dimmer }}>HISTORY</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            {events.length > 0 && (
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>{events.length} EVENTS</span>
            )}
          </div>

          {events.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', color: C.dimmer, lineHeight: 1.7 }}>
              No promotions logged yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {events.map((e, i) => (
                <div key={e.id} style={{ borderTop: i === 0 ? `1px solid ${C.border}` : 'none', borderBottom: `1px solid ${C.border}`, padding: '14px 0', display: 'flex', flexDirection: 'column', gap: 5 }}>
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
