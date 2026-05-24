// Progression — BJJ Belt Roadmap. Screen 1 of 3.
// Rebuilt to match mockup: bjj-background.png, belt cards, lock state, stripe progress.
// Data fetching preserved. Visual layer rebuilt to design-token spec.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { C, fonts } from '@/lib/design-tokens';

export const dynamic = 'force-dynamic';

const BELT_ORDER = ['white', 'blue', 'purple', 'brown', 'black'] as const;
type BeltKey = typeof BELT_ORDER[number];

type BeltStage = {
  key:         BeltKey;
  label:       string;
  accentColor: string;
  image:       string;
  maxStripes:  number;
};

const BELT_STAGES: BeltStage[] = [
  { key: 'white',  label: 'WHITE BELT',  accentColor: '#D8D2C8', image: '/white-belt.png',   maxStripes: 4 },
  { key: 'blue',   label: 'BLUE BELT',   accentColor: '#4A7FD4', image: '/blue-belt.png',    maxStripes: 4 },
  { key: 'purple', label: 'PURPLE BELT', accentColor: '#9B6FD0', image: '/purple-belt.png',  maxStripes: 4 },
  { key: 'brown',  label: 'BROWN BELT',  accentColor: '#A06535', image: '/brown-belt.png',   maxStripes: 4 },
  { key: 'black',  label: 'BLACK BELT',  accentColor: '#C8943A', image: '/first-degree.png', maxStripes: 4 },
];

const NEXT_BELT: Record<BeltKey, string> = {
  white:  'BLUE BELT',
  blue:   'PURPLE BELT',
  purple: 'BROWN BELT',
  brown:  'BLACK BELT',
  black:  'THE HIGHEST RANK',
};

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
         stroke="rgba(242,239,232,0.30)" strokeWidth="1.4" strokeLinecap="round">
      <rect x="3" y="8" width="10" height="7" rx="1"/>
      <path d="M5.5 8V6a2.5 2.5 0 015 0v2"/>
    </svg>
  );
}

function StripeDots({ earned, total, active }: { earned: number; total: number; active: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 7 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: i < earned
            ? (active ? '#C8943A' : 'rgba(242,239,232,0.50)')
            : 'rgba(242,239,232,0.12)',
          flexShrink: 0,
        }}/>
      ))}
      <span style={{
        fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.10em',
        color: active ? 'rgba(200,148,58,0.70)' : 'rgba(242,239,232,0.30)',
        marginLeft: 4,
      }}>
        {earned}/{total} STRIPES
      </span>
    </div>
  );
}

