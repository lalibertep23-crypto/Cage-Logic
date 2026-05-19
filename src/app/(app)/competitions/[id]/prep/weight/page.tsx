// Weight Management detail — daily weight tracking for a comp period.
// Shows delta, cut strategy, day-by-day guidance, rehydration protocol.
// Voice: direct, dry, factual. Always defers medical decisions to coach.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { parseISO, differenceInCalendarDays } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import { LogWeightForm, WeighInDetailsForm } from './weight-form';
import { CutCounterChart } from './cut-counter-chart';

export const dynamic = 'force-dynamic';

type CutStrategy = 'no_cut' | 'diet_cut' | 'water_cut' | 'consult_coach';

function getCutStrategy(
  delta: number | null,
  daysOut: number
): CutStrategy {
  if (delta == null) return 'no_cut';
  if (delta <= 2) return 'no_cut';
  if (delta > 7 || daysOut < 3) return 'consult_coach';
  if (daysOut <= 7) return 'water_cut';
  return 'diet_cut';
}

const CUT_STRATEGY_COPY: Record<
  CutStrategy,
  { label: string; status: string; blurb: string }
> = {
  no_cut: {
    label: 'No cut needed',
    status: 'On track',
    blurb: 'Stay consistent. No weight manipulation needed.',
  },
  diet_cut: {
    label: 'Diet cut',
    status: 'Borderline',
    blurb: 'Reduce processed carbs and sodium. Gradual, no crash.',
  },
  water_cut: {
    label: 'Water cut',
    status: 'Significant cut',
    blurb: 'Water cut window. Follow the day-by-day below.',
  },
  consult_coach: {
    label: 'Consult your coach',
    status: 'Consult required',
    blurb:
      'This cut requires experienced guidance. Do not attempt solo.',
  },
};

const DAY_BY_DAY = [
  { day: 'D-7', note: 'Reduce sodium and processed carbs.' },
  { day: 'D-6', note: 'Maintain training. Normal hydration.' },
  { day: 'D-5', note: 'Begin reducing water intake slightly.' },
  { day: 'D-4', note: 'Light training only. Lower carbs further.' },
  { day: 'D-3', note: 'Begin active water cut if needed.' },
  { day: 'D-2', note: 'Sauna / sweat protocol if doing water cut.' },
  { day: 'D-1', note: 'Final push. Minimal water after 6pm.' },
  { day: 'Weigh-in', note: 'Done. Begin rehydration immediately.' },
];

const REHYDRATION_STEPS = [
  'First 30 min: electrolyte drink, 16–24 oz.',
  '1–2 hours: light meal, carbs + protein.',
  '2–4 hours: continue hydrating. Avoid heavy fats.',
  'Pre-match: sip only. No bloating.',
];

