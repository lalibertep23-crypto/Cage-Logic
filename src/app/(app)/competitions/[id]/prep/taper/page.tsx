// Taper Plan detail — comp prep phase screen.
// Rewritten per Chris Denardo validation (Iron Army BJJ, Frankie Edgar's gym).
// Key correction: volume does NOT drop week over week for BJJ.
// The taper is a comp-WEEK structure, not a multi-week percentage reduction.
// MMA taper deferred to V2.
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { differenceInCalendarDays, parseISO, format, getDay } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Comp week schedule — assumes Saturday competition (most common).
// Wednesday = last hard day at Iron Army. Thursday = off. Friday = athlete-dependent.
const COMP_WEEK = [
  { day: 'Mon', label: 'Monday',    note: 'Normal volume. Full rounds. Last full week of training.',          hard: false },
  { day: 'Tue', label: 'Tuesday',   note: 'Normal volume. Full rounds.',                                      hard: false },
  { day: 'Wed', label: 'Wednesday', note: 'Last hard session. Heavy rounds. This is your final intensity day.', hard: true  },
  { day: 'Thu', label: 'Thursday',  note: 'Off. Full rest.',                                                  hard: false },
  { day: 'Fri', label: 'Friday',    note: 'Light drill or full rest. Athlete-dependent.',                    hard: false },
  { day: 'Sat', label: 'Saturday',  note: 'Compete.',                                                         hard: true  },
];

const STOP_DOING_UNIVERSAL = [
  'No max-effort lifting — comp week, full stop.',
  'No new techniques debuted in competition unless extremely confident.',
  'No diet experiments — comp week, full stop.',
];

const STOP_DOING_ATHLETE = [
  'Taper off heavy rounds 2–3 days before comp (can be earlier depending on recovery).',
  'Full rest the day before comp for most athletes — adjust based on how you feel.',
];

const MENTAL_FILTER = [
  'Two weeks out: stop learning new techniques for competition. Trust your A-game.',
  'You can still train and drill anything in class — just don\'t plan to debut it under pressure.',
  'Your best positions have hundreds of reps behind them. New ones don\'t.',
];

function getPhaseLabel(daysOut: number): { label: string; note: string } {
  if (daysOut > 14) {
    return {
      label: `${daysOut} days out`,
      note: 'Full training. No changes needed yet. Trust what you\'ve built.',
    };
  }
  if (daysOut > 7) {
    return {
      label: `${daysOut} days out — mental filter on`,
      note: 'Still training hard. Two-week mental filter active: no new techniques planned for competition.',
    };
  }
  if (daysOut === 7) {
    return {
      label: 'Comp week starts',
      note: 'Monday of comp week. Volume holds normal through Wednesday. Then taper sharp.',
    };
  }
  if (daysOut > 1) {
    return {
      label: `${daysOut} days out — comp week`,
      note: 'Follow the comp week schedule below.',
    };
  }
  if (daysOut === 1) {
    return {
      label: 'Day before',
      note: 'Light drill or full rest. No heavy effort. Fuel. Sleep. Done.',
    };
  }
  if (daysOut === 0) {
    return { label: 'Today', note: 'Trust the work.' };
  }
  return {
    label: `${Math.abs(daysOut)} day${Math.abs(daysOut) === 1 ? '' : 's'} ago`,
    note: 'Post-comp. Log the result and debrief.',
  };
}

