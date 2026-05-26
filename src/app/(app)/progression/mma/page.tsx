// MMA — Complete Fighter Synthesis
// Not a standalone discipline. Pulls from all enrolled disciplines.
// 6 MMA Score components. O.S. Score name is LOCKED — never rename.
// V1: Base Score, Survival Score, Coach Score computable. Others pending.

import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { BrandNav } from '@/components/ui/brand-nav';
import { C, fonts } from '@/lib/design-tokens';

export const dynamic = 'force-dynamic';

const AMBER  = C.amber;
const SILVER = '#8A9BAE';

// ── Tier maps ──────────────────────────────────────────────────────────────

type TierInfo = { label: string; image: string; score: number };

const BJJ_TIERS: Record<string, TierInfo> = {
  white:  { label: 'WHITE BELT',  image: '/white-belt.png',  score: 20 },
  blue:   { label: 'BLUE BELT',   image: '/blue-belt.png',   score: 40 },
  purple: { label: 'PURPLE BELT', image: '/purple-belt.png', score: 60 },
  brown:  { label: 'BROWN BELT',  image: '/brown-belt.png',  score: 78 },
  black:  { label: 'BLACK BELT',  image: '/bjj-navigation-badge.png', score: 95 },
};

const MT_TIERS: Record<string, TierInfo> = {
  prajied_1: { label: 'PRAJIED 1', image: '/prajied-level1.png', score: 20 },
  prajied_2: { label: 'PRAJIED 2', image: '/prajied-level2.png', score: 38 },
  prajied_3: { label: 'PRAJIED 3', image: '/prajied-level3.png', score: 55 },
  prajied_4: { label: 'PRAJIED 4', image: '/prajied-level4.png', score: 73 },
  prajied_5: { label: 'PRAJIED 5', image: '/prajied-level5.png', score: 90 },
};

const WRESTLING_TIERS: Record<string, TierInfo> = {
  level_1: { label: 'FOUNDATION',      image: '/foundation-wrestling.png',      score: 15 },
  level_2: { label: 'CHAIN',           image: '/chain-wrestling-wrestling.png',  score: 28 },
  level_3: { label: 'PRESSURE',        image: '/pressure-badge-wrestling.png',   score: 42 },
  level_4: { label: 'SCRAMBLE',        image: '/scramble-badge-wrestling.png',   score: 57 },
  level_5: { label: 'COMPETITOR',      image: '/competitor-badge-wrestling.png', score: 72 },
  level_6: { label: 'ELITE',           image: '/elite-badge-wrestling.png',      score: 90 },
};

const BOXING_TIERS: Record<string, TierInfo> = {
  foundation:        { label: 'RAW CANVAS',   image: '/boxing-foundation.png',    score: 15 },
  philly_red:        { label: 'PHILLY',        image: '/boxing-philly.png',        score: 28 },
  commonwealth_blue: { label: 'COMMONWEALTH', image: '/boxing-commonwealth.png',  score: 42 },
  mexican_gold:      { label: 'MEXICAN',       image: '/boxing-mexican.png',       score: 57 },
  la_habana_gold:    { label: 'LA HABANA',     image: '/boxing-habana.png',        score: 72 },
  sweet_science:     { label: 'SWEET SCIENCE', image: '/boxing-sweet-science.png', score: 90 },
};

function scoreRating(n: number): string {
  if (n >= 85) return 'STRONG';
  if (n >= 70) return 'GOOD';
  if (n >= 50) return 'SOLID';
  if (n >= 30) return 'DEVELOPING';
  return 'BUILDING';
}

// ── Sub-components ─────────────────────────────────────────────────────────

function DisciplineCard({
  label, rankLabel, image, enrolled,
}: { label: string; rankLabel: string; image: string; enrolled: boolean }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
      padding: '10px 4px',
      background: enrolled ? 'rgba(138,155,174,0.06)' : 'rgba(138,155,174,0.02)',
      border: `1px solid ${enrolled ? 'rgba(138,155,174,0.14)' : 'rgba(138,155,174,0.06)'}`,
    }}>
      <div style={{
        width: 54, height: 54, position: 'relative', borderRadius: 3,
        overflow: 'hidden', flexShrink: 0,
        opacity: enrolled ? 1 : 0.22,
      }}>
        {enrolled && image
          ? <Image src={image} alt={label} fill sizes="54px" style={{ objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: 'rgba(138,155,174,0.08)' }} />
        }
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: fonts.label, fontSize: 7, letterSpacing: '0.18em',
          color: 'rgba(242,239,232,0.30)', lineHeight: 1,
        }}>{label}</div>
        <div style={{
          fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.08em', lineHeight: 1.3,
          color: enrolled ? C.text : 'rgba(242,239,232,0.20)', marginTop: 4,
          whiteSpace: 'pre-line', textAlign: 'center',
        }}>{enrolled ? rankLabel : 'NOT\nENROLLED'}</div>
      </div>
    </div>
  );
}

