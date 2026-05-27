// Athlete profile — fighter card layout.
// Cage/concrete fixed background. Shadowed silhouette avatar (no photo yet).
// No discipline badge images — text + rank only until art is ready.
// Voice: direct, dry, factual.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { differenceInCalendarYears, parseISO, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import { BrandNav } from '@/components/ui/brand-nav';
import { C, fonts } from '@/lib/design-tokens';

export const dynamic = 'force-dynamic';

const AMBER  = C.amber;
const SILVER = '#8A9BAE';

const DISCIPLINE_LABELS: Record<string, string> = {
  bjj: 'BJJ', mma: 'MMA', boxing: 'BOXING', muay_thai: 'MUAY THAI',
  wrestling: 'WRESTLING', judo: 'JUDO', kickboxing: 'KICKBOXING',
};

function getDisciplineRank(discipline: string, rankColor: string, stripes: number): string {
  if (discipline === 'bjj') {
    const labels: Record<string, string> = {
      white: 'WHITE BELT', blue: 'BLUE BELT', purple: 'PURPLE BELT',
      brown: 'BROWN BELT', black: 'BLACK BELT',
    };
    const base = labels[rankColor] ?? rankColor.toUpperCase();
    return stripes > 0 ? `${base} · STRIPE ${stripes}` : base;
  }
  if (discipline === 'muay_thai') {
    return rankColor.replace(/_/g, ' ').toUpperCase();
  }
  if (discipline === 'wrestling') {
    const labels: Record<string, string> = {
      level_1: 'FOUNDATION', level_2: 'CHAIN WRESTLING', level_3: 'PRESSURE',
      level_4: 'SCRAMBLE',   level_5: 'COMPETITOR',       level_6: 'ELITE',
    };
    return labels[rankColor] ?? rankColor.toUpperCase();
  }
  if (discipline === 'boxing') {
    const labels: Record<string, string> = {
      foundation:        'RAW CANVAS',
      philly_red:        'PHILADELPHIA RED',
      commonwealth_blue: 'COMMONWEALTH BLUE',
      mexican_gold:      'MEXICAN GOLD',
      la_habana_gold:    'LA HABANA GOLD',
      sweet_science:     'SWEET SCIENCE',
    };
    return labels[rankColor] ?? rankColor.toUpperCase();
  }
  return rankColor.toUpperCase();
}

function cmToFeetInches(cm: number | null): string {
  if (cm == null) return '—';
  const totalInches = cm / 2.54;
  const feet  = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return `${feet}'${inches}"`;
}

function kgToLb(kg: number | null): string {
  if (kg == null) return '—';
  return `${Math.round(kg * 2.20462)} LB`;
}

