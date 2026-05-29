// Health tab — "Your Body"
// Body map + Training Audit + Load Philosophy.
// Server-rendered data fetch, client components for interactivity.
// Voice: direct, dry, factual. Informative only — never diagnostic.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BodyMap } from './body-map';
import { TrainingAudit } from './training-audit';

export const dynamic = 'force-dynamic';

const C = {
  bg:     '#050505',
  surface:'#111111',
  border: 'rgba(242,239,232,0.13)',
  text:   '#F2EFE8',
  dim:    'rgba(242,239,232,0.55)',
  dimmer: 'rgba(242,239,232,0.35)',
  amber:  '#C8943A',
};

function subtractDays(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

export default async function HealthPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const today = new Date();
  const d30 = subtractDays(today, 30);
  const d28 = subtractDays(today, 28);
  const d7  = subtractDays(today, 7);

  // ── Data fetches ─────────────────────────────────────────────────────────
  const [sorenessResult, injuryResult, sessionResult, athleteResult] = await Promise.all([
    supabase
      .from('daily_soreness_logs')
      .select('body_regions, overall_soreness_0_10, log_date')
      .eq('athlete_id', user.id)
      .gte('log_date', d30)
      .order('log_date', { ascending: false }),
    supabase
      .from('injury_reports')
      .select('id, body_region, side, stage, occurred_on')
      .eq('athlete_id', user.id)
      .neq('stage', 'resolved'),
    supabase
      .from('training_sessions')
      .select('session_date, duration_minutes, intensity_1_10, energy_1_10')
      .eq('athlete_id', user.id)
      .gte('session_date', d28)
      .order('session_date', { ascending: false }),
    supabase
      .from('athletes')
      .select('day_job_category, day_job_hours_physical_per_day, weekly_lifting_days, lifting_intensity')
      .eq('id', user.id)
      .single(),
  ]);

  const sorenessRows = sorenessResult.data ?? [];
  const injuryRows   = injuryResult.data ?? [];
  const sessions     = sessionResult.data ?? [];
  const athlete      = athleteResult.data;

  // ── Soreness frequency by region ────────────────────────────────────────
  const sorenessFrequency: Record<string, number> = {};
  for (const row of sorenessRows) {
    for (const region of (row.body_regions as string[] ?? [])) {
      sorenessFrequency[region] = (sorenessFrequency[region] ?? 0) + 1;
    }
  }

  // ── ACWR (Foster sRPE model: intensity × duration) ───────────────────────
  const recent7 = sessions.filter((s) => (s.session_date as string) >= d7);
  const acuteLoad = recent7.reduce(
    (sum, s) => sum + ((s.intensity_1_10 as number ?? 5) * (s.duration_minutes as number ?? 60)),
    0
  );
  const totalLoad28 = sessions.reduce(
    (sum, s) => sum + ((s.intensity_1_10 as number ?? 5) * (s.duration_minutes as number ?? 60)),
    0
  );
  const weeklyAvg28 = totalLoad28 / 4;
  const acwr = weeklyAvg28 > 0 ? acuteLoad / weeklyAvg28 : 1.0;

  const loadMode: 'BUILD' | 'MAINTAIN' | 'RECOVER' =
    acwr < 0.8 ? 'BUILD' : acwr <= 1.3 ? 'MAINTAIN' : 'RECOVER';

  // ── Recent soreness average (last 7 days) ────────────────────────────────
  const recent7Soreness = sorenessRows
    .filter((r) => (r.log_date as string) >= d7)
    .map((r) => r.overall_soreness_0_10 as number)
    .filter((n): n is number => n !== null && n !== undefined);

  const avgSoreness7 = recent7Soreness.length > 0
    ? recent7Soreness.reduce((a, b) => a + b, 0) / recent7Soreness.length
    : null;

  // ── Top soreness regions ─────────────────────────────────────────────────
  const topRegions = Object.entries(sorenessFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, count]) => ({ key, count }));

  // ── Active injuries ──────────────────────────────────────────────────────
  const activeInjuries = injuryRows.map((r) => ({
    body_region: r.body_region as string,
    stage:       r.stage as string,
  }));

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
            YOUR BODY
          </span>
        </div>
        <Link href="/home" style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em',
          color: C.dimmer, textDecoration: 'none',
        }}>
          ← HOME
        </Link>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* ── Body Map section ──────────────────────────────────────── */}
        <div style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 14 }}>
            <span style={{
              fontFamily: 'var(--font-bebas)', fontSize: 13,
              letterSpacing: '0.22em', color: C.dim,
            }}>
              BODY MAP
            </span>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 8,
              letterSpacing: '0.1em', color: C.dimmer,
            }}>
              {' '}— YOUR LAST 30 DAYS
            </span>
          </div>
          <BodyMap
            sorenessFrequency={sorenessFrequency}
            activeInjuries={activeInjuries}
          />
        </div>

        {/* ── Training Audit section ────────────────────────────────── */}
        <div style={{ marginTop: 32 }}>
          <div style={{ marginBottom: 14 }}>
            <span style={{
              fontFamily: 'var(--font-bebas)', fontSize: 13,
              letterSpacing: '0.22em', color: C.dim,
            }}>
              TRAINING AUDIT
            </span>
          </div>
          <TrainingAudit
            acwr={acwr}
            loadMode={loadMode}
            avgSoreness7={avgSoreness7}
            sessionCount7={recent7.length}
            activeInjuryCount={activeInjuries.length}
            topRegions={topRegions}
            dayJobCategory={athlete?.day_job_category as string ?? null}
            dayJobPhysical={athlete?.day_job_hours_physical_per_day as number ?? null}
            weeklyLiftingDays={athlete?.weekly_lifting_days as number ?? null}
            liftingIntensity={athlete?.lifting_intensity as string ?? null}
          />
        </div>

        {/* ── Injury nav shortcut ───────────────────────────────────── */}
        {activeInjuries.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Link href="/recovery" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: C.surface,
              borderLeft: '3px solid #8B3A1E',
              padding: '14px 16px 14px 14px',
              textDecoration: 'none',
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-bebas)', fontSize: 15,
                  letterSpacing: '0.16em', color: '#8B3A1E',
                }}>
                  {activeInjuries.length} ACTIVE INJUR{activeInjuries.length === 1 ? 'Y' : 'IES'}
                </div>
                <div style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                  letterSpacing: '0.08em', color: C.dimmer, marginTop: 3,
                }}>
                  View your return-to-roll stage →
                </div>
              </div>
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
