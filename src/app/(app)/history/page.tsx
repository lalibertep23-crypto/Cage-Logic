// History — Cage Logic design system.
// Fight tape. Hero zone. Stats strip. Flat rows. Cinematic palette.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { parseISO, startOfWeek, endOfWeek, format, differenceInCalendarDays } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// ── Palette (locked tokens) ────────────────────────────────────────────────
const C = {
  bg:        '#050505',
  surface:   '#111111',
  raised:    '#1E1E1E',
  border:    'rgba(242,239,232,0.10)',
  borderMid: 'rgba(242,239,232,0.18)',
  text:      '#F2EFE8',
  dim:       'rgba(242,239,232,0.55)',
  dimmer:    'rgba(242,239,232,0.28)',
  amber:     '#C8943A',
  amberHot:  '#FFB627',
  amberLow:  'rgba(200,148,58,0.30)',
  brick:     '#A43A2F',
};

const SESSION_TYPE_LABELS: Record<string, string> = {
  gi:         'GI',
  no_gi:      'NO-GI',
  drilling:   'DRILLING',
  open_mat:   'OPEN MAT',
  comp_class: 'COMP CLASS',
};

type SessionRow = {
  id: string;
  session_date: string;
  start_time: string | null;
  duration_minutes: number | null;
  session_type: string | null;
  energy_1_10: number | null;
  intensity_1_10: number | null;
};

