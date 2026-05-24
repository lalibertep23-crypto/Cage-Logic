// Progression — Multi-discipline hub. Screen 1.
// Card design: belt/rank image fills full card as background.
// Text + badge float on top via absolute overlay.
// BJJ -> /progression/criteria. Muay Thai -> /progression/muay-thai.

import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { C, fonts } from '@/lib/design-tokens';

export const dynamic = 'force-dynamic';

type RankDisplay = { rankLine: string; nextLine: string; rightImage: string };

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
    const nextDeg  = DEGREE_LABELS[stripes + 1];
    return {
      rankLine:   degLabel ? (base + ' • ' + degLabel) : base,
      nextLine:   stripes >= 4 ? 'AT THE SUMMIT' : (base + ' • ' + (nextDeg ?? '')),
      rightImage: DEGREE_IMAGES[stripes] ?? '/first-degree.png',
    };
  }
  const NEXT_BELT: Record<string, string> = {
    white: 'BLUE BELT', blue: 'PURPLE BELT', purple: 'BROWN BELT', brown: 'BLACK BELT',
  };
  return {
    rankLine:   stripes > 0 ? (base + ' • STRIPE ' + stripes) : base,
    nextLine:   stripes < 4 ? (base + ' • STRIPE ' + (stripes + 1)) : (NEXT_BELT[rankColor] ?? ''),
    rightImage: BELT_IMAGES[rankColor] ?? '/white-belt.png',
  };
}

function muayThaiRank(rankColor: string): RankDisplay {
  const LEVELS: Record<string, { name: string; image: string; next: string }> = {
    prajied_1: { name: 'PRAJIED LEVEL 1', image: '/prajied-level1.png', next: 'PRAJIED LEVEL 2' },
    prajied_2: { name: 'PRAJIED LEVEL 2', image: '/prajied-level2.png', next: 'PRAJIED LEVEL 3' },
    prajied_3: { name: 'PRAJIED LEVEL 3', image: '/prajied-level3.png', next: 'PRAJIED LEVEL 4' },
    prajied_4: { name: 'PRAJIED LEVEL 4', image: '/prajied-level4.png', next: 'PRAJIED LEVEL 5' },
    prajied_5: { name: 'PRAJIED LEVEL 5', image: '/prajied-level5.png', next: 'AT THE SUMMIT'   },
  };
  const level = LEVELS[rankColor] ?? LEVELS['prajied_1'];
  return { rankLine: level.name, nextLine: level.next, rightImage: level.image };
}

function levelRank(rankColor: string, images: Record<string, string>): RankDisplay {
  const LABELS: Record<string, string> = {
    level_1: 'TRAINING LEVEL 1', level_2: 'TRAINING LEVEL 2',
    level_3: 'TRAINING LEVEL 3', level_4: 'TRAINING LEVEL 4',
  };
  const NEXT: Record<string, string> = {
    level_1: 'TRAINING LEVEL 2', level_2: 'TRAINING LEVEL 3',
    level_3: 'TRAINING LEVEL 4', level_4: 'AT THE SUMMIT',
  };
  return {
    rankLine:   LABELS[rankColor] ?? rankColor.toUpperCase(),
    nextLine:   NEXT[rankColor] ?? 'AT THE SUMMIT',
    rightImage: images[rankColor] ?? '',
  };
}

function mmaRank(rankColor: string): RankDisplay {
  const LABELS: Record<string, string> = {
    foundation: 'FOUNDATION', intermediate: 'INTERMEDIATE',
    advanced: 'ADVANCED', expert: 'EXPERT',
  };
  const NEXT: Record<string, string> = {
    foundation: 'INTERMEDIATE', intermediate: 'ADVANCED',
    advanced: 'EXPERT', expert: 'AT THE SUMMIT',
  };
  return {
    rankLine:   LABELS[rankColor] ?? rankColor.toUpperCase(),
    nextLine:   NEXT[rankColor] ?? 'AT THE SUMMIT',
    rightImage: '/championship-belt.png',
  };
}

