// Mental hub — Cage Logic design system.
// Four action panels. Flat, no rounded cards. Concrete palette.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { parseISO, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// ── Palette ────────────────────────────────────────────────────────────────
const C = {
  bg:        '#050505',
  surface:   '#111111',
  border:    'rgba(242,239,232,0.10)',
  borderMid: 'rgba(242,239,232,0.18)',
  text:      '#F2EFE8',
  dim:       'rgba(242,239,232,0.45)',
  dimmer:    'rgba(242,239,232,0.28)',
  amber:     '#C8943A',
  amberLow:  'rgba(200,148,58,0.25)',
  green:     '#3D8B55',
  greenLow:  'rgba(42,92,63,0.35)',
  brick:     '#A43A2F',
  brickLow:  'rgba(164,58,47,0.20)',
};

const CONTEXT_LABELS: Record<string, string> = {
  competition: 'COMPETITION',
  rolling:     'ROLLING',
  other:       'OTHER',
};

const SEVERITY_LABELS: Record<string, string> = {
  tough:    'STINGS',
  rough:    'TOUGH ONE',
  crushing: 'CRUSHING',
};

// ── Sub-components ─────────────────────────────────────────────────────────

/** Flat action panel — optional bg image, left accent stripe, label, body, CTA */
function Panel({
  accentColor,
  label,
  sublabel,
  body,
  cta,
  href,
  bgImage,
}: {
  accentColor: string;
  label: string;
  sublabel?: string;
  body: string;
  cta: string;
  href: string;
  bgImage?: string;
}) {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderLeft: `3px solid ${accentColor}`,
      borderBottom: `1px solid ${C.border}`,
      minHeight: bgImage ? 180 : undefined,
    }}>
      {/* Background image — anchored right so subject clears the text zone */}
      {bgImage && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          filter: 'saturate(1.5) contrast(1.1)',
          opacity: 0.95,
        }} />
      )}
      {/* Overlay — sharper falloff so image breathes on right side */}
      <div style={{
        position: 'absolute', inset: 0,
        background: bgImage
          ? 'linear-gradient(90deg, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.78) 20%, rgba(5,5,5,0.12) 42%, rgba(5,5,5,0.0) 100%)'
          : C.surface,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '18px 18px 18px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {/* Label row */}
        <div>
          <div style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 24,
            letterSpacing: '0.12em',
            color: accentColor,
            lineHeight: 1,
          }}>
            {label}
          </div>
          {sublabel && (
            <div style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 8,
              letterSpacing: '0.16em',
              color: C.dimmer,
              marginTop: 3,
            }}>
              {sublabel}
            </div>
          )}
        </div>

        {/* Body */}
        <p style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 13,
          letterSpacing: '0.04em',
          lineHeight: 1.6,
          color: 'rgba(242,239,232,0.68)',
          margin: 0,
        }}>
          {body}
        </p>

        {/* CTA */}
        <Link href={href} style={{ textDecoration: 'none', display: 'inline-block' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px 6px',
            background: 'transparent',
            border: `1px solid ${accentColor}`,
            color: accentColor,
            fontFamily: 'var(--font-bebas)',
            fontSize: 15,
            letterSpacing: '0.14em',
          }}>
            {cta} →
          </div>
        </Link>
      </div>
    </div>
  );
}

/** BRS panel — shows score if it exists, CTA always available.
 * BRS is a trait measure. Athlete decides when to re-test — no app-imposed schedule.
 * Last taken date shown as context only. */
