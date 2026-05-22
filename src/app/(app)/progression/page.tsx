// Progression — photo belt cards + stripe tracking + criteria links + history.
// Voice: direct, dry, factual. No motivational framing.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import Image from 'next/image';
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
  brick:    '#8B3A1E',
};

const BELT_ORDER = ['white', 'blue', 'purple', 'brown', 'black'] as const;
type BeltKey = typeof BELT_ORDER[number];

type BeltStage = {
  key: BeltKey;
  label: string;
  labelColor: string;
  image: string;
  maxStripes: number;
};

const BELT_STAGES: BeltStage[] = [
  { key: 'white',  label: 'WHITE BELT',  labelColor: '#D8D2C8', image: '/white-belt.png',      maxStripes: 4 },
  { key: 'blue',   label: 'BLUE BELT',   labelColor: '#4A7FD4', image: '/blue-belt.png',       maxStripes: 4 },
  { key: 'purple', label: 'PURPLE BELT', labelColor: '#9B6FD0', image: '/purple-belt.png',     maxStripes: 4 },
  { key: 'brown',  label: 'BROWN BELT',  labelColor: '#A06535', image: '/brown-belt.png',      maxStripes: 4 },
  { key: 'black',  label: 'BLACK BELT',  labelColor: '#D4922E', image: '/first-degree.png',    maxStripes: 4 },
];

const NEXT_BELT_LABEL: Record<BeltKey, string> = {
  white:  'BLUE BELT',
  blue:   'PURPLE BELT',
  purple: 'BROWN BELT',
  brown:  'BLACK BELT',
  black:  '—',
};

const DISCIPLINE_LABELS: Record<string, string> = {
  bjj: 'BJJ', mma: 'MMA', boxing: 'BOXING', muay_thai: 'MUAY THAI',
  wrestling: 'WRESTLING', judo: 'JUDO', kickboxing: 'KICKBOXING',
};

const EVENT_LABELS: Record<string, string> = {
  stripe: 'STRIPE', belt: 'BELT', rank_other: 'RANK',
};

function StripeDots({ earned, total }: { earned: number; total: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: i < earned ? C.amber : 'rgba(245,240,232,0.14)',
            flexShrink: 0,
          }}
        />
      ))}
      <span style={{
        fontFamily: 'var(--font-dm-mono)',
        fontSize: 9,
        letterSpacing: '0.1em',
        color: earned > 0 ? C.dim : C.dimmer,
        marginLeft: 4,
      }}>
        {earned} / {total} STRIPES
      </span>
    </div>
  );
}

