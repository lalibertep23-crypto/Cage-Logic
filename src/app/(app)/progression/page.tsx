// Progression — Multi-discipline hub. Screen 1.
// Card: belt image fills full card as background. Content floats on top.
// No NEXT line — just discipline + rank. Badge enlarged, circular crop.

import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { C, fonts } from '@/lib/design-tokens';
import { BrandNav } from '@/components/ui/brand-nav';

export const dynamic = 'force-dynamic';

type RankDisplay = { rankLine: string; rightImage: string };

type DisciplineConfig = {
  key:         string;
  label:       string;
  badge:       string;
  accentColor: string;
  getHref:     (rankColor: string, stripes: number) => string;
  getRank:     (rankColor: string, stripes: number) => RankDisplay;
};

function bjjRank(rankColor: string, stripes: number): RankDisplay {
  const LABELS: Record<string, string> = {
    white: 'WHITE BELT', blue: 'BLUE BELT', purple: 'PURPLE BELT',
    brown: 'BROWN BELT', black: 'BLACK BELT',
  };
  const BELT_IMAGES: Record<string, string> = {
    white: '/white-belt.png', blue: '/blue-belt.png',
    purple: '/purple-belt.png', brown: '/brown-belt.png',
  };
  const DEGREE_IMAGES: Record<number, string> = {
    1: '/first-degree.png', 2: '/second-degree.png',
    3: '/third-degree.png', 4: '/fourth-degree.png',
  };
  const DEGREE_LABELS: Record<number, string> = {
    1: '1ST DEGREE', 2: '2ND DEGREE', 3: '3RD DEGREE', 4: '4TH DEGREE',
  };
  const base = LABELS[rankColor] ?? rankColor.toUpperCase();
  if (rankColor === 'black') {
    const degLabel = DEGREE_LABELS[stripes];
    return {
      rankLine:   degLabel ? (base + ' • ' + degLabel) : base,
      rightImage: DEGREE_IMAGES[stripes] ?? '/first-degree.png',
    };
  }
  const stripe = stripes > 0 ? (' • STRIPE ' + stripes) : '';
  return {
    rankLine:   base + stripe,
    rightImage: BELT_IMAGES[rankColor] ?? '/white-belt.png',
  };
}

function muayThaiRank(rankColor: string): RankDisplay {
  const LEVELS: Record<string, { name: string; image: string }> = {
    prajied_1: { name: 'PRAJIED LEVEL 1', image: '/prajied-level1.png' },
    prajied_2: { name: 'PRAJIED LEVEL 2', image: '/prajied-level2.png' },
    prajied_3: { name: 'PRAJIED LEVEL 3', image: '/prajied-level3.png' },
    prajied_4: { name: 'PRAJIED LEVEL 4', image: '/prajied-level4.png' },
    prajied_5: { name: 'PRAJIED LEVEL 5', image: '/prajied-level5.png' },
  };
  const level = LEVELS[rankColor] ?? LEVELS['prajied_1'];
  return { rankLine: level.name, rightImage: level.image };
}

function levelRank(rankColor: string, images: Record<string, string>): RankDisplay {
  const LABELS: Record<string, string> = {
    level_1: 'TRAINING LEVEL 1', level_2: 'TRAINING LEVEL 2',
    level_3: 'TRAINING LEVEL 3', level_4: 'TRAINING LEVEL 4',
  };
  return {
    rankLine:   LABELS[rankColor] ?? rankColor.toUpperCase(),
    rightImage: images[rankColor] ?? '',
  };
}

function karateRank(rankColor: string): RankDisplay {
  const BELTS: Record<string, string> = {
    white:  'WHITE / MUKYU',
    orange: 'ORANGE / 8–7 KYU',
    green:  'GREEN / 5–4 KYU',
    blue:   'BLUE / 3 KYU',
    brown:  'BROWN / 1–2 KYU',
    black:  'SHODAN',
  };
  return {
    rankLine:   BELTS[rankColor] ?? 'WHITE / MUKYU',
    rightImage: '', // no right-image asset yet
  };
}

