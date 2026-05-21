// Mental hub — Cage Logic design system.
// Four action panels. Flat, no rounded cards. Concrete palette.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { parseISO, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// ── Palette ────────────────────────────────────────────────────────────────
const C = {
  bg:        '#1A1713',
  surface:   '#252118',
  border:    'rgba(245,240,232,0.13)',
  borderMid: 'rgba(245,240,232,0.35)',
  text:      '#F5F0E8',
  dim:       'rgba(245,240,232,0.55)',
  dimmer:    'rgba(245,240,232,0.35)',
  amber:     '#D4922E',
  amberLow:  'rgba(201,130,42,0.35)',
  green:     '#3D8B55',
  greenLow:  'rgba(42,92,63,0.35)',
  brick:     '#8B3A1E',
  brickLow:  'rgba(139,58,30,0.35)',
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
          opacity: 0.7,
        }} />
      )}
      {/* Overlay — solid black on text side, clear on image side */}
      <div style={{
        position: 'absolute', inset: 0,
        background: bgImage
          ? 'linear-gradient(90deg, rgba(15,13,11,0.97) 0%, rgba(15,13,11,0.97) 38%, rgba(15,13,11,0.55) 62%, rgba(15,13,11,0.05) 100%)'
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
            fontSize: 20,
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
          fontSize: 11,
          letterSpacing: '0.04em',
          lineHeight: 1.6,
          color: C.dim,
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

/** BRS panel — same shape but shows the score if it exists */
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
        backgroundImage: 'url(/mental-brs_bright.jpg)',
        backgroundSize: '130%',
        backgroundPosition: '85% center',
        filter: 'saturate(1.5) contrast(1.1)',
        opacity: 0.7,
      }} />
      {/* Overlay — opaque on text side, fades earlier to reveal more of image */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(15,13,11,0.97) 0%, rgba(15,13,11,0.97) 30%, rgba(15,13,11,0.55) 55%, rgba(15,13,11,0.05) 100%)',
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
          fontSize: 20,
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
          fontSize: 10,
          letterSpacing: '0.14em',
          color: C.dimmer,
        }}>
          NO SCORE YET.
        </span>
      )}

      {/* CTA */}
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
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Hero — image + title merged ─────────────────────────────── */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        {/* Image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/cage-logic-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          filter: 'saturate(1.3) contrast(1.1)',
        }} />
        {/* Gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(15,13,11,0.0) 0%, rgba(15,13,11,0.15) 40%, rgba(15,13,11,0.82) 75%, rgba(15,13,11,1) 100%), linear-gradient(to right, rgba(15,13,11,0.75) 0%, rgba(15,13,11,0) 55%)',
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
          bgImage="/mental-breath_bright.jpg"
        />

        {/* 4 — After a loss */}
        <Panel
          accentColor={C.brick}
          label="AFTER A LOSS"
          body="Lost a match. Got tapped hard. Bad day. Log it. The system reads the feel and routes from there."
          cta="PROCESS IT"
          href="/mental/post-loss/new"
          bgImage="/mental-loss_bright.jpg"
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
  