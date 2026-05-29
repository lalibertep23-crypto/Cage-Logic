// Athlete profile — baseball card layout.
// Hero image full-bleed with name overlaid at bottom (mirrors demo prototype).
// Stats row, physical grid, disciplines, goals, footer links.
// Voice: direct, dry, factual. No emojis.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { differenceInCalendarYears, parseISO, format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import { BrandNav } from '@/components/ui/brand-nav';
import { C, fonts } from '@/lib/design-tokens';
import { signOutAction } from '../settings/actions';

export const dynamic = 'force-dynamic';

const DISCIPLINE_LABELS: Record<string, string> = {
  bjj: 'BJJ', mma: 'MMA', boxing: 'BOXING', muay_thai: 'MUAY THAI',
  wrestling: 'WRESTLING', judo: 'JUDO', kickboxing: 'KICKBOXING',
};

// rank_color in DB is stored as combined "belt_stripe" e.g. "blue_2", "white_0"
// Parse it so we display "BLUE BELT · 2S" not "BLUE_2"
function parseBjjRankColor(rankColor: string): { belt: string; parsedStripes: number } {
  const match = rankColor.match(/^([a-z]+)_(\d+)$/);
  if (match) return { belt: match[1], parsedStripes: parseInt(match[2]) };
  return { belt: rankColor, parsedStripes: 0 };
}

