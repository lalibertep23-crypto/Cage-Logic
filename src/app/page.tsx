// Landing screen — Cage Logic
// Full-bleed hero. Code wordmark over clean background image.
// Responsive: mobile portrait → tablet landscape at 768px.
// New design tokens. No motivational copy.

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { C } from '@/lib/design-tokens';

export default async function WelcomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isSignedIn = !!user;

  return (
    <>
      <style>{`
        .hero-bg {
          background-image: url('/hero-mobile-bg.png');
          background-size: cover;
          background-position: center center;
        }
        @media (min-width: 768px) {
          .hero-bg {
            background-image: url('/hero-tablet-bg.png');
            background-position: center 55%;
          }
          .wordmark-wrap {
            transform: none;
            margin-top: 32px;
          }
          .wordmark-cage {
            font-size: clamp(80px, 10vw, 120px) !important;
          }
          .wordmark-logic {
            font-size: clamp(80px, 10vw, 120px) !important;
          }
          .cta-wrap {
            max-width: 440px;
          }
          .tagline {
            margin-top: 16px !important;
          }
        }
      `}</style>

      <main style={{
        minHeight: '100vh',
        background: C.bg,
        color: C.text,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* ── Hero background ────────────────────────────────────────────── */}
        <div className="hero-bg" style={{
          position: 'fixed', inset: 0, zIndex: 0,
          filter: 'saturate(1.1) contrast(1.05) brightness(0.95)',
        }}/>

        {/* ── Top vignette — header legibility ──────────────────────────── */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 160, zIndex: 1,
          background: `linear-gradient(to bottom, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.55) 55%, transparent 100%)`,
          pointerEvents: 'none',
        }}/>

        {/* ── Bottom vignette — CTA legibility ──────────────────────────── */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: 300, zIndex: 1,
          background: `linear-gradient(to top, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.85) 40%, rgba(5,5,5,0.4) 70%, transparent 100%)`,
          pointerEvents: 'none',
        }}/>

        {/* ── Amber paint streak — top edge ─────────────────────────────── */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 10,
          background: `linear-gradient(90deg,
            transparent 0%,
            ${C.amber} 8%,
            ${C.amberLow} 18%,
            transparent 26%,
            ${C.amber} 44%,
            ${C.amberGlow} 52%,
            transparent 62%,
            ${C.amber} 80%,
            transparent 92%
          )`,
          opacity: 0.85,
          pointerEvents: 'none',
        }}/>

        {/* ── Content ───────────────────────────────────────────────────── */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          minHeight: '100vh',
          padding: '0 28px',
        }}>

          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 22,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 16, background: C.amber }}/>
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                letterSpacing: '0.22em', color: C.dim,
              }}>
                CAGE LOGIC · V1
              </span>
            </div>
            {isSignedIn ? (
              <Link href="/home" style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                letterSpacing: '0.18em', color: C.mid,
                textDecoration: 'none',
                borderBottom: `1px solid ${C.lineHard}`, paddingBottom: 1,
              }}>
                BACK IN →
              </Link>
            ) : (
              <Link href="/login" style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                letterSpacing: '0.18em', color: C.mid,
                textDecoration: 'none',
                borderBottom: `1px solid ${C.lineHard}`, paddingBottom: 1,
              }}>
                SIGN IN
              </Link>
            )}
          </div>

          {/* ── Wordmark ──────────────────────────────────────────────────── */}
          <div className="wordmark-wrap" style={{
            marginTop: 32,
            transform: 'rotate(-2deg)',
            transformOrigin: 'left center',
          }}>
            {/* CAGE — amber, stamped */}
            <div className="wordmark-cage" style={{
              fontFamily: 'var(--font-anton)',
              fontSize: 'clamp(72px, 21vw, 92px)',
              lineHeight: 0.85,
              letterSpacing: '0.02em',
              color: C.amber,
              WebkitTextStroke: `4px ${C.bg}`,
              paintOrder: 'stroke fill',
              textShadow: `
                2px 2px 0 #000,
                4px 4px 0 #000,
                7px 7px 0 rgba(0,0,0,0.65),
                0 0 48px rgba(255,182,39,0.35)
              `,
            }}>CAGE</div>

            {/* LOGIC — off-white, same stamp */}
            <div className="wordmark-logic" style={{
              fontFamily: 'var(--font-anton)',
              fontSize: 'clamp(72px, 21vw, 92px)',
              lineHeight: 0.85,
              letterSpacing: '0.02em',
              color: C.text,
              WebkitTextStroke: `4px ${C.bg}`,
              paintOrder: 'stroke fill',
              marginLeft: 'clamp(12px, 3.5vw, 22px)',
              textShadow: `
                2px 2px 0 rgba(200,148,58,0.5),
                4px 4px 0 #000,
                7px 7px 0 rgba(0,0,0,0.65)
              `,
            }}>LOGIC</div>
          </div>

          {/* Tagline */}
          <div className="tagline" style={{ marginTop: 10, paddingLeft: 4 }}>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10,
              letterSpacing: '0.3em',
              color: `rgba(200,148,58,0.7)`,
            }}>
              TRACK. SCORE. IMPROVE.
            </div>
          </div>

          {/* Push CTAs to bottom */}
          <div style={{ flex: 1 }}/>

          {/* ── CTAs ──────────────────────────────────────────────────────── */}
          <div className="cta-wrap" style={{
            paddingBottom: 62,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>

            {/* Primary */}
            <Link href={isSignedIn ? '/home' : '/signup'} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                background: 'rgba(5,5,5,0.72)',
                border: `1px solid ${C.amber}`,
                color: C.text,
                padding: '20px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backdropFilter: 'blur(8px)',
                boxShadow: `
                  0 0 28px rgba(255,182,39,0.22),
                  0 0 60px rgba(255,182,39,0.08),
                  inset 0 0 0 1px rgba(255,182,39,0.06)
                `,
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Top edge glow line */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg,
                    transparent 0%,
                    ${C.amberGlow} 30%,
                    ${C.amber} 60%,
                    transparent 100%
                  )`,
                  opacity: 0.9,
                }}/>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                    letterSpacing: '0.26em', color: C.amber,
                    marginBottom: 6,
                  }}>
                    {isSignedIn ? 'WELCOME BACK' : 'READY TO ROLL?'}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-anton)', fontSize: 30,
                    letterSpacing: '0.06em', lineHeight: 1,
                  }}>
                    {isSignedIn ? 'ENTER THE CAGE' : 'START TRAINING'}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-anton)', fontSize: 30,
                  color: C.amberGlow,
                  textShadow: `0 0 14px rgba(255,182,39,0.7)`,
                  flexShrink: 0,
                }}>→</div>
              </div>
            </Link>

            {/* Secondary — sign in only for new users */}
            {!isSignedIn && (
              <Link href="/login" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  background: 'transparent',
                  border: `1px solid ${C.lineHard}`,
                  color: C.dim,
                  padding: '14px 24px',
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textAlign: 'center',
                  backdropFilter: 'blur(4px)',
                }}>
                  ALREADY TRAINING · SIGN IN
                </div>
              </Link>
            )}

          </div>
        </div>
      </main>
    </>
  );
}
