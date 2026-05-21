// History — Cage Logic design system.
// Fight tape. Flat rows. No rounded cards. Concrete palette.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { parseISO, startOfWeek, endOfWeek, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// ── Palette ────────────────────────────────────────────────────────────────
const C = {
  bg:        '#1A1713',
  surface:   '#252118',
  border:    'rgba(245,240,232,0.13)',
  borderMid: 'rgba(245,240,232,0.14)',
  text:      '#F5F0E8',
  dim:       'rgba(245,240,232,0.38)',
  dimmer:    'rgba(245,240,232,0.22)',
  amber:     '#D4922E',
  amberLow:  'rgba(201,130,42,0.35)',
  brick:     '#8B3A1E',
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

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const cutoff = format(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    'yyyy-MM-dd'
  );
  const { data: sessionRows } = await supabase
    .from('training_sessions')
    .select('id, session_date, start_time, duration_minutes, session_type, energy_1_10, intensity_1_10')
    .eq('athlete_id', user.id)
    .gte('session_date', cutoff)
    .order('session_date', { ascending: false })
    .order('start_time', { ascending: false, nullsFirst: false });

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

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, paddingBottom: 80 }}>

      {/* ── Page header ───────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 22px 14px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: C.amber }} />
          <span style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 22,
            letterSpacing: '0.08em',
            color: C.text,
          }}>
            FIGHT TAPE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/history/proof-bank" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.14em',
            color: C.amber, textDecoration: 'none', border: `1px solid rgba(201,130,42,0.35)`,
            padding: '3px 8px',
          }}>
            PROOF BANK →
          </Link>
          <span style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 9,
            letterSpacing: '0.18em',
            color: C.dimmer,
          }}>
            30 DAYS
          </span>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
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
          groups.map((g, gi) => (
            <section key={g.key} style={{ marginTop: gi === 0 ? 24 : 32 }}>

              {/* Week header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: 9,
                  letterSpacing: '0.22em',
                  color: C.amberLow,
                }}>
                  {g.label}
                </span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
                <span style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: 9,
                  letterSpacing: '0.16em',
                  color: C.dimmer,
                }}>
                  {g.sessions.length} {g.sessions.length === 1 ? 'SESSION' : 'SESSIONS'}
                </span>
              </div>

              {/* Session rows */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {g.sessions.map((s, si) => {
                  const typeLabel = s.session_type
                    ? SESSION_TYPE_LABELS[s.session_type] ?? s.session_type.toUpperCase()
                    : 'SESSION';

                  const chips: string[] = [];
                  if (s.duration_minutes) chips.push(`${s.duration_minutes}MIN`);
                  const techN = techCounts[s.id] ?? 0;
                  const rollN = rollCounts[s.id] ?? 0;
                  if (techN > 0) chips.push(`${techN}T`);
                  if (rollN > 0) chips.push(`${rollN}R`);
                  if (reflectionIds.has(s.id)) chips.push('REFL');

                  // Energy dot color
                  const eng = s.energy_1_10;
                  const engColor =
                    eng == null ? C.dimmer
                    : eng >= 7  ? C.amber
                    : eng >= 4  ? '#6B8E5A'
                    :             C.brick;

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
                      }}
                    >
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        padding: '14px 0',
                        gap: 12,
                      }}>

                        {/* Energy dot */}
                        <div style={{
                          width: 8, height: 8, flexShrink: 0,
                          background: engColor,
                        }} />

                        {/* Date + type */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{
                            fontFamily: 'var(--font-anton)',
                            fontSize: 15,
                            letterSpacing: '0.06em',
                            color: C.text,
                          }}>
                            {format(parseISO(s.session_date), 'EEE, MMM d').toUpperCase()}
                          </span>
                          {chips.length > 0 && (
                            <span style={{
                              fontFamily: 'var(--font-dm-mono)',
                              fontSize: 9,
                              letterSpacing: '0.18em',
                              color: C.dim,
                            }}>
                              {chips.join(' · ')}
                            </span>
                          )}
                        </div>

                        {/* Session type + arrow */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            fontFamily: 'var(--font-dm-mono)',
                            fontSize: 9,
                            letterSpacing: '0.16em',
                            color: C.dim,
                          }}>
                            {typeLabel}
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-dm-mono)',
                            fontSize: 12,
                            color: C.amberLow,
                          }}>→</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
