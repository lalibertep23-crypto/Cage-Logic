// Breathwork — Performance Pillar, Phase 1.
// Protocol: nose inhale 4s → pause 1s → exhale through mouth/guard 6s.
// Trains breath economy under mouthguard restriction + lays foundation for CAP timing.
// Research: Laborde 2024, Schulze 2019, Fincham 2023, Harbour 2022, Buscà 2016.
// Phase 1 is free-tier. Full 5-phase progression unlocks in V1.5.
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { format, parseISO, startOfWeek } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import { BreathworkGuide } from './breathwork-guide';

export const dynamic = 'force-dynamic';

// ── Palette ─────────────────────────────────────────────────────────────────
const C = {
  bg:        '#1A1713',
  surface:   '#252118',
  bgSunk:    '#13110E',
  border:    'rgba(245,240,232,0.13)',
  borderMid: 'rgba(245,240,232,0.22)',
  text:      '#F5F0E8',
  dim:       'rgba(245,240,232,0.38)',
  dimmer:    'rgba(245,240,232,0.22)',
  amber:     '#D4922E',
  amberLow:  'rgba(201,130,42,0.35)',
  green:     '#3D8B55',
  greenLow:  'rgba(42,92,63,0.4)',
};

const PHASE_1_TARGET = 14;

const PHASES = [
  {
    num: '1',
    label: 'FOUNDATION',
    desc: 'Diaphragmatic breathing with mouthguard in. 5.5 breaths/min. Outside training context.',
    current: true,
  },
  {
    num: '2',
    label: 'STATIC + MOVEMENT',
    desc: 'Hold the pattern through low-intensity movement. Squat, lunge, hip circle. Mouthguard in.',
    current: false,
  },
  {
    num: '2.5',
    label: 'CAP INTEGRATION',
    desc: 'When to clench vs. when to breathe. Takedowns, escapes, bridges, scrambles — clench. Drilling, flow rolling — breathe.',
    current: false,
  },
  {
    num: '3',
    label: 'DRILLING',
    desc: 'Apply the pattern during real class drilling. No separate session — integrated into class.',
    current: false,
  },
  {
    num: '4',
    label: 'FLOW ROLLING',
    desc: 'Exhale every transition, inhale every setup. Build personal breath-holding pattern awareness.',
    current: false,
  },
  {
    num: '5',
    label: 'FULL INTENSITY',
    desc: 'Maintain breath-sync under full-intensity rolling. Pressure → exhale. Scramble → exhale. Setup → inhale.',
    current: false,
  },
];