function getDisciplineRank(discipline: string, rankColor: string, stripes: number): string {
  if (discipline === 'bjj') {
    const labels: Record<string, string> = {
      white: 'WHITE BELT', blue: 'BLUE BELT', purple: 'PURPLE BELT',
      brown: 'BROWN BELT', black: 'BLACK BELT',
    };
    const { belt, parsedStripes } = parseBjjRankColor(rankColor);
    const base = labels[belt] ?? belt.toUpperCase();
    const actualStripes = stripes > 0 ? stripes : parsedStripes;
    return actualStripes > 0 ? `${base} · ${actualStripes}S` : base;
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
  return `${Math.round(kg * 2.20462)}`;
}

// ── Silhouette SVG — bust, used inside hero when no photo ──────────────────
function SilhouetteFigure() {
  return (
    <svg
      viewBox="0 0 120 180"
      fill="none"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Head */}
      <ellipse cx="60" cy="48" rx="22" ry="26" fill="rgba(90,78,60,0.70)" />
      {/* Neck */}
      <rect x="51" y="71" width="18" height="12" rx="4" fill="rgba(90,78,60,0.70)" />
      {/* Shoulders + torso */}
      <path
        d="M4 180 C4 138 26 118 60 118 C94 118 116 138 116 180 Z"
        fill="rgba(90,78,60,0.70)"
      />
      {/* Edge highlight on head */}
      <ellipse cx="60" cy="48" rx="22" ry="26"
        fill="none" stroke="rgba(200,148,58,0.15)" strokeWidth="1.5" />
    </svg>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: athlete } = await supabase
    .from('athletes')
    .select('display_name, gym_id, sex, date_of_birth, height_cm, current_weight_kg, walking_weight_kg, dominant_side, day_job_category, start_date, created_at')
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
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text, paddingBottom: 96 }}>

      {/* ── BrandNav — transparent, floats over hero ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <BrandNav backHref="/home" glass={false} />
      </div>

      {/* ── HERO — baseball card ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3 / 4',
        maxHeight: 480,
        overflow: 'hidden',
        background: '#0A0806',
        marginTop: -56, // pull up under the transparent nav
      }}>
        {/* Background: cage scene */}
        <img
          src="/profile-scene.png"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            filter: 'grayscale(20%) contrast(1.08) brightness(0.75)',
          }}
        />

        {/* Silhouette figure — centered */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '18%',
        }}>
          <div style={{ width: '52%', opacity: 0.55 }}>
            <SilhouetteFigure />
          </div>
        </div>

        {/* Gradient overlay — transparent top → void bottom */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(5,5,5,0) 30%, rgba(5,5,5,0.50) 62%, #050505 100%)',
        }} />

        {/* Warm vignette center-top */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(200,120,40,0.06) 0%, transparent 65%)',
        }} />

        {/* Name block — bottom-left, overlaid on hero */}
        <div style={{
          position: 'absolute',
          left: 16,
          bottom: 18,
          right: 16,
        }}>
          {/* Name */}
          <div style={{
            fontFamily: fonts.header,
            fontSize: 44,
            lineHeight: 0.90,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            textShadow: '0 2px 32px rgba(0,0,0,0.90)',
          }}>
            {displayName.toUpperCase()}
          </div>

          {/* Primary discipline + rank */}
          {primary && (
            <div style={{
              fontFamily: fonts.label,
              fontSize: 11,
              letterSpacing: '0.18em',
              color: C.amber,
              marginTop: 8,
            }}>
              {DISCIPLINE_LABELS[primary.discipline] ?? primary.discipline.toUpperCase()}
              {' · '}
              {getDisciplineRank(primary.discipline, primary.rank_color, primary.stripes)}
            </div>
          )}
        </div>
      </div>

      {/* ── TRAINING NUMBERS ── */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(242,239,232,0.07)',
        borderTop: '1px solid rgba(242,239,232,0.07)',
      }}>
        {[
          { label: 'SESSIONS',  value: String(totalSessions) },
          { label: 'EVENTS',    value: String(totalComps) },
          { label: 'BRS',       value: brsScore != null ? brsScore.toFixed(2) : '—' },
        ].map((s, i) => (
          <div key={s.label} style={{
            flex: 1,
            padding: '18px 0 16px',
            textAlign: 'center',
            borderRight: i < 2 ? '1px solid rgba(242,239,232,0.07)' : 'none',
          }}>
            <div style={{
              fontFamily: fonts.header,
              fontSize: 30,
              letterSpacing: '0.04em',
              color: C.amber,
              lineHeight: 1,
            }}>{s.value}</div>
            <div style={{
              fontFamily: fonts.label,
              fontSize: 7,
              letterSpacing: '0.20em',
              color: 'rgba(242,239,232,0.30)',
              marginTop: 5,
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── PHYSICAL STATS ── */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(242,239,232,0.07)',
      }}>
        {[
          { label: 'HEIGHT', value: cmToFeetInches(heightCm) },
          { label: 'WEIGHT', value: currentKg ? `${kgToLb(currentKg)} LB` : '—' },
          { label: 'AGE',    value: age != null ? String(age) : '—' },
          { label: 'STANCE', value: dominant ? ({ left: 'SOUTH', right: 'ORTHO', ambi: 'AMBI' } as Record<string, string>)[dominant] ?? dominant.toUpperCase().slice(0, 5) : '—' },
        ].map((s, i) => (
          <div key={s.label} style={{
            flex: 1,
            padding: '14px 0 12px',
            textAlign: 'center',
            borderRight: i < 3 ? '1px solid rgba(242,239,232,0.07)' : 'none',
          }}>
            <div style={{
              fontFamily: fonts.header,
              fontSize: 18,
              letterSpacing: '0.04em',
              color: C.text,
              lineHeight: 1,
            }}>{s.value}</div>
            <div style={{
              fontFamily: fonts.label,
              fontSize: 7,
              letterSpacing: '0.18em',
              color: 'rgba(242,239,232,0.28)',
              marginTop: 4,
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── DISCIPLINES ── */}
      {disciplines.length > 0 && (
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{
            fontFamily: fonts.label,
            fontSize: 8,
            letterSpacing: '0.26em',
            color: 'rgba(138,155,174,0.50)',
            marginBottom: 10,
          }}>DISCIPLINES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[primary, ...others].filter(Boolean).map((d) => {
              if (!d) return null;
              return (
                <div key={d.discipline} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 14px',
                  background: 'rgba(17,17,17,0.70)',
                  borderLeft: `3px solid ${d.is_primary ? C.amber : 'rgba(138,155,174,0.20)'}`,
                  borderBottom: '1px solid rgba(242,239,232,0.05)',
                }}>
                  <div>
                    <div style={{
                      fontFamily: fonts.label,
                      fontSize: 7,
                      letterSpacing: '0.22em',
                      color: 'rgba(242,239,232,0.32)',
                      lineHeight: 1,
                    }}>{DISCIPLINE_LABELS[d.discipline] ?? d.discipline.toUpperCase()}</div>
                    <div style={{
                      fontFamily: fonts.header,
                      fontSize: 17,
                      letterSpacing: '0.08em',
                      color: d.is_primary ? C.amber : C.text,
                      marginTop: 4,
                      lineHeight: 1,
                    }}>{getDisciplineRank(d.discipline, d.rank_color, d.stripes)}</div>
                  </div>
                  {d.is_primary && (
                    <div style={{
                      fontFamily: fonts.label,
                      fontSize: 7,
                      letterSpacing: '0.14em',
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

      {/* ── GOALS ── */}
      {goals && (goals.comp_status || goals.belt_goal || goals.why_training) && (
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{
            fontFamily: fonts.label,
            fontSize: 8,
            letterSpacing: '0.26em',
            color: 'rgba(138,155,174,0.50)',
            marginBottom: 10,
          }}>GOALS</div>
          <div style={{
            background: 'rgba(17,17,17,0.70)',
            borderLeft: '3px solid rgba(200,148,58,0.28)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
          }}>
            {goals.comp_status && (
              <div style={{
                fontFamily: fonts.label,
                fontSize: 12,
                letterSpacing: '0.14em',
                color: C.text,
              }}>
                {compLabel[(goals.comp_status as string)] ?? (goals.comp_status as string).toUpperCase()}
              </div>
            )}
            {goals.belt_goal && (
              <div style={{
                fontFamily: fonts.body,
                fontSize: 10,
                letterSpacing: '0.06em',
                color: 'rgba(242,239,232,0.45)',
              }}>GOAL: {(goals.belt_goal as string).toUpperCase()}</div>
            )}
            {goals.why_training && (
              <p style={{
                fontFamily: fonts.body,
                fontSize: 11,
                letterSpacing: '0.03em',
                lineHeight: 1.7,
                color: 'rgba(242,239,232,0.55)',
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}>{goals.why_training as string}</p>
            )}
          </div>
        </div>
      )}

      {/* ── TRAINING SINCE ── */}
      {startDate && (
        <div style={{ padding: '18px 16px 0' }}>
          <div style={{
            fontFamily: fonts.label,
            fontSize: 7,
            letterSpacing: '0.22em',
            color: 'rgba(242,239,232,0.22)',
          }}>TRAINING SINCE</div>
          <div style={{
            fontFamily: fonts.body,
            fontSize: 12,
            letterSpacing: '0.06em',
            color: 'rgba(242,239,232,0.40)',
            marginTop: 4,
          }}>{format(parseISO(startDate), 'MMM yyyy').toUpperCase()}</div>
        </div>
      )}

      {/* ── DIVIDER ── */}
      <div style={{
        margin: '28px 16px 0',
        height: 1,
        background: 'rgba(242,239,232,0.07)',
      }} />

      {/* ── FOOTER LINKS ── */}
      <div style={{
        padding: '20px 16px 0',
        display: 'flex',
        gap: 24,
      }}>
        {[
          { label: 'COMPETITIONS', href: '/competitions' },
          { label: 'SETTINGS',     href: '/settings' },
        ].map((l) => (
          <Link key={l.href} href={l.href} style={{
            fontFamily: fonts.label,
            fontSize: 12,
            letterSpacing: '0.16em',
            color: C.amber,
            textDecoration: 'none',
          }}>
            {l.label} →
          </Link>
        ))}
      </div>

      {/* ── SIGN OUT ── */}
      <div style={{ padding: '16px 16px 0' }}>
        <form action={signOutAction}>
          <button type="submit" style={{
            fontFamily: fonts.label,
            fontSize: 11,
            letterSpacing: '0.16em',
            color: 'rgba(242,239,232,0.28)',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}>
            SIGN OUT
          </button>
        </form>
      </div>

    </main>
  );
}
