// Recovery hub — Cage Logic design system.
// Active injuries, today's soreness, 7-day log, report-injury CTA.
// Voice: direct, dry, factual. No motivational. No emojis.

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
  text:      '#F5F0E8',
  dim:       'rgba(245,240,232,0.38)',
  dimmer:    'rgba(245,240,232,0.22)',
  amber:     '#D4922E',
  amberLow:  'rgba(201,130,42,0.35)',
  green:     '#3D8B55',
  greenLow:  'rgba(42,92,63,0.4)',
  brick:     '#8B3A1E',
  brickLow:  'rgba(139,58,30,0.4)',
};

const REGION_LABELS: Record<string, string> = {
  head:         'HEAD',
  neck:         'NECK',
  shoulder:     'SHOULDER',
  elbow:        'ELBOW',
  wrist_hand:   'WRIST / HAND',
  ribs:         'RIBS',
  upper_back:   'UPPER BACK',
  low_back:     'LOWER BACK',
  hip_groin:    'HIP / GROIN',
  knee:         'KNEE',
  ankle_foot:   'ANKLE / FOOT',
  other:        'OTHER',
};

const STAGE_LABELS: Record<string, string> = {
  acute:            'ACUTE',
  sub_acute:        'SUB-ACUTE',
  modified_training:'MODIFIED',
  return_to_drill:  'RETURN TO DRILL',
  return_to_roll:   'RETURN TO ROLL',
  resolved:         'RESOLVED',
};

function formatRegion(r: string): string {
  return REGION_LABELS[r] ?? r.toUpperCase();
}