export default async function WeightManagementPage({
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
    .select('id, name, comp_date, weight_class, target_weight_lbs, weigh_in_type')
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!comp) notFound();

  const { data: weightLogs } = await supabase
    .from('comp_weight_logs')
    .select('logged_date, weight_lbs')
    .eq('comp_id', id)
    .eq('athlete_id', user.id)
    .order('logged_date', { ascending: false });

  const logs = (weightLogs ?? []).map((r) => ({
    logged_date: r.logged_date as string,
    weight_lbs: Number(r.weight_lbs),
  }));

  const compName = comp.name as string;
  const compDate = comp.comp_date as string;
  const weightClass = (comp.weight_class as string | null) ?? null;
  const targetWeightLbs = comp.target_weight_lbs != null
    ? Number(comp.target_weight_lbs)
    : null;
  const weighInType = (comp.weigh_in_type as string | null) ?? null;

  const currentWeight = logs.length > 0 ? logs[0].weight_lbs : null;
  const delta =
    currentWeight != null && targetWeightLbs != null
      ? currentWeight - targetWeightLbs
      : null;

  const daysOut = differenceInCalendarDays(parseISO(compDate), new Date());
  const strategy = getCutStrategy(delta, daysOut);
  const strategyCopy = CUT_STRATEGY_COPY[strategy];

  const showDayByDay =
    strategy === 'diet_cut' || strategy === 'water_cut';
  const showRehydration = daysOut <= 0;

  const C = {
    bg:      '#1A1713',
    surface: '#252118',
    border:  'rgba(245,240,232,0.08)',
    text:    '#F5F0E8',
    dim:     'rgba(245,240,232,0.38)',
    dimmer:  'rgba(245,240,232,0.22)',
    amber:   '#D4922E',
    amberLow:'rgba(201,130,42,0.35)',
    green:   '#3D8B55',
    brick:   '#8B3A1E',
    brickLow:'rgba(139,58,30,0.35)',
  };

  const strategyAccent = strategy === 'no_cut' ? C.green
    : strategy === 'diet_cut' ? C.amber
    : strategy === 'water_cut' ? C.brick
    : C.brick;

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
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>WEIGHT</div>
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

        {/* Cut status */}
        <div style={{
          marginTop: 24,
          borderLeft: `3px solid ${strategyAccent}`,
          background: C.surface,
          padding: '14px 14px 14px 12px',
        }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.18em', color: C.text, marginBottom: 4 }}>
            {strategyCopy.status.toUpperCase()}
          </div>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', color: C.dim }}>
            {strategyCopy.blurb}
          </div>
          {delta != null && (
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer, marginTop: 6 }}>
              {delta > 0 ? `+${delta.toFixed(1)} LB TO TARGET` : delta < 0 ? `${delta.toFixed(1)} LB UNDER` : 'AT TARGET'}
            </div>
          )}
        </div>

        {/* Log today */}
        <div style={{ marginTop: 16, background: C.surface, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.dimmer, marginBottom: 10 }}>
            LOG TODAY
          </div>
          <LogWeightForm compId={id} />
        </div>

        {/* Cut Counter chart */}
        <div style={{ marginTop: 16, background: C.surface, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.dimmer, marginBottom: 10 }}>
            CUT COUNTER
          </div>
          <CutCounterChart logs={logs} targetWeightLbs={targetWeightLbs} />
        </div>

        {/* Competition details */}
        <div style={{ marginTop: 16, background: C.surface, padding: '14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.dimmer, marginBottom: 10 }}>
            COMPETITION DETAILS
          </div>
          {weightClass && (
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dim, marginBottom: 10 }}>
              WEIGHT CLASS: {weightClass.toUpperCase()}
            </div>
          )}
          <WeighInDetailsForm compId={id} targetWeightLbs={targetWeightLbs} weighInType={weighInType} />
        </div>

        {/* Day-by-day */}
        {showDayByDay && (
          <div style={{ marginTop: 16, background: C.surface, padding: '14px 14px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.dimmer, marginBottom: 12 }}>
              DAY-BY-DAY
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {DAY_BY_DAY.map((row, i) => (
                <div key={row.day} style={{
                  display: 'flex', gap: 12,
                  padding: '8px 0',
                  borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
                }}>
                  <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.1em', color: C.amber, width: 56, flexShrink: 0 }}>
                    {row.day.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>
                    {row.note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rehydration */}
        {showRehydration && (
          <div style={{ marginTop: 16, background: C.surface, borderLeft: `3px solid ${C.amberLow}`, padding: '14px 14px 14px 12px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.2em', color: C.amber, marginBottom: 10 }}>
              REHYDRATION PROTOCOL
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {REHYDRATION_STEPS.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.amber }}>·</span>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.1em', color: C.dimmer, textAlign: 'center', marginTop: 20 }}>
          FRAMEWORK, NOT MEDICAL ADVICE. CONSULT YOUR COACH OR SPORTS NUTRITIONIST BEFORE ANY SIGNIFICANT CUT.
        </p>

      </div>
    </main>
  );
}