// ── Silhouette avatar — SVG fighter shadow, no photo ────────────────────────
function SilhouetteAvatar({ size = 100 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 50% 35%, rgba(40,36,30,0.90) 0%, rgba(12,10,8,0.98) 70%)',
      border: `2px solid rgba(200,148,58,0.25)`,
      boxShadow: '0 0 24px rgba(0,0,0,0.80), 0 0 0 1px rgba(200,148,58,0.08)',
      overflow: 'hidden',
      flexShrink: 0,
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
    }}>
      {/* Silhouette SVG — bust of a fighter */}
      <svg
        width={size * 0.72}
        height={size * 0.72}
        viewBox="0 0 72 72"
        fill="none"
        style={{ marginBottom: -4 }}
      >
        {/* Head */}
        <ellipse cx="36" cy="20" rx="11" ry="13" fill="rgba(80,70,55,0.85)" />
        {/* Neck */}
        <rect x="31" y="31" width="10" height="6" rx="2" fill="rgba(80,70,55,0.85)" />
        {/* Shoulders + torso */}
        <path
          d="M8 72 C8 52 18 44 36 44 C54 44 64 52 64 72 Z"
          fill="rgba(80,70,55,0.85)"
        />
        {/* Subtle inner glow — edge highlight */}
        <ellipse cx="36" cy="20" rx="11" ry="13"
          fill="none" stroke="rgba(200,148,58,0.12)" strokeWidth="1" />
      </svg>
      {/* Radial shadow vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        borderRadius: '50%',
      }} />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

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

  const gymId     = (athlete.gym_id as string | null) ?? null;
  const startDate = (athlete.start_date as string | null) ?? null;

  const [disciplineRes, goalsRes, gymRes, sessionsRes, compsRes, brsRes] = await Promise.all([
    supabase.from('athlete_disciplines').select('discipline, rank_color, stripes, start_date, is_primary').eq('athlete_id', user.id).order('is_primary', { ascending: false }),
    supabase.from('athlete_goals').select('why_training, comp_status, belt_goal').eq('athlete_id', user.id).maybeSingle(),
    gymId ? supabase.from('gyms').select('name').eq('id', gymId).maybeSingle() : Promise.resolve({ data: null as { name: unknown } | null }),
    supabase.from('training_sessions').select('id', { count: 'exact', head: true }).eq('athlete_id', user.id),
    supabase.from('competitions').select('id', { count: 'exact', head: true }).eq('athlete_id', user.id),
    supabase.from('psych_assessments').select('score').eq('athlete_id', user.id).eq('instrument', 'BRS').order('taken_at', { ascending: false }).limit(1).maybeSingle(),
  ]);

  const disciplines = (disciplineRes.data ?? []).map((r) => ({
    discipline: r.discipline as string,
    rank_color: (r.rank_color as string | null) ?? '',
    stripes:    (r.stripes as number | null) ?? 0,
    start_date: (r.start_date as string | null) ?? null,
    is_primary: (r.is_primary as boolean | null) ?? false,
  }));

  const primary  = disciplines.find((d) => d.is_primary) ?? disciplines[0] ?? null;
  const others   = disciplines.filter((d) => d !== primary);
  const goals    = goalsRes.data;
  const gymName  = (gymRes.data?.name as string | undefined) ?? null;

  const totalSessions = sessionsRes.count ?? 0;
  const totalComps    = compsRes.count ?? 0;
  const brsScore      = brsRes.data?.score != null ? Number(brsRes.data.score) : null;

  const dob         = (athlete.date_of_birth as string | null) ?? null;
  const age         = dob ? differenceInCalendarYears(new Date(), parseISO(dob)) : null;
  const heightCm    = (athlete.height_cm as number | null) ?? null;
  const currentKg   = (athlete.current_weight_kg as number | null) ?? null;
  const dominant    = (athlete.dominant_side as string | null) ?? null;
  const displayName = (athlete.display_name as string | null) ?? 'ATHLETE';
  const memberSince = (athlete.created_at as string | null) ?? null;

  const compLabel: Record<string, string> = {
    never: 'NOT COMPETING', occasional: 'OCCASIONAL', regular: 'REGULAR', pro: 'PRO',
  };

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 96, position: 'relative' }}>

      {/* ── Fixed cage + concrete background ──────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img
          src="/cage-corner.jpg"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Heavy overlay — keep it cinematic, not literal */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,3,2,0.86)' }} />
        {/* Subtle warm vignette from center */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(200,120,40,0.04) 0%, transparent 70%)',
        }} />
      </div>

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* BrandNav */}
        <BrandNav backHref="/home" glass={false} />

        {/* ── Fighter identity card ── */}
        <div style={{
          padding: '24px 20px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          borderBottom: '1px solid rgba(200,148,58,0.10)',
        }}>
          {/* Avatar */}
          <SilhouetteAvatar size={104} />

          {/* Name + gym + rank */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: fonts.header, fontSize: 30, letterSpacing: '0.10em',
              color: '#fff', lineHeight: 1,
              textShadow: '0 2px 20px rgba(0,0,0,0.90)',
            }}>{displayName.toUpperCase()}</div>

            {primary && (
              <div style={{
                fontFamily: fonts.label, fontSize: 10, letterSpacing: '0.20em',
                color: AMBER, marginTop: 8,
              }}>
                {DISCIPLINE_LABELS[primary.discipline] ?? primary.discipline.toUpperCase()}
                {' · '}
                {getDisciplineRank(primary.discipline, primary.rank_color, primary.stripes)}
              </div>
            )}

            {gymName && (
              <Link href="/log" style={{
                fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.18em',
                color: 'rgba(242,239,232,0.40)', marginTop: 5,
                textDecoration: 'none', display: 'block',
              }}>{gymName.toUpperCase()}</Link>
            )}
          </div>

          {/* Accent line */}
          <div style={{
            width: 48, height: 1,
            background: 'linear-gradient(to right, transparent, rgba(200,148,58,0.50), transparent)',
          }} />
        </div>

        {/* ── Physical stats ── */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(242,239,232,0.06)',
        }}>
          {[
            { label: 'HEIGHT', value: cmToFeetInches(heightCm) },
            { label: 'WEIGHT', value: currentKg ? kgToLb(currentKg) : '—' },
            { label: 'AGE',    value: age != null ? String(age) : '—' },
            { label: 'STANCE', value: dominant ? ({ left: 'SOUTH', right: 'ORTHO', ambi: 'AMBI' } as Record<string, string>)[dominant] ?? dominant.toUpperCase().slice(0, 5) : '—' },
          ].map((s, i) => (
            <div key={s.label} style={{
              flex: 1, padding: '16px 0 14px', textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(242,239,232,0.06)' : 'none',
            }}>
              <div style={{
                fontFamily: fonts.header, fontSize: 20, letterSpacing: '0.04em',
                color: C.text, lineHeight: 1,
              }}>{s.value}</div>
              <div style={{
                fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.18em',
                color: 'rgba(242,239,232,0.30)', marginTop: 5,
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Training numbers ── */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(242,239,232,0.06)',
        }}>
          {[
            { label: 'SESSIONS',  value: String(totalSessions) },
            { label: 'EVENTS',    value: String(totalComps) },
            { label: 'BRS',       value: brsScore != null ? brsScore.toFixed(2) : '—' },
          ].map((s, i) => (
            <div key={s.label} style={{
              flex: 1, padding: '18px 0 16px', textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(242,239,232,0.06)' : 'none',
            }}>
              <div style={{
                fontFamily: fonts.header, fontSize: 26, letterSpacing: '0.04em',
                color: AMBER, lineHeight: 1,
              }}>{s.value}</div>
              <div style={{
                fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.18em',
                color: 'rgba(242,239,232,0.30)', marginTop: 5,
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Disciplines — text only, no badges ── */}
        {disciplines.length > 0 && (
          <div style={{ padding: '20px 20px 0' }}>
            <div style={{
              fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
              color: 'rgba(138,155,174,0.50)', marginBottom: 10,
            }}>DISCIPLINES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[primary, ...others].filter(Boolean).map((d) => {
                if (!d) return null;
                return (
                  <div key={d.discipline} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: 'rgba(17,17,17,0.60)',
                    borderLeft: `3px solid ${d.is_primary ? AMBER : 'rgba(138,155,174,0.25)'}`,
                    borderBottom: '1px solid rgba(242,239,232,0.05)',
                  }}>
                    <div>
                      <div style={{
                        fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.20em',
                        color: 'rgba(242,239,232,0.35)', lineHeight: 1,
                      }}>{DISCIPLINE_LABELS[d.discipline] ?? d.discipline.toUpperCase()}</div>
                      <div style={{
                        fontFamily: fonts.header, fontSize: 16, letterSpacing: '0.08em',
                        color: d.is_primary ? AMBER : C.text, marginTop: 3, lineHeight: 1,
                      }}>{getDisciplineRank(d.discipline, d.rank_color, d.stripes)}</div>
                    </div>
                    {d.is_primary && (
                      <div style={{
                        fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.14em',
                        color: 'rgba(200,148,58,0.50)',
                        padding: '3px 7px',
                        border: '1px solid rgba(200,148,58,0.18)',
                      }}>PRIMARY</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Goals ── */}
        {goals && (goals.comp_status || goals.belt_goal || goals.why_training) && (
          <div style={{ padding: '20px 20px 0' }}>
            <div style={{
              fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
              color: 'rgba(138,155,174,0.50)', marginBottom: 10,
            }}>GOALS</div>
            <div style={{
              background: 'rgba(17,17,17,0.60)',
              borderLeft: '3px solid rgba(200,148,58,0.28)',
              padding: '14px',
              display: 'flex', flexDirection: 'column', gap: 7,
            }}>
              {goals.comp_status && (
                <div style={{
                  fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.14em', color: C.text,
                }}>
                  {compLabel[(goals.comp_status as string)] ?? (goals.comp_status as string).toUpperCase()}
                </div>
              )}
              {goals.belt_goal && (
                <div style={{
                  fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.06em',
                  color: 'rgba(242,239,232,0.50)',
                }}>GOAL: {(goals.belt_goal as string).toUpperCase()}</div>
              )}
              {goals.why_training && (
                <p style={{
                  fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.03em',
                  lineHeight: 1.7, color: 'rgba(242,239,232,0.58)', margin: 0,
                  whiteSpace: 'pre-wrap',
                }}>{goals.why_training as string}</p>
              )}
            </div>
          </div>
        )}

        {/* ── Training since ── */}
        {startDate && (
          <div style={{ padding: '18px 20px 0' }}>
            <div style={{
              fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.20em',
              color: 'rgba(242,239,232,0.25)',
            }}>TRAINING SINCE</div>
            <div style={{
              fontFamily: fonts.body, fontSize: 12, letterSpacing: '0.06em',
              color: 'rgba(242,239,232,0.45)', marginTop: 4,
            }}>{format(parseISO(startDate), 'MMM yyyy').toUpperCase()}</div>
          </div>
        )}

        {/* ── Footer links ── */}
        <div style={{
          padding: '24px 20px 0',
          marginTop: 20,
          borderTop: '1px solid rgba(242,239,232,0.06)',
          display: 'flex', gap: 20, flexWrap: 'wrap',
        }}>
          {[
            { label: 'PROGRESSION', href: '/progression' },
            { label: 'COMPETITIONS', href: '/competitions' },
            { label: 'SETTINGS', href: '/settings' },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.16em',
              color: AMBER, textDecoration: 'none',
            }}>
              {l.label} →
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
