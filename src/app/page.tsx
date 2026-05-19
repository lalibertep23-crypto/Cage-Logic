// Landing screen — Rio fight club. Graffiti wall. Text over image. No boxes.

import Link from 'next/link';

export default function WelcomePage() {
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

      {/* ── Hero image — full bleed, boosted saturation to pop graffiti colors */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'url(/cage-logic-hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        opacity: 0.75,
        filter: 'saturate(1.6) contrast(1.05)',
      }}/>

      {/* ── Dark vignette — bottom fades to dark, top stays open ─────────── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(15,13,11,0.1) 0%, rgba(15,13,11,0.3) 45%, rgba(15,13,11,0.88) 70%, #1A1713 100%)',
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
          <Link href="/login" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 9,
            letterSpacing: '0.18em', color: 'rgba(245,240,232,0.5)', textDecoration: 'none',
            borderBottom: '1px solid rgba(245,240,232,0.2)', paddingBottom: 1,
          }}>
            SIGN IN
          </Link>
        </div>

        {/* Graffiti wordmark — CSS text treatment, Anton + outline + 3D step shadow */}
        <div style={{ marginTop: 28, marginLeft: -4, transform: 'rotate(-2deg)', transformOrigin: 'left center' }}>
          {/* CAGE — amber fill */}
          <div style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 88,
            lineHeight: 0.85,
            letterSpacing: '0.02em',
            color: '#D4922E',
            WebkitTextStroke: '6px #13110E',
            paintOrder: 'stroke fill',
            textShadow: `
              2px 2px 0 #000,
              4px 4px 0 #000,
              6px 6px 0 #000,
              8px 8px 0 rgba(0,0,0,0.55),
              10px 10px 18px rgba(0,0,0,0.35)
            `,
          }}>CAGE</div>
          {/* LOGIC — cream fill, offset right */}
          <div style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 88,
            lineHeight: 0.85,
            letterSpacing: '0.02em',
            color: '#F0E8D8',
            WebkitTextStroke: '6px #13110E',
            paintOrder: 'stroke fill',
            marginLeft: 20,
            textShadow: `
              2px 2px 0 #7A4F1A,
              4px 4px 0 #7A4F1A,
              6px 6px 0 #000,
              8px 8px 0 rgba(0,0,0,0.55),
              10px 10px 18px rgba(0,0,0,0.35)
            `,
          }}>LOGIC</div>
        </div>

        {/* Tagline below the wordmark */}
        <div style={{ marginTop: 8, paddingLeft: 2 }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.28em', color: 'rgba(201,130,42,0.65)' }}>
            COMBAT SPORTS TRAINING OS
          </div>
        </div>

        {/* Spacer — image shows through the middle */}
        <div style={{ flex: 1 }}/>

        {/* ── CTAs — no boxes, just text links + one amber bar ─────────── */}
        <div style={{ paddingBottom: 56, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Primary — ghost outline, not solid amber */}
          <Link href="/signup" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
              background: 'rgba(15,13,11,0.5)',
              border: '1px solid rgba(201,130,42,0.6)',
              color: '#F5F0E8',
              padding: '16px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backdropFilter: 'blur(4px)',
            }}>
              <span style={{ fontFamily: 'var(--font-anton)', fontSize: 22, letterSpacing: '0.06em' }}>
                GET STARTED
              </span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 16, color: '#D4922E' }}>→</span>
            </div>
          </Link>

          {/* Secondary — plain text */}
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
        </div>
      </div>
    </main>
  );
}
