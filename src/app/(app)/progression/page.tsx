// Progression — Multi-discipline hub. Screen 1.
// BJJ links to /progression/criteria. Muay Thai links to /progression/muay-thai.
// Wrestling / Boxing / MMA locked until V1.5.

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
    prajied_1: { name: 'PRAJIED LEVEL 1 • FOUNDATION', image: '/prajied-level1.png', next: 'PRAJIED LEVEL 2' },
    prajied_2: { name: 'PRAJIED LEVEL 2 • COMPOSURE',  image: '/prajied-level2.png', next: 'PRAJIED LEVEL 3' },
    prajied_3: { name: 'PRAJIED LEVEL 3 • PRESSURE',   image: '/prajied-level3.png', next: 'PRAJIED LEVEL 4' },
    prajied_4: { name: 'PRAJIED LEVEL 4 • CONTROL',    image: '/prajied-level4.png', next: 'PRAJIED LEVEL 5' },
    prajied_5: { name: 'PRAJIED LEVEL 5 • MASTERY',    image: '/prajied-level5.png', next: 'AT THE SUMMIT'   },
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

function fmtDate(s: string | null): string {
  if (!s) return '';
  try {
    const d  = new Date(s);
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return mm + '.' + dd + '.' + d.getUTCFullYear();
  } catch { return ''; }
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
         stroke="rgba(242,239,232,0.25)" strokeWidth="1.4" strokeLinecap="round">
      <rect x="3" y="8" width="10" height="7" rx="1"/>
      <path d="M5.5 8V6a2.5 2.5 0 015 0v2"/>
    </svg>
  );
}