function localDateString(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Soreness color: low = green, mid = amber, high = brick
function sorenessColor(n: number | null): string {
  if (n == null) return C.dimmer;
  if (n <= 3)   return C.green;
  if (n <= 6)   return C.amber;
  return C.brick;
}

export default async function RecoveryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const today = localDateString(new Date());
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const cutoff = localDateString(sevenDaysAgo);

  const [todayRes, recentRes, injuriesRes] = await Promise.all([
    supabase
      .from('daily_soreness_logs')
      .select('id, overall_soreness_0_10, body_regions, log_date')
      .eq('athlete_id', user.id)
      .eq('log_date', today)
      .maybeSingle(),
    supabase
      .from('daily_soreness_logs')
      .select('id, log_date, overall_soreness_0_10, body_regions')
      .eq('athlete_id', user.id)
      .gte('log_date', cutoff)
      .order('log_date', { ascending: false }),
    supabase
      .from('injury_reports')
      .select('id, body_region, side, stage, pain_at_report_0_10, occurred_on, reported_at')
      .eq('athlete_id', user.id)
      .is('resolved_on', null)
      .order('reported_at', { ascending: false }),
  ]);

  const todayLog = todayRes.data ? {
    overall: (todayRes.data.overall_soreness_0_10 as number | null) ?? null,
    regions: (todayRes.data.body_regions as string[] | null) ?? [],
  } : null;

  const recent = (recentRes.data ?? []).map((r) => ({
    id:       r.id as string,
    log_date: r.log_date as string,
    overall:  (r.overall_soreness_0_10 as number | null) ?? null,
    regions:  (r.body_regions as string[] | null) ?? [],
  }));

  const injuries = (injuriesRes.data ?? []).map((r) => ({
    id:          r.id as string,
    body_region: r.body_region as string,
    side:        (r.side as string | null) ?? null,
    stage:       (r.stage as string | null) ?? 'acute',
    pain:        (r.pain_at_report_0_10 as number | null) ?? null,
    occurred_on: r.occurred_on as string,
  }));

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.08em' }}>
            RECOVERY
          </span>
        </div>
      </div>

      <div style={{ padding: '0 22px' }}>

        {/* ── Active injuries ───────────────────────────────────────── */}
        {injuries.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.16em', color: C.brickLow }}>
                ACTIVE INJURIES
              </span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.14em', color: C.dimmer }}>
                {injuries.length} OPEN
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {injuries.map((inj, i) => (
                <Link
                  key={inj.id}
                  href={`/recovery/injury/${inj.id}`}
                  style={{
                    display: 'block', textDecoration: 'none', color: C.text,
                    borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', padding: '14px 0', gap: 12 }}>
                    <div style={{ width: 8, height: 8, background: C.brick, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 16, letterSpacing: '0.08em', color: C.text }}>
                        {formatRegion(inj.body_region)}
                        {inj.side && inj.side !== 'na' ? ` · ${inj.side.toUpperCase()}` : ''}
                      </div>
                      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.14em', color: C.dimmer, marginTop: 3 }}>
                        {format(parseISO(inj.occurred_on), 'MMM d').toUpperCase()}
                        {inj.pain != null ? ` · PAIN ${inj.pain}/10` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em', color: C.dimmer }}>
                        {STAGE_LABELS[inj.stage] ?? inj.stage}
                      </span>
                      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: C.brickLow }}>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Today's soreness ──────────────────────────────────────── */}
        <div style={{
          marginTop: 24,
          position: 'relative', overflow: 'hidden',
          borderLeft: `3px solid ${todayLog ? sorenessColor(todayLog.overall) : C.amber}`,
          minHeight: 130,
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/recovery-today.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            filter: 'saturate(1.5) contrast(1.1)',
            opacity: 0.55,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(15,13,11,0.97) 0%, rgba(15,13,11,0.97) 38%, rgba(15,13,11,0.4) 100%)',
          }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '16px 16px 16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 18, letterSpacing: '0.12em', color: C.amber, lineHeight: 1 }}>
            TODAY
          </div>

          {todayLog ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                {todayLog.overall != null && (
                  <span style={{ fontFamily: 'var(--font-anton)', fontSize: 32, letterSpacing: '0.04em', color: sorenessColor(todayLog.overall) }}>
                    {todayLog.overall}
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: C.dim, marginLeft: 3 }}>/10</span>
                  </span>
                )}
                {todayLog.regions.length > 0 && (
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.14em', color: C.dim }}>
                    {todayLog.regions.map(formatRegion).join(' · ')}
                  </span>
                )}
              </div>
              <Link href="/recovery/soreness" style={{ textDecoration: 'none', display: 'inline-block' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '7px 14px 5px',
                  border: `1px solid ${C.amberLow}`, color: C.amber,
                  fontFamily: 'var(--font-bebas)', fontSize: 13, letterSpacing: '0.14em',
                }}>
                  UPDATE →
                </div>
              </Link>
            </>
          ) : (
            <>
              <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim, margin: 0 }}>
                Anything sore today?
              </p>
              <Link href="/recovery/soreness" style={{ textDecoration: 'none', display: 'inline-block' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px 6px',
                  border: `1px solid ${C.amber}`, color: C.amber,
                  fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.14em',
                }}>
                  LOG SORENESS →
                </div>
              </Link>
            </>
          )}
        </div>
        </div>

        {/* ── Last 7 days ───────────────────────────────────────────── */}
        {recent.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.16em', color: C.dimmer }}>
                LAST 7 DAYS
              </span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recent.map((r, i) => (
                <div
                  key={r.id}
                  style={{
                    display: 'flex', alignItems: 'center',
                    borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
                    borderBottom: `1px solid ${C.border}`,
                    padding: '12px 0', gap: 12,
                  }}
                >
                  <div style={{ width: 8, height: 8, background: sorenessColor(r.overall), flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, letterSpacing: '0.08em', color: C.text, flex: 1 }}>
                    {format(parseISO(r.log_date), 'EEE, MMM d').toUpperCase()}
                  </span>
                  {r.regions.length > 0 && (
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, letterSpacing: '0.12em', color: C.dimmer }}>
                      {r.regions.map(formatRegion).join(' · ')}
                    </span>
                  )}
                  <span style={{ fontFamily: 'var(--font-anton)', fontSize: 16, color: sorenessColor(r.overall), minWidth: 28, textAlign: 'right' }}>
                    {r.overall != null ? `${r.overall}` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Report injury CTA ─────────────────────────────────────── */}
        <div style={{
          marginTop: 28,
          position: 'relative', overflow: 'hidden',
          borderLeft: `3px solid ${C.brick}`,
          minHeight: 120,
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/recovery-injury.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            filter: 'saturate(1.4) contrast(1.1)',
            opacity: 0.55,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(15,13,11,0.97) 0%, rgba(15,13,11,0.97) 38%, rgba(15,13,11,0.4) 100%)',
          }} />
          <div style={{ position: 'relative', zIndex: 1, padding: '16px 16px 16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 20, letterSpacing: '0.12em', color: C.brick, lineHeight: 1 }}>
              REPORT INJURY
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em', lineHeight: 1.6, color: C.dim, margin: 0 }}>
              Something more than sore. Log it now.
            </p>
            <Link href="/recovery/injury/new" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 16px 6px',
                border: `1px solid ${C.brick}`, color: C.brick,
                fontFamily: 'var(--font-bebas)', fontSize: 15, letterSpacing: '0.14em',
              }}>
                LOG IT →
              </div>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