export default async function ProgressionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: disciplineRows } = await supabase
    .from('athlete_disciplines')
    .select('discipline, rank_color, stripes')
    .eq('athlete_id', user.id)
    .eq('discipline', 'bjj')
    .eq('is_primary', true)
    .limit(1);

  const discipline = disciplineRows?.[0];
  const rankColor  = ((discipline?.rank_color as string | null) ?? 'white') as BeltKey;
  const stripes    = (discipline?.stripes as number | null) ?? 0;
  const currentIdx = BELT_ORDER.indexOf(rankColor);

  return (
    <main style={{ minHeight: '100vh', color: C.text, paddingBottom: 96, position: 'relative' }}>

      {/* Full-screen BJJ background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src="/bjj-background.png" alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top',
        }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,4,3,0.74)' }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px 12px',
          borderBottom: '1px solid rgba(200,148,58,0.12)',
          background: 'rgba(5,4,3,0.60)',
          backdropFilter: 'blur(8px)',
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
              fontFamily: fonts.header, fontSize: 20, letterSpacing: '0.06em',
              color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.80)',
            }}>BJJ BELT ROADMAP</div>
            <div style={{
              fontFamily: fonts.label, fontSize: 10, letterSpacing: '0.22em',
              color: 'rgba(200,148,58,0.60)', marginTop: 2,
            }}>YOUR JOURNEY. EARN EVERYTHING.</div>
          </div>

          <Link href="/progression/new" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(242,239,232,0.14)',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                   stroke="rgba(242,239,232,0.60)" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="8" cy="8" r="6"/><path d="M8 5v6M5 8h6"/>
              </svg>
            </div>
          </Link>
        </div>

        {/* Belt cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '16px 14px 0' }}>
          {BELT_STAGES.map((stage, i) => {
            const isCurrent = i === currentIdx;
            const isPast    = i < currentIdx;
            const isFuture  = i > currentIdx;
            const cardStripes = isCurrent ? stripes : isPast ? stage.maxStripes : 0;

            const nextLabel = isCurrent
              ? stripes < stage.maxStripes
                ? `${stage.label} · STRIPE ${stripes + 1}`
                : NEXT_BELT[stage.key]
              : isPast ? 'COMPLETE'
              : `${stage.label} · STRIPE 1`;

            const fromRank = `${stage.key}_${isCurrent ? stripes : isFuture ? 0 : stage.maxStripes}`;

            return (
              <Link
                key={stage.key}
                href={isFuture ? '#' : `/progression/criteria?from=${fromRank}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div style={{
                  position: 'relative', display: 'flex', height: 88, overflow: 'hidden',
                  background: isCurrent
                    ? 'rgba(200,148,58,0.09)'
                    : isPast ? 'rgba(14,12,10,0.80)' : 'rgba(10,8,6,0.68)',
                  borderTop:    '1px solid rgba(200,148,58,0.10)',
                  borderRight:  '1px solid rgba(200,148,58,0.10)',
                  borderBottom: '1px solid rgba(200,148,58,0.10)',
                  borderLeft: isCurrent
                    ? '3px solid #C8943A'
                    : isPast ? '3px solid rgba(242,239,232,0.20)' : '3px solid rgba(242,239,232,0.06)',
                  boxShadow: isCurrent ? '0 0 20px rgba(200,148,58,0.12), inset 0 1px 0 rgba(200,148,58,0.14)' : 'none',
                  opacity: isFuture ? 0.52 : 1,
                }}>

                  {/* Lock / active dot */}
                  <div style={{
                    width: 36, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isFuture ? <LockIcon/> : (
                      <div style={{
                        width: isCurrent ? 8 : 6, height: isCurrent ? 8 : 6, borderRadius: '50%',
                        background: isCurrent ? '#C8943A' : 'rgba(242,239,232,0.35)',
                        boxShadow: isCurrent ? '0 0 8px rgba(200,148,58,0.80)' : 'none',
                      }}/>
                    )}
                  </div>

                  {/* Text */}
                  <div style={{
                    flex: 1, padding: '14px 8px 12px 0',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{
                        fontFamily: fonts.label, fontSize: 19, letterSpacing: '0.10em', lineHeight: 1,
                        color: isCurrent ? stage.accentColor : isPast ? 'rgba(242,239,232,0.60)' : 'rgba(242,239,232,0.38)',
                        textShadow: isCurrent ? `0 0 18px ${stage.accentColor}44` : 'none',
                      }}>{stage.label}</div>
                      <StripeDots earned={cardStripes} total={stage.maxStripes} active={isCurrent}/>
                    </div>
                    <div style={{
                      fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.08em',
                      color: isCurrent ? 'rgba(242,239,232,0.60)' : 'rgba(242,239,232,0.28)',
                    }}>
                      <span style={{ color: isCurrent ? 'rgba(200,148,58,0.55)' : 'inherit', marginRight: 4 }}>
                        {isPast ? 'STATUS' : 'NEXT'}:
                      </span>
                      {nextLabel}
                    </div>
                  </div>

                  {/* Belt image */}
                  <div style={{ width: '36%', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, bottom: 0, width: '52%',
                      background: isCurrent
                        ? 'linear-gradient(to right, rgba(12,7,3,0.88), transparent)'
                        : 'linear-gradient(to right, rgba(10,8,6,0.92), transparent)',
                      zIndex: 1, pointerEvents: 'none',
                    }}/>
                    <Image
                      src={stage.image}
                      alt={stage.label}
                      fill
                      sizes="36vw"
                      style={{
                        objectFit: 'cover', objectPosition: 'center center',
                        opacity: isCurrent ? 0.88 : isPast ? 0.42 : 0.16,
                        filter: isFuture ? 'saturate(0.5) brightness(0.8)' : 'none',
                      }}
                    />
                  </div>

                  {/* Chevron */}
                  <div style={{
                    width: 28, flexShrink: 0, zIndex: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M3 1l4 4-4 4"
                        stroke={isCurrent ? '#C8943A' : 'rgba(242,239,232,0.25)'}
                        strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </div>

                  {/* CURRENT badge */}
                  {isCurrent && (
                    <div style={{
                      position: 'absolute', top: 0, right: 0, padding: '3px 8px',
                      background: '#C8943A',
                      fontFamily: fonts.body, fontSize: 8, letterSpacing: '0.16em', color: '#050505',
                      zIndex: 3,
                    }}>CURRENT</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Log promotion */}
        <div style={{ margin: '20px 14px 0' }}>
          <Link href="/progression/new" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px',
              background: 'rgba(200,148,58,0.05)',
              border: '1px solid rgba(200,148,58,0.14)',
              borderLeft: '3px solid rgba(200,148,58,0.40)',
            }}>
              <div>
                <div style={{ fontFamily: fonts.label, fontSize: 15, letterSpacing: '0.14em', color: C.text }}>
                  LOG A PROMOTION
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.10em', color: C.dimmer, marginTop: 3 }}>
                  STRIPE, BELT, OR OTHER RANK
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="#C8943A" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div style={{ padding: '32px 24px 16px', textAlign: 'center' }}>
          <div style={{
            fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.10em',
            color: 'rgba(242,239,232,0.25)', lineHeight: 2.0,
          }}>
            The belt is just a reflection of the journey.<br/>
            The real reward is who you become along the way.
          </div>
        </div>

      </div>
    </main>
  );
}
