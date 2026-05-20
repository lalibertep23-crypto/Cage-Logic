// Landing screen — Rio fight club. Graffiti wall. Text over image. No boxes.

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function WelcomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isSignedIn = !!user;

  return (
    <main style={{
      minHeight: '100vh',
      background: '#1A1713',
      color: '#F5F0E8',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Hero image — portrait-composed, brain centered, graffiti wall */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'url(/hero-mobile.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        opacity: 1.0,
        filter: 'saturate(1.3) contrast(1.1) brightness(1.15)',
      }}/>

      {/* ── Dark vignette — bottom fades to dark, top stays open ─────────── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(15,13,11,0.05) 0%, rgba(15,13,11,0.25) 45%, rgba(15,13,11,0.82) 70%, #1A1713 100%)',
      }}/>

      {/* ── Paint streak top ─────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 10,
        background: 'linear-gradient(90deg, transparent 0%, #D4922E 10%, #7A4F1A 22%, transparent 28%, #D4922E 40%, transparent 50%, #3D8B55 70%, transparent 78%, #D4922E 92%, transparent 100%)',
        opacity: 0.8, pointerEvents: 'none',
      }}/>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '0 28px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 16, background: '#D4922E' }}/>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.22em', color: 'rgba(245,240,232,0.4)' }}>
              CAGE LOGIC · V1
            </span>
          </div>
          {isSignedIn ? (
            <Link href="/home" style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9,
              letterSpacing: '0.18em', color: 'rgba(245,240,232,0.5)', textDecoration: 'none',
              borderBottom: '1px solid rgba(245,240,232,0.2)', paddingBottom: 1,
            }}>
              BACK IN →
            </Link>
          ) : (
            <Link href="/login" style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9,
              letterSpacing: '0.18em', color: 'rgba(245,240,232,0.5)', textDecoration: 'none',
              borderBottom: '1px solid rgba(245,240,232,0.2)', paddingBottom: 1,
            }}>
              SIGN IN
            </Link>
          )}
        </div>

        {/* Graffiti wordmark */}
        <div style={{ marginTop: 28, transform: 'rotate(-2deg)', transformOrigin: 'left center' }}>
          <div style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(64px, 21vw, 88px)',
            lineHeight: 0.85,
            letterSpacing: '0.02em',
            color: '#D4922E',
            WebkitTextStroke: '4px #13110E',
            paintOrder: 'stroke fill',
            textShadow: `2px 2px 0 #000, 4px 4px 0 #000, 6px 6px 0 #000, 8px 8px 0 rgba(0,0,0,0.55), 10px 10px 18px rgba(0,0,0,0.35)`,
          }}>CAGE</div>
          <div style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(64px, 21vw, 88px)',
            lineHeight: 0.85,
            letterSpacing: '0.02em',
            color: '#F0E8D8',
            WebkitTextStroke: '4px #13110E',
            paintOrder: 'stroke fill',
            marginLeft: 'clamp(10px, 3vw, 20px)',
            textShadow: `2px 2px 0 #7A4F1A, 4px 4px 0 #7A4F1A, 6px 6px 0 #000, 8px 8px 0 rgba(0,0,0,0.55), 10px 10px 18px rgba(0,0,0,0.35)`,
          }}>LOGIC</div>
        </div>

        {/* Tagline */}
        <div style={{ marginTop: 8, paddingLeft: 2 }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.28em', color: 'rgba(201,130,42,0.65)' }}>
            LOG. SCORE. IMPROVE.
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }}/>

        {/* ── CTAs ─────────────────────────────────────────────────────────── */}
        <div style={{ paddingBottom: 56, display: 'flex', flexDirection: 'column', gap: 12 }}>

          <Link href={isSignedIn ? '/home' : '/signup'} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
              background: 'rgba(15,13,11,0.5)',
              border: '1px solid rgba(201,130,42,0.6)',
              color: '#F5F0E8',
              padding: '16px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backdropFilter: 'blur(4px)',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.22em', color: 'rgba(201,130,42,0.8)', marginBottom: 4 }}>
                  {isSignedIn ? 'WELCOME BACK' : 'READY TO ROLL?'}
                </div>
                <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.06em' }}>
                  {isSignedIn ? 'GO TO HOME' : 'GET STARTED'}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 16, color: '#D4922E' }}>→</span>
            </div>
          </Link>

          {!isSignedIn && (
            <Link href="/login" style={{
              textDecoration: 'none',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 10,
              letterSpacing: '0.2em',
              color: 'rgba(245,240,232,0.35)',
              padding: '8px 0',
              display: 'block',
            }}>
              ALREADY HAVE AN ACCOUNT →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