function BrsPanel({
  score,
  takenAt,
}: {
  score: number | null;
  takenAt: string | null;
}) {

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderLeft: `3px solid ${C.green}`,
      borderBottom: `1px solid ${C.border}`,
      minHeight: 180,
    }}>
      {/* Background image — shifted right so brain clears text zone */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/mental-brs_bright.png)',
        backgroundSize: '130%',
        backgroundPosition: '85% center',
        filter: 'saturate(1.6) contrast(1.15)',
        opacity: 0.92,
      }} />
      {/* Overlay — sharper falloff */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.78) 20%, rgba(5,5,5,0.12) 42%, rgba(5,5,5,0.0) 100%)',
      }} />
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '18px 18px 18px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
      {/* Label row */}
      <div>
        <div style={{
          fontFamily: 'var(--font-bebas)',
          fontSize: 24,
          letterSpacing: '0.12em',
          color: C.green,
          lineHeight: 1,
        }}>
          BOUNCE BACK
        </div>
        <div style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 8,
          letterSpacing: '0.16em',
          color: C.dimmer,
          marginTop: 3,
        }}>
          BRIEF RESILIENCE SCALE
        </div>
      </div>

      {/* Score or placeholder */}
      {score != null && takenAt ? (
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 28,
            letterSpacing: '0.04em',
            color: C.text,
          }}>
            {score.toFixed(2)}
            <span style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 11,
              color: C.dim,
              marginLeft: 4,
            }}>
              / 5.00
            </span>
          </span>
          <span style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 9,
            letterSpacing: '0.14em',
            color: C.dimmer,
          }}>
            {format(parseISO(takenAt), 'MMM d').toUpperCase()}
          </span>
        </div>
      ) : (
        <span style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 12,
          letterSpacing: '0.14em',
          color: C.dim,
        }}>
          NO SCORE YET.
        </span>
      )}

      {/* CTA — always available. Athlete initiates when ready. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Link href="/mental/brs" style={{ textDecoration: 'none', display: 'inline-block' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px 6px',
            background: 'transparent',
            border: `1px solid ${C.green}`,
            color: C.green,
            fontFamily: 'var(--font-bebas)',
            fontSize: 15,
            letterSpacing: '0.14em',
          }}>
            {score != null ? 'RE-TEST' : 'RUN IT'} →
          </div>
        </Link>
        {takenAt && (
          <span style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 9,
            letterSpacing: '0.12em',
            color: C.dimmer,
          }}>
            LAST: {format(parseISO(takenAt), 'MMM d').toUpperCase()}
          </span>
        )}
      </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function MentalHubPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const [brsRes, lossRes] = await Promise.all([
    supabase
      .from('psych_assessments')
      .select('score, taken_at')
      .eq('athlete_id', user.id)
      .eq('instrument', 'BRS')
      .order('taken_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('loss_events')
      .select('id, context, severity, occurred_at')
      .eq('athlete_id', user.id)
      .order('occurred_at', { ascending: false })
      .limit(3),
  ]);

  const latestBrsScore  = brsRes.data?.score != null ? Number(brsRes.data.score) : null;
  const latestBrsAt     = (brsRes.data?.taken_at as string | null) ?? null;

  const losses = (lossRes.data ?? []).map((r) => ({
    id:          r.id as string,
    context:     (r.context as string | null) ?? 'other',
    severity:    (r.severity as string | null) ?? 'tough',
    occurred_at: r.occurred_at as string,
  }));

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text, paddingBottom: 80 }}>

      {/* ── Hero — image + title merged ─────────────────────────────── */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        {/* Image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/mental-hero_bright.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          filter: 'saturate(1.3) contrast(1.1)',
        }} />
        {/* Gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.0) 0%, rgba(5,5,5,0.15) 40%, rgba(5,5,5,0.82) 75%, rgba(5,5,5,1) 100%), linear-gradient(to right, rgba(5,5,5,0.75) 0%, rgba(5,5,5,0) 55%)',
        }} />
        {/* Title overlaid — bottom-left anchor */}
        <div style={{
          position: 'absolute', bottom: 18, left: 22, right: 22,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 28, background: C.amber, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-anton)', fontSize: 28, letterSpacing: '0.08em', lineHeight: 1, color: C.text }}>MENTAL</div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.amberLow, marginTop: 3 }}>PSYCH · BREATH · RESILIENCE</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Panels ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>

        {/* 1 — Daily read */}
        <Panel
          accentColor={C.amber}
          label="DAILY READ"
          body="Where's your head at today. One tap, 10 seconds."
          cta="CHECK IN"
          href="/mental/check-in"
          bgImage="/mental-daily_bright.jpg"
        />

        {/* 2 — BRS */}
        <BrsPanel score={latestBrsScore} takenAt={latestBrsAt} />

        {/* 3 — Breathwork */}
        <Panel
          accentColor={C.green}
          label="BREATHWORK"
          sublabel="PHASE 1 — PERFORMANCE PILLAR"
          body="Regulation and reset. Pre-training or pre-comp. Logged automatically."
          cta="START SESSION"
          href="/breathwork"
          bgImage="/mental-breathwork-hero.png"
        />

        {/* 4 — After a loss */}
        <Panel
          accentColor={C.brick}
          label="AFTER A LOSS"
          body="Lost a match. Got tapped hard. Bad day. Log it. The system reads the feel and routes from there."
          cta="PROCESS IT"
          href="/mental/post-loss/new"
          bgImage="/B2-mental-check-in.png"
        />
      </div>

      {/* ── Recent losses ───────────────────────────────────────────── */}
      {losses.length > 0 && (
        <div style={{ marginTop: 28, padding: '0 22px' }}>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 9,
              letterSpacing: '0.22em',
              color: C.brickLow,
            }}>
              RECENT
            </span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          {/* Loss rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {losses.map((l, li) => (
              <Link
                key={l.id}
                href={`/mental/post-loss/${l.id}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: C.text,
                  borderTop: li === 0 ? `1px solid ${C.border}` : 'none',
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 6, height: 6, background: C.brick, flexShrink: 0 }} />
                    <span style={{
                      fontFamily: 'var(--font-dm-mono)',
                      fontSize: 10,
                      letterSpacing: '0.14em',
                      color: C.dim,
                    }}>
                      {CONTEXT_LABELS[l.context] ?? l.context}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-dm-mono)',
                      fontSize: 9,
                      letterSpacing: '0.12em',
                      color: C.dimmer,
                    }}>
                      {SEVERITY_LABELS[l.severity] ?? l.severity}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontFamily: 'var(--font-dm-mono)',
                      fontSize: 9,
                      letterSpacing: '0.14em',
                      color: C.dimmer,
                    }}>
                      {format(parseISO(l.occurred_at), 'MMM d').toUpperCase()}
                    </span>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: C.brickLow }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