function ComponentRow({
  icon, label, description, value, valueMax, rating, pendingReason, detail,
}: {
  icon: ReactNode; label: string; description: string;
  value: number | null; valueMax: number;
  rating: string | null; pendingReason: string | null; detail: string | null;
}) {
  const isPending = value === null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 0',
      borderBottom: `1px solid ${C.line}`,
    }}>
      <div style={{
        width: 36, height: 36, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${isPending ? 'rgba(138,155,174,0.10)' : 'rgba(200,148,58,0.20)'}`,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: fonts.label, fontSize: 12, letterSpacing: '0.12em',
          color: isPending ? C.dim : C.text, lineHeight: 1,
        }}>{label}</div>
        <div style={{
          fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.03em',
          color: C.dimmer, marginTop: 3, lineHeight: 1.3,
        }}>{description}</div>
      </div>
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        {isPending ? (
          <>
            <div style={{
              fontFamily: fonts.label, fontSize: 10, letterSpacing: '0.14em',
              color: AMBER, lineHeight: 1,
            }}>PENDING</div>
            {pendingReason && (
              <div style={{
                fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.04em',
                color: 'rgba(200,148,58,0.50)', marginTop: 3,
              }}>{pendingReason}</div>
            )}
          </>
        ) : (
          <>
            <div style={{
              fontFamily: fonts.label, fontSize: 16, letterSpacing: '0.06em',
              color: C.text, lineHeight: 1,
            }}>
              {value}{' '}
              <span style={{ fontSize: 10, color: C.dimmer }}>/ {valueMax}</span>
            </div>
            {rating && (
              <div style={{
                fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.10em',
                color: AMBER, marginTop: 2,
              }}>{rating}</div>
            )}
            {detail && (
              <div style={{
                fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.06em',
                color: C.dimmer, marginTop: 1,
              }}>{detail}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Icons (inline SVG) ─────────────────────────────────────────────────────

const IconBase = (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
       stroke={AMBER} strokeWidth="1.4" strokeLinecap="round">
    <circle cx="10" cy="10" r="7.5"/>
    <circle cx="10" cy="10" r="3.5"/>
    <circle cx="10" cy="10" r="1" fill={AMBER}/>
    <line x1="10" y1="2" x2="10" y2="4"/>
    <line x1="10" y1="16" x2="10" y2="18"/>
    <line x1="2" y1="10" x2="4" y2="10"/>
    <line x1="16" y1="10" x2="18" y2="10"/>
  </svg>
);

const IconGasTank = (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
       stroke={SILVER} strokeWidth="1.4" strokeLinecap="round">
    <path d="M6 17c0-2.5-1.5-3.5-1.5-6.5a5.5 5.5 0 0111 0C15.5 13.5 14 14.5 14 17H6z"/>
    <line x1="7" y1="17" x2="13" y2="17"/>
    <line x1="10" y1="5.5" x2="10" y2="8.5"/>
  </svg>
);

const IconShield = (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
       stroke={AMBER} strokeWidth="1.4" strokeLinecap="round">
    <path d="M10 2.5l6.5 2.5v5C16.5 14 13.5 17 10 18c-3.5-1-6.5-4-6.5-8v-5L10 2.5z"/>
    <path d="M7 10l2 2 4-4"/>
  </svg>
);

const IconOS = (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
       stroke={AMBER} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.5 3l-5 7h6l-3.5 7"/>
  </svg>
);

const IconCoach = (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
       stroke={SILVER} strokeWidth="1.4" strokeLinecap="round">
    <circle cx="10" cy="6.5" r="3"/>
    <path d="M3.5 18.5c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6"/>
  </svg>
);

const IconCrown = (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
       stroke={SILVER} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 14.5h13l2-8.5-4.5 3.5-4-7-4 7L2 6l1.5 8.5z"/>
    <line x1="5" y1="14.5" x2="5" y2="16.5"/>
    <line x1="15" y1="14.5" x2="15" y2="16.5"/>
    <line x1="5" y1="16.5" x2="15" y2="16.5"/>
  </svg>
);

// ── Page ───────────────────────────────────────────────────────────────────

export default async function MMAPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const [discRes, brsRes, sessionRes, compRes] = await Promise.all([
    supabase
      .from('athlete_disciplines')
      .select('discipline, rank_color, stripes')
      .eq('athlete_id', user.id),
    supabase
      .from('psych_assessments')
      .select('score')
      .eq('athlete_id', user.id)
      .eq('instrument', 'BRS')
      .order('taken_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('training_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', user.id),
    supabase
      .from('competitions')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', user.id),
  ]);

  // ── Discipline lookup ────────────────────────────────────────────────────

  const discMap: Record<string, { rank_color: string; stripes: number }> = {};
  for (const row of discRes.data ?? []) {
    discMap[row.discipline] = { rank_color: row.rank_color ?? '', stripes: row.stripes ?? 0 };
  }

  const bjjData  = discMap['bjj'];
  const mtData   = discMap['muay_thai'];
  const wrData   = discMap['wrestling'];
  const boxData  = discMap['boxing'];

  const bjjTier  = bjjData  ? (BJJ_TIERS[bjjData.rank_color]          ?? BJJ_TIERS['white'])      : null;
  const mtTier   = mtData   ? (MT_TIERS[mtData.rank_color]             ?? MT_TIERS['prajied_1'])   : null;
  const wrTier   = wrData   ? (WRESTLING_TIERS[wrData.rank_color]      ?? WRESTLING_TIERS['level_1']) : null;
  const boxTier  = boxData  ? (BOXING_TIERS[boxData.rank_color]        ?? BOXING_TIERS['foundation']) : null;

  const bjjLabel = bjjTier
    ? bjjData!.stripes > 0 ? `${bjjTier.label}\nSTRIPE ${bjjData!.stripes}` : bjjTier.label
    : '';

  // ── Score computation ────────────────────────────────────────────────────

  const discScores = [bjjTier?.score ?? 0, mtTier?.score ?? 0, wrTier?.score ?? 0, boxTier?.score ?? 0];
  const baseScore  = Math.round(discScores.reduce((a, b) => a + b, 0) / 4);

  const brsScoreNum    = brsRes.data?.score != null ? Number(brsRes.data.score) : null;
  const survivalScore  = brsScoreNum != null ? Math.round((brsScoreNum / 5) * 100) : null;
  const brsDetail      = brsScoreNum != null ? `BRS: ${brsScoreNum.toFixed(2)} / 5.00` : null;

  const totalSessions = sessionRes.count ?? 0;
  const coachTarget   = 50;
  const coachScore    = Math.min(Math.round((totalSessions / coachTarget) * 100), 100);
  const coachDetail   = `${totalSessions} / ${coachTarget} SESSIONS`;

  const totalComps   = compRes.count ?? 0;
  const brandPending = totalComps < 2;
  const brandScore   = brandPending ? null : Math.min(Math.round((totalComps / 10) * 60) + 40, 100);
  const brandPendingMsg = totalComps === 0 ? 'Compete in 2 events' : `${2 - totalComps} more event${2 - totalComps === 1 ? '' : 's'}`;
  const brandDetail  = !brandPending ? `${totalComps} EVENTS LOGGED` : null;

  return (
    <main style={{ minHeight: '100vh', color: C.text, background: C.bg, paddingBottom: 96 }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
        <Image
          src="/mma-hero_bright.png"
          alt="MMA"
          fill sizes="100vw" priority
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.30) 0%, rgba(5,5,5,0.55) 50%, rgba(5,5,5,1) 100%)',
        }} />
        {/* Header overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <BrandNav backHref="/progression" glass={false} />
        </div>
        {/* Title */}
        <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
          <div style={{
            fontFamily: fonts.header, fontSize: 38, letterSpacing: '0.08em',
            color: '#fff', lineHeight: 1, textShadow: '0 2px 24px rgba(0,0,0,0.85)',
          }}>MMA</div>
          <div style={{
            fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.28em',
            color: 'rgba(200,148,58,0.75)', marginTop: 4,
          }}>COMPLETE FIGHTER SYNTHESIS</div>
        </div>
      </div>

      {/* ── Discipline Levels ─────────────────────────────────────────── */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{
          fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
          color: 'rgba(138,155,174,0.55)', marginBottom: 10,
        }}>DISCIPLINE LEVELS</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <DisciplineCard label="BJJ"       rankLabel={bjjLabel || 'WHITE BELT'}  image={bjjTier?.image  ?? '/white-belt.png'} enrolled={!!bjjTier}  />
          <DisciplineCard label="MUAY THAI" rankLabel={mtTier?.label  ?? ''}      image={mtTier?.image   ?? ''}               enrolled={!!mtTier}   />
          <DisciplineCard label="WRESTLING" rankLabel={wrTier?.label  ?? ''}      image={wrTier?.image   ?? ''}               enrolled={!!wrTier}   />
          <DisciplineCard label="BOXING"    rankLabel={boxTier?.label ?? ''}      image={boxTier?.image  ?? ''}               enrolled={!!boxTier}  />
        </div>
      </div>

      {/* ── MMA Score Components ──────────────────────────────────────── */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.24em',
            color: 'rgba(138,155,174,0.55)',
          }}>MMA SCORE COMPONENTS</div>
          <div style={{
            fontFamily: fonts.body, fontSize: 7, letterSpacing: '0.12em',
            color: 'rgba(138,155,174,0.30)',
            border: '1px solid rgba(138,155,174,0.14)',
            padding: '2px 6px',
          }}>V1 PREVIEW</div>
        </div>

        <ComponentRow
          icon={IconBase}
          label="BASE SCORE"
          description="Discipline coverage and balance"
          value={baseScore > 0 ? baseScore : null}
          valueMax={100}
          rating={baseScore > 0 ? scoreRating(baseScore) : null}
          pendingReason={baseScore === 0 ? 'Enroll in a discipline' : null}
          detail={null}
        />
        <ComponentRow
          icon={IconGasTank}
          label="GAS TANK"
          description="Aerobic engine and endurance"
          value={null} valueMax={100} rating={null}
          pendingReason="Complete VO₂ Max Test"
          detail={null}
        />
        <ComponentRow
          icon={IconShield}
          label="SURVIVAL SCORE"
          description="Defensive resilience and durability"
          value={survivalScore}
          valueMax={100}
          rating={survivalScore != null ? scoreRating(survivalScore) : null}
          pendingReason={survivalScore == null ? 'Complete BRS Assessment' : null}
          detail={brsDetail}
        />
        <ComponentRow
          icon={IconOS}
          label="O.S. SCORE"
          description="Composure when the plan breaks"
          value={null} valueMax={100} rating={null}
          pendingReason="Requires coach input"
          detail={null}
        />
        <ComponentRow
          icon={IconCoach}
          label="COACH SCORE"
          description="Consistency and coachability"
          value={coachScore > 0 ? coachScore : null}
          valueMax={100}
          rating={coachScore > 0 ? scoreRating(coachScore) : null}
          pendingReason={coachScore === 0 ? 'Log your first session' : null}
          detail={totalSessions > 0 ? coachDetail : null}
        />
        <ComponentRow
          icon={IconCrown}
          label="BRAND IDENTITY"
          description="Presence, performance, and record"
          value={brandScore}
          valueMax={100}
          rating={brandScore != null ? scoreRating(brandScore) : null}
          pendingReason={brandPending ? brandPendingMsg : null}
          detail={brandDetail}
        />
      </div>

      {/* ── Competition Hub CTA ───────────────────────────────────────── */}
      <div style={{ padding: '24px 16px 0' }}>
        <Link href="/competitions" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px',
            background: 'rgba(200,148,58,0.05)',
            border: `1px solid rgba(200,148,58,0.18)`,
            borderLeft: `3px solid ${AMBER}`,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke={AMBER} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H3V4h3M18 9h3V4h-3"/>
              <path d="M6 4h12v7a6 6 0 01-12 0V4z"/>
              <path d="M12 16v4M9 20h6"/>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: fonts.label, fontSize: 13, letterSpacing: '0.14em',
                color: AMBER, lineHeight: 1,
              }}>VIEW COMPETITION HUB</div>
              <div style={{
                fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.04em',
                color: C.dim, marginTop: 4,
              }}>Record, upcoming events, and fight history</div>
            </div>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M3.5 1.5l5 4.5-5 4.5"
                stroke={AMBER} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div style={{
        margin: '20px 16px 0',
        padding: '10px 13px',
        background: 'rgba(138,155,174,0.03)',
        border: `1px solid rgba(138,155,174,0.08)`,
      }}>
        <div style={{
          fontFamily: fonts.label, fontSize: 8, letterSpacing: '0.16em',
          color: 'rgba(138,155,174,0.35)',
        }}>IRON ARMY · TOMS RIVER, NJ — SCORE METHODOLOGY V1 PREVIEW</div>
      </div>

    </main>
  );
}