const WRESTLING_IMG: Record<string, string> = {
  level_1: '/foundation-wrestling.png',
  level_2: '/chain-wrestling-wrestling.png',
  level_3: '/pressure-badge-wrestling.png',
  level_4: '/elite-badge-wrestling.png',
};
const BOXING_IMG: Record<string, string> = {
  level_1: '/competitor-badge-wrestling.png',
  level_2: '/competitor-badge-wrestling.png',
  level_3: '/championship-belt.png',
  level_4: '/championship-belt.png',
};

const DISCIPLINES: DisciplineConfig[] = [
  {
    key: 'bjj', label: 'BRAZILIAN JIU-JITSU',
    badge: '/bjj-navigation-badge.png', accentColor: '#C8943A',
    getHref: (rc, s) => '/progression/criteria?from=' + rc + '_' + s,
    getRank: bjjRank,
  },
  {
    key: 'wrestling', label: 'WRESTLING',
    badge: '/wrestling-navigation-badge.png', accentColor: '#8A9BAE',
    getHref: () => '#',
    getRank: (rc) => levelRank(rc, WRESTLING_IMG),
  },
  {
    key: 'muay_thai', label: 'MUAY THAI',
    badge: '/muay-thai-navigation-badge.png', accentColor: '#C23B22',
    getHref: () => '/progression/muay-thai',
    getRank: (rc) => muayThaiRank(rc),
  },
  {
    key: 'boxing', label: 'BOXING',
    badge: '/boxing-navigation-badge.png', accentColor: '#7A8A96',
    getHref: () => '#',
    getRank: (rc) => levelRank(rc, BOXING_IMG),
  },
  {
    key: 'mma', label: 'MMA',
    badge: '/mma-navigation-badge.png', accentColor: '#C8943A',
    getHref: () => '#',
    getRank: mmaRank,
  },
];