function samboRank(rankColor: string): RankDisplay {
  const TIERS: Record<string, string> = {
    level_1: 'НОВИЧОК',
    level_2: 'ТРЕТИЙ РАЗРЯД',
    level_3: 'ВТОРОЙ РАЗРЯД',
    level_4: 'ПЕРВЫЙ РАЗРЯД',
    level_5: 'КМС',
    level_6: 'МС',
  };
  return {
    rankLine:   TIERS[rankColor] ?? 'НОВИЧОК',
    rightImage: '', // no right-image asset yet — card renders dark bg fallback
  };
}

function mmaRank(rankColor: string): RankDisplay {
  const LABELS: Record<string, string> = {
    foundation: 'FOUNDATION', intermediate: 'INTERMEDIATE',
    advanced: 'ADVANCED', expert: 'EXPERT',
  };
  return {
    rankLine:   LABELS[rankColor] ?? rankColor.toUpperCase(),
    rightImage: '/mma-hero_bright.png',
  };
}

function wrestlingRank(rankColor: string): RankDisplay {
  const TIERS: Record<string, { label: string; image: string }> = {
    level_1: { label: 'FOUNDATION',      image: '/foundation-wrestling.png' },
    level_2: { label: 'CHAIN WRESTLING', image: '/chain-wrestling-wrestling.png' },
    level_3: { label: 'PRESSURE',        image: '/pressure-badge-wrestling.png' },
    level_4: { label: 'SCRAMBLE',        image: '/scramble-badge-wrestling.png' },
    level_5: { label: 'COMPETITOR',      image: '/competitor-badge-wrestling.png' },
    level_6: { label: 'ELITE',           image: '/elite-badge-wrestling.png' },
  };
  const tier = TIERS[rankColor] ?? TIERS['level_1'];
  return { rankLine: tier.label, rightImage: tier.image };
}
function boxingRank(rankColor: string): RankDisplay {
  const TIERS: Record<string, { label: string; image: string }> = {
    foundation:        { label: 'RAW CANVAS',        image: '/C1-boxing-foundation.png' },
    philly_red:        { label: 'PHILADELPHIA RED',   image: '/C2-boxing-technical.png' },
    commonwealth_blue: { label: 'COMMONWEALTH BLUE',  image: '/C3-boxing-pressure.png' },
    mexican_gold:      { label: 'MEXICAN GOLD',       image: '/C4-boxing-combination.png' },
    la_habana_gold:    { label: 'LA HABANA GOLD',     image: '/C5-boxing-contender.png' },
    sweet_science:     { label: 'SWEET SCIENCE',      image: '/C6-boxing-elite.png' },
  };
  const tier = TIERS[rankColor] ?? TIERS['foundation'];
  return { rankLine: tier.label, rightImage: tier.image };
}

const DISCIPLINES: DisciplineConfig[] = [
  {
    key: 'bjj', label: 'BRAZILIAN JIU-JITSU',
    badge: '/bjj-navigation-badge.png', accentColor: '#C8943A',
    getHref: () => '/progression/bjj',
    getRank: bjjRank,
  },
  {
    key: 'wrestling', label: 'WRESTLING',
    badge: '/wrestling-navigation-badge.png', accentColor: '#8A9BAE',
    getHref: () => '/progression/wrestling',
    getRank: (rc) => wrestlingRank(rc),
  },
  {
    key: 'muay_thai', label: 'MUAY THAI',
    badge: '/muay-thai-navigation-badge.png', accentColor: '#C23B22',
    getHref: () => '/progression/muay-thai',
    getRank: (rc) => muayThaiRank(rc),
  },
  {
    key: 'boxing', label: 'BOXING',
    badge: '/boxing-navigation-badge.png', accentColor: '#8A9BAE',
    getHref: () => '/progression/boxing',
    getRank: (rc) => boxingRank(rc),
  },
  {
    key: 'mma', label: 'MMA',
    badge: '/mma-navigation-badge.png', accentColor: '#C8943A',
    getHref: () => '/progression/mma',
    getRank: mmaRank,
  },
  // SAMBO — parked until hierarchy is finalized. V1.5.
  // KARATE — parked. V1.5.
];

