// Muay Thai Roadmap — Screen 1 of Muay Thai progression.
// Shows all 5 Prajied levels. Current level is user's rank from athlete_disciplines.
// Links to /progression/muay-thai/[level] for criteria detail.
// Built to cinematic tactical OS spec: hero moment = prajied rope, material lighting, brass accents.

import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { C, fonts } from '@/lib/design-tokens';

export const dynamic = 'force-dynamic';

// ─── Prajied level config ────────────────────────────────────────────────────

type PrajiedLevel = {
  key:         string; // e.g. 'prajied_1'
  levelNum:    number;
  name:        string;
  theme:       string;
  description: string;
  image:       string;
};

const PRAJIED_LEVELS: PrajiedLevel[] = [
  {
    key: 'prajied_1', levelNum: 1, name: 'PRAJIED LEVEL 1', theme: 'FOUNDATION',
    description: 'Building the base.\nDiscipline, basics, and belief.',
    image: '/prajied-level1.png',
  },
  {
    key: 'prajied_2', levelNum: 2, name: 'PRAJIED LEVEL 2', theme: 'COMPOSURE',
    description: 'Control your mind.\nMaster the basics under pressure.',
    image: '/prajied-level2.png',
  },
  {
    key: 'prajied_3', levelNum: 3, name: 'PRAJIED LEVEL 3', theme: 'PRESSURE',
    description: 'Apply intent.\nBreak their will, not your form.',
    image: '/prajied-level3.png',
  },
  {
    key: 'prajied_4', levelNum: 4, name: 'PRAJIED LEVEL 4', theme: 'CONTROL',
    description: 'Dictate the pace.\nOwn every exchange.',
    image: '/prajied-level4.png',
  },
  {
    key: 'prajied_5', levelNum: 5, name: 'PRAJIED LEVEL 5', theme: 'MASTERY',
    description: 'Flow becomes instinct.\nYou become the weapon.',
    image: '/prajied-level5.png',
  },
];

// Parse rank_color → level number
function rankToLevelNum(rankColor: string): number {
  const match = rankColor?.match(/prajied_(\d)/);
  return match ? parseInt(match[1], 10) : 0;
}