export default async function BreathworkPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();

  const [{ count: weekCount }, { count: phase1Count }, { data: recent }] = await Promise.all([
    (supabase as any)
      .from('breathwork_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('athlete_id', user.id)
      .gte('completed_at', weekStart),
    (supabase as any)
      .from('breathwork_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('athlete_id', user.id)
      .eq('pattern', 'phase_1'),
    (supabase as any)
      .from('breathwork_sessions')
      .select('id, pattern, duration_min, completed_at')
      .eq('athlete_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(5),
  ]);

  const phase1Sessions = phase1Count ?? 0;
  const phase1Pct = Math.min(100, (phase1Sessions / PHASE_1_TARGET) * 100);
  const phase1Done = phase1Sessions >= PHASE_1_TARGET;

  const sessions = (recent ?? []).map((r: any) => ({
    id:          r.id as string,
    pattern:     r.pattern as string,
    durationMin: r.duration_min as number,
    completedAt: r.completed_at as string,
  }));

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Hero — image + title merged ──────────────────────────────────── */}
      <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
        {/* Image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/breathwork-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          filter: 'saturate(1.2) contrast(1.1)',
        }} />
        {/* Gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(15,13,11,0.05) 0%, rgba(15,13,11,0.2) 40%, rgba(15,13,11,0.85) 78%, rgba(15,13,11,1) 100%), linear-gradient(to right, rgba(15,13,11,0.72) 0%, rgba(15,13,11,0) 55%)',
        }} />
        {/* Title overlaid — bottom-left anchor */}
        <div style={{
          position: 'absolute', bottom: 18, left: 22, right: 22,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 28, background: C.amber, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-anton)', fontSize: 28, letterSpacing: '0.08em', lineHeight: 1 }}>BREATHWORK</div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.amberLow, marginTop: 3 }}>PERFORMANCE PILLAR — PHASE 1</div>
            </div>
          </div>
          <Link href="/mental" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none', paddingBottom: 2 }}>
            ← MENTAL
          </Link>
        </div>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* ── Phase 1 progress ─────────────────────────────────────────── */}
        <div style={{
          marginTop: 24,
          borderLeft: `3px solid ${phase1Done ? C.green : C.amber}`,
          background: C.surface,
          padding: '16px 16px 16px 14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.2em', color: phase1Done ? C.green : C.amber }}>
              PHASE 1 PROGRESS
            </span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.14em', color: C.dimmer }}>
              {phase1Sessions} / {PHASE_1_TARGET} SESSIONS
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, background: C.border, marginBottom: 12 }}>
            <div style={{
              height: '100%',
              width: `${phase1Pct}%`,
              background: phase1Done ? C.green : C.amber,
              transition: 'width 0.4s ease',
            }} />
          </div>

          {phase1Done ? (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', color: C.green, margin: 0 }}>
              Phase 1 complete. Talk to your coach about Phase 2.
            </p>
          ) : (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim, margin: 0 }}>
              {PHASE_1_TARGET - phase1Sessions} sessions to completion. Requires: comfort 7+/10 and 5 unbroken minutes at 5.5 breaths/min.
            </p>
          )}
        </div>

        {/* ── Session — the guide lives here ───────────────────────────── */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>
              SESSION
            </span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer }}>
              THIS WEEK: {weekCount ?? 0}
            </span>
          </div>
          <BreathworkGuide />
        </div>

        {/* ── Protocol ─────────────────────────────────────────────────── */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>
              PHASE 1 PROTOCOL
            </span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          {/* Breath pattern — three flat boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, marginBottom: 16 }}>
            {[
              { phase: 'IN',    detail: 'NOSE',         secs: '4s', color: C.amber },
              { phase: 'PAUSE', detail: '',             secs: '1s', color: C.dimmer },
              { phase: 'OUT',   detail: 'MOUTH / GUARD', secs: '6s', color: C.green },
            ].map((p) => (
              <div
                key={p.phase}
                style={{
                  background: C.surface,
                  borderTop: `2px solid ${p.color}`,
                  padding: '12px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.2em', color: C.dimmer }}>{p.phase}</span>
                <span style={{ fontFamily: 'var(--font-anton)', fontSize: 28, letterSpacing: '0.04em', color: p.color, lineHeight: 1 }}>{p.secs}</span>
                {p.detail && (
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 7, letterSpacing: '0.14em', color: C.dimmer }}>{p.detail}</span>
                )}
              </div>
            ))}
          </div>

          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
            11 seconds per breath = 5.5 breaths/min. Slightly under coherence frequency. Long exhale trains parasympathetic activation and CO₂ tolerance simultaneously.
          </p>

          <div style={{ marginTop: 16, borderLeft: `2px solid ${C.border}`, padding: '12px 14px', background: C.surface }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 8 }}>POSITION</div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
              Lie on your back. Mouthguard in. One hand on chest, one on belly. Belly should rise. Chest stays still. If chest moves first, you&apos;re not there yet.
            </p>
          </div>
        </div>

        {/* ── What this trains ─────────────────────────────────────────── */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>
              WHAT THIS TRAINS
            </span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ borderLeft: `2px solid ${C.amberLow}`, padding: '12px 14px', background: C.surface }}>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.amber, marginBottom: 6 }}>
                1 — BREATH ECONOMY
              </div>
              <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
                Diaphragmatic breathing with the mouthguard in. Most athletes breathe shallowly under the restriction and never fix it. Six weeks of Phase 1 changes that baseline. Laborde 2024: consistent HRV gains and improved O₂ efficiency at equivalent effort.
              </p>
            </div>

            <div style={{ borderLeft: `2px solid ${C.border}`, padding: '12px 14px', background: C.surface }}>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.dimmer, marginBottom: 6 }}>
                2 — CAP TIMING (PHASE 2.5)
              </div>
              <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
                Concurrent Activation Potentiation — a brief jaw clench during peak force output neurologically potentiates prime movers 5–15%. Buscà 2016, Allen et al. The clench is not breathing. You train the switch: sustained breath as the default, clench as the tool for the moment that matters.
              </p>
            </div>
          </div>

          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.08em', lineHeight: 1.7, color: C.dimmer, marginTop: 12 }}>
            Schulze 2019: vented mouthguards improve breathing economy — but the app trains the athlete, not the hardware. Works with any standard mouthguard already in use.
          </p>
        </div>

        {/* ── Phase map ────────────────────────────────────────────────── */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>
              THE PROGRESSION
            </span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PHASES.map((ph, i) => (
              <div
                key={ph.num}
                style={{
                  display: 'flex',
                  gap: 14,
                  borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
                  borderBottom: `1px solid ${C.border}`,
                  padding: '14px 0',
                  opacity: ph.current ? 1 : 0.35,
                }}
              >
                <div style={{
                  width: 22, height: 22,
                  background: ph.current ? C.amber : 'transparent',
                  border: ph.current ? 'none' : `1px solid ${C.borderMid}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: 9,
                  color: ph.current ? C.bg : C.dimmer,
                  letterSpacing: '0.04em',
                }}>
                  {ph.num}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.14em', color: ph.current ? C.text : C.dim }}>
                      {ph.label}
                    </span>
                    {ph.current && (
                      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.amber }}>
                        CURRENT
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0 }}>
                    {ph.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.08em', lineHeight: 1.7, color: C.dimmer, marginTop: 12 }}>
            Phases 2–5 unlock in a future update. Phase 5 completion earns the only badge in the app. Maintenance mode after that — the pattern is yours.
          </p>
        </div>

        {/* ── Recent sessions ──────────────────────────────────────────── */}
        {sessions.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>
                RECENT
              </span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {sessions.map((s: any, i: number) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
                    borderBottom: `1px solid ${C.border}`,
                    padding: '11px 0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 6, height: 6, background: C.amber, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.14em', color: C.text }}>
                      {s.pattern === 'phase_1' ? 'PHASE 1' : s.pattern.toUpperCase()}
                    </span>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>
                      {s.durationMin} MIN
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer }}>
                    {format(parseISO(s.completedAt), 'MMM d').toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
