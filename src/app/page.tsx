// Landing screen — Cage Logic
// Phone frame (430px) — matches (app) layout behavior on desktop.
// position:absolute backgrounds stay inside the frame.
// Big dominant wordmark. Amber glow CTA.

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { C } from '@/lib/design-tokens';

export default async function WelcomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isSignedIn = !!user;

  return (
    // Outer — fills viewport, centers the phone frame
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
    }}>
      {/* Phone frame — 430px, self-contained */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 430,
        minHeight: '100vh',
        overflow: 'hidden',
        background: C.bg,
        borderLeft:  `1px solid rgba(200,148,58,0.2)`,
        borderRight: `1px solid rgba(200,148,58,0.2)`,
        boxShadow: '-8px 0 40px rgba(0,0,0,0.6), 8px 0 40px rgba(0,0,0,0.6)',
      }}>

        {/* ── Hero background — absolute, stays in frame ──────────────── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url('/hero-mobile-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 82%',
          filter: 'saturate(1.1) contrast(1.05) brightness(0.9)',
        }}/>

        {/* ── Top vignette — header legibility ────────────────────────── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 200, zIndex: 1,
          background: `linear-gradient(to bottom, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.6) 60%, transparent 100%)`,
          pointerEvents: 'none',
        }}/>

        {/* ── Bottom vignette — CTA legibility ────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 320, zIndex: 1,
          background: `linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.9) 35%, rgba(5,5,5,0.5) 65%, transparent 100%)`,
          pointerEvents: 'none',
        }}/>

        {/* ── Amber paint streak — top edge ───────────────────────────── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 10,
          background: `linear-gradient(90deg,
            transparent 0%,
            ${C.amber} 8%,
            ${C.amberLow} 20%,
            transparent 28%,
            ${C.amber} 46%,
            ${C.amberGlow} 54%,
            transparent 64%,
            ${C.amber} 82%,
            transparent 95%
          )`,
          opacity: 0.9,
          pointerEvents: 'none',
        }}/>

        {/* ── Content layer ────────────────────────────────────────────── */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          minHeight: '100vh',
          padding: '0 28px',
        }}>

          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 24,
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

          {/* ── Wordmark — centered, matches reference ──────────────────── */}
          <div style={{ marginTop: 64, textAlign: 'center' }}>
            {/* CAGE — amber */}
            <div style={{
              fontFamily: 'var(--font-anton)',
              fontSize: 88,
              lineHeight: 0.88,
              letterSpacing: '0.01em',
              color: C.amber,
              WebkitTextStroke: `4px ${C.bg}`,
              paintOrder: 'stroke fill',
              textShadow: `
                3px 3px 0 #000,
                6px 6px 0 #000,
                9px 9px 0 rgba(0,0,0,0.7),
                0 0 50px rgba(255,182,39,0.35)
              `,
            }}>CAGE</div>

            {/* LOGIC — off-white */}
            <div style={{
              fontFamily: 'var(--font-anton)',
              fontSize: 88,
              lineHeight: 0.88,
              letterSpacing: '0.01em',
              color: C.text,
              WebkitTextStroke: `4px ${C.bg}`,
              paintOrder: 'stroke fill',
              textShadow: `
                3px 3px 0 rgba(200,148,58,0.6),
                6px 6px 0 #000,
                9px 9px 0 rgba(0,0,0,0.7)
              `,
            }}>LOGIC</div>

            {/* Tagline — centered under wordmark, clear of cage */}
            <div style={{
              marginTop: 12,
              fontFamily: 'var(--font-dm-mono)', fontSize: 10,
              letterSpacing: '0.28em', color: C.mid,
            }}>
              TRACK. SCORE. IMPROVE.
            </div>
          </div>

          {/* Push CTAs to bottom */}
          <div style={{ flex: 1 }}/>

          {/* ── CTAs ────────────────────────────────────────────────────── */}
          <div style={{
            paddingBottom: 64,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>

            {/* Primary */}
            <Link href={isSignedIn ? '/home' : '/signup'} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                background: 'rgba(5,5,5,0.75)',
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
                {/* LED top edge */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg,
                    transparent 0%,
                    ${C.amberGlow} 30%,
                    ${C.amber} 65%,
                    transparent 100%
                  )`,
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
                  fontFamily: 'var(--font-anton)', fontSize: 32,
                  color: C.amberGlow,
                  textShadow: `0 0 16px rgba(255,182,39,0.7)`,
                  flexShrink: 0,
                }}>→</div>
              </div>
            </Link>

            {/* Secondary */}
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
                }}>
                  ALREADY TRAINING · SIGN IN
                </div>
              </Link>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