// ── Streak helper ──────────────────────────────────────────────────────────
function computeStreak(sortedDates: string[]): number {
  if (sortedDates.length === 0) return 0;
  const dateSet = new Set(sortedDates);
  const today = format(new Date(), 'yyyy-MM-dd');
  let streak = 0;
  let check = new Date();
  check.setHours(0, 0, 0, 0);
  // If no session today, start counting from yesterday
  if (!dateSet.has(today)) check.setDate(check.getDate() - 1);
  while (true) {
    const key = format(check, 'yyyy-MM-dd');
    if (!dateSet.has(key)) break;
    streak++;
    check.setDate(check.getDate() - 1);
  }
  return streak;
}

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const cutoff = format(
    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    'yyyy-MM-dd'
  );

  const [sessionRes, totalRes, athleteRes] = await Promise.all([
    supabase
      .from('training_sessions')
      .select('id, session_date, start_time, duration_minutes, session_type, energy_1_10, intensity_1_10')
      .eq('athlete_id', user.id)
      .gte('session_date', cutoff)
      .order('session_date', { ascending: false })
      .order('start_time', { ascending: false, nullsFirst: false }),
    supabase
      .from('training_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', user.id),
    supabase
      .from('athletes')
      .select('training_frequency_per_week')
      .eq('id', user.id)
      .maybeSingle(),
  ]);

  const { data: sessionRows } = sessionRes;
  const totalSessions = totalRes.count ?? 0;
  const freqGoal = (athleteRes.data?.training_frequency_per_week as number | null) ?? 4;

  const sessions: SessionRow[] = (sessionRows ?? []).map((r) => ({
    id:               r.id as string,
    session_date:     r.session_date as string,
    start_time:       (r.start_time as string | null) ?? null,
    duration_minutes: (r.duration_minutes as number | null) ?? null,
    session_type:     (r.session_type as string | null) ?? null,
    energy_1_10:      (r.energy_1_10 as number | null) ?? null,
    intensity_1_10:   (r.intensity_1_10 as number | null) ?? null,
  }));

  const ids = sessions.map((s) => s.id);
  const techCounts:   Record<string, number> = {};
  const rollCounts:   Record<string, number> = {};
  const reflectionIds = new Set<string>();

  if (ids.length > 0) {
    const [techRes, rollRes, reflRes] = await Promise.all([
      supabase.from('session_techniques').select('session_id').in('session_id', ids),
      supabase.from('roll_logs').select('session_id').in('session_id', ids),
      supabase.from('session_reflections').select('session_id').in('session_id', ids),
    ]);
    for (const row of techRes.data ?? []) {
      const sid = row.session_id as string;
      techCounts[sid] = (techCounts[sid] ?? 0) + 1;
    }
    for (const row of rollRes.data ?? []) {
      const sid = row.session_id as string;
      rollCounts[sid] = (rollCounts[sid] ?? 0) + 1;
    }
    for (const row of reflRes.data ?? []) reflectionIds.add(row.session_id as string);
  }

  // Group by week (Monday start)
  const todayWeekKey = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  type WeekGroup = { key: string; label: string; sessions: SessionRow[] };
  const groupsMap = new Map<string, WeekGroup>();
  for (const s of sessions) {
    const d = parseISO(s.session_date);
    const ws = startOfWeek(d, { weekStartsOn: 1 });
    const key = format(ws, 'yyyy-MM-dd');
    if (!groupsMap.has(key)) {
      const we = endOfWeek(d, { weekStartsOn: 1 });
      const label =
        key === todayWeekKey
          ? 'THIS WEEK'
          : `${format(ws, 'MMM d')} – ${format(we, 'MMM d')}`.toUpperCase();
      groupsMap.set(key, { key, label, sessions: [] });
    }
    groupsMap.get(key)!.sessions.push(s);
  }
  const groups = [...groupsMap.values()].sort((a, b) => (a.key < b.key ? 1 : -1));

  // ── Stats computation ──────────────────────────────────────────────────────
  const sortedUniqueDates = [...new Set(sessions.map((s) => s.session_date))].sort();
  const streak = computeStreak(sortedUniqueDates);

  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const thisWeekCount = sessions.filter(
    (s) => parseISO(s.session_date) >= thisWeekStart
  ).length;

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text, paddingBottom: 80 }}>

      {/* ── Hero Zone ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: 220,
        backgroundImage: `url('/history-hero_bright.jpg'), url('/cage-corner.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        overflow: 'hidden',
      }}>
        {/* Gradient overlay — dark at bottom, lighter at top */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #050505 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.18) 100%)',
        }} />

        {/* Proof Bank pill — top right */}
        <div style={{ position: 'absolute', top: 16, right: 22, zIndex: 1 }}>
          <Link href="/history/proof-bank" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.14em',
            color: C.amber, textDecoration: 'none',
            border: `1px solid rgba(200,148,58,0.40)`,
            padding: '4px 10px',
            background: 'rgba(5,5,5,0.55)',
            display: 'inline-block',
          }}>
            PROOF BANK →
          </Link>
        </div>

        {/* Title block — anchored bottom-left */}
        <div style={{
          position: 'absolute', bottom: 20, left: 22, zIndex: 1,
          display: 'flex', flexDirection: 'column', gap: 5,
        }}>
          <span style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 9, letterSpacing: '0.24em',
            color: C.amber,
          }}>
            SESSION HISTORY
          </span>
          <span style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 38, letterSpacing: '0.05em',
            color: C.text, lineHeight: 1,
          }}>
            FIGHT TAPE
          </span>
        </div>
      </div>

      {/* ── Stats Strip ───────────────────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
      }}>
        {[
          { value: String(totalSessions), sub: 'TOTAL SESSIONS', hot: false },
          { value: String(thisWeekCount), sub: `OF ${freqGoal} GOAL`, hot: false },
          { value: String(streak), sub: 'DAY STREAK', hot: streak > 0 },
        ].map((stat, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '16px 8px',
            borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
          }}>
            <span style={{
              fontFamily: 'var(--font-anton)',
              fontSize: 30, letterSpacing: '0.03em',
              color: stat.hot ? C.amberHot : C.text,
              lineHeight: 1,
            }}>
              {stat.value}
            </span>
            <span style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 8, letterSpacing: '0.18em',
              color: C.dimmer, marginTop: 5,
            }}>
              {stat.sub}
            </span>
          </div>
        ))}
      </div>

      {/* ── Session List ──────────────────────────────────────────────── */}
      <div style={{ padding: '0 22px' }}>

        {sessions.length === 0 ? (
          /* Empty state */
          <div style={{ paddingTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.16em', color: C.dim }}>
              NO SESSIONS LOGGED.
            </span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.14em', color: C.dimmer }}>
              FIRST ONE STARTS THE COUNT.
            </span>
            <Link href="/log" style={{
              display: 'inline-block', marginTop: 8,
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.18em',
              color: C.amber, textDecoration: 'none',
              borderBottom: `1px solid ${C.amberLow}`, paddingBottom: 2,
            }}>
              LOG NOW →
            </Link>
          </div>
        ) : (
          <>
            {groups.map((g, gi) => (
              <section key={g.key} style={{ marginTop: gi === 0 ? 24 : 28 }}>

                {/* ── Week header ── */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: 9, letterSpacing: '0.22em',
                    color: C.amber, flexShrink: 0,
                  }}>
                    {g.label}
                  </span>
                  <div style={{ flex: 1, height: 1, background: C.amber, opacity: 0.18 }} />
                  <span style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: 9, letterSpacing: '0.16em',
                    color: C.dimmer, flexShrink: 0,
                  }}>
                    {g.sessions.length} {g.sessions.length === 1 ? 'SESSION' : 'SESSIONS'}
                  </span>
                </div>

                {/* ── Rows ── */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {g.sessions.map((s, si) => {
                    const typeLabel = s.session_type
                      ? SESSION_TYPE_LABELS[s.session_type] ?? s.session_type.toUpperCase()
                      : 'SESSION';
                    const hasRefl = reflectionIds.has(s.id);
                    const techN = techCounts[s.id] ?? 0;
                    const rollN = rollCounts[s.id] ?? 0;

                    const chips: string[] = [];
                    if (s.duration_minutes) chips.push(`${s.duration_minutes}M`);
                    if (techN > 0) chips.push(`${techN}T`);
                    if (rollN > 0) chips.push(`${rollN}R`);

                    return (
                      <Link
                        key={s.id}
                        href={`/history/${s.id}`}
                        style={{
                          display: 'block',
                          textDecoration: 'none',
                          color: C.text,
                          borderTop: si === 0 ? `1px solid ${C.border}` : 'none',
                          borderBottom: `1px solid ${C.border}`,
                          borderLeft: hasRefl ? `3px solid ${C.amber}` : '3px solid transparent',
                          paddingLeft: 14,
                        }}
                      >
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          padding: '13px 0',
                          gap: 12,
                        }}>

                          {/* Date + chips */}
                          <div style={{ flex: 1 }}>
                            <span style={{
                              fontFamily: 'var(--font-anton)',
                              fontSize: 15, letterSpacing: '0.06em',
                              color: C.text, display: 'block',
                            }}>
                              {format(parseISO(s.session_date), 'EEE, MMM d').toUpperCase()}
                            </span>
                            {chips.length > 0 && (
                              <span style={{
                                fontFamily: 'var(--font-dm-mono)',
                                fontSize: 9, letterSpacing: '0.16em',
                                color: C.dimmer, marginTop: 3, display: 'block',
                              }}>
                                {chips.join(' · ')}
                              </span>
                            )}
                          </div>

                          {/* Type label + arrow */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                            <span style={{
                              fontFamily: 'var(--font-dm-mono)',
                              fontSize: 9, letterSpacing: '0.18em',
                              color: C.amber,
                            }}>
                              {typeLabel}
                            </span>
                            <span style={{
                              fontFamily: 'var(--font-dm-mono)',
                              fontSize: 14, color: C.amberLow,
                            }}>→</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Footer — 90-day window note */}
            <div style={{
              marginTop: 32, paddingBottom: 8,
              display: 'flex', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: 9, letterSpacing: '0.18em',
                color: C.dimmer,
              }}>
                SHOWING LAST 90 DAYS · {totalSessions} TOTAL
              </span>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