export default async function ProgressionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  // Current rank from DB
  const { data: disciplineRows } = await supabase
    .from('athlete_disciplines')
    .select('discipline, rank_color, stripes')
    .eq('athlete_id', user.id)
    .eq('discipline', 'bjj')
    .eq('is_primary', true)
    .limit(1);

  const discipline = disciplineRows?.[0];
  const rankColor = ((discipline?.rank_color as string | null) ?? 'white') as BeltKey;
  const stripes   = (discipline?.stripes as number | null) ?? 0;

  const currentBeltIndex = BELT_ORDER.indexOf(rankColor);

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

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 100 }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ padding: '20px 22px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
            BELT PROGRESSION
          </span>
        </div>
        <p style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 9,
          letterSpacing: '0.12em',
          color: C.dimmer,
          margin: '0 0 0 13px',
        }}>
          YOUR JOURNEY. EARNED. NOT GIVEN.
        </p>
      </div>

      {/* ── Belt cards ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '16px 16px 0' }}>
        {BELT_STAGES.map((stage, i) => {
          const isCurrent = i === currentBeltIndex;
          const isPast    = i < currentBeltIndex;
          const isFuture  = i > currentBeltIndex;

          // Stripe state for this card
          const cardStripes = isCurrent ? stripes : isPast ? 4 : 0;

          // "Next" label
          const nextLabel = isCurrent
            ? stripes < stage.maxStripes
              ? `${stage.label} — STRIPE ${stripes + 1}`
              : NEXT_BELT_LABEL[stage.key]
            : isPast
              ? 'COMPLETE'
              : '—';

          // Criteria link from-rank
          const fromRank = isCurrent
            ? `${rankColor}_${stripes}`
            : isFuture
              ? `${stage.key}_0`
              : `${stage.key}_4`;

          // Visual weight
          const cardOpacity   = isCurrent ? 1 : isPast ? 0.72 : 0.38;
          const imageOpacity  = isCurrent ? 1 : isPast ? 0.55 : 0.22;
          const borderLeft    = isCurrent
            ? `3px solid ${C.amber}`
            : isPast
              ? `3px solid rgba(245,240,232,0.18)`
              : `3px solid transparent`;

          return (
            <div
              key={stage.key}
              style={{
                position: 'relative',
                background: C.surface,
                border: `1px solid ${isCurrent ? 'rgba(212,146,46,0.28)' : C.border}`,
                borderLeft,
                overflow: 'hidden',
                opacity: cardOpacity,
              }}
            >
              <div style={{ display: 'flex', minHeight: 108 }}>

                {/* ── Left: text ───────────────────────────────── */}
                <div style={{ flex: '1 1 0', padding: '16px 14px 16px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 1, position: 'relative' }}>

                  <div>
                    {/* Belt name */}
                    <div style={{
                      fontFamily: 'var(--font-bebas)',
                      fontSize: 18,
                      letterSpacing: '0.14em',
                      color: isCurrent ? stage.labelColor : C.text,
                      lineHeight: 1,
                    }}>
                      {stage.label}
                    </div>

                    {/* Stripe dots */}
                    <StripeDots earned={cardStripes} total={stage.maxStripes} />

                    {/* Next milestone */}
                    <div style={{ marginTop: 8 }}>
                      <span style={{
                        fontFamily: 'var(--font-dm-mono)',
                        fontSize: 8,
                        letterSpacing: '0.14em',
                        color: C.dimmer,
                      }}>
                        {isPast ? 'STATUS' : 'NEXT'}
                      </span>
                      <div style={{
                        fontFamily: 'var(--font-dm-mono)',
                        fontSize: 10,
                        letterSpacing: '0.08em',
                        color: isPast ? C.dimmer : C.dim,
                        marginTop: 2,
                      }}>
                        {nextLabel}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  {!isPast && (
                    <Link
                      href={`/progression/criteria?from=${fromRank}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        marginTop: 12,
                        padding: '6px 12px 4px',
                        border: `1px solid ${isCurrent ? C.amber : 'rgba(245,240,232,0.2)'}`,
                        color: isCurrent ? C.amber : C.dimmer,
                        fontFamily: 'var(--font-bebas)',
                        fontSize: 11,
                        letterSpacing: '0.14em',
                        textDecoration: 'none',
                        alignSelf: 'flex-start',
                      }}
                    >
                      VIEW REQUIREMENTS →
                    </Link>
                  )}
                </div>

                {/* ── Right: belt photo ─────────────────────────── */}
                <div style={{ width: '38%', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  {/* Gradient fade from card bg into the photo */}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, bottom: 0,
                    width: '55%',
                    background: `linear-gradient(to right, ${C.surface}, transparent)`,
                    zIndex: 1,
                    pointerEvents: 'none',
                  }} />
                  <Image
                    src={stage.image}
                    alt={stage.label}
                    fill
                    sizes="38vw"
                    style={{ objectFit: 'cover', objectPosition: 'center', opacity: imageOpacity }}
                  />
                </div>

              </div>

              {/* Current belt indicator bar */}
              {isCurrent && (
                <div style={{
                  position: 'absolute',
                  top: 0, right: 0,
                  padding: '3px 8px',
                  background: C.amber,
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: 7,
                  letterSpacing: '0.14em',
                  color: C.bg,
                  zIndex: 2,
                }}>
                  CURRENT
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* ── Log promotion CTA ──────────────────────────────────────────── */}
      <div style={{ margin: '20px 16px 0' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderLeft: `3px solid ${C.amberLow}`,
          padding: '12px 14px',
          background: 'rgba(201,130,42,0.04)',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.14em', color: C.text }}>
              LOG A PROMOTION
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer, marginTop: 3 }}>
              STRIPE, BELT, OR OTHER RANK
            </div>
          </div>
          <Link
            href="/progression/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '7px 12px 5px',
              border: `1px solid rgba(201,130,42,0.5)`,
              color: C.amber,
              fontFamily: 'var(--font-bebas)',
              fontSize: 13,
              letterSpacing: '0.14em',
              textDecoration: 'none',
            }}
          >
            LOG →
          </Link>
        </div>
      </div>

      {/* ── History ────────────────────────────────────────────────────── */}
      <div style={{ padding: '28px 22px 0' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.dimmer }}>HISTORY</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          {events.length > 0 && (
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>
              {events.length} EVENTS
            </span>
          )}
        </div>

        {events.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', color: C.dimmer, lineHeight: 1.7 }}>
            No promotions logged yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {events.map((e, i) => (
              <div
                key={e.id}
                style={{
                  borderTop:    i === 0 ? `1px solid ${C.border}` : 'none',
                  borderBottom: `1px solid ${C.border}`,
                  padding: '14px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                }}
              >
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
                  <p style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: 9,
                    letterSpacing: '0.04em',
                    lineHeight: 1.7,
                    color: C.dim,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {e.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer note */}
        <p style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 8,
          letterSpacing: '0.12em',
          color: C.dimmer,
          textAlign: 'center',
          marginTop: 32,
          lineHeight: 1.8,
        }}>
          PROMOTIONS ARE EARNED ON THE MAT AND VERIFIED BY YOUR COACH.
        </p>

      </div>
    </main>
  );
}