function DisciplineCard({
  config, rankLine, nextLine, rightImage, hasData, isLocked, startDate,
}: {
  config:     DisciplineConfig;
  rankLine:   string;
  nextLine:   string;
  rightImage: string;
  hasData:    boolean;
  isLocked:   boolean;
  startDate:  string | null;
}) {
  const bgColor      = hasData ? '#0E0C08' : '#0A0806';
  const borderColor  = hasData ? config.accentColor : 'rgba(242,239,232,0.08)';
  const rankColor    = hasData ? config.accentColor : 'rgba(242,239,232,0.25)';
  const chevronClr   = hasData ? config.accentColor : 'rgba(242,239,232,0.18)';
  const nextAccent   = config.accentColor + '66';

  return (
    <div style={{
      position: 'relative', display: 'flex', alignItems: 'center',
      height: 90, overflow: 'hidden',
      background: bgColor,
      border: '1px solid rgba(255,255,255,0.06)',
      borderLeft: '3px solid ' + borderColor,
      opacity: hasData ? 1 : 0.45,
    }}>
      <div style={{
        width: 68, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 50, height: 50, position: 'relative' }}>
          <Image src={config.badge} alt={config.label} fill sizes="50px"
            style={{
              objectFit: 'contain',
              opacity: hasData ? 0.88 : 0.28,
              filter: hasData ? 'none' : 'grayscale(1)',
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, padding: '10px 6px 10px 0', minWidth: 0, overflow: 'hidden' }}>
        <div style={{
          fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.20em',
          color: 'rgba(242,239,232,0.38)', marginBottom: 3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {config.label}
        </div>
        <div style={{
          fontFamily: fonts.label, fontSize: 14, letterSpacing: '0.08em', lineHeight: 1.15,
          color: rankColor,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {rankLine}
        </div>
        {startDate && hasData && (
          <div style={{
            fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.10em',
            color: 'rgba(242,239,232,0.28)', marginTop: 3,
          }}>
            {'EARNED ' + fmtDate(startDate)}
          </div>
        )}
        <div style={{
          fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.08em',
          color: 'rgba(242,239,232,0.24)', marginTop: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          <span style={{ color: nextAccent }}>{'NEXT: '}</span>
          {nextLine}
        </div>
      </div>

      {hasData && rightImage && (
        <div style={{
          width: '28%', flexShrink: 0,
          position: 'relative', height: '100%', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: '65%',
            background: 'linear-gradient(to right, rgba(12,9,6,0.96), transparent)',
            zIndex: 1, pointerEvents: 'none',
          }}/>
          <Image src={rightImage} alt="" fill sizes="28vw"
            style={{
              objectFit: 'cover', objectPosition: 'center',
              opacity: isLocked ? 0.28 : 0.75,
              filter: isLocked ? 'grayscale(0.6) brightness(0.7)' : 'none',
            }}
          />
        </div>
      )}

      <div style={{
        width: 30, flexShrink: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isLocked && hasData ? (
          <LockIcon/>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1l4 4-4 4" stroke={chevronClr} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      {isLocked && hasData && (
        <div style={{
          position: 'absolute', top: 0, right: 0, padding: '3px 7px',
          background: 'rgba(242,239,232,0.07)',
          fontFamily: fonts.body, fontSize: 7, letterSpacing: '0.18em',
          color: 'rgba(242,239,232,0.30)',
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
    .select('discipline, rank_color, stripes, start_date')
    .eq('athlete_id', user.id);

  const disciplineMap: { [key: string]: { rank_color: string; stripes: number; start_date: string | null } } = {};
  if (rows) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      disciplineMap[row.discipline] = {
        rank_color: row.rank_color || '',
        stripes:    row.stripes    || 0,
        start_date: row.start_date || null,
      };
    }
  }

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 96, position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src="/bjj-background.png" alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,4,3,0.80)' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px 12px',
          borderBottom: '1px solid rgba(200,148,58,0.12)',
          background: 'rgba(5,4,3,0.65)',
          backdropFilter: 'blur(10px)',
        }}>
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(242,239,232,0.14)',
            }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="#F2EFE8" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
          </Link>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: fonts.header, fontSize: 22, letterSpacing: '0.08em',
              color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.90)',
            }}>PROGRESSION</div>
            <div style={{
              fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.24em',
              color: 'rgba(200,148,58,0.55)', marginTop: 2,
            }}>YOUR JOURNEY. EARN EVERYTHING.</div>
          </div>
          <Link href="/progression/new" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(242,239,232,0.14)',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                   stroke="rgba(242,239,232,0.55)" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="8" cy="8" r="6"/><path d="M8 5v6M5 8h6"/>
              </svg>
            </div>
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '14px 14px 0' }}>
          {DISCIPLINES.map((config) => {
            const data      = disciplineMap[config.key];
            const hasData   = !!(data && data.rank_color);
            const rankColor = data ? data.rank_color : '';
            const stripes   = data ? data.stripes : 0;
            const startDate = data ? data.start_date : null;
            const isLocked  = config.getHref(rankColor, stripes) === '#';
            const href      = hasData ? config.getHref(rankColor, stripes) : '#';
            const rankInfo  = hasData
              ? config.getRank(rankColor, stripes)
              : { rankLine: 'NOT ENROLLED', nextLine: 'ADD THIS DISCIPLINE', rightImage: '' };

            return (
              <Link key={config.key} href={href} style={{ textDecoration: 'none', display: 'block' }}>
                <DisciplineCard
                  config={config}
                  rankLine={rankInfo.rankLine}
                  nextLine={rankInfo.nextLine}
                  rightImage={rankInfo.rightImage}
                  hasData={hasData}
                  isLocked={isLocked}
                  startDate={startDate}
                />
              </Link>
            );
          })}
        </div>

        <div style={{ margin: '16px 14px 0' }}>
          <Link href="/progression/new" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '13px 16px',
              background: 'rgba(200,148,58,0.04)',
              border: '1px solid rgba(200,148,58,0.12)',
              borderLeft: '3px solid rgba(200,148,58,0.35)',
            }}>
              <div>
                <div style={{
                  fontFamily: fonts.label, fontSize: 13, letterSpacing: '0.14em', color: C.text,
                }}>LOG A PROMOTION</div>
                <div style={{
                  fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.10em',
                  color: C.dimmer, marginTop: 3,
                }}>STRIPE, BELT, OR OTHER RANK</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="#C8943A" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </Link>
        </div>

        <div style={{ padding: '28px 24px 12px', textAlign: 'center' }}>
          <div style={{
            fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.10em',
            color: 'rgba(242,239,232,0.20)', lineHeight: 2.0,
          }}>
            The rank is just a reflection of the journey.<br/>
            The real reward is who you become along the way.
          </div>
        </div>
      </div>
    </main>
  );
}