// ─── Card ───────────────────────────────────────────────────────────────────

function DisciplineCard({
  config, rankLine, rightImage, hasData, isLocked,
}: {
  config:     DisciplineConfig;
  rankLine:   string;
  rightImage: string;
  hasData:    boolean;
  isLocked:   boolean;
}) {
  const accentColor   = config.accentColor;
  const borderLeftVal = '3px solid ' + (hasData ? accentColor : 'rgba(242,239,232,0.10)');

  return (
    <div style={{
      position: 'relative',
      height: 118,
      overflow: 'hidden',
      opacity: hasData ? 1 : 0.38,
    }}>

      {/* Layer 1: full-bleed background — belt / rank art */}
      {hasData && rightImage ? (
        <Image
          src={rightImage}
          alt=""
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center right',
            opacity: isLocked ? 0.28 : 0.88,
            filter: isLocked ? 'grayscale(0.8) brightness(0.5)' : 'none',
          }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,11,7,0.90)' }}/>
      )}

      {/* Layer 2: directional scrim — strong left, opens earlier so art breathes */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(6,4,2,0.97) 0%, rgba(6,4,2,0.80) 20%, rgba(6,4,2,0.28) 38%, rgba(6,4,2,0.00) 100%)',
      }}/>

      {/* Layer 3: accent border */}
      <div style={{
        position: 'absolute', inset: 0,
        border: '1px solid rgba(255,255,255,0.06)',
        borderLeft: borderLeftVal,
        pointerEvents: 'none',
      }}/>

      {/* Layer 4: content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center',
      }}>

        {/* Badge — circular crop, smaller to let art breathe right */}
        <div style={{
          width: 84, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 70, height: 70,
            borderRadius: '50%',
            background: 'rgba(4,3,1,0.65)',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
          }}>
            <Image
              src={config.badge}
              alt={config.label}
              fill
              sizes="70px"
              style={{
                objectFit: 'cover',
                opacity: hasData ? 1.0 : 0.22,
                filter: hasData ? 'none' : 'grayscale(1)',
              }}
            />
          </div>
        </div>

        {/* Text — discipline label + rank only */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
          <div style={{
            fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.24em',
            color: 'rgba(242,239,232,0.50)', marginBottom: 8,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {config.label}
          </div>
          <div style={{
            fontFamily: fonts.label, fontSize: 20, letterSpacing: '0.05em', lineHeight: 1.0,
            color: hasData ? accentColor : 'rgba(242,239,232,0.28)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {rankLine}
          </div>
        </div>

        {/* Chevron or lock */}
        <div style={{
          width: 36, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isLocked && hasData ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                 stroke="rgba(242,239,232,0.25)" strokeWidth="1.4" strokeLinecap="round">
              <rect x="3" y="8" width="10" height="7" rx="1"/>
              <path d="M5.5 8V6a2.5 2.5 0 015 0v2"/>
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M3.5 1.5l5 4.5-5 4.5"
                stroke={hasData ? accentColor : 'rgba(242,239,232,0.20)'}
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>

      {/* Coming soon tag */}
      {isLocked && hasData && (
        <div style={{
          position: 'absolute', top: 0, right: 0, padding: '3px 8px',
          background: 'rgba(242,239,232,0.05)',
          fontFamily: fonts.body, fontSize: 7, letterSpacing: '0.18em',
          color: 'rgba(242,239,232,0.28)',
        }}>
          COMING SOON
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ProgressionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: rows } = await supabase
    .from('athlete_disciplines')
    .select('discipline, rank_color, stripes')
    .eq('athlete_id', user.id);

  const disciplineMap: { [key: string]: { rank_color: string; stripes: number } } = {};
  if (rows) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      disciplineMap[row.discipline] = {
        rank_color: row.rank_color || '',
        stripes:    row.stripes    || 0,
      };
    }
  }

  const activeCount = DISCIPLINES.filter(d => {
    const data = disciplineMap[d.key];
    return data && data.rank_color;
  }).length;

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 96, position: 'relative' }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src="/bjj-background.png" alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,4,3,0.68)' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(200,120,40,0.06) 0%, rgba(0,0,0,0.35) 100%)',
        }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Nav Bar ── */}
        <BrandNav
          backHref="/home"
          rightSlot={
            <Link href="/progression/new" style={{ textDecoration: 'none' }}>
              <div style={{
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(242,239,232,0.16)',
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                     stroke="rgba(242,239,232,0.60)" strokeWidth="1.4" strokeLinecap="round">
                  <circle cx="8" cy="8" r="6"/><path d="M8 5v6M5 8h6"/>
                </svg>
              </div>
            </Link>
          }
        />

        {/* ── Hero ── */}
        <div style={{
          padding: '18px 20px 16px',
          borderBottom: '1px solid rgba(200,148,58,0.10)',
        }}>
          <div style={{
            fontFamily: fonts.header, fontSize: 34, letterSpacing: '0.10em',
            color: '#fff', lineHeight: 1.0,
            textShadow: '0 2px 24px rgba(0,0,0,0.85)',
          }}>PROGRESSION</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
            <div style={{
              flex: 1, height: 1,
              background: 'linear-gradient(to right, rgba(200,148,58,0.55) 0%, rgba(200,148,58,0.06) 60%, transparent 100%)',
            }}/>
            <div style={{
              fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.22em',
              color: 'rgba(200,148,58,0.60)',
            }}>{activeCount} OF 6 ACTIVE</div>
          </div>
        </div>

        {/* Discipline cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '14px 14px 0' }}>
          {DISCIPLINES.map((config) => {
            const data      = disciplineMap[config.key];
            const hasData   = !!(data && data.rank_color);
            const rankColor = data ? data.rank_color : '';
            const stripes   = data ? data.stripes : 0;
            const isLocked  = config.getHref(rankColor, stripes) === '#';
            // MMA is always accessible — it's a synthesis screen, not enrollment-gated
            const alwaysOn  = config.key === 'mma';
            const href      = (hasData || alwaysOn) ? config.getHref(rankColor, stripes) : '#';
            const rankInfo  = hasData
              ? config.getRank(rankColor, stripes)
              : alwaysOn
                ? { rankLine: 'COMPLETE FIGHTER', rightImage: '/mma-navigation-badge.png' }
                : { rankLine: 'NOT ENROLLED', rightImage: '' };

            return (
              <Link key={config.key} href={href} style={{ textDecoration: 'none', display: 'block' }}>
                <DisciplineCard
                  config={config}
                  rankLine={rankInfo.rankLine}
                  rightImage={rankInfo.rightImage}
                  hasData={hasData || alwaysOn}
                  isLocked={isLocked}
                />
              </Link>
            );
          })}
        </div>

        {/* Log promotion */}
        <div style={{ margin: '16px 14px 0' }}>
          <Link href="/progression/new" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px',
              background: 'rgba(200,148,58,0.05)',
              border: '1px solid rgba(200,148,58,0.14)',
              borderLeft: '3px solid rgba(200,148,58,0.40)',
            }}>
              <div>
                <div style={{
                  fontFamily: fonts.label, fontSize: 14, letterSpacing: '0.14em', color: C.text,
                }}>LOG A PROMOTION</div>
                <div style={{
                  fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.10em',
                  color: 'rgba(242,239,232,0.50)', marginTop: 3,
                }}>STRIPE, BELT, OR OTHER RANK</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="#C8943A" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </Link>
        </div>
      </div>

    </main>
  );
}
