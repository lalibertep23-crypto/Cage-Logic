// Competition detail — event metadata, win/loss summary, match list.

import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { parseISO, format, differenceInCalendarDays } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

const C = {
  bg:      '#1A1713',
  surface: '#252118',
  border:  'rgba(245,240,232,0.13)',
  borderMid:'rgba(245,240,232,0.14)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.55)',
  dimmer:  'rgba(245,240,232,0.35)',
  amber:   '#D4922E',
  amberLow:'rgba(201,130,42,0.35)',
  green:   '#3D8B55',
  greenLow:'rgba(42,92,63,0.35)',
  brick:   '#8B3A1E',
  brickLow:'rgba(139,58,30,0.35)',
};

type Phase = {
  key:
    | 'build'
    | 'sharpen'
    | 'taper'
    | 'peak_week'
    | 'game_day'
    | 'post_comp'
    | 'long_horizon';
  label: string;
  blurb: string;
  priorities: string[];
};

function phaseFromDaysOut(daysOut: number): Phase {
  if (daysOut > 42) {
    return {
      key: 'long_horizon',
      label: 'Long horizon',
      blurb: 'More than 6 weeks out. Plenty of room to keep building.',
      priorities: [
        'Train normal volume. No taper yet.',
        'Add technical work on weak positions.',
        'Track weight weekly. Stay in cut window if applicable.',
      ],
    };
  }
  if (daysOut > 28) {
    return {
      key: 'build',
      label: 'Build',
      blurb: '6–4 weeks out. Peak volume window. Stress-test what you trust.',
      priorities: [
        'Full volume. Hard rolls 2–3x/week.',
        'Test your A-game against varied bodies.',
        'Strength + conditioning at normal load.',
      ],
    };
  }
  if (daysOut > 14) {
    return {
      key: 'sharpen',
      label: 'Sharpen',
      blurb: '4–2 weeks out. Volume holds. Specificity goes up.',
      priorities: [
        'Comp-rules sparring. Time the rounds.',
        'Drill setups and finishes — high reps, narrow positions.',
        'Weight check-in 2x/week. Adjust now, not later.',
      ],
    };
  }
  if (daysOut > 7) {
    return {
      key: 'taper',
      label: 'Taper',
      blurb: '2–1 week out. Reduce volume 30–50%. Keep intensity high in short bursts.',
      priorities: [
        'Cut hard rolling volume. Keep one or two sharp rounds.',
        'Visualization 5 min/day. See the round you want.',
        'Sleep priority. 8+ hours non-negotiable.',
      ],
    };
  }
  if (daysOut > 1) {
    return {
      key: 'peak_week',
      label: 'Peak week',
      blurb: '<1 week out. Light. Calm. Confident.',
      priorities: [
        'Light technical work only. No new techniques.',
        'Hydration + meal discipline. Track weight daily.',
        'Mental rehearsal of the full match: walkout, first 30s, scrambles.',
      ],
    };
  }
  if (daysOut === 1) {
    return {
      key: 'peak_week',
      label: 'Day before',
      blurb: '24 hours out. Rest, fuel, and visualize.',
      priorities: [
        'Last meal big and clean. Hydrate to weight.',
        'Walk through your warm-up sequence once.',
        'Lights out early. 8+ hours.',
      ],
    };
  }
  if (daysOut === 0) {
    return {
      key: 'game_day',
      label: 'Game day',
      blurb: "It's today. Trust the work.",
      priorities: [
        'Eat what you trained on. Nothing new.',
        'Warm-up timeline matched to your first bracket.',
        'Breath protocol between matches. Shields up, captain.',
      ],
    };
  }
  // daysOut < 0 → past
  return {
    key: 'post_comp',
    label: 'Post-comp',
    blurb: 'It happened. Now log it and recover deliberately.',
    priorities: [
      'Log each match while details are fresh.',
      'Two days light activity. No hard rolls.',
      'If it was a tough one — Mental tab → Process a tough event.',
    ],
  };
}

export const dynamic = 'force-dynamic';

const RULE_LABELS: Record<string, string> = {
  gi: 'GI', no_gi: 'NO-GI', submission_only: 'SUB ONLY',
  mma: 'MMA', boxing: 'BOXING', muay_thai: 'MUAY THAI', other: 'OTHER',
};

const RESULT_LABELS: Record<string, string> = {
  win: 'WIN', loss: 'LOSS', draw: 'DRAW', dq: 'DQ', no_contest: 'NO CONTEST',
};

const METHOD_LABELS: Record<string, string> = {
  submission: 'SUBMISSION', points: 'POINTS', advantage: 'ADVANTAGE',
  decision: 'DECISION', ko_tko: 'KO / TKO', dq: 'DQ', time: 'TIME', other: 'OTHER',
};