export default async function TaperPlanPage({
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

  const { data: comp } = await supabase
    .from('competitions')
    .select('id, name, comp_date')
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!comp) notFound();

  // Pull most recent Phase 2 drill cue
  const { data: phase2 } = await supabase
    .from('loss_phase_2_responses')
    .select('one_thing_to_drill, created_at')
    .eq('athlete_id', user.id)
    .not('one_thing_to_drill', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const compDate = comp.comp_date as string;
  const compName = comp.name as string;
  const compDateObj = parseISO(compDate);
  const daysOut = differenceInCalendarDays(compDateObj, new Date());
  const isSaturday = getDay(compDateObj) === 6;
  const drillCue = (phase2?.one_thing_to_drill as string | null) ?? null;

  // Two-week mental filter cutoff
  const mentalFilterDate = new Date(compDateObj);
  mentalFilterDate.setDate(mentalFilterDate.getDate() - 14);
  const mentalFilterActive = daysOut <= 14 && daysOut > 0;

  // In comp week (7 days or fewer out)?
  const inCompWeek = daysOut <= 7 && daysOut >= 0;

  const phase = getPhaseLabel(daysOut);

  const C = {
    bg:      '#1A1713',
    surface: '#252118',
    border:  'rgba(245,240,232,0.5)',
    text:    '#F5F0E8',
    dim:     'rgba(245,240,232,0.38)',
    dimmer:  'rgba(245,240,232,0.22)',
    amber:   '#D4922E',
    amberLow:'rgba(201,130,42,0.35)',
    green:   '#3D8B55',
    brick:   '#8B3A1E',
  };

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>TAPER PLAN</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginTop: 2 }}>
              {compName.toUpperCase()}
            </div>
          </div>
        </div>
        <Link href={`/competitions/${id}`} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          ← BACK
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* Status */}
        <div style={{
          marginTop: 24,
          borderLeft: `3px solid ${daysOut === 0 ? C.amber : C.amberLow}`,
          background: C.surface,
          padding: '16px 16px 14px 12px',
        }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.18em', color: C.text, marginBottom: 6 }}>
            {phase.label.toUpperCase()}
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 6px' }}>
            {phase.note}
          </p>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>
            {format(compDateObj, 'EEEE, MMMM d').toUpperCase()}
            {!isSaturday && (
              <span style={{ color: C.dimmer, marginLeft: 8 }}>(schedule below assumes SAT — adjust if different)</span>
            )}
          </div>
        </div>

        {/* How BJJ taper works */}
        <div style={{ marginTop: 16, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 8 }}>
            HOW BJJ COMP PREP ACTUALLY WORKS
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 8px' }}>
            Volume does not drop week over week. You train at full volume through the week of competition. The taper is a single-week structure — sharp, not gradual.
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 8px' }}>
            Two weeks out: mental filter activates. One week out: follow comp week schedule. Wednesday is your last hard day. Thursday off. Friday light or off. Saturday you compete.
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0, borderTop: `1px solid ${C.border}`, paddingTop: 8, marginTop: 8 }}>
            VALIDATED BY CHRIS DENARDO (IRON ARMY ACADEMY, TOMS RIVER NJ). MMA TAPER DIFFERS — V2.
          </p>
        </div>

        {/* Mental filter */}
        {mentalFilterActive && (
          <div style={{ marginTop: 16, background: C.surface, borderLeft: `3px solid ${C.amberLow}`, padding: '14px 14px 14px 12px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.amber, marginBottom: 10 }}>
              MENTAL FILTER — ACTIVE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {MENTAL_FILTER.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.amber }}>·</span>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comp week schedule */}
        {(inCompWeek || daysOut <= 14) && (
          <div style={{ marginTop: 16, background: C.surface, padding: '14px 14px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 12 }}>
              COMP WEEK SCHEDULE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {COMP_WEEK.map((row, i) => (
                <div
                  key={row.day}
                  style={{
                    display: 'flex', gap: 12,
                    padding: '10px 0',
                    borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.1em',
                    color: row.hard ? C.amber : C.dimmer,
                    width: 32, flexShrink: 0,
                  }}>
                    {row.day.toUpperCase()}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6,
                    color: row.hard ? C.dim : C.dimmer,
                  }}>
                    {row.note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stop doing — universal */}
        <div style={{ marginTop: 16, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 10 }}>
            STOP DOING — UNIVERSAL
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {STOP_DOING_UNIVERSAL.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.brick }}>·</span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stop doing — athlete dependent */}
        <div style={{ marginTop: 8, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 10 }}>
            STOP DOING — ATHLETE DEPENDENT
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {STOP_DOING_ATHLETE.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.dimmer }}>·</span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: '10px 0 0' }}>
            YOUR COACH ADJUSTS THESE BASED ON HOW YOUR BODY RECOVERS. DEFAULTS, NOT RULES.
          </p>
        </div>

        {/* Recovery targets */}
        <div style={{ marginTop: 8, background: C.surface, borderLeft: `2px solid ${C.border}`, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.22em', color: C.dimmer, marginBottom: 10 }}>
            RECOVERY TARGETS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Sleep 8–9 hours minimum through comp week.',
              'Ice or contrast after any sparring session this week.',
              'Hydration baseline daily. Weight tab handles cut specifics.',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.green }}>·</span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Drill cue from post-loss Phase 2 */}
        {drillCue && (
          <div style={{ marginTop: 16, background: C.surface, borderLeft: `3px solid ${C.amberLow}`, padding: '14px 14px 14px 12px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.amber, marginBottom: 6 }}>
              YOUR DRILL PRIORITY
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.6, color: C.text, margin: '0 0 6px' }}>
              {drillCue}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, margin: 0 }}>
              FROM POST-LOSS DEBRIEF. SHARPEN THIS BEFORE COMP — ALREADY IN YOUR GAME.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
