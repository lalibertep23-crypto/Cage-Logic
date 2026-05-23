// Athlete profile — read-only. Auto-generated from existing data. No customization in V1.
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { differenceInCalendarYears, parseISO, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// ── Palette ─────────────────────────────────────────────────────────────────
const C = {
  bg:      '#1A1713',
  surface: '#252118',
  border:  'rgba(245,240,232,0.13)',
  text:    '#F5F0E8',
  dim:     'rgba(245,240,232,0.55)',
  dimmer:  'rgba(245,240,232,0.35)',
  amber:   '#D4922E',
  amberLow:'rgba(201,130,42,0.35)',
};

const DISCIPLINE_LABELS: Record<string, string> = {
  bjj: 'BJJ', mma: 'MMA', boxing: 'BOXING', muay_thai: 'MUAY THAI',
  wrestling: 'WRESTLING', judo: 'JUDO', kickboxing: 'KICKBOXING',
};

const COMP_STATUS_LABELS: Record<string, string> = {
  never: 'NOT COMPETING', occasional: 'OCCASIONAL', regular: 'REGULAR', pro: 'PRO',
};

const SIDE_LABELS: Record<string, string> = {
  left: 'LEFT', right: 'RIGHT', ambi: 'AMBI',
};

const SEX_LABELS: Record<string, string> = {
  male: 'MALE', female: 'FEMALE', other: 'OTHER', prefer_not: '—',
};

function cmToFeetInches(cm: number | null): string {
  if (cm == null) return '—';
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return `${feet}' ${inches}"`;
}

function kgToLb(kg: number | null): string {
  if (kg == null) return '—';
  return `${Math.round(kg * 2.20462)} LB`;
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, marginTop: 24 }}>
      <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.2em', color: C.dimmer }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

function StatGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
      {items.map((s) => (
        <div key={s.label} style={{ background: C.surface, padding: '12px 12px 10px' }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em', color: C.dimmer, marginBottom: 6 }}>
            {s.label}
          </div>
          <div style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.04em', color: C.text, lineHeight: 1 }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: athlete } = await supabase
    .from('athletes')
    .select('display_name, gym_id, sex, date_of_birth, height_cm, current_weight_kg, walking_weight_kg, dominant_side, day_job_category, day_job_hours_physical_per_day, start_date, created_at')
    .eq('id', user.id)
    .maybeSingle();

  if (!athlete) redirect('/');

  const gymId    = (athlete.gym_id as string | null) ?? null;
  const startDate = (athlete.start_date as string | null) ?? null;

  const [disciplineRes, goalsRes, gymRes, sessionsRes, reflectionsRes, brsRes] = await Promise.all([
    supabase.from('athlete_disciplines').select('discipline, rank, rank_color, stripes, start_date, is_primary').eq('athlete_id', user.id).order('is_primary', { ascending: false }),
    supabase.from('athlete_goals').select('why_training, comp_status, belt_goal').eq('athlete_id', user.id).maybeSingle(),
    gymId ? supabase.from('gyms').select('name').eq('id', gymId).maybeSingle() : Promise.resolve({ data: null as { name: unknown } | null }),
    supabase.from('training_sessions').select('id', { count: 'exact', head: true }).eq('athlete_id', user.id),
    supabase.from('session_reflections').select('id', { count: 'exact', head: true }).eq('athlete_id', user.id),
    supabase.from('psych_assessments').select('id', { count: 'exact', head: true }).eq('athlete_id', user.id).eq('instrument', 'BRS'),
  ]);

  const disciplines = (disciplineRes.data ?? []).map((r) => ({
    discipline: r.discipline as string,
    rank: (r.rank as string | null) ?? null,
    rank_color: (r.rank_color as string | null) ?? null,
    stripes: (r.stripes as number | null) ?? 0,
    start_date: (r.start_date as string | null) ?? null,
    is_primary: (r.is_primary as boolean | null) ?? false,
  }));

  const primary = disciplines.find((d) => d.is_primary) ?? disciplines[0] ?? null;
  const others  = disciplines.filter((d) => d !== primary);

  const goals = goalsRes.data ? {
    why_training: (goalsRes.data.why_training as string | null) ?? null,
    comp_status:  (goalsRes.data.comp_status as string | null) ?? null,
    belt_goal:    (goalsRes.data.belt_goal as string | null) ?? null,
  } : null;

  const gymName = (gymRes.data?.name as string | undefined) ?? null;

  const totalSessions    = sessionsRes.count ?? 0;
  const totalReflections = reflectionsRes.count ?? 0;
  const totalBrs         = brsRes.count ?? 0;

  const dob        = (athlete.date_of_birth as string | null) ?? null;
  const age        = dob ? differenceInCalendarYears(new Date(), parseISO(dob)) : null;
  const sex        = (athlete.sex as string | null) ?? null;
  const heightCm   = (athlete.height_cm as number | null) ?? null;
  const currentKg  = (athlete.current_weight_kg as number | null) ?? null;
  const walkingKg  = (athlete.walking_weight_kg as number | null) ?? null;
  const dominant   = (athlete.dominant_side as string | null) ?? null;
  const dayJob     = (athlete.day_job_category as string | null) ?? null;
  const dayJobHours = (athlete.day_job_hours_physical_per_day as number | null) ?? null;
  const memberSince = (athlete.created_at as string | null) ?? null;

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>PROFILE</span>
        </div>
        <Link href="/home" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer, textDecoration: 'none' }}>← HOME</Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* ── Identity ──────────────────────────────────────────────────── */}
        <SectionHeader label="IDENTITY" />
        <div style={{ background: C.surface, borderLeft: `3px solid ${C.amber}`, padding: '16px 16px 14px 14px' }}>
          <div style={{ fontFamily: 'var(--font-anton)', fontSize: 26, letterSpacing: '0.06em', color: C.text }}>
            {(athlete.display_name as string | null) ?? 'ATHLETE'}
          </div>
          {gymName && (
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em', color: C.dim, marginTop: 6 }}>
              {gymName.toUpperCase()}
            </div>
          )}
          {memberSince && (
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em', color: C.dimmer, marginTop: 4 }}>
              MEMBER SINCE {format(parseISO(memberSince), 'MMM d, yyyy').toUpperCase()}
            </div>
          )}
        </div>

        {/* ── Discipline / rank ─────────────────────────────────────────── */}
        {primary && (
          <>
            <SectionHeader label="DISCIPLINE" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ background: C.surface, padding: '14px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.14em', color: C.text }}>
                    {DISCIPLINE_LABELS[primary.discipline] ?? primary.discipline.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em', color: C.amber }}>
                    {primary.rank_color ? primary.rank_color.toUpperCase() : primary.rank?.toUpperCase() ?? '—'}
                    {primary.stripes ? ` · ${primary.stripes}S` : ''}
                  </span>
                </div>
                {primary.start_date && (
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em', color: C.dimmer }}>
                    STARTED {format(parseISO(primary.start_date), 'MMM yyyy').toUpperCase()}
                  </div>
                )}
              </div>
              {others.length > 0 && (
                <div style={{ background: C.surface, padding: '10px 14px' }}>
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>
                    ALSO: {others.map((d) => `${DISCIPLINE_LABELS[d.discipline] ?? d.discipline.toUpperCase()}${d.rank_color ? ` (${d.rank_color.toUpperCase()})` : ''}`).join(' · ')}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <SectionHeader label="ON THE MAT" />
        <StatGrid items={[
          { label: 'SESSIONS',    value: String(totalSessions) },
          { label: 'REFLECTIONS', value: String(totalReflections) },
          { label: 'BRS RUNS',    value: String(totalBrs) },
        ]} />
        {startDate && (
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.14em', color: C.dimmer, marginTop: 8 }}>
            TRAINING SINCE {format(parseISO(startDate), 'MMM yyyy').toUpperCase()}
          </p>
        )}

        {/* ── Goals ────────────────────────────────────────────────────── */}
        {goals && (goals.comp_status || goals.belt_goal || goals.why_training) && (
          <>
            <SectionHeader label="GOALS" />
            <div style={{ background: C.surface, padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {goals.comp_status && (
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.14em', color: C.text }}>
                  {COMP_STATUS_LABELS[goals.comp_status] ?? goals.comp_status.toUpperCase()}
                </div>
              )}
              {goals.belt_goal && (
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', color: C.dim }}>
                  BELT GOAL: {goals.belt_goal.toUpperCase()}
                </div>
              )}
              {goals.why_training && (
                <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em', lineHeight: 1.7, color: C.dim, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {goals.why_training}
                </p>
              )}
            </div>
          </>
        )}

        {/* ── Baseline ─────────────────────────────────────────────────── */}
        <SectionHeader label="BASELINE" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            { label: 'AGE',             value: age != null ? `${age}` : '—' },
            { label: 'SEX',             value: sex ? SEX_LABELS[sex] ?? sex : '—' },
            { label: 'HEIGHT',          value: cmToFeetInches(heightCm) },
            { label: 'WEIGHT',          value: kgToLb(currentKg) },
            { label: 'WALKING WEIGHT',  value: kgToLb(walkingKg) },
            { label: 'DOMINANT SIDE',   value: dominant ? SIDE_LABELS[dominant] ?? dominant.toUpperCase() : '—' },
          ].map((s) => (
            <div key={s.label} style={{ background: C.surface, padding: '12px 12px 10px' }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.16em', color: C.dimmer, marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, letterSpacing: '0.04em', color: C.text }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Day job ──────────────────────────────────────────────────── */}
        {(dayJob || dayJobHours != null) && (
          <>
            <SectionHeader label="OFF-MAT LOAD" />
            <div style={{ background: C.surface, padding: '14px 14px' }}>
              {dayJob && (
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', color: C.dim, marginBottom: dayJobHours != null ? 6 : 0 }}>
                  {dayJob}
                </div>
              )}
              {dayJobHours != null && (
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em', color: C.dimmer }}>
                  {dayJobHours} PHYSICAL HOURS / DAY
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Footer links ─────────────────────────────────────────────── */}
        <div style={{ marginTop: 28, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'PROGRESSION', href: '/progression' },
            { label: 'COMPETITIONS', href: '/competitions' },
            { label: 'SETTINGS', href: '/settings' },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.16em',
              color: C.amber, textDecoration: 'none',
            }}>
              {l.label} →
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