// Card: belt image fills entire card as background. Content floats on top.
function DisciplineCard({
  config, rankLine, nextLine, rightImage, hasData, isLocked,
}: {
  config:     DisciplineConfig;
  rankLine:   string;
  nextLine:   string;
  rightImage: string;
  hasData:    boolean;
  isLocked:   boolean;
}) {
  const accentColor = config.accentColor;

  return (
    <div style={{
      position: 'relative',
      height: 104,
      overflow: 'hidden',
      opacity: hasData ? 1 : 0.42,
    }}>

      {/* ── Layer 1: full-bleed belt/rank image ── */}
      {hasData && rightImage ? (
        <Image
          src={rightImage}
          alt=""
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center right',
            opacity: isLocked ? 0.18 : 0.42,
            filter: isLocked ? 'grayscale(0.8) brightness(0.6)' : 'none',
          }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,11,7,0.90)' }}/>
      )}

      {/* ── Layer 2: directional scrim — heavy left, open right ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(8,6,3,0.97) 0%, rgba(8,6,3,0.88) 45%, rgba(8,6,3,0.55) 72%, rgba(8,6,3,0.10) 100%)',
      }}/>

      {/* ── Layer 3: left accent bar + border ── */}
      <div style={{
        position: 'absolute', inset: 0,
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: '3px solid ' + (hasData ? accentColor : 'rgba(242,239,232,0.10)'),
        pointerEvents: 'none',
      }}/>

      {/* ── Layer 4: content ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center',
      }}>

        {/* Badge — large, prominent */}
        <div style={{
          width: 90, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 76, height: 76, position: 'relative' }}>
            <Image
              src={config.badge}
              alt={config.label}
              fill sizes="76px"
              style={{
                objectFit: 'contain',
                opacity: hasData ? 1.0 : 0.25,
                filter: hasData ? 'none' : 'grayscale(1)',
              }}
            />
          </div>
        </div>

        {/* Text block */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
          <div style={{
            fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.22em',
            color: 'rgba(242,239,232,0.55)', marginBottom: 5,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {config.label}
          </div>
          <div style={{
            fontFamily: fonts.label, fontSize: 18, letterSpacing: '0.06em', lineHeight: 1.1,
            color: hasData ? accentColor : 'rgba(242,239,232,0.28)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {rankLine}
          </div>
          {hasData && (
            <div style={{
              fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.08em',
              color: 'rgba(242,239,232,0.42)', marginTop: 6,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              <span style={{ color: accentColor + '80' }}>{'NEXT  '}</span>
              {nextLine}
            </div>
          )}
        </div>

        {/* Chevron / lock */}
        <div style={{
          width: 32, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isLocked && hasData ? (
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
                 stroke="rgba(242,239,232,0.28)" strokeWidth="1.4" strokeLinecap="round">
              <rect x="3" y="8" width="10" height="7" rx="1"/>
              <path d="M5.5 8V6a2.5 2.5 0 015 0v2"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M3 1l4 4-4 4"
                stroke={hasData ? accentColor : 'rgba(242,239,232,0.20)'}
                strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </div>
      </div>

      {/* Coming soon tag */}
      {isLocked && hasData && (
        <div style={{
          position: 'absolute', top: 0, right: 0, padding: '3px 8px',
          background: 'rgba(242,239,232,0.06)',
          fontFamily: fonts.body, fontSize: 7, letterSpacing: '0.18em',
          color: 'rgba(242,239,232,0.32)',
        }}>
          COMING SOON
        </div>
      )}
    </div>
  );
}

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

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 96, position: 'relative' }}>

      {/* Page background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src="/bjj-background.png" alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,4,3,0.72)' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(200,120,40,0.06) 0%, rgba(0,0,0,0.40) 100%)',
        }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px 12px',
          borderBottom: '1px solid rgba(200,148,58,0.12)',
          background: 'rgba(5,4,3,0.60)',
          backdropFilter: 'blur(10px)',
        }}>
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(242,239,232,0.16)',
            }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="#F2EFE8" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
          </Link>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: fonts.header, fontSize: 24, letterSpacing: '0.08em',
              color: '#fff', textShadow: '0 2px 16px rgba(0,0,0,0.90)',
            }}>PROGRESSION</div>
            <div style={{
              fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.24em',
              color: 'rgba(200,148,58,0.65)', marginTop: 2,
            }}>YOUR JOURNEY. EARN EVERYTHING.</div>
          </div>
          <Link href="/progression/new" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(242,239,232,0.16)',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                   stroke="rgba(242,239,232,0.60)" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="8" cy="8" r="6"/><path d="M8 5v6M5 8h6"/>
              </svg>
            </div>
          </Link>
        </div>

        {/* Discipline cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '14px 14px 0' }}>
          {DISCIPLINES.map((config) => {
            const data      = disciplineMap[config.key];
            const hasData   = !!(data && data.rank_color);
            const rankColor = data ? data.rank_color : '';
            const stripes   = data ? data.stripes : 0;
            const isLocked  = config.getHref(rankColor, stripes) === '#';
            const href      = hasData ? config.getHref(rankColor, stripes) : '#';
            const rankInfo  = hasData
              ? config.getRank(rankColor, stripes)
              : { rankLine: 'NOT ENROLLED', nextLine: '', rightImage: '' };

            return (
              <Link key={config.key} href={href} style={{ textDecoration: 'none', display: 'block' }}>
                <DisciplineCard
                  config={config}
                  rankLine={rankInfo.rankLine}
                  nextLine={rankInfo.nextLine}
                  rightImage={rankInfo.rightImage}
                  hasData={hasData}
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

        {/* Footer */}
        <div style={{ padding: '28px 24px 12px', textAlign: 'center' }}>
          <div style={{
            fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.10em',
            color: 'rgba(242,239,232,0.28)', lineHeight: 2.0,
          }}>
            The rank is just a reflection of the journey.<br/>
            The real reward is who you become along the way.
          </div>
        </div>

      </div>
    </main>
  );
}