function formatDuration(seconds: number | null): string {
  if (seconds == null) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default async function CompetitionDetailPage({
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
    .select(
      'id, name, organization, comp_date, weight_class, rule_set, outcome_summary'
    )
    .eq('id', id)
    .eq('athlete_id', user.id)
    .maybeSingle();
  if (!comp) notFound();

  const { data: matchRows } = await supabase
    .from('competition_matches')
    .select(
      'id, round_label, opponent_label, result, method, duration_seconds, notes, created_at'
    )
    .eq('competition_id', id)
    .order('created_at', { ascending: true });

  const matches = (matchRows ?? []).map((r) => ({
    id: r.id as string,
    round_label: (r.round_label as string | null) ?? null,
    opponent_label: (r.opponent_label as string | null) ?? null,
    result: (r.result as string | null) ?? null,
    method: (r.method as string | null) ?? null,
    duration_seconds: (r.duration_seconds as number | null) ?? null,
    notes: (r.notes as string | null) ?? null,
  }));

  const wins = matches.filter((m) => m.result === 'win').length;
  const losses = matches.filter((m) => m.result === 'loss').length;
  const draws = matches.filter((m) => m.result === 'draw').length;

  const name = comp.name as string;
  const organization = (comp.organization as string | null) ?? null;
  const compDate = comp.comp_date as string;
  const weightClass = (comp.weight_class as string | null) ?? null;
  const ruleSet = (comp.rule_set as string | null) ?? null;

  const daysOut  = differenceInCalendarDays(parseISO(compDate), new Date());
  const phase    = phaseFromDaysOut(daysOut);
  const dayLabel = daysOut > 0
    ? `${daysOut} DAY${daysOut === 1 ? '' : 'S'} OUT`
    : daysOut === 0 ? 'TODAY'
    : `${Math.abs(daysOut)} DAY${Math.abs(daysOut) === 1 ? '' : 'S'} AGO`;

  const prepLinks: { label: string; href: string }[] = [];
  if (phase.key !== 'long_horizon') {
    prepLinks.push({ label: 'TAPER PLAN', href: `/competitions/${id}/prep/taper` });
  }
  prepLinks.push({ label: 'WEIGHT', href: `/competitions/${id}/prep/weight` });
  if (['taper', 'peak_week', 'game_day'].includes(phase.key)) {
    prepLinks.push({ label: 'DAY-OF TIMELINE', href: `/competitions/${id}/prep/day-of` });
  }
  if (phase.key === 'post_comp') {
    prepLinks.push({ label: 'POST-COMP DEBRIEF', href: `/competitions/${id}/prep/post-comp` });
  }

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <div>
            <div style={{ fontFamily: 'var(--font-anton)', fontSize: 20, letterSpacing: '0.08em' }}>
              {name.toUpperCase()}
            </div>
            {organization && (
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.18em', color: C.dimmer, marginTop: 2 }}>
                {organization.toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <Link href="/competitions" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>
          ← COMPS
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* Meta grid */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            { label: 'DATE',        value: format(parseISO(compDate), 'MMM d, yyyy').toUpperCase() },
            { label: 'RULE SET',    value: ruleSet ? (RULE_LABELS[ruleSet] ?? ruleSet.toUpperCase()) : '—' },
            { label: 'WEIGHT CLASS', value: weightClass ? weightClass.toUpperCase() : '—' },
            { label: 'RECORD',      value: matches.length > 0 ? `${wins}W · ${losses}L · ${draws}D` : '—' },
          ].map((s) => (
            <div key={s.label} style={{ background: C.surface, padding: '12px 12px 10px' }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em', color: C.dimmer, marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, letterSpacing: '0.04em', color: C.text }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Prep phase */}
        <div style={{ marginTop: 16, background: C.surface, borderLeft: `3px solid ${C.amberLow}`, padding: '14px 14px 14px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.18em', color: C.text }}>
              PREP — {phase.label.toUpperCase()}
            </span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>
              {dayLabel}
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '0 0 10px' }}>
            {phase.blurb}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: prepLinks.length > 0 ? 12 : 0 }}>
            {phase.priorities.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: C.amber }}>·</span>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim }}>{p}</span>
              </div>
            ))}
          </div>
          {prepLinks.length > 0 && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {prepLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontFamily: 'var(--font-bebas)', fontSize: 12, letterSpacing: '0.16em', color: C.amber, textDecoration: 'none' }}
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Add match CTA */}
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.surface, borderLeft: `3px solid ${C.amberLow}`, padding: '14px 16px 14px 14px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.14em', color: C.text }}>NEW MATCH</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer, marginTop: 4 }}>LOG PER-MATCH RESULTS</div>
          </div>
          <Link href={`/competitions/${id}/matches/new`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 14px 6px',
            border: `1px solid ${C.amber}`,
            color: C.amber,
            fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.14em',
            textDecoration: 'none',
          }}>
            ADD →
          </Link>
        </div>

        {/* Match list */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>MATCHES</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            {matches.length > 0 && (
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>{matches.length} LOGGED</span>
            )}
          </div>

          {matches.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', color: C.dimmer }}>
              No matches logged for this event yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {matches.map((m, idx) => {
                const resultColor = m.result === 'win' ? C.green : m.result === 'loss' ? C.brick : C.amber;
                return (
                  <div
                    key={m.id}
                    style={{
                      borderTop: idx === 0 ? `1px solid ${C.border}` : 'none',
                      borderBottom: `1px solid ${C.border}`,
                      borderLeft: `3px solid ${resultColor}`,
                      padding: '12px 0 12px 12px',
                      display: 'flex', flexDirection: 'column', gap: 4,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.1em', color: C.text }}>
                        {(m.round_label ?? `MATCH ${idx + 1}`).toUpperCase()}
                      </span>
                      <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.1em', color: resultColor }}>
                        {m.result ? (RESULT_LABELS[m.result] ?? m.result.toUpperCase()) : '—'}
                      </span>
                    </div>
                    {m.opponent_label && (
                      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.08em', color: C.dim }}>
                        VS {m.opponent_label.toUpperCase()}
                      </span>
                    )}
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.08em', color: C.dimmer }}>
                      {m.method ? (METHOD_LABELS[m.method] ?? m.method.toUpperCase()) : '—'}
                      {m.duration_seconds != null ? ` · ${formatDuration(m.duration_seconds)}` : ''}
                    </div>
                    {m.notes && (
                      <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>
                        {m.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