// ─── Components ──────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="#C8943A" strokeWidth="1.4"/>
      <path d="M6 10l3 3 5-5" stroke="#C8943A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ActiveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="#C8943A" strokeWidth="1.4"/>
      <path d="M8 7l5 3-5 3V7z" fill="#C8943A"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none"
         stroke="rgba(242,239,232,0.25)" strokeWidth="1.4" strokeLinecap="round">
      <rect x="4" y="10" width="12" height="8" rx="1.5"/>
      <path d="M7 10V8a3 3 0 016 0v2"/>
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MuayThaiRoadmapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: rows } = await supabase
    .from('athlete_disciplines')
    .select('rank_color, stripes, start_date')
    .eq('athlete_id', user.id)
    .eq('discipline', 'muay_thai')
    .limit(1);

  const data        = rows?.[0];
  const rankColor   = data?.rank_color ?? 'prajied_1';
  const currentLevel = rankToLevelNum(rankColor);

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 96, position: 'relative' }}>

      {/* Background — concrete dark with warm overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img
          src="/concrete-dark.jpg"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,3,2,0.82)' }}/>
        {/* Warm top light */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(200,120,40,0.08) 0%, transparent 70%)',
        }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px 12px',
          borderBottom: '1px solid rgba(194,59,34,0.15)',
          background: 'rgba(5,3,2,0.70)',
          backdropFilter: 'blur(10px)',
        }}>
          <Link href="/progression" style={{ textDecoration: 'none' }}>
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
              fontFamily: fonts.header, fontSize: 20, letterSpacing: '0.08em',
              color: '#fff', textShadow: '0 2px 14px rgba(0,0,0,0.90)',
            }}>
              MUAY THAI ROADMAP
            </div>
          </div>

          {/* Placeholder right icon */}
          <div style={{ width: 32, height: 32 }}/>
        </div>

        {/* ── Hero section ── */}
        <div style={{
          display: 'flex', alignItems: 'stretch',
          minHeight: 160,
          borderBottom: '1px solid rgba(194,59,34,0.12)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Left — title block */}
          <div style={{
            flex: 1, padding: '24px 16px 24px 20px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            background: 'linear-gradient(to right, rgba(8,5,3,0.95), rgba(8,5,3,0.60))',
            zIndex: 1,
          }}>
            {/* Muay Thai icon */}
            <div style={{ width: 28, height: 28, position: 'relative', marginBottom: 10 }}>
              <Image
                src="/muay-thai-navigation-badge.png"
                alt="Muay Thai"
                fill
                sizes="28px"
                style={{ objectFit: 'contain', opacity: 0.70 }}
              />
            </div>
            <div style={{
              fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.24em',
              color: '#C23B22', marginBottom: 6,
            }}>
              DISCIPLINE PROGRESSION
            </div>
            <div style={{
              fontFamily: fonts.header, fontSize: 32, letterSpacing: '0.04em', lineHeight: 0.95,
              color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.95)',
              marginBottom: 10,
            }}>
              MUAY{'\n'}THAI
            </div>
            <div style={{
              fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.06em', lineHeight: 1.7,
              color: 'rgba(242,239,232,0.50)',
            }}>
              The art of eight limbs.{'\n'}
              Precision, composure,{'\n'}
              and devastating efficiency.
            </div>
          </div>

          {/* Right — hero prajied image */}
          <div style={{ width: '42%', flexShrink: 0, position: 'relative' }}>
            {/* Left fade */}
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: '55%',
              background: 'linear-gradient(to right, rgba(8,5,3,0.90), transparent)',
              zIndex: 1, pointerEvents: 'none',
            }}/>
            <Image
              src="/prajied-level5.png"
              alt="Prajied armband"
              fill
              sizes="42vw"
              style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.70 }}
            />
            {/* Bottom fade */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
              background: 'linear-gradient(to top, rgba(8,5,3,0.80), transparent)',
              zIndex: 1, pointerEvents: 'none',
            }}/>
          </div>
        </div>

        {/* ── Level cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '14px 14px 0' }}>
          {PRAJIED_LEVELS.map((level) => {
            const isPast    = level.levelNum < currentLevel;
            const isCurrent = level.levelNum === currentLevel;
            const isFuture  = level.levelNum > currentLevel;

            const href = isFuture
              ? '#'
              : `/progression/muay-thai/${level.levelNum}`;

            return (
              <Link key={level.key} href={href} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center',
                  height: 96, overflow: 'hidden',
                  background: isCurrent
                    ? 'rgba(194,59,34,0.08)'
                    : isPast ? 'rgba(14,10,8,0.85)' : 'rgba(10,7,5,0.65)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderLeft: `3px solid ${
                    isCurrent ? '#C23B22' :
                    isPast    ? 'rgba(200,148,58,0.30)' :
                                'rgba(242,239,232,0.06)'
                  }`,
                  boxShadow: isCurrent
                    ? '0 0 20px rgba(194,59,34,0.10), inset 0 1px 0 rgba(194,59,34,0.08)'
                    : 'none',
                  opacity: isFuture ? 0.55 : 1,
                }}>

                  {/* Prajied image */}
                  <div style={{
                    width: 72, flexShrink: 0,
                    position: 'relative', height: '100%', overflow: 'hidden',
                  }}>
                    {/* Right fade */}
                    <div style={{
                      position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%',
                      background: 'linear-gradient(to left, rgba(10,7,5,0.95), transparent)',
                      zIndex: 1, pointerEvents: 'none',
                    }}/>
                    <Image
                      src={level.image}
                      alt={level.name}
                      fill
                      sizes="72px"
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        opacity: isCurrent ? 0.85 : isPast ? 0.45 : 0.20,
                        filter: isFuture ? 'grayscale(0.6) brightness(0.7)' : 'none',
                      }}
                    />
                  </div>

                  {/* Text block */}
                  <div style={{ flex: 1, padding: '12px 8px 12px 10px', minWidth: 0 }}>
                    <div style={{
                      fontFamily: fonts.label, fontSize: 9, letterSpacing: '0.22em',
                      color: isCurrent ? 'rgba(194,59,34,0.80)' : 'rgba(242,239,232,0.30)',
                      marginBottom: 3,
                    }}>
                      LEVEL {level.levelNum}
                    </div>
                    <div style={{
                      fontFamily: fonts.label, fontSize: 16, letterSpacing: '0.08em', lineHeight: 1.1,
                      color: isCurrent ? '#F2EFE8' : isPast ? 'rgba(242,239,232,0.65)' : 'rgba(242,239,232,0.35)',
                      marginBottom: 2,
                    }}>
                      {level.name}
                    </div>
                    <div style={{
                      fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.14em',
                      color: isCurrent ? '#C23B22' : isPast ? 'rgba(200,148,58,0.45)' : 'rgba(242,239,232,0.22)',
                      marginBottom: 4,
                    }}>
                      {level.theme}
                    </div>
                    {(isCurrent || isPast) && (
                      <div style={{
                        fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.05em', lineHeight: 1.6,
                        color: 'rgba(242,239,232,0.35)',
                      }}>
                        {level.description.replace('\n', ' ')}
                      </div>
                    )}
                  </div>

                  {/* State icon + chevron */}
                  <div style={{
                    width: 48, flexShrink: 0, zIndex: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    {isFuture ? <LockIcon/> : isPast ? <CheckIcon/> : <ActiveIcon/>}
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M3 1l4 4-4 4"
                        stroke={isCurrent ? '#C23B22' : isPast ? 'rgba(200,148,58,0.40)' : 'rgba(242,239,232,0.18)'}
                        strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div style={{
          margin: '24px 14px 0',
          padding: '16px 18px',
          background: 'rgba(12,8,5,0.60)',
          border: '1px solid rgba(194,59,34,0.10)',
          borderLeft: '3px solid rgba(194,59,34,0.30)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ width: 32, height: 32, flexShrink: 0, position: 'relative' }}>
            <Image src="/spartan-badge.png" alt="" fill sizes="32px" style={{ objectFit: 'contain', opacity: 0.55 }}/>
          </div>
          <div>
            <div style={{
              fontFamily: fonts.label, fontSize: 11, letterSpacing: '0.16em',
              color: 'rgba(200,148,58,0.65)', marginBottom: 3,
            }}>THE JOURNEY NEVER ENDS</div>
            <div style={{
              fontFamily: fonts.body, fontSize: 9, letterSpacing: '0.08em',
              color: 'rgba(242,239,232,0.30)',
            }}>Mastery is not a destination. It&apos;s a way of life.</div>
          </div>
        </div>

      </div>
    </main>
  );
}
